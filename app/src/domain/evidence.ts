/**
 * Evidence lifecycle (Scope Sheet §4.5, F06–F10; SDAS §8; Architecture Deck
 * slides 10–11).
 *
 * Upload → quarantine → server SHA-256 → MIME sniff → malware scan → promote to a
 * write-once original. Promotion requires a POSITIVE clean verdict; a scan that is
 * unavailable leaves the object quarantined ("no timeout-based promotion exists").
 * Replacement creates a new version; the old version is retained (AC-M2-02).
 *
 * No OCR, no derivatives, no chunks in FM-A. Locations are user-marked (F10).
 */

import { z } from "zod";

import { Id, type RequestContext, isService, isUser } from "./context";
import {
  CUSTODY_EVENTS,
  DOCUMENT_STATUSES,
  FMA_ACCEPTED_MIME_TYPES,
  type FeatureFlags,
  JOB_STATES,
  JOB_TYPES,
  SCAN_VERDICTS,
  type ScanVerdict,
  UPLOAD_STATES,
  type UploadState,
} from "./enums";
import type { ProvConfig } from "./config";

export const QuarantineUpload = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  uploaderId: Id,
  state: z.enum(UPLOAD_STATES),
  /** Server-computed; null until bytes have landed. */
  sha256: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .nullable(),
  sizeBytes: z.number().int().min(0).nullable(),
  sniffedMime: z.string().nullable(),
  declaredMime: z.string(),
  scanVerdict: z.enum(SCAN_VERDICTS).nullable(),
  scanProviderVersion: z.string().nullable(),
  createdAt: z.string().datetime(),
  purgeAfter: z.string().datetime().nullable(),
});
export type QuarantineUpload = z.infer<typeof QuarantineUpload>;

export const Document = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  currentVersion: z.number().int().min(1),
  displayLabel: z.string().min(1).max(300),
  status: z.enum(DOCUMENT_STATUSES),
  createdAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});
export type Document = z.infer<typeof Document>;

export const DocumentVersion = z.object({
  id: Id,
  documentId: Id,
  version: z.number().int().min(1),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  sizeBytes: z.number().int().min(0),
  sniffedMime: z.string().min(1),
  pageCount: z.number().int().min(0).nullable(),
  /** S4: never written to operational logs (SDAS §3.2). */
  originalFilename: z.string().min(1),
  uploaderId: Id,
  ingestTs: z.string().datetime(),
  clientReportedMtime: z.string().datetime().nullable(),
  scanResult: z.literal("clean"),
  /** `<tenant_id>/<dispute_id>/<document_id>/<version>` — the path alone never authorises. */
  storagePath: z.string().min(1),
  languageDetected: z.string().nullable(),
});
export type DocumentVersion = z.infer<typeof DocumentVersion>;

export const DocumentLocation = z.object({
  id: Id,
  documentVersionId: Id,
  pageNumber: z.number().int().min(1),
  anchorNote: z.string().nullable(),
  /** User in FM-A (manual linking). Extraction-derived locations arrive with FM-D. */
  createdBy: Id,
  createdAt: z.string().datetime(),
});
export type DocumentLocation = z.infer<typeof DocumentLocation>;

export const Annotation = z.object({
  id: Id,
  documentVersionId: Id,
  locationId: Id,
  text: z.string().min(1),
  createdBy: Id,
  createdAt: z.string().datetime(),
});
export type Annotation = z.infer<typeof Annotation>;

export const CustodyEvent = z.object({
  id: Id,
  documentId: Id,
  version: z.number().int().min(0),
  event: z.enum(CUSTODY_EVENTS),
  actor: Id,
  occurredAt: z.string().datetime(),
  hashRef: z
    .string()
    .regex(/^[0-9a-f]{64}$/)
    .nullable(),
});
export type CustodyEvent = z.infer<typeof CustodyEvent>;

