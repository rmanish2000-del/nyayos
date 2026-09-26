// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  AUDIT_ACTIONS,
  CONSENT_PURPOSES,
  DELETION_ALLOWLIST,
  DISPUTE_ROLES,
  DRAFT_TIERS,
  FEATURE_FLAGS,
  FMA_EMITTED_AUDIT_ACTIONS,
  FMA_ENABLED_DRAFT_TIERS,
  FMA_ENABLED_GRANT_ROLES,
  FMA_ENABLED_PROPOSAL_ORIGINS,
  FMA_ENABLED_TENANT_TYPES,
  FMA_ENFORCED_PURPOSES,
  FMA_LOCKED_FLAGS,
  FMA_TABLE_NAMES,
  FMA_TABLES,
  GRANT_ROLES,
  LOCKED_PURPOSES,
  NOT_CREATED_IN_FMA,
  PROPOSAL_ORIGINS,
  TENANT_TYPES,
  allowlistCovers,
  resolveFeatureFlags,
} from "@/domain";

describe("CR-3 reserved enums are declared in full and FM-A uses a strict subset", () => {
  it("declares all four tenant types and enables only personal", () => {
    expect([...TENANT_TYPES]).toEqual([
      "personal",
      "organization",
      "advocate_workspace",
      "institution",
    ]);
    expect([...FMA_ENABLED_TENANT_TYPES]).toEqual(["personal"]);
  });

  it("declares grant roles but enables none (sharing arrives whole at FM-B)", () => {
    expect(GRANT_ROLES.length).toBe(4);
    expect(FMA_ENABLED_GRANT_ROLES.length).toBe(0);
  });

  it("declares ai and reviewer proposal origins as inert", () => {
    expect([...PROPOSAL_ORIGINS]).toEqual(["user", "ai", "reviewer"]);
    expect([...FMA_ENABLED_PROPOSAL_ORIGINS]).toEqual(["user"]);
  });

  it("declares the full purpose catalogue with storage and export enforced and two purposes locked", () => {
    expect(CONSENT_PURPOSES.length).toBe(11);
    expect([...FMA_ENFORCED_PURPOSES]).toEqual(["storage", "export"]);
    expect([...LOCKED_PURPOSES]).toEqual(["aggregate_analytics", "model_improvement"]);
  });

  it("declares draft tiers T0–T3 and enables none", () => {
    expect([...DRAFT_TIERS]).toEqual(["T0", "T1", "T2", "T3"]);
    expect(FMA_ENABLED_DRAFT_TIERS.length).toBe(0);
  });

  it("orders dispute roles viewer < editor < owner", () => {
    expect([...DISPUTE_ROLES]).toEqual(["dispute_owner", "dispute_editor", "dispute_viewer"]);
  });
});

describe("Audit catalogue (CR-5)", () => {
  it("has unique action names and every FM-A emitted action is in the catalogue", () => {
    expect(new Set(AUDIT_ACTIONS).size).toBe(AUDIT_ACTIONS.length);
    for (const a of FMA_EMITTED_AUDIT_ACTIONS) expect(AUDIT_ACTIONS).toContain(a);
  });

  it("never emits ai, grant, share, draft, pack or break-glass actions in FM-A", () => {
    const forbiddenPrefixes = [
      "ai.",
      "grant.",
      "share_version.",
      "draft.",
      "pack.",
      "break_glass.",
      "comment.",
      "legal_hold.",
    ];
    for (const a of FMA_EMITTED_AUDIT_ACTIONS) {
      expect(forbiddenPrefixes.some((p) => a.startsWith(p))).toBe(false);
    }
  });
});

describe("Feature flags (CR-11)", () => {
  it("has every deferred capability off by default and auth on", () => {
    const { ff_auth, ...rest } = FEATURE_FLAGS;
    expect(ff_auth).toBe(true);
    expect(Object.values(rest).every((v) => v === false)).toBe(true);
  });

  it("refuses to enable locked flags by configuration", () => {
    for (const flag of FMA_LOCKED_FLAGS) {
      expect(() => resolveFeatureFlags({ [flag]: true })).toThrow(/locked off/);
    }
    expect(resolveFeatureFlags({ ff_docx: true }).ff_docx).toBe(true);
  });
});

describe("Table registry and deletion allow-list (CR-1, CR-4, SEC-DEL-06)", () => {
  it("registers every FM-A table exactly once in the allow-list", () => {
    expect(allowlistCovers()).toEqual({ ok: true });
    const names = DELETION_ALLOWLIST.map((x) => x.table);
    expect(new Set(names).size).toBe(names.length);
    expect(names.length).toBe(FMA_TABLE_NAMES.length);
  });

  it("reports a table that was added without registration", () => {
    const result = allowlistCovers([...FMA_TABLE_NAMES, "brand_new_table"]);
    expect(result).toEqual({ ok: false, missing: ["brand_new_table"] });
  });

  it("creates none of the deferred BB2 tables", () => {
    for (const n of NOT_CREATED_IN_FMA) expect(FMA_TABLE_NAMES).not.toContain(n);
  });

  it("marks every canonical §4.3 table and the audit tables as no-direct-update", () => {
    const canonical = [
      "dispute_statements",
      "entities",
      "events",
      "date_assertions",
      "propositions",
      "evidence_items",
      "evidence_relations",
      "contradictions",
      "missing_evidence",
      "issues",
      "next_steps",
      "audit_events",
      "user_corrections",
      "document_versions",
    ];
    for (const name of canonical) {
      const spec = FMA_TABLES.find((x) => x.name === name);
      expect(spec, name).toBeDefined();
      expect(spec!.noDirectUpdate, name).toBe(true);
    }
  });

  it("retains audit, anchor, ledger and retention rows through deletion", () => {
    const retained = FMA_TABLES.filter((x) => x.retainedThroughDeletion).map((x) => x.name);
    expect(retained.sort()).toEqual([
      "audit_anchors",
      "audit_events",
      "deletion_ledger",
      "retention_records",
    ]);
  });
});
