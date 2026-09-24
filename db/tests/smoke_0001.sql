-- FM-A migration smoke test — synthetic data only, ephemeral local container.
-- Each CHECK line prints PASS/FAIL. Expected-denial cases are caught in DO blocks.
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned
-- scratch table owned by the superuser so every role in this script can read/write it
create temp table s (tenant_a uuid, dispute_a uuid, p1 uuid, c1 uuid, e1 uuid, p2 uuid, c2 uuid, del uuid);
insert into s default values;
grant all on s to public;

-- ---------------------------------------------------------------- user A signs up, creates a dispute
set role nyayos_authenticated;
set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
select 'CHECK sign_up_A ' || case when nyayos.sign_up_personal_tenant('Synthetic A', 'hi') is not null then 'PASS' else 'FAIL' end;
select 'CHECK sign_up_idempotent ' || case when (select count(*) from nyayos.tenants) = 1 and nyayos.sign_up_personal_tenant('Synthetic A', 'hi') = (select tenant_id from nyayos.tenant_memberships limit 1) then 'PASS' else 'FAIL' end;

update s set tenant_a = (select id from nyayos.tenants limit 1);

select 'CHECK create_dispute ' || case when nyayos.create_dispute((select tenant_a from s), 'Vendor payment dispute (synthetic)') is not null then 'PASS' else 'FAIL' end;
update s set dispute_a = (select id from nyayos.disputes limit 1);
select 'CHECK owner_role_row ' || case when (select dispute_role from nyayos.dispute_roles where dispute_id = (select dispute_a from s)) = 'dispute_owner' then 'PASS' else 'FAIL' end;
select 'CHECK is_dispute_member_owner ' || case when nyayos.is_dispute_member((select dispute_a from s), 'dispute_owner') then 'PASS' else 'FAIL' end;
select 'CHECK grant_allows_false ' || case when nyayos.grant_allows((select dispute_a from s), 'document:x', 'view') = false then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- single-writer: create item via proposal
update s set p1 = nyayos.propose_change((select dispute_a from s), 'event', null,
  '{"text":"Goods delivered (synthetic)","origin_type":"user_statement","source_ref":{"kind":"user_entry","enteredBy":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"},"confidence":"unknown"}'::jsonb, null);
