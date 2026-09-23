# NYAYOS_FM_A_SCOPE_SHEET_V1

| Field | Value |
|---|---|
| Project | NyayOS |
| Assignment | FM-A Scope Sheet — convert Fast Mode step FM-A into an exact buildable specification |
| Tool / mode | Claude Chat (Opus, extended thinking) |
| Environment | Specification only. No code, no repository work, no commits, no deployment, no database writes. |
| Status | Pre-build. Nothing here asserts that any implementation exists. |
| Inputs | Fast Mode Strategy V1 ("FMS") · Build Brief V2 ("BB2") · Security & Data Architecture Spec V1 ("SDAS") · Counsel Brief V1 ("CB1") · Master Product Spec V1 ("MPS") · Decision Log V1 · Risk Register V1 |
| Authorisation status | FM-A requires founder build authorisation (FD-01), hosting confirmation (FD-02) and a malware-scan provider decision (FD-03 partial). This sheet does not authorise anything. |
| Continuity owner | M365 Copilot |
| Date | 22 Sep 2026 |

**Standing statements.** No legal opinions, no compliance claims, no implementation claims. All time-to-live, retention and threshold values are provisional configuration [PROV]. Every control below is *specified and tested*; nothing here states that NyayOS is secure or compliant.

---

## 1. FM-A scope

### 1.1 One-sentence scope

> A dispute owner signs in, describes what happened, answers a deterministic question set, uploads their own documents, links facts to the page they came from, confirms everything themselves, downloads a provenance-complete Dispute File with an integrity manifest, and can delete any of it with an honest status — with no AI, no legal content, and no sharing.

### 1.2 What FM-A is inside BB2

FM-A = **M0-lite + M1 (full) + M2-lite + M5-lite + M6-skeleton**, delivered as one milestone.

| BB2 milestone | FM-A treatment |
|---|---|
| M0 Foundation | Reduced: personal tenants only; organisation tables reserved; break-glass tooling deferred; MFA available not enforced |
| M1 Dispute Core | Kept in full, except dynamic AI questions (deterministic branching instead) and org need-to-know (no org tenants yet) |
| M2 Evidence Pipeline | Split: ingest, scan, write-once originals, versions, custody, viewer, **manual** locations kept. OCR, derivatives, chunking, embeddings, retrieval, DOC/DOCX deferred to FM-D |
| M3 AI Foundation | Not in FM-A. No AI gateway, no authority corpus, no jurisdiction pack |
| M4 Reviewer Seat | Not in FM-A (FM-B). `grant_allows` helper and grant enums exist and return false |
| M5 Exports + Integrity | Reduced: one export profile + manifest + notices. No watermarking, no multiple profiles, no signing |
| M6 Deletion + Recovery | Skeleton + working deletion over the FM-A surface, scripted (manual) verification, one restore drill. Automation, holds, canary probes, provider confirmations deferred |
| M7 Pilot Readiness | Not in FM-A. FM-A ships to a cohort only after the FM-A exit gate (§9) and the CB1 posture in §9.4 |

### 1.3 Non-negotiables carried into FM-A

Single-writer canonical facts · deny-by-default access · frozen share snapshots (enum and helper present; no live-share alternative ever built) · zero-tool AI (no AI at all in FM-A) · separate private and authority corpora (no authority corpus exists) · write-once evidence originals · verified deletion architecture · no marketplace, rankings, lead fees, success fees · no autonomous legal activity (no send, sign, file, approve).

---

## 2. Included features

