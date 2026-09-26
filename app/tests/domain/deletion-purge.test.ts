// @vitest-environment node
// A-040 M-3: the purge worker's rules — graph-driven candidates, gate, honest outcome, worker-only transitions.
import { describe, expect, it } from "vitest";

import {
  DELETION_CLASSIFICATIONS,
  DELETION_GRAPH,
  DELETION_PURGE_ORDER,
  type DeletionRequest,
  type EnumeratedRecord,
  purgeCandidates,
  purgeGate,
  purgeOutcome,
  serviceContext,
  transitionDeletion,
  userContext,
} from "@/domain";

const NOW = "2026-10-10T10:00:00.000Z";
const closed = { state: "requested" as const, undoUntil: "2026-10-01T00:00:00.000Z" };
const row = (
  classification: EnumeratedRecord["classification"],
  reason = "dispute_child",
  recordId: string | null = "r1",
): EnumeratedRecord => ({ table: "events", recordId, classification, reason });

describe("Deletion purge worker rules (A-040)", () => {
  it("orders every purge-candidate table of the graph exactly once", () => {
    const candidates = new Set(
      DELETION_GRAPH.filter((x) => x.classification === "purge_candidate").map((x) => x.table),
    );
    expect(new Set(DELETION_PURGE_ORDER)).toEqual(candidates);
    expect(new Set(DELETION_PURGE_ORDER).size).toBe(DELETION_PURGE_ORDER.length);
  });

  it("never orders audit, tombstone, workflow or configuration tables for deletion", () => {
    for (const t of [
      "audit_events",
      "audit_anchors",
      "deletion_ledger",
      "deletion_requests",
      "retention_records",
      "consents",
      "platform_roles",
      "config_provisional",
    ]) {
      expect(DELETION_PURGE_ORDER as readonly string[]).not.toContain(t);
    }
  });

  it("deletes children before their parents", () => {
    const at = (t: (typeof DELETION_PURGE_ORDER)[number]) => DELETION_PURGE_ORDER.indexOf(t);
    const edges: [(typeof DELETION_PURGE_ORDER)[number], (typeof DELETION_PURGE_ORDER)[number]][] =
      [
        ["annotations", "document_locations"],
        ["document_locations", "document_versions"],
        ["document_versions", "documents"],
        ["custody_events", "documents"],
        ["evidence_items", "documents"],
        ["evidence_relations", "evidence_items"],
        ["entity_source_forms", "entities"],
        ["user_corrections", "proposals"],
        ["export_manifests", "exports"],
        ["jobs", "quarantine_uploads"],
        ["documents", "disputes"],
        ["dispute_roles", "disputes"],
        ["tenant_memberships", "tenants"],
        ["disputes", "tenants"],
      ];
    for (const [child, parent] of edges)
      expect(at(child), `${child} < ${parent}`).toBeLessThan(at(parent));
  });

  it("selects purge candidates only — every other classification is preserved", () => {
    const rows = DELETION_CLASSIFICATIONS.map((c) => row(c));
    expect(purgeCandidates(rows).map((r) => r.classification)).toEqual(["purge_candidate"]);
    expect(purgeCandidates([row("purge_candidate", "x", null)])).toEqual([]); // aggregated rows carry no id
  });

  it("refuses to purge during the undo window, after undo, under legal hold, or twice", () => {
    expect(purgeGate({ ...closed, undoUntil: "2026-10-11T00:00:00.000Z" }, [], NOW)).toBe(
      "undo_window_active",
    );
    expect(purgeGate({ ...closed, undoUntil: NOW }, [], NOW)).toBe("undo_window_active");
    expect(purgeGate({ ...closed, state: "undone" }, [], NOW)).toBe("request_undone");
    expect(purgeGate({ ...closed, state: "purged" }, [], NOW)).toBe("already_purged");
    expect(purgeGate({ ...closed, state: "verified" }, [], NOW)).toBe("already_purged");
    expect(purgeGate(closed, [row("purge_candidate"), row("retained_legal_hold")], NOW)).toBe(
      "legal_hold_active",
    );
    expect(
      purgeGate(closed, [row("blocked_active_reference", "legal_hold_on_owned_dispute")], NOW),
    ).toBe("legal_hold_active");
    expect(
      purgeGate(closed, [row("purge_candidate"), row("blocked_active_reference")], NOW),
    ).toBeNull();
    for (const state of ["locked", "incomplete"] as const) {
      expect(purgeGate({ ...closed, state }, [row("purge_candidate")], NOW)).toBeNull();
    }
  });

  it("reports incomplete, never complete, when anything was kept or blocked", () => {
    expect(purgeOutcome(0, [row("purge_candidate"), row("retained_audit_metadata")])).toBe(
      "purged",
    );
    expect(purgeOutcome(0, [row("configuration_controlled")])).toBe("purged");
    expect(purgeOutcome(1, [row("purge_candidate")])).toBe("incomplete");
    expect(purgeOutcome(0, [row("blocked_active_reference", "x", null)])).toBe("incomplete");
  });

  it("lets only the deletion worker record an incomplete purge", () => {
    const req: DeletionRequest = {
      id: "del1",
      tenantId: "t1",
      scopeType: "dispute",
      scopeId: "d1",
      requestedBy: "u1",
      state: "purging",
      undoUntil: "2026-10-01T00:00:00.000Z",
      createdAt: "2026-09-24T00:00:00.000Z",
      lockedAt: "2026-10-01T00:00:00.000Z",
      purgedAt: null,
    };
    const owner = userContext(
      { userId: "u1", sessionId: "s1", tenantId: "t1", tenantRole: "tenant_owner" },
      { now: NOW },
    );
    const worker = serviceContext("deletion_worker", { now: NOW });
    expect(transitionDeletion(owner, req, { type: "purge_incomplete" })).toEqual({
      ok: false,
      code: "service_identity_required",
    });
    expect(transitionDeletion(worker, req, { type: "purge_incomplete" })).toMatchObject({
      ok: true,
      request: { state: "incomplete", purgedAt: null },
      ledger: null,
    });
    expect(
      transitionDeletion(worker, { ...req, state: "locked" }, { type: "purge_incomplete" }),
    ).toEqual({ ok: false, code: "illegal_transition" });
  });
});
