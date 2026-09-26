# `docs/ai/tool-output/claude-code/`

Claude Code — repository work: code, SQL, tests, governance, reviews, documentation.

One file per assignment run by this tool, named by assignment ID (`A-nnn.md`), in the handoff format defined in [`docs/ai/README.md`](../../README.md#handoff-format). Write it after the work commit is pushed (completion protocol steps 3–5), then commit and push the state update.

`node scripts/ai/state.mjs check` validates every handoff here: required `**Assignment:**`, `**Tool:**`, `**Status:**`, `**Branch:**`, `**Baseline:**`, `**Commit:**`, `**Pushed:**` lines and `## Result`, `## Evidence`, `## Limitations`, `## Next` sections; the ID must be registered and the tool must match this directory.
