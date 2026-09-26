# NYAYOS FM-A REPOSITORY ASSESSMENT AND INTEGRATION STRATEGY (A-030, Phase 1)

| Field | Value |
|---|---|
| Assignment | A-030 — Canonical Repository Integration and FM-A Foundation Build |
| Tool / mode | Claude Code — repository assessment, integration, foundation build (staging only) |
| Branch | `feature/fma-foundation-v1` from `main` at `6c6b478ffa1a811ba435d2891b0b3179a3a7043d` |
| Gate | FA-001 — staging build allowed; production NOT allowed. No deployment · no production change · no direct `main` commit · no legal functionality · no AI functionality · no advocate marketplace |
| Date | 23 September 2026 |
| Governing specifications | FM-A Scope Sheet V1 (A-031) · Security & Data Architecture Spec V1 (A-010) · Build Brief V2 · Fast Mode Strategy V1 · Counsel Brief V1 · Executive Architecture Deck (text extract) · Executive Product Vision Deck (text extract) |
| Continuity owner | M365 Copilot |

**Standing statements.** Nothing in this document asserts that NyayOS is secure, compliant or deployed. Every claim is labelled VERIFIED (checked in this session), REPORTED (stated by a supplied document) or NOT PRESENT.

---

## 1. Repository structure at the branch point (VERIFIED)

| Area | Contents | State |
|---|---|---|
| Root | `README.md`, `CONTRIBUTING.md`, `NYAYOS_OPERATING_SYSTEM.md`, `NYAYOS_STATUS.json`, `.gitignore` | Governance; tier 2 operating system established by A-029 |
| `docs/founder/` | Authorization record (FA-001), decision log D-001–D-030, risk register, status registry (machine source of truth), registers, changelog, dashboards | Governance; append-only conventions |
| `docs/product/`, `docs/architecture/`, `docs/research/`, `docs/design/`, `docs/implementation/`, `docs/evaluation/`, `docs/handoffs/`, `docs/print/` | Supplied and maintainer documents; 13 print sources with 26 exported PDF/PNG | Documentation |
| `app/` | TanStack Start · React 19 · Vite 8 · Tailwind v4 · Vitest; 17 `nyayos/*` components + shadcn baseline; 4 test files (53 tests); `bun.lock` lockfile of record | Staging frontend, fixtures only |
| `.github/workflows/` | `task-gate`, `dependency-check` (required checks), `status-update` | Governance automation; `dependency-check` runs typecheck/lint/test/build and asserts no deploy step |
| `scripts/governance/registry.mjs` | validate / generate / changelog | Governance tooling |
| **Absent** | schema, migrations, backend, server functions, auth, storage, deployment configuration, security documentation | NOT PRESENT before this branch |

Working copy was clean and equal to `origin/main`; repository PRIVATE (VERIFIED via `gh repo view` in A-029, unchanged).

## 2. Architecture inventory — existing `app/` (VERIFIED)

### 2.1 Components (`app/src/components/nyayos/`)

| Component | Sprint / task | Role in FM-A | FM-A screen(s) it serves |
|---|---|---|---|
| `app-shell.tsx` | S1 (A-017) | Responsive navigation shell (mobile tabs / rail / sidebar), skip link, `aria-current` | All |
| `button.tsx`, `input-field.tsx`, `notification-banner.tsx` | S1 | Primitives, 44 px targets, `aria-live` banners | All |
| `status-chip.tsx` | S1.1 (A-018) | Verification-status chip (`to-review`, `confirmed`, `corrected`, `uncertain`, `not-relevant`) | U08, U09, U10 |
| `source-badge.tsx`, `source-panel.tsx` | S1.1 / S2 (A-020, A-022) | Provenance display: origin, locator, verbatim excerpt; split `document-fact` / `ai-extraction` / `unverified-claim` | U08, U11 |
| `date-badge.tsx` | S1.1 | Five date precisions incl. `conflicting`, `unknown` | U09 |
| `confidence-band.tsx` | S1.1 | Bands only (high / medium / low / unknown); no percentages | U08 |
| `readiness-indicator.tsx` | S1 | Readiness percentage only; scoring language prohibited and tested | U03 |
| `inline-correction-input.tsx`, `fact-card.tsx` | S2 (A-020, A-022) | Fact Card with Confirm / Uncertain / Not relevant / Correct actions; correction reason; previous value preserved | U08 |
| `evidence-card.tsx`, `evidence-workspace.tsx` | S3 (A-023, A-025) | Lifecycle (`queued`, `scanning`, `processing`, `extracted`, `rejected`, `error`) separated from category; provenance (uploader, date, hash); upload validation (type, 10 MB), pasted text, cancel | U06 (partial), U07 (partial) |
| `party-card.tsx`, `timeline-event-card.tsx`, `parties-timeline-workspace.tsx` | S4 (A-026) | Parties with Add / Confirm / Edit / Remove and provenance strip; timeline with five precisions, source reference, conflict indicator, filters | U09, U10 |
| `src/components/ui/*` | shadcn/Radix baseline | Unmodified primitives | — |

