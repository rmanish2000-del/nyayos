# NyayOS — Document Index

Complete map of the canonical knowledge base.
**Project:** NyayOS · **Stage:** Pre-build · **Deployment:** NOT ALLOWED

← [Repository root](../README.md) · [Contributing](../CONTRIBUTING.md)

---

## Read in this order

| # | Document | Why |
|---|---|---|
| 1 | [Founder Dashboard](founder/NYAYOS_FOUNDER_DASHBOARD.md) | Current state on one screen |
| 2 | [Master Context](founder/NYAYOS_MASTER_CONTEXT_V1.md) | Full context in one document |
| 3 | [Decision Log](founder/NYAYOS_DECISION_LOG_V1.md) | Why each decision was made |
| 4 | [Risk Register](founder/NYAYOS_RISK_REGISTER_V1.md) | What can go wrong and what controls it |
| 5 | [Master Product Spec](product/NYAYOS_MASTER_PRODUCT_SPEC_V1.md) | What is being built |
| 6 | [Continuity Handoff](handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md) | How to pick the project up cold |

---

## `/docs/founder` — governance and continuity

| Document | Type | Authority |
|---|---|---|
| [NYAYOS_FOUNDER_DASHBOARD.md](founder/NYAYOS_FOUNDER_DASHBOARD.md) | Dashboard | **View** — derived from the sources below |
| [NYAYOS_ASSIGNMENT_REGISTER.md](founder/NYAYOS_ASSIGNMENT_REGISTER.md) | Register | Authoritative for assignments A-001 → A-011 |
| [NYAYOS_OUTPUT_REGISTER.md](founder/NYAYOS_OUTPUT_REGISTER.md) | Register | Authoritative for artefacts and acceptance |
| [NYAYOS_CHANGELOG.md](founder/NYAYOS_CHANGELOG.md) | Changelog | Authoritative for what changed, when |
| [NYAYOS_MASTER_CONTEXT_V1.md](founder/NYAYOS_MASTER_CONTEXT_V1.md) | Supplied — A-006 | **Authoritative** for context and canonical identity |
| [NYAYOS_DECISION_LOG_V1.md](founder/NYAYOS_DECISION_LOG_V1.md) | Supplied — A-006 | **Authoritative** for decisions D-001 → D-018 |
| [NYAYOS_RISK_REGISTER_V1.md](founder/NYAYOS_RISK_REGISTER_V1.md) | Supplied — A-006 | **Authoritative** for risks R01 → R30 |

> Where the Dashboard and a source document disagree, **the source document wins.**

## `/docs/product` — what is being built

| Document | Type | Contents |
|---|---|---|
| [NYAYOS_MASTER_PRODUCT_SPEC_V1.md](product/NYAYOS_MASTER_PRODUCT_SPEC_V1.md) | Supplied — A-006 | Canonical specification for the Dispute Readiness Engine |

## `/docs/architecture` — how it would be built

| Document | Type | Contents |
|---|---|---|
| [ARCHITECTURE_REVIEW.md](architecture/ARCHITECTURE_REVIEW.md) | Supplied — A-005 | TanStack Start / React 19 / Vite 7 on edge runtime; Supabase Postgres + Auth + Storage + RLS; pgvector; server-side AI gateway; append-only audit; closed tool catalog |

> **Do not read the architecture review alone.** Five of its decisions were modified, made provisional, deferred or rejected during reconciliation. Read it alongside the reconciliation table in the [Continuity Handoff](handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md).

## `/docs/research` — evidence base

