/**
 * Deletion lifecycle (Scope Sheet §4.6, F17, A23–A26; SDAS §10; Architecture
 * Deck slide 15; Counsel Brief OL-02/OL-03).
 *
 *   requested ─undo→ undone
 *   requested ─window closes→ locked ─worker→ purging ─→ purged ─operator→ verified | incomplete
 *                                                      └─→ incomplete (records kept: blocked or referenced; A-040)
 *   incomplete ─remediate→ locked
 *
 * Honest status: "requested" and "completed" are never conflated; an incomplete
 * purge is shown as in progress, never as complete (AC-M6-04). Backup expiry is
 * asynchronous and shown as a date, not as "deleted".
 *
 * `DeletionTombstone` is the Deck's name for a `deletion_ledger` row. Per the
 * Counsel Brief OL-03 interim path the tombstone carries NO content hash — only
 * scope type, scope id and completion time.
 */

import { z } from "zod";

import type { ProvConfig } from "./config";
import { Id, type RequestContext, isService, isUser } from "./context";
import { DELETION_SCOPE_TYPES, DELETION_STATES, type DeletionState } from "./enums";
import { DELETION_ALLOWLIST, FMA_TABLE_NAMES } from "./tables";

export const DeletionRequest = z.object({
  id: Id,
  tenantId: Id,
  scopeType: z.enum(DELETION_SCOPE_TYPES),
  scopeId: Id,
  requestedBy: Id,
  state: z.enum(DELETION_STATES),
  undoUntil: z.string().datetime(),
  createdAt: z.string().datetime(),
  lockedAt: z.string().datetime().nullable(),
  purgedAt: z.string().datetime().nullable(),
});
export type DeletionRequest = z.infer<typeof DeletionRequest>;

/** Deletion tombstone. Content-free by design (OL-03 interim): no hash, no label, no filename. */
export const DeletionLedgerEntry = z
  .object({
    id: Id,
    tenantId: Id,
    scopeType: z.enum(DELETION_SCOPE_TYPES),
    scopeId: Id,
    completedAt: z.string().datetime(),
  })
  .strict();
export type DeletionLedgerEntry = z.infer<typeof DeletionLedgerEntry>;
export type DeletionTombstone = DeletionLedgerEntry;

export const RetentionRecord = z.object({
  objectType: z.string().min(1),
  objectId: Id,
  retentionPolicyVersion: z.string().min(1),
  deletionRequestedAt: z.string().datetime(),
  deletionCompletedAt: z.string().datetime().nullable(),
  /** Structured checklist result recorded by the operator (A25). */
  verification: z
    .object({
      result: z.enum(["pass", "incomplete"]),
      checklist: z.array(z.object({ store: z.string().min(1), cleared: z.boolean() })),
      operatorId: Id,
      recordedAt: z.string().datetime(),
    })
    .nullable(),
});
export type RetentionRecord = z.infer<typeof RetentionRecord>;

export class DeletionScopeError extends Error {
  readonly code:
    "cross_tenant" | "not_dispute_owner" | "not_document_editor" | "not_self" | "dispute_required";
  constructor(code: DeletionScopeError["code"]) {
    super(`deletion request refused: ${code}`);
    this.name = "DeletionScopeError";
    this.code = code;
  }
}

/**
 * Ownership of the scope is verified from the server-built context (A-033 C-2): a dispute may be
 * deleted only by its owner, a document only by an editor of its dispute (pass `disputeId`), and an
 * account only by itself. The undo window always comes from configuration.
 */
