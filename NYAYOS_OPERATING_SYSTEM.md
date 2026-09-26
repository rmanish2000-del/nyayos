# NYAYOS OPERATING SYSTEM

**Project:** NyayOS · **Version:** 1.0 · **Date:** 22 September 2026 · **Maintainer:** Repository Alignment Auditor and Continuity Maintainer (Claude Code) · **Assignment:** A-029
**Audit base:** commit `dbd30939c76b5397c479c28ad5260277ca59fbfd` on `main` of `https://github.com/rmanish2000-del/nyayos` (private)

**Authority:** tier 2. This is the consolidated operating directive. It **defers** to the [Founder Authorization Record](docs/founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) (tier 1) on every gate and to the [Decision Log](docs/founder/NYAYOS_DECISION_LOG_V1.md) on every decision; it **supersedes** [Master Context V1 § 9](docs/founder/NYAYOS_MASTER_CONTEXT_V1.md) as the current statement of decision state. Machine-readable twin: [`NYAYOS_STATUS.json`](NYAYOS_STATUS.json).

**Evidence labels used on every claim**

| Label | Meaning |
|---|---|
| **VERIFIED** | Checked by the maintainer against the repository, a command result, or a primary source on 22 Sep 2026 |
| **REPORTED** | Stated by the founder instruction of 22 Sep 2026 or by a supplied document; not independently checked |
| **UNVERIFIED** | Asserted somewhere, could not be checked from the repository or local environment |
| **NOT IMPLEMENTED** | Decided or specified, but no artefact exists |
| **NOT APPLICABLE** | The question does not arise at this stage |

> **Directive provenance.** The instruction names a document, *NYAYOS Master Operating System and Continuity Directive*, as attachment 1. **That document is not in the repository, the working copy, Downloads or OneDrive.** Its content is represented here only through the instruction's "Current verified state" block, labelled REPORTED. Supplying the directive itself is an open item (§ 23).

---

## 1. Mission

**Justice starts with clarity.** — VERIFIED (Founder Dashboard § A)

NyayOS turns unstructured disputes into structured, evidence-linked, human-reviewable dispute files, and becomes the trusted system of record for a dispute **before and around** professional engagement. — VERIFIED (Dashboard § B) + REPORTED (Ecosystem Review § 1.2)

## 2. Current verified product definition

| Element | Value | Status |
|---|---|---|
| Strategic product | **Dispute File platform with a professional-review layer.** Not a lawyer-advertising marketplace | REPORTED (founder instruction 22 Sep; Ecosystem Review § 1.2) → recorded as **D-019** |
| MVP capability | **Dispute Readiness Engine** — the "What happened?" journey: Facts → Parties → Timeline → Evidence → Evidence-to-fact mapping → Missing evidence → Contradictions → Issue → Verified information → Possible paths → Action plan → Human review → Export | VERIFIED (D-001; Master Context § 5; Product Spec) |
| Primary user / payer | Small-business / FPO / professional dispute owner; business payer hypothesis | VERIFIED as decided (D-006, D-007); **UNVERIFIED as market fact** (A-009 OPEN) |
| Launch category | Vendor-payment and commercial-service disputes; consumer as sandbox / Phase 2 | VERIFIED (D-003 provisional, D-004) |
| Criminal matters | Private evaluation only; never a public product | VERIFIED (D-005, D-017) |
| Evidence doctrine | `user claim` → `verified fact` → `AI inference` remain distinct objects; AI assists, humans decide | VERIFIED (D-008, D-012) |

## 3. Revised MVP

Canonical Readiness Engine **plus four additions**, each a property of the Dispute File rather than a new actor: — REPORTED (founder instruction; Ecosystem Review § 4.1) → **D-020 – D-023**

1. **Reviewer seat** — owner invites a named professional; scoped, revocable, read-and-comment; comments become suggestions the owner accepts or rejects; reviewer identity self-declared, shown as "not verified by NyayOS".
2. **Communication outline** — Tier-0 outline of points, documents and questions; **not** a sendable notice.
3. **Evidence-integrity manifest** — SHA-256 + server ingest timestamp per original, custody log, hash manifest in every export.
4. **Purpose-bound sharing** — every share bound to an enumerated purpose, scope and expiry; revocable; access list visible to the owner.

