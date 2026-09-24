-- =============================================================================
-- NyayOS — migration 0003: Stale Output Detection V1 (A-037; plan A-035 §3.2)
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. Executed only on disposable local containers
-- after 0001 and 0002 during A-037 verification. Append-only: never alters 0001/0002.
--
-- Adds one read-only function. It compares every entry of an export manifest with the
-- current canonical version and returns one row per entry plus one manifest-level row.
--   * SECURITY INVOKER: row-level security on exports, export_manifests, the canonical
--     tables and documents applies to the caller unchanged. No bypass.
--   * Lookups are confined to the export's own dispute, so a record in another dispute or
--     tenant is reported exactly like a missing one and its version is never returned.
--   * An export the caller cannot see (or that does not exist) returns zero rows.
--   * Versions only. Timestamps are never read. Missing or malformed data is UNKNOWN.
--   * No INSERT/UPDATE/DELETE anywhere; nothing is regenerated.
-- Twin of app/src/domain/staleness.ts (staleOutputRows); same reasons, same order.
--
-- Rollback (safe; no data depends on it):
--   drop function if exists nyayos.export_staleness(uuid);
-- =============================================================================

begin;

create or replace function nyayos.export_staleness(p_export_id uuid)
returns table (
  entry_kind text,
  item_type text,
  item_id text,
  recorded_version int,
  current_version int,
  status text,
  reason text,
  source_ref text,
  review_ref text
)
language sql stable security invoker
set search_path = pg_catalog, nyayos
as $$
  with m as (
    select e.id as export_id, e.dispute_id, em.entries,
      case
        when jsonb_typeof(em.entries) is distinct from 'object'
          or jsonb_typeof(em.entries -> 'items') is distinct from 'array'
          or jsonb_typeof(em.entries -> 'documents') is distinct from 'array'
          or jsonb_typeof(em.entries -> 'disputeId') is distinct from 'string'
          or em.entries ->> 'disputeId' = '' then 'malformed_manifest'
        when em.entries ->> 'disputeId' <> e.dispute_id::text then 'dispute_mismatch'
        else 'current'
      end as manifest_reason
    from nyayos.exports e
    join nyayos.export_manifests em on em.export_id = e.id
    where e.id = p_export_id
  ),
  canon as (
              select 'entity'::text as t, id, dispute_id, version from nyayos.entities
    union all select 'event', id, dispute_id, version from nyayos.events
    union all select 'date_assertion', id, dispute_id, version from nyayos.date_assertions
    union all select 'proposition', id, dispute_id, version from nyayos.propositions
    union all select 'evidence_item', id, dispute_id, version from nyayos.evidence_items
    union all select 'evidence_relation', id, dispute_id, version from nyayos.evidence_relations
    union all select 'contradiction', id, dispute_id, version from nyayos.contradictions
    union all select 'missing_evidence', id, dispute_id, version from nyayos.missing_evidence
    union all select 'issue', id, dispute_id, version from nyayos.issues
    union all select 'next_step', id, dispute_id, version from nyayos.next_steps
  ),
  item_entries as (
    select m.dispute_id, x.ord, x.v,
      case when jsonb_typeof(x.v -> 'targetType') = 'string' and x.v ->> 'targetType' <> '' then x.v ->> 'targetType' end as t,
      case when jsonb_typeof(x.v -> 'targetId') = 'string' and x.v ->> 'targetId' <> '' then x.v ->> 'targetId' end as id_text,
      case when jsonb_typeof(x.v -> 'version') = 'number' and (x.v ->> 'version') ~ '^[1-9][0-9]{0,8}$'
           then (x.v ->> 'version')::int end as recorded,
      case when jsonb_typeof(x.v -> 'sourceRef') = 'string' and x.v ->> 'sourceRef' <> '' then x.v ->> 'sourceRef' end as src
    from m
    cross join lateral jsonb_array_elements(m.entries -> 'items') with ordinality as x(v, ord)
    where m.manifest_reason = 'current'
  ),
  item_found as (
    select ie.*,
      (select c.version from canon c
        where c.t = ie.t
          and c.dispute_id = ie.dispute_id
          and c.id = case when ie.id_text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                          then ie.id_text::uuid end
        limit 1) as cur
    from item_entries ie
  ),
  item_rows as (
    select 'item'::text as entry_kind,
      coalesce(f.t, 'unknown') as item_type,
      coalesce(f.id_text, 'items[' || (f.ord - 1) || ']') as item_id,
      f.recorded as recorded_version,
      case
        when f.t is null or f.id_text is null then 'malformed_entry'
        when f.t not in ('entity','event','date_assertion','proposition','evidence_item','evidence_relation',
                         'contradiction','missing_evidence','issue','next_step') then 'unsupported_item_type'
        when f.recorded is null then 'malformed_recorded_version'
        when f.cur is null then 'not_found_or_inaccessible'
        when f.cur = f.recorded then 'current'
        when f.cur > f.recorded then 'newer_version'
        else 'recorded_version_ahead'
      end as reason,
      f.cur,
      coalesce(f.src, coalesce(f.t, 'unknown') || ':' || coalesce(f.id_text, 'items[' || (f.ord - 1) || ']')) as source_ref,
      coalesce(f.t, 'unknown') || ':' || coalesce(f.id_text, 'items[' || (f.ord - 1) || ']') as review_ref,
      f.ord
    from item_found f
  ),
  doc_entries as (
    select m.dispute_id, x.ord,
      case when jsonb_typeof(x.v -> 'documentId') = 'string' and x.v ->> 'documentId' <> '' then x.v ->> 'documentId' end as id_text,
      case when jsonb_typeof(x.v -> 'version') = 'number' and (x.v ->> 'version') ~ '^[1-9][0-9]{0,8}$'
           then (x.v ->> 'version')::int end as recorded
    from m
    cross join lateral jsonb_array_elements(m.entries -> 'documents') with ordinality as x(v, ord)
    where m.manifest_reason = 'current'
  ),
  doc_found as (
    select de.*,
      (select d.current_version from nyayos.documents d
        where d.dispute_id = de.dispute_id
          and d.status <> 'deleted'
          and d.id = case when de.id_text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                          then de.id_text::uuid end
        limit 1) as cur
    from doc_entries de
  ),
  doc_rows as (
    select 'document'::text as entry_kind,
      'document'::text as item_type,
      coalesce(f.id_text, 'documents[' || (f.ord - 1) || ']') as item_id,
      f.recorded as recorded_version,
      case
        when f.id_text is null then 'malformed_entry'
        when f.recorded is null then 'malformed_recorded_version'
        when f.cur is null then 'not_found_or_inaccessible'
        when f.cur = f.recorded then 'current'
        when f.cur > f.recorded then 'newer_version'
        else 'recorded_version_ahead'
      end as reason,
      f.cur,
      'document:' || coalesce(f.id_text, 'documents[' || (f.ord - 1) || ']') || coalesce('@' || f.recorded::text, '') as source_ref,
      'document:' || coalesce(f.id_text, 'documents[' || (f.ord - 1) || ']') as review_ref,
      f.ord
    from doc_found f
  ),
  all_rows as (
    select 'manifest'::text as entry_kind, 'manifest'::text as item_type, m.export_id::text as item_id,
      null::int as recorded_version, m.manifest_reason as reason, null::int as cur,
      'export:' || m.export_id as source_ref, 'export:' || m.export_id as review_ref, 0::bigint as ord
    from m
    union all select * from item_rows
    union all select * from doc_rows
  )
  select r.entry_kind, r.item_type, r.item_id, r.recorded_version,
    case when r.reason in ('current', 'newer_version', 'recorded_version_ahead') then r.cur end as current_version,
    case r.reason when 'current' then 'CURRENT' when 'newer_version' then 'STALE' else 'UNKNOWN' end as status,
    r.reason, r.source_ref, r.review_ref
  from all_rows r
  order by case r.entry_kind when 'manifest' then 0 when 'document' then 1 else 2 end,
           r.item_type collate "C", r.item_id collate "C", r.ord   -- manifest position breaks ties (TS sort is stable)
$$;

revoke all on function nyayos.export_staleness(uuid) from public;
grant execute on function nyayos.export_staleness(uuid) to nyayos_authenticated;

commit;