| ID | Feature | BB2 milestone | BB2 acceptance criteria | Security (S) | Flag |
|---|---|---|---|---|---|
| F01 | Authentication (email/password + OTP verification), session management, sign-out, session revocation | M0 | AC-M0-02 | S1, S2, S13 | `ff_auth` (always on) |
| F02 | Personal tenant auto-created on sign-up; membership record; tenant/dispute/grant/platform role tables present | M0 | AC-M0-02, AC-M0-03 | S1 | `ff_org_tenants` (**off**) |
| F03 | Consent framework: purpose catalogue declared in full; enforced purposes in FM-A are `storage` and `export`; `aggregate_analytics` and `model_improvement` hard-locked off | M0 | AC-M0-06 | S8 | `ff_consent_ai` (off), `ff_consent_share` (off) |
| F04 | Bilingual versioned notices (Hindi/English) for privacy, retention and deletion status | M0 | AC-M0-06 | S8 | — |
| F05 | Append-only hash-chained audit; weekly manual anchor export; owner-facing view of their own activity | M0 | AC-M0-04 | S7 | `ff_audit_anchor_auto` (off) |
| F06 | Storage buckets with path policies; signed-URL issuance only through an authorising server function, short TTL [PROV 5 min view] | M0/M2 | AC-M0-05, AC-M2-06 | S6 | — |
| F07 | Upload → quarantine → server SHA-256 → MIME sniff → malware scan → promote to write-once original; rejected/infected handling with user notice | M0/M2 | AC-M0-05, AC-M2-01…03 | S5 | — |
| F08 | Document versions (replacement creates a new version), custody events | M2 | AC-M2-02, AC-M2-08 | S5, S7 | — |
| F09 | Document viewer (PDF, JPG/JPEG, PNG, pasted text) with page navigation | M2 | AC-M2-06 | S6 | `ff_docx` (**off**) |
| F10 | **Manual location linking**: user marks the page/section a fact comes from | M2 (replaces OCR-derived locations) | AC-M2-07 (partial), MPS §11 | S3 | — |
| F11 | Dispute creation; "What happened?" free text stored as a user statement with provenance | M1 | AC-M1-01 | S1, S3 | — |
| F12 | Deterministic branching intake (rules authored from FM-0 learnings), one question at a time, "why we ask", "I don't know", save and exit | M1 (dynamic AI questions deferred) | AC-M1-01 | S3 | `ff_ai_questions` (**off**) |
| F13 | Canonical Dispute File: entities/parties with source forms (no auto-merge), events, date assertions with precision states, propositions, evidence items, evidence relations, contradictions (user-flagged), missing evidence, plain-language issue label, user-written next steps | M1 | AC-M1-04…07 | S3 | — |
| F14 | Proposal → correction single-writer flow; owner-originated proposals auto-accepted with a correction record; no direct update path on canonical tables | M1 | AC-M1-02, AC-M1-03 | S3 | — |
| F15 | Status and provenance on every item (user statement / document extraction / user inference); confidence bands where applicable | M1 | AC-M1-02 | S3 | — |
| F16 | Export: one profile ("Full case file") containing brief, chronology, evidence index, issues, gaps, corrections, plus integrity manifest, minimal integrity scope statement, export version, timestamp, and a statement that no AI was used | M5 | AC-M5-01, AC-M5-02, AC-M5-04, AC-M5-05 | S5, S7 | `ff_export_profiles_multi` (off) |
| F17 | Deletion: document, dispute, account; undo window [PROV 7 days]; LOCKED state; purge across the FM-A surface; scripted verification recorded; honest user status including backup expiry date | M0/M6 | AC-M0-07, AC-M6-01, AC-M6-04, AC-M6-07 | S9 | `ff_deletion_auto_verify` (off) |
| F18 | RLS helpers `is_dispute_member` and `grant_allows` (the latter present, returns false); CI schema lint; deletion allow-list registration check | M0 | AC-M0-01, AC-M0-03, AC-M0-07 | S1, S9 | — |
| F19 | Rate limits (auth, OTP, upload, signed-URL issuance, export); secrets server-side only; client-bundle secret scan | M0 | AC-M0-08 | S13 | — |
| F20 | Backups encrypted, India region, rotation [PROV 35 days]; one rehearsed restore drill into an isolated environment before any real user data | M6 | AC-M6-06 (partial: drill without automated ledger replay) | S16 | — |
| F21 | Environment separation: synthetic-only dev/staging; no real data in fixtures or demos | M7 control brought forward | AC-M7-07 (partial) | S12 | — |
| F22 | India-region hosting for database, storage, backups and logs; clock synchronisation configured where the vendor allows | M0 | BB2 C17 | S14 | — |
| F23 | MFA enrolment available (not enforced in FM-A because no downloads by non-owners exist) | M0 | AC-M4-08 (deferred enforcement) | S2 | `ff_mfa_required` (off) |
| F24 | Operator transparency: no standing operator access to content; any operator access is audited and disclosed in the notice; user notified (CB1 §3.7.10 interim) | M0 | AC-M0-09 (tooling deferred) | S2, S7 | `ff_break_glass_tooling` (off) |

---

## 3. Explicit exclusions

### 3.1 Deferred to a named later step (seam reserved, flag off)

| Excluded from FM-A | Returns at | Reserved seam in FM-A |
|---|---|---|
| Sharing, grants, reviewer accounts, invites, comments | FM-B (BB2 M4-lite) | `grant_allows` helper; grant role and purpose enums; share-version tables **not created** (CR-1) |
| Reviewer suggestions, downloads, watermarking, identity particulars | BB2 M4 full | proposal `origin` enum includes `reviewer` |
| Payment / paywall | FM-C | none required |
| OCR, derivatives, DOC/DOCX, chunking, embeddings, retrieval, canary ids | FM-D / BB2 M2 remainder | derivative and chunk tables **not created**; document version fields allow derivatives later |
| AI gateway, `ai_runs`, all AI tasks, dynamic questions | FM-D / BB2 M3 | proposal `origin` enum includes `ai`; workflow states declared, AI states inert |
| Authority corpus, jurisdiction pack, citation validator, verified-deadline gate, verified-information screen, action plan sourced from law | BB2 M3 | none created — separate schema when it arrives (CR-9) |
| Draft/review-gate objects (T0 draft types as first-class) | BB2 M3 | draft type and tier enums declared |
| Organisation tenants, org_admin metadata view, dispute-level need-to-know | When a multi-user customer exists | tenant type and role enums declared; `ff_org_tenants` off |
| Automated deletion verification, canary probes, provider-deletion confirmations, ledger-replay tooling, legal holds | FM-E / BB2 M6 | deletion ledger and retention records exist; hold table **not created** |
| Break-glass tooling, support grants, MFA enforcement, multiple export profiles, manifest signing, dashboards | FM-E / BB2 M4–M7 | flags declared |

