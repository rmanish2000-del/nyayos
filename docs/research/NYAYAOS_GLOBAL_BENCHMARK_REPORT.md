# NYAYAOS Global Benchmark Report

**Judicial AI · Court AI · Online Dispute Resolution · Litigation Intelligence · Citizen Legal Assistants**

| Field | Detail |
| --- | --- |
| Markets | United States · United Kingdom · Singapore · Estonia · United Arab Emirates · China |
| Purpose | Map current state, gaps, and future opportunities for NYAYAOS |
| Horizon | 2026–2030 |
| Classification | Opportunity intelligence / market-entry brief |
| Date | 20 September 2026 |
| Source set | Official judiciary and ministry publications, legislation, court guidance, reputable press, academic and think-tank surveys through mid-September 2026 |

---

## 1. Why this report exists

NYAYAOS is positioned as a **justice operating system**: not a single chatbot, but a stack that can sit under courts, registries, dispute platforms, law firms, and unrepresented citizens. The six markets in this brief were chosen because they are not the same product problem.

- **USA** is a fragmented, procurement-heavy market with a modernisation wave and a litigation-intelligence industry already in place.
- **UK** is a rules-first digital-justice market: HMCTS platforms plus a new Online Procedure Rule Committee.
- **Singapore** is a small, high-trust laboratory that already buys and pilots private legal AI inside courts.
- **Estonia** is a paperless-state market writing AI into a 2024–2030 court plan and opening free legal-aid chat.
- **UAE** is a capital-rich, top-down buyer of “world-first” integrated judicial platforms.
- **China** is the only market that has already industrialised court AI at national scale — and is therefore both a competitor reference and a hard market to enter.

The question is not “does AI exist in courts?” It does, everywhere. The question is **where a platform like NYAYAOS can still own a layer** — filing quality, multilingual procedure, ODR orchestration, citation-grounded research, or citizen-facing legal help — without colliding with a national monopoly or a forbidden use-case.

---

## 2. How to read the five product lines

These five labels are used consistently across countries.

| Line | What it means in practice | Typical buyer |
| --- | --- | --- |
| **Judicial AI** | Tools used *by judges and judicial officers*: research, first-draft judgments, listing, sentencing support, red-teaming of reasons, translation on the bench | Supreme / high / state courts, judicial academies |
| **Court AI** | Tools used *by the institution*: e-filing QA, defect detection, transcription, anonymisation, case clustering, bench allocation, CMS copilots | Court administration, CIOs, registries |
| **Online dispute resolution (ODR)** | End-to-end digital pathways that resolve a dispute without a full trial: negotiation, mediation, small-claims platforms, possession / money claims | Ministries of justice, court digital programmes, ADR centres, platforms |
| **Litigation intelligence** | Analytics on judges, opposing counsel, venues, outcomes, dockets, and document corpora for *advocates and institutions* | Law firms, in-house counsel, litigation funders, prosecutors |
| **Citizen legal assistants** | Plain-language help for people who will never hire a lawyer: triage, form-fill, procedure coaching, legal-aid front doors | Legal aid bodies, courts (SRL tools), consumer agencies, municipalities |

**Hard constraint observed in every market except parts of China:** AI may assist administration and drafting. It must not *decide* the case. Platforms that market “robot judges” are politically dead on arrival in USA, UK, Singapore, Estonia, and the UAE.

---

## 3. Snapshot: who is ahead on what

| Capability | USA | UK | Singapore | Estonia | UAE | China |
| --- | --- | --- | --- | --- | --- | --- |
| National court-AI doctrine | Fragmented (task force + state patchwork) | Strong (Judicial Guidance Oct 2025 + MoJ AI Action Plan) | Strong (Courts GenAI Guide 2024 + MinLaw Guide Mar 2026) | Plan-led (Courts 2024–2030) + EU AI Act | Emirate-led; DIFC has practitioner guidance | Strongest (SPC 2022 AI Opinions + Sep 2026 AI-dispute Opinions) |
| Production court AI (not pilots) | Uneven; NJ and 5th Circuit visible; federal CMS rebuild | Copilot for all judges; transcription + listing pilots | Harvey in SCT; LawNet GPT-Legal | Salme transcription; Krat anonymisation; payment orders | ADJD “AI judicial platform” rolling from Sep 2026 | National Smart Courts; Shenzhen LLM stack; Internet Courts |
| Mature ODR statute / platform | State court ODR + private platforms; no federal ODR code | Online Procedure Rules in force 7 Sep 2026; OCMC / possession | SCT + SIMC MAIA; managed digital services | e-File payment orders ≤ €8,000; ODR planned in phase 2 | Federal mediation law + remote sessions; DIFC Mediation Centre | Internet Courts + platform ODR + digital-economy arbitration |
| Litigation intelligence industry | Deepest (PACER/RECAP, CourtListener, UniCourt, commercial AI) | Strong private market; weaker public docket APIs | LawNet + Harvey + firm tools | Thin commercial market | Emerging (Legaline, DIFC/ADGM data) | State-owned judicial data lakes; limited foreign access |
| Citizen / SRL assistants | High demand, high UPL risk; pro se AI filings exploding | Citizens Advice Caddy; SRA-approved AI law firm; LiP chaos | Harvey for SCT users from Nov 2025; Divorce AIDE | State legal-aid chatbot from Jan 2026 + juristaitab.ee | Smart advisory + Legaline marketplace | Court apps / virtual guides; tightly state-shaped |
| Openness to a foreign justice OS | Possible via state pilots and vendors; long security review | Possible as a *module* under HMCTS / OPRC data standards | Highest cultural fit; already pays foreign legal AI | Possible as EU-compliant module inside e-File / AI-TAB | Highest cheque size; relationship-driven | Effectively closed for sovereign court stack |
| 2026–28 opportunity grade for NYAYAOS | **A−** (modules, not the OS) | **A** (ODR + transcription + LiP guardrails) | **A** (already the reference buyer profile) | **A−** (phase-2 plan needs vendors) | **A** (platform implementation window) | **C** (learn; do not expect court-core entry) |

