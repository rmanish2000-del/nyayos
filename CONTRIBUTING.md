# Contributing to NyayOS

This repository is the **canonical knowledge and continuity source** for NyayOS. Its job is to make sure founder decisions, assignments, risks, progress, evidence and handoffs stay synchronized without repeated work or lost context.

It is **documentation only**.

---

## 1. Hard rules

| Rule | Detail |
|---|---|
| **No product code** | No application code, schema, migrations, seeds, infrastructure-as-code or database resources |
| **No deployment** | Nothing here deploys. Deployment is **NOT ALLOWED** and is gated on a recorded founder decision |
| **No private case material** | See § 3. This is the rule that matters most |
| **No secrets** | No credentials, tokens, API keys, service-account files or `.env` files |
| **Canonical name is `NyayOS`** | Never change it. Legacy `NYAYAOS_*` research filenames are retained deliberately |
| **Never edit a supplied document's substance** | See § 4 |

---

## 2. This repository is private — keep it that way

`github.com/rmanish2000-del/nyayos` is **private**. It was set to private on 20 September 2026, *before* the first push, because supplied documents carry governance references to a founder-controlled private criminal matter.

**Do not make this repository public** without first completing a redaction review and recording the outcome as a decision in the decision log.

Publication is **not reversible** — once content is public it can be cloned, cached and indexed before any later deletion. Privacy settings protect you only until the moment they are changed.

**Before every commit, ask: would I be comfortable if this became public tomorrow?** If not, do not commit it.

---

## 3. Private-data rules

NyayOS references a **founder-controlled private criminal matter** (the *Foodgod FPO matter*). Its handling is locked by decisions **D-005** and **D-017** and governed by [`docs/evaluation/NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md`](docs/evaluation/NYAYOS_REAL_CASE_EVALUATION_PROTOCOL_V1.md).

That matter is:

- private;
- founder-controlled;
- **evaluation-only**;
- not a public demo;
- not generic training data;
- not a basis for guilt or innocence;
- not a basis for bail prediction;
- not a legal-representation exercise.

### Never commit

- FIRs, complaints, chargesheets, bail applications or orders, court orders;
- correspondence, emails, letters, chat exports, media clippings;
- corporate records relating to the matter;
- party names, addresses, phone numbers, email addresses;
- Aadhaar, PAN, passport or other government identifiers;
- case numbers, CNR numbers, FIR numbers;
- **any real user, client or pilot-participant case material**, now or after launch;
- screenshots or exports containing any of the above.

### The distinction that matters

| Permitted | Not permitted |
|---|---|
| *"The Foodgod FPO matter is private evaluation only; do not use it for training."* — a **policy statement** | Any actual document, particular, name or identifier **from** that matter — **case content** |

Policy statements about how private data is handled are governance records and belong here. Case content never does.

> **If you are unsure whether something is case content, do not commit it.** Ask the founder.

### Enforcement

`.gitignore` blocks the known private file by name, plus document, image, audio, archive and structured-data file types wholesale. **These exclusions are a safety net, not a substitute for judgement.** A `.md` file is not automatically safe — markdown is the easiest way to leak a name.

### Before every commit

```bash
git status
git diff --cached
```

Read what you are about to commit. Then check for identifiers:

```bash
git diff --cached | grep -inE "foodgod|FIR|bail|aadhaar|PAN|[0-9]{10,}|resident of|police station"
```

---

## 4. Working with supplied documents

Documents produced by a prior assignment — everything in `docs/research/`, `docs/architecture/`, `docs/product/`, `docs/design/`, `docs/implementation/`, `docs/evaluation/`, `docs/handoffs/`, and the three V1 records in `docs/founder/` — are **evidence of what was decided and why**.

**Do not edit their substance.** Not to fix a typo that changes meaning, not to resolve a contradiction, not to update a superseded claim.

If a supplied document is wrong or outdated:

1. **Do not silently edit it.**
2. Record the correction as a **new decision** in [`NYAYOS_DECISION_LOG_V1.md`](docs/founder/NYAYOS_DECISION_LOG_V1.md).
3. Mark the output **Superseded** in [`NYAYOS_OUTPUT_REGISTER.md`](docs/founder/NYAYOS_OUTPUT_REGISTER.md).
4. Note it in [`NYAYOS_CHANGELOG.md`](docs/founder/NYAYOS_CHANGELOG.md).

Known artefacts deliberately left unfixed — `citeturn…` citation markers, the `NYAYAOS_INDIAN_JUSTICE_MAP.md.md` double extension, legacy `NYAYAOS_` spelling — are recorded in the changelog. **Leave them.**

---

## 5. Running an assignment

Every piece of delegated work follows the same loop.

### Before starting

Add a row to [`NYAYOS_ASSIGNMENT_REGISTER.md`](docs/founder/NYAYOS_ASSIGNMENT_REGISTER.md) with all of:

Assignment ID · Tool and **exact mode** · Purpose · Input files · Expected output · Environment · Deployment allowed/not allowed · Status · Result · Evidence · Limitations · Handoff back to M365 Copilot

### While working

- Read the [Founder Dashboard](docs/founder/NYAYOS_FOUNDER_DASHBOARD.md) first. Do not re-derive context from chat history.
- Do not expand scope. If you find work outside the assignment, record it as a **proposed** assignment; do not do it.
- If two documents conflict materially, **stop and report**. Do not resolve it by editing.

### On completion

- Add the artefact to [`NYAYOS_OUTPUT_REGISTER.md`](docs/founder/NYAYOS_OUTPUT_REGISTER.md).
- Update the assignment row: Status, Result, Evidence, **Limitations**.
- Add a [`NYAYOS_CHANGELOG.md`](docs/founder/NYAYOS_CHANGELOG.md) entry.
- Update the Founder Dashboard if phase, stage, risks or next actions changed.

**An assignment is not complete until its Evidence field points at a committed artefact.**

### State limitations honestly

Every assignment row has a **Limitations** field. Fill it in. Unverified citations, missing inputs, assumptions made, checks not run — record them. An unstated limitation becomes a false decision three months later.

---

## 6. Recording a decision

Follow the existing format in the decision log. Every decision needs:

**Recommendation · Evidence · Confidence · Alternative · Reason rejected · Revisit trigger**

A decision without a **revisit trigger** is not a decision. It is an assumption in disguise.

Then update the **Locked** or **Provisional** list, and reflect it in the Founder Dashboard (§ H / § I).

---

## 7. Commits

- Prefix: `docs:` · `chore:` · `fix:` — this is a docs repository, so `docs:` covers most changes.
- Subject in the imperative, under ~72 characters.
- Reference assignment or decision IDs where relevant: `docs: record A-008 Figma V2 output`.
- Commit related changes together — a document plus its register and changelog entries belong in one commit.

Example:

```
docs: add Figma V2 output and update founder dashboard

Records A-008 completion in the assignment and output registers.
Moves Figma V2 stage from Pending to Complete.
```

---

## 8. Gates — do not cross without a recorded founder decision

| Gate | Blocked until |
|---|---|
| **Lovable staging build** (A-011) | Founder go decision recorded in the decision log **and** the assignment register |
| **Any deployment** | Not authorized. Out of scope for this repository |
| **Consumer launch** | Phase 2. Sandbox only for now (D-004); risk **R23** flags early scope expansion as High likelihood |
| **Private-case training** | D-017 — requires separate explicit authorization and legal review |
| **Any external write action, court integration, or ODR marketplace** | Deferred per master context § 8 |

---

## 9. The risk-acceptance boundary

NyayOS does **not** trade away:

**privacy · evidence provenance · source traceability · human review · correction · deletion · tenant isolation**

to increase engagement, conversion or automation.

If a proposed change trades any of these for growth, it is out of scope regardless of who asked for it. Raise it with the founder instead.
