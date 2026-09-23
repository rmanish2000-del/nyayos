# NYAYOS_BUILD_BRIEF_V2

| Field | Value |
|---|---|
| Project | NyayOS |
| Tool / mode | Claude Chat (Opus, extended thinking) — build planning and implementation specification |
| Priority | P0 |
| Environment | Specification only. No code, no repository work, no database writes, no commits, no deployment, no production access. |
| Status of product | **Pre-build.** Nothing in this brief asserts that any implementation exists. |
| Supersedes | NYAYOS_LOVABLE_BUILD_BRIEF_V1 (retained as history; where they differ, this brief controls) |
| Controlling inputs | Master Product Spec V1 · Master Context V1 · Decision Log V1 · Risk Register V1 · Architecture Review · Lovable Build Brief V1 · Ecosystem Architecture Review V1 (L1–L10 provisionally ratified) · Security & Data Architecture Spec V1 ("SDAS") |
| Execution owner (once authorised) | Claude Code, milestone by milestone |
| Continuity owner | M365 Copilot |
| Date | 22 Sep 2026 |

> **Wording rule for this brief.** Controls are *specified* and *tested*. This brief makes no statement that NyayOS is secure or compliant. Legal requirements appear only as dependencies with their verification status from SDAS §27; where SDAS marks them [LAW-R] (secondary-source) or [PROV] (provisional), that status is carried here unchanged.

---

## 1. Executive summary

NyayOS MVP is built in **eight strictly sequential milestones (M0 → M7)** on the canonical stack (TanStack Start server functions, Supabase Postgres/Auth/Storage/RLS, pgvector, server-side AI gateway), hosted in an India region, as a multi-tenant modular monolith.

The sequence is security-first by design: the authorisation, audit, consent, upload-quarantine and deletion skeletons exist **before** any dispute content can be created (M0), and every later milestone must register its data with those skeletons or CI fails. AI arrives only after the canonical data model and evidence pipeline work fully in manual mode (M3 after M1–M2), which keeps the product usable if AI quality is poor and keeps AI outputs structurally unable to change facts. Reviewer access (M4) is built on frozen share snapshots, then exports and integrity manifests (M5), then full verified deletion and restore drills (M6), then pilot readiness against the G-PILOT gates (M7).

**Non-negotiable architecture (from SDAS §1, carried verbatim as build constraints):** India-region multi-tenant modular monolith · canonical stack · deny-by-default purpose-bound grants · frozen share snapshots · single-writer canonical facts · AI and reviewer outputs are proposals only · zero-tool AI tasks · separate private and authority corpora · write-once SHA-256 originals · verified deletion workflow.

**Explicitly excluded from all milestones:** send automation · sign automation · filing automation · lawyer marketplace · rankings · paid placement · lead fees · success fees · general-purpose AI tools · model tool access. (Also excluded: approve automation, outcome prediction, public criminal-matter drafting, private-file training — L3–L5, D-005, D-017.)

**Preconditions to start M0 (founder-only):** FD-01 build authorisation; FD-02 hosting vendor and India region confirmed; FD-03 provider choices for malware scan, OCR, LLM and embeddings, or explicit instruction to build provider abstractions with stub providers first (§13).

---

## 2. Milestone summary

| # | Milestone | Objective (one line) | Depends on | Exit gate | User-visible? |
|---|---|---|---|---|---|
| M0 | Foundation | Tenancy, roles, RLS helpers, audit chain, storage, quarantine upload, consent enforcement, deletion skeleton, CI schema lint, security test harness | FD-01–03 | M0 exit (§4.13) | Sign-up, empty workspace |
| M1 | Dispute Core | "What happened?" intake and the full canonical Dispute File in **manual mode**, with proposal → correction single-writer flow | M0 | M1 exit | Yes — manual dispute file |
| M2 | Evidence Pipeline | Scan → promote → write-once originals → derivatives (OCR) → locations → custody → private-corpus index with canaries | M1 | M2 exit | Yes — evidence locker |
| M3 | AI Foundation | AI gateway, nine bounded zero-tool tasks, authority corpus, IN-MP jurisdiction pack, citation and verified-deadline validators, T0 review-gate model, communication outline | M2 | M3 exit | Yes — AI proposals, verified information, outline |
| M4 | Reviewer Seat | Share versions, purpose-bound grants, invite/accept, scoped reviewer view, comments, suggestions, owner accept/reject, expiry/revocation, access history | M3 | M4 exit | Yes — share for review |
| M5 | Exports + Integrity | Export profiles, integrity manifest, recipient watermarking, export authorisation | M4 | M5 exit | Yes — export centre |
| M6 | Deletion + Recovery | Full verified deletion across all stores, user status, legal-hold register (provisional), backups, restore drill with ledger replay | M5 | M6 exit | Yes — delete with status |
| M7 | Pilot Readiness | G-PILOT full run, gold-set evaluation, incident runbook and tabletop, sub-processor register, counsel dependencies closed or risk-accepted, pilot tenants provisioned | M6 + legal deps | **G-PILOT** | Pilot cohort only |

**Execution order is strict.** A milestone starts only after the previous milestone's exit gate passes on staging. No parallel milestones (one active assignment rule).

---

## 3. Build-wide conventions (apply to every milestone)

### 3.1 Environments

| Env | Data | Region | Purpose |
|---|---|---|---|
| `dev` | synthetic only | any | engineering |
| `staging` | synthetic only | India | gate runs, restore drills |
| `pilot` | real users (M7+) | India | controlled pilot |
| `eval-private` | founder private case only, isolated tenant in `pilot` | India | Real-Case Evaluation Protocol (M7) |

Production data never enters `dev`/`staging`, demos or fixtures (R09, R29, SEC-ENV-01).

### 3.2 Per-milestone delivery protocol (for Claude Code, once authorised)

1. Inspect repository and the previous milestone's gate report.
2. Implement within milestone scope only; any out-of-scope need → stop and report.
3. Every new table: GRANTs + RLS + policies in the same migration; registered in the deletion allow-list; covered by the schema lint.
4. Run: unit, affected integration, milestone security tests, full SEC suite introduced so far, lint, type check, build, smoke test.
5. Produce a milestone gate report: tests run, pass/fail, evidence links (CI run ids, test reports). **Completion is claimed only with evidence.**
6. Merge only when the milestone exit gate passes.

### 3.3 Cross-cutting rules

- Migrations append-only; corrections are new migrations (Architecture Review §2.6).
- Every server function: Zod-validated input; caller authorisation re-checked; declared purpose; consent check; audit event.
- No client-supplied `tenant_id` trusted; ids resolved server-side.
- Feature flags per milestone capability (`ff_m1_intake`, …) so a capability can be disabled without schema rollback.
- Logging: ids and metadata only; PII redaction filter on all operational logs; no content, filenames, contact details or secrets (SDAS §3, §17).
- Languages: Hindi and English in UI strings, notices and disclaimers from M0; Unicode NFC normalisation for stored text; no transliteration-based merging.
- Confidence displayed as bands (High/Medium/Low/Unknown) — Product Spec §11.
- All [PROV] values (TTLs, retention, thresholds) are configuration, not constants, so counsel outcomes do not require code changes.

### 3.4 Definition of done (any milestone)

Scope complete · all milestone tests green · all previously introduced SEC tests green · schema lint green · no new table missing from deletion allow-list · no content in logs (sample review) · gate report filed · rollback path documented and rehearsed on staging.

---

## 4. M0 — Foundation

### 4.1 Objective
Establish the security skeleton every later milestone depends on, so no dispute content can exist outside tenant isolation, audit, consent and deletion control.

### 4.2 Scope
Identity, tenancy, roles, authorisation helpers, audit chain, storage buckets and path policies, upload quarantine path (scan stub), consent framework, deletion skeleton, CI schema lint, security test harness with synthetic fixtures, i18n baseline.

