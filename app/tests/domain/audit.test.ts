// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  type AuditEvent,
  type AuditEventInput,
  GENESIS_HASH,
  appendAuditEvent,
  assertContentFree,
  buildAnchor,
  myActivity,
  serviceContext,
  userContext,
  verifyAuditChain,
} from "@/domain";

const NOW = "2026-09-23T10:00:00.000Z";
const writer = serviceContext("audit_writer", { now: NOW });

function input(i: number, actorId = "u1"): AuditEventInput {
  return {
    id: `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`,
    occurredAt: NOW,
    actorType: "user",
    actorId,
    onBehalfOf: null,
    tenantId: "10000000-0000-4000-8000-000000000001",
    disputeId: "20000000-0000-4000-8000-000000000001",
    grantId: null,
    action: "proposal.accepted",
    resourceType: "proposal",
    resourceId: `p${i}`,
    purpose: "storage",
    outcome: "success",
    severity: "info",
    requestId: `r${i}`,
    ipHash: null,
    userAgentClass: "mobile",
    metadata: { proposal_id: `p${i}` },
  };
}

async function chainOf(n: number): Promise<AuditEvent[]> {
  const chain: AuditEvent[] = [];
  for (let i = 0; i < n; i++) chain.push(await appendAuditEvent(writer, chain, input(i)));
  return chain;
}

describe("Append-only hash-chained audit (S7, SEC-HASH-05, AC-M0-04)", () => {
  it("links each row to the previous row hash starting from genesis", async () => {
    const chain = await chainOf(3);
    expect(chain[0]!.prevHash).toBe(GENESIS_HASH);
    expect(chain[1]!.prevHash).toBe(chain[0]!.rowHash);
    expect(chain[2]!.prevHash).toBe(chain[1]!.rowHash);
    expect(await verifyAuditChain(chain)).toEqual({ ok: true, length: 3 });
  });

  it("detects an edited row", async () => {
    const chain = await chainOf(3);
    const tampered = chain.map((r, i) => (i === 1 ? { ...r, outcome: "denied" as const } : r));
    expect(await verifyAuditChain(tampered)).toEqual({
      ok: false,
      brokenAt: 1,
      reason: "row_hash_mismatch",
    });
  });

  it("detects a removed row", async () => {
    const chain = await chainOf(3);
    expect(await verifyAuditChain([chain[0]!, chain[2]!])).toEqual({
      ok: false,
      brokenAt: 1,
      reason: "prev_hash_mismatch",
    });
  });

  it("only the audit_writer service identity may append", async () => {
    const user = userContext(
      { userId: "u1", sessionId: "s", tenantId: "t1", tenantRole: "tenant_owner" },
      { now: NOW },
    );
    await expect(appendAuditEvent(user, [], input(0))).rejects.toThrow(/audit_writer/);
    await expect(appendAuditEvent(serviceContext("scan_worker"), [], input(0))).rejects.toThrow(
      /audit_writer/,
    );
  });

  it("refuses content, identity and secret keys in metadata (SDAS §17.1)", () => {
    for (const key of [
      "content",
      "text",
      "filename",
      "original_filename",
      "email",
      "ip",
      "token",
      "password",
      "name",
    ]) {
      expect(() => assertContentFree({ [key]: "x" })).toThrow(/prohibited/);
    }
    expect(() => assertContentFree({ unknown_key: "x" })).toThrow(/not allow-listed/);
    expect(() => assertContentFree({ sha256: "a".repeat(64), size_bytes: 10 })).not.toThrow();
    expect(() => assertContentFree({ reason_code: "x".repeat(300) })).toThrow(/256/);
  });

  it("anchors the period with the last row hash and shows a user only their own actions", async () => {
    const chain = await chainOf(2);
    const other = await appendAuditEvent(writer, chain, input(9, "u2"));
    const all = [...chain, other];
    expect(buildAnchor(all, "2026-W39", NOW, "sec").anchorHash).toBe(other.rowHash);
    expect(myActivity(all, "u1")).toHaveLength(2);
    expect(myActivity(all, "u2")).toHaveLength(1);
    expect(Object.keys(myActivity(all, "u1")[0]!)).toEqual([
      "occurredAt",
      "action",
      "resourceType",
      "outcome",
    ]);
  });
});
