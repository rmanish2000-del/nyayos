# `docs/ai/tool-output/gemini/` — Gemini

Output namespace of the `gemini` tool. One directory per task this tool completed:

```text
docs/ai/tool-output/gemini/<task-id>/HANDOFF.json   machine-readable (schema: docs/ai/schemas/handoff.schema.json)
docs/ai/tool-output/gemini/<task-id>/SUMMARY.md     human-readable; must name the task ID
```

Completion commits start with `[TOOL:GEMINI][TASK:<task-id>]`. When the task is done, the founder tells M365 Copilot only "Gemini done".

Current record: `A-047/` is a **blocked** ownership record (repository handoff missing). When Gemini commits its A-047 output, it replaces that record with a completed handoff.

Protocol, recovery and examples: [`docs/ai/README.md`](../../README.md).
