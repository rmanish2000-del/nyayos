-- =============================================================================
-- NyayOS — migration 0008: dispute status is server-controlled (A-042)
--   closes A-032 minor finding m-1 ("owner/editor may `update nyayos.disputes set status = 'deleted'`
--   directly … bypassing the deletion workflow and its honest status")
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. Executed only on disposable local PostgreSQL containers
-- during A-042 verification. Append-only: 0001–0007 are not edited. No table is created or altered.
--
-- 1. The authenticated role loses UPDATE on disputes.status. It keeps UPDATE on title and
--    category_label (owner/editor metadata edits under the unchanged disputes_update_editor policy).
--    No other role ever held UPDATE on disputes.
-- 2. The only path that changes status is the deletion workflow, server-side:
--      a dispute-scope deletion request (inserted only by request_deletion)  → 'deletion_requested'
--      undo of that request (the requester's RLS-guarded state change)        → 'active',
--        unless another open request for the same dispute remains
--    The undo writes a deletion.undone audit event in the same transaction (D-031); the request
--    already writes deletion.requested inside request_deletion. The purge worker never sets status:
--    a completed purge removes the dispute row; an incomplete purge leaves 'deletion_requested'
--    (honest: not deleted). 'deleted' is not set by any path in FM-A.
--    The trigger function is SECURITY DEFINER because the caller (the requester undoing a request)
--    no longer holds UPDATE on the column; it derives status only from the already-authorised
--    request row, bounded to that row's dispute and tenant, with a fixed search_path.
--
-- Rollback (disposable databases only):
--   drop trigger if exists deletion_requests_dispute_status on nyayos.deletion_requests;
--   drop function if exists nyayos.tg_dispute_status_from_deletion();
--   grant update (status) on nyayos.disputes to nyayos_authenticated;   -- reintroduces m-1
-- =============================================================================

begin;

-- ---------------------------------------------------------------- 1. remove the direct client path
revoke update (status) on nyayos.disputes from nyayos_authenticated;
revoke update (status) on nyayos.disputes from public;

-- ---------------------------------------------------------------- 2. status follows the deletion workflow
create or replace function nyayos.tg_dispute_status_from_deletion() returns trigger
language plpgsql security definer
set search_path = pg_catalog, nyayos
as $$
begin
  if new.scope_type <> 'dispute' then
    return null;
  end if;
  if tg_op = 'INSERT' then
    if new.state = 'requested' then
      update nyayos.disputes set status = 'deletion_requested'
        where id = new.scope_id and tenant_id = new.tenant_id and status = 'active';
    end if;
    return null;
  end if;
  -- UPDATE OF state
  if new.state = 'undone' and old.state is distinct from 'undone' then
    if not exists (select 1 from nyayos.deletion_requests r
                   where r.scope_type = 'dispute' and r.scope_id = new.scope_id and r.tenant_id = new.tenant_id
                     and r.id <> new.id and r.state in ('requested', 'locked', 'purging', 'incomplete')) then
      update nyayos.disputes set status = 'active'
        where id = new.scope_id and tenant_id = new.tenant_id and status = 'deletion_requested';
    end if;
    perform nyayos.audit_append_internal('deletion.undone', 'deletion_request', new.id::text, new.tenant_id,
      new.scope_id, 'storage', jsonb_build_object('deletion_request_id', new.id::text, 'scope_type', new.scope_type::text,
      'state_from', old.state::text, 'state_to', 'undone'));
  end if;
  return null;
end $$;

revoke all on function nyayos.tg_dispute_status_from_deletion() from public;

create trigger deletion_requests_dispute_status
  after insert or update of state on nyayos.deletion_requests
  for each row execute function nyayos.tg_dispute_status_from_deletion();

commit;
