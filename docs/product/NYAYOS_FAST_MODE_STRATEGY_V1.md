# NYAYOS_FAST_MODE_STRATEGY_V1

| Field | Value |
|---|---|
| Project | NyayOS |
| Tool / mode | Claude Chat (Opus, extended thinking) — strategy and product planning only |
| Priority | P0 |
| Environment | Pre-build planning. No code, no repository work, no commits, no deployment, no database writes. |
| Repository | The canonical repository is private and was not accessed; this assignment states repository access is not required. Nothing here assumes any implementation exists. |
| Inputs | SDAS V1 · Build Brief V2 ("BB2") · Counsel Brief V1 ("CB1") · Ecosystem Architecture Review V1 ("EAR") · Master Product Spec V1 ("MPS") · Decision Log V1 ("DL") · Risk Register V1 ("RR") |
| Continuity owner | M365 Copilot |
| Date | 22 Sep 2026 |

**Standing statements.** No legal opinions, no compliance claims, no implementation claims. Every timing figure is a **planning estimate**, not a commitment. Fast Mode changes *sequence and surface area*, never the architecture: the twelve non-negotiable constraints in the assignment are treated as invariants and are restated as the Fast Mode security boundary in §7.

---

## 1. Executive summary

The current plan (BB2) is correct but front-loads the most expensive, least learning-dense work. Its longest poles — the authority corpus and jurisdiction pack with citation validators (M3), the vector index and OCR pipeline (M2), automated deletion verification and restore drills (M6) — cost the most build time and teach the least about whether anyone will pay for a Dispute File.

**Fast Mode inverts that order around one observation: the product's value hypothesis can be tested before the product exists.** The Dispute File is a *deliverable*, not a feature set. A founder can produce one by hand for a real dispute owner today and charge for it. That single move produces the strongest evidence in the 90-day plan's own hierarchy — a user paying — without a line of code.

The recommended Fast Mode is five steps:

| Step | What | Code? | Produces |
|---|---|---|---|
| **FM-0 Concierge** | Founder manually produces Dispute Files for 5–8 real disputes, priced from the first one | No | WTP evidence, gold-standard file format, reviewer reaction, the question list the product must ask |
| **FM-A Thin Slice** | M0-lite + M1 (manual dispute core) + upload with hash and scan (no OCR, no index) + a provenance-complete export | Yes | Self-serve usable product; completion and activation data |
| **FM-B Share** | Frozen share snapshot, revocable, reviewer read + comment | Yes | Reviewer-usefulness evidence — the strongest signal in the whole thesis |
| **FM-C Paywall** | Paid export / paid dispute file inside the product | Yes | In-product WTP conversion |
| **FM-D Assist** | OCR + two AI proposal tasks, off by default, no legal content of any kind | Yes | Whether AI assistance changes completion and willingness to pay |

**The largest single compression is a scope decision, not a speed trick: Fast Mode ships a product that makes no legal or procedural statements at all.** No "verified information" screen, no citations, no deadlines, no action plan sourced from law. It organises the user's own material and nothing else. That removes the authority corpus, the jurisdiction pack, the citation validator and the verified-deadline gate from the critical path (the bulk of M3), removes the product's highest-severity failure mode (fabricated authority, RR R01/R07/R08), and narrows several open legal questions to their conservative interim positions (CB1 §3.8, §3.11).

**What is gained:** first real user weeks earlier, first paying user before any build, reviewer evidence before AI investment, far lower cost of being wrong about the wedge.
**What is lost:** the "verified information" differentiator is untested until later; AI accuracy learning is deferred; some organisation-tenant and automation work is re-entered later as additive build; the product looks plainer in early demos.
**What is not traded:** everything in §7. Fast Mode reduces *features*, never the access model, the provenance model, evidence integrity, honest deletion, or the prohibitions.

---

## 2. Fast Mode principles

| # | Principle | Consequence |
|---|---|---|
| FP-1 | Learning per week is the optimisation target, not features per week | Any capability that does not change a metric in §12 leaves the critical path |
| FP-2 | Manual before automatic | If a founder can do it by hand for 25 users, it is not MVP code (holds, deletion verification runs, reviewer matching of any kind) |
| FP-3 | Nothing legal comes out of the product in Fast Mode | No citations, deadlines, rights statements or procedural claims → the heaviest subsystem and the worst failure mode both leave the path |
| FP-4 | Additive, never reshaping | Fast Mode builds a strict subset of the BB2 schema and rules; later milestones add tables and columns, never rewrite them (§14) |
| FP-5 | Security floor is fixed, surface area is variable | §7 controls exist from the first build; what varies is how much data and how many features sit behind them |
| FP-6 | Charge early, small, and honestly | Price the first concierge file; an invoice beats a survey (90-day plan WTP hierarchy) |
| FP-7 | Every deferral is a flag, not a fork | Deferred capability = disabled feature flag in a codebase that already has its seam |
| FP-8 | Conservative interim legal posture, always the restrictive option | CB1 interim paths adopted in full; Critical items still gate the pilot |
| FP-9 | One active workstream | Concierge and build never run as parallel engineering efforts; concierge is founder time, build is one milestone |
| FP-10 | Evidence over assertion | Each step exits on measured data, not on "it feels ready" |

