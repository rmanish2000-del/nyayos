/**
 * Append-only, hash-chained audit (SDAS §17; Scope Sheet F05; Architecture Deck
 * slide 14).
 *
 *   row_hash = SHA-256(prev_hash ‖ canonical_row) — contract `nyayos-audit-v1`, see below.
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

/**
 * Audit hash contract `nyayos-audit-v1` (A-038; closes A-032 M-2). The SQL twin is
 * `nyayos.audit_canonical_v1` / `nyayos.audit_row_hash_v1` in
 * `db/migrations/0005_audit_contract_and_atomicity.sql`; both must produce byte-identical
 * output, which `db/tests/audit_hash_vectors_v1.json` pins for both runtimes.
 *
 *   canonical = compact JSON array, no whitespace:
 *     ["nyayos-audit-v1", id, occurredAt, actorType, actorId, onBehalfOf, tenantId, disputeId,
 *      grantId, action, resourceType, resourceId, purpose, outcome, severity, requestId,
 *      ipHash, userAgentClass, metadata]
 *   - text: JSON string (escapes `"` `\` and U+0000–U+001F only; `\b \f \n \r \t` short forms,
 *     others `\u00xx` lowercase); non-ASCII emitted as UTF-8. NUL and lone surrogates rejected.
 *   - absent value: JSON `null` (never the empty string).
 *   - id, onBehalfOf, tenantId, disputeId, grantId: UUID, rendered lowercase.
 *   - occurredAt: UTC, `YYYY-MM-DDTHH:MM:SS.ffffffZ` (exactly 6 fractional digits; any input
 *     offset is converted; more than 6 input digits is rejected, never rounded).
 *   - metadata: JSON object, keys sorted by code point; values string, boolean, or a safe
 *     integer (|n| ≤ 2^53 − 1) written in plain decimal. Anything else is rejected.
 *   row_hash = lowercase hex SHA-256 of UTF-8( prev_hash ‖ canonical ), where ‖ is U+2016 and
 *   prev_hash is 64 lowercase hex characters (genesis: 64 zeros).
 */
export const AUDIT_HASH_CONTRACT = "nyayos-audit-v1" as const;
export const AUDIT_HASH_SEPARATOR = "\u2016";

const UUID_RE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
const HASH_RE = /^[0-9a-f]{64}$/;
const TIMESTAMP_RE =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}:\d{2})$/;

const pad = (n: number, width: number) => String(n).padStart(width, "0");

/** Convert an ISO-8601 timestamp with an offset to the contract's UTC microsecond form. */
export function normalizeAuditTimestamp(value: string): string {
  const m = TIMESTAMP_RE.exec(value);
  if (!m) {
    throw new Error(
      `audit timestamp ${JSON.stringify(value)} must be ISO-8601 with an offset and at most 6 fractional digits`,
    );
  }
  const [year, month, day, hour, minute, second] = m.slice(1, 7).map(Number) as [
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  const fraction = m[7] ?? "";
  const offset = m[8]!;
  const local = new Date(0);
  local.setUTCFullYear(year, month - 1, day);
  local.setUTCHours(hour, minute, second, 0);
  if (
    local.getUTCFullYear() !== year ||
    local.getUTCMonth() !== month - 1 ||
    local.getUTCDate() !== day ||
    local.getUTCHours() !== hour ||
    local.getUTCMinutes() !== minute ||
    local.getUTCSeconds() !== second
  ) {
    throw new Error(`audit timestamp ${JSON.stringify(value)} is not a valid calendar time`);
  }
  let offsetMinutes = 0;
  if (offset !== "Z") {
    const oh = Number(offset.slice(1, 3));
    const om = Number(offset.slice(4, 6));
    if (oh > 23 || om > 59) throw new Error(`audit timestamp offset ${offset} is invalid`);
    offsetMinutes = (offset.startsWith("-") ? -1 : 1) * (oh * 60 + om);
  }
  const utc = new Date(local.getTime() - offsetMinutes * 60_000);
  const y = utc.getUTCFullYear();
  if (y < 1000 || y > 9999) throw new Error(`audit timestamp year ${y} is outside 1000–9999`);
  return (
    `${pad(y, 4)}-${pad(utc.getUTCMonth() + 1, 2)}-${pad(utc.getUTCDate(), 2)}` +
    `T${pad(utc.getUTCHours(), 2)}:${pad(utc.getUTCMinutes(), 2)}:${pad(utc.getUTCSeconds(), 2)}` +
    `.${fraction.padEnd(6, "0")}Z`
  );
}

function checkText(value: string, field: string): string {
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c === 0)
      throw new Error(`audit field ${field} contains NUL, which PostgreSQL text cannot store`);
    if (c >= 0xd800 && c <= 0xdbff) {
      const next = value.charCodeAt(i + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff))
        throw new Error(`audit field ${field} contains a lone surrogate`);
      i++;
    } else if (c >= 0xdc00 && c <= 0xdfff) {
      throw new Error(`audit field ${field} contains a lone surrogate`);
    }
  }
  return value;
}

