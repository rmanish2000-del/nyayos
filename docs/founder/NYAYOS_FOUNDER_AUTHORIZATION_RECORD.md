# NYAYOS FOUNDER AUTHORIZATION RECORD

**Purpose:** The record of what the founder has authorized, when, and under what limits.

This document is the **authority of record for gates**. Where any other document in this repository states a gate status — build, deployment, launch, spend, data use — **this document overrides it.** Other documents describe what was true when written; this one describes what is permitted now.

**Rules**

1. One entry per authorization. Entries are **append-only** — never edit or delete a past entry.
2. To change an authorization, add a **new entry** that supersedes the old one, and mark the old one `Superseded by FA-nnn`.
3. Every entry must state its **limits** and what remains **not** authorized. An authorization without limits is not recorded.
4. No assignment may cross a gate until its authorization appears here.

---

## Current authorization state — at a glance

| Gate | Status | Authority |
|---|---|---|
| Research, product definition, design | **ALLOWED** | Standing |
| **Lovable staging build** | **✅ ALLOWED** | **FA-001** |
| **Production build / production deployment** | **⛔ NOT ALLOWED** | **FA-001** |
| Public launch / public beta | **⛔ NOT ALLOWED** | FA-001 |
| Real user or client case data in any environment | **⛔ NOT ALLOWED** | FA-001 |
| Private-case training | **⛔ NOT ALLOWED** | D-017 — requires separate authorization and legal review |
| External write actions, court integrations, ODR marketplace | **⛔ NOT ALLOWED** | Master Context § 8 — deferred |

---

## FA-001 — Staging build authorized; production not authorized

| Field | Value |
|---|---|
| **Authorization ID** | FA-001 |
| **Date** | 21 September 2026 |
| **Granted by** | Founder |
| **Channel** | Direct founder instruction to the Repository and Product-Continuity Maintainer |
| **Status** | **Active** |
| **Supersedes** | The prior repository-wide gate posture *"Build Not Allowed"* as recorded at commit `78e7a6e` |
| **Superseded by** | — |

### What changed

| | Old | New |
|---|---|---|
| Staging build | **Not allowed** | **ALLOWED** |
| Production | Not allowed | **NOT ALLOWED** *(unchanged)* |

### What is authorized

- **Assignment A-011 — Lovable staging build** may now begin.
- Staging-environment work: application scaffolding, schema, RLS policies, storage configuration, workflow orchestration and AI task integration, **in a staging environment only**.
- Implementation may proceed against [`NYAYOS_LOVABLE_BUILD_BRIEF_V1.md`](../implementation/NYAYOS_LOVABLE_BUILD_BRIEF_V1.md), as constrained by the architecture reconciliation table in [`NYAYOS_CONTINUITY_HANDOFF_V1.md`](../handoffs/NYAYOS_CONTINUITY_HANDOFF_V1.md).

### What is NOT authorized

- ⛔ **Production build. Production deployment. Production database. Production domain.**
- ⛔ Public launch, public beta, waitlist collection or any publicly reachable environment.
- ⛔ **Real user, client or pilot-participant case data in any environment, including staging.** Use fixture data only.
- ⛔ The private criminal matter in any build environment. It remains private evaluation only under D-005 / D-017 and [`NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md`](../evaluation/NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md).
- ⛔ Autonomous legal actions, external write actions, court integrations, ODR marketplace mechanics.
- ⛔ Consumer-category launch. Consumer remains sandbox / provisional Phase 2 (D-004).

### Constraints carried into the build

These are locked decisions and are **not** relaxed by this authorization:

| Constraint | Source |
|---|---|
| Deterministic workflow orchestration with bounded, schema-validated AI tasks — **not** an open-ended agent | D-008 |
| Provenance-first: `user claim` → `verified fact` → `AI inference` must remain distinct objects | D-012, Master Context § 6 |
| Human decision authority. AI assists; humans decide | D-008 |
| Tenant + membership model, RLS enforced from the schema layer | D-009, D-011 |
| Separate corpora: user evidence vs authoritative legal sources | D-012 |
| Server-side model calls only; no secrets in the browser | Architecture Review |
| Append-only audit; no client audit write path | Architecture Review |
| No-training setting required with any model vendor | R21 |
| Retention durations remain provisional pending legal review; 90-day hot audit retention is an engineering default only | D-016 |

### Risk note — recorded, not blocking

This authorization is granted **while Figma V2 (A-008) and User/WTP Validation (A-009) are still Pending.**

The previously recorded sequence ([`NYAYOS_90_DAY_VALIDATION_PLAN_V1.md`](../evaluation/NYAYOS_90_DAY_VALIDATION_PLAN_V1.md); Dashboard § K) placed the build decision *after* those two. Building ahead of them is the founder's call and is recorded as made. The live exposure it carries:

| Risk | Why it is elevated by this decision |
|---|---|
| **R25** — Market thesis is wrong | Build cost is committed before the payer hypothesis is tested |
| **R13** — Low willingness to pay | No WTP evidence exists yet |
| **R14** — Individual-advocate economics fail | *High* likelihood; the alternative payer hypothesis is untested |
| **R24** — Architecture complexity slows validation | Register control is *"security/build work must not dominate user tests"* — this decision makes that the live failure mode |
| **R12** — Low user activation | Build precedes the design validation intended to de-risk it |

**Mitigation available without reversing this authorization:** run A-008 and A-009 **in parallel** with the staging build, and treat the staging build as a validation instrument rather than a release candidate. The staging build then becomes a way to test the wedge faster, not a bet placed before testing it.

### Conditions for the next gate

Production authorization (**FA-002**, not yet granted) should not be sought until:

1. A-008 Figma V2 complete;
2. A-009 user interviews + WTP validation complete, with the D-003 revisit trigger (15–20 interviews) satisfied;
3. A-010 security + data architecture review complete;
4. legal / privacy counsel review complete — retention durations fixed (D-016), model-vendor no-training terms confirmed (R21);
5. staging UAT passed;
6. a deletion workflow proven auditable (R18) and tenant isolation tested (R02, R20).

### Open item — founder decision required

**Where does the staging build's code live?**

This repository is currently **documentation only**, and FA-001 does not change that. Product code must not be committed here until the founder records the choice:

- **(a)** code stays in Lovable's own repository; this repository stays documentation-only *(assumed default — no action needed)*;
- **(b)** code is mirrored into this repository, which then stops being documentation-only and needs a revised `.gitignore`, secret-scanning and branch policy before the first code commit.

**Until this is recorded, option (a) applies and no product code may be committed to this repository.**

---

## FA-001 — Addendum, 21 September 2026: open item resolved

**Open item:** *Where does the staging build's code live?*
**Resolution:** **Option (b).** Founder instruction (A-017): *"Import Sprint 1 Foundation into the canonical repository and make it canonical."* Code lives at `app/` in `rmanish2000-del/nyayos`. The repository is no longer documentation-only.

**Unchanged by this addendum:** every limit in FA-001. Staging only. Production ⛔ NOT ALLOWED. No real case data in any environment. Private matter never enters the build environment.

**Consequence recorded:** the build toolchain (Nitro) emits Cloudflare Workers deploy configuration on every `vite build`. Emitting configuration is not deploying. `nitro deploy` must not be run until **FA-002** exists.
