# NYAYAOS_MVP_SELECTION_REPORT

## MVP selection question

**Constraint:** If NyayOS can build only one meaningful product
capability in the next 90 days, what should it be?

**Project:** NyayOS\
**Stage:** Pre-build / research and product-definition\
**Repository:** `https://github.com/rmanish2000-del/nyayos`\
**Verified repository status:** The public GitHub repository is
currently empty. No existing code or architecture was assumed.\
**Decision date:** 20 September 2026

------------------------------------------------------------------------

# 1. Executive conclusion

## Recommended MVP

### **NyayOS Dispute Readiness Engine**

A citizen starts with:

> **"What happened?"**

NyayOS converts the user's story and uploaded evidence into a
structured, source-grounded **Dispute File** containing:

1.  **Issue classification** --- what kind of legal problem this appears
    to be.
2.  **Fact timeline** --- dates, people, organizations, events and
    amounts.
3.  **Evidence map** --- what evidence exists, what is missing, and what
    each item appears to establish.
4.  **Rights/process map** --- relevant legal concepts and procedural
    routes, with citations and confidence indicators.
5.  **Action plan** --- practical next steps, deadlines/urgency flags,
    and questions to resolve.
6.  **Resolution paths** --- self-resolution, notice/request,
    mediation/ODR where appropriate, legal-aid route, or lawyer review.
7.  **Lawyer-ready case brief** --- a concise, structured handoff
    package a lawyer can review rather than starting intake from zero.

### Why this rather than an AI legal chatbot?

India is already moving toward citizen-facing AI legal assistance. The
Department of Justice's 2026 DISHA 2.0 program includes Tele-Law and the
government-backed Nyaya Setu chatbot, which provides multilingual
legal-process guidance. A generic "ask a legal question" chatbot
therefore faces direct differentiation and distribution challenges.
citeturn2search2turn2search5

NyayOS should instead own the **workflow between a citizen's problem and
a professionally usable dispute file**.

The strategic loop is:

**Problem → Facts → Evidence → Issue → Options → Resolution path →
Human/legal handoff → Outcome**

That is materially harder to copy than a chat UI because every completed
matter can improve structured classification, evidence schemas, workflow
rules, outcome data and routing.

------------------------------------------------------------------------

# 2. What the research says

## 2.1 The market is already crowded at the "legal information" layer

Public market mapping in 2026 identifies a large Indian legal-tech
ecosystem spanning court data, AI research, contracts, litigation
management, ODR, compliance, debt recovery, legal marketplaces and
consumer legal services. One market directory reports more than 1,000
Indian legal-tech entities tracked, with hundreds active. This is a
directional market signal rather than an authoritative government
statistic. citeturn2search1

The implication is important:

> **Do not enter the market by building another generic legal search box
> or legal chatbot.**

## 2.2 Government platforms already occupy several obvious layers

eCourts already supports case search through CNR, case number, filing
number, party name, advocate, FIR, Act and case type, and exposes case
history and hearing information. citeturn0search0turn0search7

The Department of Land Resources is also developing/operating
land-record modernization and revenue-court integration initiatives.
DILRMP explicitly targets reduction of land disputes, fraud prevention
and easier access to land information. citeturn0search2turn0search5

Therefore, NyayOS should **orchestrate around existing public
infrastructure**, not attempt to recreate it in the first 90 days.

## 2.3 Citizen legal assistance is strategically important --- but generic assistance is not enough

NALSA already provides free legal aid, legal advice, legal literacy and
dispute-settlement support, with a nationwide structure extending
through state, district and taluka institutions.
citeturn1search0turn1search4

In 2026, DISHA 2.0 was approved with a ₹255 crore five-year outlay and
explicitly targets technology-enabled access to justice. It includes
Tele-Law, Nyaya Bandhu, legal literacy and VIDHI-Sanjeevani. The
government also describes Nyaya Setu as a multilingual, voice-first
legal assistant. citeturn2search2turn2search4

This validates the **problem**, while simultaneously raising the bar for
NyayOS differentiation.

## 2.4 Resolution before litigation is strategically relevant