### 4.3 Included capabilities
- Sign-up / sign-in (managed auth); personal tenant auto-created.
- Organisation tenant creation; invite members; roles `tenant_owner`, `org_admin`, `member`.
- Dispute-role scaffolding (`dispute_owner`, `dispute_editor`, `dispute_viewer`) — table only; disputes arrive in M1.
- Platform roles `platform_security`, `platform_support`, `pack_curator`, `pack_approver` in a dedicated role table.
- Authorisation helpers `is_dispute_member` and `grant_allows` (the latter returns false until M4 creates grants).
- Audit: single writer helper, hash-chained rows, daily anchor export, event catalogue subset for M0 (auth, membership, consent, security, deletion).
- Storage buckets `evidence-quarantine`, `evidence-original`, `evidence-derived`, `exports` with path-scoped policies; **no public buckets**.
- Upload quarantine path: authenticated upload request → quarantine write → server-side SHA-256 → MIME sniff → scan **stub** (provider interface) → held in quarantine (promotion arrives in M2).
- Consent framework: purpose catalogue (SDAS §9.2), consent records (append-only), server-side `requirePurpose` check; `aggregate_analytics` and `model_improvement` hard-locked off.
- Deletion skeleton: `deletion_requests`, `retention_records`, `deletion_ledger`; states REQUESTED → UNDO_WINDOW → LOCKED → PURGE (M0 objects only) → VERIFY (row-count checks only) → COMPLETED_ACTIVE; deletion allow-list generated from schema.
- Break-glass and support-grant data model (records + approval flow), no content to access yet.
- CI: schema lint (RLS enabled + policy + explicit grants per table), deletion-allow-list registration check, secret scan of client bundle, dependency scan.
- Security test harness: fixtures tenants A (org, A1 owner, A2 member), B (personal, B1), reviewer R, support S; runner that executes SEC tests against staging.
- MFA enrolment available; enforcement policy flag for org owners (enforced from M4 for download-permitted reviewers).
- Rate limiting on auth, OTP, invite and upload endpoints.
- Clock synchronisation configured for server hosts to a national time source where the vendor allows [LAW-R dependency OL-05].

### 4.4 Excluded capabilities
Disputes and facts (M1); scan provider, promotion, OCR (M2); any AI (M3); grants/reviewers (M4); exports (M5); full deletion verification and restore (M6). Advocate workspace and institution tenant types exist only as reserved enum values.

### 4.5 Database requirements

| Table | Key fields | Notes |
|---|---|---|
| `tenants` | id, type (`personal`/`organization`/reserved `advocate_workspace`/`institution`), name, created_at | type immutable |
| `tenant_memberships` | tenant_id, user_id, tenant_role, status, invited_by, joined_at | unique (tenant_id, user_id) |
| `platform_roles` | user_id, role | never on profile |
| `dispute_roles` | dispute_id, user_id, dispute_role | FK to disputes added in M1 |
| `profiles` | user_id, display_name, preferred_language | S3 |
| `consents` | id, principal_user_id, tenant_id, scope_type, scope_id, purpose, notice_version, notice_language, method, granted_at, withdrawn_at, request_id | append-only |
| `notices` | purpose, version, language, text_ref, effective_from | hi/en same version |
| `audit_events` | per SDAS §17.1 incl. prev_hash, row_hash | no UPDATE/DELETE grants |
| `audit_anchors` | day, anchor_hash, exported_at | |
| `quarantine_uploads` | id, tenant_id, uploader_id, sha256, size, sniffed_mime, declared_mime, scan_status, created_at | promotion in M2 |
| `deletion_requests` | id, scope_type, scope_id, requested_by, state, undo_until, created_at | |
| `deletion_ledger` | id, scope_type, scope_id, completed_at | replayed on restore (M6) |
| `retention_records` | object_type, object_id, retention_policy_version, deletion_requested_at, deletion_completed_at, verification (structured) | Product Spec §10 |
| `deletion_allowlist` | table_name, scope_column | generated/validated by CI |
| `break_glass_requests` | id, requester, approver, reason, scope, starts_at, ends_at, status | |
| `config_provisional` | key, value, source (`PROV`), changed_by | TTLs, retention, thresholds |

### 4.6 API / server requirements
Auth middleware (`requireSupabaseAuth` pattern); membership management functions; `requirePurpose(purpose, scope)`; `logAuditEvent(...)` (service identity only); `requestUpload` / `completeUpload` (to quarantine); `requestDeletion` / `undoDeletion`; `requestBreakGlass` / `approveBreakGlass`; admin client loaded only inside handlers after role verification (Architecture Review §2.3).

### 4.7 UI requirements
Auth screens; language switch (hi/en); empty workspace dashboard with "Start a dispute" disabled until M1; organisation members screen; consent notice screens (versioned); account deletion request screen; no dispute UI.

### 4.8 Security requirements
All tables under RLS via helpers; no RLS-bypass path in browser bundle; service identities named and least-privileged; secrets server-only; audit chain from first event; logs content-free; India-region resources (dependency FD-02).

### 4.9 Acceptance criteria
- **AC-M0-01** Schema lint blocks any table without RLS, policy and explicit grants.
- **AC-M0-02** Personal tenant created on sign-up; organisation tenant with role-based membership works.
- **AC-M0-03** Cross-tenant reads of any M0 table return zero rows or denial.
- **AC-M0-04** Audit rows cannot be updated or deleted by any role; chain verification detects tampering.
- **AC-M0-05** Upload lands only in quarantine, with server-computed SHA-256 and sniffed MIME recorded.
- **AC-M0-06** Processing function without matching consent returns `purpose_not_consented` and logs the denial; `model_improvement` cannot be enabled.
- **AC-M0-07** Deletion skeleton transitions through states and records a retention record; CI fails if a new table referencing a scope id is not in the allow-list.
- **AC-M0-08** Client bundle contains no secrets or service keys.
- **AC-M0-09** Break-glass cannot proceed without a second approver.
- **AC-M0-10** Security harness runs against staging and reports per-test results.

### 4.10 Test requirements
SEC-RLS-01…04, SEC-TEN-02 (tenant listing), SEC-HASH-05 (audit tamper), SEC-DEL-06, SEC-SEC-01…02, SEC-INS-02, SEC-ATO-01…02, SEC-UPL-01, SEC-UPL-03, SEC-LANG-04, SEC-LANG-06; unit tests for helpers across role matrix.

### 4.11 Release gates
M0 exit: all AC-M0 pass; listed tests green; backend security scan clean; dependency scan clean.

### 4.12 Dependencies
FD-01, FD-02, FD-03 (scan provider interface may start as stub). OL-05 (clock sync source) informative, not blocking.

### 4.13 Risks
R02, R17, R24 (foundation work delays user validation — mitigated by keeping M0 to skeletons), vendor region uncertainty (A-03).

### 4.14 Rollback requirements
Staging-only synthetic data: rollback = environment reset from migration history. Every migration forward-fixable; no destructive data migration in M0.

---

## 5. M1 — Dispute Core

### 5.1 Objective
Deliver the complete canonical Dispute File in **manual mode** (no AI): a user can tell what happened, answer questions, and build facts, parties, timeline, evidence relations, contradictions, gaps, issues, paths and actions, with every change flowing through the single-writer correction model.

### 5.2 Scope
Dispute creation, intake, canonical entities, proposal/correction framework, need-to-know inside organisation tenants, status/provenance model, UI for the core journey without AI.

### 5.3 Included capabilities
- "What happened?" free-text entry (Product Spec §7.1; US-01) stored as a user statement with provenance `user_statement`.
- Intake with manual structured questions covering the minimum fields (Product Spec §7.2); "I don't know" supported; uncertainty preserved. (Dynamic AI question generation arrives in M3.)
- Canonical entities: parties/entities (with source forms, no silent merge), roles, events, date assertions with precision states (exact/approximate/inferred/unknown/conflicting), propositions, evidence items (document-less until M2; pasted text allowed), evidence relations (supports/partially supports/contradicts/mentions/uncertain), contradictions (flag-only), missing evidence, issues, possible paths, actions.
- **Proposal → correction single-writer flow:** all changes to canonical tables go through `proposals` (origin: `user`, later `ai`, `reviewer`) and `user_corrections`; owner-originated edits are auto-accepted proposals with correction records; no direct UPDATE on canonical tables.
- Provenance on every item: origin type, source reference, verification status, correction history.
- Organisation need-to-know: dispute roles; `org_admin` metadata-only view.
- Ownership transfer with acceptance.
- Status labels throughout UI: user statement / document extraction / AI inference / authority source / reviewer suggestion (the latter three become active in M2–M4).

### 5.4 Excluded capabilities
File upload promotion and OCR (M2); all AI tasks incl. dynamic questions (M3); verified information and authority retrieval (M3); sharing (M4); exports (M5).

