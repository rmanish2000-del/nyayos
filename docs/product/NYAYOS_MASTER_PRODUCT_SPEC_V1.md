# NYAYOS_MASTER_PRODUCT_SPEC_V1

**Project:** NyayOS  
**Product:** Dispute Readiness Engine  
**Version:** V1 — definitive pre-build specification  
**Date:** 20 September 2026  
**Stage:** Research / Product Definition  
**Implementation:** Not authorized by this document  
**Deployment:** Not authorized by this document

---

## 1. Executive decision

NyayOS should build one product capability:

> **A Dispute Readiness Engine that turns a person's real-world dispute into a structured, evidence-linked, source-grounded dispute file and human-reviewable action plan.**

The entry point is:

> **What happened?**

The core workflow is:

**What happened?  
→ Structured facts  
→ Parties/entities  
→ Date-wise timeline  
→ Evidence inventory  
→ Evidence-to-fact mapping  
→ Missing evidence  
→ Contradiction detection  
→ Issue classification  
→ Verified information  
→ Possible resolution paths  
→ Action plan  
→ Human review  
→ Exportable dispute file**

The supplied MVP Selection report already selected this capability and described the same core output structure. The new source package does not invalidate the feature selection; it changes how the feature should be commercially positioned and technically implemented. [Founder-supplied MVP Selection Report.]

## 2. Strategic reconciliation

The five source documents now produce a coherent but deliberately narrower product thesis.

### Agreement

- The previous court-first “File a Case” entry point is rejected.
- A generic legal chatbot is not sufficient.
- The real product opportunity is workflow, verification, and structured case/evidence data.
- Humans must remain responsible for consequential legal decisions.
- Evidence and provenance are first-class.
- Consumer/property/family/land and other disputes are meaningful problem areas.
- Global justice-AI examples consistently favor assistive, auditable systems.
- Existing government infrastructure means NyayOS should integrate around it rather than recreate it.

The Global Benchmark explicitly frames the battleground as the trusted layer between models and public institutions and emphasizes human supervision, citation locking and multilingual procedure. The Indian Justice Map identifies large lower-level dispute volumes and document/process bottlenecks. [Founder-supplied Global Benchmark; Founder-supplied Indian Justice Map.]

### Tension

The Red Team rejects:

- “Operating System for Indian Law” as a market position;
- litigation-bar-first SaaS;
- individual-advocate-first monetization;
- an assumption that the court data layer itself is a defensible moat.

The MVP Selection report nevertheless selected a broadly citizen-oriented Dispute Readiness Engine.

### Resolution

**Keep the feature. Change the initial commercial wedge.**

The public MVP should initially target:

> **Small-business / FPO / professional payment, vendor, service or commercial-dispute readiness**

while preserving a citizen-friendly “What happened?” experience.

Why:

- the product remains accessible without requiring legal knowledge;
- the payer does not need to be an individual advocate;
- disputes can have meaningful monetary stakes;
- document/evidence density is high;
- the supplied Foodgod FPO matter provides a private stress test for document complexity without becoming the public criminal-defense product;
- the workflow can later expand naturally into consumer disputes, money recovery, property, notices and ODR.

This is a **commercial hypothesis**, not a proven market fact. It must be validated before pricing or fundraising.

---

# 3. Positioning

## Product category

**Dispute Readiness Infrastructure**

Not:

- AI lawyer
- AI judge
- virtual advocate
- court replacement
- legal outcome predictor
- automated legal representative

## Product promise

> **Tell NyayOS what happened. Organize the facts, evidence and timeline, understand the issue, see verified information and possible paths, and create a case file a human professional can actually use.**

## Product principle

**Workflow > model.  
Evidence > assertion.  
Source > confidence theatre.  
Human decision > autonomous decision.**

---

# 4. MVP users

## Primary user

**Small-business / FPO / professional dispute owner**

Typical user:

- owner/founder;
- operations or finance lead;
- FPO operator;
- small commercial organization;
- independent professional.

Primary job:

> “We have a dispute, documents are scattered, facts are unclear, and we need to know what to organize and what to do next.”

## Primary payer hypothesis

**The same small business/FPO/professional organization.**

Payment hypothesis:

- one-time dispute preparation fee;
- workspace subscription for recurring disputes;
- later organization plan.

This is not yet validated.

## Secondary user

**Lawyer / qualified professional**

Job:

> Review an organized dispute package faster than starting from unstructured emails, WhatsApp messages, scans and calls.

## Secondary payer hypothesis

**Lawyer / small firm subscription for receiving/organizing client case files.**

Do not assume lead-generation commissions.

## Strategic users

### NGO / legal-aid organization

Potential distribution and impact partner.

### Institutional dispute owner

Future enterprise customer.

### Consumer / individual citizen

Future broader distribution persona and usability test population.

---

# 5. Initial category strategy

## Launch category

### Small-business / FPO / vendor-payment and commercial-service disputes

Bounded examples:

- vendor payment disagreement;
- supply/service dispute;
- invoice/non-payment issue;
- delivery/quality/payment disagreement;
- refund/service-performance dispute involving a business supplier;
- contractual performance dispute where no criminal-defense workflow is required.

The public MVP should not attempt to classify every commercial dispute under every Indian statute.

## Sandbox category

### Consumer complaint / consumer-service dispute

Why sandbox:

- clear evidence workflow;
- understandable end user;
- useful test of source-grounded procedural guidance;
- official Consumer Affairs materials are available.

The Department of Consumer Affairs maintains the Consumer Protection Act/rules/regulations, including Consumer Disputes Redressal Commission rules and mediation materials. [Department of Consumer Affairs, official site, accessed 20 Sep 2026.] urlDepartment of Consumer Affairs — Consumer Protection frameworkhttps://consumeraffairs.nic.in/acts-and-rules/consumer-protection/consumer-protection

## Private evaluation only

### Existing criminal-case document organization

Use the supplied Foodgod FPO matter only as a private stress test for:

- OCR;
- chronology;
- document cross-reference;
- contradiction detection;
- missing-document detection;
- export quality.

No public criminal-defense positioning.

## Excluded from public launch

- outcome prediction;
- bail prediction;
- AI judge;
- criminal-defense strategy;
- autonomous filing;
- autonomous negotiation;
- court-data replacement;
- property-record integration;
- family-case advice;
- lawyer marketplace;
- nationwide ODR marketplace.

---

# 6. Category decision model

Weights:

| Criterion | Weight |
|---|---:|
| Pain / monetary consequence | 20% |
| Evidence/workflow density | 15% |
| User adoption | 15% |
| Willingness to pay potential | 20% |
| Data-loop potential | 15% |
| 90-day feasibility | 10% |
| Safety/regulatory manageability | 5% |

Directional scores:

| Category | Score / 100 | Status |
|---|---:|---|
| Small-business/FPO vendor-payment dispute | **88** | **Launch hypothesis** |
| Consumer complaint | **84** | Sandbox |
| Money recovery/payment dispute | **82** | Phase 2 |
| Legal-notice response | **80** | Phase 2 output |
| Property/land dispute | **70** | Defer |
| Criminal-case document organization | **64 public** | Private test only |

These are founder decision scores, not independently measured market statistics.

The Red Team's commercial recommendation is consistent with a payer who is not an individual advocate and with money-linked, standardized disputes. [Founder-supplied Red Team Report.]

---

# 7. User experience

## 7.1 Entry

Headline:

**What happened?**

Supporting copy:

> “Describe the problem in your own words. You do not need to know the legal term.”

## 7.2 Intake

Questions are generated from missing facts, not a fixed 40-question form.

Minimum fields:

- user objective;
- date range;
- parties;
- organization relationship;
- money/transaction details where relevant;
- location/jurisdiction clues;
- documents available;
- prior steps;
- known deadlines.

## 7.3 Dynamic question engine

Requirements:

- ask one high-value question at a time;
- explain sensitive questions;
- allow “I don't know”;
- never convert uncertainty into certainty;
- never ask the user to choose a legal conclusion when a factual question is possible;
- retain prior answers with provenance.

## 7.4 Document ingestion

MVP:

- PDF;
- JPG/JPEG;
- PNG;
- DOC/DOCX where supported;
- pasted text.

Each upload gets:

- document ID;
- hash;
- file type;
- page count where available;
- processing state;
- extraction state;
- owner/tenant;
- timestamp.

## 7.5 OCR and extraction

Pipeline:

**Upload → security scan → OCR/parser → extraction → provenance → user confirmation**

Extract:

- names;
- entities;
- roles;
- dates;
- amounts;
- places;
- invoice/order/reference numbers;
- document type;
- event statements.

Extraction ≠ fact.

## 7.6 Fact confirmation

Each important extracted field shows:

- value;
- source document;
- page/location;
- confidence;
- status.

Actions:

- confirm;
- correct;
- uncertain;
- irrelevant.

## 7.7 Timeline

Events contain:

- event text;
- date assertion;
- date precision;
- date confidence;
- supporting documents;
- verification state.

Date states:

- exact;
- approximate;
- inferred;
- unknown;
- conflicting.

## 7.8 Parties/entities

Each entity contains:

- canonical label;
- source forms;
- role;
- organization/person type;
- evidence;
- confidence;
- correction history.

Do not silently merge two similar names.

## 7.9 Evidence map

Evidence relations:

- supports;
- partially supports;
- contradicts;
- mentions;
- relevance uncertain.

The interface must display the underlying source before claiming the relationship.

## 7.10 Contradictions

System language:

> “We found different information in these sources. Please review.”

Never:

> “This document is false.”

## 7.11 Evidence gaps

System language:

> “We did not find supporting evidence for this item in the documents provided.”

Never:

> “This did not happen.”

## 7.12 Issue classification

Classification output:

- issue category;
- alternative category if material;
- supporting facts;
- uncertainty;
- source basis.

## 7.13 Verified information

Every consequential procedural/legal statement must contain:

- source;
- publisher;
- title;
- jurisdiction;
- date/effective date where relevant;
- retrieval/verification timestamp;
- relevant source passage reference.

## 7.14 Possible paths

The UI presents possible routes:

- direct resolution;
- written communication/request/notice;
- mediation/ODR where applicable;
- legal-aid route where relevant;
- professional review;
- formal complaint/proceeding where appropriate.

No “winner” or outcome score.

## 7.15 Action plan

Each action has:

- task;
- reason;
- evidence needed;
- owner;
- verified deadline;
- urgency;
- status.

If no verified deadline exists:

> “No verified deadline found — review before relying on timing.”

## 7.16 Human handoff

Output:

- one-page summary;
- facts;
- timeline;
- parties;
- evidence map;
- contradictions;
- missing evidence;
- issues;
- verified information;
- possible paths;
- action plan;
- user corrections.

## 7.17 Export

Formats:

- web view;
- PDF;
- structured JSON internally.

Export metadata:

- version;
- timestamp;
- AI-generated-content notice;
- source list;
- correction history;
- reviewer status.

---

# 8. Information architecture

## Public area

- Home
- How it works
- Trust & Safety
- Privacy
- Sign in
- Pilot / pricing

## Secure workspace

- Dashboard
- New dispute
- Dispute overview
- Intake
- Documents
- Evidence
- Timeline
- Parties
- Issues
- Contradictions
- Evidence gaps
- Verified information
- Possible paths
- Action plan
- Human review
- Export
- Corrections
- Consent & Privacy
- Delete dispute

---

# 9. User stories and acceptance criteria

## US-01 — Start from a story

**User story:** As a dispute owner, I want to describe what happened without knowing legal terminology.

**Value:** Lower entry friction.

**Acceptance:**
- user can start with free text;
- system extracts candidate facts;
- system does not require legal category selection;
- uncertainty is preserved.

