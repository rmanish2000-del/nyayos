// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  DEFAULT_PROV_CONFIG,
  type Document,
  type DocumentVersion,
  FEATURE_FLAGS,
  acceptUpload,
  assertVersionImmutable,
  replaceDocument,
  serviceContext,
  sha256Hex,
  sniffMime,
  transitionUpload,
  userContext,
} from "@/domain";

const NOW = "2026-09-23T10:00:00.000Z";
const scanner = serviceContext("scan_worker", { now: NOW });
const promoter = serviceContext("promote_worker", { now: NOW });
const user = userContext(
  { userId: "u1", sessionId: "s1", tenantId: "t1", tenantRole: "tenant_owner" },
  { now: NOW },
);

describe("SHA-256 (SEC-HASH-01)", () => {
  it("matches the published test vector for 'abc'", async () => {
    expect(await sha256Hex(new TextEncoder().encode("abc"))).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});

describe("MIME sniffing and acceptance (SEC-UPL-01, -03, -04; FN-03)", () => {
  const flags = FEATURE_FLAGS;
  it("rejects an executable renamed .pdf on sniff", () => {
    const sniffed = sniffMime(new Uint8Array([0x4d, 0x5a, 0x90, 0x00]));
    expect(sniffed).toBe("application/x-msdownload");
    expect(
      acceptUpload(
        { declaredMime: "application/pdf", sniffedMime: sniffed, sizeBytes: 10, pageCount: 1 },
        DEFAULT_PROV_CONFIG,
        flags,
      ),
    ).toEqual({
      ok: false,
      code: "type_not_accepted",
    });
  });

  it("accepts PDF, JPEG, PNG and plain text when declared and sniffed types agree", () => {
    const cases: [Uint8Array, string][] = [
      [new Uint8Array([0x25, 0x50, 0x44, 0x46]), "application/pdf"],
      [new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), "image/jpeg"],
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "image/png"],
      [new TextEncoder().encode("Invoice dated 14 July"), "text/plain"],
    ];
    for (const [head, mime] of cases) {
      expect(
        acceptUpload(
          { declaredMime: mime, sniffedMime: sniffMime(head), sizeBytes: 100, pageCount: null },
          DEFAULT_PROV_CONFIG,
          flags,
        ),
      ).toEqual({ ok: true, mime });
    }
  });

  it("rejects a declared/sniffed mismatch", () => {
    expect(
      acceptUpload(
        {
          declaredMime: "image/png",
          sniffedMime: "application/pdf",
          sizeBytes: 100,
          pageCount: null,
        },
        DEFAULT_PROV_CONFIG,
        flags,
      ),
    ).toEqual({
      ok: false,
      code: "type_mismatch",
    });
  });

  it("rejects DOCX with a distinct code while ff_docx is off", () => {
    expect(
      acceptUpload(
        {
          declaredMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          sniffedMime: "application/zip",
          sizeBytes: 100,
          pageCount: null,
        },
        DEFAULT_PROV_CONFIG,
        flags,
      ),
    ).toEqual({ ok: false, code: "docx_disabled" });
  });

  it("rejects oversized files and page bombs", () => {
    expect(
      acceptUpload(
        {
          declaredMime: "application/pdf",
          sniffedMime: "application/pdf",
          sizeBytes: DEFAULT_PROV_CONFIG.upload_max_bytes + 1,
          pageCount: 1,
        },
        DEFAULT_PROV_CONFIG,
        flags,
      ),
    ).toEqual({
      ok: false,
      code: "too_large",
    });
    expect(
      acceptUpload(
        {
          declaredMime: "application/pdf",
          sniffedMime: "application/pdf",
          sizeBytes: 10,
          pageCount: 10_000,
        },
        DEFAULT_PROV_CONFIG,
        flags,
      ),
    ).toEqual({
      ok: false,
      code: "too_many_pages",
    });
  });
});