### 5.5 Database requirements
Tables per Product Spec §10 and Lovable Brief §5, tenant-scoped: `disputes`, `entities`, `entity_source_forms`, `roles`, `events`, `date_assertions`, `propositions`, `evidence_items`, `evidence_relations`, `contradictions`, `missing_evidence`, `issues`, `possible_paths`, `actions`, `proposals` (target_type, target_id, proposed_value, origin, origin_ref, status, decided_by, decided_at, reason), `user_corrections` (target_type, target_id, previous_value, new_value, reason, user_id, origin_proposal_id, timestamp), `dispute_statements` (narrative, intake answers — S4). Every table has `tenant_id`, `dispute_id`, RLS via `is_dispute_member`, registered in deletion allow-list. Canonical tables: INSERT/UPDATE only via server functions using service identity after authorisation; no authenticated UPDATE grant.

### 5.6 API / server requirements
`createDispute`, `addStatement`, `answerIntakeQuestion`, `proposeChange`, `decideProposal` (accept/reject — owner/editor only), `listDisputeFile`, `transferOwnership`, `setDisputeRole`. Each declares purpose `storage` and emits audit events (`proposal.created/accepted/rejected`, `correction.created`, `dispute.accessed`).

### 5.7 UI requirements (Figma Brief V2 §2–14 in manual mode)
Dashboard; new dispute; intake (one question at a time, "why we ask", save and exit); fact list with confirm/correct/uncertain/not relevant; timeline with date states; parties with duplicate-review; evidence map table; "Information to review" (contradictions, flag-only copy); "What may still be useful" (gaps, no negative inference); issue classification (manual, "not a legal determination" label); possible paths (unranked); action plan ("No verified deadline" default). Mobile-first priority: intake, confirmation, timeline.

### 5.8 Security requirements
Need-to-know enforced; single-writer enforced at grant level (no UPDATE on canonical tables); narratives never in logs; correction history immutable.

### 5.9 Acceptance criteria
- **AC-M1-01** User can start a dispute from free text without choosing a legal category (US-01).
- **AC-M1-02** Every canonical change has a correction record with previous/new value and origin (US-03).
- **AC-M1-03** No authenticated role can directly update canonical tables.
- **AC-M1-04** Dates retain precision; conflicting dates stay visible; no system-generated dates (US-04).
- **AC-M1-05** Similar names are never auto-merged; merges are explicit user actions (Product Spec §7.8).
- **AC-M1-06** Contradictions require two references and cannot record a "true" source (US-06).
- **AC-M1-07** Gaps link to expected/mentioned items and never imply non-occurrence (US-07).
- **AC-M1-08** Organisation member without dispute role cannot read dispute content; org_admin sees metadata only.
- **AC-M1-09** Cross-tenant and cross-dispute isolation holds for all M1 tables.

### 5.10 Test requirements
SEC-TEN-01, SEC-TEN-05, SEC-MUT-02, SEC-MUT-03, SEC-RLS-03, SEC-LANG-01, SEC-LANG-02; functional tests for US-01, US-03–US-07; role-matrix unit tests for every M1 table.

### 5.11 Release gates
M1 exit: AC-M1 pass; all SEC tests to date green; manual end-to-end dispute file on staging completed by a test script with synthetic commercial dispute.

### 5.12 Dependencies
M0 exit.

### 5.13 Risks
R03 (confusion between statement and fact — mitigated by status labels), R11, R12 (activation — intake length), R24.

### 5.14 Rollback requirements
Feature flag `ff_m1_*` off hides dispute UI; schema forward-fix only; staging synthetic data reset allowed.

---

## 6. M2 — Evidence Pipeline

### 6.1 Objective
Turn uploads into write-once, hashed, scanned originals with OCR derivatives, page-level provenance, custody events, and a dispute-scoped private-corpus index ready for retrieval and verifiable deletion.

### 6.2 Scope
Scan provider integration, promotion, originals and versions, derivatives, OCR/parser provider abstraction, document locations, custody, evidence locker, private-corpus chunking and embedding with canaries.

### 6.3 Included capabilities
- Malware/content scan provider behind interface; CLEAN → promote to `evidence-original` (write-once policy); INFECTED/FAILED → quarantine retained [PROV 24 h] then purged; user informed.
- Supported types: PDF, JPG/JPEG, PNG, DOC/DOCX where the parser supports them (macros never executed), pasted text (Product Spec §7.4).
- Size and page limits (configurable [PROV]).
- Document versions: replacement creates a new version with its own hash; previous retained unless deleted.
- Derivatives: OCR text, page images, normalised text — each with own SHA-256 and parent hash, provider and version, confidence band (SDAS §8.3).
- Asynchronous job queue (Postgres-backed job table; no new infrastructure) for scan, OCR and indexing; retries with backoff; provider abstraction (R15).
- Document locations (page, anchor, offsets) for provenance.
- Custody events (SDAS §8.5) in the audit chain.
- Evidence locker UI (Figma §4): name, type, status, pages, upload date, confidence, verification state; view/rename (display label only)/delete.
- Viewer: streamed via short-TTL signed URLs issued per request by server function (SDAS §5.3); annotations stored separately.
- Private-corpus index: chunks from normalised derivatives with metadata (SDAS §11), embedding model/version configurable, **canary id per document**; retrieval RPC scoped to a single dispute and member-only; hybrid keyword + vector.
- Manual extraction from documents (user creates facts with a document location) — AI extraction arrives in M3.

### 6.4 Excluded capabilities
AI extraction/normalisation (M3); reviewer access to documents (M4); exports (M5); full deletion verification incl. provider-side confirmation (M6).

### 6.5 Database requirements
`documents` (id, tenant_id, dispute_id, current_version, display_label, status, created_at, deleted_at), `document_versions` (document_id, version, sha256, size_bytes, sniffed_mime, declared_mime, page_count, original_filename [S4], uploader_id, ingest_ts, client_reported_mtime, scan_result, scan_provider_version, storage_path, language_detected), `document_derivatives` (version_id, kind, sha256, parent_sha256, provider, provider_version, created_ts, confidence_band, storage_path), `document_locations`, `annotations`, `document_chunks` (per SDAS §11 incl. canary_id, embedding_model, embedding_version; embedding dimension from config), `jobs` (type, payload_ref, state, attempts, next_run_at, last_error_code). All tenant-scoped, RLS, allow-listed. Chunks: members only, never grantees.

### 6.6 API / server requirements
`promoteUpload` (service), `getDocumentUrl` (issuance with authorisation, TTL, audit), `replaceDocument`, `annotate`, `enqueueOcr`, OCR provider adapter, scan provider adapter, `indexDocumentVersion`, `retrieveCase(dispute_id, query, filters)` (member-only; single dispute).

### 6.7 UI requirements
Upload with progress and processing states; evidence locker; document viewer with page navigation and location linking; failed-processing state that preserves the original and explains status (US-02 failure path); manual "create fact from this location".

### 6.8 Security requirements
Originals immutable for all roles; MIME sniffing; macro execution impossible; sandboxed rendering; signed URL TTL [PROV 5 min view / 2 min download]; no filenames in logs; derivatives never overwrite originals; retrieval RPC enforces dispute scope and membership (RLS second barrier).

### 6.9 Acceptance criteria
- **AC-M2-01** Stored original SHA-256 recomputed equals recorded hash.
- **AC-M2-02** No role can overwrite or modify an original; replacement produces a new version.
- **AC-M2-03** Infected, oversized and type-mismatched files are rejected or quarantined with user notice.
- **AC-M2-04** OCR derivatives link to parent hash and never alter the original.
- **AC-M2-05** Every chunk carries dispute/document/version/location/canary metadata; retrieval never crosses disputes.
- **AC-M2-06** Signed URLs are issued only after authorisation and expire at TTL.
- **AC-M2-07** Failed processing preserves the original and shows status (US-02).
- **AC-M2-08** Custody events recorded for ingest, scan, promotion, derivation, view.
- **AC-M2-09** Hindi, English and mixed-script documents are stored, displayed and retrievable without corruption.

### 6.10 Test requirements
SEC-HASH-01…03, SEC-UPL-01…04, SEC-OCR-01…02, SEC-URL-01, SEC-TEN-03, SEC-TEN-04, SEC-LANG-01, SEC-LANG-03; retrieval scope tests; job retry/failure tests; OCR benchmark on synthetic gold set (critical-field precision tracked against the ≥95% target in Evaluation Protocol §6 — target, not claim).

### 6.11 Release gates
M2 exit: AC-M2 pass; SEC suite to date green; OCR benchmark report filed (pass/fail recorded, provider decision FD-03 confirmed or revised).

