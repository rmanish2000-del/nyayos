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

### A-024 — Sprint 3 evidence conformance review

| Field | Value |
|---|---|
| **Assignment ID** | A-024 |
| **Tool and exact mode** | Claude Code — Design Conformance Review (read-only; dev server run locally for measurement) |
| **Purpose** | Verify A-023 at `296fad81b5a122cb38c360919a14d145ac234c8b`: Document Upload, Evidence Locker, upload / processing / error / uncategorized states, accessibility, mobile/tablet/desktop |
| **Input files** | Figma Brief V2 § 4, § 8; Product Spec § 7.4, § 7.5, § 10, § 11, § 17, US-02; A-021; A-023 commit. **"S08/S09" are the implementer's labels — no canonical screen list exists.** No Figma (A-008 OPEN) |
| **Expected output** | PASS / FAIL, required fixes, review record |
| **Environment** | Local checkout; Chromium at 390 × 844, 834 × 1100, 1280 × 1000, both screens; `tsc` / `eslint` / `vitest` / `vite build` re-run |
| **Deployment allowed** | N/A — review. Nothing deployed |
| **Status** | **CANONICAL — 21 September 2026** |
| **Result** | **FAIL (conditional) — narrower than A-021.** High: lifecycle and category folded into one enum; documents wear *fact* epistemic badges ("Read out by AI", "Stated in a document · \<own filename\>"); locker card lacks page count / upload date / verification state and offers only *Remove* (no *view*). Medium: no scan/rejected state; Cancel routed to error + `role="alert"`; no `accept` / size validation / pasted text; three contrast failures (4.39, 4.39, 3.85) from `SourceBadge` `opacity-80`; two `<h1>`s. **PASS:** upload states, processing states, responsive at all three widths on both screens, all targets ≥ 44 px. Validation 34/34 / green. Ten fixes → **A-025** |
| **Evidence** | [docs/design/NYAYOS_SPRINT3_EVIDENCE_CONFORMANCE_REVIEW_A024.md](../design/NYAYOS_SPRINT3_EVIDENCE_CONFORMANCE_REVIEW_A024.md) |
| **Limitations** | NVDA / VoiceOver pass still not run (owed since A-014). Contrast computed from rendered oklch tokens, not an external tool. File-dialog and real drag-drop not exercised (fixture handlers verified in tests) |
| **Handoff back to M365 Copilot** | Assign **A-025** before Timeline / Evidence Mapping (both consume the document model). Adopt *build outputs enter at REVIEW*. Decide A-008 |

### A-027 — Print export completion

| Field | Value |
|---|---|
| **Assignment ID** | A-027 |
| **Tool and exact mode** | Claude Code — Print Export: headless Chrome (installed binary) driven by puppeteer-core 24 from a scratch directory; pypdf for verification. Nothing installed into the repository |
| **Purpose** | Generate final printable exports (13 PDF, 13 PNG) from all 13 HTML sources in `docs/print/` (commits `08a00eb`, `d1fe915`) and verify print quality |
| **Input files** | `docs/print/*.html` (13) |
| **Expected output** | `docs/print/exports/pdf/*.pdf` (13) · `docs/print/exports/png/*.png` (13) · manifest with checksums |
| **Environment** | Local; Google Fonts fetched at render time (Hind Siliguri, Noto Sans) |
| **Deployment allowed** | N/A — documentation artefacts. Nothing deployed |
| **Status** | **CANONICAL — 21 September 2026** |
| **Result** | 26 files rendered. **Verified:** all 13 PDFs opened — page count, MediaBox vs declared `@page` (all within 0.3 mm), embedded font subsets, extracted text, blank-page scan, opened in Chromium's viewer; all 13 PNGs opened — dimensions vs page width and visual inspection. **Two source defects found and corrected in-line** (`deck-pitch.html`: invalid `@page … landscape` printed Letter portrait, and screen-only padding produced 10 pages with 2 blank — now 8 pages at 254×143; `business-card.html`: 3-up row exceeded A4 printable width and clipped the left card — now stacked, one page). **Five layout notes left for the author** → A-028. **ID note:** first prepared as A-026; that ID was taken by the concurrently pushed Sprint 4 build, so this is recorded as A-027 |
| **Evidence** | [docs/print/exports/NYAYOS_PRINT_EXPORT_MANIFEST.md](../print/exports/NYAYOS_PRINT_EXPORT_MANIFEST.md) |
| **Limitations** | PNGs are full-page rasters under print media at 2× (192 dpi-equivalent) — proofing quality, not press plates. Brochure, both A5 handouts (mediator, government), observation sheet and feedback form are delivered as rendered with their overrun/fit issues documented, not redesigned. Symbol glyphs (✓ ✗ → ₹) fall back to Arial / Segoe UI Symbol. Repository rules changed: `.gitignore` and `task-gate` now permit PDF/PNG **only** under `docs/print/exports/`. The export commit `f957a43` shipped a stale manifest because of a scripting fault; corrected in the following commit |
| **Handoff back to M365 Copilot** | Exports are canonical. Assign **A-028** for the five source notes and placeholders, then re-run the export. **Sprint 4 (A-026) landed without a conformance review — schedule one before Sprint 5** |

