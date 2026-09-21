# NYAYOS BRANCH PROTECTION

**Applied:** 21 September 2026 (A-019) · **Repository:** `rmanish2000-del/nyayos` (private) · **Branch:** `main`
**Status:** **APPLIED** — both a classic branch-protection rule and a repository ruleset are active. Verified via the GitHub API at apply time.

---

## 1. What is enforced on `main`

| Control | Setting | Mechanism |
|---|---|---|
| Required status checks | **`task-gate`** and **`dependency-check`** must pass | Branch protection |
| Up-to-date branches required | **Yes** (`strict: true`) — a PR must include the latest `main` before merge | Branch protection |
| Force pushes | **Blocked** | Branch protection + ruleset `non_fast_forward` |
| Branch deletion | **Blocked** | Branch protection + ruleset `deletion` |
| Enforce on administrators | **No — deliberately, for now** (see § 3) | Branch protection |
| Required reviews | Not configured (single-founder project; see § 4) | — |
| Ruleset | `main-protection`, id **23748706**, enforcement `active`, bypass actors: none | Repository ruleset |

## 2. Why two mechanisms

Branch protection carries the **required status checks**. The ruleset carries **deletion / non-fast-forward** independently, so those two survive even if someone edits or removes the branch-protection rule. Belt and braces for the two failures that destroy history.

## 3. `enforce_admins: false` — the one deliberate gap

The required checks `task-gate` and `dependency-check` did not exist when protection was applied, and a workflow only becomes a recognised check after its first run on the default branch. With `enforce_admins: true` the first push carrying the workflows would have been rejected by the very rule it was meant to satisfy.

So administrators (the founder's account) currently **bypass** required checks. Every bot and every non-admin collaborator is bound by them.

**Close this gap once both workflows have run green on `main`:**

```bash
gh api -X POST repos/rmanish2000-del/nyayos/branches/main/protection/enforce_admins
```

After that, even the founder merges through a pull request that passes both checks. Recorded as a follow-up in the assignment register (A-019 limitations).

## 4. Reviews

Not required by the rule. One human works this repository today; a required review would be a self-approval ritual. Revisit — set `required_approving_review_count: 1` — the day a second committer exists or the day `app/` gains a backend.

## 5. How automation coexists with protection

The `status-update` workflow **cannot push to `main`** (it is not an admin) and does not try. It pushes derived documents to `governance/status-update` and opens a pull request, which then passes through `task-gate` like any other change. This is the intended shape: automation proposes, protection gates, the founder merges.

## 6. Re-apply / audit commands

Verify current state:

```bash
gh api repos/rmanish2000-del/nyayos/branches/main/protection
gh api repos/rmanish2000-del/nyayos/rulesets
```

Re-apply the branch-protection rule exactly as configured on 21 Sep 2026:

```bash
gh api -X PUT repos/rmanish2000-del/nyayos/branches/main/protection \
  -H "Accept: application/vnd.github+json" --input - <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["task-gate","dependency-check"]},
 "enforce_admins":false,"required_pull_request_reviews":null,"restrictions":null,
 "allow_force_pushes":false,"allow_deletions":false}
JSON
```

Re-create the ruleset:

```bash
gh api -X POST repos/rmanish2000-del/nyayos/rulesets --input - <<'JSON'
{"name":"main-protection","target":"branch","enforcement":"active",
 "conditions":{"ref_name":{"include":["refs/heads/main"],"exclude":[]}},
 "rules":[{"type":"deletion"},{"type":"non_fast_forward"}]}
JSON
```

## 7. Interaction with the private-data boundary

Protection stops history from being rewritten or deleted. That is exactly what you want **until** the day private data is committed by mistake — then it is what you do *not* want, because a purge requires a force push. Procedure for that day, in order: make the repository private if it is not (it is); remove the file in a normal commit; **temporarily** delete the ruleset and allow force pushes; rewrite history; restore both rules; rotate anything that was exposed. Do not skip the last step because the repository was private — the clone on your own disk is not the only copy once CI has run.