---

## 4. United States

### 4.1 Judicial AI

The federal judiciary is writing the rulebook *after* the accidents. A 24-member AI task force chaired by Ninth Circuit Judge Sidney Thomas has identified **60+ issues** and issued **~30 recommendations** so far. Interim guidance (July 2025) is clear: **do not delegate core judicial functions** — deciding cases, writing dispositive orders without verification. Staff use that produced fabricated citations forced the issue into the open.

What is actually happening on the bench:

- New Jersey courts scaled an internal generative-AI tool from 11 users in early 2025 to **2,000+** court users, with mandatory training.
- A Judicial Artificial Intelligence Consortium (federal magistrate + state appellate judges) is forming a peer network.
- Proposed **Federal Rule of Evidence 707** would require reliability hearings for AI-generated evidence that lacks a human expert.
- The 10th Circuit (Sep 2026) proposed the first circuit-wide rule requiring lawyers *and* pro se litigants to certify that AI-assisted filings were human-verified. Effective target: 1 January 2027. The 5th Circuit abandoned a similar rule after bar pushback — proof that the market is not uniform.

**Opportunity:** a **judge-side research and draft-check copilot** that is citation-grounded against primary sources (CourtListener / RECAP / official reporters), logs every retrieval, and refuses to invent authorities. US judges do not want a decision engine. They want a clerk that cannot hallucinate.

### 4.2 Court AI

The largest court-tech programme in the country is not generative AI. It is the **Case Management Modernization (CMM)** rebuild of CM/ECF / PACER, fast-tracked after repeated security failures, with a 2027 target. Ohio’s 2026 C-Track / Thomson Reuters vendor breach (10 of 12 appellate districts) is the cautionary tale: court data + vendor AI is now a political risk.

Visible production use:

- 5th Circuit AI helper for attorneys to file documents correctly.
- State-court “AI readiness” programmes run by the National Center for State Courts (NCSC) and the TRI/NCSC AI Policy Consortium.
- Standing discovery orders that ban dumping produced documents into *public* AI tools (e.g. *Jeffries v. Harcros*, D. Kan. 2026; *Morgan v. V2X*, D. Colo. 2026).

**Opportunity:** **filing-defect detection, e-filing QA, and private-cloud transcription/anonymisation** that can plug into CMM and state CMS replacements. The buyer is the circuit/state CIO, not the Chief Justice. Security architecture (no training on case files, deletion on request, FedRAMP/CJIS language) is the product.

### 4.3 Online dispute resolution

The US invented commercial ODR (Modria, Cybersettle, SquareTrade, eBay/PayPal). Court ODR is real but **state-by-state**: Michigan, Ohio, Utah, Texas and others run Matterhorn-style platforms for tickets, small claims, family and debt. There is still **no federal ODR code**. The EU shut its consumer ODR portal in July 2025; the US never built one.

A parallel federal monster is the No Surprises Act Independent Dispute Resolution system: **2.56 million dispute initiations in 2025** — 115× the original government forecast. That is ODR at industrial volume, poorly instrumented.

**Opportunity:** (1) **AI-native small-claims / debt / landlord-tenant ODR** sold to mid-size state courts that missed the first Matterhorn wave; (2) vertical ODR for high-volume federal ADR schemes (healthcare IDR, consumer finance); (3) an “asynchronous online trial” module — several US vendors have this on 2026 roadmaps.

### 4.4 Litigation intelligence

This is the most mature US line, and the hardest to displace at the top end.

- CourtListener / Free Law Project shipped a **ChatGPT Enterprise + MCP plugin** (Sep 2026) grounding answers in case law, RECAP PACER filings, citation networks and oral-argument transcripts.
- UniCourt launched a ChatGPT plugin over **2 billion dockets / 5,000+ courts / 46 states**.
- Commercial stacks (Lexis+ AI, Westlaw Precision, Harvey, CoCounsel, Relativity) already own large-firm budgets.

Thomson Reuters research finds **pro se docket entries per court up ~158–179%** versus pre-ChatGPT baselines, and AI-detectable text in roughly **one in five complaints by early 2026**. The intelligence problem is no longer “find the case.” It is “verify the brief, score the judge, and triage the flood of AI-written pro se paper.”

**Opportunity:** do not try to out-docket UniCourt. Build the **verification + strategy layer**: citation auditor, judge-motion grant rates, opposing-counsel playbooks, and a “hallucination firewall” that firms and courts both need because Rule 11 / circuit certification rules are arriving.

### 4.5 Citizen legal assistants

Demand is violent. Supply is legally radioactive.

Unauthorized practice of law (UPL) is still a 50-state minefield. DoNotPay-style products have already been sued. Self-represented litigants are dumping 300-page ChatGPT skeletons into tribunals (the UK example is famous; US courts see the same pattern weekly). Certification of “legal AI assistants” for unrepresented people is an active academic/policy proposal, not law.

**Opportunity:** a **court-blessed SRL coach** — procedure only, jurisdiction-specific forms, no outcome prediction marketed as advice — sold *to the court* rather than to the consumer. That sidesteps UPL. Pair it with a certified-citation mode so the court’s own tool does not generate the fake cases judges are sanctioning.

### 4.6 US opportunity brief for NYAYAOS

| Play | Window | Motion |
| --- | --- | --- |
| Citation-grounded judicial copilot (on-prem / private cloud) | 2026–27, while task-force guidance is still forming | Partner with NCSC / a state AOC, not DOJ |
| E-filing defect + AI-disclosure checker | Immediate — 10th Circuit rule and standing orders | Module for CM/ECF successor and state e-file |
| State-court ODR for debt / housing / small claims | 2026–28 | Compete with Matterhorn on multilingual + AI mediation |
| Hallucination firewall for firms and courts | Immediate | API, not a destination website |
| Consumer legal assistant | Only via legal-aid / court channel | Avoid direct-to-consumer UPL |

