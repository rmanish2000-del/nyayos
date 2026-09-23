# NYAYOS GAP ANALYSIS V1

| Field | Value |
|---|---|
| Assignment | A-034 — Gap analysis of the repository against the validated backlog (WAVE_0, WAVE_1) |
| Repository | `rmanish2000-del/nyayos` (PRIVATE) |
| **Commit reviewed** | `afe4744077a9e6eafc0b9648541ca0cf32fbbb8b` on `feature/fma-foundation-v1` (PR #2, draft). `main` is at `6c6b478ffa1a811ba435d2891b0b3179a3a7043d` and does **not** contain `app/src/domain/`, `db/` or `scripts/db/`; where an item exists only on the branch this is stated. |
| Method | Read `README.md`, `NYAYOS_OPERATING_SYSTEM.md`, `NYAYOS_STATUS.json`; inventoried `app/`, `docs/`, `scripts/` (and `db/`, which the branch added) by `find`/`grep`; every claim cites a file and, where useful, a line. |
| Backlog source | `NYAYOS_PRODUCT_VALIDATION/NYAYOS_PRODUCT_BACKLOG_V1.md` and `NYAYOS_VALIDATED_REQUIREMENTS_V1.md` (status "Evidence-Validated", decision date 2026-09-20). Both were untracked at the time of analysis; **imported unchanged into `docs/product/` under A-035** (23 Sep 2026); their stated sources are two sanitised case handoffs in the same folder, which this analysis did **not** open (private-data rule). |
| Rules honoured | No feature designed, no architecture rewritten. Items are compared against the backlog's own definitions (Part B, first table). |
| Date | 23 September 2026 |
| Continuity owner | M365 Copilot |

**Standing statement.** Labels: **VERIFIED** = observed in the repository at the commit above; **SPECIFIED** = described in a canonical or supplied document but not built; **NOT PRESENT** = neither. Nothing here asserts that any feature runs in an environment; no backend, database or deployment exists (`NYAYOS_STATUS.json` → `database_status.label = "NOT IMPLEMENTED"`, `migration_summary.label = "NOT APPLICABLE"` for `main`).

---

## Part A — Inventory

### 1. Current feature inventory (VERIFIED)

| Feature | Where | Depth | Evidence |
|---|---|---|---|
| Design tokens, responsive shell, primitives (button, input, banner, chip, badges, progress) | `app/src/styles.css`, `app/src/components/nyayos/{app-shell,button,input-field,notification-banner,status-chip,source-badge,date-badge,confidence-band,readiness-indicator}.tsx` | UI, fixture-driven | 17 components listed in `NYAYOS_OPERATING_SYSTEM.md` §7; `app/README.md` |
| Fact Card with Confirm / Uncertain / Not relevant / Correct, previous value retained, correction reason, always-visible provenance strip | `fact-card.tsx`, `inline-correction-input.tsx`, `source-panel.tsx` | UI only (state in React) | `fact-card.tsx:101` (`previousValue` struck through); `inline-correction-input.tsx:91` |
| Evidence Card and S08/S09 workspace: upload validation (type, 10 MB), pasted text, cancel, lifecycle separated from category, document provenance (uploader, date, hash) | `evidence-card.tsx`, `evidence-workspace.tsx` | UI only; nothing stored | `evidence-card.tsx:26-36` (`EvidenceLifecycle`, `EvidenceCategory`, `DocumentProvenance.hash`) |
| Parties (S11) and Timeline (S12): add/confirm/edit/remove, five date precisions, conflict indicator, filters | `party-card.tsx`, `timeline-event-card.tsx`, `parties-timeline-workspace.tsx` | UI only | `timeline-event-card.tsx:16,51-59` (`conflict`) |
| Single showcase route | `app/src/routes/index.tsx` | Demonstration | `routes/README.md` |
| **Branch only:** FM-A domain foundation — identity, consent, authorisation, dispute core, single-writer proposals, evidence lifecycle, audit chain, export manifest, deletion lifecycle, bilingual copy | `app/src/domain/*.ts` (14 modules), `app/tests/domain/*.ts` (8 files) | Pure functions + schemas; no I/O | `app/src/domain/index.ts`; 137 tests (`NYAYOS_STATUS.json.feature_branches[0].verified` reports 132 before A-033; A-033 added 5 net) |
| **Branch only:** FM-A schema as a specification-grade migration, static lint, smoke suite, concurrency proof | `db/migrations/0001_fma_foundation.sql`, `scripts/db/schema-lint.mjs`, `db/tests/*` | Executed only on a throwaway local container; no environment | `db/README.md` |
| Governance automation: registry validate/generate, task-gate, dependency-check, status-update, schema-lint workflows | `scripts/governance/registry.mjs`, `.github/workflows/*.yml` | CI | `docs/founder/NYAYOS_CANONICAL_STATUS_RULES.md` |
| Print collateral: 13 HTML sources, 13 PDF + 13 PNG with checksummed manifest | `docs/print/` (42 files) | Static | `docs/print/NYAYOS_PRINT_EXPORT_MANIFEST.md` |

**Not present anywhere:** routes for any FM-A screen; server functions; auth provider; storage buckets; scan adapter; OCR; AI gateway; sharing; payments; any persistence.

### 2. Current architecture inventory

| Layer | State | Evidence |
|---|---|---|
| Frontend | TanStack Start · React 19 · Vite 8 · Tailwind v4 · Vitest; single route; fixtures in component state | `app/package.json`; `app/README.md` |
| Domain (branch) | Framework-agnostic TypeScript twin of the FM-A Scope Sheet §4 model: enums declared in full with FM-A-enabled subsets (CR-3), table registry and deletion allow-list (CR-4), server-built request context, `isDisputeMember`/`grantAllows` (CR-2), proposal → correction pipeline, upload state machine, hash-chained audit, manifest, deletion state machine | `app/src/domain/enums.ts`, `tables.ts`, `context.ts`, `authz.ts:29`, `proposal.ts`, `evidence.ts:227`, `audit.ts`, `export.ts`, `deletion.ts` |
| Schema (branch) | 39 tables in schema `nyayos`; RLS enabled **and forced** on every table; helpers `is_dispute_member`, `grant_allows`; server functions `sign_up_personal_tenant`, `create_dispute`, `propose_change`, `decide_proposal`, `request_deletion`, `log_audit_event`, `verify_audit_chain`; append-only triggers; allow-list seeded; migration self-check | `db/migrations/0001_fma_foundation.sql` (§0–§10) |
| Backend / runtime | **NOT PRESENT.** Decided stack (Supabase Postgres + Auth + Storage, server-side functions) is recorded as decision only | `NYAYOS_OPERATING_SYSTEM.md` §11 ("NOT IMPLEMENTED beyond the frontend foundation"); `NYAYOS_STATUS.json.database_status` |
| CI | task-gate (registry rules, private-data guard), dependency-check (typecheck/lint/test/build, no-deploy assertion), status-update, schema-lint | `.github/workflows/` |
| Documents | 87 files under `docs/` (founder 15, architecture 8, product 7, implementation 3, design 3, evaluation 2, handoffs 3, research 4, print 42) | `find docs -type f` |

### 3. Data model inventory (branch: `db/migrations/0001_fma_foundation.sql`; twin in `app/src/domain/tables.ts`)

| Family | Tables | Notes |
|---|---|---|
| Identity | `tenants`, `profiles`, `tenant_memberships`, `platform_roles`, `dispute_roles` | Roles never on profile rows; tenant type immutable (trigger) |
| Consent | `consents` (append-only), `notices` | Locked purposes rejected by CHECK |
| Dispute core (canonical, single-writer) | `disputes`, `dispute_statements`, `intake_questions`, `entities`, `entity_source_forms`, `events`, `date_assertions`, `propositions`, `evidence_items`, `evidence_relations`, `contradictions`, `missing_evidence`, `issues`, `next_steps` | No authenticated INSERT/UPDATE/DELETE grant; every canonical row carries `origin_type`, `source_ref`, `confidence`, `verification_status`, `version` |
| Single-writer | `proposals`, `user_corrections` | `unique (target_type, target_id, resulting_version)` (`0001:454`) |
| Evidence | `quarantine_uploads`, `documents`, `document_versions` (`unique (document_id, version)`, `0001:507`), `document_locations`, `annotations`, `custody_events`, `jobs` | Write-once versions (forbid trigger) |
| Export | `exports`, `export_manifests` | Manifest hash written to audit |
| Audit | `audit_events` (hash-chained, `pg_advisory_xact_lock`, `0001:760`), `audit_anchors` | No UPDATE/DELETE for any role |
| Deletion | `deletion_requests`, `deletion_ledger` (content-free tombstone), `retention_records`, `deletion_allowlist` | Worker purge path not yet granted (A-032 M-3, open) |
| Config | `config_provisional` | [PROV] values as data |

On `main`: **no data model exists** (`NYAYOS_STATUS.json.database_status.schema = null`). Component prop types on `main` (`FactSource`, `DocumentProvenance`, `DatePrecision`, `StatusKind`, `SourceKind`) are the only typed vocabulary.

### 4. Existing provenance-related functionality

| Capability | Status | Evidence |
|---|---|---|
| Per-fact source display: kind (`document-fact` / `ai-extraction` / `unverified-claim` / `user-correction`), origin, locator, verbatim excerpt, confidence band, date precision | VERIFIED (UI, `main`) | `source-panel.tsx:9` (`FactSource`), `source-badge.tsx:17-27` (`SourceKind`), A-021/A-022 conformance reviews |
| Document provenance on evidence cards: uploaded by, upload date, hash | VERIFIED (UI, `main`) | `evidence-card.tsx:33-36` |
| Provenance contract on every canonical item: `originType` ∈ {user_statement, document_extraction, user_inference, ai_extraction(reserved)}, `sourceRef` discriminated union (statement / document+version+location / user_entry), `confidence` band, `recordedBy`, `recordedAt` | VERIFIED (domain, branch) | `dispute.ts:35-58` (`SourceRef`, `Provenance`, `isProvenanceComplete`) |
| Provenance shape enforced in the database (CHECK on 11 tables), AI origin locked off (CHECK on 10 tables), identity fields server-set | VERIFIED (SQL, branch) | `0001:872-875`; smoke `M4_*` (7 checks) |
| Export excludes items with incomplete provenance and lists them as omissions | VERIFIED (domain, branch) | `export.ts` (`buildExportManifest`), `export-deletion.test.ts` |
| Provenance for OCR/AI-derived content | NOT PRESENT (no OCR, no AI) | `NYAYOS_FM_A_SCOPE_SHEET_V1.md` §1.2 |

### 5. Existing audit / provenance tables

| Table | Purpose | Status | Evidence |
|---|---|---|---|
| `audit_events` | Append-only hash chain: `prev_hash`, `row_hash`, allow-listed metadata, no content; serialised writers | VERIFIED (branch) | `0001:572`, trigger `tg_audit_before_insert`; `db/tests/audit_concurrency_0001.sh` PASS; A-032 M-2 (TS/SQL hash non-interoperability) **open** |
| `audit_anchors` | Weekly manual anchor of the chain head | VERIFIED (branch, table only) | `0001` §3.6 |
| `custody_events` | Per-document chain of custody (ingested/scanned/quarantined/promoted/viewed/exported/replaced/deletion) | VERIFIED (branch, table + enum); no writer yet | `0001:529`; `evidence.ts` `CUSTODY_EVENTS` |
| `user_corrections` | Every canonical change with previous/new value, reason, actor, originating proposal, resulting version | VERIFIED (branch) | `0001:441-454`; `proposal.ts:53` |
| `entity_source_forms` | Every spelling/script of a party with its source and first-seen time | VERIFIED (branch, table + schema); no UI | `0001:262`; `dispute.ts:181` |
| `export_manifests` | Document hashes, item versions, provenance pointers, omissions | VERIFIED (branch) | `0001` §3.6; `export.ts` |
| `deletion_ledger` | Content-free tombstones | VERIFIED (branch) | `deletion.ts` |
| On `main` | **none** | — | `NYAYOS_STATUS.json` |

### 6. Existing document-processing functionality

| Capability | Status | Evidence |
|---|---|---|
| Client-side upload validation (extension list, 10 MB), pasted text, progress, cancel, lifecycle chips | VERIFIED (UI, `main`); nothing transmitted or stored | `evidence-workspace.tsx`; `tests/evidence.test.tsx` |
| Magic-byte MIME sniffing (PDF, JPEG, PNG, text; executables and Office/zip detected), acceptance rules (size, page cap, DOCX disabled by flag, declared/sniffed mismatch) | VERIFIED (domain, branch) | `evidence.ts:148,175`; `evidence.test.ts` |
| Upload state machine received → quarantined → scanning → clean → promoted; no promotion without a clean verdict; unavailable scan stays quarantined | VERIFIED (domain, branch) | `evidence.ts:227`; `evidence.test.ts` |
| Server SHA-256 of originals; write-once versions; replacement creates a new version | VERIFIED (domain + SQL, branch) | `evidence.ts:135,280,305`; `0001:492-507`, forbid trigger |
| Malware scan adapter, storage buckets, signed URLs, viewer, page rendering | NOT PRESENT (functions A09–A15 not written) | A-030 gap report §5 |
| OCR, derivatives, chunking, embeddings, retrieval | NOT PRESENT and **out of FM-A scope by decision** (FM-D) | `NYAYOS_FM_A_SCOPE_SHEET_V1.md` §3.1 |

### 7. Existing chronology functionality

| Capability | Status | Evidence |
|---|---|---|
| Timeline cards with five date precisions (exact / approximate / inferred / conflicting / unknown-date), source reference on every event, explicit "dates disagree" indicator, filters by certainty | VERIFIED (UI, `main`) | `date-badge.tsx:12`; `timeline-event-card.tsx:16,51-59`; A-026 |
| `DateAssertion` with precision enum; `markConflictingDates` keeps both values and marks both `conflicting`, never auto-resolves | VERIFIED (domain, branch) | `dispute.ts:198,212`; `dispute.test.ts` |
| `date_assertions` table: user-entered value, precision, provenance; no system-generated dates | VERIFIED (SQL, branch) | `0001:287` |
| Ordering/sorting service, "undated facts" list, deadline logic | NOT PRESENT (deadlines excluded by design) | Scope Sheet §3.3; `copy.ts` `PROHIBITED_TERMS` |

### 8. Existing contradiction functionality

| Capability | Status | Evidence |
|---|---|---|
| Fact Card `contradiction` status styling; timeline conflict indicator | VERIFIED (UI, `main`) | `fact-card.tsx:77`; `timeline-event-card.tsx:51-59` |
| `Contradiction` schema: two item references, field, neutral description, status open/reviewed/resolved_by_user; **no field can record a "true" side**; `validateContradiction` rejects same-item pairs and non-neutral wording | VERIFIED (domain, branch) | `dispute.ts:268-296`; `dispute.test.ts` |
| `contradictions` table with CHECK that the two references differ | VERIFIED (SQL, branch) | `0001:351` |
| Contradiction-specific Fact Card actions (A-021 item 4), U12 screen, automatic detection | NOT PRESENT (detection excluded: contradictions are user-flagged, F13) | `app/roadmap.md` open items; Scope Sheet F13 |

### 9. Existing case-isolation functionality

| Capability | Status | Evidence |
|---|---|---|
| Tenant boundary checked before any dispute role; deny-by-default decisions with named reasons; `grantAllows` always false | VERIFIED (domain, branch) | `authz.ts:29`; `authz.test.ts` (11) |
| RLS enabled and forced on 39/39 tables; helpers `is_dispute_member`, `is_tenant_member`; policies written only in terms of helpers; `tenant_id` immutable trigger; no client-supplied tenant id | VERIFIED (SQL, branch; executed on a throwaway container) | `0001` §7; smoke `B_*`, `anon_denied`, `all_tables_forced_rls` |
| Per-dispute isolation within a tenant: dispute roles; `decide_proposal` checks target row belongs to the proposal's dispute | VERIFIED (branch) | `0001` `decide_proposal` (`where id = $1 and dispute_id = $2`) |
| Storage path convention `<tenant>/<dispute>/<document>/<version>` | VERIFIED as convention only | `evidence.ts:77` |
| Evidence item may reference a document of another dispute in the same tenant (FK only) | GAP — A-032 m-3 open | A-032 report §2 |
| On `main` | **none** | — |

### 10. Existing versioning functionality

| Capability | Status | Evidence |
|---|---|---|
| Fact versions: `version` on every canonical row, incremented only by an accepted proposal; `FactVersion` chain rebuilt from `user_corrections`; gap detection; `reconcileHistory` (every version explained by exactly one correction) | VERIFIED (domain + SQL, branch) | `proposal.ts:270,300`; `0001:454` |
| Document versions: `document_versions(document_id, version)` unique, write-once, replacement = new row | VERIFIED (branch) | `0001:492-507`; `evidence.ts:280` |
| Notice versions (hi/en share a version id); export version | VERIFIED (branch, schema) | `consent.ts:43`; `export.ts` |
| UI: previous value shown struck through on correction | VERIFIED (UI, `main`) | `fact-card.tsx:101` |
| Version *families* across documents (re-uploads, scans of the same paper), diff between versions | NOT PRESENT | — |

---

## Part B — Comparison against the validated backlog

**Backlog definitions** (verbatim substance from `NYAYOS_PRODUCT_BACKLOG_V1.md`) and how each maps onto repository vocabulary:

| Backlog item | Backlog definition | Repository vocabulary it maps to |
|---|---|---|
| Provenance Engine | Every proposition linked to source; source types Original · Founder · Third Party · Generated · AI Analysis | `Provenance.originType` ∈ {user_statement, document_extraction, user_inference, ai_extraction}; `SourceRef` ∈ {statement, document+version+location, user_entry}. No "who supplied it" dimension (Founder vs Third Party) and no "Generated" origin exist |
| Generated Content Firewall | Generated content cannot become evidence; generated content visually marked | Proposal-only write path; `ai`/`reviewer` origins refused; `ai_extraction` locked by CHECK; UI `SourceKind = "ai-extraction"` badge. **No "generated content" object class exists**, so nothing can yet be marked or blocked |
| Contradiction Registry | Date conflicts · Amount conflicts · Role conflicts · Version conflicts | `contradictions(item_a, item_b, field, description, status)`; `markConflictingDates` for dates. No typed conflict categories; no amount/role/version detection |
| Missing Material Registry | Referenced but absent · inaccessible · unreadable | `missing_evidence(expected_item, reason, related_ref, user_response)`; `reason` is free text, not the three categories |
| Stable Document IDs | Permanent internal IDs; annexure changes do not affect IDs | `documents.id` (uuid) is permanent; `display_label` is mutable and separate; versions hang off the id; storage paths use ids, never names |
| Case Isolation Layer | No cross-case retrieval by default; separate indexes | RLS per tenant + per dispute; helper-only policies; no retrieval index exists yet, so "separate indexes" has nothing to separate |
| Correction Propagation | Update downstream outputs automatically | Nothing walks dependants of a corrected item. Note the product rule "no silent overwrite" (Deck slide 9; single-writer S3): propagation in this codebase can only mean re-flagging dependants through the proposal path, not silent rewriting |
| Stale Output Detection | Detect outputs invalidated by newer evidence | `export_manifests.entries` record item and document versions; no comparison against current versions exists |
| Duplicate Detection | (WAVE_1, undefined beyond the name) | Server SHA-256 per version exists; no lookup across documents |
| Version Family Tracking | (WAVE_1, undefined) | Per-document version chain and per-fact correction chain exist; no grouping of separate documents |
| Entity Variant Management | (WAVE_1, undefined) | `entity_source_forms` + "never merged automatically" rule; no review screen, no comparison |
| Date Precision Framework | (WAVE_1, undefined) | Five precision states in UI, domain and schema; conflicts preserved |
| OCR Confidence Scoring | (WAVE_1, undefined) | No OCR; `confidence` band exists on items; `document_derivatives` deliberately not created in FM-A |

The backlog's **product principle** orders priorities Privacy → Case Isolation → Provenance → Contradiction Detection → Missing Material Discovery → Correction Propagation → User Efficiency; the sequence in this document follows that order where dependencies allow.

### ALREADY_EXISTS

| Item | Wave | What exists | Where | Caveat |
|---|---|---|---|---|
| **Case Isolation** | 0 | Tenant-first deny-by-default authorisation; RLS enabled and forced on every table; helper-only policies; immutable `tenant_id`; cross-tenant reads return zero rows and cross-tenant writes are denied (executed proof) | `app/src/domain/authz.ts`; `db/migrations/0001_fma_foundation.sql` §4, §7; `db/tests/smoke_0001.sql` | Branch only; not on `main`; no live environment. Intra-tenant cross-dispute document reference (A-032 m-3) open |
| **Date Precision Framework** | 1 | Five precision states in UI and domain; conflicting dates preserved and marked, never resolved; table column `precision`; no system-generated dates | `date-badge.tsx:12`; `dispute.ts:198-212`; `0001:287` | UI on `main`; storage on branch |
| **Stable Document IDs** | 0 | `documents.id` is a permanent uuid; the user-facing `display_label` is a separate mutable column, so relabelling or re-numbering an annexure never touches the id; `document_versions` hang off the id with `unique (document_id, version)`; storage paths and manifest entries reference ids, never names | `0001:477-507`; `evidence.ts:63,77`; `export.ts` (`documentId@version`) | Schema and domain only (branch); no runtime yet. No content-addressing lookup by hash (covered under Duplicate Detection) |

### PARTIALLY_EXISTS

| Item | Wave | What exists | What is missing | Where |
|---|---|---|---|---|
| **Provenance Engine** | 0 | Provenance contract on every canonical item; shape enforced by CHECK; `isProvenanceComplete`; manifest omissions for incomplete chains; UI source panel | The backlog's source taxonomy is not modelled: there is no **Founder vs Third Party** supplier dimension and no **Generated** origin; no server function writes provenance from a real document location yet (A16 not built); audit is not written in the same transaction as the fact (A-032 M-7 open); TS/SQL audit hashes not interoperable (M-2 open) | `dispute.ts:35-58`; `enums.ts` `ITEM_ORIGIN_TYPES`; `0001:872-875`; A-032 §2 |
| **Generated Content Firewall** | 0 | The seam: proposals are the only write path; `ai`/`reviewer` proposal origins refused; `ai_extraction` item origin refused by function and CHECK; UI already renders an `ai-extraction` badge distinct from `document-fact` | **No "generated content" class exists** (no generated document, summary or derivative object), so nothing can be marked generated or blocked from becoming an `evidence_item`; the firewall has never been exercised because FM-A produces no generated content | `proposal.ts` (`FMA_ENABLED_PROPOSAL_ORIGINS`); `0001` `*_fma_origin_inert`; `source-badge.tsx:17-27` |
| **Contradiction Registry** | 0 | `contradictions` table and schema with two references, neutral description, status lifecycle, no "true side" field; validation | No typed conflict categories (date / amount / role / version) — `field` is free text; only date conflicts are detected (`markConflictingDates`); no U12 screen; no A18 `flagContradiction`; no contradiction-specific Fact Card actions (A-021 item 4) | `dispute.ts:268-296`; `0001:351`; `app/roadmap.md` |
| **Missing Material Registry** | 0 | `missing_evidence` table and schema: expected item, reason, related reference, user response; copy rule "no negative inference" | The three backlog categories (absent / inaccessible / unreadable) are not enumerated — `reason` is free text; no U13 screen; no API; no link from a document's mention beyond `relatedRef` | `dispute.ts:296`; `0001:373`; `copy.ts` |
| **Entity Variant Management** | 1 | `entity_source_forms` table and schema (form text, source, first seen); rule "similar names are never merged automatically" in copy and tests; Party Card confirm/edit | No duplicate-review screen (Scope Sheet U10 state); no similarity or script-variant comparison; no merge-as-explicit-action function | `dispute.ts:181`; `0001:262`; `copy.ts` `no_auto_merge`; `party-card.tsx` |
| **Version Family Tracking** | 1 | Per-document version chain (`document_versions`), per-fact version chain (`user_corrections`), replacement flow | No grouping of *separate* documents into a family (re-upload as a new document, scan of the same paper); no diff between versions; no UI | `evidence.ts:280`; `proposal.ts:270`; `0001:454,507` |

### MISSING

| Item | Wave | Evidence of absence | Nearest existing seam |
|---|---|---|---|
| **Correction Propagation** | 0 | `decideProposal` updates one target row and writes one correction; nothing walks `evidence_relations`, `date_assertions` or `exports` that reference the corrected item (`proposal.ts`, `0001` `decide_proposal`). No test covers a dependent artefact. The backlog says "automatically"; the repository's single-writer rule forbids silent rewriting, so the achievable form is automatic **re-flagging** of dependants (see Risks) | `ItemRef` references on `evidence_relations`, `date_assertions.target_id`, `contradictions`, `issues.supporting_refs`; `referenceCheck` in `deletion.ts` already enumerates references for deletion and could be reused for reads |
| **Stale Output Detection** | 0 | Exports record `manifest_sha256` and item versions, but nothing compares an export's recorded versions with current versions; no "stale" state on `exports`; the only "stale" concept in the specs is authority-source staleness (SDAS §12), which is out of FM-A scope | `export_manifests.entries` already store item `version` and document `version`; a comparison against `user_corrections.resulting_version` is data-complete |
| **Duplicate Detection** | 1 | No uniqueness or lookup on `document_versions.sha256` across documents; no near-duplicate logic; `acceptUpload` does not consult existing hashes (`evidence.ts:175`) | Every version already carries a server-computed SHA-256; a `(tenant_id, sha256)` lookup is data-complete |
| **OCR Confidence Scoring** | 1 | No OCR exists (excluded from FM-A, FM-D deferred); `confidence` band exists on canonical items and in UI, but no derivative table (`document_derivatives` is in `NOT_CREATED_IN_FMA`, `tables.ts`) | `CONFIDENCE_BANDS` enum; Build Brief V2 §5 specifies `document_derivatives.confidence_band` (SPECIFIED, not built) |

### IMPLEMENTATION_SEQUENCE

Ordered by dependency, not by preference. Each step names only existing seams; nothing new is designed here.

1. **Merge the foundation** (PR #2 after the two leftover A-032 items) — every backlog item below builds on `app/src/domain` and `db/migrations/0001`, which are not on `main`.
2. **Case Isolation — close the intra-tenant gap** (A-032 m-3 composite FK) and stand up the staging database (FD-02) so isolation is proven live rather than on a throwaway container.
3. **Provenance Engine — complete the write path**: A16 `addLocation`/`annotate` and the audit-atomicity decision (D-031), because Contradiction, Missing Material and Correction Propagation all consume provenance references.
4. **Contradiction Registry and Missing Material Registry — expose what exists**: server functions A18 and the U12/U13 screens over the tables already created; no schema change.
5. **Stable Document IDs — add the hash lookup** on `document_versions.sha256` scoped to tenant; this is also the whole of **Duplicate Detection** at hash level (Wave 1) and costs one index plus one check in `acceptUpload`.
6. **Stale Output Detection**: compare `export_manifests.entries[].version` with current `user_corrections.resulting_version`/`document_versions.version` at read time; store the result as a flag on the export view (no new table needed).
7. **Correction Propagation**: reuse the reference enumeration pattern in `deletion.ts` `referenceCheck` to list dependants of a corrected item and mark them `verificationStatus = "pending"` through the existing proposal path (single-writer preserved).
8. **Date Precision Framework — wire UI to storage** (U09 timeline to `date_assertions`); already complete as a framework.
9. **Entity Variant Management**: U10 duplicate-review screen over `entity_source_forms`; explicit-merge as a proposal; script-variant comparison is a later addition.
10. **Version Family Tracking**: a family key on `documents` (or a link table) is a schema addition and therefore a new migration `0002` after merge; sequence after duplicate detection because hash matches feed family grouping.
11. **OCR Confidence Scoring**: blocked on FM-D (OCR itself); `document_derivatives` per Build Brief V2 §5 when created.

### LOWEST_EFFORT_HIGHEST_VALUE_ITEMS

| Rank | Item | Why low effort | Why high value | Effort basis |
|---|---|---|---|---|
| 1 | **Duplicate Detection (hash level)** + **Stable Document ID lookup** | SHA-256 already computed and stored per version; one index and one query in `acceptUpload`; smoke check trivial | Prevents the same evidence entering twice under two ids, which would poison provenance, manifests and deletion scope | `evidence.ts:135,175`; `0001:492-507` |
| 2 | **Stale Output Detection** | All inputs already recorded (`export_manifests.entries` versions vs current versions); pure read-side comparison; TS function + test | Honest exports are the FM-A product promise (F16, AC-M5-02); staleness is the failure users would meet first | `export.ts`; `proposal.ts:300` (`reconcileHistory` is the same shape of check) |
| 3 | **Contradiction Registry and Missing Material Registry surfacing** | Tables, schemas, validation and copy exist; needs server functions and two screens | Turns stored rows into the user-facing "Information to review" and "What may still be useful" (U12, U13); no data-model risk | `dispute.ts:268-310`; `0001:351,373` |
| 4 | **Correction Propagation (flag-only)** | Reference enumeration pattern exists in `deletion.ts`; marking dependants `pending` uses the existing single-writer path | Prevents silently stale relations and timeline entries after a correction; cheap flag-only version defers any automatic rewrite (which the product rules forbid anyway) | `deletion.ts` `referenceCheck`; `proposal.ts` |
| 5 | **Entity variant review screen** | `entity_source_forms` and the no-auto-merge rule exist; one screen | Directly required by AC-M1-05 / SEC-LANG-02 and by U10 | `dispute.ts:181`; Scope Sheet U10 |

Items **not** low effort: Version Family Tracking (schema change after merge), OCR Confidence Scoring (blocked on OCR, FM-D), audit atomicity (design decision D-031).

*Aside (outside the requested comparison):* two WAVE_2 items already have seams — Page-Level Anchoring (`document_locations`, `dispute.ts` `SourceRef.locationId`) and Bilingual UX (`copy.ts` hi/en, `notices` versioned per language).

---

## Part C — Return values

### File paths inspected (primary)

`README.md` · `NYAYOS_OPERATING_SYSTEM.md` · `NYAYOS_STATUS.json` · `app/src/components/nyayos/*.tsx` (17) · `app/src/domain/*.ts` (14) · `app/tests/**` (12 files) · `db/migrations/0001_fma_foundation.sql` · `db/tests/smoke_0001.sql` · `db/tests/audit_concurrency_0001.sh` · `db/README.md` · `scripts/governance/registry.mjs` · `scripts/db/schema-lint.mjs` · `docs/implementation/NYAYOS_FM_A_SCOPE_SHEET_V1.md` · `docs/implementation/NYAYOS_BUILD_BRIEF_V2.md` · `docs/architecture/NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md` · `docs/architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md` · `docs/architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md` · `app/roadmap.md`.

### Evidence

Cited inline per row (file:line, test name or smoke check). Test and check counts: Vitest 137/137, smoke 54/54 and concurrency proof PASS at `afe4744` (`db/README.md`; `NYAYOS_STATUS.json.feature_branches`). All SQL evidence was produced on a throwaway local container; no environment exists.

### Commit SHA reviewed

`afe4744077a9e6eafc0b9648541ca0cf32fbbb8b` (`feature/fma-foundation-v1`). `main` = `6c6b478ffa1a811ba435d2891b0b3179a3a7043d`, which contains the UI inventory (§1 rows 1–5, §4 row 1–2, §7 row 1, §8 row 1, §10 row 4) and **none** of the domain, schema or isolation items.

### Assumptions

1. The validated backlog was read from `NYAYOS_PRODUCT_VALIDATION/NYAYOS_PRODUCT_BACKLOG_V1.md` and `NYAYOS_VALIDATED_REQUIREMENTS_V1.md`, which appeared **untracked** in the working copy during this analysis. They are not committed, not registered and not yet canonical; WAVE_1 items carry names only, so their rows use the repository's nearest vocabulary. The two sanitised case handoffs the backlog cites were not opened.
2. Branch content counts as "existing" for this analysis because the founder scoped the request to the repository, not to `main`; each branch-only row is marked.
3. "Generated content" follows the backlog (Generated and AI Analysis source types). In FM-A none exists, so the firewall is judged PARTIAL: the seam exists, the object class does not.
4. "Case" is read as the Scope Sheet's *dispute* within a *tenant*; the Deck's *matter* is the same object.
5. Effort rankings are relative and qualitative; no day estimates are given (Scope Sheet forbids implementation claims).

### Risks

| Risk | Effect on this analysis |
|---|---|
| PR #2 not merged | Everything in ALREADY_EXISTS except the Date Precision UI is on a branch; if the branch is abandoned, WAVE_0 is almost entirely MISSING on `main` |
| Open A-032 majors (M-2 audit hash interoperability, M-3 no purge path, M-6 deletion enumeration, M-7 audit atomicity) | Provenance Engine and Stable Document IDs are PARTIAL rather than EXISTS partly because of these; they are design decisions D-031…D-034, not backlog items |
| No environment (FD-02 undecided) | Every "VERIFIED (SQL)" row was verified on a throwaway container; live RLS and isolation behaviour on the chosen provider is unproven |
| Backlog vocabulary vs repository vocabulary | The backlog's provenance taxonomy (Original / Founder / Third Party / Generated / AI Analysis) and its typed conflict and missing-material categories are not the repository's enums; adopting them is a data-model decision, not a gap fill |
| Backlog not in the repository | `NYAYOS_PRODUCT_VALIDATION/` is untracked and sits beside two sanitised case handoffs; importing it needs a founder decision under the private-data rules (CONTRIBUTING §2) and a registry entry before any task may cite it as an input |
| "Automatically" in Correction Propagation | Conflicts with the no-silent-overwrite invariant (single-writer S3, Deck slide 9). Needs a founder reading before implementation: re-flag dependants (compatible) or rewrite them (not compatible) |
| Figma FM-A package still absent (A-008) | Every screen-dependent PARTIAL item (contradictions, gaps, entity review) waits on design input or a founder decision to proceed from canonical copy |
| OCR out of FM-A scope | OCR Confidence Scoring cannot move before FM-D regardless of effort |