The Mediation Act, 2023 promotes mediation, including institutional
mediation, pre-litigation mediation and online mediation.
citeturn3search0turn3search45

That supports a NyayOS journey in which "going to court" is a possible
outcome rather than the default starting point.

------------------------------------------------------------------------

# 3. Ten MVP candidates

Scores are on a 1--10 scale.

  -------------------------------------------------------------------------------------------------------
  \#     MVP candidate  Core user       Revenue        Data   Adoption        90-day   Strategic  Total /
                                                  advantage              feasibility         fit      100
  ------ -------------- ------------- --------- ----------- ---------- ------------- ----------- --------
  1      **Dispute      Citizens +            8          10          9             8          10   **91**
         Readiness      lawyers                                                                  
         Engine**                                                                                

  2      Consumer       Consumers             8           8          9             9           9   **88**
         Dispute                                                                                 
         Resolution                                                                              
         Assistant                                                                               

  3      Evidence &     Citizens +            7          10          8             9           9   **87**
         Case File      lawyers                                                                  
         Builder                                                                                 

  4      Lawyer-Ready   Lawyers +             9           9          7             9           9   **87**
         Intake &       citizens                                                                 
         Handoff                                                                                 

  5      Property       Property              9          10          7             6           9   **84**
         Dispute / Land owners                                                                   
         Issue                                                                                   
         Navigator                                                                               

  6      Legal Notice & Citizens +            9           7          8             9           8   **84**
         Response       lawyers                                                                  
         Workflow                                                                                

  7      Case Status &  Litigants +           7           6          8             8           6   **75**
         Hearing        lawyers                                                                  
         Intelligence                                                                            
         Layer                                                                                   

  8      ODR /          Disputing             8           9          6             6           9   **76**
         Mediation      parties                                                                  
         Preparation                                                                             
         Workspace                                                                               

  9      Legal-Aid      Citizens              3           7          8             8           8   **70**
         Eligibility &                                                                           
         Routing                                                                                 
         Assistant                                                                               

  10     General AI     Citizens +            7           5          8             9           5   **69**
         Legal Research lawyers                                                                  
         / Chatbot                                                                               
  -------------------------------------------------------------------------------------------------------

**Important:** The totals are an internal decision framework, not an
objective measurement of market success.

------------------------------------------------------------------------

# 4. Scoring model

## Weighted criteria

  -------------------------------------------------------------------------
  Criterion                                    Weight What it measures
  ---------------------- ---------------------------- ---------------------
  User pain / value                               20% Severity and
                                                      frequency of the
                                                      problem solved

  Adoption potential                              20% Probability users
                                                      will understand, try
                                                      and repeatedly use it

  Revenue potential                               20% Plausible ability to
                                                      support paid
                                                      products/business
                                                      models

  Data advantage                                  20% Ability to create
                                                      proprietary
                                                      structured data
                                                      through usage

  90-day feasibility                              10% Probability of
                                                      delivering a credible
                                                      MVP in 90 days

  Strategic/regulatory                            10% Fit with NyayOS
  fit                                                 direction and ability
                                                      to operate
                                                      responsibly
  -------------------------------------------------------------------------

**Formula:**

`MVP Score = (Pain × 20) + (Adoption × 20) + (Revenue × 20) + (Data × 20) + (Feasibility × 10) + (Strategic Fit × 10)`

Scores are normalized to 100.

------------------------------------------------------------------------

# 5. Candidate analysis

## 1. Dispute Readiness Engine --- 91/100

### What it does

User tells NyayOS what happened and uploads relevant
documents/photos/messages.

NyayOS creates a structured dispute file:

**Story → Timeline → Parties → Issues → Evidence → Missing evidence →
Options → Next steps → Handoff**

### Revenue potential

**High.**

Possible future models:

-   Paid premium dispute reports
-   Professional case-preparation subscriptions
-   Lawyer/firm workflow SaaS
-   Enterprise/NGO access-to-justice deployments
-   API/workflow licensing
-   Paid human review through compliant partners

The initial MVP should avoid depending on lawyer lead commissions as the
primary revenue engine. Indian advocate advertising/solicitation rules
create constraints around how lawyer acquisition and promotion can be
structured. citeturn3search44turn3search11

