# NyayOS — Document Index

Complete map of the canonical knowledge base.
**Project:** NyayOS · **Stage:** Staging Build — Sprint 1 canonical
**Staging build:** ✅ ALLOWED (FA-001) · **Production:** ⛔ NOT ALLOWED · **Sprint 2:** GO (conditional)

← [Repository root](../README.md) · [Contributing](../CONTRIBUTING.md)

---

## Document authority hierarchy

When two documents disagree, **the higher tier wins.** Do not resolve a conflict by editing the lower-tier document — record it and escalate.

| Tier | Document | Authoritative for | Mutability |
|---:|---|---|---|
| **1** | **[Founder Authorization Record](founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md)** | **Gates** — what may be built, deployed, launched, or done with data, *right now* | **Append-only.** Supersede with a new FA entry; never edit a past one |
| **2** | [Decision Log V1](founder/NYAYOS_DECISION_LOG_V1.md) | Product and technical decisions D-001 → D-018; locked vs provisional | Append a new decision; never rewrite an existing one |
| **2** | [Risk Register V1](founder/NYAYOS_RISK_REGISTER_V1.md) | Risks R01 → R30; controls; the risk-acceptance boundary | Append; never rewrite |
| **2** | [Operating System](../NYAYOS_OPERATING_SYSTEM.md) + [`NYAYOS_STATUS.json`](../NYAYOS_STATUS.json) | **Consolidated operating directive and machine state** — mission, verified product definition, revised MVP, permanent rejections, gates summary, gap register, next assignment. Defers to tier 1 on gates and to the Decision Log on decisions; supersedes Master Context V1 § 9 | Maintainer-updated on every audit; every claim labelled VERIFIED / REPORTED / UNVERIFIED / NOT IMPLEMENTED / NOT APPLICABLE |
| **2** | [Canonical Status Rules](founder/NYAYOS_CANONICAL_STATUS_RULES.md) + [Status Registry (JSON)](founder/NYAYOS_STATUS_REGISTRY.json) | **Task status and dependencies** — `OPEN → IN_PROGRESS → REVIEW → CANONICAL → SUPERSEDED`; only CANONICAL tasks may be inputs. Enforced by `task-gate` | Edit the JSON; regenerate derived docs; CI refuses violations |
| **3** | [Master Context V1](founder/NYAYOS_MASTER_CONTEXT_V1.md) | Canonical identity, evidence posture, architecture posture | Supplied — do not edit substance |
| **3** | [Master Product Spec V1](product/NYAYOS_MASTER_PRODUCT_SPEC_V1.md) | What the product is | Supplied — do not edit substance |
| **4** | [Continuity Handoff V1](handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md) | Architecture reconciliation table — **constrains** the Architecture Review | Supplied — do not edit substance |
| **5** | [Architecture Review](architecture/ARCHITECTURE_REVIEW.md), briefs, protocols, plans | Implementation detail, **as constrained by tier 4** | Supplied — do not edit substance |
| **6** | [Research](#docsresearch--evidence-base) | Evidence only. **Never** a decision | Supplied — do not edit substance |
| **7** | [Founder Dashboard](founder/NYAYOS_FOUNDER_DASHBOARD.md), [Assignment Register](founder/NYAYOS_ASSIGNMENT_REGISTER.md), [Output Register](founder/NYAYOS_OUTPUT_REGISTER.md), [Changelog](founder/NYAYOS_CHANGELOG.md), [INDEX](INDEX.md), README, CONTRIBUTING | **Views and records.** No independent authority | Maintainer-updated every time a higher tier changes |
| **8** | [`app/`](../app/README.md) — Sprint 1 Foundation code | **Implementation.** Governed by tiers 1–5; **never a source of product truth.** If code and spec disagree, the code is wrong until a tier-2 decision says otherwise | Changes only within an authorized sprint; four checks must pass |

### Automation

`task-gate` (every push/PR) validates the registry and refuses stale derived docs · `dependency-check` (app/ changes) runs typecheck/lint/test/build · `status-update` (registry change on main) regenerates the views and opens a PR. Details: [Canonical Status Rules § 6](founder/NYAYOS_CANONICAL_STATUS_RULES.md), [Branch Protection](founder/NYAYOS_BRANCH_PROTECTION.md).

### The three rules that follow from this

1. **A gate question is answered only by tier 1.** If a tier 5 build brief exists, that is not authorization. If a tier 7 dashboard says "allowed", verify against tier 1.
2. **Research never decides anything.** The red team argues *against* the project by design; it was accepted as input, not as a verdict (see A-001).
3. **Never read the Architecture Review alone.** Tier 4 modified, deferred or rejected five of its decisions.

---

## Read in this order

| # | Document | Why |
|---|---|---|
| 0 | **[Operating System](../NYAYOS_OPERATING_SYSTEM.md)** | **The whole picture, with every claim labelled.** Read first |
| 0 | **[Founder Authorization Record](founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md)** | **What you are allowed to do.** Read before acting |
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
| [NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md](founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) | Authorization | **Tier 1 — authoritative for all gates.** Append-only |
| [NYAYOS_STATUS_REGISTRY.json](founder/NYAYOS_STATUS_REGISTRY.json) | Registry (machine) | **Tier 2 — source of truth for task status and dependencies** |
| [NYAYOS_CANONICAL_STATUS_RULES.md](founder/NYAYOS_CANONICAL_STATUS_RULES.md) | Rules | Tier 2 — the status flow and the canonical-input rule |
| [NYAYOS_STATUS_REGISTRY.md](founder/NYAYOS_STATUS_REGISTRY.md) | Generated view | Do not edit — regenerate |
| [NYAYOS_STATUS_DASHBOARD.md](founder/NYAYOS_STATUS_DASHBOARD.md) | Generated view | Auto status dashboard — counts, in-flight, ready, blocked |
| [NYAYOS_DEPENDENCY_GRAPH.md](founder/NYAYOS_DEPENDENCY_GRAPH.md) | Generated view | Mermaid graph: solid = canonical inputs, dashed = planned |
| [NYAYOS_BRANCH_PROTECTION.md](founder/NYAYOS_BRANCH_PROTECTION.md) | Record | Applied protection + ruleset; re-apply commands |
| [NYAYOS_FOUNDER_DASHBOARD.md](founder/NYAYOS_FOUNDER_DASHBOARD.md) | Dashboard | **View** — derived from the sources below |
| [NYAYOS_ASSIGNMENT_REGISTER.md](founder/NYAYOS_ASSIGNMENT_REGISTER.md) | Register | Authoritative for assignments A-001 → A-011 |
| [NYAYOS_OUTPUT_REGISTER.md](founder/NYAYOS_OUTPUT_REGISTER.md) | Register | Authoritative for artefacts and acceptance |
| [NYAYOS_CHANGELOG.md](founder/NYAYOS_CHANGELOG.md) | Changelog | Authoritative for what changed, when |
| [NYAYOS_MASTER_CONTEXT_V1.md](founder/NYAYOS_MASTER_CONTEXT_V1.md) | Supplied — A-006 | **Authoritative** for context and canonical identity |
| [NYAYOS_DECISION_LOG_V1.md](founder/NYAYOS_DECISION_LOG_V1.md) | Supplied — A-006 | **Authoritative** for decisions D-001 → D-018 |
| [NYAYOS_RISK_REGISTER_V1.md](founder/NYAYOS_RISK_REGISTER_V1.md) | Supplied — A-006 | **Authoritative** for risks R01 → R30 |

> Where the Dashboard and a source document disagree, **the source document wins.** For gates, only the Founder Authorization Record is decisive.

## `/docs/product` — what is being built

| Document | Type | Contents |
|---|---|---|
| [NYAYOS_MASTER_PRODUCT_SPEC_V1.md](product/NYAYOS_MASTER_PRODUCT_SPEC_V1.md) | Supplied — A-006 | Canonical specification for the Dispute Readiness Engine |
| [NYAYOS_FAST_MODE_STRATEGY_V1.md](product/NYAYOS_FAST_MODE_STRATEGY_V1.md) | Supplied — A-031, Claude Chat, 22 Sep 2026 | Fast Mode: FM-0 → FM-A → FM-B → FM-C → FM-D → FM-E; §7 security floor S1–S16; §14 convergence rules CR-1–CR-14 |
| [NYAYOS_FM0_CONCIERGE_PACK_V1.md](product/NYAYOS_FM0_CONCIERGE_PACK_V1.md) | Supplied — A-031 | FM-0 concierge operating pack (no code) |
| [NYAYOS_FMA_PRODUCT_USER_FLOW_DECK_V1_TEXT.md](product/NYAYOS_FMA_PRODUCT_USER_FLOW_DECK_V1_TEXT.md) | Derived — A-032 (text extract of a gitignored deck) | FM-A screen-by-screen flow. **Its U01–U21 numbering differs from the Scope Sheet**; Scope Sheet governs |
| [NYAYOS_FM0_CONCIERGE_DECK_V1_TEXT.md](product/NYAYOS_FM0_CONCIERGE_DECK_V1_TEXT.md) | Derived — A-032 (text extract of a gitignored deck) | FM-0 concierge operating playbook |
| [NYAYOS_EXECUTIVE_PRODUCT_VISION_DECK_V1_TEXT.md](product/NYAYOS_EXECUTIVE_PRODUCT_VISION_DECK_V1_TEXT.md) | Derived — A-031 (text extract of a gitignored deck) | Product vision v2 narrative, bilingual |
| [NYAYOS_MVP_RECONCILIATION_V3.md](product/NYAYOS_MVP_RECONCILIATION_V3.md) | Maintainer — A-013 | **Tier 7 view.** Consolidates the MVP position at V3 under FA-001. No new product decisions. Superseded by any founder-held V3 |

## `/docs/architecture` — how it would be built

| Document | Type | Contents |
|---|---|---|
| [NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md](architecture/NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md) | Supplied — A-010, Claude Chat, 22 Sep 2026 (imported under A-030) | **Security & Data Architecture Spec V1 — CANONICAL.** Tenant model, RLS helpers, purpose-bound consent, evidence integrity, deletion lifecycle, audit architecture, threat model, SEC test suite. Governs the FM-A security foundation |
| [NYAYOS_EXECUTIVE_ARCHITECTURE_DECK_V1_TEXT.md](architecture/NYAYOS_EXECUTIVE_ARCHITECTURE_DECK_V1_TEXT.md) | Derived — A-031 (text extract of a gitignored deck) | Executive architecture narrative. Its S1–S16 numbering differs from the Scope Sheet; see the A-030 gap report §3 |
| [NYAYOS_FMA_REPOSITORY_ASSESSMENT_A030.md](architecture/NYAYOS_FMA_REPOSITORY_ASSESSMENT_A030.md) | Maintainer — A-030 | **Phase 1 assessment:** structure, architecture inventory, conflicts, integration strategy for `feature/fma-foundation-v1` |
| [NYAYOS_GAP_ANALYSIS_V1.md](../NYAYOS_GAP_ANALYSIS_V1.md) | Maintainer — A-034 (root) | **Gap analysis:** repository inventory vs validated backlog WAVE_0 / WAVE_1 — 3 exist, 6 partial, 4 missing; sequence; lowest-effort items |
| [NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md](architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md) | Maintainer — A-032 | **Independent review of A-030 / PR #2: MERGE WITH FIXES.** 2 critical · 8 major · 12 minor; required fixes; U01–U21 cross-map; risk rating |
| [NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md](architecture/NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md) | Maintainer — A-030 | **Gap report:** U01–U21 READY / PARTIAL / MISSING · S1–S16 coverage · entity diagram · risks · implementation waves |
| [NYAYOS_ECOSYSTEM_ARCHITECTURE_REVIEW_V1.md](architecture/NYAYOS_ECOSYSTEM_ARCHITECTURE_REVIEW_V1.md) | Supplied — Claude Chat, 22 Sep 2026 (imported under A-029) | **Strategy review:** Dispute File platform with professional-review layer; four MVP additions; permanent rejections; revenue, legal-conduct, privacy, domain architecture, nyayos.global, phased roadmap. Its L1–L10 enter only through founder-ratified Decision Log entries (D-019–D-030) |
| [NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md](architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md) | Maintainer — A-014 | **Sprint 1 review — EXECUTED (§ 11).** GO (conditional) for Sprint 2 on Sprint 1.1 State Completion; typography finding retracted; ranked findings |
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
| [NYAYOS_SPRINT3_EVIDENCE_CONFORMANCE_REVIEW_A024.md](design/NYAYOS_SPRINT3_EVIDENCE_CONFORMANCE_REVIEW_A024.md) | Maintainer — A-024 | **A-023 evidence components: FAIL (conditional).** Document-model findings, browser measurements, ten fixes (A-025) |
| [NYAYOS_FACT_CARD_CONFORMANCE_REVIEW_A021.md](design/NYAYOS_FACT_CARD_CONFORMANCE_REVIEW_A021.md) | Maintainer — A-021 | **A-020 Fact Card conformance: FAIL (conditional).** Ranked findings, browser measurements, ten fixes (A-022) |

## `/docs/implementation`

| Document | Type | Status |
|---|---|---|
| [NYAYOS_LOVABLE_BUILD_BRIEF_V1.md](implementation/NYAYOS_LOVABLE_BUILD_BRIEF_V1.md) | Supplied — A-006 | **RELEASED.** Input to **A-011**, authorized for **staging only** under FA-001 |

> ⚠ The presence of a build brief is **not** build authorization. FA-001 is. It authorizes **staging only** — production remains ⛔ NOT ALLOWED, and no real case data may be used in any environment.

## `/docs/print` — outreach and research collateral

| Item | Type | Contents |
|---|---|---|
| `docs/print/*.html` (13) | Founder-supplied sources | Flyer, 4 A5 handouts, tri-fold, business card, A3 poster, standee, pitch deck, feedback form, interview sheet, observation sheet |
| [`exports/NYAYOS_PRINT_EXPORT_MANIFEST.md`](print/exports/NYAYOS_PRINT_EXPORT_MANIFEST.md) | Maintainer — A-027 | Verification record and SHA-256 for all 26 exports; print-quality notes |
| `exports/pdf/` · `exports/png/` | Generated — A-027 | **The only place PDFs/PNGs may be tracked** (`.gitignore` + `task-gate` carve-out). Everything else with those extensions is treated as case material |

## `/docs/evaluation`

| Document | Type | Contents |
|---|---|---|
| [NYAYOS_90_DAY_VALIDATION_PLAN_V1.md](evaluation/NYAYOS_90_DAY_VALIDATION_PLAN_V1.md) | Supplied — A-006 | Validation sequence gating the build decision |
| [NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md](evaluation/NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md) | Supplied — A-006 | **Governs private-matter evaluation.** Enforces D-005 / D-017; controls R09 / R29 |

## `/docs/handoffs`

| Document | Type | Contents |
|---|---|---|
| [NYAYOS_CONTINUITY_HANDOFF_V2.md](handoffs/NYAYOS_CONTINUITY_HANDOFF_V2.md) | Maintainer — A-017 | **Current project state** after Sprint 1 import; validation record; Sprint 1 gaps; carried risks. Supersedes V1 for state only |
| [NYAYOS_CONTINUITY_HANDOFF_V1.md](handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md) | Supplied — A-006 | **Architecture reconciliation table (still authoritative)**; original project state (superseded by V2) |
| [NYAYOS_V1_DELIVERABLES_README.md](handoffs/NYAYOS_V1_DELIVERABLES_README.md) | Supplied — A-006 | Original V1 bundle manifest. Renamed to avoid collision with the root README; **content unchanged** |

---

## Quick reference

### Locked

Dispute Readiness Engine · "What happened?" entry · small-business/FPO/commercial wedge · consumer sandbox · criminal private sandbox · human decision authority · provenance-first · multi-tenant-ready schema · Supabase/Postgres/RLS · pgvector · deterministic workflow over generalized agents · **NyayOS** spelling

### Provisional

Exact commercial wedge boundary · pricing · retention period · OCR provider · model provider · launch geography · exact vendor stack · professional monetization · expansion order

### Top five risks

1. Unsupported claims · 2. Sensitive-data leakage · 3. Epistemic confusion · 4. Prompt injection · 5. Commercial validation failure

### Next actions — parallel, revised under FA-001

1. Assign build owner + record staging code location → 2. Lovable staging build *(authorized)* → 3. Figma V2 → 4. User interviews + WTP → 5. Founder go/no-go **for production** *(gated — FA-002 not granted)*

---

## Not in this repository — deliberately

| Item | Reason |
|---|---|
| Private case files (FIR, bail, chargesheet, correspondence, chat exports) | Private evaluation only. Blocked by [`.gitignore`](../.gitignore); never staged |
| Credentials, tokens, `.env` files | Never committed |
| Schema, migrations, database resources, backend, infrastructure | Not yet authorized. Only the Sprint 1 frontend foundation is in `app/` |
| `nyayos-sprint1-foundation.zip`, `app/node_modules`, `app/.output`, `app/.wrangler`, `app/package-lock.json` | Gitignored. Lockfile of record is `app/bun.lock` |
| `NYAYOS_V1_REVISED_DELIVERABLES.zip` | Redundant — its contents are committed individually |
| [NYAYOS_FM_A_SCOPE_SHEET_V1.md](implementation/NYAYOS_FM_A_SCOPE_SHEET_V1.md) | Supplied — A-031, Claude Chat, 22 Sep 2026 | **FM-A Scope Sheet V1 — governs FM-A.** F01–F24, data model §4, API A01–A28, UI U01–U21, security S1–S16, tests, exit gate. Where the decks disagree, this sheet wins |
| [NYAYOS_BUILD_BRIEF_V2.md](implementation/NYAYOS_BUILD_BRIEF_V2.md) | Supplied — A-031, Claude Chat | Build Brief V2 — milestones M0–M7, acceptance criteria, conventions (§3.3). FM-A is a strict subset (CR-1) |
| [NYAYOS_COUNSEL_BRIEF_V1.md](founder/NYAYOS_COUNSEL_BRIEF_V1.md) | Supplied — A-031, Claude Chat | Counsel Brief V1 — open legal questions OL-01…OL-11, blocking matrix; **OL-01 and OL-04 block any pilot**. Not legal advice |