const text = (v: string, field: string) => JSON.stringify(checkText(v, field));
const optionalText = (v: string | null, field: string) => (v === null ? "null" : text(v, field));
function uuid(v: string | null, field: string, nullable: boolean): string {
  if (v === null) {
    if (nullable) return "null";
    throw new Error(`audit field ${field} is required`);
  }
  if (!UUID_RE.test(v)) throw new Error(`audit field ${field} must be a UUID`);
  return JSON.stringify(v.toLowerCase());
}

function metadataJson(metadata: Record<string, string | number | boolean>): string {
  const keys = Object.keys(metadata).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const parts = keys.map((k) => {
    const v = metadata[k];
    let rendered: string;
    if (typeof v === "string") rendered = text(v, `metadata.${k}`);
    else if (typeof v === "boolean") rendered = v ? "true" : "false";
    else if (typeof v === "number" && Number.isSafeInteger(v)) rendered = String(v === 0 ? 0 : v);
    else throw new Error(`audit metadata ${k} must be a string, boolean or safe integer`);
    return `${text(k, "metadata key")}:${rendered}`;
  });
  return `{${parts.join(",")}}`;
}

/** Contract `nyayos-audit-v1` canonical string. Throws on any value the contract cannot represent. */
export function canonicalizeAuditRow(input: AuditEventInput): string {
  return (
    "[" +
    [
      JSON.stringify(AUDIT_HASH_CONTRACT),
      uuid(input.id, "id", false),
      JSON.stringify(normalizeAuditTimestamp(input.occurredAt)),
      text(input.actorType, "actorType"),
      text(input.actorId, "actorId"),
      uuid(input.onBehalfOf, "onBehalfOf", true),
      uuid(input.tenantId, "tenantId", true),
      uuid(input.disputeId, "disputeId", true),
      uuid(input.grantId, "grantId", true),
      text(input.action, "action"),
      text(input.resourceType, "resourceType"),
      optionalText(input.resourceId, "resourceId"),
      optionalText(input.purpose, "purpose"),
      text(input.outcome, "outcome"),
      text(input.severity, "severity"),
      text(input.requestId, "requestId"),
      optionalText(input.ipHash, "ipHash"),
      text(input.userAgentClass, "userAgentClass"),
      metadataJson(input.metadata),
    ].join(",") +
    "]"
  );
}

export async function computeRowHash(prevHash: string, input: AuditEventInput): Promise<string> {
  if (!HASH_RE.test(prevHash)) throw new Error("prev_hash must be 64 lowercase hex characters");
  const bytes = new TextEncoder().encode(
    prevHash + AUDIT_HASH_SEPARATOR + canonicalizeAuditRow(input),
  );
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

/**
 * Map a row as PostgreSQL returns it (`row_to_json(nyayos.audit_events)`, any session time
 * zone) to an AuditEvent, so the TypeScript verifier can check a chain the SQL trigger wrote.
 */
export function fromSqlAuditRow(row: unknown): AuditEvent {
  if (typeof row !== "object" || row === null) throw new Error("audit row must be an object");
  const r = row as Record<string, unknown>;
  const lower = (v: unknown) => (typeof v === "string" ? v.toLowerCase() : v);
  return AuditEvent.parse({
    id: lower(r["id"]),
    occurredAt: normalizeAuditTimestamp(String(r["occurred_at"])),
    actorType: r["actor_type"],
    actorId: r["actor_id"],
    onBehalfOf: lower(r["on_behalf_of"]),
    tenantId: lower(r["tenant_id"]),
    disputeId: lower(r["dispute_id"]),
    grantId: lower(r["grant_id"]),
    action: r["action"],
    resourceType: r["resource_type"],
    resourceId: r["resource_id"],
    purpose: r["purpose"],
    outcome: r["outcome"],
    severity: r["severity"],
    requestId: r["request_id"],
    ipHash: r["ip_hash"],
    userAgentClass: r["user_agent_class"],
    metadata: r["metadata"],
    prevHash: r["prev_hash"],
    rowHash: r["row_hash"],
  });
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
