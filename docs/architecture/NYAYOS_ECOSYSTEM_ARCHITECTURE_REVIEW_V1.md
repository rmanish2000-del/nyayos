# NYAYOS_ECOSYSTEM_ARCHITECTURE_REVIEW_V1

| Field | Value |
|---|---|
| Project | NyayOS |
| Tool / mode | Claude Chat (Opus, extended thinking) — Product Strategy, Marketplace, Legal-Tech and Ecosystem Architecture |
| Environment | Research and specification only |
| Code / deployment | **None performed. No code written, no repository accessed, no deployment.** |
| Baseline | Canonical NyayOS documents supplied 22 Sep 2026: Master Context V1, Master Product Spec V1, Decision Log V1 (D-001…D-018), Risk Register V1 (R01…R30), Continuity Handoff V1, Lovable Build Brief V1, Figma Brief V2, 90-Day Validation Plan V1, Real-Case Evaluation Protocol V1, Architecture Review, Red Team, MVP Selection, Indian Justice Map |
| Supersedes | The earlier chat draft "NyayOS Ecosystem Architecture Review v1" (written before the canonical documents were supplied). Where the two differ, this file controls. |
| Handoff owner | M365 Copilot (continuity owner) |
| Date | 22 Sep 2026 |

**Evidence grades used on every material claim**

- **[V]** Verified against a primary or official source listed in §25.
- **[R]** Reported by a secondary source; re-verify against the primary before external publication, procurement, or legal implementation.
- **[D]** Draft instrument — published for consultation, not in force.
- **[A]** Assumption / inference by this review.
- **[P]** Strategic recommendation (not law).

**Section map to the founder's 15-section request**

| Founder section | Covered in |
|---|---|
| 1 Executive Summary · 2 Strongest Recommendation | §1 |
| 3 MVP Recommendation | §3, §4 |
| 4 Ecosystem Vision | §2 |
| 5 Product Roadmap | §19 |
| 6 Marketplace Strategy | §12 |
| 7 Advocate Layer | §7, §8, §10, §11 |
| 8 Draft Generation Layer | §5, §6 |
| 9 Trust and Safety · 10 Data Governance | §15 |
| 11 Business Model | §13 |
| 12 Global Expansion | §18 |
| 13 Risks | §20 |
| 14 What To Build Next | §24 |
| 15 Founder Decision Recommendations | §21, §22 |

---

## 1. Executive recommendation

### 1.1 Answer to the framing question

- **A. Is the current MVP correct?** Mostly yes. The Dispute Readiness Engine, the "What happened?" entry, provenance-first design, deterministic workflow with bounded AI tasks, multi-tenant schema, and the small-business/FPO commercial-dispute wedge (D-001, D-003, D-008, D-011) are the right foundations. This review does **not** reopen them.
- **B. Is it missing critical components?** Yes — four, all small:
  1. **A reviewer seat** — the advocate the client *already has or chooses* needs a scoped, revocable, read-and-comment view of the Dispute File, with structured feedback flowing back. Without it, "human review" is an export email, and the advocate-side value (and the evidence for the 90-day Gate on "human reviewers find exports useful") cannot be measured.
  2. **A communication outline** — for vendor/payment disputes the user's next real act is a letter. The MVP should produce a Tier-0 *outline* (facts to state, documents to attach, what is being asked, questions for the advocate) — not a finished notice.
  3. **Evidence integrity manifest** — cryptographic hash + ingest timestamp per original, carried into every export. The canonical design already keeps originals immutable; hashing is the missing half.
  4. **Purpose-scoped consent on every share** — the canonical `dispute_shares` and `consents` tables exist; the MVP must bind each share to an enumerated purpose, a scope, and an expiry.
- **C. Must future features be architected now?** Yes — as *interfaces and policy flags*, not tables and screens: the Draft workspace review-gate model, the Professional registry identity (who a reviewer is), the Jurisdiction/Policy adapter (regulatory-mode flags), the Consent purpose catalogue, and the Engagement state machine. Building these later without a slot for them would force a Dispute File schema migration — the most expensive change in this system.

### 1.2 Strongest recommendation

> **NyayOS should be the trusted system of record for a dispute before and around professional engagement — a Dispute File platform with a professional-review layer — and it should permanently refuse to become a lawyer-advertising marketplace in India.**

Why this is the strongest position:

1. **The law points there.** Advocates may not solicit or advertise directly or indirectly, including through touts **[V S1]**; the Bar Council of India directed State Bar Councils in July 2024 to issue cease-and-desist notices to online platforms following the Madras High Court's judgment in WP Nos. 31281 and 31428 of 2019 **[V S1]**. A ranked, reviewed, pay-to-appear lawyer marketplace is on the wrong side of an active enforcement trend.
2. **The fee rules close the obvious business models.** Advocates may not stipulate a fee contingent on results or share proceeds (Rule 20), may not traffic in actionable claims (Rule 21), and may not let their services or name be used in aid of unauthorised practice by any agency (Rule 37) **[V S2]**. Lead fees, success fees and revenue-share on engagements are therefore rejected (§13).
3. **The record compounds; the listing does not.** A structured, provenance-carrying Dispute File gets more valuable as the dispute ages and as more professionals touch it. A directory is replicable and commoditised.
4. **It is what the best institutions are converging on.** The Supreme Court's AI Committee draft regulations centre human primacy and exclude algorithmic determination of outcomes and bail/recidivism risk scoring **[D S6]** — aligned exactly with NyayOS's locked "human decision authority" doctrine.

### 1.3 What NyayOS ultimately becomes (10-year statement) [P]

The place where an Indian dispute is **first structured, its evidence preserved, resolution attempted, and professionals engaged on a complete file** — with connectors to mediation, legal aid and courts rather than competing with them. Measured by: time-to-informed-decision for dispute owners, advocate time-to-understand-matter, and share of disputes resolved before formal proceedings.

### 1.4 One-screen decisions

| Question | Answer |
|---|---|
| What do we build first? | Dispute Readiness Engine + four MVP additions in §1.1 B |
| What do we architect now? | Review gates, professional identity, policy/jurisdiction adapter, consent catalogue, engagement state machine |
| What do we defer? | Draft generation beyond outlines (Phase 2), organisation advocate panels (Phase 2), matching/directory (Phase 3, legal-opinion gated), mediation module (Phase 3), payments and integrations (Phase 4) |
| What do we reject permanently? | Lead fees, success fees, paid placement, public star ratings, win rates, "best lawyer" rankings, autonomous sending/filing, criminal-defence public product, training on private files without separate consent |
| How do clients and advocates interact? | Client-initiated, consented, scoped, revocable sharing of a Dispute File to an advocate the client chooses; advocate reviews and comments; engagement terms are agreed between them |
| Which advocate metrics are trustworthy? | Enrolment status, years since enrolment, declared practice areas/forums/languages, availability — nothing outcome-based (§10) |
| How are AI drafts professionally controlled? | Tiered review gates; no AI output is ever sent, signed or filed by NyayOS; court documents only inside an advocate-controlled workspace (§5–6) |
| Responsible revenue? | Dispute-file fee, organisation subscription, advocate SaaS (flat), enterprise/institutional licences (§13) |
| nyayos.global? | Register defensively; stay India-first under NyayOS; build jurisdiction adapters, not a global product (§18) |