### Data advantage

**Very high.**

Every completed workflow can produce structured, permissioned data such
as:

-   dispute category
-   factual patterns
-   evidence types
-   missing evidence
-   procedural route
-   user-selected resolution path
-   lawyer/mediator handoff
-   eventual outcome, where voluntarily supplied

The moat is not "more conversations with an LLM."

The moat becomes:

> **A structured graph of real-world Indian disputes and their
> resolution journeys.**

### Adoption

**High**, because the entry point is understandable:

> "Tell us what happened."

It does not require the user to know:

-   the Act
-   the legal section
-   the court
-   the procedural terminology
-   whether the problem is technically a civil or consumer matter

### Main risk

The system could accidentally cross from assistance into overconfident
individualized legal advice.

### MVP boundary

Use:

-   source-grounded information
-   clear uncertainty labels
-   evidence organization
-   procedural guidance
-   escalation to human professionals where appropriate

Do not build:

-   autonomous legal representation
-   autonomous filing
-   legal outcome prediction
-   "you will win" scoring
-   AI-generated legal conclusions presented as authoritative

------------------------------------------------------------------------

# 6. Candidate #2 --- Consumer Dispute Resolution Assistant --- 88/100

### Product

A focused workflow for consumer complaints:

**Problem → Purchase/service → Evidence → Seller complaint → Resolution
attempt → Complaint readiness → Human/legal escalation**

### Strengths

Consumer disputes have a relatively understandable starting point and a
clear user outcome.

The Department of Consumer Affairs maintains the Consumer Protection Act
framework and related mediation/procedure rules. citeturn3search1

### Revenue

High enough for an MVP because users can understand paying for:

-   document organization
-   complaint preparation
-   evidence packaging
-   professional review

### Data moat

Strong, particularly if NyayOS captures normalized information about:

-   product/service type
-   complaint type
-   amount
-   evidence
-   merchant response
-   resolution path
-   outcome

### Weakness

It is narrower than the long-term NyayOS vision.

------------------------------------------------------------------------

# 7. Candidate #3 --- Evidence & Case File Builder --- 87/100

### Product

Upload:

-   PDFs
-   photos
-   WhatsApp exports/screenshots
-   emails
-   receipts
-   agreements
-   notices

NyayOS builds:

-   chronological timeline
-   document index
-   evidence labels
-   missing-evidence checklist
-   factual summary
-   lawyer-ready brief

### Why it is attractive

This is one of the safest AI/legal-tech wedges because the core job is
**organizing facts and evidence**, not pretending to replace a lawyer.

### Data moat

Extremely strong.

The system learns which evidence structures recur across dispute
categories.

### Weakness

The value proposition can initially sound like document management
unless paired with an action plan.

------------------------------------------------------------------------

# 8. Candidate #4 --- Lawyer-Ready Intake & Handoff --- 87/100

### Product

A citizen creates a structured case intake before contacting a lawyer.

The lawyer receives:

-   parties
-   facts
-   timeline
-   documents
-   evidence
-   questions
-   prior steps
-   desired outcome

### Revenue

Potentially very strong as B2B SaaS.

Possible model:

`lawyer/firm subscription → intake workspace → client portal → structured case handoff`

### Adoption limitation

The initial user must have a reason to involve a lawyer.

It therefore has less broad consumer pull than the Dispute Readiness
Engine.

------------------------------------------------------------------------

# 9. Candidate #5 --- Property Dispute / Land Issue Navigator --- 84/100

### Product

Guide users through:

-   ownership issue
-   inheritance issue
-   boundary dispute
-   possession issue
-   land-record inconsistency
-   transaction/document problem

Then organize available documents and route the matter.

### Data advantage

Potentially exceptional.

Land disputes combine:

-   geography
-   ownership
-   documents
-   transactions
-   revenue records
-   court history
-   family relationships

Government initiatives themselves identify land disputes as significant
and are pursuing integration of land records, registration data and
courts. citeturn0search2turn0search5

### Why not first?

The integration burden is substantially higher.

A genuinely useful property product will eventually need state-specific
data integrations and careful handling of title/record limitations.

