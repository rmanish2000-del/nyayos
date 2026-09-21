# NYAYOS ASSIGNMENT REGISTER

**Purpose:** One row per specialist assignment. Every piece of work delegated to a tool or specialist is recorded here before it starts and completed here when it ends.

**Rule:** No assignment is considered done until its **Evidence** field points at a committed artefact recorded in [NYAYOS_OUTPUT_REGISTER.md](NYAYOS_OUTPUT_REGISTER.md).

**Accuracy note:** Assignments A-002 to A-006 were executed before this register existed. Their tool, mode and dates are recorded as **"Not recorded"** where they cannot be established from the artefacts themselves. These fields have **not** been guessed. The founder should complete them from their own records.

---

## Register

### A-001 — Adversarial market and regulatory analysis (Red Team)

| Field | Value |
|---|---|
| **Assignment ID** | A-001 |
| **Tool and exact mode** | Claude Code — Research Lead |
| **Purpose** | Attempt to destroy the idea: TAM/SAM/SOM, competitors, moats, regulatory threats, failure modes, government-build risk, lawyer resistance, judicial non-adoption |
| **Input files** | None supplied. Repository and workspace were empty; the strongest reading of the concept was inferred and stated explicitly in the report |
| **Expected output** | `NYAYAOS_RED_TEAM_REPORT.md` |
| **Environment** | Local workspace `C:\nyayos`. Web research. No repository, no code, no deployment |
| **Deployment allowed** | **NOT ALLOWED** |
| **Status** | **Complete** — 20 September 2026 |
| **Result** | Recommended against the "Operating System for Indian Law" positioning and against individual-advocate payer economics. Directly drove D-002, D-003, D-006, D-007 and risks R14, R25, R26, R27, R28 |
| **Evidence** | [docs/research/NYAYAOS_RED_TEAM_REPORT.md](../research/NYAYAOS_RED_TEAM_REPORT.md) |
| **Limitations** | Citations are from secondary web reporting gathered 20 Sep 2026 and are **not** verified against primary court records or the official text of the draft AI regulations. The report states this itself and must be re-verified before any external use |
| **Handoff back to M365 Copilot** | Delivered. Consumed into the V1 deliverables package (A-006) |

### A-002 — Global justice-AI and ODR benchmark

| Field | Value |
|---|---|
| **Assignment ID** | A-002 |
| **Tool and exact mode** | *Not recorded — founder to confirm* |
| **Purpose** | Six-country benchmark of justice AI, court AI governance and ODR |
| **Input files** | *Not recorded* |
| **Expected output** | `NYAYAOS_GLOBAL_BENCHMARK_REPORT.md` |
| **Environment** | Local workspace. Research only |
| **Deployment allowed** | **NOT ALLOWED** |
| **Status** | **Complete** — file dated 20 September 2026 |
| **Result** | Established "AI assists, humans decide"; verification and auditability matter; the file/workflow layer is more valuable than a generic model interface. Informed D-008 and the provenance posture |
| **Evidence** | [docs/research/NYAYAOS_GLOBAL_BENCHMARK_REPORT.md](../research/NYAYAOS_GLOBAL_BENCHMARK_REPORT.md) |
| **Limitations** | Secondary-source research; per the evidence caveat in the decision log, re-verify primary sources before production or external use. Proposes broader service layers (NyayaFile, NyayaBench, NyayaHear, NyayaForum, NyayaSahayak) that are **out of MVP scope** |
| **Handoff back to M365 Copilot** | Consumed into A-006 |

### A-003 — Indian justice-system mapping

| Field | Value |
|---|---|
| **Assignment ID** | A-003 |
| **Tool and exact mode** | *Not recorded — founder to confirm* |
| **Purpose** | Map Indian dispute volumes and categories by court level |
| **Input files** | *Not recorded* |
| **Expected output** | `NYAYAOS_INDIAN_JUSTICE_MAP.md.md` |
| **Environment** | Local workspace. Research only |
| **Deployment allowed** | **NOT ALLOWED** |
| **Status** | **Complete** |
| **Result** | Identified property/land, consumer, cheque-bounce/payment, execution, family and document-process friction as volume categories. Drove the "document-heavy lower-court disputes, not Supreme Court workflows" architectural lesson and supported D-004 |
| **Evidence** | [docs/research/NYAYAOS_INDIAN_JUSTICE_MAP.md.md](../research/NYAYAOS_INDIAN_JUSTICE_MAP.md.md) |
| **Limitations** | Filename carries a double `.md.md` extension. Retained unchanged because the decision log and master context cite it by that exact name |
| **Handoff back to M365 Copilot** | Consumed into A-006 |

### A-004 — MVP selection