select 'CHECK proposal_pending ' || case when (select status from nyayos.proposals where id = (select p1 from s)) = 'pending' then 'PASS' else 'FAIL' end;
update s set c1 = nyayos.decide_proposal((select p1 from s), true, null);
update s set e1 = (select id from nyayos.events where dispute_id = (select dispute_a from s));
select 'CHECK event_created_v1 ' || case when (select version from nyayos.events where id = (select e1 from s)) = 1 then 'PASS' else 'FAIL' end;
select 'CHECK correction_v1_prev_null ' || case when (select previous_value is null and resulting_version = 1 and target_id = (select e1 from s) from nyayos.user_corrections where id = (select c1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK proposal_accepted ' || case when (select status from nyayos.proposals where id = (select p1 from s)) = 'accepted' then 'PASS' else 'FAIL' end;

-- update via proposal → version 2, correction with previous value
update s set p2 = nyayos.propose_change((select dispute_a from s), 'event', (select e1 from s), '{"text":"Goods delivered on 14 July 2026 (synthetic)"}'::jsonb, 'date confirmed from invoice');
update s set c2 = nyayos.decide_proposal((select p2 from s), true, null);
select 'CHECK event_v2_text ' || case when (select version = 2 and text like 'Goods delivered on 14 July%' from nyayos.events where id = (select e1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK correction_v2_prev_has_old_text ' || case when (select previous_value->>'text' = 'Goods delivered (synthetic)' and resulting_version = 2 and reason = 'date confirmed from invoice' from nyayos.user_corrections where id = (select c2 from s)) then 'PASS' else 'FAIL' end;

-- direct UPDATE on a canonical table must be denied (AC-M1-03)
do $$ begin
  begin
    update nyayos.events set text = 'tampered' where true;
    raise notice 'CHECK direct_update_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK direct_update_denied PASS';
  end;
end $$;
do $$ begin
  begin
    insert into nyayos.events (tenant_id, dispute_id, text, origin_type, source_ref) values ((select tenant_a from s), (select dispute_a from s), 'x', 'user_statement', '{}');
    raise notice 'CHECK direct_insert_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK direct_insert_denied PASS';
  end;
end $$;
do $$ begin
  begin
    perform nyayos.decide_proposal((select p2 from s), true, null);
    raise notice 'CHECK decide_twice_refused FAIL';
  exception when check_violation then raise notice 'CHECK decide_twice_refused PASS';
  end;
end $$;
-- ai/reviewer origin cannot be inserted (CHECK constraint) — proposals has no direct grant either
do $$ begin
  begin
    insert into nyayos.proposals (tenant_id, dispute_id, target_type, proposed_value, origin, origin_ref) values ((select tenant_a from s), (select dispute_a from s), 'event', '{}', 'ai', 'x');
    raise notice 'CHECK ai_origin_blocked FAIL';
  exception when insufficient_privilege or check_violation then raise notice 'CHECK ai_origin_blocked PASS';
  end;
end $$;

-- consent: enforced purpose ok; locked purpose rejected; update denied
insert into nyayos.consents (principal_user_id, tenant_id, scope_type, scope_id, purpose, notice_version, notice_language, method, request_id)
  values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (select tenant_a from s), 'account', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'storage', '2026-09-v1', 'hi', 'click', 'req-1');
select 'CHECK consent_storage_ok ' || case when (select count(*) from nyayos.consents) = 1 then 'PASS' else 'FAIL' end;
do $$ begin
  begin
    insert into nyayos.consents (principal_user_id, tenant_id, scope_type, scope_id, purpose, notice_version, notice_language, method, request_id)
      values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (select tenant_a from s), 'account', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'model_improvement', 'v', 'hi', 'click', 'req-2');
    raise notice 'CHECK locked_purpose_rejected FAIL';
  exception when insufficient_privilege or check_violation then raise notice 'CHECK locked_purpose_rejected PASS';
  end;
end $$;
do $$ begin
  begin
    insert into nyayos.consents (principal_user_id, tenant_id, scope_type, scope_id, purpose, notice_version, notice_language, method, request_id)
      values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', (select tenant_a from s), 'account', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'ai_assistance', 'v', 'hi', 'click', 'req-3');
    raise notice 'CHECK reserved_purpose_rejected FAIL';
  exception when insufficient_privilege or check_violation then raise notice 'CHECK reserved_purpose_rejected PASS';
  end;
end $$;

-- ---------------------------------------------------------------- user B: cross-tenant isolation (SEC-TEN-01/02/04)
reset role;
set role nyayos_authenticated;
set nyayos.principal_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
select 'CHECK sign_up_B ' || case when nyayos.sign_up_personal_tenant('Synthetic B', 'en') is not null then 'PASS' else 'FAIL' end;
select 'CHECK B_sees_no_disputes ' || case when (select count(*) from nyayos.disputes) = 0 then 'PASS' else 'FAIL' end;
select 'CHECK B_sees_no_events ' || case when (select count(*) from nyayos.events) = 0 then 'PASS' else 'FAIL' end;
select 'CHECK B_sees_no_corrections ' || case when (select count(*) from nyayos.user_corrections) = 0 then 'PASS' else 'FAIL' end;
select 'CHECK B_sees_no_consents_of_A ' || case when (select count(*) from nyayos.consents) = 0 then 'PASS' else 'FAIL' end;
select 'CHECK B_sees_only_own_tenant ' || case when (select count(*) from nyayos.tenants) = 1 then 'PASS' else 'FAIL' end;
select 'CHECK B_not_member_of_A_dispute ' || case when nyayos.is_dispute_member((select dispute_a from s), 'dispute_viewer') = false then 'PASS' else 'FAIL' end;
do $$ begin
  begin
    perform nyayos.propose_change((select dispute_a from s), 'event', null, '{"text":"intruder"}'::jsonb, null);
    raise notice 'CHECK B_cannot_propose_on_A FAIL';
  exception when insufficient_privilege then raise notice 'CHECK B_cannot_propose_on_A PASS';
  end;
end $$;

-- anonymous: no grant at all
reset role;
set role nyayos_anon;
do $$ begin
  begin
    perform count(*) from nyayos.disputes;
    raise notice 'CHECK anon_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK anon_denied PASS';
  end;
end $$;

-- ---------------------------------------------------------------- audit chain (S7, SEC-HASH-05)
reset role;
set role nyayos_service_audit;
select nyayos.log_audit_event('user', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', null, (select tenant_a from s), (select dispute_a from s), 'proposal.accepted', 'proposal', (select p1 from s)::text, 'storage', 'success', 'info', 'req-10', null, 'mobile', jsonb_build_object('proposal_id', (select p1 from s)::text));
select nyayos.log_audit_event('user', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', null, (select tenant_a from s), (select dispute_a from s), 'correction.created', 'correction', (select c1 from s)::text, 'storage', 'success', 'info', 'req-11', null, 'mobile', '{}'::jsonb);
select nyayos.log_audit_event('service', 'scan_worker', null, (select tenant_a from s), null, 'document.scan_result', 'quarantine_upload', null, 'storage', 'success', 'info', 'req-12', null, 'service', '{"verdict":"clean"}'::jsonb);
select 'CHECK chain_linked ' || case when (select bool_and(ok) from (select prev_hash = lag(row_hash, 1, repeat('0',64)) over (order by seq) as ok from nyayos.audit_events) x) then 'PASS' else 'FAIL' end;
select 'CHECK chain_verifies ' || case when nyayos.verify_audit_chain() is null then 'PASS' else 'FAIL' end;
do $$ begin
  begin
    perform nyayos.log_audit_event('user', 'x', null, null, null, 'auth.sign_in', 'session', null, null, 'success', 'info', 'req-13', null, 'mobile', '{"email":"leak@example.com"}'::jsonb);
    raise notice 'CHECK audit_rejects_content_key FAIL';
  exception when check_violation then raise notice 'CHECK audit_rejects_content_key PASS';
  end;
end $$;
do $$ begin
  begin
    update nyayos.audit_events set outcome = 'denied' where true;
    raise notice 'CHECK audit_update_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK audit_update_denied PASS';
  end;
end $$;

-- non-audit role cannot write audit (SEC-RLS-04)
reset role;
set role nyayos_authenticated;
set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$ begin
  begin
    perform nyayos.log_audit_event('user', 'x', null, null, null, 'auth.sign_in', 'session', null, null, 'success', 'info', 'req-14', null, 'mobile', '{}'::jsonb);
    raise notice 'CHECK user_cannot_write_audit FAIL';
  exception when insufficient_privilege then raise notice 'CHECK user_cannot_write_audit PASS';
  end;
end $$;
select 'CHECK my_activity_own_rows_only ' || case when (select count(*) from nyayos.audit_events) = 2 then 'PASS' else 'FAIL' end;

-- tamper detection: superuser bypasses grants; trigger still blocks; disable trigger to simulate a raw tamper
reset role;
do $$ begin
  begin
    update nyayos.audit_events set outcome = 'denied' where seq = 2;
    raise notice 'CHECK audit_trigger_blocks_superuser_update FAIL';
  exception when insufficient_privilege then raise notice 'CHECK audit_trigger_blocks_superuser_update PASS';
  end;
end $$;
alter table nyayos.audit_events disable trigger audit_events_forbid_update;
update nyayos.audit_events set outcome = 'denied' where seq = 2;
select 'CHECK tamper_detected_at_seq2 ' || case when nyayos.verify_audit_chain() = 2 then 'PASS' else 'FAIL' end;
alter table nyayos.audit_events enable trigger audit_events_forbid_update;

-- tenant immutability
do $$ begin
  begin
    update nyayos.tenants set type = 'organization' where true;
    raise notice 'CHECK tenant_type_immutable FAIL';
  exception when check_violation then raise notice 'CHECK tenant_type_immutable PASS';
  end;
end $$;

-- schema facts
select 'CHECK all_tables_forced_rls ' || case when (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='nyayos' and c.relkind='r' and not (c.relrowsecurity and c.relforcerowsecurity)) = 0 then 'PASS' else 'FAIL' end;
select 'CHECK table_count_39 ' || case when (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='nyayos' and c.relkind='r') = 39 then 'PASS' else 'FAIL' end;
select 'CHECK allowlist_39 ' || case when (select count(*) from nyayos.deletion_allowlist) = 39 then 'PASS' else 'FAIL' end;
-- ---------------------------------------------------------------- A-033 fix pack checks
-- C-2: deletion requests only through request_deletion(), scope ownership verified, undo window from config
set role nyayos_authenticated; set nyayos.principal_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
do $$ begin
  begin
    insert into nyayos.deletion_requests (tenant_id, scope_type, scope_id, requested_by, undo_until)
      select tenant_id, 'dispute', (select dispute_a from s), 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', now() - interval '1 day'
      from nyayos.tenant_memberships where user_id = nyayos.current_user_id();
    raise notice 'CHECK C2_direct_insert_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_direct_insert_denied PASS';
  end;
end $$;
do $$ begin
  begin
    perform nyayos.request_deletion('dispute', (select dispute_a from s));
    raise notice 'CHECK C2_B_cannot_request_deletion_of_A_dispute FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_B_cannot_request_deletion_of_A_dispute PASS';
  end;
end $$;
do $$ begin
  begin
    perform nyayos.request_deletion('account', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
    raise notice 'CHECK C2_account_deletion_only_for_self FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_account_deletion_only_for_self PASS';
  end;
end $$;
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
update s set del = nyayos.request_deletion('dispute', (select dispute_a from s));
select 'CHECK C2_owner_request_uses_config_window ' || case when
  (select undo_until between now() + interval '6 days 23 hours' and now() + interval '7 days 1 hour'
     from nyayos.deletion_requests where id = (select del from s))
  then 'PASS' else 'FAIL' end;
select 'CHECK C2_request_row_scoped_to_owner_tenant ' || case when
  (select count(*) from nyayos.deletion_requests r where r.scope_id = (select dispute_a from s)
     and r.tenant_id = (select tenant_a from s) and r.requested_by = nyayos.current_user_id()) = 1 then 'PASS' else 'FAIL' end;

-- M-4: identity fields are server-set; AI origin inert; provenance reference must be well-formed
do $$ begin
  begin
    perform nyayos.decide_proposal(nyayos.propose_change((select dispute_a from s), 'dispute_statement', null,
      '{"kind":"narrative","text":"x","created_by":"cccccccc-cccc-4ccc-8ccc-cccccccccccc"}'::jsonb, null), true, null);
    raise notice 'CHECK M4_created_by_key_refused FAIL';
  exception when check_violation then raise notice 'CHECK M4_created_by_key_refused PASS';
  end;
end $$;
do $$
declare cid uuid; who uuid;
begin
  cid := nyayos.decide_proposal(nyayos.propose_change((select dispute_a from s), 'dispute_statement', null,
    '{"kind":"narrative","text":"my own words"}'::jsonb, null), true, null);
  select created_by into who from nyayos.dispute_statements where dispute_id = (select dispute_a from s) and text = 'my own words';
  if who = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' then raise notice 'CHECK M4_created_by_forced_to_caller PASS';
  else raise notice 'CHECK M4_created_by_forced_to_caller FAIL (%)', who; end if;
end $$;
do $$ begin
  begin
    perform nyayos.decide_proposal(nyayos.propose_change((select dispute_a from s), 'event', null,
      '{"text":"e","origin_type":"ai_extraction","source_ref":{"kind":"user_entry","enteredBy":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"}}'::jsonb, null), true, null);
    raise notice 'CHECK M4_ai_extraction_origin_refused FAIL';
  exception when check_violation then raise notice 'CHECK M4_ai_extraction_origin_refused PASS';
  end;
end $$;
do $$ begin
  begin
    perform nyayos.decide_proposal(nyayos.propose_change((select dispute_a from s), 'event', null,
      '{"text":"e","origin_type":"user_statement","source_ref":{}}'::jsonb, null), true, null);
    raise notice 'CHECK M4_empty_source_ref_refused FAIL';
  exception when check_violation then raise notice 'CHECK M4_empty_source_ref_refused PASS';
  end;
end $$;
do $$ begin
  begin
    perform nyayos.decide_proposal(nyayos.propose_change((select dispute_a from s), 'event', null,
      '{"text":"e","origin_type":"user_statement"}'::jsonb, null), true, null);
    raise notice 'CHECK M4_missing_source_ref_refused FAIL';
  exception when not_null_violation or check_violation then raise notice 'CHECK M4_missing_source_ref_refused PASS';
  end;
end $$;
reset role;
select 'CHECK M4_source_ref_shape_constraints_present ' || case when
  (select count(*) from pg_constraint where conname like '%_source_ref_shape') = 11 then 'PASS' else 'FAIL' end;
select 'CHECK M4_fma_origin_inert_constraints_present ' || case when
  (select count(*) from pg_constraint where conname like '%_fma_origin_inert') = 10 then 'PASS' else 'FAIL' end;
-- C-1: the writer trigger takes a transaction-scoped advisory lock (two-session proof: db/tests/audit_concurrency_0001.sh)
select 'CHECK C1_advisory_lock_in_audit_trigger ' || case when
  position('pg_advisory_xact_lock' in pg_get_functiondef('nyayos.tg_audit_before_insert'::regproc)) > 0 then 'PASS' else 'FAIL' end;
-- A-033-R (requires 0004): chain position taken under the lock; forks structurally impossible
select 'CHECK C1R_seq_assigned_under_lock ' || case when
  position('pg_advisory_xact_lock' in pg_get_functiondef('nyayos.tg_audit_before_insert'::regproc))
    < position('new.seq := nextval' in pg_get_functiondef('nyayos.tg_audit_before_insert'::regproc)) then 'PASS' else 'FAIL' end;
select 'CHECK C1R_prev_hash_unique_index ' || case when exists (select 1 from pg_indexes where schemaname = 'nyayos'
  and indexname = 'audit_events_prev_hash_unique' and indexdef like 'CREATE UNIQUE INDEX%') then 'PASS' else 'FAIL' end;
select 'CHECK C1R_trigger_not_security_definer ' || case when
  (select not prosecdef from pg_proc where oid = 'nyayos.tg_audit_before_insert'::regproc) then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- A-036 Duplicate Detection V1 (requires 0002)
reset role; set role nyayos_service_promote;
insert into nyayos.documents (id, tenant_id, dispute_id, display_label) select gen_random_uuid(), tenant_a, dispute_a, 'Invoice (second copy)' from s;
insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
  select id, 1, repeat('d', 64), 10, 'application/pdf', 'invoice2.pdf', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'clean', 'p2' from nyayos.documents where display_label = 'Invoice (second copy)';
insert into nyayos.documents (id, tenant_id, dispute_id, display_label) select gen_random_uuid(), tenant_a, dispute_a, 'Invoice (third copy)' from s;
insert into nyayos.document_versions (document_id, version, sha256, size_bytes, sniffed_mime, original_filename, uploader_id, scan_result, storage_path)
  select id, 1, repeat('d', 64), 10, 'application/pdf', 'invoice3.pdf', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'clean', 'p3' from nyayos.documents where display_label = 'Invoice (third copy)';
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
select 'CHECK DUP_owner_sees_both_identical_versions ' || case when (select count(*) from nyayos.find_duplicate_versions(repeat('d', 64))) = 2 then 'PASS' else 'FAIL' end;
select 'CHECK DUP_hex_case_insensitive ' || case when (select count(*) from nyayos.find_duplicate_versions(upper(repeat('d', 64)))) = 2 then 'PASS' else 'FAIL' end;
select 'CHECK DUP_unknown_hash_no_match ' || case when (select count(*) from nyayos.find_duplicate_versions(repeat('e', 64))) = 0 then 'PASS' else 'FAIL' end;
select 'CHECK DUP_labels_returned_for_user ' || case when (select string_agg(display_label, ',' order by display_label) from nyayos.find_duplicate_versions(repeat('d', 64))) = 'Invoice (second copy),Invoice (third copy)' then 'PASS' else 'FAIL' end;
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
select 'CHECK DUP_other_tenant_sees_nothing ' || case when (select count(*) from nyayos.find_duplicate_versions(repeat('d', 64))) = 0 then 'PASS' else 'FAIL' end;
reset role;
select 'CHECK DUP_index_present ' || case when exists (select 1 from pg_indexes where schemaname = 'nyayos' and indexname = 'document_versions_sha256_idx') then 'PASS' else 'FAIL' end;
select 'CHECK DUP_mode_inform_only ' || case when (select value from nyayos.config_provisional where key = 'duplicate_detection_mode') = 'inform' then 'PASS' else 'FAIL' end;
select 'CHECK DUP_originals_untouched ' || case when (select count(*) from nyayos.document_versions where sha256 = repeat('d', 64)) = 2 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- A-037 Stale Output Detection V1 (requires 0003)
-- Synthetic data only. Exports are written by the superuser here because no export service exists yet.
set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$
declare pid uuid; eid uuid; d2 uuid;
begin
  pid := nyayos.propose_change((select dispute_a from s), 'event', null,
    '{"text":"stale-probe event","origin_type":"user_statement","source_ref":{"kind":"user_entry","enteredBy":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"}}'::jsonb, null);
  perform nyayos.decide_proposal(pid, true, null);
  select id into eid from nyayos.events where text = 'stale-probe event';
  pid := nyayos.propose_change((select dispute_a from s), 'event', eid, '{"text":"stale-probe event (corrected)"}'::jsonb, 'synthetic correction');
  perform nyayos.decide_proposal(pid, true, null);
  d2 := nyayos.create_dispute((select tenant_a from s), 'Stale probe second dispute');
  pid := nyayos.propose_change(d2, 'event', null,
    '{"text":"other-dispute event","origin_type":"user_statement","source_ref":{"kind":"user_entry","enteredBy":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"}}'::jsonb, null);
  perform nyayos.decide_proposal(pid, true, null);
end $$;

reset role;
do $$
declare
  v_da uuid := (select dispute_a from s);
  v_ta uuid := (select tenant_a from s);
  v_e1 uuid := (select e1 from s);
  v_v1 int := (select version from nyayos.events where id = (select e1 from s));
  v_ep uuid := (select id from nyayos.events where text like 'stale-probe event%');
  v_eo uuid := (select id from nyayos.events where text = 'other-dispute event');
  v_d2 uuid := (select dispute_id from nyayos.events where text = 'other-dispute event');
  v_doc uuid := (select id from nyayos.documents where display_label = 'Invoice (second copy)');
  x text;
begin
  foreach x in array array['1','2','3','4','5','6'] loop
    insert into nyayos.exports (id, tenant_id, dispute_id, version, included_sections, generated_by, manifest_sha256, storage_path)
      values (('37000000-0000-4000-8000-00000000000' || x)::uuid, v_ta, v_da, x::int, array['manifest'],
              'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', repeat('f', 64), 'synthetic/' || x);
  end loop;
  insert into nyayos.export_manifests (export_id, entries) values
    ('37000000-0000-4000-8000-000000000001', jsonb_build_object('disputeId', v_da, 'items',
       jsonb_build_array(jsonb_build_object('targetType','event','targetId',v_e1,'version',v_v1,'sourceRef','user_entry:a')),
       'documents', jsonb_build_array(jsonb_build_object('documentId',v_doc,'version',1)))),
    ('37000000-0000-4000-8000-000000000002', jsonb_build_object('disputeId', v_da, 'items',
       jsonb_build_array(jsonb_build_object('targetType','event','targetId',v_e1,'version',v_v1 - 1,'sourceRef','user_entry:a')),
       'documents', '[]'::jsonb)),
    ('37000000-0000-4000-8000-000000000003', jsonb_build_object('disputeId', v_da, 'items',
       jsonb_build_array(jsonb_build_object('targetType','event','targetId',v_e1,'version',v_v1 - 1),
                         jsonb_build_object('targetType','event','targetId',v_ep,'version',1)),
       'documents', jsonb_build_array(jsonb_build_object('documentId',v_doc,'version',1)))),
    ('37000000-0000-4000-8000-000000000004', jsonb_build_object('disputeId', v_da, 'items',
       jsonb_build_array(
         jsonb_build_object('targetType','event','targetId','00000000-0000-4000-8000-0000000000aa','version',1),
         jsonb_build_object('targetType','event','targetId',v_e1,'version','two'),
         jsonb_build_object('targetType','dispute_statement','targetId',v_e1,'version',1),
         jsonb_build_object('targetType','event','targetId',v_e1,'version',99),
         jsonb_build_object('targetType','event','version',1),
         jsonb_build_object('targetType','event','targetId',v_eo,'version',1)),
       'documents', '[]'::jsonb)),
    ('37000000-0000-4000-8000-000000000005', '{"items": "not-an-array"}'::jsonb),
    ('37000000-0000-4000-8000-000000000006', jsonb_build_object('disputeId', v_d2, 'items',
       jsonb_build_array(jsonb_build_object('targetType','event','targetId',v_eo,'version',1)), 'documents', '[]'::jsonb));
end $$;

create function pg_temp.stale_fp() returns text language sql as $f$
  select md5(
    coalesce((select string_agg(id::text || ':' || version || ':' || text, ',' order by id) from nyayos.events), '') ||
    coalesce((select string_agg(export_id::text || ':' || entries::text, ',' order by export_id) from nyayos.export_manifests), '') ||
    coalesce((select string_agg(id::text || ':' || manifest_sha256 || ':' || storage_path, ',' order by id) from nyayos.exports), '') ||
    coalesce((select string_agg(id::text || ':' || current_version || ':' || status, ',' order by id) from nyayos.documents), '') ||
    (select count(*) from nyayos.user_corrections)::text || ':' ||
    (select count(*) from nyayos.proposals)::text || ':' ||
    (select count(*) from nyayos.document_versions)::text || ':' ||
    (select count(*) from nyayos.audit_events)::text)
$f$;
alter table s add column if not exists fp text;
update s set fp = pg_temp.stale_fp();

set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
select 'CHECK STALE_current_manifest_is_CURRENT ' || case when
  (select count(*) = 3 and bool_and(status = 'CURRENT') from nyayos.export_staleness('37000000-0000-4000-8000-000000000001')) then 'PASS' else 'FAIL' end;
select 'CHECK STALE_older_version_is_STALE ' || case when
  (select status = 'STALE' and reason = 'newer_version' and current_version = recorded_version + 1 and source_ref = 'user_entry:a' and review_ref like 'event:%'
     from nyayos.export_staleness('37000000-0000-4000-8000-000000000002') where entry_kind = 'item') then 'PASS' else 'FAIL' end;
select 'CHECK STALE_multiple_items_all_reported ' || case when
  (select count(*) filter (where status = 'STALE') = 2 and count(*) filter (where entry_kind = 'document' and status = 'CURRENT') = 1
     from nyayos.export_staleness('37000000-0000-4000-8000-000000000003')) then 'PASS' else 'FAIL' end;
select 'CHECK STALE_missing_is_UNKNOWN ' || case when
  (select status = 'UNKNOWN' and reason = 'not_found_or_inaccessible' and current_version is null
     from nyayos.export_staleness('37000000-0000-4000-8000-000000000004') where item_id = '00000000-0000-4000-8000-0000000000aa') then 'PASS' else 'FAIL' end;
select 'CHECK STALE_malformed_version_fails_safe ' || case when
  (select count(*) filter (where reason = 'malformed_recorded_version') = 1
      and count(*) filter (where reason = 'malformed_entry') = 1
      and count(*) filter (where reason = 'unsupported_item_type') = 1
      and count(*) filter (where reason = 'recorded_version_ahead') = 1
      and count(*) filter (where entry_kind <> 'manifest' and status <> 'UNKNOWN') = 0
     from nyayos.export_staleness('37000000-0000-4000-8000-000000000004')) then 'PASS' else 'FAIL' end;
select 'CHECK STALE_malformed_manifest_is_UNKNOWN ' || case when
  (select count(*) = 1 and bool_and(status = 'UNKNOWN' and reason = 'malformed_manifest')
     from nyayos.export_staleness('37000000-0000-4000-8000-000000000005')) then 'PASS' else 'FAIL' end;
select 'CHECK STALE_other_dispute_record_does_not_leak ' || case when
  (select status = 'UNKNOWN' and reason = 'not_found_or_inaccessible' and current_version is null
     from nyayos.export_staleness('37000000-0000-4000-8000-000000000004')
     where item_id = (select id::text from nyayos.events where text = 'other-dispute event')) then 'PASS' else 'FAIL' end;
select 'CHECK STALE_dispute_mismatch_not_assessed ' || case when
  (select count(*) = 1 and bool_and(entry_kind = 'manifest' and reason = 'dispute_mismatch')
     from nyayos.export_staleness('37000000-0000-4000-8000-000000000006')) then 'PASS' else 'FAIL' end;

reset role; set role nyayos_authenticated; set nyayos.principal_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
select 'CHECK STALE_other_tenant_sees_no_rows ' || case when
  (select count(*) from nyayos.export_staleness('37000000-0000-4000-8000-000000000002')) = 0 then 'PASS' else 'FAIL' end;
select 'CHECK STALE_nonexistent_indistinguishable ' || case when
  (select count(*) from nyayos.export_staleness('37000000-0000-4000-8000-0000000000ff')) = 0 then 'PASS' else 'FAIL' end;

reset role;
select 'CHECK STALE_no_mutation ' || case when (select fp from s) = pg_temp.stale_fp() then 'PASS' else 'FAIL' end;
select 'CHECK STALE_function_invoker_and_stable ' || case when
  (select not prosecdef and provolatile = 's' from pg_proc where oid = 'nyayos.export_staleness(uuid)'::regprocedure) then 'PASS' else 'FAIL' end;
select 'CHECK STALE_function_has_no_writes ' || case when
  pg_get_functiondef('nyayos.export_staleness(uuid)'::regprocedure) !~* '\m(insert|update|delete|truncate)\M' then 'PASS' else 'FAIL' end;

select 'CHECK no_authenticated_write_grant_on_canonical ' || case when (select count(*) from information_schema.role_table_grants where table_schema='nyayos' and grantee='nyayos_authenticated' and privilege_type in ('INSERT','UPDATE','DELETE') and table_name in ('dispute_statements','entities','entity_source_forms','events','date_assertions','propositions','evidence_items','evidence_relations','contradictions','missing_evidence','issues','next_steps','user_corrections','audit_events','document_versions')) = 0 then 'PASS' else 'FAIL' end;
