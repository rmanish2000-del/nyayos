/**
 * Append-only, hash-chained audit (SDAS §17; Scope Sheet F05; Architecture Deck
 * slide 14).
 *
 *   row_hash = SHA-256(prev_hash ‖ canonical_row)
 *
 * Writers: a single helper using the `audit_writer` service identity; no client
 * path; no UPDATE/DELETE grants to any role. Prohibited in audit: content, AI
 * text, comment text, full names, contact details, filenames, secrets, tokens,
 * raw IP. `metadata` accepts allow-listed keys only.
 */

import { z } from "zod";

import { Id, type RequestContext, isService } from "./context";
import {
  AUDIT_ACTIONS,
  AUDIT_ACTOR_TYPES,
  AUDIT_OUTCOMES,
  AUDIT_SEVERITIES,
  type AuditAction,
} from "./enums";
import { sha256Hex } from "./evidence";

/** Keys that may appear in `metadata`. Everything else is rejected before hashing. */
export const AUDIT_METADATA_ALLOWLIST = [
  "document_id",
  "document_version",
  "sha256",
  "size_bytes",
  "mime",
  "proposal_id",
  "correction_id",
  "export_id",
  "manifest_sha256",
  "deletion_request_id",
  "scope_type",
  "state_from",
  "state_to",
  "verdict",
  "reason_code",
  "notice_version",
  "notice_language",
  "purpose_checked",
  "target_type",
  "target_id",
  "version",
  "count",
] as const;

/** Keys that must never appear anywhere in an audit row (SDAS §17.1 "Prohibited in audit"). */
export const AUDIT_PROHIBITED_KEYS = [
  "content",
  "text",
  "narrative",
  "excerpt",
  "filename",
  "original_filename",
  "display_name",
  "name",
  "email",
  "phone",
  "ip",
  "ip_address",
  "token",
  "secret",
  "password",
  "otp",
  "authorization",
  "cookie",
] as const;

export const AuditEvent = z.object({
  id: Id,
  occurredAt: z.string().datetime(),
  actorType: z.enum(AUDIT_ACTOR_TYPES),
  /** Pseudonymous id: user id, service identity name or "system". Never a name. */
  actorId: z.string().min(1),
  onBehalfOf: Id.nullable(),
  tenantId: Id.nullable(),
  disputeId: Id.nullable(),
  grantId: Id.nullable(),
  action: z.enum(AUDIT_ACTIONS),
  resourceType: z.string().min(1),
  resourceId: Id.nullable(),
  purpose: z.string().nullable(),
  outcome: z.enum(AUDIT_OUTCOMES),
  severity: z.enum(AUDIT_SEVERITIES),
  requestId: Id,
  ipHash: z.string().nullable(),
  userAgentClass: z.string(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  prevHash: z.string().regex(/^[0-9a-f]{64}$/),
  rowHash: z.string().regex(/^[0-9a-f]{64}$/),
});
export type AuditEvent = z.infer<typeof AuditEvent>;

export type AuditEventInput = Omit<AuditEvent, "prevHash" | "rowHash">;

export const GENESIS_HASH = "0".repeat(64);

export function assertContentFree(metadata: Record<string, unknown>): void {
  for (const key of Object.keys(metadata)) {
    const lower = key.toLowerCase();
    if ((AUDIT_PROHIBITED_KEYS as readonly string[]).includes(lower)) {
      throw new Error(`audit metadata key "${key}" is prohibited (content or identity data)`);
    }
    if (!(AUDIT_METADATA_ALLOWLIST as readonly string[]).includes(key)) {
      throw new Error(`audit metadata key "${key}" is not allow-listed`);
    }
    const v = metadata[key];
    if (typeof v === "string" && v.length > 256) {
      throw new Error(
        `audit metadata value for "${key}" exceeds 256 characters (content is not permitted)`,
      );
    }
  }
}

/** Deterministic serialisation: keys sorted, no whitespace, hashes excluded. */
export function canonicalizeAuditRow(input: AuditEventInput): string {
  const { metadata, ...rest } = input;
  const sortedMeta = Object.fromEntries(
    Object.entries(metadata).sort(([a], [b]) => a.localeCompare(b)),
  );
  const ordered = Object.fromEntries(
    Object.entries({ ...rest, metadata: sortedMeta }).sort(([a], [b]) => a.localeCompare(b)),
  );
  return JSON.stringify(ordered);
}

export async function computeRowHash(prevHash: string, input: AuditEventInput): Promise<string> {
  const bytes = new TextEncoder().encode(prevHash + "‖" + canonicalizeAuditRow(input));
  return sha256Hex(bytes);
}

/**
 * Append one event to a chain. Only the `audit_writer` service identity may call
 * this (A28: "No client write path").
 */
export async function appendAuditEvent(
  ctx: RequestContext,
  chain: readonly AuditEvent[],
  input: AuditEventInput,
): Promise<AuditEvent> {
  if (!isService(ctx.principal) || ctx.principal.serviceIdentity !== "audit_writer") {
    throw new Error("appendAuditEvent requires the audit_writer service identity");
  }
  assertContentFree(input.metadata);
  const prevHash = chain.at(-1)?.rowHash ?? GENESIS_HASH;
  const rowHash = await computeRowHash(prevHash, input);
  return AuditEvent.parse({ ...input, prevHash, rowHash });
}

export type ChainVerification =
  | { ok: true; length: number }
  | { ok: false; brokenAt: number; reason: "prev_hash_mismatch" | "row_hash_mismatch" };

/** SEC-HASH-05: any edited, removed or reordered row breaks the chain. */
export async function verifyAuditChain(chain: readonly AuditEvent[]): Promise<ChainVerification> {
  let prev = GENESIS_HASH;
  for (let i = 0; i < chain.length; i++) {
    const row = chain[i]!;
    if (row.prevHash !== prev) return { ok: false, brokenAt: i, reason: "prev_hash_mismatch" };
    const { prevHash: _p, rowHash: _r, ...input } = row;
    const expected = await computeRowHash(prev, input);
    if (expected !== row.rowHash) return { ok: false, brokenAt: i, reason: "row_hash_mismatch" };
    prev = row.rowHash;
  }
  return { ok: true, length: chain.length };
}

/** Weekly manual anchor (F05, `ff_audit_anchor_auto` off): the last row hash of the period. */
export interface AuditAnchor {
  readonly period: string;
  readonly anchorHash: string;
  readonly exportedAt: string;
  readonly exportedBy: string;
}

export function buildAnchor(
  chain: readonly AuditEvent[],
  period: string,
  exportedAt: string,
  exportedBy: string,
): AuditAnchor {
  return { period, anchorHash: chain.at(-1)?.rowHash ?? GENESIS_HASH, exportedAt, exportedBy };
}

/** Owner-facing "My activity" (U19, A27): own actions only, ids only. */
export function myActivity(
  chain: readonly AuditEvent[],
  userId: string,
): Pick<AuditEvent, "occurredAt" | "action" | "resourceType" | "outcome">[] {
  return chain
    .filter((e) => e.actorType === "user" && e.actorId === userId)
    .map(({ occurredAt, action, resourceType, outcome }) => ({
      occurredAt,
      action,
      resourceType,
      outcome,
    }));
}

export function isKnownAction(action: string): action is AuditAction {
  return (AUDIT_ACTIONS as readonly string[]).includes(action);
}