### A-029 — Repository alignment audit; operating system and status established

| Field | Value |
|---|---|
| **Assignment ID** | A-029 |
| **Tool and exact mode** | Claude Code — Repository Alignment Auditor and Continuity Maintainer (read-only audit; documentation-only commit) |
| **Purpose** | Verify repository identity; inventory the repository; compare against the Master Operating System Directive; create `NYAYOS_OPERATING_SYSTEM.md` and `NYAYOS_STATUS.json`; reconcile the 22 Sep 2026 strategic decisions; define the next assignment |
| **Input files** | Founder instruction 22 Sep 2026 ("Current verified state"); Ecosystem Architecture Review V1 (imported); Product Spec V1; Master Context V1; Decision Log V1; Risk Register V1; Continuity Handoffs V1/V2; Architecture Review; Lovable Build Brief V1; Real-Case Evaluation Protocol V1; 90-Day Validation Plan V1. **Not supplied:** the Master Operating System and Continuity Directive itself |
| **Expected output** | Operating system document; status JSON; decision records D-019–D-030; register/dashboard/index/README updates |
| **Environment** | Local working copy of the canonical repository, `main` at `dbd30939c76b5397c479c28ad5260277ca59fbfd`; remote identity verified by `git remote -v`, `git fetch`, `git ls-remote`, `gh repo view` (PRIVATE) |
| **Deployment allowed** | **NOT ALLOWED.** No code, database, staging or production change |
| **Status** | **CANONICAL — 22 September 2026** |
| **Result** | Identity verified. Inventory: 17 frontend components, 4 test files (53/53 pass, `tsc` clean), no schema/migrations/backend/deployment config/security docs. Decisions D-019–D-030 appended with history preserved. Ecosystem Review V1 imported unchanged. Gap register ranked P0/P1/P2 in the operating system § 23. Two foreign-project `.pptx` files found untracked in the working copy — not staged; `*.pptx`/`*.xlsx` added to `.gitignore` |
| **Evidence** | [NYAYOS_OPERATING_SYSTEM.md](../../NYAYOS_OPERATING_SYSTEM.md) · [NYAYOS_STATUS.json](../../NYAYOS_STATUS.json) |
| **Limitations** | The directive document was not available; its content is represented only via the instruction block (REPORTED). Legal claims in the Ecosystem Review were not re-verified against primary sources. Staging environment never verified (no URL supplied). A local `NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md` exists in Downloads — UNVERIFIED, not imported. Master Context V1 § 9 left unedited by rule; superseded by the operating system § 22 |
| **Handoff back to M365 Copilot** | Next: **A-010** (Claude Chat, Opus with Extended Thinking — Security + Data Architecture Specification V1). Founder-only: legal opinion; supply the directive; remove the `.pptx` files; decide A-008; review Sprint 4 |

