# NYAYOS CHANGELOG

Chronological record of changes to the canonical knowledge base.
Newest first. One entry per commit or per material decision.

**Format:** `## YYYY-MM-DD — <summary>` followed by Added / Changed / Decided / Blocked / Notes.

## 2026-09-23 — FM-A foundation build on `feature/fma-foundation-v1`; specification set imported (A-030, A-031)

**Branch, not `main`.** All changes below live on `feature/fma-foundation-v1` (from `main` at `6c6b478ffa1a811ba435d2891b0b3179a3a7043d`) and await a founder-reviewed pull request. No direct `main` commit.

### Added

- **Specifications imported unchanged (A-031, CANONICAL):** Security & Data Architecture Spec V1 (closes A-010 → CANONICAL), Fast Mode Strategy V1, FM-A Scope Sheet V1, Build Brief V2, Counsel Brief V1, FM-0 Concierge Pack V1; verbatim text extracts of the two executive decks (binaries gitignored).
- **`docs/architecture/NYAYOS_FMA_REPOSITORY_ASSESSMENT_A030.md`** — Phase 1 repository assessment, architecture inventory, conflict list, integration strategy.
- **`app/src/domain/`** — 14 TypeScript modules: enums declared in full with FM-A-enabled subsets (CR-3); table registry and deletion allow-list (CR-4); [PROV] configuration; server-built request context; `isDisputeMember` / `grantAllows` (always false in FM-A, CR-2); consent enforcement with `aggregate_analytics` and `model_improvement` hard-locked (S8); personal-tenant sign-up; dispute core with the fixed provenance contract (CR-8); single-writer proposal → correction pipeline and version-chain rebuild (S3, Deck G2); evidence lifecycle state machine — no promotion without a clean verdict, no timeout promotion (S5); hash-chained, content-free audit (S7); export manifest that excludes and lists incomplete provenance (Deck G4); deletion lifecycle with honest status and content-free tombstones (S9, OL-03 interim); bilingual required copy and prohibited-wording guard (FN-16).
- **`app/tests/domain/`** — 8 files, 79 tests. Suite total 132/132.
- **`db/migrations/0001_fma_foundation.sql`** — 39 tables, RLS enabled + forced everywhere, helpers, single-writer functions, audit trigger, allow-list seed, self-check. **Not applied to any environment** (none exists); executed once on an ephemeral local Postgres 16.14 container with synthetic data — **`db/tests/smoke_0001.sql` 41/41 PASS**; three execution-only defects fixed before commit.
- **`scripts/db/schema-lint.mjs`** + **`schema-lint`** workflow — static SEC-RLS-01 / SEC-DEL-06 and TypeScript/SQL twin parity.
- **`docs/architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md`** — U01–U21 READY / PARTIAL / MISSING, S1–S16 coverage with Scope-Sheet-vs-Deck numbering reconciliation, entity diagram, technical risks, implementation waves.

### Changed

- Registry: A-010 → **CANONICAL** (spec delivered and supplied as a build input); A-031 added CANONICAL; A-030 added **REVIEW**; A-008 note — Figma package not found.
- `README.md`, `docs/INDEX.md`, `NYAYOS_STATUS.json`, `NYAYOS_OPERATING_SYSTEM.md` (addendum §27), `app/README.md`, `app/roadmap.md` updated to describe the branch state.

### Found

- **The Figma FM-A source handoff package does not exist** in Downloads, OneDrive, Desktop, Documents or any GitHub repository. Phase 2 (import U01–U21 UI) could not be executed; U01–U21 were mapped against the existing 17 components instead.
- The Executive Architecture Deck and the FM-A Scope Sheet **number S1–S16 differently**; the Scope Sheet numbering is adopted and a cross-map is recorded.
- The Deck's "reference-checked deletion" (block) and the Scope Sheet's SEC-DEL-01 (references removed) disagree; recorded as `document_reference_policy` [PROV], default `block`.
- `app/src/lib/lovable-error-reporting.ts` is an editor-only telemetry shim (inert outside the Lovable preview); retained and documented, not a production claim.