That is too much dependency for the first 90 days.

------------------------------------------------------------------------

# 10. Candidate #6 --- Legal Notice & Response Workflow --- 84/100

### Product

Turn a structured factual file into:

-   issue summary
-   evidence index
-   draft communication
-   response tracker
-   deadline tracker
-   escalation options

### Revenue

High.

Users understand the value of a professionally structured notice
workflow.

### Risk

A generic AI notice generator is easy to copy.

Therefore, **notice generation alone is not a defensible MVP**.

It should be a downstream output of the Dispute Readiness Engine.

------------------------------------------------------------------------

# 11. Candidate #7 --- Case Status & Hearing Intelligence --- 75/100

### Product

Track:

-   case status
-   hearings
-   orders
-   cause lists
-   important events
-   reminders

### Problem

Much of the underlying case-status functionality already exists through
eCourts. Users can search using CNR and several other identifiers.
citeturn0search0turn0search7

### Strategic conclusion

Useful feature.

Poor first wedge.

NyayOS should eventually **consume and contextualize** public court data
rather than merely reproduce the search interface.

------------------------------------------------------------------------

# 12. Candidate #8 --- ODR / Mediation Preparation Workspace --- 76/100

### Product

Prepare both parties for resolution:

-   facts
-   evidence
-   issues
-   claims
-   desired outcomes
-   settlement parameters
-   communication record
-   mediation documents

The Mediation Act, 2023 expressly recognizes pre-litigation mediation
and online mediation. citeturn3search45

### Strategic potential

Very high long-term.

### MVP problem

A mediation marketplace has a classic two-sided-market problem:

**No parties → mediators have little value.\
No mediators → parties have little value.**

NyayOS should first own the **pre-resolution preparation layer**, then
add mediation infrastructure.

------------------------------------------------------------------------

# 13. Candidate #9 --- Legal-Aid Eligibility & Routing Assistant --- 70/100

### Product

Help users understand:

-   whether they may qualify for legal aid
-   which authority to approach
-   what documents are likely required
-   how to prepare the request

NALSA already provides online legal-aid applications and a nationwide
legal-services structure. citeturn1search0

### Strategic value

High social value.

### Revenue

Low direct monetization.

Best treated as a trust/distribution feature inside the broader NyayOS
workflow rather than the commercial MVP itself.

------------------------------------------------------------------------

# 14. Candidate #10 --- General AI Legal Research / Chatbot --- 69/100

### Product

Ask legal questions in natural language.

### Why it looks attractive

-   Fast to build
-   Easy to demonstrate
-   High initial curiosity
-   Natural fit with LLMs

### Why it should not be the MVP

Three structural problems:

1.  **Crowding** --- Indian legal-tech already contains legal research
    and AI products. citeturn2search1
2.  **Government competition** --- Nyaya Setu already provides
    multilingual citizen-facing legal assistance.
    citeturn2search2turn2search5
3.  **Weak proprietary data loop** --- conversations alone are less
    valuable than structured dispute/outcome data.

### Strategic conclusion

AI chat should be an **interface inside NyayOS**, not the product
itself.

------------------------------------------------------------------------

# 15. Revenue comparison

  ---------------------------------------------------------------------------------------
  Candidate         Near-term revenue Long-term revenue Best business model
  ----------------- ----------------- ----------------- ---------------------------------
  Dispute Readiness High              Very high         Consumer premium + professional
  Engine                                                SaaS + enterprise

  Consumer Dispute  High              High              Paid workflows + professional
  Assistant                                             services

  Evidence/Case     Medium-high       Very high         SaaS + paid case packs
  File Builder                                          

  Lawyer            High              High              B2B SaaS
  Intake/Handoff                                        

  Property          Medium            Very high         Premium reports + B2B/data/API
  Navigator                                             

  Notice Workflow   High              High              Paid document/workflow + SaaS

  Case Intelligence Medium            High              Professional subscription

  ODR Preparation   Medium            Very high         Transaction/workflow +
                                                        institutional

  Legal Aid Routing Low               Medium            Institutional/CSR/public-sector

  General Legal     Medium            Medium            Subscription
  Chatbot                                               
  ---------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 16. Data advantage comparison