---

## 2. Founder vision translated into product architecture

| # | Founder vision item | Architectural translation | Classification |
|---|---|---|---|
| 1 | Dispute Readiness | Workflow engine over the Dispute File (INTAKE → EXTRACT → CONFIRM → TIMELINE → EVIDENCE_MAP → ISSUE → RETRIEVE → ACTION_PLAN → EXPORT) | **MVP required** |
| 2 | AI-assisted professional-ready case files | Export profiles of the Dispute File (brief, chronology, evidence index, issues, gaps) with status/provenance on every item | **MVP required** |
| 3 | Advocate lead generation | Re-framed as a **client-initiated engagement request** with no per-request fee | Lead-*fee* model **Reject permanently**; engagement request **Architect now, build Phase 3** |
| 4 | Advocate discovery and matching | Eligibility filter + client choice, with explanation; organisation panels first, public directory only after legal opinion | **Architect now, build later** |
| 5 | Draft preparation support | Draft workspace with tiered review gates | Tier 0 outlines **MVP**; Tier 1 **Phase 2**; Tier 2 **Phase 3** |
| 6 | Human-reviewed legal workflows | Review gate abstraction + reviewer seat | Reviewer seat **MVP**; gate engine **Architect now** |
| 7 | Mediation / dispute-resolution ecosystem | "Neutral" role + mediation-ready export; partner connectors | **Architect now, build Phase 3** |
| 8 | Professional marketplace | Not as a ratings/placement marketplace in India | Ratings marketplace **Reject permanently**; compliant directory **Defer (legal-opinion gated)** |
| 9 | Institutional integrations | Published Dispute File schema + integration gateway (NALSA/DLSA routing, ODR providers, eCourts context) | **Architect now, build Phase 3–4** |
| 10 | Global justice-preparation platform | Jurisdiction packs + policy adapters; India only until PMF | **Architect now, build Phase 4+** |

---

## 3. Current MVP assessment

### 3.1 What is right and stays locked (from Decision Log)

Dispute Readiness Engine (D-001) · drop "OS" positioning (D-002) · small-business/FPO/professional commercial wedge (D-003, provisional) · consumer sandbox (D-004) · criminal case private only (D-005) · deterministic workflow (D-008) · Supabase/Postgres/RLS (D-009) · pgvector subject to benchmark (D-010) · multi-tenant schema (D-011) · case/authority corpus separation (D-012) · integrate eCourts, route to NALSA, ODR-ready data model (D-013…D-015) · no private-case training (D-017) · one-time dispute preparation fee tested first (D-018).

### 3.2 First-principles challenge

| Assumption | Challenge | Verdict |
|---|---|---|
| "Readiness" is the product | Readiness is a state, not an artifact. Users pay for artifacts and outcomes. | Keep the name; the *artifact* (Dispute File + exports) is what is priced |
| Export = human review | An emailed PDF gives no feedback loop and no measurement of advocate value | **Add reviewer seat** |
| Possible paths → action plan ends the journey | For commercial disputes the next act is a written communication; stopping at "write a letter" loses the user at the moment of highest intent | **Add Tier-0 communication outline**; full drafts Phase 2 |
| Advocates are the demand amplifier | Advocate acquisition via platform is legally constrained (§14) | Client-brings-advocate + organisation panels first |
| The marketplace is the long-term business | A compliant Indian directory cannot rank, review publicly, or charge placement — it is a thin business | Platform value = records + workflow + institutional connectors |
| Global requires one product | Only record/readiness semantics generalise; law and professional regulation never do | Adapters, not a global product |

### 3.3 Gaps against the founder's worry ("too narrow")

The MVP is **not too narrow in scope**; it is **under-connected at its two ends** — the professional on the far side of the export, and the letter the user must send next. Fixing those two ends (reviewer seat, communication outline) addresses the worry without adding a marketplace.

---

## 4. Recommended MVP boundary

### 4.1 Inside the MVP

1. Canonical Dispute Readiness journey (Master Context §5, Figma Brief V2 screens 1–17).
2. Evidence locker with immutable originals **plus SHA-256 hash and server ingest timestamp per original**, and a hash manifest in every export [P]. (Supports later preparation of an electronic-record certificate; statutory requirement to be verified against India Code before relying on it in copy — see §23.)
3. Tier-0 outputs (§5): advocate-ready brief, chronology, evidence index, issues list, missing-document list, **communication outline**.
4. **Reviewer seat**: the dispute owner invites a named professional by email/phone; reviewer sees only the shared scope; can comment per item (fact, event, evidence relation, gap) and mark "reviewed"; comments never mutate canonical facts — they become suggestions the owner accepts or rejects.
5. Reviewer self-declaration at invite acceptance: name, enrolment number, State Bar Council. Display "Self-declared — not verified by NyayOS" [P]. No listing, no discovery, no public profile.
6. Consent-bound sharing: purpose, scope, expiry, revoke, access list visible to owner (Figma §17).
7. Export, correct, delete, retention categories (canonical Lovable Brief §11).
8. Append-only audit (canonical §10) extended with share-purpose and reviewer-comment events.

### 4.2 Explicitly outside the MVP

- Any Tier-1 or Tier-2 draft (notice, response, representation, complaint, application).
- Advocate directory, search, matching, profiles, verification badges.
- Reviews, ratings, feedback publication.
- Payments between client and advocate; fee quotations.
- Mediation module, neutrals, ODR connectors.
- Court filing, e-filing, eCourts ingestion (D-013).
- Autonomous sending, emailing, scheduling on behalf of users.
- Generalised agent / arbitrary tools (Lovable Brief §3–4).
- Criminal-matter public features (D-005).
- Any second jurisdiction, any non-India launch.
- Public consumer launch (D-004 sandbox only).

### 4.3 Why the four additions do not violate "one feature"

All four are properties of the same Dispute File (who can see it, what integrity it carries, what it exports). None introduces a new actor type that can act without the owner.

---

## 5. Advocate-ready outputs

### 5.1 Output tiers

| Tier | Meaning |
|---|---|
| **T0 Organisational** | Arranges the user's own information; no legal conclusion; statuses visible |
| **T1 Correspondence** | Pre-litigation letters and representations a party may send in their own name; carries legal-procedural content |
| **T2 Formal proceeding** | Documents presented to a court, tribunal or statutory commission |
| **T3 Prohibited** | Never generated |

### 5.2 Output control matrix