export function newDeletionRequest(
  ctx: RequestContext,
  input: {
    id: string;
    tenantId: string;
    scopeType: DeletionRequest["scopeType"];
    scopeId: string;
    /** Required for document scope: the dispute the document belongs to. */
    disputeId?: string;
  },
  config: ProvConfig,
): DeletionRequest {
  if (!isUser(ctx.principal)) throw new Error("deletion requests are user-initiated");
  const p = ctx.principal;
  if (p.tenantId !== input.tenantId) throw new DeletionScopeError("cross_tenant");
  const roleOf = (disputeId: string) =>
    p.disputeMemberships.find((m) => m.disputeId === disputeId)?.role;
  switch (input.scopeType) {
    case "dispute":
      if (roleOf(input.scopeId) !== "dispute_owner")
        throw new DeletionScopeError("not_dispute_owner");
      break;
    case "document": {
      if (!input.disputeId) throw new DeletionScopeError("dispute_required");
      const role = roleOf(input.disputeId);
      if (role !== "dispute_owner" && role !== "dispute_editor")
        throw new DeletionScopeError("not_document_editor");
      break;
    }
    case "account":
      if (input.scopeId !== p.userId) throw new DeletionScopeError("not_self");
      break;
    default:
      throw new DeletionScopeError("not_self");
  }
  const undoUntil = new Date(
    new Date(ctx.now).getTime() + config.deletion_undo_window_days * 86_400_000,
  ).toISOString();
  const { disputeId: _disputeId, ...row } = input;
  return DeletionRequest.parse({
    ...row,
    requestedBy: p.userId,
    state: "requested",
    undoUntil,
    createdAt: ctx.now,
    lockedAt: null,
    purgedAt: null,
  });
}

export type DeletionEvent =
  | { type: "undo" }
  | { type: "window_closed" }
  | { type: "purge_started" }
  | { type: "purge_completed" }
  | { type: "purge_incomplete" }
  | { type: "verified"; result: "pass" | "incomplete" }
  | { type: "remediated" };

export type DeletionTransition =
  | { ok: true; request: DeletionRequest; ledger: DeletionLedgerEntry | null }
  | {
      ok: false;
      code:
        | "illegal_transition"
        | "undo_window_closed"
        | "service_identity_required"
        | "operator_required"
        | "user_required";
    };

export function transitionDeletion(
  ctx: RequestContext,
  request: DeletionRequest,
  event: DeletionEvent,
  ledgerId?: string,
): DeletionTransition {
  const s = request.state;
  const set = (state: DeletionState, patch: Partial<DeletionRequest> = {}): DeletionRequest => ({
    ...request,
    ...patch,
    state,
  });
  switch (event.type) {
    case "undo":
      if (!isUser(ctx.principal)) return { ok: false, code: "user_required" };
      if (s !== "requested") return { ok: false, code: "illegal_transition" };
      if (ctx.now > request.undoUntil) return { ok: false, code: "undo_window_closed" };
      return { ok: true, request: set("undone"), ledger: null };
    case "window_closed":
      if (s !== "requested") return { ok: false, code: "illegal_transition" };
      if (ctx.now < request.undoUntil) return { ok: false, code: "illegal_transition" };
      return { ok: true, request: set("locked", { lockedAt: ctx.now }), ledger: null };
    case "purge_started":
      if (!isService(ctx.principal) || ctx.principal.serviceIdentity !== "deletion_worker") {
        return { ok: false, code: "service_identity_required" };
      }
      return s === "locked"
        ? { ok: true, request: set("purging"), ledger: null }
        : { ok: false, code: "illegal_transition" };
    case "purge_completed": {
      if (!isService(ctx.principal) || ctx.principal.serviceIdentity !== "deletion_worker") {
        return { ok: false, code: "service_identity_required" };
      }
      if (s !== "purging") return { ok: false, code: "illegal_transition" };
      if (!ledgerId) throw new Error("purge_completed requires a ledger id");
      const ledger = DeletionLedgerEntry.parse({
        id: ledgerId,
        tenantId: request.tenantId,
        scopeType: request.scopeType,
        scopeId: request.scopeId,
        completedAt: ctx.now,
      });
      return { ok: true, request: set("purged", { purgedAt: ctx.now }), ledger };
    }
    case "purge_incomplete":
      // A-040: some records were kept (blocked, configuration-controlled or still referenced). No
      // tombstone is written and the request is never shown as complete; a later run retries.
      if (!isService(ctx.principal) || ctx.principal.serviceIdentity !== "deletion_worker") {
        return { ok: false, code: "service_identity_required" };
      }
      return s === "purging"
        ? { ok: true, request: set("incomplete"), ledger: null }
        : { ok: false, code: "illegal_transition" };
    case "verified":
      if (!isUser(ctx.principal) || !ctx.principal.platformRoles.includes("platform_security")) {
        return { ok: false, code: "operator_required" };
      }
      if (s !== "purged") return { ok: false, code: "illegal_transition" };
      return {
        ok: true,
        request: set(event.result === "pass" ? "verified" : "incomplete"),
        ledger: null,
      };
    case "remediated":
      return s === "incomplete"
        ? { ok: true, request: set("locked", { lockedAt: ctx.now }), ledger: null }
        : { ok: false, code: "illegal_transition" };
    default:
      return { ok: false, code: "illegal_transition" };
  }
}

