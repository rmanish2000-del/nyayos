/**
 * Deletion lifecycle (Scope Sheet §4.6, F17, A23–A26; SDAS §10; Architecture
 * Deck slide 15; Counsel Brief OL-02/OL-03).
 *
 *   requested ─undo→ undone
 *   requested ─window closes→ locked ─worker→ purging ─→ purged ─operator→ verified | incomplete
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

/** Tables the deletion worker enumerates for a scope (A24). Retained tables are never touched. */
export function tablesForScope(scopeType: DeletionRequest["scopeType"]): string[] {
  const columns: Record<DeletionRequest["scopeType"], string[]> = {
    document: ["document_id", "document_version_id"],
    dispute: ["dispute_id", "document_id", "document_version_id", "export_id"],
    account: [
      "tenant_id",
      "dispute_id",
      "document_id",
      "document_version_id",
      "export_id",
      "user_id",
      "principal_user_id",
    ],
  };
  return DELETION_ALLOWLIST.filter(
    (x) => !x.retained && x.scopeColumn !== null && columns[scopeType].includes(x.scopeColumn),
  ).map((x) => x.table);
}
