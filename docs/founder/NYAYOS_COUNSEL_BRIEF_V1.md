# NYAYOS_COUNSEL_BRIEF_V1

**A briefing package for external counsel. This document asks questions; it does not answer them.**

| Field | Value |
|---|---|
| Project | NyayOS (pre-build legal-technology product, India) |
| Prepared for | (a) Indian privacy / data-protection counsel; (b) a practising advocate for professional-conduct and evidence questions |
| Prepared by | Claude Chat (Opus, extended thinking) for the founder, as a preparation package |
| Mode | Research and legal specification only |
| Code / repository / deployment / database writes | None. No implementation exists. |
| Inputs | Security & Data Architecture Spec V1 ("SDAS") · Build Brief V2 ("BB2") · Ecosystem Architecture Review V1 ("EAR") · Master Product Spec V1 ("MPS") · Decision Log V1 ("DL") · Risk Register V1 ("RR") |
| Output file | `NYAYOS_COUNSEL_BRIEF_V1.md` |
| Continuity owner | M365 Copilot |
| Date | 22 Sep 2026 |

### Standing statements

1. **No legal conclusions, opinions or compliance claims are made in this document.** Where a statute, rule, direction or judgment is named, it is named only as material counsel may wish to consider. Nothing here states that any instrument applies to NyayOS, or that any NyayOS design satisfies any legal requirement.
2. Any statutory or regulatory reference that reached the project through secondary sources is flagged as **[unverified by the project]**; the project has not verified those texts against primary sources and asks counsel to do so.
3. All retention periods, time-to-live values, thresholds and similar numbers in the product documents are **provisional engineering defaults**, chosen so that they can be changed by configuration once counsel advises.
4. NyayOS is at **pre-build** stage. No user data of any kind is held today. Counsel's answers will shape what is built, not correct what has been built.

---

## 1. Executive summary

### 1.1 What NyayOS is (factual description for counsel)

NyayOS is a planned software product for India. Its first capability is a **Dispute Readiness Engine**: a person or small business ("the dispute owner") describes a dispute in their own words, uploads their own documents, and the product organises that material into a structured "Dispute File" — parties, chronology, evidence index, issue classification, evidence gaps, contradictions flagged for human review, and an action list. The dispute owner may then share a selected, frozen snapshot of that file with a professional of their own choosing for review.

Key factual features relevant to legal analysis:

- **The user supplies all case material.** NyayOS does not obtain documents from courts, registries or third parties.
- **AI assists; it never decides.** AI outputs are proposals that the dispute owner accepts or rejects; the product is designed so AI cannot change confirmed facts (SDAS §1; MPS §12).
- **No legal advice, no outcome prediction, no representation.** Prohibited outputs include merits conclusions, outcome prediction, guilt/innocence statements and bail estimates (MPS §12; EAR §5).
- **No lawyer marketplace.** No directory, ratings, rankings, paid placement, lead fees or success fees (EAR §12–13; BB2 exclusions).
- **Nothing is sent, signed or filed by the product.** There is no outbound channel for dispute content and no e-filing (EAR L4; BB2 §3.3).
- Initial target users: small businesses, Farmer Producer Companies and similar organisations with vendor-payment and commercial-service disputes; consumer disputes as a sandbox; one private founder-controlled criminal matter used only as an internal evaluation case under a restrictive protocol (DL D-003, D-004, D-005).

### 1.2 Why this package exists

The product's security and data architecture is specified (SDAS) and the build is planned as eight milestones (BB2). Eleven questions (OL-01 to OL-11) cannot be answered by engineering. They determine what is built, what the user is told, how long data is kept, what the product may display, and whether the pilot may start. The project has deliberately stopped at the point where legal input is required, rather than assuming answers.

### 1.3 What is asked of counsel

| Counsel | Items |
|---|---|
| Privacy / data-protection counsel (India) | OL-01, OL-02, OL-03, OL-04, OL-05, OL-06, OL-07, OL-11 (and the data-protection aspect of OL-10) |
| Practising advocate (litigation + professional conduct) | OL-08, OL-09, OL-10 (and the litigation-practice view on OL-06) |

Recommended sequence, specialisations, deliverable formats and an interim risk-acceptance framework are in §5–§7.

### 1.4 Commercial framing

The pilot is intended to be small (10–25 users, per the 90-day validation plan) and is not authorised to start until these items are closed or formally risk-accepted. The founder is a solo operator; a proportionate, staged engagement is preferred — a first written advice covering the blocking items, then a second pass on the remainder.

---

## 2. Decision matrix

