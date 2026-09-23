/**
 * Export and integrity manifest (Scope Sheet §4.6, F16; Architecture Deck slides
 * 12–13; Counsel Brief OL-08).
 *
 * One profile in FM-A ("full_case_file"). The manifest lists every included
 * document version with its hash and every included item with its version and
 * provenance pointer. Items whose provenance chain is incomplete are EXCLUDED and
 * LISTED as omissions (Deck G4). The manifest hash is written to the audit chain.
 *
 * The integrity scope statement is deliberately minimal and makes no admissibility
 * or legal claim (AC-M5-04). Its wording is provisional pending OL-08.
 */

import { z } from "zod";

import { Id } from "./context";
import { type CanonicalItem, isProvenanceComplete } from "./dispute";
import { CANONICAL_TARGET_TYPES, EXPORT_PROFILES, EXPORT_SECTIONS } from "./enums";
import { type DocumentVersion, sha256Hex } from "./evidence";

export const ExportRecord = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  version: z.number().int().min(1),
  profile: z.enum(EXPORT_PROFILES),
  includedSections: z.array(z.enum(EXPORT_SECTIONS)),
  generatedAt: z.string().datetime(),
  generatedBy: Id,
  manifestSha256: z.string().regex(/^[0-9a-f]{64}$/),
  storagePath: z.string().min(1),
});
export type ExportRecord = z.infer<typeof ExportRecord>;

export const ManifestDocumentEntry = z.object({
  documentId: Id,
  version: z.number().int().min(1),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  sizeBytes: z.number().int().min(0),
  ingestTs: z.string().datetime(),
});
export type ManifestDocumentEntry = z.infer<typeof ManifestDocumentEntry>;

export const ManifestItemEntry = z.object({
  targetType: z.enum(CANONICAL_TARGET_TYPES),
  targetId: Id,
  version: z.number().int().min(1),
  verificationStatus: z.string().min(1),
  originType: z.string().min(1),
  sourceRef: z.string().min(1),
});
export type ManifestItemEntry = z.infer<typeof ManifestItemEntry>;

export const ExportManifest = z.object({
  exportId: Id,
  disputeId: Id,
  requestedBy: Id,
  generatedAt: z.string().datetime(),
  profile: z.enum(EXPORT_PROFILES),
  exportVersion: z.number().int().min(1),
  documents: z.array(ManifestDocumentEntry),
  items: z.array(ManifestItemEntry),
  /** Items excluded because their provenance chain is incomplete (Deck G4). */
  omissions: z.array(
    z.object({ targetType: z.string(), targetId: Id, reason: z.literal("incomplete_provenance") }),
  ),
  statements: z.object({
    noAi: z.string().min(1),
    integrityScope: z.string().min(1),
  }),
});
export type ExportManifest = z.infer<typeof ExportManifest>;

export const NO_AI_STATEMENT_EN = "No AI was used to produce this file.";
export const NO_AI_STATEMENT_HI = "इस फ़ाइल को बनाने में किसी AI का उपयोग नहीं किया गया।";

/** [PROV] wording pending Counsel Brief OL-08. Makes no admissibility claim. */
export const INTEGRITY_SCOPE_STATEMENT_EN =
  "The manifest lists the SHA-256 hash of each included document exactly as stored by NyayOS at the time of export. " +
  "It records that the files have not changed since upload. It does not verify who created a document, when, or whether its contents are accurate.";
export const INTEGRITY_SCOPE_STATEMENT_HI =
  "यह मैनिफ़ेस्ट निर्यात के समय NyayOS में संग्रहीत प्रत्येक दस्तावेज़ का SHA-256 हैश दर्ज करता है। " +
  "यह दर्शाता है कि अपलोड के बाद फ़ाइलें बदली नहीं गई हैं। यह नहीं बताता कि दस्तावेज़ किसने, कब बनाया या उसकी सामग्री सही है या नहीं।";

function describeSourceRef(item: CanonicalItem): string {
  const s = item.provenance.sourceRef;
  switch (s.kind) {
    case "statement":
      return `statement:${s.statementId}`;
    case "document":
      return `document:${s.documentId}@${s.documentVersionId}${s.locationId ? `#${s.locationId}` : ""}`;
    case "user_entry":
      return `user_entry:${s.enteredBy}`;
    default:
      return "unknown";
  }
}

export async function buildExportManifest(input: {
  exportId: string;
  disputeId: string;
  requestedBy: string;
  generatedAt: string;
  exportVersion: number;
  language: "en" | "hi";
  items: readonly CanonicalItem[];
  documentVersions: readonly DocumentVersion[];
}): Promise<{ manifest: ExportManifest; manifestSha256: string }> {
  const items: ManifestItemEntry[] = [];
  const omissions: ExportManifest["omissions"] = [];
  for (const item of input.items) {
    const targetType = item.itemType; // explicit discriminant (A-033 M-5)
    if (!isProvenanceComplete(item.provenance)) {
      omissions.push({ targetType, targetId: item.id, reason: "incomplete_provenance" });
      continue;
    }
    items.push({
      targetType,
      targetId: item.id,
      version: item.version,
      verificationStatus: item.verificationStatus,
      originType: item.provenance.originType,
      sourceRef: describeSourceRef(item),
    });
  }
  const documents = [...input.documentVersions]
    .sort((a, b) => a.documentId.localeCompare(b.documentId) || a.version - b.version)
    .map((v) => ({
      documentId: v.documentId,
      version: v.version,
      sha256: v.sha256,
      sizeBytes: v.sizeBytes,
      ingestTs: v.ingestTs,
    }));

  const manifest = ExportManifest.parse({
    exportId: input.exportId,
    disputeId: input.disputeId,
    requestedBy: input.requestedBy,
    generatedAt: input.generatedAt,
    profile: "full_case_file",
    exportVersion: input.exportVersion,
    documents,
    items: items.sort(
      (a, b) => a.targetType.localeCompare(b.targetType) || a.targetId.localeCompare(b.targetId),
    ),
    omissions,
    statements: {
      noAi: input.language === "hi" ? NO_AI_STATEMENT_HI : NO_AI_STATEMENT_EN,
      integrityScope:
        input.language === "hi" ? INTEGRITY_SCOPE_STATEMENT_HI : INTEGRITY_SCOPE_STATEMENT_EN,
    },
  });
  const manifestSha256 = await sha256Hex(new TextEncoder().encode(JSON.stringify(manifest)));
  return { manifest, manifestSha256 };
}

/** FN-11 / AC-M5-02: recomputed hashes of stored originals must match the manifest. */
export function verifyManifestAgainstStored(
  manifest: ExportManifest,
  stored: readonly Pick<DocumentVersion, "documentId" | "version" | "sha256">[],
): { ok: true } | { ok: false; mismatches: { documentId: string; version: number }[] } {
  const mismatches: { documentId: string; version: number }[] = [];
  for (const entry of manifest.documents) {
    const s = stored.find((x) => x.documentId === entry.documentId && x.version === entry.version);
    if (!s || s.sha256 !== entry.sha256)
      mismatches.push({ documentId: entry.documentId, version: entry.version });
  }
  return mismatches.length === 0 ? { ok: true } : { ok: false, mismatches };
}