**Safety acceptance:** no conclusion is presented as established solely because the user described it.

**Failure:** if extraction is poor, show raw user statement and request confirmation.

**Evidence:** usability test with representative dispute narratives.

## US-02 — Upload evidence

**Value:** Centralize scattered documents.

**Acceptance:**
- private upload;
- processing status;
- source reference;
- deletion available.

**Safety:** unauthorized user cannot access another tenant's file.

**Failure:** failed processing preserves original file and explains status.

**Evidence:** upload/security test.

## US-03 — Confirm extracted facts

**Acceptance:**
- every high-impact extracted value has source location;
- user can correct;
- correction supersedes display but original extraction remains auditable.

**Safety:** system never silently overwrites user-confirmed facts.

**Evidence:** correction audit.

## US-04 — Build timeline

**Acceptance:**
- events trace to evidence;
- uncertain dates are marked;
- conflicting dates remain visible.

**Safety:** no invented dates.

**Evidence:** gold-standard timeline comparison.

## US-05 — Map evidence to facts

**Acceptance:**
- relationship stored explicitly;
- source shown;
- uncertain linkage allowed.

**Safety:** unsupported linkage cannot be presented as verified.

**Evidence:** human-label comparison.

## US-06 — Flag contradictions

**Acceptance:**
- contradiction has two source references;
- system flags rather than adjudicates;
- user can mark reviewed.

**Safety:** no false declaration that one source is true/false.

**Evidence:** contradiction test set.

## US-07 — Identify evidence gaps

**Acceptance:**
- gap is linked to an expected/mentioned item;
- source references missing relation when possible;
- no negative inference.

**Evidence:** reviewer checklist comparison.

## US-08 — Retrieve verified information

**Acceptance:**
- authoritative source preferred;
- citation attached;
- no answer when source threshold fails.

**Safety:** zero fabricated citation tolerance.

**Evidence:** citation audit.

## US-09 — Generate action plan

**Acceptance:**
- actions trace to verified information or clearly labeled general workflow;
- deadlines only when verified;
- uncertainty visible.

**Safety:** no outcome prediction.

**Evidence:** human review.

## US-10 — Export

**Acceptance:**
- complete provenance;
- versioned export;
- user corrections included;
- privacy check before sharing.

**Safety:** only authorized recipient gets access.

**Evidence:** export authorization test.

## US-11 — Delete

**Acceptance:**
- user can request dispute deletion;
- access is revoked immediately;
- deletion workflow is auditable;
- UI distinguishes requested vs completed deletion.

**Safety:** no hidden retention beyond the published policy.

**Evidence:** deletion verification test.

## US-12 — Human review

**Acceptance:**
- user explicitly shares dispute;
- reviewer sees only shared scope;
- reviewer action is logged.

**Safety:** reviewer cannot access unrelated disputes.

**Evidence:** authorization test.

---

# 10. Dispute File data model

## Core entities

### Dispute

- id
- tenant_id
- created_by
- category
- status
- objective
- jurisdiction_hints
- sensitivity_level
- created_at
- updated_at
- deleted_at

### Person / Entity

- id
- dispute_id
- tenant_id
- canonical_name
- entity_type
- aliases
- confidence
- verification_status

### Role

- entity_id
- role_type
- source_reference

### Event

- id
- dispute_id
- event_text
- date_assertion_id
- confidence
- verification_status

### Date Assertion

- date_value nullable
- date_from nullable
- date_to nullable
- precision
- confidence
- source_reference

### Factual Proposition

- id
- dispute_id
- proposition
- epistemic_type
- confidence
- verification_status
- canonical_status

`epistemic_type`:

- user_statement
- document_fact
- allegation
- ai_extraction
- ai_inference
- contradiction
- missing_evidence
- unverified_claim

### Document

- id
- tenant_id
- dispute_id
- storage_key
- content_hash
- mime_type
- page_count
- processing_status
- ocr_status
- created_at
- deleted_at

### Document Location

