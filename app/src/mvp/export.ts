import {
  INTEGRITY_SCOPE_STATEMENT_EN,
  NO_AI_STATEMENT_EN,
  type StalenessAssessment,
} from "@/domain";

import type { SeedData, SeedDispute, SeedExport } from "./fixtures";
import { factSourceRef, isFactProvenanceComplete } from "./view-model";

/** What an export of this dispute would contain right now (U16). */
export function previewExport(data: SeedData, dispute: SeedDispute) {
  const documents = data.documents.filter((d) => d.disputeId === dispute.id);
  const includedDocs = documents.filter((d) => d.state === "ready");
  const excludedDocs = documents.filter((d) => d.state !== "ready");
  const facts = data.facts.filter((f) => f.disputeId === dispute.id && f.status !== "not_relevant");
  const includedFacts = facts.filter((f) => isFactProvenanceComplete(f, documents));
  const omittedFacts = facts.filter((f) => !isFactProvenanceComplete(f, documents));
  const timeline = data.timeline.filter((e) => e.disputeId === dispute.id);
  return { includedDocs, excludedDocs, includedFacts, omittedFacts, timeline };
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Build the manifest and its SHA-256 in the browser. Deterministic for the same input. */
export async function generateExport(
  data: SeedData,
  dispute: SeedDispute,
  generatedBy: string,
  generatedAt: string,
): Promise<{ record: SeedExport; manifestJson: string }> {
  const { includedDocs, includedFacts, omittedFacts } = previewExport(data, dispute);
  const version = data.exports.filter((e) => e.disputeId === dispute.id).length + 1;
  const record: Omit<SeedExport, "manifestSha256"> = {
    id: `exp-${dispute.id}-v${version}`,
    disputeId: dispute.id,
    version,
    generatedAt,
    generatedBy,
    documents: includedDocs.map((d) => ({
      documentId: d.id,
      filename: d.filename,
      sha256: d.sha256,
      sizeBytes: d.sizeBytes,
    })),
    items: includedFacts.map((f) => ({
      factId: f.id,
      label: f.label,
      version: f.version,
      status: f.status,
      sourceRef: factSourceRef(f),
    })),
    omissions: omittedFacts.map((f) => ({
      factId: f.id,
      label: f.label,
      reason: "incomplete_provenance" as const,
    })),
  };
  const manifestJson = manifestJsonFor(record);
  const manifestSha256 = await sha256Hex(manifestJson);
  return { record: { ...record, manifestSha256 }, manifestJson };
}

export function manifestJsonFor(record: Omit<SeedExport, "manifestSha256">): string {
  return JSON.stringify(
    {
      exportId: record.id,
      disputeId: record.disputeId,
      exportVersion: record.version,
      generatedAt: record.generatedAt,
      profile: "full_case_file",
      documents: record.documents,
      items: record.items,
      omissions: record.omissions,
      statements: { noAi: NO_AI_STATEMENT_EN, integrityScope: INTEGRITY_SCOPE_STATEMENT_EN },
    },
    null,
    2,
  );
}

/**
 * Compare an export with the file as it is now (A-037). Informational only: an
 * export is never regenerated automatically.
 */
export function assessExport(data: SeedData, record: SeedExport): StalenessAssessment {
  const findings: StalenessAssessment["findings"][number][] = [];
  let current = 0;
  for (const item of record.items) {
    const fact = data.facts.find((f) => f.id === item.factId);
    const base = {
      entryKind: "item" as const,
      itemType: "proposition",
      itemId: item.factId,
      recordedVersion: item.version,
      sourceRef: item.sourceRef,
      reviewRef: item.factId,
    };
    if (!fact) {
      findings.push({
        ...base,
        currentVersion: null,
        status: "UNKNOWN",
        reason: "not_found_or_inaccessible" as const,
      });
    } else if (fact.version !== item.version) {
      findings.push({
        ...base,
        currentVersion: fact.version,
        status: "STALE",
        reason: "newer_version" as const,
      });
    } else current++;
  }
  for (const d of record.documents) {
    const doc = data.documents.find((x) => x.id === d.documentId);
    const base = {
      entryKind: "document" as const,
      itemType: "document",
      itemId: d.documentId,
      recordedVersion: 1,
      sourceRef: `document:${d.documentId}`,
      reviewRef: d.documentId,
    };
    if (!doc) {
      findings.push({
        ...base,
        currentVersion: null,
        status: "UNKNOWN",
        reason: "not_found_or_inaccessible" as const,
      });
    } else current++;
  }
  const stale = findings.filter((f) => f.status === "STALE").length;
  const unknown = findings.length - stale;
  return {
    status: stale > 0 ? "STALE" : unknown > 0 ? "UNKNOWN" : "CURRENT",
    findings,
    counts: { current, stale, unknown },
    reviewCount: findings.length,
    manifestIssue: null,
  };
}