### Not changed

No deployment, no production change, no database provisioned or written, no AI code path, no legal or procedural content, no marketplace or fee path. `main` untouched.

---

## 2026-09-22 — Operating system and status established; decisions D-019–D-030 reconciled (A-029)

### Audited

Read-only alignment audit at `dbd30939c76b5397c479c28ad5260277ca59fbfd` (= `origin/main`, verified by `git fetch`, `git ls-remote`, `gh repo view` — PRIVATE). Inventory: 17 frontend components, 4 test files (53/53 pass, `tsc` clean, `eslint` 0 errors), no schema / migrations / backend / deployment configuration / security documentation.

### Added

- **`NYAYOS_OPERATING_SYSTEM.md`** (root, tier 2) — consolidated operating directive; every claim labelled VERIFIED / REPORTED / UNVERIFIED / NOT IMPLEMENTED / NOT APPLICABLE; gap register ranked P0/P1/P2.
- **`NYAYOS_STATUS.json`** (root) — machine-readable state; `next_assignment` = A-010.
- **`docs/architecture/NYAYOS_ECOSYSTEM_ARCHITECTURE_REVIEW_V1.md`** — founder-supplied, imported unchanged (sha256 `4bd3b5d1…`).
- **Decision Log V1** — appended section "Decisions added 22 September 2026": D-019 Dispute File platform with professional-review layer · D-020 reviewer seat · D-021 communication outline · D-022 evidence-integrity manifest · D-023 purpose-bound sharing · D-024 no lawyer-advertising marketplace · D-025 no lead/success fees · D-026 no paid placement · D-027 no public ratings/win rates/rankings · D-028 no autonomous legal actions · D-029 India-first, nyayos.global defensive · D-030 Security + Data spec next. **No earlier entry edited or deleted**; effects on D-001, D-005, D-008, D-015, D-017, D-018 stated in a table.

### Changed

- A-010 re-scoped as **NyayOS Security + Data Architecture Specification V1** — Claude Chat, Opus with Extended Thinking; research/spec only; deployment not allowed.
- A-028 print corrections marked **paused** (founder materials paused — REPORTED).
- `.gitignore`: `*.pptx`, `*.xlsx` added.
- Dashboard, INDEX, README, registers updated to point at the operating system.

### Found

- **The Master Operating System and Continuity Directive was not supplied** and is not present locally; represented via the instruction's "current verified state" block only.
- **Two foreign-project files** (`EduOS_Founder_Pitch_Deck 1.pptx`, `… 2.pptx`) untracked in `docs/print/exports/pdf/` — not staged, not opened; founder to remove.
- A local **`NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md`** (973 lines, 22 Sep) exists in Downloads — UNVERIFIED, not imported; if it is the A-010 output, supply it.
- Sprint 4 (A-026) is canonical **without a conformance review**.

### Not changed

No code, database, staging or production change. Master Context V1 § 9 left unedited (superseded by the operating system § 22).

---

## 2026-09-21 — Print export completion: 13 PDF + 13 PNG verified (A-027)

### Generated

`docs/print/exports/pdf/*.pdf` and `docs/print/exports/png/*.png` from the 13 HTML sources (`08a00eb`, `d1fe915`) with headless Chrome. Manifest with SHA-256 for all 26 files: `docs/print/exports/NYAYOS_PRINT_EXPORT_MANIFEST.md`.

### Verified

Every PDF opened: page count, MediaBox vs `@page` (all 13 within 0.3 mm), embedded font subsets (Hind Siliguri, Noto Sans), text extraction, blank-page scan, Chromium viewer. Every PNG opened: dimensions vs page width, visual inspection.

### Fixed in source (mechanical, single correct fix)

