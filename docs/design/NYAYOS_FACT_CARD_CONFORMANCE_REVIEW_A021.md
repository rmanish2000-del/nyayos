# NYAYOS FACT CARD DESIGN CONFORMANCE REVIEW — A-021

**Date:** 21 September 2026
**Reviewed commit:** `bbacbb481a0e8188b2753b68f089f258104ba1c1` — *A-020 Fact Card system (provisional staging implementation)*
**Mode:** Claude Code — Design Conformance Review · read-only · no code modified · nothing deployed
**Authority tier:** 7 (review record)

---

## 0. What this review is, and is not

The instruction called this an **A-008** review. A-008 is *Figma V2 — Fact Card and journey design*, and **it does not exist** — A-020's own register entry says so: *"visual design derived from the Master Product Spec text because A-008 does not exist; design conformance is unverified."* There is no Figma to conform to.

So this is conformance against the **canonical text**, which is what the implementation itself was built from:

- Figma Brief V2 § 5 (fact confirmation), § 6 (timeline states), § 9 (contradictions)
- Master Product Spec § 7.6–7.10, § 10 (data model), § 11 (provenance contract)
- A-014 § 3 (required state system), § 4.5 (Fact Card readiness), § 11.4 (Sprint 1.1 scope)

It is registered as **A-021**. A-008 stays OPEN. A Figma-level conformance review remains impossible until A-008 exists.

## 1. Verdict

### **FAIL — conditional.** Not acceptable as the Sprint 2 Fact Card yet. Close in one bounded fix pass (§ 4).

The build is competent and honest: 23/23 tests, typecheck/lint/build green, every state renders with visible text, contradictions are never resolved, no scoring language anywhere, layouts hold at 390 / 834 / 1280 with no overflow and every target ≥ 44 px, contrast passes 25 of 27 samples. It fails on **what a Fact Card is for**, not on craft:

| Area | Result | One-line reason |
|---|---|---|
| Fact Card states | **FAIL** | The states exist; the **actions** that produce them don't. Spec § 7.6: Confirm · Correct · Uncertain · Irrelevant. Implemented: Correct only |
| Source provenance | **FAIL** | Provenance is **hidden behind "Show sources"**. Spec § 7.6 lists source document and page/location among what the card *shows*; the brief's hierarchy rule says source/status must outrank the wording. Here the wording is the largest text and the source is collapsed |
| Date precision | **PASS** | All five states; inferred/approximate never look exact; unknown handled |
| Contradictions | **PARTIAL** | Side-by-side, neutral, unresolved, no truth score — right. But no *confirm difference / resolve / leave unresolved* actions, and the banner copy promises "confirm or correct either" with no control to do it |
| Confidence bands | **PARTIAL** | Low / Medium / High, text only, no numbers — right. **Unknown is missing** (Spec § 11) |
| Inline corrections | **PASS** | Original preserved and shown, reason captured, save/cancel, disabled-while-saving, corrected state with strikethrough of the previous value, live announcement. Notes in § 3 |
| Accessibility | **PASS with fixes** | Focus ring 7.5:1, 44 px targets, keyboard-operable, `aria-expanded`/`aria-controls`, `article aria-labelledby`. Two contrast failures from opacity dimming; `aria-controls` dangles while collapsed; NVDA/VoiceOver pass still not run |
| Mobile / Tablet / Desktop | **PASS** | 390: one column, contradictions stack, bottom bar cleared. 834: one column, contradictions side-by-side, rail. 1280: two columns. No horizontal overflow at any width |

## 2. Evidence

### 2.1 Validation at `bbacbb4` (re-run locally, 21 Sep 2026)

`tsc --noEmit` PASS · `eslint .` 0 errors / 7 pre-existing warnings · `vitest run` **23/23** · `vite build` PASS. CI on the commit: `task-gate`, `dependency-check`, `status-update` all green. Matches A-020's claims exactly.

### 2.2 Browser measurements (dev server, Chromium, three viewports)

| Measurement | 390 × 844 | 834 × 1100 | 1280 × 1000 |
|---|---|---|---|
| Horizontal overflow | none | none | none |
| Card grid columns | 1 | 1 | 2 |
| Contradiction version columns | **1 (stacked)** | 2 | 2 |
| Navigation | bottom bar 57 px; `main` padding-bottom 96 px | left rail 192 px | sidebar |
| Interactive targets < 44 px | 0 | 0 | 0 |