---

## 5. United Kingdom

### 5.1 Judicial AI

England and Wales is the cleanest “rules then tools” jurisdiction in this set.

- **AI – Judicial Guidance (October 2025)** is the working constitution for the bench. Public chatbots = treat anything you type as published. Confidential case material stays out.
- Every judicial office holder has **Microsoft Copilot Chat** in a secure tenant. 300+ leadership judges have extra functions.
- Judiciary + HMCTS + MoJ AI unit are building a **cross-jurisdictional bespoke judicial AI tool**.
- Concrete pilots: near-instant **AI transcription** in the First-tier Tribunal Immigration and Asylum Chamber; **judgment anonymisation**; a Crown Court **listing predictor** (trial duration, cracked/ineffective probability).
- Lady Chief Justice evidence to the Justice Select Committee (Nov 2025) put this on the parliamentary record.

The culture is explicit: AI for administration and first drafts; **never for the decision**. *Ayinde v Haringey LBC* [2025] EWHC 1383 (Admin) and *Hancox v Sutherland* (EAT, Sep 2026 — 300-page ChatGPT skeleton) are the enforcement cases vendors should read before writing a single marketing sentence.

### 5.2 Court AI

The MoJ **AI Action Plan for Justice** (July 2025, three-year roadmap) and HMCTS’s Responsible AI Framework (steering group from June 2025) are the procurement documents. Named use-cases: document processing, anonymisation, transcription, judicial task assistance, CMS search. Named non-use: judicial decision-making.

Operational colour from the 2025–26 HMCTS annual report:

- CAFS digital file transfer rolled out Dec 2025–Apr 2026 in civil.
- Detained immigration appeals went digital Nov 2025.
- County Court is under political pressure for a “root-and-branch review” that must include AI (Justice Committee recommendation: launch by Spring 2026).

**Opportunity:** NYAYAOS as a **sovereign court copilot** that satisfies the Judicial Guidance constraints (UK-hosted, no training on filings, full audit trail) and plugs into HMCTS data standards rather than replacing Common Platform / CJS.

### 5.3 Online dispute resolution

This is the UK’s structural opening.

- **Judicial Review and Courts Act 2022** created the Online Procedure Rule Committee.
- First specified proceedings: possession (SI in force May 2025; first rules consulted Dec 2025–Jan 2026).
- **Online Procedure (Rules and Practice Directions) Rules 2026** (SI 2026/696) **came into force 7 September 2026**. Everything in online proceedings happens on an HMCTS digital service on GOV.UK. The overriding objective is resolution *by digital means, before or after issue*.
- Possession / property platform first iteration: late spring 2026, then rules-backed from September.
- Online Civil Money Claims (OCMC) and Damages Claims Portal are being extended to April 2027; solicitor use of OCMC is increasingly mandatory; small-claims mediation is being wired in as opt-out / automatic stay in some tracks.
- County Court claims Apr–Jun 2026: **571,000** (+11% YoY), of which **495,000 money claims** (+13%). Median small-claim issue-to-trial: 41 weeks. That is the backlog ODR is supposed to eat.

**Opportunity:** the OPRC will publish **data standards for interoperability between dispute-resolution providers and HMCTS**. That is a rare statutory hook for a third-party ODR engine. NYAYAOS should treat OPRC standards as a product requirement, not a compliance afterthought. Highest-value verticals: possession (Renters’ Rights Act from 1 May 2026 will rewire landlord-tenant volume), small money claims, family private law.

### 5.4 Litigation intelligence

The UK has world-class commercial legal AI (Harvey, Legora, and London offices of US platforms) and a weaker *public* docket graph than PACER. BAILII / The National Archives / ICLR are the public corpus. Courts do not yet expose a UniCourt-grade API.

**Opportunity:** a **UK litigation graph** — judge, chamber, practice direction, outcome — sold to the mid-market Bar and in-house teams who will not pay US-enterprise prices. Secondary: an AI-filing linter that checks PD compliance (page limits, authorities, statement of truth) before a skeleton hits CE-File. *Hancox* is the sales deck.

### 5.5 Citizen legal assistants

- Citizens Advice is rolling out **Caddy**, an AI assistant for frontline advisers grounded in verified sources.
- The SRA approved the first **AI-native law firm** for debt recovery through small claims — a Commonwealth first, and a regulatory signal that “AI + human sign-off” can be a regulated service, not just a toy.
- LiP misuse is now a weekly news story. The official response is guidance and sanctions, not a court-issued citizen assistant of Singapore’s quality.

**Opportunity:** a **GOV.UK-grade LiP assistant** for OCMC / possession / employment tribunal, trained only on legislation, practice directions and official forms, with a hard “this is information, not advice” layer and an optional handoff to Citizens Advice or a regulated firm. Sell it to HMCTS or MoJ as an access-to-justice control, not as a consumer app.

### 5.6 UK opportunity brief for NYAYAOS

| Play | Window | Motion |
| --- | --- | --- |
| OPRC-compliant ODR module (possession, money, family) | 2026–28 — rules just turned on | Standards-first partnership with an HMCTS supplier |
| Secure judicial / staff copilot | Now — Copilot is the floor, bespoke tool is the ceiling | Meet Judicial Guidance + MoJ Responsible AI Framework |
| Transcription + anonymisation at hearing scale | Now — IAC pilot wants to generalise | Tribunal-first, then Crown / Family |
| LiP filing coach + hallucination linter | Immediate political demand | Court or legal-aid channel |
| Listing / workload intelligence | Crown Court pilot is the wedge | Do not brand as “predict the verdict” |

---

## 6. Singapore

Singapore is the closest thing this set has to a **reference customer** for NYAYAOS: a judiciary that already signs MoUs with foreign legal-AI vendors, publishes user guides instead of bans, and treats small claims as the sandbox.

### 6.1 Judicial AI

