-- A-040 M-3: the deletion purge worker deletes exactly the A-039 purge candidates, and nothing else.
-- FRESH disposable container with migrations 0001-0007. Synthetic data only.
-- Every purge is checked against whole-database snapshots (what was deleted, added, changed) and an
-- orphan oracle written independently of the worker (driven by information_schema column names).
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

create temp table s (ta uuid, tb uuid, ta2 uuid, d1 uuid, d2 uuid, d3 uuid, db1 uuid, da2 uuid,
  doc1 uuid, doc2 uuid, doc3 uuid, doc4 uuid, doc5 uuid, doc6 uuid, docb uuid,
  v1 uuid, v2 uuid, v3 uuid, v5 uuid, v6 uuid, vb uuid, loc1 uuid, loc6 uuid,
  up_a uuid, up_b uuid, up_x uuid, up_d2 uuid, up5 uuid, up6 uuid, upb uuid, x1 uuid, x2 uuid,
  e1 uuid, ei1 uuid, e_in uuid, e2 uuid, e5 uuid, eb uuid,
  r1 uuid, r3 uuid, rb uuid, ra2 uuid, ru uuid, r5 uuid, r6 uuid, r7 uuid, doc7 uuid, doc8 uuid, v7 uuid, v8 uuid, up7 uuid,
  rf_tenant uuid, rf_owner uuid, rf_dispute uuid);
insert into s default values;
grant all on s to public;
create temp table en (req text, table_name text, record_id text, classification text, reason text);
grant all on en to public;
create temp table res (label text, outcome text, request_state text, purged bigint, retained bigint);
grant all on res to public;
create temp table flags (k text, v text);
grant all on flags to public;
create temp table snaps (label text, tn text, rid text, h text);

-- ---------------------------------------------------------------- fixture: users, tenants, disputes
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update s set ta = nyayos.sign_up_personal_tenant('Synthetic A', 'en');
update s set d1 = nyayos.create_dispute((select ta from s), 'Synthetic D1');
update s set d2 = nyayos.create_dispute((select ta from s), 'Synthetic D2');
update s set d3 = nyayos.create_dispute((select ta from s), 'Synthetic D3');
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'b1b1b1b1-0000-4000-8000-000000000001';
update s set tb = nyayos.sign_up_personal_tenant('Synthetic B', 'en');
update s set db1 = nyayos.create_dispute((select tb from s), 'Synthetic B1');
reset role;
-- user E: member of tenant TA and editor of D2 only (cross-dispute probe)
insert into nyayos.tenant_memberships (tenant_id, user_id, tenant_role, status) values ((select ta from s), 'e1e1e1e1-0000-4000-8000-000000000001', 'member', 'active');
insert into nyayos.dispute_roles (dispute_id, user_id, dispute_role) values ((select d2 from s), 'e1e1e1e1-0000-4000-8000-000000000001', 'dispute_editor');

-- ---------------------------------------------------------------- fixture: documents, uploads, jobs, exports (as the promote/export services would)
do $$
declare v_ta uuid := (select ta from s); v_tb uuid := (select tb from s); v_d1 uuid := (select d1 from s); v_d2 uuid := (select d2 from s);
  v_d3 uuid := (select d3 from s); v_db1 uuid := (select db1 from s);
  v_a uuid := 'a1a1a1a1-0000-4000-8000-000000000001'; v_b uuid := 'b1b1b1b1-0000-4000-8000-000000000001';
  v_doc1 uuid; v_doc2 uuid; v_doc3 uuid; v_doc4 uuid; v_doc5 uuid; v_doc6 uuid; v_docb uuid;
  v_v1 uuid; v_v2 uuid; v_v3 uuid; v_v5 uuid; v_v6 uuid; v_vb uuid; v_loc1 uuid; v_loc6 uuid;
  v_up_a uuid; v_up_b uuid; v_up_x uuid; v_up_d2 uuid; v_up5 uuid; v_up6 uuid; v_upb uuid; v_x1 uuid; v_x2 uuid;
  v_doc7 uuid; v_doc8 uuid; v_v7 uuid; v_v8 uuid; v_up7 uuid;
