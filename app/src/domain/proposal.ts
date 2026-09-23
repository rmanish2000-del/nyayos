/**
 * Single-writer proposal → correction pipeline (Scope Sheet §4.4, F14; SDAS §5.2;
 * Architecture Deck slides 8–9).
 *
 * Invariants:
 *  - The ONLY way a canonical value changes is `decideProposal(...)` accepting a
 *    proposal, which yields a `UserCorrection` and a new version number.
 *  - Owner-originated proposals are auto-accepted in the same call (A07), but the
 *    correction record is still written — no silent overwrite.
 *  - Rejection is recorded, not discarded.
 *  - `origin` values `ai` and `reviewer` are declared but inert in FM-A; a proposal
 *    with either origin is refused before it is stored.
 *
 * `FactVersion` is the Executive Architecture Deck's name for the version chain.
 * FM-A does NOT create a `fact_versions` table (CR-1); the chain is rebuilt from
 * `user_corrections` by `buildVersionChain`. Version 1 is the creating correction
 * (previousValue null).
 */

import { z } from "zod";

import { Id, type RequestContext, isUser } from "./context";
import { type Provenance } from "./dispute";
import {
  type AuditAction,
  CANONICAL_TARGET_TYPES,
  FMA_ENABLED_PROPOSAL_ORIGINS,
  PROPOSAL_ORIGINS,
  PROPOSAL_STATUSES,
} from "./enums";

export const JsonValue: z.ZodType<unknown> = z.unknown();

export const Proposal = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  targetType: z.enum(CANONICAL_TARGET_TYPES),
  /** Null when the proposal creates a new item. */
  targetId: Id.nullable(),
  proposedValue: JsonValue,
  origin: z.enum(PROPOSAL_ORIGINS),
  /** Who/what originated it: user id, or (reserved) ai_run id / grant id. */
  originRef: Id,
  status: z.enum(PROPOSAL_STATUSES),
  decidedBy: Id.nullable(),
  decidedAt: z.string().datetime().nullable(),
  reason: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type Proposal = z.infer<typeof Proposal>;

export const UserCorrection = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  targetType: z.enum(CANONICAL_TARGET_TYPES),
  targetId: Id,
  previousValue: JsonValue.nullable(),
  newValue: JsonValue,
  reason: z.string().nullable(),
  userId: Id,
  originProposalId: Id,
  /** Version number the item holds AFTER this correction. */
  resultingVersion: z.number().int().min(1),
  timestamp: z.string().datetime(),
});
export type UserCorrection = z.infer<typeof UserCorrection>;

/** Deck vocabulary: one node of an item's immutable version chain, derived from corrections. */
export interface FactVersion {
  readonly targetType: UserCorrection["targetType"];
  readonly targetId: string;
  readonly version: number;
  readonly value: unknown;
  readonly correctionId: string;
  readonly proposalId: string;
  readonly confirmedBy: string;
  readonly at: string;
  readonly previousVersionCorrectionId: string | null;
}

export type ProposeResult =
  | { ok: true; proposal: Proposal; audit: AuditAction[] }
  | { ok: false; code: "origin_not_enabled_in_fma" | "not_a_user" | "cross_tenant" };

export function proposeChange(
  ctx: RequestContext,
  input: {
    id: string;
    tenantId: string;
    disputeId: string;
    targetType: Proposal["targetType"];
    targetId: string | null;
    proposedValue: unknown;
    origin: Proposal["origin"];
    originRef: string;
    reason?: string | null;
  },
): ProposeResult {
  if (!(FMA_ENABLED_PROPOSAL_ORIGINS as readonly string[]).includes(input.origin)) {
    return { ok: false, code: "origin_not_enabled_in_fma" };
  }
  if (!isUser(ctx.principal)) return { ok: false, code: "not_a_user" };
  if (ctx.principal.tenantId !== input.tenantId) return { ok: false, code: "cross_tenant" };
  const proposal = Proposal.parse({
    id: input.id,
    tenantId: input.tenantId,
    disputeId: input.disputeId,
    targetType: input.targetType,
    targetId: input.targetId,
    proposedValue: input.proposedValue,
    origin: input.origin,
    originRef: input.originRef,
    status: "pending",
    decidedBy: null,
    decidedAt: null,
    reason: input.reason ?? null,
    createdAt: ctx.now,
  });
  return { ok: true, proposal, audit: ["proposal.created"] };
}

export interface CanonicalSnapshot {
  readonly targetId: string;
  readonly version: number;
  readonly value: unknown;
}

export type DecideResult =
  | {
      ok: true;
      proposal: Proposal;
      correction: UserCorrection | null;
      next: CanonicalSnapshot | null;
      audit: AuditAction[];
    }
  | { ok: false; code: "already_decided" | "not_a_user" | "cross_tenant" | "missing_new_item_id" };

