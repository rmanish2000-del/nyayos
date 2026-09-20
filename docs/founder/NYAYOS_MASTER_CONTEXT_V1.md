# NYAYOS_MASTER_CONTEXT_V1

## 1. Purpose

This document is the continuity context for NyayOS product work. It consolidates the actual founder-supplied research package and the resulting decisions.

## 2. Canonical identity

**Project:** NyayOS  
**Repository:** https://github.com/rmanish2000-del/nyayos  
**Local workspace:** C:\nyayos

The supplied project brief states that the GitHub repository and local workspace are empty and that no code, schema, deployment or production implementation should be assumed.

Canonical spelling for all new work:

> **NyayOS**

Legacy research filenames may use `NYAYAOS`; retain those filenames where provenance matters.

## 3. Source package received

This version was prepared after the following files were supplied:

- `NYAYAOS_RED_TEAM_REPORT.md`
- `NYAYAOS_GLOBAL_BENCHMARK_REPORT.md`
- `NYAYAOS_INDIAN_JUSTICE_MAP.md.md`
- `NYAYAOS_MVP_SELECTION_REPORT(1).md`
- `ARCHITECTURE_REVIEW.md`

The source package is now complete enough to reconcile the architecture. The prior absence of `ARCHITECTURE_REVIEW.md` is no longer a blocker.

## 4. What each source contributes

### Red Team

The Red Team is intentionally adversarial. It argues against the original “Operating System for Indian Law” / litigation-bar thesis.

Core warnings:

- top-down legal-tech TAM figures are unreliable;
- litigation-bar SaaS has a difficult payer economics problem;
- free/government infrastructure compresses pricing;
- generic data-spine positioning is not unique;
- government may own or reproduce horizontal justice infrastructure;
- lawyer incentives may not reward pure efficiency;
- compliance and verifiability are more defensible than raw model capability.

The Red Team's own conclusion is not being copied as the product decision; it is being used to change the buyer/wedge assumptions.

### Global Benchmark

The six-country comparison establishes:

- AI assists, humans decide;
- court AI is becoming governed/structured;
- ODR is growing;
- citizen assistance is more viable when connected to institutional channels;
- verification/auditability matter;
- multilingual procedure can be a moat;
- the file/workflow is more valuable as a platform layer than a generic model interface.

The benchmark's proposed broader service layers include NyayaFile, NyayaBench, NyayaHear, NyayaForum and NyayaSahayak. For MVP, only the **file/readiness layer** is relevant.

### Indian Justice Map

The map identifies large volumes at district/subordinate and specialized levels and highlights:

- property/land;
- consumer;
- cheque-bounce/payment;
- execution;
- family disputes;
- document/process friction.

For MVP, the important architectural lesson is that the system must represent lower-level, document-heavy disputes rather than assume Supreme Court workflows.

### MVP Selection

The prior MVP selection selected:

> **NyayOS Dispute Readiness Engine**

and described its output as:

- issue classification;
- timeline;
- evidence map;
- rights/process map;
- action plan;
- resolution paths;
- lawyer-ready brief.

That feature selection remains valid.

### Architecture Review

The architecture review specifies:

- TanStack Start;
- React/Vite/TanStack Router/Query;
- edge server;
- Lovable Cloud / Supabase;
- Postgres + Auth + Storage + RLS;
- pgvector;
- server-side AI Gateway;
- append-only audit;
- closed tool catalog;
- server-side agent orchestration.

This version retains the database/storage/security principles but changes the MVP agent strategy to deterministic workflow orchestration.

## 5. Final synthesis

### The feature remains

**Dispute Readiness Engine.**

### The initial buyer changes

Do not assume the individual advocate is the payer.

Initial commercial hypothesis:

**small business / FPO / professional dispute owner.**

### The initial public category changes

Start with bounded **vendor-payment/commercial-service disputes**.

### The broader consumer category remains important

Consumer complaints become a sandbox/validation category and can become public Phase 2.

### The broader platform remains possible

Only after repeated use is established should NyayOS expand into:

- ODR;
- professional case intake;
- court context;
- legal-aid routing;
- multilingual service;
- institutional modules.

## 6. Evidence posture

Never mix:

**user claim → verified fact → AI inference**

These must remain distinct objects.

## 7. Real-case posture

The Foodgod FPO matter is:

- private;
- founder-controlled;
- a design stress test;
- not public marketing material;
- not generic training data;
- not a basis for legal conclusions.

## 8. Architecture posture

### Adopt

- Postgres;
- Supabase Auth;
- RLS;
- private object storage;
- signed URLs;
- append-only audit;
- pgvector;
- server-side AI calls;
- Zod/structured validation;
- provider abstraction.

### Modify

- `owner_id` → tenant-aware ownership/membership;
- document RAG → split case corpus and authoritative legal corpus;
- open agent workflow → explicit state machine + bounded AI tasks;
- fixed embedding dimension → provider/version configuration;
- retention → product policy plus legal review.

### Defer

- generalized agents;
- external write actions;
- multi-party ODR marketplace;
- national court integrations.

### Reject

- arbitrary code execution;
- arbitrary SQL from an AI agent;
- autonomous legal representation;
- silent case-file changes.

## 9. Current decision state

### Locked

1. NyayOS spelling.
2. Dispute Readiness Engine feature.
3. “What happened?” entry.
4. Evidence/provenance first.
5. Human decision authority.
6. Private criminal sandbox only.
7. No autonomous legal actions.
8. RLS/tenant isolation.
9. No private-case training without explicit separate authorization.

### Provisional

1. Small-business/FPO commercial dispute as launch wedge.
2. Consumer dispute as sandbox.
3. Exact pricing.
4. Exact retention duration.
5. Specific OCR provider.
6. Specific LLM provider.
7. Broader expansion order.

## 10. Current evidence gaps

- willingness-to-pay evidence;
- conversion evidence;
- lawyer time-saved evidence;
- category frequency for the exact target segment;
- actual contents of user interviews;
- final legal/privacy counsel review;
- final architecture benchmark under realistic document volumes;
- primary verification of every secondary-source claim inside the red-team memo.

## 11. Operating doctrine

> **Build the workflow users need, not the legal-tech category name investors already know.**



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