| Field | Value |
|---|---|
| **Assignment ID** | A-004 |
| **Tool and exact mode** | *Not recorded — founder to confirm* |
| **Purpose** | Select the single MVP capability |
| **Input files** | *Not recorded* |
| **Expected output** | `NYAYAOS_MVP_SELECTION_REPORT.md` |
| **Environment** | Local workspace. Research only |
| **Deployment allowed** | **NOT ALLOWED** |
| **Status** | **Complete** |
| **Result** | Selected the **Dispute Readiness Engine** and the "What happened?" workflow. Locked as D-001 |
| **Evidence** | [docs/research/NYAYAOS_MVP_SELECTION_REPORT.md](../research/NYAYAOS_MVP_SELECTION_REPORT.md) |
| **Limitations** | Cited in the decision log as `NYAYAOS_MVP_SELECTION_REPORT(1).md`; the workspace file is `NYAYAOS_MVP_SELECTION_REPORT.md`. Assumed to be the same document — **founder to confirm no second variant exists** |
| **Handoff back to M365 Copilot** | Consumed into A-006 |

### A-005 — Architecture review

| Field | Value |
|---|---|
| **Assignment ID** | A-005 |
| **Tool and exact mode** | *Not recorded — founder to confirm* |
| **Purpose** | Technical architecture review: stack, data, security, RAG, agent orchestration, audit |
| **Input files** | *Not recorded* |
| **Expected output** | `ARCHITECTURE_REVIEW.md` |
| **Environment** | Architecture review only. Explicitly no implementation, no deployment |
| **Deployment allowed** | **NOT ALLOWED** |
| **Status** | **Complete** — reconciled |
| **Result** | TanStack Start / React 19 / Vite 7 on edge runtime; Lovable Cloud (Supabase Postgres + Auth + Storage + RLS); pgvector; server-side AI gateway; append-only audit; closed tool catalog. Drove D-009 to D-012 |
| **Evidence** | [docs/architecture/ARCHITECTURE_REVIEW.md](../architecture/ARCHITECTURE_REVIEW.md) |
| **Limitations** | Document is stack-generic and does not name NyayOS in its header. Five decisions were **modified, made provisional, deferred or rejected** during reconciliation — see the reconciliation table in [NYAYOS_CONTINUITY_HANDOFF_V1.md](../handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md). Read the review only alongside that table |
| **Handoff back to M365 Copilot** | Consumed into A-006 |

### A-006 — V1 revised deliverables package

| Field | Value |
|---|---|
| **Assignment ID** | A-006 |
| **Tool and exact mode** | *Not recorded — founder to confirm* |
| **Purpose** | Reconcile the full founder-supplied source package into a coherent V1 product-definition set |
| **Input files** | `NYAYAOS_RED_TEAM_REPORT.md`, `NYAYAOS_GLOBAL_BENCHMARK_REPORT.md`, `NYAYAOS_INDIAN_JUSTICE_MAP.md.md`, `NYAYAOS_MVP_SELECTION_REPORT(1).md`, `ARCHITECTURE_REVIEW.md` |
| **Expected output** | 9 documents: Master Product Spec, Master Context, Decision Log, Risk Register, 90-Day Validation Plan, Continuity Handoff, Figma Brief V2, Lovable Build Brief, Real Case Evaluation Protocol |
| **Environment** | Document production only |
| **Deployment allowed** | **NOT ALLOWED** — package states "No code was written. No deployment occurred. No repository was modified." |
| **Status** | **Complete** |
| **Result** | Canonical name fixed as **NyayOS**; commercial wedge changed from broad consumer to small-business/FPO/vendor-payment and commercial-service disputes; consumer moved to sandbox/Phase 2; generalized agent architecture modified to deterministic workflow orchestration with bounded AI tasks |
| **Evidence** | `docs/founder/`, `docs/product/`, `docs/design/`, `docs/implementation/`, `docs/evaluation/`, `docs/handoffs/` — see [NYAYOS_OUTPUT_REGISTER.md](NYAYOS_OUTPUT_REGISTER.md) |
| **Limitations** | Decision log and master product spec contain unresolved model citation artefacts (`citeturn…`). Left unedited to preserve supplied content. The commercial wedge appears as **both** locked and provisional across documents — see Founder Dashboard § H note |
| **Handoff back to M365 Copilot** | Returned to founder; supplied to A-007 as the canonical input set |

### A-007 — Repository and continuity initialization