// ---------------------------------------------------------------------------
// Reference check (Deck G5) — policy is configuration, see config.ts
// ---------------------------------------------------------------------------

export interface CanonicalReference {
  readonly targetType: string;
  readonly targetId: string;
}

export function referenceCheck(
  referencesToScope: readonly CanonicalReference[],
  config: ProvConfig,
):
  | { ok: true; cascade: CanonicalReference[] }
  | { ok: false; code: "blocked_by_references"; references: CanonicalReference[] } {
  if (referencesToScope.length === 0) return { ok: true, cascade: [] };
  return config.document_reference_policy === "block"
    ? { ok: false, code: "blocked_by_references", references: [...referencesToScope] }
    : { ok: true, cascade: [...referencesToScope] };
}

// ---------------------------------------------------------------------------
// Honest user-facing status (U18, A26, SEC-DEL-07)
// ---------------------------------------------------------------------------

export interface DeletionStatusView {
  readonly phase:
    "requested" | "undone" | "locked" | "in_progress" | "completed_active_systems" | "verified";
  readonly undoUntil: string | null;
  readonly activeSystemsCompletedAt: string | null;
  readonly backupExpiryDate: string;
  readonly isComplete: boolean;
  readonly messageKey:
    | "deletion.requested"
    | "deletion.undone"
    | "deletion.locked"
    | "deletion.in_progress"
    | "deletion.completed_active_systems"
    | "deletion.verified";
}

export function deletionStatus(request: DeletionRequest, config: ProvConfig): DeletionStatusView {
  const base = request.purgedAt ?? request.lockedAt ?? request.createdAt;
  const backupExpiryDate = new Date(
    new Date(base).getTime() + config.backup_rotation_days * 86_400_000,
  ).toISOString();
  switch (request.state) {
    case "requested":
      return view(
        "requested",
        request.undoUntil,
        null,
        backupExpiryDate,
        false,
        "deletion.requested",
      );
    case "undone":
      return view("undone", null, null, backupExpiryDate, false, "deletion.undone");
    case "locked":
      return view("locked", null, null, backupExpiryDate, false, "deletion.locked");
    case "purging":
    case "incomplete": // never shown as complete (AC-M6-04)
      return view("in_progress", null, null, backupExpiryDate, false, "deletion.in_progress");
    case "purged":
      return view(
        "completed_active_systems",
        null,
        request.purgedAt,
        backupExpiryDate,
        false,
        "deletion.completed_active_systems",
      );
    case "verified":
      return view("verified", null, request.purgedAt, backupExpiryDate, true, "deletion.verified");
    default:
      return view("in_progress", null, null, backupExpiryDate, false, "deletion.in_progress");
  }
}

function view(
  phase: DeletionStatusView["phase"],
  undoUntil: string | null,
  activeSystemsCompletedAt: string | null,
  backupExpiryDate: string,
  isComplete: boolean,
  messageKey: DeletionStatusView["messageKey"],
): DeletionStatusView {
  return { phase, undoUntil, activeSystemsCompletedAt, backupExpiryDate, isComplete, messageKey };
}

// ---------------------------------------------------------------------------
// Allow-list checks (CR-4, SEC-DEL-06) — static form, mirrored by scripts/db/schema-lint.mjs
// ---------------------------------------------------------------------------

export function allowlistCovers(
  tableNames: readonly string[] = FMA_TABLE_NAMES,
): { ok: true } | { ok: false; missing: string[] } {
  const registered = new Set(DELETION_ALLOWLIST.map((x) => x.table));
  const missing = tableNames.filter((n) => !registered.has(n));
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}

/**
 * Tables the deletion worker may act on for a scope (A24): edges classified purge_candidate or
 * configuration_controlled in DELETION_GRAPH. Account scope also applies every dispute-scope edge
 * to each dispute the account owns. Retained, outside-scope and excluded tables are never returned.
 * The authoritative record-level answer is nyayos.enumerate_deletion_scope().
 */