export const Job = z.object({
  id: Id,
  tenantId: Id,
  type: z.enum(JOB_TYPES),
  payloadRef: Id,
  state: z.enum(JOB_STATES),
  attempts: z.number().int().min(0),
  nextRunAt: z.string().datetime().nullable(),
  lastErrorCode: z.string().nullable(),
});
export type Job = z.infer<typeof Job>;

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

/** SHA-256 hex via Web Crypto. Runs in Node ≥ 20 and modern browsers; server code uses it for originals. */
export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto SubtleCrypto is unavailable in this runtime");
  const buf = new Uint8Array(bytes.byteLength);
  buf.set(bytes);
  const digest = await subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

// ---------------------------------------------------------------------------
// MIME sniffing (magic bytes) and acceptance
// ---------------------------------------------------------------------------

export function sniffMime(head: Uint8Array): string | null {
  const b = (i: number) => head[i];
  if (b(0) === 0x25 && b(1) === 0x50 && b(2) === 0x44 && b(3) === 0x46) return "application/pdf"; // %PDF
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return "image/jpeg";
  if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4e && b(3) === 0x47) return "image/png";
  if (b(0) === 0x4d && b(1) === 0x5a) return "application/x-msdownload"; // MZ — executable
  if (b(0) === 0x50 && b(1) === 0x4b && b(2) === 0x03 && b(3) === 0x04) return "application/zip"; // OOXML/zip
  if (head.byteLength > 0 && isPlausibleText(head)) return "text/plain";
  return null;
}

function isPlausibleText(head: Uint8Array): boolean {
  for (const byte of head) {
    if (byte === 0x00) return false;
  }
  return true;
}

export type AcceptanceResult =
  | { ok: true; mime: (typeof FMA_ACCEPTED_MIME_TYPES)[number] }
  | {
      ok: false;
      code:
        "type_mismatch" | "type_not_accepted" | "docx_disabled" | "too_large" | "too_many_pages";
    };

/** SEC-UPL-01 (renamed executable), SEC-UPL-03 (oversize / page bomb), SEC-UPL-04 (Office while `ff_docx` off). */
export function acceptUpload(
  input: {
    declaredMime: string;
    sniffedMime: string | null;
    sizeBytes: number;
    pageCount: number | null;
  },
  config: ProvConfig,
  flags: FeatureFlags,
): AcceptanceResult {
  if (input.sizeBytes > config.upload_max_bytes) return { ok: false, code: "too_large" };
  if (input.pageCount !== null && input.pageCount > config.upload_max_pages)
    return { ok: false, code: "too_many_pages" };
  const sniffed = input.sniffedMime;
  const isOffice =
    input.declaredMime.startsWith("application/vnd.openxmlformats-officedocument") ||
    input.declaredMime === "application/msword" ||
    sniffed === "application/zip";
  if (isOffice) return { ok: false, code: flags.ff_docx ? "type_not_accepted" : "docx_disabled" };
  if (sniffed === null) return { ok: false, code: "type_not_accepted" };
  if (!(FMA_ACCEPTED_MIME_TYPES as readonly string[]).includes(sniffed))
    return { ok: false, code: "type_not_accepted" };
  if (input.declaredMime !== sniffed) return { ok: false, code: "type_mismatch" };
  return { ok: true, mime: sniffed as (typeof FMA_ACCEPTED_MIME_TYPES)[number] };
}

// ---------------------------------------------------------------------------
// Upload state machine
// ---------------------------------------------------------------------------

export type UploadEvent =
  | { type: "bytes_landed"; sha256: string; sizeBytes: number; sniffedMime: string | null }
  | { type: "scan_started" }
  | { type: "scan_result"; verdict: ScanVerdict; providerVersion: string }
  | { type: "reject"; reason: string }
  | { type: "promote" }
  | { type: "purge" };

export type UploadTransition =
  | { ok: true; state: UploadState; custody: (typeof CUSTODY_EVENTS)[number][] }
  | {
      ok: false;
      code: "illegal_transition" | "promotion_requires_clean_verdict" | "service_identity_required";
    };

