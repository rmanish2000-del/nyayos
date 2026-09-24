-- =============================================================================
-- NyayOS — migration 0007: deletion purge worker V1 (A-040)
--   closes A-032 M-3 (the deletion worker could not delete anything) under founder decision D-032
--   ("deletion purge will use a server-controlled path") and the A-032 §9 pattern: worker-only DELETE
--   exemption on document_versions and user_corrections; audit_events, audit_anchors and
--   deletion_ledger stay immutable for every role.
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. Executed only on disposable local PostgreSQL containers
-- during A-040 verification. Append-only: 0001–0006 are not edited. No table is created or altered.
--
-- 1. nyayos.purge_deletion_request(request uuid) — the only path that physically deletes case data.
--    SECURITY DEFINER, executable ONLY by nyayos_service_deletion (no client, no other service).
--    Definer is strictly necessary: no role holds a DELETE grant on any table, so deletion outside
--    this audited function is impossible; the function also reads rows that row-level security hides.
--    Mitigations: fixed search_path (pg_temp last); every step below; output is status codes and
--    counts only.
--    Steps:
--      a. lock the request row; nonexistent → not_found_or_not_authorized (no write);
--         purged/verified → already_purged (no write: idempotent rerun);
--         undone → request_undone; undo window still open → undo_window_active (no write).
--      b. enumerate with the A-039 function nyayos.enumerate_deletion_scope() AS THE REQUESTER, so the
--         requester's authority is re-verified exactly as A-039 defines it; failure →
--         not_found_or_not_authorized plus one authz.denied audit event.
--      c. any retained_legal_hold row (or a legal hold blocking the account) → legal_hold_active
--         (no write). An unreadable hold value already classifies everything as held (A-039).
--      d. plan = rows classified purge_candidate only. Blocked, configuration-controlled, retained
--         and outside-scope rows are never deleted.
--      e. orphan closure (fixpoint): a candidate is KEPT while any row that is not being deleted
--         references it — through any foreign key in schema nyayos (read from the catalogue, so a
--         future foreign key is covered automatically), or through the logical references in
--         deletion_logical_refs_v1() (source_ref documentId / documentVersionId / locationId /
--         statementId, export manifest documents, job payload_ref, item target columns). Rows that
--         belong to a kept parent are kept: dispute_roles of a kept dispute, memberships of a kept
--         tenant, the version/location/annotation/custody subtree of a kept document and the scan jobs
--         of a kept upload (the same units A-039 blocks together) — no record is left half-deleted.
--         Historical identifiers in audit_events, deletion_requests, deletion_ledger,
--         retention_records and consents are content-free by design and are not live references.
--      f. delete children before parents in the fixed order deletion_purge_order_v1(), keyed by the
--         enumerated record ids AND the request's tenant; each table must delete exactly the planned
--         count or the whole purge rolls back.
--      g. nothing kept and nothing blocked → state purged, content-free tombstone in deletion_ledger,
--         audit deletion.purged. Otherwise → state incomplete, audit deletion.incomplete, no tombstone
--         (a later run retries; honest status, never shown as complete).
--    One transaction: a failure anywhere leaves no partial purge and no audit event (D-031).
--
-- 2. Append-only triggers on document_versions and user_corrections: UPDATE stays forbidden for
--    everyone; DELETE is permitted only while nyayos.purge_request names a request in state
--    'purging' inside the same transaction (only the worker sets both). audit_events, audit_anchors
--    and deletion_ledger are unchanged (always immutable).
--
-- Rollback (disposable databases only):
--   drop function if exists nyayos.purge_deletion_request(uuid);
--   drop function if exists nyayos.deletion_audit_internal(text, nyayos.audit_outcome, nyayos.audit_severity, uuid, uuid, uuid, uuid, jsonb);
--   drop function if exists nyayos.deletion_logical_refs_v1();
--   drop function if exists nyayos.deletion_purge_order_v1();
--   drop function if exists nyayos.deletion_record_key_v1(text);
--   drop trigger if exists document_versions_forbid_update on nyayos.document_versions;
--   drop trigger if exists document_versions_delete_guard on nyayos.document_versions;
--   drop trigger if exists user_corrections_forbid_update on nyayos.user_corrections;
--   drop trigger if exists user_corrections_delete_guard on nyayos.user_corrections;
--   create trigger document_versions_forbid before update or delete on nyayos.document_versions for each row execute function nyayos.tg_forbid();
--   create trigger user_corrections_forbid before update or delete on nyayos.user_corrections for each row execute function nyayos.tg_forbid();
--   drop function if exists nyayos.tg_forbid_delete_unless_purge();
-- =============================================================================

