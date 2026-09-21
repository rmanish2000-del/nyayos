# NyayOS

> **Justice starts with clarity.**

**NyayOS** turns unstructured disputes into **structured, evidence-linked, human-reviewable dispute files.**

---

## ⚠ Read this first

| | |
|---|---|
| **Repository contents** | **Documentation (`docs/`) + Sprint 1 Foundation code (`app/`).** Frontend foundation only — no database schema, no migrations, no backend, no infrastructure |
| **Staging build** | ✅ **ALLOWED** under [FA-001](docs/founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) — staging environment and fixture data only |
| **Production** | ⛔ **NOT ALLOWED.** No production build, deployment, database, domain, public beta, or real case data in any environment |
| **Project stage** | Design Preparation → Staging Build |
| **Private data** | **Never commit case material.** See [CONTRIBUTING.md](CONTRIBUTING.md) § *Private-data rules* |

**This repository is private** (set to private on 20 Sep 2026, before the first push, because it carries governance references to a private criminal matter). Keep it private unless a redaction review is completed and recorded as a decision.

---

## Start here

| If you want to… | Read |
|---|---|
| See current state, decisions, risks and next actions | **[Founder Dashboard](docs/founder/NYAYOS_FOUNDER_DASHBOARD.md)** |
| **Know what you are allowed to do** | **[Founder Authorization Record](docs/founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md)** — tier 1, read before acting |
| Find any document, or see which document wins a conflict | [docs/INDEX.md](docs/INDEX.md) — includes the [authority hierarchy](docs/INDEX.md#document-authority-hierarchy) |
| Understand why decisions were made | [Decision Log](docs/founder/NYAYOS_DECISION_LOG_V1.md) |
| Understand the full context in one document | [Master Context](docs/founder/NYAYOS_MASTER_CONTEXT_V1.md) |
| Know what the product is | [Master Product Spec](docs/product/NYAYOS_MASTER_PRODUCT_SPEC_V1.md) |
| Pick up the project cold | [Continuity Handoff](docs/handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md) |
| Contribute or run an assignment | [CONTRIBUTING.md](CONTRIBUTING.md) |

---

## What NyayOS is

### The MVP capability — locked

**NyayOS Dispute Readiness Engine.**

### The core journey

```
What happened?
  → Facts
  → Parties
  → Timeline
  → Evidence
  → Evidence-to-fact mapping
  → Missing evidence
  → Contradictions
  → Issue
  → Verified information
  → Possible paths
  → Action plan
  → Human review
  → Export
```

### The evidence rule

These three things must never be mixed, and must remain distinct objects throughout the system:

```
user claim   →   verified fact   →   AI inference
```

### The operating doctrine

> **Build the workflow users need, not the legal-tech category name investors already know.**

---

## Who it is for

| Segment | Status |
|---|---|
| **Small-business / FPO / professional commercial dispute owners** — especially vendor-payment and commercial-service disputes | **Primary commercial hypothesis.** Being tested; not yet validated |
| **Consumer disputes** | **Sandbox and provisional Phase 2.** Not the launch category |
| **Founder-controlled criminal matter** | **Private evaluation only.** Never a public product, never training data, never a basis for legal conclusions |

> **NyayOS is not launching consumer-first.** If you find any document implying a consumer-first launch, it is wrong — the decision log ([D-003](docs/founder/NYAYOS_DECISION_LOG_V1.md), [D-004](docs/founder/NYAYOS_DECISION_LOG_V1.md)) governs.

---

## What NyayOS is not

- Not an "Operating System for Indian Law" as a market claim ([D-002](docs/founder/NYAYOS_DECISION_LOG_V1.md)).
- Not legal representation and not legal advice.
- Not a bail, guilt, innocence or outcome predictor.
- Not a lawyer marketplace or lead-generation business.
- Not an autonomous agent that takes legal actions.

**Human decision authority is locked.** AI assists; humans decide.

---

## Current stage

| Stage | Status |
|---|---|
| Research | Complete |
| MVP Selection | Complete |
| Master Product Specification | Complete |
| Architecture Reconciliation | Complete |
| Figma V2 | **Pending** |
| User / WTP Validation | **Pending** |
| Sprint 1 Foundation (staging) | **Complete — CANONICAL** |
| Sprint 1.1 State Completion | **Pending** — authorized |
| Sprint 2 Fact Card System | **GO (conditional)** — after Sprint 1.1 |
| Testing / UAT | Not Started |
| Production | **Not Started — NOT AUTHORIZED** |

**Current objective:** stand up the staging build while completing Figma V2 and validating the commercial wedge.

**North Star Metric:** completed usable dispute files per week — *not yet measurable, pre-launch.*

### Immediate next actions — parallel

1. **Sprint 1.1 — State Completion** (A-018; seven items in [A-014 § 11.4](docs/architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md))
2. Sprint 2 — Fact Card System (A-015) — after 1
3. Figma V2 (A-008) — Fact Card design may start now
4. User interviews and WTP validation (A-009)
5. Write D-019 typography decision; supply staging URL
6. Founder go / no-go **for production** — gated; FA-002 not granted

---

## Working with the code

```bash
cd app && npm install && npm run typecheck && npm run lint && npm run test && npm run build
```

Lockfile of record is `app/bun.lock` (Lovable). Sprint 1 needs no environment values. **Never commit `.env`.** Details: [`app/README.md`](app/README.md).

## Repository structure

```
app/                       Sprint 1 Foundation — TanStack Start · React 19 · Tailwind v4 · Vitest
README.md                  Entry point
CONTRIBUTING.md            Contribution and private-data rules
.gitignore                 Private-data and credential exclusions
docs/
  INDEX.md                 Full document map
  founder/                 Authorization record, dashboard, registers, changelog,
                           context, decisions, risks
  product/                 Master product specification
  architecture/            Architecture review
  research/                Red team, benchmark, justice map, MVP selection
  design/                  Figma brief
  implementation/          Build brief (released — staging only, FA-001)
  evaluation/              Validation plan, real-case evaluation protocol
  handoffs/                Continuity handoff, V1 deliverables manifest
```

---

## Conventions

- **Canonical name is `NyayOS`** for all new work. Legacy research files use `NYAYAOS_*` and keep those names deliberately, for provenance.
- **Documents have tiers.** The [authority hierarchy](docs/INDEX.md#document-authority-hierarchy) decides which wins a conflict. Gates are answered **only** by the [Founder Authorization Record](docs/founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md); decisions and risks by the V1 records; the Dashboard is a view with no independent authority.
- **A build brief is not authorization.** Research is evidence, never a decision.
- Every assignment is recorded in the **[Assignment Register](docs/founder/NYAYOS_ASSIGNMENT_REGISTER.md)** before work starts.
- Every artefact is recorded in the **[Output Register](docs/founder/NYAYOS_OUTPUT_REGISTER.md)** when work ends.

---

## Evidence caveat

The research documents in `docs/research/` contain **secondary-source** analysis and market estimates. The red team report states this about itself. Before any external publication, procurement decision or legal implementation, **re-verify the underlying primary source.** Do not treat a research claim in this repository as verified fact.
