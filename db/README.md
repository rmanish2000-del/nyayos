# `db/` — NyayOS database migrations (NOT APPLIED TO ANY ENVIRONMENT)

| | |
|---|---|
| **Status** | **No NyayOS database exists.** Nothing in this directory has been applied to any environment. FA-001 permits staging builds only; FD-02 (hosting / India region) is undecided, so no staging database has been provisioned. The only execution so far was a throwaway local container (see *Tested how*). |
| **What this is** | The FM-A schema as append-only Postgres migrations: enums declared in full (CR-3), 39 tables (Scope Sheet §4), authorisation helpers `is_dispute_member` / `grant_allows` (SDAS §5.1, CR-2), single-writer server functions (A06/A07), hash-chained audit (§17), row-level security ENABLED and FORCED on every table with explicit grants and policies, and deletion allow-list registration in the same migration (BB2 §3.3). |
| **Twin** | `app/src/domain/` holds the same model in TypeScript with 79 unit tests. `scripts/db/schema-lint.mjs` proves the two agree on table names and that every table carries RLS, policies, grants and allow-list registration. |
| **Tested how** | Statically linted, and executed once on an **ephemeral local `postgres:16-alpine` container** with synthetic data during A-030: `0001` applied with `ON_ERROR_STOP` (exit 0) and `db/tests/smoke_0001.sql` passed 41/41 (RLS isolation, single-writer, consent locks, audit chain and tamper detection, allow-list). The container was destroyed afterwards; **no environment exists**. First environment execution must be a synthetic-data staging database, followed by the Scope Sheet §8.1 SEC subset. Any defect found there is fixed by a **new** migration, never by editing `0001`. |

## Migrations

