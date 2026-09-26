-- =============================================================================
-- NyayOS — migration 0004: audit-chain ordering and fork prevention (A-033-R, closes A-032 C-1)
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. Executed only on disposable local containers during
-- A-033-R verification. Append-only: 0001–0003 are not edited.
--
-- Root cause found by db/tests/audit_concurrency_matrix.sh at 8489353 (A-033 lock alone):
--   1. `seq` was assigned by the identity default BEFORE the trigger took its advisory lock, so
--      under concurrent READ COMMITTED writers sequence order drifted from lock (chain) order.
--      The trigger's "latest row" lookup (highest committed seq) could then return a row that
--      was not the chain head, and two rows chained to the same predecessor (a fork); the
--      verifier, which walks by seq, also reported legitimate rows as tampered.
--   2. A REPEATABLE READ / SERIALIZABLE writer reads with a snapshot taken before the lock, so
--      after waiting it still saw a stale head and chained to it (a fork).
-- Fix (smallest safe, transaction-scoped):
--   a. After the advisory lock, the trigger assigns `seq` from the sequence itself, so seq order
--      equals lock order equals chain order. The lock is held to commit, as before.
--   b. A unique index on prev_hash makes a fork impossible at every isolation level: a writer
--      with a stale snapshot fails closed (unique_violation, retryable) and rolls back. It never
--      forks and never causes a false tamper report.
-- The trigger stays SECURITY INVOKER; the audit service role gets USAGE on the sequence only.
-- Append-only audit behaviour (no UPDATE/DELETE, forbid triggers) is unchanged.
--
-- Rollback (reintroduces A-032 C-1; disposable databases only):
--   drop index if exists nyayos.audit_events_prev_hash_unique;
--   revoke usage on sequence nyayos.audit_events_seq_seq from nyayos_service_audit;
--   then re-run the `create or replace function nyayos.tg_audit_before_insert()` block from 0001.
-- =============================================================================

begin;

do $$
begin
  if exists (select 1 from nyayos.audit_events group by prev_hash having count(*) > 1) then
    raise exception 'audit_events already contains a forked chain; investigate before applying 0004';
  end if;
end $$;

create or replace function nyayos.tg_audit_before_insert() returns trigger
language plpgsql set search_path = pg_catalog, nyayos
as $$
declare
  k text;
  allowed text[] := array['document_id','document_version','sha256','size_bytes','mime','proposal_id','correction_id',
    'export_id','manifest_sha256','deletion_request_id','scope_type','state_from','state_to','verdict','reason_code',
    'notice_version','notice_language','purpose_checked','target_type','target_id','version','count'];
  prev text;
  canonical text;
begin
  if new.action !~ '^[a-z_]+\.[a-z_]+$' then
    raise exception 'audit action % is not in catalogue form', new.action using errcode = '23514';
  end if;
  for k in select jsonb_object_keys(new.metadata) loop
    if not (k = any(allowed)) then
      raise exception 'audit metadata key % is not allow-listed', k using errcode = '23514';
    end if;
    if length(new.metadata ->> k) > 256 then
      raise exception 'audit metadata value for % exceeds 256 characters', k using errcode = '23514';
    end if;
  end loop;
  -- Serialise chain writers (held until commit), then take the chain position under the lock so
  -- that seq order is exactly chain order (A-033-R).
  perform pg_advisory_xact_lock(hashtext('nyayos.audit_events'));
  new.seq := nextval(pg_get_serial_sequence('nyayos.audit_events', 'seq'));
  select a.row_hash into prev from nyayos.audit_events a order by a.seq desc limit 1;
  new.prev_hash := coalesce(prev, repeat('0', 64));
  canonical := jsonb_build_object(
    'id', new.id, 'occurredAt', new.occurred_at, 'actorType', new.actor_type, 'actorId', new.actor_id,
    'onBehalfOf', new.on_behalf_of, 'tenantId', new.tenant_id, 'disputeId', new.dispute_id, 'grantId', new.grant_id,
    'action', new.action, 'resourceType', new.resource_type, 'resourceId', new.resource_id, 'purpose', new.purpose,
    'outcome', new.outcome, 'severity', new.severity, 'requestId', new.request_id, 'ipHash', new.ip_hash,
    'userAgentClass', new.user_agent_class, 'metadata', new.metadata)::text;
  new.row_hash := encode(sha256(convert_to(new.prev_hash || '‖' || canonical, 'UTF8')), 'hex');
  return new;
end $$;

-- No two rows may share a predecessor, whatever the isolation level of the writer.
create unique index audit_events_prev_hash_unique on nyayos.audit_events (prev_hash);

do $$
begin
  execute format('grant usage on sequence %s to nyayos_service_audit',
                 pg_get_serial_sequence('nyayos.audit_events', 'seq'));
end $$;

commit;