**Implementation status of the revised MVP:** NOT IMPLEMENTED. What exists in `app/` is a frontend staging foundation (§ 8); none of the four additions, and no persistence, exist. — VERIFIED

## 4. Long-term ecosystem boundary

REPORTED (Ecosystem Review § 2, § 12, § 19). Ratified by founder instruction only to the extent of § 2–3 and § 5 of this document; the phase content below is the review's recommendation, not a locked plan.

| Horizon | Scope | Build posture |
|---|---|---|
| MVP (0–6 months after build authorisation) | § 3 | Build |
| Architect now, build later | Review-gate engine, professional identity, policy/jurisdiction adapter, consent purpose catalogue, engagement state machine, published Dispute File schema | Interfaces and policy flags only; no tables until the phase starts |
| Phase 2 | Tier-1 drafts with reviewer in loop; organisation panels; advocate SaaS (flat) | Legal opinion first |
| Phase 3 | Advocate verification; engagement lifecycle; private feedback; mediation module; NALSA/DLSA routing; public directory **only if legally cleared** | Legal opinion + partners first |
| Phase 4 | eCourts context connectors; published API; payment readiness; second jurisdiction pack | Integration security review first |
| Never | § 5 | — |

## 5. Permanently rejected capabilities

REPORTED (founder instruction 22 Sep 2026) → **D-024 – D-028**. These are not "deferred"; they are rejected.

- Lawyer-advertising marketplace (ranked, reviewed, pay-to-appear) in India
- Lead fees, per-contact fees, success fees, revenue share on engagements
- Paid placement, listing-for-visibility
- Public advocate ratings or reviews, win-rate / success-rate / disposal metrics, "best lawyer" rankings
- Autonomous send, file, sign or approve of any output by NyayOS
- Public criminal-matter product or drafting (D-005 reaffirmed)
- Training on private files without separate explicit consent (D-017 reaffirmed)

## 6. Canonical repository and branch

| | Value | Status |
|---|---|---|
| Repository | `https://github.com/rmanish2000-del/nyayos` | VERIFIED (`git remote -v`; `gh repo view`) |
| Visibility | PRIVATE | VERIFIED (`gh repo view --json visibility`, 22 Sep 2026) |
| Canonical branch | `main`, tracking `origin/main` | VERIFIED |
| Protection | Required checks `task-gate` + `dependency-check` (strict); force-push and deletion blocked; ruleset #23748706; `enforce_admins` **off** | VERIFIED (API, 22 Sep 2026) |
| Audit starting HEAD | `dbd30939c76b5397c479c28ad5260277ca59fbfd` = `origin/main` = `ls-remote` head | VERIFIED |

## 7. Current repository state

VERIFIED by `git ls-files` and read-only inspection, 22 Sep 2026.

| Area | Contents |
|---|---|
| Governance (`docs/founder`) | Authorization Record (FA-001 + addendum), Decision Log V1 (D-001–D-018 + § 22 Sep additions), Risk Register V1 (R01–R30), Master Context V1, Status Registry (JSON + generated views), Canonical Status Rules, Branch Protection, Dashboard, Assignment/Output Registers, Changelog |
| Product / architecture | Master Product Spec V1; Architecture Review (tier 5, constrained by Continuity Handoff V1 reconciliation); **Ecosystem Architecture Review V1 (imported 22 Sep)**; Sprint 1 review (A-014) |
| Design / evaluation / handoffs | Figma Brief V2; Fact Card and Evidence conformance reviews (A-021, A-024); Real-Case Evaluation Protocol V1; 90-Day Validation Plan V1; Continuity Handoffs V1/V2; Lovable Build Brief V1 |
| Research | Red Team, Global Benchmark, Indian Justice Map, MVP Selection (legacy `NYAYAOS_` filenames retained for provenance) |
| Code (`app/`) | TanStack Start · React 19 · Tailwind v4 · Vitest. 17 foundation components (tokens, buttons, inputs, chips, badges, banners, progress, shell, Fact Card, Source Panel, Evidence Card/Workspace, Party Card, Timeline Event Card, Parties-Timeline Workspace), 4 test files, 2 public assets |
| Print collateral (`docs/print`) | 13 HTML sources; 13 PDF + 13 PNG exports with checksummed manifest (A-027) |
| CI (`.github`) | `task-gate`, `dependency-check`, `status-update`; PR template |
| Governance tooling | `scripts/governance/registry.mjs` |
| **Absent** | Database schema · migrations · Supabase configuration · backend · deployment configuration (Nitro emits Cloudflare config at build time; gitignored) · security documentation · environment values (`.env.example` names only) · Figma design file (A-008 OPEN) |