begin;

-- ---------------------------------------------------------------- 1. record keys (match enumerate_deletion_scope record_id)
create or replace function nyayos.deletion_record_key_v1(p_table text) returns text
language sql immutable set search_path = pg_catalog
as $$
  select case p_table
    when 'dispute_roles'      then 'c.dispute_id::text || '':'' || c.user_id::text'
    when 'tenant_memberships' then 'c.tenant_id::text || '':'' || c.user_id::text'
    when 'platform_roles'     then 'c.user_id::text || '':'' || c.role::text'
    when 'export_manifests'   then 'c.export_id::text'
    when 'retention_records'  then 'c.object_type || '':'' || c.object_id::text'
    when 'profiles'           then 'c.user_id::text'
    when 'audit_anchors'      then 'c.period'
    when 'deletion_allowlist' then 'c.table_name'
    when 'config_provisional' then 'c.key'
    when 'notices'            then 'c.purpose::text || '':'' || c.version::text || '':'' || c.language::text'
    else 'c.id::text' end
$$;
revoke all on function nyayos.deletion_record_key_v1(text) from public;

-- ---------------------------------------------------------------- 2. purge order (children before parents)
-- Twin: DELETION_PURGE_ORDER in app/src/domain/deletion.ts (schema-lint parity). Every table that
-- deletion_graph_v1() can classify purge_candidate must appear here; the worker refuses otherwise.
create or replace function nyayos.deletion_purge_order_v1() returns text[]
language sql immutable set search_path = pg_catalog
as $$
  select array['annotations', 'document_locations', 'custody_events', 'evidence_relations', 'entity_source_forms',
    'user_corrections', 'contradictions', 'date_assertions', 'missing_evidence', 'evidence_items', 'document_versions',
    'jobs', 'quarantine_uploads', 'export_manifests', 'exports', 'entities', 'events', 'propositions', 'issues',
    'next_steps', 'dispute_statements', 'proposals', 'documents', 'dispute_roles', 'disputes', 'tenant_memberships',
    'profiles', 'tenants']::text[]
$$;
revoke all on function nyayos.deletion_purge_order_v1() from public;
grant execute on function nyayos.deletion_purge_order_v1() to nyayos_service_deletion;

-- ---------------------------------------------------------------- 3. logical (non-foreign-key) references (internal)
-- SECURITY INVOKER with no grant: callable only from inside the definer worker below.
-- '*item' targets are item ids that may live in any canonical item table.
create or replace function nyayos.deletion_logical_refs_v1()
returns table (ref_table text, ref_rid text, target_table text, target_rid text)
language sql stable security invoker
set search_path = pg_catalog, nyayos
as $$
  with src as (
              select 'entities'::text as t, x.id::text as rid, x.source_ref as s from nyayos.entities x
    union all select 'entity_source_forms', x.id::text, x.source_ref from nyayos.entity_source_forms x
    union all select 'events', x.id::text, x.source_ref from nyayos.events x
    union all select 'date_assertions', x.id::text, x.source_ref from nyayos.date_assertions x
    union all select 'propositions', x.id::text, x.source_ref from nyayos.propositions x
    union all select 'evidence_items', x.id::text, x.source_ref from nyayos.evidence_items x
    union all select 'evidence_relations', x.id::text, x.source_ref from nyayos.evidence_relations x
    union all select 'contradictions', x.id::text, x.source_ref from nyayos.contradictions x
    union all select 'missing_evidence', x.id::text, x.source_ref from nyayos.missing_evidence x
    union all select 'issues', x.id::text, x.source_ref from nyayos.issues x
    union all select 'next_steps', x.id::text, x.source_ref from nyayos.next_steps x
  )
            select src.t, src.rid, 'documents'::text, src.s ->> 'documentId' from src where coalesce(src.s ->> 'documentId', '') <> ''
  union all select src.t, src.rid, 'document_versions', src.s ->> 'documentVersionId' from src where coalesce(src.s ->> 'documentVersionId', '') <> ''
  union all select src.t, src.rid, 'document_locations', src.s ->> 'locationId' from src where coalesce(src.s ->> 'locationId', '') <> ''
  union all select src.t, src.rid, 'dispute_statements', src.s ->> 'statementId' from src where coalesce(src.s ->> 'statementId', '') <> ''
  union all select 'export_manifests', m.export_id::text, 'documents', el ->> 'documentId'
    from nyayos.export_manifests m
    cross join lateral jsonb_array_elements(case when jsonb_typeof(m.entries -> 'documents') = 'array' then m.entries -> 'documents' else '[]'::jsonb end) el
    where coalesce(el ->> 'documentId', '') <> ''
  union all select 'jobs', j.id::text, 'quarantine_uploads', j.payload_ref::text from nyayos.jobs j
  union all select 'evidence_relations', x.id::text, '*item', x.target_id::text from nyayos.evidence_relations x where x.target_id is not null
  union all select 'contradictions', x.id::text, '*item', x.item_a_id::text from nyayos.contradictions x where x.item_a_id is not null
  union all select 'contradictions', x.id::text, '*item', x.item_b_id::text from nyayos.contradictions x where x.item_b_id is not null
  union all select 'date_assertions', x.id::text, '*item', x.target_id::text from nyayos.date_assertions x where x.target_id is not null
  union all select 'missing_evidence', x.id::text, '*item', x.related_id::text from nyayos.missing_evidence x where x.related_id is not null
  union all select 'proposals', x.id::text, '*item', x.target_id::text from nyayos.proposals x where x.target_id is not null
  union all select 'user_corrections', x.id::text, '*item', x.target_id::text from nyayos.user_corrections x where x.target_id is not null