### 3.2 Excluded permanently (never a Fast Mode candidate)

Marketplace, directory, search of professionals, rankings, ratings, reviews, paid placement, lead fees, success fees, fee display · send, sign, file, schedule-send, approve automation · outcome prediction, merits conclusions, guilt/innocence, bail estimates · public criminal-matter drafting · model-callable tools or general-purpose AI tools · training or fine-tuning on private files · live (non-frozen) reviewer access · re-sharing by a reviewer.

### 3.3 Excluded for FM-A only, by the Fast Mode scope decision (FMS FP-3)

**All legal and procedural content output.** FM-A produces no citations, no deadlines, no rights or procedure statements, and no legal issue determination. The issue field is a plain-language label chosen by the user, displayed with "This is a label to help organise your file, not a legal determination."

---

## 4. Data model

Field lists only; no DDL. Every table: `id`, `created_at`, `updated_at`, `tenant_id` where tenant-scoped, RLS enabled with explicit grants and policies in the same migration, and registration in the deletion allow-list. Sensitivity labels follow SDAS §3 (S4 Restricted-Legal, S3 Confidential, S2 Internal).

### 4.1 Identity and tenancy

| Table | Fields | Sens. | Notes |
|---|---|---|---|
| `profiles` | user_id, display_name, preferred_language, created_at | S3 | No roles on this table |
| `tenants` | id, type (`personal` \| reserved `organization`, `advocate_workspace`, `institution`), name, created_at | S3 | Only `personal` used |
| `tenant_memberships` | tenant_id, user_id, tenant_role (`tenant_owner` \| reserved `org_admin`, `member`), status, joined_at | S3 | One row per user in FM-A |
| `dispute_roles` | dispute_id, user_id, dispute_role (`dispute_owner` \| reserved `dispute_editor`, `dispute_viewer`) | S3 | Owner row only in FM-A |
| `platform_roles` | user_id, role (`platform_security`, reserved `platform_support`, `pack_curator`, `pack_approver`) | S3 | No standing content access |

### 4.2 Consent and notices

| Table | Fields | Sens. |
|---|---|---|
| `consents` | id, principal_user_id, tenant_id, scope_type (`account` \| `dispute`), scope_id, purpose (full catalogue enum), notice_version, notice_language, method, granted_at, withdrawn_at, request_id | S3 |
| `notices` | purpose, version, language, text_ref, effective_from | S2 |

Purpose enum declared in full (SDAS §9.2). Enforced in FM-A: `storage`, `export`. Locked off: `aggregate_analytics`, `model_improvement`.

### 4.3 Dispute core

| Table | Fields | Sens. |
|---|---|---|
| `disputes` | id, tenant_id, owner_user_id, title, status, category_label (plain language), created_at, deleted_at | S4 |
| `dispute_statements` | id, dispute_id, kind (`narrative` \| `intake_answer`), question_id, text, created_by, created_at | S4 |
| `intake_questions` | id, key, text_hi, text_en, why_we_ask_hi/en, branch_rules (deterministic), version | S2 |
| `entities` | id, dispute_id, canonical_label, entity_type (person/organisation), role_label, notes, verification_status | S4 |
| `entity_source_forms` | entity_id, form_text, source_ref, first_seen_at | S4 |
| `events` | id, dispute_id, text, verification_status | S4 |
| `date_assertions` | id, dispute_id, target_type, target_id, value, precision (`exact`/`approximate`/`inferred`/`unknown`/`conflicting`), source_ref | S4 |
| `propositions` | id, dispute_id, text, origin_type, verification_status, source_ref | S4 |
| `evidence_items` | id, dispute_id, document_id (nullable), description, evidence_type, verification_status | S4 |
| `evidence_relations` | id, dispute_id, evidence_item_id, target_type, target_id, relation (`supports`/`partially_supports`/`contradicts`/`mentions`/`uncertain`), source_ref | S4 |
| `contradictions` | id, dispute_id, item_a_ref, item_b_ref, field, description (neutral), status (`open`/`reviewed`/`resolved_by_user`) | S4 |
| `missing_evidence` | id, dispute_id, expected_item, reason, related_ref, user_response | S4 |
| `issues` | id, dispute_id, label (plain language), supporting_refs, note | S4 |
| `next_steps` | id, dispute_id, text, owner_note, status, user_set_date (nullable, user-entered only) | S4 |

