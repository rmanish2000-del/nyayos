# `docs/ai/tool-output/figma/`

Figma — design work (e.g. the FM-A package, A-008). Hand off frame lists and their mapping to Scope Sheet screen IDs (see the U01–U21 traceability addendum); never commit Figma source or private case content.

One file per assignment run by this tool, named by assignment ID (`A-nnn.md`), in the standard handoff format of the [tool output contract](../../TOOL_OUTPUT_CONTRACT.md) (schema: [`handoff.schema.json`](../../schemas/handoff.schema.json)). Write it after the work commit is pushed (completion protocol steps 3–5), then commit and push the state update.

`node scripts/ai/state.mjs check` validates every handoff here: required `**Assignment:**`, `**Tool:**`, `**Status:**`, `**Branch:**`, `**Baseline:**`, `**Commit:**`, `**Pushed:**`, `**Deployment:**` lines (`none` or `staging: https://…`; never production) and `## Result`, `## Evidence`, `## Limitations`, `## Next` sections; the ID must be registered and the tool must match this directory.