The most important strategic distinction is:

### Weak data loop

`Question → Answer`

### Strong data loop

`Real dispute → structured facts → evidence → issue → route → action → resolution → outcome`

NyayOS should build the second.

  Candidate                      Potential proprietary structured data
  ---------------------------- ---------------------------------------
  Dispute Readiness Engine                                   **10/10**
  Evidence/Case File Builder                                 **10/10**
  Property Navigator                                         **10/10**
  Lawyer Intake/Handoff                                       **9/10**
  ODR Preparation                                             **9/10**
  Consumer Dispute Assistant                                  **8/10**
  Legal Aid Routing                                               7/10
  Notice Workflow                                                 7/10
  Case Intelligence                                               6/10
  Generic Chatbot                                                 5/10

------------------------------------------------------------------------

# 17. Adoption strategy

## The first screen should NOT say:

> "Search Indian law"

or:

> "Ask an AI lawyer"

Instead:

> **What happened?**

Examples:

-   "My landlord is refusing to return my deposit."
-   "I paid for something and the company will not refund me."
-   "My family is fighting over inherited land."
-   "Someone has not repaid the money they owe me."
-   "I received a legal notice."
-   "I have a court case but don't understand what happens next."

The system then asks only the questions needed to structure the problem.

This creates a lower cognitive burden than requiring users to understand
the legal system before they can use it.

------------------------------------------------------------------------

# 18. The 90-day MVP scope

## Must build

### A. Natural-language intake

Text-first.

Voice can be added if engineering capacity permits, but it should not
delay the core workflow.

### B. Dynamic questioning

Ask follow-up questions based on the initial facts.

### C. Evidence locker

Allow uploads of common evidence types.

### D. Timeline generator

Convert facts and documents into a chronological timeline.

### E. Issue classification

Classify the dispute into a controlled taxonomy.

Example:

``` text
Property
  ├── Ownership
  ├── Possession
  ├── Boundary
  ├── Inheritance
  └── Transaction

Consumer
  ├── Refund
  ├── Defective product
  ├── Service failure
  └── Misrepresentation

Family
  ├── Maintenance
  ├── Property/inheritance
  └── Other family dispute
```

This taxonomy should expand gradually rather than attempting to encode
all Indian law on day one.

### F. Evidence gap analysis

Example:

``` text
Evidence found:
✓ Payment receipt
✓ WhatsApp conversation
✓ Agreement

Potentially missing:
□ Proof of delivery
□ Formal complaint to seller
□ Response from seller
```

### G. Grounded action plan

Each important legal/procedural statement should have:

-   source
-   source date/version where relevant
-   confidence
-   jurisdiction
-   plain-language explanation

### H. Resolution-path recommendation

Not a "winner prediction."

Instead:

``` text
Possible paths

1. Direct resolution
2. Written notice/request
3. Mediation/ODR where applicable
4. Legal-aid assistance
5. Lawyer review
6. Court/tribunal route where appropriate
```

### I. Exportable case brief

A structured PDF/printable/shareable case file for a human professional.

------------------------------------------------------------------------

# 19. Explicitly DO NOT build in the first 90 days

Do not build:

-   AI judge
-   litigation outcome predictor
-   autonomous legal agent
-   autonomous court filing
-   autonomous negotiation with the opposing party
-   full eCourts replacement
-   nationwide land-record integration
-   complete legal research database
-   lawyer marketplace
-   full ODR marketplace
-   generic chatbot as the main product
-   all-India coverage of every legal domain
-   complex billing/practice-management suite

The objective is not to make NyayOS look large.

The objective is to prove one high-value workflow.

------------------------------------------------------------------------

# 20. Trust and compliance architecture

The product should be designed around:

### Human decision authority

AI assists; humans make consequential legal decisions.

This is consistent with current responsible-AI thinking for justice
systems, where governance, transparency, privacy, fairness and
monitoring are emphasized. citeturn2search6

### Source grounding

No uncited high-impact legal claims.

### Uncertainty

Use language such as:

-   "Based on the information provided..."
-   "This may depend on..."
-   "The following sources indicate..."
-   "A lawyer/authorized professional should review..."