begin
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d1, 'Synthetic invoice') returning id into v_doc1;
  insert into nyayos.documents (tenant_id, dispute_id, display_label, current_version) values (v_ta, v_d1, 'Synthetic invoice copy', 1) returning id into v_doc2;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d1, 'Synthetic shared letter') returning id into v_doc3;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d2, 'Synthetic D2 doc') returning id into v_doc4;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d3, 'Synthetic referenced receipt') returning id into v_doc5;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d3, 'Synthetic unreferenced photo') returning id into v_doc6;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_tb, v_db1, 'Synthetic B document') returning id into v_docb;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc1, 1, repeat('a', 64), 10, 'application/pdf', 'synthetic1.pdf', v_a, 'clean', 'p/1') returning id into v_v1;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc1, 2, repeat('b', 64), 10, 'application/pdf', 'synthetic1b.pdf', v_a, 'clean', 'p/2') returning id into v_v2;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc2, 1, repeat('a', 64), 10, 'application/pdf', 'synthetic1-copy.pdf', v_a, 'clean', 'p/3');
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc3, 1, repeat('c', 64), 10, 'application/pdf', 'synthetic3.pdf', v_a, 'clean', 'p/4') returning id into v_v3;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc4, 1, repeat('e', 64), 10, 'application/pdf', 'synthetic4.pdf', v_a, 'clean', 'p/5');
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc5, 1, repeat('5', 64), 10, 'application/pdf', 'synthetic5.pdf', v_a, 'clean', 'p/6') returning id into v_v5;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc6, 1, repeat('6', 64), 10, 'image/jpeg', 'synthetic6.jpg', v_a, 'clean', 'p/7') returning id into v_v6;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_docb, 1, repeat('9', 64), 10, 'application/pdf', 'syntheticb.pdf', v_b, 'clean', 'p/8') returning id into v_vb;
  insert into nyayos.document_locations (document_version_id, page_number, created_by) values (v_v1, 2, v_a) returning id into v_loc1;
  insert into nyayos.document_locations (document_version_id, page_number, created_by) values (v_v6, 1, v_a) returning id into v_loc6;
  insert into nyayos.annotations (document_version_id, location_id, text, created_by) values (v_v1, v_loc1, 'Synthetic note', v_a), (v_v6, v_loc6, 'Synthetic photo note', v_a);
  insert into nyayos.custody_events (document_id, version, event, actor) values (v_doc1, 1, 'ingested', v_a), (v_doc1, 1, 'promoted', 'promote_worker'),
    (v_doc3, 1, 'ingested', v_a), (v_doc5, 1, 'ingested', v_a), (v_doc6, 1, 'ingested', v_a), (v_docb, 1, 'ingested', v_b);
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d1, v_a, 'application/pdf', repeat('a', 64), 'promoted') returning id into v_up_a;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d1, v_a, 'application/pdf', repeat('b', 64), 'promoted') returning id into v_up_b;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state)
    values (v_ta, v_d1, 'c1c1c1c1-0000-4000-8000-000000000001', 'application/pdf', repeat('f', 64), 'quarantined') returning id into v_up_x;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d2, v_a, 'application/pdf', repeat('e', 64), 'promoted') returning id into v_up_d2;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d3, v_a, 'application/pdf', repeat('5', 64), 'promoted') returning id into v_up5;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d3, v_a, 'image/jpeg', repeat('6', 64), 'promoted') returning id into v_up6;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_tb, v_db1, v_b, 'application/pdf', repeat('9', 64), 'promoted') returning id into v_upb;
  insert into nyayos.jobs (tenant_id, type, payload_ref) values (v_ta, 'scan', v_up_a), (v_ta, 'scan', v_up_b), (v_ta, 'scan', v_up_x), (v_ta, 'scan', v_up_d2),
    (v_ta, 'scan', v_up5), (v_ta, 'scan', v_up6), (v_tb, 'scan', v_upb);
  insert into nyayos.jobs (tenant_id, type, payload_ref) values (v_tb, 'scan', v_up_x);   -- foreign-tenant job pointing at a D1 upload
  insert into nyayos.exports (tenant_id, dispute_id, version, included_sections, generated_by, manifest_sha256, storage_path)
    values (v_ta, v_d1, 1, array['manifest'], v_a, repeat('1', 64), 'x/1') returning id into v_x1;
  insert into nyayos.export_manifests (export_id, entries) values (v_x1, jsonb_build_object('disputeId', v_d1, 'items', '[]'::jsonb,
    'documents', jsonb_build_array(jsonb_build_object('documentId', v_doc1, 'version', 2))));
  insert into nyayos.exports (tenant_id, dispute_id, version, included_sections, generated_by, manifest_sha256, storage_path)
    values (v_ta, v_d2, 1, array['manifest'], v_a, repeat('2', 64), 'x/2') returning id into v_x2;
  insert into nyayos.export_manifests (export_id, entries) values (v_x2, jsonb_build_object('disputeId', v_d2, 'items', '[]'::jsonb,
    'documents', jsonb_build_array(jsonb_build_object('documentId', v_doc3, 'version', 1))));   -- D2 export includes a D1 document
  -- doc7 and doc8 hold the same bytes; the upload of those bytes is ambiguous (A-039 blocks it)
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d3, 'Synthetic scan') returning id into v_doc7;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d3, 'Synthetic scan duplicate') returning id into v_doc8;
  update s set doc7 = v_doc7, doc8 = v_doc8;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc7, 1, repeat('7', 64), 10, 'application/pdf', 'synthetic7.pdf', v_a, 'clean', 'p/9') returning id into v_v7;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc8, 1, repeat('7', 64), 10, 'application/pdf', 'synthetic7-copy.pdf', v_a, 'clean', 'p/10') returning id into v_v8;
  update s set v7 = v_v7, v8 = v_v8;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d3, v_a, 'application/pdf', repeat('7', 64), 'promoted') returning id into v_up7;
  update s set up7 = v_up7;
  insert into nyayos.jobs (tenant_id, type, payload_ref) values (v_ta, 'scan', v_up7);
  update s set doc1 = v_doc1, doc2 = v_doc2, doc3 = v_doc3, doc4 = v_doc4, doc5 = v_doc5, doc6 = v_doc6, docb = v_docb,
    v1 = v_v1, v2 = v_v2, v3 = v_v3, v5 = v_v5, v6 = v_v6, vb = v_vb, loc1 = v_loc1, loc6 = v_loc6,
    up_a = v_up_a, up_b = v_up_b, up_x = v_up_x, up_d2 = v_up_d2, up5 = v_up5, up6 = v_up6, upb = v_upb, x1 = v_x1, x2 = v_x2;
end $$;

-- ---------------------------------------------------------------- fixture: canonical items through the single-writer path
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
do $$
declare v_d1 uuid := (select d1 from s); v_d2 uuid := (select d2 from s); v_d3 uuid := (select d3 from s);
  v_doc1 uuid := (select doc1 from s); v_doc3 uuid := (select doc3 from s); v_doc5 uuid := (select doc5 from s);
  v_v1 uuid := (select v1 from s); v_v3 uuid := (select v3 from s); v_v5 uuid := (select v5 from s); v_loc1 uuid := (select loc1 from s);
  v_ue jsonb := '{"kind":"user_entry","enteredBy":"a1a1a1a1-0000-4000-8000-000000000001"}';
  v_src jsonb; v_c uuid; v_e1 uuid; v_ei1 uuid; v_e_in uuid; v_e2 uuid; v_e5 uuid; v_ent uuid;
