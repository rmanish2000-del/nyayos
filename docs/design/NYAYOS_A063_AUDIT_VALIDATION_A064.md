# A-063 Audit Validation — Figma PR #3 audits checked against the A-043 code (A-064)

| Field | Value |
|---|---|
| Task | A-064 (Claude Code), canonical integration and branch cleanup |
| Validates | A-063 (Figma audit of A-043), plus the A-050 and A-057 audits on draft PR #3 |
| Branch | `feature/fma-foundation-v1` (draft PR #2) |
| Baseline | `ca41bf1d85a4a6abaad8a89817f18b93f54f9638` |
| Code audited | `app/` at `ca41bf1`, byte-identical to `app/` at `14c5ea0`, the tip A-063 names (`git diff 14c5ea0 ca41bf1 -- app` is empty) |
| Output | [NYAYOS_A043_CANONICAL_FIX_SPEC_V1.md](../implementation/NYAYOS_A043_CANONICAL_FIX_SPEC_V1.md), the only fix list Lovable should use |
| Date | 27 September 2026 |

Nothing here changes application code, SQL, the database, deployments or any environment.

---

## 1. What was integrated

Draft PR #3 (branch `fix/a050-accessibility-ux-mobile`, based on `main` at `6c6b478`) carries three Figma-namespace audits:

| Audit | Cited source paths | Present under `app/` | Verdict |
|---|---|---|---|
| A-050 (accessibility, UX, mobile gaps) | 7 distinct | **0** (`src/components/ui.tsx`, `src/screens/*` and others do not exist) | **Rejected in full.** It audits a code tree this repository does not contain |
| A-057 (accessibility, export UX, feedback, mobile, onboarding) | 9 distinct | **0** | **Rejected in full**, for the same reason |
| A-063 (canonical A-043 implementation audit) | 19 distinct | **18**. The only missing path, `app/src/routes/foundation.tsx`, is a route the audit proposes to create | **Integrated and validated** (§3) |

A-063 was brought onto this branch by cherry-picking PR #3's commit `dbc415f` as `76b6eb6`. The founder authored and dated the commit, and `-x` records where it came from. Its six files are unchanged. Figma's original non-schema `HANDOFF.json` is kept beside the canonical handoff as `HANDOFF.original.json`.

Nothing was merged from PR #3, and PR #3 has not been changed or closed.

## 2. Method

- Every A-063 finding, accessibility item (A-001 to A-007), mobile item and proposed fix (FIX-*) was checked against the source at `ca41bf1`. Claims about behaviour were traced through the code, not inferred from file names.
- Proposed fixes were checked against the architecture and the recorded decisions: the quarantine and promotion rule, S9 quarantine isolation, D-035 Google Login and FD-02. They were also checked against WCAG 2.2 AA and ARIA 1.2.
- **Line anchors.** Several A-063 line numbers do not match the audited code. Examples:
  - `<main id="main">` in `dispute-frame.tsx` is at line 63, not 44.
  - `<html lang>` in `__root.tsx` is at line 116, not 108.
  - The inline Devanagari style in `index.tsx` is at line 115, not 134.
  - The accessibility checklist rows in `index.tsx` are at lines 641–642, not 334–337.

  The fix specification re-anchors every item to the real lines at `ca41bf1`.

## 3. Finding-by-finding verdict

Verdicts:
- **Accepted:** goes into the Lovable fix spec.
- **Reassigned:** a valid observation that belongs to another task.
- **Rejected:** wrong, or its proposed fix is unsafe.
- **Merged:** a duplicate of another finding.

| A-063 item | Claim (short) | Verified against code | Verdict | Where it goes |
|---|---|---|---|---|
| C-001 | No backend; data lives only in `sessionStorage` | True for the UI (`app/src/mvp/store.tsx:3,25-26,60,108-115`). This is the A-043 design: a staging preview on synthetic fixtures, and the screens say so. **Partly false:** "no DB schema, no migrations" is wrong. `db/migrations/0001-0008` and `app/src/domain/` hold the verified FM-A foundation, not yet connected to the UI. "Supabase" is not a decision; the provider is FD-02 | **Reassigned** | W1 (wire the UI to the FM-A backend once FD-02 is decided) |
| C-002 | Google OAuth is a stub | True: `login-screen.tsx:29,61,66-67` shows "Google sign-in is not connected yet". D-035 approved Google Login as the MVP primary sign-in; the provider is not chosen | **Reassigned** | W1 + FD-02 |
| C-003 | Uploads stay in `awaiting-scan`, so U07 cannot open them | True (`evidence-locker-screen.tsx:68`; viewer refuses non-ready documents at `document-viewer-screen.tsx:54-60`). **This is correct behaviour.** No scanner runs in the preview, and the architecture forbids promotion without a positive clean verdict (§4) | **Observation accepted; FIX-C003 rejected** | No fix. U07 stays demonstrable with the seeded ready documents |
| C-004 | No post-login return to the requested page | True: `require-session.tsx:25` redirects to `/login` without the origin; `login-screen.tsx:107` always goes to `/disputes` | **Accepted**, with an open-redirect guard FIX-C001 lacks | Fix spec F-01 |
| M-001 | Skip-link target `<main>` not focusable | True: the skip link is at `require-session.tsx:29-34`; six `<main id="main">` lack `tabIndex={-1}` | **Accepted** | F-02 |
| M-002 | `/` renders the design-system showcase | True (`routes/index.tsx:19-38`). The showcase is a recorded foundation deliverable, cited at `routes/index.tsx` by A-021, A-024, A-030 and A-041 | **Reassigned** | Founder decision; recommended alongside W1, once a real sign-in exists to send visitors to |
| M-003 | `createDispute` returns an id when there is no user | True (`store.tsx:154-177`), but unreachable in practice: `/disputes/new` renders inside `RequireSession`. Downgraded to minor | **Accepted (minor)** | F-04 |
| M-004 | `/disputes/new` has no `DisputeFrame` | Intentional (a new dispute has no steps yet); its only concrete point is M-001 | **Merged** into M-001 | F-02 |
| M-005 | No `supabase/` or `app/src/integrations/` | Same as C-001; presumes an undecided provider | **Merged** into C-001 | W1 |
| m-001 / A-003 | Viewer page `div` has `tabIndex={0}` and no role | True (`document-viewer-screen.tsx:92-97`). ARIA 1.2 prohibits `aria-label` on a generic element | **Accepted** | F-05 |
| m-002 / A-006 / A-007 | Contrast audit and screen-reader pass not run | True (`routes/index.tsx:641-642`); a verification activity, not a code fix | **Reassigned** | Pre-release verification. Recommended with the A-043 design conformance review |
| m-003 | Inline `style` for the Devanagari font | True (`routes/index.tsx:115`). `--font-devanagari` is declared in `@theme inline` (`styles.css:22,31`), so Tailwind v4 already generates `font-devanagari`; the CSS addition FIX-m003 proposes is unnecessary | **Accepted (simplified)** | F-07 |
| m-004 / A-002 | `<html lang>` fixed to `en` | True (`__root.tsx:116`); language state is `en`/`hi` in `MvpProvider` (`store.tsx:23`), mounted at `__root.tsx:134` | **Accepted** | F-03 |
| m-005 / A-004 | Hashing status is announced by a live region that is mounted only while hashing | True (`evidence-locker-screen.tsx:134-138`). A persistent polite region already exists at `:150-152`. FIX-m002 would add a second permanent status region, which risks double announcements | **Accepted (different fix)** | F-06 |
| A-005 | `aria-controls` targets a `hidden` element | The audit itself records PASS | **No action** | — |
| Mobile: step-nav overflow has no affordance | True (`dispute-frame.tsx:40`) | **Accepted (minor)** | F-08 |
| Mobile: full dispute title only in `title` attribute | True (`dispute-frame.tsx:37`); `title` is unreachable on touch devices | **Accepted (minor)** | F-09 |
| Mobile: `ScreenHeader` squeezes the title at narrow widths | Plausible (`states.tsx:102`, fixed two-column grid) | **Accepted (minor)** | F-10 |
| Mobile: `size="compact"` buttons below 44 px | **False.** The base button class includes `touch-target` (`components/nyayos/button.tsx:12`), which sets `min-height` and `min-width` to 44 px (`styles.css:452-455`) | **Rejected** | — |
| Mobile / FIX-m005: make the drop zone a `role="button"` | The proposed fix nests a focusable `<input>` and `<label>` inside a `role="button"`, which is invalid (nested interactive content). A label click would also bubble into a second `click()`. The native file button (44 px) and the `<label htmlFor>` are already tap targets | **Rejected** | — |
| Mobile: sticky intake CTA | A design suggestion, not a defect | **Rejected as a fix**; deferred to the A-008 design package | — |
| Handoff `nextTask`: "Fix C-001 to C-004 before merging to main" | Merging PR #2 into `main` deploys nothing (FA-002 not granted). C-001 and C-002 are W1 scope by design | **Rejected** | PR #2 readiness unchanged (§5) |

**Totals.**
- Of the 14 findings in `findings.md`:
  - 5 accepted: C-004, M-001, M-003, m-001, m-004.
  - 2 accepted with a changed fix: m-003, m-005.
  - 4 reassigned: C-001, C-002, M-002, m-002.
  - 2 merged into others: M-004, M-005.
  - C-003: the observation stands, but its fix is rejected.
- Of the 6 mobile items: 3 accepted, 3 rejected.
- The resulting Lovable fix list has 10 items (F-01 to F-10).

## 4. Why FIX-C003 (simulated scan) is rejected

FIX-C003 adds `advanceDocumentToReady`, which a 2-second timer calls after hashing, so user files become `ready` without any scan. That contradicts the recorded pipeline:

- "Scan unavailable → object stays Quarantined; no timeout-based promotion exists. Promotion requires a positive clean verdict." (`docs/architecture/NYAYOS_EXECUTIVE_ARCHITECTURE_DECK_V1_TEXT.md`, the Upload → Quarantine → Scan → Promote slide).
- S9 quarantine isolation.
- C04 quarantine → scan → promote (`docs/architecture/NYAYOS_SECURITY_DATA_ARCHITECTURE_SPEC_V1.md`).

A preview that shows timer-promoted files as ready would teach the opposite behaviour and could carry into W1. The preview already says files are "checked and fingerprinted in this browser only" (`evidence-locker-screen.tsx:94-97`), and U07 is fully exercised by the seeded ready documents (`mvp/fixtures.ts:324-415`).

## 5. Effect on PR #2 merge readiness

None of the accepted findings is a security defect, a data-integrity defect or a regression, and none touches `db/` or `app/src/domain/`. The A-048 verdict stands: PR #2 is ready for the founder to merge with a **merge commit**. The fixes are issued as A-065 for Lovable, to land in a separate pull request after the merge, so the verified PR #2 diff stays frozen.

PR #3: its only valid content (A-063) is now on `feature/fma-foundation-v1`, and A-050 and A-057 are rejected. After PR #2 merges, PR #3 would conflict: both branches add `docs/ai/tool-output/figma/A-063/`, with different `HANDOFF.json` files. The founder should close PR #3 without merging it. A-064 did not close it.
