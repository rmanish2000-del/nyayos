# A-043 handoff — MVP Wave-1 UI implementation

**Assignment:** A-043
**Tool:** lovable
**Status:** REVIEW
**Branch:** feature/fma-foundation-v1
**Baseline:** fc740380eb6282d3b6a174b8a01a93e7528bddd8
**Commit:** 9d238423949eabea28452e4e6a924186a94030c4
**Pushed:** yes
**Deployment:** none

## Result

Built on top of branch tip `b4a1f038` (A-044), which had advanced past the brief baseline.


All screens run on seeded synthetic data inside the browser tab. There is no backend call, no
database write, no storage upload and no model call.

| Screen | Route | Component |
|---|---|---|
| U01 Google login entry (foundation) | `/login` | `app/src/components/mvp/screens/login-screen.tsx`, `google-button.tsx` |
| Dispute list (navigation hub, not full U03) | `/disputes` | `dispute-list-screen.tsx` |
| U04 What happened — new | `/disputes/new` | `what-happened-screen.tsx` (`NewDisputeScreen`) |
| U04 What happened — stored account | `/disputes/$disputeId` | `what-happened-screen.tsx` (`WhatHappenedSummary`) |
| U05 Intake | `/disputes/$disputeId/intake` | `intake-screen.tsx` (domain `nextQuestion`, `DONT_KNOW`) |
| U06 Evidence locker | `/disputes/$disputeId/evidence` | `evidence-locker-screen.tsx`, `document-row.tsx` |
| U07 Document viewer + manual fact linking | `/disputes/$disputeId/documents/$documentId` | `document-viewer-screen.tsx` |
| U08 Fact review | `/disputes/$disputeId/facts` | `fact-review-screen.tsx` (reuses `FactCard`) |
| U09 Timeline | `/disputes/$disputeId/timeline` | `timeline-screen.tsx` (reuses `TimelineEventCard`) |
| U16 Export preview / privacy check | `/disputes/$disputeId/export` | `export-screens.tsx` (`ExportPreviewScreen`) |
| U17 Export result + integrity manifest | `/disputes/$disputeId/export/result` | `export-screens.tsx` (`ExportResultScreen`, mounts A-037 `StaleOutputNotice`) |

Shared: `app/src/mvp/fixtures.ts` (seed), `access.ts` (tenant boundary, deleted account,
reviewer grants disabled), `store.tsx` (per-tab state), `export.ts` (preview, SHA-256 manifest,
staleness), `view-model.ts`; `app/src/components/mvp/` (states, text field, frame, header, guard).


Personas: founder (two disputes, six documents, six facts, six timeline entries, one export),
normal (empty — every empty state), reviewer (grant roles disabled in FM-A — sees nothing and is
told why), deleted (sign-in refused with a generic message), cross-tenant (own dispute only; any
other dispute URL shows the same "not available" state as a missing one). All names, amounts and
hashes are invented.

## Evidence

- Vitest: all suites pass, including `app/tests/mvp.test.tsx` (34 tests: fixtures, access rules,
  Google entry flow, keyboard sign-in, session guard redirect, empty/error states, seeded rendering,
  U04–U17 flows, export navigation).
- `tsc --noEmit` clean; `eslint` 0 errors (pre-existing react-refresh warnings); `vite build` OK.
- Playwright at 390 / 834 / 1280 px on every screen: one `h1` per page, no horizontal overflow,
  zero console errors; sign-in → export generation flow; cross-tenant URL blocked; keyboard focus
  reaches the header link first after the skip link.
- Screenshots: attached to the delivery (42 images, `mobile|tablet|desktop-<screen>.png`).

## Limitations

1. **Figma MVP Design Package V1 not supplied.** It is not in the repository and the Figma
   connection was unavailable. Layout follows Figma Brief V2, the A-041 addendum and the Scope
   Sheet. A design conformance review is owed before this can become CANONICAL.
2. Google sign-in is not connected (no auth provider, FD-02). The button states this honestly;
   synthetic personas stand in. Scope Sheet F01 (email/password + OTP) vs the task's Google login
   is an open founder decision.
3. No storage or scanning: added files are hashed in the browser and stay "Waiting for safety scan".
4. No printable case file; U17 produces a real, downloadable JSON manifest only.
5. Hindi strings are the existing [PROV translation] copy; intake questions have Hindi; other
   screen text is English only. Native review owed (A-032 m-11).
6. Client-side access rules mirror, but do not replace, server/RLS enforcement.
7. U02 consent and full U03 dashboard are out of scope for Wave 1.
8. NVDA / VoiceOver pass still owed; automated checks only.
9. `app/tests/domain/audit-interop.test.ts` reads `db/tests/` and only runs from the full repository
   checkout (pre-existing).

## Next

Founder: supply the Figma MVP Design Package V1 for a conformance review and decide the F01 sign-in method. Rollback:

`git revert <A-043 commit>` on `feature/fma-foundation-v1`. The change is additive: new files under
`app/src/mvp/`, `app/src/components/mvp/`, `app/src/routes/login.tsx`, `app/src/routes/disputes*.tsx`,
`app/tests/mvp.test.tsx`; small edits to `__root.tsx` (provider), `index.tsx` (preview link),
`button.tsx` (icon/text alignment), and the generated `routeTree.gen.ts`. No schema, migration,
dependency or environment change.
