-- A-038 M-7 (founder decision D-031): a canonical write and its audit event commit or roll back
-- together. Disposable container only; synthetic data only; migrations 0001-0005 applied.
-- Fault injection (a temporary failing trigger on audit_events) is created and dropped by the
-- superuser inside this script and never exists in any migration.
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

create temp table w (tenant uuid, dispute uuid, p1 uuid, c1 uuid, p2 uuid, rid uuid, event_id uuid, v_before int);
insert into w default values;
grant all on w to public;
create function pg_temp.n(req text) returns bigint language sql as $f$ select count(*) from nyayos.audit_events where request_id = req $f$;

-- ---------------------------------------------------------------- 1. every successful server write commits with exactly its audit event(s)
set role nyayos_authenticated; set nyayos.principal_id = 'a7a7a7a7-0000-4000-8000-000000000001';
set nyayos.request_id = 'atom-signup';
update w set tenant = nyayos.sign_up_personal_tenant('Synthetic atomicity', 'en');
set nyayos.request_id = 'atom-signup-again';
select nyayos.sign_up_personal_tenant('Synthetic atomicity', 'en') is not null;
set nyayos.request_id = 'atom-create';
update w set dispute = nyayos.create_dispute((select tenant from w), 'Synthetic atomicity dispute');
set nyayos.request_id = 'atom-propose';
update w set p1 = nyayos.propose_change((select dispute from w), 'event', null,
  '{"text":"Synthetic atomic event","origin_type":"user_statement","source_ref":{"kind":"user_entry","enteredBy":"a7a7a7a7-0000-4000-8000-000000000001"}}'::jsonb, null);
set nyayos.request_id = 'atom-accept';
update w set c1 = nyayos.decide_proposal((select p1 from w), true, null);
set nyayos.request_id = 'atom-propose-2';
update w set p2 = nyayos.propose_change((select dispute from w), 'event', null,
  '{"text":"Synthetic atomic event 2","origin_type":"user_statement","source_ref":{"kind":"user_entry","enteredBy":"a7a7a7a7-0000-4000-8000-000000000001"}}'::jsonb, null);
set nyayos.request_id = 'atom-reject';
select nyayos.decide_proposal((select p2 from w), false, 'synthetic') is null;
set nyayos.request_id = 'atom-delete';
update w set rid = nyayos.request_deletion('dispute', (select dispute from w));
reset role;
update w set event_id = (select id from nyayos.events where text = 'Synthetic atomic event');

select 'CHECK ATOM_signup_writes_one_audit_event ' || case when pg_temp.n('atom-signup') = 1 and exists (select 1 from nyayos.audit_events
  where request_id = 'atom-signup' and action = 'membership.added' and tenant_id = (select tenant from w)
    and actor_type = 'user' and actor_id = 'a7a7a7a7-0000-4000-8000-000000000001') then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_idempotent_signup_writes_nothing ' || case when pg_temp.n('atom-signup-again') = 0 then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_create_dispute_with_audit ' || case when pg_temp.n('atom-create') = 1 and exists (select 1 from nyayos.audit_events
  where request_id = 'atom-create' and action = 'dispute.created' and resource_id = (select dispute from w)::text
    and dispute_id = (select dispute from w) and tenant_id = (select tenant from w)) then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_propose_with_audit ' || case when pg_temp.n('atom-propose') = 1 and exists (select 1 from nyayos.audit_events
  where request_id = 'atom-propose' and action = 'proposal.created' and metadata ->> 'proposal_id' = (select p1 from w)::text) then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_accept_with_two_audit_events ' || case when pg_temp.n('atom-accept') = 2
  and exists (select 1 from nyayos.audit_events where request_id = 'atom-accept' and action = 'proposal.accepted' and metadata ->> 'correction_id' = (select c1 from w)::text)
  and exists (select 1 from nyayos.audit_events where request_id = 'atom-accept' and action = 'correction.created'
              and metadata ->> 'target_id' = (select event_id from w)::text and (metadata ->> 'version')::int = 1) then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_reject_with_audit ' || case when pg_temp.n('atom-reject') = 1 and exists (select 1 from nyayos.audit_events
  where request_id = 'atom-reject' and action = 'proposal.rejected') then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_deletion_request_with_audit ' || case when pg_temp.n('atom-delete') = 1 and exists (select 1 from nyayos.audit_events
  where request_id = 'atom-delete' and action = 'deletion.requested' and metadata ->> 'deletion_request_id' = (select rid from w)::text) then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 2. forced audit failure rolls back the canonical write
create function pg_temp.force_audit_failure() returns trigger language plpgsql as $f$
begin raise exception 'A-038 injected audit failure' using errcode = 'P0001'; end $f$;
create trigger zz_a038_force_audit_failure before insert on nyayos.audit_events
  for each row execute function pg_temp.force_audit_failure();
update w set v_before = (select version from nyayos.events where id = (select event_id from w));
\set ON_ERROR_STOP off
set role nyayos_authenticated; set nyayos.principal_id = 'a7a7a7a7-0000-4000-8000-000000000001';
set nyayos.request_id = 'atom-forced-create';
select nyayos.create_dispute((select tenant from w), 'atom forced failure dispute');
set nyayos.request_id = 'atom-forced-propose';
select nyayos.propose_change((select dispute from w), 'event', (select event_id from w), '{"text":"should never commit"}'::jsonb, null);
reset role;
\set ON_ERROR_STOP on
-- a proposal created while audit works, then decided while audit fails
drop trigger zz_a038_force_audit_failure on nyayos.audit_events;
set role nyayos_authenticated; set nyayos.principal_id = 'a7a7a7a7-0000-4000-8000-000000000001';
set nyayos.request_id = 'atom-forced-setup';
update w set p2 = nyayos.propose_change((select dispute from w), 'event', (select event_id from w), '{"text":"accept must roll back"}'::jsonb, null);
reset role;
create trigger zz_a038_force_audit_failure before insert on nyayos.audit_events
  for each row execute function pg_temp.force_audit_failure();
