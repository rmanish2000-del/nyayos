# NYAYOS_DECISION_LOG_V1

**Purpose:** Founder decision record. Each recommendation records evidence, confidence, alternative, reason rejected and revisit trigger.

---

## D-001 — Keep the Dispute Readiness Engine

**Recommendation:** Keep the Dispute Readiness Engine as the single MVP capability.

**Evidence:** The MVP Selection report selected it and specifies the “What happened?” workflow through evidence, paths, action plan and human handoff.

**Confidence:** High.

**Alternative:** Generic AI legal chatbot.

**Reason rejected:** The benchmark and MVP research point toward workflow, verification and structured files; government and commercial products already occupy general legal-assistant/research territory.

**Revisit trigger:** User research consistently shows a different core job has materially higher value.

---

## D-002 — Drop “OS” as the initial product claim

**Recommendation:** Do not use “Operating System for Indian Law” as the MVP positioning.

**Evidence:** Red Team identifies the OS thesis as already published/claimed by an existing market participant and warns it invites an oversized TAM and government/commodity-layer comparison.

**Confidence:** High as a product-positioning decision.

**Alternative:** Lead with “justice operating system.”

**Reason rejected:** Too abstract before NyayOS owns a repeatable workflow.

**Revisit trigger:** After multiple validated modules exist and the platform has demonstrated cross-workflow infrastructure value.

---

## D-003 — Change initial commercial wedge

**Recommendation:** Target small-business/FPO/professional commercial disputes first.

**Evidence:** Red Team explicitly argues for a payer that is not an individual advocate and for money-linked, standardized disputes. The private FPO case proves only that the data/evidence workflow needs to handle complex records; it does not prove the criminal category.

**Confidence:** Medium.

**Alternative:** Direct-to-consumer consumer complaints.

**Reason rejected for initial commercial test:** consumer adoption is attractive but willingness to pay may be weaker; the exact payer economics are unvalidated.

**Revisit trigger:** 15–20 interviews and pricing experiments show stronger consumer pull.

---

## D-004 — Consumer disputes as sandbox

**Recommendation:** Use consumer disputes as a non-criminal workflow sandbox and usability benchmark.

**Evidence:** Indian Justice Map identifies consumer matters as a meaningful justice category; official Department of Consumer Affairs maintains a formal rules/regulations framework.

**Confidence:** Medium-high.

**Alternative:** Public consumer launch.

**Reason deferred:** keep first commercial experiment focused on a payer with clearer economic stakes.

**Revisit trigger:** demonstrated paid conversion.

---

## D-005 — Criminal case remains private

**Recommendation:** Existing criminal-case document organization is private-only.

**Evidence:** Project brief explicitly requires the Foodgod matter to be used as a private evaluation case and forbids guilt/innocence, bail, public exposure and generic training.

**Confidence:** High.

**Alternative:** launch criminal-defense assistant.

**Reason rejected:** safety, trust and positioning risk; no independent market-validation evidence.

**Revisit trigger:** none for current MVP; would require a separate product thesis and legal/safety review.

---

## D-006 — Primary user

**Recommendation:** Small-business/FPO/professional dispute owner.

**Evidence:** Commercial payer hypothesis + document-heavy workflow.

**Confidence:** Medium.

**Alternative:** lawyer-first.

**Reason rejected:** would narrow product entry and risks becoming practice-management or research software.

**Revisit trigger:** professional-user pilots demonstrate substantially higher retention/value.

---

## D-007 — Primary payer

**Recommendation:** business/organization payer hypothesis.

**Evidence:** Red Team's market arithmetic warns against depending on individual advocate subscriptions.

**Confidence:** Medium-low until pricing tests.

**Alternative:** individual citizen payer.

**Reason not selected initially:** weaker willingness-to-pay evidence.

**Revisit trigger:** paid pilot data.

---

## D-008 — Deterministic workflow over autonomous agent

**Recommendation:** Use an explicit workflow state machine with bounded AI tasks.

**Evidence:** Architecture Review's closed-tool agent model is sound for auditability, but the core MVP workflow is sensitive and mostly structured. The Global Benchmark emphasizes human-supervised, auditable AI.

**Confidence:** High.

**Alternative:** generalized tool-using agent from day one.

**Reason rejected:** unnecessary attack surface, harder evaluation, harder reproducibility.

**Revisit trigger:** repeated workflow patterns demonstrate a bounded agent can improve completion without reducing safety.

---

## D-009 — Supabase/Postgres

**Recommendation:** Adopt.

