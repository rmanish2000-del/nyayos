-- A-039 M-6: deletion scope enumeration is complete, bounded, classified and read-only.
-- FRESH disposable container with migrations 0001-0006. Synthetic data only.
-- An independent oracle (driven by the database catalogue, not by the explicit graph) proves completeness.
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

create temp table s (ta uuid, tb uuid, d1 uuid, d2 uuid, db1 uuid,
  doc1 uuid, doc2 uuid, doc3 uuid, doc4 uuid, v1 uuid, v2 uuid, loc1 uuid,
  up_a uuid, up_b uuid, up_x uuid, up_d2 uuid, x1 uuid, x2 uuid,
  e1 uuid, ei1 uuid, e_in uuid, e2 uuid, r1 uuid, r2 uuid, r3 uuid, rb uuid,
  ta2 uuid, da2 uuid, ra2 uuid);
insert into s default values;
grant all on s to public;
create temp table en (req text, table_name text, record_id text, classification text, reason text);
grant all on en to public;

-- ---------------------------------------------------------------- fixture: users, tenants, disputes
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update s set ta = nyayos.sign_up_personal_tenant('Synthetic A', 'en');
update s set d1 = nyayos.create_dispute((select ta from s), 'Synthetic D1');
update s set d2 = nyayos.create_dispute((select ta from s), 'Synthetic D2');
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'b1b1b1b1-0000-4000-8000-000000000001';
update s set tb = nyayos.sign_up_personal_tenant('Synthetic B', 'en');
update s set db1 = nyayos.create_dispute((select tb from s), 'Synthetic B1');
reset role;

-- ---------------------------------------------------------------- fixture: documents, uploads, jobs, exports (written as the promote/export services would)
do $$
declare v_ta uuid := (select ta from s); v_tb uuid := (select tb from s); v_d1 uuid := (select d1 from s); v_d2 uuid := (select d2 from s);
  v_a uuid := 'a1a1a1a1-0000-4000-8000-000000000001';
  v_doc1 uuid; v_doc2 uuid; v_doc3 uuid; v_doc4 uuid; v_v1 uuid; v_v2 uuid; v_v3 uuid; v_loc1 uuid; v_up_a uuid; v_up_b uuid; v_up_x uuid; v_up_d2 uuid; v_x1 uuid; v_x2 uuid;
