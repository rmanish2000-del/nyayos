# NYAYOS SPRINT 1 FOUNDATION REVIEW — A-014

**Date:** 21 September 2026
**Mode:** Architecture Review · staging review only · no implementation · no deployment
**Reviewer role:** Principal Frontend Architect · Accessibility Specialist · Product Infrastructure Reviewer · Design-System Reviewer
**Authority tier:** 7 (review record). Gates remain governed by [FA-001](../founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md).

---

## 1. Executive summary

**The review could not be executed. The Sprint 1 artefact does not exist anywhere the reviewer can reach.**

| Location searched | Result |
|---|---|
| Canonical repository `rmanish2000-del/nyayos` | Documentation only — no code, by design (FA-001 open item: staging code location never recorded) |
| Local workspace `C:\nyayos`, Downloads, Documents, Projects, OneDrive | No Lovable export, no `.tsx`, no tokens file, no design-system artefact |
| GitHub account — all 50 repositories | No NyayOS Lovable repo. The only recently-updated Lovable-style repo, `learning-start-nexus`, is **EduOS** (confirmed from its README; not inspected further) |
| Canonical docs (Figma Brief V2, Lovable Build Brief V1, Product Spec V1, Architecture Review) | **No typography, token, spacing, colour or accessibility specification exists in any committed document.** The "canonical design references" (Hind Siliguri, Noto Sans) appear only in the review instruction, not in the repository |

Reviewing code I have not seen would violate the project's own first principle — **R01: an unsupported claim is unacceptable** — inside the document meant to enforce it. So this record does three things instead:

1. states exactly what is needed to run the review, and how to supply it (§ 2);
2. converts the six review questions into a **testable acceptance checklist measured against the canonical spec**, ready to run the moment the artefact arrives (§ 4);
3. reports the findings that **can** be made from the repository alone — and there are three material ones (§ 5).

**Go / No-Go for Sprint 2: NO-GO — conditional.** Not because a defect was found, but because a foundation declared "complete" has no reviewable artefact in the canonical system, and the Fact Card System would hard-wire on top of unverified tokens, states and type scales. See § 9.

---

## 2. What is needed to run this review

Any **one** of the following makes the review executable within the same session:

| Option | What the founder does | Notes |
|---|---|---|
| **A — GitHub sync (recommended)** | In Lovable: *Settings → GitHub → Connect* → create repo `rmanish2000-del/nyayos-app` (**private**) | Keeps code out of the docs repo, gives commit history for review, resolves the FA-001 code-location item as option (a). Reviewer reads via `gh` |
| **B — Export** | Lovable: *Export / Download code* → unzip to `C:\nyayos-app\` (**outside** the docs repo) | `.zip` and code paths are gitignored in the docs repo, so no contamination risk |
| **C — Lovable project URL + preview URL** | Share the project link and the staging preview URL | Reviewer can inspect the rendered DOM, computed styles, focus order and ARIA via the browser — **but not source**. Sufficient for accessibility and design-token review; insufficient for architecture review |

**Also needed regardless of option:** the design source of truth for tokens. If a Figma file exists for Sprint 1, share the link; if the canonical fonts were communicated to Lovable in a prompt, paste that prompt. Right now the canonical typography is **undocumented**.

---

## 3. What Sprint 1 must support — derived from the canonical spec

This is the load the foundation must bear. Every item is cited to the spec so the review has a fixed target instead of reviewer taste.

### 3.1 The state system the product requires

The product is, at its core, a **provenance renderer**. The foundation's chips and badges must be able to express every one of these without a redesign.

**Epistemic type** — [Product Spec § 10, Factual Proposition](../product/NYAYOS_MASTER_PRODUCT_SPEC_V1.md), eight values:

`user_statement` · `document_fact` · `allegation` · `ai_extraction` · `ai_inference` · `contradiction` · `missing_evidence` · `unverified_claim`

**Verification status** — Spec § 7.6 / § 11: confirm · correct · uncertain · irrelevant, plus *awaiting confirmation* (Figma Brief § 5).

**Date precision** — Spec § 7.7, Figma Brief § 6, five values, with the rule *"never visually treat inferred dates as exact"*:

`exact` · `approximate` · `inferred` · `unknown` · `conflicting`

**Evidence relation** — Spec § 7.9, five values: `supports` · `partially supports` · `contradicts` · `mentions` · `relevance uncertain`

**Confidence** — Spec § 11: **bands only** — High · Medium · Low · Unknown. *"Do not display meaningless precision such as 93.742%."*

**Contradiction posture** — Spec § 7.10, Figma Brief § 9: neutral language, side-by-side sources, **never a truth score**, never "this document is false".

### 3.2 The hierarchy rule the foundation must encode

Figma Brief § 5: *"visual hierarchy must make source/status more prominent than AI-generated wording."*

This is a **token-level** requirement, not a component one. If the type scale, colour semantics and spacing tokens do not make it structurally easier to render a source badge louder than body copy, every Fact Card will fight the system.

### 3.3 The audience constraints the foundation must respect

- **Mobile-first**, priority order Intake → Upload → Fact confirmation → Timeline → Export (Figma Brief § 18). *"Desktop adds density, not different product logic."*
- Users **without legal knowledge** (Spec § 2); small-business / FPO owners (D-006) — realistically shared Android devices, variable connectivity, Hindi and regional scripts (Master Context § 4).
- **Multilingual procedure is named as a moat** (Master Context § 4). A foundation whose type system cannot render Devanagari natively is a moat with a hole in it.

---

## 4. Acceptance checklist — to be executed against the artefact

Each row is a pass/fail check with the evidence the reviewer will capture. Severity reflects the cost if it fails *after* Sprint 2 starts.

### 4.1 Architecture — can the foundation carry Fact Cards, Evidence Cards, Timeline, Contradiction Engine, Evidence Mapping, Export?

| # | Check | Evidence to capture | Severity if failed |
|---|---|---|---|
| A1 | Status chips, source badges and date badges are **driven by enums that match § 3.1 exactly** (or a mapping layer exists), not by free-text props | Component prop types; any `variant: string` is a fail | **Critical** — every downstream card re-invents state |
| A2 | Badge/chip components accept **the eight epistemic types** without a new variant being needed | Enumerated variants vs § 3.1 | Critical |
| A3 | Components are **data-agnostic presentational primitives** — no fetching, no business logic, no dispute-specific assumptions | Import graph; no Supabase/query imports in `components/ui` | High |
| A4 | A **composition primitive** exists for "label + source + status + actions" (the Fact Card skeleton) or the primitives compose cleanly into one | Attempt to assemble Figma Brief § 5 layout from existing primitives only | High |
| A5 | Layout primitives support **side-by-side comparison** on mobile (Contradiction Engine, Figma Brief § 9) — stacked with clear pairing, not horizontal overflow | Responsive behaviour at 360px | High |
| A6 | Timeline can render **five date-precision states distinguishably** at a glance and *inferred never looks like exact* (§ 3.1) | Visual diff of the five states | **Critical** — direct spec rule |
| A7 | Export surface: primitives render correctly in a **print / PDF context** (no `position: fixed` nav bleed, print stylesheet or equivalent) | Print preview of a page using the foundation | Medium now, High by Export sprint |
| A8 | Navigation shells (mobile/tablet/desktop) are **one product logic, three densities** (Figma Brief § 18), not three information architectures | Route/IA comparison across breakpoints | High |
| A9 | Notification banners support the **"Information to review"** and **"What may still be useful"** neutral-tone patterns (Figma Brief § 9–10) — i.e. an *informational-neutral* variant exists, not only success/warning/error | Banner variants | Medium |
| A10 | Progress indicator supports **non-linear, resumable** intake ("save and exit", "I don't know" — Figma Brief § 3), not a fixed step count | Component API | Medium |
| A11 | No hard-coded copy that violates the **do-not-use** list (AI Lawyer, Predict Your Case, Win Your Case, etc. — Figma Brief) | grep of source strings | High — trust/regulatory |

### 4.2 Design system — tokens, spacing, typography, colour semantics, hierarchy

| # | Check | Evidence | Severity |
|---|---|---|---|
| D1 | Tokens are **semantic**, not literal (`--color-status-inferred`, not `--amber-500` used directly in components) | Token file + component usage grep | **Critical** — semantic drift compounds every sprint |
| D2 | Colour semantics are **reserved for epistemic meaning**: the palette distinguishes user / document / AI / third-party / contradiction / verified **without relying on colour alone** (icon or label always present) | Token map vs § 3.1; WCAG 1.4.1 | Critical |
| D3 | **Source and status tokens outrank body text tokens** in weight/contrast/size (§ 3.2) | Type scale + weight tokens | Critical — direct spec rule |
| D4 | Type scale has a **legible minimum ≥ 14px on mobile** for body, ≥ 12px for badge text; line-height ≥ 1.4 for Devanagari | Tokens | High |
| D5 | Spacing scale is a **single base grid** (4 or 8) with no ad-hoc values in components | grep for raw `px` in components | Medium |
| D6 | **Font stack covers Devanagari** natively (see § 5.1) and falls back gracefully; `font-display` set; no FOUT that reflows badges | `@font-face`, computed style on Hindi sample text | **Critical** for a Hindi-first audience |
| D7 | Confidence is rendered as **bands** (High/Medium/Low/Unknown) — no percentage component exists | Component inventory | High — direct spec rule |
| D8 | Component hierarchy is **primitives → composites → patterns**, and Sprint 1 shipped only primitives + shells (no premature composites that lock in Fact Card layout) | Directory structure | Medium |
| D9 | Dark mode: if shipped, **semantic tokens re-map**; if not shipped, tokens are structured so it can be added without touching components | Token architecture | Low now |

### 4.3 Accessibility — WCAG 2.2 AA

| # | Check | WCAG SC | Evidence | Severity |
|---|---|---|---|---|
| X1 | Every interactive element reachable and operable by **keyboard**; no keyboard traps in navigation drawers | 2.1.1, 2.1.2 | Tab-through recording | Critical |
| X2 | **Visible focus** on all controls, ≥ 3:1 against adjacent colours, not removed by `outline: none` without replacement | 2.4.7, **2.4.11 Focus Not Obscured (new in 2.2)**, 2.4.13 | Screenshots per component; sticky nav must not cover focused element | Critical |
| X3 | Status chips / badges expose meaning to **screen readers** — visible text or `aria-label`; colour-only chips fail | 1.1.1, 1.4.1 | AT announcement per variant | Critical |
| X4 | Notification banners use **`role="status"` / `role="alert"`** appropriately; not every banner is an alert | 4.1.3 | Markup | High |
| X5 | Progress indicator exposes **current step / total** to AT | 1.3.1, 4.1.2 | Markup | Medium |
| X6 | **Reduced motion**: all transitions respect `prefers-reduced-motion`; no parallax/auto-animation without it | 2.3.3 | Emulate reduced-motion, observe | High |
| X7 | **Target size ≥ 24×24 CSS px** for all controls (new in 2.2), ≥ 44px recommended for primary actions on mobile intake | **2.5.8** | Measured hit areas | High |
| X8 | Text contrast ≥ 4.5:1, UI component contrast ≥ 3:1 — **including every badge variant** on its own background | 1.4.3, 1.4.11 | Contrast table for all variants | Critical |
| X9 | **Dragging is not the only way** to do anything (relevant to Evidence Mapping later) | **2.5.7** | Component API | Low now, High by Evidence Mapping |
| X10 | **`lang` attribute** correct at document and, for mixed Hindi/English, at element level | 3.1.1, 3.1.2 | Markup | High for Devanagari + AT |
| X11 | Mobile navigation: drawer traps focus while open, returns focus on close, closable by Escape | 2.1.2, 2.4.3 | Manual test | High |
| X12 | Zoom to **200% and 400%** without loss of content or horizontal scroll at 320px | 1.4.4, 1.4.10 | Screenshots | High |
| X13 | Inputs have **programmatic labels**, error text associated via `aria-describedby`, and no placeholder-as-label | 1.3.1, 3.3.1, 3.3.2 | Markup | Critical |
| X14 | Dynamic-type / user font-size preference respected (rem-based scale, not px) | 1.4.4 | Tokens | Medium |

### 4.4 State system sufficiency — the six required states

| Required by review brief | Spec source | Must be expressible by | Check |
|---|---|---|---|
| User statement | `user_statement` | Source badge | S1 — distinct variant exists |
| Document extraction | `document_fact` + `ai_extraction` — **two different things**; the spec separates *what the document says* from *what the AI extracted from it* | Source badge **+** status chip | S2 — both distinguishable; extraction shows *awaiting confirmation* |
| AI inference | `ai_inference` | Source badge | S3 — visibly **less** authoritative than extraction and statement |
| Third-party allegation | `allegation` | Source badge | S4 — neutral, not accusatory styling |
| Contradiction | `contradiction` | Status chip + banner | S5 — neutral tone, no truth score |
| Verified source | Verified Information (Spec § 7.13): publisher, jurisdiction, date/version, *last verified* | Source badge **+ metadata slot** | S6 — badge can carry or link to provenance metadata |

**Plus two the brief omitted but the spec requires:** `missing_evidence` and `unverified_claim`. Check **S7**: both expressible without a new component.

**Date badges**, separately: check **S8** — the five precision states from § 3.1, plus a **range** presentation (`date_from`/`date_to` in Date Assertion) for *approximate*.

### 4.5 Fact Card readiness — can Sprint 2 start without redesign?

The Fact Card (Figma Brief § 5, Spec § 7.6) is: **value · source document · page/location · confidence band · status · four actions** (Confirm / Correct / Uncertain / Not relevant).

| # | Readiness check | Depends on |
|---|---|---|
| F1 | Four-action button group fits a 360px card **without wrapping into ambiguity** — Button System must have a compact/secondary tier | Button System |
| F2 | Source badge + page reference + confidence band + status chip **coexist in one row or a defined two-row pattern** | Badges, spacing tokens |
| F3 | The card can render **source/status above value** (hierarchy rule § 3.2) | Type scale |
| F4 | *Correct* opens an input **inline** — Input System must support inline edit with the original value preserved and visible (Spec US-03: *"correction supersedes display but original extraction remains auditable"*) | Input System |
| F5 | *Uncertain* produces a persistent visual state, not a transient toast | Status Chips |
| F6 | Date-bearing facts render the **date badge with precision** inside the card | Date Badges |
| F7 | A contradiction-flagged fact can show a **paired-source affordance** without breaking card layout | Layout primitives |
| F8 | Card is fully **keyboard-operable** and announces value → source → status → actions in that order | Accessibility baseline |

If F1–F8 pass on paper against the shipped primitives, Sprint 2 can start without redesign. If any of F1, F3, F4 fail, Sprint 2 will redesign the foundation while building on it — the worst case.

---

## 5. Findings available now — from the repository alone

These do not require the artefact. They are real, and two are material.

### 5.1 Typography drift — root cause is a governance gap, not a Lovable error · **HIGH**

**Finding:** the canonical typography (Hind Siliguri, Noto Sans) is **recorded nowhere in the repository.** Not in the Figma Brief V2, not in the Lovable Build Brief V1, not in the Product Spec, not in the Architecture Review. A grep for `font`, `typeface`, `Hind`, `Noto`, `Devanagari` across all canonical docs returns **zero hits**.

**Why this probably happened:** Lovable generates a default type system when the prompt does not specify one; its defaults skew editorial — a serif display face with a humanist sans body is a common output. **Libre Baskerville + IBM Plex is what you get when you do not say otherwise.** Nobody said otherwise, because the decision was never written down where a build brief would carry it. This is not a Lovable defect. It is an undocumented decision being filled in by a default.

**Risks of the shipped pair, if confirmed:**

| Risk | Detail |
|---|---|
| **No Devanagari coverage** | Libre Baskerville has no Devanagari glyphs. Hindi text will fall back to whatever the OS supplies — different metrics, different weight, visibly "broken" mixed-script lines. IBM Plex *Sans* has a Devanagari companion (*IBM Plex Sans Devanagari*); Plex *Serif* does not. If a serif is in headings, **every Hindi heading is a fallback** |
| **Legibility for the actual audience** | A serif display face at mobile sizes, on low-end Android panels, for users the spec defines as *without legal knowledge* under stress, is the wrong bet. Sans-serif Indic text has better small-size legibility on low-DPI screens |
| **Tone** | Baskerville reads as *legal-institutional*. The Figma Brief's whole register — "Tell us what happened in your own words" — is the opposite. The type is arguing against the copy |
| **Lock-in** | Fact Cards, Timeline and Export will hard-code type scale, line-height and badge sizing against these metrics. Swapping fonts after Sprint 2 means re-tuning every component. **This is the last cheap moment to change it** |

**A second finding inside the canonical reference itself — verify before adopting:** *Hind Siliguri* is the **Bengali** member of the Hind family. Devanagari coverage in that family comes from **Hind** (the base face). For Hindi-first NyayOS the intended pairing is almost certainly **Hind (Devanagari) or Noto Sans Devanagari** for Indic text, with **Noto Sans** for Latin. If Hind Siliguri was chosen deliberately for Bengali-region users, that is a launch-geography decision (currently *provisional*) and should be recorded as such. If it was a naming slip, correct it before it becomes the token.

**Recommendation — record, do not change (per instruction):**
1. Add typography to the Decision Log as a new entry (**D-019 candidate**): Indic face, Latin face, fallback stack, minimum sizes, and the hierarchy rule from § 3.2 — with a revisit trigger.
2. Confirm Devanagari coverage of whatever is chosen with a rendered Hindi sample at 14px and 12px on a 360px viewport.
3. Fix at the **token layer** — `--font-sans`, `--font-indic`, type scale — **before Sprint 2**, because Fact Cards are where type metrics get frozen.
4. Append a "Design tokens" section to the Figma Brief (or a new `NYAYOS_DESIGN_TOKENS_V1.md`) so the next build brief carries it. The V1 briefs cannot be edited in substance; a new tier-5 document is the mechanism.

### 5.2 A "completed" sprint has no artefact in the canonical system · **CRITICAL (process)**

FA-001 recorded an open item on 21 September: *where does staging code live?* It was never answered, and Sprint 1 was completed anyway. The result is exactly what the continuity mandate exists to prevent: a deliverable the founder is being asked to gate on, that the project's own source of truth cannot see.

This is not a code defect. It is the risk **R24** (*architecture/build work dominates validation*) and the assignment-register rule (*"no assignment is done until its Evidence field points at a committed artefact"*) both firing at once.

**Recommendation:** resolve the FA-001 code-location item now — option **A** in § 2 is the clean answer — and add A-011's Sprint 1 to the output register only when a reviewable artefact exists.

### 5.3 The state taxonomy is fully specified, so the foundation can be held to it · **INFORMATIONAL — favourable**

Unusually for a pre-Sprint-2 project, the epistemic types, verification statuses, date precisions, evidence relations and confidence bands are **all enumerated in the Product Spec** (§ 3.1 above). The review will not have to argue about what a chip should mean. Whatever Sprint 1 shipped either matches these enumerations or it does not — that is a mechanical check, and it is the single most important one in § 4.

---

## 6. Strengths · 7. Weaknesses · 8. Critical issues

**Cannot be assessed** for the build — no artefact. Assessed for the *foundation's specification*:

**Strengths (of the spec the build must meet):** complete state taxonomy (§ 5.3); explicit hierarchy rule (§ 3.2); mobile-first order stated; do-not-use copy list exists; confidence-band rule prevents precision theatre.

**Weaknesses (of the spec):** no typography, token, spacing, colour or accessibility specification anywhere (§ 5.1); no WCAG target stated in any canonical doc — 2.2 AA appears only in the review instruction; no Devanagari/multilingual rendering requirement despite multilingual being a named moat.

**Critical issues (process):** § 5.2.

---

## 9. Go / No-Go recommendation for Sprint 2

### **NO-GO — conditional. Re-evaluate the same day the artefact is supplied.**

| Reason | Type |
|---|---|
| Sprint 1 is not reviewable from the canonical system | Blocking — evidence |
| Typography is undocumented and reportedly drifted; Fact Cards will freeze type metrics | Blocking — must be decided at token level **before** Fact Cards |
| No confirmation that chips/badges match the eight epistemic types and five date precisions | Blocking — Fact Cards are built *from* these |
| WCAG 2.2 AA baseline unverified (2.4.11, 2.5.8 are new and commonly missed) | Blocking — retrofitting focus/target-size into a card system is expensive |

**Conditions to convert to GO** — all four:

1. Artefact supplied via § 2 (A or B preferred).
2. Checklist § 4 executed; **zero Critical fails** in A1, A2, A6, D1, D2, D3, D6, X1, X2, X3, X8, X13; all High fails have a dated fix in Sprint 2's first day, not its last.
3. Typography decision recorded (D-019 candidate) and applied at the token layer.
4. FA-001 code-location item closed.

**What may proceed now without waiting:** Sprint 2 **design** work on the Fact Card in Figma (A-008), against § 3.1 and § 4.5 — that is exactly the work that de-risks the build and it needs no code.

---

## 10. Risk ratings

| Dimension | Rating | Basis |
|---|---|---|
| **Architecture** | **UNRATED — no artefact.** Spec-readiness: *Low risk* (taxonomy fully enumerated) | Cannot rate code unseen. Will not invent a rating |
| **Accessibility** | **UNRATED — no artefact.** Governance: *High risk* (no WCAG target in any canonical doc; 2.2-specific criteria unaddressed) | The absence of a stated target is itself the risk |
| **Design system** | **UNRATED — no artefact.** Governance: **High risk** (typography undocumented; reported drift; Devanagari coverage unconfirmed; reference font name may be a Bengali/Devanagari slip) | § 5.1 |
| **Process / continuity** | **CRITICAL** | § 5.2 — a gated deliverable invisible to the source of truth |

---

## Handoff to M365 Copilot

1. **Review blocked on artefact access, not on findings.** Supply the Sprint 1 build via § 2 (option A recommended: Lovable → GitHub → private `nyayos-app`).
2. **Three actions do not need the artefact and should start now:** record the typography decision (D-019 candidate, § 5.1); close the FA-001 code-location item (§ 5.2); begin Fact Card design in Figma against § 3.1 / § 4.5.
3. **Verify "Hind Siliguri"** — Bengali member of the Hind family; Devanagari coverage is *Hind* or *Noto Sans Devanagari*. Confirm intent before it becomes a token.
4. On artefact receipt, this checklist (§ 4) is executed as **A-014 continuation**, same session, same document — results appended below § 10, Go/No-Go re-issued.
5. **Sprint 2 build should not start until the four GO conditions in § 9 are met.** Sprint 2 *design* may.

**Rules honoured:** no code modified, nothing deployed, nothing implemented. Review record only.
