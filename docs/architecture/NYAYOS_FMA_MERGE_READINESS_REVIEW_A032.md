# NYAYOS FM-A MERGE-READINESS REVIEW (A-032)

| Field | Value |
|---|---|
| Assignment | A-032 — Independent Review & Merge Readiness Audit of A-030 |
| Subject | PR [#2](https://github.com/rmanish2000-del/nyayos/pull/2) · branch `feature/fma-foundation-v1` · commits `a23faf85edec50e8224a9e3d361e85dc6a73b6bd`, `63ac9f29e644ca2e6271c8a9491bc14dbcf3c658` · base `main` `6c6b478` · 51 files, +11 477 / −73 |
| Tool / mode | Claude Code — fresh session; read, execute, probe. **No fixes applied.** |
| Environment | Review executed on an ephemeral local `postgres:16-alpine` container with synthetic data (destroyed afterwards) and a temporary Vitest probe (not committed). No environment exists; nothing deployed. |
| Inputs | All 14 mandated inputs. Two of them — FM-A Product & User Flow deck (47 slides, sha256 `489ccc68…`) and FM-0 Concierge deck (25 slides, sha256 `904f5081…`) — were **not** A-030 inputs and were not in the repository; imported as text extracts under this task. |
| Date | 23 September 2026 |
| Continuity owner | M365 Copilot |

**Independence statement.** The reviewer is the same tool that produced A-030. Independence here is procedural: a fresh context, every claim re-derived from the branch, and eleven defects confirmed by execution rather than by reading. It is not organisational independence; a human security reviewer should still read §4.

---

## 0. Post-fix status (A-033, 23 September 2026)

| Finding | Status | Evidence |
|---|---|---|
| C-1 audit chain fork | **Closed by A-033-R (24 Sep 2026).** A-033's advisory lock alone was insufficient: at `8489353` the chain still forked under a REPEATABLE READ writer and under a 10×5 READ COMMITTED burst. Migration `0004` assigns `seq` under the lock and adds a unique index on `prev_hash` | `db/tests/audit_concurrency_matrix.sh`: RC, RR, SERIALIZABLE pairs and 10×5 burst, three repeats, 162 rows, 0 forks, 0 out-of-order rows, chain intact; smoke `C1R_*` |
| C-2 deletion-request authorisation | **Closed** — INSERT grant and policy removed; `request_deletion()` verifies owner / editor / self and takes the undo window from config; TS mirror. **Re-verified by A-033-R** | smoke `C2_*` (5); `db/tests/deletion_authz_0001.sql` 25/25 (cross-tenant, same-tenant cross-dispute, viewer, editor, direct-insert bypasses, server-computed deadline, no existence leakage) |
| M-1 consent ordering | **Closed** — event-time ordering | `consent.test.ts` order-independence + re-grant + future-withdrawal |
| M-4 provenance / identity guards | **Closed** — identity keys refused, `created_by` server-set, `ai_extraction` refused (function + CHECK ×10), `source_ref` shape (CHECK ×11) | smoke `M4_*` (7 checks); PROBE4/4b/5b now refused |
| M-5 manifest typing | **Closed** — explicit `itemType`, typed manifest | `export-deletion.test.ts` event vs proposition |
| M-2 TS/SQL audit hashes not interoperable | **Closed by A-038 (24 Sep 2026)** — one contract `nyayos-audit-v1` in `0005` and `audit.ts`; the SQL session-TimeZone dependence of `occurred_at` also removed | 13 golden vectors matched byte for byte by both runtimes (`db/tests/audit_hash_vectors_v1.*`, `audit-interop.test.ts`); TypeScript verifies a PostgreSQL-written chain |
| M-7 audit not atomic with canonical writes | **Closed by A-038 (24 Sep 2026)**, per D-031 — server functions write their audit event in the same transaction; internal writer has no client grant | `db/tests/audit_atomicity_0001.sql` 21/21 incl. fault-injected audit failure rolling back canonical writes and failed canonical writes leaving no audit row |
| M-6 deletion enumeration incomplete | **Closed by A-039 (24 Sep 2026)** — explicit graph `deletion_graph_v1()` (every table decided; TS twin with lint parity) and read-only `enumerate_deletion_scope()`; documents, versions and quarantine uploads covered; shared or ambiguous records blocked | `db/tests/deletion_scope_0001.sql` 28/28 incl. catalogue-driven completeness oracle, isolation and zero-mutation fingerprint |
| M-3 deletion worker cannot delete | **Closed by A-040 (24 Sep 2026)** under D-032 — server-only `purge_deletion_request()` consumes the A-039 enumeration as the requester, deletes only purge candidates after an orphan closure, keeps audit, tombstones and retained metadata, and is the only deletion path (no DELETE grant to any role; append-only triggers accept DELETE only inside an active purge) | `db/tests/deletion_purge_0001.sql` 55/55 incl. whole-database snapshots, orphan oracle and 7 negative controls; `db/tests/deletion_purge_concurrency.sh` 3/3 |
| M-8 conflicting U01–U21 numberings | **Closed by A-041 (26 Sep 2026)** — one authoritative U01–U21 traceability addendum: every screen mapped to code, server, database, security, tests, copy and design evidence; every alternative numbering (deck, Figma Brief V2, reports, component groupings) cross-mapped to Scope Sheet IDs; fifteen content conflicts recorded with decisions. Supersedes the §6 cross-map (adds deck U11 → U07). Founder decisions D-035 / D-036 remain open | [`NYAYOS_FMA_U01_U21_TRACEABILITY_ADDENDUM_V1.md`](../product/NYAYOS_FMA_U01_U21_TRACEABILITY_ADDENDUM_V1.md) §3–§8; validation of paths, links, identifiers and IDs |
| m-1 direct `status` update on disputes | **Closed by A-042 (26 Sep 2026)** — reproduced on `0001`–`0007` (owner and editor each updated status directly); migration `0008` revokes `UPDATE (status)` from `nyayos_authenticated` (title and category label edits kept) and makes status follow the deletion workflow only (request → `deletion_requested`, undo → `active`, audited) | `db/tests/dispute_status_0001.sql` 21/21 (fails on the baseline); negative controls re-grant and missing undo audit both detected; smoke `M1_*` |
| m-2 … m-12 | **Open, non-blocking** — not in the §8 required-before-merge list; tracked follow-ups | §2 |

**Updated risk rating: Medium.** **Updated recommendation: SAFE TO MERGE** as the FM-A foundation once the founder either applies m-1 (one grant line) and the M-8 cross-map addendum, or accepts them as tracked follow-ups; D-031…D-036 remain decisions to take before wave W1. Sections 1–11 below are the original review as issued and are unchanged.

**A-041 (26 Sep 2026):** every A-032 critical and major finding is now closed. Remaining before merge: minor m-1 (one grant line, needs a new migration) and the other minor findings, which the founder may apply or accept as tracked follow-ups; open founder decisions D-035 and D-036 are listed in the addendum §6.

**A-042 (26 Sep 2026):** m-1 is closed, so every fix listed in §8 as required before merge is now done. Minor findings m-2 to m-12 stay open as tracked, non-blocking follow-ups.

---

## 1. Executive summary

**Recommendation: MERGE WITH FIXES.** The branch does what A-030 claimed and does not do anything it was forbidden to do: no AI, legal, representation, marketplace, deployment or dependency change exists (§7). Tenant isolation, single-writer enforcement, the write-once evidence model and the append-only audit table hold under adversarial probes. But two controls that the whole design leans on are wrong in ways only execution shows: the audit hash chain **forks under two concurrent writers** and then reports a legitimate row as tampered, and the deletion-request policy **accepts a request naming another tenant's dispute** with a client-chosen undo window. Eight further major findings are real defects or unresolved design conflicts, most of them small to fix. Because the migration has never been merged or applied to any environment, every fix can be made in place on this branch.

| Count | |
|---|---|
| **Critical** | **2** |
| **Major** | **8** |
| **Minor** | **12** |
| Verified by execution | 11 (SQL container 9, Vitest probe 2) |
| Verified by reading only | 11 |
| Scope violations | **0** |
| Final risk rating | **Medium-High as submitted → Medium after §8 fixes** (no environment exists, so nothing is exploitable today; the rating is about what W1 would inherit) |

## 2. Findings table

Severity: **C** critical — a core control fails or a latent cross-tenant path exists · **M** major — must be fixed or decided before the next build wave · **m** minor. "Verified" = reproduced by execution in this review; "Read" = confirmed by code inspection.

| ID | Sev | Area | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| C-1 | C | Audit chain | `tg_audit_before_insert` reads the last committed `row_hash` without serialising writers. Two concurrent inserts both chain to the same predecessor; `verify_audit_chain()` then flags the legitimate second row. The integrity control cannot distinguish a fork from tampering. | **Verified.** Two psql sessions: rows 2 and 3 both have `prev_hash = 31cb0d66…`; `verify_audit_chain()` → `3`. `db/migrations/0001_fma_foundation.sql:759` | Take `pg_advisory_xact_lock(hashtext('nyayos.audit_events'))` (or `lock table … in exclusive mode`) at the top of the trigger so writers serialise; add a two-session test to `db/tests/smoke_0001.sql`. |
| C-2 | C | RLS / deletion | `deletion_requests_insert_self` checks only `requested_by = current user` and tenant membership of the *supplied* `tenant_id`. `scope_id` is unchecked and `undo_until` is client-supplied. A member of tenant B inserted a `dispute` deletion request naming tenant A's dispute with `undo_until` in the past. No worker exists yet, so nothing is deleted today — but A24 as specified enumerates this table. | **Verified.** PROBE1 accepted. `0001_fma_foundation.sql:1328-1329` | Remove the INSERT grant; add `nyayos.request_deletion(scope_type, scope_id)` (security definer) that verifies `is_dispute_member(scope, 'dispute_owner')` / document membership / self for account, computes `undo_until` from `config_provisional`, and writes the row. Mirror in TS `newDeletionRequest`. |
| M-1 | M | Consent | `requirePurpose` picks the "latest" row by `grantedAt`; `withdrawConsent()` copies the original `grantedAt`, so grant and withdrawal tie and array order decides. `[withdrawn, granted]` → **ok**. | **Verified.** Vitest probe: `{"ok":true,"consentId":"c1"}` for the reversed order. `app/src/domain/consent.ts:93-95,120` | Treat any matching row with `withdrawnAt ≤ now` as withdrawal unless a grant with `grantedAt > withdrawnAt` exists; order by `(withdrawnAt ?? grantedAt)`; add the order-independence test. |
| M-2 | M | Audit chain | TypeScript and SQL compute **different** hashes for the same row: SQL hashes the `jsonb::text` form (`{"b": 1, "m": {…}, "aa": 2}` — spaces, keys ordered by length then alphabet), TS hashes compact `JSON.stringify` with alphabetical keys. `verifyAuditChain` (TS) cannot verify rows the trigger wrote and vice versa. A-030 flagged this as risk R8 but shipped both verifiers as if authoritative. | **Verified** jsonb text form in the container; `audit.ts:113-134` vs `0001:761-767`. | Make the SQL trigger the only hasher. Either delete TS `computeRowHash`/`verifyAuditChain` or reimplement TS canonicalisation to reproduce Postgres jsonb text output exactly and add a cross-layer fixture test (same row → same hash in both). |
| M-3 | M | Deletion model | The deletion worker cannot delete anything: `nyayos_service_deletion` has **no DELETE grant on any table**, and `document_versions_forbid` / `user_corrections_forbid` triggers raise on DELETE for every role including the worker. S9 ("deletion that deletes") has no path; S5/S7 append-only was applied to tables that the Scope Sheet says are purged with the dispute (RC-ACT). | **Verified.** PROBE3/3b: `permission denied for table document_versions` / `disputes`. `0001:786-789`, grants at `1216-1359`. | Decide the pattern now: forbid-triggers allow DELETE when `current_user = 'nyayos_service_deletion'` (never UPDATE), grant DELETE to the worker on every non-retained allow-list table, keep `audit_events`, `audit_anchors`, `deletion_ledger` immutable for all. Record as D-03x. |
| M-4 | M | Provenance / S3 / S11 | The proposal payload may set any non-server column, so a client controls provenance and identity fields: `created_by` on a statement was stored as a third user's id; `origin_type = 'ai_extraction'` was stored on a canonical event although AI is inert in FM-A; `source_ref = {}` was accepted, creating a canonical fact with no provenance ("No fact without provenance", Deck slide 12). | **Verified.** PROBE4 (`created_by` = `cccc…`), PROBE4b (`ai_extraction` stored), PROBE5b (empty `source_ref`). `0001` `decide_proposal`. | In `decide_proposal`: force `created_by := uid`; treat `created_by`, `uploader_id`, `origin_type ∈ {ai_extraction}` as refused keys (FM-A CHECK `origin_type <> 'ai_extraction'` on canonical tables, dropped by a later migration when FM-D lands); validate `source_ref` shape (`kind` ∈ statement/document/user_entry with required ids) by CHECK or trigger. Mirror TS `isProvenanceComplete` as a hard gate before accept. |
| M-5 | M | Export manifest | `targetTypeOf()` infers the item type from property presence; `Event` and `Proposition` are indistinguishable and both emit `"event_or_proposition"`. Manifest entries and omissions therefore do not identify the fact type — a provenance pointer that does not resolve (AC-M5-02). | **Verified.** Vitest probe: both items typed `event_or_proposition`. `app/src/domain/export.ts:targetTypeOf` | Add an explicit `targetType` discriminant to `CanonicalItem` (it already exists in `CANONICAL_TARGET_TYPES`) and remove the heuristic. Test that every canonical type round-trips. |
| M-6 | M | Deletion model | Allow-list rows carry one scope column. `documents`, `quarantine_uploads`, `jobs` are registered under `tenant_id`, `disputes` under `tenant_id`; `tablesForScope('dispute')` therefore omits them although Postgres shows `documents` and `quarantine_uploads` have a `dispute_id` column. A dispute-scoped purge driven by the registry would leave the documents behind. | **Verified.** PROBE9 lists 19 tables with `dispute_id`; `tablesForScope('dispute')` covers 14 of them and omits the dispute row itself. `app/src/domain/tables.ts:76,94,95,100`, `deletion.ts:277` | Allow multiple scope columns per table (or a scope graph: account→tenant→dispute→document→version→export) in both `tables.ts` and `deletion_allowlist`; add a test that every table with a `dispute_id` column is enumerated for dispute scope. |
| M-7 | M | Architecture | Audit is not written in the same transaction as the canonical write. `create_dispute`, `propose_change`, `decide_proposal` emit **no** audit event; `log_audit_event` is callable only by a separate DB role, so a SECURITY DEFINER server function cannot call it. BB2 §3.3 ("every server function … audit event") and Deck slide 12 ("written in the same transaction as the fact") are not met; the TS layer's `audit: [...]` return values are advisory only. | Read. `0001` §6; `proposal.ts` returns action names but nothing persists them. | Decide before W1: (a) an internal `nyayos.audit_append(...)` owned by the audit role, EXECUTE granted to the definer functions only (no client path), called inside each server function; or (b) an outbox table written in-transaction and drained by the audit service. Record as D-03x. |
| M-8 | M | Scope / documentation | **Two conflicting U01–U21 numberings.** Scope Sheet: U01 sign-up/sign-in/OTP … U21 trust page. FM-A Product & User Flow deck: U01 Sign In, U02 OTP, U03 Consent, U04 Dashboard … U20 Export Centre, U21 Settings/Trust/Deletion. The A-030 gap report uses the Scope Sheet numbering with no cross-map (the deck was not an A-030 input). The deck also states four requirements the branch does not meet: mobile-OTP-only sign-in with "no password storage" (Scope Sheet F01 says email/password + OTP); deletion "not reversible" (Scope Sheet: 7-day undo); "only confirmed facts enter timeline or export" (branch manifest includes any `verificationStatus`); tombstone "matter identifier, time and actor" (branch ledger has no actor). | Read (deck text extract §5, §16, §22, §23; Scope Sheet §6, F01, F17). | Founder decides which document governs each point (D-03x). Until then: cross-map in §6 below; gap report addendum; `buildExportManifest` gains a `confirmedOnly` option; `deletion_ledger` gains `requested_by`. |
| m-1 | m | RLS | Owner/editor may `update nyayos.disputes set status = 'deleted'` directly (column grant includes `status`), bypassing the deletion workflow and its honest status. | **Verified.** PROBE2. `0001:1054` | Remove `status` from the authenticated UPDATE grant; status changes only via workflow functions. |
| m-2 | m | RLS | `is_dispute_member` returns true for a dispute whose `status = 'deleted'`; reads keep working through purge. | **Verified.** PROBE6. | Add `d.status <> 'deleted'` (or `deleted_at is null`) to the helper, or a separate `is_dispute_readable`. |
| m-3 | m | Data model | An `evidence_item` in dispute 2 may reference a `document_id` belonging to dispute 1 of the same tenant (FK only). Not cross-tenant, but breaks the per-dispute evidence boundary and complicates dispute-scoped deletion. | **Verified.** PROBE5. | Composite FK `(document_id, dispute_id)` → `documents(id, dispute_id)` or a trigger check. |
| m-4 | m | Evidence | `sniffMime` returns `text/plain` for any NUL-free prefix, so an ELF/HTML/script declared `text/plain` is accepted. Low impact (text is never executed) but SEC-UPL-01's intent is "reject on sniff". | Read. `evidence.ts:isPlausibleText` | Route pasted text through a separate path that never treats a file upload as text; require UTF-8 validity and a size cap for text. |
| m-5 | m | Migration | Cluster-level `create role` inside the migration and the legacy `request.jwt.claim.sub` fallback. Managed providers (Supabase) pre-create `anon`/`authenticated`, may forbid role creation, and set `request.jwt.claims` (JSON). | Read. `0001` §0, `current_user_id()` | Move role creation to a provider-specific bootstrap file; read `current_setting('request.jwt.claims', true)::jsonb->>'sub'` as the fallback. Decide with FD-02. |
| m-6 | m | Migration rollback | Single transaction, so a failed apply leaves nothing behind — good. No down migration (BB2 forward-fix policy) and roles are cluster objects that `drop schema nyayos cascade` will not remove. | Read. | Document the staging rollback recipe in `db/README.md`: `drop schema nyayos cascade; drop role …` for staging only; production rollback = new migration (BB2 §3.3). |
| m-7 | m | Version history | Two concurrent `decide_proposal` calls on one target both read version *n*; the second fails on the `user_corrections` unique constraint. Fails closed (good) but with an opaque error. | **Verified** constraint present (PROBE8); race reasoned. | `select … for update` the target row in `decide_proposal`; map the unique violation to `proposal_conflict`. |
| m-8 | m | Governance | A-010 was set CANONICAL by A-030 on the inference that supplying the spec as a build input is an acceptance. The status rules say CANONICAL "records a founder acceptance that happened elsewhere". | Read. Registry A-010 notes. | Founder ratifies (one line in the Decision Log) or reverts to REVIEW. |
| m-9 | m | Tests | `schema-lint.mjs` checks table-name parity only (not columns, enums, policies per role); the 41-check smoke suite is not in CI; no cross-layer hash test; no concurrency test; no order-independence test for consent. The 79 domain tests are good but they tested the author's model, not the SQL. | Read. | W1: Postgres service container in CI running `smoke_0001.sql`; extend lint to columns; add the tests named in C-1, M-1, M-2, M-5, M-6. |
| m-10 | m | Domain | `transitionDeletion` event `remediated` has no principal check; `window_closed` has none by design but should be service-only. | Read. `deletion.ts` | Require `deletion_worker` or `platform_security`. |
| m-11 | m | Copy / legal gate | Hindi strings are working translations; integrity-scope and notice wording are provisional pending OL-01/OL-04/OL-08. Acknowledged by A-030; restated here because they are user-facing. | Read. `copy.ts`, `export.ts` | Native review before any user sees them; counsel wording before pilot. |
| m-12 | m | Documentation | The FM-0 Concierge deck names the Fast Mode steps "FM-0 Concierge → FM-A Assisted (templates, checklists) → FM-B Supported → FM-1 Product", which does not match the Fast Mode Strategy's FM-0 → FM-A thin-slice software → FM-B share → … → FM-E. | Read. Deck slide 3 vs FMS §15. | Founder aligns the deck or notes it as superseded. No code impact. |

## 3. What was verified as correct (evidence)

| Check | Result | Evidence |
|---|---|---|
| Row-level security enabled **and forced** on every table | 39/39 | `pg_class.relforcerowsecurity`; migration self-check; smoke `all_tables_forced_rls PASS` |
| Cross-tenant isolation | User B sees 0 disputes, 0 events, 0 corrections, 0 consents of A; only own tenant; cannot propose on A's dispute; anonymous denied everywhere | smoke `B_*`, `anon_denied` (8 checks) |
| Single-writer | No authenticated INSERT/UPDATE/DELETE grant on the 14 canonical/append-only tables; direct UPDATE/INSERT denied; create → v1 with null previous value; update → v2 with previous text; rejection recorded; double decide refused; `origin = 'ai'` blocked at proposal insert | smoke (9 checks) + `no_authenticated_write_grant_on_canonical` |
| Version-history integrity | `unique (target_type, target_id, resulting_version)` present; chain rebuild from corrections; gap detection in TS | PROBE8; `proposal.test.ts` |
| Write-once originals | `document_versions`: clean-only CHECK, no UPDATE/DELETE grant, forbid trigger; replacement = new row with new hash | smoke + `evidence.test.ts` |
| Consent locks | `model_improvement` / `aggregate_analytics` rejected by CHECK and policy; reserved purposes rejected; locked flags cannot be enabled | smoke `locked_purpose_rejected`, `reserved_purpose_rejected`; `enums.test.ts` |
| Audit table | Content-key allow-list enforced; UPDATE/DELETE denied to every role and blocked by trigger even for the superuser; a raw tamper is detected | smoke (8 checks) — but see C-1 and M-2 |
| Deny-by-default | Unresolvable requirements denied with a named reason; `grantAllows` false for every input | `authz.test.ts` (11) |
| No AI / legal / representation / marketplace / deployment code path | grep for model SDKs, network calls, advocate/marketplace/limitation/deadline/citation terms, deploy/env/secret references across `app/src/domain`, `db`, `scripts/db`, workflow: none beyond guard lists and comments | §7 |
| No dependency or lockfile change; files touched only in documented areas | `git diff --stat` on `package.json`, `bun.lock`, `package-lock.json`: empty | §7 |
| CI | task-gate, dependency-check, schema-lint all SUCCESS on PR #2 at `63ac9f29` | `gh pr view 2` |

## 4. Security review (S1–S16, Scope Sheet numbering)

| S | Control | Review verdict | Findings |
|---|---|---|---|
| S1 | Tenant / dispute isolation | **Holds** for reads and the single-writer path; **one latent hole** in a write policy | C-2 (deletion_requests), m-2, m-3 |
| S2 | Deny by default; no operator content access | Holds; `platform_security` has no content policy | — |
| S3 | Single-writer canonical facts | Holds for the write path; **provenance fields are client-controlled** | M-4, m-7 |
| S4 | Frozen share snapshots (seam) | Holds — `grant_allows` false, no share tables | — |
| S5 | Write-once originals | Holds; conflicts with S9 as implemented | M-3 |
| S6 | Private buckets / signed URLs | Not built (infrastructure) — correctly declared MISSING | — |
| S7 | Append-only hash-chained audit | **Fails under concurrency**; two non-interoperable hashers; not atomic with writes | **C-1**, M-2, M-7 |
| S8 | Consent enforced; training locked off | Holds in SQL; **TS check order-dependent** | M-1 |
| S9 | Deletion that deletes; honest status | Model honest; **no purge path**; enumeration incomplete; request policy unsafe | **C-2**, M-3, M-6, m-1 |
| S10 | Separate corpora | Holds by absence | — |
| S11 | Zero-tool AI | Holds by absence of any model path; **`ai_extraction` storable as origin** | M-4 |
| S12 | Environment separation | Nothing to separate yet; synthetic data only | — |
| S13 | Secrets server-side | Nothing secret in the bundle; no scan in CI yet | m-9 |
| S14 | India-region hosting | Not built (FD-02) | m-5 |
| S15 | No send/sign/file/approve; no marketplace | Holds — verified by grep and endpoint inventory (no endpoints exist) | — |
| S16 | Encrypted backups; restore drill | Not built | m-6 |

## 5. Architecture, data-model and migration review

- **Architecture.** The layering is sound: a pure domain twin, a specification-grade migration, a static lint that keeps the two table sets equal, and a smoke suite that exercised the SQL. The one architectural gap is M-7: the audit writer is isolated by DB role so completely that the system's own server functions cannot use it, which breaks the "same transaction" invariant. This is a design decision, not a typo, and it should be made before W1 writes the first server function.
- **Data model.** Faithful to Scope Sheet §4 (39 tables, no deferred tables created — CR-1 verified by the lint's deferred-name check). Enums are declared in full (CR-3). `FactVersion` derived from `user_corrections` is a defensible reading of the Deck's version chain and is protected by a unique constraint. Weaknesses: single-column deletion scope (M-6); no shape validation of `source_ref` (M-4); no FK binding evidence items to their own dispute's documents (m-3).
- **Migration.** Wrapped in one transaction, append-only by policy, self-checking at the end. Rollback on staging is a schema drop plus role drop (m-6). Portability caveats for managed providers (m-5). The three defects A-030 found by executing it (defaults bypass, SECURITY DEFINER identity check, `digest` search path) were fixed correctly; this review found no regression from those fixes.
- **Test quality.** 79 domain tests cover the invariants the author designed, and the 41-check smoke suite is the strongest evidence on the branch. What is missing is adversarial and cross-layer testing: concurrency (C-1), order independence (M-1), TS↔SQL hash equality (M-2), manifest type round-trip (M-5), enumeration completeness (M-6). None of these exist, and the smoke suite does not run in CI.

## 6. U01–U21 cross-map (Scope Sheet ↔ FM-A Product & User Flow deck)

The Scope Sheet governs (it maps to F-features, API rows and SEC tests). The deck is a narrative for the same journey with a different numbering. A-030's gap report should be read with this table.

| Scope Sheet | Deck | Note |
|---|---|---|
| U01 Sign-up / sign-in / OTP | U01 Sign In + U02 OTP Verification | Deck: mobile OTP only, "no password storage"; Scope Sheet F01: email/password + OTP — **founder decision** |
| U02 Consent notice | U03 Consent | Deck adds "withdrawal routes to deletion" |
| U03 Dashboard | U04 Dashboard | Same |
| U04 New dispute — "What happened?" | U05 Create Matter + U06 What Happened | Deck splits creation from narrative; deck stores narrative "with version history" (branch: statements are append-only rows — compatible) |
| U05 Intake | U07 Deterministic Intake | Same |
| U06 Evidence locker | U08 Evidence Locker + U09 Upload | Same content |
| U07 Document viewer | U10 Document Viewer | Same |
| U08 Fact list / confirmation | U11 Fact Linking + U12 Facts List + U13 Fact Correction + U14 Fact Confirmation | Deck: "only confirmed facts enter timeline/export" — branch manifest has no such filter (M-8) |
| U09 Timeline | U15 Timeline | Deck: confirmed + dated facts only |
| U10 Parties | U16 Parties | Deck adds "contact details" (S3 data) — not in Scope Sheet §4.3 |
| U11 Evidence map | U17 Evidence Map | Same |
| U12 Contradictions · U13 Gaps | U18 Review & Gaps | Deck's gaps = unsupported/unconfirmed/undated/unused; Scope Sheet's = contradictions + missing evidence — overlapping, not identical |
| U14 File label (issue) | — | No deck equivalent |
| U15 Next steps | U19 Next Steps | Deck: in-product checklist only; Scope Sheet: user-entered steps with user dates |
| U16 Export preview · U17 Export result | U20 Export Centre | Same |
| U18 Delete flows · U19 My activity · U20 Settings · U21 Trust page | U21 Settings, Trust & Deletion | Deck: deletion "not reversible" vs Scope Sheet 7-day undo (F17) — **founder decision**; deck tombstone includes actor (M-8) |

## 7. Scope-compliance review

| Rule | Method | Result |
|---|---|---|
| No AI implementation | grep for model SDKs, `fetch`, network clients in `app/src/domain`, `db`, `scripts/db`; enum audit | **None.** `ai` origin refused at proposal insert; `ai_extraction` reserved — but storable as `origin_type` (M-4, a guard gap, not an AI feature) |
| No legal functionality | grep for statute/limitation/deadline/citation terms outside the prohibited-word guard; `next_steps.user_set_date` user-entered; `issues.label` plain text | **None.** |
| No representation / no send-sign-file | endpoint and table inventory | **None** (no outbound channel, no such tables or functions) |
| No marketplace | grep for advocate/lawyer/referral/fee outside guard lists | **None.** |
| No production-impacting change | workflows diff (one new non-required workflow, no deploy step); no env/secret; no dependency change; `main` untouched; nothing applied to any environment | **None.** |
| Private data | task-gate private-data guard passed; staged content scanned for case identifiers | **None.** |

**Scope violations: 0.**

## 8. Required fixes before merge

All are in-place edits on the unmerged branch (migration `0001` has never been applied to an environment, so editing it is permitted; after merge, corrections become `0002`).

1. **C-1** — serialise audit writers in `tg_audit_before_insert` (advisory transaction lock); add the two-session check to `db/tests/smoke_0001.sql`.
2. **C-2** — drop the authenticated INSERT grant on `deletion_requests`; add `nyayos.request_deletion()` that validates ownership of `scope_id` and computes `undo_until` from config; mirror in TS.
3. **M-1** — fix `requirePurpose` withdrawal precedence; add the order-independence test.
4. **M-4** — in `decide_proposal` force `created_by`/`uploader_id` server-side; refuse `origin_type = 'ai_extraction'` in FM-A; validate `source_ref` shape; reject empty provenance.
5. **M-5** — explicit `targetType` on canonical items; delete the heuristic; round-trip test.
6. **m-1** — remove `status` from the authenticated UPDATE grant on `disputes`.
7. **M-8 (documentation part)** — append the §6 cross-map to the A-030 gap report and list the four deck-vs-Scope-Sheet conflicts as open founder decisions.
8. Re-run: `tsc`, `eslint`, `vitest`, `schema-lint`, and the smoke suite on a throwaway container; update PR #2; founder re-review.

## 9. Decisions required before wave W1 (record in the Decision Log)

| Candidate | Decision |
|---|---|
| D-031 | Audit atomicity pattern (M-7): internal audit function callable by definer functions, or transactional outbox |
| D-032 | Deletion vs append-only (M-3): worker-only DELETE exemption on `document_versions`, `user_corrections`; `audit_events`, `audit_anchors`, `deletion_ledger` stay immutable |
| D-033 | Deletion scope graph (M-6): multi-column allow-list registration |
| D-034 | Single hasher (M-2): SQL trigger authoritative; TS verifier removed or made bit-identical with a cross-layer test |
| D-035 | Which document governs where the FM-A flow deck and the Scope Sheet disagree (M-8): sign-in method, undo window, confirmed-only export, tombstone actor, party contact details |
| D-036 | Ratify A-010 CANONICAL (m-8) and the three A-030 defaults (Scope Sheet S-numbering, `document_reference_policy = block`, content-free tombstone) |

## 10. Nice-to-have improvements

- Extend `schema-lint.mjs` to column and enum parity and to per-role grant expectations.
- CI job with a Postgres service container running `smoke_0001.sql` on every PR touching `db/**`.
- `is_dispute_member` excludes deleted disputes (m-2); composite FK for evidence items (m-3); `for update` on the target row in `decide_proposal` (m-7).
- Provider bootstrap file for roles and the `request.jwt.claims` fallback (m-5); staging rollback recipe (m-6).
- Text-upload path separate from file sniffing (m-4); principal checks on `remediated`/`window_closed` (m-10).
- Native-speaker review of Hindi copy; counsel wording for notices and the integrity statement (m-11).
- Align the FM-0 deck's step names with the Fast Mode Strategy (m-12).

## 11. Evidence record

| Probe | Method | Observation |
|---|---|---|
| PROBE1 | user B inserts `deletion_requests` naming A's dispute, `undo_until` in the past | accepted (C-2) |
| PROBE2 | owner `update disputes set status='deleted'` | accepted (m-1) |
| PROBE3 / 3b | `nyayos_service_deletion` deletes `document_versions` / `disputes` | permission denied (M-3) |
| PROBE4 / 4b / 5b | proposal payload sets `created_by`, `origin_type='ai_extraction'`, `source_ref={}` | all stored (M-4) |
| PROBE5 | evidence item in dispute 2 references dispute 1's document | stored (m-3) |
| PROBE6 | `is_dispute_member` on a `deleted` dispute | true (m-2) |
| PROBE7 | two psql sessions insert audit rows concurrently | rows 2 and 3 share `prev_hash`; `verify_audit_chain()` = 3 (C-1) |
| PROBE8 | unique constraint on `user_corrections` | present (m-7 fails closed) |
| PROBE9 | tables with a `dispute_id` column | 19, versus 14 enumerated by `tablesForScope('dispute')` (M-6) |
| jsonb form | `'{"b":1,"aa":2,"m":{…}}'::jsonb::text` | `{"b": 1, "m": {…}, "aa": 2}` (M-2) |
| Vitest probe | `requirePurpose([withdrawn, granted])` | `ok: true` (M-1) |
| Vitest probe | manifest types for an Event and a Proposition | both `event_or_proposition` (M-5) |
| Baseline | A-030 smoke suite re-run on the review container before probing | 41/41 PASS |
| Scope | greps in §7; dependency diff; workflow diff | no violations |

Container `nyayos-review` (local, synthetic data) was removed after the probes. The temporary Vitest probe file was deleted and is not part of any commit.