---

## 3. Comparison: BB2 path vs Fast Mode path

### 3.1 Sequence

| | BB2 path | Fast Mode path |
|---|---|---|
| Order | M0 → M1 → M2 → M3 → M4 → M5 → M6 → M7 | FM-0 → FM-A (M0-lite+M1+M2-lite+M5-lite) → FM-B (M4-lite) → FM-C (paywall) → FM-D (M2-rest + M3-lite) → FM-E (pilot hardening: M6 + M7) |
| First real user touches something | After M1 on staging (internal), realistically after M7 for real data | FM-0, immediately, with no product |
| First WTP evidence | M7 pricing tests | FM-0, first paid concierge file |
| First reviewer evidence | M4 → M7 | FM-0 (manual file given to an advocate), then FM-B in-product |
| AI investment | M3, before any paying user | FM-D, after paying users exist |
| Authority corpus / pack | M3 (critical path) | Deferred beyond Fast Mode; only when a user problem demands it |
| Vector index | M2 (critical path) | Deferred to FM-D (only needed when AI retrieval exists) |
| Deletion automation | M6 | FM-E; before then, narrow surface + verified manual procedure with honest status |

### 3.2 Benefits of Fast Mode

1. **WTP evidence before build authorisation.** Removes the largest business risk (RR R13, R14, R25) at near-zero cost.
2. **The concierge phase defines the product.** Manually produced files reveal the actual question set, the real document mix, and which sections a reviewer reads first — the intake design stops being guesswork (MPS §7.3).
3. **Smallest blast radius.** No AI, no legal content, no index means fewer stores, fewer failure modes and a smaller deletion surface.
4. **Lower legal exposure in early build.** No legal statements → no citation risk; India-only or no external processors → OL-11 sits at its conservative default (CB1 §3.11.10).
5. **Cheaper to be wrong.** If the wedge is wrong, the loss is weeks of founder time, not a built AI pipeline.
6. **Reviewer signal arrives early**, and reviewer usefulness is the pivot point of the whole thesis (EAR §3.3).

### 3.3 Risks of Fast Mode

1. **Concierge is not the product.** Manual delivery can show demand for *a service* rather than for software; margins and repeatability differ (mitigate: measure time-per-file and repeat requests).
2. **Feature-thin demos.** Without "verified information", NyayOS looks like an organiser; some users may value it less (mitigate: that is the finding — it is the test).
3. **Concierge phase still handles real personal data.** Doing it manually does not remove the questions in CB1 OL-01/OL-04; it changes who holds the data and under what agreement (founder decision, see §11).
4. **Temptation to skip the security floor** under time pressure (mitigate: §7 is a hard gate; the CI schema lint exists in FM-A).
5. **Deferred learning about AI quality** — if AI proves weak later, some product assumptions shift (mitigate: manual mode is a complete product path by design).
6. **Re-entry cost** if deferred items were deferred sloppily (mitigate: §14 reconciliation rules).

### 3.4 Head-to-head

| Dimension | BB2 path | Fast Mode |
|---|---|---|
| Time to first real-user contact | Long | Immediate (FM-0) |
| Time to first rupee | Long | FM-0 |
| Build cost before first evidence | High | Near zero, then small |
| Architectural integrity | Full | Full (subset) |
| Legal surface in early phases | Broad (AI + legal content) | Narrow (no legal content) |
| Differentiation shown early | High | Moderate |
| Risk of expensive rework | Low | Low, **if** §14 rules are followed |
| Risk of building the wrong thing | Moderate | Low |

---

## 4. Fast Mode MVP

### 4.1 Absolute minimum product (FM-A)

> A dispute owner signs in, describes what happened, answers a short set of questions, uploads their documents, confirms the facts themselves, and downloads a provenance-complete Dispute File with an integrity manifest.

That is the entire first build. It is self-serve, it is chargeable at FM-C, and it contains no AI and no legal content.

### 4.2 Features included in Fast Mode (by step)

