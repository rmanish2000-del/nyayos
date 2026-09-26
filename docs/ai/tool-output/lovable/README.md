# `docs/ai/tool-output/lovable/` — Lovable

Output namespace of the `lovable` tool. One directory per task this tool completed:

```text
docs/ai/tool-output/lovable/<task-id>/HANDOFF.json   machine-readable (schema: docs/ai/schemas/handoff.schema.json)
docs/ai/tool-output/lovable/<task-id>/SUMMARY.md     human-readable; must name the task ID
```

Completion commits start with `[TOOL:LOVABLE][TASK:<task-id>]`. When the task is done, the founder tells M365 Copilot only "Lovable done".

Protocol, recovery and examples: [`docs/ai/README.md`](../../README.md).