\set ON_ERROR_STOP off
set role nyayos_authenticated; set nyayos.principal_id = 'a7a7a7a7-0000-4000-8000-000000000001';
set nyayos.request_id = 'atom-forced-accept';
select nyayos.decide_proposal((select p2 from w), true, null);
reset role;
\set ON_ERROR_STOP on
drop trigger zz_a038_force_audit_failure on nyayos.audit_events;

select 'CHECK ATOM_forced_audit_failure_no_dispute ' || case when
  not exists (select 1 from nyayos.disputes where title = 'atom forced failure dispute')
  and not exists (select 1 from nyayos.dispute_roles dr join nyayos.disputes d on d.id = dr.dispute_id where d.title = 'atom forced failure dispute')
  then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_forced_audit_failure_no_proposal ' || case when
  not exists (select 1 from nyayos.proposals where proposed_value ->> 'text' = 'should never commit') then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_forced_audit_failure_decide_fully_rolled_back ' || case when
  (select status from nyayos.proposals where id = (select p2 from w)) = 'pending'
  and (select version from nyayos.events where id = (select event_id from w)) = (select v_before from w)
  and (select text from nyayos.events where id = (select event_id from w)) = 'Synthetic atomic event'
  and not exists (select 1 from nyayos.user_corrections where origin_proposal_id = (select p2 from w)) then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_forced_audit_failure_left_no_audit_rows ' || case when
  pg_temp.n('atom-forced-create') + pg_temp.n('atom-forced-propose') + pg_temp.n('atom-forced-accept') = 0 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 3. failed canonical write leaves no audit event
\set ON_ERROR_STOP off
set role nyayos_authenticated; set nyayos.principal_id = 'a7a7a7a7-0000-4000-8000-000000000001';
set nyayos.request_id = 'atom-canon-fail';
-- proposal whose accepted value violates a canonical CHECK (empty provenance reference)
update w set p2 = nyayos.propose_change((select dispute from w), 'event', null, '{"text":"bad provenance","origin_type":"user_statement","source_ref":{}}'::jsonb, null);
select nyayos.decide_proposal((select p2 from w), true, null);
-- multi-statement transaction: first write (and its audit event) succeeds, a later canonical write fails
set nyayos.request_id = 'atom-txn';
begin;
select nyayos.create_dispute((select tenant from w), 'atom txn dispute');
select nyayos.decide_proposal('00000000-0000-4000-8000-00000000dead', true, null);
commit;
reset role;
\set ON_ERROR_STOP on

select 'CHECK ATOM_canonical_failure_no_accept_audit ' || case when not exists (select 1 from nyayos.audit_events
  where request_id = 'atom-canon-fail' and action in ('proposal.accepted', 'correction.created')) then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_canonical_failure_proposal_still_pending ' || case when
  (select status from nyayos.proposals where id = (select p2 from w)) = 'pending' then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_failed_transaction_leaves_no_audit_or_dispute ' || case when pg_temp.n('atom-txn') = 0
  and not exists (select 1 from nyayos.disputes where title = 'atom txn dispute') then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 4. no client path to the internal writer; audit fields are server-derived
set role nyayos_authenticated; set nyayos.principal_id = 'a7a7a7a7-0000-4000-8000-000000000001';
do $$ begin
  begin perform nyayos.audit_append_internal('dispute.created', 'dispute', 'x', null, null, null, '{}'::jsonb);
    raise notice 'CHECK ATOM_client_cannot_call_internal_writer FAIL';
  exception when insufficient_privilege then raise notice 'CHECK ATOM_client_cannot_call_internal_writer PASS'; end;
  begin insert into nyayos.audit_events (actor_type, actor_id, action, resource_type, outcome, request_id, prev_hash, row_hash)
      values ('user', 'forged', 'dispute.created', 'dispute', 'success', 'forged', repeat('0', 64), repeat('0', 64));
    raise notice 'CHECK ATOM_client_cannot_insert_audit_directly FAIL';
  exception when insufficient_privilege then raise notice 'CHECK ATOM_client_cannot_insert_audit_directly PASS'; end;
end $$;
reset role; set role nyayos_service_audit;
do $$ begin
  begin perform nyayos.audit_append_internal('dispute.created', 'dispute', 'x', null, null, null, '{}'::jsonb);
    raise notice 'CHECK ATOM_service_role_cannot_call_internal_writer FAIL';
  exception when insufficient_privilege then raise notice 'CHECK ATOM_service_role_cannot_call_internal_writer PASS'; end;
end $$;
reset role;
select 'CHECK ATOM_server_function_signatures_have_no_audit_parameters ' || case when
  (select string_agg(p.proname || '/' || p.pronargs, ',' order by p.proname) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'nyayos' and p.proname in ('sign_up_personal_tenant','create_dispute','propose_change','decide_proposal','request_deletion'))
  = 'create_dispute/3,decide_proposal/3,propose_change/5,request_deletion/2,sign_up_personal_tenant/2' then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_every_atom_event_actor_is_session_principal ' || case when not exists (select 1 from nyayos.audit_events
  where request_id like 'atom-%' and actor_id <> 'a7a7a7a7-0000-4000-8000-000000000001') then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_no_injected_trigger_left ' || case when not exists (select 1 from pg_trigger where tgname like 'zz_a038%') then 'PASS' else 'FAIL' end;
select 'CHECK ATOM_chain_intact_after_rollbacks ' || case when nyayos.verify_audit_chain() is null then 'PASS' else 'FAIL' end;