/**
 * The single write path. `current` is the item's present snapshot (null when the
 * proposal creates a new item; then `newItemId` must be supplied by the caller).
 */
export function decideProposal(
  ctx: RequestContext,
  proposal: Proposal,
  decision: "accept" | "reject",
  opts: {
    current: CanonicalSnapshot | null;
    correctionId: string;
    newItemId?: string;
    reason?: string | null;
  },
): DecideResult {
  if (proposal.status !== "pending") return { ok: false, code: "already_decided" };
  if (!isUser(ctx.principal)) return { ok: false, code: "not_a_user" };
  if (ctx.principal.tenantId !== proposal.tenantId) return { ok: false, code: "cross_tenant" };

  const decided: Proposal = {
    ...proposal,
    status: decision === "accept" ? "accepted" : "rejected",
    decidedBy: ctx.principal.userId,
    decidedAt: ctx.now,
    reason: opts.reason ?? proposal.reason,
  };

  if (decision === "reject") {
    return {
      ok: true,
      proposal: decided,
      correction: null,
      next: null,
      audit: ["proposal.rejected"],
    };
  }

  const targetId = opts.current?.targetId ?? proposal.targetId ?? opts.newItemId;
  if (!targetId) return { ok: false, code: "missing_new_item_id" };
  const resultingVersion = (opts.current?.version ?? 0) + 1;

  const correction = UserCorrection.parse({
    id: opts.correctionId,
    tenantId: proposal.tenantId,
    disputeId: proposal.disputeId,
    targetType: proposal.targetType,
    targetId,
    previousValue: opts.current?.value ?? null,
    newValue: proposal.proposedValue,
    reason: decided.reason,
    userId: ctx.principal.userId,
    originProposalId: proposal.id,
    resultingVersion,
    timestamp: ctx.now,
  });

  return {
    ok: true,
    proposal: decided,
    correction,
    next: { targetId, version: resultingVersion, value: proposal.proposedValue },
    audit: ["proposal.accepted", "correction.created"],
  };
}

/**
 * Owner-originated change: propose and accept in one call (A07 note). Both records
 * are still produced so AC-M1-02 holds for every change.
 */
export function ownerChange(
  ctx: RequestContext,
  input: Parameters<typeof proposeChange>[1] & {
    correctionId: string;
    current: CanonicalSnapshot | null;
    newItemId?: string;
  },
): ProposeResult | DecideResult {
  const proposed = proposeChange(ctx, { ...input, origin: "user" });
  if (!proposed.ok) return proposed;
  const decideOpts: Parameters<typeof decideProposal>[3] = {
    current: input.current,
    correctionId: input.correctionId,
    reason: input.reason ?? null,
  };
  if (input.newItemId !== undefined) decideOpts.newItemId = input.newItemId;
  const decided = decideProposal(ctx, proposed.proposal, "accept", decideOpts);
  if (!decided.ok) return decided;
  return { ...decided, audit: [...proposed.audit, ...decided.audit] };
}

/** Rebuild the immutable version chain for one item from its corrections. */
export function buildVersionChain(
  corrections: readonly UserCorrection[],
  target: { targetType: string; targetId: string },
): FactVersion[] {
  const own = corrections
    .filter((c) => c.targetType === target.targetType && c.targetId === target.targetId)
    .sort((a, b) => a.resultingVersion - b.resultingVersion);
  const chain: FactVersion[] = [];
  own.forEach((c, i) => {
    if (c.resultingVersion !== i + 1) {
      throw new Error(
        `version chain gap for ${target.targetType}/${target.targetId} at ${c.resultingVersion}`,
      );
    }
    chain.push({
      targetType: c.targetType,
      targetId: c.targetId,
      version: c.resultingVersion,
      value: c.newValue,
      correctionId: c.id,
      proposalId: c.originProposalId,
      confirmedBy: c.userId,
      at: c.timestamp,
      previousVersionCorrectionId: i === 0 ? null : own[i - 1]!.id,
    });
  });
  return chain;
}

/** SEC-MUT-03: every canonical version must be explained by exactly one correction. */
export function reconcileHistory(
  snapshots: readonly CanonicalSnapshot[],
  corrections: readonly UserCorrection[],
  targetType: UserCorrection["targetType"],
): { ok: true } | { ok: false; unexplained: { targetId: string; version: number }[] } {
  const unexplained: { targetId: string; version: number }[] = [];
  for (const s of snapshots) {
    const explained = corrections.filter(
      (c) =>
        c.targetType === targetType &&
        c.targetId === s.targetId &&
        c.resultingVersion === s.version,
    );
    if (explained.length !== 1) unexplained.push({ targetId: s.targetId, version: s.version });
  }
  return unexplained.length === 0 ? { ok: true } : { ok: false, unexplained };
}

export type { Provenance };
