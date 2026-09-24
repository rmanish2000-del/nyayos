-- =============================================================================
-- NyayOS — migration 0006: explicit deletion scope graph and read-only enumeration (A-039)
--   closes A-032 M-6 (deletion scope graph incomplete; documents and quarantine uploads omitted)
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. Executed only on disposable local PostgreSQL containers
-- during A-039 verification. Append-only: 0001–0005 are not edited. No table is created or altered.
-- Physical purge is NOT implemented (founder decision D-032); nothing here deletes or mutates.
--
-- 1. nyayos.deletion_graph_v1() — the explicit graph: one row per (table, scope, edge) with a
--    default classification and a documented reason. Every table in schema nyayos appears at
--    least once; tables never enumerated appear with scope 'none' and the exclusion reason.
--    Twin: DELETION_GRAPH in app/src/domain/deletion.ts; scripts/db/schema-lint.mjs enforces parity.
--
-- 2. nyayos.enumerate_deletion_scope(request uuid) — read-only enumeration for one deletion
--    request, returning (table_name, record_id, classification, reason):
--      purge_candidate | retained_audit_metadata | retained_legal_hold | blocked_active_reference
--      | outside_request_scope | configuration_controlled
--    Authorisation: the caller must be the request's requester AND still hold the authority the
--    request needed (dispute owner / document editor / self for account). A nonexistent request and
--    an inaccessible one raise the same error (42501, same message): no existence leakage.
--    SECURITY DEFINER is strictly necessary: complete enumeration must include rows that row-level
--    security hides from the requester (another member's quarantine upload, audit rows written by
--    service identities, tombstones). Mitigations: fixed search_path; explicit authorisation first;
--    every read bounded to the request's tenant and to disputes in scope; only ids, table names and
--    fixed codes are returned — never content, labels or foreign identifiers.
--    Isolation rules: child records never widen scope into another dispute; a record in scope that
--    is referenced from another dispute (document refs, source_ref.documentId, export manifests,
--    item-reference columns) is blocked, without naming the foreign record; a job in another tenant
--    pointing at an in-scope upload is one aggregated blocked row with no identifier; a quarantine upload
--    whose content hash also matches a document outside the request is blocked as ambiguous; account deletion reports memberships and
--    roles outside the tenant as one aggregated blocked row per table (no identifiers).
--    Configuration: document_reference_policy (block | cascade) decides how same-dispute references
--    to a deleted document are treated; legal_hold_dispute_ids (manual, comma-separated UUIDs,
--    pending counsel OL-06) turns purge candidates of held disputes into retained_legal_hold; an
--    unreadable hold value holds everything in scope (fail closed).
--    Content-free tombstone policy (OL-03 interim) is unchanged: deletion_ledger rows are retained.
--
-- Rollback (disposable databases only):
--   drop function if exists nyayos.enumerate_deletion_scope(uuid);
--   drop function if exists nyayos.deletion_document_refs_v1(uuid[]);
--   drop function if exists nyayos.deletion_graph_v1();
--   delete from nyayos.config_provisional where key = 'legal_hold_dispute_ids';
-- =============================================================================

begin;

