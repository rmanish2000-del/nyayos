# ARCHITECTURE REVIEW

**Document type:** Architecture-only review (no implementation, no deployment)
**Stack baseline:** TanStack Start v1 (React 19, Vite 7) on an edge runtime, Tailwind CSS v4, Lovable Cloud (Supabase: Postgres + Auth + Storage + RLS)

---

## 1. Technical Architecture

### 1.1 System overview

```text
┌────────────────────────────────────────────────────────────┐
│                         Client (Browser)                    │
│   React 19 + TanStack Router (SSR/SSG) + TanStack Query     │
└───────────────┬────────────────────────────────────────────┘
                │  typed RPC (createServerFn) / HTTP
┌───────────────▼────────────────────────────────────────────┐
│              Edge Server (Cloudflare-style Worker)          │
│  - SSR rendering & route loaders                            │
│  - Server functions (app-internal logic, createServerFn)    │
│  - Public API routes (/api/public/*: webhooks, cron)        │
│  - Auth middleware (session verification, role checks)      │
└──────┬──────────────────┬─────────────────┬────────────────┘
       │                  │                 │
┌──────▼──────┐   ┌───────▼───────┐  ┌──────▼────────┐
│  Supabase   │   │  AI Gateway   │  │ External APIs │
│  Postgres   │   │  (LLM/RAG)    │  │ (webhooks in) │
│  Auth/Store │   └───────────────┘  └───────────────┘
└─────────────┘
```

### 1.2 Layer responsibilities

| Layer | Responsibility | Rules |
|---|---|---|
| **Presentation** | Routes under `src/routes/`, components, hooks | Never imports server-only modules; reads data via loaders/`useSuspenseQuery` |
| **Data access (client)** | Generated Supabase browser client | Subject to RLS; anon/publishable key only |
| **Server functions** | `createServerFn` typed RPC, `*.functions.ts` in client-safe paths | Auth via middleware; privileged clients imported lazily inside handlers |
| **Public HTTP** | `src/routes/api/public/*` | Bypasses site auth — must verify caller (signatures, secrets) in-handler |
| **Database** | Postgres with RLS, migrations, seed inserts | Every `CREATE TABLE` paired with explicit `GRANT`s + RLS policies |
| **AI/LLM** | AI Gateway calls from server functions only | Keys read from env inside handlers; never shipped to client |

### 1.3 Request flows

1. **Page load (SSR):** Route loader → `queryClient.ensureQueryData` → server function or public read → hydrated HTML.
2. **Mutation:** Component event → server function (auth middleware) → Zod input validation → Supabase (RLS as user, or admin client after server-side role verification) → invalidate queries.
3. **Webhook (inbound):** `POST /api/public/webhook` → HMAC signature verification → Zod parse → process → `200 ok`.

### 1.4 Key constraints

- Edge runtime: no `child_process`, no native binaries, no persistent filesystem; pure-JS/WASM dependencies only.
- `process.env.*` is server-only and read inside handlers; browser config uses `import.meta.env.VITE_*`.
- Protected server functions never run in public-route loaders (prerender has no session).
- TanStack Router is fixed — no `react-router-dom`.

---

## 2. Supabase Architecture

### 2.1 Schema design principles

- One table per domain entity; `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at` maintained by trigger.
- Foreign keys with explicit `on delete` behavior (`cascade` for owned children, `restrict` for referenced masters).
- **Roles live in a dedicated table, never on profiles/users:**

```text
app_role enum: ('admin', 'moderator', 'user')

user_roles
  id        uuid pk
  user_id   uuid -> auth.users(id) on delete cascade
  role      app_role
  unique (user_id, role)
```

- Role checks via a `SECURITY DEFINER` function `public.has_role(_user_id, _role)` to avoid recursive RLS.

### 2.2 Access model (mandatory order per table)

```text
1. CREATE TABLE public.<name> (...)
2. GRANT SELECT, INSERT, UPDATE, DELETE ON public.<name> TO authenticated;
   GRANT ALL ON public.<name> TO service_role;
   -- GRANT SELECT ... TO anon;  only when an anon-read policy exists
3. ALTER TABLE public.<name> ENABLE ROW LEVEL SECURITY;
4. CREATE POLICY ...  (scoped to auth.uid() or has_role(...))
```

### 2.3 Client tiers

| Client | Context | Privilege |
|---|---|---|
| Browser client | React components | RLS as the signed-in user (or anon) |
| `context.supabase` | Authenticated server functions | RLS as the calling user |
| Server publishable client | Public reads in handlers | `anon` grants only, no session persistence |
| `supabaseAdmin` | Privileged work only | Bypasses RLS — load lazily in-handler **after** verifying the caller's role through `context.supabase` |

### 2.4 Auth

