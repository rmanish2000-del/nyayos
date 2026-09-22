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

---

# Decisions added 22 September 2026 (A-029 reconciliation)

**Provenance.** Each decision below was stated by the founder instruction of 22 September 2026 ("Current verified state") and is supported by the Ecosystem Architecture Review V1 (Claude Chat, 22 Sep 2026; `docs/architecture/NYAYOS_ECOSYSTEM_ARCHITECTURE_REVIEW_V1.md`). The instruction is treated as founder ratification. **No earlier entry has been edited or deleted**; where an earlier decision is affected its new status is stated here.

**Effect on earlier entries**

| Earlier | New status | By |
|---|---|---|
| D-001 Dispute Readiness Engine as single MVP capability | **Amended, not superseded** — the Engine remains the MVP; the product it belongs to is now the Dispute File platform with a professional-review layer, and four Dispute-File properties are added | D-019 – D-023 |
| D-005 Criminal case remains private | **Reaffirmed**; extended to exclude criminal-matter drafting from any public product | D-028 |
| D-008 Deterministic workflow / human authority | **Reaffirmed** | D-028 |
| D-015 ODR — data model yes, marketplace deferred | **Unchanged**; note that a ratings/placement lawyer marketplace is now rejected permanently (distinct from ODR/mediation routing) | D-024 |
| D-017 No private-case training | **Reaffirmed** | D-019 |
| D-018 Revenue model — one-time fee first | **Extended**: lead fees, success fees, listing fees and paid placement are rejected permanently rather than "requiring legal review" | D-025, D-026 |
| Master Context V1 § 9 decision state | **Superseded** by `NYAYOS_OPERATING_SYSTEM.md` § 22 (the V1 text is left unedited by rule) | A-029 |

---

## D-019 — Dispute File platform with a professional-review layer

**Recommendation:** NyayOS is the trusted system of record for a dispute before and around professional engagement — a Dispute File platform with a professional-review layer. It is **not** a lawyer marketplace.

**Evidence:** Founder instruction 22 Sep 2026; Ecosystem Review § 1.2 (Rule 36 solicitation ban, July 2024 BCI directive, Rules 20/21/37 — graded [V] there against S1–S3; not re-verified by the maintainer).

**Confidence:** High as positioning. **Status:** Locked.

**Alternative:** Lawyer-advertising marketplace. **Reason rejected:** on the wrong side of an active enforcement trend; a directory is replicable, the record compounds.

**Revisit trigger:** Written legal opinion changes the reading of Rule 36/37 for legal-tech tools.

## D-020 — Reviewer seat (MVP addition)

**Recommendation:** The owner may invite a named professional to a scoped, revocable, read-and-comment view of the Dispute File; comments are suggestions the owner accepts or rejects; reviewer identity is self-declared and displayed as "not verified by NyayOS"; no listing, discovery or public profile.

**Evidence:** Founder instruction; Ecosystem Review § 1.1 B-1, § 4.1 items 4–5. **Confidence:** Medium-high. **Status:** Locked as MVP scope; NOT IMPLEMENTED.

**Alternative:** Human review = emailed export. **Reason rejected:** no feedback loop; advocate-side value unmeasurable (90-Day Plan reviewer-usefulness gate).

**Revisit trigger:** Legal opinion on the reviewer-seat model; E4 leakage risk assessment in the Security + Data spec.

## D-021 — Communication outline (MVP addition)

**Recommendation:** Produce a Tier-0 outline — facts to state, documents to attach, what is asked, questions for the advocate. Not a sendable notice; no statutory language; not rendered as a letter.

**Evidence:** Founder instruction; Ecosystem Review § 1.1 B-2, § 5.2. **Confidence:** Medium-high. **Status:** Locked as MVP scope; NOT IMPLEMENTED.

**Alternative:** Full Tier-1 draft notices in MVP. **Reason rejected:** drafts without a proven record produce confident errors; unauthorised-practice exposure (E3).

**Revisit trigger:** Phase 2A evaluation data plus legal opinion on the self-help boundary.

## D-022 — Evidence-integrity manifest (MVP addition)

**Recommendation:** SHA-256 hash and server ingest timestamp per original; custody log (upload, view, share, export); hash manifest carried into every export; originals immutable; NyayOS never alters evidence.

**Evidence:** Founder instruction; Ecosystem Review § 4.1 item 2, § 15.2. **Confidence:** High. **Status:** Locked; NOT IMPLEMENTED.

**Alternative:** Immutable originals without hashing. **Reason rejected:** integrity cannot be demonstrated to a reviewer or forum.

**Revisit trigger:** BSA 2023 electronic-record certificate requirements verified against India Code (Ecosystem Review § 23 item 5).

## D-023 — Purpose-bound sharing (MVP addition)

**Recommendation:** Every share is a grant bound to an enumerated purpose, a scope and an expiry; revocable immediately (signed URLs invalidated, caches cleared, audit event); access list visible to the owner; purpose-mismatched reads denied.

**Evidence:** Founder instruction; Ecosystem Review § 1.1 B-4, § 15.1. **Confidence:** High. **Status:** Locked; NOT IMPLEMENTED.

**Alternative:** Unscoped share links. **Reason rejected:** DPDP purpose limitation; R20 reviewer over-read.

**Revisit trigger:** Security + Data spec grant model; DPDP Rules consent-manager provisions (dates to verify).

## D-024 — No lawyer-advertising marketplace (permanent)