### 2.2 Runtime and tooling

| Item | State | Note |
|---|---|---|
| Routing | Single file route `/` rendering a component showcase (`routes/index.tsx`) | No FM-A screen routes exist |
| Data | React state with inline fixtures | Nothing persisted; no API layer |
| `src/lib/lovable-error-reporting.ts` | Editor-only telemetry shim: forwards boundary errors to `window.__lovableEvents` / `__lovableReportRuntimeError` **only when those globals exist** (inside the Lovable preview) | Inert in any build outside the Lovable editor; not a production claim. Retained and documented; removal is a one-line change when the Lovable origin is retired |
| Dependencies of interest | `zod` present; no Supabase / auth / storage SDK | Domain layer built on `zod` only |
| Tests | 53 → **132** on this branch (79 new domain tests) | `// @vitest-environment node` for domain files (Web Crypto) |
| Quality gates | `tsc` clean, `eslint` 0 errors, Prettier enforced | Unchanged configuration |

### 2.3 Prototype shortcuts and production claims (Phase 2 check)

| Finding | Assessment | Action |
|---|---|---|
| Showcase route presents component states with fixture data | Staging demonstration, labelled as such in `app/README.md` | Kept; FM-A screens will be separate routes (wave W2) |
| "Production build" in `app/README.md` validation commands | Refers to `vite build` mode, not to a deployment | Wording retained; deployment section already states "Production deployment is not authorised" |
| Lovable error shim | Editor-only; no network call unless the Lovable globals are injected | Documented (above); no change |
| `.env.example` referenced by README | File names only; no values | Unchanged |
| **No mock production claim found** | — | — |

## 3. Inputs located, and the one that is missing (VERIFIED)