### 6.12 Dependencies
M1 exit; FD-03 (scan, OCR, embedding providers); OL-11 (cross-border processing if providers are outside India).

### 6.13 Risks
R04, R15, R16, T07, T08, provider data retention (T18).

### 6.14 Rollback requirements
Provider switch via adapter configuration; re-indexing is re-runnable and idempotent; new embedding version = new rows with cut-over flag; old rows deleted after cut-over.

---

## 7. M3 — AI Foundation

### 7.1 Objective
Add AI as a proposal generator under strict controls: a server-side gateway running nine bounded, zero-tool tasks with schema validation, plus the authority corpus, IN-MP jurisdiction pack, citation and verified-deadline validators, the T0 review-gate model and the communication outline.

### 7.2 Scope
AI gateway, workflow state machine AI states, bounded tasks, authority corpus and curation, jurisdiction pack v1, validators, draft/review-gate data model (T0 only), communication outline, verified information screen, dynamic intake questions.

### 7.3 Included capabilities
- **AI gateway**: server-only; provider abstraction; request/response logging of metadata only; per-user/per-dispute rate and cost limits; no model keys in browser.
- **Zero-tool rule:** models receive assembled inputs and return JSON; no tool definitions are ever sent to a model; retrieval is a deterministic server step before the call. The Lovable Brief V1 §9 "tools" (`search_case_documents`, `read_case_document`, `search_authority_sources`, `read_authority_source`, `propose_*`, `draft_action_plan`, `create_export_draft`) are re-implemented as **server-side workflow steps**, not model-callable tools (C09).
- **Workflow state machine** (Lovable Brief §2): INTAKE → EXTRACT → CONFIRM → TIMELINE → EVIDENCE_MAP → ISSUE → RETRIEVE → ACTION_PLAN → EXPORT; each state defines inputs, schema, allowed task, validation, failure state, human gate.
- **Bounded tasks** (SDAS §13.2): extraction, normalisation, timeline drafting, evidence-relation proposals, contradiction flagging, issue classification, communication outline, action-plan suggestions, export drafting — plus dynamic intake question generation (Product Spec §7.3) under the same envelope. All outputs are `proposals` with origin `ai`.
- **Validators:** schema; output ids ⊆ input ids; length/enum bounds; prohibited-content scan (adjudicative language in contradictions; guilt/innocence, bail, outcome prediction, merits conclusions); precision non-increase for dates.
- **Consent:** `ai_assistance` required per dispute; manual mode remains fully usable.
- **Authority corpus:** separate schema, tenant-less, read-only to app; curated ingest from official publishers; metadata per SDAS §12; statuses; effective dates; `last_verified_at`; two-person curation.
- **Jurisdiction pack `IN-MP` v1:** manifest, source registry, taxonomy (commercial vendor/payment disputes + consumer sandbox categories), templates for T0 outputs, policy flags (SDAS §15.2), disclaimers hi/en, staleness policy; two-person release with named legal reviewer sign-off (FD-07).
- **Citation contract validator:** exists, status allowed, effective on as-of date, jurisdiction match, exact-substring quotes; unresolved → statement blocked with "NyayOS could not verify this from its current source set."
- **Verified-deadline gate:** deadline shown only with authority citation and as-of date; otherwise "No verified deadline".
- **Staleness:** threshold [PROV 90 days] → "may be outdated"; deadline claims blocked; curator alerts.
- **Draft/review-gate model** (SDAS §14): draft types, tiers, flags; **T0 enabled only**; T1/T2 defined disabled; `sendable=false` for every type; draft versions, diffs, approvals, frozen hash.
- **Communication outline (T0):** points to state (fact ids), documents to attach, what is being asked (owner text), questions for advocate; non-sendable rendering with "Outline — not a notice".
- **Verified information screen** (Figma §12; US-08) and action plan with verified/unverified deadline labels (US-09).
- `ai_runs` metadata complete (SDAS §13.1).

### 7.4 Excluded capabilities
Any model tool access; T1/T2 drafts; notices, responses, representations, complaints, applications; outcome prediction; autonomous anything; cross-dispute retrieval; training/fine-tuning on user data.

### 7.5 Database requirements
`ai_runs`; `authority_sources`, `authority_source_versions` (text, locator index, checksum, status, effective_from/to, last_verified_at, verified_by, publisher, source_url, retrieved_at, licence_note), `authority_chunks` (separate schema); `jurisdiction_packs`, `pack_versions` (manifest, content hash, approvals, legal reviewer), `pack_templates`, `policy_flags`; `draft_types` (from pack), `drafts`, `draft_versions` (content S4, author ref, structured diff, validation report), `draft_approvals`, `workflow_instances`, `workflow_transitions`, `validation_results`. Every AI output row, draft version and displayed legal statement stores `pack_version`.

### 7.6 API / server requirements
`runTask(task_type, dispute_id)` (workflow-invoked only); `retrieveAuthority(jurisdiction, as_of, status_filter, query)`; `validateCitations`; `validateDeadlines`; pack curation functions (`proposePack`, `approvePack`, `activatePack`, `rollbackPack`) restricted to curator/approver roles; `createDraft` / `approveDraft` / `freezeDraft` (T0 only).

### 7.7 UI requirements
AI proposal review with source/status more prominent than AI wording (Figma §5); proposal accept/reject; verified information cards (source title, publisher, jurisdiction, date/version, link, last verified); communication outline editor; AI notice on first use; manual-mode toggle.

### 7.8 Security requirements
Zero-tool enforcement tested; injection canaries; outputs rendered as escaped text; provider settings documented (no training, retention setting, region) (FD-03, OL-11); pack changes two-person; authority corpus writes only by pipeline.

### 7.9 Acceptance criteria
- **AC-M3-01** No request to any model contains tool definitions; gateway rejects any such configuration.
- **AC-M3-02** AI output cannot change canonical data; it appears only as proposals.
- **AC-M3-03** Output ids outside the input set cause validation failure.
- **AC-M3-04** Unresolved, wrong-jurisdiction, draft-status or non-substring citations are blocked.
- **AC-M3-05** Deadlines appear only with verified source; otherwise "No verified deadline".
- **AC-M3-06** Stale sources are labelled and cannot support deadline claims.
- **AC-M3-07** Contradiction outputs never state which source is correct.
- **AC-M3-08** Every AI run records model, prompt version, pack version, input refs, schema version and validation result, without content.
- **AC-M3-09** Pack v1 released through two-person approval with named legal reviewer sign-off.
- **AC-M3-10** Only T0 draft types are enabled; no type is sendable.
- **AC-M3-11** Withdrawal of `ai_assistance` stops new AI runs; manual mode remains functional.

### 7.10 Test requirements
SEC-INJ-01…05, SEC-CIT-01…04, SEC-UNS-01…02, SEC-STALE-01…03, SEC-MUT-01, SEC-MUT-04, SEC-VEN-01…02, SEC-LANG-03; gold-set evaluation on synthetic cases for extraction, timeline, relations, contradictions (targets from Evaluation Protocol §17 tracked; release gates for citations/unsupported claims are zero-tolerance).

### 7.11 Release gates
M3 exit: AC-M3 pass; zero injection successes; zero unresolved citations displayed; zero unsupported high-impact claims on the synthetic gold set; SEC suite to date green.

### 7.12 Dependencies
M2 exit; FD-03 (LLM provider), FD-07 (pack legal reviewer), OL-11; authority source list for IN-MP curated (FD-08).

### 7.13 Risks
R01, R05, R06, R07, R08, R11, R16, R21, R22; cost overrun (A-06).

### 7.14 Rollback requirements
Per-task feature flags; pack rollback to previous version with flagging of outputs produced under a legally erroneous pack; provider switch via gateway configuration; AI can be disabled globally leaving manual mode.

---

## 8. M4 — Reviewer Seat

### 8.1 Objective
Let a dispute owner share a minimal, frozen, purpose-bound snapshot with a professional of their choice, who can view, comment and suggest — without any ability to change facts, see unshared material, or re-share.

### 8.2 Scope
Share versions, grants, invitation/acceptance, reviewer identity (self-declared), reviewer view, comments, suggestions, owner decisions, expiry, revocation, access history, MFA for download permissions.

