-- A-042 m-1: dispute status is server-controlled. Clients cannot update it directly; it follows the
-- deletion workflow only (request → deletion_requested, undo → active), audited in the same transaction.
-- FRESH disposable container with migrations applied. Synthetic data only. Every line prints CHECK … PASS|FAIL.
-- Run against migrations 0001-0007 it reproduces m-1 (the direct-update checks FAIL); against 0001-0008 all PASS.
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

create temp table s (ta uuid, tb uuid, d1 uuid, d2 uuid, d3 uuid, d4 uuid, db1 uuid, doc4 uuid, up3 uuid,
  r1 uuid, r2a uuid, r2b uuid, r3 uuid, rdoc uuid);
insert into s default values;
grant all on s to public;
create temp table flags (k text, v text);
grant all on flags to public;

-- ---------------------------------------------------------------- fixture
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update s set ta = nyayos.sign_up_personal_tenant('Synthetic A', 'en');
update s set d1 = nyayos.create_dispute((select ta from s), 'Synthetic D1');
update s set d2 = nyayos.create_dispute((select ta from s), 'Synthetic D2');
update s set d3 = nyayos.create_dispute((select ta from s), 'Synthetic D3');
update s set d4 = nyayos.create_dispute((select ta from s), 'Synthetic D4');
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'b1b1b1b1-0000-4000-8000-000000000001';
update s set tb = nyayos.sign_up_personal_tenant('Synthetic B', 'en');
update s set db1 = nyayos.create_dispute((select tb from s), 'Synthetic B1');
reset role;
-- same-tenant editor E and viewer V on D1 (organisation tenants are reserved in FM-A; constructed only to test the boundary)
insert into nyayos.tenant_memberships (tenant_id, user_id, tenant_role, status) values
  ((select ta from s), 'e1e1e1e1-0000-4000-8000-000000000001', 'member', 'active'),
  ((select ta from s), 'f1f1f1f1-0000-4000-8000-000000000001', 'member', 'active');
insert into nyayos.dispute_roles (dispute_id, user_id, dispute_role) values
  ((select d1 from s), 'e1e1e1e1-0000-4000-8000-000000000001', 'dispute_editor'),
  ((select d1 from s), 'f1f1f1f1-0000-4000-8000-000000000001', 'dispute_viewer');
insert into nyayos.documents (tenant_id, dispute_id, display_label) select ta, d4, 'Synthetic D4 document' from s;
update s set doc4 = (select id from nyayos.documents where dispute_id = (select d4 from s));
-- D3 upload that a foreign-tenant job points at: its purge ends incomplete
insert into nyayos.quarantine_uploads (tenant_id, dispute_id, uploader_id, declared_mime, sha256, state)
  select ta, d3, 'a1a1a1a1-0000-4000-8000-000000000001', 'application/pdf', repeat('3', 64), 'promoted' from s;
update s set up3 = (select id from nyayos.quarantine_uploads where dispute_id = (select d3 from s));
insert into nyayos.jobs (tenant_id, type, payload_ref) select tb, 'scan', up3 from s;

create function pg_temp.st(p uuid) returns text language sql as $f$ select status::text from nyayos.disputes where id = p $f$;
create function pg_temp.try_update(p_user text, p_sql text, p_flag text) returns void language plpgsql as $f$
declare n int;
begin
  perform set_config('nyayos.principal_id', p_user, true);
  execute 'set local role nyayos_authenticated';
  begin
    execute p_sql;
    get diagnostics n = row_count;
    insert into flags values (p_flag, 'rows:' || n);
  exception when insufficient_privilege then insert into flags values (p_flag, 'denied');
  end;
  execute 'reset role';
end $f$;
create function pg_temp.f(k text) returns text language sql as $f$ select v from flags where flags.k = f.k $f$;

