# NYAYOS OUTPUT REGISTER

**Purpose:** One row per produced artefact. Records what exists, who made it, whether it has been reviewed, whether it is accepted, and what it changed.

**Review status key**
`Founder-reviewed` · `Maintainer-reviewed` (checked for placement, links, contamination — **not** for substantive correctness) · `Not reviewed`

**Acceptance key**
`Accepted` · `Accepted with open items` · `Rejected` · `Superseded`

---

## Research outputs

| Output file | Producing tool | Assignment | Date | Review status | Acceptance | Decision impact | Canonical location |
|---|---|---|---|---|---|---|---|
| `NYAYAOS_RED_TEAM_REPORT.md` | Claude Code — Research Lead | A-001 | 20 Sep 2026 | Founder-reviewed | **Accepted as research input** — its conclusion ("do not build") was **not** adopted as the product decision | Drove D-002 (drop "OS" claim), D-003 / D-006 / D-007 (change payer and wedge); sourced R14, R25, R26, R27, R28 | `docs/research/` |
| `NYAYAOS_GLOBAL_BENCHMARK_REPORT.md` | *Not recorded* | A-002 | 20 Sep 2026 | Founder-reviewed | **Accepted with open items** — proposed NyayaFile / NyayaBench / NyayaHear / NyayaForum / NyayaSahayak layers are out of MVP scope | Established human-decides posture and verification/auditability emphasis; supports D-008 | `docs/research/` |
| `NYAYAOS_INDIAN_JUSTICE_MAP.md.md` | *Not recorded* | A-003 | 20 Sep 2026 | Founder-reviewed | Accepted | Volume categories; "represent document-heavy lower-court disputes" lesson; supports D-004 | `docs/research/` |
| `NYAYAOS_MVP_SELECTION_REPORT.md` | *Not recorded* | A-004 | 20 Sep 2026 | Founder-reviewed | Accepted | Selected the Dispute Readiness Engine → **D-001 locked** | `docs/research/` |

## Architecture outputs

| Output file | Producing tool | Assignment | Date | Review status | Acceptance | Decision impact | Canonical location |
|---|---|---|---|---|---|---|---|
| `ARCHITECTURE_REVIEW.md` | *Not recorded* | A-005 | 20 Sep 2026 | Founder-reviewed | **Accepted with open items** — 5 of 17 decisions were modified, made provisional, deferred or rejected during reconciliation | D-009 Supabase/Postgres, D-010 pgvector, D-011 multi-tenancy (modified from `owner_id`), D-012 corpus separation, D-008 deterministic workflow (modifies open-ended agent orchestration) | `docs/architecture/` |

## Product-definition outputs (V1 package)

| Output file | Producing tool | Assignment | Date | Review status | Acceptance | Decision impact | Canonical location |
|---|---|---|---|---|---|---|---|
| `NYAYOS_MASTER_PRODUCT_SPEC_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | Accepted with open items | Canonical product definition for the Dispute Readiness Engine | `docs/product/` |
| `NYAYOS_MASTER_CONTEXT_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | Accepted | Canonical continuity context; fixes **NyayOS** spelling; records locked vs provisional state | `docs/founder/` |
| `NYAYOS_DECISION_LOG_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | Accepted with open items | **Authoritative decision record** D-001 to D-018 | `docs/founder/` |
| `NYAYOS_RISK_REGISTER_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | Accepted | **Authoritative risk record** R01 to R30; sets the risk-acceptance boundary | `docs/founder/` |
| `NYAYOS_90_DAY_VALIDATION_PLAN_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | Accepted | Governs the validation sequence gating the build decision | `docs/evaluation/` |
| `NYAYOS_CONTINUITY_HANDOFF_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | **Accepted — project-state sections SUPERSEDED by V2 (21 Sep). Architecture reconciliation table remains authoritative** | Architecture reconciliation table; recommends A-010 security review | `docs/handoffs/` |
| `NYAYOS_CONTINUITY_HANDOFF_V2.md` | Claude Code — Repository Integration | A-017 | 21 Sep 2026 | Not reviewed | Pending founder review | Project state after Sprint 1 import; validation record; Sprint 1 gaps; carried risks | `docs/handoffs/` |
| `NYAYOS_FIGMA_BRIEF_V2.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | Accepted | Input to A-008 (Figma V2) | `docs/design/` |
| `NYAYOS_LOVABLE_BUILD_BRIEF_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | **Accepted — RELEASED 21 Sep 2026** | Input to A-011, **authorized for staging only** under FA-001 | `docs/implementation/` |
| `NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md` | *Not recorded* | A-006 | 20 Sep 2026 | Founder-reviewed | Accepted | Governs private-matter evaluation; enforces D-005 and D-017; controls R09, R29 | `docs/evaluation/` |
| `README.md` (V1 bundle manifest) | *Not recorded* | A-006 | 20 Sep 2026 | Maintainer-reviewed | **Accepted — renamed** to `NYAYOS_V1_DELIVERABLES_README.md` to avoid collision with the repository root README. **Content unchanged** | Records the V1 reconciliation rationale | `docs/handoffs/` |