**Working-copy contamination (not tracked, not staged):** two files `docs/print/exports/pdf/EduOS_Founder_Pitch_Deck 1.pptx` and `… 2.pptx` — foreign-project material inside the NyayOS working copy. — VERIFIED. Not opened, not staged; `*.pptx` added to `.gitignore`; founder to remove (§ 23).

## 8. Environments

| Environment | Status |
|---|---|
| Local development (`app/`, `npm run dev`) | VERIFIED working (dev server run for A-021/A-024 reviews) |
| Lovable staging workspace | REPORTED (register entries A-011, A-020, A-023, A-026 claim Lovable builds and responsive checks). **No staging URL has ever been supplied to the maintainer; not verified** |
| Staging deployment (public URL) | UNVERIFIED — none supplied |
| Production | NOT IMPLEMENTED — **NOT ALLOWED** (FA-001; FA-002 not granted) |

## 9. Deployment ownership

| Item | Value | Status |
|---|---|---|
| Authorised environments | Staging only | VERIFIED (FA-001) |
| Deploy actor | None authorised for production. Staging builds occur inside Lovable, owned by the founder's Lovable account | REPORTED |
| Deploy from this repository | None. `dependency-check` asserts no deploy command exists in any workflow | VERIFIED |
| Production gate | **FA-002**, not granted; conditions in FA-001 § *Conditions for the next gate* | VERIFIED |

## 10. Database ownership

| Item | Value | Status |
|---|---|---|
| Decided platform | Supabase Postgres + Auth + Storage + RLS; pgvector subject to benchmark; tenant + membership model; case vs authority corpus separation | VERIFIED (D-009–D-012) |
| Provisioned database | **None.** No schema, migrations or Supabase project in the repository | VERIFIED — NOT IMPLEMENTED |
| Database writes | NOT ALLOWED for maintainer assignments | VERIFIED (instruction) |
| Owner of future provisioning | Founder (Lovable Cloud account) | REPORTED |

## 11. Architecture

VERIFIED as decided; NOT IMPLEMENTED beyond the frontend foundation.

- **Stack:** TanStack Start (React 19, Vite) on an edge runtime; Supabase; server-side AI gateway; append-only audit; closed tool catalogue. Source: Architecture Review, **as constrained by** the Continuity Handoff V1 reconciliation table (five decisions modified / provisional / deferred / rejected).
- **Workflow:** deterministic state machine with bounded, schema-validated AI tasks — not an open-ended agent (D-008). `INTAKE → EXTRACT → CONFIRM → TIMELINE → EVIDENCE_MAP → ISSUE → RETRIEVE → ACTION_PLAN → EXPORT`.
- **Domain architecture (REPORTED — Ecosystem Review § 17):** modular monolith; bounded Postgres schemas `identity · dispute · evidence · authority · workflow · drafts · sharing · review · professional · policy · audit · export`, with `engagement` and `feedback` reserved (no tables until their phase). A **policy/jurisdiction adapter** answers every regulatory question; no hard-coded rules.
- **Frontend foundation (VERIFIED):** semantic design tokens; enum-driven provenance primitives (status, source, date-precision, confidence-band); Fact Card with Confirm / Uncertain / Not relevant / Correct actions and always-visible provenance strip (after A-022); Evidence Card with lifecycle separated from category (after A-025); Parties and Timeline cards (A-026, **unreviewed**).

## 12. Security model

| Control | Status |
|---|---|
| RLS on every tenant table, explicit grants, server-side authorization, signed URLs, no public buckets | VERIFIED as decided (Build Brief § 8; D-009/D-011) — NOT IMPLEMENTED |
| Secrets server-only; none in browser; none in logs | VERIFIED as decided — `.env.example` carries names only (VERIFIED) |
| Prompt-injection isolation; no retrieved document treated as instructions | VERIFIED as decided (R06) — NOT IMPLEMENTED |
| Append-only audit; no document content in logs | VERIFIED as decided (R17) — NOT IMPLEMENTED |
| Model-vendor no-training terms; India-region preference | VERIFIED as decided (R21) — NOT IMPLEMENTED |
| Per-dispute keys, cryptographic erasure, deletion verification | REPORTED (Ecosystem Review § 15) — NOT IMPLEMENTED |
| Repository controls | VERIFIED: branch protection; CI private-data and credential guard; `.gitignore` blocks case-file types, credentials, env files; PDF/PNG permitted only under `docs/print/exports/` |
| **Security + Data Architecture Specification** | **NOT IMPLEMENTED in the repository.** A file `NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md` (973 lines, dated 22 Sep 2026, self-described as Claude Chat output) exists in the founder's Downloads — **UNVERIFIED**, not supplied for this audit, not imported (§ 23) |

