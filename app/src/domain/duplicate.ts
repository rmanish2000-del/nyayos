/**
 * Duplicate Detection V1 (A-036; plan A-035 §3.1; backlog WAVE_1 item 1).
 *
 * Hash-level only: a candidate upload whose server-computed SHA-256 equals an existing
 * `document_versions.sha256` **in the same tenant** is reported as a duplicate of the
 * named document(s). The result is information for the user — nothing is merged, rejected
 * or deleted here (write-once originals, S5; user decides, Deck slide 2). Near-duplicates
 * (re-scans, re-exports) are explicitly out of scope for V1.
 *
 * Pure function; the SQL twin is `nyayos.find_duplicate_versions(text)` in
 * `db/migrations/0002_duplicate_lookup.sql`, which relies on RLS so a caller can only ever
 * see matches inside disputes they are a member of.
 */

import { z } from "zod";

import { Id } from "./context";

const Sha256Hex = z
  .string()
  .regex(/^[0-9a-fA-F]{64}$/, "sha256 must be 64 hex characters")
  .transform((s) => s.toLowerCase());

export const KnownVersion = z.object({
  tenantId: Id,
  disputeId: Id,
  documentId: Id,
  version: z.number().int().min(1),
  sha256: Sha256Hex,
  displayLabel: z.string().min(1),
  ingestTs: z.string().datetime(),
});
export type KnownVersion = z.infer<typeof KnownVersion>;

export interface DuplicateMatch {
  readonly documentId: string;
  readonly disputeId: string;
  readonly version: number;
  readonly displayLabel: string;
  readonly ingestTs: string;
  /** True when the match lives in the dispute the candidate is being uploaded to. */
  readonly sameDispute: boolean;
}

export type DuplicateAssessment =
  | { kind: "none" }
  | {
      kind: "duplicate";
      /** Same-dispute matches first, then by ingest time, then document id and version. */
      matches: readonly DuplicateMatch[];
      anyInSameDispute: boolean;
    };

/**
 * Find every stored version whose bytes are identical to the candidate. Tenant is a hard
 * boundary: rows from another tenant are ignored even if the caller passes them (defence in
 * depth; the SQL twin cannot see them at all under RLS).
 */
export function findDuplicateVersions(
  candidate: { sha256: string; tenantId: string; disputeId: string },
  known: readonly KnownVersion[],
): DuplicateMatch[] {
  const sha = Sha256Hex.parse(candidate.sha256);
  return known
    .filter((v) => v.tenantId === candidate.tenantId && v.sha256.toLowerCase() === sha)
    .map<DuplicateMatch>((v) => ({
      documentId: v.documentId,
      disputeId: v.disputeId,
      version: v.version,
      displayLabel: v.displayLabel,
      ingestTs: v.ingestTs,
      sameDispute: v.disputeId === candidate.disputeId,
    }))
    .sort(
      (a, b) =>
        Number(b.sameDispute) - Number(a.sameDispute) ||
        a.ingestTs.localeCompare(b.ingestTs) ||
        a.documentId.localeCompare(b.documentId) ||
        a.version - b.version,
    );
}

export function assessDuplicate(
  candidate: { sha256: string; tenantId: string; disputeId: string },
  known: readonly KnownVersion[],
): DuplicateAssessment {
  const matches = findDuplicateVersions(candidate, known);
  if (matches.length === 0) return { kind: "none" };
  return { kind: "duplicate", matches, anyInSameDispute: matches.some((m) => m.sameDispute) };
}

/** Audit metadata for `document.quarantined` when a duplicate is detected — ids and counts only, never labels. */
export function duplicateAuditMetadata(
  assessment: DuplicateAssessment,
): Record<string, string | number | boolean> {
  if (assessment.kind === "none") return { count: 0 };
  const first = assessment.matches[0]!;
  return {
    count: assessment.matches.length,
    document_id: first.documentId,
    version: first.version,
  };
}