| Output | Tier / phase | Initiates | Reviews | Approves | Signs / submits | Mandatory disclaimer | Prohibited automation | Audit requirements |
|---|---|---|---|---|---|---|---|---|
| Advocate-ready case brief | T0 / **MVP** | Dispute owner | Owner confirms every fact; optional invited reviewer comments | Owner | Nobody signs; owner shares | "Organised from your statements and documents with AI assistance. Not legal advice. Each item shows its source and status." | Merits assessment, outcome prediction, guilt/innocence, auto-sharing, silent fact change | ai_run id, model id, pack version, export version, export hash, share events |
| Chronology | T0 / **MVP** | Owner | Owner (date precision states) | Owner | — | Same + "Inferred dates are marked inferred." | Inventing or harmonising dates (Eval Protocol §7) | per-event source link; correction log |
| Evidence index | T0 / **MVP** | Owner | Owner | Owner | — | Same + hash manifest note | Editing originals; "enhancing" evidence | hash, ingest time, custody log per item |
| Issues list | T0 / **MVP** | Owner | Owner; reviewer comments | Owner | — | "A classification to help organise the file, not a legal determination." (Figma §11) | Ranking issues by win probability | classification alternatives + confidence stored |
| Missing-document list | T0 / **MVP** | System proposes; owner accepts | Owner | Owner | — | "Not found in the supplied records" semantics (Eval Protocol §12) | Inferring non-occurrence | gap → related document link |
| **Communication outline** | T0 / **MVP** | Owner | Owner; reviewer | Owner | — (outline is not sendable) | "An outline of points to discuss with your advocate or to prepare a letter. Not a notice." | Rendering as a sendable letter; adding statutory language | same as brief |
| Draft notice (payment demand, breach, statutory notice) | T1 / **Phase 2A** (reviewer-in-loop only), **2B** self-help subset | Owner or engaged advocate | Engaged advocate **mandatory** in 2A; in 2B mandatory for any notice that is a statutory precondition (list maintained in jurisdiction pack) | The sender (owner for own-name letter; advocate for letterhead notice) | Human sender only, outside NyayOS | "Draft prepared with AI assistance from your file. Review before sending. NyayOS does not send this." + reviewer status line | Sending, emailing, dating, signing, inserting unverified deadlines or citations | versioned drafts, diff per version, approver identity, approval hash, citation-resolution report |
| Draft response (reply to notice/demand) | T1 / Phase 2A→2B | Owner or advocate | As above | Sender | Human sender only | As above | Admissions not in user-confirmed facts; auto-reply | As above + link to incoming notice evidence item |
| Draft representation (to a government body / utility / nodal agency) | T1 / Phase 2A→2B | Owner or advocate | As above | Sender | Human sender only | As above | Submitting to portals; fabricating reference numbers | As above |
| Draft complaint — consumer commission / regulator / ombudsman | T1 / Phase 2B (consumer sandbox first) | Owner | Advocate recommended; mandatory where pack flags | Complainant | Complainant files; NyayOS never files | As above + "Filing requirements are set by the forum." | e-filing, fee payment, limitation assertions without verified source | As above |
| Draft complaint — criminal (police / magistrate) | **T3 in public product** | — | — | — | — | — | Entire output (D-005) | — |
| Draft application / pleading (court, tribunal, commission) | T2 / **Phase 3**, advocate workspace only | Engaged advocate | Advocate | Advocate | Advocate signs and files under own name | Internal AI-use record retained for the advocate's disclosure obligations under any court rules in force [D S6] | Client-facing generation; auto-file; AI marking a version "final" | full version chain; approving advocate enrolment id; source bundle |

### 5.3 Global prohibited automations (all tiers)

Autonomous send · autonomous file · autonomous sign · auto-approve · fabricated facts, citations, deadlines, reference numbers · outcome/win probability · bail or risk scoring **[D S6 aligns]** · resolving contradictions (R05) · choosing an advocate for the user · treating document text as instructions (R06).

---

## 6. AI-assisted legal drafting model

### 6.1 Principle
Drafts are **renderings of confirmed Dispute File content through a jurisdiction-pack template**, not free generation. The model fills structured slots; it does not author facts.

### 6.2 Draft pipeline [P]

```
Confirmed facts + selected evidence + user intent
        ↓
Template select (jurisdiction pack, versioned, effective-dated)
        ↓
Authority retrieval (authority corpus only; D-012)
        ↓
Bounded model task: fill slots (schema-validated)
        ↓
Validators:
  - every factual sentence → source fact id (else flagged)
  - every legal citation → resolves in pack registry (else BLOCK)
  - every deadline → verified-deadline gate (else "No verified deadline")
  - prohibited-content scan (admissions, threats, outcome claims)
        ↓
Draft vN (status: AI_DRAFT)
        ↓
Review gate (per pack rule: owner | advocate | both)
        ↓
APPROVED_vN (hash frozen) → export only
```

### 6.3 Review-gate model — architect now

Each draft type declares in the jurisdiction pack: `tier`, `required_approver_roles[]`, `statutory_precondition: bool`, `self_help_allowed: bool`, `ai_disclosure_required: bool`. The workflow engine enforces; UI reads. Changing policy = pack release, not code change.

### 6.4 Why self-help drafting waits for Phase 2B
- The Advocates Act reserves practice before courts and authorities to enrolled advocates (s.33) with a penal provision for illegal practice (s.45) **[V S3]**; courts have treated non-litigious advice as within the regulated field **[R S10]**. A software tool rendering a party's own letter is materially different from a person practising law, but the line is untested for AI tools **[A]**. Phase 2A (advocate in the loop) produces the evidence (error rates, reviewer edit distance) needed before any self-help release.
- Gate to 2B: zero unsupported high-impact claims and 100% citation validity on the gold set (Eval Protocol §17) **and** written advice from a practising advocate on the self-help boundary.

---

## 7. Advocate onboarding and verification

| Field | Source | Verification | Phase | Visibility |
|---|---|---|---|---|
| Legal name | Advocate | Matches enrolment document and ID | MVP (self-declared), Phase 3 (verified) | To clients they engage with |
| Enrolment number, State Bar Council, enrolment date | Advocate | Document upload (enrolment certificate / certificate of practice) + check against State Bar Council roll where accessible; periodic re-check | MVP self-declared; **Phase 3 verified** | Status only ("Enrolment verified on DD-MM-YYYY") |
| Identity | Advocate | Government-ID-based KYC through a licensed provider; store verification result, not the ID number | Phase 3 | Never public |
| Practice areas | Self-declared, capped list from pack taxonomy | None (declaration) | Phase 2 (panels), 3 | Shown as "declared" |
| Languages | Self-declared | Optional | Phase 2 | Shown |
| Jurisdictions / forums | Self-declared | Optional spot-check | Phase 2 | Shown |
| Office location, service radius, consultation modes | Self-declared | Address proof optional | Phase 3 | Area-level only |
| Experience | Derived from enrolment date | Derived | Phase 3 | "Years since enrolment" only |
| Availability / accepting new matters | Advocate toggle | Auto-pause if requests expire unanswered | Phase 3 | Shown |
| Consultation fee | Advocate | None | Phase 3 | **Private — disclosed inside an engagement request only** |
| Indicative matter-fee ranges by matter type | Advocate | None | Phase 3 | **Private — disclosed inside an engagement request only** |
| Conflicts list | Advocate's own practice | NyayOS does not hold it unless the advocate uses the workspace | Phase 3 | Never |
| Response time, acceptance rate | System-measured | — | Phase 3 | Private to advocate; internal quality gate |
| Disciplinary status | Bar Council records if accessible | Re-check on schedule; suspension → auto-disable | Phase 3 | Status "Active / Not active" only |

