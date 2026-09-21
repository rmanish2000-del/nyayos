# NYAYOS FOUNDER DASHBOARD

**Canonical project name:** NyayOS
**Status date:** 20 September 2026
**Maintained by:** Repository and Product-Continuity Maintainer (Claude Code)
**Machine view:** [NYAYOS_STATUS_DASHBOARD.md](NYAYOS_STATUS_DASHBOARD.md) (auto-generated from the [status registry](NYAYOS_STATUS_REGISTRY.json)) · [dependency graph](NYAYOS_DEPENDENCY_GRAPH.md) · [status rules](NYAYOS_CANONICAL_STATUS_RULES.md)
**Authority:** This dashboard is a *view*. It has no independent authority.
For gates, [NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md](NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) governs.
For decisions, risks and context, the V1 records govern.
See the [authority hierarchy](../INDEX.md#document-authority-hierarchy).
Where this dashboard and a higher-tier document disagree, **the higher-tier document wins.**

---

## A. Vision North Star

> **Justice starts with clarity.**

## B. Product North Star

> **Turn unstructured disputes into structured, evidence-linked, human-reviewable dispute files.**

## C. North Star Metric

> **Completed usable dispute files per week.**

**Current value:** *Not yet measurable — pre-launch.*
No product exists, no users exist, no dispute files have been produced. This metric becomes measurable only after a staging build and a pilot cohort exist. Do not substitute a proxy metric in the interim.

## D. Current phase

> **Staging Build — Sprint 1 canonical → Sprint 1.1 / Sprint 2**

Changed 21 Sep 2026. Sprint 1 Foundation is **imported and canonical** (A-017). Design and validation remain incomplete and run in parallel.

## E. Current objective

> **Stand up the staging build while completing Figma V2 and validating the commercial wedge.**

**Changed 21 Sep 2026 (FA-001).** The prior objective was *"Complete Figma V2 and validate the commercial wedge **before** implementation."* The founder has authorized the staging build to proceed ahead of that sequence. Design and validation are **not** cancelled — they now run concurrently, and the staging build should be used as an instrument to accelerate them. See the risk note in [FA-001](NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md).

---

## Gate status — FA-001

| Gate | Status |
|---|---|
| **Lovable staging build** | ✅ **ALLOWED** |
| **Production build / deployment** | ⛔ **NOT ALLOWED** |
| Public launch / public beta | ⛔ NOT ALLOWED |
| Real user or client case data — any environment | ⛔ NOT ALLOWED — fixture data only |
| Private criminal matter in any build environment | ⛔ NOT ALLOWED — D-005 / D-017 |

Authority: [NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md](NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) · granted 21 Sep 2026.

**Resolved 21 Sep 2026 (FA-001 addendum):** staging code lives in **this repository at `app/`** — option (b). The repository is documentation **+ code**.

---

## F. Active work

### F-1 — Figma V2 (design specification)

| Field | Value |
|---|---|
| **Task** | Produce Figma V2 screens for the Dispute Readiness Engine per the supplied design brief |
| **Why** | Design must exist before any build authorization; the brief requires provenance, uncertainty and human-review states to be visible in the UI, which cannot be validated from prose |
| **Exact tool / mode** | Figma (design mode) — human or design specialist |
| **Owner** | Founder (unassigned specialist) |
| **Environment** | Design tool only. No repository, no code, no data |
| **Deployment permission** | **NOT ALLOWED** |
| **Start date** | Not started |
| **Target date** | Not set by founder |
| **Status** | **Pending** |
| **Blocker** | No design owner assigned |
| **Required evidence** | Figma file link; screen inventory covering the full "What happened? → Export" journey; explicit provenance/uncertainty/human-review states |
| **Next action** | Founder assigns a design owner and sets a target date |

### F-2 — User interviews and willingness-to-pay validation

| Field | Value |
|---|---|
| **Task** | Run user interviews and WTP tests against the small-business / FPO / vendor-payment and commercial-service dispute wedge |
| **Why** | The commercial wedge (D-003, D-006, D-007) is **Medium / Medium-low confidence** and is the single largest unvalidated assumption in the project. Risks R13, R14 and R25 all resolve here |
| **Exact tool / mode** | Direct founder research (interviews). No tool assignment yet |
| **Owner** | Founder |
| **Environment** | Field research. No product, no repository, no data collection into any system |
| **Deployment permission** | **NOT ALLOWED** |
| **Start date** | Not started |
| **Target date** | Not set by founder |
| **Status** | **Pending** |
| **Blocker** | Interview sample not recruited; exact category boundary still provisional |
| **Required evidence** | 15–20 interviews (per D-003 revisit trigger); WTP responses against a tested paid offer; category-frequency evidence for the exact target segment |
| **Next action** | Founder defines the exact category boundary, then recruits the interview sample |

### F-3 — Lovable staging build  ✅ AUTHORIZED

| Field | Value |
|---|---|
| **Task** | Stand up the NyayOS Dispute Readiness Engine in a **staging environment** per the Lovable build brief, as constrained by the architecture reconciliation table |
| **Why** | Authorized by the founder under **FA-001** (21 Sep 2026). Used as a validation instrument to test the workflow and the wedge faster — not as a release candidate |
| **Exact tool / mode** | Lovable — staging build |
| **Owner** | Unassigned — founder to assign |
| **Environment** | **Staging only.** Fixture data only. No production database, no production domain, no public URL |
| **Deployment permission** | **Staging: ALLOWED. Production: NOT ALLOWED** |
| **Start date** | Not started |
| **Target date** | Not set by founder |
| **Status** | **Sprint 1 CANONICAL** — imported to `app/`, validated (`tsc`/`eslint`/`vitest`/`vite build` PASS), reviewed (A-014 § 11). **Sprint 1.1 State Completion is next** (A-018), then Sprint 2 |
| **Blocker** | Staging URL not supplied — staging not verified. Build owner still unassigned |
| **Required evidence** | Staging URL (non-public); schema + RLS policies; tenant-isolation test result (R02, R20); provenance model demonstrated end-to-end (D-012); confirmation that no real case data was used |
| **Next action** | Founder assigns a build owner and records where staging code lives |

### F-5 — Sprint 1 Foundation review  ⛔ BLOCKED

| Field | Value |
|---|---|
| **Task** | Pre-Sprint-2 architecture, accessibility and design-system review of the Sprint 1 Foundation |
| **Why** | Fact Cards (Sprint 2) hard-wire on top of Sprint 1 tokens, chips, badges and type scale. Defects there compound in every later sprint |
| **Exact tool / mode** | Claude Code — Architecture Review, read-only |
| **Owner** | Claude Code |
| **Environment** | Review only. No code, no deployment |
| **Deployment permission** | N/A — review |
| **Start date** | 21 September 2026 |
| **Target date** | Same day the artefact is supplied |
| **Status** | **COMPLETE — executed 21 Sep 2026.** Verdict revised: **GO (conditional) for Sprint 2** — see [A-014 § 11](../architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md) |
| **Blocker** | None. Browser-based checks (contrast, zoom) and SR pass remain open items inside Sprint 1.1 |
| **Required evidence** | Delivered: § 11 checklist; 4/4 validations PASS; typography finding retracted against evidence |
| **Next action** | **A-018 Sprint 1.1 State Completion** (7 items, A-014 § 11.4) → then A-015 Sprint 2 |

### F-6 — Repository Automation Foundation  ● CANONICAL

| Field | Value |
|---|---|
| **Task** | CI enforcement of the canonical status rules; generated dependency graph, status dashboard and changelog entries; branch protection; PR template |
| **Why** | Status, dependencies and gates were only in prose. A machine-readable registry plus `task-gate` makes *"no task is an input unless CANONICAL"* a failing check instead of a sentence |
| **Exact tool / mode** | Claude Code — Repository Automation |
| **Owner** | Claude Code |
| **Environment** | Canonical repository; GitHub Actions |
| **Deployment permission** | N/A — governance tooling. `dependency-check` self-asserts no deploy command |
| **Start date** | 21 September 2026 |
| **Target date** | 21 September 2026 |
| **Status** | **CANONICAL** — `task-gate` + `dependency-check` green at `bd31394`; `status-update` exercised by this transition |
| **Blocker** | None |
| **Required evidence** | Green run URLs for `task-gate`, `dependency-check`, `status-update`; branch protection verified via API |
| **Next action** | Founder: merge the auto PR from `governance/status-update`; enable `enforce_admins` (4d) |

### F-4 — Repository and continuity initialization

| Field | Value |
|---|---|
| **Task** | Initialize the canonical repository as the single source of truth for founder context, decisions, risks, assignments and outputs |
| **Why** | Prevent repeated work and lost context across tools and sessions |
| **Exact tool / mode** | Claude Code — Repository and Product-Continuity Maintainer |
| **Owner** | Claude Code |
| **Environment** | Local workspace `C:\nyayos` → canonical repository `rmanish2000-del/nyayos` |
| **Deployment permission** | **NOT ALLOWED** (documentation commit only) |
| **Start date** | 20 September 2026 |
| **Target date** | 20 September 2026 |
| **Status** | **Complete** |
| **Blocker** | None |
| **Required evidence** | Commit SHA; clean working tree; validation results; private-data contamination check — see [NYAYOS_OUTPUT_REGISTER.md](NYAYOS_OUTPUT_REGISTER.md) A-007 |
| **Next action** | None. Superseded by F-1 and F-2 |

---

## G. Stage progress

| Stage | Status |
|---|---|
| Research | **Complete** |
| MVP Selection | **Complete** |
| Master Product Specification | **Complete** |
| Architecture Reconciliation | **Complete** |
| Figma V2 | **Pending** |
| User / WTP Validation | **Pending** |
| Lovable Staging Build — Sprint 1 Foundation | **Complete — CANONICAL** |
| Sprint 1.1 — State Completion | **Pending** (authorized) |
| Sprint 2 — Fact Card System | **GO (conditional) — after Sprint 1.1** |
| Testing / UAT | **Not Started** |
| Production | **Not Started — NOT AUTHORIZED** |

> No completion percentages are recorded. Stage status is categorical only, by instruction — a percentage here would be invented precision.

---

## H. Locked decisions

Source: [NYAYOS_DECISION_LOG_V1.md](NYAYOS_DECISION_LOG_V1.md) § *Locked decisions*.

| # | Locked decision | Decision ref |
|---|---|---|
| 1 | Dispute Readiness Engine is the single MVP capability | D-001 |
| 2 | "What happened?" is the entry point | D-001 |
| 3 | Small-business / FPO / commercial dispute commercial hypothesis | D-003 |
| 4 | Consumer sandbox | D-004 |
| 5 | Criminal private sandbox | D-005 |
| 6 | Human decision authority | D-008 |
| 7 | Provenance-first architecture | D-012 |
| 8 | Multi-tenant-ready schema | D-011 |
| 9 | Supabase / Postgres / RLS | D-009 |
| 10 | pgvector | D-010 |
| 11 | Deterministic workflow over generalized agents | D-008 |

Additionally locked in [NYAYOS_MASTER_CONTEXT_V1.md](NYAYOS_MASTER_CONTEXT_V1.md) § 9:

- **NyayOS** spelling is canonical;
- evidence / provenance first;
- no autonomous legal actions;
- RLS / tenant isolation;
- no private-case training without explicit separate authorization.

**Note on item 3.** The commercial wedge is recorded as *locked* in the decision log's locked list, while decision D-003 itself carries **Medium** confidence with an explicit revisit trigger (15–20 interviews and pricing experiments). Read it as: *locked as the thing being tested first*, not as *validated*. It is also listed under Provisional (§ I) in the master context. This is a genuine tension between two supplied documents; it has been recorded rather than resolved, because resolving it would change substantive content. **Founder decision required.**

---

## I. Provisional decisions

Source: [NYAYOS_DECISION_LOG_V1.md](NYAYOS_DECISION_LOG_V1.md) § *Provisional decisions* and [NYAYOS_MASTER_CONTEXT_V1.md](NYAYOS_MASTER_CONTEXT_V1.md) § 9.

| Item | Current position | Status | Resolves via |
|---|---|---|---|
| **Exact commercial wedge** | Small-business / FPO / vendor-payment and commercial-service disputes. Exact category boundary **not** fixed | Provisional | F-2 interviews; D-003 revisit trigger |
| **Pricing** | Test one-time paid dispute preparation first, then subscription (D-018, confidence Medium-low) | Provisional | F-2 WTP tests; paid pilot |
| **Retention period** | Publish retention categories and user controls; exact durations deferred. 90-day hot audit retention is an **engineering default only** | Provisional | D-016 — legal / privacy counsel review |
| **OCR provider** | Not selected. Provider abstraction required | Provisional | OCR benchmark (evidence gap) |
| **Model provider** | Not selected. Server-side calls only; contractual/technical no-training setting required (R21) | Provisional | Retrieval + model benchmark; vendor terms review |
| **Launch geography** | Not selected | Provisional | F-2 interviews |

Also provisional: exact vendor stack, professional monetization, broader expansion order.

---

## J. Top risks

Source: [NYAYOS_RISK_REGISTER_V1.md](NYAYOS_RISK_REGISTER_V1.md). The register's own "Top five" is reproduced first, then all Critical and High risks with Medium-or-higher likelihood.

### Register "Top five"

1. **Unsupported claims** — a legal product that fabricates authority is unacceptable.
2. **Sensitive-data leakage** — a single tenant-isolation failure can destroy trust.
3. **Epistemic confusion** — users must know what came from them, their documents, AI extraction, inference, or authoritative sources.
4. **Prompt injection** — uploaded documents are untrusted content and must never become system instructions.
5. **Commercial validation failure** — the business must validate a payer before scaling.

### Critical risks (all)

| ID | Risk | Likelihood | Control |
|---|---|---|---|
| R01 | Unsupported legal/procedural claim | Medium | Source-required generation; citation audit; refusal |
| R02 | Cross-tenant data leakage | Low/unknown | RLS + server authorization + signed URLs |
| R03 | User mistakes extraction for fact | Medium | Provenance + confirmation UI |
| R05 | AI resolves contradiction | Medium | Flag-only contradiction logic |
| **R06** | **Prompt injection in documents** | **High** | Data/instruction separation; closed tools; no arbitrary code |
| R07 | Fabricated citation/source | Medium | Authoritative corpus + source verification |
| R08 | False deadline | Medium | Verified-deadline gate |
| R09 | Private case appears in public demo | Low | Separate sandbox tenant; demo fixture data |
| R10 | Product drifts into legal representation | Medium | Prohibited-task controls; copy review |
| R18 | Deletion claim is false | Medium | Auditable deletion workflow |
| R20 | Reviewer sees unshared dispute | Low | Explicit share grants + RLS |
| R21 | Model vendor trains on data | Medium | Contractual/technical no-training setting |
| R22 | Legal source becomes stale | Medium | Version/date/source metadata |
| R25 | Market thesis is wrong | Medium | User interviews + WTP + stop/pivot gates |
| R29 | Real-case data contaminated by development data | Medium | Separate environments/tenants; no default training |
| R30 | Export misstates source status | Medium | Export schema includes provenance/status |

### High risks with High likelihood — most urgent by exposure

| ID | Risk | Likelihood | Control |
|---|---|---|---|
| **R04** | **OCR corrupts important evidence** | **High** | Confidence + source location + human confirmation |
| **R14** | **Individual-advocate economics fail** | **High** | Business / FPO payer hypothesis |
| **R23** | **Consumer launch scope expands too early** | **High** | Bounded category taxonomy |

### Remaining High risks

R11 wrong issue classification · R12 low user activation · R13 low willingness to pay · R16 weak vector retrieval · R17 sensitive logs reveal PII · R19 backup retention misunderstood · R24 architecture complexity slows validation · R27 government infrastructure makes feature redundant · R28 lawyer solicitation/advertising constraints.

### Risk acceptance boundary

NyayOS should **not** trade away privacy, evidence provenance, source traceability, human review, correction, deletion or tenant isolation to increase engagement, conversion or automation.

**Risks live at this phase.** R06, R04, R14, R23 and R25 are the risks that can be acted on *now* — R14/R25 through F-2, and R04/R06/R23 through the Figma V2 and build-brief scope decisions. The rest are build-phase risks that activate only after authorization.

---

## K. Immediate next actions

**Revised 21 Sep 2026 under FA-001.** These now run in **parallel**, not in sequence.

| # | Action | Gate |
|---|---|---|
| 1 | **Assign a build owner and record where staging code lives** | Blocks 2 |
| 2 | **Lovable staging build** | ✅ **Authorized (FA-001).** Staging only, fixture data only |
| 3 | **Figma V2** | — · feeds 2 |
| 4 | **User interviews and WTP validation** | — · de-risks 2 |
| 4a | **Sprint 1.1 State Completion** (A-018) | ✅ Authorized. **Must precede Sprint 2 build** |
| 4b | **Write D-019 — typography decision** into the Decision Log | Code already uses Noto stack; the log must say so |
| 4c | **Supply staging URL** for verification | Not yet supplied |
| 4d | **Enable `enforce_admins`** once both required checks are green on `main` | Command in [NYAYOS_BRANCH_PROTECTION.md § 3](NYAYOS_BRANCH_PROTECTION.md) |
| 5 | **Founder go / no-go for production** | **Requires 3, 4, A-010 security review, legal/privacy review and staging UAT.** See FA-001 § *Conditions for the next gate* |

> **Production remains NOT AUTHORIZED.** No production build, deployment, database, domain, public beta or real user data — in any environment — until a new entry (**FA-002**) is recorded in [NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md](NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md).

---

## L. Repository facts

| Field | Value |
|---|---|
| **Repository URL** | https://github.com/rmanish2000-del/nyayos |
| **Local workspace** | `C:\nyayos` |
| **Branch** | `main` |
| **Latest commit SHA** | `516ba15` — `516ba153470c9e30144e58f1f67dbfea95b76841` (initialization commit; see § *Note*) |
| **Working-tree status** | Clean at time of writing |
| **Deployment status** | **NOT DEPLOYED.** Sprint 1 built and validated locally; Cloudflare config emitted by build tool but `nitro deploy` **not run**. Staging URL not supplied. **Production deployment NOT ALLOWED** |
| **Repository contents** | **Documentation (`docs/`) + Sprint 1 Foundation code (`app/`).** Frontend only — no schema, no migrations, no database resources, no backend. Code location resolved as option (b) — FA-001 addendum |
| **Private data in repository** | **None.** See § *Security posture* below |

**Note on the SHA.** This field records the SHA of the initialization commit. It is updated by a follow-up commit and therefore always trails `HEAD` by one commit. For the live value run:

```bash
git -C C:\nyayos log -1 --format=%H
```

### Security posture

- The founder-controlled private criminal matter (**Foodgod FPO matter**) is **private evaluation only** (D-005, D-017).
- **No case content is committed.** The private chat-context export PDF held in the local workspace is excluded by `.gitignore` and was never staged.
- Four supplied documents reference the matter **by name in governance context only** — instructing that it is private and must not be used for training, guilt/innocence, bail or public demonstration. These are policy statements, not case material. See [CONTRIBUTING.md](../../CONTRIBUTING.md) § *Private-data rules* and the contamination note in [NYAYOS_OUTPUT_REGISTER.md](NYAYOS_OUTPUT_REGISTER.md).
- **Founder decision open:** whether the matter name itself should be redacted from committed documents. Redacting it would alter supplied content and was therefore not done unilaterally.