- Justice Aidan Xu (Judge in Charge of Innovation and Transformation) has publicly described two experiments (July 2025): **first-draft judgments** that a judge then rewrites, and **red-teaming** — generating draft reasons for *opposite* outcomes to stress-test the real one.
- Courts have evaluated GovTech **Pair Search** over Hansard, Supreme Court judgments and legislation.
- Culture: curiosity plus “lawyer/judge in the loop.” Sanctions for fictitious authorities are real — *Tajudin v Suriaya* [2025] SGHCR 33 and the *Tan Hai Peng Micheal* sequence (2025–26) are the local *Mata v Avianca*.

### 6.2 Court AI

- **Harvey AI** MoU with the Singapore Courts (2023), renewed and expanded September 2025.
- From Sep 2025 Harvey is on the **Small Claims Tribunals magistrates’** desk: summaries of messy consumer evidence (WhatsApp, email), translations across English / Chinese / Malay / Tamil.
- Attorney-General’s Chambers internal tools: CaseEdge (judgment summariser), Prollie (criminal-law chatbot), drafting aides for representations, bills, treaties.
- LawNet **GPT-Legal Q&A** (SAL, July 2025) — answers grounded in LawNet, not the open web.

This is court AI as a **managed digital service**, not a black-box adjudicator. That is the product language NYAYAOS should copy.

### 6.3 Online dispute resolution

Singapore does not run a China-style internet court. It runs high-quality, human-chaired digital processes:

- Small Claims Tribunals (claims to S$20,000, or S$30,000 by consent; **no lawyers**).
- Singapore International Mediation Centre **MAIA / MAIA 2.0** (launched 2024, upgraded at Singapore Convention Week 2025) — a mediator’s AI assistant, not a robot mediator.
- Community and tribunal pathways that already assume electronic filing and remote appearance.

**Opportunity:** an **SCT-class ODR + mediation copilot** that can be white-labelled for other ASEAN tribunals. Singapore will not rip out Harvey tomorrow; it *will* listen to a complementary module (multilingual evidence packs, settlement-range explainer, async negotiation).

### 6.4 Litigation intelligence

LawNet is the incumbent research graph. Harvey, RelativityOne and similar tools are inside the large firms (Rajah & Tann and peers have said so on the record). MinLaw’s **Guide for Using Generative AI in the Legal Sector (6 March 2026)** explicitly lists litigation analytics as an in-scope use-case, with a risk split: human-*in*-the-loop for court submissions, human-*on*-the-loop for low-risk admin.

**Opportunity:** a **cross-border disputes intelligence** layer for SIAC / SIMC / SICC work — ASEAN + India + Middle East authorities — rather than another LawNet clone.

### 6.5 Citizen legal assistants

This is Singapore’s distinctive move.

- Harvey-based **SRL tool for SCT users** opened to individuals from **November 2025**: what evidence to file, how to structure a submission, summary of the other side, *and* a success-probability view.
- Legal Aid Bureau **Divorce AIDE** — non-binding asset-division estimator for standard cases.
- Machine translation is treated as access infrastructure, not a nice-to-have.

The state is willing to put generative AI in a citizen’s hands *inside a tribunal that already bars lawyers*. That is the product-market fit NYAYAOS should study line by line.

### 6.6 Singapore opportunity brief for NYAYAOS

| Play | Window | Motion |
| --- | --- | --- |
| Second-source / complementary court AI after Harvey | 2026–27 renewal cycles | Start with translation + evidence packaging, not “replace Harvey” |
| Export the SCT citizen-assistant pattern | Immediate | Use Singapore as the reference implementation in other small-claims systems |
| Judicial draft + red-team workbench | Soft opening — already being discussed by Justice Xu | Research partnership with AGC / judiciary innovation office |
| SIAC / SIMC disputes intelligence | Always-on | Ride Singapore Convention / international mediation growth |
| ASEAN localisation of the same stack | 2027–29 | Singapore credibility is the visa |

**Strategic note:** open-source and press reporting in 2025 already claimed Indian judicial-AI vendors had a paid relationship with the Supreme Court of Singapore. Whether or not that is NYAYAOS, it proves the channel exists: Singapore will pay a foreign specialist if the tool is court-shaped, multilingual, and human-supervised.

---

## 7. Estonia

Estonia is the opposite of the US: tiny caseload, complete digital spine, EU-regulated, and mid-plan on AI. The 2019 “robot judge” story was officially denied by the Ministry of Justice and should never appear in a NYAYAOS pitch.

### 7.1 Judicial AI

**Judicial Development Plan 2024–2030** is the governing document. Two phases:

1. **Now–near:** translation, transcription, anonymisation, document handling, structured submissions, AI-assisted drafting, fee / claim / legal-aid calculations.
2. **Next:** simple-procedure management, case monitoring, evidence analysis, summarisation, legal research, *draft decisions in standardised cases*, and **AI-supported ODR**. Judges keep the last word. The plan even leaves a crack open: AI may one day run standard matters with no discretion end-to-end, with humans only on dispute or appeal.

That second sentence is the most ambitious official language in Europe. It is also constrained by the **EU AI Act** (high-risk obligations from 2 August 2026) and the Personal Data Protection Act ban on solely automated decisions without human involvement.

### 7.2 Court AI — what is already in production

- **Salme** — nationwide hearing transcription in all nine county and district courts. ~92% raw accuracy, seconds of lag, clerk correction. Built by CGI Estonia + Tilde.
- **Krat** — judgment anonymisation; used to clean and republish ~80,000 older decisions.
- Texta OÜ analytics for bulk anonymisation and labelling.
- Pilot: automatic extraction from crime reports (who / where / what / loss), document indexing, natural-language queries against justice databases (“average civil claim 2023?”).
- **Semi-automated payment orders** for monetary claims up to **€8,000**, filed only through e-File, handled by the Pärnu County Court Payment Order Department. The order is algorithmically prepared; humans still do jurisdiction and service. Parties are not always told the first pass is semi-automatic.

**Eesti.ai (Jan 2026)** adds budget and political cover. Two projects matter for NYAYAOS:

- Justice- and Digital-Ministry **law-making copilots** (impact analysis, conflict detection, EU vs Estonian law).
- **AI-TAB** — a central AI-tools service for the public sector, target **3,000 users by end-2027**.

### 7.3 Online dispute resolution

ODR is a *named phase-2 workstream* in the court plan, not a live national consumer portal. The payment-order machine is the existing ODR-like asset. EU consumer ODR died in July 2025; Estonia will not rebuild a Brussels portal. It will extend e-File.

**Opportunity:** a **phase-2 ODR module** for consumer, debt, and neighbour disputes that speaks X-Road / e-File, produces a structured file a judge can adopt, and is documented as “high-risk AI with human review” under the AI Act.

### 7.4 Litigation intelligence

Almost no commercial market. The state *is* the data owner. Text analytics and NL queries against the Court Information System are the beginning of a public litigation-intelligence layer.

**Opportunity:** sell **analytics-as-a-service to the Centre of Registers and Information Systems (RIK)** and the courts — workload, consistency, legal-aid targeting — not a Lexis competitor.

### 7.5 Citizen legal assistants

This is Estonia’s live experiment.

- From **January 2026** the Ministry replaced the income-capped human legal-advice queue with a **free legal chatbot for every resident**, built on the RIA virtual-assistant stack and grounded in *Riigi Teataja* (the official statute book). Human lawyers still review outputs and still take short questions via juristaitab.ee.
- Private **AI Jurist** products (e.g. seadusabi.ee, paid day-passes) already draft objections to bailiffs and sample statements of claim.
- Tallinn Administrative Court fined 10 applicants in 2026 for an AI-written complaint that cited **non-existent Estonian scientists** — the same hallucination pattern as everywhere else.

Human-rights monitors (Estonian Human Rights Centre, 2026 yearbook) are already warning that a chatbot is not a substitute for a counsellor. That tension is the design brief.

**Opportunity:** become the **grounded engine under the state chatbot** (statutes + selected case law + form assembly + escalation to a human) rather than a consumer brand. EU AI Act transparency rules for chatbots are already in force (Aug 2025).

### 7.6 Estonia opportunity brief for NYAYAOS

| Play | Window | Motion |
| --- | --- | --- |
| Phase-2 draft-decision + ODR engine for standardised civil work | 2026–30 plan money is being allocated now | Answer the AI Act file before the RFP |
| Salme-class hearing intelligence (transcript → issues → draft minute) | Immediate adjacent to an incumbent | Do not fight CGI/Tilde on raw ASR; take the layer above |
| State legal-aid LLM, citation-locked to Riigi Teataja | 2026 service is live and will need upgrades | Partner RIA / Justice-Digital Ministry |
| AI-TAB module for court staff | To 2027 user-number target | Be one of the ten pilot institutions’ tools |

Estonia will not write a large cheque. It will write a **reference implementation** that every other EU ministry of justice can copy. That is the real prize.

---

## 8. United Arab Emirates

The UAE is in a buying mood and is not embarrassed about announcing “world firsts.” Treat the press releases as signals of budget and political will, then read the footnotes: **judges still sign the judgment**, and the first platform is **Abu Dhabi, not the whole federation**.

### 8.1 Judicial AI

On **28 July 2026** Sheikh Mansour bin Zayed announced an **AI-powered judicial platform** for the **Abu Dhabi Judicial Department (ADJD)**, built with the Department of Government Enablement. Official description: first fully integrated system of its kind; decision *support* under full human validation.

Named functions:

- case-file and document analysis
- instant legislation retrieval
- precedent compare
- analytical recommendations
- drafting of memoranda and judicial documents

Phase 1 from **September 2026**, 18-month rollout. No announced extension to Dubai Courts, federal courts, Ras Al Khaimah, **ADGM**, or **DIFC**. Those last two are English-language common-law islands with their own CMS and their own AI problems (ADGM has already issued wasted-costs orders for hallucinated authorities: *Arabyads*, 2025).

GITEX 2025 “Court of the Future” demo from the Ministry of Justice went further in theatre (facial recognition at the door, no paper, lawyer-optional simulation). Theatre is not a contract. ADJD is.

### 8.2 Court AI

The UAE already has digital litigation, remote hearings, smart advisory, and e-services. ADJD’s platform is an attempt to **unify those into one AI spine**. Dubai and the federal system will be forced to answer it. Public Prosecution’s **Bayan Smart Translation Centre** is the language wedge.

DIFC Courts: AI-enabled CMS, and **Practical Guidance Note No. 2 of 2023** on LLMs — disclosure of AI-generated content, source, and limitations. Still the only detailed practitioner note in the country as of early 2026.

**Opportunity:** NYAYAOS as an **implementation partner / second-emirate stack**. Abu Dhabi has a flagship. Dubai Courts, the Federal Judiciary Council, and the northern emirates will not want to look analogue. ADGM/DIFC want common-law, English, disclosure-friendly tools that do not feed a mainland Arabic model with privileged files.

### 8.3 Online dispute resolution

Legislative pipes are new and usable:

- **Federal Decree-Law No. 40 of 2023** on mediation and conciliation, operationalised by Federal Judiciary Council decisions in Jan 2026 (centres in Ajman, Fujairah, UAQ, Dibba; remote sessions via UAE PASS / Emirates ID; no recording; e-notifications; online mediation platform).
- **Dubai Law No. 9 of 2025** amending the 2021 conciliation law — mandatory conciliation buckets (personal status, presidential referrals, party agreement) through the Centre for Amicable Settlement of Disputes.
- **DIFC Mediation Service Centre** (Sep 2025) on the back of Dubai Law No. 2 of 2025, with online meetings inside the upgraded CMS.

**Opportunity:** the federal “online platform for mediation and conciliation” is a specified deliverable. An Arabic + English **mediation OS** (intake, issue framing, option generation, draft settlement with enforceable formula) is a cleaner first contract than “replace the judge’s brain.”

### 8.4 Litigation intelligence