## 13. Legal-domain safeguards

VERIFIED as decided unless marked.

- Human decision authority; AI never decides, predicts outcomes, scores bail or credibility (D-008; aligns with SC draft AI regulations — REPORTED [D]).
- No unsupported legal claim; citation verification; refusal (R01, R07); no invented deadlines (R08); contradictions flagged, never resolved (R05).
- No legal representation, no autonomous filing/negotiation (Product Spec § 12; **D-028**).
- Advocate-facing mechanisms must pass one test: *does the advocate's payment to NyayOS rise with the number of clients NyayOS sends them?* If yes → reject. — REPORTED (Ecosystem Review § 14) → **D-025/D-026**
- Rule 36 (no solicitation/advertising), Rules 20/21/37 (no contingent fees, no trafficking in claims, no aiding unauthorised practice) — REPORTED [V] in Ecosystem Review § 14 against S1–S3; **not re-verified by the maintainer**.
- Copy review is a compliance control (R26, R28): no "best lawyer", "top-rated", "win".
- Vulnerable-user routing to human help / NALSA (D-014; REPORTED § 15).
- **Written legal opinion** on reviewer seat, panels, directory, engagement request, advocate SaaS pricing, self-help drafting — **not obtained** (Ecosystem Review § 23 item 1; founder-only act).

## 14. User roles

| Role | MVP | Status |
|---|---|---|
| Dispute owner (business / FPO / professional) | Yes | VERIFIED (D-006) — NOT IMPLEMENTED |
| Organisation member (tenant membership) | Yes | VERIFIED (D-011) — NOT IMPLEMENTED |
| Reviewer (invited professional; self-declared identity; scoped, revocable) | Yes — **new** | REPORTED → D-020 — NOT IMPLEMENTED |
| Neutral / mediator | Phase 3 | REPORTED — NOT IMPLEMENTED |
| Verified advocate (registry) | Phase 3 | REPORTED — NOT IMPLEMENTED |
| Consumer / citizen | Sandbox only | VERIFIED (D-004) |

## 15. Core journeys

1. **"What happened?" → Dispute File → export** (§ 2) — VERIFIED as specified; frontend cards for facts, evidence, parties, timeline exist (VERIFIED); intake, extraction, persistence, export do not (NOT IMPLEMENTED).
2. **Invite a reviewer → scoped share → comments → owner accepts/rejects** — REPORTED (D-020, D-023) — NOT IMPLEMENTED.
3. **Communication outline** from confirmed facts — REPORTED (D-021) — NOT IMPLEMENTED.
4. **Correct / delete / export / share / stop sharing** with visible access list (Figma Brief § 17) — VERIFIED as specified — NOT IMPLEMENTED.

## 16. Commercial model

| Model | Position | Status |
|---|---|---|
| One-time dispute-file fee (client) | Test first | VERIFIED (D-018) |
| Organisation subscription | Preferred | REPORTED (§ 13) |
| Advocate SaaS — flat, independent of platform-sourced engagements | Preferred, Phase 2+ | REPORTED → constraint recorded in D-025 |
| Enterprise / institutional licences | Preferred, Phase 3 | REPORTED |
| Lead fees · success fees · listing fees · paid placement · advertising · data sale | **Rejected permanently** | REPORTED → D-024–D-027 |
| Willingness to pay | **No evidence** | UNVERIFIED (A-009 OPEN; R13, R14 High) |

## 17. Tool responsibilities