### 8.3 Included capabilities
Per SDAS §6–7: minimal preset; owner item selection; per-document view/download flags; immutable share versions with frozen rendered content; invite token (hashed, single-use, contact-bound, [PROV 7-day] expiry; no content in message); reviewer authentication + contact OTP; self-declared identity (name, enrolment no., State Bar Council, enrolment year) displayed only to the inviting owner as "Self-declared — not verified by NyayOS"; acceptance terms; reviewer view with recipient watermark; item-anchored comments (edit window [PROV 15 min]); structured suggestions → proposals (origin `reviewer`) → owner accept/reject → correction; expiry [PROV 30 days, max 90]; renewal; revocation (immediate); reviewer removal; owner access-history view; support grants (user-initiated) using the same model.

### 8.4 Excluded capabilities
Re-sharing; live-record access; shared commenting across reviewers; reviewer access to chunks/embeddings/ai_runs; directory, search, profiles, verification badges, ratings, reviews, matching, engagement requests, fee quotes (Ecosystem Review §7–12 deferred/rejected).

### 8.5 Database requirements
`share_versions` (dispute_id, version, created_by, created_at, manifest of item refs), `share_items` (share_version_id, item_type, item_id, frozen_render [S4], included_flags), `grants` (SDAS §6.1 fields), `grant_invites` (token_hash, contact_hash, expires_at, used_at), `reviewer_profiles` (user_id, display_name, enrolment_no, bar_council, enrolment_year, firm, verification_status=`self_declared`), `reviewer_comments` (share_version_id, item ref, location, text [S4], author, created_at, edited_at). Product Spec `human_reviews` is represented by grant review status (`review_status` on `grants`). `dispute_shares` from Lovable Brief V1 is replaced by `share_versions` + `grants` (C02). All RLS via `grant_allows`; allow-listed.

### 8.6 API / server requirements
`createShareVersion`, `inviteReviewer`, `acceptInvite`, `declareReviewerIdentity`, `getSharedItem` (grant check per item), `getSharedDocumentUrl` (per-document flag, watermark), `commentOnItem`, `suggestChange`, `decideProposal` (reused), `renewGrant`, `revokeGrant`, `listAccessHistory` (owner-scoped view from audit), `createSupportGrant`.

### 8.7 UI requirements
"Prepare a professional-ready case file" → share composer with minimal preset, item checklist, document toggles, expiry picker (Figma §15, §17); "who has access" panel with revoke; reviewer workspace (read-only snapshot, version date banner, comments, suggestions); owner inbox for suggestions; access history timeline.

### 8.8 Security requirements
Deny-by-default; MFA required for reviewers with any download permission; rate limits on invite acceptance and URL issuance; watermark on all reviewer document/export renders; no reviewer-visible metadata about other disputes, other grants or other reviewers.

### 8.9 Acceptance criteria
- **AC-M4-01** Reviewer sees only items in the share version; everything else denied and logged (US-12).
- **AC-M4-02** Post-share owner edits are not visible to the reviewer until a new share version is published.
- **AC-M4-03** Reviewer suggestions never change canonical data without owner acceptance.
- **AC-M4-04** Invite tokens are single-use, contact-bound and expire; invite messages contain no dispute content.
- **AC-M4-05** Revocation and expiry end access on the next request.
- **AC-M4-06** Reviewer cannot re-share or access chunks, embeddings or AI run data.
- **AC-M4-07** Owner can see complete access history per grant.
- **AC-M4-08** Download permissions require reviewer MFA.
- **AC-M4-09** Self-declared identity is labelled as not verified and shown only to the inviting owner.

### 8.10 Test requirements
SEC-REV-01…07, SEC-URL-02…04, SEC-REVK-01…03, SEC-ATO-03, SEC-INJ-05, SEC-INS-01, SEC-PRIV-01; functional tests for US-12.

### 8.11 Release gates
M4 exit: AC-M4 pass; zero reviewer out-of-scope reads across the role × item matrix; SEC suite to date green.

### 8.12 Dependencies
M3 exit; OL-09 (reviewer identity display), OL-10 (confidentiality wording).

### 8.13 Risks
R20, T03, T04, T13; reviewer adoption (A-07).

### 8.14 Rollback requirements
`ff_m4_sharing` off disables new invites; existing grants can be bulk-revoked by owner-safe operation; share versions retained.

---

## 9. M5 — Exports + Integrity

### 9.1 Objective
Produce versioned, provenance-complete exports with an integrity manifest, recipient watermarking and strict export authorisation.

### 9.2 Scope
Export profiles, manifest generation, manifest hash in audit, watermarking, export centre, export authorisation.

### 9.3 Included capabilities
- Profiles (Figma §16): Summary, Full case file, Evidence index, Timeline, Sources; plus advocate-ready brief, issues list, missing-document list, communication outline (T0).
- Export content must include source references, extraction status, user corrections, timeline, evidence map, unresolved contradictions, missing evidence, AI-generated-content notice, export version and timestamp, pack version (Evaluation Protocol §16; US-10).
- Export must exclude unnecessary personal data, unsupported legal conclusions, guilt/innocence, bail estimates, outcome predictions (validator from M3).
- Integrity manifest (SDAS §8.6): per document id, version, SHA-256, size, ingest timestamp; export id; manifest SHA-256 written to audit chain.
- Mandatory integrity scope statement (SDAS §8.7) in every export — no admissibility claim.
- Pre-share privacy check screen: lists what the export contains before generation (US-10).
- Recipient watermark (owner or reviewer identity, grant id, timestamp).
- Devanagari font embedding and rendering.
- Owner warning on reviewer downloads: offline copies are outside NyayOS control.

### 9.4 Excluded capabilities
Manifest digital signing (deferred, C25); sending exports by email or any channel; e-filing formats.

### 9.5 Database requirements
`exports` (dispute_id, version, profile, included_sections, generated_at, generated_by, pack_version, manifest_sha256, storage_path, share_status), `export_manifests` (export_id, entries), `export_downloads` (export_id, recipient_user_id, grant_id, watermark_id, downloaded_at). RLS; allow-listed.

### 9.6 API / server requirements
`previewExport`, `generateExport` (consent `export`), `getExportUrl` (owner/editor or grantee with `download_export`), `deleteExport`.

### 9.7 UI requirements
Export centre with tabs; privacy check step; manifest viewer; footer with AI notice, export version, timestamp, source status.

### 9.8 Security requirements
Export authorisation on every download; watermark per recipient; short-TTL URLs; manifest hash immutable in audit chain.

### 9.9 Acceptance criteria
- **AC-M5-01** Every export includes the required provenance and notice elements and excludes prohibited content.
- **AC-M5-02** Manifest hashes match stored originals; manifest hash present in audit chain.
- **AC-M5-03** Only authorised principals can download; each download watermarked and logged.
- **AC-M5-04** Integrity scope statement present in every export and makes no admissibility claim.
- **AC-M5-05** Hindi/English content renders correctly in exports.

### 9.10 Test requirements
SEC-EXP-01…04, SEC-HASH-04, SEC-LANG-05, SEC-UNS-01 (export path), US-10 functional tests.

### 9.11 Release gates
M5 exit: AC-M5 pass; SEC suite to date green.

### 9.12 Dependencies
M4 exit; OL-08 (integrity wording).

### 9.13 Risks
R30, T05.

### 9.14 Rollback requirements
Export profiles versioned; a defective profile is disabled by flag; generated exports remain until owner deletes; regeneration creates a new version.

---

## 10. M6 — Deletion + Recovery

### 10.1 Objective
Complete verified deletion across every store with honest user status, and prove backup restore without resurrecting deleted data.

### 10.2 Scope
Full deletion workflow, verification probes, provider-side deletion confirmation, user status, legal-hold register (provisional policy), backups, restore drill, deletion-ledger replay, retention configuration.

### 10.3 Included capabilities
SDAS §10: document, dispute and account deletion; undo window [PROV 7 days]; LOCKED state revokes grants and invalidates URLs; purge across rows (schema-generated allow-list), storage prefixes, derivatives, chunks/vectors, keyword index, caches, exports, queued jobs; provider-side deletion requests or documented zero-retention; verification probes incl. canary retrieval and URL-issuance denial; `retention_records.verification`; user status (Requested / In progress / Removed from active systems on <date> / Backups expire by <date> / Held); legal-hold register and HELD state (policy provisional, OL-06); content-free tombstone (pending OL-03); account deletion with audit actor pseudonymisation; retention classes as configuration; backups encrypted, India region, [PROV 35-day] rotation; quarterly restore drill into isolated project with ledger replay before promotion; audit anchor verification after restore.