- `deck-pitch.html` — `@page{size:254mm 143mm landscape}` is invalid CSS; Chrome discarded it and printed **Letter portrait**. Keyword removed. Screen-only `body{padding:6mm}` and slide margins then produced 10 pages with blanks at 2 and 10; a print rule removes them. **Now 8 pages at 254×143.**
- `business-card.html` — three 90 mm cards in a row (286 mm) exceeded A4's 180 mm printable width; the left card was clipped. Cards now stack; one page.

### Left for the author → A-028

Brochure: 4 panels on an A4-landscape "tri-fold" — Chrome shrinks to ~75 %. Mediator and government A5 handouts overrun to a blank/near-blank page 2. Observation sheet breaks mid-section. QR / name / phone placeholders throughout; deck market figures unsourced.

### Repository rules changed

`.gitignore` and `task-gate` now permit `*.pdf` / `*.png` **only** under `docs/print/exports/`; the blanket bans stand everywhere else.

### Process notes

- This work was first prepared as **A-026**; Sprint 4 (parties & timeline) was pushed concurrently under that ID, so the export is **A-027**. Task IDs must be claimed in the registry before work starts to avoid this.
- Commit `f957a43` shipped the exports with a stale manifest because a finalize script failed mid-run; this commit corrects it.
- **Sprint 4 (A-026) is CANONICAL without a conformance review.** A review is owed before Sprint 5.

---

## 2026-09-21 — [auto] Status registry changes

### New tasks

- **A-026** — Sprint 4 — Parties & Entities (S11) and Timeline (S12) · CANONICAL · owner: Lovable

_Generated by `scripts/governance/registry.mjs changelog` from `NYAYOS_STATUS_REGISTRY.json`._

---

## 2026-09-21 — [auto] Status registry changes

### Status transitions

| Task | From | To |
|---|---|---|
| **A-025** Sprint 3 evidence conformance fixes — evidence model remediation | OPEN | **CANONICAL** |

_Generated by `scripts/governance/registry.mjs changelog` from `NYAYOS_STATUS_REGISTRY.json`._

---

## 2026-09-21 — Sprint 3 evidence conformance review: FAIL (conditional) (A-024)

### Reviewed

A-023 evidence components at `296fad81b5a122cb38c360919a14d145ac234c8b`, against Figma Brief § 4 / § 8, Product Spec § 7.4 / 7.5 / 10 / 11 / 17 and US-02. "S08/S09" are the implementer's labels — no canonical screen list exists. No Figma (A-008 OPEN).

### Verdict — FAIL (conditional), narrower than A-021

| Area | Result |
|---|---|
| Document Upload | PASS with fixes — no `accept` / size validation, no pasted-text entry, no drag-over feedback |
| Evidence Locker | FAIL — missing page count, upload date, verification state; only *Remove* of five actions; no *view* |
| Upload states | PASS |
| Processing states | PASS with note — no security-scan state |
| Error states | PARTIAL — Cancel routed to error + `role="alert"`; no *rejected* / *unsupported* |
| Uncategorized states | FAIL — modelled as a lifecycle state; category is an attribute |
| Accessibility | PASS with fixes — 40/43 contrast (three `SourceBadge` opacity failures 4.39 / 4.39 / 3.85); two `<h1>`s |
| Mobile / Tablet / Desktop | PASS — 390 / 834 / 1280, both screens, no overflow, all targets ≥ 44 px |

Also: documents are labelled with **fact** epistemic badges ("Read out by AI", "Stated in a document · \<own filename\>") — a category error against the § 11 provenance contract. Validation re-run: `tsc` · `eslint` 0 errors · `vitest` 34/34 · `vite build` PASS.

### Decided

- **A-024 CANONICAL** — evidence: `docs/design/NYAYOS_SPRINT3_EVIDENCE_CONFORMANCE_REVIEW_A024.md`.
- **A-025 Sprint 3 evidence conformance fixes — OPEN**, inputs A-023 + A-024, FA-001. Items 1–3 change the document model and must precede Timeline / Evidence Mapping.
- Recommendation repeated: **build outputs enter at REVIEW** (A-018, A-020, A-023 all self-declared CANONICAL). Decide A-008.