export function tablesForScope(scopeType: DeletionRequest["scopeType"]): string[] {
  const scopes: DeletionGraphScope[] =
    scopeType === "account" ? ["account", "dispute"] : [scopeType];
  const actionable = new Set<DeletionClassification>([
    "purge_candidate",
    "configuration_controlled",
  ]);
  return [
    ...new Set(
      DELETION_GRAPH.filter(
        (x) => scopes.includes(x.scope) && actionable.has(x.classification),
      ).map((x) => x.table),
    ),
  ].sort();
}

// ---------------------------------------------------------------------------
// Deletion scope graph (A-039; closes A-032 M-6). Twin of nyayos.deletion_graph_v1() in
// db/migrations/0006_deletion_scope_graph.sql; scripts/db/schema-lint.mjs enforces parity and that
// every table has at least one decision. Enumeration itself is nyayos.enumerate_deletion_scope().
// ---------------------------------------------------------------------------

export const DELETION_CLASSIFICATIONS = [
  "purge_candidate",
  "retained_audit_metadata",
  "retained_legal_hold",
  "blocked_active_reference",
  "outside_request_scope",
  "configuration_controlled",
] as const;
export type DeletionClassification = (typeof DELETION_CLASSIFICATIONS)[number];

export type DeletionGraphScope = DeletionRequest["scopeType"] | "none";

export interface DeletionGraphEdge {
  readonly table: string;
  readonly scope: DeletionGraphScope;
  readonly edge: string;
  readonly classification: DeletionClassification;
  readonly reason: string;
}

const e = (
  table: string,
  scope: DeletionGraphScope,
  edge: string,
  classification: DeletionClassification,
  reason: string,
): DeletionGraphEdge => ({ table, scope, edge, classification, reason });