-- ---------------------------------------------------------------- 1. direct status updates are refused for every client
select pg_temp.try_update('a1a1a1a1-0000-4000-8000-000000000001', format('update nyayos.disputes set status = %L where id = %L', 'deleted', (select d1 from s)), 'owner_status');
select pg_temp.try_update('e1e1e1e1-0000-4000-8000-000000000001', format('update nyayos.disputes set status = %L where id = %L', 'deleted', (select d1 from s)), 'editor_status');
select pg_temp.try_update('f1f1f1f1-0000-4000-8000-000000000001', format('update nyayos.disputes set status = %L where id = %L', 'deleted', (select d1 from s)), 'viewer_status');
select pg_temp.try_update('b1b1b1b1-0000-4000-8000-000000000001', format('update nyayos.disputes set status = %L where id = %L', 'deleted', (select d1 from s)), 'foreign_status');
select pg_temp.try_update('a1a1a1a1-0000-4000-8000-000000000001', format('update nyayos.disputes set status = %L where id = %L', 'deletion_requested', (select d2 from s)), 'owner_status_requested');
select pg_temp.try_update('a1a1a1a1-0000-4000-8000-000000000001', format('update nyayos.disputes set title = title, status = %L where id = %L', 'active', (select d1 from s)), 'owner_status_with_title');
select 'CHECK M1_owner_direct_status_update_denied ' || case when pg_temp.f('owner_status') = 'denied' and pg_temp.f('owner_status_requested') = 'denied'
  and pg_temp.f('owner_status_with_title') = 'denied' then 'PASS' else 'FAIL (' || pg_temp.f('owner_status') || ')' end;
select 'CHECK M1_editor_direct_status_update_denied ' || case when pg_temp.f('editor_status') = 'denied' then 'PASS' else 'FAIL (' || pg_temp.f('editor_status') || ')' end;
select 'CHECK M1_viewer_direct_status_update_denied ' || case when pg_temp.f('viewer_status') in ('denied', 'rows:0') then 'PASS' else 'FAIL (' || pg_temp.f('viewer_status') || ')' end;
select 'CHECK M1_cross_tenant_direct_status_update_denied ' || case when pg_temp.f('foreign_status') in ('denied', 'rows:0') then 'PASS' else 'FAIL (' || pg_temp.f('foreign_status') || ')' end;
select 'CHECK M1_status_unchanged_after_direct_attempts ' || case when pg_temp.st((select d1 from s)) = 'active' and pg_temp.st((select d2 from s)) = 'active'
  then 'PASS' else 'FAIL (d1=' || pg_temp.st((select d1 from s)) || ')' end;
select 'CHECK M1_no_client_or_service_role_holds_status_update ' || case when not exists (
  select 1 from unnest(array['nyayos_anon', 'nyayos_authenticated', 'nyayos_service_scan', 'nyayos_service_promote', 'nyayos_service_deletion', 'nyayos_service_audit', 'public']) rl
  where (rl = 'public' and exists (select 1 from information_schema.column_privileges where table_schema = 'nyayos' and table_name = 'disputes' and column_name = 'status' and privilege_type = 'UPDATE' and grantee = 'PUBLIC'))
     or (rl <> 'public' and has_column_privilege(rl, 'nyayos.disputes', 'status', 'UPDATE'))) then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 2. legitimate metadata edits are preserved
select pg_temp.try_update('e1e1e1e1-0000-4000-8000-000000000001', format('update nyayos.disputes set title = %L, category_label = %L where id = %L', 'Synthetic D1 renamed', 'Synthetic label', (select d1 from s)), 'editor_title');
select pg_temp.try_update('f1f1f1f1-0000-4000-8000-000000000001', format('update nyayos.disputes set title = %L where id = %L', 'Synthetic viewer rename', (select d1 from s)), 'viewer_title');
select pg_temp.try_update('b1b1b1b1-0000-4000-8000-000000000001', format('update nyayos.disputes set title = %L where id = %L', 'Synthetic foreign rename', (select d1 from s)), 'foreign_title');
select 'CHECK M1_editor_title_and_label_edit_preserved ' || case when pg_temp.f('editor_title') = 'rows:1'
  and (select title || '|' || category_label from nyayos.disputes where id = (select d1 from s)) = 'Synthetic D1 renamed|Synthetic label' then 'PASS' else 'FAIL' end;
