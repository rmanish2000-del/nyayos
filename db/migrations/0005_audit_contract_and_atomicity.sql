-- =============================================================================
-- NyayOS — migration 0005: audit hash contract and audit atomicity (A-038)
--   closes A-032 M-2 (TypeScript and SQL audit hashes not interoperable)
--   closes A-032 M-7 (audit writes not atomic with canonical writes), per founder decision D-031
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. Executed only on disposable local PostgreSQL
-- containers during A-038 verification. Append-only: 0001–0004 are not edited.
--
-- M-2. One contract, `nyayos-audit-v1`, implemented here and in app/src/domain/audit.ts:
--   canonical = compact JSON array ["nyayos-audit-v1", id, occurred_at, actor_type, actor_id,
--     on_behalf_of, tenant_id, dispute_id, grant_id, action, resource_type, resource_id, purpose,
--     outcome, severity, request_id, ip_hash, user_agent_class, metadata]
--   text: to_json(text) (same escaping as JSON.stringify); absent value: JSON null;
--   UUIDs: lowercase canonical; occurred_at: UTC 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"' (independent
--   of the session TimeZone — the old jsonb rendering was not); metadata: keys in code-point
--   ("C") order, values string / boolean / safe integer only (enforced by the trigger).
--   row_hash = hex(sha256(UTF-8(prev_hash || U+2016 || canonical))).
--   Pinned for both runtimes by db/tests/audit_hash_vectors_v1.json.
--
-- M-7. Every single-writer server function (sign_up_personal_tenant, create_dispute,
--   propose_change, decide_proposal, request_deletion) now writes its audit event inside its own
--   body through nyayos.audit_append_internal, i.e. in the same transaction as the canonical
--   write: if the audit insert fails the canonical write rolls back; if the canonical write fails
--   no audit row remains. Audit fields are server-derived (session principal, server request id,
--   fixed action, ids from the rows just written); no audit field is a client parameter.
--   audit_append_internal has no EXECUTE grant for any client or service role.
--
-- Preserved: A-033-R concurrency protections (advisory lock, seq under lock, unique prev_hash),
--   append-only audit (no UPDATE/DELETE grants, forbid triggers), all grants and RLS policies.
-- Not in scope (D-032): deletion purge.
--
-- Guard: audit_events must be empty. Rows hashed under the previous serialisation would fail
--   the new verifier, and this migration never rewrites records. No environment holds audit rows.
--
-- Rollback (disposable databases only): re-run the function blocks of 0001 (server functions,
--   verify_audit_chain) and 0004 (tg_audit_before_insert), then
--   drop function nyayos.audit_append_internal(text, text, text, uuid, uuid, text, jsonb),
--     nyayos.audit_canonical_v1(nyayos.audit_events), nyayos.audit_metadata_v1(jsonb),
--     nyayos.audit_json_v1(text), nyayos.audit_row_hash_v1(text, text);
--   This reopens M-2 and M-7.
-- =============================================================================

begin;

do $$
begin
  if exists (select 1 from nyayos.audit_events) then
    raise exception '0005 changes the audit hash contract; audit_events must be empty (no rows are ever rewritten)';
  end if;
end $$;

-- ---------------------------------------------------------------- M-2: contract nyayos-audit-v1
create or replace function nyayos.audit_json_v1(v text) returns text
language sql stable set search_path = pg_catalog
as $$ select case when v is null then 'null' else to_json(v)::text end $$;