---

## Open assignments — not yet issued

| Proposed ID | Assignment | Tool / mode | Gate |
|---|---|---|---|
| A-008 | **Figma V2** | Figma — design mode | Founder assigns owner |
| A-009 | **User interviews + WTP validation** | Founder-led field research | Founder defines exact category boundary |
| A-010 | **NyayOS Security + Data Architecture Specification V1** | Claude Chat — Opus with Extended Thinking | **NEXT P0 (D-030).** Research and specification only; deployment not allowed. Inputs A-005, A-006, A-029 |
| A-010 | **NyayOS Security + Data Architecture Review** (research/specification only) | Recommended in the Continuity Handoff. Inputs: Master Product Spec V1, Architecture Review, Risk Register V1, Real Case Evaluation Protocol | May run in parallel with A-008/A-009 |
| A-011 | **Sprint 1 Foundation — Lovable staging build** | Lovable — staging build | ● **CANONICAL** (imported under A-017; gaps recorded in A-014 § 11.3) |
| A-012 | **Production build / deployment** | TBD | ⛔ **NOT AUTHORIZED.** Requires FA-002 |
| A-018 | **Sprint 1.1 — State Completion** | Lovable — staging build | ● **CANONICAL** — validated 21 Sep 2026 |
| A-015 | **Sprint 2 — Fact Card System build** | Lovable — staging build | ⛔ **OPEN** — A-022 is now CANONICAL; still waiting on A-008 (design) and a conformance re-review |
| A-026 | **Sprint 4 — Parties & Entities (S11) and Timeline (S12)** | Lovable — staging build | ● **CANONICAL** — validated 21 Sep 2026. Party Card and Timeline built on the canonical state model; conformance re-review recommended |
| A-028 | **Print source corrections** | Founder — HTML edit | Open. Five layout notes + placeholders in the [export manifest](../print/exports/NYAYOS_PRINT_EXPORT_MANIFEST.md); re-run export after |
| A-025 | **Sprint 3 evidence conformance fixes — evidence model remediation** | Lovable — staging build | ● **CANONICAL** — validated 21 Sep 2026. A-024 § 4 blockers 1–7 delivered; locker page count / verification-state metadata and the screen-reader pass remain open |
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

---

### A-025 — Evidence model remediation

| Field | Value |
|---|---|
| **Assignment ID** | A-025 |
| **Owner / tool** | Lovable — staging build |
| **Purpose** | Fix the A-024 § 4 blockers in the Sprint 3 evidence model |
| **Input files** | A-024 review `2bed9817aeae691a189715df28824cba747c72b6`; A-023 implementation `296fad81b5a122cb38c360919a14d145ac234c8b` |
| **Gate** | FA-001 (staging only) |
| **Deployment allowed** | **NOT ALLOWED for this assignment.** Nothing deployed; production remains prohibited without FA-002 |
| **Status** | **CANONICAL — 21 September 2026.** 40/40 tests · typecheck · lint 0 errors (8 pre-existing react-refresh warnings) · build · responsive 390 / 834 / 1280 PASS with no console errors |
| **Result** | 1. Document **lifecycle** (`queued`, `scanning`, `processing`, `extracted`, `rejected`, `error`) separated from document **category** (`contract`, `invoice`, `receipt`, `communication`, `uncategorized`, `other`); both are shown as distinct, labelled chips. 2. Document provenance added — uploaded by, upload date, document hash — replacing fact epistemic badges on the document itself. 3. All AI read-out moved into a dedicated **extraction summary** block that carries the source, locator, date precision and confidence band. 4. Actions added: **View, Rename, Confirm type, Correct type, Remove** (plus Retry for rejected/error). 5. **Cancel** stops the transfer and removes the queue item without creating an error state or `role="alert"`. 6. `accept` attribute (`.pdf,.png,.jpg,.jpeg,.txt`), 10 MB size validation with a refusal banner and rejected cards, and a validated **pasted-text** entry. 7. Contrast raised (badge `opacity-80` dropped, foreground/`border-strong` tokens used), duplicate `<h1>` removed (workspace heading is now `<h2>`), and drag-over feedback added to the drop target |
| **Evidence** | `app/src/components/nyayos/evidence-card.tsx`, `app/src/components/nyayos/evidence-workspace.tsx`, `app/src/styles.css`, `app/tests/evidence.test.tsx` (13 tests), `app/README.md`, `app/roadmap.md` |
| **Limitations** | Frontend staging fixtures only: nothing is persisted, and no OCR, AI, API or backend workflow was added. Locker cards still lack page count and a verification-state field. NVDA / VoiceOver verification remains open (owed since A-014); contrast was raised against semantic tokens rather than re-measured with an external tool. A-008 design artefact remains absent |
| **Handoff back to M365 Copilot** | A-025 is CANONICAL as a validated staging implementation. No deployment occurred and no Sprint 4 work started. A conformance re-review of the new document model is recommended before Timeline and Evidence Mapping |

