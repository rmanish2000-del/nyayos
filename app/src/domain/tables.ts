/**
 * FM-A table registry (Scope Sheet §4). This is the single list that the
 * deletion allow-list (CR-4, SEC-DEL-06), the schema lint (SEC-RLS-01) and the
 * entity documentation are derived from. Adding a table here without a scope
 * column is a lint failure unless it is explicitly global.
 *
 * Nothing here is DDL. The SQL lives in `db/migrations/` and is NOT applied by
 * this repository (no deployment, no database writes under FA-001).
 */

import type { SensitivityLevel } from "./enums";

export type TableScope =
  | { kind: "tenant"; scopeColumn: "tenant_id" }
  | { kind: "dispute"; scopeColumn: "dispute_id" }
  | { kind: "document"; scopeColumn: "document_id" | "document_version_id" }
  | { kind: "user"; scopeColumn: "user_id" | "principal_user_id" }
  | { kind: "export"; scopeColumn: "export_id" }
  | { kind: "global"; scopeColumn: null };

export interface TableSpec {
  readonly name: string;
  readonly family:
    | "identity"
    | "consent"
    | "dispute_core"
    | "single_writer"
    | "evidence"
    | "export"
    | "audit"
    | "deletion"
    | "config";
  readonly sensitivity: SensitivityLevel;
  readonly scope: TableScope;
  /** True when no authenticated role may UPDATE rows directly (S3 single-writer, S7 audit, S5 originals). */
  readonly noDirectUpdate: boolean;
  /** True when rows are never deleted by the deletion workflow (audit, ledger, tombstones). */
  readonly retainedThroughDeletion: boolean;
}

const t = (
  name: string,
  family: TableSpec["family"],
  sensitivity: SensitivityLevel,
  scope: TableScope,
  opts: Partial<Pick<TableSpec, "noDirectUpdate" | "retainedThroughDeletion">> = {},
): TableSpec => ({
  name,
  family,
  sensitivity,
  scope,
  noDirectUpdate: opts.noDirectUpdate ?? false,
  retainedThroughDeletion: opts.retainedThroughDeletion ?? false,
});

const tenant: TableScope = { kind: "tenant", scopeColumn: "tenant_id" };
const dispute: TableScope = { kind: "dispute", scopeColumn: "dispute_id" };
const document: TableScope = { kind: "document", scopeColumn: "document_id" };
const documentVersion: TableScope = { kind: "document", scopeColumn: "document_version_id" };
const user: TableScope = { kind: "user", scopeColumn: "user_id" };
const principal: TableScope = { kind: "user", scopeColumn: "principal_user_id" };
const exportScope: TableScope = { kind: "export", scopeColumn: "export_id" };
const global: TableScope = { kind: "global", scopeColumn: null };

export const FMA_TABLES: readonly TableSpec[] = [
  // 4.1 Identity and tenancy
  t("profiles", "identity", "S3", user),
  t("tenants", "identity", "S3", global),
  t("tenant_memberships", "identity", "S3", tenant),
  t("dispute_roles", "identity", "S3", dispute),
  t("platform_roles", "identity", "S3", user),
  // 4.2 Consent and notices
  t("consents", "consent", "S3", principal, { noDirectUpdate: true }),
  t("notices", "consent", "S2", global),
  // 4.3 Dispute core (single-writer: no direct UPDATE)
  t("disputes", "dispute_core", "S4", tenant),
  t("dispute_statements", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("intake_questions", "dispute_core", "S2", global),
  t("entities", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("entity_source_forms", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("events", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("date_assertions", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("propositions", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("evidence_items", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("evidence_relations", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("contradictions", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("missing_evidence", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("issues", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  t("next_steps", "dispute_core", "S4", dispute, { noDirectUpdate: true }),
  // 4.4 Proposals and corrections
  t("proposals", "single_writer", "S4", dispute),
  t("user_corrections", "single_writer", "S4", dispute, { noDirectUpdate: true }),
  // 4.5 Evidence
  t("quarantine_uploads", "evidence", "S4", tenant),
  t("documents", "evidence", "S4", tenant),
  t("document_versions", "evidence", "S4", document, { noDirectUpdate: true }),
  t("document_locations", "evidence", "S4", documentVersion),
  t("annotations", "evidence", "S4", documentVersion),
  t("custody_events", "evidence", "S3", document, { noDirectUpdate: true }),
  t("jobs", "evidence", "S2", tenant),
  // 4.6 Export, audit, deletion, config
  t("exports", "export", "S4", dispute, { noDirectUpdate: true }),
  t("export_manifests", "export", "S3", exportScope, { noDirectUpdate: true }),
  t("audit_events", "audit", "S3", tenant, { noDirectUpdate: true, retainedThroughDeletion: true }),
  t("audit_anchors", "audit", "S3", global, {
    noDirectUpdate: true,
    retainedThroughDeletion: true,
  }),
  t("deletion_requests", "deletion", "S3", tenant),
  t("deletion_ledger", "deletion", "S3", tenant, {
    noDirectUpdate: true,
    retainedThroughDeletion: true,
  }),
  t("retention_records", "deletion", "S3", tenant, { retainedThroughDeletion: true }),
  t("deletion_allowlist", "deletion", "S2", global),
  t("config_provisional", "config", "S2", global),
];

export const FMA_TABLE_NAMES = FMA_TABLES.map((x) => x.name) as readonly string[];

/**
 * Tables that BB2 defines but FM-A does NOT create (CR-1). Deferred capability
 * means tables not yet created, never tables shaped differently.
 */
export const NOT_CREATED_IN_FMA = [
  "document_derivatives",
  "document_chunks",
  "share_versions",
  "share_items",
  "grants",
  "reviewer_comments",
  "ai_runs",
  "legal_holds",
  "break_glass_requests",
  "drafts",
  "draft_versions",
  "authority_sources",
  "jurisdiction_packs",
  "fact_versions",
] as const;

/**
 * Deletion allow-list (CR-4). Every FM-A table appears exactly once. Global
 * tables are registered with a null scope column so the CI check can prove the
 * omission was deliberate rather than forgotten.
 */
export const DELETION_ALLOWLIST: readonly {
  table: string;
  scopeColumn: string | null;
  retained: boolean;
}[] = FMA_TABLES.map((x) => ({
  table: x.name,
  scopeColumn: x.scope.scopeColumn,
  retained: x.retainedThroughDeletion,
}));

export function tableSpec(name: string): TableSpec | undefined {
  return FMA_TABLES.find((x) => x.name === name);
}
