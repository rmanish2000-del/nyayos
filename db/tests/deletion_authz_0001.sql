-- A-033-R C-2 adversarial proof: deletion-request authorisation.
-- Throwaway local container only; synthetic data only. Every line prints CHECK … PASS|FAIL.
-- Same-tenant users C (dispute viewer) and E (dispute editor) are constructed directly because
-- organisation tenants are reserved in FM-A; they exist here only to test the authorisation boundary.
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned

create temp table z (ta uuid, tb uuid, da1 uuid, da2 uuid, db1 uuid, doc1 uuid, doc2 uuid, docb uuid, req uuid, req3 uuid);
insert into z default values;
grant all on z to public;

-- A: personal tenant TA, owns dispute DA1
set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
update z set ta = nyayos.sign_up_personal_tenant('Synthetic A', 'en');
update z set da1 = nyayos.create_dispute((select ta from z), 'Synthetic dispute A1');
-- B: personal tenant TB, owns dispute DB1
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
update z set tb = nyayos.sign_up_personal_tenant('Synthetic B', 'en');
update z set db1 = nyayos.create_dispute((select tb from z), 'Synthetic dispute B1');
-- C and E: members of tenant TA; C is viewer on DA1, E is editor on DA1; C owns DA2
reset role;
insert into nyayos.tenant_memberships (tenant_id, user_id, tenant_role, status)
  select ta, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'member'::nyayos.tenant_role, 'active'::nyayos.membership_status from z
  union all select ta, 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'::uuid, 'member'::nyayos.tenant_role, 'active'::nyayos.membership_status from z;
insert into nyayos.dispute_roles (dispute_id, user_id, dispute_role)
  select da1, 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'::uuid, 'dispute_viewer'::nyayos.dispute_role from z
  union all select da1, 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'::uuid, 'dispute_editor'::nyayos.dispute_role from z;
set role nyayos_authenticated; set nyayos.principal_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
update z set da2 = nyayos.create_dispute((select ta from z), 'Synthetic dispute A2 (owned by C)');
reset role;
with i as (insert into nyayos.documents (tenant_id, dispute_id, display_label) select ta, da1, 'Synthetic doc in A1' from z returning id) update z set doc1 = (select id from i);
with i as (insert into nyayos.documents (tenant_id, dispute_id, display_label) select ta, da2, 'Synthetic doc in A2' from z returning id) update z set doc2 = (select id from i);
with i as (insert into nyayos.documents (tenant_id, dispute_id, display_label) select tb, db1, 'Synthetic doc in B1' from z returning id) update z set docb = (select id from i);