## Code outputs — Sprint 1 Foundation

| Output | Producing tool | Assignment | Date | Review status | Acceptance | Decision impact | Canonical location |
|---|---|---|---|---|---|---|---|
| `app/` — Sprint 1 Foundation (tokens, 8 components, shell, a11y baseline, 12 tests) | Lovable — staging build | A-011 | 21 Sep 2026 | **Maintainer-reviewed** (A-014 executed; `tsc`/`eslint`/`vitest`/`vite build` PASS) | **CANONICAL** — with recorded gaps (A-014 § 11.3) | Foundation for Sprint 2; Sprint 1.1 State Completion required first | `app/` |
| `app/src/routeTree.gen.ts` | TanStack router plugin (generated during A-017 build) | A-017 | 21 Sep 2026 | Maintainer-reviewed | Accepted — committed so `tsc` passes cold | — | `app/src/` |
| `nyayos-sprint1-foundation.zip` | Lovable export | A-011 | 21 Sep 2026 | Maintainer-reviewed | **Accepted — NOT committed** (gitignored). SHA-256 `8c407630616f171b33d2be60671213c4b07b5ceb65fce0a877954b17a3ea83ca` | Source of `app/` | Local workspace only |

## Automation and governance-tooling outputs — A-019

| Output | Producing tool | Assignment | Date | Review status | Acceptance | Decision impact | Canonical location |
|---|---|---|---|---|---|---|---|
| `NYAYOS_STATUS_REGISTRY.json` | Claude Code — Repository Automation | A-019 | 21 Sep 2026 | Not reviewed | Pending founder review | **Machine source of truth for task status and dependencies** | `docs/founder/` |
| `NYAYOS_STATUS_REGISTRY.md` · `NYAYOS_DEPENDENCY_GRAPH.md` · `NYAYOS_STATUS_DASHBOARD.md` | `scripts/governance/registry.mjs` (generated) | A-019 | 21 Sep 2026 | Maintainer-reviewed | Accepted — **do not edit by hand**; regenerate | Derived views; stale copies fail `task-gate` | `docs/founder/` |
| `NYAYOS_CANONICAL_STATUS_RULES.md` | Claude Code | A-019 | 21 Sep 2026 | Not reviewed | Pending founder review | **Tier 2 rule set** — status flow and the canonical-input rule | `docs/founder/` |
| `NYAYOS_BRANCH_PROTECTION.md` | Claude Code | A-019 | 21 Sep 2026 | Not reviewed | Pending founder review | Documents the **applied** protection + ruleset; follow-up to enable `enforce_admins` | `docs/founder/` |
| `scripts/governance/registry.mjs` | Claude Code | A-019 | 21 Sep 2026 | Not reviewed | Pending founder review | Validator + generator; zero dependencies | `scripts/governance/` |
| `.github/workflows/task-gate.yml` · `dependency-check.yml` · `status-update.yml` | Claude Code | A-019 | 21 Sep 2026 | Not reviewed | Pending founder review — **CANONICAL on first green run** | CI enforcement of rules, four app checks, auto-regeneration via PR | `.github/workflows/` |
| `.github/pull_request_template.md` | Claude Code | A-019 | 21 Sep 2026 | Not reviewed | Pending founder review | Every PR must cite A-nnn, gate, private-data check | `.github/` |

## Repository and continuity outputs

