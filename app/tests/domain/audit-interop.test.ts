// @vitest-environment node
// A-038 M-2: TypeScript and PostgreSQL implement one audit hash contract (nyayos-audit-v1).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  AUDIT_HASH_CONTRACT,
  type AuditEvent,
  type AuditEventInput,
  canonicalizeAuditRow,
  computeRowHash,
  fromSqlAuditRow,
  normalizeAuditTimestamp,
  verifyAuditChain,
} from "@/domain";

const read = (rel: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8"));

/** Frozen golden vectors, computed independently by PostgreSQL and TypeScript and matched before freezing. */
const vectors = read("../../../db/tests/audit_hash_vectors_v1.json") as {
  contract: string;
  vectors: {
    name: string;
    prevHash: string;
    input: AuditEventInput;
    expected: { canonical: string; rowHash: string };
  }[];
};
/** Chain written by the PostgreSQL trigger (migration 0005), exported in session time zone Asia/Kolkata. */
const sqlChain = read("../fixtures/audit_chain_sql_export_v1.json") as Record<string, unknown>[];

describe("Audit hash contract nyayos-audit-v1 — golden vectors (TypeScript side)", () => {
  it("uses the contract named in the vector file", () => {
    expect(vectors.contract).toBe(AUDIT_HASH_CONTRACT);
    expect(vectors.vectors.length).toBeGreaterThanOrEqual(12);
  });

  for (const v of vectors.vectors) {
    it(`reproduces vector ${v.name} exactly`, async () => {
      expect(canonicalizeAuditRow(v.input)).toBe(v.expected.canonical);
      expect(await computeRowHash(v.prevHash, v.input)).toBe(v.expected.rowHash);
    });
  }

  it("chains vectors: each chain link's prevHash is the previous vector's rowHash", () => {
    const byName = Object.fromEntries(vectors.vectors.map((v) => [v.name, v]));
    expect(byName["chain_2"]!.prevHash).toBe(byName["chain_1_genesis"]!.expected.rowHash);
    expect(byName["chain_3"]!.prevHash).toBe(byName["chain_2"]!.expected.rowHash);
  });
});

describe("A chain written by PostgreSQL is verified by TypeScript", () => {
  const events: AuditEvent[] = sqlChain.map(fromSqlAuditRow);

  it("the fixture really exercises non-UTC timestamps, Hindi text, nulls and every server-function action", () => {
    expect(sqlChain.every((r) => String(r["occurred_at"]).endsWith("+05:30"))).toBe(true);
    expect(JSON.stringify(sqlChain)).toMatch(/[ऀ-ॿ]/);
    expect(sqlChain.some((r) => r["tenant_id"] === null && r["ip_hash"] === null)).toBe(true);
    expect(new Set(events.map((e) => e.action))).toEqual(
      new Set([
        "membership.added",
        "dispute.created",
        "proposal.created",
        "proposal.accepted",
        "correction.created",
        "proposal.rejected",
        "deletion.requested",
        "document.scan_result",
        "auth.sign_in",
      ]),
    );
  });

  it("verifies the whole chain from genesis", async () => {
    expect(await verifyAuditChain(events)).toEqual({ ok: true, length: sqlChain.length });
  });

  it("detects a changed metadata value, a shifted microsecond and a removed row", async () => {
    const meta = events.map((e, i) =>
      i === 3 ? { ...e, metadata: { ...e.metadata, version: 99 } } : e,
    );
    expect((await verifyAuditChain(meta)).ok).toBe(false);
    const shifted = events.map((e, i) =>
      i === 2
        ? {
            ...e,
            occurredAt: e.occurredAt.replace(
              /(\d)Z$/,
              (_, d: string) => `${(Number(d) + 1) % 10}Z`,
            ),
          }
        : e,
    );
    expect(await verifyAuditChain(shifted)).toEqual({
      ok: false,
      brokenAt: 2,
      reason: "row_hash_mismatch",
    });
    expect(await verifyAuditChain(events.filter((_, i) => i !== 4))).toEqual({
      ok: false,
      brokenAt: 4,
      reason: "prev_hash_mismatch",
    });
  });
});

describe("Contract edge rules", () => {
  it("normalises timestamps to UTC with exactly six fractional digits", () => {
    expect(normalizeAuditTimestamp("2026-09-24T15:30:00.123456+05:30")).toBe(
      "2026-09-24T10:00:00.123456Z",
    );
    expect(normalizeAuditTimestamp("2026-09-24T08:31:38.57301+05:30")).toBe(
      "2026-09-24T03:01:38.573010Z",
    );
    expect(normalizeAuditTimestamp("2026-02-28T23:59:59.5-01:00")).toBe(
      "2026-03-01T00:59:59.500000Z",
    );
    expect(normalizeAuditTimestamp("2026-01-01T00:00:00Z")).toBe("2026-01-01T00:00:00.000000Z");
  });

  it("rejects timestamps it cannot represent exactly instead of guessing", () => {
    for (const bad of [
      "2026-09-24T10:00:00.1234567Z", // more than 6 digits would need rounding
      "2026-09-24T10:00:00", // no offset
      "2026-02-30T10:00:00Z", // not a calendar date
      "2026-09-24 10:00:00Z", // not ISO-8601 T separator
    ]) {
      expect(() => normalizeAuditTimestamp(bad), bad).toThrow();
    }
  });

  const base = vectors.vectors[0]!.input;
  it("rejects values PostgreSQL text could not hold or the contract cannot encode", () => {
    expect(() => canonicalizeAuditRow({ ...base, actorId: "a\u0000b" })).toThrow(/NUL/);
    expect(() => canonicalizeAuditRow({ ...base, actorId: "a\ud800b" })).toThrow(/surrogate/);
    expect(() => canonicalizeAuditRow({ ...base, metadata: { count: 1.5 } })).toThrow(
      /safe integer/,
    );
    expect(() => canonicalizeAuditRow({ ...base, metadata: { count: 2 ** 53 } })).toThrow(
      /safe integer/,
    );
    expect(() => canonicalizeAuditRow({ ...base, tenantId: "t1" })).toThrow(/UUID/);
    expect(() => canonicalizeAuditRow({ ...base, id: "not-a-uuid" })).toThrow(/UUID/);
  });

  it('distinguishes a null from the string "null" and an empty metadata object', () => {
    const a = canonicalizeAuditRow({ ...base, purpose: null });
    const b = canonicalizeAuditRow({ ...base, purpose: "null" });
    expect(a).not.toBe(b);
    expect(canonicalizeAuditRow({ ...base, metadata: {} })).toMatch(/,\{\}\]$/);
  });

  it("refuses a malformed previous hash", async () => {
    await expect(computeRowHash("ABC", base)).rejects.toThrow(/64 lowercase hex/);
  });
});
