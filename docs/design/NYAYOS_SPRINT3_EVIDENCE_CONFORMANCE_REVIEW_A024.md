# NYAYOS SPRINT 3 EVIDENCE CONFORMANCE REVIEW — A-024

**Date:** 21 September 2026
**Reviewed commit:** `296fad81b5a122cb38c360919a14d145ac234c8b` — *feat: add Sprint 3 evidence components (A-023)*
**Mode:** Claude Code — Design Conformance Review · read-only · no code modified · nothing deployed
**Authority tier:** 7 (review record)

---

## 0. Baseline

**"S08" and "S09" are not canonical identifiers.** They appear only in A-023's own register entry; no canonical document carries a numbered screen list. The baseline for this review is therefore:

- **Figma Brief V2 § 4 — Evidence locker.** Each document card: file name · document type · status · number of pages · extracted facts · upload date · confidence · verification state. Actions: view · rename · confirm · correct · delete.
- **Product Spec § 7.4 — Document ingestion.** MVP inputs: PDF, JPG/JPEG, PNG, DOC/DOCX, **pasted text**. Each upload gets: document ID · hash · file type · page count · **processing state** · **extraction state** · owner/tenant · timestamp.
- **Product Spec § 7.5 / § 17 — pipeline.** `Upload → security scan → (queue) → OCR/parser → extraction → provenance → user confirmation`. "Extraction ≠ fact."
- **Product Spec US-02.** Private upload · processing status · source reference · deletion available. *Failure: failed processing preserves original file and explains status.*
- **Product Spec § 10 — Document entity.** `processing_status` and `ocr_status` are **two fields**; `page_count`; `content_hash`; `created_at`.
- **Product Spec § 11 — Provenance contract.** Applies to *extracted/generated items*. A document is a **source**, not an extracted item.
- **Figma Brief § 8.** "Every relationship opens the source."

A Figma design still does not exist (A-008 OPEN). Conformance is against the text the implementation was built from.

## 1. Verdict

### **FAIL — conditional. Narrower than A-021.** Close in one bounded fix pass (§ 4, → A-025).

Upload works, processing and error states are well built, and every accessibility measurement that can be taken without assistive technology passes or nearly passes. It fails on the **document model**: two orthogonal things (lifecycle and category) are folded into one enum, documents are labelled with the epistemic badges that belong to *facts*, and the locker card is missing three of the brief's eight fields and four of its five actions — including *view*, without which provenance cannot be opened.

| Area | Result | One-line reason |
|---|---|---|
| Document Upload (S08) | **PASS with fixes** | Chooser + drop target + queue work; keyboard path via button; labelled `input[type=file]`. No `accept`, no size/type validation → no *unsupported file* state; no **pasted-text** entry (§ 7.4 MVP); no drag-over feedback |
| Evidence Locker (S09) | **FAIL** | Search, state filter, count, empty state all work. Cards lack **page count, upload date, verification state** (Brief § 4) and offer **only *Remove*** of the five actions — no *view* |
| Upload states | **PASS** | Labelled `progressbar` with live value; Cancel; Remove withheld while uploading; 44 px targets. Note: newly chosen files are "uploading at 0 %" — semantically *queued* |
| Processing states | **PASS with note** | Spinner, copy, live announcement. One state where the spec has three (scan → OCR → extraction) and two fields (`processing_status`, `ocr_status`); **no security-scan state**, so a rejected file has nowhere to land |
| Error states | **PARTIAL** | `role="alert"`, *Retry*, *Remove*, and the exact US-02 copy — right. But **Cancel routes to the error state** and fires an assertive alert for the user's own action; no distinct *rejected* / *unsupported* outcome |
| Uncategorized states | **FAIL** | Modelled as a **lifecycle state**. Category is an attribute of an extracted document (§ 7.5 extracts *document type*); an extracted-but-uncategorized file cannot be represented. Same axis-conflation A-021 found on the Fact Card |
| Accessibility | **PASS with fixes** | 43 contrast samples, 40 pass; **3 fail from `opacity-80` on the `SourceBadge` detail** (4.39, 4.39, 3.85) — the same defect class A-022 fixed elsewhere, now on every evidence card. **Two `<h1>`s** on one page. Cancel-as-alert (above). Everything else measured: targets, labels, live region present at mount, `aria-pressed` toggle, `aria-describedby` message |
| Mobile / Tablet / Desktop | **PASS** | 390: one column, filters stacked, drop zone 358 × 216, bottom bar. 834: one column, filters two-up, rail. 1280: two columns. No horizontal overflow on either screen at any width |