**No `possible_paths` with legal content and no law-sourced deadlines in FM-A.** `next_steps` dates are user-entered and labelled as such.

### 4.4 Proposals and corrections (single-writer)

| Table | Fields | Sens. |
|---|---|---|
| `proposals` | id, dispute_id, target_type, target_id (nullable for new items), proposed_value, origin (`user` \| reserved `ai`, `reviewer`), origin_ref, status (`pending`/`accepted`/`rejected`), decided_by, decided_at, reason | S4 |
| `user_corrections` | id, dispute_id, target_type, target_id, previous_value, new_value, reason, user_id, origin_proposal_id, timestamp | S4 |

Rule: canonical tables (§4.3) have no authenticated UPDATE grant; all writes pass through server functions that create a proposal and, on acceptance, a correction.

### 4.5 Evidence

| Table | Fields | Sens. |
|---|---|---|
| `quarantine_uploads` | id, tenant_id, dispute_id, uploader_id, sha256, size_bytes, sniffed_mime, declared_mime, scan_status, scan_provider_version, created_at, purge_after | S4 |
| `documents` | id, tenant_id, dispute_id, current_version, display_label, status, created_at, deleted_at | S4 |
| `document_versions` | id, document_id, version, sha256, size_bytes, sniffed_mime, page_count, original_filename, uploader_id, ingest_ts, client_reported_mtime, scan_result, storage_path, language_detected | S4 |
| `document_locations` | id, document_version_id, page_number, anchor_note, created_by (**user** in FM-A) | S4 |
| `annotations` | id, document_version_id, location_id, text, created_by | S4 |
| `custody_events` | id, document_id, version, event (`ingested`/`scanned`/`quarantined`/`promoted`/`viewed`/`exported`/`replaced`/`deletion_requested`/`deleted`), actor, occurred_at, hash_ref | S3 |
| `jobs` | id, type (`scan` only in FM-A), payload_ref, state, attempts, next_run_at, last_error_code | S2 |

**Not created in FM-A:** `document_derivatives`, `document_chunks`, authority schema, drafts, share versions, grants, legal holds (CR-1).

### 4.6 Export, audit, deletion, config

| Table | Fields | Sens. |
|---|---|---|
| `exports` | id, dispute_id, version, profile (`full_case_file`), included_sections, generated_at, generated_by, manifest_sha256, storage_path | S4 |
| `export_manifests` | export_id, entries (document id, version, sha256, size, ingest_ts) | S3 |
| `audit_events` | per SDAS §17.1: occurred_at, actor_type, actor_id, tenant_id, dispute_id, action, resource_type, resource_id, purpose, outcome, severity, request_id, ip_hash, user_agent_class, metadata (allow-listed), prev_hash, row_hash | S3 |
| `audit_anchors` | period, anchor_hash, exported_at, exported_by | S3 |
| `deletion_requests` | id, scope_type (`document`/`dispute`/`account`), scope_id, requested_by, state, undo_until, created_at | S3 |
| `deletion_ledger` | id, scope_type, scope_id, completed_at | S3 |
| `retention_records` | object_type, object_id, retention_policy_version, deletion_requested_at, deletion_completed_at, verification (structured checklist result, operator id) | S3 |
| `deletion_allowlist` | table_name, scope_column | S2 (CI-validated) |
| `config_provisional` | key, value, source (`PROV`), changed_by, changed_at | S2 |

---

## 5. API matrix

All are server functions. Every row: Zod-validated input, caller authorisation re-checked with the RLS-scoped client, declared purpose, audit event, rate limit. "AuthZ" states the check beyond authentication.

