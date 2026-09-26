# `docs/ai/` — repository-centric tool handoff system

**A-044, corrected by A-044-R (26 September 2026).** The founder no longer pastes task reports. When a tool finishes, the founder tells M365 Copilot only:

> **"CC done"** · **"Gemini done"** · **"Lovable done"** · **"Figma done"**

M365 Copilot then reads GitHub, not chat, and finds everything in this folder.

| Question M365 Copilot answers | Where |
|---|---|
| Which tool completed work, and which task | `CURRENT_STATE.json` → `tools.<tool>.latest_completed_task` (and `latest_completion` across all tools) |
| Which commit contains the work | `tools.<tool>.latest_completion_commit`, and `completion_commit` in the handoff |
| Which files changed | `files_created`, `files_modified`, `files_deleted` in `HANDOFF.json` (checked equal to `git diff baseline_commit completion_commit`) |
| Which validations passed | `tests` in `HANDOFF.json` |
| Which risks remain | `risks` and `limitations` in `HANDOFF.json`; `RISKS.json` residuals |
| Which output is awaited next | `CURRENT_STATE.json` → `awaited_outputs` (order 1 first) |
| Which assignment should follow | `NEXT_TASK.json` |

Start with one command, or the generated page:

```bash
node scripts/ai/state.mjs status          # last completed task per tool, active tasks, next awaited output, next recommended assignment
node scripts/ai/state.mjs status --json   # the same, machine-readable
```

[`STATUS_SUMMARY.md`](STATUS_SUMMARY.md) carries the same block at the top.

## Canonical state (A-044-R2)

**`CURRENT_STATE.json` and `NEXT_TASK.json` are canonical** (`"authority": "canonical"`). They are the operating state every tool reads first and **every tool updates on every task**. Within them, everything that can be derived is derived and checked by CI: `tools.<tool>` (status, reason, latest completion, commit and handoff), `latest_completion` and the registry counts. A stale or hand-set value fails CI. The status registry keeps its role for the task lifecycle (OPEN, REVIEW, CANONICAL), and CI keeps the two consistent. Neither may contradict the other.

## Files

| Path | Holds | Written by |
|---|---|---|
| [`STATUS_SUMMARY.md`](STATUS_SUMMARY.md) | Generated summary: per-tool table, latest completion with files, tests and risks, awaited outputs, next assignment | `node scripts/ai/state.mjs generate` only |
| [`CURRENT_STATE.json`](CURRENT_STATE.json) | Phase, canonical and working branch, current PR, deployment state, **per-tool latest completion** (derived from the handoffs), active tasks, blocked tasks, awaited outputs in order, next integration task, last-updated timestamp | Tool completing a task; derived parts by `generate` |
| [`NEXT_TASK.json`](NEXT_TASK.json) | Task ID (null until the founder issues it), assigned tool, priority, dependencies, ready flag, repository baseline, required inputs, expected outputs, environment, deployment permission | Tool completing a task |
| [`DECISIONS.json`](DECISIONS.json), [`RISKS.json`](RISKS.json) | Decisions (Decision Log, A-032 §9 candidates, rulings in briefs); risks (Risk Register) and engineering residuals | `generate` for derived parts; residuals and rulings by hand |
| [`schemas/`](schemas/) | `handoff.schema.json`, `current-state.schema.json`, `next-task.schema.json`, `decisions.schema.json`, `risks.schema.json` | Changed only with the validator |
| `tool-output/<tool>/<task-id>/HANDOFF.json` | The machine-readable handoff and **ownership record** for one task: `completed`, `partial`, `failed`, or `blocked` (work not in the repository: null commit, `blocked_reason`) | The tool that did or owns the task |
| `tool-output/<tool>/<task-id>/SUMMARY.md` | The human-readable handoff for the same task (must name the task ID) | The tool that did the task |
| `tool-output/<tool>/<task-id>/…` | Optional attachments of the handoff (screenshots, reports), e.g. `lovable/A-043/screenshots/` | The tool that did the task |

The governance sources stay authoritative: the [status registry](../founder/NYAYOS_STATUS_REGISTRY.json) for task status, the [Decision Log](../founder/NYAYOS_DECISION_LOG_V1.md), the [Risk Register](../founder/NYAYOS_RISK_REGISTER_V1.md) and the [Founder Authorization Record](../founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) for gates. This folder is checked against them and never overrides them.