select 'CHECK M1_rls_still_scopes_metadata_edits ' || case when pg_temp.f('viewer_title') = 'rows:0' and pg_temp.f('foreign_title') = 'rows:0'
  and (select relrowsecurity and relforcerowsecurity from pg_class where oid = 'nyayos.disputes'::regclass) then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 3. the server-controlled path: deletion workflow drives status
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update s set r1 = nyayos.request_deletion('dispute', (select d1 from s));
reset role;
select 'CHECK M1_authorised_request_sets_deletion_requested ' || case when pg_temp.st((select d1 from s)) = 'deletion_requested'
  and exists (select 1 from nyayos.audit_events where action = 'deletion.requested' and resource_id = (select r1 from s)::text
              and actor_id = 'a1a1a1a1-0000-4000-8000-000000000001' and dispute_id = (select d1 from s)) then 'PASS' else 'FAIL (' || pg_temp.st((select d1 from s)) || ')' end;
-- editor may not request dispute deletion (A-033 C-2); status must not move
set role nyayos_authenticated; set nyayos.principal_id = 'e1e1e1e1-0000-4000-8000-000000000001';
do $$ begin
  perform nyayos.request_deletion('dispute', (select d2 from s));
  insert into flags values ('editor_request', 'accepted');
exception when insufficient_privilege then insert into flags values ('editor_request', 'refused');
end $$;
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'b1b1b1b1-0000-4000-8000-000000000001';
do $$ begin
  perform nyayos.request_deletion('dispute', (select d2 from s));
  insert into flags values ('foreign_request', 'accepted');
exception when insufficient_privilege then insert into flags values ('foreign_request', 'refused');
end $$;
reset role;
select 'CHECK M1_unauthorised_transition_refused ' || case when pg_temp.f('editor_request') = 'refused' and pg_temp.f('foreign_request') = 'refused'
  and pg_temp.st((select d2 from s)) = 'active' and pg_temp.st((select db1 from s)) = 'active' then 'PASS' else 'FAIL' end;
-- undo restores active, audited in the same transaction
select count(*) as undone_before from nyayos.audit_events where action = 'deletion.undone' \gset
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update nyayos.deletion_requests set state = 'undone' where id = (select r1 from s);
reset role;
select 'CHECK M1_undo_restores_active ' || case when pg_temp.st((select d1 from s)) = 'active' then 'PASS' else 'FAIL (' || pg_temp.st((select d1 from s)) || ')' end;
select 'CHECK M1_status_transition_audited ' || case when
  (select count(*) from nyayos.audit_events where action = 'deletion.undone') = :undone_before + 1
  and exists (select 1 from nyayos.audit_events where action = 'deletion.undone' and resource_id = (select r1 from s)::text
              and actor_type = 'user' and actor_id = 'a1a1a1a1-0000-4000-8000-000000000001' and dispute_id = (select d1 from s)
              and metadata ->> 'state_from' = 'requested' and metadata ->> 'state_to' = 'undone') then 'PASS' else 'FAIL' end;
-- a direct client write cannot bring status back while a request is open
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update s set r2a = nyayos.request_deletion('dispute', (select d2 from s));
update s set r2b = nyayos.request_deletion('dispute', (select d2 from s));
update nyayos.deletion_requests set state = 'undone' where id = (select r2a from s);
reset role;
insert into flags values ('d2_after_first_undo', pg_temp.st((select d2 from s)));
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update nyayos.deletion_requests set state = 'undone' where id = (select r2b from s);
reset role;
select 'CHECK M1_status_stays_requested_while_another_request_is_open ' || case when pg_temp.f('d2_after_first_undo') = 'deletion_requested'
  and pg_temp.st((select d2 from s)) = 'active' then 'PASS' else 'FAIL (' || coalesce(pg_temp.f('d2_after_first_undo'), 'null') || ')' end;
