# A-044-R2 — Fix the AI operating system itself (`claude-code`)

Completion commit `02f2f9576c19fd065c88debcafd9a3e614e9f990` on `feature/fma-foundation-v1` (baseline `14e9f1b816be77e1775c881724c08584f2c7b259`). Nothing deployed; PR #2 stays draft.

- `CURRENT_STATE.json` and `NEXT_TASK.json` are canonical (`authority: canonical`); every tool updates them on every task.
- `tools.<tool>` is fully derived from the handoffs, `active_tasks` and `blocked_tasks`, so a hand-set or stale value fails CI.
- CI fails on HANDOFF missing, CURRENT_STATE stale, NEXT_TASK stale and task ownership missing.
- One command: `node scripts/ai/state.mjs status` (or `--json`) prints the last completed task per tool, active tasks, the next awaited output and the next recommended assignment.
- Backfill: Claude A-042 and A-044 and Lovable A-043 are in the structure; Gemini A-047 is a **blocked** ownership record ("repository handoff missing") because nothing for A-047 exists in the repository.

Tests: validator 31/31; state check, status command and registry pass. Rollback: see HANDOFF.json.

Machine-readable record: [HANDOFF.json](HANDOFF.json).
