-- =============================================================================
-- NyayOS — migration 0002: Duplicate Detection V1 lookup (A-036; plan A-035 §3.1)
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. Executed only on throwaway local containers
-- after 0001 during A-036 verification. Append-only: this file never alters 0001.
--
-- Adds an index on the server-computed SHA-256 of stored originals and a read-only,
-- SECURITY INVOKER lookup. Because the function runs as the caller, row-level security on
-- documents and document_versions applies unchanged: a user can only ever see duplicates
-- inside disputes they are a member of, and never across tenants. The lookup reports;
-- it never merges, rejects or deletes (write-once originals, S5).
-- =============================================================================

begin;

create index if not exists document_versions_sha256_idx on nyayos.document_versions (sha256);

create or replace function nyayos.find_duplicate_versions(p_sha256 text)
returns table (document_id uuid, dispute_id uuid, version int, display_label text, ingest_ts timestamptz)
language sql stable security invoker
set search_path = pg_catalog, nyayos
as $$
  select v.document_id, d.dispute_id, v.version, d.display_label, v.ingest_ts
  from nyayos.document_versions v
  join nyayos.documents d on d.id = v.document_id
  where v.sha256 = lower(p_sha256)
  order by v.ingest_ts, v.document_id, v.version
$$;

revoke all on function nyayos.find_duplicate_versions(text) from public;
grant execute on function nyayos.find_duplicate_versions(text) to nyayos_authenticated, nyayos_service_promote;

insert into nyayos.config_provisional (key, value, changed_by)
  values ('duplicate_detection_mode', 'inform', 'migration:0002')
  on conflict (key) do nothing;   -- 'inform' is the only mode in V1; 'block' is deliberately not offered

commit;