| File | Content | Status |
|---|---|---|
| `0001_fma_foundation.sql` | FM-A foundation: 39 tables, RLS, helpers, single-writer functions, audit chain, deletion allow-list | Not applied to any environment |
| `0002_duplicate_lookup.sql` | Duplicate Detection V1 (A-036): index on `document_versions.sha256`, read-only SECURITY INVOKER `find_duplicate_versions(text)`, `duplicate_detection_mode = inform` | Not applied to any environment |
| `0003_export_staleness.sql` | Stale Output Detection V1 (A-037): read-only SECURITY INVOKER `export_staleness(uuid)` comparing manifest entries with current canonical versions (CURRENT / STALE / UNKNOWN). Rollback: `drop function if exists nyayos.export_staleness(uuid);` | Not applied to any environment |
| `0004_audit_chain_order.sql` | A-033-R (closes A-032 C-1): audit trigger assigns `seq` under the advisory lock so sequence order equals chain order; unique index on `audit_events.prev_hash` makes a fork impossible at any isolation level; USAGE on the sequence for the audit role. Rollback in the file header (reintroduces C-1) | Not applied to any environment |
| `0005_audit_contract_and_atomicity.sql` | A-038 (closes A-032 M-2, M-7): audit hash contract `nyayos-audit-v1` (`audit_canonical_v1`, `audit_row_hash_v1`; UTC timestamps, lowercase UUIDs, code-point-ordered metadata of strings, booleans and safe integers) shared with `app/src/domain/audit.ts`; server functions write their audit event in the same transaction via `audit_append_internal` (no client grant). Requires an empty `audit_events`. Rollback in the file header | Not applied to any environment |
| `0006_deletion_scope_graph.sql` | A-039 (closes A-032 M-6): explicit deletion graph `deletion_graph_v1()` (70 edges, every table decided; TS twin `DELETION_GRAPH`, parity enforced by schema-lint) and read-only `enumerate_deletion_scope(request)` classifying every record as purge candidate, retained audit metadata, retained legal hold, blocked by active reference, outside scope or configuration-controlled. No purge (D-032). Rollback in the file header | Not applied to any environment |
| `0007_deletion_purge_worker.sql` | A-040 (closes A-032 M-3, founder decision D-032): server-only purge worker `purge_deletion_request(request)` — SECURITY DEFINER, executable only by `nyayos_service_deletion`; consumes the A-039 enumeration as the requester (authority re-verified), refuses during the undo window, after undo and under legal hold, deletes only `purge_candidate` rows (children first, bounded to the request's tenant) after an orphan closure that keeps anything still referenced, writes a content-free tombstone and an audit event in the same transaction, and reruns idempotently. `document_versions` / `user_corrections` accept DELETE only inside an active purge; `audit_events`, `audit_anchors`, `deletion_ledger` stay immutable. No role holds a DELETE grant. Rollback in the file header | Not applied to any environment |
| `0008_dispute_status_authorization.sql` | A-042 (closes A-032 m-1): `nyayos_authenticated` loses UPDATE on `disputes.status` (keeps `title`, `category_label`); status follows the deletion workflow only, via trigger `deletion_requests_dispute_status` (dispute-scope request → `deletion_requested`; undo → `active` unless another request is open; undo audited as `deletion.undone` in the same transaction). Rollback in the file header | Not applied to any environment |

## Provider neutrality

Session context (`nyayos.principal_id`, `nyayos.request_id`) is read from connection settings set server-side on checkout (Architecture Deck slide 7). `nyayos.current_user_id()` falls back to `request.jwt.claim.sub` so a Supabase/PostgREST deployment works without change. No provider SDK is referenced.

## Rules

1. Migrations are append-only; corrections are new files (`0002_…`).
2. Every new table: `enable row level security`, `force row level security`, `revoke all … from public`, explicit grants, at least one policy, and a `deletion_allowlist` row, **in the same migration**. `scripts/db/schema-lint.mjs` fails otherwise (SEC-RLS-01, SEC-DEL-06).
3. Canonical §4.3 tables never receive an INSERT/UPDATE/DELETE grant for authenticated roles (AC-M1-03).
4. `audit_events`, `audit_anchors` and `deletion_ledger` are immutable for every role. `user_corrections` and `document_versions` are append-only by trigger and by grant; since `0007` (D-032) the only exception is DELETE inside an active purge by `purge_deletion_request()`. No role holds a DELETE grant on any table.
5. No table for sharing, grants, AI runs, chunks, derivatives, drafts, holds or authority corpus is created in FM-A (CR-1).

## Run the lint

```bash
node scripts/db/schema-lint.mjs
```

## Re-run the smoke suite locally (synthetic data, throwaway container)

```bash
docker run -d --name nyayos-migtest -e POSTGRES_HOST_AUTH_METHOD=trust postgres:16-alpine
```

Then copy `db/migrations/*.sql` and `db/tests/smoke_0001.sql` into the container, apply the migrations in order (`0001` … `0008`) with `psql -v ON_ERROR_STOP=1 -f`, run the smoke file the same way (every line prints `CHECK … PASS|FAIL`), and `docker rm -f nyayos-migtest`. Adversarial suites: `db/tests/audit_concurrency_matrix.sh <container>` (C-1: READ COMMITTED, REPEATABLE READ and SERIALIZABLE pairs plus a 10x5 parallel burst; run on a fresh container before the smoke suite, which deliberately tampers with the chain) and `db/tests/deletion_authz_0001.sql` (C-2: cross-tenant, cross-dispute, role, bypass and undo-window checks). A-038: `db/tests/audit_hash_vectors_v1.sql` checks the frozen vectors in `audit_hash_vectors_v1.json` (the same file Vitest checks); `db/tests/audit_atomicity_0001.sql` proves canonical writes and audit events commit or roll back together (fault injection); `db/tests/audit_interop_export.sql` regenerates the Postgres-written chain fixture that Vitest verifies. A-039: `db/tests/deletion_scope_0001.sql` (fresh database) proves enumeration completeness against a catalogue-driven oracle, isolation, fail-closed blocking, legal-hold and policy classification, and zero mutation. A-040: `db/tests/deletion_purge_0001.sql` (fresh database) proves the worker deletes exactly the A-039 purge candidates (whole-database snapshots before and after every purge), preserves blocked, configuration-controlled, audit and tombstone records, refuses undo-window, undone, legal-hold, cross-tenant and cross-dispute requests, reruns idempotently and leaves no orphan reference (independent catalogue-driven oracle); `db/tests/deletion_purge_concurrency.sh <container>` races two workers on one request under every isolation level (one purge, one tombstone, one audit event). A-042: `db/tests/dispute_status_0001.sql` (fresh database) proves no client can update dispute status directly, metadata edits are preserved, and status moves only with the deletion workflow (request, undo, purge), audited; run against `0001`–`0007` it reproduces m-1. This is a local developer check, not a deployment; never point it at a shared database.