| # | Function | Purpose | AuthZ | Writes | Audit action(s) | Notes |
|---|---|---|---|---|---|---|
| A01 | `signUp` / `signIn` / `signOut` / `revokeSessions` | — | — | profiles, memberships | `auth.*` | Personal tenant created on sign-up |
| A02 | `grantConsent` / `withdrawConsent` | — | self | consents | `consent.granted/withdrawn` | Notice version + language recorded |
| A03 | `createDispute` | storage | tenant member | disputes, dispute_roles | `dispute.created` | — |
| A04 | `addStatement` | storage | `is_dispute_member(editor)` | dispute_statements | `statement.added` | Free text and intake answers |
| A05 | `getNextQuestion` | storage | member | — | — | Deterministic branch evaluation, server-side |
| A06 | `proposeChange` | storage | member(editor) | proposals | `proposal.created` | Only write path to canonical data |
| A07 | `decideProposal` | storage | owner/editor | proposals, canonical tables, user_corrections | `proposal.accepted/rejected`, `correction.created` | Owner-originated proposals auto-accepted in the same call |
| A08 | `getDisputeFile` | storage | member(viewer) | — | `dispute.accessed` | Returns items with status and provenance |
| A09 | `requestUpload` | storage | member(editor) | quarantine_uploads | `document.upload_started` | Returns a constrained upload target |
| A10 | `completeUpload` | storage | member(editor) | quarantine_uploads, jobs | `document.quarantined` | Server computes SHA-256 and sniffs MIME |
| A11 | `scanWorker` (service) | storage | service identity | quarantine_uploads, custody_events | `document.scan_result` | Provider adapter |
| A12 | `promoteDocument` (service) | storage | service identity | documents, document_versions, custody_events | `document.promoted` | Write-once path |
| A13 | `rejectUpload` (service) | storage | service identity | quarantine_uploads | `document.rejected` | Purge after [PROV 24 h] |
| A14 | `getDocumentUrl` | storage | member(viewer) | — | `signed_url.issued` / `signed_url.denied` | Short TTL; never persisted |
| A15 | `replaceDocument` | storage | member(editor) | document_versions, custody_events | `document.replaced` | New version, new hash |
| A16 | `addLocation` / `annotate` | storage | member(editor) | document_locations, annotations | `location.added` | Manual provenance linking |
| A17 | `linkEvidence` | storage | member(editor) | proposals → evidence_relations | `proposal.created/accepted` | Relation requires a source ref |
| A18 | `flagContradiction` | storage | member(editor) | contradictions | `contradiction.flagged` | Neutral description enforced by validation |
| A19 | `previewExport` | export | owner/editor | — | `export.previewed` | Privacy-check screen content |
| A20 | `generateExport` | export | owner/editor | exports, export_manifests, custody_events | `export.generated` | Manifest hash written to audit chain |
| A21 | `getExportUrl` | export | owner/editor | — | `export.downloaded`, `signed_url.issued` | Owner only in FM-A |
| A22 | `deleteExport` | storage | owner | exports | `export.deleted` | — |
| A23 | `requestDeletion` / `undoDeletion` | storage | owner (dispute/account), editor (document) | deletion_requests | `deletion.requested` / `deletion.undone` | Undo window [PROV] |
| A24 | `deletionWorker` (service) | storage | service identity | all scoped tables, storage, deletion_ledger, retention_records | `deletion.purged` | Enumerates the deletion allow-list |
| A25 | `recordDeletionVerification` (operator) | storage | platform_security | retention_records | `deletion.verified` / `deletion.incomplete` | Scripted checklist result, operator identity recorded |
| A26 | `getDeletionStatus` | storage | owner | — | — | Honest status incl. backup expiry date |
| A27 | `getMyActivity` | storage | self | — | — | Owner-scoped filtered view over audit |
| A28 | `logAuditEvent` (internal helper) | — | service identity only | audit_events | — | No client write path |

**Absent by design in FM-A:** any share, grant, invite, reviewer, comment, AI, retrieval, authority, draft, payment, hold or break-glass endpoint.

---

## 6. UI matrix

Mobile-first; desktop adds density, not different logic (MPS §18). Hindi and English throughout.

| # | Screen | Key states | Required copy / labels | Priority |
|---|---|---|---|---|
| U01 | Sign-up / sign-in / OTP | error, locked (rate limit) | Plain-language privacy notice link, language switch | 1 |
| U02 | Consent notice | first-run, version change | Purposes explained (`storage`, `export`); statement that no AI is used in this version; operator-access statement | 1 |
| U03 | Dashboard | empty, active disputes | "Start a dispute" | 2 |
| U04 | New dispute — "What happened?" | empty, saved | Headline "What happened?"; "Describe the problem in your own words. You do not need to know the legal term." | 1 |
| U05 | Intake | one question at a time, progress, "why we ask", "I don't know", save and exit | No legal statute names in questions | 1 |
| U06 | Evidence locker | uploading, scanning, rejected, ready | File label, type, status, pages, upload date, verification state | 1 |
| U07 | Document viewer | loading, page nav, link-a-fact mode | "Mark the page this fact comes from" | 2 |
| U08 | Fact list / confirmation | pending, confirmed, corrected, uncertain, not relevant | Source and status more prominent than the value; confidence bands only | 1 |
| U09 | Timeline | exact / approximate / inferred / unknown / conflicting | Inferred never styled as exact | 2 |
| U10 | Parties | duplicate-review screen | "Similar names are never merged automatically" | 3 |
| U11 | Evidence map | relation types, open-source link | Source shown before the relationship is claimed | 3 |
| U12 | Information to review (contradictions) | open, reviewed | "These documents contain different information. NyayOS is not deciding which is correct." No truth score | 2 |
| U13 | What may still be useful (gaps) | open, answered | No negative inference wording | 3 |
| U14 | File label (issue) | selected | "A label to help organise your file, not a legal determination" | 3 |
| U15 | Next steps | user-entered | Dates labelled "date you entered"; no legal deadlines anywhere | 3 |
| U16 | Export preview / privacy check | preview, generating, ready | Lists exactly what the export contains before generation | 1 |
| U17 | Export result | download, manifest view | Integrity scope statement (minimal, per CB1 §3.8.10); "No AI was used to produce this file"; export version and timestamp | 1 |
| U18 | Delete flows | confirm, undo window, locked, in progress, completed, backup expiry | Distinguishes requested vs completed; never claims completion early | 1 |
| U19 | My activity | list | Own actions only | 3 |
| U20 | Account and language settings; MFA enrolment | — | — | 3 |
| U21 | Trust & safety page | static | AI assists / AI does not decide (stated as "no AI in this version"); sources; uncertainty visible; correction and deletion rights; operator-access statement | 2 |

