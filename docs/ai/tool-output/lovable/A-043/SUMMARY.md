# A-043 — MVP Wave-1 UI implementation — Summary

Normalized by A-043-R. Tool: Lovable. Status: REVIEW. Branch `feature/fma-foundation-v1`. Completion commit `9d238423949eabea28452e4e6a924186a94030c4`. Detailed handoff: [`../A-043.md`](../A-043.md); machine-readable: [`HANDOFF.json`](HANDOFF.json).

## Objective

Build the Wave-1 MVP UI: Google login entry and routing, U04 What happened, U05 Intake, U06 Evidence locker, U07 Document viewer, U08 Fact review, U09 Timeline, U16 Export preview/privacy check and U17 Export result. Responsive, accessible, with synthetic fixtures only. No backend, and no claim that production is connected.

## Completed work

- Routed screens under `/login` and `/disputes/...` (`app/src/routes/`), components in `app/src/components/mvp/`, and a model in `app/src/mvp/`.
- Five seeded personas that need no setup: founder (full data), normal (empty states), reviewer (grants disabled, sees nothing and is told why), deleted (sign-in refused) and cross-tenant (can't reach other disputes).
- Deterministic intake, in-browser SHA-256 file fingerprints, manual fact-to-page linking, five date precisions with filters, a privacy check before export, and an integrity manifest with a stale-output notice.

## Test evidence

- Vitest 233/233 across 19 files, including 34 A-043 tests in `app/tests/mvp.test.tsx`.
- Typecheck, lint (0 errors) and build all pass.
- Playwright at 390, 834 and 1280 px: one h1 per page, no horizontal overflow and zero console errors. The sign-in-to-export flow, the cross-tenant block and keyboard focus were all checked.

## Screenshots location

[`screenshots/`](screenshots/) holds 42 PNGs named `<mobile|tablet|desktop>-<screen>.png`. They contain synthetic data only.

## Risks

- The design may drift from the unsupplied Figma MVP Design Package V1.
- Users could mistake the unconnected Google button and browser-only preview for working production features. On-screen notices mitigate this.
- Access rules run in the browser for the preview only. Real enforcement must stay server-side.

## Limitations

- Figma MVP Design Package V1 (A-008) not supplied; design conformance unverified
- Google sign-in is entry UI only, not connected (no auth provider; FD-02); synthetic personas stand in
- No storage or scanning: files are hashed in the browser and never uploaded
- U17 produces a JSON integrity manifest only; no printable case file
- Hindi covers existing provisional copy and intake questions only; native review owed
- Client-side access rules mirror, but do not replace, server/RLS enforcement
- U02 consent and full U03 dashboard out of scope
- NVDA/VoiceOver pass not performed; automated accessibility checks only
- A-043 cannot be CURRENT_STATE.last_assignment because the validator requires the highest task ID (A-044); tracked as an open item

## Recommended next task

Founder supplies the Figma MVP Design Package V1 for an A-043 design conformance review and decides the F01 sign-in method; then the founder merge-readiness review of draft PR #2.