- Lovable Cloud managed auth: email/password, optional Google/Apple sign-in.
- Session transport: bearer token attached by client-side function middleware; server functions verify via `requireSupabaseAuth`.
- Authenticated UI subtree gated by `_authenticated/route.tsx` redirecting to `/auth`.

### 2.5 Storage

- Private buckets by default; signed URLs for time-boxed access; public buckets only for true public assets.
- Path convention: `<bucket>/<user_id>/<resource>/<filename>` so storage RLS policies can scope by owner.

### 2.6 Migrations & seed data

- Schema + literal `INSERT` seed rows in the same migration when the first screen must show demo data. Never seed via page load or server function.
- Migrations are append-only; corrections are new migrations.

---

## 3. RAG Architecture

### 3.1 Pipeline overview

```text
INGESTION                                RETRIEVAL (per query)
─────────────                            ─────────────────────
Source docs ──► chunk ──► embed ──►      Query ──► embed ──► vector search
   (storage/       │        │                │        │       (pgvector,
    uploads)       │        │                │        │        top-k + filters)
                   ▼        ▼                ▼        ▼              │
              documents   document_chunks  query_embedding          ▼
              (metadata)  (text + vector)                     rerank (optional)
                                                                │
                                                                ▼
                                              Prompt assembly (system +
                                              retrieved chunks + citations)
                                                                │
                                                                ▼
                                              LLM call (AI Gateway, server fn)
                                                                │
                                                                ▼
                                              Answer with source references
```

### 3.2 Data model

```text
documents
  id uuid pk
  owner_id uuid -> auth.users(id)        -- tenant scoping
  title text, source_uri text, mime_type text
  status text ('pending','indexed','failed')
  created_at timestamptz

document_chunks
  id uuid pk
  document_id uuid -> documents(id) on delete cascade
  chunk_index int, content text
  embedding vector(1536)                 -- pgvector
  metadata jsonb
```

- IVFFlat/HNSW index on `embedding`; RPC function `match_document_chunks(query_embedding, match_count, filter_owner)` as a `SECURITY DEFINER` or RLS-respecting function.
- RLS: chunks inherit visibility from parent `documents` (policy joins on `document_id`).

### 3.3 Design decisions

| Decision | Choice | Rationale |
|---|---|---|
| Vector store | pgvector in Supabase | One system of record; RLS applies to retrieval |
| Chunking | 500–1,000 tokens, 10–15% overlap | Balances recall vs. context bloat |
| Embedding + LLM calls | Server functions only | Protects keys; enables logging/cost control |
| Tenant isolation | `owner_id` filter **and** RLS | Defense in depth — a missed filter can't leak data |
| Freshness | Re-embed on document update; status field drives UI | Stale index never silently served |
| Grounding | Always return chunk citations; refuse when no chunks pass threshold | Limits hallucination |

### 3.4 Failure modes & handling

- Embedding provider failure → document stays `pending`, retry with backoff, surface `failed` state.
- Empty retrieval → explicit "I don't have that in your documents" response, not a guessed answer.
- Context overflow → top-k capped; chunk budget enforced before prompt assembly.

---

## 4. Agent Architecture

### 4.1 Agent loop (server-side, tool-using)

```text
User message
   │
   ▼
┌────────────────────────────────────────────────┐
│ Orchestrator (server function)                 │
│  1. Load conversation + system policy          │
│  2. Call LLM with tool catalog                 │
│  3. If tool_call: validate args (Zod) ──► run  │
│     tool (allowed, server-side) ──► append     │
│     result ──► loop (max N steps)              │
│  4. If final answer: persist + return          │
└────────────────────────────────────────────────┘
   │
   ▼
Tools: search_documents (RAG) │ read_table (RLS-scoped) │
       write_record (validated) │ call_external_api (allow-listed)
```

### 4.2 Core principles

1. **Agents never hold elevated privilege.** Tool executions run as the calling user (RLS applies). Privileged operations require an explicit human-confirmed step and server-side role check.
2. **Tool catalog is a closed set.** Each tool: name, Zod arg schema, server implementation, audit hook. No free-form code execution, no arbitrary SQL.
3. **Step and cost limits.** Max tool-call iterations per turn, token budgets, and per-user rate limits enforced in the orchestrator.
4. **Human-in-the-loop for mutations.** Writes, sends, and purchases require a confirmation token echoed back from the UI.
5. **Prompt-injection posture.** Retrieved documents and tool outputs are *data*, never instructions; system policy is restated after tool results; external content is wrapped in explicit delimiters.
6. **State.** Conversation and agent run history persisted (`conversations`, `messages`, `agent_runs`, `tool_invocations`) so runs are resumable, inspectable, and auditable.

### 4.3 Data model additions

```text
conversations (id, owner_id, title, created_at)
messages      (id, conversation_id -> cascade, role, content, created_at)
agent_runs    (id, conversation_id, status, step_count, started_at, ended_at)
tool_invocations
  (id, run_id, tool_name, args jsonb, result jsonb,
   status, duration_ms, created_at)
```