**Evidence:** Actual Architecture Review already selects Lovable Cloud/Supabase with Postgres/Auth/Storage/RLS.

**Confidence:** Medium-high.

**Alternative:** external database.

**Reason rejected:** unnecessary complexity during MVP.

**Revisit trigger:** workload, security or procurement constraints.

---

## D-010 — pgvector

**Recommendation:** Adopt for MVP retrieval, subject to evaluation.

**Evidence:** Architecture Review selects pgvector.

**Confidence:** Medium-high.

**Alternative:** external vector database.

**Reason rejected:** added infrastructure without current demonstrated need.

**Revisit trigger:** corpus size/retrieval benchmark shows unacceptable performance.

---

## D-011 — Multi-tenant model

**Recommendation:** Organization-ready multi-tenancy from the schema layer.

**Evidence:** initial payer hypothesis is business/FPO/professional; cases may later involve multiple users/reviewers.

**Confidence:** High.

**Alternative:** user-only ownership.

**Reason rejected:** would force a disruptive schema change when collaboration starts.

**Revisit trigger:** none; personal workspaces can still be represented as one-user tenants.

---

## D-012 — RAG corpus separation

**Recommendation:** Separate user evidence from legal/procedural authoritative sources.

**Evidence:** Provenance requirements and source-grounded guidance require different trust semantics.

**Confidence:** High.

**Alternative:** one mixed vector corpus.

**Reason rejected:** source-origin confusion can cause sensitive leakage or citation ambiguity.

**Revisit trigger:** none for MVP.

---

## D-013 — eCourts

**Recommendation:** integrate later; do not reproduce case search.

**Evidence:** official eCourts already provides multiple case-status search modes. citeturn533440search0turn533440search3

**Confidence:** High.

**Alternative:** case-status tracker as MVP.

**Reason rejected:** duplicates existing infrastructure.

**Revisit trigger:** users require case context after dispute files become active.

---

## D-014 — NALSA

**Recommendation:** route rather than replace.

**Evidence:** NALSA already provides legal aid/advice and online application pathways. citeturn688792search1

**Confidence:** High.

**Alternative:** build a separate legal-aid marketplace.

**Reason rejected:** institutional duplication.

**Revisit trigger:** formal partnership.

---

## D-015 — ODR

**Recommendation:** build the data model to support ODR, but defer marketplace mechanics.

**Evidence:** Mediation Act supports online mediation with written party consent and confidentiality/integrity safeguards. citeturn533440search51

**Confidence:** High.

**Alternative:** launch ODR marketplace immediately.

**Reason rejected:** two-sided marketplace liquidity is not required to prove the readiness workflow.

**Revisit trigger:** enough structured disputes and resolution partners.

---

## D-016 — Retention

**Recommendation:** publish retention categories and user controls; keep exact durations provisional until counsel review.

**Evidence:** DPDP Rules 2025 are officially published by MeitY and include an enforcement timeline. citeturn533440search4

**Confidence:** High on need for governance; low on final exact periods.

**Alternative:** indefinite retention.

**Reason rejected:** unnecessary risk and weak privacy posture.

**Revisit trigger:** legal/privacy review.

---

## D-017 — Private-case training

**Recommendation:** no private-case training by default.

**Evidence:** project brief explicitly forbids generic training use of the supplied private matter.

**Confidence:** High.

**Alternative:** train models on all uploaded cases.

**Reason rejected:** confidentiality and trust risk.

**Revisit trigger:** only with separate explicit authorization and legal review.

---

## D-018 — Revenue model

**Recommendation:** test one-time paid dispute preparation first, then subscription.

**Evidence:** product has a discrete valuable artifact: a structured dispute file.

**Confidence:** Medium-low.

**Alternative:** ads, referral commissions, lawyer lead fees.

**Reason rejected:** legal-market restrictions and misaligned incentives; lead-generation structure requires legal review.

**Revisit trigger:** paid pilot indicates recurring use.

---

# Locked decisions

1. Dispute Readiness Engine.
2. “What happened?” entry.
3. Small-business/FPO/commercial dispute commercial hypothesis.
4. Consumer sandbox.
5. Criminal private sandbox.
6. Human decision authority.
7. Provenance-first architecture.
8. Multi-tenant-ready schema.
9. Supabase/Postgres/RLS.
10. pgvector.
11. Deterministic workflow over generalized agents.

# Provisional decisions

- price;
- exact category boundaries;
- exact vendor stack;
- retention duration;
- launch geography;
- professional monetization.



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
