# NYAYOS FOUNDER DASHBOARD

**Canonical project name:** NyayOS
**Status date:** 20 September 2026
**Maintained by:** Repository and Product-Continuity Maintainer (Claude Code)
**Authority:** This dashboard is a *view*. The authoritative records are
[NYAYOS_DECISION_LOG_V1.md](NYAYOS_DECISION_LOG_V1.md),
[NYAYOS_RISK_REGISTER_V1.md](NYAYOS_RISK_REGISTER_V1.md) and
[NYAYOS_MASTER_CONTEXT_V1.md](NYAYOS_MASTER_CONTEXT_V1.md).
Where this dashboard and a source document disagree, **the source document wins.**

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

> **Product Definition → Design Preparation**

## E. Current objective

> **Complete Figma V2 and validate the commercial wedge before implementation.**

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

### F-3 — Repository and continuity initialization

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
| Lovable Staging Build | **Not Started** |
| Testing / UAT | **Not Started** |
| Production | **Not Started** |

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

| # | Action | Gate |
|---|---|---|
| 1 | **Figma V2** | — |
| 2 | **User interviews and WTP validation** | — |
| 3 | **Founder go / no-go decision** | Requires 1 and 2 |
| 4 | **Lovable staging build** | **Only after founder authorization at step 3.** Not before |

> Step 4 is explicitly gated. No build, no schema, no deployment may begin until the founder records a go decision — as a new entry in [NYAYOS_DECISION_LOG_V1.md](NYAYOS_DECISION_LOG_V1.md) and a row in [NYAYOS_ASSIGNMENT_REGISTER.md](NYAYOS_ASSIGNMENT_REGISTER.md).

---

## L. Repository facts

| Field | Value |
|---|---|
| **Repository URL** | https://github.com/rmanish2000-del/nyayos |
| **Local workspace** | `C:\nyayos` |
| **Branch** | `main` |
| **Latest commit SHA** | `__INIT_COMMIT_SHA__` (initialization commit; see § *Note*) |
| **Working-tree status** | Clean at time of writing |
| **Deployment status** | **NOT DEPLOYED — deployment NOT ALLOWED** |
| **Repository contents** | **Documentation only.** No application code, no schema, no migrations, no infrastructure, no database resources |
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