---

## 2026-09-21 — [auto] Status registry changes

### New tasks

- **A-023** — Sprint 3 — Evidence Components · CANONICAL · owner: Lovable

_Generated by `scripts/governance/registry.mjs changelog` from `NYAYOS_STATUS_REGISTRY.json`._

---

## 2026-09-21 — [auto] Status registry changes

### Status transitions

| Task | From | To |
|---|---|---|
| **A-022** Fact Card conformance fixes | OPEN | **CANONICAL** |

_Generated by `scripts/governance/registry.mjs changelog` from `NYAYOS_STATUS_REGISTRY.json`._

---

## 2026-09-21 — Fact Card design conformance review: FAIL (conditional) (A-021)

### Reviewed

A-020 Fact Card implementation at `bbacbb481a0e8188b2753b68f089f258104ba1c1`, against Figma Brief V2 § 5/6/9, Product Spec § 7.6–7.10/10/11 and A-014 § 3/4.5/11.4. **No Figma design exists** — A-008 remains OPEN; the instruction's "A-008 review" label was corrected to A-021.

### Verdict — FAIL (conditional)

| Area | Result |
|---|---|
| Fact Card states | FAIL — Confirm / Uncertain / Not relevant **actions** do not exist; only *Correct this* |
| Source provenance | FAIL — hidden behind "Show sources"; value is the dominant text (Spec § 7.6; Brief § 5 hierarchy rule) |
| Date precision | PASS |
| Contradictions | PARTIAL — side-by-side, neutral, unresolved ✓; no confirm/resolve/leave actions; copy promises them |
| Confidence bands | PARTIAL — `Unknown` missing |
| Inline corrections | PASS |
| Accessibility | PASS with fixes — contrast 25/27 (two opacity failures: 4.39, 3.97); dangling `aria-controls` when collapsed; NVDA pass still owed |
| Mobile / Tablet / Desktop | PASS — 390 / 834 / 1280, no overflow, contradictions stack on mobile, all targets ≥ 44 px |

Validation re-run: `tsc` PASS · `eslint` 0 errors · `vitest` 23/23 · `vite build` PASS.

### Also found

A-014 § 11.4 item 2 (split `document-extracted` → document-fact + ai-extraction; add `unverified-claim`) was **not delivered by A-018**, though A-018 is CANONICAL. Confidence-band hues reuse status/provenance hues, extending the A-014 hue-overload finding rather than fixing it.

### Decided

- **A-021 CANONICAL** — evidence: `docs/design/NYAYOS_FACT_CARD_CONFORMANCE_REVIEW_A021.md`.
- **A-022 Fact Card conformance fixes — OPEN**, inputs A-020 + A-021, authorized under FA-001, may start now. Ten items; 1–3 blocking.
- **A-015** now planned on A-008 **and** A-022.
- Recommended rule clarification: build outputs enter at **REVIEW**; a conformance review promotes them.

---
## 2026-09-21 — [auto] Status registry changes

### New tasks

- **A-020** — Fact Card system — provisional staging implementation · CANONICAL · owner: Lovable

_Generated by `scripts/governance/registry.mjs changelog` from `NYAYOS_STATUS_REGISTRY.json`._

---

## 2026-09-21 — [auto] Status registry changes

### Status transitions

| Task | From | To |
|---|---|---|
| **A-018** Sprint 1.1 — State Completion | OPEN | **CANONICAL** |

_Generated by `scripts/governance/registry.mjs changelog` from `NYAYOS_STATUS_REGISTRY.json`._

---

## 2026-09-21 — Repository Automation Foundation (A-019)

### Added