create or replace function nyayos.audit_metadata_v1(m jsonb) returns text
language sql stable set search_path = pg_catalog
as $$
  select '{' || coalesce((
    select string_agg(
             to_json(e.key)::text || ':' ||
             case jsonb_typeof(e.value) when 'string' then to_json(e.value #>> '{}')::text else e.value::text end,
             ',' order by e.key collate "C")
    from jsonb_each(m) as e), '') || '}'
$$;

create or replace function nyayos.audit_canonical_v1(r nyayos.audit_events) returns text
language sql stable set search_path = pg_catalog, nyayos
as $$
  select '["nyayos-audit-v1",'
    || nyayos.audit_json_v1(r.id::text) || ','
    || nyayos.audit_json_v1(to_char(r.occurred_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')) || ','
    || nyayos.audit_json_v1(r.actor_type::text) || ','
    || nyayos.audit_json_v1(r.actor_id) || ','
    || nyayos.audit_json_v1(r.on_behalf_of::text) || ','
    || nyayos.audit_json_v1(r.tenant_id::text) || ','
    || nyayos.audit_json_v1(r.dispute_id::text) || ','
    || nyayos.audit_json_v1(r.grant_id::text) || ','
    || nyayos.audit_json_v1(r.action) || ','
    || nyayos.audit_json_v1(r.resource_type) || ','
    || nyayos.audit_json_v1(r.resource_id) || ','
    || nyayos.audit_json_v1(r.purpose) || ','
    || nyayos.audit_json_v1(r.outcome::text) || ','
    || nyayos.audit_json_v1(r.severity::text) || ','
    || nyayos.audit_json_v1(r.request_id) || ','
    || nyayos.audit_json_v1(r.ip_hash) || ','
    || nyayos.audit_json_v1(r.user_agent_class) || ','
    || nyayos.audit_metadata_v1(r.metadata) || ']'
$$;

create or replace function nyayos.audit_row_hash_v1(p_prev_hash text, p_canonical text) returns text
language sql stable set search_path = pg_catalog
as $$ select encode(sha256(convert_to(p_prev_hash || '‖' || p_canonical, 'UTF8')), 'hex') $$;

revoke all on function nyayos.audit_json_v1(text) from public;
revoke all on function nyayos.audit_metadata_v1(jsonb) from public;
revoke all on function nyayos.audit_canonical_v1(nyayos.audit_events) from public;
revoke all on function nyayos.audit_row_hash_v1(text, text) from public;
grant execute on function nyayos.audit_json_v1(text) to nyayos_service_audit;
grant execute on function nyayos.audit_metadata_v1(jsonb) to nyayos_service_audit;
grant execute on function nyayos.audit_canonical_v1(nyayos.audit_events) to nyayos_service_audit;
grant execute on function nyayos.audit_row_hash_v1(text, text) to nyayos_service_audit;

-- ---------------------------------------------------------------- trigger: 0004 locking unchanged; contract hashing; value validation
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
  if jsonb_typeof(new.metadata) is distinct from 'object' then
    raise exception 'audit metadata must be a JSON object' using errcode = '23514';
  end if;
  for k in select jsonb_object_keys(new.metadata) loop
    if not (k = any(allowed)) then
      raise exception 'audit metadata key % is not allow-listed', k using errcode = '23514';
    end if;
    if length(new.metadata ->> k) > 256 then
      raise exception 'audit metadata value for % exceeds 256 characters', k using errcode = '23514';
    end if;
    -- contract nyayos-audit-v1: string, boolean or safe integer only
    if not (jsonb_typeof(new.metadata -> k) in ('string', 'boolean')
            or (jsonb_typeof(new.metadata -> k) = 'number'
                and (new.metadata ->> k) ~ '^(0|-?[1-9][0-9]{0,15})$'
                and abs((new.metadata ->> k)::numeric) <= 9007199254740991)) then
      raise exception 'audit metadata value for % must be a string, boolean or safe integer', k using errcode = '23514';
    end if;
  end loop;
  -- Serialise chain writers (held until commit), then take the chain position under the lock so
  -- that seq order is exactly chain order (A-033-R).
  perform pg_advisory_xact_lock(hashtext('nyayos.audit_events'));
  new.seq := nextval(pg_get_serial_sequence('nyayos.audit_events', 'seq'));
  select a.row_hash into prev from nyayos.audit_events a order by a.seq desc limit 1;
  new.prev_hash := coalesce(prev, repeat('0', 64));
  canonical := nyayos.audit_canonical_v1(new);
  new.row_hash := nyayos.audit_row_hash_v1(new.prev_hash, canonical);
  return new;
end $$;

-- ---------------------------------------------------------------- M-7: in-transaction audit writer
-- Called only from inside the SECURITY DEFINER server functions (which run as the schema owner).
-- SECURITY INVOKER, and no role other than the owner may execute it: no client path exists.
create or replace function nyayos.audit_append_internal(
  p_action text, p_resource_type text, p_resource_id text, p_tenant uuid, p_dispute uuid,
  p_purpose text, p_metadata jsonb)
returns uuid
language plpgsql security invoker
set search_path = pg_catalog, nyayos
as $$
declare uid uuid := nyayos.current_user_id(); aid uuid;
begin
  insert into nyayos.audit_events (actor_type, actor_id, on_behalf_of, tenant_id, dispute_id, action, resource_type,
    resource_id, purpose, outcome, severity, request_id, ip_hash, user_agent_class, metadata, prev_hash, row_hash)
  values (case when uid is null then 'system'::nyayos.audit_actor_type else 'user'::nyayos.audit_actor_type end,
    coalesce(uid::text, 'system'), null, p_tenant, p_dispute, p_action, p_resource_type, p_resource_id, p_purpose,
    'success', 'info', coalesce(nyayos.current_request_id(), 'txn-' || pg_current_xact_id()::text), null, 'unknown',
    coalesce(p_metadata, '{}'::jsonb), repeat('0', 64), repeat('0', 64))
  returning id into aid;
  return aid;
end $$;

revoke all on function nyayos.audit_append_internal(text, text, text, uuid, uuid, text, jsonb) from public;

-- ---------------------------------------------------------------- verifier on the same contract
create or replace function nyayos.verify_audit_chain() returns bigint
language plpgsql stable security definer
set search_path = pg_catalog, nyayos
as $$
declare r nyayos.audit_events; prev text := repeat('0', 64);
begin
  for r in select * from nyayos.audit_events order by seq loop
    if r.prev_hash <> prev then return r.seq; end if;
    if nyayos.audit_row_hash_v1(r.prev_hash, nyayos.audit_canonical_v1(r)) <> r.row_hash then return r.seq; end if;
    prev := r.row_hash;
  end loop;
  return null;
end $$;

-- ---------------------------------------------------------------- server functions (bodies from 0001; audit calls added)
create or replace function nyayos.sign_up_personal_tenant(p_display_name text, p_language nyayos.notice_language)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, nyayos
as $$
declare uid uuid := nyayos.current_user_id(); tid uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '42501'; end if;
  select m.tenant_id into tid from nyayos.tenant_memberships m
    join nyayos.tenants t on t.id = m.tenant_id
    where m.user_id = uid and t.type = 'personal' limit 1;
  if tid is not null then return tid; end if;
  insert into nyayos.tenants (type, name) values ('personal', p_display_name) returning id into tid;
  insert into nyayos.tenant_memberships (tenant_id, user_id, tenant_role, status) values (tid, uid, 'tenant_owner', 'active');
  insert into nyayos.profiles (user_id, display_name, preferred_language) values (uid, p_display_name, p_language)
    on conflict (user_id) do nothing;
  perform nyayos.audit_append_internal('membership.added', 'tenant_membership', tid::text, tid, null, null, '{}'::jsonb);
  return tid;
end $$;

create or replace function nyayos.create_dispute(p_tenant uuid, p_title text, p_category_label text default null)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, nyayos
as $$
declare uid uuid := nyayos.current_user_id(); did uuid;
begin
  if uid is null or not nyayos.is_tenant_member(p_tenant) then
    raise exception 'not a tenant member' using errcode = '42501';
  end if;
  insert into nyayos.disputes (tenant_id, owner_user_id, title, category_label)
    values (p_tenant, uid, p_title, p_category_label) returning id into did;
  insert into nyayos.dispute_roles (dispute_id, user_id, dispute_role) values (did, uid, 'dispute_owner');
  perform nyayos.audit_append_internal('dispute.created', 'dispute', did::text, p_tenant, did, 'storage', '{}'::jsonb);
  return did;
end $$;

create or replace function nyayos.propose_change(
  p_dispute uuid, p_target_type nyayos.canonical_target_type, p_target_id uuid, p_value jsonb, p_reason text default null)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, nyayos
as $$
declare uid uuid := nyayos.current_user_id(); tid uuid; pid uuid;
begin
  if uid is null or not nyayos.is_dispute_member(p_dispute, 'dispute_editor') then
    raise exception 'not authorised for this dispute' using errcode = '42501';
  end if;
  select tenant_id into tid from nyayos.disputes where id = p_dispute;
  insert into nyayos.proposals (tenant_id, dispute_id, target_type, target_id, proposed_value, origin, origin_ref, reason)
    values (tid, p_dispute, p_target_type, p_target_id, p_value, 'user', uid::text, p_reason) returning id into pid;
  perform nyayos.audit_append_internal('proposal.created', 'proposal', pid::text, tid, p_dispute, 'storage',
    jsonb_strip_nulls(jsonb_build_object('proposal_id', pid::text, 'target_type', p_target_type::text, 'target_id', p_target_id::text)));
  return pid;
end $$;

create or replace function nyayos.decide_proposal(p_proposal uuid, p_accept boolean, p_reason text default null)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, nyayos
as $$
declare
  uid uuid := nyayos.current_user_id();
  pr nyayos.proposals%rowtype;
  tbl text;
  prev jsonb;
  prev_version int := 0;
  new_id uuid;
  cid uuid;
  cols text;
  vcols text;
  setcols text;
  bad_keys text[];
  has_version boolean;
  has_created_by boolean;
  extra_cols text := '';
  extra_vals text := '';
begin
  select * into pr from nyayos.proposals where id = p_proposal for update;
  if pr.id is null then raise exception 'proposal not found' using errcode = 'P0002'; end if;
  if pr.status <> 'pending' then raise exception 'proposal already decided' using errcode = '23514'; end if;
  if uid is null or not nyayos.is_dispute_member(pr.dispute_id, 'dispute_owner') then
    raise exception 'only the dispute owner decides proposals in FM-A' using errcode = '42501';
  end if;

  if not p_accept then
    update nyayos.proposals set status = 'rejected', decided_by = uid, decided_at = now(), reason = coalesce(p_reason, reason)
      where id = p_proposal;
    perform nyayos.audit_append_internal('proposal.rejected', 'proposal', p_proposal::text, pr.tenant_id, pr.dispute_id, 'storage',
      jsonb_build_object('proposal_id', p_proposal::text, 'target_type', pr.target_type::text));
    return null;
  end if;

  tbl := case pr.target_type
    when 'dispute_statement' then 'dispute_statements' when 'entity' then 'entities'
    when 'entity_source_form' then 'entity_source_forms' when 'event' then 'events'
    when 'date_assertion' then 'date_assertions' when 'proposition' then 'propositions'
    when 'evidence_item' then 'evidence_items' when 'evidence_relation' then 'evidence_relations'
    when 'contradiction' then 'contradictions' when 'missing_evidence' then 'missing_evidence'
    when 'issue' then 'issues' when 'next_step' then 'next_steps' end;

  if pr.target_id is not null then
    execute format('select to_jsonb(t) - ''id'' - ''tenant_id'' - ''dispute_id'' - ''created_at'' - ''updated_at'' - ''version'', coalesce((to_jsonb(t)->>''version'')::int, 1) from nyayos.%I t where id = $1 and dispute_id = $2', tbl)
      into prev, prev_version using pr.target_id, pr.dispute_id;
    if prev is null then raise exception 'target not found in dispute' using errcode = 'P0002'; end if;
  end if;

  -- Keys the proposal may set: existing columns that are not server-controlled. Unknown or
  -- server-controlled keys are refused outright (no silent drop; a client can never set
  -- tenant_id, dispute_id, id or version). Columns absent from the proposal keep their defaults.
  select array_agg(k) into bad_keys
    from jsonb_object_keys(pr.proposed_value) k
    where k in ('id', 'tenant_id', 'dispute_id', 'created_at', 'updated_at', 'version', 'created_by', 'uploader_id')  -- identity fields are server-set (A-033 M-4)
       or not exists (select 1 from information_schema.columns c
                      where c.table_schema = 'nyayos' and c.table_name = tbl and c.column_name = k);
  if bad_keys is not null then
    raise exception 'proposal contains keys that cannot be written: %', array_to_string(bad_keys, ', ') using errcode = '23514';
  end if;

  -- A-033 M-4: provenance guards. AI origins are inert in FM-A; a provenance reference must be well-formed.
  if pr.proposed_value ? 'origin_type' and pr.proposed_value ->> 'origin_type' = 'ai_extraction' then
    raise exception 'origin_type ai_extraction is not enabled in FM-A' using errcode = '23514';
  end if;
  if pr.proposed_value ? 'source_ref' and not nyayos.source_ref_valid(pr.proposed_value -> 'source_ref') then
    raise exception 'source_ref is not a valid provenance reference' using errcode = '23514';
  end if;

  select string_agg(format('%I', k), ', '), string_agg(format('v.%I', k), ', '), string_agg(format('%I = v.%I', k, k), ', ')
    into cols, vcols, setcols
    from jsonb_object_keys(pr.proposed_value) k;
  if cols is null then
    raise exception 'proposal has no writable fields' using errcode = '23514';
  end if;

  select exists (select 1 from information_schema.columns c
                 where c.table_schema = 'nyayos' and c.table_name = tbl and c.column_name = 'version') into has_version;
  select exists (select 1 from information_schema.columns c
                 where c.table_schema = 'nyayos' and c.table_name = tbl and c.column_name = 'created_by') into has_created_by;
  if has_created_by then extra_cols := ', created_by'; extra_vals := ', $4'; end if;  -- server-set identity (A-033 M-4)

  if pr.target_id is null then
    if has_version then
      execute format(
        'insert into nyayos.%I (id, tenant_id, dispute_id, version%s, %s) select gen_random_uuid(), $2, $3, 1%s, %s from jsonb_populate_record(null::nyayos.%I, $1) as v returning id',
        tbl, extra_cols, cols, extra_vals, vcols, tbl) into new_id using pr.proposed_value, pr.tenant_id, pr.dispute_id, uid;
    else
      execute format(
        'insert into nyayos.%I (id, tenant_id, dispute_id%s, %s) select gen_random_uuid(), $2, $3%s, %s from jsonb_populate_record(null::nyayos.%I, $1) as v returning id',
        tbl, extra_cols, cols, extra_vals, vcols, tbl) into new_id using pr.proposed_value, pr.tenant_id, pr.dispute_id, uid;
    end if;
  else
    if not has_version then
      -- dispute_statements and entity_source_forms are append-only records: propose a new item instead.
      raise exception 'target type % is append-only; a change must be proposed as a new item', pr.target_type using errcode = '23514';
    end if;
    new_id := pr.target_id;
    execute format(
      'update nyayos.%I t set %s, version = t.version + 1, updated_at = now() from (select * from jsonb_populate_record(null::nyayos.%I, $1)) as v where t.id = $2',
      tbl, setcols, tbl) using pr.proposed_value, pr.target_id;
  end if;

  insert into nyayos.user_corrections
    (tenant_id, dispute_id, target_type, target_id, previous_value, new_value, reason, user_id, origin_proposal_id, resulting_version)
  values (pr.tenant_id, pr.dispute_id, pr.target_type, new_id, prev, pr.proposed_value, coalesce(p_reason, pr.reason), uid, pr.id, prev_version + 1)
  returning id into cid;

  update nyayos.proposals set status = 'accepted', decided_by = uid, decided_at = now(), reason = coalesce(p_reason, reason)
    where id = p_proposal;
  perform nyayos.audit_append_internal('proposal.accepted', 'proposal', p_proposal::text, pr.tenant_id, pr.dispute_id, 'storage',
    jsonb_build_object('proposal_id', p_proposal::text, 'correction_id', cid::text));
  perform nyayos.audit_append_internal('correction.created', 'user_correction', cid::text, pr.tenant_id, pr.dispute_id, 'storage',
    jsonb_build_object('correction_id', cid::text, 'proposal_id', p_proposal::text, 'target_type', pr.target_type::text,
                       'target_id', new_id::text, 'version', prev_version + 1));
  return cid;
end $$;

create or replace function nyayos.request_deletion(p_scope_type nyayos.deletion_scope_type, p_scope_id uuid)
returns uuid
language plpgsql security definer
set search_path = pg_catalog, nyayos
as $$
declare uid uuid := nyayos.current_user_id(); tid uuid; did uuid; days int; rid uuid;
begin
  if uid is null then raise exception 'not authenticated' using errcode = '42501'; end if;
  case p_scope_type
    when 'dispute' then
      if not nyayos.is_dispute_member(p_scope_id, 'dispute_owner') then
        raise exception 'only the dispute owner may request deletion of a dispute' using errcode = '42501';
      end if;
      select d.tenant_id into tid from nyayos.disputes d where d.id = p_scope_id;
    when 'document' then
      select d.dispute_id, d.tenant_id into did, tid from nyayos.documents d where d.id = p_scope_id;
      if did is null or not nyayos.is_dispute_member(did, 'dispute_editor') then
        raise exception 'not authorised to request deletion of this document' using errcode = '42501';
      end if;
    when 'account' then
      if p_scope_id <> uid then
        raise exception 'account deletion may only be requested for oneself' using errcode = '42501';
      end if;
      select m.tenant_id into tid from nyayos.tenant_memberships m join nyayos.tenants t on t.id = m.tenant_id
        where m.user_id = uid and t.type = 'personal' and m.status = 'active' limit 1;
      if tid is null then raise exception 'no personal tenant for this user' using errcode = 'P0002'; end if;
  end case;
  select nullif(c.value, '')::int into days from nyayos.config_provisional c where c.key = 'deletion_undo_window_days';
  days := coalesce(days, 7);
  insert into nyayos.deletion_requests (tenant_id, scope_type, scope_id, requested_by, undo_until)
    values (tid, p_scope_type, p_scope_id, uid, now() + make_interval(days => days)) returning id into rid;
  perform nyayos.audit_append_internal('deletion.requested', 'deletion_request', rid::text, tid,
    case p_scope_type when 'dispute' then p_scope_id when 'document' then did end, 'storage',
    jsonb_build_object('deletion_request_id', rid::text, 'scope_type', p_scope_type::text));
  return rid;
end $$;

commit;