**Recommendation:** Never build a two-sided, ranked, reviewed, pay-to-appear advocate marketplace in India. A particulars-only, eligibility-plus-client-choice directory is a separate, **deferred** question gated on a written legal opinion (Phase 3 at the earliest).

**Evidence:** Founder instruction; Ecosystem Review § 12, § 14. **Confidence:** High. **Status:** Locked — **permanent rejection**.

**Revisit trigger:** None for the marketplace. The compliant directory has its own trigger: written legal opinion plus Phase 2 exit.

## D-025 — No lead fees or success fees (permanent)

**Recommendation:** No per-lead, per-contact or per-request fees; no success fees or revenue share on engagements. Advocate payments to NyayOS must never rise with the number of clients NyayOS sends them; advocate SaaS pricing is flat.

**Evidence:** Founder instruction; Ecosystem Review § 13, § 14 (Rules 20, 36, 37 — [V] there). **Confidence:** High. **Status:** Locked — **permanent rejection**. Extends D-018.

**Revisit trigger:** None.

## D-026 — No paid placement (permanent)

**Recommendation:** No listing fees, paid visibility, sponsored ordering or placement of advocates.

**Evidence:** Founder instruction; Ecosystem Review § 13 (listing fee = high-risk; paid placement = reject). **Confidence:** High. **Status:** Locked — **permanent rejection**.

**Revisit trigger:** None.

## D-027 — No public ratings, reviews, win-rate metrics or rankings (permanent)

**Recommendation:** No public advocate star ratings or reviews; no win/success/disposal-rate metrics; no "best lawyer" rankings. Trustworthy advocate metrics are limited to enrolment status, years since enrolment, declared practice areas/forums/languages and availability. Any private feedback (Phase 3) is min-n and never used for ordering.

**Evidence:** Founder instruction; Ecosystem Review § 10, § 1.4. **Confidence:** High. **Status:** Locked — **permanent rejection**.

**Revisit trigger:** None.

## D-028 — No autonomous legal actions (permanent)

**Recommendation:** NyayOS never sends, files, signs, submits or approves any output; never auto-approves; never chooses an advocate for a user; never fabricates facts, citations, deadlines or reference numbers; never produces outcome or win probability, bail or risk scoring; never resolves contradictions. Court documents (Tier 2) exist only inside an advocate-controlled workspace (Phase 3). Criminal-matter drafting is excluded from any public product.

**Evidence:** Founder instruction; Ecosystem Review § 5.3; Master Context § 9 item 7; D-005, D-008; SC draft AI regulations (human primacy — [D]). **Confidence:** High. **Status:** Locked — **permanent**.

**Revisit trigger:** None.

## D-029 — India-first; nyayos.global defensive only

**Recommendation:** Operate under the NyayOS brand on an India-facing primary domain; Indian law, forums, professional regulation, data residency, Hindi + English first. Register `nyayos.global` defensively and park it. Build jurisdiction adapters (legal corpus, taxonomy, templates, policy flags, registry, privacy, language packs) rather than a global product; never generalise limitation periods, forum logic, advertising/fee rules, privilege, residency or professional verification.

**Evidence:** Founder instruction; Ecosystem Review § 18. **Confidence:** High. **Status:** Locked. Domain availability/ownership UNVERIFIED.

**Revisit trigger:** India Phase 3 exit criteria met and a partner institution exists in a target jurisdiction.

## D-030 — Security + Data Architecture Specification V1 is the next P0 work

**Recommendation:** Before any persistence, backend or reviewer-seat implementation, produce `NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md` (research and specification only; no code; no deployment). Tool: Claude Chat, Opus with Extended Thinking. Registered as **A-010**.

**Evidence:** Founder instruction; Continuity Handoff V1 recommended next assignment; Ecosystem Review § 24. **Confidence:** High. **Status:** Locked as sequencing.

**Note:** A file of that name (973 lines, dated 22 Sep 2026) exists in the founder's local Downloads — UNVERIFIED and not imported by this reconciliation. If it is the intended output, supply it for import and review.

**Revisit trigger:** Specification accepted (A-010 CANONICAL) — then the build sequence in `NYAYOS_OPERATING_SYSTEM.md` § 25 applies.

## Reported but not ratified (Ecosystem Review § 21 — recorded for continuity, not locked)

L6 policy/jurisdiction adapter owns all regulatory rules (no hard-coded rules) · L7 "engagement request" terminology, client-initiated only · L8 advocate pricing independent of platform-sourced engagements (partly captured in D-025) · L10 fee quotes block contingent / share-of-proceeds structures. **Founder ratification pending.**

## Current locked list (supersedes the list above dated 20 Sep 2026)

1–11 as before (Dispute Readiness Engine · "What happened?" entry · small-business/FPO commercial hypothesis · consumer sandbox · criminal private sandbox · human decision authority · provenance-first · multi-tenant-ready schema · Supabase/Postgres/RLS · pgvector · deterministic workflow), plus **12** Dispute File platform with professional-review layer (D-019) · **13** reviewer seat (D-020) · **14** communication outline (D-021) · **15** evidence-integrity manifest (D-022) · **16** purpose-bound sharing (D-023) · **17–21** permanent rejections (D-024 – D-028) · **22** India-first, nyayos.global defensive (D-029) · **23** Security + Data spec next (D-030).

**Provisional list unchanged**, plus: typography (Noto stack in code, decision unrecorded); exact reviewer identity fields; consent purpose catalogue.
