# NYAYOS FM-A U01–U21 Traceability Addendum V1

| | |
|---|---|
| **Assignment** | A-041 — U01–U21 Documentation Addendum and Final A-032 Closure |
| **Closes** | A-032 Major finding **M-8** (two conflicting U01–U21 numberings; no cross-map; deck requirements not reconciled) |
| **Baseline** | `495d1fd956ab68f2d92fb30c8559f1d2a2664b05` on `feature/fma-foundation-v1` (draft PR #2) |
| **Date** | 26 September 2026 |
| **Kind** | Documentation only. No application code, SQL, migration or test was changed to produce this addendum |
| **Authority** | Tier 7 maintainer view. It **defers** to the [FM-A Scope Sheet V1](../implementation/NYAYOS_FM_A_SCOPE_SHEET_V1.md) for screen IDs and scope, and to the [Security & Data Architecture Spec V1](../architecture/NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md) for security behaviour. It changes neither |

---

## 1. Source precedence and method

1. **The Scope Sheet controls screen IDs and product scope.** Its §6 UI matrix defines U01–U21. Every other numbering in this repository is cross-mapped to it in §5 and never adopted silently.
2. **The Security & Data Architecture Spec controls security behaviour.** Security controls below cite S-numbers (Scope Sheet §7) and SEC tests.
3. **Repository code controls implementation status.** Every status in §3 was set by reading the files cited, at the baseline commit.
4. **Figma and PowerPoint material is design evidence only.** The [FM-A Product & User Flow deck text extract](NYAYOS_FMA_PRODUCT_USER_FLOW_DECK_V1_TEXT.md) and the [Figma Brief V2](../design/NYAYOS_FIGMA_BRIEF_V2.md) describe intent. They never make a screen implemented.
5. **The Figma FM-A prototype package does not exist in the repository.** A-030 searched for it and recorded it as not supplied ([assessment](../architecture/NYAYOS_FMA_REPOSITORY_ASSESSMENT_A030.md), [gap report §4](../architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md)). A-008 is still open. No Figma source code or source manifest was available to this assignment, so no screen has Figma prototype evidence.

## 2. Status values and evidence layers

Only these six status values are used.

| Status | Meaning in this addendum |
|---|---|
| **READY** | The complete user-visible behaviour and every required supporting function exist and are evidenced end to end. **No screen qualifies at the baseline** |
| **PARTIAL** | A NyayOS component renders part or all of the screen's required content or states, but it runs on local mock or synthetic data and is not wired to a server function or the database (A-048: A-043 screens use the domain layer's types and copy, so "domain" was dropped from this definition) |
| **MISSING** | No NyayOS component renders any of the screen's required content or states, even where domain or database foundations exist |
| **DEFERRED** | Deliberately postponed by the Scope Sheet or a founder decision (used for sub-elements, e.g. a feature flag that is off in FM-A) |
| **NOT APPLICABLE** | The item does not belong to FM-A (used in the cross-map for out-of-scope material) |
| **UNVERIFIED** | Asserted by a source that could not be checked in the repository (used for design evidence that was never supplied) |

Each screen also records the **furthest layer reached**:

| Layer | What exists | Where |
|---|---|---|
| **Prototype only** | A React component with hard-coded sample state (`INITIAL_EVIDENCE`, `INITIAL_PARTIES`, `INITIAL_EVENTS`) shown on the design-system showcase route | `app/src/components/nyayos/`, `app/src/routes/index.tsx` |
| **Domain foundation** | Framework-agnostic TypeScript types, pure functions and bilingual copy, unit-tested | `app/src/domain/` |
| **Database foundation** | Tables, row-level security, grants and SQL functions, executed only on disposable local PostgreSQL containers | `db/migrations/` (`0001`–`0007`) |
| **Missing server integration** | No server function, auth provider, storage bucket or scan adapter exists. The only server entry is the TanStack error wrapper `app/src/server.ts`; the app has no route other than the showcase | — |
| **Production-ready behaviour** | **None.** No environment exists, no migration has been applied anywhere, and nothing is deployed | — |

Facts that apply to every screen and are not repeated below:

- **Routes.** The app has two routes: `app/src/routes/__root.tsx` and `app/src/routes/index.tsx`. The index route is the "NyayOS Foundation — Design System & Components" showcase. It is not a U-screen.
- **Components and the domain.** No NyayOS component reads the database. Only `app/src/components/nyayos/stale-output-notice.tsx` imports the domain layer.
- **Server API.** None of the Scope Sheet §5 API rows A01–A28 exists as an application server function. Some exist as SQL functions and are cited per screen.
- **Hindi copy.** Hindi strings are working translations pending native review (A-032 m-11).

---

## 3. Canonical matrix U01–U21

Each canonical screen appears exactly once. Titles are the Scope Sheet §6 titles.