All tables: GRANTs + RLS scoped to `owner_id` (admin read-all via `has_role`).

---

## 5. Audit Architecture

### 5.1 Goals

- Answer "who did what, when, from where, with what result" for every security-relevant event.
- Tamper-evidence: audit records are append-only.

### 5.2 Event taxonomy

| Category | Examples |
|---|---|
| Auth | sign-in, sign-out, failed login, password reset, token refresh anomaly |
| Data access | admin reads, exports, bulk selects |
| Data mutation | inserts/updates/deletes on sensitive tables |
| Privilege | role grants/revokes, admin-client usage |
| Agent | run start/end, every tool invocation, confirmation grants |
| Integration | webhook receipt (valid/invalid signature), external API calls |
| RAG | document ingest, re-embed, retrieval queries (metadata, not content where sensitive) |

### 5.3 Implementation approach

```text
audit_events
  id bigint generated always as identity
  occurred_at timestamptz default now()
  actor_id uuid null          -- null for system/webhook actors
  actor_type text             -- 'user' | 'system' | 'webhook'
  action text                 -- 'auth.sign_in', 'agent.tool_call', ...
  resource_type text null
  resource_id text null
  outcome text                -- 'success' | 'denied' | 'error'
  metadata jsonb              -- ip hash, user-agent, request id
```

- **Writers:** a single `log_audit_event(...)` server helper (service-role) used by server functions and webhook handlers. No client write path.
- **RLS:** `SELECT` for admins only (`has_role(auth.uid(),'admin')`); **no `UPDATE`/`DELETE` grants for any role** — append-only by grant design.
- **DB triggers** on sensitive tables (e.g., `user_roles`) to capture mutations independent of app code.
- **Request correlation:** a `request_id` generated per server function call, propagated into audit rows and AI Gateway logs.

### 5.4 Retention & review

- Hot retention in Postgres (e.g., 90 days); periodic export to storage for long-term retention.
- Scheduled review queries: privilege changes, repeated denials, unusual export volume.
- Alert hooks (webhook out) on high-severity events (role grants, invalid webhook signatures above threshold).

---

## 6. Security Architecture

### 6.1 Threat model summary

| Threat | Primary controls |
|---|---|
| Unauthorized data access | RLS on every table; least-privilege GRANTs; anon access opt-in only |
| Privilege escalation | Roles in `user_roles` + `has_role` SECURITY DEFINER; no client-side admin flags; admin client never reachable from the browser bundle |
| Injection (SQL/prompt) | Parameterized queries via Supabase client; Zod validation at every boundary; RAG content treated as untrusted data |
| Webhook forgery | HMAC signature verification with `timingSafeEqual` before any processing |
| Secret leakage | Secrets in env only, read inside handlers; publishable keys only in client; no secrets in logs or audit metadata |
| Session abuse | Server-verified sessions on every protected function; short token lifetimes; `_authenticated` route gate |
| Data exfiltration via agent | Closed tool catalog, RLS-scoped tool execution, mutation confirmation, per-user rate limits |
| XSS / client injection | React escaping by default; no `dangerouslySetInnerHTML`; strict CSP at the edge |

### 6.2 Boundary rules (non-negotiable)

1. Every public-schema table: GRANTs + RLS enabled + explicit policies, in the same migration.
2. Admin/privileged logic: dynamic import of the admin client **inside** the handler, after role verification via `context.supabase`.
3. No protected server function in a public route loader.
4. `/api/public/*` handlers verify their caller — the prefix bypasses site auth by design.
5. Zod-parse all external input: webhook bodies, tool arguments, form payloads.
6. Never log secrets, tokens, or full user PII; hash IPs in audit metadata.

### 6.3 Verification regime

- Run the backend security scan (exposed data, missing RLS, misconfigurations) after every schema change and before any go-live.
- Dependency vulnerability scan after dependency changes.
- Periodic manual review: new tables vs. policy coverage; new `/api/public` routes vs. signature checks.

---

## Appendix A — Decisions log

| # | Decision | Status |
|---|---|---|
| 1 | Lovable Cloud (Supabase) as single backend | Adopted |
| 2 | pgvector for RAG instead of external vector DB | Adopted |
| 3 | Server-side agent orchestration, closed tool set | Adopted |
| 4 | Append-only audit table, admin-only read | Adopted |
| 5 | No deployment at this stage — architecture only | Constraint |

## Appendix B — Open questions

1. Expected tenant model: single-tenant per user vs. multi-user organizations (affects all `owner_id` scoping).
2. Audit retention period and any compliance regime (SOC 2, GDPR) that would raise requirements.
3. RAG corpus size estimate — determines whether pgvector index strategy (IVFFlat vs. HNSW) needs revisiting.
4. Whether agent mutations beyond drafts are in scope for v1, or confirmation-gated only.
