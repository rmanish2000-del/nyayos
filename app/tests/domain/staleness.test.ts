// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  type CurrentDocumentVersion,
  type CurrentItemVersion,
  type DocumentVersion,
  type Event,
  REQUIRED_COPY,
  type StalenessInput,
  assessOutputStaleness,
  buildExportManifest,
  findProhibitedTerms,
  staleOutputRows,
  summariseStalenessRows,
} from "@/domain";

// Synthetic identifiers only.
const T1 = "tenant-1";
const T2 = "tenant-2";
const D1 = "dispute-1";
const D2 = "dispute-2";
const scope = { tenantId: T1, disputeId: D1 };

const manifest = (
  items: unknown[],
  documents: unknown[] = [],
  extra: Record<string, unknown> = {},
) => ({
  exportId: "export-1",
  disputeId: D1,
  generatedAt: "2026-09-24T10:00:00.000Z",
  items,
  documents,
  ...extra,
});
const item = (
  targetType: string,
  targetId: string,
  version: unknown,
  sourceRef = `src:${targetId}`,
) => ({
  targetType,
  targetId,
  version,
  sourceRef,
});
const doc = (documentId: string, version: unknown) => ({
  documentId,
  version,
  sha256: "a".repeat(64),
});
const cur = (
  targetType: string,
  targetId: string,
  version: unknown,
  t = T1,
  d = D1,
): CurrentItemVersion => ({
  tenantId: t,
  disputeId: d,
  targetType,
  targetId,
  version,
});
const curDoc = (
  documentId: string,
  currentVersion: unknown,
  t = T1,
  d = D1,
): CurrentDocumentVersion => ({
  tenantId: t,
  disputeId: d,
  documentId,
  currentVersion,
});

function deepFreeze<T>(o: T): T {
  if (o && typeof o === "object") {
    Object.freeze(o);
    for (const v of Object.values(o as object)) deepFreeze(v);
  }
  return o;
}

