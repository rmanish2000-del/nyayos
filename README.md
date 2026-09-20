# NyayOS

> **Justice starts with clarity.**

**NyayOS** turns unstructured disputes into **structured, evidence-linked, human-reviewable dispute files.**

---

## ⚠ Read this first

| | |
|---|---|
| **Repository contents** | **Documentation only.** No application code, no database schema, no migrations, no infrastructure |
| **Deployment** | **NOT ALLOWED.** Nothing is deployed. Nothing may be deployed from this repository |
| **Project stage** | Pre-build. Product Definition → Design Preparation |
| **Private data** | **Never commit case material.** See [CONTRIBUTING.md](CONTRIBUTING.md) § *Private-data rules* |

**This repository is private** (set to private on 20 Sep 2026, before the first push, because it carries governance references to a private criminal matter). Keep it private unless a redaction review is completed and recorded as a decision.

---

## Start here

| If you want to… | Read |
|---|---|
| See current state, decisions, risks and next actions | **[Founder Dashboard](docs/founder/NYAYOS_FOUNDER_DASHBOARD.md)** |
| Find any document | [docs/INDEX.md](docs/INDEX.md) |
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
| Lovable Staging Build | Not Started |
| Testing / UAT | Not Started |
| Production | Not Started |

**Current objective:** complete Figma V2 and validate the commercial wedge before implementation.

**North Star Metric:** completed usable dispute files per week — *not yet measurable, pre-launch.*

### Immediate next actions

1. Figma V2
2. User interviews and WTP validation
3. Founder go / no-go decision
4. Lovable staging build — **only after authorization at step 3**

---

## Repository structure

```
README.md                  Entry point
CONTRIBUTING.md            Contribution and private-data rules
.gitignore                 Private-data and credential exclusions
docs/
  INDEX.md                 Full document map
  founder/                 Dashboard, registers, changelog, context, decisions, risks
  product/                 Master product specification
  architecture/            Architecture review
  research/                Red team, benchmark, justice map, MVP selection
  design/                  Figma brief
  implementation/          Build brief (held — not authorized)
  evaluation/              Validation plan, real-case evaluation protocol
  handoffs/                Continuity handoff, V1 deliverables manifest
```

---

## Conventions

- **Canonical name is `NyayOS`** for all new work. Legacy research files use `NYAYAOS_*` and keep those names deliberately, for provenance.
- The **[Decision Log](docs/founder/NYAYOS_DECISION_LOG_V1.md)** and **[Risk Register](docs/founder/NYAYOS_RISK_REGISTER_V1.md)** are authoritative. The Founder Dashboard is a view over them — if they disagree, the source document wins.
- Every assignment is recorded in the **[Assignment Register](docs/founder/NYAYOS_ASSIGNMENT_REGISTER.md)** before work starts.
- Every artefact is recorded in the **[Output Register](docs/founder/NYAYOS_OUTPUT_REGISTER.md)** when work ends.

---

## Evidence caveat

The research documents in `docs/research/` contain **secondary-source** analysis and market estimates. The red team report states this about itself. Before any external publication, procurement decision or legal implementation, **re-verify the underlying primary source.** Do not treat a research claim in this repository as verified fact.