| Document | Type | Contents |
|---|---|---|
| [NYAYAOS_RED_TEAM_REPORT.md](research/NYAYAOS_RED_TEAM_REPORT.md) | Supplied — A-001 | Adversarial analysis: TAM/SAM/SOM, competitors, moats, regulatory threats, failure modes |
| [NYAYAOS_GLOBAL_BENCHMARK_REPORT.md](research/NYAYAOS_GLOBAL_BENCHMARK_REPORT.md) | Supplied — A-002 | Six-country justice-AI and ODR benchmark |
| [NYAYAOS_INDIAN_JUSTICE_MAP.md.md](research/NYAYAOS_INDIAN_JUSTICE_MAP.md.md) | Supplied — A-003 | Indian dispute volumes and categories by court level |
| [NYAYAOS_MVP_SELECTION_REPORT.md](research/NYAYAOS_MVP_SELECTION_REPORT.md) | Supplied — A-004 | MVP selection → Dispute Readiness Engine |

> **Two cautions.** (1) These are **secondary-source** documents — re-verify primary sources before external publication, procurement or legal implementation. (2) The red team argues **against** the project by design; its conclusion was accepted as *research input*, not as the product decision. It changed the buyer and wedge assumptions — it did not stop the project.
>
> Filenames use the legacy `NYAYAOS_` spelling deliberately, for provenance. Canonical name for all new work is **NyayOS**.

## `/docs/design`

| Document | Type | Status |
|---|---|---|
| [NYAYOS_FIGMA_BRIEF_V2.md](design/NYAYOS_FIGMA_BRIEF_V2.md) | Supplied — A-006 | Input to **A-008 Figma V2** — pending |

## `/docs/implementation`

| Document | Type | Status |
|---|---|---|
| [NYAYOS_LOVABLE_BUILD_BRIEF_V1.md](implementation/NYAYOS_LOVABLE_BUILD_BRIEF_V1.md) | Supplied — A-006 | **HELD.** Input to **A-011** — blocked pending founder go decision |

> ⚠ The presence of a build brief is **not** build authorization.

## `/docs/evaluation`

| Document | Type | Contents |
|---|---|---|
| [NYAYOS_90_DAY_VALIDATION_PLAN_V1.md](evaluation/NYAYOS_90_DAY_VALIDATION_PLAN_V1.md) | Supplied — A-006 | Validation sequence gating the build decision |
| [NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md](evaluation/NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md) | Supplied — A-006 | **Governs private-matter evaluation.** Enforces D-005 / D-017; controls R09 / R29 |

## `/docs/handoffs`

| Document | Type | Contents |
|---|---|---|
| [NYAYOS_CONTINUITY_HANDOFF_V1.md](handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md) | Supplied — A-006 | Project state, locked feature, architecture reconciliation table, evidence gaps, recommended next assignment |
| [NYAYOS_V1_DELIVERABLES_README.md](handoffs/NYAYOS_V1_DELIVERABLES_README.md) | Supplied — A-006 | Original V1 bundle manifest. Renamed to avoid collision with the root README; **content unchanged** |

---

## Quick reference

### Locked

Dispute Readiness Engine · "What happened?" entry · small-business/FPO/commercial wedge · consumer sandbox · criminal private sandbox · human decision authority · provenance-first · multi-tenant-ready schema · Supabase/Postgres/RLS · pgvector · deterministic workflow over generalized agents · **NyayOS** spelling

### Provisional

Exact commercial wedge boundary · pricing · retention period · OCR provider · model provider · launch geography · exact vendor stack · professional monetization · expansion order

### Top five risks

1. Unsupported claims · 2. Sensitive-data leakage · 3. Epistemic confusion · 4. Prompt injection · 5. Commercial validation failure

### Next actions

1. Figma V2 → 2. User interviews + WTP → 3. Founder go/no-go → 4. Lovable staging build *(gated)*

---

## Not in this repository — deliberately

| Item | Reason |
|---|---|
| Private case files (FIR, bail, chargesheet, correspondence, chat exports) | Private evaluation only. Blocked by [`.gitignore`](../.gitignore); never staged |
| Credentials, tokens, `.env` files | Never committed |
| Product code, schema, migrations, infrastructure | Repository is documentation only |
| `NYAYOS_V1_REVISED_DELIVERABLES.zip` | Redundant — its contents are committed individually |
