// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  CANONICAL_TARGET_TYPES,
  DEFAULT_PROV_CONFIG,
  DeletionScopeError,
  type DocumentVersion,
  type Event,
  type Proposition,
  PROHIBITED_TERMS,
  REQUIRED_COPY,
  buildExportManifest,
  deletionStatus,
  findProhibitedTerms,
  newDeletionRequest,
  referenceCheck,
  resolveProvConfig,
  serviceContext,
  tablesForScope,
  transitionDeletion,
  userContext,
  verifyManifestAgainstStored,
} from "@/domain";

const NOW = "2026-09-23T10:00:00.000Z";
const owner = userContext(
  {
    userId: "u1",
    sessionId: "s1",
    tenantId: "t1",
    tenantRole: "tenant_owner",
    disputeMemberships: [{ disputeId: "d1", role: "dispute_owner" }],
  },
  { now: NOW },
);

const version: DocumentVersion = {
  id: "v1",
  documentId: "doc1",
  version: 1,
  sha256: "a".repeat(64),
  sizeBytes: 10,
  sniffedMime: "application/pdf",
  pageCount: 1,
  originalFilename: "invoice.pdf",
  uploaderId: "u1",
  ingestTs: NOW,
  clientReportedMtime: null,
  scanResult: "clean",
  storagePath: "t1/d1/doc1/1",
  languageDetected: null,
};

const complete: Event = {
  id: "e1",
  itemType: "event",
  tenantId: "t1",
  disputeId: "d1",
  verificationStatus: "confirmed",
  version: 2,
  createdAt: NOW,
  text: "Goods delivered on 14 July 2026",
  provenance: {
    originType: "document_extraction",
    sourceRef: {
      kind: "document",
      documentId: "doc1",
      documentVersionId: "v1",
      locationId: "loc1",
    },
    confidence: "high",
    recordedBy: "u1",
    recordedAt: NOW,
  },
};

const incomplete: Event = {
  ...complete,
  id: "e2",
  text: "Payment was late",
  // origin says document extraction but the source is a bare user entry: chain incomplete
  provenance: {
    ...complete.provenance,
    originType: "document_extraction",
    sourceRef: { kind: "user_entry", enteredBy: "u1" },
  },
};