const SERVICE_ONLY_EVENTS = new Set<UploadEvent["type"]>([
  "scan_started",
  "scan_result",
  "promote",
  "purge",
]);

export function transitionUpload(
  ctx: RequestContext,
  state: UploadState,
  event: UploadEvent,
): UploadTransition {
  if (SERVICE_ONLY_EVENTS.has(event.type) && !isService(ctx.principal)) {
    return { ok: false, code: "service_identity_required" };
  }
  switch (event.type) {
    case "bytes_landed":
      return state === "received"
        ? { ok: true, state: "quarantined", custody: ["ingested", "quarantined"] }
        : illegal();
    case "scan_started":
      return state === "quarantined" ? { ok: true, state: "scanning", custody: [] } : illegal();
    case "scan_result": {
      if (state !== "scanning") return illegal();
      switch (event.verdict) {
        case "clean":
          return { ok: true, state: "clean", custody: ["scanned"] };
        case "infected":
          return { ok: true, state: "rejected", custody: ["scanned"] };
        case "failed":
        case "unavailable":
          // Stays quarantined: no timeout-based promotion exists (Deck slide 11).
          return { ok: true, state: "quarantined", custody: ["scanned"] };
        default:
          return illegal();
      }
    }
    case "reject":
      return state === "quarantined" || state === "scanning" || state === "clean"
        ? { ok: true, state: "rejected", custody: [] }
        : illegal();
    case "promote":
      if (state === "clean") return { ok: true, state: "promoted", custody: ["promoted"] };
      return { ok: false, code: "promotion_requires_clean_verdict" };
    case "purge":
      return state === "rejected" ? { ok: true, state: "purged", custody: [] } : illegal();
    default:
      return illegal();
  }
}

function illegal(): UploadTransition {
  return { ok: false, code: "illegal_transition" };
}

// ---------------------------------------------------------------------------
// Write-once originals and versions
// ---------------------------------------------------------------------------

/** Replacement = new version row with a new hash; the previous version is untouched (SEC-HASH-03). */
export function replaceDocument(
  ctx: RequestContext,
  document: Document,
  versions: readonly DocumentVersion[],
  promoted: Omit<DocumentVersion, "id" | "documentId" | "version">,
  newVersionId: string,
): { document: Document; version: DocumentVersion; custody: CustodyEvent["event"][] } {
  if (!isUser(ctx.principal)) throw new Error("replaceDocument requires a user principal");
  const max = versions.reduce((m, v) => Math.max(m, v.version), 0);
  if (max !== document.currentVersion)
    throw new Error("document.currentVersion disagrees with version rows");
  const version = DocumentVersion.parse({
    ...promoted,
    id: newVersionId,
    documentId: document.id,
    version: max + 1,
  });
  return {
    document: { ...document, currentVersion: version.version },
    version,
    custody: ["replaced"],
  };
}

/** Any attempt to change hash, bytes or path of an existing version is a programming error (S5). */
export function assertVersionImmutable(before: DocumentVersion, after: DocumentVersion): void {
  if (before.id !== after.id) return;
  for (const k of [
    "sha256",
    "sizeBytes",
    "sniffedMime",
    "storagePath",
    "version",
    "ingestTs",
  ] as const) {
    if (before[k] !== after[k]) throw new Error(`document_versions.${k} is immutable`);
  }
}

/** Signed URL issuance decision (A14, F06): authorised, short TTL, never persisted. */
export function signedUrlTtlSeconds(kind: "view" | "download", config: ProvConfig): number {
  return kind === "view"
    ? config.signed_url_view_ttl_seconds
    : config.signed_url_download_ttl_seconds;
}

export function storagePathFor(
  tenantId: string,
  disputeId: string,
  documentId: string,
  version: number,
): string {
  return `${tenantId}/${disputeId}/${documentId}/${version}`;
}