export const DELETION_GRAPH: readonly DeletionGraphEdge[] = [
  e("disputes", "dispute", "root", "purge_candidate", "the dispute being deleted"),
  e("dispute_roles", "dispute", "dispute_id", "purge_candidate", "membership of the dispute"),
  e(
    "dispute_statements",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "dispute narrative and intake answers",
  ),
  e(
    "entities",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "entity_source_forms",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "events",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "date_assertions",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "propositions",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "evidence_items",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "evidence_relations",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "contradictions",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "missing_evidence",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "issues",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "next_steps",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "canonical item; blocked if referenced from another dispute",
  ),
  e(
    "proposals",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "single-writer proposals of the dispute",
  ),
  e(
    "user_corrections",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "version history of the dispute",
  ),
  e(
    "quarantine_uploads",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "uploads into the dispute, any uploader",
  ),
  e(
    "documents",
    "dispute",
    "dispute_id",
    "purge_candidate",
    "documents of the dispute; blocked if referenced from another dispute",
  ),
  e(
    "document_versions",
    "dispute",
    "documents.id",
    "purge_candidate",
    "write-once originals of in-scope documents",
  ),
  e(
    "document_locations",
    "dispute",
    "document_versions.id",
    "purge_candidate",
    "page links on in-scope versions",
  ),
  e(
    "annotations",
    "dispute",
    "document_versions.id",
    "purge_candidate",
    "annotations on in-scope versions",
  ),
  e(
    "custody_events",
    "dispute",
    "documents.id",
    "purge_candidate",
    "custody chain of in-scope documents",
  ),
  e(
    "jobs",
    "dispute",
    "quarantine_uploads.id (payload_ref)",
    "purge_candidate",
    "scan jobs of in-scope uploads; blocked if tenant differs",
  ),
  e("exports", "dispute", "dispute_id", "purge_candidate", "exports of the dispute"),
  e(
    "export_manifests",
    "dispute",
    "exports.id",
    "purge_candidate",
    "manifests of in-scope exports",
  ),
  e(
    "consents",
    "dispute",
    "scope_id (scope_type = dispute)",
    "configuration_controlled",
    "consent history retention pending counsel (OL-02)",
  ),
  e(
    "audit_events",
    "dispute",
    "dispute_id",
    "retained_audit_metadata",
    "append-only, content-free audit",
  ),
  e(
    "deletion_requests",
    "dispute",
    "scope_id",
    "retained_audit_metadata",
    "deletion workflow record, content-free",
  ),
  e(
    "retention_records",
    "dispute",
    "object_id",
    "retained_audit_metadata",
    "retention and verification record",
  ),
  e(
    "deletion_ledger",
    "dispute",
    "scope_id",
    "retained_audit_metadata",
    "content-free tombstone (OL-03 interim)",
  ),
  e(
    "documents",
    "document",
    "root",
    "purge_candidate",
    "the document being deleted; blocked per document_reference_policy or cross-dispute reference",
  ),
  e(
    "document_versions",
    "document",
    "document_id",
    "purge_candidate",
    "write-once originals of the document",
  ),
  e(
    "document_locations",
    "document",
    "document_versions.id",
    "purge_candidate",
    "page links on the document",
  ),
  e(
    "annotations",
    "document",
    "document_versions.id",
    "purge_candidate",
    "annotations on the document",
  ),
  e(
    "custody_events",
    "document",
    "document_id",
    "purge_candidate",
    "custody chain of the document",
  ),
  e(
    "quarantine_uploads",
    "document",
    "sha256 of a version, same dispute",
    "purge_candidate",
    "upload that became this document; blocked if the hash also matches another document",
  ),
  e(
    "jobs",
    "document",
    "quarantine_uploads.id (payload_ref)",
    "purge_candidate",
    "scan jobs of those uploads",
  ),
  e(
    "evidence_items",
    "document",
    "document_id",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "entities",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "entity_source_forms",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "events",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "date_assertions",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "propositions",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "evidence_items",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "evidence_relations",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "contradictions",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "missing_evidence",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "issues",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "next_steps",
    "document",
    "source_ref.documentId",
    "outside_request_scope",
    "reference to the document; configuration_controlled under cascade policy",
  ),
  e(
    "export_manifests",
    "document",
    "entries.documents[].documentId",
    "outside_request_scope",
    "export that includes the document; configuration_controlled under cascade policy",
  ),
  e(
    "audit_events",
    "document",
    "resource_id or metadata.document_id",
    "retained_audit_metadata",
    "append-only, content-free audit",
  ),
  e(
    "deletion_requests",
    "document",
    "scope_id",
    "retained_audit_metadata",
    "deletion workflow record, content-free",
  ),
  e(
    "retention_records",
    "document",
    "object_id",
    "retained_audit_metadata",
    "retention and verification record",
  ),
  e(
    "deletion_ledger",
    "document",
    "scope_id",
    "retained_audit_metadata",
    "content-free tombstone (OL-03 interim)",
  ),
  e("profiles", "account", "user_id", "purge_candidate", "the account profile"),
  e(
    "tenants",
    "account",
    "personal tenant",
    "purge_candidate",
    "the personal tenant; blocked if shared with other members or under legal hold",
  ),
  e(
    "tenant_memberships",
    "account",
    "tenant_id",
    "purge_candidate",
    "memberships of the personal tenant; other members blocked; memberships elsewhere blocked in aggregate",
  ),
  e(
    "dispute_roles",
    "account",
    "user_id outside owned disputes",
    "blocked_active_reference",
    "roles in disputes the account does not own; reported in aggregate, no identifiers",
  ),
  e(
    "platform_roles",
    "account",
    "user_id",
    "configuration_controlled",
    "operator role; removal is an operator decision",
  ),
  e(
    "disputes",
    "account",
    "owned disputes in the tenant",
    "purge_candidate",
    "dispute scope applied to every dispute the account owns",
  ),
  e(
    "consents",
    "account",
    "principal_user_id",
    "configuration_controlled",
    "consent history retention pending counsel (OL-02)",
  ),
  e(
    "audit_events",
    "account",
    "tenant_id or actor_id",
    "retained_audit_metadata",
    "append-only audit; actor pseudonymisation is later work",
  ),
  e(
    "deletion_requests",
    "account",
    "requested_by",
    "retained_audit_metadata",
    "deletion workflow record, content-free",
  ),
  e(
    "retention_records",
    "account",
    "object_id",
    "retained_audit_metadata",
    "retention and verification record",
  ),
  e(
    "deletion_ledger",
    "account",
    "scope_id",
    "retained_audit_metadata",
    "content-free tombstone (OL-03 interim)",
  ),
  e(
    "notices",
    "none",
    "global",
    "outside_request_scope",
    "versioned notice text shared by all users; holds no personal data",
  ),
  e(
    "intake_questions",
    "none",
    "global",
    "outside_request_scope",
    "global question set; holds no personal data",
  ),
  e(
    "audit_anchors",
    "none",
    "global",
    "retained_audit_metadata",
    "period anchors of the global audit chain; content-free",
  ),
  e(
    "deletion_allowlist",
    "none",
    "global",
    "outside_request_scope",
    "registry of tables; holds no case data",
  ),
  e(
    "config_provisional",
    "none",
    "global",
    "outside_request_scope",
    "configuration; holds no case data",
  ),
];