$$;
revoke all on function nyayos.deletion_logical_refs_v1() from public;

-- ---------------------------------------------------------------- 4. worker audit writer (internal)
-- Same transaction as the purge (D-031). Actor is the deletion service, on behalf of the requester.
-- Metadata keys are from the allow-list enforced by the audit trigger; values are ids, codes and counts.
create or replace function nyayos.deletion_audit_internal(
  p_action text, p_outcome nyayos.audit_outcome, p_severity nyayos.audit_severity, p_request uuid,
  p_tenant uuid, p_dispute uuid, p_on_behalf_of uuid, p_metadata jsonb)
returns uuid
language plpgsql security invoker
set search_path = pg_catalog, nyayos
as $$
declare v_aid uuid;
begin
  insert into nyayos.audit_events (actor_type, actor_id, on_behalf_of, tenant_id, dispute_id, action, resource_type,
    resource_id, purpose, outcome, severity, request_id, ip_hash, user_agent_class, metadata, prev_hash, row_hash)
  values ('service', 'deletion_worker', p_on_behalf_of, p_tenant, p_dispute, p_action, 'deletion_request',
    p_request::text, 'storage', p_outcome, p_severity,
    coalesce(nyayos.current_request_id(), 'txn-' || pg_current_xact_id()::text), null, 'unknown',
    coalesce(p_metadata, '{}'::jsonb), repeat('0', 64), repeat('0', 64))
  returning id into v_aid;
  return v_aid;
end $$;
revoke all on function nyayos.deletion_audit_internal(text, nyayos.audit_outcome, nyayos.audit_severity, uuid, uuid, uuid, uuid, jsonb) from public;

-- ---------------------------------------------------------------- 5. append-only exemption for the worker only (D-032)
create or replace function nyayos.tg_forbid_delete_unless_purge() returns trigger
language plpgsql set search_path = pg_catalog, nyayos
as $$
declare v_req text := nullif(current_setting('nyayos.purge_request', true), '');
begin
  if tg_op = 'DELETE' and v_req is not null
     and exists (select 1 from nyayos.deletion_requests r where r.id::text = v_req and r.state = 'purging') then
    return old;
  end if;
  raise exception '% on % is not permitted (append-only)', tg_op, tg_table_name using errcode = '42501';
end $$;

drop trigger if exists document_versions_forbid on nyayos.document_versions;
create trigger document_versions_forbid_update before update on nyayos.document_versions
  for each row execute function nyayos.tg_forbid();
create trigger document_versions_delete_guard before delete on nyayos.document_versions
  for each row execute function nyayos.tg_forbid_delete_unless_purge();
drop trigger if exists user_corrections_forbid on nyayos.user_corrections;
create trigger user_corrections_forbid_update before update on nyayos.user_corrections
  for each row execute function nyayos.tg_forbid();
create trigger user_corrections_delete_guard before delete on nyayos.user_corrections
  for each row execute function nyayos.tg_forbid_delete_unless_purge();

