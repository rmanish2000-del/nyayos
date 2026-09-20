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

---

## Open assignments — not yet issued

| Proposed ID | Assignment | Tool / mode | Gate |
|---|---|---|---|
| A-008 | **Figma V2** | Figma — design mode | Founder assigns owner |
| A-009 | **User interviews + WTP validation** | Founder-led field research | Founder defines exact category boundary |
| A-010 | **NyayOS Security + Data Architecture Review** (research/specification only) | Recommended in the Continuity Handoff. Inputs: Master Product Spec V1, Architecture Review, Risk Register V1, Real Case Evaluation Protocol | May run in parallel with A-008/A-009 |
| A-011 | **Lovable staging build** | Lovable | **BLOCKED** — requires recorded founder go decision |

---

## Handoff back to M365 Copilot

**From:** Claude Code — Repository and Product-Continuity Maintainer (A-007)
**To:** M365 Copilot — project orchestration

1. The canonical repository is now initialized and is the **single source of truth**. Read from it; do not re-derive context from chat history.
2. Entry points: [README.md](../../README.md) → [docs/INDEX.md](../INDEX.md) → [NYAYOS_FOUNDER_DASHBOARD.md](NYAYOS_FOUNDER_DASHBOARD.md).
3. **Open items requiring founder input**, all recorded above: tool/mode for A-002 to A-006; the MVP report filename discrepancy (A-004); the locked-vs-provisional status of the commercial wedge; whether the private matter name should be redacted from committed documents.
4. **Deployment remains NOT ALLOWED.** A-011 is blocked pending a recorded go decision.
5. Every new assignment must be added to this register **before** work begins, and its output added to [NYAYOS_OUTPUT_REGISTER.md](NYAYOS_OUTPUT_REGISTER.md) on completion.