-- document- and account-scope requests do not change a dispute's status
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update s set rdoc = nyayos.request_deletion('document', (select doc4 from s));
reset role;
select 'CHECK M1_document_request_leaves_dispute_status ' || case when pg_temp.st((select d4 from s)) = 'active' then 'PASS' else 'FAIL' end;
-- a client cannot forge a transition through the request row either
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
do $$ declare n int; begin
  update nyayos.deletion_requests set state = 'requested' where id = (select r1 from s);   -- the undo policy only admits requested → undone
  get diagnostics n = row_count;
  insert into flags values ('reopen', case when n = 0 then 'refused' else 'accepted' end);
exception when insufficient_privilege or check_violation then insert into flags values ('reopen', 'refused');
end $$;
do $$ begin
  insert into nyayos.deletion_requests (tenant_id, scope_type, scope_id, requested_by, undo_until)
    values ((select ta from s), 'dispute', (select d1 from s), 'a1a1a1a1-0000-4000-8000-000000000001', now());
  insert into flags values ('forge_insert', 'accepted');
exception when insufficient_privilege then insert into flags values ('forge_insert', 'refused');
end $$;
reset role;
select 'CHECK M1_request_row_cannot_be_forged_to_move_status ' || case when pg_temp.f('reopen') = 'refused' and pg_temp.f('forge_insert') = 'refused'
  and pg_temp.st((select d1 from s)) = 'active' then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 4. purge: incomplete stays honest; complete removes the row
set role nyayos_authenticated; set nyayos.principal_id = 'a1a1a1a1-0000-4000-8000-000000000001';
update s set r3 = nyayos.request_deletion('dispute', (select d3 from s));
update s set r1 = nyayos.request_deletion('dispute', (select d1 from s));
reset role;
update nyayos.deletion_requests set undo_until = now() - interval '1 minute' where id in ((select r3 from s), (select r1 from s));   -- test-only clock move
create temp table res (label text, outcome text);
grant all on res to public;
set role nyayos_service_deletion;
insert into res select 'r3', outcome from nyayos.purge_deletion_request((select r3 from s));
insert into res select 'r1', outcome from nyayos.purge_deletion_request((select r1 from s));
reset role;
select 'CHECK M1_incomplete_purge_keeps_status_honest ' || case when (select outcome from res where label = 'r3') = 'incomplete'
  and pg_temp.st((select d3 from s)) = 'deletion_requested' then 'PASS' else 'FAIL' end;
select 'CHECK M1_completed_purge_removes_dispute ' || case when (select outcome from res where label = 'r1') = 'purged'
  and not exists (select 1 from nyayos.disputes where id = (select d1 from s)) then 'PASS' else 'FAIL' end;
select 'CHECK M1_worker_never_sets_deleted_status ' || case when not exists (select 1 from nyayos.disputes where status = 'deleted') then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 5. isolation, structure, audit chain
select 'CHECK M1_other_tenant_untouched ' || case when pg_temp.st((select db1 from s)) = 'active'
  and (select title from nyayos.disputes where id = (select db1 from s)) = 'Synthetic B1' then 'PASS' else 'FAIL' end;
select 'CHECK M1_status_trigger_definer_pinned ' || case when exists (
  select 1 from pg_trigger t join pg_proc p on p.oid = t.tgfoid
  where t.tgrelid = 'nyayos.deletion_requests'::regclass and not t.tgisinternal and p.proname = 'tg_dispute_status_from_deletion'
    and p.prosecdef and p.proconfig @> array['search_path=pg_catalog, nyayos']) then 'PASS' else 'FAIL' end;
select 'CHECK M1_audit_chain_intact ' || case when nyayos.verify_audit_chain() is null then 'PASS' else 'FAIL' end;