The hard problem is **33+ rule-sets**: federal law, seven emirates, DIFC, ADGM, 40+ free zones, three working languages. Local AI-native platforms (e.g. Legaline) are pitching exactly that fragmentation. Precedent retrieval across those silos is still poor.

**Opportunity:** a **multi-jurisdictional UAE authority graph** — federal, Dubai, Abu Dhabi, DIFC, ADGM — with language-accurate headnotes. That is litigation intelligence the global firms in DIFC will pay for, and that ADJD’s platform will eventually need if it wants “rapid comparison of precedents” to mean something.

### 8.5 Citizen legal assistants

Smart legal-advisory services already exist as government products. The private market is a bidding marketplace plus chat. UPL is a softer constraint than in the US, but **Arabic plain language + UAE PASS identity** are table stakes. Family and labour disputes, not construction arbitration, are the citizen volume.

### 8.6 UAE opportunity brief for NYAYAOS

| Play | Window | Motion |
| --- | --- | --- |
| ADJD platform implementation / module supply | Sep 2026 – early 2028 | Government-enablement relationship, bilingual team on the ground |
| Dubai / federal “answer to Abu Dhabi” | 2027 | Do not wait to be invited; take mediation + translation first |
| DIFC / ADGM common-law copilot with disclosure logging | Immediate | Different product, different data residency |
| Multi-jurisdiction authority graph | 2026–28 | Sell to firms *and* courts |
| Arabic citizen assistant for labour / tenancy / personal status | Parallel to mediation centres | Identity-bound, not anonymous web chat |

Cheque size is the highest in this set. Sales cycle is relationship- and demonstration-driven. A working Singapore or India court reference is worth more than a white paper.

---

## 9. China

China is the **scale benchmark**, not the addressable market for a foreign justice OS. Read it to know what “done” looks like — and to know what NYAYAOS should not claim.

### 9.1 Judicial AI

Two layers of doctrine:

- **SPC Opinions on Regulating and Strengthening AI in Judicial Fields (2022)** — in-depth integration across adjudication, enforcement, litigation services, court management, social governance. Smart Courts as national policy.
- **SPC Opinions on Adjudicating AI-Related Disputes (7 September 2026, Fa Fa [2026] No. 10)** — 24 provisions on personality rights, personal information, IP, consumer protection, autonomous vehicles, *and the use of AI in judicial proceedings*. AI-generated court documents and case-search reports must be verified before filing; AI assistance explained; integrity of electronic evidence traced across generation, collection, storage and transmission.

Xiamen Maritime Court (Sep 2025 trial guidelines) already required full disclosure of counsel’s AI use. Shanghai and Shenzhen are the showcase courts.

Shenzhen Intermediate People’s Court (May 2026): a domain-specific judicial LLM covering **85 procedures** across civil, administrative and criminal work. Official claim: judges handled **744 cases each in 2025**, **+249 versus 2024**, ~50% throughput gain, now being copied to “dozens more cities.” Treat the percentage as a political statistic; treat the *scope* (85 procedures) as the real signal.

Shanghai First Intermediate / International Commercial Court: knowledge-graph recommendations, real-time alerts, transparent AI translation glass for foreign parties. 2025 judgments already landing in UNCITRAL CLOUT.

### 9.2 Court AI

**Smart Courts** are a finished national programme in a way no Western system can match: online filing, service, evidence exchange, hearings, judgment publication, enforcement platforms. SPC’s **Judicial Knowledge Services Platform** stitches iFLYTEK, Hanvon, Alibaba DAMO, Hikvision, Taiji into a shared image/text/speech/video layer.

This is court AI as **state infrastructure**. A foreign OS does not get to be that infrastructure.

### 9.3 Online dispute resolution

China’s ODR is not a start-up category. It is how the courts absorbed platform capitalism.

- Hangzhou, Beijing, Guangzhou **Internet Courts** (from 2018). From **1 November 2025** their exclusive docket was *narrowed toward hard digital questions* — personal data, online unfair competition, data/virtual-asset ownership and infringement — and routine e-commerce / small lending / simple copyright was pushed back to local courts. Foreign-related internet civil cases stay with the Internet Courts.
- Platform mediation inside Alibaba / WeChat ecosystems, with court recognition pathways.
- **Beijing Arbitration Commission Digital Economy Arbitration Rules** in force **1 January 2026** — first dedicated digital-economy arbitration code in China: compressed response windows, asynchronous hearings, API evidence, blockchain hashes.

**Lesson for NYAYAOS:** ODR that lives *only* as a private website dies. ODR that emits a structured file a court will enforce lives.

### 9.4 Litigation intelligence

The state owns the judicial data lake. “Similar-case” pushing, sentencing ranges, and quality-inspection against the mean are production features in many provincial systems. Foreign vendors cannot buy that corpus. “Rui Judge” and related drafting aides are domestic.

**Lesson:** litigation intelligence at national scale is a **data-rights problem** before it is a model problem. In markets NYAYAOS *can* enter, lock in data-sharing agreements early.

### 9.5 Citizen legal assistants

Court mobile apps, litigation-service centres, and (in some courts) virtual guides that walk a party through filing. The citizen is a user of a state service, not a customer of a start-up. That model will not travel intact to the US or UK. The UX pattern — guided filing, status push, plain-language notices — will.

### 9.6 China opportunity brief for NYAYAOS

| Play | Realistic? | Note |
| --- | --- | --- |
| Core Smart Court stack | No | Sovereign + vendor lock to domestic AI majors |
| Export *lessons* (procedure coverage, similar-case UX, internet-court docket design) | Yes | Product design input only |
| Cross-border commercial disputes touching Chinese parties | Limited | SICC / SIAC / DIFC positioning, not Beijing procurement |
| AI-dispute tooling (the Sep 2026 Opinions create a new case type) | Only via local counsel partnerships | Personality-rights injunctions against deepfakes, training-data fights |

**Do not** pitch NYAYAOS in China as a court OS. **Do** build a competitive-intelligence watch on Shenzhen/Shanghai feature lists — they are the unofficial product roadmap everyone else will be asked to match.