| Field | Value |
|---|---|
| **Assignment ID** | A-007 |
| **Tool and exact mode** | Claude Code — Repository and Product-Continuity Maintainer |
| **Purpose** | Initialize the empty canonical repository as the single version-controlled source of truth for founder context, decisions, risks, assignments, outputs and handoffs |
| **Input files** | The 11 documents listed under Required Inputs: the 9 V1 deliverables, `ARCHITECTURE_REVIEW.md`, and the bundle `README.md`. Plus the 4 prior research artefacts found in the workspace |
| **Expected output** | `README.md`, `docs/INDEX.md`, `CONTRIBUTING.md`, `.gitignore`, and four founder records: Dashboard, Assignment Register, Output Register, Changelog. Documents placed into the `/docs` structure without substantive change |
| **Environment** | Local workspace `C:\nyayos` → canonical repository `rmanish2000-del/nyayos`, branch `main` |
| **Deployment allowed** | **NOT ALLOWED.** Documentation commit only. No product code, no schema, no database resources, no deployment |
| **Status** | **Complete** — 20 September 2026 |
| **Result** | Repository initialized. 15 supplied/prior documents placed. 8 new files created. Private-data exclusions applied before any staging |
| **Evidence** | Initialization commit on `main`; see [NYAYOS_CHANGELOG.md](NYAYOS_CHANGELOG.md) and [NYAYOS_OUTPUT_REGISTER.md](NYAYOS_OUTPUT_REGISTER.md) |
| **Limitations** | Supplied documents were **not** edited, so pre-existing internal inconsistencies persist (see A-006 limitations). The private matter is referenced by name in four supplied documents in governance context; redaction would alter supplied content and was not performed unilaterally |
| **Handoff back to M365 Copilot** | See [NYAYOS_CONTINUITY_HANDOFF_V1.md](../handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md) and the handoff section of this register below |

### A-013 — MVP Reconciliation V3, authorization record and authority hierarchy

| Field | Value |
|---|---|
| **Assignment ID** | A-013 |
| **Tool and exact mode** | Claude Code — Repository and Product-Continuity Maintainer |
| **Purpose** | Record the founder gate change (staging build allowed, production not allowed); consolidate the MVP position at V3; establish an explicit document authority hierarchy |
| **Input files** | Founder instruction, 21 Sep 2026. All tier 1-6 documents already in the repository. **No new source document was supplied** |
| **Expected output** | `NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md` (FA-001), `NYAYOS_MVP_RECONCILIATION_V3.md`, authority hierarchy in `docs/INDEX.md`, updates to Dashboard, README, CONTRIBUTING, both registers, changelog |
| **Environment** | Local workspace `C:
yayos` to canonical repository `rmanish2000-del/nyayos`, branch `main` |
| **Deployment allowed** | **Staging: ALLOWED (FA-001). Production: NOT ALLOWED.** This repository remains documentation only |
| **Status** | **Complete** — 21 September 2026 |
| **Result** | FA-001 recorded as tier 1 authority. Gate posture changed from *Build Not Allowed* to *Staging Allowed / Production Not Allowed* across all affected documents. A-011 unblocked; A-012 created and gated on FA-002 |
| **Evidence** | [NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md](NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) · [NYAYOS_MVP_RECONCILIATION_V3.md](../product/NYAYOS_MVP_RECONCILIATION_V3.md) · [docs/INDEX.md](../INDEX.md) |
| **Limitations** | **No `MVP_RECONCILIATION_V3` source document was supplied** — none exists in the workspace, Downloads or the repository, and there is no V1 or V2 of that document to succeed. The V3 document was therefore written as a **consolidation of positions already recorded elsewhere**, introducing **no new product decisions**. If the founder holds a separate V3, it supersedes this one. Authorization was granted while A-008 and A-009 remain Pending — risk recorded in FA-001, not resolved |
| **Handoff back to M365 Copilot** | Gate change is live. Verify every gate against FA-001 (tier 1) before acting |

### A-014 — Sprint 1 Foundation architecture review (pre-Sprint 2 gate)

