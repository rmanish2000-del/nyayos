# A-044-R — Complete and repair the repository-centric tool handoff system (`claude-code`)

Completion commit `1c080432d6d183e98073da2aa4e89b33ab85c734` on `feature/fma-foundation-v1` (baseline `c1c49d535da1125982b48a728d7125c62159213c`, the latest remote commit). Nothing deployed; PR #2 stays draft.

The founder now reports only "CC done", "Gemini done", "Lovable done" or "Figma done". M365 Copilot reads `docs/ai/STATUS_SUMMARY.md` and `docs/ai/CURRENT_STATE.json` → `tools.<tool>`, then the task's `HANDOFF.json`, to learn which tool finished which task, the commit, the exact files, the validations, the remaining risks, the awaited output and the next assignment.

- Per-task handoffs at `docs/ai/tool-output/<tool>/<task-id>/HANDOFF.json` + `SUMMARY.md` (schema `docs/ai/schemas/handoff.schema.json`); completion commits tagged `[TOOL:<TOOL>][TASK:<task-id>]`.
- `CURRENT_STATE.json` 2.0: per-tool latest completion (derived from handoffs), active and blocked tasks, awaited outputs in order, PR, deployment, next integration task. `NEXT_TASK.json` 2.0.
- `scripts/ai/state.mjs` fails CI on unknown tools, duplicate ownership, missing handoffs, commits outside history, untagged completion commits, file lists that differ from git, stale or contradictory state and unrecorded work. `scripts/ai/state.test.mjs`: 25/25. Both run in `task-gate`.
- Backfilled: Claude Code A-042 and A-044. Lovable's concurrent A-043 handoff converted to the schema, facts unchanged. No Gemini or Figma record fabricated.

Validations: validator tests 25/25, state check, registry, schema lint and typecheck pass; Vitest 233/233 in CI (local Windows run of Lovable's A-043 tests is environment-limited, see HANDOFF.json). Rollback: see HANDOFF.json.

Machine-readable record: [HANDOFF.json](HANDOFF.json).