| Output file | Producing tool | Assignment | Date | Review status | Acceptance | Decision impact | Canonical location |
|---|---|---|---|---|---|---|---|
| `README.md` | Claude Code — Repository and Product-Continuity Maintainer | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | Repository entry point | repo root |
| `CONTRIBUTING.md` | Claude Code | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | Contribution and private-data rules | repo root |
| `.gitignore` | Claude Code | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | **Enforces the private-data boundary** | repo root |
| `docs/INDEX.md` | Claude Code | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | Document map | `docs/` |
| `NYAYOS_FOUNDER_DASHBOARD.md` | Claude Code | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | Single-screen founder view | `docs/founder/` |
| `NYAYOS_ASSIGNMENT_REGISTER.md` | Claude Code | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | Assignment record A-001 to A-007; open assignments A-008 to A-011 | `docs/founder/` |
| `NYAYOS_OUTPUT_REGISTER.md` | Claude Code | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | This document | `docs/founder/` |
| `NYAYOS_CHANGELOG.md` | Claude Code | A-007 | 20 Sep 2026 | Not reviewed | Pending founder review | Chronological change record | `docs/founder/` |
| `NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md` | Claude Code — Repository and Product-Continuity Maintainer | A-013 | 21 Sep 2026 | Not reviewed | Pending founder review | **Tier 1 authority for all gates.** Records FA-001: staging build allowed, production not allowed | `docs/founder/` |
| `NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md` | Claude Code — Architecture Review | A-014 | 21 Sep 2026 | Not reviewed | **Pending founder review — review BLOCKED on artefact** | NO-GO (conditional) for Sprint 2; typography decision required (D-019 candidate); FA-001 code-location item must close | `docs/architecture/` |
| `NYAYOS_MVP_RECONCILIATION_V3.md` | Claude Code — Repository and Product-Continuity Maintainer | A-013 | 21 Sep 2026 | Not reviewed | **Pending founder review — see note** | Consolidates the MVP position at V3 under FA-001. Introduces **no new product decisions** | `docs/product/` |

---

## Excluded from the repository — deliberately

| Item | Reason | Where it lives |
|---|---|---|
| `Manish_Patel_Foodgod_Chat_Context_Export.pdf` | **Private case material.** Founder-controlled criminal matter; private evaluation only (D-005, D-017) | Local workspace only. Blocked by `.gitignore`. **Never staged** |
| `NYAYOS_V1_REVISED_DELIVERABLES.zip` | Redundant archive of documents now committed individually | Local workspace only. Blocked by `.gitignore` |

---

## Private-data contamination check — A-007

Performed 20 September 2026 against every file staged for commit.

| Check | Method | Result |
|---|---|---|
| Private case content | `grep -rin` for `foodgod`, `FIR`, `bail`, `chargesheet`, `Aadhaar`, `PAN`, `passport`, `IPC`, `CrPC`, `BNSS`, party name | **No case content found.** Matches are governance statements or document-type taxonomies only |
| Personal identifiers | `grep -rnE` for 10+ digit numbers, `+91` phone patterns, CNR/case-number patterns | **Zero matches** |
| Case particulars | `grep -rinE` for `s/o`, `w/o`, `aged NN`, `resident of`, `police station`, `accused no` | **Zero matches** |
| Credentials / secrets | `grep -rinE` for `api_key`, `secret`, `password`, `token`, `bearer`, `sk-`, `ghp_`, `gho_`, `AKIA`, `BEGIN PRIVATE KEY` | **No live credentials.** All matches are prose about secret-handling policy |
| EduOS cross-project contamination | `grep -rin` for `eduos`, `edu-os`, `class 10`, `cbse`, `ncert`, `youtube` | **Zero genuine matches.** (Apparent hits were the substring `ncert` inside the word *uncertainty*) |
| Private binaries | Directory listing; `.gitignore` verification; `git status` before commit | **PDF and ZIP excluded and never staged** |

### Residual item — founder decision required

Four supplied documents name the private matter **in governance context only** — instructing that it is private and must not be used for training, guilt/innocence, bail or public demonstration:

- `docs/founder/NYAYOS_DECISION_LOG_V1.md` (D-005)
- `docs/founder/NYAYOS_MASTER_CONTEXT_V1.md` (§ 7)
- `docs/product/NYAYOS_MASTER_PRODUCT_SPEC_V1.md`
- `docs/evaluation/NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md`

These are **policy statements, not case material**. They were left unchanged because editing them would alter supplied content, which this assignment forbids.

> ### ⚠ VISIBILITY — RESOLVED, BUT KEEP IT THAT WAY
>
> `github.com/rmanish2000-del/nyayos` was found to be **PUBLIC** during the A-007 pre-commit check (verified 20 Sep 2026).
>
> On a public repository, the governance references above would disclose that a **named entity is the subject of a founder-controlled criminal matter** — a materially different exposure from the same sentence in a private repository, and **not reversible**, since content may be cloned, cached and indexed before any later deletion.
>
> **The push was therefore held for a founder decision.** The founder directed: *make the repository private, then push.*
>
> **Action taken, in this order:**
> 1. repository visibility changed **PUBLIC → PRIVATE** and verified;
> 2. only then was `main` pushed.
>
> **No NyayOS content was ever publicly visible.** The repository was empty for its entire public lifetime.
>
> **Standing constraint:** do not make this repository public without first completing a redaction review of the four documents above and recording the outcome as a decision in the decision log. See [CONTRIBUTING.md](../../CONTRIBUTING.md) § 2.
