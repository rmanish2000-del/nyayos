/**
 * Authorisation primitives — the two helpers every policy is written in terms of
 * (SDAS §5.1) plus a deny-by-default decision function.
 *
 * - `isDisputeMember(ctx, dispute, minRole)` — the caller holds a dispute role ≥ minRole
 *   in the dispute's tenant.
 * - `grantAllows(...)` — present from day one (CR-2) and ALWAYS false in FM-A: no grant
 *   rows exist, `ff_sharing` is off, and there is no live-share alternative (S4).
 *
 * These are pure functions over the server-built RequestContext. The SQL twins live in
 * `db/migrations/0001_fma_foundation.sql` (`is_dispute_member`, `grant_allows`). Both
 * layers must agree; the tests in `tests/domain/authz.test.ts` hold the role matrix.
 */

import { type RequestContext, isService, isUser } from "./context";
import {
  DISPUTE_ROLE_RANK,
  type DisputeRole,
  type GrantPermission,
  type PlatformRole,
  type ServiceIdentity,
} from "./enums";

export interface DisputeRef {
  readonly disputeId: string;
  readonly tenantId: string;
}

export function isDisputeMember(
  ctx: RequestContext,
  dispute: DisputeRef,
  minRole: DisputeRole,
): boolean {
  const p = ctx.principal;
  if (!isUser(p)) return false;
  if (p.tenantId !== dispute.tenantId) return false; // tenant boundary first (S1)
  const membership = p.disputeMemberships.find((m) => m.disputeId === dispute.disputeId);
  if (!membership) return false; // absence of a grant is a denial
  return DISPUTE_ROLE_RANK[membership.role] >= DISPUTE_ROLE_RANK[minRole];
}

export interface GrantCheckInput {
  readonly disputeId: string;
  readonly shareItemRef: string;
  readonly permission: GrantPermission;
}

/**
 * Sharing does not exist in FM-A. This function exists so that policies, tests and
 * later milestones bind to one contract (CR-2). It must return false for every input
 * until FM-B supplies grant rows through THIS function, never through a new path.
 */
export function grantAllows(_ctx: RequestContext, _input: GrantCheckInput): false {
  return false;
}

export type Requirement =
  | { kind: "dispute_member"; dispute: DisputeRef; minRole: DisputeRole }
  | { kind: "self"; userId: string }
  | { kind: "tenant_member"; tenantId: string }
  | { kind: "platform_role"; role: PlatformRole }
  | { kind: "service"; identity: ServiceIdentity }
  | { kind: "grant"; input: GrantCheckInput };

export type Decision =
  | { allowed: true; reason: "ok" }
  | {
      allowed: false;
      reason:
        | "anonymous"
        | "not_a_user"
        | "not_a_service"
        | "wrong_service_identity"
        | "tenant_mismatch"
        | "no_dispute_role"
        | "insufficient_dispute_role"
        | "not_self"
        | "missing_platform_role"
        | "grants_not_available"
        | "unknown_requirement";
    };

/** Deny by default: any requirement that cannot be fully resolved is denied. */
export function authorize(ctx: RequestContext, req: Requirement): Decision {
  const p = ctx.principal;
  if (p.kind === "anonymous") return { allowed: false, reason: "anonymous" };

  switch (req.kind) {
    case "service": {
      if (!isService(p)) return { allowed: false, reason: "not_a_service" };
      if (p.serviceIdentity !== req.identity)
        return { allowed: false, reason: "wrong_service_identity" };
      return { allowed: true, reason: "ok" };
    }
    case "dispute_member": {
      if (!isUser(p)) return { allowed: false, reason: "not_a_user" };
      if (p.tenantId !== req.dispute.tenantId) return { allowed: false, reason: "tenant_mismatch" };
      const m = p.disputeMemberships.find((x) => x.disputeId === req.dispute.disputeId);
      if (!m) return { allowed: false, reason: "no_dispute_role" };
      if (DISPUTE_ROLE_RANK[m.role] < DISPUTE_ROLE_RANK[req.minRole]) {
        return { allowed: false, reason: "insufficient_dispute_role" };
      }
      return { allowed: true, reason: "ok" };
    }
    case "self": {
      if (!isUser(p)) return { allowed: false, reason: "not_a_user" };
      return p.userId === req.userId
        ? { allowed: true, reason: "ok" }
        : { allowed: false, reason: "not_self" };
    }
    case "tenant_member": {
      if (!isUser(p)) return { allowed: false, reason: "not_a_user" };
      return p.tenantId === req.tenantId
        ? { allowed: true, reason: "ok" }
        : { allowed: false, reason: "tenant_mismatch" };
    }
    case "platform_role": {
      if (!isUser(p)) return { allowed: false, reason: "not_a_user" };
      return p.platformRoles.includes(req.role)
        ? { allowed: true, reason: "ok" }
        : { allowed: false, reason: "missing_platform_role" };
    }
    case "grant": {
      // grantAllows is always false in FM-A; the reason names the real cause.
      return grantAllows(ctx, req.input)
        ? { allowed: true, reason: "ok" }
        : { allowed: false, reason: "grants_not_available" };
    }
    default:
      return { allowed: false, reason: "unknown_requirement" };
  }
}

/** Throwing wrapper for server functions: denial is an error with a stable code. */
export class AuthorizationError extends Error {
  readonly code: Exclude<Decision, { allowed: true }>["reason"];
  constructor(code: Exclude<Decision, { allowed: true }>["reason"]) {
    super(`authorization denied: ${code}`);
    this.name = "AuthorizationError";
    this.code = code;
  }
}

export function assertAuthorized(ctx: RequestContext, req: Requirement): void {
  const d = authorize(ctx, req);
  if (!d.allowed) throw new AuthorizationError(d.reason);
}