## 2. Evidence

### 2.1 Validation at `296fad8` (re-run locally)

`tsc --noEmit` PASS · `eslint .` 0 errors / 7 pre-existing warnings · `vitest run` **34/34** (3 files) · `vite build` PASS. CI: `task-gate`, `dependency-check`, `status-update` green. Matches A-023's claims.

### 2.2 Browser measurements (dev server, Chromium)

| | 390 × 844 | 834 × 1100 | 1280 × 1000 |
|---|---|---|---|
| Horizontal overflow (upload / locker) | none / none | none / none | none / none |
| Card grid columns | 1 | 1 | 2 |
| Locker filter layout | stacked (1) | two-up (2) | two-up |
| Navigation | bottom bar | rail | sidebar |
| Targets < 44 px | 0 | 0 | 0 |

**Contrast** (rendered `oklch`, WCAG formula, 43 samples across both screens): minimum passing 4.77:1; body 17.3:1; state pills 7.0–7.7:1; muted meta 7.4:1. **Failures:** `· Invoice AT-4471.pdf` 4.39 · `· image 1` 4.39 · `· Payment ledger.pdf` 3.85 — all the `SourceBadge` `detail` span (`font-normal opacity-80`).

**State semantics, driven in the browser:** Cancel on an uploading card → pill *Needs attention*, `role="alert"` "Upload cancelled. You can retry when ready.", buttons *Retry · Remove*. Retry → *Uploading* 0 %, "Upload restarted.", *Cancel*. Locker: search "zzz" → empty state; filter *Needs attention* → exactly the error card; labels resolve for search and select.

**ARIA:** progressbar `aria-label="Upload progress for <file>"` with `valuenow`; error message `role="alert"` and referenced by the card's `aria-describedby`; one `aria-live="polite"` region mounted before any change; `input[type=file]` labelled, `multiple`, **no `accept`**; drop zone not focusable (correct — the button is the keyboard path) and has no drag-over state; `h1` count on the page: **2**.

### 2.3 Source inspection

`evidence-card.tsx` (234 lines), `evidence-workspace.tsx` (286), `evidence.test.tsx` (7 tests), `styles.css` evidence tokens, `app-shell.tsx`, `routes/index.tsx`, `roadmap.md`, `README.md`; plus the A-022 diff to confirm what the Fact Card fixes delivered.

## 3. Findings — ranked

| # | Finding | Baseline | Severity |
|---|---|---|---|
| **1** | **Lifecycle and category are one enum.** `EvidenceState = uploading · processing · extracted · error · uncategorized`. Category is an attribute (§ 7.5 extracts *document type*); the spec's Document has `processing_status` **and** `ocr_status`. An extracted, uncategorized file cannot exist in this model | § 7.4, § 7.5, § 10 | **High** |
| **2** | **Documents wear fact badges.** Every card shows "Provenance: *Stated in a document · \<its own filename\>*" or "*Read out by AI*" — the epistemic kinds of *facts*, applied to the *source they come from*. A document's provenance is who uploaded it, when, and its hash. The default prop is even the retired `document-extracted` kind | § 11 | **High** |
| **3** | **Locker card missing fields and actions.** Missing: page count, upload date, verification state. Actions: *Remove* only; **no *view*** (Brief § 8: every relationship opens the source), no rename, no confirm/correct of the document type | Brief § 4, § 8 | **High** |
| **4** | **No security-scan / rejected state.** Pipeline has *security scan* before OCR; Build Brief § 6 says *security/content scan*; US-02 evidence is an *upload/security test*. A rejected file is not an OCR failure and must not offer *Retry* | § 7.5, § 17, US-02 | **Medium–High** |
| **5** | **Cancel is treated as an error** and fires `role="alert"`. A cancelled upload is a *queued* or *cancelled* status announced politely, not an alert | WCAG 4.1.3; US-02 | **Medium** |
| **6** | **No input validation, no pasted text.** `input[type=file]` has no `accept`, no size limit, no *unsupported file* outcome; § 7.4 lists pasted text as an MVP input and there is no entry point | § 7.4 | **Medium** |
| **7** | **Three contrast failures** from `opacity-80` on `SourceBadge` detail — A-022 removed opacity dimming from the card and date badge but not here, and the evidence card puts a detail on every badge | WCAG 1.4.3 | **Medium** |
| **8** | **Two `<h1>`s** — the workspace renders its own beneath the page heading | WCAG 1.3.1 | **Low–Medium** |
| **9** | Drop zone gives no drag-over feedback | — | **Low** |
| **10** | Evidence hue family reuses green (extracted = confirmed = verified = exact = success) and red (error = contradiction = low-confidence). A-014 D2 / A-021 item 8, still growing | A-014 D2 | **Low–Medium** |
| **11** | `app/roadmap.md` is a second status list living in the code tree (tier 8) — it will drift from the registry | Status rules § 5 | **Low (governance)** |