**FM-A Thin Slice**
- Auth; personal tenant only.
- Dispute creation; "What happened?" free text; static-but-adaptive question set (branching rules written by the founder from concierge learnings — deterministic, not AI).
- Canonical Dispute File in manual mode: parties/entities, events with date precision, propositions, evidence items, evidence relations, contradictions (user-flagged), gaps, issue label (user-chosen from a plain-language list, explicitly not a legal determination), next-step notes.
- Proposal → correction single-writer flow (owner-originated proposals auto-accepted with a correction record).
- Upload: quarantine → server SHA-256 → MIME sniff → malware scan → promote to write-once original; document viewer; manual location linking (user marks the page a fact came from).
- Export: brief, chronology, evidence index, issues, gaps + integrity manifest + AI-content notice ("no AI was used in this file" in FM-A) + minimal integrity scope statement.
- Delete: document, dispute, account — narrow surface, honest status.
- Consent: `storage`, `export` (+ `share_reviewer` from FM-B); bilingual notices.
- Audit chain; access history (owner's own actions).

**FM-B Share**
- Frozen share version (minimal preset), purpose-bound grant, invite with hashed single-use token, expiry, revocation.
- Reviewer: authenticated read-only snapshot view + item-anchored comments.
- Owner: access history; revoke.

**FM-C Paywall**
- Payment for a dispute file or its export (the in-product WTP test); receipts; no advocate-side money of any kind.

**FM-D Assist (AI, off by default)**
- OCR derivatives + document locations.
- Two AI proposal tasks only: **extraction** and **chronology drafting**. Both produce proposals; both schema-validated; both zero-tool.
- Private-corpus index (chunks/embeddings) only if retrieval is actually needed by those tasks; if a task works on a single document's normalised text, the index waits.

### 4.3 Features delayed (still planned, later)

| Delayed | Comes back at |
|---|---|
| Authority corpus, jurisdiction pack, citation validator, verified-deadline gate, "verified information" screen | BB2 M3, after Fast Mode exit |
| Remaining seven AI tasks (relations, contradictions, issue classification, outline, action plan, export drafting, dynamic questions) | BB2 M3 |
| Reviewer structured suggestions; shared commenting; reviewer downloads | BB2 M4 full |
| Organisation tenants, org_admin, dispute-level need-to-know | BB2 M1/M4 extension, when an FPO/SMB actually needs multi-user |
| Draft/review-gate model (T0 draft types as first-class objects) | BB2 M3 |
| Automated deletion verification job, canary probes, provider-deletion confirmations | BB2 M6 |
| Legal-hold register; break-glass tooling | BB2 M6/M0-full |
| Restore-drill automation and ledger replay tooling | BB2 M6 |
| MFA enforcement, watermarking, export download permissions for reviewers | BB2 M4/M5 |
| Vector index and hybrid retrieval | FM-D or BB2 M2 remainder |
| DOC/DOCX parsing (PDF + images + pasted text first) | FM-D |

### 4.4 Features removed from early scope entirely

Everything already excluded by EAR/BB2 remains excluded and is not a Fast Mode candidate at any price: marketplace, directory, rankings, ratings, paid placement, lead fees, success fees, send/sign/file/approve automation, outcome prediction, public criminal-matter drafting, model-callable tools, training on private files. Fast Mode adds one temporary removal of its own: **all legal and procedural content output** (FP-3).

---

## 5. Validation-first roadmap

### 5.1 (A) Earliest configuration real users can test — **FM-0, no product**

- Founder takes 5–8 real disputes from the target wedge (vendor-payment / commercial-service; FPO and small-business networks are existing distribution).
- Material is handled under a short written engagement and consent letter prepared with counsel input where possible; storage in a dedicated, access-controlled workspace, deleted on request; no AI processing of client material unless the owner agrees in writing and the provider is India-region.
- Output: a hand-built Dispute File in the exact export format FM-A will generate — brief, chronology, evidence index, issues, gaps, integrity list of file hashes computed manually.
- Measure: hours per file, which sections the owner reads, what they ask for that is missing, whether they hand it to an advocate, what the advocate says, whether they pay.

### 5.2 (B) Earliest configuration that collects WTP evidence — **FM-0 priced from file #1**

- Price the concierge file (a single number, stated before work starts; a discount for the first cohort is fine, free is not).
- Evidence hierarchy (90-day plan): paid file > signed paid pilot > deposit > "sounds useful". FM-0 reaches the top of that ladder without code.
- In-product WTP follows at **FM-C**: paid export or paid dispute file, same price point tested in FM-0.

### 5.3 (C) Fastest route to a controlled pilot — **FM-A + FM-B + §7 floor + CB1 interim posture**

Pilot entry requires, at minimum:
1. All §7 security-boundary controls implemented and tested.
2. CB1 interim paths adopted in full for OL-02, OL-03, OL-05, OL-06, OL-07, OL-08, OL-09, OL-10, OL-11.
3. **OL-01 and OL-04 closed by counsel** — these remain not risk-acceptable as a route into a pilot (CB1 §7). This is the true gate on pilot timing, and it is why counsel engagement (FD-09) should start now, in parallel with FM-0, not after the build.
4. Pilot agreement and notices in Hindi and English.
5. A small, informed cohort drawn from FM-0 participants.

### 5.4 Step exit criteria

| Step | Exit criteria (measured) |
|---|---|
| FM-0 | ≥5 real files delivered; ≥3 owners paid or signed a paid pilot; ≥2 advocates report the file reduced their time to understand the matter; founder time per file trending down; a stable question set and export format recorded |
| FM-A | A cohort user completes intake → upload → confirm → export unaided on mobile; §7 floor tests green |
| FM-B | ≥50% of exported files are shared; reviewers open the snapshot; ≥2 reviewers leave comments |
| FM-C | In-product paid conversion at the FM-0 price point from ≥3 users, or a clear negative result |
| FM-D | AI assistance measurably changes completion time or file quality without breaching any §7 control |
| FM-E | BB2 G-PILOT gates pass; counsel items closed or accepted per CB1 §7 |

---

## 6. Milestone compression analysis (M0–M7)

Legend: **Keep** (as specified) · **Reduce** (smaller scope) · **Merge** (delivered with another milestone) · **Delay** · **Flag** (built with a seam, disabled) · **Remove-early** (not in early testing at all).

### M0 Foundation → **Reduce (M0-lite), delivered inside FM-A**

| Element | Fast Mode |
|---|---|
| Tenants, memberships, roles | **Reduce** — personal tenants only; organisation type and roles exist as enums and tables, unused (**Flag**) |
| RLS helpers (`is_dispute_member`, `grant_allows`) | **Keep** — both, even though grants arrive at FM-B |
| Audit chain | **Keep** (hash chain cheap); daily anchor export **Reduce** to weekly manual |
| Storage buckets + path policies | **Keep** |
| Quarantine upload + server hash + MIME sniff | **Keep** |
| Malware scan | **Keep** (provider or accepted equivalent; not a stub at real-user time) |
| Consent framework | **Reduce** — 3 purposes at FM-A (`storage`, `export`, later `share_reviewer`); catalogue structure **Keep** |
| Deletion skeleton | **Keep** |
| CI schema lint + deletion allow-list check | **Keep** — this is what makes deferral safe |
| Security test harness | **Reduce** — the §7-mapped subset |
| Break-glass tooling | **Delay**; interim: founder is sole operator, documented in the notice, every access audited |
| MFA | **Flag** — available, enforced only when reviewer downloads exist |

### M1 Dispute Core → **Keep, with reductions**

| Element | Fast Mode |
|---|---|
| "What happened?" + intake | **Keep**; dynamic AI questions **Delay** (deterministic branching from FM-0 learnings) |
| Canonical entities + provenance + statuses | **Keep** — this is the product |
| Proposal → correction single-writer | **Keep** (non-negotiable) |
| Need-to-know inside org tenants | **Delay** with the org tenant |
| Issue classification | **Reduce** — user picks a plain-language label; no AI, no legal determination |
| Possible paths / action plan | **Reduce** — user-written next steps only; no law-sourced content |

### M2 Evidence Pipeline → **Split: half in FM-A, half in FM-D**

| Element | Fast Mode |
|---|---|
| Scan → promote → write-once original + hash + versions + custody | **Keep** in FM-A |
| Viewer + short-TTL signed URL issuance | **Keep** |
| Manual location linking | **Keep** (replaces OCR-derived locations) |
| OCR derivatives + provider abstraction | **Delay** to FM-D |
| Chunking, embeddings, retrieval RPC, canaries | **Delay** to FM-D (only if AI retrieval needs it) |
| DOC/DOCX parsing | **Delay**; PDF, JPG/PNG, pasted text first |
| Async job queue | **Reduce** — minimal queue for scan only |

### M3 AI Foundation → **Reduce hard; most of it Remove-early**

| Element | Fast Mode |
|---|---|
| AI gateway + zero-tool envelope + `ai_runs` | **Keep**, arriving at FM-D |
| Extraction, chronology tasks | **Keep** at FM-D |
| Other seven tasks | **Delay** |
| Authority corpus, jurisdiction pack, citation validator, verified-deadline gate, verified-information screen | **Remove-early** — the single biggest compression (FP-3) |
| Draft/review-gate model | **Flag** — the export profiles serve the T0 need in Fast Mode |
| Workflow state machine | **Reduce** — states exist; AI states inert until FM-D |

### M4 Reviewer Seat → **Reduce (M4-lite) = FM-B**

| Element | Fast Mode |
|---|---|
| Share versions (frozen snapshots) | **Keep** (non-negotiable) |
| Grants: purpose, scope, expiry, revocation | **Keep** |
| Invite token, contact verification | **Keep** |
| Reviewer read + comment | **Keep** |
| Structured suggestions → proposals | **Delay** (owner edits from comments) |
| Reviewer downloads + watermarking + MFA | **Delay** (no downloads in FM-B: view-only) |
| Reviewer identity particulars | **Remove-early** per CB1 §3.9.10 interim path |
| Support grants | **Delay** |

### M5 Exports + Integrity → **Merge into FM-A (lite), rest Delay**

| Element | Fast Mode |
|---|---|
| One export profile (full case file) + manifest + provenance + notices | **Keep** in FM-A |
| Multiple profiles (summary, timeline, sources tabs) | **Delay** |
| Recipient watermarking | **Delay** with reviewer downloads |
| Manifest signing | **Delay** (already deferred in SDAS) |

### M6 Deletion + Recovery → **Reduce; automation Delay to FM-E**

| Element | Fast Mode |
|---|---|
| Deletion across the (narrow) store set + honest status | **Keep** |
| Automated verification job + canary probes | **Reduce** — scripted checklist run by the founder each time, recorded in the retention record; automation at FM-E |
| Provider-deletion confirmations | **Delay** until external processors exist (FM-D) |
| Legal-hold register | **Delay** — manual, counsel-escalated (CB1 §3.6.10) |
| Backups + one restore drill with ledger replay | **Keep** one drill before any real user data (FM-A exit) |
| Envelope encryption / crypto-shredding | **Delay** (already deferred) |

### M7 Pilot Readiness → **Keep as the pilot gate (FM-E)**

Non-negotiable: full §7 test set, incident runbook, sub-processor register (only if processors exist), copy review, counsel closure for OL-01/OL-04, pilot agreement. **Reduce:** tabletop can be a one-hour walkthrough at pilot scale; monitoring can be alert emails rather than dashboards.

### 6.1 Special requirements D and E

**(D) Largest delay relative to customer learning**
1. Authority corpus + jurisdiction pack + citation validator + verified-deadline gate (weeks of work; teaches nothing about willingness to pay for file organisation).
2. Vector index, hybrid retrieval and canary infrastructure before any AI task needs them.
3. Full OCR provider integration and benchmarking before facts can be confirmed manually.
4. Automated deletion verification and restore-drill tooling at 25-user scale.
5. Organisation tenants and need-to-know before any multi-user customer exists.
6. Reviewer structured-suggestion workflow before it is known whether reviewers even open the file.

**(E) Least customer-learning value** (some are still security-required — marked ✔ = must exist anyway per §7)
- Audit anchor export automation (✔ audit chain itself), break-glass tooling, MFA enforcement before downloads, watermarking before downloads, legal-hold register, manifest signing, multiple export profiles, DOC/DOCX parsing, dynamic AI question generation, five of the nine AI tasks, dashboards.

---

## 7. Fast Mode security boundary (the hard floor)

These exist from the **first build that touches any real user's data**, at every step, without exception. They are the assignment's twelve constraints plus the minimum that makes them true in practice.

| # | Control | Why it cannot be deferred |
|---|---|---|
| S1 | Tenant and dispute isolation: RLS on every table, both authorisation helpers, server-side re-check, CI schema lint | A leak is unrecoverable; retrofitting isolation means rewriting every query |
| S2 | Deny-by-default access; no standing operator access to content; every access audited | Trust and the whole access model |
| S3 | Single-writer canonical facts; AI and reviewer input only as proposals; no direct update path | Architectural invariant; retrofitting means rewriting the data model |
| S4 | Frozen share snapshots with purpose-bound grants, scope, expiry and revocation | Invariant; the alternative (live access) cannot be walked back |
| S5 | Write-once originals: quarantine → server SHA-256 → MIME sniff → malware scan → promote; derivatives separate; custody events | Evidence integrity cannot be reconstructed after the fact |
| S6 | Private buckets, signed URLs issued only after authorisation, short TTL, no public case buckets | Basic exposure control |
| S7 | Append-only hash-chained audit; no content in any log | Investigation capability and RR R17 |
| S8 | Consent purposes enforced server-side; `model_improvement` and content analytics hard-locked off | DL D-017; user trust |
| S9 | Deletion that actually deletes across every store in the current surface, with honest user status (manual verification permitted, false "deleted" never) | RR R18; the narrow Fast Mode surface is what makes manual verification credible |
| S10 | Separate private and authority corpora — enforced by having **no** authority corpus in Fast Mode; if one appears, it is a separate schema | Invariant |
| S11 | Zero-tool AI: no tool definitions sent to any model; deterministic input assembly; schema validation; output ids ⊆ input ids | Invariant; also the main injection defence |
| S12 | Environment separation: no real data in dev, staging, demos or fixtures; private founder matter isolated | RR R09, R29 |
| S13 | Secrets server-side only; client bundle scanned | Basic |
| S14 | India-region hosting for database, storage, backups and logs | CB1 §3.5.10 interim posture |
| S15 | No send, sign, file, approve; no marketplace, ranking, lead fee or success fee code path exists | EAR L3, L4 |
| S16 | Backups encrypted with one rehearsed restore before real data | Recoverability |

**Explicitly permitted Fast Mode reductions:** manual (scripted, recorded) deletion verification instead of an automated job; weekly manual audit anchoring; no MFA until downloads exist; no watermarking until downloads exist; no break-glass tooling while the founder is the sole operator and every access is audited and disclosed in the notice; a single export profile; a minimal test subset mapped to S1–S16.

---

## 8. Fast Mode AI strategy

### 8.1 Manual-first operation (FM-0 → FM-C)
The product is fully usable and fully saleable with **no AI**. The user types or confirms everything; the value is structure, provenance, integrity and shareability. Exports state plainly that no AI was used.

### 8.2 AI-optional operation (FM-D)
AI is a per-dispute toggle requiring `ai_assistance` consent. Off by default. Turning it off at any point leaves a complete product. This is both a privacy posture and a de-risking device: if AI quality is poor, nothing breaks.

### 8.3 AI-disabled operation (permanent capability)
The manual path is never removed. It is the fallback when a provider fails (RR R15), when a user or organisation refuses AI processing, when no India-region provider exists for a capability (CB1 §3.11.10), and during any incident.

### 8.4 Minimal AI path (what FM-D actually ships)
- **Two tasks only:** extraction (document → candidate facts with locations) and chronology drafting (confirmed events → ordered timeline with precision states).
- **No legal content:** no citations, no deadlines, no rights or procedure statements, no issue classification against a legal taxonomy, no outcome or merits language of any kind.
- **Zero-tool envelope** (S11), schema-validated output, everything a proposal, `ai_runs` metadata complete.
- **Index only if needed:** if the two tasks operate on one document's normalised text at a time, no vector index is built; retrieval and canaries arrive with the tasks that need them.
- **Gate:** FM-D ships only if extraction quality on a synthetic gold set clears the project's own threshold; a failure means AI stays off and the product still sells.

Because Fast Mode emits no legal statements, the zero-tolerance gates for fabricated citations and invented deadlines are satisfied trivially — there is nothing to fabricate. They return as live gates when the authority layer returns.

---

## 9. Fast Mode reviewer strategy

**Why it stays early despite being "extra":** the pivot question of the entire thesis is whether a professional finds the file useful (EAR §3.3). That evidence cannot be bought later; it shapes whether NyayOS is a consumer tool or a professional workflow.

| Step | Reviewer mechanism |
|---|---|
| FM-0 | The owner hands the founder-produced file to their own advocate; the founder debriefs the advocate directly (richest qualitative signal, zero build) |
| FM-A | Export PDF the owner sends themselves — no reviewer account; measures whether files get shared at all |
| FM-B | In-product: frozen snapshot, grant, invite, read-only view, comments; no identity particulars (CB1 §3.9.10), no downloads, no suggestions, no directory, no matching |
| Later (BB2 M4 full) | Structured suggestions, downloads with watermarking and MFA, identity display if counsel permits, support grants |

Invariants kept from day one: snapshot not live record; minimal preset scope; expiry; revocation; access history; no re-sharing; reviewer never sees another dispute.

---

## 10. Fast Mode evidence strategy

| Aspect | Fast Mode |
|---|---|
| Ingest | Full integrity path kept (S5): quarantine, server hash, sniff, scan, write-once promotion, versions, custody |
| Types | PDF, JPG/PNG, pasted text first; DOC/DOCX later |
| Locations | **Manual** — the user marks the page/section a fact comes from; this replaces OCR-derived locations and preserves the provenance contract (MPS §11) |
| Derivatives | None in FM-A (no OCR); when OCR arrives, derivatives never touch originals |
| Index | None until a task needs it |
| Annotations | Separate from originals, as specified |
| Manifest | In every export from FM-A, with the minimal integrity scope statement (CB1 §3.8.10) and no admissibility claim |
| Deletion | Narrow surface → documents, derivatives (when they exist), exports, rows; scripted verification recorded per deletion |
| What is explicitly not claimed | That hashes prove authorship, truth or admissibility; that the manifest satisfies any statutory requirement |

---

## 11. Fast Mode legal strategy (using CB1)

Fast Mode does not lower the legal bar; it **narrows what has to be answered before real users appear**, and it adopts the conservative interim path everywhere.

| CB1 item | Fast Mode posture | Effect |
|---|---|---|
| OL-01 third-party personal data | **Still blocking the pilot.** Counsel engagement starts in parallel with FM-0 | Unchanged — Critical |
| OL-04 DPDP applicability | **Still blocking the pilot.** No risk-acceptance route | Unchanged — Critical |
| OL-02 retention | Short conservative defaults; manual deletion always available; no inactivity purge | Interim path adopted |
| OL-03 tombstone | No hash in tombstones | Interim path adopted |
| OL-05 CERT-In | Conservative configuration from the first build: India region, logs, clock sync | Interim path adopted |
| OL-06 legal hold | Owner-initiated only; third-party demands escalated to counsel; no product feature | Interim path adopted |
| OL-07 break-glass | Founder is sole operator; every access audited; disclosed in the notice; user notified | Interim path, stricter |
| OL-08 evidence wording | Minimal integrity statement; no certificate-related feature | Interim path adopted |
| OL-09 reviewer identity | **No particulars collected or displayed** in Fast Mode | Interim path adopted; narrows exposure |
| OL-10 pre-engagement confidentiality | Conservative warning before every share | Interim path adopted |
| OL-11 cross-border processing | **No external processors until FM-D**, then India-region only, else capability stays off | Largely avoided during FM-A→FM-C |

**FM-0 is not a legal shortcut.** Handling a real dispute owner's documents manually still involves personal data and a professional relationship of some kind. Fast Mode's position is that FM-0 proceeds under a written engagement and consent letter with the owner, minimal retention, deletion on request, no AI processing without written agreement — and that this arrangement is itself something to raise with counsel at first contact (CB1 §8, OL-15/OL-16). This is a founder decision, not advice.

---

## 12. Validation metrics

| Category | Metric | Measured from | Indicative target (planning, not a commitment) |
|---|---|---|---|
| Adoption | Real disputes started by target-wedge users | FM-0 count; FM-A sign-ups | FM-0: 5–8; FM-A: 15–25 |
| Adoption | Source mix (FPO/SMB network vs referral) | Intake question | Distribution recorded |
| Activation | Intake completed (facts + ≥1 document) | FM-A | ≥60% of starters |
| Activation | Time to first usable file | FM-A | Single sitting on mobile |
| Completion | Files reaching export with confirmed facts | FM-A | ≥50% of starters |
| Completion | Founder hours per concierge file (trend) | FM-0 | Declining across files |
| Quality | Correction rate on user-entered vs AI-proposed items | FM-A vs FM-D | Baseline then comparison |
| WTP | Paid concierge files | FM-0 | ≥3 of first 8 pay |
| WTP | In-product paid conversion at the same price | FM-C | ≥3 payers, or clear negative |
| WTP | Repeat purchase / second dispute | FM-C+ | Any repeat is a strong signal |
| Reviewer participation | Share rate (files shared / files exported) | FM-A/FM-B | ≥50% |
| Reviewer participation | Reviewer open rate; comment rate | FM-B | Opens ≥70% of invites; ≥2 reviewers comment |
| Reviewer value | Advocate-reported reduction in time to understand the matter | FM-0 debriefs, FM-B survey | ≥2 advocates report a reduction |
| Retention | Users returning to update a file within 30 days | FM-A+ | Any recurring use is the signal |
| Retention | Second dispute from the same organisation | FM-C+ | Tracked |
| Safety (gate, not KPI) | §7 test results, deletion verifications, incidents | Every step | Zero failures on S1–S16 |

Stop / pivot triggers mirror the 90-day plan: no payers after FM-0 and FM-C → pivot the wedge or the artifact; files exported but never shared → the professional-workflow thesis weakens; reviewers open but find the file unhelpful → redesign the file before building more product.

---

## 13. Fast Mode risk register

| ID | Risk | Severity | Mitigation | Trigger to change course |
|---|---|---|---|---|
| FMR-01 | Concierge demand ≠ software demand | High | Measure hours/file, repeat requests, and in-product conversion at FM-C | Paid concierge but zero in-product conversion |
| FMR-02 | Security floor eroded under speed pressure | Critical | §7 is a gate; CI lint from FM-A; no real data before S1–S16 pass | Any S-control skipped |
| FMR-03 | Deferred items implemented as forks, causing rework | High | §14 rules; deletion allow-list check; schema-superset discipline | Any migration that reshapes an existing table |
| FMR-04 | Manual deletion verification missed or misreported | High | Scripted checklist, recorded per deletion, narrow surface; automate at FM-E | Any unverified deletion claim |
| FMR-05 | Product looks too plain without "verified information" | Medium | That is the test; qualitative interviews capture the gap | Users consistently cite missing legal content as the reason not to pay |
| FMR-06 | Founder handles real client documents during FM-0 without adequate arrangements | High | Written engagement + consent letter; minimal retention; deletion on request; raise with counsel at first contact | Counsel advises otherwise |
| FMR-07 | Pilot pressure to proceed without OL-01/OL-04 | Critical | Not risk-acceptable (CB1 §7); FM-0 and FM-A on synthetic/consented material continue meanwhile | Any proposal to open a pilot with these open |
| FMR-08 | AI deferral leaves quality unknown until late | Medium | Manual mode is a complete path; FM-D gated on gold-set results | AI proves unusable → product still sells |
| FMR-09 | Reviewer side does not engage | High | FM-0 advocate debriefs give early signal before FM-B build | Low open rate at FM-0 → re-scope the file, not the product |
| FMR-10 | Scope creep back toward excluded features | Medium | Exclusion list; copy review; no reserved code paths | Any marketplace-shaped request |
| FMR-11 | Concierge consumes all founder time, build never starts | Medium | Cap FM-0 at 8 files; one active workstream | Files continue past the cap without new learning |
| FMR-12 | Single-operator dependency (no second approver for break-glass) | Medium | No standing access; all access audited and disclosed; add a second approver before any staff join | A second person joins |

Carry-over from RR: R01/R07/R08 are dormant in Fast Mode (no legal content) and return live with the authority layer; R02, R18, R20, R21, R29 remain fully live.

---

## 14. Reconciliation plan — how Fast Mode converges into BB2 without rework

**Rule 0.** Fast Mode is a **strict subset** of BB2: the same tables, the same column semantics, the same authorisation helpers, the same proposal/correction rules. Nothing in Fast Mode is a different design; it is less of the same design.

| Convergence rule | Detail |
|---|---|
| CR-1 Schema superset | Every Fast Mode table is a BB2 table. Deferred capability = tables **not yet created** (authority corpus, chunks, drafts, legal holds) or columns unused, never tables shaped differently. No Fast Mode table is later dropped or restructured. |
| CR-2 Helpers from day one | `is_dispute_member` and `grant_allows` exist in FM-A even before grants exist; later milestones extend their inputs, not their contract. |
| CR-3 Enums reserved | Tenant types, grant roles, purposes, draft types and tiers are declared in full in FM-A and left unused; enabling a later capability adds rows/flags, not migrations that alter types. |
| CR-4 Deletion registry | Every table registers in the deletion allow-list at creation; CI enforces. When automation arrives at FM-E, it enumerates the registry — nothing is missed retroactively. |
| CR-5 Audit catalogue | Event action names follow the BB2 catalogue from FM-A; later milestones add actions, never rename. |
| CR-6 Proposals are the only write path | AI (FM-D) and reviewers (FM-B) attach to the existing proposal pipeline with a new `origin` value — no new write path is ever created. |
| CR-7 Share versions are immutable from the start | FM-B builds the real snapshot model, not a simplified live-share that would have to be undone. |
| CR-8 Provenance contract fixed in FM-A | Item status/origin/source/confidence fields are final in FM-A; AI simply becomes another origin. |
| CR-9 Corpora never mixed | No authority corpus exists in Fast Mode; when it arrives it is created in its own schema per SDAS §12 — nothing to untangle. |
| CR-10 Manual-then-automated pairs | Manual deletion verification, manual anchoring and manual holds are **procedures over the same records** the later automation will read; automation replaces the operator, not the data model. |
| CR-11 Flags, not forks | Every deferred capability has a named flag reserved at FM-A; enabling is configuration plus the milestone's own build. |
| CR-12 Export format stability | The FM-0 hand-built file format is the FM-A export template; later profiles are additions. |
| CR-13 Gate continuity | §7 controls map one-to-one to BB2 G-PILOT gates; Fast Mode runs the mapped subset, BB2 runs the full set. Nothing passes in Fast Mode that would fail in BB2. |
| CR-14 Documentation | Each Fast Mode step files a gate report against BB2 milestone acceptance criteria, marking which criteria are met, deferred or not applicable — so BB2 remains the single source of truth for completion. |

**Where Fast Mode ends and BB2 resumes:** after FM-E, the remaining BB2 work is M2 remainder (DOC/DOCX, index if not yet built), M3 (authority corpus, pack, validators, remaining AI tasks, draft gates), M4 full (suggestions, downloads, identity if permitted), M5 full (profiles, watermarking), M6 full (automation, holds, crypto-shredding gate), M7 full — each additive.

---

## 15. Recommended path

**Adopt Fast Mode, with the §7 floor as a hard gate and the CB1 Critical items still gating the pilot.**

Recommended sequence (F — candidate milestone sequence optimised for speed):

| Order | Step | Founder-only prerequisite | Exit |
|---|---|---|---|
| 1 | **FM-0 Concierge** (no code; runs now) — in parallel, engage counsel (FD-09) for OL-01/OL-04 first | Written engagement + consent letter; pricing decision | §5.4 FM-0 criteria |
| 2 | **FM-A Thin Slice** (M0-lite + M1 + M2-lite + M5-lite) | FD-01 build authorisation, FD-02 hosting, scan provider | §7 subset green; unaided completion on mobile |
| 3 | **FM-B Share** (M4-lite) | CB1 OL-09/OL-10 interim wording | Share and reviewer-open metrics |
| 4 | **FM-C Paywall** | Pricing from FM-0 | Paid conversion or clear negative |
| 5 | **FM-D Assist** (OCR + 2 AI tasks, off by default) | India-region providers or capability stays off | Gold-set threshold met |
| 6 | **FM-E Pilot Hardening** (M6 + M7) | **OL-01 and OL-04 closed by counsel**; other OL items closed or accepted | BB2 G-PILOT |
| 7 | Resume BB2 (M3 authority layer and the rest), driven by what users asked for | — | BB2 exits |

**Explicitly gained:** paying users and reviewer evidence before major engineering; a narrower legal and security surface during early build; a cheap exit if the wedge is wrong.
**Explicitly lost:** early validation of the "verified information" differentiator; early AI quality data; a plainer early product; some later re-entry work (bounded by §14).
**Explicitly not traded:** §7 in full, and every prohibition in EAR L3–L5.

**One caution, stated plainly:** Fast Mode accelerates everything except the two Critical legal items. If counsel engagement does not start now, FM-A through FM-D will be finished and the pilot will still wait. Counsel engagement is the true critical path.

---

## 16. Handoff to M365 Copilot

**Deliverable:** `NYAYOS_FAST_MODE_STRATEGY_V1.md` (this file).

**State:** pre-build. No code, no repository work, no commits, no deployment, no database writes. No legal opinions, no compliance claims, no implementation claims. The private repository was not accessed and access was not requested.

**To record:**
1. Fast Mode = FM-0 concierge → FM-A thin slice → FM-B share → FM-C paywall → FM-D minimal AI → FM-E pilot hardening → resume BB2.
2. The defining scope decision: **no legal or procedural content output during Fast Mode**, which removes the authority/citation subsystem from the critical path and dormantises RR R01/R07/R08.
3. §7 is the immovable security floor; §14 is the rulebook that keeps Fast Mode convergent with BB2.
4. FM-0 requires no build authorisation and can start immediately; counsel engagement (FD-09) should start in the same week.
5. Pilot still requires CB1 OL-01 and OL-04 closed by counsel — not risk-acceptable.
6. Next assignment, if the founder adopts this path: a Fast Mode FM-A scope sheet mapped to BB2 acceptance criteria and the §7 test subset — specification only, to be produced before any build assignment is issued.