begin
  v_src := jsonb_build_object('kind', 'document', 'documentId', v_doc1, 'documentVersionId', v_v1, 'locationId', v_loc1);
  v_c := nyayos.decide_proposal(nyayos.propose_change(v_d1, 'event', null, jsonb_build_object('text', 'Synthetic delivery', 'origin_type', 'document_extraction', 'source_ref', v_src), null), true, null);
  select target_id into v_e1 from nyayos.user_corrections where id = v_c;
  v_c := nyayos.decide_proposal(nyayos.propose_change(v_d1, 'evidence_item', null, jsonb_build_object('document_id', v_doc1, 'description', 'Synthetic invoice',
         'evidence_type', 'invoice', 'origin_type', 'document_extraction', 'source_ref', v_src), null), true, null);
  select target_id into v_ei1 from nyayos.user_corrections where id = v_c;
  v_c := nyayos.decide_proposal(nyayos.propose_change(v_d1, 'event', null, jsonb_build_object('text', 'Synthetic referenced event', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  select target_id into v_e_in from nyayos.user_corrections where id = v_c;
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'evidence_relation', null, jsonb_build_object('evidence_item_id', v_ei1, 'target_type', 'event', 'target_id', v_e1,
         'relation', 'supports', 'origin_type', 'user_inference', 'source_ref', v_ue), null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'date_assertion', null, jsonb_build_object('target_type', 'event', 'target_id', v_e1, 'value', '2026-07-14',
         'precision', 'exact', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'contradiction', null, jsonb_build_object('item_a_type', 'event', 'item_a_id', v_e1, 'item_b_type', 'evidence_item',
         'item_b_id', v_ei1, 'field', 'date', 'description', 'Synthetic difference', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'missing_evidence', null, jsonb_build_object('expected_item', 'Synthetic receipt', 'reason', 'mentioned',
         'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'issue', null, jsonb_build_object('label', 'Synthetic label', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'next_step', null, jsonb_build_object('text', 'Synthetic step', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'proposition', null, jsonb_build_object('text', 'Synthetic proposition', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  v_c := nyayos.decide_proposal(nyayos.propose_change(v_d1, 'entity', null, jsonb_build_object('canonical_label', 'Synthetic Party', 'entity_type', 'organisation',
         'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  select target_id into v_ent from nyayos.user_corrections where id = v_c;
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'entity_source_form', null, jsonb_build_object('entity_id', v_ent, 'form_text', 'सिंथेटिक पार्टी', 'source_ref', v_ue), null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'dispute_statement', null, '{"kind":"narrative","text":"Synthetic narrative"}'::jsonb, null), true, null);
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'event', v_e1, '{"text":"Synthetic delivery (corrected)"}'::jsonb, 'synthetic'), true, null);
  perform nyayos.propose_change(v_d1, 'event', null, jsonb_build_object('text', 'Synthetic pending', 'origin_type', 'user_statement', 'source_ref', v_ue), null);   -- stays pending
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'event', null, jsonb_build_object('text', 'Synthetic rejected', 'origin_type', 'user_statement', 'source_ref', v_ue), null), false, 'synthetic');
  -- D2 items: one points at a D1 document (source_ref), one targets a D1 event (item reference)
  v_c := nyayos.decide_proposal(nyayos.propose_change(v_d2, 'event', null, jsonb_build_object('text', 'Synthetic D2 event', 'origin_type', 'document_extraction',
         'source_ref', jsonb_build_object('kind', 'document', 'documentId', v_doc3, 'documentVersionId', v_v3)), null), true, null);
  select target_id into v_e2 from nyayos.user_corrections where id = v_c;
  perform nyayos.decide_proposal(nyayos.propose_change(v_d2, 'date_assertion', null, jsonb_build_object('target_type', 'event', 'target_id', v_e_in, 'value', '2026-08-01',
         'precision', 'approximate', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  -- D3: an event that cites doc5 (doc6 is cited by nothing)
  v_c := nyayos.decide_proposal(nyayos.propose_change(v_d3, 'event', null, jsonb_build_object('text', 'Synthetic D3 event', 'origin_type', 'document_extraction',
         'source_ref', jsonb_build_object('kind', 'document', 'documentId', v_doc5, 'documentVersionId', v_v5)), null), true, null);
  select target_id into v_e5 from nyayos.user_corrections where id = v_c;
  update s set e1 = v_e1, ei1 = v_ei1, e_in = v_e_in, e2 = v_e2, e5 = v_e5;
  insert into nyayos.consents (principal_user_id, tenant_id, scope_type, scope_id, purpose, notice_version, notice_language, method, request_id)
    values ('a1a1a1a1-0000-4000-8000-000000000001', (select ta from s), 'dispute', v_d1, 'storage', 'v1', 'en', 'click', 'synthetic-consent');
  update s set r1 = nyayos.request_deletion('dispute', v_d1);
  update s set r3 = nyayos.request_deletion('dispute', v_d2);
  update s set ru = nyayos.request_deletion('dispute', v_d3);
  update s set r5 = nyayos.request_deletion('document', (select doc6 from s));
  update s set r6 = nyayos.request_deletion('document', v_doc5);
  update s set r7 = nyayos.request_deletion('document', (select doc7 from s));
end $$;
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'b1b1b1b1-0000-4000-8000-000000000001';
do $$
declare v_c uuid;
begin
  v_c := nyayos.decide_proposal(nyayos.propose_change((select db1 from s), 'event', null, jsonb_build_object('text', 'Synthetic B event', 'origin_type', 'document_extraction',
         'source_ref', jsonb_build_object('kind', 'document', 'documentId', (select docb from s), 'documentVersionId', (select vb from s))), null), true, null);
  update s set eb = (select target_id from nyayos.user_corrections where id = v_c);
  update s set rb = nyayos.request_deletion('dispute', (select db1 from s));
end $$;
reset role;
-- cross-dispute probe at request time: E (editor of D2 only) cannot even request deletion of a D1 document
set role nyayos_authenticated; set nyayos.principal_id = 'e1e1e1e1-0000-4000-8000-000000000001';
do $$ begin
  perform nyayos.request_deletion('document', (select doc1 from s));
  insert into flags values ('cross_dispute_request', 'accepted');
exception when insufficient_privilege then insert into flags values ('cross_dispute_request', 'refused');
end $$;
reset role;

-- account fixture: A2 owns tenant TA2 (shared with another member C2) and is also a member of tenant TB
set role nyayos_authenticated; set nyayos.principal_id = 'a2a2a2a2-0000-4000-8000-000000000002';
update s set ta2 = nyayos.sign_up_personal_tenant('Synthetic A2', 'en');
update s set da2 = nyayos.create_dispute((select ta2 from s), 'Synthetic A2 dispute');
reset role;
insert into nyayos.tenant_memberships (tenant_id, user_id, tenant_role, status) values
  ((select ta2 from s), 'c2c2c2c2-0000-4000-8000-000000000002', 'member', 'active'),
  ((select tb from s), 'a2a2a2a2-0000-4000-8000-000000000002', 'member', 'active');
insert into nyayos.platform_roles (user_id, role, granted_by) values ('a2a2a2a2-0000-4000-8000-000000000002', 'platform_security', 'a2a2a2a2-0000-4000-8000-000000000002');
set role nyayos_authenticated; set nyayos.principal_id = 'a2a2a2a2-0000-4000-8000-000000000002';
update s set ra2 = nyayos.request_deletion('account', 'a2a2a2a2-0000-4000-8000-000000000002');
reset role;

-- forged requests (only a superuser can write these rows; clients cannot since A-033 C-2)
update s set rf_tenant = gen_random_uuid(), rf_owner = gen_random_uuid(), rf_dispute = gen_random_uuid();
insert into nyayos.deletion_requests (id, tenant_id, scope_type, scope_id, requested_by, undo_until) values
  ((select rf_tenant from s), (select ta from s), 'dispute', (select db1 from s), 'b1b1b1b1-0000-4000-8000-000000000001', now() - interval '1 minute'),   -- B's dispute filed under tenant A
  ((select rf_owner from s), (select tb from s), 'dispute', (select db1 from s), 'a1a1a1a1-0000-4000-8000-000000000001', now() - interval '1 minute'),    -- A naming B's dispute
  ((select rf_dispute from s), (select ta from s), 'document', (select doc1 from s), 'e1e1e1e1-0000-4000-8000-000000000001', now() - interval '1 minute'); -- E (D2 editor) naming a D1 document

-- ---------------------------------------------------------------- helpers
create function pg_temp.snap(p_label text) returns void language plpgsql as $f$
declare r record;
begin
  for r in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'nyayos' and c.relkind = 'r' loop
    execute format('insert into snaps select %L, %L, %s, md5(c::text) from nyayos.%I c', p_label, r.relname, nyayos.deletion_record_key_v1(r.relname), r.relname);
  end loop;
end $f$;
create function pg_temp.deleted(a text, b text) returns table (tn text, rid text) language sql as $f$
  select tn, rid from snaps where label = a except select tn, rid from snaps where label = b $f$;
create function pg_temp.added(a text, b text) returns table (tn text, rid text) language sql as $f$
  select tn, rid from snaps where label = b except select tn, rid from snaps where label = a $f$;
create function pg_temp.changed(a text, b text) returns table (tn text, rid text) language sql as $f$
  select x.tn, x.rid from snaps x join snaps y on y.tn = x.tn and y.rid = x.rid where x.label = a and y.label = b and x.h <> y.h $f$;
create function pg_temp.exists_row(t text, id uuid) returns boolean language plpgsql as $f$
declare b boolean;
begin execute format('select exists (select 1 from nyayos.%I c where %s = $1)', t, nyayos.deletion_record_key_v1(t)) into b using id::text; return b; end $f$;
-- Orphan oracle, independent of the worker: every pointer column and source_ref key must resolve.
create function pg_temp.orphans() returns bigint language plpgsql as $f$
declare r record; n bigint := 0; m bigint;
begin
  if to_regclass('pg_temp.allids') is null then create temp table allids (tn text, id text); end if;
  truncate allids;
  for r in select c.table_name from information_schema.columns c where c.table_schema = 'nyayos' and c.column_name = 'id' loop
    execute format('insert into allids select %L, x.id::text from nyayos.%I x', r.table_name, r.table_name);
  end loop;
  for r in select c.table_name from information_schema.columns c where c.table_schema = 'nyayos' and c.column_name = 'source_ref' loop
    execute format($q$select count(*) from nyayos.%I x, lateral (values ('documents', x.source_ref ->> 'documentId'),
        ('document_versions', x.source_ref ->> 'documentVersionId'), ('document_locations', x.source_ref ->> 'locationId'),
        ('dispute_statements', x.source_ref ->> 'statementId')) v(t, ref)
      where coalesce(v.ref, '') <> '' and not exists (select 1 from allids a where a.tn = v.t and a.id = v.ref)$q$, r.table_name) into m;
    n := n + m;
  end loop;
  for r in select c.table_name, c.column_name from information_schema.columns c where c.table_schema = 'nyayos'
           and c.column_name in ('target_id', 'item_a_id', 'item_b_id', 'related_id', 'payload_ref') loop
    execute format('select count(*) from nyayos.%I x where x.%I is not null and not exists (select 1 from allids a where a.id = x.%I::text)',
                   r.table_name, r.column_name, r.column_name) into m;
    n := n + m;
  end loop;
  select count(*) into m from nyayos.export_manifests xm
    cross join lateral jsonb_array_elements(coalesce(xm.entries -> 'documents', '[]'::jsonb)) el
    where not exists (select 1 from allids a where a.tn = 'documents' and a.id = el ->> 'documentId');
  return n + m;
end $f$;
-- fingerprint of every row carrying a given column value (for untouched-scope checks)
create function pg_temp.scoped_fp(p_col text, p_val uuid) returns text language plpgsql as $f$
declare r record; acc text := ''; h text;
begin
  for r in select c.table_name from information_schema.columns c where c.table_schema = 'nyayos' and c.column_name = p_col order by 1 loop
    execute format('select md5(coalesce(string_agg(md5(t::text), '','' order by md5(t::text)), '''')) from nyayos.%I t where t.%I = $1', r.table_name, p_col) into h using p_val;
    acc := acc || r.table_name || '=' || h || ';';
  end loop;
  return md5(acc);
end $f$;
create temp table fps (label text, v text);
grant all on snaps, fps to public;

create function pg_temp.purge(p_label text, p_req uuid) returns void language plpgsql as $f$
begin
  execute 'set local role nyayos_service_deletion';
  insert into res select p_label, * from nyayos.purge_deletion_request(p_req);
  execute 'reset role';
end $f$;
create function pg_temp.enum_as(p_label text, p_user text, p_req uuid) returns void language plpgsql as $f$
begin
  perform set_config('nyayos.principal_id', p_user, true);
  execute 'set local role nyayos_authenticated';
  insert into en select p_label, * from nyayos.enumerate_deletion_scope(p_req);
  execute 'reset role';
  perform set_config('nyayos.principal_id', '', true);
end $f$;
create function pg_temp.r(p_label text) returns text language sql as $f$ select outcome from res where label = p_label $f$;
create function pg_temp.only_candidates_deleted(q text, a text, b text) returns boolean language sql as $f$
  select not exists (select 1 from pg_temp.deleted(a, b) d
    where not exists (select 1 from en where en.req = q and en.table_name = d.tn and en.record_id = d.rid and en.classification = 'purge_candidate')) $f$;
create function pg_temp.non_candidates_kept(q text, b text) returns boolean language sql as $f$
  select not exists (select 1 from en where en.req = q and en.record_id is not null and en.classification <> 'purge_candidate'
    and not exists (select 1 from snaps x where x.label = b and x.tn = en.table_name and x.rid = en.record_id)) $f$;

-- ---------------------------------------------------------------- 0. structure and privileges
select 'CHECK M3_fixture_has_no_orphans ' || case when pg_temp.orphans() = 0 then 'PASS' else 'FAIL' end;
select 'CHECK M3_cross_dispute_request_refused_at_creation ' || case when (select v from flags where k = 'cross_dispute_request') = 'refused' then 'PASS' else 'FAIL' end;
select 'CHECK M3_purge_order_covers_every_candidate_table ' || case when not exists (
  select 1 from nyayos.deletion_graph_v1() g where g.classification = 'purge_candidate' and not (g.table_name = any(nyayos.deletion_purge_order_v1()))) then 'PASS' else 'FAIL' end;
select 'CHECK M3_purge_order_deletes_children_first ' || case when not exists (
  select 1 from pg_constraint c join pg_class ch on ch.oid = c.conrelid join pg_class pa on pa.oid = c.confrelid
  where c.contype = 'f' and c.connamespace = 'nyayos'::regnamespace
    and ch.relname = any(nyayos.deletion_purge_order_v1()) and pa.relname = any(nyayos.deletion_purge_order_v1())
    and array_position(nyayos.deletion_purge_order_v1(), ch.relname::text) >= array_position(nyayos.deletion_purge_order_v1(), pa.relname::text)) then 'PASS' else 'FAIL' end;
do $$
declare r record; n bigint; d bigint; bad int := 0;
begin
  for r in select c.relname from pg_class c join pg_namespace ns on ns.oid = c.relnamespace where ns.nspname = 'nyayos' and c.relkind = 'r' loop
    execute format('select count(*), count(distinct %s) from nyayos.%I c', nyayos.deletion_record_key_v1(r.relname), r.relname) into n, d;
    if n <> d then bad := bad + 1; end if;
  end loop;
  insert into flags values ('record_keys_unique', bad::text);
end $$;
select 'CHECK M3_record_key_valid_and_unique_for_every_table ' || case when (select v from flags where k = 'record_keys_unique') = '0' then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_role_holds_delete_on_any_table ' || case when not exists (
  select 1 from pg_class c join pg_namespace ns on ns.oid = c.relnamespace, unnest(array['nyayos_anon', 'nyayos_authenticated', 'nyayos_service_scan',
    'nyayos_service_promote', 'nyayos_service_deletion', 'nyayos_service_audit']) rl
  where ns.nspname = 'nyayos' and c.relkind = 'r' and has_table_privilege(rl, c.oid, 'DELETE')) then 'PASS' else 'FAIL' end;
select 'CHECK M3_worker_executable_only_by_deletion_service ' || case when
  has_function_privilege('nyayos_service_deletion', 'nyayos.purge_deletion_request(uuid)', 'EXECUTE')
  and not exists (select 1 from unnest(array['nyayos_anon', 'nyayos_authenticated', 'nyayos_service_scan', 'nyayos_service_promote', 'nyayos_service_audit']) rl
                  where has_function_privilege(rl, 'nyayos.purge_deletion_request(uuid)', 'EXECUTE'))
  and not exists (select 1 from unnest(array['nyayos_anon', 'nyayos_authenticated', 'nyayos_service_scan', 'nyayos_service_promote', 'nyayos_service_deletion', 'nyayos_service_audit']) rl,
                  unnest(array['nyayos.deletion_logical_refs_v1()', 'nyayos.deletion_audit_internal(text,nyayos.audit_outcome,nyayos.audit_severity,uuid,uuid,uuid,uuid,jsonb)']) f
                  where has_function_privilege(rl, f, 'EXECUTE')) then 'PASS' else 'FAIL' end;
select 'CHECK M3_worker_definer_with_pinned_search_path ' || case when exists (
  select 1 from pg_proc p where p.oid = 'nyayos.purge_deletion_request(uuid)'::regprocedure and p.prosecdef
    and p.proconfig @> array['search_path=pg_catalog, nyayos, pg_temp']) then 'PASS' else 'FAIL' end;
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
do $$ begin
  perform nyayos.purge_deletion_request((select r1 from s));
  insert into flags values ('client_purge', 'allowed');
exception when insufficient_privilege then insert into flags values ('client_purge', 'refused');
end $$;
reset role;
select 'CHECK M3_client_cannot_trigger_purge ' || case when (select v from flags where k = 'client_purge') = 'refused' then 'PASS' else 'FAIL' end;
set role nyayos_service_deletion;
do $$ begin
  delete from nyayos.disputes where id = (select db1 from s);
  insert into flags values ('service_direct_delete', 'allowed');
exception when insufficient_privilege then insert into flags values ('service_direct_delete', 'refused');
end $$;
do $$ begin   -- even with a forged 'purging' state and the purge flag, no DELETE grant exists outside the worker
  update nyayos.deletion_requests set state = 'purging' where id = (select r6 from s);
  perform set_config('nyayos.purge_request', (select r6 from s)::text, true);
  delete from nyayos.document_versions where id = (select v5 from s);
  insert into flags values ('service_forged_flag_delete', 'allowed');
exception when insufficient_privilege then insert into flags values ('service_forged_flag_delete', 'refused');
end $$;
reset role;
select 'CHECK M3_no_direct_delete_outside_worker ' || case when (select v from flags where k = 'service_direct_delete') = 'refused'
  and (select v from flags where k = 'service_forged_flag_delete') = 'refused' and pg_temp.exists_row('document_versions', (select v5 from s))
  and (select state from nyayos.deletion_requests where id = (select r6 from s)) = 'requested' then 'PASS' else 'FAIL' end;
do $$ begin   -- the owner is also refused by the append-only trigger outside a purge, even when naming a real request
  perform set_config('nyayos.purge_request', (select r6 from s)::text, true);
  delete from nyayos.document_versions where id = (select v5 from s);
  insert into flags values ('owner_delete_outside_purge', 'allowed');
exception when insufficient_privilege then insert into flags values ('owner_delete_outside_purge', 'refused:' || sqlerrm);
end $$;
do $$ begin
  update nyayos.document_versions set storage_path = 'tampered' where id = (select v5 from s);
  insert into flags values ('owner_update_version', 'allowed');
exception when insufficient_privilege then insert into flags values ('owner_update_version', 'refused');
end $$;
select 'CHECK M3_append_only_trigger_holds_outside_purge ' || case when (select v from flags where k = 'owner_delete_outside_purge') like 'refused:%append-only%'
  and (select v from flags where k = 'owner_update_version') = 'refused' then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 1. undo window and undone requests
select pg_temp.snap('t0');
select pg_temp.purge('R1_window', (select r1 from s));
select pg_temp.purge('RB_window', (select rb from s));
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update nyayos.deletion_requests set state = 'undone' where id = (select ru from s);
reset role;
select pg_temp.snap('t1');
select 'CHECK M3_undo_window_rejects_purge ' || case when pg_temp.r('R1_window') = 'undo_window_active' and pg_temp.r('RB_window') = 'undo_window_active'
  and not exists (select 1 from pg_temp.deleted('t0', 't1'))
  -- the only changes are the requester's own undo: the request row, the dispute status it restores
  -- (A-042, migration 0008) and the deletion.undone audit event written with it
  and (select string_agg(tn || ':' || rid, ',' order by tn) from pg_temp.changed('t0', 't1'))
      = 'deletion_requests:' || (select ru from s)::text || ',disputes:' || (select d3 from s)::text
  and (select string_agg(tn, ',') from pg_temp.added('t0', 't1')) = 'audit_events'
  and exists (select 1 from nyayos.audit_events where action = 'deletion.undone' and resource_id = (select ru from s)::text) then 'PASS' else 'FAIL' end;
-- time passes: every undo window closes (test-only clock move)
update nyayos.deletion_requests set undo_until = now() - interval '1 minute' where state in ('requested', 'undone');
select pg_temp.snap('t2');
select pg_temp.purge('RU', (select ru from s));
select pg_temp.purge('NONE', gen_random_uuid());
select pg_temp.snap('t3');
select 'CHECK M3_undone_request_never_purged ' || case when pg_temp.r('RU') = 'request_undone' and pg_temp.r('NONE') = 'not_found_or_not_authorized'
  and not exists (select 1 from pg_temp.deleted('t2', 't3')) and not exists (select 1 from pg_temp.added('t2', 't3'))
  and not exists (select 1 from pg_temp.changed('t2', 't3')) then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 2. legal hold
update nyayos.config_provisional set value = (select d2 from s)::text where key = 'legal_hold_dispute_ids';
select pg_temp.snap('h0');
select pg_temp.purge('R3_held', (select r3 from s));
update nyayos.config_provisional set value = (select da2 from s)::text where key = 'legal_hold_dispute_ids';
select pg_temp.purge('RA2_held', (select ra2 from s));
update nyayos.config_provisional set value = 'not-a-uuid' where key = 'legal_hold_dispute_ids';
select pg_temp.purge('R1_bad_hold', (select r1 from s));
select pg_temp.purge('R5_bad_hold', (select r5 from s));
update nyayos.config_provisional set value = (select d2 from s)::text where key = 'legal_hold_dispute_ids';
select pg_temp.snap('h1');
select 'CHECK M3_legal_hold_rejects_purge ' || case when pg_temp.r('R3_held') = 'legal_hold_active' and pg_temp.r('RA2_held') = 'legal_hold_active'
  and not exists (select 1 from pg_temp.deleted('h0', 'h1')) and not exists (select 1 from pg_temp.added('h0', 'h1'))
  and not exists (select 1 from pg_temp.changed('h0', 'h1') where tn <> 'config_provisional') then 'PASS' else 'FAIL' end;
select 'CHECK M3_unreadable_legal_hold_rejects_every_purge ' || case when pg_temp.r('R1_bad_hold') = 'legal_hold_active'
  and pg_temp.r('R5_bad_hold') = 'legal_hold_active' then 'PASS' else 'FAIL' end;
update nyayos.config_provisional set value = '' where key = 'legal_hold_dispute_ids';

-- ---------------------------------------------------------------- 3. forged cross-tenant and cross-dispute requests
select pg_temp.snap('f0');
select pg_temp.purge('RF_tenant', (select rf_tenant from s));
select pg_temp.purge('RF_owner', (select rf_owner from s));
select pg_temp.purge('RF_dispute', (select rf_dispute from s));
select pg_temp.snap('f1');
select 'CHECK M3_cross_tenant_request_rejected ' || case when pg_temp.r('RF_tenant') = 'not_found_or_not_authorized' and pg_temp.r('RF_owner') = 'not_found_or_not_authorized'
  and pg_temp.exists_row('disputes', (select db1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_cross_dispute_request_rejected ' || case when pg_temp.r('RF_dispute') = 'not_found_or_not_authorized'
  and pg_temp.exists_row('documents', (select doc1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_rejected_requests_change_nothing_but_audit ' || case when not exists (select 1 from pg_temp.deleted('f0', 'f1'))
  and not exists (select 1 from pg_temp.changed('f0', 'f1'))
  and not exists (select 1 from pg_temp.added('f0', 'f1') where tn <> 'audit_events')
  and (select count(*) from pg_temp.added('f0', 'f1')) = 3
  and (select count(*) from nyayos.audit_events a where a.action = 'authz.denied' and a.actor_type = 'service' and a.outcome = 'denied'
       and a.resource_id in ((select rf_tenant from s)::text, (select rf_owner from s)::text, (select rf_dispute from s)::text)) = 3
  and not exists (select 1 from nyayos.audit_events a where a.action = 'authz.denied' and a.metadata::text ~* 'synthetic') then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_existence_leak_in_rejections ' || case when
  (select count(distinct (outcome, request_state, purged, retained)) from res where label in ('NONE', 'RF_tenant', 'RF_owner', 'RF_dispute')) = 1
  and not exists (select 1 from nyayos.audit_events a where a.action = 'authz.denied' and a.dispute_id is not null) then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 4. valid complete purge (dispute DB1, tenant TB)
select pg_temp.enum_as('RB', 'b1b1b1b1-0000-4000-8000-000000000001', (select rb from s));
insert into fps values ('b0_ta', pg_temp.scoped_fp('tenant_id', (select ta from s))), ('b0_ta2', pg_temp.scoped_fp('tenant_id', (select ta2 from s)));
select pg_temp.snap('b0');
select pg_temp.purge('RB', (select rb from s));
select pg_temp.snap('b1');
select 'CHECK M3_valid_purge_completes ' || case when (select outcome || '/' || request_state from res where label = 'RB') = 'purged/purged'
  and (select state::text from nyayos.deletion_requests where id = (select rb from s)) = 'purged'
  and (select purged_at is not null and locked_at is not null from nyayos.deletion_requests where id = (select rb from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_valid_purge_deletes_exactly_the_candidates ' || case when pg_temp.only_candidates_deleted('RB', 'b0', 'b1')
  and (select count(*) from pg_temp.deleted('b0', 'b1')) = (select count(distinct (table_name, record_id)) from en where req = 'RB' and classification = 'purge_candidate')
  and (select purged from res where label = 'RB') = (select count(distinct (table_name, record_id)) from en where req = 'RB' and classification = 'purge_candidate') then 'PASS' else 'FAIL' end;
select 'CHECK M3_valid_purge_removes_every_dispute_record ' || case when not pg_temp.exists_row('disputes', (select db1 from s))
  and not pg_temp.exists_row('documents', (select docb from s)) and not pg_temp.exists_row('document_versions', (select vb from s))
  and not pg_temp.exists_row('quarantine_uploads', (select upb from s)) and not pg_temp.exists_row('events', (select eb from s))
  and not exists (select 1 from nyayos.jobs where payload_ref = (select upb from s))
  and not exists (select 1 from nyayos.user_corrections where dispute_id = (select db1 from s))
  and not exists (select 1 from nyayos.proposals where dispute_id = (select db1 from s))
  and not exists (select 1 from nyayos.dispute_roles where dispute_id = (select db1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_valid_purge_writes_tombstone_and_audit_only ' || case when
  (select string_agg(tn, ',' order by tn) from pg_temp.added('b0', 'b1')) = 'audit_events,deletion_ledger'
  and (select string_agg(tn || ':' || rid, ',') from pg_temp.changed('b0', 'b1')) = 'deletion_requests:' || (select rb from s)::text
  and (select count(*) from nyayos.deletion_ledger l where l.scope_id = (select db1 from s) and l.scope_type = 'dispute' and l.tenant_id = (select tb from s)) = 1 then 'PASS' else 'FAIL' end;
select 'CHECK M3_valid_purge_preserves_retained_metadata ' || case when pg_temp.non_candidates_kept('RB', 'b1')
  and exists (select 1 from nyayos.audit_events where dispute_id = (select db1 from s) and action = 'dispute.created') then 'PASS' else 'FAIL' end;
select 'CHECK M3_valid_purge_leaves_other_tenants_untouched ' || case when
  pg_temp.scoped_fp('tenant_id', (select ta from s)) = (select v from fps where label = 'b0_ta')
  and pg_temp.scoped_fp('tenant_id', (select ta2 from s)) = (select v from fps where label = 'b0_ta2')
  and exists (select 1 from nyayos.jobs where tenant_id = (select tb from s) and payload_ref = (select up_x from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_orphans_after_valid_purge ' || case when pg_temp.orphans() = 0 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 5. duplicate execution is idempotent
select pg_temp.purge('RB_again', (select rb from s));
select pg_temp.purge('RB_third', (select rb from s));
select pg_temp.snap('b2');
select 'CHECK M3_duplicate_execution_is_a_no_op ' || case when pg_temp.r('RB_again') = 'already_purged' and pg_temp.r('RB_third') = 'already_purged'
  and not exists (select 1 from pg_temp.deleted('b1', 'b2')) and not exists (select 1 from pg_temp.added('b1', 'b2'))
  and not exists (select 1 from pg_temp.changed('b1', 'b2')) then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 6. purge with blocked records (dispute D1)
select pg_temp.enum_as('R1', 'a1a1a1a1-0000-4000-8000-000000000001', (select r1 from s));
insert into fps values ('c0_d2', pg_temp.scoped_fp('dispute_id', (select d2 from s))), ('c0_tb', pg_temp.scoped_fp('tenant_id', (select tb from s))),
  ('c0_d3', pg_temp.scoped_fp('dispute_id', (select d3 from s)));
select pg_temp.snap('c0');
select pg_temp.purge('R1', (select r1 from s));
select pg_temp.snap('c1');
select 'CHECK M3_blocked_purge_is_incomplete_not_complete ' || case when (select outcome || '/' || request_state from res where label = 'R1') = 'incomplete/incomplete'
  and (select retained from res where label = 'R1') > 0
  and not exists (select 1 from nyayos.deletion_ledger where scope_id = (select d1 from s))
  and exists (select 1 from nyayos.audit_events where action = 'deletion.incomplete' and resource_id = (select r1 from s)::text) then 'PASS' else 'FAIL' end;
select 'CHECK M3_blocked_purge_deletes_only_candidates ' || case when pg_temp.only_candidates_deleted('R1', 'c0', 'c1')
  and (select count(*) from pg_temp.deleted('c0', 'c1')) = (select purged from res where label = 'R1')
  and (select string_agg(tn, ',') from pg_temp.added('c0', 'c1')) = 'audit_events'
  and (select string_agg(tn || ':' || rid, ',') from pg_temp.changed('c0', 'c1')) = 'deletion_requests:' || (select r1 from s)::text then 'PASS' else 'FAIL' end;
select 'CHECK M3_blocked_items_preserved ' || case when pg_temp.non_candidates_kept('R1', 'c1')
  and pg_temp.exists_row('events', (select e_in from s)) and pg_temp.exists_row('documents', (select doc3 from s))
  and pg_temp.exists_row('document_versions', (select v3 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_configuration_controlled_preserved ' || case when exists (select 1 from en where req = 'R1' and classification = 'configuration_controlled')
  and exists (select 1 from nyayos.consents where scope_id = (select d1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_parents_of_kept_records_kept ' || case when pg_temp.exists_row('disputes', (select d1 from s))
  and exists (select 1 from nyayos.dispute_roles where dispute_id = (select d1 from s) and dispute_role = 'dispute_owner')
  and pg_temp.exists_row('quarantine_uploads', (select up_x from s)) then 'PASS' else 'FAIL' end;   -- up_x: a foreign-tenant job still points at it
select 'CHECK M3_unblocked_records_purged ' || case when not pg_temp.exists_row('documents', (select doc1 from s))
  and not pg_temp.exists_row('document_versions', (select v1 from s)) and not pg_temp.exists_row('document_versions', (select v2 from s))
  and not pg_temp.exists_row('document_locations', (select loc1 from s)) and not pg_temp.exists_row('evidence_items', (select ei1 from s))
  and not pg_temp.exists_row('events', (select e1 from s)) and not pg_temp.exists_row('exports', (select x1 from s))
  and not pg_temp.exists_row('quarantine_uploads', (select up_a from s)) and not pg_temp.exists_row('documents', (select doc2 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_other_disputes_and_tenants_untouched ' || case when
  pg_temp.scoped_fp('dispute_id', (select d2 from s)) = (select v from fps where label = 'c0_d2')
  and pg_temp.scoped_fp('dispute_id', (select d3 from s)) = (select v from fps where label = 'c0_d3')
  and pg_temp.scoped_fp('tenant_id', (select tb from s)) = (select v from fps where label = 'c0_tb') then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_orphans_after_blocked_purge ' || case when pg_temp.orphans() = 0 then 'PASS' else 'FAIL' end;
select pg_temp.purge('R1_again', (select r1 from s));
select pg_temp.snap('c2');
select 'CHECK M3_incomplete_rerun_is_idempotent ' || case when (select outcome || ':' || purged from res where label = 'R1_again') = 'incomplete:0'
  and not exists (select 1 from pg_temp.deleted('c1', 'c2'))
  and (select string_agg(tn, ',') from pg_temp.added('c1', 'c2')) = 'audit_events'
  and (select string_agg(tn || ':' || rid, ',') from pg_temp.changed('c1', 'c2')) = 'deletion_requests:' || (select r1 from s)::text then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 7. releasing the block: purge D2, then retry D1
select pg_temp.enum_as('R3', 'a1a1a1a1-0000-4000-8000-000000000001', (select r3 from s));
select pg_temp.snap('d0');
select pg_temp.purge('R3', (select r3 from s));
select pg_temp.snap('d1');
select 'CHECK M3_referencing_dispute_purges_without_touching_referenced ' || case when pg_temp.r('R3') = 'purged'
  and pg_temp.only_candidates_deleted('R3', 'd0', 'd1')
  and pg_temp.exists_row('events', (select e_in from s)) and pg_temp.exists_row('documents', (select doc3 from s))
  and not pg_temp.exists_row('disputes', (select d2 from s)) then 'PASS' else 'FAIL' end;
select pg_temp.enum_as('R1_retry', 'a1a1a1a1-0000-4000-8000-000000000001', (select r1 from s));
select pg_temp.snap('d2');
select pg_temp.purge('R1_retry', (select r1 from s));
select pg_temp.snap('d3');
select 'CHECK M3_retry_purges_released_records ' || case when pg_temp.r('R1_retry') = 'incomplete'
  and pg_temp.only_candidates_deleted('R1_retry', 'd2', 'd3')
  and not pg_temp.exists_row('events', (select e_in from s)) and not pg_temp.exists_row('documents', (select doc3 from s))
  and pg_temp.exists_row('quarantine_uploads', (select up_x from s)) and pg_temp.exists_row('disputes', (select d1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_orphans_after_retry ' || case when pg_temp.orphans() = 0 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 8. document scope
select pg_temp.enum_as('R5', 'a1a1a1a1-0000-4000-8000-000000000001', (select r5 from s));
select pg_temp.snap('e0');
select pg_temp.purge('R5', (select r5 from s));
select pg_temp.snap('e1');
select 'CHECK M3_document_purge_completes ' || case when pg_temp.r('R5') = 'purged' and pg_temp.only_candidates_deleted('R5', 'e0', 'e1')
  and (select count(*) from pg_temp.deleted('e0', 'e1')) = (select count(distinct (table_name, record_id)) from en where req = 'R5' and classification = 'purge_candidate')
  and not pg_temp.exists_row('documents', (select doc6 from s)) and not pg_temp.exists_row('document_versions', (select v6 from s))
  and not pg_temp.exists_row('document_locations', (select loc6 from s)) and not pg_temp.exists_row('quarantine_uploads', (select up6 from s))
  and not exists (select 1 from nyayos.jobs where payload_ref = (select up6 from s))
  and pg_temp.exists_row('disputes', (select d3 from s)) and pg_temp.exists_row('documents', (select doc5 from s))
  and exists (select 1 from nyayos.deletion_ledger where scope_type = 'document' and scope_id = (select doc6 from s)) then 'PASS' else 'FAIL' end;
select pg_temp.enum_as('R6_block', 'a1a1a1a1-0000-4000-8000-000000000001', (select r6 from s));
select pg_temp.snap('e2');
select pg_temp.purge('R6_block', (select r6 from s));
select pg_temp.snap('e3');
select 'CHECK M3_referenced_document_blocked_under_block_policy ' || case when pg_temp.r('R6_block') = 'incomplete'
  and pg_temp.only_candidates_deleted('R6_block', 'e2', 'e3') and pg_temp.non_candidates_kept('R6_block', 'e3')
  and pg_temp.exists_row('documents', (select doc5 from s)) and pg_temp.exists_row('document_versions', (select v5 from s))
  and pg_temp.exists_row('events', (select e5 from s)) then 'PASS' else 'FAIL' end;
update nyayos.config_provisional set value = 'cascade' where key = 'document_reference_policy';
select pg_temp.enum_as('R6_cascade', 'a1a1a1a1-0000-4000-8000-000000000001', (select r6 from s));
select pg_temp.snap('e4');
select pg_temp.purge('R6_cascade', (select r6 from s));
select pg_temp.snap('e5');
update nyayos.config_provisional set value = 'block' where key = 'document_reference_policy';
select 'CHECK M3_configuration_controlled_reference_never_purged ' || case when pg_temp.r('R6_cascade') = 'incomplete'
  and exists (select 1 from en where req = 'R6_cascade' and table_name = 'events' and record_id = (select e5 from s)::text and classification = 'configuration_controlled')
  and pg_temp.exists_row('events', (select e5 from s)) and pg_temp.exists_row('documents', (select doc5 from s))
  and pg_temp.exists_row('document_versions', (select v5 from s))
  and pg_temp.only_candidates_deleted('R6_cascade', 'e4', 'e5') then 'PASS' else 'FAIL' end;   -- doc5 kept: the preserved event still cites it
select 'CHECK M3_kept_document_keeps_its_subtree ' || case when
  exists (select 1 from en where req = 'R6_cascade' and table_name = 'custody_events' and classification = 'purge_candidate')
  and exists (select 1 from nyayos.custody_events where document_id = (select doc5 from s))
  and not exists (select 1 from pg_temp.deleted('e4', 'e5')) then 'PASS' else 'FAIL' end;
select pg_temp.enum_as('R7', 'a1a1a1a1-0000-4000-8000-000000000001', (select r7 from s));
select pg_temp.snap('e6');
select pg_temp.purge('R7', (select r7 from s));
select pg_temp.snap('e7');
select 'CHECK M3_blocked_record_without_references_preserved ' || case when pg_temp.r('R7') = 'incomplete'
  and exists (select 1 from en where req = 'R7' and table_name = 'quarantine_uploads' and record_id = (select up7 from s)::text
              and classification = 'blocked_active_reference' and reason = 'ambiguous_shared_content_hash')
  and pg_temp.exists_row('quarantine_uploads', (select up7 from s)) and exists (select 1 from nyayos.jobs where payload_ref = (select up7 from s))
  and not pg_temp.exists_row('documents', (select doc7 from s)) and not pg_temp.exists_row('document_versions', (select v7 from s))
  and pg_temp.exists_row('documents', (select doc8 from s)) and pg_temp.exists_row('document_versions', (select v8 from s))
  and pg_temp.only_candidates_deleted('R7', 'e6', 'e7') and pg_temp.non_candidates_kept('R7', 'e7') then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_orphans_after_document_purges ' || case when pg_temp.orphans() = 0 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 9. account scope
select pg_temp.enum_as('RA2', 'a2a2a2a2-0000-4000-8000-000000000002', (select ra2 from s));
insert into fps values ('g0_tb', pg_temp.scoped_fp('tenant_id', (select tb from s))), ('g0_ta', pg_temp.scoped_fp('tenant_id', (select ta from s)));
select pg_temp.snap('g0');
select pg_temp.purge('RA2', (select ra2 from s));
select pg_temp.snap('g1');
select 'CHECK M3_account_purge_follows_graph ' || case when pg_temp.r('RA2') = 'incomplete' and pg_temp.only_candidates_deleted('RA2', 'g0', 'g1')
  and pg_temp.non_candidates_kept('RA2', 'g1')
  and not pg_temp.exists_row('disputes', (select da2 from s))
  and not exists (select 1 from nyayos.profiles where user_id = 'a2a2a2a2-0000-4000-8000-000000000002')
  and pg_temp.exists_row('tenants', (select ta2 from s))
  and exists (select 1 from nyayos.tenant_memberships where tenant_id = (select ta2 from s) and user_id = 'c2c2c2c2-0000-4000-8000-000000000002')
  and exists (select 1 from nyayos.tenant_memberships where tenant_id = (select tb from s) and user_id = 'a2a2a2a2-0000-4000-8000-000000000002')
  and exists (select 1 from nyayos.platform_roles where user_id = 'a2a2a2a2-0000-4000-8000-000000000002') then 'PASS' else 'FAIL' end;
select 'CHECK M3_account_purge_leaves_other_tenants_untouched ' || case when
  pg_temp.scoped_fp('tenant_id', (select tb from s)) = (select v from fps where label = 'g0_tb')
  and pg_temp.scoped_fp('tenant_id', (select ta from s)) = (select v from fps where label = 'g0_ta') then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_orphans_after_account_purge ' || case when pg_temp.orphans() = 0 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 10. audit trail and tombstones across the whole run
select pg_temp.snap('z');
select 'CHECK M3_audit_tombstones_and_requests_never_deleted ' || case when not exists (
  select 1 from pg_temp.deleted('t0', 'z') where tn in ('audit_events', 'audit_anchors', 'deletion_ledger', 'deletion_requests', 'retention_records', 'consents'))
  then 'PASS' else 'FAIL' end;
select 'CHECK M3_audit_rows_never_modified ' || case when not exists (select 1 from pg_temp.changed('t0', 'z') where tn in ('audit_events', 'deletion_ledger'))
  then 'PASS' else 'FAIL' end;
select 'CHECK M3_audit_event_per_purge_execution ' || case when
  (select count(*) from nyayos.audit_events where action = 'deletion.purged') = 3
  and (select count(*) from nyayos.audit_events where action = 'deletion.incomplete') = (select count(*) from res where outcome = 'incomplete')
  and not exists (select 1 from nyayos.audit_events where action in ('deletion.purged', 'deletion.incomplete', 'authz.denied') and actor_type = 'service'
                  and (actor_id <> 'deletion_worker' or on_behalf_of is null or resource_type <> 'deletion_request'))
  and not exists (select 1 from nyayos.audit_events a, jsonb_object_keys(a.metadata) k where a.actor_id = 'deletion_worker'
                  and k not in ('deletion_request_id', 'scope_type', 'state_from', 'state_to', 'reason_code', 'count')) then 'PASS' else 'FAIL' end;
select 'CHECK M3_audit_chain_intact_after_purges ' || case when nyayos.verify_audit_chain() is null then 'PASS' else 'FAIL' end;
select 'CHECK M3_tombstones_only_for_completed_purges ' || case when
  (select count(*) from nyayos.deletion_ledger) = 3
  and (select count(*) from nyayos.deletion_ledger l join nyayos.deletion_requests r on r.scope_id = l.scope_id and r.state = 'purged') = 3
  and (select string_agg(column_name, ',' order by ordinal_position) from information_schema.columns where table_schema = 'nyayos' and table_name = 'deletion_ledger')
      = 'id,tenant_id,scope_type,scope_id,completed_at' then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_request_left_mid_purge ' || case when not exists (select 1 from nyayos.deletion_requests where state = 'purging')
  and coalesce(current_setting('nyayos.purge_request', true), '') = '' then 'PASS' else 'FAIL' end;
select 'CHECK M3_no_orphans_at_end ' || case when pg_temp.orphans() = 0 then 'PASS' else 'FAIL' end;

select 'SUMMARY outcomes ' || string_agg(label || '=' || outcome, ' ' order by label) from res;