**Contrast (computed from rendered `oklch` tokens, WCAG 2.x formula):** 27 text samples across all six cards; **25 pass**, minimum passing 4.77:1, body text 17.3:1, labels 7.4:1, badge text 7.0–7.7:1. Focus ring 7.52:1 on white.

Two failures, both caused by **opacity used for de-emphasis** rather than a colour token:

| Text | Ratio | Cause |
|---|---|---|
| `· Approximate date` suffix (and every `· <precision>` suffix) | **4.39** | `opacity-80` on 12 px text |
| `PACKAGING CONDITION` label on the not-relevant card | **3.97** | `opacity-75` on the whole card |

**Keyboard / ARIA:** Tab order inside a card is *Show sources → Correct this*. "Correct this" opens the form and keeps focus on the trigger (standard disclosure behaviour); Cancel returns focus to the trigger; the form unmounts. "Show sources" toggles `aria-expanded` correctly and the `aria-controls` target exists once open — **but not while collapsed**, because the panel is conditionally rendered; axe flags this as an invalid reference. Screen-reader labels present: `Status:` / `Source:` prefixes, `, <precision>` on dates, `for extraction` on confidence.

### 2.3 Source inspection

`fact-card.tsx` (161 lines), `source-panel.tsx`, `confidence-band.tsx`, `inline-correction-input.tsx`, `status-chip.tsx`, `source-badge.tsx`, `date-badge.tsx`, `styles.css` token diff, `fact-card.test.tsx`, `foundation.test.tsx`, `routes/index.tsx` FactsView.

## 3. Findings — ranked

| # | Finding | Spec | Severity |
|---|---|---|---|
| **1** | **Confirmation actions missing.** The card offers *Correct this* only. *Confirm*, *Uncertain* and *Not relevant* — three of the four actions in Spec § 7.6 / Brief § 5, and the whole point of US-03 — have no control. A user cannot confirm a fact | § 7.6, US-03 | **High** |
| **2** | **Provenance collapsed by default.** Source document and page/location are behind a toggle. Spec § 7.6 lists them as *shown*; Brief § 5: *"visual hierarchy must make source/status more prominent than AI-generated wording."* The value is `text-lg` — the largest element — and the source is invisible until clicked. The relationship the product exists to make visible is the one thing hidden | § 7.6, Brief § 5, A-014 § 3.2 | **High** |
| **3** | **`document_fact` and `ai_extraction` still conflated** in one `document-extracted` kind; **`unverified_claim` still absent.** A-014 § 11.4 item 2 — a Sprint 1.1 scope item — was not done, yet A-018 is CANONICAL | § 10, § 11; A-014 § 11.4 | **High** |
| **4** | **Contradiction actions missing.** Brief § 9: *confirm difference · resolve with user · leave unresolved*. None exist. The banner copy says *"you can confirm or correct either"* — a promise the UI cannot keep | Brief § 9 | **Medium–High** |
| **5** | **Confidence band lacks `Unknown`.** Spec § 11 bands are High / Medium / Low / **Unknown**. Implementation: three | § 11 | **Medium** |
| **6** | **Verified-source metadata has nowhere to live.** `FactSource` carries origin / locator / excerpt. Spec § 7.13 requires publisher, jurisdiction, date/version, source link, *last verified* for verified information. A-014 S6, still partial | § 7.13 | **Medium** |
| **7** | **Two contrast failures from opacity dimming** (§ 2.2). Replace `opacity-75/80` with muted colour tokens that are themselves ≥ 4.5:1 | WCAG 1.4.3 | **Medium** |
| **8** | **Hue overload not addressed — and extended.** A-014 § 11.4 item 6 asked for distinct provenance vs status hue families. Instead `confidence-low` = contradiction red, `confidence-medium` = uncertain = review = inference amber, `confidence-high` = verified = confirmed = exact green. Confidence now shares hues with *both* other axes | A-014 D2 | **Medium** |
| **9** | **`aria-controls` references a non-existent id while collapsed.** Render the panel hidden (`hidden` attribute) or drop `aria-controls` until open | WCAG 4.1.2 (axe `aria-valid-attr-value`) | **Low** |
| **10** | Correction **reason is captured but never shown** after save; the correction does not add a `user-correction` source to the fact. Both are wiring the model already supports | § 7.6, US-03 | **Low** |
| **11** | Contradiction banner title *"Two versions of this information"* vs the brief's *"Information to review"* (used on the chip, not the banner) | Brief § 9 | **Low** |
| **12** | Value uses the `font-serif` token — which resolves to Noto Sans, so harmless, but the token name is vestigial and will mislead the next designer | — | **Low** |

