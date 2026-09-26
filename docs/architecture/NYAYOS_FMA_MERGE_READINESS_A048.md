# NYAYOS FM-A Merge Readiness and Decision Reconciliation — A-048

| | |
|---|---|
| **Assignment** | A-048 (no ID was issued with the brief; the next free ID was claimed) |
| **Subject** | Draft PR #2, `feature/fma-foundation-v1` → `main`; baseline `92be7c79b58640cfabfef36a23d5080b24d93cff` |
| **Date** | 27 September 2026 |
| **Verdict** | **Ready for the founder's merge**, with the conditions in §6. PR #2 stays draft until the founder marks it ready; merging is the founder's action. Nothing is deployed |

## 1. Founder decisions recorded

Recorded in the [Decision Log](../founder/NYAYOS_DECISION_LOG_V1.md) on 26 September 2026:

| ID | Decision |
|---|---|
| D-035 (partly) | **Google Login is the MVP primary sign-in method.** **Scope Sheet numbering controls.** Still open: deletion reversibility (C-02), confirmed-only export (C-03), party contact details (C-05) |
| D-036 | Scope Sheet numbering controls; **`document_reference_policy` remains `block`**; **deletion tombstones remain content-free** |
| D-031, D-032 | Rulings from the A-038 brief, now written into the log (audit atomicity; server-controlled purge) |

Google Login departs from Scope Sheet F01 (email/password + OTP) and from the flow deck (mobile OTP). No auth provider is connected; choosing one depends on FD-02.

## 2. A-041 rebaselined against A-043

[`NYAYOS_FMA_U01_U21_TRACEABILITY_ADDENDUM_V1.md`](../product/NYAYOS_FMA_U01_U21_TRACEABILITY_ADDENDUM_V1.md) §3, §4 and §10 now reflect Lovable's A-043 screens (synthetic fixtures, no server or database):

| | A-041 | Now |
|---|---|---|
| READY | 0 | 0 |
| PARTIAL | 4 | 11 (U01, U03–U10, U16, U17) |
| MISSING | 17 | 10 (U02, U11–U15, U18–U21) |

Conflicts C-01 (sign-in) and C-04 (tombstone) are marked decided. Every cited path was re-checked: 83 paths, 237 identifiers, all present.

## 3. PR #2 diff verification

| Check | Result |
|---|---|
| Size | 205 files against `main` (182 added, 23 modified); `mergeable`, merge state CLEAN; `main` unchanged since the branch point `6c6b478` |
| Composition | `docs/ai` 70 (incl. 42 A-043 screenshots, largest 185 KB), `app/src` 58, `app/tests` 17, `db/tests` 12, `db/migrations` 8, docs and governance the rest |
| Workflows | `task-gate.yml` modified, `schema-lint.yml` added, PR template modified; no deploy workflow; no `.env`, Vercel, Netlify, Wrangler, Docker or Supabase config |
| Secrets and private data | task-gate guards clean on the whole tree; no key patterns; fixtures use synthetic `example.test` personas; screenshots are labelled "Staging preview · synthetic data"; no external URLs added under `app/` |
| Migrations | `0001`–`0008` append-only; never applied to any environment |

## 4. Tests (27 September 2026)

| Suite | Result |
|---|---|
| Audit concurrency matrix (A-033-R) | 5/5, chain intact |
| Purge race (A-040) | 3/3 |
| Smoke | 87/87 |
| Dispute status (A-042) | 21/21 |
| Deletion authz / scope / purge | 25/25 · 28/28 · 55/55 |
| Audit atomicity / hash vectors (A-038) | 21/21 (5 deliberate fault injections) · 16/16 |
| Vitest (CI, dependency-check on `92be7c7`) | 233/233 |
| Vitest (local, Windows, Node 22.14, `--testTimeout=30000`) | 232/233 — the A-043 U06 test fails on a jsdom `SubtleCrypto.digest` buffer-type difference; it passes in CI |
| Typecheck · lint · build | clean · 0 errors (13 warnings, 2 added by A-043) · pass |
| Schema lint | clean (39 tables, 70 graph edges, 28-table purge order) |
| Handoff validator tests · state check · registry | see `docs/ai/tool-output/claude-code/A-048/HANDOFF.json` |

Every database suite ran on its own fresh disposable PostgreSQL 16 container; all containers were removed.

## 5. PR #3 (A-050) — conflicts identified, not merged

Draft PR #3 (`fix/a050-accessibility-ux-mobile`, cut from `main` at `6c6b478`) adds four Markdown files under `docs/ai/tool-output/figma/A-050/`.

| Conflict | Detail |
|---|---|
| Textual | **None.** `git merge-tree` of PR #3 into the PR #2 head merges cleanly |
| Handoff protocol | `figma/A-050/` has no `HANDOFF.json` or `SUMMARY.md`, and A-050 is not in the status registry. Once combined with PR #2, `task-gate` fails ("completion without HANDOFF.json"; then "task ownership missing" when registered) |
| Target files | Its "exact fixes" name `src/components/ui.tsx`, `src/components/Shell.tsx` and `src/screens/*.tsx`. None exist in this repository; A-043 lives under `app/src/components/mvp/` and `app/src/routes/`. The fixes cannot be applied as written |
| Ownership | An audit of Lovable's A-043 filed under the `figma` namespace, against a "Figma MVP Design Package V1" that is not in the repository (A-008 is blocked) |
| Order | If PR #3 were merged into `main` first, PR #2 would inherit a handoff-less task directory and fail its own required check |

**Recommendation:** leave PR #3 unmerged. Its owner re-files A-050 on top of PR #2 (after the merge): register A-050, map each finding to the real `app/` paths, and add `docs/ai/tool-output/<tool>/A-050/HANDOFF.json` and `SUMMARY.md`.

## 6. Integration procedure (founder)

1. Review this report and the addendum; mark PR #2 **Ready for review**.
2. Merge with **"Create a merge commit"**. **Do not squash or rebase-merge.** Every handoff records exact commit SHAs, and `node scripts/ai/state.mjs check` requires them to be in `main`'s history; a squash or rebase would drop them and turn `task-gate` red on `main`. All three methods are currently enabled in the repository settings; restricting to merge commits is a founder setting.
3. Required checks on `main` are `task-gate` and `dependency-check` (strict); both pass on the PR head.
4. After the merge, move the accepted REVIEW tasks to CANONICAL in the status registry (founder acceptance), let `status-update` regenerate the dashboards, and run `node scripts/ai/state.mjs generate`.
5. Then: PR #3 re-filed as above; auth provider for Google Login and the staging database (FD-02, wave W1); Figma package (A-008) for the A-043 design conformance review.

## 7. Open items that do not block the merge

- A-032 minor findings m-2 to m-12 (tracked follow-ups).
- A-040 residuals: object-storage deletion not designed; account purge keeps the personal tenant row.
- D-035 points C-02, C-03 and C-05 open.
- Gemini A-047: blocked, repository handoff missing.
- A-043: design conformance unverified (no Figma package); local-only U06 test difference.
- No environment exists; no screen is READY.