begin
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d1, 'Synthetic invoice') returning id into v_doc1;
  insert into nyayos.documents (tenant_id, dispute_id, display_label, current_version) values (v_ta, v_d1, 'Synthetic invoice copy', 1) returning id into v_doc2;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d1, 'Synthetic shared letter') returning id into v_doc3;
  insert into nyayos.documents (tenant_id, dispute_id, display_label) values (v_ta, v_d2, 'Synthetic D2 doc') returning id into v_doc4;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc1, 1, repeat('a', 64), 10, 'application/pdf', 'synthetic1.pdf', v_a, 'clean', 'p/1') returning id into v_v1;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc1, 2, repeat('b', 64), 10, 'application/pdf', 'synthetic1b.pdf', v_a, 'clean', 'p/2') returning id into v_v2;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc2, 1, repeat('a', 64), 10, 'application/pdf', 'synthetic1-copy.pdf', v_a, 'clean', 'p/3');   -- same bytes as doc1 version 1
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc3, 1, repeat('c', 64), 10, 'application/pdf', 'synthetic3.pdf', v_a, 'clean', 'p/4') returning id into v_v3;
  insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
    values (v_doc4, 1, repeat('e', 64), 10, 'application/pdf', 'synthetic4.pdf', v_a, 'clean', 'p/5');
  insert into nyayos.document_locations (document_version_id, page_number, created_by) values (v_v1, 2, v_a) returning id into v_loc1;
  insert into nyayos.annotations (document_version_id, location_id, text, created_by) values (v_v1, v_loc1, 'Synthetic note', v_a);
  insert into nyayos.custody_events (document_id, version, event, actor) values (v_doc1, 1, 'ingested', v_a), (v_doc1, 1, 'promoted', 'promote_worker'), (v_doc3, 1, 'ingested', v_a);
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d1, v_a, 'application/pdf', repeat('a', 64), 'promoted') returning id into v_up_a;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d1, v_a, 'application/pdf', repeat('b', 64), 'promoted') returning id into v_up_b;
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state)
    values (v_ta, v_d1, 'c1c1c1c1-0000-4000-8000-000000000001', 'application/pdf', repeat('f', 64), 'quarantined') returning id into v_up_x;  -- another member's upload
  insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state) values (v_ta, v_d2, v_a, 'application/pdf', repeat('e', 64), 'promoted') returning id into v_up_d2;
  insert into nyayos.jobs (tenant_id, type, payload_ref) values (v_ta, 'scan', v_up_a), (v_ta, 'scan', v_up_b), (v_ta, 'scan', v_up_x), (v_ta, 'scan', v_up_d2);
  insert into nyayos.jobs (tenant_id, type, payload_ref) values (v_tb, 'scan', v_up_x);   -- foreign-tenant job pointing at a D1 upload
  insert into nyayos.exports (tenant_id, dispute_id, version, included_sections, generated_by, manifest_sha256, storage_path)
    values (v_ta, v_d1, 1, array['manifest'], v_a, repeat('1', 64), 'x/1') returning id into v_x1;
  insert into nyayos.export_manifests (export_id, entries) values (v_x1, jsonb_build_object('disputeId', v_d1, 'items', '[]'::jsonb,
    'documents', jsonb_build_array(jsonb_build_object('documentId', v_doc1, 'version', 2))));
  insert into nyayos.exports (tenant_id, dispute_id, version, included_sections, generated_by, manifest_sha256, storage_path)
    values (v_ta, v_d2, 1, array['manifest'], v_a, repeat('2', 64), 'x/2') returning id into v_x2;
  insert into nyayos.export_manifests (export_id, entries) values (v_x2, jsonb_build_object('disputeId', v_d2, 'items', '[]'::jsonb,
    'documents', jsonb_build_array(jsonb_build_object('documentId', v_doc3, 'version', 1))));   -- D2 export includes a D1 document
  update s set doc1 = v_doc1, doc2 = v_doc2, doc3 = v_doc3, doc4 = v_doc4, v1 = v_v1, v2 = v_v2, loc1 = v_loc1,
    up_a = v_up_a, up_b = v_up_b, up_x = v_up_x, up_d2 = v_up_d2, x1 = v_x1, x2 = v_x2;
end $$;

-- ---------------------------------------------------------------- fixture: canonical items through the single-writer path (as A)
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
do $$
declare v_d1 uuid := (select d1 from s); v_d2 uuid := (select d2 from s);
  v_doc1 uuid := (select doc1 from s); v_doc3 uuid := (select doc3 from s); v_v1 uuid := (select v1 from s); v_loc1 uuid := (select loc1 from s);
  v_ue jsonb := '{"kind":"user_entry","enteredBy":"a1a1a1a1-0000-4000-8000-000000000001"}';
  v_src jsonb; v_c uuid; v_e1 uuid; v_ei1 uuid; v_e_in uuid; v_e2 uuid; v_ent uuid; v_p uuid;
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
  v_p := nyayos.propose_change(v_d1, 'event', null, jsonb_build_object('text', 'Synthetic pending', 'origin_type', 'user_statement', 'source_ref', v_ue), null);   -- stays pending
  perform nyayos.decide_proposal(nyayos.propose_change(v_d1, 'event', null, jsonb_build_object('text', 'Synthetic rejected', 'origin_type', 'user_statement', 'source_ref', v_ue), null), false, 'synthetic');
  -- D2 items: one points at a D1 document (source_ref), one targets a D1 event (item reference)
  v_c := nyayos.decide_proposal(nyayos.propose_change(v_d2, 'event', null, jsonb_build_object('text', 'Synthetic D2 event', 'origin_type', 'document_extraction',
         'source_ref', jsonb_build_object('kind', 'document', 'documentId', v_doc3, 'documentVersionId', v_v1)), null), true, null);
  select target_id into v_e2 from nyayos.user_corrections where id = v_c;
  perform nyayos.decide_proposal(nyayos.propose_change(v_d2, 'date_assertion', null, jsonb_build_object('target_type', 'event', 'target_id', v_e_in, 'value', '2026-08-01',
         'precision', 'approximate', 'origin_type', 'user_statement', 'source_ref', v_ue), null), true, null);
  update s set e1 = v_e1, ei1 = v_ei1, e_in = v_e_in, e2 = v_e2;
  insert into nyayos.consents (principal_user_id, tenant_id, scope_type, scope_id, purpose, notice_version, notice_language, method, request_id)
    values ('a1a1a1a1-0000-4000-8000-000000000001', (select ta from s), 'dispute', v_d1, 'storage', 'v1', 'en', 'click', 'synthetic-consent');
  update s set r1 = nyayos.request_deletion('dispute', v_d1);
  update s set r2 = nyayos.request_deletion('document', v_doc1);
  update s set r3 = nyayos.request_deletion('dispute', v_d2);
