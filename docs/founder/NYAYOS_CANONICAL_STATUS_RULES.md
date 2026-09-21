# NYAYOS CANONICAL STATUS RULES

**Authority tier:** 2 (governance rule set — sits beside the Decision Log and Risk Register)
**Enforced by:** `scripts/governance/registry.mjs validate`, run by the `task-gate` workflow on every push and pull request, and required to pass before anything merges to `main`.
**Source of truth for status:** [`NYAYOS_STATUS_REGISTRY.json`](NYAYOS_STATUS_REGISTRY.json). The hand-written registers describe *why*; the JSON says *what the status is*. If they disagree, fix the registers.

---

## 1. The status flow

```
OPEN  →  IN_PROGRESS  →  REVIEW  →  CANONICAL  →  SUPERSEDED
```

| Status | Meaning | Entry condition | Exit |
|---|---|---|---|
| **OPEN** | Recorded, not started. May carry unresolved dependencies | Row exists in the registry | All `planned_inputs` resolved (moved to `inputs` as they became canonical); owner assigned; gate authorized if the task needs one |
| **IN_PROGRESS** | Work is happening | Every `inputs` entry is CANONICAL; `planned_inputs` is empty | Output exists and is submitted for review |
| **REVIEW** | Output exists; not yet accepted as truth | Output committed or otherwise reachable | Founder (or delegated reviewer) accepts, and `evidence` is recorded |
| **CANONICAL** | **Accepted as project truth.** Other tasks may depend on it | `evidence` recorded; at least one `output` recorded; every `inputs` entry CANONICAL | Only by being superseded |
| **SUPERSEDED** | Replaced by a later canonical task | `superseded_by` names an existing task | Terminal |

Backward moves are allowed for one reason only: a review rejects the output (`REVIEW → IN_PROGRESS`). Everything else moves forward. A CANONICAL task is never demoted — it is superseded, so the history stays legible.

## 2. The dependency rule

> **No task may be assigned as input to another task unless its status is CANONICAL.**

Encoded as two fields on every task:

| Field | May reference | Effect |
|---|---|---|
| `inputs` | **CANONICAL tasks only.** Enforced — validation **fails** otherwise | The dependency is real and usable now |
| `planned_inputs` | Any task, any status | Declares a future dependency. **A task with any `planned_inputs` cannot leave OPEN.** Enforced |

When a planned input becomes CANONICAL, move it from `planned_inputs` to `inputs`. The validator warns when you forget.

Why two fields instead of one: the strict rule alone would make it impossible to *plan* — Sprint 2 could not even be written down as depending on Sprint 1.1 until Sprint 1.1 finished. `planned_inputs` lets the graph show intent (dashed arrows) while the hard rule keeps solid arrows honest.

## 3. What the validator enforces

| # | Rule | Severity |
|---|---|---|
| R1 | Every `inputs` entry exists and is CANONICAL | **Error** |
| R2 | Every `planned_inputs` entry exists; a task in IN_PROGRESS / REVIEW / CANONICAL has none | **Error** |
| R2w | A `planned_inputs` entry is already CANONICAL | Warning — promote it |
| R3 | CANONICAL tasks have `evidence` and ≥ 1 `outputs` | **Error** |
| R4 | SUPERSEDED tasks name `superseded_by`; non-superseded tasks do not | **Error** |
| R5 | `evidence` and non-`external:` `outputs` exist in the repository | **Error** for CANONICAL · Warning otherwise |
| R6 | No dependency cycles across `inputs` + `planned_inputs` | **Error** |
| R7 | IDs match `A-nnn`; no duplicates; status is one of the five | **Error** |

Plus, in `task-gate`: the derived documents (status dashboard, dependency graph, registry view) must be regenerated and committed alongside any registry change, and a pull request must cite an assignment ID.

## 4. Registry fields

```jsonc
{
  "id": "A-018",                  // A-nnn, unique
  "title": "Sprint 1.1 — State Completion",
  "type": "build",                // research · architecture · product-definition · design · validation · build · review · decision · governance
  "status": "OPEN",               // see §1
  "owner": "Unassigned",
  "tool": "Lovable — staging build",
  "gate": "FA-001",               // the Founder Authorization Record entry that permits this, or null
  "inputs": ["A-011", "A-014"],   // CANONICAL only
  "planned_inputs": [],           // future dependencies; blocks leaving OPEN
  "outputs": ["app/"],            // repo paths, or "external:<what>"
  "evidence": "",                 // required at CANONICAL; a repo path
  "updated": "2026-09-21",
  "superseded_by": null,
  "notes": ""
}
```

## 5. How status relates to the rest of the governance stack

| Question | Answered by |
|---|---|
| **May** this work happen at all? | Tier 1 — [Founder Authorization Record](NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md) (`gate`) |
| **Is** this work started / accepted / superseded? | This registry |
| **Why** was it decided this way? | Tier 2 — [Decision Log](NYAYOS_DECISION_LOG_V1.md) |
| What could go wrong? | Tier 2 — [Risk Register](NYAYOS_RISK_REGISTER_V1.md) |
| Who did it, with what, and what were the limitations? | [Assignment Register](NYAYOS_ASSIGNMENT_REGISTER.md) |
| What artefacts exist and were they accepted? | [Output Register](NYAYOS_OUTPUT_REGISTER.md) |

A gate can be open and a task still OPEN (authorized but not started — A-018 today). A task can be CANONICAL under a gate that later closes (Sprint 1 stays canonical even if FA-001 is superseded). Status and gate are independent axes; do not collapse them.

## 6. Changing status — the procedure

1. Edit `NYAYOS_STATUS_REGISTRY.json`: status, `updated`, and — at CANONICAL — `evidence` and `outputs`.
2. Run `node scripts/governance/registry.mjs all`. Fix every error. Read every warning.
3. Update the hand-written registers for the *why* (Assignment Register limitations, Output Register acceptance).
4. Commit all of it together. `task-gate` re-checks on push.
5. On merge to `main`, `status-update` appends an `[auto]` changelog entry for the transition and opens a PR with the refreshed dashboard and graph.

## 7. What this does not do

- It does not decide anything. A CANONICAL status records a founder acceptance that happened elsewhere.
- It does not replace the Assignment and Output registers. It is the *index* they hang off.
- It does not authorize. Only the Founder Authorization Record does that.
