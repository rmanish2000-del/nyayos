# `db/` — NyayOS database migrations (NOT APPLIED TO ANY ENVIRONMENT)

| | |
|---|---|
| **Status** | **No NyayOS database exists.** Nothing in this directory has been applied to any environment. FA-001 permits staging builds only; FD-02 (hosting / India region) is undecided, so no staging database has been provisioned. The only execution so far was a throwaway local container (see *Tested how*). |
| **What this is** | The FM-A schema as append-only Postgres migrations: enums declared in full (CR-3), 39 tables (Scope Sheet §4), authorisation helpers `is_dispute_member` / `grant_allows` (SDAS §5.1, CR-2), single-writer server functions (A06/A07), hash-chained audit (§17), row-level security ENABLED and FORCED on every table with explicit grants and policies, and deletion allow-list registration in the same migration (BB2 §3.3). |
| **Twin** | `app/src/domain/` holds the same model in TypeScript with 79 unit tests. `scripts/db/schema-lint.mjs` proves the two agree on table names and that every table carries RLS, policies, grants and allow-list registration. |
| **Tested how** | Statically linted, and executed once on an **ephemeral local `postgres:16-alpine` container** with synthetic data during A-030: `0001` applied with `ON_ERROR_STOP` (exit 0) and `db/tests/smoke_0001.sql` passed 41/41 (RLS isolation, single-writer, consent locks, audit chain and tamper detection, allow-list). The container was destroyed afterwards; **no environment exists**. First environment execution must be a synthetic-data staging database, followed by the Scope Sheet §8.1 SEC subset. Any defect found there is fixed by a **new** migration, never by editing `0001`. |

## Provider neutrality

Session context (`nyayos.principal_id`, `nyayos.request_id`) is read from connection settings set server-side on checkout (Architecture Deck slide 7). `nyayos.current_user_id()` falls back to `request.jwt.claim.sub` so a Supabase/PostgREST deployment works without change. No provider SDK is referenced.

## Rules

1. Migrations are append-only; corrections are new files (`0002_…`).
2. Every new table: `enable row level security`, `force row level security`, `revoke all … from public`, explicit grants, at least one policy, and a `deletion_allowlist` row, **in the same migration**. `scripts/db/schema-lint.mjs` fails otherwise (SEC-RLS-01, SEC-DEL-06).
3. Canonical §4.3 tables never receive an INSERT/UPDATE/DELETE grant for authenticated roles (AC-M1-03).
4. `audit_events`, `user_corrections`, `document_versions`, `deletion_ledger` are append-only by trigger and by grant.
5. No table for sharing, grants, AI runs, chunks, derivatives, drafts, holds or authority corpus is created in FM-A (CR-1).

## Run the lint

```bash
node scripts/db/schema-lint.mjs
```

## Re-run the smoke suite locally (synthetic data, throwaway container)

```bash
docker run -d --name nyayos-migtest -e POSTGRES_HOST_AUTH_METHOD=trust postgres:16-alpine
```

Then copy `db/migrations/0001_fma_foundation.sql` and `db/tests/smoke_0001.sql` into the container, apply the migration with `psql -v ON_ERROR_STOP=1 -f`, run the smoke file the same way (every line prints `CHECK … PASS|FAIL`), and `docker rm -f nyayos-migtest`. This is a local developer check, not a deployment; never point it at a shared database.
