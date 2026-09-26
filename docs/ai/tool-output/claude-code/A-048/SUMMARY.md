# A-048 — FM-A merge readiness and decision reconciliation (`claude-code`)

Completion commit `3edecc8b89c8da9ec89809787c6a8192cbf74e15` on `feature/fma-foundation-v1` (baseline `92be7c79b58640cfabfef36a23d5080b24d93cff`). PR #2 stays draft and unmerged; nothing deployed.

- **Decisions logged:** D-035 partly (Google Login is the MVP primary sign-in; Scope Sheet numbering controls; C-02, C-03, C-05 open), D-036 (`document_reference_policy` stays `block`; tombstones stay content-free), and the A-038 rulings D-031 and D-032.
- **A-041 rebaselined against A-043:** PARTIAL 11, MISSING 10, READY 0.
- **PR #2 verified:** 205 files, mergeable CLEAN, no secrets or private data; every database suite passes on fresh containers; Vitest 233/233 in CI; typecheck, lint, build and schema lint clean.
- **PR #3 (A-050):** no textual conflict, but it lacks a handoff, targets paths that do not exist here and is filed under Figma for a Lovable audit. Not merged.
- **Integration:** the founder marks PR #2 ready and merges with a **merge commit** (never squash or rebase). Details: `docs/architecture/NYAYOS_FMA_MERGE_READINESS_A048.md`.

Machine-readable record: [HANDOFF.json](HANDOFF.json).