---

### A-026 — Sprint 4 Parties & Entities and Timeline

| Field | Value |
|---|---|
| **Assignment ID** | A-026 |
| **Owner / tool** | Lovable — staging build |
| **Purpose** | Build S11 Parties & Entities and S12 Timeline on the canonical Sprint 1.1 state model |
| **Input files** | A-025 implementation `d1fe9150363db898fac607286b0790607a95dfd7` (instruction cites `bfa2db7ae1d9feac3849efaad47016c2b3279a2d`); A-018 state model; A-020 / A-022 Fact Cards; A-023 / A-025 evidence model |
| **Gate** | FA-001 (staging only) |
| **Deployment allowed** | **NOT ALLOWED for this assignment.** Nothing deployed; production remains prohibited without FA-002 |
| **Status** | **CANONICAL — 21 September 2026.** 53/53 tests · typecheck · lint 0 errors (11 pre-existing react-refresh warnings) · build · responsive 390 / 834 / 1280 PASS with no console errors |
| **Result** | **S11:** `PartyCard` shows name, role, relationship, an always-visible provenance strip and a confirmed / to-review chip, with **Confirm · Edit · Remove** actions and an **Add party** form; multiple parties are supported and editing a party returns it to review with a user-correction source. **S12:** `TimelineEventCard` renders all five date precisions (exact, approximate, inferred, conflicting, unknown-date), a source reference on every event, and an explicit "dates disagree" conflict indicator; the timeline supports **add / edit / remove event** and **filters** by date certainty or conflicts only, and the date field is disabled and not required when the date is unknown. Both screens share one responsive shell section |
| **Evidence** | `app/src/components/nyayos/party-card.tsx`, `app/src/components/nyayos/timeline-event-card.tsx`, `app/src/components/nyayos/parties-timeline-workspace.tsx`, `app/src/components/nyayos/app-shell.tsx`, `app/src/routes/index.tsx`, `app/tests/parties-timeline.test.tsx` (13 tests), `app/README.md`, `app/roadmap.md` |
| **Limitations** | Frontend staging fixtures only: parties and events are not persisted and no backend, OCR or AI was added. Conflict resolution is indicated, not resolved — no merge or adjudication flow exists. NVDA / VoiceOver verification remains open (owed since A-014); no formal contrast audit. A-008 design artefact remains absent, so visual conformance is judged against canonical text and existing components |
| **Handoff back to M365 Copilot** | A-026 is CANONICAL as a validated staging implementation. No deployment occurred and no Sprint 5 work started. A design conformance review of S11 / S12 is recommended before Evidence Mapping |

---

### A-031 — Fast Mode specification set import