- document_id
- page_number
- paragraph/anchor
- extracted_text_offset where available

### Evidence Item

- id
- dispute_id
- document_id
- description
- evidence_type
- confidence
- verification_status

### Evidence Relation

- evidence_id
- proposition/event/entity id
- relation_type
- confidence
- reviewer_status

### Contradiction

- id
- dispute_id
- item_a_id
- item_b_id
- contradiction_type
- confidence
- reviewed_by
- review_status

### Missing Evidence

- id
- dispute_id
- expected_item
- reason
- related_reference
- status

### Issue

- id
- dispute_id
- category
- subcategory
- alternatives
- confidence
- basis_proposition_ids

### Source

- id
- title
- publisher
- jurisdiction
- source_url
- effective_date
- retrieved_at
- source_version/hash where practical

### Possible Path

- id
- dispute_id
- path_type
- description
- prerequisites
- source_ids
- confidence

### Action

- id
- dispute_id
- task
- reason
- owner
- deadline
- deadline_status
- urgency
- status
- source_ids

### Human Review

- id
- dispute_id
- reviewer_id
- shared_scope
- review_status
- comments
- started_at
- completed_at

### User Correction

- id
- target_type
- target_id
- previous_value
- new_value
- reason
- user_id
- timestamp

### AI Run

- id
- dispute_id
- task_type
- model_provider
- model_version
- prompt_version
- input_refs
- output_schema_version
- safety_status
- timestamp
- latency
- cost_metadata

### Export Version

- id
- dispute_id
- version
- included_sections
- generated_at
- generated_by
- share_status

### Consent Record

- id
- tenant_id
- user_id
- consent_type
- policy_version
- granted_at
- revoked_at

### Retention Record

- object_type
- object_id
- retention_policy_version
- deletion_requested_at
- deletion_completed_at
- verification

---

# 11. Provenance contract

Every extracted/generated item must carry, directly or indirectly:

- source document;
- source page/section;
- extraction method;
- confidence;
- verification status;
- user correction history;
- model/version;
- timestamp.

### Confidence policy

Do not display meaningless precision such as `93.742%`.

Use bands:

- High
- Medium
- Low
- Unknown

Raw numeric confidence may exist internally for evaluation.

---

# 12. AI architecture contract

## Permitted

- extraction;
- normalization;
- bounded classification;
- question generation;
- summarization;
- contradiction flagging;
- evidence-gap suggestions;
- source retrieval;
- source-grounded explanation;
- action-plan drafting;
- export drafting.

## Prohibited

- representation;
- autonomous filing;
- autonomous negotiation;
- outcome prediction;
- guilt/innocence determination;
- bail prediction;
- pretending to be a lawyer/judge;
- autonomous sending of legal communications;
- fabricated citations;
- silent changes to canonical facts.

## RAG

Two distinct retrieval spaces:

1. **User-case corpus** — private documents and user-approved facts.
2. **Authoritative legal/procedural corpus** — public/official sources.

Never mix them without an explicit provenance boundary.

### Grounding

- legal/procedural statements require source references;
- if retrieval fails, say so;
- no-source response must not become a guessed answer;
- source version/date must be tracked where legal change is material.

---

# 13. AI agent decision

**MVP decision: do not use a general autonomous agent loop for the core dispute workflow.**

The Architecture Review had adopted a server-side closed-tool agent architecture. That is useful as a future capability, but the current product can achieve its core value through deterministic workflow orchestration plus narrowly bounded model calls.

### Retain from architecture

- server-side AI calls;
- closed tool catalog;
- Zod validation;
- step/cost limits;
- human confirmation for mutations;
- prompt-injection isolation;
- audit logs.

### Modify

Replace:

`free-form agent → tools → arbitrary workflow`

with:

`explicit workflow state → bounded AI task → validated structured output → human/system gate → state transition`

### Defer

- open-ended multi-step agents;
- external actions;
- general write tools;
- autonomous API calling beyond ingestion/retrieval.

---

# 14. Security requirements

Mandatory:

- tenant isolation;
- RLS on all tenant data;
- server-side authorization;
- least privilege;
- encrypted storage/transmission;
- private object storage;
- signed URLs;
- access logs;
- no secrets in browser;
- no secrets/full PII in logs;
- malware/content scanning;
- prompt-injection controls;
- export authorization;
- correction history;
- deletion controls;
- backup policy;
- incident response;
- rate limits;
- dependency scanning;
- security testing before pilot.

The Architecture Review already specifies RLS, least-privilege grants, server-side secrets, signed storage access, HMAC webhook checks, Zod validation, closed agent tools and append-only audit events. Those controls should be retained and adapted to tenant-based dispute ownership.

---

# 15. Tenancy and roles

## Tenancy decision

**Multi-tenant organization-ready from day one.**

Model:

- every dispute belongs to a tenant;
- a personal user gets a one-user tenant;
- an organization can have multiple members;
- sharing is explicit.

## Roles

- Owner
- Member
- Reviewer
- Organization Admin
- Platform Security/Admin

Do not encode role only on a user profile.

Use membership/role tables.

---

# 16. Storage

Recommended key:

`<tenant_id>/<dispute_id>/<document_id>/original`

Derived files:

`<tenant_id>/<dispute_id>/<document_id>/derived/...`

No public case-file buckets.

Signed URLs are time limited.

---

# 17. OCR/extraction pipeline

Because the Architecture Review targets an edge runtime with no native binaries, OCR should be an asynchronous external/provider abstraction rather than running native OCR binaries inside the edge worker.

Workflow:

**Upload → scan → queue → extraction provider → normalized result → provenance → human confirmation**

Provider must be swappable.

---

# 18. RAG / vector search

**pgvector remains the MVP choice.**

Reason:

- current architecture already uses Supabase/Postgres;
- one system of record;
- RLS-friendly;
- sufficient for a bounded MVP corpus.

The existing Architecture Review proposed 500–1,000-token chunks and pgvector embeddings. The exact embedding dimensionality should not be frozen until the selected embedding provider is tested; make it configuration/schema-version dependent.

---

# 19. Audit

Append-only audit events should capture:

- authentication;
- data access;
- export;
- deletion;
- corrections;
- permission changes;
- AI runs;
- retrieval;
- reviewer access;
- security events.

No client-side audit writes.

Exact retention duration remains provisional pending privacy/legal review. The architecture review's 90-day hot-retention idea can be used as an engineering default, not a final legal-retention policy.

---

# 20. External justice infrastructure

Do not recreate:

- eCourts case search;
- NALSA legal aid;
- government consumer infrastructure;
- mediation institutions.

eCourts already supports searches by CNR, party name, case number, filing number, advocate, FIR, Act and case type. citeturn533440search0turn533440search2

NALSA provides legal aid/legal advice and connects eligible people to legal-services institutions. citeturn688792search1

The Mediation Act, 2023 expressly permits online mediation, including at the pre-litigation stage, with written party consent and confidentiality/integrity requirements. citeturn533440search51

These should become downstream integration points.

---

# 21. Compliance/product trust

The Supreme Court's current notices page records the 2026 public-consultation process for draft Regulations for Use of AI in Courts. NyayOS should therefore preserve model/corpus/reviewer/disclosure metadata even before a specific court procurement use case exists. citeturn688792search0

MeitY's official site records that the DPDP Rules, 2025 were published on 14 November 2025 and provides the enforcement timeline and Data Protection Board materials. citeturn533440search4

Product requirements:

- purpose limitation;
- minimal collection;
- consent records;
- correction;
- deletion;
- export;
- retention transparency;
- no training on private case files without separate, explicit authorization;
- privacy-by-default.

---

# 22. Metrics

## North-star

**Completed, usable dispute files per week.**

A usable file must contain:

- structured facts;
- timeline;
- evidence;
- evidence linkage;
- issue classification;
- source-grounded information;
- action plan;
- provenance.

Supporting metrics:

