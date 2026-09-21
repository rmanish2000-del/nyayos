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

**Repository setting required for this — applied 21 Sep 2026:** *Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"* = **on**. Default is off, and the first real `status-update` run failed at `gh pr create` because of it (run 35559734656 attempt 1; attempt 2 succeeded and opened PR #1). Workflow token permissions stay at the default **read**; `status-update` requests `contents: write` and `pull-requests: write` explicitly in its own file.

```bash
gh api -X PUT repos/rmanish2000-del/nyayos/actions/permissions/workflow \
  -f default_workflow_permissions=read -F can_approve_pull_request_reviews=true
```

Note the setting's name is broader than its use here: it also permits Actions to *approve* PRs. No workflow in this repository approves anything, and `task-gate` would fail any that tried to add one without an A-nnn reference — but the founder should know the permission exists.

**Two more things required checks need in order to actually report on a bot PR — both fixed 21 Sep 2026 after PR #1 opened `BLOCKED` with "no checks reported":**

1. **Pushes and PRs made with `GITHUB_TOKEN` do not fire `pull_request` workflows.** `workflow_dispatch` is the one event the token *may* trigger, so `status-update` now dispatches `task-gate` and `dependency-check` onto its own branch head after opening or refreshing the PR. Check runs attach to the commit SHA, so they satisfy the required-check rule.
2. **A required check must not be path-filtered.** `dependency-check` originally ran only on `app/**`; on a docs-only PR it would be "expected" forever and never report. It now runs on every push and PR, detects whether `app/` changed, and short-circuits the install/typecheck/lint/test/build steps when it did not — still reporting success.

Because `strict: true` requires the PR branch to include the latest `main`, a bot PR that has fallen behind needs **Update branch** (or `gh pr update-branch <n>`) before merge; that update commit is made with the founder's token and fires the checks normally.

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
