# Tool output contract — NyayOS AI operating system

**A-044, 26 September 2026.** Binding on every tool that works on NyayOS: Claude Code, Figma, Lovable and Gemini, and on M365 Copilot as orchestrator. Its purpose is to **end the founder's copy/paste relay**. A tool reads its context from the repository and writes its result back to the repository; the founder and M365 Copilot read the result from the repository.

Enforced by `node scripts/ai/state.mjs check`, which runs in the required `task-gate` job.

## 1. What a tool reads before starting

1. [`STATUS_SUMMARY.md`](STATUS_SUMMARY.md) — generated one-page state: last assignment, next task, open items, pending decisions, residual risks.
2. The assignment brief and the task's row in the [status registry](../founder/NYAYOS_STATUS_REGISTRY.json).
3. The previous handoff named in `CURRENT_STATE.json` → `last_assignment.handoff`.

## 2. What a tool writes — five steps, in order

| # | Step | Detail |
|---|---|---|
| 1 | **Commit** | The work, with the task registered in the status registry (REVIEW on completion). Explicit paths only; never `git add -A`; never case material, secrets or `.env` files |
| 2 | **Push** | Push the branch. Never push to `main` directly; never merge; never deploy beyond the assignment's gate |
| 3 | **Update [`CURRENT_STATE.json`](CURRENT_STATE.json)** | `last_assignment`: `id`, registry `title` and `status`, `tool`, `baseline` (SHA the work started from), `commit` (**the pushed work-commit SHA**), `pushed: true`, `handoff`. Refresh `summary`, `open_items`, `pull_request`, `deployment`, `updated` |
| 4 | **Write the handoff** | `tool-output/<tool>/<A-nnn>.md` in the standard format (§3) |
| 5 | **Update [`NEXT_TASK.json`](NEXT_TASK.json)** | `after` = the assignment ID; `recommended`, `alternatives`, `blocked_by` |

Then run `node scripts/ai/state.mjs generate` (it rewrites derived fields and `STATUS_SUMMARY.md`), run `check`, **commit the state and push it**. Every assignment therefore ends with two commits: the work commit and the state commit.

**Continuing an assignment under the same ID** (a re-issued brief, a fix-up): repeat steps 1–5 with the new pushed work commit. On pull requests the validator fails if anything other than state files changed after the recorded commit ("unrecorded work").

## 3. Standard handoff format

Schema: [`schemas/handoff.schema.json`](schemas/handoff.schema.json). File: `docs/ai/tool-output/<tool>/<A-nnn>.md`, where `<tool>` is `claude-code`, `figma`, `lovable` or `gemini`.

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

Rules checked by the validator:

- the eight **Field:** lines are present and valid (IDs, 40-character SHAs that exist in the repository, `Pushed: yes`);
- `Deployment` is `none` or `staging: <https URL>` — **production is never a valid value** (FA-002 not granted);
- the four sections appear in the order Result, Evidence, Limitations, Next;
- the file name is a registered assignment ID and the `Tool` matches the directory;
- the handoff named in `CURRENT_STATE.json` agrees with it on commit, baseline, status and branch.

## 4. Per-tool expectations

| Tool | Result must state | Evidence must include | Never |
|---|---|---|---|
| `claude-code` | Files changed, migrations (never applied to a shared environment), tests added | Test and lint results, CI check results on the PR, negative controls where security is involved | Merge, deploy, apply migrations to any environment, commit case material |
| `figma` | Frames produced and their mapping to Scope Sheet screen IDs U01–U21 ([addendum](../product/NYAYOS_FMA_U01_U21_TRACEABILITY_ADDENDUM_V1.md)) | File or frame links; which frames are prototype only | Commit Figma source or exports containing real case content; invent screen IDs |
| `lovable` | The commit built and what changed | Staging URL (`Deployment: staging: …`), what was verified on it | Production, real user data, secrets in the client bundle |
| `gemini` | Findings and recommendations | Sources, with verified versus reported claims marked | Present research as a founder decision; legal advice |

Every tool: state limitations honestly; say what was not verified; keep synthetic data only; respect the gates in the [Founder Authorization Record](../founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md).

## 5. What M365 Copilot and the founder read

- [`STATUS_SUMMARY.md`](STATUS_SUMMARY.md) for the current position, the next task and what awaits the founder.
- The handoff linked there for the last assignment's detail.
- A tool's reply to the founder can be as short as **the commit SHA and the handoff path**: everything else is in the repository.