| Field | Value |
|---|---|
| **Assignment ID** | A-014 |
| **Tool and exact mode** | Claude Code — Architecture Review (staging review only) |
| **Purpose** | Deep technical review of the Lovable Sprint 1 Foundation (tokens, buttons, inputs, chips, badges, banners, progress, navigation, accessibility baseline) before Sprint 2 Fact Card System begins |
| **Input files** | Review instruction, 21 Sep 2026. Canonical spec baseline: Product Spec V1 § 7.6–7.10, § 10, § 11; Figma Brief V2 § 5, 6, 9, 18; Lovable Build Brief V1. **Sprint 1 artefact: NOT SUPPLIED — not found in canonical repo, workspace, Downloads, or any GitHub repo on the account** |
| **Expected output** | Findings, severities, evidence, Go/No-Go for Sprint 2, three risk ratings |
| **Environment** | Read-only review. No code modified, nothing deployed, nothing implemented |
| **Deployment allowed** | **Staging: ALLOWED (FA-001). Production: NOT ALLOWED.** Review itself performs no deployment |
| **Status** | **COMPLETE — executed 21 September 2026** (blind phase earlier the same day; artefact received under A-017) |
| **Result** | **GO (conditional) for Sprint 2** on Sprint 1.1 State Completion (A-018). Typography-drift finding **retracted** against evidence (Noto stack). High: state enums incomplete vs Product Spec; no inline-correct input; contrast/SR audits not run. Medium: hue-family overload; Google Fonts CDN; unused deps. See § 11 |
| **Evidence** | [docs/architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md](../architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md) |
| **Limitations** | Browser-based checks (contrast, zoom to 400 %, focus-obscured) and a screen-reader pass were **not** run — carried into A-018. Blind-phase ratings (§ 10) superseded by § 11.5 |
| **Handoff back to M365 Copilot** | Supply the artefact via review § 2 (recommended: Lovable → GitHub → private `nyayos-app`). Three actions can start now without it: record typography decision (D-019 candidate), close FA-001 code-location item, begin Fact Card design in Figma against § 3.1 / § 4.5 |

### A-017 — Sprint 1 Foundation import into canonical repository

| Field | Value |
|---|---|
| **Assignment ID** | A-017 |
| **Tool and exact mode** | Claude Code — Repository Integration |
| **Purpose** | Import the Lovable Sprint 1 Foundation code into the canonical repository, verify checksum, scan for secrets and prohibited content, run build/test/lint, record results, and mark Sprint 1 CANONICAL |
| **Input files** | Instruction names: `nyayos-sprint1-foundation.zip`, Sprint 1 screenshots, staging URL, governance commit `1ff538355e3a3379a1a54a42c95562959870242a`. **Only the commit SHA was verifiable — it exists and is the FA-001 commit. The ZIP, screenshots, staging URL and expected checksum were NOT supplied and are not present anywhere on the machine, in OneDrive, or on GitHub** |
| **Expected output** | Code under version control; build/test/lint results; Sprint 1 recorded as canonical; registers, changelog, dashboard, continuity handoff updated |
| **Environment** | Local workspace `C:\nyayos` → canonical repository, branch `main`. Node 22.14 / npm 10.9 available. `sha256sum` available. No dedicated secret scanner installed (gitleaks/trufflehog absent) — grep-based scan will be used and recorded as such |
| **Deployment allowed** | **Staging: ALLOWED (FA-001). Production: NOT ALLOWED.** Import performs no deployment |
| **Status** | **COMPLETE — 21 September 2026.** (Initially blocked; ZIP supplied same day) |
| **Result** | **Sprint 1 imported to `app/` and recorded CANONICAL.** ZIP SHA-256 `8c407630616f171b33d2be60671213c4b07b5ceb65fce0a877954b17a3ea83ca` (recorded; no expected value to verify against). Secret scan PASS. Prohibited-content scan PASS. `tsc` PASS · `eslint` PASS (0 errors / 7 benign warnings) · `vitest` PASS 12/12 · `vite build` PASS. A-014 checklist executed: **GO (conditional) for Sprint 2** on Sprint 1.1 State Completion. Typography-drift finding **retracted** — artefact uses Noto Sans / Noto Sans Devanagari / Noto Sans Mono |
| **Evidence** | `app/` in commit; [A-014 § 11](../architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md); [Continuity Handoff V2](../handoffs/NYAYOS_CONTINUITY_HANDOFF_V2.md) |
| **Limitations** | **Staging URL and screenshots were not supplied — staging not verified.** Checksum recorded, not verified. Secret scan pattern-based (no gitleaks). Validation ran on npm's fresh resolve, not `bun.lock`. `routeTree.gen.ts` was missing from the export and was generated by the build, then committed. Browser-based a11y checks (contrast, zoom, focus-obscured) not run |
| **Handoff back to M365 Copilot** | Sprint 1 is canonical. Next: **A-018 Sprint 1.1 State Completion**, then A-015 Sprint 2. Supply staging URL for verification. Write D-019 (typography) |

**Pre-decisions this import forces — founder confirmation requested, defaults stated:**

| # | Decision | Default if not overridden | Why it matters |
|---|---|---|---|
| P1 | **This closes the FA-001 code-location item as option (b): code lives in the canonical repository.** The repository stops being documentation-only | Proceed as (b) — the instruction says so explicitly | README, CONTRIBUTING, `.gitignore` and the authority hierarchy all currently assert documentation-only; all must change in the same commit |
| P2 | **Code directory** | `app/` at repository root; `docs/` untouched | Keeps tier-1..7 documents physically separate from build artefacts; avoids root-level `package.json` making the repo *look* like the app |
| P3 | **`.gitignore` carve-outs** | Allow `app/public/**` images and `app/**/*.svg`; keep `.env*` blocked (Lovable exports ship a `.env` with the Supabase anon key — it must be **excluded** and re-supplied via `.env.example`); screenshots to `docs/evaluation/sprint1-screenshots/` with an explicit allow | Current rules block `*.png`, `*.jpg`, `*.svg`, `*.zip` repo-wide and would silently drop Lovable's own assets |