| Tool | Responsibility | Status |
|---|---|---|
| M365 Copilot | Continuity owner; orchestration; receives every handoff | REPORTED |
| Claude Code | Repository maintenance, governance, conformance reviews, exports; documentation-only commits | VERIFIED (A-007…A-029) |
| Claude Chat (Opus, extended thinking) | Research and specification: Ecosystem Review V1; **next: Security + Data Architecture Specification V1** | REPORTED / VERIFIED (next assignment, § 26) |
| Lovable | Staging builds under FA-001; self-registers outputs (see § 19 governance observation) | REPORTED |
| Figma | Design (A-008) — no file exists | NOT IMPLEMENTED |
| GitHub Actions | `task-gate`, `dependency-check`, `status-update` | VERIFIED green on HEAD |

## 18. Operating sequence

1. Claim a task ID in `NYAYOS_STATUS_REGISTRY.json` **before** work starts (two concurrent A-026 claims occurred on 21 Sep — § 22).
2. Inputs must be CANONICAL; planned dependencies pin a task at OPEN (Canonical Status Rules).
3. Build outputs enter at **REVIEW**; a conformance review promotes them — **recommended three times (A-021, A-024, A-027), not yet adopted** (§ 23).
4. Gates are read only from the Founder Authorization Record.
5. Every artefact → Output Register; every assignment → Assignment Register with limitations; every status change → auto changelog via `status-update` PR.
6. `main` accepts changes through PRs once `enforce_admins` is enabled (§ 23).

## 19. Testing and release gates

| Gate | Requirement | Status |
|---|---|---|
| Code commit | `typecheck · lint · test · build` pass; `dependency-check` on every push/PR | VERIFIED: `tsc` 0 errors; `vitest` **53/53** (4 files); `eslint` 0 errors / 11 warnings — 22 Sep 2026 |
| Governance commit | `task-gate`: registry valid, derived docs fresh, A-nnn in PR, private-data guard | VERIFIED green on HEAD |
| Conformance review before next sprint | Design/spec conformance review of each build | VERIFIED practice for Sprints 1–3 (A-014, A-021, A-024); **Sprint 4 (A-026) not reviewed** |
| Pre-pilot (Build Brief § 12; Eval Protocol § 17) | RLS / reviewer isolation / signed-URL expiry / export authorisation / deletion verification; schema, citation, hallucination, prompt-injection, staleness, contradiction, OCR tests | NOT IMPLEMENTED |
| MVP exit (REPORTED, Ecosystem Review § 19) | Zero cross-tenant leakage; zero unsupported high-impact claims; zero fabricated citations/deadlines; ≥ 3 qualified paying users or paid pilots; ≥ 2 reviewers report reduced time-to-understand | NOT IMPLEMENTED |
| Production | FA-002 — not granted | VERIFIED |

## 20. Evidence requirements

Every assignment records: tool and exact mode · inputs · outputs · evidence path (committed artefact) · limitations · handoff. CANONICAL requires evidence and ≥ 1 output (validator-enforced). Reviews cite the spec section for every finding. Exports carry checksums (A-027 manifest). Research claims are graded [V]/[R]/[D]/[A]/[P] (Ecosystem Review convention) and re-verified before external use. — VERIFIED (Canonical Status Rules; registers)

## 21. Rollback requirements

- Documentation commits: `git revert <sha>` (non-destructive; history preserved). Force-push and deletion of `main` are blocked by protection and ruleset. — VERIFIED
- Code: not deployed anywhere the maintainer can verify; rollback of Lovable staging is the founder's Lovable operation. — REPORTED
- Database: NOT APPLICABLE (none exists).
- Private-data incident procedure: Branch Protection § 7. — VERIFIED

## 22. Current decisions

**Locked (VERIFIED in Decision Log):** D-001 Dispute Readiness Engine · D-002 no "OS" claim · D-004 consumer sandbox · D-005 criminal private · D-008 deterministic workflow, human authority · D-009 Supabase/Postgres/RLS · D-010 pgvector · D-011 multi-tenant · D-012 corpus separation · D-013 eCourts integrate later · D-014 NALSA route · D-015 ODR data model, marketplace deferred · D-017 no private-case training.

**Added 22 Sep 2026 (REPORTED by founder instruction; recorded in Decision Log § "Decisions added 22 September 2026"):** D-019 Dispute File platform with professional-review layer · D-020 reviewer seat · D-021 communication outline · D-022 evidence-integrity manifest · D-023 purpose-bound sharing · D-024 no lawyer-advertising marketplace · D-025 no lead or success fees · D-026 no paid placement · D-027 no public ratings / win-rate metrics / rankings · D-028 no autonomous legal actions · D-029 India-first, nyayos.global defensive only · D-030 Security + Data Architecture Specification V1 is the next P0 work.