-- ---------------------------------------------------------------- 6. the worker
create or replace function nyayos.purge_deletion_request(p_request uuid)
returns table (outcome text, request_state text, purged_records bigint, retained_records bigint)
language plpgsql volatile security definer
set search_path = pg_catalog, nyayos, pg_temp
as $$
#variable_conflict use_column
declare
  v_req nyayos.deletion_requests%rowtype;
  v_order text[] := nyayos.deletion_purge_order_v1();
  v_items text[] := array['entities', 'entity_source_forms', 'events', 'date_assertions', 'propositions', 'evidence_items',
    'evidence_relations', 'contradictions', 'missing_evidence', 'issues', 'next_steps', 'dispute_statements'];
  v_prev_principal text;
  v_dispute uuid;
  v_fk record;
  v_t text;
  v_key text;
  v_guard text;
  v_n bigint;
  v_planned bigint;
  v_changed bigint;
  v_total bigint := 0;
  v_kept bigint;
  v_blocked bigint;
  v_from text;
begin
  -- a. request gate ------------------------------------------------------------------------
  select * into v_req from nyayos.deletion_requests r where r.id = p_request for update;
  if v_req.id is null then
    return query select 'not_found_or_not_authorized'::text, null::text, 0::bigint, 0::bigint; return;
  end if;
  if v_req.state in ('purged', 'verified') then
    return query select 'already_purged'::text, v_req.state::text, 0::bigint, 0::bigint; return;
  end if;
  if v_req.state = 'undone' then
    return query select 'request_undone'::text, v_req.state::text, 0::bigint, 0::bigint; return;
  end if;
  if now() <= v_req.undo_until then
    return query select 'undo_window_active'::text, v_req.state::text, 0::bigint, 0::bigint; return;
  end if;
  v_from := v_req.state::text;
  v_dispute := case v_req.scope_type
    when 'dispute' then v_req.scope_id
    when 'document' then (select x.dispute_id from nyayos.documents x where x.id = v_req.scope_id and x.tenant_id = v_req.tenant_id)
    else null end;

  -- b. enumerate with the A-039 function as the requester (re-verifies authority) --------------
  -- a caller-created table of the same name is discarded, never trusted
  if to_regclass('pg_temp.nyayos_purge_enum') is not null then drop table pg_temp.nyayos_purge_enum; end if;
  if to_regclass('pg_temp.nyayos_purge_plan') is not null then drop table pg_temp.nyayos_purge_plan; end if;
  if to_regclass('pg_temp.nyayos_purge_refs') is not null then drop table pg_temp.nyayos_purge_refs; end if;
  create temp table nyayos_purge_enum (table_name text, record_id text, classification text, reason text) on commit drop;
  v_prev_principal := current_setting('nyayos.principal_id', true);
  begin
    perform set_config('nyayos.principal_id', v_req.requested_by::text, true);
    insert into pg_temp.nyayos_purge_enum select * from nyayos.enumerate_deletion_scope(p_request);
    perform set_config('nyayos.principal_id', coalesce(v_prev_principal, ''), true);
  exception when insufficient_privilege then
    perform set_config('nyayos.principal_id', coalesce(v_prev_principal, ''), true);
    -- dispute_id deliberately null: a forged request may name a record outside its own tenant
    perform nyayos.deletion_audit_internal('authz.denied', 'denied', 'medium', v_req.id, v_req.tenant_id, null,
      v_req.requested_by, jsonb_build_object('deletion_request_id', v_req.id::text, 'scope_type', v_req.scope_type::text,
      'reason_code', 'purge_requester_not_authorised'));
    return query select 'not_found_or_not_authorized'::text, null::text, 0::bigint, 0::bigint; return;
  end;

  -- c. legal hold: nothing is purged while any part of the request is held -----------------------
  if exists (select 1 from pg_temp.nyayos_purge_enum e
             where e.classification = 'retained_legal_hold' or e.reason = 'legal_hold_on_owned_dispute') then
    return query select 'legal_hold_active'::text, v_req.state::text, 0::bigint, 0::bigint; return;
  end if;

  -- d. plan: purge candidates only ------------------------------------------------------------
  create temp table nyayos_purge_plan (tn text not null, rid text not null, del boolean not null, why text,
    primary key (tn, rid)) on commit drop;
  insert into pg_temp.nyayos_purge_plan (tn, rid, del)
    select distinct e.table_name, e.record_id, true from pg_temp.nyayos_purge_enum e
    where e.classification = 'purge_candidate' and e.record_id is not null;
  if exists (select 1 from pg_temp.nyayos_purge_plan p where not (p.tn = any(v_order))) then
    raise exception 'purge plan names a table outside the purge order' using errcode = '55000';
  end if;

  -- e. orphan closure --------------------------------------------------------------------------
  create temp table nyayos_purge_refs on commit drop as select * from nyayos.deletion_logical_refs_v1();
  if exists (select 1 from pg_constraint c where c.contype = 'f' and c.connamespace = 'nyayos'::regnamespace
             and (cardinality(c.conkey) <> 1 or cardinality(c.confkey) <> 1)) then
    raise exception 'multi-column foreign key in schema nyayos: purge closure unsupported' using errcode = '55000';
  end if;
  loop
    v_changed := 0;
    -- (1) every foreign key: a parent stays while a row that is not being deleted references it
    for v_fk in
      select ch.relname as child, ca.attname as col, pa.relname as parent, pk.attname as pcol
      from pg_constraint c
      join pg_class ch on ch.oid = c.conrelid
      join pg_class pa on pa.oid = c.confrelid
      join pg_attribute ca on ca.attrelid = c.conrelid and ca.attnum = c.conkey[1]
      join pg_attribute pk on pk.attrelid = c.confrelid and pk.attnum = c.confkey[1]
      where c.contype = 'f' and c.connamespace = 'nyayos'::regnamespace
      order by 1, 2
    loop
      if nyayos.deletion_record_key_v1(v_fk.parent) <> format('c.%I::text', v_fk.pcol) then
        raise exception 'foreign key %.% does not reference the record key of %', v_fk.child, v_fk.col, v_fk.parent using errcode = '55000';
      end if;
      execute format(
        'update pg_temp.nyayos_purge_plan p set del = false, why = %L
           where p.tn = %L and p.del and exists (
             select 1 from nyayos.%I c where c.%I::text = p.rid
               and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = %L and q.del and q.rid = %s))',
        'kept_referenced_by:' || v_fk.child, v_fk.parent, v_fk.child, v_fk.col, v_fk.child,
        nyayos.deletion_record_key_v1(v_fk.child));
      get diagnostics v_n = row_count;
      v_changed := v_changed + v_n;
    end loop;
    -- (2) logical references
    update pg_temp.nyayos_purge_plan p set del = false, why = 'kept_referenced_by:' || r.ref_table
      from pg_temp.nyayos_purge_refs r
      where p.del and r.target_rid = p.rid
        and (r.target_table = p.tn or (r.target_table = '*item' and p.tn = any(v_items)))
        and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = r.ref_table and q.rid = r.ref_rid and q.del);
    get diagnostics v_n = row_count;
    v_changed := v_changed + v_n;
    -- (3) access rows of a kept parent
    update pg_temp.nyayos_purge_plan p set del = false, why = 'kept_with_parent:disputes'
      where p.tn = 'dispute_roles' and p.del
        and exists (select 1 from nyayos.disputes d where d.id::text = split_part(p.rid, ':', 1)
                    and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = 'disputes' and q.del and q.rid = d.id::text));
    get diagnostics v_n = row_count;
    v_changed := v_changed + v_n;
    -- (4) a kept document keeps its whole subtree; a kept upload keeps its scan jobs (as A-039 blocks them)
    update pg_temp.nyayos_purge_plan p set del = false, why = 'kept_with_parent:documents'
      where p.del and ((p.tn = 'document_versions' and exists (select 1 from nyayos.document_versions v where v.id::text = p.rid
                          and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = 'documents' and q.del and q.rid = v.document_id::text)))
                    or (p.tn = 'custody_events' and exists (select 1 from nyayos.custody_events ce where ce.id::text = p.rid
                          and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = 'documents' and q.del and q.rid = ce.document_id::text))));
    get diagnostics v_n = row_count;
    v_changed := v_changed + v_n;
    update pg_temp.nyayos_purge_plan p set del = false, why = 'kept_with_parent:document_versions'
      where p.del and p.tn in ('document_locations', 'annotations')
        and exists (select 1 from nyayos.document_locations l where p.tn = 'document_locations' and l.id::text = p.rid
                      and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = 'document_versions' and q.del and q.rid = l.document_version_id::text)
                    union all
                    select 1 from nyayos.annotations a where p.tn = 'annotations' and a.id::text = p.rid
                      and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = 'document_versions' and q.del and q.rid = a.document_version_id::text));
    get diagnostics v_n = row_count;
    v_changed := v_changed + v_n;
    update pg_temp.nyayos_purge_plan p set del = false, why = 'kept_with_parent:quarantine_uploads'
      where p.tn = 'jobs' and p.del
        and exists (select 1 from nyayos.jobs j where j.id::text = p.rid
                    and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = 'quarantine_uploads' and q.del and q.rid = j.payload_ref::text));
    get diagnostics v_n = row_count;
    v_changed := v_changed + v_n;
    update pg_temp.nyayos_purge_plan p set del = false, why = 'kept_with_parent:tenants'
      where p.tn = 'tenant_memberships' and p.del
        and exists (select 1 from nyayos.tenants t where t.id::text = split_part(p.rid, ':', 1)
                    and not exists (select 1 from pg_temp.nyayos_purge_plan q where q.tn = 'tenants' and q.del and q.rid = t.id::text));
    get diagnostics v_n = row_count;
    v_changed := v_changed + v_n;
    exit when v_changed = 0;
  end loop;

  -- f. delete, children first, bounded to the request's tenant --------------------------------
  update nyayos.deletion_requests set state = 'purging', locked_at = coalesce(locked_at, now()), updated_at = now()
    where id = v_req.id;
  perform set_config('nyayos.purge_request', v_req.id::text, true);
  foreach v_t in array v_order loop
    select count(*) into v_planned from pg_temp.nyayos_purge_plan p where p.tn = v_t and p.del;
    continue when v_planned = 0;
    v_key := nyayos.deletion_record_key_v1(v_t);
    v_guard := case
      when v_t = 'tenants' then ' and c.id = $1'
      when exists (select 1 from pg_attribute a where a.attrelid = format('nyayos.%I', v_t)::regclass
                   and a.attname = 'tenant_id' and not a.attisdropped) then ' and c.tenant_id = $1'
      else '' end;
    execute format('delete from nyayos.%I c where %s in (select q.rid from pg_temp.nyayos_purge_plan q where q.tn = %L and q.del)%s',
                   v_t, v_key, v_t, v_guard) using v_req.tenant_id;
    get diagnostics v_n = row_count;
    if v_n <> v_planned then
      raise exception 'purge of % removed % rows but % were planned', v_t, v_n, v_planned using errcode = '55000';
    end if;
    v_total := v_total + v_n;
  end loop;
  perform set_config('nyayos.purge_request', '', true);

  -- g. honest outcome, tombstone and audit -----------------------------------------------------
  select count(*) into v_kept from pg_temp.nyayos_purge_plan p where not p.del;
  select count(*) into v_blocked from pg_temp.nyayos_purge_enum e where e.classification = 'blocked_active_reference';
  if v_kept = 0 and v_blocked = 0 then
    update nyayos.deletion_requests set state = 'purged', purged_at = now(), updated_at = now() where id = v_req.id;
    insert into nyayos.deletion_ledger (tenant_id, scope_type, scope_id) values (v_req.tenant_id, v_req.scope_type, v_req.scope_id);
    perform nyayos.deletion_audit_internal('deletion.purged', 'success', 'info', v_req.id, v_req.tenant_id, v_dispute,
      v_req.requested_by, jsonb_build_object('deletion_request_id', v_req.id::text, 'scope_type', v_req.scope_type::text,
      'state_from', v_from, 'state_to', 'purged', 'count', v_total));
    return query select 'purged'::text, 'purged'::text, v_total, 0::bigint;
  else
    update nyayos.deletion_requests set state = 'incomplete', updated_at = now() where id = v_req.id;
    perform nyayos.deletion_audit_internal('deletion.incomplete', 'success', 'low', v_req.id, v_req.tenant_id, v_dispute,
      v_req.requested_by, jsonb_build_object('deletion_request_id', v_req.id::text, 'scope_type', v_req.scope_type::text,
      'state_from', v_from, 'state_to', 'incomplete', 'reason_code', 'records_retained_blocked_or_referenced',
      'count', v_total));
    return query select 'incomplete'::text, 'incomplete'::text, v_total, v_kept + v_blocked;
  end if;
end $$;

revoke all on function nyayos.purge_deletion_request(uuid) from public;
grant execute on function nyayos.purge_deletion_request(uuid) to nyayos_service_deletion;

commit;