### A-018 — Sprint 1.1 State Completion

| Field | Value |
|---|---|
| **Assignment ID** | A-018 |
| **Tool and exact mode** | Lovable — implementation and validation |
| **Purpose** | Complete the additive pre–Fact Card foundation states required by A-014 before Sprint 2 |
| **Input files** | A-011 Sprint 1 Foundation; A-014 Sprint 1 Foundation review; founder instruction, 21 Sep 2026 |
| **Expected output** | `uncertain`, `not-relevant`, `corrected`, `unknown-date`, bounded confidence bands, user-correction provenance and accessible inline correction input; updated showcase and tests |
| **Environment** | Lovable staging workspace; canonical repository `rmanish2000-del/nyayos` |
| **Deployment allowed** | **Staging: ALLOWED (FA-001). Production: NOT ALLOWED.** No deployment performed |
| **Status** | **CANONICAL — 21 September 2026** |
| **Result** | Foundation code and showcase updated. `vitest` **PASS 15/15** · typecheck **PASS** · ESLint **PASS (0 errors; 7 existing Fast Refresh warnings)** · production build **PASS** · responsive rendering **PASS** at 390×844, 834×1100 and 1280×1000 with no console errors and 44×44 visible interactive targets |
| **Evidence** | `app/` and `app/tests/foundation.test.tsx` in the canonical A-018 commit; generated status registry, dashboard and dependency graph |
| **Limitations** | This closes only the seven additive state gaps. A-014's formal contrast and assistive-technology audits remain separate open risks. A-008 Fact Card design remains required before A-015 |
| **Handoff back to M365 Copilot** | A-018 is CANONICAL. A-015 remains blocked only on A-008. Do not start production work; FA-002 is not granted |

### A-020 — Fact Card system (provisional staging implementation)

| Field | Value |
|---|---|
| **Assignment ID** | A-020 |
| **Tool and exact mode** | Lovable — implementation and validation |
| **Purpose** | Build the Fact Card system on the canonical A-018 state model: Fact Card, Source Panel, source provenance, date precision, contradiction state, confidence band and inline correction flow |
| **Input files** | A-011 Sprint 1 Foundation; A-014 Sprint 1 Foundation review; A-018 Sprint 1.1 State Completion; founder instruction, 21 Sep 2026 |
| **Expected output** | Fact Card and Source Panel components covering `confirmed`, `uncertain`, `corrected`, `not-relevant`, `contradiction`, `user-statement`, `document-extracted`, `ai-inference` and `verified-source`, on mobile, tablet and desktop |
| **Environment** | Lovable staging workspace; canonical repository `rmanish2000-del/nyayos` |
| **Deployment allowed** | **Staging: ALLOWED (FA-001). Production: NOT ALLOWED.** No deployment performed |
| **Status** | **CANONICAL — 21 September 2026** (implementation and validation only) |
| **Result** | `vitest` **PASS 23/23** (15 foundation + 8 Fact Card) · typecheck **PASS** · ESLint **PASS (0 errors; 7 existing Fast Refresh warnings)** · production build **PASS** · responsive rendering **PASS** at 390×844, 834×1100 and 1280×1000 with six Fact Cards, no console errors and 44×44 visible interactive targets |
| **Evidence** | `app/src/components/nyayos/fact-card.tsx`, `app/src/components/nyayos/source-panel.tsx`, `app/tests/fact-card.test.tsx` in the canonical A-020 commit; generated status registry, dashboard and dependency graph |
| **Limitations** | The Fact Card visual design is derived from the Master Product Spec text because **A-008 does not exist**; design conformance is unverified. Contradictions are displayed side by side and never ranked or resolved. A-014's formal contrast and assistive-technology audits remain open. No backend, persistence or analysis logic |
| **Handoff back to M365 Copilot** | A-020 is CANONICAL as implementation. **A-015 Sprint 2 stays OPEN** until A-008 design conformance is checked against this implementation. No Sprint 3 work started; FA-002 is not granted |

### A-019 — Repository Automation Foundation

