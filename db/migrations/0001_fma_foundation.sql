-- =============================================================================
-- NyayOS FM-A foundation — migration 0001
-- Assignment A-030 · branch feature/fma-foundation-v1 · gate FA-001 (staging only)
--
-- STATUS: NOT APPLIED TO ANY ENVIRONMENT. No NyayOS database exists (FD-02
-- hosting/region undecided). During A-030 this file was executed once on an
-- ephemeral local postgres:16-alpine container with synthetic data only
-- (db/tests/smoke_0001.sql: 41/41 PASS); the container was destroyed afterwards.
-- It is also statically linted by scripts/db/schema-lint.mjs (SEC-RLS-01,
-- SEC-DEL-06 static forms). Its first environment execution must be a
-- synthetic-data staging database under Build Brief V2 §3.1, never production.
--
-- Sources: FM-A Scope Sheet V1 §4 (tables), §7 (S1–S16); Security & Data
-- Architecture Spec V1 §4–5, §9, §17; Build Brief V2 §3.3, §4.5; Fast Mode
-- Strategy V1 §14 (CR-1…CR-14). Twin of app/src/domain (TypeScript).
--
-- Conventions (BB2 §3.3): every table gets GRANTs + RLS + policies + deletion
-- allow-list registration IN THIS FILE; migrations are append-only; corrections
-- are new migrations. No client-supplied tenant_id is ever trusted: session
-- context is set server-side on connection checkout (Architecture Deck slide 7).
-- =============================================================================

begin;

-- No extensions required: gen_random_uuid() and sha256() are core since PostgreSQL 13 / 11.

create schema if not exists nyayos;
comment on schema nyayos is 'NyayOS FM-A canonical schema. Private-case data only; no authority corpus (CR-9).';

-- -----------------------------------------------------------------------------
-- 0. Database roles (least privilege). Named service identities per SDAS §4.1.
-- -----------------------------------------------------------------------------
do $$
declare r text;
begin
  foreach r in array array[
    'nyayos_anon',
    'nyayos_authenticated',
    'nyayos_service_scan',
    'nyayos_service_promote',
    'nyayos_service_deletion',
    'nyayos_service_audit'
  ] loop
    if not exists (select 1 from pg_roles where rolname = r) then
      execute format('create role %I nologin noinherit nobypassrls', r);
    end if;
  end loop;
end $$;

revoke all on schema nyayos from public;
grant usage on schema nyayos to nyayos_anon, nyayos_authenticated,
  nyayos_service_scan, nyayos_service_promote, nyayos_service_deletion, nyayos_service_audit;

-- -----------------------------------------------------------------------------
-- 1. Enumerations — declared IN FULL (CR-3). Unused values stay inert.
-- -----------------------------------------------------------------------------
create type nyayos.tenant_type as enum ('personal', 'organization', 'advocate_workspace', 'institution');
create type nyayos.tenant_role as enum ('tenant_owner', 'org_admin', 'member');
create type nyayos.dispute_role as enum ('dispute_owner', 'dispute_editor', 'dispute_viewer');
create type nyayos.grant_role as enum ('reviewer', 'neutral', 'institution_viewer', 'support');
create type nyayos.platform_role as enum ('platform_security', 'platform_support', 'pack_curator', 'pack_approver');
create type nyayos.membership_status as enum ('active', 'invited', 'removed');
create type nyayos.consent_purpose as enum (
  'storage', 'extraction', 'ai_assistance', 'share_reviewer', 'engagement_request',
  'conflict_check', 'share_neutral', 'export', 'support', 'aggregate_analytics', 'model_improvement');
create type nyayos.consent_scope_type as enum ('account', 'dispute', 'grant');
create type nyayos.consent_method as enum ('click', 'otp_confirmed');
create type nyayos.notice_language as enum ('hi', 'en');
create type nyayos.dispute_status as enum ('active', 'deletion_requested', 'deleted');
create type nyayos.statement_kind as enum ('narrative', 'intake_answer');
create type nyayos.entity_type as enum ('person', 'organisation');
create type nyayos.verification_status as enum ('pending', 'confirmed', 'corrected', 'uncertain', 'not_relevant');
create type nyayos.item_origin_type as enum ('user_statement', 'document_extraction', 'user_inference', 'ai_extraction');
create type nyayos.confidence_band as enum ('high', 'medium', 'low', 'unknown');
create type nyayos.date_precision as enum ('exact', 'approximate', 'inferred', 'unknown', 'conflicting');
create type nyayos.evidence_relation as enum ('supports', 'partially_supports', 'contradicts', 'mentions', 'uncertain');
create type nyayos.contradiction_status as enum ('open', 'reviewed', 'resolved_by_user');
create type nyayos.next_step_status as enum ('open', 'done', 'dropped');
create type nyayos.canonical_target_type as enum (
  'dispute_statement', 'entity', 'entity_source_form', 'event', 'date_assertion', 'proposition',
  'evidence_item', 'evidence_relation', 'contradiction', 'missing_evidence', 'issue', 'next_step');
create type nyayos.proposal_origin as enum ('user', 'ai', 'reviewer');
create type nyayos.proposal_status as enum ('pending', 'accepted', 'rejected');
create type nyayos.upload_state as enum ('received', 'quarantined', 'scanning', 'clean', 'rejected', 'promoted', 'purged');
create type nyayos.scan_verdict as enum ('clean', 'infected', 'failed', 'unavailable');
create type nyayos.document_status as enum ('ready', 'deletion_requested', 'deleted');
create type nyayos.custody_event_kind as enum (
  'ingested', 'scanned', 'quarantined', 'promoted', 'viewed', 'exported', 'replaced', 'deletion_requested', 'deleted');
create type nyayos.job_type as enum ('scan');
create type nyayos.job_state as enum ('queued', 'running', 'succeeded', 'failed', 'dead');
create type nyayos.export_profile as enum ('full_case_file');
create type nyayos.audit_actor_type as enum ('user', 'service', 'system');
create type nyayos.audit_outcome as enum ('success', 'denied', 'error');
create type nyayos.audit_severity as enum ('info', 'low', 'medium', 'high');
create type nyayos.deletion_scope_type as enum ('document', 'dispute', 'account');
create type nyayos.deletion_state as enum ('requested', 'undone', 'locked', 'purging', 'purged', 'verified', 'incomplete');
create type nyayos.draft_tier as enum ('T0', 'T1', 'T2', 'T3');           -- reserved, unused in FM-A
create type nyayos.grant_permission as enum (                               -- reserved, unused in FM-A
  'view', 'comment', 'suggest', 'view_document_original', 'download_document', 'download_export');

-- -----------------------------------------------------------------------------
-- 2. Session context and authorisation helpers (SDAS §5.1; CR-2)
--    Context is set server-side on connection checkout, never from client input.
-- -----------------------------------------------------------------------------
create or replace function nyayos.current_user_id() returns uuid
language sql stable
set search_path = pg_catalog
as $$
  select coalesce(
    nullif(current_setting('nyayos.principal_id', true), '')::uuid,
    nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
  )
$$;

create or replace function nyayos.current_request_id() returns text
language sql stable set search_path = pg_catalog
as $$ select nullif(current_setting('nyayos.request_id', true), '') $$;

create or replace function nyayos.dispute_role_rank(r nyayos.dispute_role) returns int
language sql immutable set search_path = pg_catalog
as $$ select case r when 'dispute_viewer' then 1 when 'dispute_editor' then 2 when 'dispute_owner' then 3 end $$;