| OL | Question (short) | Primary counsel | Risk severity if unanswered | Blocking milestone(s) | Decision type | Interim path available? |
|---|---|---|---|---|---|---|
| OL-01 | Lawful basis for third-party personal data contained in a user's evidence | Privacy | **Critical** | M7 (pilot); notice text affects M0/M1 | Legal basis + notice wording | Limited — see §3.1.10 |
| OL-02 | Final retention periods for each data class | Privacy | High | M6 config, M7 | Numbers + published policy | Yes (short defaults) |
| OL-03 | Retaining a content-free hash "tombstone" after deletion | Privacy | Medium | M6 | Permissible / not | Yes (omit tombstone) |
| OL-04 | Which DPDP obligations apply to NyayOS and from when | Privacy | **Critical** | M7 | Applicability + dated obligations | No |
| OL-05 | CERT-In applicability, reportable categories, log residency | Privacy / cyber | High | M0 configuration, M7 | Applicability + configuration | Yes (conservative default) |
| OL-06 | Legal-hold policy: who may request, disclosure limits | Privacy + advocate | Medium-High | M6 | Policy + procedure | Yes (owner-only holds) |
| OL-07 | Whether users must be notified of platform break-glass access | Privacy | Medium | M7 | Notify / not + timing | Yes (notify by default) |
| OL-08 | Electronic-evidence requirements and what NyayOS may truthfully say about integrity | Advocate | High | M5 (export wording) | Wording approval | Yes (minimal wording) |
| OL-09 | Displaying a reviewer's self-declared enrolment details to the inviting owner | Advocate | High | M4 | Permissible display set | Yes (show nothing) |
| OL-10 | Confidentiality / privilege warnings for pre-engagement sharing | Advocate (+ privacy) | High | M4 | Warning wording | Yes (conservative warning) |
| OL-11 | Cross-border processing by OCR / LLM providers | Privacy | High | M2, M3 | Permissibility + disclosure | Yes (India-region only) |

"Blocking" means: the milestone may be developed on staging with synthetic data, but **G-PILOT** (pilot entry) cannot pass until the item is closed by counsel or carries a dated founder risk acceptance (BB2 §14.2).

---

## 3. Detailed sections

Each section follows the same structure. **Questions for counsel are questions — the project has not formed a view on any of them.**

---

### 3.1 OL-01 — Lawful basis for third-party personal data contained in dispute evidence

**3.1.1 Short description**
A dispute owner uploads their own documents (invoices, emails, WhatsApp exports, letters, notices, bank advices, corporate records). Those documents inevitably contain personal data about people who are not NyayOS users: the opposing party, its officers, employees, witnesses, and sometimes unrelated individuals who appear in a thread or ledger. NyayOS stores, indexes and processes that material on the user's instruction, and the user may later share a selected snapshot with a professional of their choice.

**3.1.2 Relevant architecture references**
SDAS §3 (data classification: "Dispute narratives", "Evidence"), §9 (consent purpose catalogue: `storage`, `extraction`, `ai_assistance`, `share_reviewer`, `export`), §11 (private case corpus), §5 (access control), §17 (audit).

**3.1.3 Relevant product references**
MPS §7.4–7.9 (ingestion, extraction, parties/entities), §10 (Dispute File data model), §9 US-02, US-03; EAR §15; RR R02, R17.

**3.1.4 Why the question exists**
The people whose personal data appears in the evidence are not NyayOS users and cannot practically be asked for consent; the project does not know what lawful basis applies to this processing, what notice obligations (if any) follow, or whether any exemption relevant to enforcing legal rights or claims is engaged. Counsel may wish to consider the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025, including any provisions on lawful/legitimate uses and exemptions, and the respective roles of NyayOS and the user (for example, whether NyayOS is a data fiduciary, a processor, or both in different respects) **[unverified by the project]**.