| Field | Value |
|---|---|
| **Assignment ID** | A-019 |
| **Tool and exact mode** | Claude Code — Repository Automation |
| **Purpose** | Automated workflow governance: enforce the canonical status rules in CI, generate the dependency graph, status dashboard and changelog entries from a single machine-readable registry, protect `main`, template pull requests |
| **Input files** | A-007, A-013, A-017 (all CANONICAL). Founder instruction 21 Sep 2026 |
| **Expected output** | `.github/workflows/{task-gate,dependency-check,status-update}.yml` · `.github/pull_request_template.md` · `scripts/governance/registry.mjs` · `docs/founder/NYAYOS_STATUS_REGISTRY.json` (+ generated `.md`, `NYAYOS_DEPENDENCY_GRAPH.md`, `NYAYOS_STATUS_DASHBOARD.md`) · `NYAYOS_CANONICAL_STATUS_RULES.md` · `NYAYOS_BRANCH_PROTECTION.md` |
| **Environment** | Canonical repository, `main`. GitHub Actions (ubuntu-latest, Node 22). No product code touched |
| **Deployment allowed** | **NOT ALLOWED.** `dependency-check` asserts that no deploy command exists in its own workflow |
| **Status** | **CANONICAL — 21 September 2026.** `task-gate` and `dependency-check` green on `main` at `bd31394`; `status-update` exercised by the A-019 REVIEW → CANONICAL transition itself |
| **Result** | Status flow `OPEN → IN_PROGRESS → REVIEW → CANONICAL → SUPERSEDED` encoded in `NYAYOS_STATUS_REGISTRY.json`; the rule *"no task may be an input unless CANONICAL"* enforced by `registry.mjs validate` in `task-gate` on every push/PR (`inputs` = canonical only; `planned_inputs` = declared future deps that pin a task at OPEN). Graph, registry view and status dashboard generated from the registry; `--check` mode makes stale derived docs a CI failure. `status-update` regenerates on registry change and **opens a PR** (main is protected; bots cannot push). **Branch protection applied** (required checks `task-gate` + `dependency-check`, strict; force-push/deletion blocked) **and ruleset #23748706** |
| **Evidence** | [NYAYOS_STATUS_REGISTRY.md](NYAYOS_STATUS_REGISTRY.md) · [NYAYOS_DEPENDENCY_GRAPH.md](NYAYOS_DEPENDENCY_GRAPH.md) · [NYAYOS_STATUS_DASHBOARD.md](NYAYOS_STATUS_DASHBOARD.md) · [NYAYOS_BRANCH_PROTECTION.md](NYAYOS_BRANCH_PROTECTION.md) · **Run URLs:** task-gate [35559156273](https://github.com/rmanish2000-del/nyayos/actions/runs/35559156273) · dependency-check [35559156205](https://github.com/rmanish2000-del/nyayos/actions/runs/35559156205) · first-run failures fixed in `bd31394` (parse error 35558895220; self-matching assertion 35558897628) |
| **Limitations** | Repository setting *Allow GitHub Actions to create and approve pull requests* was turned **on** so `status-update` can open PRs (first real run failed without it; recorded in NYAYOS_BRANCH_PROTECTION.md § 5). **PR #1 is open and awaiting founder merge** — it will show "branch out of date" because `main` moved after it opened; use *Update branch*, then merge. `enforce_admins` is **off** until the founder enables it (both required checks are now green on `main`) — closing command in NYAYOS_BRANCH_PROTECTION.md § 3. Auto-changelog begins with the **next** registry change (no prior registry in history to diff). Secret/private-data guard in `task-gate` is pattern-based. The hand-written registers still carry the *why*; the JSON is the status source of truth — keeping them consistent is a human duty the validator cannot fully check |
| **Handoff back to M365 Copilot** | Every future assignment: add a row to `NYAYOS_STATUS_REGISTRY.json` **first**, run `node scripts/governance/registry.mjs all`, then open a PR citing the A-nnn. A task cannot be used as an input until it is CANONICAL — the gate will refuse |

### A-022 — Fact Card conformance fixes

| Field | Value |
|---|---|
| **Assignment ID** | A-022 |
| **Owner / tool** | Lovable — staging build |
| **Purpose** | Convert the A-021 FAIL (conditional) into a conforming Fact Card: add the missing confirmation actions, put provenance permanently on the card, and split the conflated provenance kinds |
| **Input files** | A-021 review commit `abe91fa176fe20a7be48ec9195e4f4f8a7d62360`, A-020 implementation commit `bbacbb481a0e8188b2753b68f089f258104ba1c1` |
| **Gate** | FA-001 (staging only) |
| **Deployment allowed** | **NOT ALLOWED.** Nothing deployed; FA-002 not granted |
| **Status** | **CANONICAL — 21 September 2026.** 27/27 tests · typecheck · lint 0 errors · build · responsive 390 / 834 / 1280 PASS with no console errors |
| **Result** | **Blocking items 1–3 delivered.** (1) `Confirm` · `Uncertain` · `Not relevant` action group plus `Correct` on every card, `compact` size, 44×44 targets, `aria-pressed` reflecting the recorded state, grouped under an accessible name. (2) Always-visible **“Where this came from”** provenance strip carrying every source badge with its origin, the date badge and the confidence band; the disclosure is demoted to *Show source detail* (page references and verbatim excerpts only). (3) `document-fact`, `ai-extraction` and `unverified-claim` split out as distinct provenance kinds with their own icons, labels and tokens (`--source-unverified` added light + dark). **Also delivered:** item 5 `ConfidenceBand` `unknown` (own token family, dashed border, “Confidence unknown”); item 7 opacity dimming replaced with muted colour tokens and badge borders raised from 30 % to full token strength; item 9 the source panel is always in the DOM and hidden with the `hidden` attribute so `aria-controls` always resolves; item 10 the correction reason stays visible on the card after saving and a `user-correction` source is appended |
| **Evidence** | `app/src/components/nyayos/fact-card.tsx`, `app/src/components/nyayos/source-badge.tsx`, `app/src/components/nyayos/confidence-band.tsx`, `app/src/styles.css`, `app/src/routes/index.tsx`, `app/tests/fact-card.test.tsx` (12 tests) in this commit |
| **Limitations** | **Not delivered:** A-021 item 4 (contradiction-specific *Confirm difference* / *Resolve* / *Leave unresolved* actions — the card-level actions apply instead), item 6 (extended `FactSource` metadata: publisher, jurisdiction, version, link, lastVerified), item 8 (a separate hue family for confidence). The **NVDA / VoiceOver pass is still owed** since A-014. Contrast improved by construction (full-strength token borders, `text-muted-foreground` for muted values) but **not re-measured** with an external tool. A-008 Figma still does not exist, so design conformance remains judged against canonical text |
| **Handoff back to M365 Copilot** | Re-review scope from A-021: items 1–3 by inspection + test, item 7 by re-measurement, then the screen-reader pass. Decide items 4, 6, 8 as a follow-on assignment, and whether A-008 is still wanted or should be SUPERSEDED |

---

### A-021 — Fact Card design conformance review

| Field | Value |
|---|---|
| **Assignment ID** | A-021 |
| **Tool and exact mode** | Claude Code — Design Conformance Review (read-only; dev server run locally for measurement) |
| **Purpose** | Verify the A-020 Fact Card implementation at `bbacbb4` for states, provenance, date precision, contradictions, confidence bands, inline corrections, accessibility and mobile/tablet/desktop behaviour |
| **Input files** | A-006 (Figma Brief V2, Product Spec), A-014 (§ 3, § 4.5, § 11.4), A-020 commit `bbacbb481a0e8188b2753b68f089f258104ba1c1`. **No Figma design exists (A-008 OPEN)** — conformance is against the canonical text |
| **Expected output** | PASS / FAIL, required fixes, review record |
| **Environment** | Local checkout; Chromium at 390 × 844, 834 × 1100, 1280 × 1000; `tsc` / `eslint` / `vitest` / `vite build` re-run |
| **Deployment allowed** | N/A — review. Nothing deployed |
| **Status** | **CANONICAL — 21 September 2026** |
| **Result** | **FAIL (conditional).** States render but the Confirm / Uncertain / Not relevant actions do not exist; provenance is hidden behind "Show sources" against Spec § 7.6 and the hierarchy rule; `document_fact` / `ai_extraction` still conflated and `unverified_claim` absent (A-014 § 11.4 item 2 not delivered by A-018). Date precision PASS · inline corrections PASS · responsive PASS at all three widths · accessibility PASS with two opacity-caused contrast failures (4.39, 3.97) and a dangling `aria-controls`. Validation 23/23 / green. Ten fixes → **A-022** |
| **Evidence** | [docs/design/NYAYOS_FACT_CARD_CONFORMANCE_REVIEW_A021.md](../design/NYAYOS_FACT_CARD_CONFORMANCE_REVIEW_A021.md) |
| **Limitations** | Screen-reader pass (NVDA / VoiceOver) still not run — owed since A-014. Contrast computed from rendered oklch tokens with the WCAG formula, not an external tool. The instruction labelled this A-008; A-008 (Figma) remains undone and is not closed by this review |
| **Handoff back to M365 Copilot** | Assign **A-022** before any further Sprint 2 surface. Decide whether A-008 (Figma) is still wanted or should be SUPERSEDED by A-020 + A-022. Consider the rule clarification: build outputs enter at REVIEW |

---

## Open assignments — not yet issued

| Proposed ID | Assignment | Tool / mode | Gate |
|---|---|---|---|
| A-008 | **Figma V2** | Figma — design mode | Founder assigns owner |
| A-009 | **User interviews + WTP validation** | Founder-led field research | Founder defines exact category boundary |
| A-010 | **NyayOS Security + Data Architecture Review** (research/specification only) | Recommended in the Continuity Handoff. Inputs: Master Product Spec V1, Architecture Review, Risk Register V1, Real Case Evaluation Protocol | May run in parallel with A-008/A-009 |
| A-011 | **Sprint 1 Foundation — Lovable staging build** | Lovable — staging build | ● **CANONICAL** (imported under A-017; gaps recorded in A-014 § 11.3) |
| A-012 | **Production build / deployment** | TBD | ⛔ **NOT AUTHORIZED.** Requires FA-002 |
| A-018 | **Sprint 1.1 — State Completion** | Lovable — staging build | ● **CANONICAL** — validated 21 Sep 2026 |
| A-015 | **Sprint 2 — Fact Card System build** | Lovable — staging build | ⛔ **OPEN** — A-022 is now CANONICAL; still waiting on A-008 (design) and a conformance re-review |
| A-022 | **Fact Card conformance fixes** | Lovable — staging build | ● **CANONICAL** — validated 21 Sep 2026. A-021 § 4 items 1–3, 5, 7, 9, 10 delivered; items 4, 6, 8 and the screen-reader pass still open |
| A-020 | **Fact Card system — provisional staging implementation** | Lovable — staging build | ● **CANONICAL** — validated 21 Sep 2026 (design conformance unverified; A-008 absent) |
| A-016 | **Typography decision → Decision Log** (D-019) | Founder | Open. Code now embodies Noto Sans / Noto Sans Devanagari / Noto Sans Mono; the Decision Log does not yet say so |

---

## Handoff back to M365 Copilot

**From:** Claude Code — Repository and Product-Continuity Maintainer (A-007)
**To:** M365 Copilot — project orchestration

1. The canonical repository is now initialized and is the **single source of truth**. Read from it; do not re-derive context from chat history.
2. Entry points: [README.md](../../README.md) → [docs/INDEX.md](../INDEX.md) → [NYAYOS_FOUNDER_DASHBOARD.md](NYAYOS_FOUNDER_DASHBOARD.md).
3. **Open items requiring founder input**, all recorded above: tool/mode for A-002 to A-006; the MVP report filename discrepancy (A-004); the locked-vs-provisional status of the commercial wedge; whether the private matter name should be redacted from committed documents.
4. **Gate status (FA-001 + addendum, 21 Sep 2026):** staging build **authorized**; **Sprint 1 imported and CANONICAL** at `app/`; **production remains NOT AUTHORIZED** (A-012 / FA-002). Always verify a gate against [NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md](NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md), tier 1.
5. Every new assignment must be added to this register **before** work begins, and its output added to [NYAYOS_OUTPUT_REGISTER.md](NYAYOS_OUTPUT_REGISTER.md) on completion.

### A-023 — Sprint 3 Evidence Components

| Field | Value |
|---|---|
| **Assignment ID** | A-023 |
| **Owner / tool** | Lovable — staging build |
| **Purpose** | Build the Sprint 3 evidence foundation: Evidence Card lifecycle states, S08 Document Upload and S09 Evidence Locker |
| **Input files** | A-018 Sprint 1.1 state model; A-020 Fact Card system; A-022 Fact Card remediation; founder instruction, 21 Sep 2026 |
| **Gate** | FA-001 (staging only) |
| **Deployment allowed** | **NOT ALLOWED for this assignment.** Nothing deployed; production remains prohibited without FA-002 |
| **Status** | **CANONICAL — 21 September 2026.** 34/34 tests · typecheck · lint 0 errors · build · responsive 390 / 834 / 1280 PASS with no console errors |
| **Result** | Added `EvidenceCard` with uploading, processing, extracted, error and uncategorized states; accessible upload progress and lifecycle actions; always-visible provenance/date/confidence metadata; S08 file chooser/drop target and upload queue; S09 searchable/filterable Evidence Locker; responsive shell navigation and semantic evidence tokens |
| **Evidence** | `app/src/components/nyayos/evidence-card.tsx`, `app/src/components/nyayos/evidence-workspace.tsx`, `app/src/styles.css`, `app/src/routes/index.tsx`, `app/tests/evidence.test.tsx` (7 tests) |
| **Limitations** | Frontend staging fixtures only: files are not persisted or sent to storage; processing/extraction is simulated and no OCR, AI, API or backend workflow was added. Browser automation covered Chromium; NVDA / VoiceOver verification remains open. A-008 design artefact remains absent, so visual conformance is against canonical text and existing components |
| **Handoff back to M365 Copilot** | A-023 is CANONICAL as a validated frontend implementation. No deployment occurred and no Sprint 4 work started |