describe("Upload state machine (S5, AC-M0-05, Deck slide 11)", () => {
  it("walks received → quarantined → scanning → clean → promoted", () => {
    const landed = transitionUpload(user, "received", {
      type: "bytes_landed",
      sha256: "a".repeat(64),
      sizeBytes: 1,
      sniffedMime: "application/pdf",
    });
    expect(landed).toEqual({
      ok: true,
      state: "quarantined",
      custody: ["ingested", "quarantined"],
    });
    expect(transitionUpload(scanner, "quarantined", { type: "scan_started" })).toMatchObject({
      ok: true,
      state: "scanning",
    });
    expect(
      transitionUpload(scanner, "scanning", {
        type: "scan_result",
        verdict: "clean",
        providerVersion: "v1",
      }),
    ).toMatchObject({ ok: true, state: "clean" });
    expect(transitionUpload(promoter, "clean", { type: "promote" })).toEqual({
      ok: true,
      state: "promoted",
      custody: ["promoted"],
    });
  });

  it("never promotes without a positive clean verdict", () => {
    for (const state of ["received", "quarantined", "scanning", "rejected"] as const) {
      expect(transitionUpload(promoter, state, { type: "promote" })).toEqual({
        ok: false,
        code: "promotion_requires_clean_verdict",
      });
    }
  });

  it("an unavailable or failed scan leaves the object quarantined (no timeout promotion)", () => {
    for (const verdict of ["unavailable", "failed"] as const) {
      expect(
        transitionUpload(scanner, "scanning", {
          type: "scan_result",
          verdict,
          providerVersion: "v1",
        }),
      ).toMatchObject({ ok: true, state: "quarantined" });
    }
  });

  it("an infected verdict rejects, and rejected objects can only be purged", () => {
    expect(
      transitionUpload(scanner, "scanning", {
        type: "scan_result",
        verdict: "infected",
        providerVersion: "v1",
      }),
    ).toMatchObject({ ok: true, state: "rejected" });
    expect(transitionUpload(promoter, "rejected", { type: "purge" })).toMatchObject({
      ok: true,
      state: "purged",
    });
    expect(transitionUpload(promoter, "quarantined", { type: "purge" })).toEqual({
      ok: false,
      code: "illegal_transition",
    });
  });

  it("scan, promote and purge require a service identity", () => {
    expect(transitionUpload(user, "quarantined", { type: "scan_started" })).toEqual({
      ok: false,
      code: "service_identity_required",
    });
    expect(transitionUpload(user, "clean", { type: "promote" })).toEqual({
      ok: false,
      code: "service_identity_required",
    });
  });
});

describe("Write-once originals and versions (SEC-HASH-02, SEC-HASH-03, AC-M2-02)", () => {
  const doc: Document = {
    id: "doc1",
    tenantId: "t1",
    disputeId: "d1",
    currentVersion: 1,
    displayLabel: "Invoice",
    status: "ready",
    createdAt: NOW,
    deletedAt: null,
  };
  const v1: DocumentVersion = {
    id: "v1",
    documentId: "doc1",
    version: 1,
    sha256: "a".repeat(64),
    sizeBytes: 10,
    sniffedMime: "application/pdf",
    pageCount: 2,
    originalFilename: "invoice.pdf",
    uploaderId: "u1",
    ingestTs: NOW,
    clientReportedMtime: null,
    scanResult: "clean",
    storagePath: "t1/d1/doc1/1",
    languageDetected: null,
  };

  it("replacement creates version 2 with a new hash and leaves version 1 untouched", () => {
    const {
      id: _id,
      documentId: _d,
      version: _v,
      ...promoted
    } = { ...v1, sha256: "b".repeat(64), storagePath: "t1/d1/doc1/2" };
    const result = replaceDocument(user, doc, [v1], promoted, "v2");
    expect(result.document.currentVersion).toBe(2);
    expect(result.version).toMatchObject({ version: 2, sha256: "b".repeat(64) });
    expect(result.custody).toEqual(["replaced"]);
    expect(v1.sha256).toBe("a".repeat(64));
  });

  it("any in-place change to a stored version is refused", () => {
    expect(() => assertVersionImmutable(v1, { ...v1, sha256: "c".repeat(64) })).toThrow(
      /immutable/,
    );
    expect(() => assertVersionImmutable(v1, { ...v1, storagePath: "elsewhere" })).toThrow(
      /immutable/,
    );
    expect(() => assertVersionImmutable(v1, { ...v1, languageDetected: "hi" })).not.toThrow();
  });
});