**Rules.** No "Verified" mark until document + roll check pass. No self-declared "specialist" claims (Rule 36 restricts indicating specialisation on sign-boards/stationery) **[V S2]**. Any public page shows only particulars within the BCI-approved website-information schedule (2008 amendment to Rule 36) **[R — verify schedule text against the BCI Rules gazette]**.

---

## 8. Matching architecture

### 8.1 Posture
Matching is an **eligibility filter plus client choice**, not a ranking of lawyers. Built in two stages:

- **Phase 2 — organisation panels.** An organisation tenant (FPO, company, cooperative) maintains its own list of advocates it already uses. NyayOS helps the organisation route a dispute to one of *its* advocates. This is procurement tooling for the client, not advertising for the advocate **[A — confirm in legal opinion]**.
- **Phase 3 — public directory**, only if the legal opinion in §23 clears it.

### 8.2 Inputs

| Client (all optional except issue + location) | Advocate |
|---|---|
| Issue category (from Dispute File) · location · language · urgency · desired assistance (review / consultation / representation) · approximate budget band (private) · consultation mode | Declared practice areas · forums/jurisdictions · location + radius · languages · availability · consultation fee (private) · indicative ranges (private) · matter types accepted |

### 8.3 Algorithm [P]

1. **Hard filters**: active verified enrolment; accepting new matters; practice area ∩ issue category; forum/jurisdiction fit; language; mode.
2. **Conflict gate** (§11.3).
3. **Optional client filter**: budget band overlaps advocate's private consultation fee — computed server-side; neither party sees the other's number until the request is sent.
4. **Ordering among eligible**: by distance (if client chose in-person) else **rotating fair order** (seeded per request) to avoid rich-get-richer lock-in. **No quality score.**
5. **Explanation** on every card: "Shown because: declares <practice area>, practises in <forum>, speaks <language>, accepting new matters."
6. **Client selects** up to N (pack parameter, default 3). NyayOS never auto-assigns.

### 8.4 Safeguards

| Safeguard | Rule |
|---|---|
| Consent | Client consents to send the *request summary* (issue category, location, urgency, mode) — not the Dispute File — to selected advocates |
| Non-discrimination | No use of advocate or client protected attributes; no inferred attributes; no demographic filters. Client-requested advocate-gender preference in specific matter types is an **open legal question** (§23) — not built |
| Paid placement | **Prohibited** — no boosts, sponsorship, featured slots, or fee-dependent ordering |
| Ranking | No "top", "best", badges, scores |
| Human override | Client can bypass matching and invite any advocate by contact (MVP path always available) |
| Audit | Store filter set, eligible set size, seed, displayed order, selection — reproducible |
| Transparency page | Publish the ordering method in plain language |

---

## 9. Fee and budget workflow

1. Client declares an approximate budget band (private; optional).
2. Advocate stores private consultation fee and indicative ranges per matter type.
3. On an engagement request, the advocate may issue a **written fee quote** from a template: scope, stages, fixed/stage fee, expenses, payment timing, what is excluded.
4. **Template enforcement**: fee structures that are contingent on result or a share of proceeds are blocked by the template, citing Rule 20 **[V S2]**.
5. Client accepts, negotiates off-template, or declines. NyayOS records the accepted quote as an engagement term, not as its own contract.
6. **Payment**: Phase 2–3 — off-platform, directly client → advocate. Phase 4 "payment readiness" only if structured so the advocate's fee settles to the advocate with **no platform deduction**; any NyayOS fee is billed separately to whoever owes it [P]. Payment-aggregator regulatory posture is a research gap (§23).
7. Public display of fees: **not in India** (outside the approved particulars) **[R/A]**.

---

## 10. Reputation and feedback framework

### 10.1 Metric classification

| Metric | Public | Private to advocate | Internal only | Prohibit | Reason |
|---|:-:|:-:|:-:|:-:|---|
| Verified enrolment status | ✔ | ✔ | ✔ | | Protective, factual, within permitted particulars |
| Years since enrolment | ✔ | ✔ | | | Derived fact; not a skill claim |
| Declared practice experience (areas) | ✔ (as "declared") | ✔ | | | Permitted particular; labelled as declaration |
| Response time | | ✔ | ✔ | | Comparative display becomes a ranking; strong quality signal internally (auto-pause) |
| Lead / request acceptance rate | | ✔ | ✔ | | Low acceptance may reflect correct conflict/fit declines; public display punishes ethics |
| Consultation completion | | ✔ | ✔ | | Depends on client behaviour too |
| Client feedback (structured) | | ✔ (aggregated, anonymised, min-n) | ✔ | | See §10.2; public testimonials are high-risk under Rule 36 |
| Communication quality | | ✔ | ✔ | | Subjective; useful for coaching |
| Document-review timeliness | | ✔ | ✔ | | Operational; measurable inside workspace |
| Repeat engagement | | ✔ | ✔ | | Confounded by matter type |
| Complaint history (NyayOS-internal) | | ✔ (their own) | ✔ | | Unadjudicated; publishing = defamation risk |
| Bar Council disciplinary outcome | ✔ only as enrolment "Active/Not active" | | ✔ | | Official status only; never narrative |
| Resolved matters | | | | ✔ | Unverifiable; outcome not attributable to advocate |
| Settlements | | | | ✔ | Confidentiality; mediation confidentiality; incentive distortion |
| Cases disposed | | | | ✔ | Disposal includes withdrawals, dismissals-in-default — meaningless as quality |
| Win rate | | | | ✔ | Selection bias, non-comparable matters, encourages cherry-picking, solicitation-in-substance |
| Success percentage | | | | ✔ | Same as win rate |
| Star rating | | | | ✔ | Gameable, defamation exposure, reads as advertising; incompatible with Rule 36 posture |

**Core position.** Court outcomes are not reliably attributable to advocate performance: they depend on facts, evidence, forum, bench, opposing counsel, delay, and client choices **[A]**. Any metric built on outcomes is statistically invalid and ethically corrosive.

### 10.2 Feedback design (private, Phase 3)

- **Verified engagement requirement**: only an engagement that reached ENGAGED or CONSULTED state can produce feedback.
- **Structured questions only** (no free-text publication): Was the scope explained? Was the fee quote clear? Were documents reviewed when promised? Were you kept informed? Would you consult again for a similar matter? (5-point + optional private note).
- **Moderation**: automated PII scrub; human moderation of private notes; aligned with IS 19000:2022 principles (integrity, accuracy, privacy, security, transparency, accessibility, responsiveness) — a voluntary standard **[V S7]**.
- **Right to respond**: advocate sees aggregated feedback and may respond privately to NyayOS; no public exchange.
- **Appeal and correction**: advocate can contest a feedback item; decision logged; overturned items removed from aggregates.
- **Fake-review controls**: engagement-bound tokens, one feedback per engagement, anomaly detection on timing/device clusters, no incentives for feedback.
- **Privacy**: min-n = 5 before any aggregate is shown even privately; no matter details.
- **Publication criteria**: none in India. Revisit only if BCI rules change.
- **Retention**: feedback retained for the life of the professional account + policy window; deleted on account deletion except where needed for an open complaint.
- **Complaint escalation**: serious conduct concerns → NyayOS trust team → client informed of the State Bar Council complaint route under the Advocates Act (misconduct proceedings, s.35) **[V S3]**; NyayOS does not adjudicate misconduct.