describe("Export manifest (F16, AC-M5-01/02/04, Deck G4)", () => {
  it("includes complete items, excludes and lists incomplete ones, and carries both statements", async () => {
    const { manifest, manifestSha256 } = await buildExportManifest({
      exportId: "x1",
      disputeId: "d1",
      requestedBy: "u1",
      generatedAt: NOW,
      exportVersion: 1,
      language: "en",
      items: [complete, incomplete],
      documentVersions: [version],
    });
    expect(manifest.items.map((i) => i.targetId)).toEqual(["e1"]);
    expect(manifest.omissions).toEqual([
      { targetType: "event", targetId: "e2", reason: "incomplete_provenance" },
    ]);
    expect(manifest.items[0]!.targetType).toBe("event");
    expect(manifest.documents[0]).toMatchObject({ documentId: "doc1", sha256: "a".repeat(64) });
    expect(manifest.statements.noAi).toBe(REQUIRED_COPY.export_no_ai.en);
    expect(manifest.statements.integrityScope).not.toMatch(/admissib|court|evidence act/i);
    expect(manifestSha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic and verifies against stored originals (FN-11)", async () => {
    const args = {
      exportId: "x1",
      disputeId: "d1",
      requestedBy: "u1",
      generatedAt: NOW,
      exportVersion: 1,
      language: "hi" as const,
      items: [complete],
      documentVersions: [version],
    };
    const a = await buildExportManifest(args);
    const b = await buildExportManifest(args);
    expect(a.manifestSha256).toBe(b.manifestSha256);
    expect(verifyManifestAgainstStored(a.manifest, [version])).toEqual({ ok: true });
    expect(
      verifyManifestAgainstStored(a.manifest, [{ ...version, sha256: "b".repeat(64) }]),
    ).toEqual({ ok: false, mismatches: [{ documentId: "doc1", version: 1 }] });
  });

  it("names every canonical item type explicitly — an event and a proposition are never conflated (A-033 M-5)", async () => {
    const proposition: Proposition = {
      ...complete,
      id: "p1",
      itemType: "proposition",
      text: "The invoice was paid late",
    };
    const { manifest } = await buildExportManifest({
      exportId: "x",
      disputeId: "d1",
      requestedBy: "u1",
      generatedAt: NOW,
      exportVersion: 1,
      language: "en",
      items: [complete, proposition],
      documentVersions: [version],
    });
    expect(manifest.items.map((i) => [i.targetId, i.targetType])).toEqual([
      ["e1", "event"],
      ["p1", "proposition"],
    ]);
    for (const entry of manifest.items) expect(CANONICAL_TARGET_TYPES).toContain(entry.targetType);
  });

  it("contains no prohibited wording in either language", async () => {
    for (const language of ["en", "hi"] as const) {
      const { manifest } = await buildExportManifest({
        exportId: "x",
        disputeId: "d1",
        requestedBy: "u1",
        generatedAt: NOW,
        exportVersion: 1,
        language,
        items: [complete],
        documentVersions: [version],
      });
      expect(findProhibitedTerms(JSON.stringify(manifest.statements))).toEqual([]);
    }
  });
});

describe("Deletion lifecycle (F17, S9, AC-M6-04, FN-12)", () => {
  const cfg = DEFAULT_PROV_CONFIG;
  const worker = serviceContext("deletion_worker", { now: NOW });
  const operator = userContext(
    {
      userId: "sec",
      sessionId: "s",
      tenantId: "t-platform",
      tenantRole: "tenant_owner",
      platformRoles: ["platform_security"],
    },
    { now: NOW },
  );

  it("opens an undo window of the configured length and reports an honest status at every step", () => {
    const req = newDeletionRequest(
      owner,
      { id: "del1", tenantId: "t1", scopeType: "dispute", scopeId: "d1" },
      cfg,
    );
    expect(new Date(req.undoUntil).getTime() - new Date(NOW).getTime()).toBe(7 * 86_400_000);
    expect(deletionStatus(req, cfg)).toMatchObject({
      phase: "requested",
      isComplete: false,
      undoUntil: req.undoUntil,
    });

    // undo before window closes
    expect(transitionDeletion(owner, req, { type: "undo" })).toMatchObject({
      ok: true,
      request: { state: "undone" },
    });

    // window closes
    const later = { ...owner, now: "2026-10-01T00:00:00.000Z" };
    const locked = transitionDeletion(later, req, { type: "window_closed" });
    if (!locked.ok) throw new Error(locked.code);
    expect(locked.request.state).toBe("locked");
    expect(transitionDeletion(later, req, { type: "undo" })).toEqual({
      ok: false,
      code: "undo_window_closed",
    });

    // purge by the worker only
    expect(transitionDeletion(owner, locked.request, { type: "purge_started" })).toEqual({
      ok: false,
      code: "service_identity_required",
    });
    const purging = transitionDeletion(worker, locked.request, { type: "purge_started" });
    if (!purging.ok) throw new Error(purging.code);
    expect(deletionStatus(purging.request, cfg)).toMatchObject({
      phase: "in_progress",
      isComplete: false,
    });

    const purged = transitionDeletion(
      worker,
      purging.request,
      { type: "purge_completed" },
      "ledger1",
    );
    if (!purged.ok) throw new Error(purged.code);
    expect(purged.ledger).toEqual({
      id: "ledger1",
      tenantId: "t1",
      scopeType: "dispute",
      scopeId: "d1",
      completedAt: NOW,
    });
    expect(Object.keys(purged.ledger!)).not.toContain("sha256"); // OL-03 interim: content-free tombstone
    const status = deletionStatus(purged.request, cfg);
    expect(status).toMatchObject({
      phase: "completed_active_systems",
      isComplete: false,
      activeSystemsCompletedAt: NOW,
    });
    expect(new Date(status.backupExpiryDate).getTime() - new Date(NOW).getTime()).toBe(
      35 * 86_400_000,
    );

    // verification by platform_security only; incomplete is never shown as complete
    expect(transitionDeletion(owner, purged.request, { type: "verified", result: "pass" })).toEqual(
      { ok: false, code: "operator_required" },
    );
    const incomplete = transitionDeletion(operator, purged.request, {
      type: "verified",
      result: "incomplete",
    });
    if (!incomplete.ok) throw new Error(incomplete.code);
    expect(deletionStatus(incomplete.request, cfg)).toMatchObject({
      phase: "in_progress",
      isComplete: false,
    });
    const verified = transitionDeletion(operator, purged.request, {
      type: "verified",
      result: "pass",
    });
    if (!verified.ok) throw new Error(verified.code);
    expect(deletionStatus(verified.request, cfg)).toMatchObject({
      phase: "verified",
      isComplete: true,
    });
  });

  it("verifies ownership of the scope before a request exists (A-033 C-2)", () => {
    const strangerInSameTenant = userContext(
      { userId: "u2", sessionId: "s2", tenantId: "t1", tenantRole: "tenant_owner" },
      { now: NOW },
    );
    const otherTenant = userContext(
      { userId: "u3", sessionId: "s3", tenantId: "t2", tenantRole: "tenant_owner" },
      { now: NOW },
    );
    const forDispute = { id: "del", tenantId: "t1", scopeType: "dispute" as const, scopeId: "d1" };
    expect(() => newDeletionRequest(strangerInSameTenant, forDispute, cfg)).toThrow(
      DeletionScopeError,
    );
    expect(() => newDeletionRequest(otherTenant, forDispute, cfg)).toThrow(/cross_tenant/);
    expect(() =>
      newDeletionRequest(
        owner,
        { ...forDispute, scopeType: "account", scopeId: "someone-else" },
        cfg,
      ),
    ).toThrow(/not_self/);
    expect(() =>
      newDeletionRequest(owner, { ...forDispute, scopeType: "document", scopeId: "doc1" }, cfg),
    ).toThrow(/dispute_required/);
    expect(() =>
      newDeletionRequest(
        strangerInSameTenant,
        { ...forDispute, scopeType: "document", scopeId: "doc1", disputeId: "d1" },
        cfg,
      ),
    ).toThrow(/not_document_editor/);
    const ok = newDeletionRequest(
      owner,
      { ...forDispute, scopeType: "document", scopeId: "doc1", disputeId: "d1" },
      cfg,
    );
    expect(ok).toMatchObject({ scopeType: "document", scopeId: "doc1", requestedBy: "u1" });
    expect("disputeId" in ok).toBe(false);
  });

  it("reference check follows the configured policy (Deck G5 vs SEC-DEL-01 reconciliation item)", () => {
    const refs = [{ targetType: "evidence_relation", targetId: "rel1" }];
    expect(referenceCheck(refs, cfg)).toEqual({
      ok: false,
      code: "blocked_by_references",
      references: refs,
    });
    expect(
      referenceCheck(refs, resolveProvConfig({ document_reference_policy: "cascade" })),
    ).toEqual({ ok: true, cascade: refs });
    expect(referenceCheck([], cfg)).toEqual({ ok: true, cascade: [] });
  });

  it("enumerates scoped tables from the allow-list and never touches retained tables", () => {
    const account = tablesForScope("account");
    expect(account).toContain("disputes");
    expect(account).toContain("profiles");
    expect(account).toContain("consents");
    for (const retained of [
      "audit_events",
      "audit_anchors",
      "deletion_ledger",
      "retention_records",
    ])
      expect(account).not.toContain(retained);
    expect(tablesForScope("document")).toEqual(
      expect.arrayContaining([
        "document_versions",
        "document_locations",
        "annotations",
        "custody_events",
      ]),
    );
    expect(tablesForScope("document")).not.toContain("disputes");
  });

  it("rejects non-positive configuration values", () => {
    expect(() => resolveProvConfig({ deletion_undo_window_days: 0 })).toThrow(/positive/);
  });
});

describe("Required copy and prohibited wording (FN-16, SEC-LANG-04)", () => {
  it("every required copy key has both Hindi and English text and no prohibited terms", () => {
    for (const [key, value] of Object.entries(REQUIRED_COPY)) {
      expect(value.en.length, key).toBeGreaterThan(0);
      expect(value.hi.length, key).toBeGreaterThan(0);
      expect(/[ऀ-ॿ]/.test(value.hi), `${key} hi must contain Devanagari`).toBe(true);
      expect(findProhibitedTerms(value.en), key).toEqual([]);
    }
  });

  it("the guard catches outcome, legal-deadline and marketplace language", () => {
    expect(
      findProhibitedTerms(
        "Your success probability is high; the statutory deadline is Friday; see top advocates",
      ),
    ).toEqual(["success probability", "statutory deadline", "top advocates"]);
    expect(PROHIBITED_TERMS.length).toBeGreaterThan(15);
  });
});