### Auditability

Store:

-   source used
-   model/version
-   generated output
-   user edits
-   timestamps
-   confidence
-   escalation events

### Privacy

Legal matters may contain extremely sensitive personal information.

The architecture should therefore treat:

-   documents
-   identity information
-   communications
-   financial information
-   family information
-   legal allegations

as high-sensitivity data.

------------------------------------------------------------------------

# 21. The strategic moat

NyayOS should not attempt to win by having a better foundation model.

Models will commoditize.

The moat should be:

## Layer 1 --- Dispute ontology

A structured representation of real-world Indian disputes.

## Layer 2 --- Evidence ontology

Mapping evidence types to factual propositions and workflow
requirements.

## Layer 3 --- Procedure graph

Mapping issues to possible procedural routes.

## Layer 4 --- Resolution graph

Recording what users actually did and what happened afterward.

## Layer 5 --- Human network

Eventually connect lawyers, mediators, legal-aid organizations and other
qualified professionals.

## Layer 6 --- Outcome intelligence

Over time:

`Fact pattern → evidence profile → route → action → outcome`

This is potentially much more defensible than:

`Question → LLM answer`

------------------------------------------------------------------------

# 22. The key product insight

The biggest strategic shift should be:

## Do not build a "legal AI."

Build a **justice workflow engine**.

AI is the interface and reasoning layer.

The product is the workflow.

That distinction matters because:

-   AI models are becoming cheaper and more capable.
-   Government is investing in citizen legal AI.
-   Legal research is crowded.
-   Court data is increasingly digitized.
-   Workflow and verified structured data remain harder to assemble.

------------------------------------------------------------------------

# 23. Recommended MVP positioning

### User-facing positioning

> **NyayOS helps you turn a legal problem into a clear, organized path
> forward.**

Alternative:

> **Start with what happened. NyayOS helps you organize the facts,
> evidence and next steps.**

### Avoid

> "AI Lawyer"

> "AI Judge"

> "Your virtual advocate"

> "Predict your case outcome"

> "Replace your lawyer"

Those positions create unnecessary trust, liability and differentiation
problems.

------------------------------------------------------------------------

# 24. 90-day success metrics

The MVP should not primarily be judged by registered users.

Measure whether the workflow creates real value.

## Activation

-   \% who complete initial intake
-   \% who upload at least one evidence item
-   time to first useful case brief

## Quality

-   user-rated factual accuracy
-   evidence extraction accuracy
-   timeline correction rate
-   citation/source validity
-   hallucination/error rate

## Workflow

-   \% completing a dispute file
-   \% downloading/exporting the case brief
-   \% returning to update the file
-   \% taking a recommended next step

## Human handoff

-   \% requesting professional review
-   professional acceptance rate
-   time saved in first intake

## Resolution

Eventually measure:

-   direct resolution
-   mediation
-   legal-aid connection
-   lawyer engagement
-   formal complaint
-   litigation
-   user-reported outcome

These outcome metrics become the foundation of the future data moat.

------------------------------------------------------------------------

# 25. The single KPI I would watch first

### **Completed, usable dispute files per week**

A dispute file counts only when it contains:

-   structured facts
-   timeline
-   evidence
-   issue classification
-   action plan
-   at least one supported source
-   explicit uncertainty/limitations where needed

This prevents the team from optimizing for empty chatbot conversations.

------------------------------------------------------------------------

# 26. Final decision

## Build:

# **NyayOS Dispute Readiness Engine**

### Core promise

> **Tell NyayOS what happened. It turns the story into a structured,
> evidence-backed dispute file and a clear set of possible next steps.**

### 90-day product loop

``` text
WHAT HAPPENED?
      ↓
STRUCTURE THE FACTS
      ↓
COLLECT THE EVIDENCE
      ↓
BUILD THE TIMELINE
      ↓
IDENTIFY THE ISSUE
      ↓
SHOW VERIFIED INFORMATION
      ↓
MAP POSSIBLE PATHS
      ↓
CREATE ACTION PLAN
      ↓
GENERATE HUMAN-REVIEWABLE CASE BRIEF
```