- **`docs/founder/NYAYOS_STATUS_REGISTRY.json`** — machine source of truth for task status and dependencies; 19 tasks seeded from the registers (A-001 → A-019).
- **`scripts/governance/registry.mjs`** — zero-dependency validator and generator: `validate` · `generate [--check]` · `changelog --previous` · `all`.
- **Generated:** `NYAYOS_STATUS_REGISTRY.md`, `NYAYOS_DEPENDENCY_GRAPH.md` (Mermaid; solid = canonical inputs, dashed = planned), `NYAYOS_STATUS_DASHBOARD.md`.
- **`NYAYOS_CANONICAL_STATUS_RULES.md`** — tier 2. Flow `OPEN → IN_PROGRESS → REVIEW → CANONICAL → SUPERSEDED`; rule: only CANONICAL tasks may be `inputs`; `planned_inputs` pin a task at OPEN.
- **Workflows:** `task-gate` (validate registry, refuse stale derived docs, require A-nnn in PRs, private-data guard) · `dependency-check` (typecheck/lint/test/build on `app/`, advisory audit and unused-dependency watch, asserts no deploy step) · `status-update` (on registry change: regenerate + auto changelog entry, delivered as a **PR** because `main` is protected).
- **`.github/pull_request_template.md`** — assignment ID, gate, status rules, private-data check, registers, evidence.
- **`NYAYOS_BRANCH_PROTECTION.md`** — protection **applied**: required checks `task-gate` + `dependency-check` (strict), no force-push, no deletion; ruleset **#23748706** (deletion, non-fast-forward). `enforce_admins` off until first green runs — closing command recorded.

### Changed

- Assignment register: A-014 status corrected to COMPLETE; A-011 row corrected to CANONICAL; A-019 recorded (REVIEW).
- Authority hierarchy: status rules + registry added at **tier 2**.
- CONTRIBUTING § 5 and § 7: status flow, registry-first procedure, protected-branch PR process.
- Founder Dashboard: links to the machine view; F-6; next action 4d.

### Workflow evidence