### What is right

Upload progress is a properly labelled `progressbar` with a visible percentage and a Cancel that is withheld once transfer completes · the error copy is the US-02 sentence, verbatim, with Retry and Remove · one live region mounted at load, so announcements actually fire · search + filter + count + empty state all work and are labelled · long filenames wrap · every target 44 px at every width · no overflow anywhere · the toggle uses `aria-pressed` · 34/34 tests including a banned-language guard · the register entry is candid about what was not built.

### Governance observation

A-023 set itself CANONICAL, as A-020 did, while the A-021 recommendation — build outputs enter at **REVIEW** — has not been adopted. Sprint 3 was also started on A-022 while A-015 (Sprint 2 closure) remains OPEN on A-008; the gate passed because every input *is* canonical, so this is the founder's sequencing choice, recorded, not a rule breach. A-022 delivered 7 of A-021's 10 fixes and said which three it did not — that is the standard.

## 4. Required fixes — to convert FAIL → PASS

Bundled as **A-025 — Sprint 3 evidence conformance fixes**. 1–3 are the model; the rest are bounded.

1. **Split the axes.** `lifecycle`: `queued · uploading · scanning · processing · extracted · failed · rejected` (map `cancelled` → `queued` with a note). `category: string | null` with an *Uncategorized* chip when null. `verification` from the confirmation model. Filters gain a *Category* facet.
2. **Document provenance, not fact provenance.** Card header: file name · type · pages · uploaded *when* · hash short-id. Replace the "Provenance" strip with an **extraction summary**: "3 facts · Read out by AI · High confidence" — that is where `ai-extraction` belongs. Drop the `document-extracted` default.
3. **Actions per Brief § 4:** *View* (opens the source — mandatory), *Rename*, *Confirm type* / *Correct type* (category), *Remove*. Keep *Retry* on `failed` only; `rejected` gets *Remove* and the reason.
4. **Cancel → `queued`** with `role="status"`; reserve `role="alert"` for `failed` / `rejected`.
5. **`accept`** (`.pdf,.jpg,.jpeg,.png,.doc,.docx,.txt`), a size limit, an *unsupported file* outcome, and a **pasted-text** entry (§ 7.4).
6. **`SourceBadge` detail:** replace `opacity-80` with a muted token ≥ 4.5:1; re-measure.
7. **One `<h1>`** per page — the workspace heading becomes `h2` inside the showcase (or a route-level `h1` when it becomes a route).
8. Drag-over state on the drop zone.
9. Evidence tokens: distinct hue family, or a neutral ramp with icon differentiation.
10. Retire `app/roadmap.md`; the registry is the roadmap.

**Re-review after A-025:** 1–3 by inspection + tests; 6 by re-measurement; NVDA / VoiceOver pass still owed since A-014.

## 5. Status consequences

| Task | After this review |
|---|---|
| A-023 Sprint 3 evidence components | Stays CANONICAL *as a provisional implementation*; **conformance FAIL (conditional)** recorded |
| **A-024** this review | CANONICAL — evidence: this document |
| **A-025** Sprint 3 evidence conformance fixes | **OPEN**, inputs A-023 + A-024, FA-001 — may start now |
| A-015 Sprint 2 closure | Unchanged: OPEN on A-008 |
| A-008 Figma V2 | Unchanged: OPEN — the phantom dependency is now two sprints old |

## 6. Recommendation

- Run **A-025** before Timeline or Evidence Mapping — both consume the document model, and item 1 changes its shape.
- Adopt the rule: **build outputs enter at REVIEW.** Three consecutive self-declared CANONICALs (A-018, A-020, A-023) each needed a review to find what the enum missed.
- **Decide A-008.** Assign it, or SUPERSEDE it by A-020 + A-022 + A-023 + A-025 and let A-015 close on a re-review.

**Rules honoured:** no source file modified; nothing deployed; dev server started locally for measurement and stopped.
