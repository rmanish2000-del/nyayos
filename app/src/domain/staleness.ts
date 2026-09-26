/**
 * Stale Output Detection V1 (A-037; plan A-035 §3.2; backlog WAVE_0 item 8).
 *
 * An output (today: an export manifest) is STALE when a referenced item or document no
 * longer matches the current canonical version recorded for it. Detection only: nothing
 * here rewrites, refreshes, replaces, deletes, merges or regenerates any output, and no
 * input is mutated.
 *
 * Rules
 *  - Staleness is decided by version comparison only. Timestamps are never read.
 *  - Missing, malformed, inaccessible, ambiguous or unsupported version data is UNKNOWN,
 *    never CURRENT.
 *  - Current-version rows outside the caller's tenant or outside the output's dispute are
 *    ignored, so a foreign record behaves exactly like a missing one ("not found or
 *    inaccessible") and its version is never reported.
 *  - Overall status precedence: STALE > UNKNOWN > CURRENT.
 *
 * SQL twin: `nyayos.export_staleness(uuid)` in `db/migrations/0003_export_staleness.sql`
 * (SECURITY INVOKER — row-level security scopes every read to the caller). Both produce the
 * same row shape; `summariseStalenessRows` turns either into an assessment.
 */

import { type CanonicalTargetType } from "./enums";

export const STALENESS_STATUSES = ["CURRENT", "STALE", "UNKNOWN"] as const;
export type StalenessStatus = (typeof STALENESS_STATUSES)[number];

export const STALENESS_REASONS = [
  "current",
  "newer_version",
  "not_found_or_inaccessible",
  "malformed_recorded_version",
  "malformed_current_version",
  "ambiguous_current_version",
  "recorded_version_ahead",
  "unsupported_item_type",
  "malformed_entry",
  "malformed_manifest",
  "dispute_mismatch",
] as const;
export type StalenessReason = (typeof STALENESS_REASONS)[number];

/** Canonical item types that carry a `version` column. Others cannot be assessed (UNKNOWN). */
export const VERSIONED_TARGET_TYPES = [
  "entity",
  "event",
  "date_assertion",
  "proposition",
  "evidence_item",
  "evidence_relation",
  "contradiction",
  "missing_evidence",
  "issue",
  "next_step",
] as const satisfies readonly CanonicalTargetType[];

/** Upper bound shared with the SQL twin's version pattern (`^[1-9][0-9]{0,8}$`). */
export const MAX_VERSION = 999_999_999;

export type StalenessEntryKind = "manifest" | "document" | "item";

export interface StalenessRow {
  readonly entryKind: StalenessEntryKind;
  /** Canonical target type, `document`, `manifest`, or `unknown` for an unreadable entry. */
  readonly itemType: string;
  readonly itemId: string;
  readonly recordedVersion: number | null;
  /** Only reported when the current version was found and compared. */
  readonly currentVersion: number | null;
  readonly status: StalenessStatus;
  readonly reason: StalenessReason;
  /** Provenance reference recorded in the output (what the output cited). */
  readonly sourceRef: string;
  /** What the user should open to review the item. */
  readonly reviewRef: string;
}

export type StalenessFinding = StalenessRow & { readonly status: "STALE" | "UNKNOWN" };

export interface StalenessAssessment {
  readonly status: StalenessStatus;
  /** Stale and unknown rows only, in deterministic order. */
  readonly findings: readonly StalenessFinding[];
  /** Counts over referenced items and documents (the manifest row itself is excluded). */
  readonly counts: { readonly current: number; readonly stale: number; readonly unknown: number };
  /** Referenced items and documents that need review (stale + unknown). */
  readonly reviewCount: number;
  /** Set when the output as a whole could not be assessed. */
  readonly manifestIssue: StalenessReason | null;
}

export interface CurrentItemVersion {
  readonly tenantId: string;
  readonly disputeId: string;
  readonly targetType: string;
  readonly targetId: string;
  readonly version: unknown;
}

export interface CurrentDocumentVersion {
  readonly tenantId: string;
  readonly disputeId: string;
  readonly documentId: string;
  readonly currentVersion: unknown;
  /** Documents with status `deleted` are treated as absent. */
  readonly status?: string;
}