**Copy prohibitions (enforced by review):** "AI Lawyer", "AI Judge", "predict", "win", "file automatically", "replace your lawyer", "best lawyer", any ranking or marketplace language, any statement that the integrity manifest proves admissibility.

---

## 7. Security matrix

| S | Control | FM-A implementation | Evidence / tests |
|---|---|---|---|
| S1 | Tenant and dispute isolation | RLS on every table via `is_dispute_member`; `grant_allows` present returning false; server-side re-check; CI schema lint | SEC-RLS-01…04, SEC-TEN-01…04 |
| S2 | Deny-by-default; no standing operator content access | No support or break-glass path in FM-A; operator access would require an audited service action, disclosed in U02/U21 | SEC-INS-01 (adapted: no operator read path exists) |
| S3 | Single-writer canonical facts | No authenticated UPDATE grant on §4.3 tables; all writes via A06/A07 | SEC-MUT-02, SEC-MUT-03, SEC-RLS-03 |
| S4 | Frozen share snapshots | No sharing in FM-A; no live-share code path exists; share model arrives whole at FM-B | Design review item; enum presence check |
| S5 | Write-once originals | Quarantine → hash → sniff → scan → promote; storage policy prevents overwrite; versions; custody | SEC-HASH-01…03, SEC-UPL-01…04 |
| S6 | Private buckets; authorised signed URLs; short TTL | A14 issuance only; no public buckets | SEC-URL-01, SEC-TEN-03 |
| S7 | Append-only hash-chained audit; no content in logs | `logAuditEvent` service-only; no UPDATE/DELETE grants; PII redaction filter on operational logs | SEC-RLS-04, SEC-HASH-05, SEC-LANG-06 |
| S8 | Consent enforced; analytics/training locked off | `requirePurpose` on every content function; `model_improvement` cannot be enabled | AC-M0-06 tests, SEC-LANG-04 |
| S9 | Deletion that deletes, honest status | A23–A26 over the FM-A surface; scripted verification recorded; allow-list CI check | SEC-DEL-01, SEC-DEL-03, SEC-DEL-04 (n/a grants), SEC-DEL-06, SEC-DEL-07 |
| S10 | Separate corpora | No authority corpus exists in FM-A | Schema review |
| S11 | Zero-tool AI | No AI in FM-A; no model call path exists | Code-review assertion; gateway absent |
| S12 | Environment separation | Synthetic-only dev/staging; no production data in fixtures | SEC-ENV-01 |
| S13 | Secrets server-side only | Bundle scan in CI; no service key in client | SEC-SEC-01…02 |
| S14 | India-region hosting | DB, storage, backups, logs in India region; clocks synchronised where vendor allows | Configuration review record |
| S15 | No send/sign/file/approve; no marketplace or fee paths | No outbound channel for dispute content; no such tables, endpoints or UI | Copy review + endpoint inventory |
| S16 | Encrypted backups; one rehearsed restore | Provider encryption; restore drill into an isolated environment before any real user data | SEC-BKP-03 + drill record |

**Permitted FM-A reductions (from FMS §7):** manual deletion verification; weekly manual audit anchoring; MFA not enforced (no non-owner downloads exist); no watermarking (no non-owner downloads); no break-glass tooling while the founder is the sole operator, with access audited and disclosed; single export profile.

---

## 8. Test matrix

### 8.1 Security tests (SDAS §21 subset)