describe("Stale Output Detection V1 (A-037) — version comparison only", () => {
  it("1. a manifest whose every entry matches the current version is CURRENT", () => {
    const a = assessOutputStaleness({
      scope,
      manifest: manifest([item("event", "e1", 2)], [doc("doc-1", 1)]),
      current: { items: [cur("event", "e1", 2)], documents: [curDoc("doc-1", 1)] },
    });
    expect(a).toEqual({
      status: "CURRENT",
      findings: [],
      counts: { current: 2, stale: 0, unknown: 0 },
      reviewCount: 0,
      manifestIssue: null,
    });
  });

  it("2. an older recorded version is STALE with type, id, both versions, reason and review reference", () => {
    const a = assessOutputStaleness({
      scope,
      manifest: manifest([item("event", "e1", 1, "statement:s-1")]),
      current: { items: [cur("event", "e1", 2)], documents: [] },
    });
    expect(a.status).toBe("STALE");
    expect(a.findings).toEqual([
      {
        entryKind: "item",
        itemType: "event",
        itemId: "e1",
        recordedVersion: 1,
        currentVersion: 2,
        status: "STALE",
        reason: "newer_version",
        sourceRef: "statement:s-1",
        reviewRef: "event:e1",
      },
    ]);
    expect(a.reviewCount).toBe(1);
  });

  it("3. every changed item and document is reported, in deterministic order", () => {
    const input: StalenessInput = {
      scope,
      manifest: manifest(
        [item("proposition", "p1", 1), item("event", "e1", 1), item("issue", "i1", 3)],
        [doc("doc-2", 1), doc("doc-1", 1)],
      ),
      current: {
        items: [cur("event", "e1", 3), cur("proposition", "p1", 2), cur("issue", "i1", 3)],
        documents: [curDoc("doc-1", 2), curDoc("doc-2", 1)],
      },
    };
    const a = assessOutputStaleness(input);
    expect(a.status).toBe("STALE");
    expect(
      a.findings.map((f) => [f.itemType, f.itemId, f.recordedVersion, f.currentVersion]),
    ).toEqual([
      ["document", "doc-1", 1, 2],
      ["event", "e1", 1, 3],
      ["proposition", "p1", 1, 2],
    ]);
    expect(a.counts).toEqual({ current: 2, stale: 3, unknown: 0 });
    // shuffled inputs give the identical result
    const shuffled: StalenessInput = {
      ...input,
      manifest: manifest(
        [item("issue", "i1", 3), item("event", "e1", 1), item("proposition", "p1", 1)],
        [doc("doc-1", 1), doc("doc-2", 1)],
      ),
      current: {
        items: [...input.current.items].reverse(),
        documents: [...input.current.documents].reverse(),
      },
    };
    expect(assessOutputStaleness(shuffled)).toEqual(a);
  });

  it("4. a missing canonical version is UNKNOWN, never CURRENT, and reports no current version", () => {
    const a = assessOutputStaleness({
      scope,
      manifest: manifest([item("event", "gone", 1)], [doc("doc-gone", 1)]),
      current: {
        items: [],
        documents: [curDoc("doc-gone", 1, T1, D1)].map((d) => ({ ...d, status: "deleted" })),
      },
    });
    expect(a.status).toBe("UNKNOWN");
    expect(a.findings.map((f) => [f.itemId, f.reason, f.currentVersion])).toEqual([
      ["doc-gone", "not_found_or_inaccessible", null],
      ["gone", "not_found_or_inaccessible", null],
    ]);
  });

  it("5. malformed input fails safely as UNKNOWN and never throws", () => {
    for (const bad of [
      null,
      "text",
      42,
      [],
      { items: [], documents: [] },
      { disputeId: D1, items: "x", documents: [] },
    ]) {
      const a = assessOutputStaleness({
        scope,
        manifest: bad,
        current: { items: [], documents: [] },
      });
      expect(a.status).toBe("UNKNOWN");
      expect(a.manifestIssue).toBe("malformed_manifest");
    }
    const a = assessOutputStaleness({
      scope,
      manifest: manifest(
        [
          item("event", "e-str", "2"),
          item("event", "e-frac", 1.5),
          item("event", "e-zero", 0),
          { targetType: "event", version: 1 },
          item("dispute_statement", "st-1", 1),
          item("event", "e-ahead", 5),
          item("event", "e-badcur", 1),
          item("event", "e-dup", 1),
        ],
        [{ version: 1 }, doc("doc-x", "one")],
      ),
      current: {
        items: [
          cur("event", "e-str", 2),
          cur("event", "e-ahead", 2),
          cur("event", "e-badcur", "one"),
          cur("event", "e-dup", 1),
          cur("event", "e-dup", 2),
        ],
        documents: [curDoc("doc-x", 1)],
      },
    });
    expect(a.status).toBe("UNKNOWN");
    const byId = Object.fromEntries(a.findings.map((f) => [f.itemId, f.reason]));
    expect(byId).toEqual({
      "documents[0]": "malformed_entry",
      "doc-x": "malformed_recorded_version",
      "e-ahead": "recorded_version_ahead",
      "e-badcur": "malformed_current_version",
      "e-dup": "ambiguous_current_version",
      "e-frac": "malformed_recorded_version",
      "e-str": "malformed_recorded_version",
      "e-zero": "malformed_recorded_version",
      "items[3]": "malformed_entry",
      "st-1": "unsupported_item_type",
    });
    expect(a.findings.every((f) => f.status === "UNKNOWN")).toBe(true);
  });

  it("6. another tenant's versions are invisible: identical ids in tenant 2 are ignored and never reported", () => {
    const a = assessOutputStaleness({
      scope,
      manifest: manifest([item("event", "e1", 1)], [doc("doc-1", 1)]),
      current: { items: [cur("event", "e1", 7, T2, D1)], documents: [curDoc("doc-1", 9, T2, D1)] },
    });
    expect(a.status).toBe("UNKNOWN");
    expect(a.findings.map((f) => [f.reason, f.currentVersion])).toEqual([
      ["not_found_or_inaccessible", null],
      ["not_found_or_inaccessible", null],
    ]);
    expect(JSON.stringify(a)).not.toMatch(/tenant-2|"currentVersion":(7|9)/);
  });

  it("7. another dispute's records do not leak, and a manifest from another dispute is not assessed", () => {
    const a = assessOutputStaleness({
      scope,
      manifest: manifest([item("event", "e-other", 1)]),
      current: { items: [cur("event", "e-other", 4, T1, D2)], documents: [] },
    });
    expect(a.findings).toEqual([
      expect.objectContaining({
        itemId: "e-other",
        reason: "not_found_or_inaccessible",
        currentVersion: null,
      }),
    ]);
    const mismatch = assessOutputStaleness({
      scope,
      manifest: manifest([item("event", "e1", 1)], [], { disputeId: D2 }),
      current: { items: [cur("event", "e1", 2, T1, D2)], documents: [] },
    });
    expect(mismatch.status).toBe("UNKNOWN");
    expect(mismatch.manifestIssue).toBe("dispute_mismatch");
    expect(mismatch.findings).toHaveLength(1);
    expect(mismatch.findings[0]!.entryKind).toBe("manifest");
  });

  it("8. assessment mutates nothing (deep-frozen inputs, identical before and after)", () => {
    const input = deepFreeze<StalenessInput>({
      scope,
      manifest: manifest([item("event", "e1", 1)], [doc("doc-1", 1)]),
      current: { items: [cur("event", "e1", 2)], documents: [curDoc("doc-1", 1)] },
    });
    const before = JSON.stringify(input);
    expect(() => assessOutputStaleness(input)).not.toThrow();
    expect(JSON.stringify(input)).toBe(before);
  });

  it("does not infer currentness from timestamps", () => {
    const base = { scope, current: { items: [cur("event", "e1", 2)], documents: [] } };
    const old = assessOutputStaleness({
      ...base,
      manifest: manifest([item("event", "e1", 2)], [], { generatedAt: "2001-01-01T00:00:00.000Z" }),
    });
    const future = assessOutputStaleness({
      ...base,
      manifest: manifest([item("event", "e1", 2)], [], { generatedAt: "2099-01-01T00:00:00.000Z" }),
    });
    expect(old).toEqual(future);
    expect(old.status).toBe("CURRENT");
  });

  it("zero rows (output not readable by this caller) is UNKNOWN; precedence is STALE > UNKNOWN > CURRENT", () => {
    expect(summariseStalenessRows([]).status).toBe("UNKNOWN");
    const rows = staleOutputRows({
      scope,
      manifest: manifest([item("event", "e1", 1), item("event", "gone", 1)]),
      current: { items: [cur("event", "e1", 2)], documents: [] },
    });
    const a = summariseStalenessRows(rows);
    expect(a.status).toBe("STALE");
    expect(a.counts).toEqual({ current: 0, stale: 1, unknown: 1 });
    expect(a.reviewCount).toBe(2);
  });

  it("works on a manifest produced by buildExportManifest", async () => {
    const NOW = "2026-09-24T10:00:00.000Z";
    const ev: Event = {
      id: "e1",
      itemType: "event",
      tenantId: T1,
      disputeId: D1,
      verificationStatus: "confirmed",
      version: 2,
      createdAt: NOW,
      text: "Synthetic delivery event",
      provenance: {
        originType: "user_statement",
        sourceRef: { kind: "statement", statementId: "s1" },
        confidence: "unknown",
        recordedBy: "u1",
        recordedAt: NOW,
      },
    };
    const v: DocumentVersion = {
      id: "v1",
      documentId: "doc-1",
      version: 1,
      sha256: "a".repeat(64),
      sizeBytes: 10,
      sniffedMime: "application/pdf",
      pageCount: 1,
      originalFilename: "synthetic.pdf",
      uploaderId: "u1",
      ingestTs: NOW,
      clientReportedMtime: null,
      scanResult: "clean",
      storagePath: "t/d/doc-1/1",
      languageDetected: null,
    };
    const { manifest: built } = await buildExportManifest({
      exportId: "export-1",
      disputeId: D1,
      requestedBy: "u1",
      generatedAt: NOW,
      exportVersion: 1,
      language: "en",
      items: [ev],
      documentVersions: [v],
    });
    const current = { items: [cur("event", "e1", 2)], documents: [curDoc("doc-1", 1)] };
    expect(assessOutputStaleness({ scope, manifest: built, current }).status).toBe("CURRENT");
    const later = { items: [cur("event", "e1", 3)], documents: [curDoc("doc-1", 2)] };
    expect(assessOutputStaleness({ scope, manifest: built, current: later }).counts.stale).toBe(2);
  });

  it("has bilingual, non-prohibited copy that says the export and originals are unchanged", () => {
    for (const key of [
      "stale_output_title",
      "stale_output_stale",
      "stale_output_unknown",
      "stale_output_unchanged",
      "stale_output_review",
      "stale_output_unreadable",
    ] as const) {
      expect(/[ऀ-ॿ]/.test(REQUIRED_COPY[key].hi), key).toBe(true);
      expect(findProhibitedTerms(REQUIRED_COPY[key].en), key).toEqual([]);
    }
    expect(REQUIRED_COPY.stale_output_unchanged.en).toMatch(/has not been changed or replaced/);
    expect(REQUIRED_COPY.stale_output_unchanged.en).toMatch(/original documents are unchanged/);
  });
});
