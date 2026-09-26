/**
 * Provisional configuration ([PROV]) — Build Brief V2 §3.3: "All [PROV] values
 * (TTLs, retention, thresholds) are configuration, not constants, so counsel
 * outcomes do not require code changes." This module is the typed registry for
 * `config_provisional`. Defaults are the values the specifications mark [PROV];
 * none of them is a legal position (Counsel Brief OL-02, OL-03, OL-05).
 */

export const PROV_CONFIG_KEYS = [
  "signed_url_view_ttl_seconds",
  "signed_url_download_ttl_seconds",
  "deletion_undo_window_days",
  "rejected_upload_purge_hours",
  "backup_rotation_days",
  "upload_max_bytes",
  "upload_max_pages",
  "otp_max_attempts",
  "audit_anchor_period_days",
  "document_reference_policy",
] as const;
export type ProvConfigKey = (typeof PROV_CONFIG_KEYS)[number];

export interface ProvConfigEntry<T extends string | number = string | number> {
  readonly key: ProvConfigKey;
  readonly value: T;
  readonly source: "PROV";
  readonly reference: string;
  readonly counselItem: string | null;
}

export type ProvConfig = {
  readonly signed_url_view_ttl_seconds: number;
  readonly signed_url_download_ttl_seconds: number;
  readonly deletion_undo_window_days: number;
  readonly rejected_upload_purge_hours: number;
  readonly backup_rotation_days: number;
  readonly upload_max_bytes: number;
  readonly upload_max_pages: number;
  readonly otp_max_attempts: number;
  readonly audit_anchor_period_days: number;
  /**
   * What happens when a document that canonical facts still reference is deleted.
   * "block" follows the Executive Architecture Deck (G5: reference-checked deletion).
   * "cascade" follows Scope Sheet SEC-DEL-01 (references removed). Recorded as an
   * open reconciliation item; default is the stricter reading.
   */
  readonly document_reference_policy: "block" | "cascade";
};

export const DEFAULT_PROV_CONFIG: ProvConfig = {
  signed_url_view_ttl_seconds: 5 * 60,
  signed_url_download_ttl_seconds: 2 * 60,
  deletion_undo_window_days: 7,
  rejected_upload_purge_hours: 24,
  backup_rotation_days: 35,
  upload_max_bytes: 10 * 1024 * 1024,
  upload_max_pages: 500,
  otp_max_attempts: 5,
  audit_anchor_period_days: 7,
  document_reference_policy: "block",
};

export const PROV_CONFIG_REFERENCES: Record<
  ProvConfigKey,
  { reference: string; counselItem: string | null }
> = {
  signed_url_view_ttl_seconds: { reference: "SDAS §5.3; Scope Sheet F06", counselItem: null },
  signed_url_download_ttl_seconds: { reference: "SDAS §5.3", counselItem: null },
  deletion_undo_window_days: { reference: "Scope Sheet F17", counselItem: "OL-02" },
  rejected_upload_purge_hours: { reference: "Scope Sheet A13", counselItem: null },
  backup_rotation_days: { reference: "Scope Sheet F20", counselItem: "OL-02" },
  upload_max_bytes: {
    reference: "Sprint 3 evidence upload (A-025); Scope Sheet SEC-UPL-03",
    counselItem: null,
  },
  upload_max_pages: { reference: "Scope Sheet SEC-UPL-03 (page bomb)", counselItem: null },
  otp_max_attempts: { reference: "Scope Sheet SEC-ATO-01", counselItem: null },
  audit_anchor_period_days: {
    reference: "Scope Sheet F05 (weekly manual anchor)",
    counselItem: null,
  },
  document_reference_policy: {
    reference: "Architecture Deck slide 15 / G5 vs Scope Sheet SEC-DEL-01 — reconciliation item",
    counselItem: null,
  },
};

export function provConfigEntries(config: ProvConfig = DEFAULT_PROV_CONFIG): ProvConfigEntry[] {
  return PROV_CONFIG_KEYS.map((key) => ({
    key,
    value: config[key],
    source: "PROV" as const,
    reference: PROV_CONFIG_REFERENCES[key].reference,
    counselItem: PROV_CONFIG_REFERENCES[key].counselItem,
  }));
}

export function resolveProvConfig(overrides: Partial<ProvConfig> = {}): ProvConfig {
  const merged: ProvConfig = { ...DEFAULT_PROV_CONFIG, ...overrides };
  for (const key of PROV_CONFIG_KEYS) {
    const v = merged[key];
    if (typeof v === "number" && (!Number.isFinite(v) || v <= 0)) {
      throw new Error(`config ${key} must be a positive finite number`);
    }
  }
  if (
    merged.document_reference_policy !== "block" &&
    merged.document_reference_policy !== "cascade"
  ) {
    throw new Error("config document_reference_policy must be 'block' or 'cascade'");
  }
  return merged;
}