**Provisional (VERIFIED):** D-003 commercial wedge (revisit: 15–20 interviews) · D-006/D-007 primary user/payer · D-016 retention durations · D-018 revenue sequencing · pricing · OCR/model provider · launch geography · typography (D-019 candidate in earlier records is **not** the same as D-019 here — the typography decision remains unrecorded; § 23).

**Recommended by the Ecosystem Review but not in the founder instruction (REPORTED, not locked):** L6 policy adapter owns all regulatory rules · L7 "engagement request" terminology · L8 advocate pricing independent of platform-sourced engagements (partly captured in D-025) · L10 fee quotes block contingent structures.

## 23. Active risks and open dependencies

### Gap register — ranked

| Priority | Gap | Type | Business value / risk |
|---|---|---|---|
| **P0** | **Security + Data Architecture Specification absent from the repository** (A-010 OPEN). A draft exists locally, UNVERIFIED | Missing | Nothing that stores a user's dispute may be built without it; the reviewer seat and purpose-bound sharing (D-020, D-023) are security designs first |
| **P0** | **Master Operating System and Continuity Directive not supplied** | Missing | This document represents it only via the instruction block; acceptance criterion "directive accurately represented" cannot be fully met |
| **P0** | **Written legal opinion** on reviewer seat, panels, directory, engagement request, advocate SaaS pricing, self-help drafting — not commissioned | Missing (founder-only act) | Every advocate-facing mechanism carries Rule 36/37 exposure (E1, E2 Critical) |
| **P0** | **Foreign-project files in the working copy** (`EduOS_Founder_Pitch_Deck 1/2.pptx`) | Conflict | Contamination risk; now gitignored; must be removed by the founder |
| **P1** | **Sprint 4 (A-026) CANONICAL without conformance review**; Sprints 1–3 each needed one | Unverified | Parties/Timeline cards likely carry the same model defects found in A-021/A-024 |
| **P1** | **No willingness-to-pay or interview evidence** (A-009 OPEN); build has run four sprints ahead of validation | Unverified | R25 market thesis, R13/R14 payer economics — Critical/High |
| **P1** | **Master Context V1 § 9 and Decision Log "Locked" list are stale** relative to D-019–D-030 | Stale | Resolved by this document superseding § 9; V1 texts left unedited by rule |
| **P1** | **Build outputs self-declare CANONICAL** (A-018, A-020, A-023, A-026) | Conflict with status rules' intent | Adopt "enter at REVIEW" rule |
| **P1** | **A-008 Figma V2** OPEN since 21 Sep; A-015 Sprint 2 closure pinned on it | Stale | Decide: assign or supersede |
| **P1** | **`enforce_admins` off**; auto PR #1 unmerged; `app/roadmap.md` duplicates the registry | Stale | Governance drift |
| **P2** | Typography decision (Noto stack) in code but not in the Decision Log; A-021 items 4/6/8 and NVDA pass still open; A-028 print corrections paused ("founder materials paused" — REPORTED) | Stale / paused | Low |
| **P2** | `dependency-check` unused-dependency watch reports 52 deps for a fixture-only frontend | Stale | Supply-chain surface |

### Unresolved legal questions (REPORTED — Ecosystem Review § 23)

Legal opinion (item 1) · Rule 36 website-particulars schedule text · BCI/State Bar Council guidance on legal-tech tools vs listing platforms · scope of *BCI v. A.K. Balaji* (2018) · BSA 2023 section mapping for electronic records and professional communications · Mediation Act 2023 ss.5/30 commencement · DPDP Rules 2025 commencement dates against G.S.R. 846(E) · final status of the SC AI regulations · State Bar Council roll access · payment-aggregator posture · domain ownership (nyayos.global and India-facing primary).

## 24. Latest verified commits and deployments

| Item | Value | Status |
|---|---|---|
| Audit starting HEAD | `dbd30939c76b5397c479c28ad5260277ca59fbfd` | VERIFIED |
| Last code change | `a93e213` — Sprint 4 parties & timeline (A-026), 21 Sep 2026 | VERIFIED |
| Last governance change before this audit | `dbd3093` — A-027 print manifest, 21 Sep 2026 | VERIFIED |
| CI on HEAD | task-gate ✅ · dependency-check ✅ · status-update ✅ | VERIFIED |
| Staging deployment | none verified | UNVERIFIED |
| Production deployment | none | NOT IMPLEMENTED — NOT ALLOWED |