/** Tables with no decision in the graph (must be empty; CI and tests enforce). */
export function graphUncoveredTables(tableNames: readonly string[] = FMA_TABLE_NAMES): string[] {
  const covered = new Set(DELETION_GRAPH.map((x) => x.table));
  return tableNames.filter((n) => !covered.has(n));
}

// ---------------------------------------------------------------------------
// Purge worker (A-040; closes A-032 M-3). The worker itself is nyayos.purge_deletion_request() in
// db/migrations/0007_deletion_purge_worker.sql — server-only, executable by the deletion service
// identity alone. These pure functions state its rules so they can be reviewed and tested here;
// no client code path deletes anything.
// ---------------------------------------------------------------------------

/**
 * Delete order, children before parents. Twin of nyayos.deletion_purge_order_v1();
 * scripts/db/schema-lint.mjs enforces parity and that every purge_candidate table appears.
 */
export const DELETION_PURGE_ORDER = [
  "annotations",
  "document_locations",
  "custody_events",
  "evidence_relations",
  "entity_source_forms",
  "user_corrections",
  "contradictions",
  "date_assertions",
  "missing_evidence",
  "evidence_items",
  "document_versions",
  "jobs",
  "quarantine_uploads",
  "export_manifests",
  "exports",
  "entities",
  "events",
  "propositions",
  "issues",
  "next_steps",
  "dispute_statements",
  "proposals",
  "documents",
  "dispute_roles",
  "disputes",
  "tenant_memberships",
  "profiles",
  "tenants",
] as const;

export const PURGE_OUTCOMES = [
  "purged",
  "incomplete",
  "already_purged",
  "request_undone",
  "undo_window_active",
  "legal_hold_active",
  "not_found_or_not_authorized",
] as const;
export type PurgeOutcome = (typeof PURGE_OUTCOMES)[number];

/** One row of nyayos.enumerate_deletion_scope() (A-039). */
export interface EnumeratedRecord {
  readonly table: string;
  readonly recordId: string | null;
  readonly classification: DeletionClassification;
  readonly reason: string;
}

/**
 * The worker's gate before anything is deleted (SQL steps a and c). Returns the refusal, or null
 * when the purge may proceed. Authorisation is re-verified by the enumeration itself, which the
 * worker runs as the requester; a failure there is "not_found_or_not_authorized".
 */
export function purgeGate(
  request: Pick<DeletionRequest, "state" | "undoUntil">,
  rows: readonly EnumeratedRecord[],
  now: string,
): PurgeOutcome | null {
  if (request.state === "purged" || request.state === "verified") return "already_purged";
  if (request.state === "undone") return "request_undone";
  if (new Date(now).getTime() <= new Date(request.undoUntil).getTime()) return "undo_window_active";
  if (
    rows.some(
      (r) =>
        r.classification === "retained_legal_hold" || r.reason === "legal_hold_on_owned_dispute",
    )
  ) {
    return "legal_hold_active";
  }
  return null;
}

/**
 * The only records the worker may delete: purge candidates with an identifier. The orphan closure
 * in SQL can only remove records from this set (keep them), never add to it.
 */
export function purgeCandidates(rows: readonly EnumeratedRecord[]): EnumeratedRecord[] {
  return rows.filter((r) => r.classification === "purge_candidate" && r.recordId !== null);
}

/** Honest outcome: complete only when no candidate was kept and nothing was blocked. */
export function purgeOutcome(
  keptCandidates: number,
  rows: readonly EnumeratedRecord[],
): "purged" | "incomplete" {
  return keptCandidates === 0 && !rows.some((r) => r.classification === "blocked_active_reference")
    ? "purged"
    : "incomplete";
}