---

## 10. Cross-cutting findings

### 10.1 The world has converged on one sentence

> AI may prepare. A human must decide, and a human is responsible for every citation.

USA task-force guidance, UK Judicial Guidance, Singapore Courts GenAI Guide, MinLaw 2026 Guide, UAE ADJD talking points, SPC 2026 Opinions, EU AI Act, Estonian Constitution commentary — same sentence, different stationery. Any NYAYAOS screen that looks like a verdict button is a liability.

### 10.2 The real battleground is the *file*, not the model

Every serious programme is fighting the same objects:

1. incoming documents that may be AI-generated and wrong
2. transcripts that need to become minutes
3. authorities that need to exist
4. structured case data that CMS systems still do not have
5. a citizen who will not hire a lawyer and will paste ChatGPT into a form

NYAYAOS should productise those five objects, not “an LLM for law.”

### 10.3 Hallucination has become a market

Sanctions and wasted-costs orders exist in the US, UK, Singapore, UAE (ADGM) and Estonia. That creates a **verification product** courts and firms must buy. Citation-first architecture is not branding. It is the licence to operate.

### 10.4 ODR is splitting in two

- **Court-annexed digital procedure** (UK OPRC, Estonia e-File, Singapore SCT, UAE mediation centres, China Internet Courts).
- **Platform / sector ODR** (US healthcare IDR, global marketplaces).

The first is a standards and procurement game. The second is a volume and API game. NYAYAOS can play both, but not with one SKU.

### 10.5 Citizen assistants only work when a regulator holds the other end

Singapore (court-issued SCT tool), Estonia (ministry chatbot), UK (Citizens Advice + SRA-approved firm) are the workable patterns. US direct-to-consumer is a lawsuit. China is a state app. Design the channel before the model.

### 10.6 Language is an underrated moat

Singapore’s four-language SCT tool, UAE Arabic/English, Estonia Estonian + EU languages, UK Welsh + LiP plain English, US Spanish + pro se, China Putonghua + dialect + foreign commercial parties. A justice OS that is monolingual English is not global. Multilingual procedure — not multilingual marketing — is the feature.

---

## 11. Opportunity map for NYAYAOS (2026–2030)

Ranked by **fit × window × realistic entry**, not by market size.

### Tier 1 — move in the next 12 months

1. **Singapore complementary court / SCT module**  
   Translation, evidence packaging, SRL coach. Uses an existing judiciary that already buys foreign legal AI.

2. **UK OPRC-compliant ODR + LiP guardrail**  
   Possession and money claims under rules that went live on 7 September 2026. Data-standards work is the door.

3. **UAE mediation OS + ADJD module track**  
   Political tailwind, 18-month implementation clock started September 2026, bilingual requirement matches an India-origin multilingual stack.

4. **US citation auditor / AI-filing certification toolkit**  
   10th Circuit rule proposal, FRE 707 debate, NCSC policy network. Sell an API to firms and a module to state AOCs.

### Tier 2 — shape over 12–36 months

5. **Estonia phase-2 standardised-case + legal-aid engine**  
   Small revenue, large EU reference, AI Act paperwork as a product asset.

6. **US state-court ODR (housing, debt, small claims) and transcription**  
   Fragmented procurement; win two mid-size states rather than PACER.

7. **DIFC / ADGM common-law copilot**  
   Separate from mainland UAE. Disclosure logging is the differentiator.

8. **UK judicial transcription-to-reasons pipeline**  
   Generalise the IAC pilot; stay off the verdict.

### Tier 3 — watch, learn, do not staff a country team yet

9. **China Smart Court feature watch** — product intelligence only.  
10. **US federal CMM / PACER rebuild** — only via a prime contractor; do not prime.  
11. **Consumer-grade US legal chatbot** — demand is real, UPL will eat the margin.

---

## 12. What NYAYAOS should actually ship

A justice OS that can travel across these six markets is five interoperable services, not one app.

| Service | Job | Must-have controls |
| --- | --- | --- |
| **NyayaFile** | Defect detection, structured e-filing, AI-use declaration, citation verification | Jurisdiction pack; no training on filer data |
| **NyayaBench** | Judge/staff copilot: research, similar cases, draft minute / headnote / order | Human-in-the-loop; retrieval log; “not a decision” UX |
| **NyayaHear** | Speech-to-transcript-to-issues; anonymisation | On-prem / sovereign cloud; speaker ID with consent |
| **NyayaForum** | ODR / mediation / small-claims pathway that emits an enforceable structured outcome | OPRC / e-File / SCT / UAE mediation adapters |
| **NyayaSahayak** | Citizen / SRL assistant: procedure, forms, escalation | Court- or ministry-issued channel; statute-locked RAG |

Everything else (litigation intelligence dashboards, listing predictors, red-team judgment drafts) is a *mode* of NyayaBench, not a sixth product.

**Non-negotiable engineering rules pulled from this research:**

- Retrieval-augmented, citation-first, refuse when the corpus is silent.
- Separate tenants per court; no cross-tenant training.
- Disclosure packet: model, corpus cut-off, human reviewer, prompt-injection scan.
- Evaluation set per jurisdiction (the US 10th Circuit certification language is a good spec).
- Red-team mode as a judicial feature, not a gimmick — Singapore already named it.

---

## 13. Country-by-country “door to knock”

| Market | First conversation | Proof they will want |
| --- | --- | --- |
| USA | NCSC / a progressive state AOC (NJ is the existence proof) + one litigation-tech integrator | Citation auditor on a live pro se docket; CJIS/FedRAMP story |
| UK | HMCTS digital / OPRC technical standards team, or a current reform supplier | Possession / OCMC adapter; Judicial Guidance compliance matrix |
| Singapore | Courts innovation office / SCT administration / SAL | Multilingual evidence pack on a real small-claims bundle |
| Estonia | Justice- and Digital-Ministry + RIK + RIA (chatbot owner) | AI Act conformity file + Riigi Teataja-locked demo |
| UAE | ADJD programme office / Department of Government Enablement; parallel DIFC registry | Arabic+English mediation intake to enforceable minute |
| China | Do not knock on SPC procurement. Watch Shenzhen feature notes via local counsel | — |