create or replace function nyayos.is_service(p_identity text) returns boolean
language sql stable set search_path = pg_catalog
as $$ select current_user = 'nyayos_service_' || p_identity $$;

-- Forward-declared: bodies reference tables created below; created after tables (see §4).

-- -----------------------------------------------------------------------------
-- 3. Tables (Scope Sheet §4). Order respects foreign keys.
-- -----------------------------------------------------------------------------

-- 3.1 Identity and tenancy --------------------------------------------------------
create table nyayos.tenants (
  id          uuid primary key default gen_random_uuid(),
  type        nyayos.tenant_type not null,
  name        text not null check (length(name) between 1 and 200),
  created_at  timestamptz not null default now()
);
comment on table nyayos.tenants is 'S3. Security boundary. type immutable (trigger). FM-A: personal only.';

create table nyayos.profiles (
  user_id             uuid primary key,
  display_name        text not null check (length(display_name) between 1 and 200),
  preferred_language  nyayos.notice_language not null default 'hi',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table nyayos.profiles is 'S3. No roles on this table (SDAS §4.3).';

create table nyayos.tenant_memberships (
  tenant_id    uuid not null references nyayos.tenants(id),
  user_id      uuid not null,
  tenant_role  nyayos.tenant_role not null,
  status       nyayos.membership_status not null default 'active',
  invited_by   uuid,
  joined_at    timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

create table nyayos.platform_roles (
  user_id     uuid not null,
  role        nyayos.platform_role not null,
  granted_by  uuid not null,
  granted_at  timestamptz not null default now(),
  primary key (user_id, role)
);
comment on table nyayos.platform_roles is 'S3. No standing content access for any platform role.';

-- 3.3 Dispute core (created before dispute_roles for the FK) ---------------------
create table nyayos.disputes (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references nyayos.tenants(id),
  owner_user_id   uuid not null,
  title           text not null check (length(title) between 1 and 300),
  status          nyayos.dispute_status not null default 'active',
  category_label  text check (category_label is null or length(category_label) <= 120),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
comment on table nyayos.disputes is 'S4. The Deck''s "Matter". tenant_id immutable (trigger). category_label is plain language, never a legal category.';

create table nyayos.dispute_roles (
  dispute_id    uuid not null references nyayos.disputes(id),
  user_id       uuid not null,
  dispute_role  nyayos.dispute_role not null,
  primary key (dispute_id, user_id)
);

-- 3.2 Consent and notices ---------------------------------------------------------
create table nyayos.consents (
  id                 uuid primary key default gen_random_uuid(),
  principal_user_id  uuid not null,
  tenant_id          uuid not null references nyayos.tenants(id),
  scope_type         nyayos.consent_scope_type not null,
  scope_id           uuid not null,
  purpose            nyayos.consent_purpose not null
                     check (purpose not in ('aggregate_analytics', 'model_improvement')), -- S8 hard lock
  notice_version     text not null,
  notice_language    nyayos.notice_language not null,
  method             nyayos.consent_method not null,
  granted_at         timestamptz not null default now(),
  withdrawn_at       timestamptz,
  request_id         text not null,
  created_at         timestamptz not null default now()
);
comment on table nyayos.consents is 'S3. Append-only: withdrawal is a new row. Locked purposes rejected by CHECK.';

create table nyayos.notices (
  purpose         nyayos.consent_purpose not null,
  version         text not null,
  language        nyayos.notice_language not null,
  text_ref        text not null,
  effective_from  timestamptz not null,
  primary key (purpose, version, language)
);
comment on table nyayos.notices is 'S2. hi and en share the same version id (SEC-LANG-04).';

-- 3.3 Dispute core (continued) --------------------------------------------------------
create table nyayos.intake_questions (
  id             uuid primary key default gen_random_uuid(),
  key            text not null unique,
  text_hi        text not null,
  text_en        text not null,
  why_we_ask_hi  text not null,
  why_we_ask_en  text not null,
  branch_rules   jsonb not null default '[]'::jsonb,
  version        int not null default 1
);
comment on table nyayos.intake_questions is 'S2. Deterministic branching (F12). No statute names in questions.';

create table nyayos.dispute_statements (
  id           uuid primary key default gen_random_uuid(),
  tenant_id    uuid not null references nyayos.tenants(id),
  dispute_id   uuid not null references nyayos.disputes(id),
  kind         nyayos.statement_kind not null,
  question_id  uuid references nyayos.intake_questions(id),
  text         text not null check (length(text) >= 1),
  created_by   uuid not null,
  created_at   timestamptz not null default now()
);

-- Canonical items share the provenance contract (CR-8): status, origin, source, confidence.
create table nyayos.entities (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  canonical_label      text not null check (length(canonical_label) between 1 and 300),
  entity_type          nyayos.entity_type not null,
  role_label           text,
  notes                text,
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.entity_source_forms (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references nyayos.tenants(id),
  dispute_id     uuid not null references nyayos.disputes(id),
  entity_id      uuid not null references nyayos.entities(id),
  form_text      text not null,
  source_ref     jsonb not null,
  first_seen_at  timestamptz not null default now()
);
comment on table nyayos.entity_source_forms is 'Every spelling/script kept; never merged automatically (AC-M1-05).';

create table nyayos.events (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  text                 text not null,
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.date_assertions (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  target_type          nyayos.canonical_target_type not null,
  target_id            uuid not null,
  value                text,                         -- as entered; never system-generated (AC-M1-04)
  precision            nyayos.date_precision not null,
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.propositions (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  text                 text not null,
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.evidence_items (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  document_id          uuid,                          -- FK added after documents (below)
  description          text not null,
  evidence_type        text not null check (length(evidence_type) between 1 and 60),
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.evidence_relations (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  evidence_item_id     uuid not null references nyayos.evidence_items(id),
  target_type          nyayos.canonical_target_type not null,
  target_id            uuid not null,
  relation             nyayos.evidence_relation not null,
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,                -- relation requires a source ref (A17)
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.contradictions (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  item_a_type          nyayos.canonical_target_type not null,
  item_a_id            uuid not null,
  item_b_type          nyayos.canonical_target_type not null,
  item_b_id            uuid not null,
  field                text not null check (length(field) between 1 and 120),
  description          text not null,                -- neutral; validated by the server function
  status               nyayos.contradiction_status not null default 'open',
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  check (not (item_a_type = item_b_type and item_a_id = item_b_id))   -- two references (AC-M1-06)
  -- Deliberately NO column that could record which item is "true".
);

create table nyayos.missing_evidence (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  expected_item        text not null,
  reason               text not null,
  related_type         nyayos.canonical_target_type,
  related_id           uuid,
  user_response        text,
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.issues (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  label                text not null check (length(label) between 1 and 160), -- plain-language file label (U14)
  supporting_refs      jsonb not null default '[]'::jsonb,
  note                 text,
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table nyayos.next_steps (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  text                 text not null,
  owner_note           text,
  status               nyayos.next_step_status not null default 'open',
  user_set_date        date,                          -- user-entered only; labelled "date you entered" (U15)
  verification_status  nyayos.verification_status not null default 'pending',
  origin_type          nyayos.item_origin_type not null,
  source_ref           jsonb not null,
  confidence           nyayos.confidence_band not null default 'unknown',
  version              int not null default 1 check (version >= 1),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- 3.4 Proposals and corrections (single-writer) ----------------------------------
create table nyayos.proposals (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references nyayos.tenants(id),
  dispute_id      uuid not null references nyayos.disputes(id),
  target_type     nyayos.canonical_target_type not null,
  target_id       uuid,                               -- null when creating a new item
  proposed_value  jsonb not null,
  origin          nyayos.proposal_origin not null check (origin = 'user'),   -- ai/reviewer inert in FM-A (S3, S11)
  origin_ref      text not null,
  status          nyayos.proposal_status not null default 'pending',
  decided_by      uuid,
  decided_at      timestamptz,
  reason          text,
  created_at      timestamptz not null default now()
);

create table nyayos.user_corrections (
  id                   uuid primary key default gen_random_uuid(),
  tenant_id            uuid not null references nyayos.tenants(id),
  dispute_id           uuid not null references nyayos.disputes(id),
  target_type          nyayos.canonical_target_type not null,
  target_id            uuid not null,
  previous_value       jsonb,
  new_value            jsonb not null,
  reason               text,
  user_id              uuid not null,
  origin_proposal_id   uuid not null references nyayos.proposals(id),
  resulting_version    int not null check (resulting_version >= 1),
  "timestamp"          timestamptz not null default now(),
  unique (target_type, target_id, resulting_version)   -- the version chain (Deck G2) is rebuilt from here
);
comment on table nyayos.user_corrections is 'S4. Append-only. FactVersion chain = corrections ordered by resulting_version (no fact_versions table in FM-A, CR-1).';

-- 3.5 Evidence ----------------------------------------------------------------------
create table nyayos.quarantine_uploads (
  id                     uuid primary key default gen_random_uuid(),
  tenant_id              uuid not null references nyayos.tenants(id),
  dispute_id             uuid not null references nyayos.disputes(id),
  uploader_id            uuid not null,
  state                  nyayos.upload_state not null default 'received',
  sha256                 text check (sha256 is null or sha256 ~ '^[0-9a-f]{64}$'),
  size_bytes             bigint check (size_bytes is null or size_bytes >= 0),
  sniffed_mime           text,
  declared_mime          text not null,
  scan_verdict           nyayos.scan_verdict,
  scan_provider_version  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  purge_after            timestamptz
);
comment on table nyayos.quarantine_uploads is 'S4. Isolated bucket; not readable by any serving path. Promotion requires scan_verdict = clean.';

create table nyayos.documents (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references nyayos.tenants(id),
  dispute_id       uuid not null references nyayos.disputes(id),
  current_version  int not null default 1 check (current_version >= 1),
  display_label    text not null check (length(display_label) between 1 and 300),
  status           nyayos.document_status not null default 'ready',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

alter table nyayos.evidence_items
  add constraint evidence_items_document_fk foreign key (document_id) references nyayos.documents(id);

create table nyayos.document_versions (
  id                     uuid primary key default gen_random_uuid(),
  document_id            uuid not null references nyayos.documents(id),
  version                int not null check (version >= 1),
  sha256                 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  size_bytes             bigint not null check (size_bytes >= 0),
  sniffed_mime           text not null,
  page_count             int check (page_count is null or page_count >= 0),
  original_filename      text not null,               -- S4: never in operational logs
  uploader_id            uuid not null,
  ingest_ts              timestamptz not null default now(),
  client_reported_mtime  timestamptz,
  scan_result            nyayos.scan_verdict not null check (scan_result = 'clean'),  -- write-once, clean only (S5)
  storage_path           text not null,               -- <tenant_id>/<dispute_id>/<document_id>/<version>
  language_detected      text,
  unique (document_id, version)
);
comment on table nyayos.document_versions is 'S4. Write-once originals. No UPDATE/DELETE grants; replacement = new row (AC-M2-02).';

create table nyayos.document_locations (
  id                   uuid primary key default gen_random_uuid(),
  document_version_id  uuid not null references nyayos.document_versions(id),
  page_number          int not null check (page_number >= 1),
  anchor_note          text,
  created_by           uuid not null,                 -- user in FM-A (manual linking, F10)
  created_at           timestamptz not null default now()
);

create table nyayos.annotations (
  id                   uuid primary key default gen_random_uuid(),
  document_version_id  uuid not null references nyayos.document_versions(id),
  location_id          uuid not null references nyayos.document_locations(id),
  text                 text not null,
  created_by           uuid not null,
  created_at           timestamptz not null default now()
);

create table nyayos.custody_events (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid not null references nyayos.documents(id),
  version      int not null check (version >= 0),
  event        nyayos.custody_event_kind not null,
  actor        text not null,                         -- user id or service identity; never a name
  occurred_at  timestamptz not null default now(),
  hash_ref     text check (hash_ref is null or hash_ref ~ '^[0-9a-f]{64}$')
);

create table nyayos.jobs (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references nyayos.tenants(id),
  type             nyayos.job_type not null,
  payload_ref      uuid not null,
  state            nyayos.job_state not null default 'queued',
  attempts         int not null default 0,
  next_run_at      timestamptz,
  last_error_code  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 3.6 Export, audit, deletion, config ----------------------------------------------
create table nyayos.exports (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references nyayos.tenants(id),
  dispute_id         uuid not null references nyayos.disputes(id),
  version            int not null check (version >= 1),
  profile            nyayos.export_profile not null default 'full_case_file',
  included_sections  text[] not null,
  generated_at       timestamptz not null default now(),
  generated_by       uuid not null,
  manifest_sha256    text not null check (manifest_sha256 ~ '^[0-9a-f]{64}$'),
  storage_path       text not null,
  created_at         timestamptz not null default now()
);

create table nyayos.export_manifests (
  export_id  uuid primary key references nyayos.exports(id),
  entries    jsonb not null                            -- document id, version, sha256, size, ingest_ts; items; omissions
);

create table nyayos.audit_events (
  id                uuid primary key default gen_random_uuid(),
  seq               bigint generated always as identity,
  occurred_at       timestamptz not null default now(),
  actor_type        nyayos.audit_actor_type not null,
  actor_id          text not null,                    -- pseudonymous id, never a name
  on_behalf_of      uuid,
  tenant_id         uuid,
  dispute_id        uuid,
  grant_id          uuid,
  action            text not null,                    -- BB2/SDAS §17.2 catalogue (CR-5); validated by trigger below
  resource_type     text not null,
  resource_id       text,
  purpose           text,
  outcome           nyayos.audit_outcome not null,
  severity          nyayos.audit_severity not null default 'info',
  request_id        text not null,
  ip_hash           text,
  user_agent_class  text not null default 'unknown',
  metadata          jsonb not null default '{}'::jsonb,   -- allow-listed keys only (trigger)
  prev_hash         text not null check (prev_hash ~ '^[0-9a-f]{64}$'),
  row_hash          text not null check (row_hash ~ '^[0-9a-f]{64}$')
);
comment on table nyayos.audit_events is 'S3. Append-only, hash-chained. No UPDATE/DELETE grants to any role; trigger blocks both. Never contains content.';

create table nyayos.audit_anchors (
  period       text primary key,
  anchor_hash  text not null check (anchor_hash ~ '^[0-9a-f]{64}$'),
  exported_at  timestamptz not null default now(),
  exported_by  text not null
);

create table nyayos.deletion_requests (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references nyayos.tenants(id),
  scope_type    nyayos.deletion_scope_type not null,
  scope_id      uuid not null,
  requested_by  uuid not null,
  state         nyayos.deletion_state not null default 'requested',
  undo_until    timestamptz not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  locked_at     timestamptz,
  purged_at     timestamptz
);

create table nyayos.deletion_ledger (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null,                        -- no FK: survives tenant deletion
  scope_type    nyayos.deletion_scope_type not null,
  scope_id      uuid not null,
  completed_at  timestamptz not null default now()
  -- Content-free tombstone (Counsel Brief OL-03 interim): no hash, no label, no filename.
);
comment on table nyayos.deletion_ledger is 'S3. The Deck''s DeletionTombstone. Replayed on restore (M6). Never deleted.';

create table nyayos.retention_records (
  object_type               text not null,
  object_id                 uuid not null,
  tenant_id                 uuid not null,
  retention_policy_version  text not null,
  deletion_requested_at     timestamptz not null,
  deletion_completed_at     timestamptz,
  verification              jsonb,                    -- {result, checklist[], operator_id, recorded_at}
  primary key (object_type, object_id)
);

create table nyayos.deletion_allowlist (
  table_name    text primary key,
  scope_column  text,                                 -- null = global table, registered deliberately
  retained      boolean not null default false,       -- true = never purged (audit, ledger, retention)
  registered_at timestamptz not null default now()
);

create table nyayos.config_provisional (
  key         text primary key,
  value       text not null,
  source      text not null default 'PROV' check (source = 'PROV'),
  changed_by  text not null,
  changed_at  timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 4. Authorisation helper bodies (need the tables above)
-- -----------------------------------------------------------------------------
create or replace function nyayos.is_tenant_member(p_tenant uuid) returns boolean
language sql stable security definer
set search_path = pg_catalog, nyayos
as $$
  select exists (
    select 1 from nyayos.tenant_memberships m
    where m.tenant_id = p_tenant and m.user_id = nyayos.current_user_id() and m.status = 'active')
$$;

create or replace function nyayos.is_dispute_member(p_dispute uuid, p_min_role nyayos.dispute_role) returns boolean
language sql stable security definer
set search_path = pg_catalog, nyayos
as $$
  select exists (
    select 1
    from nyayos.dispute_roles dr
    join nyayos.disputes d on d.id = dr.dispute_id
    join nyayos.tenant_memberships m on m.tenant_id = d.tenant_id and m.user_id = dr.user_id and m.status = 'active'
    where dr.dispute_id = p_dispute
      and dr.user_id = nyayos.current_user_id()
      and nyayos.dispute_role_rank(dr.dispute_role) >= nyayos.dispute_role_rank(p_min_role))
$$;

-- Present from day one (CR-2); returns false until FM-B supplies grant rows through THIS function.
create or replace function nyayos.grant_allows(p_dispute uuid, p_share_item_ref text, p_permission nyayos.grant_permission) returns boolean
language sql stable security definer
set search_path = pg_catalog, nyayos
as $$ select false $$;

create or replace function nyayos.has_platform_role(p_role nyayos.platform_role) returns boolean
language sql stable security definer
set search_path = pg_catalog, nyayos
as $$
  select exists (select 1 from nyayos.platform_roles r where r.user_id = nyayos.current_user_id() and r.role = p_role)
$$;

revoke all on function nyayos.is_tenant_member(uuid) from public;
revoke all on function nyayos.is_dispute_member(uuid, nyayos.dispute_role) from public;
revoke all on function nyayos.grant_allows(uuid, text, nyayos.grant_permission) from public;
revoke all on function nyayos.has_platform_role(nyayos.platform_role) from public;
grant execute on function nyayos.is_tenant_member(uuid) to nyayos_authenticated;
grant execute on function nyayos.is_dispute_member(uuid, nyayos.dispute_role) to nyayos_authenticated;
grant execute on function nyayos.grant_allows(uuid, text, nyayos.grant_permission) to nyayos_authenticated;
grant execute on function nyayos.has_platform_role(nyayos.platform_role) to nyayos_authenticated;

-- -----------------------------------------------------------------------------
-- 5. Integrity triggers
-- -----------------------------------------------------------------------------
create or replace function nyayos.tg_immutable_tenant() returns trigger
language plpgsql set search_path = pg_catalog
as $$
begin
  if new.tenant_id is distinct from old.tenant_id then
    raise exception 'tenant_id is immutable' using errcode = '23514';
  end if;
  return new;
end $$;

create or replace function nyayos.tg_immutable_tenant_type() returns trigger
language plpgsql set search_path = pg_catalog
as $$
begin
  if new.type is distinct from old.type then
    raise exception 'tenants.type is immutable' using errcode = '23514';
  end if;
  return new;
end $$;

create or replace function nyayos.tg_touch_updated_at() returns trigger
language plpgsql set search_path = pg_catalog
as $$ begin new.updated_at := now(); return new; end $$;

create or replace function nyayos.tg_forbid() returns trigger
language plpgsql set search_path = pg_catalog
as $$
begin
  raise exception '% on % is not permitted (append-only)', tg_op, tg_table_name using errcode = '42501';
end $$;

-- Audit row validation: catalogue action, content-free allow-listed metadata, hash chain.
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

create trigger tenants_type_immutable before update on nyayos.tenants
  for each row execute function nyayos.tg_immutable_tenant_type();
create trigger disputes_tenant_immutable before update on nyayos.disputes
  for each row execute function nyayos.tg_immutable_tenant();
create trigger disputes_touch before update on nyayos.disputes
  for each row execute function nyayos.tg_touch_updated_at();

create trigger audit_events_before_insert before insert on nyayos.audit_events
  for each row execute function nyayos.tg_audit_before_insert();
create trigger audit_events_forbid_update before update on nyayos.audit_events
  for each row execute function nyayos.tg_forbid();
create trigger audit_events_forbid_delete before delete on nyayos.audit_events
  for each row execute function nyayos.tg_forbid();
create trigger deletion_ledger_forbid before update or delete on nyayos.deletion_ledger
  for each row execute function nyayos.tg_forbid();
create trigger user_corrections_forbid before update or delete on nyayos.user_corrections
  for each row execute function nyayos.tg_forbid();
create trigger document_versions_forbid before update or delete on nyayos.document_versions
  for each row execute function nyayos.tg_forbid();
create trigger consents_forbid_update before update on nyayos.consents
  for each row execute function nyayos.tg_forbid();

-- -----------------------------------------------------------------------------
-- 6. Server functions — the only write paths (A01, A03, A06, A07, A28)
-- -----------------------------------------------------------------------------

-- A01: personal tenant + membership + profile on first sign-in (AC-M0-02). Idempotent.
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
  return tid;
end $$;

-- A03: create a dispute; caller becomes dispute_owner.
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
  return did;
end $$;

-- A06: the only entry to canonical data. Origin is user-only in FM-A (CHECK constraint).
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
  return pid;
end $$;

-- A07: decide. Accepting writes the canonical row AND the correction in one transaction.
-- Generic over target tables via jsonb_populate_record; server-controlled columns are never taken from the proposal.
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
    where k in ('id', 'tenant_id', 'dispute_id', 'created_at', 'updated_at', 'version')
       or not exists (select 1 from information_schema.columns c
                      where c.table_schema = 'nyayos' and c.table_name = tbl and c.column_name = k);
  if bad_keys is not null then
    raise exception 'proposal contains keys that cannot be written: %', array_to_string(bad_keys, ', ') using errcode = '23514';
  end if;

  select string_agg(format('%I', k), ', '), string_agg(format('v.%I', k), ', '), string_agg(format('%I = v.%I', k, k), ', ')
    into cols, vcols, setcols
    from jsonb_object_keys(pr.proposed_value) k;
  if cols is null then
    raise exception 'proposal has no writable fields' using errcode = '23514';
  end if;

  select exists (select 1 from information_schema.columns c
                 where c.table_schema = 'nyayos' and c.table_name = tbl and c.column_name = 'version') into has_version;

  if pr.target_id is null then
    if has_version then
      execute format(
        'insert into nyayos.%I (id, tenant_id, dispute_id, version, %s) select gen_random_uuid(), $2, $3, 1, %s from jsonb_populate_record(null::nyayos.%I, $1) as v returning id',
        tbl, cols, vcols, tbl) into new_id using pr.proposed_value, pr.tenant_id, pr.dispute_id;
    else
      execute format(
        'insert into nyayos.%I (id, tenant_id, dispute_id, %s) select gen_random_uuid(), $2, $3, %s from jsonb_populate_record(null::nyayos.%I, $1) as v returning id',
        tbl, cols, vcols, tbl) into new_id using pr.proposed_value, pr.tenant_id, pr.dispute_id;
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
  return cid;
end $$;

-- A28: audit writer. Only the audit service identity may execute it; hash chain computed by trigger.
create or replace function nyayos.log_audit_event(
  p_actor_type nyayos.audit_actor_type, p_actor_id text, p_on_behalf_of uuid, p_tenant uuid, p_dispute uuid,
  p_action text, p_resource_type text, p_resource_id text, p_purpose text, p_outcome nyayos.audit_outcome,
  p_severity nyayos.audit_severity, p_request_id text, p_ip_hash text, p_user_agent_class text, p_metadata jsonb)
returns uuid
language plpgsql security invoker   -- INVOKER on purpose: current_user must be the calling service role for is_service()
set search_path = pg_catalog, nyayos
as $$
declare aid uuid;
begin
  if not nyayos.is_service('audit') then
    raise exception 'log_audit_event requires the audit service identity' using errcode = '42501';
  end if;
  insert into nyayos.audit_events (actor_type, actor_id, on_behalf_of, tenant_id, dispute_id, action, resource_type,
    resource_id, purpose, outcome, severity, request_id, ip_hash, user_agent_class, metadata, prev_hash, row_hash)
  values (p_actor_type, p_actor_id, p_on_behalf_of, p_tenant, p_dispute, p_action, p_resource_type, p_resource_id,
    p_purpose, p_outcome, p_severity, p_request_id, p_ip_hash, coalesce(p_user_agent_class, 'unknown'),
    coalesce(p_metadata, '{}'::jsonb), repeat('0', 64), repeat('0', 64))
  returning id into aid;
  return aid;
end $$;

-- SEC-HASH-05 verification: returns the seq of the first broken row, or null when intact.
create or replace function nyayos.verify_audit_chain() returns bigint
language plpgsql stable security definer
set search_path = pg_catalog, nyayos
as $$
declare r record; prev text := repeat('0', 64); canonical text; expected text;
begin
  for r in select * from nyayos.audit_events order by seq loop
    if r.prev_hash <> prev then return r.seq; end if;
    canonical := jsonb_build_object(
      'id', r.id, 'occurredAt', r.occurred_at, 'actorType', r.actor_type, 'actorId', r.actor_id,
      'onBehalfOf', r.on_behalf_of, 'tenantId', r.tenant_id, 'disputeId', r.dispute_id, 'grantId', r.grant_id,
      'action', r.action, 'resourceType', r.resource_type, 'resourceId', r.resource_id, 'purpose', r.purpose,
      'outcome', r.outcome, 'severity', r.severity, 'requestId', r.request_id, 'ipHash', r.ip_hash,
      'userAgentClass', r.user_agent_class, 'metadata', r.metadata)::text;
    expected := encode(sha256(convert_to(r.prev_hash || '‖' || canonical, 'UTF8')), 'hex');
    if expected <> r.row_hash then return r.seq; end if;
    prev := r.row_hash;
  end loop;
  return null;
end $$;

revoke all on function nyayos.sign_up_personal_tenant(text, nyayos.notice_language) from public;
revoke all on function nyayos.create_dispute(uuid, text, text) from public;
revoke all on function nyayos.propose_change(uuid, nyayos.canonical_target_type, uuid, jsonb, text) from public;
revoke all on function nyayos.decide_proposal(uuid, boolean, text) from public;
revoke all on function nyayos.log_audit_event(nyayos.audit_actor_type, text, uuid, uuid, uuid, text, text, text, text, nyayos.audit_outcome, nyayos.audit_severity, text, text, text, jsonb) from public;
revoke all on function nyayos.verify_audit_chain() from public;
grant execute on function nyayos.sign_up_personal_tenant(text, nyayos.notice_language) to nyayos_authenticated;
grant execute on function nyayos.create_dispute(uuid, text, text) to nyayos_authenticated;
grant execute on function nyayos.propose_change(uuid, nyayos.canonical_target_type, uuid, jsonb, text) to nyayos_authenticated;
grant execute on function nyayos.decide_proposal(uuid, boolean, text) to nyayos_authenticated;
grant execute on function nyayos.log_audit_event(nyayos.audit_actor_type, text, uuid, uuid, uuid, text, text, text, text, nyayos.audit_outcome, nyayos.audit_severity, text, text, text, jsonb) to nyayos_service_audit;
grant execute on function nyayos.verify_audit_chain() to nyayos_service_audit;

-- -----------------------------------------------------------------------------
-- 7. Row-level security: ENABLE + FORCE on every table, explicit grants, policies
--    written only in terms of the helpers (SDAS §5.1–5.2). Deny by default.
-- -----------------------------------------------------------------------------

-- 7.1 tenants
alter table nyayos.tenants enable row level security;
alter table nyayos.tenants force row level security;
revoke all on nyayos.tenants from public;
grant select on nyayos.tenants to nyayos_authenticated;
create policy tenants_select_member on nyayos.tenants for select to nyayos_authenticated
  using (nyayos.is_tenant_member(id));

-- 7.2 profiles
alter table nyayos.profiles enable row level security;
alter table nyayos.profiles force row level security;
revoke all on nyayos.profiles from public;
grant select, update on nyayos.profiles to nyayos_authenticated;
create policy profiles_select_self on nyayos.profiles for select to nyayos_authenticated
  using (user_id = nyayos.current_user_id());
create policy profiles_update_self on nyayos.profiles for update to nyayos_authenticated
  using (user_id = nyayos.current_user_id()) with check (user_id = nyayos.current_user_id());

-- 7.3 tenant_memberships (writes via sign_up_personal_tenant only in FM-A)
alter table nyayos.tenant_memberships enable row level security;
alter table nyayos.tenant_memberships force row level security;
revoke all on nyayos.tenant_memberships from public;
grant select on nyayos.tenant_memberships to nyayos_authenticated;
create policy memberships_select_own_tenant on nyayos.tenant_memberships for select to nyayos_authenticated
  using (nyayos.is_tenant_member(tenant_id));

-- 7.4 platform_roles (read own; writes by operator migration only)
alter table nyayos.platform_roles enable row level security;
alter table nyayos.platform_roles force row level security;
revoke all on nyayos.platform_roles from public;
grant select on nyayos.platform_roles to nyayos_authenticated;
create policy platform_roles_select_self on nyayos.platform_roles for select to nyayos_authenticated
  using (user_id = nyayos.current_user_id());

-- 7.5 disputes (insert via create_dispute; metadata update by owner/editor)
alter table nyayos.disputes enable row level security;
alter table nyayos.disputes force row level security;
revoke all on nyayos.disputes from public;
grant select, update (title, status, category_label) on nyayos.disputes to nyayos_authenticated;
grant select on nyayos.disputes to nyayos_service_deletion, nyayos_service_scan, nyayos_service_promote;
create policy disputes_select_member on nyayos.disputes for select to nyayos_authenticated
  using (nyayos.is_dispute_member(id, 'dispute_viewer'));
create policy disputes_update_editor on nyayos.disputes for update to nyayos_authenticated
  using (nyayos.is_dispute_member(id, 'dispute_editor')) with check (nyayos.is_dispute_member(id, 'dispute_editor'));
create policy disputes_select_service on nyayos.disputes for select
  to nyayos_service_deletion, nyayos_service_scan, nyayos_service_promote using (true);

-- 7.6 dispute_roles (writes via create_dispute only in FM-A)
alter table nyayos.dispute_roles enable row level security;
alter table nyayos.dispute_roles force row level security;
revoke all on nyayos.dispute_roles from public;
grant select on nyayos.dispute_roles to nyayos_authenticated;
create policy dispute_roles_select_member on nyayos.dispute_roles for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

-- 7.7 consents (self read; self insert; withdrawal = new row; no UPDATE/DELETE grants)
alter table nyayos.consents enable row level security;
alter table nyayos.consents force row level security;
revoke all on nyayos.consents from public;
grant select, insert on nyayos.consents to nyayos_authenticated;
create policy consents_select_self on nyayos.consents for select to nyayos_authenticated
  using (principal_user_id = nyayos.current_user_id());
create policy consents_insert_self on nyayos.consents for insert to nyayos_authenticated
  with check (principal_user_id = nyayos.current_user_id() and nyayos.is_tenant_member(tenant_id)
              and purpose in ('storage', 'export'));   -- FM-A enforced purposes (F03); widened by a later migration + flag

-- 7.8 notices (public to authenticated; writes by migration)
alter table nyayos.notices enable row level security;
alter table nyayos.notices force row level security;
revoke all on nyayos.notices from public;
grant select on nyayos.notices to nyayos_authenticated, nyayos_anon;
create policy notices_select_all on nyayos.notices for select to nyayos_authenticated, nyayos_anon using (true);

-- 7.9 intake_questions
alter table nyayos.intake_questions enable row level security;
alter table nyayos.intake_questions force row level security;
revoke all on nyayos.intake_questions from public;
grant select on nyayos.intake_questions to nyayos_authenticated;
create policy intake_questions_select_all on nyayos.intake_questions for select to nyayos_authenticated using (true);

-- 7.10 dispute_statements (S3: read by members; INSERT only via server functions — no direct grant)
alter table nyayos.dispute_statements enable row level security;
alter table nyayos.dispute_statements force row level security;
revoke all on nyayos.dispute_statements from public;
grant select on nyayos.dispute_statements to nyayos_authenticated;
create policy dispute_statements_select_member on nyayos.dispute_statements for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

-- 7.11–7.21 canonical §4.3 tables: SELECT for members only; NO INSERT/UPDATE/DELETE grant to any
-- authenticated role (AC-M1-03, SEC-RLS-03). Writes happen inside decide_proposal (security definer).
alter table nyayos.entities enable row level security;
alter table nyayos.entities force row level security;
revoke all on nyayos.entities from public;
grant select on nyayos.entities to nyayos_authenticated;
create policy entities_select_member on nyayos.entities for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.entity_source_forms enable row level security;
alter table nyayos.entity_source_forms force row level security;
revoke all on nyayos.entity_source_forms from public;
grant select on nyayos.entity_source_forms to nyayos_authenticated;
create policy entity_source_forms_select_member on nyayos.entity_source_forms for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.events enable row level security;
alter table nyayos.events force row level security;
revoke all on nyayos.events from public;
grant select on nyayos.events to nyayos_authenticated;
create policy events_select_member on nyayos.events for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.date_assertions enable row level security;
alter table nyayos.date_assertions force row level security;
revoke all on nyayos.date_assertions from public;
grant select on nyayos.date_assertions to nyayos_authenticated;
create policy date_assertions_select_member on nyayos.date_assertions for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.propositions enable row level security;
alter table nyayos.propositions force row level security;
revoke all on nyayos.propositions from public;
grant select on nyayos.propositions to nyayos_authenticated;
create policy propositions_select_member on nyayos.propositions for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.evidence_items enable row level security;
alter table nyayos.evidence_items force row level security;
revoke all on nyayos.evidence_items from public;
grant select on nyayos.evidence_items to nyayos_authenticated;
create policy evidence_items_select_member on nyayos.evidence_items for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.evidence_relations enable row level security;
alter table nyayos.evidence_relations force row level security;
revoke all on nyayos.evidence_relations from public;
grant select on nyayos.evidence_relations to nyayos_authenticated;
create policy evidence_relations_select_member on nyayos.evidence_relations for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.contradictions enable row level security;
alter table nyayos.contradictions force row level security;
revoke all on nyayos.contradictions from public;
grant select on nyayos.contradictions to nyayos_authenticated;
create policy contradictions_select_member on nyayos.contradictions for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.missing_evidence enable row level security;
alter table nyayos.missing_evidence force row level security;
revoke all on nyayos.missing_evidence from public;
grant select on nyayos.missing_evidence to nyayos_authenticated;
create policy missing_evidence_select_member on nyayos.missing_evidence for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.issues enable row level security;
alter table nyayos.issues force row level security;
revoke all on nyayos.issues from public;
grant select on nyayos.issues to nyayos_authenticated;
create policy issues_select_member on nyayos.issues for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

alter table nyayos.next_steps enable row level security;
alter table nyayos.next_steps force row level security;
revoke all on nyayos.next_steps from public;
grant select on nyayos.next_steps to nyayos_authenticated;
create policy next_steps_select_member on nyayos.next_steps for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

-- 7.22 proposals (read by members; INSERT via propose_change; status change via decide_proposal)
alter table nyayos.proposals enable row level security;
alter table nyayos.proposals force row level security;
revoke all on nyayos.proposals from public;
grant select on nyayos.proposals to nyayos_authenticated;
create policy proposals_select_member on nyayos.proposals for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

-- 7.23 user_corrections (read by members; append by decide_proposal only)
alter table nyayos.user_corrections enable row level security;
alter table nyayos.user_corrections force row level security;
revoke all on nyayos.user_corrections from public;
grant select on nyayos.user_corrections to nyayos_authenticated;
create policy user_corrections_select_member on nyayos.user_corrections for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer'));

-- 7.24 quarantine_uploads (uploader sees own rows; scan/promote services operate; never a serving path)
alter table nyayos.quarantine_uploads enable row level security;
alter table nyayos.quarantine_uploads force row level security;
revoke all on nyayos.quarantine_uploads from public;
grant select on nyayos.quarantine_uploads to nyayos_authenticated;
grant select, update (state, scan_verdict, scan_provider_version, purge_after) on nyayos.quarantine_uploads to nyayos_service_scan, nyayos_service_promote;
create policy quarantine_select_uploader on nyayos.quarantine_uploads for select to nyayos_authenticated
  using (uploader_id = nyayos.current_user_id() and nyayos.is_dispute_member(dispute_id, 'dispute_editor'));
create policy quarantine_service_all on nyayos.quarantine_uploads for all to nyayos_service_scan, nyayos_service_promote
  using (true) with check (true);

-- 7.25 documents (members read; promote service inserts; deletion service updates status)
alter table nyayos.documents enable row level security;
alter table nyayos.documents force row level security;
revoke all on nyayos.documents from public;
grant select, update (display_label) on nyayos.documents to nyayos_authenticated;
grant select, insert, update (current_version) on nyayos.documents to nyayos_service_promote;
grant select, update (status, deleted_at) on nyayos.documents to nyayos_service_deletion;
create policy documents_select_member on nyayos.documents for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_viewer')
         or nyayos.grant_allows(dispute_id, 'document:' || id::text, 'view_document_original'));
create policy documents_relabel_editor on nyayos.documents for update to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_editor')) with check (nyayos.is_dispute_member(dispute_id, 'dispute_editor'));
create policy documents_service_promote on nyayos.documents for all to nyayos_service_promote using (true) with check (true);
create policy documents_service_deletion on nyayos.documents for all to nyayos_service_deletion using (true) with check (true);

-- 7.26 document_versions (write-once: promote service inserts; nobody updates or deletes — trigger + no grant)
alter table nyayos.document_versions enable row level security;
alter table nyayos.document_versions force row level security;
revoke all on nyayos.document_versions from public;
grant select on nyayos.document_versions to nyayos_authenticated;
grant select, insert on nyayos.document_versions to nyayos_service_promote;
grant select on nyayos.document_versions to nyayos_service_deletion;
create policy document_versions_select_member on nyayos.document_versions for select to nyayos_authenticated
  using (exists (select 1 from nyayos.documents d where d.id = document_id and nyayos.is_dispute_member(d.dispute_id, 'dispute_viewer')));
create policy document_versions_service on nyayos.document_versions for all to nyayos_service_promote, nyayos_service_deletion
  using (true) with check (true);

-- 7.27 document_locations (manual linking by editors)
alter table nyayos.document_locations enable row level security;
alter table nyayos.document_locations force row level security;
revoke all on nyayos.document_locations from public;
grant select, insert on nyayos.document_locations to nyayos_authenticated;
create policy document_locations_member on nyayos.document_locations for select to nyayos_authenticated
  using (exists (select 1 from nyayos.document_versions v join nyayos.documents d on d.id = v.document_id
                 where v.id = document_version_id and nyayos.is_dispute_member(d.dispute_id, 'dispute_viewer')));
create policy document_locations_insert_editor on nyayos.document_locations for insert to nyayos_authenticated
  with check (created_by = nyayos.current_user_id() and exists (
    select 1 from nyayos.document_versions v join nyayos.documents d on d.id = v.document_id
    where v.id = document_version_id and nyayos.is_dispute_member(d.dispute_id, 'dispute_editor')));

-- 7.28 annotations
alter table nyayos.annotations enable row level security;
alter table nyayos.annotations force row level security;
revoke all on nyayos.annotations from public;
grant select, insert on nyayos.annotations to nyayos_authenticated;
create policy annotations_member on nyayos.annotations for select to nyayos_authenticated
  using (exists (select 1 from nyayos.document_versions v join nyayos.documents d on d.id = v.document_id
                 where v.id = document_version_id and nyayos.is_dispute_member(d.dispute_id, 'dispute_viewer')));
create policy annotations_insert_editor on nyayos.annotations for insert to nyayos_authenticated
  with check (created_by = nyayos.current_user_id() and exists (
    select 1 from nyayos.document_versions v join nyayos.documents d on d.id = v.document_id
    where v.id = document_version_id and nyayos.is_dispute_member(d.dispute_id, 'dispute_editor')));

-- 7.29 custody_events (members read; services append; no update/delete)
alter table nyayos.custody_events enable row level security;
alter table nyayos.custody_events force row level security;
revoke all on nyayos.custody_events from public;
grant select on nyayos.custody_events to nyayos_authenticated;
grant select, insert on nyayos.custody_events to nyayos_service_scan, nyayos_service_promote, nyayos_service_deletion;
create policy custody_select_member on nyayos.custody_events for select to nyayos_authenticated
  using (exists (select 1 from nyayos.documents d where d.id = document_id and nyayos.is_dispute_member(d.dispute_id, 'dispute_viewer')));
create policy custody_service_insert on nyayos.custody_events for insert
  to nyayos_service_scan, nyayos_service_promote, nyayos_service_deletion with check (true);
create policy custody_service_select on nyayos.custody_events for select
  to nyayos_service_scan, nyayos_service_promote, nyayos_service_deletion using (true);

-- 7.30 jobs (service only)
alter table nyayos.jobs enable row level security;
alter table nyayos.jobs force row level security;
revoke all on nyayos.jobs from public;
grant select, insert, update on nyayos.jobs to nyayos_service_scan, nyayos_service_promote;
create policy jobs_service on nyayos.jobs for all to nyayos_service_scan, nyayos_service_promote using (true) with check (true);

-- 7.31 exports (owner/editor read; INSERT via export server function — future migration; no direct grant)
alter table nyayos.exports enable row level security;
alter table nyayos.exports force row level security;
revoke all on nyayos.exports from public;
grant select on nyayos.exports to nyayos_authenticated;
grant select on nyayos.exports to nyayos_service_deletion;
create policy exports_select_editor on nyayos.exports for select to nyayos_authenticated
  using (nyayos.is_dispute_member(dispute_id, 'dispute_editor')
         or nyayos.grant_allows(dispute_id, 'export:' || id::text, 'download_export'));
create policy exports_service_deletion on nyayos.exports for select to nyayos_service_deletion using (true);

-- 7.32 export_manifests
alter table nyayos.export_manifests enable row level security;
alter table nyayos.export_manifests force row level security;
revoke all on nyayos.export_manifests from public;
grant select on nyayos.export_manifests to nyayos_authenticated;
create policy export_manifests_select on nyayos.export_manifests for select to nyayos_authenticated
  using (exists (select 1 from nyayos.exports e where e.id = export_id and nyayos.is_dispute_member(e.dispute_id, 'dispute_editor')));

-- 7.33 audit_events (S7: service writes via log_audit_event; owner reads own filtered rows; NO update/delete grants)
alter table nyayos.audit_events enable row level security;
alter table nyayos.audit_events force row level security;
revoke all on nyayos.audit_events from public;
grant select on nyayos.audit_events to nyayos_authenticated;
grant select, insert on nyayos.audit_events to nyayos_service_audit;
create policy audit_select_own_actions on nyayos.audit_events for select to nyayos_authenticated
  using (actor_type = 'user' and actor_id = nyayos.current_user_id()::text);
create policy audit_service_insert on nyayos.audit_events for insert to nyayos_service_audit with check (true);
create policy audit_service_select on nyayos.audit_events for select to nyayos_service_audit using (true);

-- 7.34 audit_anchors (weekly manual anchor by platform_security via service)
alter table nyayos.audit_anchors enable row level security;
alter table nyayos.audit_anchors force row level security;
revoke all on nyayos.audit_anchors from public;
grant select, insert on nyayos.audit_anchors to nyayos_service_audit;
create policy audit_anchors_service on nyayos.audit_anchors for all to nyayos_service_audit using (true) with check (true);

-- 7.35 deletion_requests (owner creates and reads; worker advances state)
alter table nyayos.deletion_requests enable row level security;
alter table nyayos.deletion_requests force row level security;
revoke all on nyayos.deletion_requests from public;
grant select, insert, update (state) on nyayos.deletion_requests to nyayos_authenticated;
grant select, update (state, locked_at, purged_at) on nyayos.deletion_requests to nyayos_service_deletion;
create policy deletion_requests_self on nyayos.deletion_requests for select to nyayos_authenticated
  using (requested_by = nyayos.current_user_id());
create policy deletion_requests_insert_self on nyayos.deletion_requests for insert to nyayos_authenticated
  with check (requested_by = nyayos.current_user_id() and nyayos.is_tenant_member(tenant_id));
create policy deletion_requests_undo_self on nyayos.deletion_requests for update to nyayos_authenticated
  using (requested_by = nyayos.current_user_id() and state = 'requested' and now() <= undo_until)
  with check (state = 'undone');
create policy deletion_requests_service on nyayos.deletion_requests for all to nyayos_service_deletion using (true) with check (true);

-- 7.36 deletion_ledger (tombstones: worker appends; requester may read own scope; never updated/deleted)
alter table nyayos.deletion_ledger enable row level security;
alter table nyayos.deletion_ledger force row level security;
revoke all on nyayos.deletion_ledger from public;
grant select on nyayos.deletion_ledger to nyayos_authenticated;
grant select, insert on nyayos.deletion_ledger to nyayos_service_deletion;
create policy deletion_ledger_select_tenant on nyayos.deletion_ledger for select to nyayos_authenticated
  using (nyayos.is_tenant_member(tenant_id));
create policy deletion_ledger_service on nyayos.deletion_ledger for all to nyayos_service_deletion using (true) with check (true);

-- 7.37 retention_records (worker writes; platform_security records verification via service)
alter table nyayos.retention_records enable row level security;
alter table nyayos.retention_records force row level security;
revoke all on nyayos.retention_records from public;
grant select on nyayos.retention_records to nyayos_authenticated;
grant select, insert, update on nyayos.retention_records to nyayos_service_deletion;
create policy retention_select_tenant on nyayos.retention_records for select to nyayos_authenticated
  using (nyayos.is_tenant_member(tenant_id));
create policy retention_service on nyayos.retention_records for all to nyayos_service_deletion using (true) with check (true);

-- 7.38 deletion_allowlist (read-only reference; written by migrations; enumerated by the deletion worker)
alter table nyayos.deletion_allowlist enable row level security;
alter table nyayos.deletion_allowlist force row level security;
revoke all on nyayos.deletion_allowlist from public;
grant select on nyayos.deletion_allowlist to nyayos_service_deletion, nyayos_service_audit;
create policy deletion_allowlist_service on nyayos.deletion_allowlist for select to nyayos_service_deletion, nyayos_service_audit using (true);

-- 7.39 config_provisional (read by services; written by migrations/operator)
alter table nyayos.config_provisional enable row level security;
alter table nyayos.config_provisional force row level security;
revoke all on nyayos.config_provisional from public;
grant select on nyayos.config_provisional to nyayos_authenticated, nyayos_service_scan, nyayos_service_promote, nyayos_service_deletion, nyayos_service_audit;
create policy config_select_all on nyayos.config_provisional for select
  to nyayos_authenticated, nyayos_service_scan, nyayos_service_promote, nyayos_service_deletion, nyayos_service_audit using (true);

-- -----------------------------------------------------------------------------
-- 8. Deletion allow-list registration (CR-4, SEC-DEL-06). One row per table above.
-- -----------------------------------------------------------------------------
insert into nyayos.deletion_allowlist (table_name, scope_column, retained) values
  ('profiles', 'user_id', false),
  ('tenants', null, false),
  ('tenant_memberships', 'tenant_id', false),
  ('dispute_roles', 'dispute_id', false),
  ('platform_roles', 'user_id', false),
  ('consents', 'principal_user_id', false),
  ('notices', null, false),
  ('disputes', 'tenant_id', false),
  ('dispute_statements', 'dispute_id', false),
  ('intake_questions', null, false),
  ('entities', 'dispute_id', false),
  ('entity_source_forms', 'dispute_id', false),
  ('events', 'dispute_id', false),
  ('date_assertions', 'dispute_id', false),
  ('propositions', 'dispute_id', false),
  ('evidence_items', 'dispute_id', false),
  ('evidence_relations', 'dispute_id', false),
  ('contradictions', 'dispute_id', false),
  ('missing_evidence', 'dispute_id', false),
  ('issues', 'dispute_id', false),
  ('next_steps', 'dispute_id', false),
  ('proposals', 'dispute_id', false),
  ('user_corrections', 'dispute_id', false),
  ('quarantine_uploads', 'tenant_id', false),
  ('documents', 'tenant_id', false),
  ('document_versions', 'document_id', false),
  ('document_locations', 'document_version_id', false),
  ('annotations', 'document_version_id', false),
  ('custody_events', 'document_id', false),
  ('jobs', 'tenant_id', false),
  ('exports', 'dispute_id', false),
  ('export_manifests', 'export_id', false),
  ('audit_events', 'tenant_id', true),
  ('audit_anchors', null, true),
  ('deletion_requests', 'tenant_id', false),
  ('deletion_ledger', 'tenant_id', true),
  ('retention_records', 'tenant_id', true),
  ('deletion_allowlist', null, false),
  ('config_provisional', null, false);

-- -----------------------------------------------------------------------------
-- 9. Provisional configuration seed ([PROV]; BB2 §3.3). Values are not legal positions.
-- -----------------------------------------------------------------------------
insert into nyayos.config_provisional (key, value, changed_by) values
  ('signed_url_view_ttl_seconds', '300', 'migration:0001'),
  ('signed_url_download_ttl_seconds', '120', 'migration:0001'),
  ('deletion_undo_window_days', '7', 'migration:0001'),
  ('rejected_upload_purge_hours', '24', 'migration:0001'),
  ('backup_rotation_days', '35', 'migration:0001'),
  ('upload_max_bytes', '10485760', 'migration:0001'),
  ('upload_max_pages', '500', 'migration:0001'),
  ('otp_max_attempts', '5', 'migration:0001'),
  ('audit_anchor_period_days', '7', 'migration:0001'),
  ('document_reference_policy', 'block', 'migration:0001');

-- -----------------------------------------------------------------------------
-- 10. Self-check (AC-M0-01 / AC-M0-07 at migration time): every table in the schema
--     has RLS enabled+forced and is registered in the allow-list. Fails the transaction otherwise.
-- -----------------------------------------------------------------------------
do $$
declare bad text;
begin
  select string_agg(c.relname, ', ') into bad
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'nyayos' and c.relkind = 'r' and not (c.relrowsecurity and c.relforcerowsecurity);
  if bad is not null then raise exception 'tables without forced RLS: %', bad; end if;

  select string_agg(c.relname, ', ') into bad
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'nyayos' and c.relkind = 'r'
    and not exists (select 1 from nyayos.deletion_allowlist a where a.table_name = c.relname);
  if bad is not null then raise exception 'tables missing from deletion_allowlist: %', bad; end if;

  select string_agg(c.relname, ', ') into bad
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'nyayos' and c.relkind = 'r'
    and not exists (select 1 from pg_policy p where p.polrelid = c.oid);
  if bad is not null then raise exception 'tables without any policy: %', bad; end if;
end $$;

commit;