| Field | Value |
|---|---|
| **Assignment ID** | A-031 |
| **Owner / tool** | Claude Chat — Opus with Extended Thinking (specification only); imported by Claude Code under A-030 |
| **Purpose** | Bring the founder-supplied Fast Mode specification set into the canonical repository unchanged so that A-030 can cite CANONICAL inputs |
| **Input files** | Founder-supplied on 23 Sep 2026: `NYAYOS_FAST_MODE_STRATEGY_V1.md`, `NYAYOS_FM_A_SCOPE_SHEET_V1.md`, `NYAYOS_BUILD_BRIEF_V2.md`, `NYAYOS_COUNSEL_BRIEF_V1.md`, `NYAYOS_FM0_CONCIERGE_PACK_V1.md`, `Executive Architecture Deck.pptx`, `Executive Product Vision Deck.pptx` |
| **Gate** | None (documents only) |
| **Deployment allowed** | Not applicable |
| **Status** | **CANONICAL — 23 September 2026** (imported byte-identical; hashes in the registry notes) |
| **Result** | Five Markdown specifications imported unchanged into `docs/product`, `docs/implementation`, `docs/founder`; two `.pptx` decks (gitignored) represented by verbatim text extracts with source SHA-256 |
| **Evidence** | `docs/implementation/NYAYOS_FM_A_SCOPE_SHEET_V1.md` and the six sibling files listed in the registry |
| **Limitations** | Specifications only; none asserts that any implementation exists. Deck layouts and diagrams are not reproduced. The Executive Architecture Deck numbers S1–S16 differently from the Scope Sheet — reconciled in the A-030 gap report §3 |
| **Handoff back to M365 Copilot** | Record as canonical inputs; the Scope Sheet and the Security & Data Architecture Spec govern where the decks disagree |

---

### A-030 — FM-A Foundation Build (canonical integration branch)

| Field | Value |
|---|---|
| **Assignment ID** | A-030 |
| **Owner / tool** | Claude Code — Canonical Repository Integration and FM-A Foundation Build |
| **Purpose** | Create `feature/fma-foundation-v1`; assess the repository; integrate the FM-A UI package; build the security foundation and FM-A data model; produce the U01–U21 gap report and S1–S16 coverage matrix |
| **Input files** | A-010 Security & Data Architecture Spec V1; A-031 Fast Mode specification set; A-017/A-018/A-026 staging frontend (`app/`); A-029 operating system. **The Figma FM-A source handoff package was not supplied and does not exist locally** |
| **Gate** | FA-001 (staging only). No deployment · no production change · no direct `main` commit · no legal functionality · no AI functionality · no advocate marketplace |
| **Deployment allowed** | **NOT ALLOWED.** Nothing deployed; no database provisioned or written; SQL migration not applied |
| **Status** | **REVIEW — 23 September 2026.** Branch pushed; founder to review and merge by pull request. 132/132 tests (79 new) · `tsc` clean · `eslint` 0 errors · build · schema-lint clean · migration executed on an ephemeral local Postgres 16.14 container: 41/41 smoke checks PASS (no environment created) |
| **Result** | 1. Repository assessment and integration strategy (`docs/architecture/NYAYOS_FMA_REPOSITORY_ASSESSMENT_A030.md`). 2. Domain foundation `app/src/domain/` — 14 modules: reserved enums (CR-3), table registry and deletion allow-list (CR-4), [PROV] config, server-built request context, `isDisputeMember` / `grantAllows` (CR-2), consent enforcement with locked purposes, identity and personal-tenant sign-up, dispute core with the provenance contract (CR-8), single-writer proposal → correction pipeline with version-chain rebuild, evidence lifecycle state machine (no promotion without a clean verdict), hash-chained content-free audit, export manifest with provenance omissions, honest deletion lifecycle with content-free tombstones, bilingual required copy and prohibited-wording guard. 3. `db/migrations/0001_fma_foundation.sql` — 39 tables, RLS enabled and forced on every table, helpers, single-writer functions, audit trigger, allow-list registration (NOT applied). 4. `scripts/db/schema-lint.mjs` + `schema-lint` workflow (static SEC-RLS-01 / SEC-DEL-06). 5. Gap report (`docs/architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md`): U01–U21 READY/PARTIAL/MISSING, S1–S16 mapping with deck/scope-sheet reconciliation, entity diagram, risks, implementation waves |
| **Evidence** | `docs/architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md`; `app/tests/domain/*.test.ts` (8 files, 79 tests); `node scripts/db/schema-lint.mjs` |
| **Limitations** | Phase 2 (Figma UI import) not executed — package missing; U01–U21 mapped against existing components only. SQL migration has been executed only on a throwaway local container, never on a provider or an environment (none exists; FD-02 pending). Hindi copy strings are working translations awaiting native review; notice and integrity wording awaits counsel (OL-01, OL-04, OL-08). No server functions, auth provider, storage or scan adapter exist yet |
| **Handoff back to M365 Copilot** | Record A-030 as REVIEW on `feature/fma-foundation-v1`; open a pull request to `main` for founder review; next implementation wave is W1 in the gap report §7 (auth + tenant + consent server functions on a staging database once FD-02 is decided) |

