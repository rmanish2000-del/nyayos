// @vitest-environment node
// A-039 M-6: the deletion scope graph is explicit and gives every table a decision.
import { describe, expect, it } from "vitest";

import {
  DELETION_CLASSIFICATIONS,
  DELETION_GRAPH,
  FMA_TABLE_NAMES,
  graphUncoveredTables,
  tablesForScope,
} from "@/domain";

describe("Deletion scope graph (A-039)", () => {
  it("gives every FM-A table at least one inclusion or exclusion decision", () => {
    expect(graphUncoveredTables()).toEqual([]);
    expect(graphUncoveredTables([...FMA_TABLE_NAMES, "brand_new_table"])).toEqual([
      "brand_new_table",
    ]);
  });

  it("uses only the six classifications, and every edge carries a reason", () => {
    for (const edge of DELETION_GRAPH) {
      expect(DELETION_CLASSIFICATIONS).toContain(edge.classification);
      expect(edge.reason.length, `${edge.table}/${edge.scope}`).toBeGreaterThan(8);
    }
  });

  it("has no duplicate (table, scope, edge) entries", () => {
    const keys = DELETION_GRAPH.map((x) => `${x.table}|${x.scope}|${x.edge}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("covers documents and quarantine uploads in dispute and document scope (the M-6 gap)", () => {
    for (const scope of ["dispute", "document"] as const) {
      for (const table of [
        "documents",
        "document_versions",
        "document_locations",
        "annotations",
        "custody_events",
        "quarantine_uploads",
        "jobs",
      ]) {
        expect(
          DELETION_GRAPH.some(
            (x) => x.scope === scope && x.table === table && x.classification === "purge_candidate",
          ),
          `${scope}/${table}`,
        ).toBe(true);
      }
    }
    expect(tablesForScope("dispute")).toEqual(
      expect.arrayContaining(["documents", "quarantine_uploads", "jobs", "exports"]),
    );
  });

  it("never marks audit, tombstones or workflow records as purge candidates", () => {
    for (const edge of DELETION_GRAPH.filter((x) =>
      [
        "audit_events",
        "audit_anchors",
        "deletion_ledger",
        "deletion_requests",
        "retention_records",
      ].includes(x.table),
    )) {
      expect(edge.classification, `${edge.table}/${edge.scope}`).toBe("retained_audit_metadata");
    }
  });

  it("keeps a document deletion inside the document: no dispute root, facts are references not purges", () => {
    const doc = tablesForScope("document");
    expect(doc).not.toContain("disputes");
    expect(doc).not.toContain("events");
    expect(
      DELETION_GRAPH.filter(
        (x) => x.scope === "document" && x.edge === "source_ref.documentId",
      ).every((x) => x.classification === "outside_request_scope"),
    ).toBe(true);
  });

  it("excludes only tables that hold no case data", () => {
    expect(
      DELETION_GRAPH.filter((x) => x.scope === "none")
        .map((x) => x.table)
        .sort(),
    ).toEqual([
      "audit_anchors",
      "config_provisional",
      "deletion_allowlist",
      "intake_questions",
      "notices",
    ]);
  });
});