### 10.4 Excluded capabilities
Per-dispute envelope encryption / crypto-shredding (deferred, C24); automated inactivity purge until counsel sets periods (configuration present, disabled).

### 10.5 Database requirements
Extend `deletion_requests`, `deletion_ledger`, `retention_records`; add `legal_holds` (id, scope, basis_category, applied_by, applied_at, review_date, released_at), `provider_deletion_confirmations` (provider, scope, requested_at, confirmed_at, method), `restore_drills` (drill_id, backup_point, ledger_replayed, checks, result, destroyed_at).

### 10.6 API / server requirements
`requestDeletion` (document/dispute/account), `undoDeletion`, deletion worker (service identity), `verifyDeletion`, `applyLegalHold` / `releaseLegalHold` (owner; platform only with counsel-reviewed order), `getDeletionStatus`, restore runbook automation for ledger replay (drill environment only).

### 10.7 UI requirements
Delete flows with clear consequences; status page distinguishing requested vs completed (US-11); backup expiry date; hold status.

### 10.8 Security requirements
Deletion worker least-privileged; verification failures alert `platform_security`; restored environments not user-accessible until ledger replay passes; backup access via break-glass only.

### 10.9 Acceptance criteria
- **AC-M6-01** Deleting a document or dispute removes all rows, objects, derivatives, chunks, vectors, exports and cached renders; verification record = pass.
- **AC-M6-02** Canary retrieval returns nothing after deletion; URL issuance for deleted objects is denied.
- **AC-M6-03** Grants are revoked before purge; reviewers lose access immediately.
- **AC-M6-04** User sees accurate status including backup expiry; incomplete deletion is shown as in progress, never as complete.
- **AC-M6-05** Legal hold blocks purge and is visible to the owner.
- **AC-M6-06** Restore drill proves ledger replay removes previously deleted data before promotion; promotion blocked without replay.
- **AC-M6-07** Adding any table without deletion registration fails CI.

### 10.10 Test requirements
SEC-DEL-01…07, SEC-BKP-01…03, SEC-HASH-05 (post-restore chain), US-11 functional tests; Evaluation Protocol §15 deletion checks rehearsed on synthetic data.

### 10.11 Release gates
M6 exit: AC-M6 pass; zero deletion-verification failures; one successful restore drill recorded; SEC suite to date green.

### 10.12 Dependencies
M5 exit; FD-02 (backup capability/region), OL-02, OL-03, OL-06.

### 10.13 Risks
R18, R19, T16, T17; vendor backup behaviour (A-04).

### 10.14 Rollback requirements
Deletion is irreversible after undo window by design; defects are handled by halting the worker (flag) — never by restoring deleted data to users; restore procedures only in isolated drill environments unless disaster recovery, and then only after ledger replay.

---

## 11. M7 — Pilot Readiness

### 11.1 Objective
Prove the full G-PILOT gate set on the final pilot build, close or formally risk-accept legal dependencies, and provision a controlled pilot.

### 11.2 Scope
Full security suite, gold-set evaluation, operational readiness, incident response, legal and founder decisions, pilot provisioning, private-case evaluation under its protocol.

### 11.3 Included capabilities
- Full SEC suite run on pilot build; backend security scan; dependency scan; RLS lint.
- Synthetic gold-set evaluation (Evaluation Protocol §17 thresholds tracked; zero-tolerance items enforced as gates).
- Sub-processor register (provider, purpose, data classes, region, retention, training posture, contract ref).
- Incident runbook with counsel-reviewed notification templates in Hindi and English; tabletop exercise completed.
- Consent notices and privacy/retention explanation finalised with counsel (versioned).
- Monitoring and alerts: denied-access spikes, export volume, deletion failures, break-glass use, staleness, audit chain breaks.
- Pilot tenants provisioned (target cohort per 90-Day Validation Plan: small businesses/FPOs, professional reviewers).
- `eval-private` isolated tenant for the founder's private matter, run strictly under the Real-Case Evaluation Protocol, then deleted with verification.
- Product copy review: no "AI Lawyer", "Win", "Predict", "best lawyer", ranking or marketplace language (Figma Brief §"Do not use"; L3).
- Founder risk-acceptance log for any open legal dependency.

### 11.4 Excluded capabilities
Public launch; public consumer launch; directory; any T1/T2 draft; payments between clients and advocates.

### 11.5 Database requirements
No new domain tables; `subprocessors`, `risk_acceptances` (item, decision, owner, date, review_date) as governance records.

### 11.6 API / server requirements
None new beyond monitoring hooks and admin reporting (metadata only).

### 11.7 UI requirements
Pilot onboarding; trust & safety page (Figma "Trust & Safety"); pilot feedback capture (no content logging).

### 11.8 Security requirements
All G-PILOT gates; MFA enforcement live; break-glass reviewed; environment separation verified.

### 11.9 Acceptance criteria
- **AC-M7-01** Every G-PILOT gate (§14.1) passes on the pilot build with evidence.
- **AC-M7-02** OL-01…OL-08 are each closed by counsel or have a dated founder risk acceptance.
- **AC-M7-03** Incident runbook and templates exist; tabletop completed.
- **AC-M7-04** Sub-processor register complete; provider no-training/retention settings documented.
- **AC-M7-05** Private-case evaluation completed in isolation and deleted with verification; report contains no merits conclusion.
- **AC-M7-06** Copy review passes.
- **AC-M7-07** SDAS §25 acceptance criteria 1–17 all evidenced.

### 11.10 Test requirements
Full SEC suite (SDAS §21); SEC-ENV-01…02; SEC-PRIV-01; Evaluation Protocol §6–16 on synthetic set, then private set in `eval-private`.

### 11.11 Release gates
**G-PILOT** (all zero-tolerance items) + G-REL checks.

### 11.12 Dependencies
M6 exit; OL-01…OL-08; FD-04 (pilot cohort), FD-05 (pricing test design), FD-06 (retention risk acceptance).

### 11.13 Risks
R12, R13, R25, R28; legal dependencies not closed (A-08).

### 11.14 Rollback requirements
Pilot can be paused by global flag; users retain export and deletion rights during pause; no data migration required to pause.

---

## 12. Traceability

### 12.1 C01–C19 (SDAS §22) → milestone → acceptance criteria → tests

| Req | Requirement | Milestone | Acceptance criteria | Test IDs |
|---|---|---|---|---|
| C01 | Reviewer seat: share snapshots, grants, permissions, expiry, revocation | M4 | AC-M4-01…09 | SEC-REV-01…07, SEC-REVK-01…03, SEC-URL-02…04 |
| C02 | `share_versions` + `share_items` + `grants` replace `dispute_shares` | M4 (helper `grant_allows` stub in M0) | AC-M4-01, AC-M4-02 | SEC-REV-01, SEC-REV-04 |
| C03 | Proposals + single-writer; no direct UPDATE on canonical tables | M1 (framework), M3 (AI origin), M4 (reviewer origin) | AC-M1-02, AC-M1-03, AC-M3-02, AC-M4-03 | SEC-MUT-01…04, SEC-RLS-03, SEC-REV-05 |
| C04 | Quarantine → scan → promote; server SHA-256; write-once originals; derivatives with parent hash; custody | M0 (quarantine + hash), M2 (scan, promote, derivatives, custody) | AC-M0-05, AC-M2-01…04, AC-M2-08 | SEC-HASH-01…03, SEC-UPL-01…04, SEC-OCR-02 |
| C05 | Export manifest with per-document hashes; manifest hash in audit | M5 | AC-M5-02, AC-M5-04 | SEC-HASH-04, SEC-EXP-03 |
| C06 | Consent purpose catalogue; per-dispute/per-grant scope; manual mode | M0 (framework), M3 (`ai_assistance`, manual mode), M4 (`share_reviewer`), M5 (`export`) | AC-M0-06, AC-M3-11 | SEC-LANG-04, consent unit tests, SEC-VEN-02 |
| C07 | Dispute-level need-to-know in organisation tenants; org_admin metadata-only | M1 | AC-M1-08 | SEC-TEN-05 |
| C08 | No standing platform content access; break-glass; support grants | M0 (break-glass), M4 (support grants) | AC-M0-09 | SEC-INS-01, SEC-INS-02 |
| C09 | Zero-tool AI tasks; deterministic retrieval before call | M3 | AC-M3-01, AC-M3-03 | SEC-INJ-01…05, SEC-VEN-02 |
| C10 | Communication outline (T0) | M3 (task/template), M5 (export profile) | AC-M3-10, AC-M5-01 | SEC-UNS-02, SEC-CIT-01…04 |
| C11 | Draft/review-gate model, T0 only enabled | M3 | AC-M3-10 | draft-gate unit tests; SEC-UNS-01 |
| C12 | Jurisdiction pack with policy flags, source registry, templates, two-person release | M3 | AC-M3-09 | SEC-STALE-02, pack release tests |
| C13 | Authority corpus separate, status/effective-dated, staleness | M3 | AC-M3-04, AC-M3-06 | SEC-CIT-01…04, SEC-STALE-01…03 |
| C14 | Single-dispute retrieval; canary ids | M2 (index, canaries), M6 (canary deletion probe) | AC-M2-05, AC-M6-02 | SEC-TEN-04, SEC-DEL-02 |
| C15 | Audit hash chain; extended catalogue; owner access-history view | M0 (chain), M4 (access history), all milestones (events) | AC-M0-04, AC-M4-07 | SEC-HASH-05, SEC-RLS-04 |
| C16 | Verified deletion; ledger replay; user status | M0 (skeleton), M6 (full) | AC-M0-07, AC-M6-01…07 | SEC-DEL-01…07, SEC-BKP-01…03 |
| C17 | India-region hosting; NTP-synced clocks | M0 (provisioning), M6 (backups), M7 (confirmation) | AC-M7-07 (SDAS §25 item 12) | SEC-ENV-01, configuration review |
| C18 | MFA for org owners and download-permitted reviewers | M0 (enrolment), M4 (enforcement) | AC-M4-08 | SEC-ATO-03 |
| C19 | RLS via two helper functions; schema lint in CI | M0 | AC-M0-01, AC-M0-03 | SEC-RLS-01…04, SEC-TEN-01…05 |