-- ---------------------------------------------------------------- 1. explicit graph
create or replace function nyayos.deletion_graph_v1()
returns table (table_name text, scope_type text, edge text, classification text, reason text)
language sql immutable set search_path = pg_catalog
as $$
  select * from (values
    -- dispute scope (also applied to every dispute the account owns)
    ('disputes', 'dispute', 'root', 'purge_candidate', 'the dispute being deleted'),
    ('dispute_roles', 'dispute', 'dispute_id', 'purge_candidate', 'membership of the dispute'),
    ('dispute_statements', 'dispute', 'dispute_id', 'purge_candidate', 'dispute narrative and intake answers'),
    ('entities', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('entity_source_forms', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('events', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('date_assertions', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('propositions', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('evidence_items', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('evidence_relations', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('contradictions', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('missing_evidence', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('issues', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('next_steps', 'dispute', 'dispute_id', 'purge_candidate', 'canonical item; blocked if referenced from another dispute'),
    ('proposals', 'dispute', 'dispute_id', 'purge_candidate', 'single-writer proposals of the dispute'),
    ('user_corrections', 'dispute', 'dispute_id', 'purge_candidate', 'version history of the dispute'),
    ('quarantine_uploads', 'dispute', 'dispute_id', 'purge_candidate', 'uploads into the dispute, any uploader'),
    ('documents', 'dispute', 'dispute_id', 'purge_candidate', 'documents of the dispute; blocked if referenced from another dispute'),
    ('document_versions', 'dispute', 'documents.id', 'purge_candidate', 'write-once originals of in-scope documents'),
    ('document_locations', 'dispute', 'document_versions.id', 'purge_candidate', 'page links on in-scope versions'),
    ('annotations', 'dispute', 'document_versions.id', 'purge_candidate', 'annotations on in-scope versions'),
    ('custody_events', 'dispute', 'documents.id', 'purge_candidate', 'custody chain of in-scope documents'),
    ('jobs', 'dispute', 'quarantine_uploads.id (payload_ref)', 'purge_candidate', 'scan jobs of in-scope uploads; blocked if tenant differs'),
    ('exports', 'dispute', 'dispute_id', 'purge_candidate', 'exports of the dispute'),
    ('export_manifests', 'dispute', 'exports.id', 'purge_candidate', 'manifests of in-scope exports'),
    ('consents', 'dispute', 'scope_id (scope_type = dispute)', 'configuration_controlled', 'consent history retention pending counsel (OL-02)'),
    ('audit_events', 'dispute', 'dispute_id', 'retained_audit_metadata', 'append-only, content-free audit'),
    ('deletion_requests', 'dispute', 'scope_id', 'retained_audit_metadata', 'deletion workflow record, content-free'),
    ('retention_records', 'dispute', 'object_id', 'retained_audit_metadata', 'retention and verification record'),
    ('deletion_ledger', 'dispute', 'scope_id', 'retained_audit_metadata', 'content-free tombstone (OL-03 interim)'),
    -- document scope
    ('documents', 'document', 'root', 'purge_candidate', 'the document being deleted; blocked per document_reference_policy or cross-dispute reference'),
    ('document_versions', 'document', 'document_id', 'purge_candidate', 'write-once originals of the document'),
    ('document_locations', 'document', 'document_versions.id', 'purge_candidate', 'page links on the document'),
    ('annotations', 'document', 'document_versions.id', 'purge_candidate', 'annotations on the document'),
    ('custody_events', 'document', 'document_id', 'purge_candidate', 'custody chain of the document'),
    ('quarantine_uploads', 'document', 'sha256 of a version, same dispute', 'purge_candidate', 'upload that became this document; blocked if the hash also matches another document'),
    ('jobs', 'document', 'quarantine_uploads.id (payload_ref)', 'purge_candidate', 'scan jobs of those uploads'),
    ('evidence_items', 'document', 'document_id', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('entities', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('entity_source_forms', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('events', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('date_assertions', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('propositions', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('evidence_items', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('evidence_relations', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('contradictions', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('missing_evidence', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('issues', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('next_steps', 'document', 'source_ref.documentId', 'outside_request_scope', 'reference to the document; configuration_controlled under cascade policy'),
    ('export_manifests', 'document', 'entries.documents[].documentId', 'outside_request_scope', 'export that includes the document; configuration_controlled under cascade policy'),
    ('audit_events', 'document', 'resource_id or metadata.document_id', 'retained_audit_metadata', 'append-only, content-free audit'),
    ('deletion_requests', 'document', 'scope_id', 'retained_audit_metadata', 'deletion workflow record, content-free'),
    ('retention_records', 'document', 'object_id', 'retained_audit_metadata', 'retention and verification record'),
    ('deletion_ledger', 'document', 'scope_id', 'retained_audit_metadata', 'content-free tombstone (OL-03 interim)'),
    -- account scope
    ('profiles', 'account', 'user_id', 'purge_candidate', 'the account profile'),
    ('tenants', 'account', 'personal tenant', 'purge_candidate', 'the personal tenant; blocked if shared with other members or under legal hold'),
    ('tenant_memberships', 'account', 'tenant_id', 'purge_candidate', 'memberships of the personal tenant; other members blocked; memberships elsewhere blocked in aggregate'),
    ('dispute_roles', 'account', 'user_id outside owned disputes', 'blocked_active_reference', 'roles in disputes the account does not own; reported in aggregate, no identifiers'),
    ('platform_roles', 'account', 'user_id', 'configuration_controlled', 'operator role; removal is an operator decision'),
    ('disputes', 'account', 'owned disputes in the tenant', 'purge_candidate', 'dispute scope applied to every dispute the account owns'),
    ('consents', 'account', 'principal_user_id', 'configuration_controlled', 'consent history retention pending counsel (OL-02)'),
    ('audit_events', 'account', 'tenant_id or actor_id', 'retained_audit_metadata', 'append-only audit; actor pseudonymisation is later work'),
    ('deletion_requests', 'account', 'requested_by', 'retained_audit_metadata', 'deletion workflow record, content-free'),
    ('retention_records', 'account', 'object_id', 'retained_audit_metadata', 'retention and verification record'),
    ('deletion_ledger', 'account', 'scope_id', 'retained_audit_metadata', 'content-free tombstone (OL-03 interim)'),
    -- never enumerated
    ('notices', 'none', 'global', 'outside_request_scope', 'versioned notice text shared by all users; holds no personal data'),
    ('intake_questions', 'none', 'global', 'outside_request_scope', 'global question set; holds no personal data'),
    ('audit_anchors', 'none', 'global', 'retained_audit_metadata', 'period anchors of the global audit chain; content-free'),
    ('deletion_allowlist', 'none', 'global', 'outside_request_scope', 'registry of tables; holds no case data'),
    ('config_provisional', 'none', 'global', 'outside_request_scope', 'configuration; holds no case data')
  ) as g(table_name, scope_type, edge, classification, reason)
$$;

revoke all on function nyayos.deletion_graph_v1() from public;
grant execute on function nyayos.deletion_graph_v1() to nyayos_authenticated, nyayos_service_deletion;

-- ---------------------------------------------------------------- 2. document references (internal)
-- SECURITY INVOKER with no grant: callable only from inside the definer enumeration below.
create or replace function nyayos.deletion_document_refs_v1(p_docs uuid[])
returns table (ref_table text, ref_id text, ref_dispute uuid, doc_id text)
language sql stable security invoker
set search_path = pg_catalog, nyayos
as $$
  select 'evidence_items'::text, x.id::text, x.dispute_id, x.document_id::text from nyayos.evidence_items x where x.document_id = any(p_docs)
  union all select 'entities', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.entities x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'entity_source_forms', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.entity_source_forms x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'events', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.events x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'date_assertions', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.date_assertions x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'propositions', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.propositions x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'evidence_items', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.evidence_items x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'evidence_relations', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.evidence_relations x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'contradictions', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.contradictions x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'missing_evidence', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.missing_evidence x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'issues', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.issues x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'next_steps', x.id::text, x.dispute_id, x.source_ref ->> 'documentId' from nyayos.next_steps x where x.source_ref ->> 'documentId' = any(p_docs::text[])
  union all select 'export_manifests', m.export_id::text, e.dispute_id, el ->> 'documentId'
    from nyayos.export_manifests m
    join nyayos.exports e on e.id = m.export_id
    cross join lateral jsonb_array_elements(case when jsonb_typeof(m.entries -> 'documents') = 'array' then m.entries -> 'documents' else '[]'::jsonb end) el
    where el ->> 'documentId' = any(p_docs::text[])
$$;

revoke all on function nyayos.deletion_document_refs_v1(uuid[]) from public;

-- ---------------------------------------------------------------- 3. enumeration
create or replace function nyayos.enumerate_deletion_scope(p_request uuid)
returns table (table_name text, record_id text, classification text, reason text)
language plpgsql stable security definer
set search_path = pg_catalog, nyayos
as $$
#variable_conflict use_column
declare
  uid uuid := nyayos.current_user_id();
  req nyayos.deletion_requests%rowtype;
  ok boolean := false;
  t uuid;
  doc_dispute uuid;
  home uuid[] := '{}';     -- disputes whose own references are "inside" the request
  d uuid[] := '{}';        -- disputes wholly in scope
  docs uuid[] := '{}';
  vers uuid[] := '{}';
  ups uuid[] := '{}';
  exps uuid[] := '{}';
  held uuid[] := '{}';
  hold_all boolean := false;
  hold_raw text;
  policy text;
  foreign_ref_docs text[] := '{}';
  local_ref_docs text[] := '{}';
  bdocs uuid[] := '{}';
  bups uuid[] := '{}';
  inbound uuid[] := '{}';
  tenant_hold boolean := false;
  tenant_shared boolean := false;
begin
  -- Authorisation. Nonexistent and inaccessible requests fail identically.
  if uid is not null then
    select * into req from nyayos.deletion_requests r where r.id = p_request;
  end if;
  if req.id is not null and req.requested_by = uid then
    case req.scope_type
      when 'dispute' then
        ok := exists (select 1 from nyayos.disputes x where x.id = req.scope_id and x.tenant_id = req.tenant_id)
              and nyayos.is_dispute_member(req.scope_id, 'dispute_owner');
      when 'document' then
        select x.dispute_id into doc_dispute from nyayos.documents x where x.id = req.scope_id and x.tenant_id = req.tenant_id;
        ok := doc_dispute is not null and nyayos.is_dispute_member(doc_dispute, 'dispute_editor');
      when 'account' then
        ok := req.scope_id = uid and exists (
          select 1 from nyayos.tenant_memberships m join nyayos.tenants tt on tt.id = m.tenant_id
          where m.tenant_id = req.tenant_id and m.user_id = uid and m.status = 'active' and tt.type = 'personal');
    end case;
  end if;
  if not coalesce(ok, false) then
    raise exception 'deletion request not found or not accessible' using errcode = '42501';
  end if;
  t := req.tenant_id;

  -- Scope sets, always bounded to the request's tenant.
  if req.scope_type = 'dispute' then
    d := array[req.scope_id];
  elsif req.scope_type = 'account' then
    select coalesce(array_agg(x.id), '{}') into d
      from nyayos.disputes x join nyayos.dispute_roles r on r.dispute_id = x.id
      where x.tenant_id = t and r.user_id = uid and r.dispute_role = 'dispute_owner';
  end if;
  home := case when req.scope_type = 'document' then array[doc_dispute] else d end;
  if req.scope_type = 'document' then
    docs := array[req.scope_id];
  else
    select coalesce(array_agg(x.id), '{}') into docs from nyayos.documents x where x.tenant_id = t and x.dispute_id = any(d);
  end if;
  select coalesce(array_agg(x.id), '{}') into vers from nyayos.document_versions x where x.document_id = any(docs);
  if req.scope_type = 'document' then
    select coalesce(array_agg(q.id), '{}') into ups from nyayos.quarantine_uploads q
      where q.tenant_id = t and q.dispute_id = doc_dispute
        and q.sha256 in (select v.sha256 from nyayos.document_versions v where v.document_id = any(docs));
    select coalesce(array_agg(q.id), '{}') into bups from nyayos.quarantine_uploads q
      where q.id = any(ups) and exists (
        select 1 from nyayos.document_versions v join nyayos.documents o on o.id = v.document_id
        where v.sha256 = q.sha256 and o.dispute_id = doc_dispute and not (o.id = any(docs)));
  else
    select coalesce(array_agg(q.id), '{}') into ups from nyayos.quarantine_uploads q where q.tenant_id = t and q.dispute_id = any(d);
  end if;
  select coalesce(array_agg(x.id), '{}') into exps from nyayos.exports x where x.tenant_id = t and x.dispute_id = any(d);

  -- Configuration: document reference policy and manual legal hold (fail closed on unreadable hold).
  policy := coalesce((select c.value from nyayos.config_provisional c where c.key = 'document_reference_policy'), 'block');
  hold_raw := coalesce((select c.value from nyayos.config_provisional c where c.key = 'legal_hold_dispute_ids'), '');
  if btrim(hold_raw) <> '' then
    hold_all := exists (select 1 from regexp_split_to_table(btrim(hold_raw), '\s*,\s*') tok
                        where tok !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
    if not hold_all then
      select coalesce(array_agg(tok::uuid), '{}') into held from regexp_split_to_table(btrim(hold_raw), '\s*,\s*') tok;
    end if;
  end if;
  tenant_hold := req.scope_type = 'account' and (hold_all or d && held);
  tenant_shared := req.scope_type = 'account' and exists (
    select 1 from nyayos.tenant_memberships m where m.tenant_id = t and m.user_id <> uid);

  -- References into the request from elsewhere (never named in the output).
  select coalesce(array_agg(distinct r.doc_id), '{}') into foreign_ref_docs
    from nyayos.deletion_document_refs_v1(docs) r where not (r.ref_dispute = any(home));
  select coalesce(array_agg(distinct r.doc_id), '{}') into local_ref_docs
    from nyayos.deletion_document_refs_v1(docs) r where r.ref_dispute = any(home);
  select coalesce(array_agg(x), '{}') into bdocs from unnest(docs) x
    where x::text = any(foreign_ref_docs)
       or (req.scope_type = 'document' and x::text = any(local_ref_docs) and policy <> 'cascade');
  if cardinality(d) > 0 then
    select coalesce(array_agg(distinct r.ref), '{}') into inbound from (
                select x.target_id as ref, x.dispute_id as rd from nyayos.evidence_relations x
      union all select x.evidence_item_id, x.dispute_id from nyayos.evidence_relations x
      union all select x.item_a_id, x.dispute_id from nyayos.contradictions x
      union all select x.item_b_id, x.dispute_id from nyayos.contradictions x
      union all select x.target_id, x.dispute_id from nyayos.date_assertions x
      union all select x.related_id, x.dispute_id from nyayos.missing_evidence x
      union all select x.entity_id, x.dispute_id from nyayos.entity_source_forms x
      union all select x.target_id, x.dispute_id from nyayos.proposals x
      union all select x.target_id, x.dispute_id from nyayos.user_corrections x
    ) r where r.ref is not null and not (r.rd = any(d));
  end if;

  return query
  select b.tn, b.rid,
    case when b.cls in ('purge_candidate', 'configuration_controlled') and (hold_all or (b.hd is not null and b.hd = any(held)))
         then 'retained_legal_hold' else b.cls end,
    case when b.cls in ('purge_candidate', 'configuration_controlled') and hold_all then 'legal_hold_configuration_unreadable'
         when b.cls in ('purge_candidate', 'configuration_controlled') and b.hd is not null and b.hd = any(held) then 'legal_hold_configured'
         else b.rsn end
  from (
    -- dispute scope -----------------------------------------------------------
    select 'disputes'::text as tn, x.id::text as rid, 'purge_candidate'::text as cls, 'in_scope_root'::text as rsn, x.id as hd
      from nyayos.disputes x where x.id = any(d) and x.tenant_id = t
    union all select 'dispute_roles', x.dispute_id::text || ':' || x.user_id::text, 'purge_candidate', 'dispute_child', x.dispute_id
      from nyayos.dispute_roles x where x.dispute_id = any(d)
    union all select 'dispute_statements', x.id::text, 'purge_candidate', 'dispute_child', x.dispute_id
      from nyayos.dispute_statements x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'entities', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.entities x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'entity_source_forms', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.entity_source_forms x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'events', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.events x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'date_assertions', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.date_assertions x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'propositions', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.propositions x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'evidence_items', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.evidence_items x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'evidence_relations', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.evidence_relations x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'contradictions', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.contradictions x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'missing_evidence', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.missing_evidence x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'issues', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.issues x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'next_steps', x.id::text, case when x.id = any(inbound) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(inbound) then 'referenced_from_another_scope' else 'dispute_child' end, x.dispute_id
      from nyayos.next_steps x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'proposals', x.id::text, 'purge_candidate', 'dispute_child', x.dispute_id
      from nyayos.proposals x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'user_corrections', x.id::text, 'purge_candidate', 'dispute_child', x.dispute_id
      from nyayos.user_corrections x where x.dispute_id = any(d) and x.tenant_id = t
    union all select 'exports', x.id::text, 'purge_candidate', 'dispute_child', x.dispute_id
      from nyayos.exports x where x.id = any(exps)
    union all select 'export_manifests', x.export_id::text, 'purge_candidate', 'export_child', e.dispute_id
      from nyayos.export_manifests x join nyayos.exports e on e.id = x.export_id where x.export_id = any(exps)
    -- documents, versions and their children (dispute and document scopes) --------
    union all select 'documents', x.id::text,
        case when x.id = any(bdocs) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id::text = any(foreign_ref_docs) then 'referenced_from_another_scope'
             when x.id = any(bdocs) then 'referenced_by_items_in_dispute'
             when req.scope_type = 'document' then 'in_scope_root' else 'dispute_child' end,
        x.dispute_id
      from nyayos.documents x where x.id = any(docs) and x.tenant_id = t
    union all select 'document_versions', x.id::text,
        case when x.document_id = any(bdocs) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.document_id = any(bdocs) then 'parent_document_blocked' else 'document_child' end, o.dispute_id
      from nyayos.document_versions x join nyayos.documents o on o.id = x.document_id where x.document_id = any(docs)
    union all select 'document_locations', x.id::text,
        case when v.document_id = any(bdocs) then 'blocked_active_reference' else 'purge_candidate' end,
        case when v.document_id = any(bdocs) then 'parent_document_blocked' else 'document_child' end, o.dispute_id
      from nyayos.document_locations x join nyayos.document_versions v on v.id = x.document_version_id
      join nyayos.documents o on o.id = v.document_id where x.document_version_id = any(vers)
    union all select 'annotations', x.id::text,
        case when v.document_id = any(bdocs) then 'blocked_active_reference' else 'purge_candidate' end,
        case when v.document_id = any(bdocs) then 'parent_document_blocked' else 'document_child' end, o.dispute_id
      from nyayos.annotations x join nyayos.document_versions v on v.id = x.document_version_id
      join nyayos.documents o on o.id = v.document_id where x.document_version_id = any(vers)
    union all select 'custody_events', x.id::text,
        case when x.document_id = any(bdocs) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.document_id = any(bdocs) then 'parent_document_blocked' else 'document_child' end, o.dispute_id
      from nyayos.custody_events x join nyayos.documents o on o.id = x.document_id where x.document_id = any(docs)
    union all select 'quarantine_uploads', x.id::text,
        case when x.id = any(bups) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.id = any(bups) then 'ambiguous_shared_content_hash'
             when req.scope_type = 'document' then 'hash_matches_document_version' else 'dispute_child' end, x.dispute_id
      from nyayos.quarantine_uploads x where x.id = any(ups)
    union all select 'jobs', x.id::text,
        case when x.payload_ref = any(bups) then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.payload_ref = any(bups) then 'parent_upload_blocked' else 'upload_child' end,
        q.dispute_id
      from nyayos.jobs x join nyayos.quarantine_uploads q on q.id = x.payload_ref where x.payload_ref = any(ups) and x.tenant_id = t
    -- a job in another tenant pointing at an in-scope upload: ambiguous, reported without its identifier
    union all select 'jobs', null::text, 'blocked_active_reference', 'ambiguous_job_tenant', null::uuid
      where exists (select 1 from nyayos.jobs x where x.payload_ref = any(ups) and x.tenant_id <> t)
    -- document scope: same-dispute references to the document ----------------------
    union all select distinct r.ref_table, r.ref_id,
        case when policy = 'cascade' then 'configuration_controlled' else 'outside_request_scope' end,
        case when policy = 'cascade' then 'references_document_cascade_policy' else 'references_document_block_policy' end,
        r.ref_dispute
      from nyayos.deletion_document_refs_v1(docs) r where req.scope_type = 'document' and r.ref_dispute = any(home)
    -- consents -------------------------------------------------------------------
    union all select 'consents', x.id::text, 'configuration_controlled', 'consent_history_retention_pending_counsel',
        case when x.scope_type = 'dispute' then x.scope_id end
      from nyayos.consents x where x.tenant_id = t
        and ((x.scope_type = 'dispute' and x.scope_id = any(d)) or (req.scope_type = 'account' and x.principal_user_id = uid))
    -- retained workflow and audit metadata ----------------------------------------
    union all select 'audit_events', x.id::text, 'retained_audit_metadata', 'append_only_audit', null::uuid
      from nyayos.audit_events x
      where (x.tenant_id = t and (x.dispute_id = any(d)
               or (req.scope_type = 'document' and (x.resource_id = req.scope_id::text or x.metadata ->> 'document_id' = req.scope_id::text))
               or req.scope_type = 'account'))
         or (req.scope_type = 'account' and x.tenant_id is null and x.actor_id = uid::text)
    union all select 'deletion_requests', x.id::text, 'retained_audit_metadata', 'deletion_workflow_record', null::uuid
      from nyayos.deletion_requests x where x.tenant_id = t
        and (x.scope_id = any(d) or x.scope_id = any(docs) or (req.scope_type = 'account' and x.scope_type = 'account' and x.scope_id = uid))
    union all select 'retention_records', x.object_type || ':' || x.object_id::text, 'retained_audit_metadata', 'retention_record', null::uuid
      from nyayos.retention_records x where x.tenant_id = t
        and (x.object_id = any(d) or x.object_id = any(docs) or x.object_id = any(vers) or x.object_id = any(exps)
             or (req.scope_type = 'account' and x.object_id = uid))
    union all select 'deletion_ledger', x.id::text, 'retained_audit_metadata', 'content_free_tombstone', null::uuid
      from nyayos.deletion_ledger x where x.tenant_id = t
        and (x.scope_id = any(d) or x.scope_id = any(docs) or (req.scope_type = 'account' and x.scope_id = uid))
    -- account scope ------------------------------------------------------------------
    union all select 'profiles', x.user_id::text,
        case when tenant_hold then 'blocked_active_reference' else 'purge_candidate' end,
        case when tenant_hold then 'legal_hold_on_owned_dispute' else 'account_root' end, null::uuid
      from nyayos.profiles x where req.scope_type = 'account' and x.user_id = uid
    union all select 'tenants', x.id::text,
        case when tenant_hold or tenant_shared then 'blocked_active_reference' else 'purge_candidate' end,
        case when tenant_shared then 'tenant_shared_with_other_members' when tenant_hold then 'legal_hold_on_owned_dispute' else 'personal_tenant' end,
        null::uuid
      from nyayos.tenants x where req.scope_type = 'account' and x.id = t
    union all select 'tenant_memberships', x.tenant_id::text || ':' || x.user_id::text,
        case when x.user_id <> uid or tenant_hold then 'blocked_active_reference' else 'purge_candidate' end,
        case when x.user_id <> uid then 'shared_tenant_membership' when tenant_hold then 'legal_hold_on_owned_dispute' else 'own_membership' end,
        null::uuid
      from nyayos.tenant_memberships x where req.scope_type = 'account' and x.tenant_id = t
    union all select 'platform_roles', x.user_id::text || ':' || x.role::text, 'configuration_controlled', 'platform_role_operator_decision', null::uuid
      from nyayos.platform_roles x where req.scope_type = 'account' and x.user_id = uid
    union all select 'tenant_memberships', null::text, 'blocked_active_reference', 'membership_in_another_tenant', null::uuid
      where req.scope_type = 'account'
        and exists (select 1 from nyayos.tenant_memberships m where m.user_id = uid and m.tenant_id <> t)
    union all select 'dispute_roles', null::text, 'blocked_active_reference', 'role_in_dispute_outside_scope', null::uuid
      where req.scope_type = 'account'
        and exists (select 1 from nyayos.dispute_roles r where r.user_id = uid and not (r.dispute_id = any(d)))
  ) b
  order by b.tn collate "C", b.rid collate "C" nulls first, b.cls, b.rsn;
end $$;

revoke all on function nyayos.enumerate_deletion_scope(uuid) from public;
grant execute on function nyayos.enumerate_deletion_scope(uuid) to nyayos_authenticated;

-- ---------------------------------------------------------------- 4. manual legal hold (configuration only)
insert into nyayos.config_provisional (key, value, changed_by)
  values ('legal_hold_dispute_ids', '', 'migration:0006')
  on conflict (key) do nothing;

commit;