---

## 14. Risks that kill deals

| Risk | Where it bites | Mitigation |
| --- | --- | --- |
| “Robot judge” headlines | All six; fatal in US/UK/EU | Decision-support language in every artefact |
| Hallucinated authorities in *your* output | Already sanctioned in 5 of 6 markets | Refusal + source-pass or no generate |
| Training on live case files | US protective orders; UK Judicial Guidance; EU AI Act | Contractual + technical prohibition |
| UPL / unregulated legal advice | USA especially | Court-issued or lawyer-in-the-loop SKUs only |
| Vendor cyber incident | Ohio 2026 is the slide every CIO now owns | Sovereign deploy, independent audit |
| Incumbent lock-in | Harvey in SG, Copilot in UK, Smart Court stack in CN, PACER primes in US | Arrive as a module, not a replacement |
| Language failure | UAE, Singapore, Estonia, US Spanish | Hire language evaluation as a release gate |
| Policy whiplash | US federal consumer agencies; UK County Court review | Diversify buyers (court + firm + legal aid) |

---

## 15. Suggested 18-month sequence

**Q4 2026**  
Publish a public NYAYAOS doctrine note that quotes the six jurisdictions’ “human decides” rule. Ship NyayaFile citation auditor as a standalone API. Open a Singapore technical conversation and a UK OPRC-standards conversation.

**H1 2027**  
One court-adjacent pilot (SCT-like or UK tribunal transcription). One UAE mediation-centre pilot. Estonia AI Act documentation pack, even before a contract.

**H2 2027**  
Productise jurisdiction packs: England & Wales, Singapore, UAE federal + DIFC, a single US state. Do not announce China.

**2028**  
Use Singapore + UK + one Gulf reference to enter a second US state AOC and an EU ministry via the Estonian pattern.

---

## 16. Source map

Principal sources used in this brief. All were current as of 17–20 September 2026.

**United States**  
US Courts, “Judiciary Cites Progress on Case Management… and AI” (17 Sep 2026); Bloomberg Law / Reuters coverage of the federal AI task force and 10th Circuit proposed AI-certification rule (17–18 Sep 2026); NCSC AI resource hub; Free Law Project, CourtListener × ChatGPT Enterprise (17 Sep 2026); UniCourt ChatGPT plugin (18 Sep 2026); *Jeffries v. Harcros*; *Morgan v. V2X*; Thomson Reuters / academic work on post-2022 pro se and AI-text rates.

**United Kingdom**  
Courts and Tribunals Judiciary, *AI – Judicial Guidance* (Oct 2025); MoJ, *AI Action Plan for Justice* (Jul 2025); SI 2026/696 *Online Procedure (Rules and Practice Directions) Rules 2026*; HMCTS annual report 2025–26; Civil Justice Statistics Q2 2026; LCJ evidence to Justice Select Committee (Nov 2025); *Ayinde*; *Hancox v Sutherland* (EAT, Sep 2026); Citizens Advice Caddy; SRA AI-firm authorisation.

**Singapore**  
Oxford Institute of Technology and Justice, Singapore country file (updated Mar 2026); Courts GenAI Guide (Registrar’s Circulars, 2024); MinLaw *Guide for Using Generative AI in the Legal Sector* (6 Mar 2026); CNA on Harvey / SCT rollout (Sep 2025); LawNet GPT-Legal; SIMC MAIA 2.0; [2025] SGHCR 33; [2026] SGHC 49.

**Estonia**  
Oxford Institute of Technology and Justice, Estonia country file; Courts Development Plan 2024–2030; Eesti.ai programme pages (Riigikantselei); ERR reporting on the 2026 legal-aid chatbot and administrative-court AI-citation fines; Salme / Krat technical descriptions.

**United Arab Emirates**  
WAM / Gulf News / Zawya on the ADJD AI judicial platform (28 Jul 2026); UAE Ministry of Justice news on Federal Judiciary Council mediation decisions (23 Jan 2026); Dubai Law No. 9 of 2025; DIFC Courts Mediation Service Centre (2 Sep 2025); DIFC Practical Guidance Note No. 2 of 2023; ADGM *Arabyads* wasted-costs decision.

**China**  
SPC Opinions on AI in judicial fields (2022); SPC Opinions on AI-related disputes (7 Sep 2026) via China Law Translate / IAPP; SCMP on Shenzhen judicial LLM throughput (May 2026); SPC Internet Court jurisdiction adjustment (1 Nov 2025); BAC/BIAC Digital Economy Arbitration Rules (1 Jan 2026); Oxford Institute China country file; CGTN / China Daily seminar coverage (Sep 2026).

**Comparative**  
Oxford Institute of Technology and Justice country series; UNDP *Responsible AI in Justice*; Regulayer global AI-for-lawyers tracker; KAS *AI in the Judiciary*; IJLMH China–Singapore ODR comparison (2026).

---

## 17. Bottom line

The six-country field is no longer “will courts use AI?” That argument ended. The field is now **who owns the trusted layer between a model and a public institution**.

- China already built the layer as a state system.  
- Singapore and the UAE will **buy** the layer if it is court-shaped.  
- The UK will **license** the layer if it speaks OPRC and Judicial Guidance.  
- Estonia will **embed** the layer if it survives the AI Act.  
- The United States will **rent** the layer in pieces — verification, ODR, transcription — and fight about the rest in circuit rules.

NYAYAOS should not try to be the American PACER, the Chinese Smart Court, and the British Common Platform. It should be the **portable justice runtime**: citation-locked, multilingual, human-supervised, adapter-ready for whoever already owns the docket.

That is a narrower ambition than “AI judge.” It is also the only one this research supports.

---

*End of report.*
