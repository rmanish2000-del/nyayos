# `docs/ai/tool-output/claude-code/` — Claude Code

Output namespace of the `claude-code` tool. One directory per task this tool completed:

```text
docs/ai/tool-output/claude-code/<task-id>/HANDOFF.json   machine-readable (schema: docs/ai/schemas/handoff.schema.json)
docs/ai/tool-output/claude-code/<task-id>/SUMMARY.md     human-readable; must name the task ID
```

Completion commits start with `[TOOL:CLAUDE-CODE][TASK:<task-id>]`. When the task is done, the founder tells M365 Copilot only "CC done".

Protocol, recovery and examples: [`docs/ai/README.md`](../../README.md).