### 12.2 Product Spec user stories → milestone

| User story | Milestone | Acceptance criteria | Tests |
|---|---|---|---|
| US-01 Start from a story | M1 (manual), M3 (AI extraction) | AC-M1-01 | functional US-01 |
| US-02 Upload evidence | M2 | AC-M2-01, AC-M2-07 | SEC-UPL-*, SEC-TEN-03 |
| US-03 Confirm facts | M1, M3 | AC-M1-02, AC-M3-02 | SEC-MUT-* |
| US-04 Timeline | M1, M3 | AC-M1-04 | gold-set timeline |
| US-05 Evidence map | M1, M3 | AC-M1-06 (relations), AC-M3-03 | gold-set relations |
| US-06 Contradictions | M1, M3 | AC-M1-06, AC-M3-07 | SEC-INJ-02 |
| US-07 Gaps | M1, M3 | AC-M1-07 | functional US-07 |
| US-08 Verified information | M3 | AC-M3-04, AC-M3-06 | SEC-CIT-*, SEC-STALE-* |
| US-09 Action plan | M3 | AC-M3-05 | SEC-UNS-02 |
| US-10 Export | M5 | AC-M5-01…05 | SEC-EXP-* |
| US-11 Delete | M0 (skeleton), M6 | AC-M6-01…04 | SEC-DEL-* |
| US-12 Human review | M4 | AC-M4-01…09 | SEC-REV-* |

### 12.3 Ecosystem L1–L10 → enforcement

| Decision | Enforced by |
|---|---|
| L1 Dispute File platform, not marketplace | Scope exclusions in every milestone; copy review (M7) |
| L2 Reviewer seat, outline, manifest, purpose-bound shares | M4, M3, M5, M0/M4 |
| L3 Reject lead/success fees, paid placement, ratings, win rates, rankings | No tables, endpoints or UI for these in any milestone; copy review (M7) |
| L4 No send/sign/file/approve by NyayOS | `sendable=false`; no outbound channels for dispute content; AC-M3-10 |
| L5 No public criminal-matter drafting | Pack taxonomy excludes criminal drafting; private case only in `eval-private` |
| L6 Policy adapter owns regulatory rules | M3 pack; policy flags read by UI/workflow |
| L7 "Engagement request" terminology, client-initiated | Deferred (Phase 3); reserved enums only |
| L8 Advocate pricing independent of referrals | No billing for advocates in MVP |
| L9 India-first | IN-MP pack; India region |
| L10 Fee quotes block contingent structures | Deferred with fee-quote module |

---

## 13. Gate, threat and test coverage mappings

### 13.1 G-PILOT mapping (SDAS §21.12)

| G-PILOT gate (zero tolerance) | Tests | First enforced |
|---|---|---|
| Cross-tenant leakage 0 | SEC-TEN-01…05, SEC-RLS-01…02 | M0 / M1 |
| Reviewer out-of-scope reads 0 | SEC-REV-01…07 | M4 |
| Prompt-injection successes 0 | SEC-INJ-01…05 | M3 |
| Unresolved citations displayed 0 | SEC-CIT-01…04 | M3 |
| Unsupported high-impact claims 0 | SEC-UNS-01 | M3 |
| Invented deadlines 0 | SEC-UNS-02 | M3 |
| Silent mutations 0 | SEC-MUT-01…04 | M1 / M3 |
| Deletion-verification failures 0 | SEC-DEL-01…07 | M0 (skeleton) / M6 |
| Secrets in bundle 0 | SEC-SEC-01…02 | M0 |
| Production data outside production 0 | SEC-ENV-01…02 | M7 |
| Hash mismatches 0 | SEC-HASH-01…05 | M0 / M2 / M5 |

### 13.2 G-REL mapping

| G-REL check | When | Source |
|---|---|---|
| All G-PILOT tests re-run | every release after M7 | SDAS §21.12 |
| RLS/schema lint | every build from M0 | AC-M0-01 |
| Deletion allow-list registration | every build from M0 | AC-M0-07 |
| Backend security scan | after every schema change and before release | Architecture Review §6.3 |
| Dependency scan | after dependency change and before release | Architecture Review §6.3 |
| Staleness and pack status | before release that ships pack change | SEC-STALE-* |
| New regression tests from incidents | before next release | SDAS §20 |

### 13.3 Threat-model coverage (SDAS §16)

| Threat | Milestone(s) | Tests |
|---|---|---|
| T01 Cross-tenant leakage | M0, M1, M2 | SEC-TEN-01…05 |
| T02 Broken RLS | M0 | SEC-RLS-01…04 |
| T03 Reviewer overreach | M4 | SEC-REV-01…07 |
| T04 Insecure sharing links | M2 (URLs), M4 (invites) | SEC-URL-01…04 |
| T05 Export leakage | M5 | SEC-EXP-01…04 |
| T06 Prompt injection | M3, M4 | SEC-INJ-01…05 |
| T07 Malicious uploads | M0, M2 | SEC-UPL-01…04 |
| T08 OCR corruption | M2 | SEC-OCR-01…02 |
| T09 Fabricated citations | M3 | SEC-CIT-01…04 |
| T10 Stale law | M3 | SEC-STALE-01…03 |
| T11 Silent fact mutation | M1, M3, M4 | SEC-MUT-01…04 |
| T12 Privilege confusion | M4, M7 | SEC-PRIV-01 |
| T13 Account takeover | M0, M4 | SEC-ATO-01…03 |
| T14 Insider access | M0, M4 | SEC-INS-01…02 |
| T15 Secrets exposure | M0 | SEC-SEC-01…02 |
| T16 Deletion failure | M0, M6 | SEC-DEL-01…07 |
| T17 Backup leakage | M6 | SEC-BKP-01…03 |
| T18 Model-provider retention | M2, M3, M7 | SEC-VEN-01…02 |
| T19 Conflict-check disclosure | Deferred (Phase 3) | SEC-CFL-01 (reserved) |
| T20 Private case exposure/contamination | M7 | SEC-ENV-01…02 |

### 13.4 Security test coverage by milestone