-- ---------------------------------------------------------------- 1. cross-tenant (B against tenant A)
set role nyayos_authenticated; set nyayos.principal_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
do $$ begin
  begin perform nyayos.request_deletion('dispute', (select da1 from z)); raise notice 'CHECK C2_cross_tenant_dispute_rejected FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_cross_tenant_dispute_rejected PASS'; end;
  begin perform nyayos.request_deletion('document', (select doc1 from z)); raise notice 'CHECK C2_cross_tenant_document_rejected FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_cross_tenant_document_rejected PASS'; end;
  begin perform nyayos.request_deletion('account', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'); raise notice 'CHECK C2_cross_tenant_account_rejected FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_cross_tenant_account_rejected PASS'; end;
end $$;
-- no existence leakage: a foreign scope and a nonexistent scope fail identically
do $$ declare m1 text; c1 text; m2 text; c2 text; m3 text; c3 text; m4 text; c4 text; begin
  begin perform nyayos.request_deletion('dispute', (select da1 from z)); exception when others then m1 := sqlerrm; c1 := sqlstate; end;
  begin perform nyayos.request_deletion('dispute', '00000000-0000-4000-8000-000000000999'); exception when others then m2 := sqlerrm; c2 := sqlstate; end;
  begin perform nyayos.request_deletion('document', (select doc1 from z)); exception when others then m3 := sqlerrm; c3 := sqlstate; end;
  begin perform nyayos.request_deletion('document', '00000000-0000-4000-8000-000000000998'); exception when others then m4 := sqlerrm; c4 := sqlstate; end;
  if c1 = '42501' and c1 = c2 and m1 = m2 and c3 = '42501' and c3 = c4 and m3 = m4
  then raise notice 'CHECK C2_foreign_and_nonexistent_indistinguishable PASS';
  else raise notice 'CHECK C2_foreign_and_nonexistent_indistinguishable FAIL (% / % / % / %)', c1, c2, c3, c4; end if;
end $$;
select 'CHECK C2_B_sees_no_requests_of_A ' || case when (select count(*) from nyayos.deletion_requests where tenant_id <> (select tb from z)) = 0 then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 2. same tenant, cross-dispute (A against C's dispute DA2)
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$ begin
  begin perform nyayos.request_deletion('dispute', (select da2 from z)); raise notice 'CHECK C2_same_tenant_other_dispute_rejected FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_same_tenant_other_dispute_rejected PASS'; end;
  begin perform nyayos.request_deletion('document', (select doc2 from z)); raise notice 'CHECK C2_same_tenant_other_dispute_document_rejected FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_same_tenant_other_dispute_document_rejected PASS'; end;
end $$;

-- ---------------------------------------------------------------- 3. same dispute, insufficient role
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
do $$ begin
  begin perform nyayos.request_deletion('dispute', (select da1 from z)); raise notice 'CHECK C2_viewer_cannot_delete_dispute FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_viewer_cannot_delete_dispute PASS'; end;
  begin perform nyayos.request_deletion('document', (select doc1 from z)); raise notice 'CHECK C2_viewer_cannot_delete_document FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_viewer_cannot_delete_document PASS'; end;
end $$;
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee';
do $$ begin
  begin perform nyayos.request_deletion('dispute', (select da1 from z)); raise notice 'CHECK C2_editor_cannot_delete_dispute FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_editor_cannot_delete_dispute PASS'; end;
end $$;
select 'CHECK C2_editor_may_request_document_deletion ' || case when nyayos.request_deletion('document', (select doc1 from z)) is not null then 'PASS' else 'FAIL' end;

-- ---------------------------------------------------------------- 4. direct-table bypass attempts
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$ begin
  begin
    insert into nyayos.deletion_requests (tenant_id, scope_type, scope_id, requested_by, undo_until)
      values ((select ta from z), 'dispute', (select da1 from z), 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', now() - interval '1 day');
    raise notice 'CHECK C2_owner_direct_insert_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_owner_direct_insert_denied PASS'; end;
end $$;
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
do $$ begin
  begin
    insert into nyayos.deletion_requests (tenant_id, scope_type, scope_id, requested_by, undo_until)
      values ((select tb from z), 'dispute', (select da1 from z), 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', now() - interval '1 day');
    raise notice 'CHECK C2_foreign_direct_insert_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_foreign_direct_insert_denied PASS'; end;
end $$;
reset role; set role nyayos_service_scan;
do $$ begin
  begin
    insert into nyayos.deletion_requests (tenant_id, scope_type, scope_id, requested_by, undo_until)
      values ((select ta from z), 'dispute', (select da1 from z), 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', now());
    raise notice 'CHECK C2_service_role_direct_insert_denied FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_service_role_direct_insert_denied PASS'; end;
end $$;

-- ---------------------------------------------------------------- 5. valid owner succeeds; 6. undo window is server-computed
reset role; set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
update z set req = nyayos.request_deletion('dispute', (select da1 from z));
select 'CHECK C2_owner_request_succeeds_scoped ' || case when
  (select tenant_id = (select ta from z) and scope_type = 'dispute' and scope_id = (select da1 from z)
      and requested_by = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' and state = 'requested'
     from nyayos.deletion_requests where id = (select req from z)) then 'PASS' else 'FAIL' end;
select 'CHECK C2_undo_window_from_config_7d ' || case when
  (select undo_until between now() + interval '6 days 23 hours' and now() + interval '7 days 1 hour'
     from nyayos.deletion_requests where id = (select req from z)) then 'PASS' else 'FAIL' end;
reset role;
select 'CHECK C2_function_takes_no_deadline_argument ' || case when
  (select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'nyayos' and p.proname = 'request_deletion') = 1
  and (select pronargs from pg_proc where oid = 'nyayos.request_deletion(nyayos.deletion_scope_type, uuid)'::regprocedure) = 2
  then 'PASS' else 'FAIL' end;
update nyayos.config_provisional set value = '3' where key = 'deletion_undo_window_days';
set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
update z set req3 = nyayos.request_deletion('account', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
select 'CHECK C2_undo_window_follows_server_config_3d ' || case when
  (select undo_until between now() + interval '2 days 23 hours' and now() + interval '3 days 1 hour'
     from nyayos.deletion_requests where id = (select req3 from z)) then 'PASS' else 'FAIL' end;
reset role; update nyayos.config_provisional set value = '7' where key = 'deletion_undo_window_days';
set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$ begin
  begin update nyayos.deletion_requests set undo_until = now() + interval '100 years' where id = (select req from z);
    raise notice 'CHECK C2_client_cannot_change_undo_deadline FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_client_cannot_change_undo_deadline PASS'; end;
  begin update nyayos.deletion_requests set scope_id = (select da2 from z) where id = (select req from z);
    raise notice 'CHECK C2_client_cannot_rescope_request FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_client_cannot_rescope_request PASS'; end;
  begin update nyayos.deletion_requests set state = 'locked' where id = (select req from z);
    raise notice 'CHECK C2_client_cannot_advance_state FAIL';
  exception when insufficient_privilege then raise notice 'CHECK C2_client_cannot_advance_state PASS'; end;
end $$;
do $$ declare n int; begin
  update nyayos.deletion_requests set state = 'undone' where id = (select req from z);
  get diagnostics n = row_count;
  if n = 1 then raise notice 'CHECK C2_owner_can_undo_within_window PASS'; else raise notice 'CHECK C2_owner_can_undo_within_window FAIL'; end if;
end $$;
reset role;
update nyayos.deletion_requests set state = 'requested', undo_until = now() - interval '1 minute' where id = (select req from z);  -- simulate the window closing
set role nyayos_authenticated; set nyayos.principal_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
do $$ declare n int; begin
  update nyayos.deletion_requests set state = 'undone' where id = (select req from z);
  get diagnostics n = row_count;
  if n = 0 then raise notice 'CHECK C2_undo_refused_after_window PASS'; else raise notice 'CHECK C2_undo_refused_after_window FAIL'; end if;
end $$;

-- ---------------------------------------------------------------- 7. what a future worker would read is authorised and correctly scoped
reset role;
select 'CHECK C2_every_request_authorised_and_scoped ' || case when not exists (
  select 1 from nyayos.deletion_requests r
  where not (
    (r.scope_type = 'dispute' and exists (select 1 from nyayos.disputes d join nyayos.dispute_roles dr on dr.dispute_id = d.id
        where d.id = r.scope_id and d.tenant_id = r.tenant_id and dr.user_id = r.requested_by and dr.dispute_role = 'dispute_owner'))
    or (r.scope_type = 'document' and exists (select 1 from nyayos.documents d join nyayos.dispute_roles dr on dr.dispute_id = d.dispute_id
        where d.id = r.scope_id and d.tenant_id = r.tenant_id and dr.user_id = r.requested_by and dr.dispute_role in ('dispute_owner', 'dispute_editor')))
    or (r.scope_type = 'account' and r.scope_id = r.requested_by and exists (select 1 from nyayos.tenant_memberships m
        where m.tenant_id = r.tenant_id and m.user_id = r.requested_by))
  )) and (select count(*) from nyayos.deletion_requests
        where requested_by in ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee')) = 3 then 'PASS' else 'FAIL' end;
select 'CHECK C2_definer_function_search_path_pinned ' || case when
  (select prosecdef and proconfig::text like '%search_path=pg_catalog, nyayos%' from pg_proc
    where oid = 'nyayos.request_deletion(nyayos.deletion_scope_type, uuid)'::regprocedure) then 'PASS' else 'FAIL' end;
