# NYAYOS_90_DAY_VALIDATION_PLAN_V1

## Objective

Validate the Dispute Readiness Engine and its initial commercial wedge before broad scale.

**Important:** The project remains pre-build until founder authorization is explicitly given. This document is a validation/build planning artifact, not a deployment authorization.

## Days 1–15 — Problem and segment validation

### Targets

Interview 15–20:

- small-business owners;
- FPO operators;
- finance/operations leads;
- professionals with supplier/payment disputes;
- lawyers handling these disputes.

### Questions

Do not ask:

> “Would you use an AI legal platform?”

Ask:

> “Tell me about the last dispute where money, delivery, quality or a vendor/service obligation was involved.”

Capture:

- trigger;
- documents;
- time lost;
- people involved;
- action taken;
- professional involvement;
- outcome;
- cost;
- repeated pattern.

### Prototype test

Compare:

A. generic legal chatbot  
B. evidence/file organizer  
C. Dispute Readiness Engine

### Gate G1 — Proceed

Required:

- ≥60% can explain product value without legal vocabulary;
- ≥40% have experienced the target workflow within the relevant period;
- ≥5 qualified users accept a controlled pilot.

### Gate G1 — Pivot

Pivot category when another segment shows materially greater pain and willingness to engage.

### Gate G1 — Stop

Stop when there is no repeated problem, no document burden and no credible action value.

---

## Days 16–30 — Workflow and willingness-to-pay

### Prototype

Build/test these screens conceptually:

- What happened?
- dynamic questions;
- document upload;
- evidence locker;
- fact confirmation;
- timeline;
- contradictions;
- evidence gaps;
- possible paths;
- action plan;
- export.

### Pricing tests

Test, without declaring final prices:

1. Free case intake + paid export.
2. One-time paid dispute file.
3. Monthly organization workspace.
4. Professional review add-on only where legally compliant.

### WTP evidence hierarchy

Strong:

- user pays;
- signed pilot;
- paid letter of intent.

Medium:

- deposit/commitment;
- procurement process started.

Weak:

- “sounds useful”;
- survey intention.

### Gate G2

Proceed if:

- at least 3 qualified users complete a realistic end-to-end case;
- at least 2 can describe concrete time/value saved;
- at least 3 show meaningful WTP signals.

---

## Days 31–60 — Controlled product build

This stage is the future implementation sequence once authorized.

### Build order

1. tenant/auth/security;
2. dispute state;
3. document upload;
4. OCR/extraction abstraction;
5. provenance;
6. fact confirmation;
7. timeline;
8. entity/party graph;
9. evidence relations;
10. contradictions;
11. source retrieval;
12. possible paths;
13. action plan;
14. export;
15. audit;
16. evaluation harness.

### No generalized agent

Use explicit workflow transitions with bounded AI tasks.

### Data

Use:

- synthetic cases;
- rights-cleared/anonymized public cases;
- founder-controlled private sandbox.

### Gate G3

Before external pilot:

- zero cross-tenant leakage;
- zero unsupported high-impact claims in gold test set;
- zero fabricated citations;
- zero invented deadlines;
- zero silent fact changes.

---

## Days 61–90 — Private pilot

### Pilot size

10–25 users.

Target:

- 6–15 small businesses/FPOs;
- 2–5 professional reviewers;
- optional consumer sandbox cohort.

### Measure

#### User

- intake completion;
- evidence upload;
- correction;
- completion time;
- repeat use.

#### Product

- critical-field extraction accuracy;
- timeline accuracy;
- evidence linkage;
- contradiction precision/recall;
- citation validity;
- unsupported-claim rate.

#### Business

- paid conversion;
- price sensitivity;
- expansion interest;
- referral;
- professional-review demand.

#### Human review

Measure:

- time to understand matter;
- missing-evidence discovery;
- usefulness of chronology;
- trust in provenance;
- export quality.

---

# Go / Pivot / Stop

## GO

Proceed to a broader launch only if:

- no critical security failure;
- source-grounding passes;
- users correct AI safely;
- human reviewers find exports useful;
- target users show measurable workflow value;
- at least one payer segment pays or provides strong procurement evidence;
- repeat usage appears.

## PIVOT

Pivot category if:

- target segment is interested but won't pay;
- another segment demonstrates higher pain/WTP;
- users repeatedly ignore legal guidance but value evidence packaging;
- a narrower document workflow delivers more measurable value.

## STOP

Stop/pause the product thesis if:

- critical privacy controls cannot be made reliable;
- source verification cannot be kept accurate;
- users cannot distinguish AI inference from fact;
- the value proposition only works when users treat AI as an authority;
- no segment has repeated demand after structured interviews and pilots.

---

# 90-day deliverables

1. Validated category choice.
2. Validated primary payer hypothesis.
3. Tested “What happened?” flow.
4. Working Dispute File specification.
5. Security/threat model.
6. Evaluation dataset.
7. Price test results.
8. Pilot evidence.
9. Go/pivot/stop decision.