| Workflow | Commit | Run | Result |
|---|---|---|---|
| `task-gate` | `8063e19` | [35558897611](https://github.com/rmanish2000-del/nyayos/actions/runs/35558897611) | ✅ success — first run |
| `dependency-check` | `8063e19` | [35558897628](https://github.com/rmanish2000-del/nyayos/actions/runs/35558897628) | ❌ typecheck/lint/test/build **passed**; failed at its own "no deploy" assertion, which self-matched |
| `status-update` | `8063e19` | [35558895220](https://github.com/rmanish2000-del/nyayos/actions/runs/35558895220) | ❌ workflow parse error — column-0 lines terminated a `run: \|` block |
| `task-gate` | `bd31394` | [35559156273](https://github.com/rmanish2000-del/nyayos/actions/runs/35559156273) | ✅ success |
| `dependency-check` | `bd31394` | [35559156205](https://github.com/rmanish2000-del/nyayos/actions/runs/35559156205) | ✅ success — fix: assertion matches command invocations only |
| `status-update` | `bd31394` (manual dispatch) | [35559678977](https://github.com/rmanish2000-del/nyayos/actions/runs/35559678977) | ✅ success — derived docs already in sync, no PR (correct) |
| `status-update` | `449d94e` (A-019 → CANONICAL) | [35559734656](https://github.com/rmanish2000-del/nyayos/actions/runs/35559734656) | attempt 1 ❌ `gh pr create` refused — repo setting *Allow Actions to create PRs* was off · **attempt 2 ✅** after enabling it → **[PR #1](https://github.com/rmanish2000-del/nyayos/pull/1)** opened by `github-actions` with the first `[auto]` changelog entry (one file, +12 lines) |
| `task-gate` | `449d94e` | [35559734638](https://github.com/rmanish2000-del/nyayos/actions/runs/35559734638) | ✅ success |

Branch protection observed working on every push: `remote: Bypassed rule violations for refs/heads/main: 2 of 2 required status checks are expected` — admin bypass as designed; **enable `enforce_admins` next** (NYAYOS_BRANCH_PROTECTION.md § 3).

### Auto-generated changelog entries

From this point, status transitions in the registry are appended here automatically by `status-update` as `[auto]` entries, delivered by PR. The first is triggered by this commit (A-019 REVIEW → CANONICAL).

---

## 2026-09-21 — Sprint 1 Foundation imported and CANONICAL; A-014 executed; GO (conditional) for Sprint 2 (A-017)

### Imported

`nyayos-sprint1-foundation.zip` (supplied after an initial blocked attempt the same day) → `app/`. 83 files. ZIP SHA-256 `8c407630616f171b33d2be60671213c4b07b5ceb65fce0a877954b17a3ea83ca` — **recorded, not verified** (no expected value supplied). Integrity test clean; no path traversal; no `.env`; no `node_modules`.

### Scanned — PASS

Secrets (pattern-based) · private-matter / PII · EduOS cross-contamination · banned copy (also guarded by test). One external endpoint: Google Fonts.

### Validated — 4/4 PASS

`tsc --noEmit` (after `routeTree.gen.ts` generation — omitted from export, now committed) · `eslint .` 0 errors / 7 benign warnings · `vitest run` 12/12 · `vite build` 1,942 modules. **Nothing deployed** — build emits Cloudflare config; `nitro deploy` not run.

### Reviewed — A-014 § 11 executed against source

- **Typography-drift finding RETRACTED.** Artefact uses Noto Sans / Noto Sans Devanagari / Noto Sans Mono, tokenised and test-guarded. Hind Siliguri deliberately unused.
- **High:** state enums incomplete vs Product Spec — no `uncertain` / `not-relevant` / `corrected` status; `document_fact` conflated with `ai_extraction`; no `unverified_claim`; no `unknown` date precision; no confidence-band component; no inline-correction input. All additive.
- **High until run:** contrast audit and screen-reader pass.
- **Medium:** provenance and status share hue families; Google Fonts CDN privacy; unused dependency surface incl. `chart.tsx`.
- Strong: semantic tokens, enum-driven primitives, a11y baseline, complete dark mode, banned-language test.

### Decided

- **Sprint 1 is CANONICAL** — with recorded gaps.
- **Sprint 2: GO (conditional)** on **Sprint 1.1 — State Completion** (A-018, seven items) landing first. Supersedes the NO-GO of the blind review.
- **FA-001 code-location item closed as option (b)** — code lives in this repository at `app/`. Repository is documentation + code. Addendum appended to the Founder Authorization Record (append-only).
- `app/bun.lock` is the lockfile of record; npm's lockfile gitignored.

### Added / changed

- `app/` · `app/src/routeTree.gen.ts` · `.gitignore` app section · `docs/handoffs/NYAYOS_CONTINUITY_HANDOFF_V2.md` · A-014 § 11 · FA-001 addendum · authority hierarchy **tier 8 (code)** · README, CONTRIBUTING, INDEX, Dashboard, both registers.

### Not supplied — still open

Staging URL (**staging not verified**) · Sprint 1 screenshots · expected checksum · build owner · D-019 typography decision in the Decision Log.

---

## 2026-09-21 — Sprint 1 Foundation review: BLOCKED on artefact; NO-GO (conditional) for Sprint 2 (A-014)

### Reviewed

Lovable reported Sprint 1 Foundation complete (tokens, buttons, inputs, chips, badges, banners, progress, navigation, accessibility baseline). A pre-Sprint-2 architecture review was requested.

**The artefact could not be located** — not in the canonical repo (documentation only, by design), the workspace, Downloads, or any of the 50 repos on the GitHub account. The FA-001 open item *"where does staging code live?"* was never closed; Sprint 1 was completed anyway.

### Added

- `docs/architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md` — review record with: what is needed to run the review (§ 2); the load Sprint 1 must bear, cited to the canonical spec (§ 3); a 50-point acceptance checklist across architecture, design system, WCAG 2.2 AA, state sufficiency and Fact Card readiness (§ 4); findings available from the repository alone (§ 5).

### Findings without the artefact

1. **Typography is undocumented** in every canonical doc; the reported Libre Baskerville + IBM Plex is Lovable's default filling an unrecorded decision. Libre Baskerville has no Devanagari. **High.** Must be fixed at the token layer before Fact Cards.
2. The canonical reference **"Hind Siliguri" is the Bengali member of the Hind family**; Devanagari coverage is *Hind* or *Noto Sans Devanagari*. Flagged for founder confirmation before it becomes a token.
3. A gated deliverable is invisible to the source of truth. **Critical (process).**
4. The state taxonomy (8 epistemic types, 5 date precisions, 5 evidence relations, 4 confidence bands) is fully enumerated in the Product Spec — the review has a fixed target. Favourable.

### Decided

- **Sprint 2 build: NO-GO (conditional).** Four conditions to convert to GO in review § 9. Sprint 2 **design** in Figma may proceed now.
- Ratings for architecture, accessibility and design system: **UNRATED** — no artefact. Process/continuity: **CRITICAL**.

### Open items requiring founder input

1. Supply the Sprint 1 artefact — recommended: Lovable → GitHub sync → private `nyayos-app`.
2. Record the typography decision (D-019 candidate) — Indic face, Latin face, fallback, minimum sizes.
3. Confirm Hind Siliguri vs Hind / Noto Sans Devanagari.
4. Close the FA-001 code-location item.

---

## 2026-09-21 — Staging build authorized; authority hierarchy established (A-013)

### Decided — FA-001

Gate posture changed by founder instruction:

| | Old | New |
|---|---|---|
| Staging build | **Not allowed** | ✅ **ALLOWED** |
| Production | Not allowed | ⛔ **NOT ALLOWED** *(unchanged)* |

Recorded as **FA-001** in the new Founder Authorization Record. Assignment **A-011** (Lovable staging build) is unblocked for **staging only, fixture data only**. New assignment **A-012** (production) created and gated on **FA-002**, which is not granted.

The previously recorded sequence placed the build *after* Figma V2 and WTP validation. Those remain **Pending** — the build now runs in parallel with them. Elevated risks **R25, R13, R14, R24, R12** are recorded in FA-001 § *Risk note*, with a mitigation that does not require reversing the authorization.

### Added

- `docs/founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md` — **tier 1 authority for all gates.** Append-only; supersede with a new FA entry, never edit a past one.
- `docs/product/NYAYOS_MVP_RECONCILIATION_V3.md` — tier 7 consolidation of the MVP position at V3.
- **Document authority hierarchy** (tiers 1–7) in `docs/INDEX.md`, with the three rules that follow from it.

### Changed

- **Dashboard** — new gate-status banner; phase → *Design Preparation → Staging Build*; objective revised; new active-work item **F-3 Lovable staging build (authorized)**; stage progress; § K next actions now **parallel, not sequential**; § L deployment status.
- **README** — staging/production split in the *Read this first* table; stage table; next actions; conventions now point at the authority hierarchy.
- **CONTRIBUTING** — hard rules now say *No production* rather than *No deployment*; § 8 gates table rewritten with five explicit gates.
- **INDEX** — header gate line; authority hierarchy; build brief marked **RELEASED (staging only)**; next actions.
- **Assignment register** — A-011 unblocked; A-012 added; A-013 recorded; M365 Copilot handoff item 4 updated.
- **Output register** — build brief **HELD → RELEASED**; two new artefacts recorded.

### Notes — open items requiring founder input

1. **No `MVP_RECONCILIATION_V3` source document was supplied.** None exists in the workspace, Downloads or the repository, and there is no V1 or V2 to succeed. The V3 file was written as a consolidation of already-recorded positions, introducing **no new product decisions**. A founder-held V3 supersedes it.
2. **Where does staging code live?** Product code must **not** be committed to this repository until this is recorded. Default until then: Lovable's own repository; this repository stays documentation-only.
3. **Who owns the staging build?** A-011 has no assigned owner.
4. Items 1–4 from the 2026-09-20 entry remain open.

---

## 2026-09-20 — Repository initialization (A-007)

### Added — repository scaffolding

- `README.md` — repository entry point.
- `CONTRIBUTING.md` — contribution rules and private-data rules.
- `.gitignore` — private-data, credential and binary exclusions, with an explicit private-data warning.
- `docs/INDEX.md` — full document map.
- `/docs` structure: `founder/`, `product/`, `architecture/`, `research/`, `design/`, `implementation/`, `evaluation/`, `handoffs/`.

### Added — founder continuity records

- `docs/founder/NYAYOS_FOUNDER_DASHBOARD.md`
- `docs/founder/NYAYOS_ASSIGNMENT_REGISTER.md` — A-001 to A-007; open A-008 to A-011.
- `docs/founder/NYAYOS_OUTPUT_REGISTER.md`
- `docs/founder/NYAYOS_CHANGELOG.md` — this file.

### Changed — document placement only

15 existing documents were moved into the `/docs` structure. **No substantive content was changed in any supplied document.**

Two non-substantive changes were made, both recorded:

| Change | Reason |
|---|---|
| V1 bundle `README.md` → `docs/handoffs/NYAYOS_V1_DELIVERABLES_README.md` | Filename collision with the repository root README. Content unchanged |
| Documents moved out of `NYAYOS_V1_REVISED_DELIVERABLES/` and the workspace root into `/docs` | Repository structure required by the initialization brief |

**Deliberately not changed:**

- Legacy `NYAYAOS_*` research filenames — retained per `NYAYOS_MASTER_CONTEXT_V1.md` § 2 ("retain those filenames where provenance matters") and because the decision log cites them by name.
- `NYAYAOS_INDIAN_JUSTICE_MAP.md.md` double extension — retained for the same reason.
- `citeturn…` model citation artefacts in the decision log and master product spec — editing them would touch supplied content.

### Decided

- Canonical project name is **NyayOS** for all new work.
- Repository is **documentation only**. No product code, no schema, no database resources, no deployment.
- Lovable staging build (A-011) is **blocked** pending a recorded founder go decision.

### Changed — repository visibility PUBLIC → PRIVATE

The canonical repository was found to be **public** during the pre-commit check. Four supplied documents reference the founder-controlled private criminal matter by name in governance context, so pushing to a public host would have been an irreversible disclosure.

The push was **held** and the decision escalated to the founder, who directed: make the repository private, then push.

Sequence: visibility changed to **PRIVATE** and verified → `main` pushed. **No NyayOS content was ever publicly visible** — the repository was empty for its entire public lifetime.

Standing constraint recorded in `README.md` and `CONTRIBUTING.md` § 2: do not make this repository public without a completed redaction review recorded as a decision.

### Notes — open items requiring founder input

1. Tool and mode for assignments A-002 to A-006 are **not recorded** and were not guessed.
2. The decision log cites `NYAYAOS_MVP_SELECTION_REPORT(1).md`; the workspace file is `NYAYAOS_MVP_SELECTION_REPORT.md`. Assumed identical — confirm no second variant exists.
3. The commercial wedge appears as **locked** in the decision log and **provisional** in the master context. Recorded, not resolved.
4. Whether the private matter name should be redacted from committed documents.

---

## Earlier — pre-repository

Work completed before version control existed is recorded in `NYAYOS_ASSIGNMENT_REGISTER.md` (A-001 to A-006) rather than here, because commit-level history does not exist for it.

| Date | Milestone |
|---|---|
| 2026-09-20 | V1 revised deliverables package produced after the full source package was received (A-006) |
| 2026-09-20 | Architecture review reconciled; prior "architecture review missing" blocker cleared (A-005) |
| 2026-09-20 | Red team, global benchmark, Indian justice map, MVP selection completed (A-001 to A-004) |