end $$;
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'b1b1b1b1-0000-4000-8000-000000000001';
update s set rb = nyayos.request_deletion('dispute', (select db1 from s));
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

-- ---------------------------------------------------------------- mutation fingerprint of every table (before)
create function pg_temp.fingerprint() returns text language plpgsql as $f$
declare r record; acc text := ''; h text;
begin
  for r in select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'nyayos' and c.relkind = 'r' order by c.relname loop
    execute format('select md5(coalesce(string_agg(md5(t::text), '','' order by md5(t::text)), '''')) from nyayos.%I t', r.relname) into h;
    acc := acc || r.relname || '=' || h || ';';
  end loop;
  return md5(acc);
end $f$;
create temp table fp (label text, v text);
insert into fp values ('before', pg_temp.fingerprint());

-- ---------------------------------------------------------------- enumerations (as the requesters)
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
insert into en select 'R1', * from nyayos.enumerate_deletion_scope((select r1 from s));
insert into en select 'R2_block', * from nyayos.enumerate_deletion_scope((select r2 from s));
insert into en select 'R3', * from nyayos.enumerate_deletion_scope((select r3 from s));
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'a2a2a2a2-0000-4000-8000-000000000002';
insert into en select 'RA2', * from nyayos.enumerate_deletion_scope((select ra2 from s));
reset role;
-- configuration variants (restored afterwards; the fingerprint includes config_provisional)
update nyayos.config_provisional set value = 'cascade' where key = 'document_reference_policy';
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
insert into en select 'R2_cascade', * from nyayos.enumerate_deletion_scope((select r2 from s));
reset role;
update nyayos.config_provisional set value = 'block' where key = 'document_reference_policy';
update nyayos.config_provisional set value = (select d2 from s)::text where key = 'legal_hold_dispute_ids';
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
insert into en select 'R3_held', * from nyayos.enumerate_deletion_scope((select r3 from s));
insert into en select 'R1_other_held', * from nyayos.enumerate_deletion_scope((select r1 from s));
reset role;
update nyayos.config_provisional set value = 'not-a-uuid' where key = 'legal_hold_dispute_ids';
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
insert into en select 'R1_bad_hold', * from nyayos.enumerate_deletion_scope((select r1 from s));
reset role;
update nyayos.config_provisional set value = '' where key = 'legal_hold_dispute_ids';
insert into fp values ('after', pg_temp.fingerprint());

create function pg_temp.has(q text, t text, id uuid, cls text) returns boolean language sql as $f$
  select exists (select 1 from en where en.req = q and en.table_name = t and en.record_id = id::text and en.classification = cls) $f$;
create function pg_temp.cnt(q text, t text) returns bigint language sql as $f$ select count(*) from en where en.req = q and en.table_name = t $f$;

-- ---------------------------------------------------------------- 1. completeness against an independent catalogue-driven oracle
do $$
declare r record; n int; missing int := 0; v_d1 uuid := (select d1 from s); v_ta uuid := (select ta from s);
begin
  for r in select c.table_name from information_schema.columns c
           where c.table_schema = 'nyayos' and c.column_name = 'dispute_id'
             and exists (select 1 from information_schema.columns i where i.table_schema = 'nyayos' and i.table_name = c.table_name and i.column_name = 'id') loop
    execute format('select count(*) from nyayos.%I x where x.dispute_id = $1 and not exists (select 1 from en where en.req = ''R1'' and en.table_name = %L and en.record_id = x.id::text)',
                   r.table_name, r.table_name) into n using v_d1;
    if n > 0 then raise notice 'oracle: % rows of % missing', n, r.table_name; end if;
    missing := missing + n;
  end loop;
  -- rows linked by foreign keys rather than a dispute_id column
  select missing + count(*) into missing from nyayos.document_versions v join nyayos.documents o on o.id = v.document_id
    where o.dispute_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'document_versions' and record_id = v.id::text);
  select missing + count(*) into missing from nyayos.document_locations l join nyayos.document_versions v on v.id = l.document_version_id join nyayos.documents o on o.id = v.document_id
    where o.dispute_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'document_locations' and record_id = l.id::text);
  select missing + count(*) into missing from nyayos.annotations l join nyayos.document_versions v on v.id = l.document_version_id join nyayos.documents o on o.id = v.document_id
    where o.dispute_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'annotations' and record_id = l.id::text);
  select missing + count(*) into missing from nyayos.custody_events ce join nyayos.documents o on o.id = ce.document_id
    where o.dispute_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'custody_events' and record_id = ce.id::text);
  select missing + count(*) into missing from nyayos.export_manifests m join nyayos.exports x on x.id = m.export_id
    where x.dispute_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'export_manifests' and record_id = m.export_id::text);
  select missing + count(*) into missing from nyayos.jobs j join nyayos.quarantine_uploads q on q.id = j.payload_ref
    where q.dispute_id = v_d1 and j.tenant_id = v_ta and not exists (select 1 from en where req = 'R1' and table_name = 'jobs' and record_id = j.id::text);
  select missing + count(*) into missing from nyayos.dispute_roles dr
    where dr.dispute_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'dispute_roles' and record_id = dr.dispute_id::text || ':' || dr.user_id::text);
  select missing + count(*) into missing from nyayos.consents c
    where c.scope_type = 'dispute' and c.scope_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'consents' and record_id = c.id::text);
  select missing + count(*) into missing from nyayos.deletion_requests q
    where q.scope_id = v_d1 and not exists (select 1 from en where req = 'R1' and table_name = 'deletion_requests' and record_id = q.id::text);
  if missing = 0 then raise notice 'CHECK M6_single_dispute_enumeration_complete_vs_oracle PASS';
  else raise notice 'CHECK M6_single_dispute_enumeration_complete_vs_oracle FAIL (% missing)', missing; end if;
end $$;
select 'CHECK M6_enumeration_covers_many_tables ' || case when (select count(distinct table_name) from en where req = 'R1') >= 25 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 2-7. inclusion of documents, versions, uploads, derivatives, exports, corrections
select 'CHECK M6_documents_included ' || case when pg_temp.has('R1', 'documents', (select doc1 from s), 'purge_candidate')
  and pg_temp.has('R1', 'documents', (select doc2 from s), 'purge_candidate') and pg_temp.cnt('R1', 'documents') = 3 then 'PASS' else 'FAIL' end;
select 'CHECK M6_document_versions_included ' || case when pg_temp.has('R1', 'document_versions', (select v1 from s), 'purge_candidate')
  and pg_temp.has('R1', 'document_versions', (select v2 from s), 'purge_candidate') and pg_temp.cnt('R1', 'document_versions') = 4 then 'PASS' else 'FAIL' end;
select 'CHECK M6_quarantine_uploads_included_for_dispute ' || case when pg_temp.has('R1', 'quarantine_uploads', (select up_a from s), 'purge_candidate')
  and pg_temp.has('R1', 'quarantine_uploads', (select up_b from s), 'purge_candidate')
  and pg_temp.has('R1', 'quarantine_uploads', (select up_x from s), 'purge_candidate') and pg_temp.cnt('R1', 'quarantine_uploads') = 3 then 'PASS' else 'FAIL' end;
select 'CHECK M6_quarantine_uploads_scoped_for_document ' || case when pg_temp.has('R2_block', 'quarantine_uploads', (select up_b from s), 'purge_candidate')
  and not exists (select 1 from en where req = 'R2_block' and record_id = (select up_x from s)::text) then 'PASS' else 'FAIL' end;
select 'CHECK M6_evidence_links_and_derivatives_included ' || case when
  pg_temp.cnt('R1', 'evidence_items') = 1 and pg_temp.cnt('R1', 'evidence_relations') = 1 and pg_temp.cnt('R1', 'date_assertions') = 1
  and pg_temp.cnt('R1', 'contradictions') = 1 and pg_temp.cnt('R1', 'document_locations') = 1 and pg_temp.cnt('R1', 'annotations') = 1
  and pg_temp.cnt('R1', 'custody_events') = 3 and pg_temp.cnt('R1', 'entity_source_forms') = 1 and pg_temp.cnt('R1', 'jobs') >= 3 then 'PASS' else 'FAIL' end;
select 'CHECK M6_exports_and_manifests_included ' || case when pg_temp.has('R1', 'exports', (select x1 from s), 'purge_candidate')
  and exists (select 1 from en where req = 'R1' and table_name = 'export_manifests' and record_id = (select x1 from s)::text and classification = 'purge_candidate') then 'PASS' else 'FAIL' end;
select 'CHECK M6_corrections_and_proposals_included ' || case when
  pg_temp.cnt('R1', 'proposals') = (select count(*) from nyayos.proposals where dispute_id = (select d1 from s))
  and pg_temp.cnt('R1', 'user_corrections') = (select count(*) from nyayos.user_corrections where dispute_id = (select d1 from s))
  and exists (select 1 from nyayos.proposals where dispute_id = (select d1 from s) and status = 'pending')
  and exists (select 1 from nyayos.proposals where dispute_id = (select d1 from s) and status = 'rejected') then 'PASS' else 'FAIL' end;
select 'CHECK M6_retained_and_configuration_classes_present ' || case when
  exists (select 1 from en where req = 'R1' and table_name = 'audit_events' and classification = 'retained_audit_metadata')
  and exists (select 1 from en where req = 'R1' and table_name = 'deletion_requests' and record_id = (select r1 from s)::text and classification = 'retained_audit_metadata')
  and exists (select 1 from en where req = 'R1' and table_name = 'consents' and classification = 'configuration_controlled') then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 8-9. isolation
create temp table foreign_ids as
  select x.id::text as id from nyayos.documents x where x.dispute_id in ((select d2 from s), (select db1 from s))
  union all select v.id::text from nyayos.document_versions v join nyayos.documents o on o.id = v.document_id where o.dispute_id in ((select d2 from s), (select db1 from s))
  union all select x.id::text from nyayos.events x where x.dispute_id in ((select d2 from s), (select db1 from s))
  union all select x.id::text from nyayos.date_assertions x where x.dispute_id = (select d2 from s)
  union all select x.id::text from nyayos.proposals x where x.dispute_id in ((select d2 from s), (select db1 from s))
  union all select x.id::text from nyayos.user_corrections x where x.dispute_id in ((select d2 from s), (select db1 from s))
  union all select x.id::text from nyayos.quarantine_uploads x where x.dispute_id = (select d2 from s)
  union all select x.id::text from nyayos.exports x where x.dispute_id = (select d2 from s)
  union all select x.id::text from nyayos.jobs x where x.tenant_id = (select tb from s)
  union all select x.id::text from nyayos.audit_events x where x.dispute_id in ((select d2 from s), (select db1 from s)) or x.tenant_id = (select tb from s)
  union all select (select d2 from s)::text union all select (select db1 from s)::text union all select (select tb from s)::text;
select 'CHECK M6_cross_dispute_records_excluded ' || case when not exists (
  select 1 from en where req in ('R1', 'R2_block', 'R2_cascade') and record_id in (select id from foreign_ids where id not in (select id::text from nyayos.jobs where tenant_id = (select tb from s))))
  then 'PASS' else 'FAIL' end;
select 'CHECK M6_cross_tenant_records_invisible ' || case when not exists (
  select 1 from en where req in ('R1', 'R2_block', 'R2_cascade', 'R3', 'RA2') and (record_id like '%' || (select tb from s)::text || '%'
    or record_id in (select id::text from nyayos.jobs where tenant_id = (select tb from s))
    or record_id in (select id::text from nyayos.events where dispute_id = (select db1 from s))))
  and exists (select 1 from en where req = 'R1' and table_name = 'jobs' and record_id is null and reason = 'ambiguous_job_tenant')
  then 'PASS' else 'FAIL' end;
do $$ declare m1 text; c1 text; m2 text; c2 text; m3 text; c3 text; begin
  execute 'set role nyayos_authenticated'; perform set_config('nyayos.principal_id', 'b1b1b1b1-0000-4000-8000-000000000001', false);
  begin perform * from nyayos.enumerate_deletion_scope((select r1 from s)); exception when others then m1 := sqlerrm; c1 := sqlstate; end;
  begin perform * from nyayos.enumerate_deletion_scope('00000000-0000-4000-8000-00000000abcd'); exception when others then m2 := sqlerrm; c2 := sqlstate; end;
  perform set_config('nyayos.principal_id', 'a1a1a1a1-0000-4000-8000-000000000001', false);
  begin perform * from nyayos.enumerate_deletion_scope((select rb from s)); exception when others then m3 := sqlerrm; c3 := sqlstate; end;
  execute 'reset role';
  if c1 = '42501' and c1 = c2 and c2 = c3 and m1 = m2 and m2 = m3
  then raise notice 'CHECK M6_nonexistent_and_inaccessible_indistinguishable PASS';
  else raise notice 'CHECK M6_nonexistent_and_inaccessible_indistinguishable FAIL (% % %)', c1, c2, c3; end if;
end $$;
select 'CHECK M6_clients_cannot_call_internal_refs_or_read_raw ' || case when
  not has_function_privilege('nyayos_authenticated', 'nyayos.deletion_document_refs_v1(uuid[])', 'execute')
  and has_function_privilege('nyayos_authenticated', 'nyayos.enumerate_deletion_scope(uuid)', 'execute')
  and (select prosecdef and proconfig::text like '%search_path=pg_catalog, nyayos%' from pg_proc where oid = 'nyayos.enumerate_deletion_scope(uuid)'::regprocedure)
  then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 10. shared or ambiguous records fail closed
select 'CHECK M6_document_referenced_from_other_dispute_blocked ' || case when
  exists (select 1 from en where req = 'R1' and table_name = 'documents' and record_id = (select doc3 from s)::text
          and classification = 'blocked_active_reference' and reason = 'referenced_from_another_scope')
  and not exists (select 1 from en where req = 'R1' and table_name = 'document_versions' and record_id in
          (select id::text from nyayos.document_versions where document_id = (select doc3 from s)) and classification <> 'blocked_active_reference')
  then 'PASS' else 'FAIL' end;
select 'CHECK M6_item_referenced_from_other_dispute_blocked ' || case when
  pg_temp.has('R1', 'events', (select e_in from s), 'blocked_active_reference') and pg_temp.has('R1', 'events', (select e1 from s), 'purge_candidate')
  then 'PASS' else 'FAIL' end;
select 'CHECK M6_upload_with_shared_hash_blocked ' || case when
  exists (select 1 from en where req = 'R2_block' and table_name = 'quarantine_uploads' and record_id = (select up_a from s)::text
          and classification = 'blocked_active_reference' and reason = 'ambiguous_shared_content_hash') then 'PASS' else 'FAIL' end;
select 'CHECK M6_shared_tenant_and_foreign_memberships_blocked ' || case when
  exists (select 1 from en where req = 'RA2' and table_name = 'tenants' and classification = 'blocked_active_reference' and reason = 'tenant_shared_with_other_members')
  and exists (select 1 from en where req = 'RA2' and table_name = 'tenant_memberships' and reason = 'shared_tenant_membership')
  and exists (select 1 from en where req = 'RA2' and table_name = 'tenant_memberships' and record_id is null and reason = 'membership_in_another_tenant')
  and exists (select 1 from en where req = 'RA2' and table_name = 'profiles' and classification = 'purge_candidate')
  and exists (select 1 from en where req = 'RA2' and table_name = 'platform_roles' and classification = 'configuration_controlled')
  and exists (select 1 from en where req = 'RA2' and table_name = 'disputes' and record_id = (select da2 from s)::text and classification = 'purge_candidate')
  then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 11. legal hold (manual configuration) classifies, never touches
select 'CHECK M6_legal_hold_classifies_held_dispute ' || case when
  not exists (select 1 from en where req = 'R3_held' and classification = 'purge_candidate')
  and exists (select 1 from en where req = 'R3_held' and classification = 'retained_legal_hold' and reason = 'legal_hold_configured')
  and exists (select 1 from en where req = 'R3' and classification = 'purge_candidate') then 'PASS' else 'FAIL' end;
select 'CHECK M6_legal_hold_does_not_spill_to_other_disputes ' || case when
  (select count(*) from en where req = 'R1_other_held' and classification = 'retained_legal_hold') = 0
  and (select count(*) from en where req = 'R1_other_held') = (select count(*) from en where req = 'R1') then 'PASS' else 'FAIL' end;
select 'CHECK M6_unreadable_legal_hold_fails_closed ' || case when
  not exists (select 1 from en where req = 'R1_bad_hold' and classification = 'purge_candidate')
  and exists (select 1 from en where req = 'R1_bad_hold' and reason = 'legal_hold_configuration_unreadable') then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 12. active reference: policy-controlled, never touched
select 'CHECK M6_block_policy_blocks_referenced_document ' || case when
  exists (select 1 from en where req = 'R2_block' and table_name = 'documents' and record_id = (select doc1 from s)::text
          and classification = 'blocked_active_reference' and reason = 'referenced_by_items_in_dispute')
  and exists (select 1 from en where req = 'R2_block' and table_name = 'document_versions' and reason = 'parent_document_blocked')
  and pg_temp.has('R2_block', 'evidence_items', (select ei1 from s), 'outside_request_scope')
  and exists (select 1 from en where req = 'R2_block' and table_name = 'export_manifests' and record_id = (select x1 from s)::text and classification = 'outside_request_scope')
  then 'PASS' else 'FAIL' end;
select 'CHECK M6_cascade_policy_is_configuration_controlled ' || case when
  pg_temp.has('R2_cascade', 'documents', (select doc1 from s), 'purge_candidate')
  and pg_temp.has('R2_cascade', 'evidence_items', (select ei1 from s), 'configuration_controlled')
  and pg_temp.has('R2_cascade', 'events', (select e1 from s), 'configuration_controlled') then 'PASS' else 'FAIL' end;
select 'CHECK M6_document_scope_never_includes_dispute_root ' || case when
  not exists (select 1 from en where req in ('R2_block', 'R2_cascade') and table_name = 'disputes') then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 13. zero mutation
select 'CHECK M6_no_mutation_fingerprint ' || case when (select v from fp where label = 'before') = (select v from fp where label = 'after') then 'PASS' else 'FAIL' end;
select 'CHECK M6_function_stable_and_writes_nothing ' || case when
  (select provolatile = 's' from pg_proc where oid = 'nyayos.enumerate_deletion_scope(uuid)'::regprocedure)
  and pg_get_functiondef('nyayos.enumerate_deletion_scope(uuid)'::regprocedure) !~* '\m(insert|update|delete|truncate|alter|drop)\M' then 'PASS' else 'FAIL' end;
select 'CHECK M6_graph_covers_every_table ' || case when not exists (
  select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'nyayos' and c.relkind = 'r'
    and c.relname not in (select table_name from nyayos.deletion_graph_v1())) then 'PASS' else 'FAIL' end;
select 'CHECK M6_output_classes_valid ' || case when not exists (select 1 from en where classification not in
  ('purge_candidate', 'retained_audit_metadata', 'retained_legal_hold', 'blocked_active_reference', 'outside_request_scope', 'configuration_controlled')) then 'PASS' else 'FAIL' end;