| Test ID | Coverage | Expected |
|---|---|---|
| SEC-RLS-01 | CI lint: RLS + policy + grants on every table | Build fails otherwise |
| SEC-RLS-02 | Anonymous client on every table | Zero rows / denied |
| SEC-RLS-03 | Authenticated UPDATE on canonical tables | Denied |
| SEC-RLS-04 | Any write to `audit_events` by non-service role | Denied |
| SEC-TEN-01 | User B requests user A's dispute by id | Denied; no metadata |
| SEC-TEN-02 | Dispute listing per user | Own only |
| SEC-TEN-03 | Signed-URL request for another user's document path | Denied |
| SEC-TEN-04 | Direct query of another tenant's document/version rows | Denied |
| SEC-HASH-01 | Recompute SHA-256 of stored original | Matches record |
| SEC-HASH-02 | Overwrite attempt on an original | Denied |
| SEC-HASH-03 | Replacement flow | New version, new hash, old retained |
| SEC-HASH-05 | Audit row tamper in isolated test | Chain break detected |
| SEC-UPL-01 | Executable renamed `.pdf` | Rejected on sniff |
| SEC-UPL-02 | EICAR test file | Quarantined, purged, user notified |
| SEC-UPL-03 | Oversized / page-bomb file | Rejected |
| SEC-UPL-04 | Office file with macros | Not executed; rejected in FM-A (`ff_docx` off) |
| SEC-URL-01 | Use signed URL after TTL | Denied |
| SEC-MUT-02 | Accept a proposal | Correction record with previous/new value and origin |
| SEC-MUT-03 | Compare canonical history with correction log for a session | Every change has a correction |
| SEC-DEL-01 | Delete a document | Rows, objects, exports references removed; verification recorded |
| SEC-DEL-03 | Signed-URL issuance for a deleted object | Denied |
| SEC-DEL-06 | Add a table without allow-list registration | CI fails |
| SEC-DEL-07 | User-facing deletion status | Active-systems completion date + backup expiry shown |
| SEC-SEC-01 | Client bundle secret scan | None found |
| SEC-SEC-02 | Error responses and logs for tokens/secrets | None found |
| SEC-ATO-01 | OTP brute force | Rate limited and locked |
| SEC-ATO-02 | Session after password reset | Old sessions revoked |
| SEC-LANG-01 | Devanagari / English / mixed-script documents and text | Stored, displayed, exported without corruption |
| SEC-LANG-02 | Same name in two scripts | Never auto-merged |
| SEC-LANG-04 | Notices hi/en | Same version id; correct display |
| SEC-LANG-05 | Export with Devanagari content | Correct rendering; hash manifest unaffected |
| SEC-LANG-06 | Logs during Hindi-content operations | No content in logs |
| SEC-ENV-01 | Production data in non-production environments | None |
| SEC-BKP-03 | Backup access by a non-security role | Denied |

**Not applicable in FM-A (return with their features):** SEC-REV-*, SEC-REVK-*, SEC-URL-02…04 (invites), SEC-EXP-01/02/04 (reviewer download authorisation), SEC-INJ-*, SEC-CIT-*, SEC-UNS-*, SEC-STALE-*, SEC-OCR-*, SEC-VEN-*, SEC-DEL-02 (canary), SEC-DEL-05 (holds), SEC-BKP-01/02 (ledger-replay automation), SEC-ATO-03 (MFA enforcement), SEC-MUT-01/04 (AI origin), SEC-CFL-01.

### 8.2 Functional tests

| ID | Scenario | Expected |
|---|---|---|
| FN-01 | Start a dispute from free text without choosing any category | Accepted; no legal category required (AC-M1-01) |
| FN-02 | Intake with "I don't know" answers | Uncertainty preserved; no forced certainty |
| FN-03 | Upload PDF, JPG, PNG, pasted text | All accepted; DOCX rejected while `ff_docx` off, with a clear message |
| FN-04 | Failed scan / failed processing | Original preserved where applicable; status explained (AC-M2-07) |
| FN-05 | Link a fact to a document page | Location stored; shown as the source in the file and export |
| FN-06 | Conflicting dates entered | Both retained; marked conflicting; no auto-resolution (AC-M1-04) |
| FN-07 | Two similar party names | Duplicate-review offered; no automatic merge (AC-M1-05) |
| FN-08 | Flag a contradiction | Two references required; no "true source" field exists (AC-M1-06) |
| FN-09 | Record a gap | Linked to an expected/mentioned item; no negative inference text (AC-M1-07) |
| FN-10 | Generate export | Contains brief, chronology, evidence index, issues, gaps, corrections, manifest, notices; contains no legal statement, deadline or citation (AC-M5-01) |
| FN-11 | Manifest check | Manifest hashes match stored originals; manifest hash in audit chain (AC-M5-02) |
| FN-12 | Delete a dispute and check status | Undo → locked → purged → verified; status honest at each step (AC-M6-04) |
| FN-13 | Account deletion | All disputes purged; audit actor pseudonymised; verification recorded |
| FN-14 | Mobile end-to-end | Intake → upload → confirm → export completed unaided on a phone in one sitting |
| FN-15 | Language switch mid-flow | Content preserved; notices in the chosen language |
| FN-16 | Copy review | No prohibited wording anywhere (§6) |

---

## 9. Exit gate

FM-A is complete only with evidence (CI runs, test reports, configuration records, drill record). Claims without evidence do not close the gate.

### 9.1 Functional exit
- All FN-01…FN-16 pass.
- FN-14 completed by at least two people who did not build the product, on their own phones, with a synthetic dispute.