### What is right — say it plainly

Enum-driven states with visible text and `sr-only` prefixes · the inline-correction form is the best-built piece in the repo (original value shown, `aria-describedby` to it, save disabled on empty, disabled-while-saving, focus returns cleanly) · contradiction presented side-by-side, stacked on mobile, never resolved, never scored · verbatim excerpts in a `blockquote` · `unknown-date` handled with its own label · all three viewports behave exactly as the showcase text says · 44 px everywhere · 25/27 contrast without anyone having measured it before.

### Governance observation — not a code finding

A-018 was set CANONICAL with A-014 § 11.4 items 2, 6 and 7 undone. A-020 set *itself* CANONICAL while declaring its conformance unverified. Under the status rules CANONICAL means *accepted as project truth*; a build that says "unverified" about itself should enter at **REVIEW** and be promoted by a review like this one. Neither is demoted — canonical is never demoted — but the next build outputs should land at REVIEW. Recommended as a rule clarification (§ 6).

## 4. Required fixes — to convert FAIL → PASS

Bundled as **A-022 — Fact Card conformance fixes**. All additive; no redesign. Order matters: 1–3 are the product, 4–9 are polish.

1. **Add the three missing actions** — *Confirm*, *Uncertain*, *Not relevant* — as a button group beside *Correct this*, each producing its status. `compact` size exists for the 360 px case.
2. **Show provenance on the card, always.** A one-line source strip under the value: `SourceBadge` + origin + locator (+ date badge). Keep *Show sources* for the full panel with excerpts. Make the value `text-base font-medium` and the source strip the visually dominant row, per Brief § 5.
3. **Split `document-extracted` → `document-fact` + `ai-extraction`; add `unverified-claim`.** Tokens and two badges. This is A-014 § 11.4 item 2, still owed.
4. **Contradiction actions:** *Confirm difference* · *Resolve* (opens correction on the chosen version) · *Leave unresolved*. Or change the banner copy to stop promising them.
5. **Add `ConfidenceBand` `unknown`.**
6. **Extend `FactSource`** with optional `publisher`, `jurisdiction`, `version`, `link`, `lastVerified`; render them in the panel for `verified-source`.
7. **Replace opacity dimming** with muted colour tokens that pass 4.5:1 (`text-muted-foreground` is 7.4:1 — use it); re-measure.
8. **Give confidence its own hue family** (or a neutral greyscale ramp with icon differentiation) so it cannot be read as a status or a provenance.
9. **`aria-controls`:** render the panel with `hidden` when collapsed, or set `aria-controls` only when open.
10. Show the correction reason after save; append a `user-correction` source on correction.

**Re-review scope after A-022:** items 1–3 by inspection + test; 7 by re-measurement; then NVDA pass (still owed from A-014).

## 5. Status consequences

| Task | Before | After this review |
|---|---|---|
| A-020 Fact Card provisional | CANONICAL (self-declared, "unverified") | Stays CANONICAL *as a provisional implementation*; **design conformance recorded FAIL (conditional)** |
| A-021 this review | — | CANONICAL — evidence: this document |
| **A-022 Fact Card conformance fixes** | — | **OPEN**, inputs A-020 + A-021 (both canonical) — may start immediately under FA-001 |
| A-015 Sprint 2 Fact Card System | OPEN, planned on A-008 | OPEN, planned on **A-008 + A-022** |
| A-008 Figma V2 | OPEN | OPEN — **unchanged**; this review is not a substitute for the design |

## 6. Recommendation to the founder

- Run **A-022** before any further Sprint 2 surface (Evidence Cards, Timeline). Items 1–3 are the difference between a card that *displays* a fact and one that lets a user *confirm* it.
- Clarify in the status rules: **build outputs enter at REVIEW**; a conformance review promotes them.
- Decide whether A-008 (Figma) is still wanted now that a working implementation exists. If not, record it as SUPERSEDED by A-020 + A-022 and stop carrying a phantom dependency. If yes, assign it.

**Rules honoured:** no source file modified; nothing deployed; dev server started locally for measurement and stopped.