---

### A-032 — Independent review and merge-readiness audit of A-030

| Field | Value |
|---|---|
| **Assignment ID** | A-032 |
| **Owner / tool** | Claude Code — Independent Review & Merge Readiness Audit |
| **Purpose** | Fresh review of PR #2 (`feature/fma-foundation-v1`, commits `a23faf85`, `63ac9f29`) against the FM-A Scope Sheet, Security & Data Architecture Spec, Build Brief V2, Counsel Brief V1, the four decks and the A-030 reports; issue a merge recommendation |
| **Input files** | The 14 mandated inputs. Two decks (FM-A Product & User Flow, FM-0 Concierge) were not in the repository and were not A-030 inputs; imported as text extracts under this task |
| **Gate** | None required (review). Deployment NOT allowed; production NOT allowed — nothing deployed |
| **Deployment allowed** | **NOT ALLOWED.** The migration was executed only on a throwaway local Postgres 16.14 container for the probes; destroyed afterwards |
| **Status** | **CANONICAL — 23 September 2026** (review delivered; precedent A-021 / A-024) |
| **Result** | **MERGE WITH FIXES.** Critical 2 · Major 8 · Minor 12. Nine defects verified by execution, two by a temporary test probe. Scope compliance verified (no AI, legal, representation, marketplace, deployment or dependency change). Required fixes before merge and design decisions before W1 are listed in the report §8–§9 |
| **Evidence** | `docs/architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md`; probe transcripts summarised in §11 |
| **Limitations** | Reviewer is the same tool that built A-030; independence is procedural (fresh session, execution-based verification, adversarial probes), not organisational. No fixes were applied. The FM-A Product & User Flow deck's U01–U21 differ from the Scope Sheet's; the cross-map is the reviewer's, not a founder decision |
| **Handoff back to M365 Copilot** | Record A-032 CANONICAL; A-030 stays REVIEW until the §8 fixes land on the branch and the founder re-reviews; founder decisions D-031…D-036 candidates in §9 |

---

### A-033 — Critical fix pack for A-030