### 9.2 Security exit
- Every test in §8.1 green.
- Every control in §7 (S1–S16) implemented or explicitly covered by a listed permitted reduction.
- CI: schema lint, deletion allow-list check, bundle secret scan, dependency scan — all green.
- One restore drill recorded (F20) before any real user data exists.

### 9.3 BB2 acceptance-criteria exit
Met in FM-A: AC-M0-01…08, AC-M0-10 (subset harness), AC-M1-01…07, AC-M1-09, AC-M2-01…03, AC-M2-06…09 (with manual locations), AC-M5-01, AC-M5-02, AC-M5-04, AC-M5-05, AC-M6-04, AC-M6-07.
Partially met, recorded as such: AC-M2-07 (no OCR), AC-M6-01 (narrow surface, manual verification), AC-M6-06 (drill without automated ledger replay), AC-M7-07 (environment separation only).
Not applicable in FM-A: AC-M0-09, AC-M1-08, AC-M2-04, AC-M2-05, AC-M3-*, AC-M4-*, AC-M5-03, AC-M6-02, AC-M6-03, AC-M6-05.

### 9.4 Release posture (before any real user data)
- CB1 interim paths adopted in full for OL-02, OL-03, OL-05, OL-07, OL-08, OL-10 (share warning not yet needed), OL-11 (no external processors exist in FM-A).
- **OL-01 and OL-04 remain blocking for a pilot** (CB1 §7). FM-A may be exercised with synthetic data and with FM-0 participants under written arrangements at the founder's decision; a general pilot waits for counsel.
- Bilingual notices published; retention configuration recorded as provisional.

### 9.5 Then
Proceed to FM-B (share and reviewer seat) as the single next milestone.

---

## 10. Reconciliation to BB2

| Rule (FMS §14) | How FM-A satisfies it |
|---|---|
| CR-1 Schema superset | Every FM-A table in §4 is a BB2 table with the same semantics; deferred capability means tables **not created**, never differently shaped |
| CR-2 Helpers from day one | Both `is_dispute_member` and `grant_allows` exist; FM-B supplies grant rows, not a new contract |
| CR-3 Enums reserved | Tenant types, tenant/dispute/grant/platform roles, consent purposes, proposal origins, draft types and tiers declared in full and unused |
| CR-4 Deletion registry | Every FM-A table registered at creation; CI enforces; FM-E automation enumerates the same registry |
| CR-5 Audit catalogue | FM-A actions are drawn from the BB2 catalogue; later milestones add actions, never rename |
| CR-6 Proposals only | AI (FM-D) and reviewers (FM-B) attach as new `origin` values on the existing pipeline |
| CR-7 Share versions immutable from the start | No live-share shortcut is built in FM-A; the frozen model arrives whole at FM-B |
| CR-8 Provenance contract fixed | Status, origin, source and confidence-band fields are final in FM-A |
| CR-9 Corpora never mixed | No authority corpus; when it arrives it is a separate schema |
| CR-10 Manual-then-automated | Deletion verification, audit anchoring and holds are procedures over the same records automation will later read |
| CR-11 Flags not forks | Flags declared in §2 and §3.1; enabling is configuration plus that milestone's build |
| CR-12 Export format stability | The FM-0 hand-built format is the FM-A template; later profiles are additions |
| CR-13 Gate continuity | §7 maps to BB2 G-PILOT gates; nothing passes in FM-A that would fail in BB2 |
| CR-14 Documentation | The FM-A gate report records each BB2 acceptance criterion as met / partial / not applicable (§9.3) |

**Re-entry work created by FM-A (bounded and additive):** OCR derivatives and locations from extraction (locations already exist as a table); chunk and derivative tables; share and grant tables; AI gateway and `ai_runs`; authority schema and pack; deletion automation and canary ids (canary column added to chunks when chunks are created); watermarking and MFA enforcement; multiple export profiles. None requires reshaping an FM-A table.

---

## 11. Handoff to M365 Copilot

**Deliverable:** `NYAYOS_FM_A_SCOPE_SHEET_V1.md` (this file).

**State:** pre-build. No code, no repository work, no commits, no deployment, no database writes. No legal, compliance or implementation claims.

**To record:**
1. FM-A = M0-lite + M1 + M2-lite + M5-lite + M6-skeleton, delivered as one milestone, with 24 included features (F01–F24) and explicit exclusions.
2. The scope decision that defines FM-A: **no AI and no legal or procedural content output**; the issue field is a plain-language label, and the only dates are ones the user typed.
3. Data model (§4), API matrix (§5), UI matrix (§6), security matrix (§7 → S1–S16), test matrix (§8), exit gate (§9).
4. Prerequisites are founder-only: FD-01 build authorisation, FD-02 hosting and region, FD-03 malware-scan provider.
5. Pilot remains gated on CB1 OL-01 and OL-04; FM-A's exit gate does not open a pilot.
6. Next milestone after the FM-A exit gate is FM-B (share and reviewer seat); the next specification task, if wanted, is an FM-B scope sheet in this same format.
