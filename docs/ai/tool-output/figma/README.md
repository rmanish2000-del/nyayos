# `docs/ai/tool-output/figma/` — Figma

Output namespace of the `figma` tool. One directory per task this tool completed:

```text
docs/ai/tool-output/figma/<task-id>/HANDOFF.json   machine-readable (schema: docs/ai/schemas/handoff.schema.json)
docs/ai/tool-output/figma/<task-id>/SUMMARY.md     human-readable; must name the task ID
```

Completion commits start with `[TOOL:FIGMA][TASK:<task-id>]`. When the task is done, the founder tells M365 Copilot only "Figma done".

Protocol, recovery and examples: [`docs/ai/README.md`](../../README.md).