| Field | Value |
|---|---|
| **Assignment ID** | A-033 |
| **Owner / tool** | Claude Code — A-033 Critical Fix Pack |
| **Purpose** | Fix only the items blocking merge from the A-032 review: C-1 audit-chain concurrency fork, C-2 deletion-request authorisation, M-1 consent-withdrawal ordering, M-4 provenance and identity guards, M-5 export-manifest item typing |
| **Input files** | PR #2; `docs/architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md`; `feature/fma-foundation-v1` at `05bbd1a4` |
| **Gate** | FA-001 (staging only). Deployment NOT allowed; production NOT allowed |
| **Deployment allowed** | **NOT ALLOWED.** Verified only on an ephemeral local Postgres 16.14 container, destroyed afterwards; nothing applied to any environment |
| **Status** | **REVIEW — 23 September 2026.** All five scoped findings closed; PR #2 remains a draft for founder re-review |
| **Result** | Migration `0001` (unmerged, so edited in place per A-032 §8): advisory transaction lock in the audit trigger; `request_deletion()` server function replaces the direct INSERT grant and policy; `decide_proposal` refuses identity keys, sets `created_by` from the session, refuses `ai_extraction`, validates `source_ref`; CHECK constraints `*_source_ref_shape` (11 tables) and `*_fma_origin_inert` (10 tables). Domain: order-independent `requirePurpose`; `SERVER_CONTROLLED_KEYS` guard in `proposeChange`; explicit `itemType` on every canonical item and a typed manifest; `newDeletionRequest` verifies ownership. Tests: 6 new Vitest tests; 13 new smoke checks; `audit_concurrency_0001.sh` two-session proof |
| **Evidence** | `db/tests/smoke_0001.sql` (54/54 PASS); `db/tests/audit_concurrency_0001.sh` (PASS: chain intact, 0 forked predecessors); A-032 probes PROBE1/4/4b/5b/7 re-run and now fail closed; `vitest`, `tsc`, `eslint`, `schema-lint` clean |
| **Limitations** | Scope was five items. Still open from A-032: m-1 (`status` in the dispute UPDATE grant), the M-8 U01–U21 cross-map addendum to the gap report, and the design decisions D-031…D-036 (M-2, M-3, M-6, M-7). No architecture change; no new document created |
| **Handoff back to M365 Copilot** | Record A-033 REVIEW; risk rating Medium; recommendation SAFE TO MERGE once the founder accepts m-1 and the M-8 addendum as tracked follow-ups (or applies them in one further commit) |

---

### A-036 — Duplicate Detection V1

| Field | Value |
|---|---|
| **Assignment ID** | A-036 |
| **Owner / tool** | Claude Code — development build on `feature/fma-foundation-v1` |
| **Purpose** | Build the first WAVE0 item named by A-035: hash-level, tenant-scoped, informational duplicate detection |
| **Input files** | A-035 plan §3.1; A-034 gap analysis; FM-A Scope Sheet (A10 `completeUpload`, S5 write-once originals); branch at `ff06012` |
| **Gate** | FA-001 (staging only). Deployment NOT ALLOWED |
| **Deployment allowed** | **NOT ALLOWED.** Migration `0002` executed only on a throwaway local container with `0001`; destroyed; no environment |
| **Status** | **REVIEW — 24 September 2026.** On the draft PR #2 branch for founder review |
| **Result** | `app/src/domain/duplicate.ts` (`findDuplicateVersions`, `assessDuplicate`, `duplicateAuditMetadata`); `db/migrations/0002_duplicate_lookup.sql` (index + SECURITY INVOKER `find_duplicate_versions(text)` + `duplicate_detection_mode = inform`); `EvidenceCard.duplicateOf` informational chip; bilingual `duplicate_detected` copy and `fillCopy` helper; docs updated |
| **Evidence** | Vitest 146/146 (8 new domain tests + 1 component test); `tsc`, `eslint` (0 errors), build clean; schema-lint clean; smoke 62/62 incl. 8 `DUP_*` checks (owner sees both identical versions; hex case-insensitive; unknown hash none; labels returned; other tenant sees nothing; index present; mode inform; originals untouched); concurrency proof PASS |
| **Limitations** | Not yet invoked by a server function (A10 arrives in wave W1); near-duplicates (re-scans) out of scope; Hindi copy is a working translation; UI chip is fed by props only until the evidence workspace is wired to storage |
| **Handoff back to M365 Copilot** | Record A-036 REVIEW; next per A-035 order: Stale Output Detection (A-037 candidate) — pure, read-side, no prerequisites |