- intake completion;
- evidence upload rate;
- correction rate;
- extraction accuracy;
- timeline accuracy;
- evidence-link accuracy;
- unsupported-claim rate;
- citation validity;
- export rate;
- human-review usefulness;
- repeat use;
- willingness to pay.

---

# 23. Non-goals

Do not build in the MVP:

- AI judge;
- case-outcome predictor;
- criminal-defense strategy engine;
- autonomous filing;
- autonomous negotiation;
- lawyer marketplace;
- full ODR marketplace;
- all-state land-record integration;
- full legal research database;
- nationwide court-data replication;
- practice-management suite.

---

# 24. Product north star after MVP

The long-term moat should be:

**Real dispute  
→ structured facts  
→ evidence  
→ workflow  
→ human action  
→ resolution/outcome**

The moat is not the underlying model.

The first durable asset is the **Dispute File schema + provenance + workflow graph**.

The Red Team's warning that generic court-data/legal-research layers can be commoditized should be treated as a design constraint, not ignored.

---

# 25. Final product decision

**Feature:** Dispute Readiness Engine — LOCKED.

**Commercial wedge:** Small-business/FPO/vendor-payment and commercial-service disputes — PROVISIONAL.

**Sandbox:** Consumer dispute — PROVISIONAL.

**Private stress test:** Existing criminal-case document organization — LOCKED AS PRIVATE ONLY.

**Architecture:** Supabase/Postgres/RLS/pgvector — ADOPT WITH MODIFICATIONS.

**Agent architecture:** Defer generalized autonomous agent; use deterministic workflow orchestration — LOCKED FOR MVP.

**Next decision required:** 15–20 user interviews + willingness-to-pay tests before broader implementation authorization.



---

# Source and evidence notes

## Founder-supplied source files

- `NYAYAOS_RED_TEAM_REPORT.md` — adversarial market/regulatory analysis, 20 Sep 2026.
- `NYAYAOS_GLOBAL_BENCHMARK_REPORT.md` — six-country justice AI/ODR benchmark, 20 Sep 2026.
- `NYAYAOS_INDIAN_JUSTICE_MAP.md.md` — Indian justice-system mapping.
- `NYAYAOS_MVP_SELECTION_REPORT(1).md` — prior MVP selection.
- `ARCHITECTURE_REVIEW.md` — technical architecture review.

## Current official sources verified for this V1

1. **eCourts India Services — Case Status**, eCourts Mission Mode Project, accessed 20 Sep 2026.  
   https://services.ecourts.gov.in/ecourtindia_v6/casestatus/

2. **e-Courts High Court Services**, eCourts Mission Mode Project, accessed 20 Sep 2026.  
   https://hcservices.ecourts.gov.in/ecourtindiaHC/index_highcourt.php

3. **The Mediation Act, 2023**, Government of India / India Code, current official text accessed 20 Sep 2026.  
   https://upload.indiacode.nic.in/view-casepdf?id=AC_CEN_3_46_00011_A2023-32_1697800640677&type=act

4. **Legal Aid**, National Legal Services Authority (NALSA), accessed 20 Sep 2026.  
   https://nalsa.gov.in/legal-aid/

5. **Consumer Protection — Acts and Rules**, Department of Consumer Affairs, accessed 20 Sep 2026.  
   https://consumeraffairs.nic.in/acts-and-rules/consumer-protection/consumer-protection

6. **Notices and Circulars — Draft Regulations for Use of AI in Courts, 2026**, Supreme Court of India, accessed 20 Sep 2026.  
   https://www.sci.gov.in/notices-and-circulars/

7. **Digital Personal Data Protection Rules 2025**, Ministry of Electronics and Information Technology, accessed 20 Sep 2026.  
   https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa

## Evidence caveat

The founder-supplied Red Team and Global Benchmark contain secondary-source research and market estimates. Where those documents make current market or legal claims that matter to production decisions, treat them as research inputs and re-verify the underlying primary source before external publication, procurement, or legal implementation.
