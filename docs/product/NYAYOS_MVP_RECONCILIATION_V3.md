# NYAYOS MVP RECONCILIATION V3

**Date:** 21 September 2026
**Assignment:** A-013
**Authority tier:** 7 — **this is a view, not a decision document**
**Supersedes:** nothing. It consolidates; it does not replace.

---

## ⚠ Read this before using this document

**No `MVP_RECONCILIATION_V3` source document was supplied.** No such file exists in the workspace, in Downloads, or in the repository — and there is no V1 or V2 of an "MVP Reconciliation" for a V3 to succeed. The existing version numbers belong to other artefacts: the deliverables package is V1, the Figma brief is V2.

This document was therefore written as a **consolidation of positions already recorded elsewhere in this repository**, under the rule that governs every maintainer-authored file here:

> **No new product decisions are introduced.** Every statement below is traceable to a tier 1–6 source, and is cited.

**If you hold a separate MVP Reconciliation V3, that document supersedes this one.** Replace this file and record the supersession in the [output register](../founder/NYAYOS_OUTPUT_REGISTER.md).

---

## 1. What is locked — unchanged at V3

Source: [Decision Log V1](../founder/NYAYOS_DECISION_LOG_V1.md) § *Locked decisions*; [Master Context V1](../founder/NYAYOS_MASTER_CONTEXT_V1.md) § 9.

| # | Locked | Ref |
|---|---|---|
| 1 | **Dispute Readiness Engine** is the single MVP capability | D-001 |
| 2 | **"What happened?"** is the entry point | D-001 |
| 3 | Small-business / FPO / commercial dispute commercial hypothesis | D-003 |
| 4 | Consumer sandbox — **not** the launch category | D-004 |
| 5 | Criminal matter: private sandbox only | D-005 |
| 6 | Human decision authority — AI assists, humans decide | D-008 |
| 7 | Provenance-first: `user claim` → `verified fact` → `AI inference` stay distinct | D-012 |
| 8 | Multi-tenant-ready schema | D-011 |
| 9 | Supabase / Postgres / RLS | D-009 |
| 10 | pgvector | D-010 |
| 11 | Deterministic workflow over generalized agents | D-008 |
| 12 | **NyayOS** spelling is canonical | Master Context § 2 |
| 13 | No autonomous legal actions | Master Context § 9 |
| 14 | No private-case training without separate explicit authorization | D-017 |

**Nothing in this list changed at V3.** The MVP is the same product it was at V1.

## 2. What changed at V3

Exactly one thing changed: **the gate.**

| | V1 / V2 | **V3** |
|---|---|---|
| Staging build | Not allowed | ✅ **ALLOWED** |
| Production | Not allowed | ⛔ **NOT ALLOWED** *(unchanged)* |
| Sequence | Figma V2 → WTP validation → go/no-go → build | Build runs **in parallel** with design and validation |
| Gate authority | Implicit, scattered across documents | **Explicit** — [Founder Authorization Record](../founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md), tier 1 |

Authority: **FA-001**, 21 September 2026.

**No scope was added.** The staging build implements the MVP as already specified — it does not extend it.

## 3. The core journey — unchanged

Source: [Continuity Handoff V1](../handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md); [Master Product Spec V1](NYAYOS_MASTER_PRODUCT_SPEC_V1.md).

```
What happened? → Facts → Parties → Timeline → Evidence
  → Evidence-to-fact mapping → Missing evidence → Contradictions
  → Issue → Verified information → Possible paths → Action plan
  → Human review → Export
```

## 4. Architecture position carried into the build

The [Architecture Review](../architecture/ARCHITECTURE_REVIEW.md) is **tier 5 and constrained by tier 4**. The reconciliation table in the [Continuity Handoff](../handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md) governs. The five positions that are **not** the Architecture Review's own:

| Architecture Review said | Reconciled position |
|---|---|
| Open-ended agent orchestration | **Modify** → deterministic workflow + bounded, schema-validated AI tasks |
| Single-user `owner_id` tenancy | **Modify** → tenant + membership model |
| Fixed embedding dimension 1536 | **Modify** → provider/version configurable |
| 90-day hot audit retention | **Provisional** → engineering default only; legal review required |
| External API calls | **Defer** → approved ingestion/retrieval services only |
| Autonomous mutations | **Reject** → outside MVP |

Everything else in the Architecture Review is **Adopt**.

## 5. What the staging build must not do

Source: [FA-001](../founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md).

- ⛔ No production build, deployment, database or domain.
- ⛔ No public URL, public beta or waitlist.
- ⛔ **No real user, client or pilot case data in any environment, including staging.** Fixture data only.
- ⛔ No use of the private criminal matter in any build environment.
- ⛔ No consumer-category launch.
- ⛔ No product code committed to this repository until the staging code location is recorded.

## 6. What remains provisional at V3

Source: [Decision Log V1](../founder/NYAYOS_DECISION_LOG_V1.md) § *Provisional decisions*.

Exact commercial wedge boundary · pricing · retention duration · OCR provider · model provider · launch geography · exact vendor stack · professional monetization · expansion order.

**None of these were resolved by FA-001.** The staging build must therefore be architected so each stays swappable — provider abstraction for OCR and models (R15, R21), retention as configuration rather than hardcoded behaviour (D-016, R19). Building any of them in as a fixed assumption converts a provisional decision into an accidental one.

## 7. Open tension — recorded, not resolved

The commercial wedge (D-003) appears as **locked** in the Decision Log's locked list and as **provisional** in Master Context § 9, while D-003 itself carries **Medium** confidence with an explicit revisit trigger of 15–20 interviews.

Read as: *locked as the thing being tested first*, not as *validated*. **Founder ruling still required.** Recorded in Dashboard § H since 20 September 2026; unchanged by FA-001.

## 8. Risk position at V3

Authorizing the build before validation elevates **R25** (market thesis wrong), **R13** (low WTP), **R14** (advocate economics — *High* likelihood), **R24** (build work dominates validation) and **R12** (low activation).

See [FA-001 § *Risk note*](../founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) for the mitigation that does not require reversing the authorization: run A-008 and A-009 in parallel, and treat the staging build as a validation instrument rather than a release candidate.

---

## Traceability

| Section | Source |
|---|---|
| 1 | Decision Log V1 § Locked; Master Context V1 § 9 |
| 2 | Founder Authorization Record FA-001 |
| 3 | Continuity Handoff V1; Master Product Spec V1 |
| 4 | Continuity Handoff V1 reconciliation table |
| 5 | Founder Authorization Record FA-001 |
| 6 | Decision Log V1 § Provisional; R15, R19, R21 |
| 7 | Decision Log V1 D-003; Master Context V1 § 9; Dashboard § H |
| 8 | Risk Register V1; FA-001 § Risk note |