This is the strongest single feature because it combines:

-   broad citizen usefulness
-   professional usefulness
-   monetization potential
-   structured proprietary data
-   future ODR compatibility
-   future lawyer workflow compatibility
-   future court-data integration
-   future legal-aid integration
-   future multilingual/voice expansion

without requiring NyayOS to become a court, law firm, legal marketplace,
government portal or general-purpose legal search engine on day one.

------------------------------------------------------------------------

# 27. Product roadmap after MVP

If the MVP proves demand:

### Phase 2

**Resolution Layer**

-   mediation preparation
-   structured settlement workflows
-   ODR integrations
-   professional review

### Phase 3

**Professional Layer**

-   lawyer intake
-   client portal
-   case preparation
-   evidence workflows
-   court-data context

### Phase 4

**Justice Graph**

-   dispute ontology
-   evidence graph
-   procedure graph
-   resolution graph
-   outcome intelligence

### Phase 5

**JusticeOS**

Only after the workflow has demonstrated repeated usage should NyayOS
expand toward the broader "operating system" vision.

The platform positioning should therefore be earned through product
adoption rather than declared in advance.

------------------------------------------------------------------------

# 28. Bottom line

**Do not build the biggest legal product.**

Build the smallest product that creates a new, valuable data/workflow
loop.

### The wedge:

**Dispute Readiness**

### The interface:

**"What happened?"**

### The output:

**A structured dispute file + evidence map + possible next steps +
human-ready handoff**

### The long-term moat:

**Real-world dispute → evidence → workflow → resolution data**

### The long-term ambition:

**A justice workflow operating system --- not merely an AI legal
chatbot.**

------------------------------------------------------------------------

# Sources and research notes

1.  Government of India / Department of Justice --- DISHA 2.0 and Nyaya
    Setu:\
    https://www.pib.gov.in/PressReleasePage.aspx?PRID=2289459\
    https://www.pib.gov.in/PressReleasePage.aspx?PRID=2247310

2.  eCourts India Services --- case search and case history:\
    https://services.ecourts.gov.in/ecourtindia_v6/casestatus/\
    https://services.ecourts.gov.in/App/appfaq.html

3.  National Legal Services Authority --- legal aid:\
    https://nalsa.gov.in/legal-aid/\
    https://nalsa.gov.in/about-nalsa/

4.  Department of Land Resources --- DILRMP and e-Court/land-record
    linkage:\
    https://dolr.gov.in/en/programmes-schemes/dilrmp-2/\
    https://dolr.gov.in/en/linkage-of-e-court-with-land-records-registration-data-base/

5.  India Code --- Mediation Act, 2023:\
    https://www.indiacode.nic.in/indiacode/handle/123456789/19637

6.  Department of Consumer Affairs --- Consumer Protection framework:\
    https://consumeraffairs.nic.in/acts-and-rules/consumer-protection/consumer-protection

7.  Bar Council of India Rules / Advocates Act context:\
    https://upload.indiacode.nic.in/showfile?actid=AC_CEN_3_46_00001_196125_1517807320172&filename=BCI+Rules%2C+Part-V+to+IX.pdf&type=rule\
    https://www.indiacode.nic.in/indiacode/handle/123456789/1631

8.  UNDP India --- AI for Justice: Ethical, Fair and Robust Adoption in
    India's Courts:\
    https://www.undp.org/india/publications/ai-justice-ethical-fair-and-robust-adoption-indias-courts

9.  Market landscape references used directionally:\
    https://blogs.ecourtsindia.com/2026/04/16/the-complete-list-of-legaltech-startups-and-companies-in-india-2026-directory/\
    These are market-directory sources, not official government
    statistics, and should be independently validated before use in
    investor materials.

10. NyayOS GitHub repository:\
    https://github.com/rmanish2000-del/nyayos

------------------------------------------------------------------------

## Research caveat

This report is a product-strategy decision document, not legal advice or
an investment recommendation. Market-size and competitive-landscape
claims from private directories are treated as directional signals
rather than authoritative statistics. Legal/procedural claims should be
re-verified against current primary sources before being implemented in
production.
