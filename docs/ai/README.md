# `docs/ai/` — repository-centric AI operating system

**Introduced by A-044 (26 September 2026).** Any tool that works on NyayOS (Claude Code, Figma, Lovable, Gemini, M365 Copilot) reads its starting context from this folder and writes its result back here. The repository, not a chat history, is the continuity record.

| File | Holds | Maintained by |
|---|---|---|
| [`STATUS_SUMMARY.md`](STATUS_SUMMARY.md) | **Generated** one-page summary — read this first. No hand edits | `node scripts/ai/state.mjs generate` |
| [`TOOL_OUTPUT_CONTRACT.md`](TOOL_OUTPUT_CONTRACT.md) | What every tool reads, writes and never does; the standard handoff | Changed only with the validator |
| [`CURRENT_STATE.json`](CURRENT_STATE.json) | Where the project stands: branch, PR, deployment, the **last completed assignment** (commit, handoff), open items. `derived` = counts from the status registry | Tool completing an assignment; `derived` by the generator |
| [`NEXT_TASK.json`](NEXT_TASK.json) | The recommended next assignment (a recommendation: the founder issues assignments and IDs) | Tool completing an assignment |
| [`DECISIONS.json`](DECISIONS.json) | Founder decisions: `logged` (from the Decision Log), `candidates` (A-032 §9), `rulings` given in briefs but not yet logged | `logged`/`candidates` by the generator; `rulings` by hand |
| [`RISKS.json`](RISKS.json) | Product risks (from the Risk Register) and engineering `residuals` left by assignments | `risks`/`top_five` by the generator; `residuals` by hand |
| [`schemas/`](schemas/) | JSON Schemas for the four files and for the handoff (`handoff.schema.json`) | Changed only with the validator |
| [`tool-output/<tool>/<A-nnn>.md`](tool-output/) | One handoff per assignment, in the directory of the tool that ran it: [`claude-code`](tool-output/claude-code/), [`figma`](tool-output/figma/), [`lovable`](tool-output/lovable/), [`gemini`](tool-output/gemini/) | The tool that ran the assignment |

The governance sources remain authoritative: the [status registry](../founder/NYAYOS_STATUS_REGISTRY.json) for task status, the [Decision Log](../founder/NYAYOS_DECISION_LOG_V1.md) for decisions, the [Risk Register](../founder/NYAYOS_RISK_REGISTER_V1.md) for product risks, and the [Founder Authorization Record](../founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) for gates. These files summarise them for tools; they never override them.

## Completion protocol — required for every assignment

An assignment is not complete until all five steps are done, in this order:

1. **Commit** the work (explicit paths only; never `git add -A`), with the task registered in the status registry.
2. **Push** the branch.
3. **Update `CURRENT_STATE.json`**: `last_assignment` = the assignment's ID, registry title and status, tool, baseline SHA, the **pushed work-commit SHA**, `pushed: true`, and the handoff path; refresh `summary`, `open_items`, `pull_request`, `deployment`, `updated`.
4. **Write the tool handoff** `docs/ai/tool-output/<tool>/<A-nnn>.md` in the format below.
5. **Update `NEXT_TASK.json`**: `after` = the assignment's ID, plus the recommendation.

Then run `node scripts/ai/state.mjs generate` and `node scripts/ai/state.mjs check`, commit the state update ("state commit") and push it.

Because steps 3–5 record the SHA of the pushed work commit, every assignment ends with **two commits: the work commit and the state commit.** Between the two pushes the `task-gate` check is expected to fail with "assignment state not recorded"; it passes once the state commit is pushed. A pull request head therefore always shows whether the latest assignment has been recorded.

## Handoff format

Standard schema: [`schemas/handoff.schema.json`](schemas/handoff.schema.json); full contract: [`TOOL_OUTPUT_CONTRACT.md`](TOOL_OUTPUT_CONTRACT.md). File name: the assignment ID, e.g. `tool-output/claude-code/A-044.md`. Required lines and sections:

```markdown
# A-nnn handoff — <title>

**Assignment:** A-nnn
**Tool:** claude-code | figma | lovable | gemini
**Status:** <registry status, e.g. REVIEW>
**Branch:** <branch>
**Baseline:** <40-character SHA the work started from>
**Commit:** <40-character SHA of the pushed work commit>
**Pushed:** yes
**Deployment:** none | staging: https://…

## Result
## Evidence
## Limitations
## Next
```

## What the validator enforces

`node scripts/ai/state.mjs check` runs in the required `task-gate` job on every pull request and on `main`. It fails when:

- any file above, a schema, a tool directory README or a governance source is missing;
- a JSON file is invalid or does not match its schema;
- `STATUS_SUMMARY.md` differs from a fresh render (stale or hand-edited);
- a derived field is stale against its source (`CURRENT_STATE.derived` vs the registry; `DECISIONS.logged` vs the Decision Log; `DECISIONS.candidates` vs A-032 §9; `RISKS.risks`/`top_five` vs the Risk Register);
- `CURRENT_STATE.last_assignment` is not the registry's newest task, or its title/status differ from the registry;
- the recorded commit is not in the checked-out history, or the baseline is not its ancestor;
- a handoff does not match `schemas/handoff.schema.json` (including `Deployment`: never production), or the last one disagrees with `CURRENT_STATE` (commit, baseline, status, branch);
- on pull requests (`check --head <sha>`): any file other than the state files changed after the recorded commit (**unrecorded work**);
- `NEXT_TASK.after` is not the last assignment, or `NEXT_TASK` recommends an already-registered ID;
- the working branch is not in `NYAYOS_STATUS.json`, or a ruling, open item or residual cites an unknown decision or residual.

Commands:

```bash
node scripts/ai/state.mjs generate
node scripts/ai/state.mjs check
node scripts/ai/state.mjs check --head <pull-request head SHA>
```
