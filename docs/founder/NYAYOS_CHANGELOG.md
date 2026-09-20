# NYAYOS CHANGELOG

Chronological record of changes to the canonical knowledge base.
Newest first. One entry per commit or per material decision.

**Format:** `## YYYY-MM-DD — <summary>` followed by Added / Changed / Decided / Blocked / Notes.

---

## 2026-09-20 — Repository initialization (A-007)

### Added — repository scaffolding

- `README.md` — repository entry point.
- `CONTRIBUTING.md` — contribution rules and private-data rules.
- `.gitignore` — private-data, credential and binary exclusions, with an explicit private-data warning.
- `docs/INDEX.md` — full document map.
- `/docs` structure: `founder/`, `product/`, `architecture/`, `research/`, `design/`, `implementation/`, `evaluation/`, `handoffs/`.

### Added — founder continuity records

- `docs/founder/NYAYOS_FOUNDER_DASHBOARD.md`
- `docs/founder/NYAYOS_ASSIGNMENT_REGISTER.md` — A-001 to A-007; open A-008 to A-011.
- `docs/founder/NYAYOS_OUTPUT_REGISTER.md`
- `docs/founder/NYAYOS_CHANGELOG.md` — this file.

### Changed — document placement only

15 existing documents were moved into the `/docs` structure. **No substantive content was changed in any supplied document.**

Two non-substantive changes were made, both recorded:

| Change | Reason |
|---|---|
| V1 bundle `README.md` → `docs/handoffs/NYAYOS_V1_DELIVERABLES_README.md` | Filename collision with the repository root README. Content unchanged |
| Documents moved out of `NYAYOS_V1_REVISED_DELIVERABLES/` and the workspace root into `/docs` | Repository structure required by the initialization brief |

**Deliberately not changed:**

- Legacy `NYAYAOS_*` research filenames — retained per `NYAYOS_MASTER_CONTEXT_V1.md` § 2 ("retain those filenames where provenance matters") and because the decision log cites them by name.
- `NYAYAOS_INDIAN_JUSTICE_MAP.md.md` double extension — retained for the same reason.
- `citeturn…` model citation artefacts in the decision log and master product spec — editing them would touch supplied content.

### Decided

- Canonical project name is **NyayOS** for all new work.
- Repository is **documentation only**. No product code, no schema, no database resources, no deployment.
- Lovable staging build (A-011) is **blocked** pending a recorded founder go decision.

### Changed — repository visibility PUBLIC → PRIVATE

The canonical repository was found to be **public** during the pre-commit check. Four supplied documents reference the founder-controlled private criminal matter by name in governance context, so pushing to a public host would have been an irreversible disclosure.

The push was **held** and the decision escalated to the founder, who directed: make the repository private, then push.

Sequence: visibility changed to **PRIVATE** and verified → `main` pushed. **No NyayOS content was ever publicly visible** — the repository was empty for its entire public lifetime.

Standing constraint recorded in `README.md` and `CONTRIBUTING.md` § 2: do not make this repository public without a completed redaction review recorded as a decision.

### Notes — open items requiring founder input

1. Tool and mode for assignments A-002 to A-006 are **not recorded** and were not guessed.
2. The decision log cites `NYAYAOS_MVP_SELECTION_REPORT(1).md`; the workspace file is `NYAYAOS_MVP_SELECTION_REPORT.md`. Assumed identical — confirm no second variant exists.
3. The commercial wedge appears as **locked** in the decision log and **provisional** in the master context. Recorded, not resolved.
4. Whether the private matter name should be redacted from committed documents.

---

## Earlier — pre-repository

Work completed before version control existed is recorded in `NYAYOS_ASSIGNMENT_REGISTER.md` (A-001 to A-006) rather than here, because commit-level history does not exist for it.

| Date | Milestone |
|---|---|
| 2026-09-20 | V1 revised deliverables package produced after the full source package was received (A-006) |
| 2026-09-20 | Architecture review reconciled; prior "architecture review missing" blocker cleared (A-005) |
| 2026-09-20 | Red team, global benchmark, Indian justice map, MVP selection completed (A-001 to A-004) |