| Test group | Introduced in | Runs in all later milestones |
|---|---|---|
| SEC-RLS, SEC-SEC, SEC-INS-02, SEC-ATO-01…02, SEC-DEL-06, SEC-HASH-05 | M0 | Yes |
| SEC-TEN-01, 05, SEC-MUT-02…03, SEC-LANG-01…02 | M1 | Yes |
| SEC-HASH-01…03, SEC-UPL, SEC-OCR, SEC-URL-01, SEC-TEN-03…04, SEC-LANG-03 | M2 | Yes |
| SEC-INJ-01…04, SEC-CIT, SEC-UNS, SEC-STALE, SEC-MUT-01, 04, SEC-VEN | M3 | Yes |
| SEC-REV, SEC-REVK, SEC-URL-02…04, SEC-ATO-03, SEC-INJ-05, SEC-INS-01, SEC-PRIV-01 | M4 | Yes |
| SEC-EXP, SEC-HASH-04, SEC-LANG-05 | M5 | Yes |
| SEC-DEL-01…05, 07, SEC-BKP | M6 | Yes |
| SEC-ENV | M7 | Yes |
| SEC-LANG-04, 06 | M0 | Yes |
| SEC-CFL-01 | Reserved | — |

---

## 14. Registers

### 14.1 Deferred architecture register

| ID | Item | Trigger | Owner |
|---|---|---|---|
| DA-01 | Per-dispute envelope encryption / crypto-shredding | Before organisation/enterprise tier or counsel requirement | Founder decision + Claude Code |
| DA-02 | Export manifest digital signing | Phase 2, when exports are relied on externally | Claude Code |
| DA-03 | Advocate workspace tenant + privilege partition | Phase 2 panels / T1 drafts | Architecture review required |
| DA-04 | Advocate verification pipeline | Phase 3 | After legal opinion |
| DA-05 | Engagement requests, conflict checks, fee quotes | Phase 3 | After legal opinion |
| DA-06 | Neutral/mediator grants | Phase 3 | After partner model |
| DA-07 | Institutional grants | Phase 3–4 | After partnership |
| DA-08 | T1/T2 draft enablement | Phase 2A/3 gates | Ecosystem Review §6 |
| DA-09 | Consent-manager integration | When the DPDP consent-manager framework is operational and relevant [LAW-R] | Counsel |
| DA-10 | Second jurisdiction pack | Phase 4 | Founder |
| DA-11 | SIEM-grade monitoring | Pilot scale | Claude Code |
| DA-12 | Automated inactivity purge | Counsel sets periods | Counsel + founder |

### 14.2 Open legal dependency register (from SDAS §24)

| ID | Question | Blocks | Status |
|---|---|---|---|
| OL-01 | Lawful basis for third-party personal data in evidence | M7 (pilot) | Open — counsel |
| OL-02 | Final retention periods (RC-ACT inactivity, RC-AUD, RC-CON, RC-ACC) | M6 config finalisation, M7 | Open — values [PROV] |
| OL-03 | Content-free hash tombstone after deletion | M6 | Open |
| OL-04 | DPDP Rules obligations by date for NyayOS | M7 | Open — dates [LAW-R] |
| OL-05 | CERT-In applicability, reportable categories, India-resident logs | M0 (config), M7 | Open — [LAW-R] |
| OL-06 | Legal-hold policy and disclosure constraints | M6 | Open |
| OL-07 | User notification on break-glass | M7 | Open |
| OL-08 | Electronic-evidence requirements and integrity wording | M5 | Open |
| OL-09 | Reviewer self-declared identity display vs Bar Council rules | M4 | Open |
| OL-10 | Confidentiality/privilege of pre-engagement reviewer sharing; warning wording | M4 | Open |
| OL-11 | Cross-border processing by OCR/LLM providers | M2, M3 | Open |
| OL-12 | Disputes involving minors (exclude in MVP?) | M1 (intake guard), M7 | Open |
| OL-13 | Special handling for private founder criminal matter | M7 (eval-private) | Open |
| OL-14 | Supreme Court draft AI regulations status [LAW-D] | Future T2 only | Monitor |

Rule: a milestone blocked by an open item may proceed on staging with synthetic data; it may not pass **G-PILOT** until the item is closed by counsel or has a dated founder risk acceptance (AC-M7-02).

### 14.3 Founder decision register

| ID | Decision | Needed before | Options / default |
|---|---|---|---|
| FD-01 | Authorise build (currently pre-build) | M0 | Authorise / hold pending 90-Day Plan G1–G2 |
| FD-02 | Hosting vendor plan and India region; backup/PITR capability | M0 | Canonical Supabase in India region (to confirm) |
| FD-03 | Providers: malware scan, OCR, LLM, embeddings (or stubs first) | M0 (scan stub), M2, M3 | Stubs in M0; decide by M2/M3 entry |
| FD-04 | Pilot cohort and size | M7 | 90-Day Plan: 10–25 users |
| FD-05 | Pricing test design (dispute-file fee first) | M7 | D-018 |
| FD-06 | Risk acceptance for any open OL item at pilot | M7 | Per item, dated |
| FD-07 | Named legal reviewer for pack sign-off | M3 | Practising advocate |
| FD-08 | IN-MP authority source list scope | M3 | Commercial + consumer sandbox sources only |
| FD-09 | Commission counsel on OL-01…OL-11 | Before M4 ideally | Founder-only act |
| FD-10 | MFA mandatory for all users vs owners/download reviewers only | M4 | Default: owners of org tenants + download reviewers |

---

## 15. Risks (build-level)

| ID | Risk | Mitigation |
|---|---|---|
| BR-01 | Building before validation (R25, R24): eight milestones consume time before WTP evidence | FD-01 gates on 90-Day Plan G1–G2; M1 manual mode enables early usability tests on staging |
| BR-02 | Legal dependencies unresolved at M7 | FD-09 early; risk-acceptance path; staging proceeds regardless |
| BR-03 | Provider capability gaps (India region, retention, OCR for Hindi) | Adapter pattern; FD-03 benchmark in M2 |
| BR-04 | AI quality below targets | Manual mode is a full product path; AI tasks individually flaggable |
| BR-05 | Schema churn across milestones | Canonical tables fixed in M1; later milestones add tables, not reshape |
| BR-06 | Edge runtime limits for OCR/scan | Asynchronous external providers via job queue (Product Spec §17) |
| BR-07 | Security suite becomes slow/brittle | Tag by milestone; run full suite on staging gate, focused suites per change |
| BR-08 | Scope creep toward marketplace features | Exclusions list; copy review; no reserved tables beyond enums |
| BR-09 | Single-writer model slows UX | Owner edits are auto-accepted proposals; batch accept for AI proposals with per-item audit |
| BR-10 | Founder bandwidth | One active milestone; gate reports standardised |

---

## 16. Assumptions

| ID | Assumption | Verify at |
|---|---|---|
| A-01 | Canonical stack remains TanStack Start + Supabase + pgvector | M0 |
| A-02 | Supabase (or chosen vendor) offers an India region for DB, storage and backups | FD-02 |
| A-03 | Vendor supports write-once enforcement via storage policies for originals | M0/M2 |
| A-04 | Vendor backup rotation window is configurable to the [PROV] target and restores can be made into isolated projects | M6 |
| A-05 | A Postgres-backed job table is sufficient for pilot-scale async processing | M2 |
| A-06 | Pilot AI cost fits per-dispute limits | M3 |
| A-07 | Professional reviewers will accept an account + OTP to view a snapshot | M4 usability |
| A-08 | Counsel can review OL-01…OL-11 before pilot | FD-09 |
| A-09 | Hindi OCR quality from the chosen provider is adequate for confirmation-based use | M2 benchmark |
| A-10 | No production users exist before M7; all rollback before M7 may use environment reset | Standing |

---

## 17. Final handoff to M365 Copilot

**Deliverable:** `NYAYOS_BUILD_BRIEF_V2.md` (this file).

**State:** NyayOS remains pre-build. This brief is an execution specification; it authorises nothing.

**What the continuity owner should record:**
1. Build Brief V2 supersedes Lovable Build Brief V1 for execution.
2. Execution order M0 → M7 is strict; one active milestone.
3. Traceability of C01–C19, US-01–US-12, L1–L10, G-PILOT, G-REL, T01–T20 is in §12–13.
4. Open items: FD-01…FD-10 (founder), OL-01…OL-14 (legal), A-01…A-10 (assumptions).
5. Next action is founder-only: FD-01 build authorisation (recommended after 90-Day Plan G1–G2 evidence), FD-02 hosting confirmation, FD-09 counsel engagement.
6. On FD-01 approval, the first and only active assignment is **Claude Code — M0 Foundation**, scoped exactly to §4, returning a gate report with evidence.

**Confirmation:** no code written, no repository work, no database writes, no commits, no deployment, no production access. No security or compliance claim is made.