| Input named in the assignment | Found | Imported to |
|---|---|---|
| Figma FM-A source handoff package | **NO** — not in Downloads, OneDrive (`Microsoft Copilot Chat Files`), Desktop, Documents, or any repository under the founder's GitHub account | — (Phase 2 blocked; see §5) |
| FM-A Scope Sheet V1 | Yes (`b7f8b59bc099cd7b…`) | `docs/implementation/` |
| Security & Data Architecture Spec V1 | Yes (`7dc6222b60547007…`) | `docs/architecture/` (closes A-010) |
| Build Brief V2 | Yes (`6b9003f9845ac9c8…`) | `docs/implementation/` |
| Counsel Brief V1 | Yes (`80798c5b2c70b9d5…`) | `docs/founder/` |
| FM-0 Concierge Pack V1 | Yes (`37da3870e6bd7dc2…`) | `docs/product/` |
| Executive Architecture Deck (.pptx, 20 slides) | Yes (`dd6c03dd4584dd04…`) | Text extract in `docs/architecture/` (binary gitignored) |
| Executive Product Vision Deck (.pptx, 15 slides) | Yes (`b9b911032475feff…`) | Text extract in `docs/product/` (binary gitignored) |
| Fast Mode Strategy V1 (not named, but the Scope Sheet's parent) | Yes (`422e1e4a59e8a3a7…`) | `docs/product/` |

All files were scanned for private case material before import (none found; unrelated private files present in the same folders were not opened or touched).

## 4. Conflicts between the supplied documents and the existing code (VERIFIED by reading)

| # | Conflict | Resolution adopted on this branch | Open for founder? |
|---|---|---|---|
| C1 | **S1–S16 numbering differs.** Scope Sheet / FMS §7: S1 tenant isolation … S16 backups. Executive Architecture Deck slide 16: S1 authentication … S16 tombstone retention | Scope Sheet numbering is canonical (it is the buildable spec and maps to SEC tests). A cross-map is recorded in the gap report §3 so the deck stays usable | No — recorded |
| C2 | **Vocabulary.** Deck: Matter, FactVersion, DeletionTombstone. Scope Sheet / BB2: `disputes`, `user_corrections`, `deletion_ledger` | Scope Sheet table names are used (CR-1 requires identical BB2 tables). `Matter` and `DeletionTombstone` are exported type aliases; `FactVersion` is rebuilt from `user_corrections` — no `fact_versions` table is created | No — recorded |
| C3 | **Deletion of a referenced document.** Deck G5: blocked while any canonical fact references it. Scope Sheet SEC-DEL-01: rows, objects and export references removed | `document_reference_policy` is a [PROV] configuration key, default `block` (stricter). Cascade remains available | **Yes** — choose policy before W3 |
| C4 | **Tombstone content.** SDAS §10 retains a content-free tombstone with the document SHA-256 [PROV]; Counsel Brief OL-03 interim path: omit the hash | Ledger rows carry scope type, scope id and time only (`.strict()` schema; no hash column) | Yes — counsel (OL-03) |
| C5 | **Existing evidence lifecycle** (`queued`, `scanning`, `processing`, `extracted`, `rejected`, `error`) vs FM-A upload states (`received`, `quarantined`, `scanning`, `clean`, `rejected`, `promoted`, `purged`) | Domain enum follows the Scope Sheet; UI lifecycle is a presentation of it. `processing`/`extracted` have no FM-A meaning (no OCR) and will map to `promoted` in W2 | No |
| C6 | **Existing `SourceBadge` shows an `ai-extraction` kind**; FM-A has no AI | Kept as a reserved presentation state (CR-8: AI becomes another origin later). Domain `ITEM_ORIGIN_TYPES` reserves `ai_extraction`; FM-A enables only the three user/document origins | No |
| C7 | Deck slide 6 roles "Owner · Counsel · Reviewer · Uploader · Auditor" vs SDAS/Scope Sheet role tables | SDAS role tables are authoritative (tenant / dispute / grant / platform roles). Deck roles are narrative | No |
| C8 | Evidence-card upload limit 10 MB (A-025) vs unspecified [PROV] | Recorded as `upload_max_bytes` [PROV] = 10 MB | No |

## 5. Integration strategy (adopted)

1. **Branch discipline.** All work on `feature/fma-foundation-v1`; `main` receives it only through a founder-reviewed pull request. `task-gate` and `dependency-check` run on the branch push.
2. **Specifications first.** Import the supplied set unchanged, register it (A-031) and close A-010, so that every build claim on this branch cites a CANONICAL input.
3. **Domain layer before screens.** Build `app/src/domain/` as a framework-agnostic twin of the Scope Sheet §4 model with pure functions for every S1–S16 invariant that can be expressed without I/O. This is what the missing Figma package cannot block.
4. **Schema as a specification-grade migration.** Write `db/migrations/0001_fma_foundation.sql` with RLS enabled and forced on every table, helpers, single-writer functions and allow-list registration in one file (BB2 §3.3). Do **not** apply it: no database exists and FD-02 is undecided. Lint it statically and keep TypeScript and SQL in parity by a script (`scripts/db/schema-lint.mjs`).
5. **UI integration deferred to a wave with the design input.** Map U01–U21 against the 17 existing components (gap report §4) so the missing package's cost is visible; do not invent screens that the design would contradict.
6. **Nothing that later milestones would have to undo** (FMS §14): enums in full, flags declared, helpers present, proposals as the only write path, share model absent rather than simplified.
7. **Honesty of state.** Registry: A-030 in REVIEW, not CANONICAL, until merged. Status JSON records the branch as a separate object; `canonical_head` stays on `main`.

## 6. Waves (summary — detail in the gap report §7)

| Wave | Content | Prerequisite |
|---|---|---|
| **W0 (this branch)** | Specs imported; domain layer; SQL migration (not applied); lint; gap report | — |
| W1 | Staging database (synthetic), auth provider, server functions A01–A03, A28 (audit), consent A02, storage buckets, apply `0001` and run SEC-RLS/TEN/HASH-05/DEL-06 live | Founder merge; **FD-02** hosting/region; FD-03 scan provider choice for W1b |
| W2 | Screens U01–U05, U08 wired to the domain; deterministic intake rules from FM-0 | Figma FM-A package (A-008) or founder decision to proceed from canonical copy |
| W3 | Upload → quarantine → scan → promote (A09–A15), viewer, manual locations (U06, U07) | FD-03 scan provider |
| W4 | Export A19–A22 (U16, U17); deletion A23–A26 (U18); My activity (U19); settings (U20); trust page (U21) | W1–W3 |
| W5 | FM-A exit gate: FN-01…16, SEC subset, restore drill, gate report | OL posture per Scope Sheet §9.4 |

## 7. What this assessment does not do

It does not authorise anything (FA-001 already governs); it does not assert that the SQL runs (it has not been executed against a database); it does not certify security or compliance; and it does not replace the founder's review of the pull request.