---

## 11. Lead and engagement lifecycle

### 11.1 Terminology
Use **"engagement request"**, never "lead", in product, contracts and copy [P]. The object is initiated by the client; the advocate does not pay to receive it.

### 11.2 State machine [P — architect now, build Phase 2 panels / Phase 3 directory]

```
REQUEST_DRAFT (client)
  → CLIENT_CONSENTED (purpose: engagement_request; scope: summary)
  → SENT (to ≤ N advocates chosen by client)
  → VIEWED
  → CONFLICT_CHECK (§11.3)
  → ACCEPTED | DECLINED(reason code) | EXPIRED(SLA)
ACCEPTED
  → FILE_SHARED (client grants Dispute File scope; separate consent)
  → CONSULTATION_SCHEDULED → CONSULTED
  → FEE_QUOTED → ENGAGED | NOT_ENGAGED
ENGAGED
  → ACTIVE (workspace; drafts under gates)
  → CLOSED(reason: resolved | withdrawn | transferred | referred | completed_scope)
  → FEEDBACK_WINDOW → ARCHIVED
Any state → REVOKED_BY_CLIENT (access removed immediately; audit)
```

### 11.3 Conflict checks
- Step 1 — client consents to a **conflict-check disclosure**: opposing-party names only.
- Step 2 — advocate checks against their own records and confirms "no conflict" (attestation logged).
- Step 3 — NyayOS internal check: if the same advocate is already shared on a Dispute File where the opposing party is this client (entity match on the party graph), **block** and notify neither party of the other's details.
- The full Dispute File is shared only after ACCEPTED + separate consent.

### 11.4 Response-time handling
Configurable SLA per urgency; expiry auto-releases the client to choose another advocate; repeated expiry auto-pauses the advocate's availability (internal only).

---

## 12. Marketplace strategy

**Should a marketplace exist?** Not as a two-sided, ranked, reviewed, pay-to-appear marketplace in India — **reject permanently**. A **compliant professional-access layer** may exist, in this order:

| Stage | What | When | Condition |
|---|---|---|---|
| 1 | Client brings own advocate (reviewer seat) | MVP | — |
| 2 | Organisation panels (client's own advocates) | Phase 2 | Legal opinion on panel model; enterprise pilots |
| 3 | Institutional routing (NALSA/DLSA legal aid, bar-association legal-aid clinics) | Phase 3 | Partnership; NyayOS routes, does not replace (D-014) |
| 4 | Public verified directory (particulars-only, eligibility + client choice) | Phase 3 at earliest | Written legal opinion; ideally BCI/State Bar Council engagement; zero paid placement |
| 5 | Mediation providers / ODR partners (case routing, not lawyer routing) | Phase 3 | Mediation Act framework and partner accreditation |

**Risks if built as a conventional marketplace:** BCI/State Bar Council action against NyayOS and listed advocates **[V S1 trend]**; characterisation as a tout (Rule 36) or as aiding unauthorised practice (Rule 37) **[V S2]**; defamation claims from reviews; supply-side flight; review gaming; two-sided cold start draining a solo-founder budget.

**Why not early:** the MVP must first prove the Dispute File is useful to reviewers (90-Day Plan Gate on reviewer usefulness). A directory before that proof is marketing without a product.

---

## 13. Revenue architecture

| Model | Classification | Rationale |
|---|---|---|
| Dispute-file fee (one-time, client) | **Preferred** | Discrete artifact; canonical D-018 first test |
| Client subscription — organisation workspace (FPO/company) | **Preferred** | Matches D-007 business payer hypothesis; recurring disputes |
| Client subscription — individual | Possible subject to validation | Weak WTP evidence (R13, R14) |
| Advocate SaaS subscription (flat; workspace, review tools, draft gates) | **Preferred** — Phase 2+ | Pays for tools, not for clients; must not vary with platform-sourced engagements |
| Workflow fee (per-matter workspace, paid by client) | Possible subject to legal review | Fine if client-paid; if advocate-paid per platform-sourced matter it converges on a lead fee |
| Listing fee | **High-risk** | Paid visibility reads as advertising through an agency (Rule 36) |
| Lead fee (per request / per contact) | **Reject** | Indirect solicitation via a paid intermediary; tout risk (Rule 36); aiding practice by a lay agency (Rule 37) |
| Success fee (% of recovery or contingent on outcome) | **Reject** | Rule 20 prohibits contingent fees / sharing proceeds for advocates **[V S2]**; a platform success fee tied to an advocate's engagement invites the same characterisation; misaligned incentives |
| Enterprise licence (legal/ops teams, corporates) | **Preferred** — Phase 3 | Clear payer; no advocate economics |
| Institutional partnership fee (legal aid bodies, ODR providers, grievance cells, federations) | **Preferred / possible subject to procurement rules** | Aligns with integrate-not-compete (D-013–D-015) |
| Advertising, data sale | **Reject** | Trust; DPDP purpose limitation |

---

## 14. Legal and professional-conduct constraints

**Verified law [V]**

1. Only advocates enrolled under the Advocates Act are entitled to practise in courts and before authorities (s.33); illegal practice is punishable (s.45); advocates are liable to disciplinary action for misconduct (s.35); BCI conduct rules are framed under s.49 **[V S3]**.
2. Rule 36 (Part VI, Ch. II): no soliciting or advertising, directly or indirectly, whether by circulars, advertisements, touts, personal communications or interviews not warranted by personal relations **[V S1, S2]**.
3. BCI press release of 8 July 2024, following Madras HC WP Nos. 31281 and 31428 of 2019, directed State Bar Councils to act, including cease-and-desist notices to online platforms **[V S1]**.
4. Rule 20: no fee contingent on results, no share of proceeds; Rule 21: no share or interest in actionable claims; Rule 37: services or name must not aid unauthorised practice by any agency **[V S2]**.
5. Rule 17: advocates must not breach professional-communication privilege (now carried in BSA 2023) **[V S2; BSA mapping to verify, §23]**.
6. Mediation Act 2023: parties may voluntarily opt for pre-litigation mediation in civil/commercial matters (s.5); online mediation with written consent, with integrity and confidentiality safeguards (s.30) **[V S4 — commencement status of each section to verify]**.
7. DPDP Act 2023 and Rules 2025: phased commencement from November 2025, consent-manager provisions around November 2026, substantive fiduciary obligations around May 2027 **[R S5 — dates from secondary sources; verify against G.S.R. 846(E)]**.
8. Supreme Court draft AI regulations (3 June 2026, comments closed 20 June 2026): human primacy; no algorithmic outcome determination; no bail/recidivism risk scoring **[D S6]**.

**Strategic reading [P]**

- NyayOS's safe harbour is to be a **tool used by the dispute owner and by advocates**, never an agency that procures clients for advocates or practises on its own account.
- Every advocate-facing commercial mechanism must pass one test: *does the advocate's payment to NyayOS rise with the number of clients NyayOS sends them?* If yes → reject.
- Copy review (R26, R28) is a compliance control, not marketing polish: no "find the best lawyer", "top-rated", "win".

---

## 15. Privacy and data governance

### 15.1 Controls

| Control | Specification [P] |
|---|---|
| Client consent | Purpose catalogue: `storage`, `extraction`, `ai_assistance`, `share_reviewer`, `engagement_request`, `conflict_check`, `share_neutral`, `export`, `aggregate_analytics`, `model_improvement` (off by default; separate explicit consent; D-017) |
| Advocate consent | Registry processing, verification, private metrics, feedback collection |
| Matter-level sharing | Grant = (dispute, grantee, role, scope[fields/items], purpose, expiry); RLS enforces |
| Revocation | Immediate; signed URLs invalidated; reviewer caches cleared; audit event |
| Purpose limitation | Every read path declares purpose; mismatched purpose → deny |
| Data minimisation | Engagement request carries summary only; conflict check carries opposing names only |
| Correction | User corrections are first-class objects (canonical `user_corrections`); AI never overwrites |
| Deletion | Cryptographic erasure via per-dispute keys; deletion verification (Eval Protocol §15; R18) |
| Retention | Separate categories — case content, audit, operational logs, backups (Lovable Brief §11); exact periods pending counsel (D-016) |
| Legal hold | Only on request of the owner or the owner's engaged advocate, or on lawful order; visible to owner |
| Conflict checks | §11.3; party-graph matching inside tenant boundary with privacy-preserving comparison where cross-tenant |
| Encryption | In transit and at rest; per-dispute data keys for originals |
| Tenant isolation | RLS on every tenant table; explicit grants; zero cross-tenant leakage gate (R02) |
| Audit logs | Canonical §10 + share purpose, reviewer comment, engagement transitions, fee-quote events; no document content |
| Model-provider restrictions | Contractual no-training and minimal retention; prefer India-region processing; redact before send where the task allows (R21) |
| Private-file training | Prohibited without separate explicit consent **and** founder + legal authorisation (D-017) |
| Privilege partition | Advocate work product stored in an advocate-controlled partition; client told plainly that their own notes to NyayOS are not an advocate communication [P] |
| Vulnerable-user routing | Family violence, threats, minors → human help and NALSA legal aid routing, not drafting (D-014) |

### 15.2 Evidence integrity
Original immutable · SHA-256 + server timestamp at ingest · custody log (upload, view, share, export) · annotations separate · export manifest with hashes · NyayOS never alters evidence.

---

## 16. Functional architecture

| Module | Responsibility | Phase | Build now? |
|---|---|---|---|
| Client workspace | Tenant, members, disputes list | MVP | Build |
| Dispute File | Canonical record (facts, parties, events, evidence relations, issues, gaps, paths, actions) | MVP | Build |
| Draft workspace | Draft objects, versions, gates | T0 MVP / T1 P2 / T2 P3 | Build T0 outline; **architect** gate model |
| Advocate registry | Professional identity separate from user identity | Self-declared MVP; full P3 | **Architect** (reviewer identity fields only) |
| Advocate verification | Document + roll checks, re-verification | P3 | Architect |
| Matching | Eligibility + client choice | P2 panels / P3 | Architect |
| Lead lifecycle → Engagement | State machine §11 | P2/P3 | Architect |
| Fee quotation | Templates with prohibited structures | P3 | Defer |
| Review & reputation | Private feedback | P3 | Defer |
| Communication | Comment threads on items; later messaging | Comments MVP | Build comments only |
| Consent & sharing | Purpose-bound grants | MVP | Build |
| Payment readiness | Client billing for NyayOS fees; no advocate-fee intermediation | P2 client billing / P4 | Defer |
| Audit & governance | Append-only events, policy decisions | MVP | Build |
| Institutional integrations | Schema export, routing connectors | P3–P4 | Architect (schema publication) |
| Jurisdiction & localisation | Packs + policy flags | MVP (India-MP pack) | Build minimal |

---

## 17. Technical domain architecture

Consistent with canonical choices (TanStack Start, Supabase Postgres/Auth/Storage/RLS, pgvector, server-side AI gateway, deterministic workflow). **Modular monolith**; no microservices.

### 17.1 Bounded contexts (Postgres schemas)

```
identity      users, tenants, tenant_memberships, roles
dispute       disputes, parties, entities, events, date_assertions, propositions,
              issues, possible_paths, actions, missing_evidence, contradictions
evidence      documents (immutable), document_versions, document_locations,
              document_chunks, evidence_items, evidence_relations,
              integrity_manifest (hash, ingest_ts, custody events)
authority     sources, source_versions, citation_registry          (separate trust bucket, D-012)
workflow      workflow_instances, transitions, ai_runs, validations
drafts        drafts, draft_versions, review_gates, approvals        (T0 now; schema ready for T1/T2)
sharing       consents, grants(purpose, scope, expiry), revocations
review        reviewer_comments, suggestions, human_reviews
professional  professional_profiles (reviewer identity: name, enrolment_no, bar_council,
              verification_status='self_declared')                   (P3 adds verification, availability)
engagement    [reserved] engagement_requests, conflict_checks, fee_quotes   (P2/P3)
feedback      [reserved]                                              (P3)
policy        jurisdiction_packs, pack_versions, policy_flags, templates
audit         audit_events (append-only)
export        exports (version, hash, profile)
```

`[reserved]` = interface and IDs defined in docs; **no tables created until the phase starts** (YAGNI). Everything else in MVP.

### 17.2 Cross-cutting rules
- Modules communicate through server functions + an **outbox of domain events** (e.g., `grant.created`, `draft.approved`), which also feeds audit.
- The **policy module** answers every "is this allowed here?" question (show fee? self-help allowed? max advocates per request? review required?) from the active jurisdiction pack. UI and workflow never hard-code regulatory rules.
- AI calls only through the gateway, only as bounded tasks declared per workflow state; prompts live in pack versions.
- Every output row stores `pack_version`, `model_id`, `ai_run_id` for reproducibility (R22).

---

## 18. Global architecture and nyayos.global

### 18.1 Recommendation [P]
- **Brand:** India-first, **NyayOS**. "Nyaya" carries meaning in India; globally it is a neutral name, which is fine for infrastructure but not a reason to go global.
- **Domain strategy:** operate the product on an India-facing primary domain; **register nyayos.global defensively** and park it (or point to a neutral corporate page). Availability/ownership of candidate domains is unverified here (§23). Do not publish a "global" product before India Phase 3 exit criteria.
- **India-first product boundary:** Indian law, Indian forums, Indian professional regulation, India data residency, Hindi + English first.

### 18.2 What generalises
Dispute File schema · provenance/status model · evidence integrity · consent/grant model · workflow engine · review-gate engine · audit.

### 18.3 What is jurisdiction-specific (adapters)
| Adapter | Contents |
|---|---|
| Legal corpus | Statutes, rules, forum procedures, citation registry, effective dates |
| Taxonomy | Dispute categories, forums, remedies |
| Templates | Draft templates per tier |
| Policy flags | Advertising rules, directory permissibility, fee display, self-help allowed, AI-disclosure rules, review requirements |
| Professional-registry adapter | Enrolment/licence verification method per regulator |
| Privacy adapter | Lawful bases, residency, retention, breach rules |
| Language pack | Separate from jurisdiction (one language across many jurisdictions) |

### 18.4 Must never be generalised
Limitation periods and deadlines · forum/jurisdiction logic · professional advertising and fee rules · privilege rules · data-residency and transfer rules · verification of professionals · any legal proposition presented to a user.

### 18.5 Sequencing
India-MP → India national (priority states by wedge) → Indian diaspora cross-border matters → first foreign pack only after a partner institution exists there **[A]**.

---

## 19. Phased product roadmap

### MVP (0–6 months, after founder build authorisation)
- **Customer value:** a structured, source-linked Dispute File and a professional-ready export in one sitting; a chosen advocate can review and comment.
- **Payer:** dispute owner (business/FPO) — one-time dispute-file fee test (D-018).
- **Features:** §4.1.
- **Prerequisites:** 90-Day Plan G1/G2 passed; security + data architecture spec (§24).
- **Safety gates:** G3 — zero cross-tenant leakage, zero unsupported high-impact claims, zero fabricated citations, zero invented deadlines, zero silent fact changes; prompt-injection 0 (Eval Protocol §17).
- **Business validation gate:** ≥3 qualified users pay or sign paid pilot; ≥2 reviewers report reduced time-to-understand.
- **Exit criteria:** pilot GO per 90-Day Plan; reviewer comment usage observed on ≥50% of shared files **[A — threshold to calibrate]**.
- **Why not more:** every added actor multiplies consent, audit and regulatory surface before the core artifact is proven.

### Phase 2 (6–15 months)
- **Customer value:** reviewed correspondence; organisation-wide dispute workspace; routing to the organisation's own advocates.
- **Payer:** organisation subscription; advocate SaaS (flat).
- **Features:** T1 drafts in 2A (reviewer-in-loop), 2B self-help subset; organisation panels; professional workspace; limitation/deadline calendar using verified-deadline gate only; client billing.
- **Prerequisites:** MVP exit; pack template governance; legal opinion on panel model and self-help boundary.
- **Safety gates:** 100% citation validity; zero unsent-but-marked-sent defects; reviewer edit-distance tracked; no autonomous send.
- **Business gate:** ≥ N paying organisations with repeat disputes **[A — set N after MVP]**.
- **Exit:** T1 drafts approved without substantive edits in a majority of cases (measured, not assumed).
- **Why not early:** drafts without a proven record produce confident errors.

### Phase 3 (15–30 months)
- **Customer value:** find a suitable advocate or neutral; mediation-ready files; legal-aid routing.
- **Payer:** institutional partnerships, enterprise licences, advocate SaaS.
- **Features:** advocate verification; engagement lifecycle; private fee quotes; private feedback; public directory **only if cleared**; mediation module (neutral role, consented subset, s.30-style online process with written consent **[V S4]**); NALSA/DLSA routing; T2 advocate-only drafting.
- **Prerequisites:** written legal opinion; verification operations; mediation partner(s).
- **Safety gates:** zero paid placement; ordering reproducible; conflict gate tests; mediation confidentiality tests.
- **Business gate:** at least one institutional partner signed.
- **Exit:** sustained engagement completion without conduct complaints.
- **Why not early:** legal exposure and two-sided liquidity cost.

### Phase 4 (30 months+)
- **Customer value:** continuity into formal proceedings; cross-border readiness.
- **Payer:** enterprise, institutions, API licensing.
- **Features:** eCourts context connectors (integrate, don't replicate — D-013); published schema/API; payment readiness (no advocate-fee intermediation); second pack.
- **Gates:** integration security review; per-jurisdiction legal review.
- **Why not early:** integrations amplify any schema or privacy flaw.

### Long-term ecosystem
NyayOS as the interoperable dispute-record layer used by owners, advocates, neutrals, legal-aid bodies and institutions — with outcome data **never** turned into lawyer rankings.

---

## 20. Risks and mitigations

Top legal and business risks (new or re-weighted relative to Risk Register V1):

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| E1 | Platform characterised as advertising/soliciting for advocates (Rule 36; 2024 BCI directive) | Critical | No directory before legal opinion; particulars-only; no paid placement; "engagement request" model; copy review |
| E2 | Revenue model treated as tout/fee-sharing (Rules 20, 36, 37) | Critical | Lead/success fees rejected; advocate pricing flat and independent of referrals |
| E3 | AI self-help drafts treated as unauthorised practice (s.33/s.45; A.K. Balaji line) | High | T1 self-help gated to 2B with evidence + opinion; T2 advocate-only |
| E4 | Reviewer seat leaks data beyond purpose | Critical | Purpose-bound grants, scope, expiry, RLS tests (R20) |
| E5 | Private feedback leaks or is used as de facto ranking | High | Private, min-n, not used in ordering |
| E6 | Conflict-check disclosure itself leaks client identity | High | Opposing-party names only, consented, logged |
| E7 | Court AI rules (when finalised) impose disclosure duties NyayOS outputs don't support | Medium | Store AI-use provenance per draft; pack flag `ai_disclosure_required` |
| E8 | DPDP substantive obligations live from ~May 2027 overlap with pilot | High | Build to Rules now; counsel review of notices/consent (R18, R19) |
| E9 | Founder-bandwidth dilution across ventures | High | One active assignment; phase gates enforced |
| E10 | Organisation-panel model still read as solicitation | Medium | Client-curated lists only; legal opinion |
| E11 | Business payer (FPO/SMB) will not pay | Critical | 90-Day Plan G2 WTP evidence before build scale |
| Carry-over | R01, R02, R05, R06, R07, R08, R10, R21, R22, R25, R28 | — | Unchanged; remain release gates |

---

## 21. Decisions to lock now

| # | Decision | Rationale |
|---|---|---|
| L1 | NyayOS is a Dispute File platform with a professional-review layer; not a lawyer marketplace | §1.2 |
| L2 | Add reviewer seat, communication outline, evidence hash manifest, purpose-bound shares to MVP | §4 |
| L3 | Reject permanently: lead fees, success fees, paid placement, public ratings/reviews, win/success rates, "best lawyer" rankings | §10, §13, §14 |
| L4 | No AI output is sent, signed, filed or approved by NyayOS; T2 only in advocate workspace | §5 |
| L5 | Criminal-matter drafting excluded from the public product (extends D-005) | §5.2 |
| L6 | Policy/jurisdiction adapter owns all regulatory rules; no hard-coded rules | §17.2 |
| L7 | "Engagement request" terminology; client-initiated only | §11 |
| L8 | Advocate pricing to NyayOS must not scale with NyayOS-sourced engagements | §14 |
| L9 | India-first brand; nyayos.global defensive only | §18 |
| L10 | Fee quotes block contingent/share-of-proceeds structures | §9 |

## 22. Decisions to defer

| Decision | Revisit trigger |
|---|---|
| Public advocate directory (yes/no, scope) | Written legal opinion + Phase 2 exit |
| Organisation-panel legality details | Legal opinion before Phase 2 |
| T1 self-help boundary | Phase 2A evaluation data + opinion |
| Pricing levels | 90-Day Plan price tests |
| Retention durations | Counsel review (D-016) |
| Payment intermediation | Phase 4; payments counsel |
| Client-requested advocate-gender preference | Legal opinion |
| Mediation partner model | Phase 3 partner discussions |
| Second jurisdiction | India Phase 3 exit + partner institution |
| Wedge confirmation (FPO/SMB vs consumer) | 90-Day Plan G1/G2 (D-003 remains provisional) |

## 23. Research gaps

1. **Written legal opinion** (practising advocate) on: reviewer seat; organisation panels; public directory; engagement-request model; advocate SaaS pricing; T1 self-help drafting. — *Founder-only act to commission.*
2. Current authoritative text of the Rule 36 website-particulars schedule (2008 amendment) from the BCI Rules gazette.
3. Whether any BCI or State Bar Council guidance after the 2024 directive addresses legal-tech tools distinct from listing platforms.
4. BCI v. A.K. Balaji (2018) — confirm holding scope on non-litigious practice from the reported judgment.
5. BSA 2023 section numbers for electronic-record certificates and professional communications — verify against India Code before any product copy cites them.
6. Commencement notifications for Mediation Act 2023 ss.5 and 30, and the Mediation Council's regulations.
7. DPDP Rules 2025 commencement dates against G.S.R. 846(E) primary text.
8. Supreme Court AI regulations — final version status after the June 2026 consultation.
9. Availability of State Bar Council rolls for automated verification.
10. Payment-aggregator posture for any future fee flow.
11. Domain availability/ownership (nyayos.global and India-facing primary).
12. Market evidence gaps unchanged from Master Context §10: WTP, conversion, reviewer time saved, category frequency, interviews.

## 24. Recommended next assignment

**Specialist tool and mode:** Claude Chat (Opus, extended thinking) — **NyayOS Security + Data Architecture Specification — research/specification only, no code, no deployment.**

**Scope (extends the Continuity Handoff recommendation with this review's additions):**
tenant/RLS design including reviewer grants · purpose-bound consent and grant model · threat model (reviewer seat, conflict-check disclosure, prompt injection, export leakage) · data classification · evidence integrity manifest and custody log · storage/deletion lifecycle with per-dispute keys · RAG trust boundary (case vs authority corpus) · OCR pipeline security · audit schema (incl. share-purpose and reviewer-comment events) · policy/jurisdiction adapter interface · review-gate interface (T0 now, T1/T2 ready) · security test cases mapped to Eval Protocol §17 gates.

**Output:** `NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md`.

**Parallel founder-only act (not an assignment):** commission the legal opinion in §23 item 1.

---

## 25. Sources (accessed 22 Sep 2026)

| ID | Title | Institution | URL | Grade |
|---|---|---|---|---|
| S1 | Press release on advocate advertising and BCI directives (Rule 36; 08.07.2024 directive; Madras HC WP 31281/31428 of 2019) | Press Information Bureau, Government of India | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2043470&reg=3&lang=2 | Primary (government) |
| S2 | Standards of Professional Conduct and Etiquette (BCI Rules Part VI Ch. II, incl. Rules 17, 19, 20, 21, 36, 37, 38) | Bar Council of Delhi | https://delhibarcouncil.com/assets/file/Etiqquetes.pdf | Official reproduction by a State Bar Council |
| S3 | The Advocates Act, 1961 (ss.33, 35, 45, 49) | India Code, Legislative Department | https://www.indiacode.nic.in/bitstream/123456789/15341/1/advocate_1961.pdf | Primary |
| S4 | The Mediation Act, 2023 (ss.5, 30) | Department of Legal Affairs | https://legalaffairs.gov.in/sites/default/files/MediationAct2023.pdf | Primary (commencement to verify) |
| S5 | Digital Personal Data Protection Rules, 2025 | MeitY | https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa | Primary; phase dates taken from secondary analyses (e.g., Shardul Amarchand Mangaldas, https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/) — verify |
| S6 | Draft Regulations for Use of AI in Courts, 2026 — notices and circulars | Supreme Court of India | https://www.sci.gov.in/notices-and-circulars/ | Draft; content summarised from secondary coverage (e.g., Supreme Court Observer, https://www.scobserver.in/journal/order-in-the-digital-court-artificial-intelligence-regulations-supreme-court/) |
| S7 | BIS IS 19000:2022 Online Consumer Reviews | PIB / Bureau of Indian Standards | https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1882828&reg=3&lang=2 | Primary (voluntary standard) |
| S8 | Legal Aid | NALSA | https://nalsa.gov.in/legal-aid/ | Primary (from Decision Log) |
| S9 | eCourts Case Status | eCourts Mission Mode Project | https://services.ecourts.gov.in/ecourtindia_v6/casestatus/ | Primary (from Decision Log) |
| S10 | Commentary citing BCI v. A.K. Balaji (2018) on chamber practice | Jay Kay Law Reporter | https://www.jklaws.in/articles.aspx?id=28 | Secondary — verify judgment |

Secondary sources are cited only for dates or summaries of instruments whose primary text must be re-checked; no market statistics are asserted in this review.

---

## 26. Return summary (for M365 Copilot)

1. **File:** this document.
2. **Executive recommendation:** Dispute File platform with a professional-review layer; never a lawyer-advertising marketplace in India.
3. **Updated MVP:** canonical Readiness Engine + reviewer seat + communication outline + evidence hash manifest + purpose-bound shares.
4. **Architect now:** review-gate engine, professional identity, policy/jurisdiction adapter, consent catalogue, engagement state machine, published schema.
5. **Deferred:** T1 drafts (P2), organisation panels (P2), verification/matching/engagement/fee quotes/private feedback/mediation/legal-aid routing/T2 (P3), payments and integrations/second pack (P4), public directory (legal-opinion gated).
6. **Permanently rejected:** lead fees, success fees, listing-for-visibility, paid placement, public ratings/reviews, win/success/disposal metrics, "best lawyer" rankings, autonomous send/file/sign/approve, public criminal-matter drafting, training on private files without separate consent.
7. **Top risks:** E1 advertising characterisation, E2 tout/fee-sharing characterisation, E3 unauthorised practice via self-help drafts, E4 reviewer-seat data leakage, E11 payer unwillingness.
8. **Evidence gaps:** §23 (legal opinion first).
9. **Next tool/mode:** Claude Chat Opus extended thinking — Security + Data Architecture Specification (research only).
10. **Confirmation:** no code written, no repository accessed, no deployment performed in producing this review.
