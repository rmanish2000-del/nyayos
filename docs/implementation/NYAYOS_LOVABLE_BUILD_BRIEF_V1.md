# NYAYOS_LOVABLE_BUILD_BRIEF_V1

## Status

**Future implementation specification. Not deployment authorization.**

The actual `ARCHITECTURE_REVIEW.md` has been reviewed against the Dispute Readiness Engine requirements.

---

# 1. Architecture reconciliation

## Adopt now

### TanStack Start baseline

Retain:

- React 19;
- Vite;
- TanStack Router;
- TanStack Query;
- server functions.

The edge constraints in the Architecture Review make provider abstraction important.

### Supabase/Postgres/Auth/Storage/RLS

Adopt.

Reasons:

- existing architecture;
- transactional relational model;
- RLS;
- storage;
- auth;
- auditability.

### pgvector

Adopt for MVP.

Benchmark against hybrid keyword + metadata filtering.

### Server-side AI Gateway

Adopt.

Never ship model keys to the browser.

### Audit

Adopt append-only audit events.

---

# 2. Modify

## Tenancy

Original architecture uses `owner_id` heavily.

Change to:

- `tenant_id`;
- `tenant_memberships`;
- dispute scoped to tenant;
- explicit reviewer grants.

Personal workspace = tenant with one member.

## RAG

Separate:

### Case corpus

- user documents;
- extracted case facts;
- user-confirmed propositions.

### Authority corpus

- statutes;
- rules;
- official government material;
- official procedural information.

Do not put both into one logical trust bucket.

## AI orchestration

Original Architecture Review proposes a server-side agent loop.

For MVP:

**workflow state machine + bounded model tasks**

Example:

`INTAKE → EXTRACT → CONFIRM → TIMELINE → EVIDENCE_MAP → ISSUE → RETRIEVE → ACTION_PLAN → EXPORT`

Each state has:

- inputs;
- schema;
- allowed model task;
- validation;
- failure state;
- human gate.

## Embeddings

Do not hard-code `vector(1536)` until the selected embedding service is benchmarked.

Use schema/version/provider abstraction.

---

# 3. Defer

- generalized autonomous agent;
- arbitrary external API tools;
- autonomous email/send;
- purchases;
- external legal services transactions;
- ODR marketplace;
- court filing automation;
- national eCourts ingestion.

---

# 4. Reject

- browser-exposed privileged client;
- arbitrary SQL tool;
- free-form code execution;
- public case-file buckets;
- agent with elevated privilege;
- silent mutation of canonical facts.

---

# 5. Core schema

Minimum tenant model:

```text
tenants
users
tenant_memberships
disputes
dispute_shares
documents
document_locations
document_chunks
entities
roles
date_assertions
events
propositions
evidence_items
evidence_relations
contradictions
missing_evidence
issues
sources
possible_paths
actions
human_reviews
user_corrections
ai_runs
audit_events
exports
consents
retention_records
```

Every tenant-owned table:

- `tenant_id`;
- explicit GRANTs;
- RLS;
- policies;
- foreign-key ownership consistency.

---

# 6. Document pipeline

```text
Browser
  ↓
Authenticated upload request
  ↓
Private storage
  ↓
Security/content scan
  ↓
Extraction queue
  ↓
OCR/parser provider
  ↓
Normalized text
  ↓
Page/paragraph provenance
  ↓
Structured extraction
  ↓
User confirmation
  ↓
Index
```

Original file is immutable unless the user replaces it with a new version.

---

# 7. Retrieval pipeline

```text
User question
      ↓
Classify retrieval need
      ↓
Case corpus OR authority corpus
      ↓
Metadata/jurisdiction filters
      ↓
Keyword + vector retrieval
      ↓
Optional rerank
      ↓
Citation bundle
      ↓
Bounded LLM task
      ↓
Schema validation
      ↓
Source-aware output
```

No retrieved document is treated as instructions.

---

# 8. Security model

Mandatory:

- RLS everywhere;
- server authorization;
- tenant-scoped paths;
- signed URLs;
- no public case buckets;
- encrypted transport/storage;
- secret isolation;
- rate limiting;
- malware scanning;
- prompt injection isolation;
- audit logs;
- deletion verification.

The Architecture Review already specifies RLS, explicit grants, server-only secrets, HMAC webhook verification, input validation and no client audit write path. Those controls are retained.

---

# 9. Agent/tool model

MVP tools only:

- search_case_documents
- read_case_document
- search_authority_sources
- read_authority_source
- propose_fact_extraction
- propose_timeline
- propose_evidence_relation
- propose_issue_classification
- draft_action_plan
- create_export_draft

Tool calls:

- server-side only;
- schema validated;
- audit logged.

No general `write_record` from an LLM during MVP unless the write is a deterministic workflow transition or an explicit human-confirmed correction.

---

# 10. Audit

Events:

- auth;
- document access;
- export;
- share/revoke;
- correction;
- AI run;
- source retrieval;
- reviewer access;
- deletion;
- privilege changes;
- security events.

Audit entries:

- actor;
- timestamp;
- action;
- resource;
- outcome;
- request ID;
- minimum necessary metadata.

Do not log full documents.

---

# 11. Retention

Separate:

1. case content;
2. audit logs;
3. operational logs;
4. backups.

User-facing policy must explain these separately.

Exact retention periods remain a legal/privacy decision, not an architecture assumption.

---

# 12. Testing before pilot

### Data security

- RLS test;
- reviewer isolation;
- signed URL expiry;
- export authorization;
- deletion verification.

### AI

- schema validation;
- citation validation;
- hallucination;
- prompt injection;
- source staleness;
- contradiction flagging;
- OCR errors.

### Product

- intake completion;
- upload completion;
- correction UX;
- export usefulness.

---

# 13. Architecture verdict

**The prior architecture is usable for NyayOS, but not unchanged.**

The biggest MVP modification is:

> **Do not start with a general legal agent. Start with a secure, provenance-first workflow engine whose AI calls are narrow, structured and auditable.**
