import type { FactSource } from "@/components/nyayos/source-panel";
import type { SourceKind } from "@/components/nyayos/source-badge";
import type { StatusKind } from "@/components/nyayos/status-chip";

import type { FactOrigin, FactStatus, SeedDocument, SeedFact } from "./fixtures";

export const FACT_STATUS_TO_CHIP: Record<FactStatus, StatusKind> = {
  pending: "to-review",
  confirmed: "confirmed",
  corrected: "corrected",
  uncertain: "uncertain",
  not_relevant: "not-relevant",
};

export const ORIGIN_TO_SOURCE: Record<FactOrigin, SourceKind> = {
  user_statement: "user-statement",
  document_extraction: "document-fact",
  user_inference: "unverified-claim",
};

/** Build the provenance list a Fact Card shows. Always at least one entry. */
export function factSources(fact: SeedFact, documents: readonly SeedDocument[]): FactSource[] {
  const sources: FactSource[] = [];
  if (fact.origin === "document_extraction") {
    const doc = documents.find((d) => d.id === fact.documentId);
    const source: FactSource = {
      kind: doc ? "document-fact" : "source-unavailable",
      origin: doc ? doc.label : "Document no longer in the locker",
    };
    if (fact.page) source.locator = `page ${fact.page}`;
    else source.locator = "page not marked yet";
    if (fact.date) source.date = fact.date;
    sources.push(source);
  } else {
    const source: FactSource = {
      kind: ORIGIN_TO_SOURCE[fact.origin],
      origin: fact.origin === "user_statement" ? "Your account of what happened" : "Your own note",
    };
    if (fact.date) source.date = fact.date;
    sources.push(source);
  }
  if (fact.status === "corrected") {
    const correction: FactSource = { kind: "user-correction", origin: "Corrected by you" };
    if (fact.correctionReason) correction.excerpt = fact.correctionReason;
    sources.push(correction);
  }
  return sources;
}

/**
 * Provenance is complete when the fact resolves to a concrete source: a statement,
 * a user entry, or a document with a marked page. Incomplete items are listed as
 * omissions in an export, never silently included.
 */
export function isFactProvenanceComplete(
  fact: SeedFact,
  documents: readonly SeedDocument[],
): boolean {
  if (fact.origin !== "document_extraction") return true;
  const doc = documents.find((d) => d.id === fact.documentId);
  return Boolean(doc && doc.state === "ready" && fact.page);
}

export function factSourceRef(fact: SeedFact): string {
  if (fact.origin === "document_extraction") {
    return `document:${fact.documentId ?? "none"}${fact.page ? `#page-${fact.page}` : ""}`;
  }
  return fact.origin === "user_statement" ? `statement:${fact.id}` : `user_entry:${fact.id}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export function shortHash(sha256: string): string {
  return `${sha256.slice(0, 12)}…${sha256.slice(-6)}`;
}
