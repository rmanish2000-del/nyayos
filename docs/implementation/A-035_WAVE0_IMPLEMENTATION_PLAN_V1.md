# A-035 — WAVE0 IMPLEMENTATION PLAN V1

| Field | Value |
|---|---|
| Assignment | A-035 — implementation plan for five backlog items (plan only; no code) |
| Branch planned against | `feature/fma-foundation-v1` at `668c2dcfbe4bbcd3398b18590df4c78dd33bed85` (PR #2, draft; `main` at `6c6b478` has none of the domain or schema) |
| Gate | FA-001 staging only. Deployment NOT allowed. Nothing here is implemented. |
| Inputs | `NYAYOS_OPERATING_SYSTEM.md` · `NYAYOS_STATUS.json` · `NYAYOS_GAP_ANALYSIS_V1.md` (A-034) · `NYAYOS_VALIDATED_REQUIREMENTS_V1.md` (sha256 `45cef79033123171…`) · `NYAYOS_PRODUCT_BACKLOG_V1.md` (sha256 `b8b71d6bd19f72e5…`) — the two backlog files imported unchanged under this task into `docs/product/`; the sanitised case handoffs beside them were not opened and are not imported |
| Scope | Only: Duplicate Detection · Stale Output Detection · Contradiction Registry Surfacing · Missing Material Surfacing · Correction Propagation |
| Continuity owner | M365 Copilot |
| Date | 23 September 2026 |

**Standing statements.** Plan only. No feature is designed beyond what the FM-A Scope Sheet V1, the Security & Data Architecture Spec V1 and the backlog already state; every "new file" below is a container for behaviour those documents specify. No AI, legal content, sharing or marketplace path is planned. Effort is relative (S / M / L), not time.

---

## 1. Verification of A-034 findings against the code (`668c2dc`)

| A-034 claim | Re-checked | Evidence |
|---|---|---|
| Duplicate Detection MISSING: SHA-256 stored per version, no lookup across documents | **Holds** | `evidence.ts:37,67` store hashes; `acceptUpload` (`evidence.ts:175`) never reads existing hashes; no index or unique on `sha256` in `0001_fma_foundation.sql` |
| Stale Output Detection MISSING: manifests record versions, nothing compares them | **Holds** | `export.ts` exports only `buildExportManifest` and `verifyManifestAgainstStored` (hash match, not version currency); no "stale" symbol in the module |
| Contradiction Registry PARTIAL: table + schema + validation, no function, no screen | **Holds** | `0001:351-369` (`contradictions`, two-reference CHECK); `dispute.ts:268-296`; no `flag_contradiction` in SQL; "contradiction" appears in the UI only as a Fact Card status and a timeline conflict strip |
| Missing Material Registry PARTIAL: table + schema, free-text reason, no screen | **Holds** | `0001:373-381` (`missing_evidence.related_type`, `user_response`); `dispute.ts:296`; no component references `MissingEvidence` |
| Correction Propagation MISSING: `decideProposal` touches no dependants | **Holds** | `proposal.ts` contains no reference to `evidence_relations`, `date_assertions` or exports; the only reference-walking code is `referenceCheck` in `deletion.ts:222-231` |

Additional facts that shape the plan: the branch has 137 Vitest tests and a 54-check smoke suite; the audit writer is a separate DB role so server functions cannot yet write audit rows in-transaction (A-032 M-7, decision D-031 pending); `document_reference_policy` [PROV] defaults to `block`.

## 2. Shared prerequisites (apply to every item)

| Prerequisite | Why | Status |
|---|---|---|
| Merge PR #2 | All reused domain and schema objects live only on the branch | Draft; two A-032 leftovers (m-1, M-8 addendum) |
| FD-02 hosting / region decision and a synthetic staging database | Items 3–5 need server functions and a place to run the smoke suite in CI | Founder decision pending |
| D-031 audit atomicity pattern | Every new server function must emit an audit action (BB2 §3.3); today none can do so in-transaction | Founder decision pending |
| Screen input: Figma FM-A package (A-008) or a decision to build from canonical copy | Items 3 and 4 add screens U12 / U13 | A-008 OPEN |

Anything below marked "no migration" can be built on `0001` as it stands; anything marked "migration" becomes `0002_…` after merge (append-only rule, BB2 §3.3).

## 3. Item plans

### 3.1 Duplicate Detection (WAVE_1, hash level)

Backlog definition: name only. Planned reading, consistent with the Scope Sheet's write-once model: a second upload whose server-computed SHA-256 equals an existing `document_versions.sha256` **in the same tenant** is detected at `completeUpload` time and surfaced to the user as a duplicate of a named document, never silently merged and never rejected automatically (the user may still want a second copy in another dispute).

| Aspect | Plan |
|---|---|
| Existing files reused | `app/src/domain/evidence.ts` (`sha256Hex`, `acceptUpload`, `transitionUpload`, `DocumentVersion`); `app/src/domain/enums.ts` (`CUSTODY_EVENTS`, `AUDIT_ACTIONS`); `app/src/domain/copy.ts` (bilingual copy pattern); `app/tests/domain/evidence.test.ts` |
| Database objects reused | `nyayos.document_versions.sha256` and `documents` (tenant_id, dispute_id, display_label); `custody_events`; `audit_events` catalogue (`document.quarantined` metadata allow-list already includes `sha256`, `document_id`) |
| APIs reused | Scope Sheet A10 `completeUpload` (server computes SHA-256 — the natural detection point); A12 `promoteDocument`; none exist yet as code, so the check is specified into A10's contract |
| UI reused | `EvidenceCard` / `EvidenceWorkspace` (`app/src/components/nyayos/evidence-card.tsx`, `evidence-workspace.tsx`) — a "duplicate of …" chip alongside the existing lifecycle chip; `NotificationBanner` for the notice |
| New files required | `app/src/domain/duplicate.ts` — pure function `findDuplicateVersions(sha256, tenantId, knownVersions)` returning matches with document id, dispute id, label; `app/tests/domain/duplicate.test.ts`; one added check in `db/tests/smoke_0001.sql` |
| Migration required | **Yes, but minimal**: an index on `document_versions (sha256)` (lookup performance; correctness does not depend on it) and the `documents_select_member` policy already covers visibility. Can be deferred: the pure function works without the index. Recommended as `0002_duplicate_index.sql` after merge |
| Risk | **Low.** Read-only check over data already present; no change to canonical tables; false positives impossible at hash level (identical bytes); near-duplicates (re-scans) are explicitly **not** in this item |
| Effort | **S** |
| Order | 1 |

### 3.2 Stale Output Detection (WAVE_0)

Backlog definition: "detect outputs invalidated by newer evidence". Planned reading: an export is *stale* when any item or document version recorded in its manifest is no longer the current version, or when a canonical item it included has since been corrected or deleted. Staleness is **shown**, never auto-regenerated (exports are owner actions, F16).

| Aspect | Plan |
|---|---|
| Existing files reused | `app/src/domain/export.ts` (`ExportManifest.items[].version`, `documents[].version`, `verifyManifestAgainstStored` as the pattern); `app/src/domain/proposal.ts` (`reconcileHistory`, `buildVersionChain` — same shape of comparison); `app/src/domain/copy.ts`; `app/tests/domain/export-deletion.test.ts` |
| Database objects reused | `exports`, `export_manifests.entries` (already store item `version` and document `version`); `user_corrections.resulting_version`; `document_versions.version`; `documents.current_version` |
| APIs reused | Scope Sheet A19 `previewExport` (shows what the export will contain — the natural place to show "the previous export is stale because …"), A21 `getExportUrl` (add a staleness flag to the response), A08 `getDisputeFile` |
| UI reused | U17 export result / manifest view (not built; planned under wave W4 of the A-030 gap report); `StatusChip` for a "superseded" state; `NotificationBanner` |
| New files required | `app/src/domain/staleness.ts` — pure function `assessExportStaleness(manifest, currentItemVersions, currentDocumentVersions)` returning `{ stale: boolean; reasons: [{ targetType, targetId, exportedVersion, currentVersion | "deleted" }] }`; `app/tests/domain/staleness.test.ts`; a SQL view `nyayos.export_staleness` (optional, read-only; can be a query in the server function instead) |
| Migration required | **No** for the domain function and server-side query. **Optional** `0002` for a read-only view; no table change |
| Risk | **Low.** Read-side only; all inputs already recorded; the only design risk is *what counts as invalidating* (any correction vs only confirmed-status changes) — recommend "any newer version" first, refine later |
| Effort | **S** |
| Order | 2 |

### 3.3 Contradiction Registry Surfacing (WAVE_0)

Backlog definition: date, amount, role and version conflicts, visible. Planned reading for this item: **surface what exists** — the write path (A18), the list (U12) and the typed category — with detection limited to what the domain already does (date conflicts via `markConflictingDates`). Automatic detection of amount/role/version conflicts is a separate future item and is not planned here.

| Aspect | Plan |
|---|---|
| Existing files reused | `app/src/domain/dispute.ts` (`Contradiction`, `ItemRef`, `validateContradiction`, `markConflictingDates`); `app/src/domain/proposal.ts` (`proposeChange`/`decideProposal` — a contradiction is a canonical item and enters through the single-writer path); `app/src/domain/copy.ts` (`contradiction_neutral` hi/en already present); `app/src/domain/enums.ts` (`CONTRADICTION_STATUSES`, audit action `contradiction.flagged`) |
| Database objects reused | `nyayos.contradictions` (two-reference CHECK, `status`, `field`); `propose_change` / `decide_proposal` (target type `contradiction` is already in `canonical_target_type`); RLS policy `contradictions_select_member` |
| APIs reused | A18 `flagContradiction` = a thin wrapper over A06/A07 with `validateContradiction` applied before `propose_change`; A08 `getDisputeFile` returns contradictions with status |
| UI reused | `FactCard` `contradiction` status styling (`fact-card.tsx:77`); `TimelineEventCard` conflict strip (`timeline-event-card.tsx:51-59`); `SourcePanel` for the two referenced sources; `StatusChip`; `AppShell` section |
| New files required | `app/src/routes/disputes/$disputeId/review.tsx` (U12 "Information to review"); `app/src/components/nyayos/contradiction-card.tsx` (two sources side by side, neutral copy, Reviewed / Resolved-by-user actions that write through proposals); `app/tests/contradiction.test.tsx`; server function file for A18 when the server layer exists (wave W1 decides its home) |
| Migration required | **No** for surfacing. **Yes (`0002`)** only if the founder adopts the backlog's typed categories: an enum `contradiction_kind (date, amount, role, version, other)` column added to `contradictions` — additive, nullable, no reshaping (CR-1). Recommended to decide before building the card so the chip exists from day one |
| Risk | **Medium.** Depends on the server layer (W1) and screen input (A-008); copy rules FN-16 (neutrality) are testable; the typed-category decision is a founder data-model decision, not a gap fill |
| Effort | **M** |
| Order | 3 |

### 3.4 Missing Material Surfacing (WAVE_0)

Backlog definition: referenced but absent / inaccessible / unreadable. Planned reading: surface `missing_evidence` as U13 "What may still be useful", with the three backlog categories offered as a typed reason **if** the founder adopts them; otherwise free text stays. No negative inference wording (AC-M1-07).

| Aspect | Plan |
|---|---|
| Existing files reused | `app/src/domain/dispute.ts` (`MissingEvidence`, `ItemRef`); `proposal.ts` (single-writer entry); `copy.ts` (add nothing new until wording is decided; "no negative inference" rule already governs); `enums.ts` |
| Database objects reused | `nyayos.missing_evidence` (`expected_item`, `reason`, `related_type`/`related_id`, `user_response`); `propose_change`/`decide_proposal`; RLS `missing_evidence_select_member` |
| APIs reused | A06/A07 (no dedicated Scope Sheet API exists for gaps — record gaps as proposals of target type `missing_evidence`); A08 returns them; A19 `previewExport` already lists "gaps" as an export section (`EXPORT_SECTIONS` includes `gaps`) |
| UI reused | `FactCard` layout, `StatusChip` (`open` / `answered` as U13 states), `NotificationBanner`, `AppShell` |
| New files required | `app/src/routes/disputes/$disputeId/gaps.tsx` (U13); `app/src/components/nyayos/gap-card.tsx` (expected item, reason, related item link, "answer" action writing `user_response` through a proposal); `app/tests/gaps.test.tsx` |
| Migration required | **No** for surfacing. **Yes (`0002`)** only for the typed reason enum `missing_reason (absent, inaccessible, unreadable, other)` if adopted — additive, nullable |
| Risk | **Medium** (same dependencies as 3.3). Wording risk: the screen must never imply an event did not happen; `PROHIBITED_TERMS` guard and FN-16 copy review apply |
| Effort | **M** |
| Order | 4 (built together with 3.3; they share the route shell and card pattern) |

### 3.5 Correction Propagation (WAVE_0)

Backlog definition: "update downstream outputs automatically". **Conflict recorded (A-034 Risks):** the single-writer rule (S3) and "no silent overwrite of a confirmed fact" (Deck slide 9) forbid rewriting dependants. The only form compatible with the canonical invariants is **automatic re-flagging**: when a correction is accepted, every dependant that references the corrected item is set back to `verificationStatus = "pending"` through the proposal path (owner-originated, auto-accepted per A07, correction recorded), and exports that included the item become stale (3.2). The founder must confirm this reading before the build; the plan below assumes it.

| Aspect | Plan |
|---|---|
| Existing files reused | `app/src/domain/proposal.ts` (`decideProposal`, `ownerChange`, `UserCorrection`); `app/src/domain/deletion.ts` (`referenceCheck` / `CanonicalReference` — the enumeration pattern to reuse for reads); `app/src/domain/dispute.ts` (`ItemRef` on `evidence_relations`, `date_assertions.target_id`, `contradictions.itemA/BRef`, `issues.supportingRefs`, `missing_evidence.relatedRef`); `staleness.ts` from 3.2 |
| Database objects reused | `user_corrections` (the trigger event), `evidence_relations.target_type/target_id`, `date_assertions.target_type/target_id`, `contradictions.item_a_*/item_b_*`, `issues.supporting_refs` (jsonb), `missing_evidence.related_*`, `exports` + `export_manifests` |
| APIs reused | A07 `decideProposal` (extension point: after the correction is written, enumerate dependants and raise owner proposals); A08 returns the re-flagged items; no new endpoint |
| UI reused | `FactCard` status `to-review` / `pending`, `NotificationBanner` ("3 items depend on this fact and need your review") |
| New files required | `app/src/domain/propagation.ts` — pure functions `findDependants(target, items)` and `planReflags(dependants)` producing the proposals to raise; `app/tests/domain/propagation.test.ts`; an extension to `nyayos.decide_proposal` (or a separate `nyayos.propagate_correction(p_correction uuid)` function) in a new migration |
| Migration required | **Yes (`0002`)** if done in SQL (new or extended function); **No** if the enumeration runs in the server layer and raises ordinary proposals through `propose_change`/`decide_proposal`. Recommendation: server layer first (no schema change), SQL function later if atomicity is required |
| Risk | **Medium-High.** Semantics decision pending (re-flag vs rewrite); cascading proposals can fan out (an event referenced by many relations); every re-flag is a correction row, so the version chain grows — acceptable but must be shown honestly. Requires the audit-atomicity decision (D-031) to log one `correction.created` per re-flag |
| Effort | **M** (server-layer form) |
| Order | 5 |

## 4. Summary table

| Item | Reuses | New files | Migration | Risk | Effort | Order |
|---|---|---|---|---|---|---|
| Duplicate Detection | `evidence.ts`, `document_versions.sha256`, A10, `EvidenceCard` | `duplicate.ts` + test | Optional index (`0002`) | Low | S | **1** |
| Stale Output Detection | `export.ts`, `export_manifests`, `user_corrections`, A19/A21 | `staleness.ts` + test | No (optional view) | Low | S | 2 |
| Contradiction Registry Surfacing | `contradictions`, `validateContradiction`, A06/A07/A18, `FactCard`, `SourcePanel` | U12 route, `contradiction-card.tsx`, test | No (typed kind: `0002` if adopted) | Medium | M | 3 |
| Missing Material Surfacing | `missing_evidence`, A06/A07, `FactCard`, `StatusChip` | U13 route, `gap-card.tsx`, test | No (typed reason: `0002` if adopted) | Medium | M | 4 |
| Correction Propagation (re-flag form) | `decideProposal`, `referenceCheck` pattern, all `ItemRef` columns, `staleness.ts` | `propagation.ts` + test; optional SQL function | No in server-layer form; `0002` if SQL | Medium-High | M | 5 |

## 5. Explicit identifications

| | Item | Why |
|---|---|---|
| **LOWEST EFFORT** | **Duplicate Detection (hash level)** | Every input exists (server SHA-256 per version); one pure function, one test, one optional index; no server layer, no screen, no decision pending |
| **HIGHEST VALUE** | **Correction Propagation (re-flag form)** | Ranked 6th in the backlog's product principle but it is the item that protects every other artefact from silently going wrong after a correction; it also makes Stale Output Detection meaningful. Its value is highest; its readiness is lowest (semantics decision, server layer, D-031) |
| **FIRST BUILD ITEM** | **Duplicate Detection, immediately followed by Stale Output Detection in the same wave** | Both are pure, read-side, low risk, need no founder decision and no server layer, can be built and tested on the branch today with the existing Vitest and smoke patterns, and together they deliver the backlog's "trustworthy evidence" promise at the two points users first meet it: upload and export |

## 6. Recommended order and gating

1. **Now (on the branch, no prerequisites):** 3.1 Duplicate Detection and 3.2 Stale Output Detection as domain functions with tests; optional `0002_duplicate_index.sql` drafted but not applied.
2. **After PR #2 merge, FD-02 and D-031:** wave W1 server layer; A10 gains the duplicate check; A19/A21 gain the staleness flag.
3. **After screen input (A-008 or founder decision) and founder decision on typed categories:** 3.3 and 3.4 together (shared route shell and card pattern).
4. **After founder confirms the re-flag reading:** 3.5 in the server layer; SQL function only if atomicity is required.

## 7. Risks

| Risk | Mitigation in this plan |
|---|---|
| "Automatically" in Correction Propagation read as rewriting | Plan commits to re-flag-through-proposals only; rewrite would break S3 and the Deck's no-silent-overwrite rule — founder confirmation requested before build |
| Typed categories (conflict kind, missing reason) change the data model | Additive nullable columns in `0002` only if adopted; surfacing does not depend on them |
| Building U12/U13 without the Figma package | Same risk as A-030 R1; mitigated by building from canonical copy and the existing card components, and by the FN-16 copy guard |
| Server layer does not exist | Items 1–2 are pure functions and do not need it; items 3–5 wait for W1 |
| Audit not atomic (M-7) | Every new write path is specified as "one audit action per write"; implementation waits for D-031 |
| Fan-out on propagation | Cap and report the number of re-flags per correction in the banner; never rewrite; version chain growth is honest history |
| Branch not merged | All reuse points are branch-only; if the branch is dropped, every item becomes MISSING on `main` |

## 8. What this plan does not do

It does not implement anything, create code, alter the architecture, decide the typed categories, resolve the propagation semantics, or authorise a build. Build authorisation remains FA-001 (staging) and each item enters through a registry task with CANONICAL inputs.
