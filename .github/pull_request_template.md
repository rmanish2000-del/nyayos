<!--
NyayOS pull request. task-gate will fail this PR if no assignment ID (A-nnn) appears
in the title or body. Keep the ID here.
-->

## Assignment

**ID:** A-___
**Registry status before → after:** ___ → ___ (`docs/founder/NYAYOS_STATUS_REGISTRY.json`)

## What this changes

<!-- One paragraph. What, and why it is inside the assignment's scope. -->

## Gate

- [ ] This change is within an **authorized** gate — cite the FA entry: FA-___
- [ ] **No production** build, deploy, database, domain or public URL is touched (production is ⛔ NOT ALLOWED)
- [ ] No real user, client or pilot case data anywhere in this change

## Canonical status rules

- [ ] Every task listed under `inputs` in the registry is **CANONICAL**
- [ ] Any dependency that is not yet canonical is under `planned_inputs`, and this task is still `OPEN`
- [ ] If a task reaches `CANONICAL` here, its `evidence` points at a committed artefact
- [ ] Derived docs regenerated: `node scripts/governance/registry.mjs generate` (task-gate checks this)

## Private-data check

- [ ] No case material, FIR/bail/chargesheet, correspondence, identifiers or `.env` files
- [ ] No reference to the private matter beyond existing governance statements
- [ ] Ran locally: `git diff --cached | grep -inE "foodgod|FIR|bail|aadhaar|[0-9]{10,}"` → empty

## Code (only if `app/` changed)

- [ ] `npm run typecheck` · `npm run lint` · `npm run test` · `npm run build` — all pass locally
- [ ] Supplied documents' substance unchanged; corrections recorded as new decisions, not edits

## Registers updated

- [ ] `NYAYOS_ASSIGNMENT_REGISTER.md` — row for this assignment
- [ ] `NYAYOS_OUTPUT_REGISTER.md` — every artefact this PR adds or supersedes
- [ ] `NYAYOS_CHANGELOG.md` — entry (hand-written; status transitions are also auto-appended)
- [ ] `NYAYOS_FOUNDER_DASHBOARD.md` — if phase, stage, risks or next actions changed

## Evidence

<!-- Links: run URLs, screenshots, review sections. "It works" is not evidence. -->