## Tool identifiers and output paths

Exactly four identifiers exist. Anything else fails CI.

| Tool | Identifier | Output namespace | Commit tag |
|---|---|---|---|
| Claude Code | `claude-code` | `docs/ai/tool-output/claude-code/<task-id>/` | `[TOOL:CLAUDE-CODE]` |
| Gemini | `gemini` | `docs/ai/tool-output/gemini/<task-id>/` | `[TOOL:GEMINI]` |
| Lovable | `lovable` | `docs/ai/tool-output/lovable/<task-id>/` | `[TOOL:LOVABLE]` |
| Figma | `figma` | `docs/ai/tool-output/figma/<task-id>/` | `[TOOL:FIGMA]` |

A task ID belongs to exactly one tool: the same task directory under two tools fails CI ("duplicate task ownership").

## How each tool reports completion

Every tool, for every task, in this order:

1. **Register** the task in the status registry. It is REVIEW when the work is complete.
2. **Commit the work** with explicit paths (never `git add -A`) and a tagged message — this is the **completion commit**:
   `[TOOL:<TOOL>][TASK:<task-id>] <type>(<scope>): <summary>`
3. **Push** the branch. Never push to `main`, never merge, never deploy beyond the task's gate.
4. **Write the handoff** `docs/ai/tool-output/<tool>/<task-id>/HANDOFF.json` and `SUMMARY.md`: `baseline_commit` is the commit the work started from, and `completion_commit` is the pushed completion commit. The file lists must equal `git diff --no-renames --name-status baseline_commit completion_commit`.
5. **Update** `CURRENT_STATE.json`: active and blocked tasks, awaited outputs, PR, deployment, `last_updated`. Also update `NEXT_TASK.json` with `after` set to this task.
6. **Generate and check**: `node scripts/ai/state.mjs generate`, then `node scripts/ai/state.mjs check`.
7. **Commit the state** (`[TOOL:<TOOL>][TASK:<task-id>] chore(ai-state): record handoff`), **push**, confirm a clean worktree and green CI.
8. **Reply to the founder with one line**, e.g. `CC_DONE TASK=<task-id> COMMIT=<sha> HANDOFF=<path> PR=<n> CI=pass`. The founder forwards only "CC done".

Commit-message requirements:

- The completion commit's subject **must** start with `[TOOL:<TOOL>][TASK:<task-id>]`, with the tool in capitals and the task ID exactly as registered. CI rejects a handoff whose completion commit lacks it.
- State commits use the same tag.
- The only exemption is a handoff with a `backfill` block, used for work that predates this protocol (A-042, A-044).

## Validation command

```bash
node scripts/ai/state.mjs check
node scripts/ai/state.mjs check --head <pull-request head SHA>
node --test scripts/ai/state.test.mjs
```

`task-gate`, the required check, runs the test suite and the check. On pull requests the check runs with `--head`. It fails when:

- a file, schema or tool README is missing, or a JSON file breaks its schema;
- a tool directory is not one of the four identifiers, a task directory lacks `HANDOFF.json` or `SUMMARY.md`, or a stray file sits in a tool directory;
- a handoff's `task_id`/`tool` do not match its path, or a task is claimed by two tools;
- `baseline_commit` or `completion_commit` is missing, not in repository history, or not in order, or the completion commit lacks its tag;
- the file lists differ from the git diff, or an evidence path or commit does not exist;
- the registry marks a task REVIEW or CANONICAL (from A-042 on) and no completed handoff exists (**HANDOFF missing**);
- a registry task from A-042 on has no `HANDOFF.json` under any tool and is not in `active_tasks` (**task ownership missing**);
- `NEXT_TASK.json` does not follow the latest completion (`after`) or was updated before it (**NEXT_TASK stale**);
- `CURRENT_STATE.json` is stale (**CURRENT_STATE stale**): any `tools.<tool>` field, `latest_completion`, the registry counts or `last_updated` differs from what the handoffs and registry give; or `STATUS_SUMMARY.md` differs from a fresh render;
- state contradicts itself: a completed task that is still active, blocked or awaited; a tool marked active that has no active task; NEXT_TASK marked ready with unsatisfied dependencies; NEXT_TASK not following the latest completion;
- on a pull request, any file other than the state files (`CURRENT_STATE`, `NEXT_TASK`, `DECISIONS`, `RISKS`, `STATUS_SUMMARY`, anything inside a task's handoff directory, and the registry-generated founder views) changed after the latest completion commit ("unrecorded work");
- a deployment is recorded as production, or as deployed without being allowed.

## Recovery procedure

| CI says | Do |
|---|---|
| `completion without HANDOFF.json` | Write the missing `tool-output/<tool>/<task-id>/HANDOFF.json` and `SUMMARY.md` for the pushed work, then run `generate`, commit and push |
| `unrecorded work after …` | Work was pushed without a handoff. Record it: write or update the task's handoff with the new `completion_commit` and file lists, run `generate`, commit and push |
| `… is stale — run generate` | `node scripts/ai/state.mjs generate`, then commit and push |
| `files_created lists/omits …` | Rebuild the lists from `git diff --no-renames --name-status <baseline> <completion>` |
| `completion_commit subject must start with …` | Re-commit the work with the tag. Never rewrite pushed history on shared branches: make a new tagged commit and point `completion_commit` at it |
| `duplicate task ownership` / `unknown tool identifier` | Keep the task under the one tool that did it; delete the other directory |
| `contradictory state` | Remove completed tasks from `active_tasks`, `blocked_tasks` and `awaited_outputs`; fix `NEXT_TASK.ready` |
| A tool's output exists only outside GitHub | Do **not** write a completed handoff. Write a **blocked** `HANDOFF.json` (`status: blocked`, `completion_commit: null`, `completed_at: null`, empty file lists, `blocked_reason: "repository handoff missing"`), keep the registry task OPEN, list it in `blocked_tasks`, and run `generate`: the tool shows as blocked. Example: `gemini/A-047` |
| `task ownership missing` | Write the task's `HANDOFF.json` under the tool that owns it (blocked if the work is not in the repository), or list it in `active_tasks` while work is in progress |
| `NEXT_TASK stale` | Update `NEXT_TASK.json`: `after` = the latest completion, `updated` = now |

## Examples

Completion commit and state commit:

```text
[TOOL:GEMINI][TASK:A-045] docs(research): market sizing for FPO disputes
[TOOL:GEMINI][TASK:A-045] chore(ai-state): record handoff
```

Handoff (`docs/ai/tool-output/gemini/A-045/HANDOFF.json`, abridged):

```json
{
  "schema_version": "1.0",
  "project": "NyayOS",
  "task_id": "A-045",
  "tool": "gemini",
  "status": "completed",
  "branch": "feature/fma-foundation-v1",
  "baseline_commit": "<40-character SHA>",
  "completion_commit": "<40-character SHA>",
  "completed_at": "2026-10-01T10:00:00Z",
  "files_created": ["docs/research/NYAYOS_FPO_MARKET_SIZING_V1.md"],
  "files_modified": [],
  "tests": [{ "name": "sources verified", "command": "manual source check", "result": "pass" }],
  "evidence": [{ "description": "research output", "ref": "docs/research/NYAYOS_FPO_MARKET_SIZING_V1.md" }],
  "limitations": ["Two figures are reported, not verified"],
  "risks": [{ "description": "Market size may be overstated", "severity": "medium" }],
  "rollback": "git revert <completion SHA>",
  "deployment": { "allowed": false, "environment": "none", "status": "not_deployed", "url": null },
  "next_recommendation": { "task_id": null, "tool": "founder", "reason": "Founder reviews the sizing before pricing work" }
}
```

A Lovable staging build records `"deployment": { "allowed": true, "environment": "staging", "status": "deployed", "url": "https://…" }`. `production` is never valid because FA-002 is not granted.

## Current records

Backfilled into this structure: Claude Code A-042 and A-044 (from repository evidence), Lovable A-043 (converted from Lovable's own handoff, facts unchanged) and Gemini A-047 (a **blocked** ownership record: no A-047 commit exists on any branch, so no completion is claimed). Lovable's earlier staging builds (A-011 to A-026) predate the protocol and have no handoffs. The Figma package (A-008) is blocked as "repository handoff missing".