| ID | Screen (Scope Sheet §6) | Status | Furthest layer reached | Primary repository evidence |
|---|---|---|---|---|
| U01 | Sign-up / sign-in / OTP | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/login-screen.tsx`; `identity.ts`; `sign_up_personal_tenant` |
| U02 | Consent notice | MISSING | Domain + database foundation | `consent.ts`; `consents` RLS |
| U03 | Dashboard | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/dispute-list-screen.tsx`; `dispute.ts`; `disputes_select_member` |
| U04 | New dispute — "What happened?" | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/what-happened-screen.tsx`; `create_dispute`; `what_happened_*` copy |
| U05 | Intake | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/intake-screen.tsx`; `nextQuestion`; `intake_questions` |
| U06 | Evidence locker | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/evidence-locker-screen.tsx`; `evidence-workspace.tsx`; `evidence.ts`; `find_duplicate_versions` |
| U07 | Document viewer (with manual fact linking) | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/document-viewer-screen.tsx`; `DocumentLocation`; `document_locations` |
| U08 | Fact list / confirmation | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/fact-review-screen.tsx`; `fact-card.tsx`; `proposal.ts`; `propose_change` / `decide_proposal` |
| U09 | Timeline | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/timeline-screen.tsx`; `timeline-event-card.tsx`; `DateAssertion` |
| U10 | Parties | PARTIAL | Prototype + domain + database foundation | `party-card.tsx`; `EntitySourceForm` |
| U11 | Evidence map | MISSING | Domain + database foundation | `validateEvidenceRelation`; `evidence_relations` |
| U12 | Information to review (contradictions) | MISSING | Domain + database foundation | `validateContradiction`; `contradictions` |
| U13 | What may still be useful (gaps) | MISSING | Domain + database foundation | `MissingEvidence`; `missing_evidence` |
| U14 | File label (issue) | MISSING | Domain + database foundation | `Issue`; `issue_label_disclaimer` |
| U15 | Next steps (user-entered) | MISSING | Domain + database foundation | `NextStep`; `next_step_date_label` |
| U16 | Export preview / privacy check | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/export-screens.tsx`; `buildExportManifest`; `EXPORT_SECTIONS` |
| U17 | Export result and integrity manifest | PARTIAL | A-043 UI on synthetic fixtures + domain + database foundation | `app/src/components/mvp/screens/export-screens.tsx`; `ExportManifest`; `export_staleness`; `stale-output-notice.tsx` |
| U18 | Delete flows | MISSING | Domain + database foundation, incl. verified purge worker | `deletion.ts`; `request_deletion`; `enumerate_deletion_scope`; `purge_deletion_request` |
| U19 | My activity | MISSING | Domain + database foundation | `myActivity`; `audit_select_own_actions` |
| U20 | Account and language settings; MFA enrolment | MISSING | Domain + database foundation | `Profile`; `Session` |
| U21 | Trust & safety page | MISSING | Domain foundation (copy only) | `trust_ai_assists` copy |

**Summary (rebaselined against A-043 by A-048, 26 Sep 2026): READY 0 · PARTIAL 11 (U01, U03, U04, U05, U06, U07, U08, U09, U10, U16, U17) · MISSING 10 · DEFERRED 0 · NOT APPLICABLE 0 · UNVERIFIED 0** at screen level. A-041's original count was PARTIAL 4 · MISSING 17 (§10). DEFERRED and UNVERIFIED appear on sub-elements in §4 and §5.

**Reconciliation with the A-030 gap report.** A-030 reported PARTIAL 5, counting U03 as PARTIAL because the navigation shell exists. Under the stricter definition in §2, `app-shell.tsx` renders none of U03's required states ("empty, active disputes") or copy ("Start a dispute"), so U03 is MISSING here. No other status changed.

---

## 4. Screen detail

Paths are repository-relative. "Copy keys" are keys of `REQUIRED_COPY` in `app/src/domain/copy.ts`. Smoke check names are from `db/tests/smoke_0001.sql`. For each screen the rows are purpose, user action, code, server, database, security, status, tests, copy, design evidence, deferred work and limitations.

### U01 — Sign-up / sign-in / OTP

| Field | Evidence |
|---|---|
| Purpose | Authenticate a user and, on first sign-up, create their personal tenant (F01, F02) |
| Expected user action | Sign in with **Google** (MVP primary method, founder decision D-035, 26 Sep 2026; supersedes F01's email/password + OTP for the MVP); switch language; follow the privacy notice link |
| Code / component | **A-043 (Lovable):** `app/src/routes/login.tsx` → `app/src/components/mvp/screens/login-screen.tsx` — Google sign-in **entry UI only, not connected** (no auth provider; FD-02): seeded synthetic personas stand in; shows `consent_no_ai`. Founder decision D-035 (26 Sep 2026) makes Google Login the MVP primary sign-in method. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **None.** No NyayOS screen. The generic `app/src/components/ui/input-otp.tsx` primitive exists but is not used by any NyayOS component or route. Domain: `app/src/domain/identity.ts` (`Session`, `isSessionActive`, `revokeSession`, `createPersonalTenantOnSignUp`); `app/src/domain/config.ts` (`otp_max_attempts` [PROV]) |
| API / server dependency | A01 `signUp` / `signIn` / `signOut` / `revokeSessions` — **missing** (no auth provider; FD-02 hosting undecided). F19 rate limits — **missing** |
| Database dependency | `profiles`, `tenants`, `tenant_memberships`; SQL `sign_up_personal_tenant` (`db/migrations/0001_fma_foundation.sql`, audited in `db/migrations/0005_audit_contract_and_atomicity.sql`) |
| Security controls | S1 personal tenant boundary; S13 rate limits and server-side secrets (not implemented); no account-existence disclosure (not implemented); tenant type immutable (trigger) |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: MISSING — domain and database foundation only) |
| Test evidence | `app/tests/mvp.test.tsx` ("Google login entry flow (U01)"; 233/233 in CI on PR #2); `app/tests/domain/dispute.test.ts` ("Sign-up creates exactly one personal tenant"); smoke `sign_up_A`, `sign_up_idempotent`, `sign_up_B`, `tenant_type_immutable` |
| Copy keys | None exist for U01; the privacy-notice link and language switch have no copy or component |
| Design evidence | Deck U01 Sign In + U02 OTP Verification; Figma Brief V2 has no sign-in section; Figma prototype UNVERIFIED (not supplied) |
| Deferred work | Auth provider and OTP delivery (wave W1/W2 of the A-030 gap report); rate-limit implementation |
| Contradiction / limitation | Resolved by D-035 (26 Sep 2026): Google Login is the MVP primary sign-in, replacing both the deck's mobile OTP and F01's email/password + OTP (§6, C-01). A-043 shows the Google entry only; no provider is connected |

### U02 — Consent notice

| Field | Evidence |
|---|---|
| Purpose | Explain purposes (`storage`, `export`), state that no AI is used, state operator access, record consent (F03, F04, F24) |
| Expected user action | Read the notice in Hindi or English; accept or decline; later withdraw |
| Code / component | **None.** Domain: `app/src/domain/consent.ts` (`Consent`, `Notice`, `requirePurpose`, `withdrawConsent`, `assertGrantable`, `isLockedPurpose`) |
| API / server dependency | A02 `grantConsent` / `withdrawConsent` — **missing** as a server function; a self-insert RLS path exists in the database |
| Database dependency | `consents` (`consents_select_self`, `consents_insert_self`), `notices` (`notices_select_all`); locked and reserved purposes refused by constraint |
| Security controls | S8 purpose-bound consent; `aggregate_analytics` and `model_improvement` hard-locked off; F24 operator-access disclosure |
| Status | **MISSING** |
| Test evidence | `app/tests/domain/consent.test.ts`; smoke `consent_storage_ok`, `locked_purpose_rejected`, `reserved_purpose_rejected`, `B_sees_no_consents_of_A` |
| Copy keys | `consent_no_ai`, `operator_access` (hi/en) |
| Design evidence | Deck U03 Consent; Figma Brief V2 §17 "Privacy controls" (partial overlap); prototype UNVERIFIED |
| Deferred work | Counsel wording of notices (OL-01/OL-04) |
| Contradiction / limitation | Deck: "withdrawal routes the user to deletion". Not in Scope Sheet U02; not adopted (§6, C-06) |

### U03 — Dashboard

| Field | Evidence |
|---|---|
| Purpose | List the user's disputes and offer "Start a dispute" |
| Expected user action | Open a dispute; start a new dispute |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.index.tsx` → `app/src/components/mvp/screens/dispute-list-screen.tsx` — "Your disputes" list with the empty state and "Start a dispute" on synthetic fixtures; the wider dashboard is out of A-043 scope. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **No dashboard.** `app/src/components/nyayos/app-shell.tsx` is the showcase's navigation shell (sections Tokens, Components, Facts, Evidence, Parties, Navigation, Access). `app/src/components/nyayos/readiness-indicator.tsx` is a percentage primitive. Domain: `app/src/domain/dispute.ts` (`Dispute`), `app/src/domain/authz.ts` (`isDisputeMember`) |
| API / server dependency | Dispute list and A08 `getDisputeFile` — **missing** |
| Database dependency | `disputes` (`disputes_select_member`), `dispute_roles`; SQL `is_dispute_member` |
| Security controls | S1 tenant isolation; only members read a dispute |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: MISSING (reconciled from A-030 PARTIAL, see §3)) |
| Test evidence | `app/tests/mvp.test.tsx` ("dispute list"; 233/233 in CI on PR #2); `app/tests/foundation.test.tsx` (`ReadinessIndicator` only; the shell has no test); `app/tests/domain/authz.test.ts`; smoke `B_sees_no_disputes`, `is_dispute_member_owner` |
| Copy keys | None; "Start a dispute" has no key |
| Design evidence | Deck U04 Dashboard; Figma Brief V2 §2 Dashboard; prototype UNVERIFIED |
| Deferred work | Wave W2 routes |
| Contradiction / limitation | The deck requires "counts only — no scores". `ReadinessIndicator` shows "% complete"; if it is used on U03 it must stay a completeness measure and never become a score (Scope Sheet copy prohibitions) |

### U04 — New dispute — "What happened?"

| Field | Evidence |
|---|---|
| Purpose | Create a dispute and store the user's own account verbatim (F11) |
| Expected user action | Name the dispute; describe the problem in their own words; save |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.new.tsx` → `app/src/components/mvp/screens/what-happened-screen.tsx` — headline and help copy (`what_happened_headline`, `what_happened_help`), validation, save to the local store. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **None.** Domain: `app/src/domain/dispute.ts` (`Dispute`, `DisputeStatement`) |
| API / server dependency | A03 `createDispute` exists as SQL `create_dispute`; A04 `addStatement` is available through `propose_change` with target `dispute_statement`. No application server function |
| Database dependency | `disputes`, `dispute_roles`, `dispute_statements`; SQL `create_dispute`, `propose_change`, `decide_proposal` (`0001`, re-issued with in-transaction audit in `0005`) |
| Security controls | S1, S3 single-writer; audit atomic with the write (A-038, D-031) |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: MISSING) |
| Test evidence | `app/tests/mvp.test.tsx` ("U04 What happened"; 233/233 in CI on PR #2); Smoke `create_dispute`, `owner_role_row`, `A038_server_writes_are_audited`; `db/tests/audit_atomicity_0001.sql` |
| Copy keys | `what_happened_headline`, `what_happened_help` |
| Design evidence | Deck U05 Create Matter + U06 What Happened; Figma Brief V2 §2 New dispute; prototype UNVERIFIED |
| Deferred work | Wave W2 routes |
| Contradiction / limitation | Deck adds "own reference" and "start date" at creation; the schema has neither. Not adopted (§6, C-09) |

### U05 — Intake

| Field | Evidence |
|---|---|
| Purpose | Deterministic, one-question-at-a-time intake with "why we ask", "I don't know", save and exit (F12) |
| Expected user action | Answer, skip with "I don't know", go back, save and exit |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.$disputeId.intake.tsx` → `app/src/components/mvp/screens/intake-screen.tsx` — one question at a time with `intake_dont_know` and `intake_why_we_ask`; questions are synthetic. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **None.** Domain: `app/src/domain/dispute.ts` (`IntakeQuestion`, `BranchRule`, `nextQuestion`, `DONT_KNOW`) |
| API / server dependency | A05 `getNextQuestion` — **missing** |
| Database dependency | `intake_questions` (`intake_questions_select_all`); answers stored as `dispute_statements` |
| Security controls | S3; no model call (FN-02); no statute names in questions (copy rule) |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: MISSING) |
| Test evidence | `app/tests/mvp.test.tsx` ("U05 Intake"; 233/233 in CI on PR #2); `app/tests/domain/dispute.test.ts` ("Deterministic intake … no model call, 'I don't know' preserved") |
| Copy keys | `intake_dont_know`, `intake_why_we_ask` |
| Design evidence | Deck U07 Deterministic Intake; Figma Brief V2 §3 Intake screen; prototype UNVERIFIED |
| Deferred work | Question set content: **DEFERRED** until FM-0 learnings (F12; A-030 gap report). Dynamic AI questions: **DEFERRED** (`ff_ai_questions` off) |
| Contradiction / limitation | None beyond numbering |

### U06 — Evidence locker

| Field | Evidence |
|---|---|
| Purpose | Upload and hold the dispute's documents with label, type, status, pages, upload date and verification state (F06–F08) |
| Expected user action | Upload a file; watch its state (uploading, scanning, rejected, ready); label, filter and open documents |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.$disputeId.evidence.tsx` → `app/src/components/mvp/screens/evidence-locker-screen.tsx` — file selection with type checks and SHA-256 fingerprints computed in the browser; nothing is uploaded, stored or scanned. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **Prototype:** `app/src/components/nyayos/evidence-workspace.tsx` (screens `upload` and `locker`; sample data `INITIAL_EVIDENCE`; client-side extension and size checks only) and `app/src/components/nyayos/evidence-card.tsx` (A-036 optional `duplicateOf` chip). Shown on the showcase "Evidence" section. **Domain:** `app/src/domain/evidence.ts` (`QuarantineUpload`, `Document`, `DocumentVersion`, `acceptUpload`, `sniffMime`, `transitionUpload`, `replaceDocument`, `assertVersionImmutable`), `app/src/domain/duplicate.ts` (`assessDuplicate`, `findDuplicateVersions`) |
| API / server dependency | A09 `requestUpload`, A10 `completeUpload`, A11 scan worker, A12 promote, A13 reject, A15 `replaceDocument` — **all missing**. No storage bucket (FD-02) and no scan provider (FD-03) |
| Database dependency | `quarantine_uploads`, `documents`, `document_versions` (write-once trigger), `custody_events`, `jobs`; SQL `find_duplicate_versions` (`db/migrations/0002_duplicate_lookup.sql`) |
| Security controls | S5 write-once originals; S6 signed URLs (not implemented); SEC-HASH, SEC-UPL rules in the domain; duplicate lookup tenant-scoped and informational (A-036) |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: PARTIAL — prototype and foundations; nothing uploads, stores or scans a real file) |
| Test evidence | `app/tests/mvp.test.tsx` ("U06 Evidence locker"; 233/233 in CI on PR #2); `app/tests/evidence.test.tsx` (`EvidenceCard`, "Evidence screens"); `app/tests/domain/evidence.test.ts`; `app/tests/domain/duplicate.test.ts`; smoke `DUP_*` (8 checks) |
| Copy keys | `duplicate_detected` |
| Design evidence | Deck U08 Evidence Locker + U09 Upload; Figma Brief V2 §4; [A-024 evidence conformance review](../design/NYAYOS_SPRINT3_EVIDENCE_CONFORMANCE_REVIEW_A024.md); prototype UNVERIFIED |
| Deferred work | DOCX viewing (`ff_docx` off): **DEFERRED** |
| Contradiction / limitation | (1) The component lifecycle (`queued`, `scanning`, `processing`, `extracted`, `rejected`, `error`) differs from the domain `UPLOAD_STATES` (A-030 assessment C5). (2) `EvidenceCard` can show an extraction summary and confidence; FM-A has no AI extraction. (3) The A-036 duplicate chip exists on `EvidenceCard`, but `EvidenceWorkspace` never sets `duplicateOf`, so no screen shows it |

### U07 — Document viewer (with manual fact linking)

| Field | Evidence |
|---|---|
| Purpose | Read a stored document page by page and mark the page a fact comes from (F09, F10) |
| Expected user action | Page through a document; enter link-a-fact mode; mark the source page |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.$disputeId.documents.$documentId.tsx` → `app/src/components/mvp/screens/document-viewer-screen.tsx` — viewer states and link-a-fact mode with `mark_source_page`; synthetic documents. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **None.** Domain: `app/src/domain/evidence.ts` (`DocumentVersion`, `DocumentLocation`, `Annotation`, `signedUrlTtlSeconds`) |
| API / server dependency | A14 `getDocumentUrl`, A16 `addLocation` / `annotate` — **missing** |
| Database dependency | `document_versions`, `document_locations`, `annotations` |
| Security controls | S6 short-TTL signed URLs (`signed_url_view_ttl_seconds` [PROV]); read-only rendering; S5 originals never altered |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: MISSING) |
| Test evidence | `app/tests/mvp.test.tsx` ("U07 Document viewer"; 233/233 in CI on PR #2); `app/tests/domain/evidence.test.ts` (write-once versions); no viewer test |
| Copy keys | `mark_source_page` |
| Design evidence | Deck U10 Document Viewer + U11 Fact Linking (source-page part); Figma Brief V2 has no viewer section; prototype UNVERIFIED |
| Deferred work | DOCX (`ff_docx` off): **DEFERRED**; OCR-derived locations replaced by manual linking (F10) |
| Contradiction / limitation | The A-032 §6 cross-map mapped only deck U10 here; deck U11 Fact Linking also covers U07's link-a-fact mode (§5 correction) |

### U08 — Fact list / confirmation

| Field | Evidence |
|---|---|
| Purpose | Show every fact with source and status more prominent than the value; let the user confirm, correct, mark uncertain or not relevant (F13–F15) |
| Expected user action | Confirm, mark uncertain, mark not relevant, correct with an optional reason, open the source |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.$disputeId.facts.tsx` → `app/src/components/mvp/screens/fact-review-screen.tsx` — fact list with pending, confirmed, corrected, uncertain and not-relevant states, sources, and `contradiction_neutral` copy; confirmations stay in the local store. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **Prototype:** `app/src/components/nyayos/fact-card.tsx`, `source-panel.tsx`, `status-chip.tsx`, `confidence-band.tsx`, `inline-correction-input.tsx`, `source-badge.tsx`, `date-badge.tsx` (all under `app/src/components/nyayos/`), rendered with static sample facts on the showcase "Facts" section. **Domain:** `app/src/domain/proposal.ts` (`proposeChange`, `decideProposal`, `ownerChange`, `buildVersionChain`, `reconcileHistory`), `app/src/domain/dispute.ts` (`Provenance`, `isProvenanceComplete`), `app/src/domain/enums.ts` (`VERIFICATION_STATUSES`) |
| API / server dependency | A06 `proposeChange` and A07 `decideProposal` exist as SQL `propose_change` / `decide_proposal`; A08 `getDisputeFile` — **missing**. The Fact Card is not wired to proposals |
| Database dependency | Canonical tables (`events`, `propositions`, `evidence_items`, …), `proposals`, `user_corrections` (append-only); no authenticated write grant on canonical tables |
| Security controls | S3 single writer; M-4 provenance guards (`created_by` server-set, `ai_extraction` refused, `source_ref` shape); correction history immutable |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: PARTIAL — conforming card prototype (A-021/A-022); no list screen; not wired) |
| Test evidence | `app/tests/mvp.test.tsx` ("U08 Fact review"; 233/233 in CI on PR #2); `app/tests/fact-card.test.tsx`; `app/tests/foundation.test.tsx`; `app/tests/domain/proposal.test.ts`; smoke `proposal_pending`, `proposal_accepted`, `correction_v1_prev_null`, `correction_v2_prev_has_old_text`, `direct_update_denied`, `decide_twice_refused`, `no_authenticated_write_grant_on_canonical`, `M4_*` |
| Copy keys | None specific; status labels are component strings |
| Design evidence | [A-021 Fact Card conformance review](../design/NYAYOS_FACT_CARD_CONFORMANCE_REVIEW_A021.md); deck U11–U14; Figma Brief V2 §5 Fact confirmation; prototype UNVERIFIED |
| Deferred work | A-021 item 4 (contradiction actions on the card) belongs to U12 |
| Contradiction / limitation | (1) `source-badge.tsx` offers "Read out by AI" and "AI inference" kinds; FM-A has no AI and the database refuses `ai_extraction` origins, so these kinds must never render in FM-A. (2) Deck: "only confirmed facts enter timeline or export"; the Scope Sheet does not require it and the branch manifest includes every verification status (§6, C-03) |

### U09 — Timeline

| Field | Evidence |
|---|---|
| Purpose | Order events with date precision visible: exact, approximate, inferred, unknown, conflicting |
| Expected user action | Read the chronology; open an event's source; set or adjust a date |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.$disputeId.timeline.tsx` → `app/src/components/mvp/screens/timeline-screen.tsx` — exact, approximate, inferred, unknown and conflicting dates; date required unless unknown. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **Prototype:** `app/src/components/nyayos/timeline-event-card.tsx`, `date-badge.tsx`, and the `timeline` screen of `parties-timeline-workspace.tsx` (sample data `INITIAL_EVENTS`). **Domain:** `app/src/domain/dispute.ts` (`Event`, `DateAssertion`, `markConflictingDates`) |
| API / server dependency | A08 — **missing**; date changes go through A06/A07 (SQL exists) |
| Database dependency | `events`, `date_assertions` |
| Security controls | S3; inferred dates never styled as exact (copy rule) |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: PARTIAL) |
| Test evidence | `app/tests/mvp.test.tsx` ("U09 Timeline"; 233/233 in CI on PR #2); `app/tests/parties-timeline.test.tsx` (`TimelineEventCard`, workspace); `app/tests/domain/dispute.test.ts` (canonical item rules) |
| Copy keys | None specific |
| Design evidence | Deck U15 Timeline; Figma Brief V2 §6 Timeline; prototype UNVERIFIED |
| Deferred work | Wiring to `date_assertions` (A-034 gap analysis item 8) |
| Contradiction / limitation | Deck restricts the timeline to confirmed, dated facts; the Scope Sheet does not (§6, C-03) |

### U10 — Parties

| Field | Evidence |
|---|---|
| Purpose | List parties with their source forms and a duplicate-review screen; similar names are never merged automatically |
| Expected user action | Review parties; compare similar names; merge only by explicit choice |
| Code / component | **Prototype:** `app/src/components/nyayos/party-card.tsx` and the `parties` screen of `parties-timeline-workspace.tsx` (sample data `INITIAL_PARTIES`). **Domain:** `app/src/domain/dispute.ts` (`Entity`, `EntitySourceForm`) |
| API / server dependency | A08 — **missing**; explicit merge as a proposal — not built |
| Database dependency | `entities`, `entity_source_forms` |
| Security controls | S3; third-party data minimised (Scope Sheet §4.3 holds no contact details) |
| Status | **PARTIAL** — no duplicate-review screen; source forms not shown |
| Test evidence | `app/tests/parties-timeline.test.tsx` (`PartyCard`, workspace) |
| Copy keys | `no_auto_merge` (exists; not rendered by any component) |
| Design evidence | Deck U16 Parties; Figma Brief V2 §7 Parties; prototype UNVERIFIED |
| Deferred work | Duplicate-review screen (A-034 gap analysis item 9) |
| Contradiction / limitation | Deck adds party "contact details"; not in the Scope Sheet data model; not adopted (§6, C-05) |

### U11 — Evidence map

| Field | Evidence |
|---|---|
| Purpose | Show how evidence relates to facts, with the source shown before the relationship is claimed |
| Expected user action | Open a relation; open its source; add a relation |
| Code / component | **None** (the `source-badge.tsx` primitive shows a source kind, not a relation). Domain: `app/src/domain/dispute.ts` (`EvidenceRelationRow`, `validateEvidenceRelation`) |
| API / server dependency | A17 `linkEvidence` through `propose_change` (SQL exists); read path — **missing** |
| Database dependency | `evidence_relations` |
| Security controls | S3; a relation requires a source reference |
| Status | **MISSING** |
| Test evidence | `app/tests/domain/dispute.test.ts` ("Canonical item rules (AC-M1-04, AC-M1-06, U11)") |
| Copy keys | None |
| Design evidence | Deck U17 Evidence Map; Figma Brief V2 §8 Evidence mapping; prototype UNVERIFIED |
| Deferred work | Wave W3 |
| Contradiction / limitation | Deck describes a coverage view with unsupported facts highlighted; the Scope Sheet describes relation types. Scope Sheet governs |

### U12 — Information to review (contradictions)

| Field | Evidence |
|---|---|
| Purpose | Show user-flagged differences between sources neutrally: no truth score |
| Expected user action | Review an item; mark it reviewed |
| Code / component | **None.** Domain: `app/src/domain/dispute.ts` (`Contradiction`, `validateContradiction`) |
| API / server dependency | A18 `flagContradiction` — **missing** (the write can go through `propose_change`) |
| Database dependency | `contradictions` |
| Security controls | S3; neutral description enforced by validation |
| Status | **MISSING** |
| Test evidence | `app/tests/domain/dispute.test.ts` ("a contradiction needs two different items and a neutral description") |
| Copy keys | `contradiction_neutral` |
| Design evidence | Deck U18 Review & Gaps (partly); Figma Brief V2 §9 Contradictions; prototype UNVERIFIED |
| Deferred work | Planned in [A-035 WAVE0 plan](../implementation/A-035_WAVE0_IMPLEMENTATION_PLAN_V1.md) (not started) |
| Contradiction / limitation | Automatic detection excluded: contradictions are user-flagged (F13) |

### U13 — What may still be useful (gaps)

| Field | Evidence |
|---|---|
| Purpose | Show missing evidence the user noted, without negative-inference wording |
| Expected user action | Answer or dismiss an item |
| Code / component | **None.** Domain: `app/src/domain/dispute.ts` (`MissingEvidence`) |
| API / server dependency | Read and answer paths — **missing**; writes through `propose_change` |
| Database dependency | `missing_evidence` |
| Security controls | S3 |
| Status | **MISSING** |
| Test evidence | **None.** No test exercises `MissingEvidence` |
| Copy keys | None ("no negative inference" is a review rule) |
| Design evidence | Deck U18 Review & Gaps (partly); Figma Brief V2 §10 Evidence gaps; prototype UNVERIFIED |
| Deferred work | A-035 plan item (not started) |
| Contradiction / limitation | Deck gaps are structural (unsupported, unconfirmed, undated, unused items); Scope Sheet gaps are missing evidence. Overlapping, not identical (§6, C-07) |

### U14 — File label (issue)

| Field | Evidence |
|---|---|
| Purpose | Let the user choose a plain-language label for organising the file: "not a legal determination" |
| Expected user action | Select a label |
| Code / component | **None.** Domain: `app/src/domain/dispute.ts` (`Issue`) |
| API / server dependency | Through `propose_change` (SQL exists); read path — **missing** |
| Database dependency | `issues` |
| Security controls | S3; Scope Sheet copy prohibitions |
| Status | **MISSING** |
| Test evidence | Copy only: `app/tests/domain/export-deletion.test.ts` checks every copy key is bilingual and free of prohibited wording. No test exercises `Issue` |
| Copy keys | `issue_label_disclaimer` |
| Design evidence | No deck equivalent; Figma Brief V2 §11 Issue classification (see §6, C-12); prototype UNVERIFIED |
| Deferred work | Wave W4 |
| Contradiction / limitation | Figma Brief V2 shows a "likely category" with confidence; FM-A labels are user-chosen and carry no confidence. Not adopted |

### U15 — Next steps (user-entered)

| Field | Evidence |
|---|---|
| Purpose | Let the user record their own next steps; dates are labelled "date you entered"; no legal deadlines |
| Expected user action | Add, edit or complete a step with an optional user date |
| Code / component | **None.** Domain: `app/src/domain/dispute.ts` (`NextStep`) |
| API / server dependency | Through `propose_change` (SQL exists); read path — **missing** |
| Database dependency | `next_steps` |
| Security controls | S3; no deadline calculation anywhere |
| Status | **MISSING** |
| Test evidence | Copy only: `app/tests/domain/export-deletion.test.ts` (bilingual, prohibited wording). No test exercises `NextStep` |
| Copy keys | `next_step_date_label` |
| Design evidence | Deck U19 Next Steps; Figma Brief V2 §14 Action plan (see §6, C-14); prototype UNVERIFIED |
| Deferred work | Wave W4 |
| Contradiction / limitation | Deck: an in-product checklist that links to resolving screens; Scope Sheet: user-entered steps. Scope Sheet governs (§6, C-08) |

### U16 — Export preview / privacy check

| Field | Evidence |
|---|---|
| Purpose | List exactly what the export will contain before it is generated |
| Expected user action | Review contents; generate |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.$disputeId.export.index.tsx` → `app/src/components/mvp/screens/export-screens.tsx` — lists exactly what the export will contain before generation. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). **None.** Domain: `app/src/domain/export.ts` (`buildExportManifest`, which records omissions), `app/src/domain/enums.ts` (`EXPORT_SECTIONS`) |
| API / server dependency | A19 `previewExport` — **missing** |
| Database dependency | Reads the dispute file; no export row until generation |
| Security controls | Export consent purpose (S8); owner/editor only |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: MISSING) |
| Test evidence | `app/tests/mvp.test.tsx` ("U16/U17 Export"; 233/233 in CI on PR #2); `app/tests/domain/export-deletion.test.ts` ("Export manifest (F16 …)") |
| Copy keys | None specific |
| Design evidence | Deck U20 Export Centre; Figma Brief V2 §16 Export center; prototype UNVERIFIED |
| Deferred work | Wave W4 |
| Contradiction / limitation | Deck "confirmed facts only" selection (§6, C-03) |

### U17 — Export result and integrity manifest

| Field | Evidence |
|---|---|
| Purpose | Download the export; view the manifest, integrity scope statement, "No AI was used" statement, version and timestamp |
| Expected user action | Download; view the manifest; see whether the export is out of date (A-037) |
| Code / component | **A-043 (Lovable):** `app/src/routes/disputes.$disputeId.export.result.tsx` → `app/src/components/mvp/screens/export-screens.tsx` — result with the integrity scope statement and a JSON integrity manifest; no printable case file. Model: `app/src/mvp/store.tsx`, `app/src/mvp/fixtures.ts` (synthetic data only). `app/src/components/nyayos/stale-output-notice.tsx` (A-037 stale-output warning; informational; tested; **not mounted on any route**). Domain: `app/src/domain/export.ts` (`ExportManifest`, `verifyManifestAgainstStored`, `NO_AI_STATEMENT_EN`, `INTEGRITY_SCOPE_STATEMENT_EN` and Hindi twins), `app/src/domain/staleness.ts` (`assessOutputStaleness`) |
| API / server dependency | A20 `generateExport`, A21 `getExportUrl`, A22 `deleteExport` — **missing**; staleness is SQL `export_staleness` (`db/migrations/0003_export_staleness.sql`) |
| Database dependency | `exports`, `export_manifests` (member read policies) |
| Security controls | Manifest hash in the audit chain (planned in A20); integrity statement minimal pending counsel (OL-08); staleness check read-only and scoped |
| Status | **PARTIAL** — A-043 UI on synthetic fixtures; no server function, auth provider or database connection (rebaselined by A-048; A-041 recorded: MISSING — required U17 content has no component; the A-037 notice is an extra affordance, not the screen) |
| Test evidence | `app/tests/mvp.test.tsx` ("U16/U17 Export"; 233/233 in CI on PR #2); `app/tests/domain/export-deletion.test.ts`; `app/tests/domain/staleness.test.ts`; `app/tests/stale-output-notice.test.tsx`; smoke `STALE_*` (13 checks) |
| Copy keys | `export_no_ai`, `stale_output_title`, `stale_output_stale`, `stale_output_unknown`, `stale_output_unreadable`, `stale_output_unchanged`, `stale_output_review` |
| Design evidence | Deck U20 Export Centre; Figma Brief V2 §16 (footer conflicts, §6, C-15); prototype UNVERIFIED |
| Deferred work | Export storage and download (depends on FD-02) |
| Contradiction / limitation | Integrity scope wording provisional (OL-08); A-032 m-11 native Hindi review |

### U18 — Delete flows

| Field | Evidence |
|---|---|
| Purpose | Request deletion of a document, dispute or account; undo within the window; show honest status (requested, locked, in progress, completed, backup expiry) |
| Expected user action | Request deletion; confirm; undo within the window; watch status |
| Code / component | **None.** Domain: `app/src/domain/deletion.ts` (`newDeletionRequest`, `transitionDeletion`, `deletionStatus`, `DELETION_GRAPH`, `DELETION_PURGE_ORDER`, `purgeGate`, `purgeCandidates`, `purgeOutcome`) |
| API / server dependency | A23 `requestDeletion` exists as SQL `request_deletion`; undo is an RLS-guarded update of `deletion_requests`. A24 exists as SQL `purge_deletion_request`, callable only by the deletion service, with no scheduler. A25 operator verification and A26 `getDeletionStatus` — **missing** as server functions |
| Database dependency | `deletion_requests`, `deletion_ledger`, `retention_records`, `config_provisional` (`deletion_undo_window_days`, `document_reference_policy`, `legal_hold_dispute_ids`); SQL `request_deletion` (`0001`, `0005`), `enumerate_deletion_scope` (`db/migrations/0006_deletion_scope_graph.sql`), `purge_deletion_request` (`db/migrations/0007_deletion_purge_worker.sql`) |
| Security controls | S9; C-2 request authorisation; M-6 explicit deletion graph; M-3 purge worker. Details in §7 |
| Status | **MISSING** as a screen. The database deletion lifecycle is the most complete foundation in the repository (§7) |
| Test evidence | `app/tests/domain/export-deletion.test.ts`, `app/tests/domain/deletion-graph.test.ts`, `app/tests/domain/deletion-purge.test.ts`; `db/tests/deletion_authz_0001.sql`, `db/tests/deletion_scope_0001.sql`, `db/tests/deletion_purge_0001.sql`, `db/tests/deletion_purge_concurrency.sh`; smoke `C2_*`, `M6_*`, `M3_*` |
| Copy keys | `deletion_requested`, `deletion_in_progress`, `deletion_completed_active_systems`, `deletion_verified` |
| Design evidence | Deck U21 Settings, Trust & Deletion and deck §21 Deletion Lifecycle; Figma Brief V2 §17 Privacy controls ("Delete"); prototype UNVERIFIED |
| Deferred work | Screen; object-storage deletion; scheduler; operator verification (A25) |
| Contradiction / limitation | Deck: deletion "not reversible", typed confirmation, deletion receipt, tombstone with actor. Scope Sheet: 7-day undo [PROV], content-free tombstone (OL-03 interim) (§6, C-02, C-04). The limitations required by A-041 are stated in §7 |

### U19 — My activity

| Field | Evidence |
|---|---|
| Purpose | Show the user their own audited actions only |
| Expected user action | Read the list |
| Code / component | **None.** Domain: `app/src/domain/audit.ts` (`myActivity`) |
| API / server dependency | A27 `getMyActivity` — **missing** |
| Database dependency | `audit_events` (`audit_select_own_actions`) |
| Security controls | S7 append-only, hash-chained audit; own actions only |
| Status | **MISSING** |
| Test evidence | `app/tests/domain/audit.test.ts`; smoke `my_activity_own_rows_only` |
| Copy keys | None |
| Design evidence | Deck U21 ("read the audit log"); no Figma Brief V2 section; prototype UNVERIFIED |
| Deferred work | Wave W4 |
| Contradiction / limitation | Actor references in other tenants are not pseudonymised on account deletion (A-039 limitation) |

### U20 — Account and language settings; MFA enrolment

| Field | Evidence |
|---|---|
| Purpose | Change preferred language and account details; enrol in MFA (F23: available, not enforced) |
| Expected user action | Switch language; update profile; enrol MFA |
| Code / component | **None.** Domain: `app/src/domain/identity.ts` (`Profile` with `preferredLanguage`, `Session` with `mfaVerified`) |
| API / server dependency | Profile update through RLS; MFA enrolment — **missing** (no auth provider) |
| Database dependency | `profiles` (`profiles_select_self`, `profiles_update_self`) |
| Security controls | S2; MFA enforcement **DEFERRED** (`ff_mfa_required` off, F23) |
| Status | **MISSING** |
| Test evidence | `app/tests/domain/dispute.test.ts` (profile created on sign-up) |
| Copy keys | None |
| Design evidence | Deck U21 (settings part); no Figma Brief V2 section; prototype UNVERIFIED |
| Deferred work | MFA enforcement (DEFERRED by F23) |
| Contradiction / limitation | None beyond the deck's bundling of U18–U21 |

### U21 — Trust & safety page

| Field | Evidence |
|---|---|
| Purpose | Static page: no AI in this version, sources shown, uncertainty visible, correction and deletion rights, operator-access statement |
| Expected user action | Read |
| Code / component | **None.** Copy only in `app/src/domain/copy.ts` |
| API / server dependency | None required (static) |
| Database dependency | None |
| Security controls | F24 operator transparency statement |
| Status | **MISSING** |
| Test evidence | Copy only: `app/tests/domain/export-deletion.test.ts` (bilingual, prohibited wording) |
| Copy keys | `trust_ai_assists`, `operator_access`, `consent_no_ai` |
| Design evidence | Deck U21 (trust part); Figma Brief V2 §1 Trust & Safety (public page); prototype UNVERIFIED |
| Deferred work | Counsel wording (OL-01) |
| Contradiction / limitation | Figma Brief V2 says "AI assists; AI does not decide" for a product with AI; FM-A states "no AI in this version" (Scope Sheet U21) |

---

## 5. Numbering and grouping cross-map

Every alternative numbering or grouping found in the repository, with its reconciliation. **Scope Sheet IDs control in every row.**

### 5.1 FM-A Product & User Flow deck (U01–U21, different meanings)

Source: [deck text extract](NYAYOS_FMA_PRODUCT_USER_FLOW_DECK_V1_TEXT.md), slide "Screen Map: U01–U21" and slides 27–47.

| Canonical ID | Deck ID and title | Reconciliation decision |
|---|---|---|
| U01 | Deck U01 Sign In + Deck U02 OTP Verification | Merged into canonical U01. Deck IDs not adopted |
| U02 | Deck U03 Consent | Renumbered to U02 |
| U03 | Deck U04 Dashboard | Renumbered to U03 |
| U04 | Deck U05 Create Matter + Deck U06 What Happened | Merged into canonical U04 |
| U05 | Deck U07 Deterministic Intake | Renumbered to U05 |
| U06 | Deck U08 Evidence Locker + Deck U09 Upload | Merged into canonical U06 |
| U07 | Deck U10 Document Viewer + Deck U11 Fact Linking (source-page marking) | Merged into canonical U07. **Corrects A-032 §6**, which mapped deck U11 only to U08 |
| U08 | Deck U11 Fact Linking (fact side) + Deck U12 Facts List + Deck U13 Fact Correction + Deck U14 Fact Confirmation | Merged into canonical U08 |
| U09 | Deck U15 Timeline | Renumbered to U09 |
| U10 | Deck U16 Parties | Renumbered to U10 |
| U11 | Deck U17 Evidence Map | Renumbered to U11 |
| U12 | Deck U18 Review & Gaps (differences part) | Split: contradictions go to canonical U12 |
| U13 | Deck U18 Review & Gaps (gaps part) | Split: gaps go to canonical U13 (definitions differ, §6 C-07) |
| U14 | — | No deck equivalent. Canonical U14 kept |
| U15 | Deck U19 Next Steps | Renumbered to U15 (behaviour differs, §6 C-08) |
| U16 | Deck U20 Export Centre (preview part) | Split into canonical U16 |
| U17 | Deck U20 Export Centre (result part) | Split into canonical U17 |
| U18 | Deck U21 Settings, Trust & Deletion (deletion part); deck §21 Deletion Lifecycle | Split into canonical U18 |
| U19 | Deck U21 (audit log part) | Split into canonical U19 |
| U20 | Deck U21 (settings and language part) | Split into canonical U20 |
| U21 | Deck U21 (trust part) | Split into canonical U21 |

The deck's §23 walkthrough groups (U01–U03 access, U04–U07 start, U08–U10 evidence, U11–U14 facts, U15–U17 structure, U18–U19 review, U20 export, U21 trust) use deck IDs and translate through the table above.

### 5.2 Figma Brief V2 (sections 1–18)

Source: [NYAYOS_FIGMA_BRIEF_V2.md](../design/NYAYOS_FIGMA_BRIEF_V2.md). The brief predates FM-A and covers the wider product.

| Canonical ID | Brief section | Reconciliation decision |
|---|---|---|
| — | §1 Public pages: Home, How it works | NOT APPLICABLE to U01–U21 (marketing pages) |
| U21 | §1 Public pages: Trust & Safety | Maps to U21; FM-A wording "no AI in this version" governs |
| U03 | §2 Dashboard | Maps to U03 |
| U04 | §2 New dispute | Maps to U04 |
| U05 | §3 Intake screen | Maps to U05 |
| U06 | §4 Evidence locker | Maps to U06 |
| U08 | §5 Fact confirmation | Maps to U08 |
| U09 | §6 Timeline | Maps to U09 |
| U10 | §7 Parties | Maps to U10 |
| U11 | §8 Evidence mapping | Maps to U11 |
| U12 | §9 Contradictions | Maps to U12 |
| U13 | §10 Evidence gaps | Maps to U13 |
| U14 | §11 Issue classification | Maps to U14; "likely category" and confidence not adopted (C-12) |
| — | §12 Verified information (authority sources) | NOT APPLICABLE: authority retrieval is absent by design in FM-A (Scope Sheet §5) |
| — | §13 Possible paths | NOT APPLICABLE: legal pathways are outside FM-A (no legal advice) |
| U15 | §14 Action plan | Maps to U15; "verified deadline", deadline status and urgency not adopted (C-14) |
| — | §15 Human review | NOT APPLICABLE: sharing and review arrive in FM-B |
| U16, U17 | §16 Export center | Maps to U16 + U17; footer "AI-generated content present" replaced by "No AI was used" (C-15) |
| U18, U08, U16/U17 | §17 Privacy controls (Delete; Correct; Export) | Delete maps to U18, Correct to U08, Export to U16/U17. Share, Stop sharing and "who has access" NOT APPLICABLE (FM-B) |
| All | §18 Mobile-first | Cross-cutting rule for every screen (Scope Sheet §6 preamble) |

### 5.3 Figma FM-A prototype package

| Canonical ID | Alternative | Reconciliation decision |
|---|---|---|
| U01–U21 | Figma FM-A source package (A-008) | **UNVERIFIED — not supplied.** No numbering exists to reconcile. When the package arrives, its frames must be mapped to this table before use |

### 5.4 Repository reports

| Canonical ID | Alternative | Source | Reconciliation decision |
|---|---|---|---|
| U01–U21 | Scope Sheet IDs | [A-030 gap report §4](../architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md) | Same numbering. U03 status reconciled from PARTIAL to MISSING (§3); addendum pointer appended to the report |
| U01–U21 | Scope Sheet IDs with a partial deck cross-map | [A-032 review §6](../architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md) | Superseded by §5.1 of this addendum (adds the deck U11 → U07 link, splits of deck U18/U20/U21, and the Figma Brief V2 map) |
| U10, U12, U13 | Scope Sheet IDs | [A-034 gap analysis](../../NYAYOS_GAP_ANALYSIS_V1.md) | Same numbering; no conflict |
| U12, U13, U17 | Scope Sheet IDs | [A-035 WAVE0 plan](../implementation/A-035_WAVE0_IMPLEMENTATION_PLAN_V1.md) | Same numbering; no conflict |
| U07, U14, U20 | A-041 brief titles ("Document viewer and manual fact linking", "Plain-language file label", "Account, language and MFA settings") | A-041 assignment | Descriptive titles of the same screens. Scope Sheet titles kept |

### 5.5 Existing components and showcase groupings

| Canonical ID | Grouping in code | Source | Reconciliation decision |
|---|---|---|---|
| — | Showcase sections Tokens, Components, Navigation, Access | `app/src/components/nyayos/app-shell.tsx`, `app/src/routes/index.tsx` | NOT APPLICABLE: design-system sections, not screens |
| U08 | Showcase section "Facts" | `app/src/routes/index.tsx` | Prototype evidence for U08 only |
| U06 | Showcase section "Evidence"; workspace screens `upload` and `locker` | `app/src/components/nyayos/evidence-workspace.tsx` | Both workspace screens belong to U06 (deck U08 + U09) |
| U10, U09 | Showcase section "Parties"; workspace screens `parties` and `timeline` | `app/src/components/nyayos/parties-timeline-workspace.tsx` | `parties` maps to U10, `timeline` to U09. One workspace, two canonical screens |

---

## 6. Content conflicts between sources

The Scope Sheet governs every row. "Not adopted" means the other source's requirement is not part of FM-A and nothing in the repository implements it. A founder who wants to adopt one changes the Scope Sheet first. D-035 and D-036 were decided on 26 Sep 2026 for C-01 (Google Login) and C-04 (content-free tombstone) and ratify Scope Sheet numbering; C-02, C-03 and C-05 remain open under D-035.

| # | Topic | Other source says | Scope Sheet / repository says | Decision |
|---|---|---|---|---|
| C-01 | Sign-in method | Deck: mobile OTP only, no password storage | F01: email/password + OTP | **Decided (D-035, 26 Sep 2026): Google Login is the MVP primary sign-in method.** Neither source's method is adopted for the MVP; Scope Sheet numbering still controls |
| C-02 | Reversibility of deletion | Deck: typed confirmation; "not reversible" | F17: undo window [PROV 7 days]; implemented in `request_deletion` and the undo policy | Scope Sheet governs; open founder decision D-035 |
| C-03 | Confirmed-only timeline and export | Deck: only confirmed facts enter timeline or export | Not required; `buildExportManifest` includes every verification status | Scope Sheet governs; A-032's suggested `confirmedOnly` option is **not implemented**; open founder decision D-035 |
| C-04 | Tombstone contents | Deck: matter identifier, time and actor; deletion receipt | OL-03 interim content-free tombstone (scope type, scope id, time; no actor) | **Decided (D-036, 26 Sep 2026): tombstones remain content-free.** The deck's actor field is not adopted |
| C-05 | Party contact details | Deck U16 | Not in the Scope Sheet §4.3 data model | Not adopted |
| C-06 | Consent withdrawal routes to deletion | Deck U03 / consent flow | Withdrawal blocks further processing (`requirePurpose`); no automatic routing | Not adopted |
| C-07 | Meaning of "gaps" | Deck U18: unsupported, unconfirmed, undated, unused items | U13: missing evidence noted by the user; U12: contradictions | Scope Sheet governs; deck's structural counts not adopted as a screen |
| C-08 | Next steps | Deck U19: in-product checklist | U15: user-entered steps with user dates | Scope Sheet governs |
| C-09 | Create-matter fields | Deck U05: own reference, start date | `disputes` holds title and category label only | Not adopted |
| C-10 | Bundling | Deck U21: settings, trust, audit and deletion on one screen | Four screens U18–U21 | Scope Sheet governs (split) |
| C-11 | AI labels in components | `source-badge.tsx` kinds "Read out by AI", "AI inference"; `evidence-card.tsx` extraction confidence | FM-A: no AI; database refuses `ai_extraction` origins | Components may not render these kinds in FM-A screens; recorded as a wiring constraint |
| C-12 | Issue classification | Figma Brief V2 §11: likely category, confidence | U14: user-chosen label, "not a legal determination" | Not adopted |
| C-13 | Evidence lifecycle names | `evidence-card.tsx` lifecycle | Domain `UPLOAD_STATES` (A-030 assessment C5) | Domain governs; components are renamed when wired |
| C-14 | Deadlines in action plan | Figma Brief V2 §14: deadline status, urgency | No legal deadlines anywhere (U15) | Not adopted |
| C-15 | Export footer | Figma Brief V2 §16: "AI-generated content present" | U17: "No AI was used to produce this file" | Not adopted |

---

## 7. U18 deletion: what exists and what does not (A-039, A-040)

| Area | State at the baseline |
|---|---|
| Request | `request_deletion` checks owner (dispute, account) or editor (document) and takes the undo window from configuration (A-033 C-2; `db/tests/deletion_authz_0001.sql` 25/25) |
| Undo | The requester may undo while `now() <= undo_until`; the purge worker refuses inside the window |
| Scope | `deletion_graph_v1()` decides every table; `enumerate_deletion_scope()` classifies each record as purge candidate, retained audit metadata, retained legal hold, blocked by active reference, outside request scope or configuration-controlled (A-039; `db/tests/deletion_scope_0001.sql` 28/28) |
| Purge | `purge_deletion_request()` runs only as the deletion service, deletes only purge candidates, keeps anything still referenced, writes a content-free tombstone and an audit event in the same transaction, and ends as purged or incomplete (A-040; `db/tests/deletion_purge_0001.sql` 55/55; `db/tests/deletion_purge_concurrency.sh` 3/3) |
| Honest status | `deletionStatus` never shows an incomplete purge as complete (domain only; no screen) |

Limitations, stated as required by A-041:

1. **Physical object-storage deletion is not implemented.** No storage bucket exists (FD-02). The purge removes database rows, including the rows that hold storage paths, so blob deletion must be designed before storage is provisioned.
2. **Account deletion keeps the personal tenant row, and it needs scrubbing.** Retained `deletion_requests` and `consents` reference the tenant by foreign key. The purge therefore keeps the tenant row, including its name, and the user's own membership, and the request ends as incomplete. A founder decision is needed: drop those foreign keys, as the tombstone ledger already does, or scrub the tenant name.
3. **Legal hold remains provisional and manual.** It is the configuration key `legal_hold_dispute_ids`, pending counsel (OL-06). An unreadable value holds everything.
4. **No shared environment exists.** Migrations `0001`–`0007` have run only on disposable local containers. No scheduler invokes the worker, and operator verification (A25) and the status endpoint (A26) are not built.

---

## 8. M-8 closure record

| Closure condition (A-041) | Evidence in this addendum |
|---|---|
| All 21 screens mapped | §3 matrix (one row per ID) and §4 detail (one section per ID) |
| Every alternative numbering reconciled | §5.1 deck; §5.2 Figma Brief V2; §5.3 Figma prototype (absent, UNVERIFIED); §5.4 reports; §5.5 components |
| Conflicts reconciled, not ignored | §6 C-01 to C-15, each with a decision |
| Limitations explicit | §4 "Contradiction / limitation" rows; §7; §9 |
| Status evidence-backed | Every status cites files or states the absence; every cited path exists at the baseline (validated by A-041) |

**A-032 M-8 is closed by this addendum.** The founder decisions it names (D-035, D-036) remain open. Closing M-8 records the conflicts and fixes Scope Sheet precedence; it does not decide them.

**A-032 m-1 remains open.** `db/migrations/0001_fma_foundation.sql` still grants `update (title, status, category_label) on nyayos.disputes to nyayos_authenticated`, so an owner or editor can set `status` directly. A-041 may not change SQL. The fix is still a one-line grant change in a new migration.

**Update (A-042, 26 Sep 2026):** m-1 is now closed by `db/migrations/0008_dispute_status_authorization.sql`. Dispute status is no longer client-writable and follows the deletion workflow only; see `db/tests/dispute_status_0001.sql`.

## 9. Limitations of this addendum

- **Evidence is static.** Statuses were read from code at the baseline; no screen was run, because none exists.
- **No design evidence.** The Figma FM-A package was not available, so every "design evidence" row cites the deck extract and the Figma Brief V2 only.
- **No compliance claim.** Security controls cite the Scope Sheet and the SEC tests that exist. Nothing here asserts legal, regulatory or deployment compliance.
- **Hindi copy.** Hindi strings are working translations (A-032 m-11).

## 10. Rebaseline against A-043 (A-048, 26 September 2026)

Lovable's A-043 (completion commit `9d238423`, handoff `docs/ai/tool-output/lovable/A-043/HANDOFF.json`) built MVP Wave-1 screens on seeded synthetic fixtures, with no server function, auth provider or database. Under the §2 definitions they are **PARTIAL**, never READY.

| ID | A-041 status | Now | Evidence |
|---|---|---|---|
| U01 | MISSING | PARTIAL | `app/src/routes/login.tsx`, `app/src/components/mvp/screens/login-screen.tsx` — Google entry UI only |
| U03 | MISSING | PARTIAL | `app/src/routes/disputes.index.tsx`, `app/src/components/mvp/screens/dispute-list-screen.tsx` |
| U04 | MISSING | PARTIAL | `app/src/routes/disputes.new.tsx`, `app/src/components/mvp/screens/what-happened-screen.tsx` |
| U05 | MISSING | PARTIAL | `app/src/components/mvp/screens/intake-screen.tsx` |
| U06 | PARTIAL | PARTIAL | `app/src/components/mvp/screens/evidence-locker-screen.tsx` (replaces the showcase prototype as the primary evidence) |
| U07 | MISSING | PARTIAL | `app/src/components/mvp/screens/document-viewer-screen.tsx` |
| U08 | PARTIAL | PARTIAL | `app/src/components/mvp/screens/fact-review-screen.tsx` (list screen now exists) |
| U09 | PARTIAL | PARTIAL | `app/src/components/mvp/screens/timeline-screen.tsx` |
| U16 | MISSING | PARTIAL | `app/src/components/mvp/screens/export-screens.tsx` (preview) |
| U17 | MISSING | PARTIAL | `app/src/components/mvp/screens/export-screens.tsx` (result, JSON manifest only) |

Unchanged: U02 (consent screen out of A-043 scope; the login screen shows `consent_no_ai` only), U10 (showcase prototype), U11–U15 and U18–U21 (no screens). U03 was MISSING in A-041 because the showcase shell rendered none of its states; A-043's dispute list renders the list, the empty state and "Start a dispute".

Still owed before any screen can be READY: an auth provider (Google, per D-035), server functions A01–A28 and a database environment (FD-02); design conformance against the Figma package (A-008, not supplied); U02 consent; native Hindi review (A-032 m-11).

Founder decisions recorded on 26 Sep 2026 (Decision Log D-035, D-036): Google Login is the MVP primary sign-in method; Scope Sheet numbering controls; `document_reference_policy` remains `block`; deletion tombstones remain content-free.
