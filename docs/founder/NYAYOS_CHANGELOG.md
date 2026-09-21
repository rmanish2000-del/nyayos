# NYAYOS CHANGELOG

Chronological record of changes to the canonical knowledge base.
Newest first. One entry per commit or per material decision.

**Format:** `## YYYY-MM-DD — <summary>` followed by Added / Changed / Decided / Blocked / Notes.

---

## 2026-09-21 — Sprint 1 import attempted: BLOCKED, inputs not supplied (A-017)

An instruction to import `nyayos-sprint1-foundation.zip` into the canonical repository and mark Sprint 1 CANONICAL was received. **The ZIP, screenshots, staging URL and expected checksum were not supplied** and are not present anywhere reachable. Only the governance commit SHA `1ff5383` was verifiable (correct — the FA-001 commit).

**Nothing was imported. Sprint 1 is not canonical.** Toolchain pre-verified: Node 22.14, npm 10.9, `sha256sum`; no dedicated secret scanner installed.

Three pre-decisions the import will force are recorded in the assignment register (A-017): the import closes the FA-001 code-location item as option (b); code goes under `app/`; `.gitignore` needs carve-outs and the Lovable `.env` must be excluded.

---

## 2026-09-21 — Sprint 1 Foundation review: BLOCKED on artefact; NO-GO (conditional) for Sprint 2 (A-014)

### Reviewed

Lovable reported Sprint 1 Foundation complete (tokens, buttons, inputs, chips, badges, banners, progress, navigation, accessibility baseline). A pre-Sprint-2 architecture review was requested.

**The artefact could not be located** — not in the canonical repo (documentation only, by design), the workspace, Downloads, or any of the 50 repos on the GitHub account. The FA-001 open item *"where does staging code live?"* was never closed; Sprint 1 was completed anyway.

### Added

- `docs/architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md` — review record with: what is needed to run the review (§ 2); the load Sprint 1 must bear, cited to the canonical spec (§ 3); a 50-point acceptance checklist across architecture, design system, WCAG 2.2 AA, state sufficiency and Fact Card readiness (§ 4); findings available from the repository alone (§ 5).

### Findings without the artefact

1. **Typography is undocumented** in every canonical doc; the reported Libre Baskerville + IBM Plex is Lovable's default filling an unrecorded decision. Libre Baskerville has no Devanagari. **High.** Must be fixed at the token layer before Fact Cards.
2. The canonical reference **"Hind Siliguri" is the Bengali member of the Hind family**; Devanagari coverage is *Hind* or *Noto Sans Devanagari*. Flagged for founder confirmation before it becomes a token.
3. A gated deliverable is invisible to the source of truth. **Critical (process).**
4. The state taxonomy (8 epistemic types, 5 date precisions, 5 evidence relations, 4 confidence bands) is fully enumerated in the Product Spec — the review has a fixed target. Favourable.

### Decided

- **Sprint 2 build: NO-GO (conditional).** Four conditions to convert to GO in review § 9. Sprint 2 **design** in Figma may proceed now.
- Ratings for architecture, accessibility and design system: **UNRATED** — no artefact. Process/continuity: **CRITICAL**.

### Open items requiring founder input

1. Supply the Sprint 1 artefact — recommended: Lovable → GitHub sync → private `nyayos-app`.
2. Record the typography decision (D-019 candidate) — Indic face, Latin face, fallback, minimum sizes.
3. Confirm Hind Siliguri vs Hind / Noto Sans Devanagari.
4. Close the FA-001 code-location item.

---

## 2026-09-21 — Staging build authorized; authority hierarchy established (A-013)

### Decided — FA-001

Gate posture changed by founder instruction:

| | Old | New |
|---|---|---|
| Staging build | **Not allowed** | ✅ **ALLOWED** |
| Production | Not allowed | ⛔ **NOT ALLOWED** *(unchanged)* |

Recorded as **FA-001** in the new Founder Authorization Record. Assignment **A-011** (Lovable staging build) is unblocked for **staging only, fixture data only**. New assignment **A-012** (production) created and gated on **FA-002**, which is not granted.

The previously recorded sequence placed the build *after* Figma V2 and WTP validation. Those remain **Pending** — the build now runs in parallel with them. Elevated risks **R25, R13, R14, R24, R12** are recorded in FA-001 § *Risk note*, with a mitigation that does not require reversing the authorization.

### Added

- `docs/founder/NYAYOS_FOUNDER_AUTHORIZATION_RECORD.md` — **tier 1 authority for all gates.** Append-only; supersede with a new FA entry, never edit a past one.
- `docs/product/NYAYOS_MVP_RECONCILIATION_V3.md` — tier 7 consolidation of the MVP position at V3.
- **Document authority hierarchy** (tiers 1–7) in `docs/INDEX.md`, with the three rules that follow from it.

### Changed

- **Dashboard** — new gate-status banner; phase → *Design Preparation → Staging Build*; objective revised; new active-work item **F-3 Lovable staging build (authorized)**; stage progress; § K next actions now **parallel, not sequential**; § L deployment status.
- **README** — staging/production split in the *Read this first* table; stage table; next actions; conventions now point at the authority hierarchy.
- **CONTRIBUTING** — hard rules now say *No production* rather than *No deployment*; § 8 gates table rewritten with five explicit gates.
- **INDEX** — header gate line; authority hierarchy; build brief marked **RELEASED (staging only)**; next actions.
- **Assignment register** — A-011 unblocked; A-012 added; A-013 recorded; M365 Copilot handoff item 4 updated.
- **Output register** — build brief **HELD → RELEASED**; two new artefacts recorded.

### Notes — open items requiring founder input

1. **No `MVP_RECONCILIATION_V3` source document was supplied.** None exists in the workspace, Downloads or the repository, and there is no V1 or V2 to succeed. The V3 file was written as a consolidation of already-recorded positions, introducing **no new product decisions**. A founder-held V3 supersedes it.
2. **Where does staging code live?** Product code must **not** be committed to this repository until this is recorded. Default until then: Lovable's own repository; this repository stays documentation-only.
3. **Who owns the staging build?** A-011 has no assigned owner.
4. Items 1–4 from the 2026-09-20 entry remain open.

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