**3.1.5 Implementation decisions that depend on the answer**
- Whether consent screens must distinguish "your own personal data" from "personal data of others in your documents", and what the notice text says (M0/M1 notices are versioned and bilingual).
- Whether any intake guard is needed (for example, prompts to redact irrelevant third parties, or limits on bulk uploads unrelated to the dispute).
- Whether data-principal rights requests from a third party (someone who finds their data in another person's dispute file) need a handling procedure, and who answers them — the user or NyayOS.
- Whether organisation tenants require a separate contractual allocation of roles between NyayOS and the organisation.
- Whether minimisation features (page-range upload, redaction before indexing) are required in MVP rather than later.

**3.1.6 Blocking milestone(s)**
M7 (pilot entry) is blocked. Notice wording affects M0 (consent framework) and M1 (intake); a change after M1 is a text change, not a schema change.

**3.1.7 Risk severity**
**Critical.** This is the foundational processing question for the entire product; an incorrect assumption affects every record in the system and every user notice.

**3.1.8 Questions for counsel**
1. What is the lawful basis (or bases) for NyayOS's processing of personal data relating to persons who are not its users, contained in material uploaded by a user, for the purposes described in §3.1.1?
2. In what capacity does NyayOS act for (a) the user's own personal data and (b) third-party personal data in the user's documents, and does that differ between personal tenants and organisation tenants?
3. What notice or transparency obligations, if any, follow — to the user, and to third parties?
4. Does any exemption relevant to the enforcement of legal rights or claims apply, and if so to which activities (storage, AI-assisted extraction, sharing with a chosen professional, export)?
5. What, if anything, should NyayOS do if a third party asserts rights in respect of data held in another person's dispute file?
6. Are there data-minimisation or redaction measures counsel considers necessary before pilot, as opposed to desirable later?
7. Does anything in the analysis change where the dispute involves a minor, or where the evidence contains material about minors (see also OL-12 in §8)?

**3.1.9 Required answer format**
A short written advice stating: (a) basis/bases and capacity, per processing activity; (b) required notice content, in a form that can be turned into user-facing text in Hindi and English; (c) any mandatory product measures, marked "required before pilot" or "recommended"; (d) the handling procedure for third-party rights requests, if any; (e) assumptions relied on.

**3.1.10 Acceptable interim risk-acceptance path**
Limited. If a full advice is not available before pilot, a conservative interim posture is: restrict the pilot to a small, informed cohort under a written pilot agreement; use the most restrictive notice text available; minimise processing (no aggregate analytics, no model improvement — both already locked off); keep retention short; and record a dated founder risk acceptance naming this item. The founder should note that no interim posture substitutes for advice on the lawful basis itself.

---

### 3.2 OL-02 — Final retention periods

**3.2.1 Short description**
NyayOS separates retention into classes: active dispute content; content pending purge after a deletion request; account identity and contact data; audit records; operational logs; backups; consent records; authority (legal source) corpus; exports; derived OCR and index data. Every period currently in the design is a provisional engineering default.

**3.2.2 Relevant architecture references**
SDAS §10.2 (retention classes RC-ACT, RC-DEL, RC-ACC, RC-AUD, RC-OPS, RC-BKP, RC-CON, RC-AUTH, RC-DERIV, RC-EXP, RC-REV), §3 (classification matrix), §17.3 (audit retention), §19 (backups).

**3.2.3 Relevant product references**
MPS §10 (Retention Record), §19, §21; DL D-016; BB2 §10 (M6), §14.2.

**3.2.4 Why the question exists**
Disputes have long tails: limitation periods, appeals and enforcement can run for years, so users may want long retention, while data-protection principles may point to erasure once the purpose is served. The project does not know what periods are defensible for each class, whether any prescribed period applies to a service of this kind, or how to treat inactive accounts. Counsel may wish to consider the DPDP Act, 2023 and DPDP Rules, 2025 — including any provisions on erasure when the purpose is no longer served, any prescribed retention or advance-notice-before-erasure requirements, and any class-based schedules — and any requirement to retain logs for a minimum period **[unverified by the project]**.

**3.2.5 Implementation decisions that depend on the answer**
- Configured values for every retention class (they are configuration, not code).
- Whether an automated inactivity purge is built and enabled, and what advance notice is required before erasure.
- Whether the user can choose a longer retention for an active dispute, and how that choice is recorded.
- The published retention policy text and the deletion status messages shown to users (M6 UI).
- Audit and operational-log periods, which interact with OL-05.

**3.2.6 Blocking milestone(s)**
M6 (deletion and retention configuration finalisation) and M7 (published policy). Development proceeds with defaults; the values must be settled before pilot.

**3.2.7 Risk severity**
High. Wrong periods create either an unnecessary data liability or premature destruction of material a user needs for a live dispute.

**3.2.8 Questions for counsel**
1. What retention period, or method of determining a period, applies to each class listed in §3.2.1?
2. Is there any prescribed period or advance-notice requirement before erasure that applies to a service of this kind?
3. How should inactivity be treated for a dispute file that a user may not touch for a year but still needs?
4. May a user elect longer retention, and if so how should that election be documented?
5. What minimum retention applies to audit and security logs, and does it conflict with erasure obligations?
6. How long may consent records be retained after withdrawal, and account records after account deletion?
7. What must the published retention policy say, and in what languages?

**3.2.9 Required answer format**
A table: data class → retention period or rule → basis → any notice requirement → review trigger. Plus approved policy wording (or wording principles) for user-facing text.

**3.2.10 Acceptable interim risk-acceptance path**
Yes. Pilot with short, conservative defaults (shorter retention rather than longer), automated inactivity purge disabled, manual deletion always available, and a published statement that periods are provisional during the pilot and may be shortened. Dated founder risk acceptance recorded.

---

### 3.3 OL-03 — Hash tombstones after deletion

**3.3.1 Short description**
When a document is deleted, the design contemplates keeping a content-free record — document identifier, SHA-256 hash of the deleted file, deletion timestamp, actor — inside the append-only audit chain, so that the integrity history of a dispute file remains coherent and so deletion can be evidenced.

**3.3.2 Relevant architecture references**
SDAS §8.8 (deletion handling), §3 (Evidence row: "content-free tombstone [PROV]"), §17 (audit, hash chain).

**3.3.3 Relevant product references**
MPS §10 (Retention Record), §19; BB2 §10 (AC-M6-01), §14.2 OL-03.

**3.3.4 Why the question exists**
A cryptographic hash of a deleted file is not the file, but it is derived from it and can confirm that a specific file once existed in the system if the same file is produced later. The project does not know whether retaining such a value after a deletion request is consistent with erasure obligations, or whether it should be retained only where a legal hold applies.

**3.3.5 Implementation decisions that depend on the answer**
- Whether the tombstone is written at all; if yes, which fields and for how long.
- Whether deletion verification reporting to the user may cite the hash.
- Whether the audit chain must be able to record a deletion without any derived value.
- Whether treatment differs between user-initiated deletion and deletion under a legal hold release.

**3.3.6 Blocking milestone(s)**
M6.

**3.3.7 Risk severity**
Medium. The feature is severable; removing it costs integrity-history coherence, not core function.

**3.3.8 Questions for counsel**
1. May a content-free record containing a cryptographic hash of a deleted file be retained after a user's deletion request, and on what basis?
2. If yes, for how long, and must the user be told?
3. Does the answer change if the hash is retained specifically to evidence that deletion occurred?
4. Should the tombstone be omitted entirely and replaced by a record that names no derived value?

**3.3.9 Required answer format**
A yes / no / conditional answer with the permitted field set and retention period, and any required user-facing disclosure.

**3.3.10 Acceptable interim risk-acceptance path**
Yes, and the safest interim path is to **omit** the hash from tombstones and record only identifier, timestamp and actor. This is the project's default until advised otherwise.

---

### 3.4 OL-04 — DPDP applicability and commencement obligations

**3.4.1 Short description**
The project needs a dated map of which obligations under the Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 apply to NyayOS, and from which dates, so that the pilot's controls, notices, breach procedures and records can be aligned to a timeline rather than to secondary-source summaries.

**3.4.2 Relevant architecture references**
SDAS §9 (consent), §10 (retention/erasure), §15 (policy adapter, which can carry compliance-driven flags), §17 (audit), §20 (incident response timings), §24 item 4.

**3.4.3 Relevant product references**
MPS §21 (compliance/product trust), §19; DL D-016; RR R17, R18, R21.

**3.4.4 Why the question exists**
The project's knowledge of commencement dates, breach-intimation timelines, log-retention expectations and any consent-manager framework comes from secondary sources and is expressly **[unverified by the project]**. Building to an incorrect timeline risks either premature complexity or a gap at the moment obligations bite.

**3.4.5 Implementation decisions that depend on the answer**
- Notice and consent content and versioning (M0).
- Breach-response timelines encoded in the incident runbook and alerting (M7).
- Log and record retention interacting with OL-02 and OL-05.
- Whether any registration, governance-role, assessment or audit obligation applies, and when.
- Whether any consent-manager interoperability work belongs in the roadmap (currently deferred).
- Whether the founder's entity (sole operator) has any specific governance obligations.

**3.4.6 Blocking milestone(s)**
M7. Timeline outputs also shape M0 notices and M6 retention configuration.

**3.4.7 Risk severity**
**Critical**, because it governs the framework within which OL-01, OL-02, OL-03, OL-06, OL-07 and OL-11 are answered.

**3.4.8 Questions for counsel**
1. Which obligations apply to NyayOS as described, and from which dates?
2. What are the notice, consent and record requirements in their current form, and what must the product's bilingual notices contain?
3. What are the breach-intimation obligations, to whom, in what sequence and within what timelines?
4. What governance roles, contact publication, grievance handling or assessment obligations apply, if any, to a business of this size?
5. Does the position differ for organisation tenants (where the organisation may itself be a fiduciary)?
6. Which obligations should be implemented before pilot, and which may follow the applicable commencement dates?
7. Which primary instruments and provisions should the project cite in its own documents, so that its internal materials stop relying on secondary sources?

**3.4.9 Required answer format**
A dated obligations table: obligation → source provision → applies to NyayOS (yes/no/conditional) → effective date → product implication → priority (before pilot / by date). Plus a citation list of primary sources.

**3.4.10 Acceptable interim risk-acceptance path**
None recommended. This item is the frame for the others; a pilot without it means processing personal data of pilot users and third parties on an assumed footing.

---

### 3.5 OL-05 — CERT-In applicability and logging obligations

**3.5.1 Short description**
The project's plan assumes that directions issued by the Indian Computer Emergency Response Team (CERT-In) under the Information Technology Act, 2000 may apply — including incident reporting within a short window, retention of ICT system logs for a rolling period maintained within Indian jurisdiction, and synchronisation of system clocks to national time sources **[unverified by the project]**. The project needs to know whether these apply to a product of this kind and size, and how to configure accordingly.

**3.5.2 Relevant architecture references**
SDAS §10.1–10.2 (RC-OPS, RC-AUD), §17 (audit), §18.3 (regional considerations), §19–20 (backups, incident response), §24 item 5.

**3.5.3 Relevant product references**
MPS §14, §19, §21; BB2 §4 (M0 clock sync and log configuration), §11 (M7 runbook); RR R17.

**3.5.4 Why the question exists**
Log residency, retention floors and reporting windows are infrastructure decisions with cost and vendor implications. They must be configured at M0 (hosting and logging set-up), and re-doing them later is expensive. The project does not know which incident categories are reportable, what a "log" comprises for this purpose, or whether an India copy is sufficient where a vendor stores logs elsewhere.

**3.5.5 Implementation decisions that depend on the answer**
- Hosting region and logging configuration (M0), including whether a vendor's default log location is acceptable.
- Operational log retention (interacts with OL-02).
- Incident detection-to-report latency budget and on-call expectations for a solo founder (M7 runbook).
- Clock synchronisation configuration.
- Vendor contract requirements (log export, residency, assistance during an incident).

**3.5.6 Blocking milestone(s)**
M0 (configuration choices) and M7 (runbook and readiness). Work can proceed on the conservative default.

**3.5.7 Risk severity**
High, because it drives infrastructure and vendor selection early.

**3.5.8 Questions for counsel**
1. Do the CERT-In directions apply to NyayOS as described, and in what capacity?
2. Which incident categories are reportable, within what time, and in what format?
3. What must be retained as "logs", for how long, and does an India-resident copy satisfy the requirement where the vendor stores primary logs elsewhere?
4. What clock-synchronisation obligation applies, if any?
5. What must a one-person operator have in place to be able to report within the applicable window?
6. How do these obligations interact with breach-intimation obligations considered under OL-04 (sequence, content, duplication)?
7. What should vendor contracts require to support compliance?

**3.5.9 Required answer format**
An applicability statement plus a configuration table: obligation → applies (yes/no/conditional) → configuration requirement → evidence to retain → contract clause needed.

**3.5.10 Acceptable interim risk-acceptance path**
Yes: adopt the most conservative reading as the engineering default — India-region hosting for database, storage, backups and logs; log retention at or above the assumed floor; clocks synchronised; incident runbook written to the shortest assumed window. Record a dated risk acceptance that applicability is unconfirmed.

---

### 3.6 OL-06 — Legal-hold policy

**3.6.1 Short description**
A dispute file may need to be preserved — because the user's own matter is live, because their advocate asks for preservation, or because a lawful order requires it. The design contains a `HELD` state that suspends deletion and an associated register. The policy around it is unsettled: who may request a hold, what NyayOS may do on a third-party demand, and what the user may be told.

**3.6.2 Relevant architecture references**
SDAS §10.5 (legal holds), §10.3 (deletion workflow), §17 (audit), §24 item 6.

**3.6.3 Relevant product references**
MPS §10 (Retention Record), §9 US-11; BB2 §10 (M6, AC-M6-05); EAR §9 (evidence integrity), §15.

**3.6.4 Why the question exists**
Holds cut across two user-facing promises: deletion on request, and honest status. The project does not know the circumstances in which NyayOS may or must preserve data against a user's deletion request, how to verify a demand, and whether disclosure of a hold to the user may ever be restricted.

**3.6.5 Implementation decisions that depend on the answer**
- Who can apply a hold in the product (owner only, or also platform on receipt of an order).
- Whether a "silent hold" state is required (a hold the user is not shown) — the current design shows all holds to the owner.
- Verification procedure for an order or demand, and the record kept.
- Whether the deletion status wording must change.
- Whether holds are needed in MVP at all, or can be handled manually during a small pilot.

**3.6.6 Blocking milestone(s)**
M6.

**3.6.7 Risk severity**
Medium-High: low frequency, high consequence if handled incorrectly.

**3.6.8 Questions for counsel**
1. In what circumstances may or must NyayOS preserve a user's data against that user's deletion request?
2. Who may validly request preservation, and how should a request or order be verified?
3. May the user always be told that a hold exists? Are there circumstances in which disclosure is restricted?
4. What record should NyayOS keep of a hold and its release?
5. For a pilot of 10–25 users, is a manual procedure acceptable in place of a product feature?
6. What should the user-facing deletion policy say about holds?

**3.6.9 Required answer format**
A short procedure document: trigger → who may request → verification steps → what NyayOS does → what the user is told and when → records kept → release criteria. Plus approved wording for the deletion policy.

**3.6.10 Acceptable interim risk-acceptance path**
Yes: pilot with **owner-initiated holds only**, all holds visible to the owner, and any third-party demand escalated to counsel before any action, with deletion paused only on counsel's instruction. Dated risk acceptance recorded.

---

### 3.7 OL-07 — Break-glass notification obligations

**3.7.1 Short description**
Platform staff have no standing access to dispute content. Emergency ("break-glass") access requires a stated reason, a second approver, a time box, and an audit event. The open question is whether, when and how the affected user must be told.

**3.7.2 Relevant architecture references**
SDAS §4.5 (platform administrator boundaries), §17 (audit events `break_glass.*`), §21 (SEC-INS-01…02), §24 item 7.

**3.7.3 Relevant product references**
MPS §14–15; BB2 §4 (M0 break-glass model), §11 (M7); RR R02, R20.

**3.7.4 Why the question exists**
Users are told they control who sees their file. Emergency staff access is an exception; whether it must be disclosed (always, on request, or only when it amounts to a reportable event) is a legal question the project cannot answer.

**3.7.5 Implementation decisions that depend on the answer**
- Whether a user notification is generated automatically on break-glass use, and what it says.
- Whether break-glass appears in the user's own access-history view.
- Whether support access (already user-initiated and time-boxed) is treated differently.
- What the privacy notice says about staff access.

**3.7.6 Blocking milestone(s)**
M7 (policy and notice). The technical capability exists from M0.

**3.7.7 Risk severity**
Medium.

**3.7.8 Questions for counsel**
1. Must a user be notified when platform staff access their content under an emergency procedure? If so, when and with what content?
2. Are there circumstances in which notification should be withheld or delayed?
3. Should such access appear in the user's access-history view by default?
4. What must the privacy notice say about the possibility of staff access?
5. Does any such access constitute a reportable event in any circumstances?

**3.7.9 Required answer format**
A short rule statement (notify / notify with exceptions / no obligation), with timing, content requirements and notice wording.

**3.7.10 Acceptable interim risk-acceptance path**
Yes, and the conservative default is to **notify the user and show the access in their access history in every case**, with the privacy notice describing the procedure. Dated risk acceptance recorded.

---

### 3.8 OL-08 — Electronic-evidence requirements and integrity wording

**3.8.1 Short description**
NyayOS computes a SHA-256 hash and a server timestamp when a document is uploaded, keeps the original write-once, and includes a manifest of those values in exports. The product's current draft wording says only that the hash shows the file has not changed since upload, and expressly disclaims any statement about authorship, truth or admissibility. Counsel is asked whether this wording is accurate and sufficient, and what NyayOS must **not** say.

**3.8.2 Relevant architecture references**
SDAS §8 (evidence integrity), §8.6 (export manifest), §8.7 (scope statement), §24 item 8.

**3.8.3 Relevant product references**
MPS §7.17 (export), §9 US-10, §11 (provenance contract); EAR §9; BB2 §9 (M5, AC-M5-04); RR R30.

**3.8.4 Why the question exists**
Users are likely to assume that a hash "proves" their evidence. Overstating this would mislead users and could harm them in a proceeding. The project also does not know whether any certification requirement for electronic records (for example, under the Bharatiya Sakshya Adhiniyam, 2023) interacts with what NyayOS stores, whether NyayOS's records could assist a party in preparing such a certificate, and whether NyayOS should avoid any role in that process **[unverified by the project]**.

**3.8.5 Implementation decisions that depend on the answer**
- The exact integrity wording in the UI and in every export (M5).
- Whether the export manifest should include or omit particular fields.
- Whether any future "certificate preparation" feature should be excluded permanently, deferred, or built only for advocates.
- Whether a digital signature over the manifest (currently deferred) is worth building.
- Whether metadata that would be needed for such a certificate (device, custody, hash method) should be captured now.

**3.8.6 Blocking milestone(s)**
M5 (wording), with M2 implications if additional metadata must be captured at ingest.

**3.8.7 Risk severity**
High: it is a user-harm and mis-selling risk as much as a legal one.

**3.8.8 Questions for counsel**
1. Is the draft integrity statement in SDAS §8.7 accurate and adequate? What wording would counsel approve?
2. What must NyayOS never say about hashes, timestamps or admissibility?
3. Do statutory requirements for electronic records interact with what NyayOS stores? Does NyayOS's manifest help or hinder a party preparing what the law requires?
4. Should NyayOS capture any additional metadata at upload so that a user's advocate is not disadvantaged later?
5. Should NyayOS stay entirely out of certificate preparation, or is a document-assembly role for an engaged advocate acceptable?
6. Does the answer differ where the uploaded item is a screenshot or a messaging-app export rather than a native file?

**3.8.9 Required answer format**
Approved wording (Hindi and English) for UI and exports; a "must not say" list; a metadata capture list marked "required before pilot" or "recommended"; a view on any future certificate-assistance feature.

**3.8.10 Acceptable interim risk-acceptance path**
Yes: pilot with the **minimal** wording — what the hash shows, and an explicit statement that it proves nothing about authorship, truth or admissibility, with a direction to consult an advocate — and no certificate-related feature of any kind. Dated risk acceptance recorded.

---

### 3.9 OL-09 — Reviewer identity display and Bar Council considerations

**3.9.1 Short description**
In the MVP, the dispute owner invites a professional **they already know or have chosen** to review their file. On accepting, the reviewer enters their name, enrolment number, State Bar Council and enrolment year. These details are shown **only to the inviting owner**, labelled "Self-declared — not verified by NyayOS". There is no directory, no search, no public profile, no rating, no ranking, no fee display, no paid placement, and no fee of any kind flowing between NyayOS and the reviewer.

**3.9.2 Relevant architecture references**
SDAS §7 (reviewer seat), §6 (grants), §24 item 9.

**3.9.3 Relevant product references**
EAR §7 (advocate layer), §12 (marketplace strategy), §13 (revenue), L3; MPS §9 US-12; BB2 §8 (M4, AC-M4-09).

**3.9.4 Why the question exists**
Professional-conduct rules restrict advocate advertising and solicitation, and enforcement attention has been reported in relation to online platforms **[unverified by the project]**. The project has deliberately excluded every marketplace feature, but it does not know whether even this minimal, private, owner-only display of an advocate's own self-declared particulars raises any concern for the advocate or for NyayOS — nor whether any verification step would help or would itself create a problem.

**3.9.5 Implementation decisions that depend on the answer**
- Whether reviewer identity fields are collected and displayed at all, and which ones.
- The exact label used, and whether "verified" status may ever be shown (planned only for a later phase).
- The wording of the reviewer's acceptance terms.
- Whether NyayOS may retain reviewer particulars at all, and for how long (interacts with OL-02).
- Whether any part of this design would be characterised as facilitating solicitation; and what would change that characterisation if the product later added discovery features (deferred, and gated on a separate opinion).

**3.9.6 Blocking milestone(s)**
M4.

**3.9.7 Risk severity**
High: it affects both the platform and any advocate who participates, and supply-side trust is fragile.

**3.9.8 Questions for counsel**
1. Does displaying a reviewer's self-declared particulars **only to the owner who invited them** raise any professional-conduct concern for the advocate or for NyayOS?
2. Which particulars may be collected and displayed in this private context, and which should not be?
3. Is the "Self-declared — not verified by NyayOS" label appropriate? What wording would counsel prefer?
4. Would verifying enrolment against Bar Council records change the analysis in any way?
5. What should the reviewer's acceptance terms say about NyayOS's role, and about the fact that no engagement is created by the platform?
6. Are there any circumstances in which the described reviewer seat could be characterised as solicitation, advertising or touting? What must NyayOS avoid to keep that risk at a minimum?
7. Is there anything in the current design that an advocate should disclose to their own Bar Council or client?

**3.9.9 Required answer format**
A short opinion stating: permitted display set; required labelling; approved acceptance-terms wording; a list of features that must not be added without fresh advice.

**3.9.10 Acceptable interim risk-acceptance path**
Yes: pilot with **no reviewer particulars displayed at all** — the owner already knows who they invited, and the invitation is addressed to a contact they entered. Collect nothing beyond name and contact until advised. Dated risk acceptance recorded.

---

### 3.10 OL-10 — Pre-engagement confidentiality and privilege warnings

**3.10.1 Short description**
A dispute owner may share a case snapshot with an advocate **before** any engagement exists. The project wants to tell users, accurately and in plain language, what protection that sharing does and does not carry — and, separately, what status their own notes and inputs inside NyayOS have.

**3.10.2 Relevant architecture references**
SDAS §7 (reviewer seat), §4.6 (reserved advocate-workspace privilege partition), §16 T12 (privilege confusion), §24 item 10.

**3.10.3 Relevant product references**
MPS §7.16 (human handoff), §21; EAR §9 (professional responsibility), §15; BB2 §8 (M4), §11 (copy review).

**3.10.4 Why the question exists**
Users may assume that anything they type into a "legal" product, or send to any advocate, is privileged. The project does not know what the correct position is, and will not guess in user-facing copy. This wording also affects whether the product should advise users to engage first and share afterwards.

**3.10.5 Implementation decisions that depend on the answer**
- Warning wording shown before a share is created, and in the reviewer's acceptance terms (M4).
- Whether the product should recommend a sequence (engage, then share) or offer an "engagement first" flow later.
- Whether the reserved advocate-workspace partition (a separate tenant for an advocate's own work product) must be built earlier than planned.
- Whether NyayOS should avoid certain features (for example, storing advocate advice in the client's file) until that partition exists.
- Copy review scope at M7.

**3.10.6 Blocking milestone(s)**
M4 (wording), with a possible architecture implication if the advocate partition must move earlier.

**3.10.7 Risk severity**
High (user-harm risk; the user may rely on a protection that does not exist).

**3.10.8 Questions for counsel**
1. What, if any, protection attaches to material a prospective client shares with an advocate before an engagement exists?
2. What is the status of a user's own notes, narratives and AI-assisted outputs stored in NyayOS?
3. What should NyayOS tell users before they share, in plain Hindi and English?
4. Should NyayOS recommend that users engage an advocate before sharing, or is a neutral warning sufficient?
5. Does storing an advocate's comments inside the client's dispute file create any issue, and does that change the priority of the separate advocate workspace?
6. Is there any wording NyayOS must avoid because it could imply a lawyer-client relationship with the platform?

**3.10.9 Required answer format**
Approved warning text (Hindi and English) for the share flow and the reviewer acceptance screen; a "must avoid" wording list; a view on whether any architectural change should be brought forward.

**3.10.10 Acceptable interim risk-acceptance path**
Yes: pilot with a conservative warning stating plainly that NyayOS is not an advocate, that sharing through the platform does not create an engagement, and that users should ask their advocate about confidentiality before sharing sensitive material. Dated risk acceptance recorded.

---

### 3.11 OL-11 — Cross-border OCR and LLM processing

**3.11.1 Short description**
Document text extraction (OCR) and AI tasks require third-party processors. The project intends India-region processing where available and contractual no-training and minimal-retention terms in all cases; the fallback where an India region is unavailable is unresolved.

**3.11.2 Relevant architecture references**
SDAS §13.1 (AI task envelope, provider constraints), §18.3–18.4 (regional considerations, sub-processor register), §11 (what is sent), §24 item 11.

**3.11.3 Relevant product references**
MPS §12 (AI contract), §17 (OCR pipeline), §18; DL D-017; RR R21, R29; BB2 §6–7 (M2, M3), §14.3 FD-03.

**3.11.4 Why the question exists**
Vendor selection is an early, sticky decision, and the material being sent is among the most sensitive the product holds. The project does not know what is permitted, what must be disclosed, and what contractual terms are required.

**3.11.5 Implementation decisions that depend on the answer**
- Provider selection for OCR, language models and embeddings (FD-03 in the build plan).
- Whether processing outside India is permitted at all, and if so with what disclosure and safeguards.
- What the AI-assistance notice must tell users (provider identity, region, retention, training).
- Whether additional minimisation (redaction before sending, sending derived text rather than images) is required rather than merely prudent.
- Required contract terms and the sub-processor register format.
- Whether organisation tenants may demand India-only processing as a contractual matter.

**3.11.6 Blocking milestone(s)**
M2 (OCR provider) and M3 (model and embedding providers).

**3.11.7 Risk severity**
High: the decision is expensive to reverse after data exists.

**3.11.8 Questions for counsel**
1. Is processing of this material by providers outside India permitted, and subject to what conditions?
2. What must be disclosed to users, and where — in the notice, in the AI-assistance consent, or both?
3. What contractual terms are required (no training, retention, deletion, sub-processing, audit, incident assistance, jurisdiction)?
4. Are additional minimisation measures required before sending material to a processor?
5. Does the analysis differ for OCR of raw images versus text sent to a language model?
6. What sub-processor record must be maintained and published, if any?
7. Are there sectors or data types within dispute files that should never leave India, or never be sent to a third-party processor at all?

**3.11.9 Required answer format**
A permissibility statement, a required-disclosure list, a required contract-terms checklist, and any mandatory minimisation measures marked "required before pilot".

**3.11.10 Acceptable interim risk-acceptance path**
Yes: pilot with **India-region processing only** for OCR and models; if no India-region option exists for a needed capability, that capability is disabled rather than sent abroad (manual mode remains fully functional). Dated risk acceptance recorded.

---

## 4. Blocking-milestone matrix

| Milestone (BB2) | Blocking OL items | Effect if unresolved |
|---|---|---|
| M0 Foundation | OL-05 (configuration), OL-04 (notice content, indirect) | Build on conservative defaults; notices provisional |
| M1 Dispute Core | OL-01 (notice/intake wording, indirect) | Build proceeds; text may change |
| M2 Evidence Pipeline | OL-11 | Provider choice deferred or India-only default |
| M3 AI Foundation | OL-11 | AI capabilities disabled if no compliant provider |
| M4 Reviewer Seat | OL-09, OL-10 | Build with no identity display and conservative warnings |
| M5 Exports + Integrity | OL-08 | Ship minimal integrity wording only |
| M6 Deletion + Recovery | OL-02, OL-03, OL-06 | Short retention defaults, no tombstone hash, owner-only holds |
| M7 Pilot Readiness | OL-01, OL-02, OL-04, OL-05, OL-06, OL-07, OL-08 (and any item still open) | **G-PILOT cannot pass** without closure or dated risk acceptance for every open item |

Cross-reference: BB2 §14.2 carries the same register; this brief is the counsel-facing expansion of it.

---

## 5. Recommended counsel specialisations

| Workstream | Specialisation sought | Items | Notes |
|---|---|---|---|
| A. Data protection and cyber | Indian privacy/data-protection practice with DPDP implementation experience and familiarity with CERT-In directions; ideally experience advising small technology businesses | OL-01, OL-02, OL-03, OL-04, OL-05, OL-06 (privacy limb), OL-07, OL-11 | Expected to be the larger engagement |
| B. Professional conduct and evidence | Practising advocate with litigation practice and familiarity with Bar Council conduct rules and electronic-evidence practice in Indian courts | OL-08, OL-09, OL-10, OL-06 (practice limb) | Can be a shorter, focused engagement |
| C. Optional later | Commercial/IT contracts counsel for vendor terms arising from OL-11 and OL-05 | — | Only after workstream A |

The two workstreams can run in parallel; OL-06 needs both and should be sequenced after the privacy limb is answered.

---

## 6. Required deliverables from counsel

For each item: a written answer in the format stated in that item's §3.x.9, plus:

1. **A single consolidated matrix** (per workstream): OL item → answer summary → required product action → "required before pilot" or "by date" → source provisions relied on.
2. **Approved user-facing wording** (Hindi and English, or English with a translation brief) for: privacy/consent notices, retention policy, deletion status messages, integrity statement, share warning, reviewer acceptance terms, staff-access statement.
3. **A contract-terms checklist** for processors and hosting vendors (from OL-11 and OL-05).
4. **A "must not say / must not build" list**, so the product can encode it as a permanent constraint.
5. **A list of assumptions** counsel relied on, and the triggers that would require re-advice.
6. **A review date** for each answer.

Format preference: markdown or a Word document with numbered items matching OL-01…OL-11 so that answers can be mapped into the build documents without re-interpretation.

---

## 7. Risk-acceptance framework

Where an item cannot be closed before pilot, the founder may record a **dated risk acceptance** only under these conditions [product governance rule, not legal advice]:

1. The item's interim path in §3.x.10 is adopted in full, and the interim path is the conservative option in every case.
2. The acceptance is written in a `risk_acceptances` record: item, decision, reason, interim controls, owner, date, review date (not later than the end of the pilot).
3. Items marked **Critical** (OL-01, OL-04) are **not** eligible for risk acceptance as a route into the pilot; the pilot waits.
4. The pilot cohort is small, informed, and covered by a written pilot agreement.
5. Any item left open is re-raised before any expansion beyond the pilot, and before any feature in the deferred register is built.
6. Risk acceptances are reviewed together at pilot exit; an unreviewed acceptance blocks the next phase.

---

## 8. Open questions register (beyond OL-01…OL-11)

These are recorded for completeness; they are not part of this engagement unless counsel advises otherwise.

| ID | Question | Origin | When needed |
|---|---|---|---|
| OL-12 | Disputes involving minors: whether to exclude such disputes from MVP, and what verification obligations would otherwise arise | SDAS §24 item 12 | Before pilot |
| OL-13 | Special handling for the founder's private criminal matter used as an internal evaluation case under a restrictive protocol | SDAS §24 item 13; DL D-005 | Before that evaluation |
| OL-14 | Status of draft court regulations on AI use, and any future disclosure obligations for advocate-facing drafting features | SDAS §24 item 14 | Monitor; before any Tier-2 feature |
| OL-15 | Whether the founder's existing entities or a new entity should operate NyayOS, and consequent governance obligations | This brief | Before pilot contracts |
| OL-16 | Pilot agreement and terms of service drafting (users and reviewers) | This brief | Before pilot |
| OL-17 | Professional-conduct opinion for any future advocate directory, matching, engagement requests or fee flows | EAR §23 item 1 | Before Phase 3 |

---

## 9. Final handoff to M365 Copilot

**Deliverable:** `NYAYOS_COUNSEL_BRIEF_V1.md` (this file), suitable to send to external counsel as-is.

**State:** NyayOS remains pre-build. This package asks questions; it contains no legal conclusions, no compliance claims and no legal advice.

**To record:**
1. Eleven legal dependencies (OL-01…OL-11) are now framed with product impact, blocking milestones, counsel questions, answer formats and interim paths.
2. Two workstreams: (A) privacy/data-protection counsel — eight items; (B) practising advocate — three items plus the practice limb of OL-06.
3. OL-01 and OL-04 are **Critical** and are not eligible for risk acceptance as a route into the pilot.
4. Six further items (OL-12…OL-17) are registered for later.
5. Next action is founder-only: engage counsel for workstream A and workstream B (build-plan decision FD-09), and instruct on scope and budget.
6. On receipt of counsel's answers, the next specialist task is to reconcile them into SDAS, BB2 and the product notices — recorded as a future assignment, not started here.

**Confirmation:** no code, no repository work, no commits, no deployment, no database writes; no legal opinions or compliance claims were generated.
