# NYAYOS_CONTINUITY_HANDOFF_V1

## Current project state

NyayOS is **pre-build**.

The supplied project brief states:

- GitHub repository empty;
- local workspace empty;
- no code;
- no schema;
- no deployment;
- do not assume implementation;
- no code or deployment in the current research assignment.

## Current product

### LOCKED FEATURE

**NyayOS Dispute Readiness Engine**

### Core journey

**What happened?  
→ Facts  
→ Parties  
→ Timeline  
→ Evidence  
→ Evidence-to-fact mapping  
→ Missing evidence  
→ Contradictions  
→ Issue  
→ Verified information  
→ Possible paths  
→ Action plan  
→ Human review  
→ Export**

## Commercial hypothesis

### Primary

Small-business / FPO / professional commercial disputes, especially vendor/payment/service-performance issues.

### Secondary

Consumer disputes as sandbox/Phase 2.

### Private

Founder-controlled criminal-case document organization.

## What changed after receiving actual Architecture Review

The earlier package treated the architecture review as missing. It is now available.

Final reconciliation:

| Architecture decision | Classification | Final MVP position |
|---|---|---|
| TanStack Start + React/Vite | Adopt | Keep baseline |
| Edge server functions | Adopt | Keep |
| Supabase Postgres/Auth/Storage/RLS | Adopt | Keep |
| Dedicated role table | Adopt | Keep; extend to memberships |
| Private storage/signed URLs | Adopt | Keep |
| pgvector | Adopt | Keep, subject to benchmark |
| RAG with citations | Adopt | Keep |
| Server-side LLM calls | Adopt | Keep |
| Open-ended agent orchestration | **Modify** | Deterministic workflow + bounded AI |
| Closed tool catalog | Adopt | Future-compatible; narrow MVP tool set |
| Mutation confirmation | Adopt | Keep |
| Append-only audit | Adopt | Keep |
| 90-day hot audit retention | **Provisional** | Engineering default only; legal review required |
| Single-user `owner_id` tenancy | **Modify** | Tenant + membership model |
| Fixed embedding dimension 1536 | **Modify** | Provider/version configurable |
| External API calls | **Defer** | Only approved ingestion/retrieval services |
| Autonomous mutations | **Reject** | Outside MVP |

## Required source gap now resolved

`ARCHITECTURE_REVIEW.md` is available and has been reconciled.

## Remaining evidence gaps

1. Real user interviews.
2. WTP.
3. Exact launch category boundary.
4. Privacy/legal counsel review.
5. OCR benchmark.
6. Retrieval benchmark.
7. Pilot performance.

## Recommended next assignment

### Specialist mode

**NyayOS Security + Data Architecture Review — research/specification only**

### Inputs

- Master Product Spec V1;
- actual Architecture Review;
- Risk Register V1;
- Real Case Evaluation Protocol.

### Outputs

- tenant/RLS design;
- threat model;
- data classification;
- storage/deletion lifecycle;
- RAG trust boundary;
- OCR pipeline security;
- audit schema;
- backup/deletion model;
- security test cases.

### Do not start yet

- public deployment;
- public beta;
- open-ended AI agent;
- court integrations;
- lawyer marketplace.
