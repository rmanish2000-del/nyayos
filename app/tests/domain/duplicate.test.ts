// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  type KnownVersion,
  REQUIRED_COPY,
  assessDuplicate,
  duplicateAuditMetadata,
  findDuplicateVersions,
  findProhibitedTerms,
  sha256Hex,
} from "@/domain";

const A = "a".repeat(64);
const B = "b".repeat(64);
const T1 = "2026-09-20T10:00:00.000Z";
const T2 = "2026-09-21T10:00:00.000Z";

const known: KnownVersion[] = [
  {
    tenantId: "t1",
    disputeId: "d1",
    documentId: "doc1",
    version: 1,
    sha256: A,
    displayLabel: "Invoice",
    ingestTs: T1,
  },
  {
    tenantId: "t1",
    disputeId: "d2",
    documentId: "doc2",
    version: 1,
    sha256: A,
    displayLabel: "Invoice copy",
    ingestTs: T2,
  },
  {
    tenantId: "t1",
    disputeId: "d1",
    documentId: "doc3",
    version: 2,
    sha256: B,
    displayLabel: "Chat export",
    ingestTs: T1,
  },
  // same bytes, different tenant: must never be reported
  {
    tenantId: "t2",
    disputeId: "d9",
    documentId: "doc9",
    version: 1,
    sha256: A,
    displayLabel: "Foreign",
    ingestTs: T1,
  },
];

describe("Duplicate Detection V1 (A-036) — hash level, tenant-scoped, informational", () => {
  it("reports every identical version in the same tenant, same-dispute matches first", () => {
    const matches = findDuplicateVersions({ sha256: A, tenantId: "t1", disputeId: "d2" }, known);
    expect(matches.map((m) => [m.documentId, m.sameDispute])).toEqual([
      ["doc2", true],
      ["doc1", false],
    ]);
  });

  it("never reports a match from another tenant, even with identical bytes", () => {
    const matches = findDuplicateVersions({ sha256: A, tenantId: "t2", disputeId: "d9" }, known);
    expect(matches.map((m) => m.documentId)).toEqual(["doc9"]);
    expect(matches.some((m) => m.documentId === "doc1" || m.documentId === "doc2")).toBe(false);
  });

  it("returns none for unknown bytes and is case-insensitive on hex", () => {
    expect(
      assessDuplicate({ sha256: "c".repeat(64), tenantId: "t1", disputeId: "d1" }, known),
    ).toEqual({ kind: "none" });
    const upper = assessDuplicate(
      { sha256: B.toUpperCase(), tenantId: "t1", disputeId: "d1" },
      known,
    );
    expect(upper.kind).toBe("duplicate");
  });

  it("rejects a malformed hash instead of silently matching nothing", () => {
    expect(() =>
      findDuplicateVersions({ sha256: "not-a-hash", tenantId: "t1", disputeId: "d1" }, known),
    ).toThrow(/64 hex/);
  });

  it("is purely informational: the known list is not mutated and no verdict is produced", () => {
    const snapshot = JSON.stringify(known);
    const result = assessDuplicate({ sha256: A, tenantId: "t1", disputeId: "d1" }, known);
    expect(JSON.stringify(known)).toBe(snapshot);
    expect(result.kind).toBe("duplicate");
    expect(Object.keys(result)).not.toContain("reject");
    expect(Object.keys(result)).not.toContain("merge");
  });

  it("matches the hash the evidence module computes for real bytes", async () => {
    const bytes = new TextEncoder().encode("identical invoice bytes");
    const sha = await sha256Hex(bytes);
    const stored: KnownVersion = { ...known[0]!, sha256: sha };
    expect(
      findDuplicateVersions({ sha256: sha, tenantId: "t1", disputeId: "d1" }, [stored]),
    ).toHaveLength(1);
  });

  it("audit metadata carries ids and counts only, never a label", () => {
    const meta = duplicateAuditMetadata(
      assessDuplicate({ sha256: A, tenantId: "t1", disputeId: "d1" }, known),
    );
    expect(meta).toEqual({ count: 2, document_id: "doc1", version: 1 });
    expect(JSON.stringify(meta)).not.toMatch(/Invoice/);
  });

  it("has bilingual, non-prohibited user copy that states nothing was merged", () => {
    expect(REQUIRED_COPY.duplicate_detected.en).toMatch(/not been merged/i);
    expect(/[ऀ-ॿ]/.test(REQUIRED_COPY.duplicate_detected.hi)).toBe(true);
    expect(findProhibitedTerms(REQUIRED_COPY.duplicate_detected.en)).toEqual([]);
  });
});