## 25. Next priorities

1. **A-010 — NyayOS Security + Data Architecture Specification V1** (Claude Chat, Opus with Extended Thinking; research and specification only; no deployment). If the locally present draft is the intended output, supply it for import and review.
2. Founder-only: commission the written legal opinion (§ 23).
3. Supply the Master Operating System and Continuity Directive for import; remove the two `.pptx` files from the working copy.
4. Conformance review of Sprint 4 (A-026) before any Sprint 5.
5. Adopt "build outputs enter at REVIEW"; enable `enforce_admins`; merge or close PR #1; decide A-008.
6. A-009 interviews and WTP — the build must not outrun the payer evidence further.

## 26. Handoff

Owner: **M365 Copilot.** Read `NYAYOS_STATUS.json` for machine state and this document for the operating directive. Every gate question → Founder Authorization Record. Every status question → Status Registry. Every "why" → Decision Log.

---

## 27. Addendum — 23 September 2026 (A-030)

Appended, not edited: §§ 1–26 describe `main` at `6c6b478` and remain accurate for `main`.

| Claim | Label | Detail |
|---|---|---|
| Security & Data Architecture Spec V1 exists and is canonical | **VERIFIED** | `docs/architecture/NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md`, sha256 `7dc6222b60547007…`; A-010 CANONICAL |
| Fast Mode specification set is in the repository | **VERIFIED** | A-031: FMS V1, FM-A Scope Sheet V1, BB2, CB1, FM-0 pack; deck text extracts |
| FM-A domain foundation exists as code | **VERIFIED (branch only)** | `app/src/domain/` on `feature/fma-foundation-v1`; 79 tests; not on `main` |
| FM-A database schema exists | **SPECIFIED, NOT IMPLEMENTED** | `db/migrations/0001_fma_foundation.sql` is statically linted and parsed; **no database exists**; nothing applied |
| Figma FM-A UI (U01–U21) imported | **NOT DONE** | Package not supplied and not found anywhere; A-008 OPEN |
| Deployment / production | **NOT ALLOWED — unchanged** | FA-001 staging only; FA-002 not granted |
| Next priority | — | Founder review and merge of the branch; FD-02 hosting decision; then wave W1 (`docs/architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md` §7) |

---

## 28. Addendum — 26 September 2026 (A-044): repository-centric AI operating system

| Element | Status | Where |
|---|---|---|
| Machine-readable project state for every tool | **VERIFIED** | [`docs/ai/`](docs/ai/README.md): `CURRENT_STATE.json`, `NEXT_TASK.json`, `DECISIONS.json`, `RISKS.json`, JSON Schemas |
| Generated status summary | **VERIFIED** | [`docs/ai/STATUS_SUMMARY.md`](docs/ai/STATUS_SUMMARY.md) — the page M365 Copilot reads; replaces founder copy/paste |
| Tool output contract and handoff schema | **VERIFIED** | [`docs/ai/TOOL_OUTPUT_CONTRACT.md`](docs/ai/TOOL_OUTPUT_CONTRACT.md), `docs/ai/schemas/handoff.schema.json` |
| Per-tool handoffs | **VERIFIED** | `docs/ai/tool-output/claude-code/`, `figma/`, `lovable/`, `gemini/` — one `A-nnn.md` per assignment |
| Validator | **VERIFIED** | `scripts/ai/state.mjs check`: files exist, schema validity, derived fields in sync with the registry, Decision Log, A-032 §9 and Risk Register, last assignment recorded with a pushed commit and handoff, NEXT_TASK follows it. Runs in the required `task-gate` job |
| Completion protocol | **REQUIRED** from A-044 onward | 1 commit · 2 push · 3 update `CURRENT_STATE` · 4 write the tool handoff · 5 update `NEXT_TASK` — then a state commit, pushed. [`CONTRIBUTING.md` §5](CONTRIBUTING.md) |

The governance sources keep their authority (§ 26): the status registry for status, the Decision Log for decisions, the Founder Authorization Record for gates. `docs/ai/` summarises them for tools and is checked against them.