export interface StalenessInput {
  /** Server-resolved scope of the caller and the output; never client-supplied. */
  readonly scope: { readonly tenantId: string; readonly disputeId: string };
  /** Parsed manifest JSON as stored; validated here entry by entry. */
  readonly manifest: unknown;
  readonly current: {
    readonly items: readonly CurrentItemVersion[];
    readonly documents: readonly CurrentDocumentVersion[];
  };
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const nonEmptyString = (v: unknown): v is string => typeof v === "string" && v.length > 0;
const validVersion = (v: unknown): v is number =>
  typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= MAX_VERSION;

type Lookup =
  | { kind: "absent" }
  | { kind: "malformed" }
  | { kind: "ambiguous" }
  | { kind: "found"; version: number };

function lookup(values: readonly unknown[] | undefined): Lookup {
  if (!values || values.length === 0) return { kind: "absent" };
  if (!values.every(validVersion)) return { kind: "malformed" };
  const distinct = new Set(values as number[]);
  if (distinct.size > 1) return { kind: "ambiguous" };
  return { kind: "found", version: values[0] as number };
}

function compare(
  recorded: number,
  current: Lookup,
): { status: StalenessStatus; reason: StalenessReason; currentVersion: number | null } {
  switch (current.kind) {
    case "absent":
      return { status: "UNKNOWN", reason: "not_found_or_inaccessible", currentVersion: null };
    case "malformed":
      return { status: "UNKNOWN", reason: "malformed_current_version", currentVersion: null };
    case "ambiguous":
      return { status: "UNKNOWN", reason: "ambiguous_current_version", currentVersion: null };
    case "found":
      if (current.version === recorded)
        return { status: "CURRENT", reason: "current", currentVersion: current.version };
      if (current.version > recorded)
        return { status: "STALE", reason: "newer_version", currentVersion: current.version };
      return {
        status: "UNKNOWN",
        reason: "recorded_version_ahead",
        currentVersion: current.version,
      };
    default:
      return { status: "UNKNOWN", reason: "not_found_or_inaccessible", currentVersion: null };
  }
}

const KIND_ORDER: Record<StalenessEntryKind, number> = { manifest: 0, document: 1, item: 2 };
const codepoint = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Ties (same kind, type and id) keep manifest order: Array.prototype.sort is stable. The SQL twin orders by manifest position as the final key. */
function sortRows(rows: StalenessRow[]): StalenessRow[] {
  return rows.sort(
    (a, b) =>
      KIND_ORDER[a.entryKind] - KIND_ORDER[b.entryKind] ||
      codepoint(a.itemType, b.itemType) ||
      codepoint(a.itemId, b.itemId),
  );
}

function manifestRow(
  exportId: string,
  status: StalenessStatus,
  reason: StalenessReason,
): StalenessRow {
  return {
    entryKind: "manifest",
    itemType: "manifest",
    itemId: exportId,
    recordedVersion: null,
    currentVersion: null,
    status,
    reason,
    sourceRef: `export:${exportId}`,
    reviewRef: `export:${exportId}`,
  };
}

/**
 * Produce one row per manifest entry plus one manifest-level row. Pure and deterministic;
 * never throws on malformed data (malformed data yields UNKNOWN rows).
 */
export function staleOutputRows(input: StalenessInput): StalenessRow[] {
  const { scope, manifest, current } = input;
  const exportId =
    isRecord(manifest) && nonEmptyString(manifest["exportId"]) ? manifest["exportId"] : "unknown";

  if (
    !isRecord(manifest) ||
    !Array.isArray(manifest["items"]) ||
    !Array.isArray(manifest["documents"]) ||
    !nonEmptyString(manifest["disputeId"])
  ) {
    return [manifestRow(exportId, "UNKNOWN", "malformed_manifest")];
  }
  if (manifest["disputeId"] !== scope.disputeId) {
    return [manifestRow(exportId, "UNKNOWN", "dispute_mismatch")];
  }

  const inScope = (r: { tenantId: string; disputeId: string }) =>
    r.tenantId === scope.tenantId && r.disputeId === scope.disputeId;

  const itemVersions = new Map<string, unknown[]>();
  for (const r of current.items) {
    if (!inScope(r)) continue;
    const key = `${r.targetType}:${r.targetId}`;
    itemVersions.set(key, [...(itemVersions.get(key) ?? []), r.version]);
  }
  const documentVersions = new Map<string, unknown[]>();
  for (const r of current.documents) {
    if (!inScope(r) || r.status === "deleted") continue;
    documentVersions.set(r.documentId, [
      ...(documentVersions.get(r.documentId) ?? []),
      r.currentVersion,
    ]);
  }

  const rows: StalenessRow[] = [manifestRow(exportId, "CURRENT", "current")];

  (manifest["items"] as unknown[]).forEach((entry, index) => {
    const t = isRecord(entry) && nonEmptyString(entry["targetType"]) ? entry["targetType"] : null;
    const id = isRecord(entry) && nonEmptyString(entry["targetId"]) ? entry["targetId"] : null;
    const itemType = t ?? "unknown";
    const itemId = id ?? `items[${index}]`;
    const recorded = isRecord(entry) && validVersion(entry["version"]) ? entry["version"] : null;
    const sourceRef =
      isRecord(entry) && nonEmptyString(entry["sourceRef"])
        ? entry["sourceRef"]
        : `${itemType}:${itemId}`;
    const base = {
      entryKind: "item" as const,
      itemType,
      itemId,
      recordedVersion: recorded,
      sourceRef,
      reviewRef: `${itemType}:${itemId}`,
    };

    if (t === null || id === null) {
      rows.push({ ...base, currentVersion: null, status: "UNKNOWN", reason: "malformed_entry" });
    } else if (!(VERSIONED_TARGET_TYPES as readonly string[]).includes(t)) {
      rows.push({
        ...base,
        currentVersion: null,
        status: "UNKNOWN",
        reason: "unsupported_item_type",
      });
    } else if (recorded === null) {
      rows.push({
        ...base,
        currentVersion: null,
        status: "UNKNOWN",
        reason: "malformed_recorded_version",
      });
    } else {
      rows.push({ ...base, ...compare(recorded, lookup(itemVersions.get(`${t}:${id}`))) });
    }
  });

  (manifest["documents"] as unknown[]).forEach((entry, index) => {
    const id = isRecord(entry) && nonEmptyString(entry["documentId"]) ? entry["documentId"] : null;
    const itemId = id ?? `documents[${index}]`;
    const recorded = isRecord(entry) && validVersion(entry["version"]) ? entry["version"] : null;
    const base = {
      entryKind: "document" as const,
      itemType: "document",
      itemId,
      recordedVersion: recorded,
      sourceRef: `document:${itemId}${recorded === null ? "" : `@${recorded}`}`,
      reviewRef: `document:${itemId}`,
    };

    if (id === null) {
      rows.push({ ...base, currentVersion: null, status: "UNKNOWN", reason: "malformed_entry" });
    } else if (recorded === null) {
      rows.push({
        ...base,
        currentVersion: null,
        status: "UNKNOWN",
        reason: "malformed_recorded_version",
      });
    } else {
      rows.push({ ...base, ...compare(recorded, lookup(documentVersions.get(id))) });
    }
  });

  return sortRows(rows);
}

/**
 * Turn rows (from `staleOutputRows` or from the SQL twin) into an assessment. Zero rows
 * means the output could not be read by this caller — reported as UNKNOWN, with no hint
 * about whether it exists.
 */
export function summariseStalenessRows(rows: readonly StalenessRow[]): StalenessAssessment {
  if (rows.length === 0) {
    const finding = manifestRow(
      "unknown",
      "UNKNOWN",
      "not_found_or_inaccessible",
    ) as StalenessFinding;
    return {
      status: "UNKNOWN",
      findings: [finding],
      counts: { current: 0, stale: 0, unknown: 0 },
      reviewCount: 0,
      manifestIssue: "not_found_or_inaccessible",
    };
  }
  const sorted = sortRows([...rows]);
  const referenced = sorted.filter((r) => r.entryKind !== "manifest");
  const manifestProblem = sorted.find((r) => r.entryKind === "manifest" && r.status !== "CURRENT");
  const counts = {
    current: referenced.filter((r) => r.status === "CURRENT").length,
    stale: referenced.filter((r) => r.status === "STALE").length,
    unknown: referenced.filter((r) => r.status === "UNKNOWN").length,
  };
  const findings = sorted.filter((r): r is StalenessFinding => r.status !== "CURRENT");
  const status: StalenessStatus =
    counts.stale > 0 ? "STALE" : counts.unknown > 0 || manifestProblem ? "UNKNOWN" : "CURRENT";
  return {
    status,
    findings,
    counts,
    reviewCount: counts.stale + counts.unknown,
    manifestIssue: manifestProblem ? manifestProblem.reason : null,
  };
}

/** One-call assessment of a stored output against current canonical versions. */
export function assessOutputStaleness(input: StalenessInput): StalenessAssessment {
  return summariseStalenessRows(staleOutputRows(input));
}
