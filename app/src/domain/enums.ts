/**
 * NyayOS FM-A domain enums.
 *
 * Every enum is declared IN FULL here, including values that FM-A never uses
 * (Fast Mode Strategy CR-3: "Enums reserved"). Enabling a later capability adds
 * rows or flips a flag; it never alters a type. Each enum names the FM-A-enabled
 * subset separately so tests can assert that reserved values stay inert.
 *
 * Sources: FM-A Scope Sheet V1 §4; Security & Data Architecture Spec V1 §4.2–4.3,
 * §9.2, §17.2; Build Brief V2 §3.3. No legal, AI or marketplace behaviour is
 * defined here — only vocabulary.
 */

// ---------------------------------------------------------------------------
// Tenancy and roles (SDAS §4.2–4.3)
// ---------------------------------------------------------------------------

export const TENANT_TYPES = [
  "personal",
  "organization",
  "advocate_workspace",
  "institution",
] as const;
export type TenantType = (typeof TENANT_TYPES)[number];
/** FM-A creates personal tenants only (Scope Sheet §4.1, `ff_org_tenants` off). */
export const FMA_ENABLED_TENANT_TYPES = ["personal"] as const satisfies readonly TenantType[];

export const TENANT_ROLES = ["tenant_owner", "org_admin", "member"] as const;
export type TenantRole = (typeof TENANT_ROLES)[number];
export const FMA_ENABLED_TENANT_ROLES = ["tenant_owner"] as const satisfies readonly TenantRole[];

export const DISPUTE_ROLES = ["dispute_owner", "dispute_editor", "dispute_viewer"] as const;
export type DisputeRole = (typeof DISPUTE_ROLES)[number];
export const FMA_ENABLED_DISPUTE_ROLES = [
  "dispute_owner",
] as const satisfies readonly DisputeRole[];
/** Higher number = more authority. Used by `isDisputeMember(…, minRole)`. */
export const DISPUTE_ROLE_RANK: Record<DisputeRole, number> = {
  dispute_viewer: 1,
  dispute_editor: 2,
  dispute_owner: 3,
};

export const GRANT_ROLES = ["reviewer", "neutral", "institution_viewer", "support"] as const;
export type GrantRole = (typeof GRANT_ROLES)[number];
/** No grant role is enabled in FM-A; sharing arrives whole at FM-B (CR-7). */
export const FMA_ENABLED_GRANT_ROLES = [] as const satisfies readonly GrantRole[];

export const GRANT_PERMISSIONS = [
  "view",
  "comment",
  "suggest",
  "view_document_original",
  "download_document",
  "download_export",
] as const;
export type GrantPermission = (typeof GRANT_PERMISSIONS)[number];

export const PLATFORM_ROLES = [
  "platform_security",
  "platform_support",
  "pack_curator",
  "pack_approver",
] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];
/** `platform_security` exists to record deletion verification (A25); it has no content read path. */
export const FMA_ENABLED_PLATFORM_ROLES = [
  "platform_security",
] as const satisfies readonly PlatformRole[];

export const SERVICE_IDENTITIES = [
  "scan_worker",
  "promote_worker",
  "deletion_worker",
  "audit_writer",
] as const;
export type ServiceIdentity = (typeof SERVICE_IDENTITIES)[number];

// ---------------------------------------------------------------------------
// Consent (SDAS §9.2; Scope Sheet §4.2, F03)
// ---------------------------------------------------------------------------

export const CONSENT_PURPOSES = [
  "storage",
  "extraction",
  "ai_assistance",
  "share_reviewer",
  "engagement_request",
  "conflict_check",
  "share_neutral",
  "export",
  "support",
  "aggregate_analytics",
  "model_improvement",
] as const;
export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];
/** Purposes a user can actually consent to and that server functions enforce in FM-A. */
export const FMA_ENFORCED_PURPOSES = [
  "storage",
  "export",
] as const satisfies readonly ConsentPurpose[];
/** Hard-locked off: cannot be enabled by any configuration in FM-A (D-017, S8). */
export const LOCKED_PURPOSES = [
  "aggregate_analytics",
  "model_improvement",
] as const satisfies readonly ConsentPurpose[];

export const CONSENT_SCOPE_TYPES = ["account", "dispute", "grant"] as const;
export type ConsentScopeType = (typeof CONSENT_SCOPE_TYPES)[number];
export const FMA_ENABLED_CONSENT_SCOPE_TYPES = [
  "account",
  "dispute",
] as const satisfies readonly ConsentScopeType[];

export const CONSENT_METHODS = ["click", "otp_confirmed"] as const;
export type ConsentMethod = (typeof CONSENT_METHODS)[number];

export const NOTICE_LANGUAGES = ["hi", "en"] as const;
export type NoticeLanguage = (typeof NOTICE_LANGUAGES)[number];

// ---------------------------------------------------------------------------
// Canonical facts, provenance and single-writer (Scope Sheet §4.3–4.4, F13–F15)
// ---------------------------------------------------------------------------

export const PROPOSAL_ORIGINS = ["user", "ai", "reviewer"] as const;
export type ProposalOrigin = (typeof PROPOSAL_ORIGINS)[number];
/** Only the owner can originate proposals in FM-A (S3, S11). `ai` and `reviewer` are inert. */
export const FMA_ENABLED_PROPOSAL_ORIGINS = ["user"] as const satisfies readonly ProposalOrigin[];

export const PROPOSAL_STATUSES = ["pending", "accepted", "rejected"] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

/** U08 states. `not_relevant` keeps the item; nothing is silently discarded. */
export const VERIFICATION_STATUSES = [
  "pending",
  "confirmed",
  "corrected",
  "uncertain",
  "not_relevant",
] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

/**
 * Provenance origin of an item's value (F15). Fixed in FM-A (CR-8); AI becomes
 * another origin later without changing this contract.
 */
export const ITEM_ORIGIN_TYPES = [
  "user_statement",
  "document_extraction",
  "user_inference",
  "ai_extraction",
] as const;
export type ItemOriginType = (typeof ITEM_ORIGIN_TYPES)[number];
export const FMA_ENABLED_ITEM_ORIGIN_TYPES = [
  "user_statement",
  "document_extraction",
  "user_inference",
] as const satisfies readonly ItemOriginType[];

/** Confidence is shown as bands only, never as a number (BB2 §3.3, MPS §11). */
export const CONFIDENCE_BANDS = ["high", "medium", "low", "unknown"] as const;
export type ConfidenceBand = (typeof CONFIDENCE_BANDS)[number];

export const DATE_PRECISIONS = [
  "exact",
  "approximate",
  "inferred",
  "unknown",
  "conflicting",
] as const;
export type DatePrecision = (typeof DATE_PRECISIONS)[number];

export const EVIDENCE_RELATIONS = [
  "supports",
  "partially_supports",
  "contradicts",
  "mentions",
  "uncertain",
] as const;
export type EvidenceRelation = (typeof EVIDENCE_RELATIONS)[number];

export const CONTRADICTION_STATUSES = ["open", "reviewed", "resolved_by_user"] as const;
export type ContradictionStatus = (typeof CONTRADICTION_STATUSES)[number];

export const ENTITY_TYPES = ["person", "organisation"] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const STATEMENT_KINDS = ["narrative", "intake_answer"] as const;
export type StatementKind = (typeof STATEMENT_KINDS)[number];

export const DISPUTE_STATUSES = ["active", "deletion_requested", "deleted"] as const;
export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];

/** Every canonical item kind that the single-writer path may target (A06/A07). */
export const CANONICAL_TARGET_TYPES = [
  "dispute_statement",
  "entity",
  "entity_source_form",
  "event",
  "date_assertion",
  "proposition",
  "evidence_item",
  "evidence_relation",
  "contradiction",
  "missing_evidence",
  "issue",
  "next_step",
] as const;
export type CanonicalTargetType = (typeof CANONICAL_TARGET_TYPES)[number];

// ---------------------------------------------------------------------------
// Evidence lifecycle (Scope Sheet §4.5, F07–F08; Architecture Deck slides 10–11)
// ---------------------------------------------------------------------------

export const UPLOAD_STATES = [
  "received",
  "quarantined",
  "scanning",
  "clean",
  "rejected",
  "promoted",
  "purged",
] as const;
export type UploadState = (typeof UPLOAD_STATES)[number];

export const SCAN_VERDICTS = ["clean", "infected", "failed", "unavailable"] as const;
export type ScanVerdict = (typeof SCAN_VERDICTS)[number];

export const DOCUMENT_STATUSES = ["ready", "deletion_requested", "deleted"] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const CUSTODY_EVENTS = [
  "ingested",
  "scanned",
  "quarantined",
  "promoted",
  "viewed",
  "exported",
  "replaced",
  "deletion_requested",
  "deleted",
] as const;
export type CustodyEventKind = (typeof CUSTODY_EVENTS)[number];

/** Accepted upload media types in FM-A (F09). DOC/DOCX rejected while `ff_docx` is off. */
export const FMA_ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "text/plain",
] as const;
export type AcceptedMimeType = (typeof FMA_ACCEPTED_MIME_TYPES)[number];

export const JOB_TYPES = ["scan"] as const;
export type JobType = (typeof JOB_TYPES)[number];
export const JOB_STATES = ["queued", "running", "succeeded", "failed", "dead"] as const;
export type JobState = (typeof JOB_STATES)[number];

// ---------------------------------------------------------------------------
// Export (Scope Sheet §4.6, F16)
// ---------------------------------------------------------------------------

export const EXPORT_PROFILES = ["full_case_file"] as const;
export type ExportProfile = (typeof EXPORT_PROFILES)[number];

export const EXPORT_SECTIONS = [
  "brief",
  "chronology",
  "evidence_index",
  "issues",
  "gaps",
  "corrections",
  "manifest",
  "notices",
] as const;
export type ExportSection = (typeof EXPORT_SECTIONS)[number];

// ---------------------------------------------------------------------------
// Audit (SDAS §17; Scope Sheet §5 audit column)
// ---------------------------------------------------------------------------

export const AUDIT_ACTOR_TYPES = ["user", "service", "system"] as const;
export type AuditActorType = (typeof AUDIT_ACTOR_TYPES)[number];

export const AUDIT_OUTCOMES = ["success", "denied", "error"] as const;
export type AuditOutcome = (typeof AUDIT_OUTCOMES)[number];

export const AUDIT_SEVERITIES = ["info", "low", "medium", "high"] as const;
export type AuditSeverity = (typeof AUDIT_SEVERITIES)[number];

/**
 * Audit action catalogue. Names follow the BB2 / SDAS §17.2 catalogue and the
 * FM-A API matrix; later milestones ADD actions, never rename (CR-5). Reserved
 * categories (ai.*, grant.*, share_version.*, draft.*, pack.*, break_glass.*)
 * are declared so the catalogue is complete, but no FM-A code path emits them.
 */
export const AUDIT_ACTIONS = [
  // Authentication
  "auth.sign_in",
  "auth.sign_out",
  "auth.failed",
  "auth.otp_sent",
  "auth.otp_failed",
  "auth.mfa_enrolled",
  "auth.session_revoked",
  "auth.new_device",
  // Dispute core (FM-A API matrix)
  "dispute.created",
  "dispute.accessed",
  "statement.added",
  "location.added",
  "contradiction.flagged",
  // Upload / documents
  "document.upload_started",
  "document.quarantined",
  "document.scan_result",
  "document.promoted",
  "document.rejected",
  "document.replaced",
  "document.viewed",
  "document.downloaded",
  "signed_url.issued",
  "signed_url.denied",
  // Extraction (reserved: FM-D)
  "extraction.queued",
  "extraction.completed",
  "extraction.failed",
  // AI run (reserved: FM-D; no FM-A emitter exists)
  "ai.run_started",
  "ai.run_completed",
  "ai.validation_failed",
  "ai.safety_flag",
  // Fact correction
  "proposal.created",
  "proposal.accepted",
  "proposal.rejected",
  "correction.created",
  // Consent
  "consent.granted",
  "consent.withdrawn",
  "consent.denied_processing",
  // Share (reserved: FM-B)
  "share_version.created",
  "grant.invited",
  "grant.accepted",
  "grant.identity_declared",
  "grant.renewed",
  "grant.view_session",
  "grant.denied_access",
  "grant.revoked",
  "grant.expired",
  "comment.created",
  "comment.edited",
  // Export
  "export.previewed",
  "export.generated",
  "export.downloaded",
  "export.deleted",
  // Deletion
  "deletion.requested",
  "deletion.undone",
  "deletion.purged",
  "deletion.verified",
  "deletion.incomplete",
  "legal_hold.applied",
  "legal_hold.released",
  // Permission change
  "membership.added",
  "membership.removed",
  "membership.role_changed",
  "dispute_role.changed",
  "ownership.transferred",
  "platform_role.changed",
  // Security event
  "rate_limit.hit",
  "break_glass.requested",
  "break_glass.approved",
  "break_glass.used",
  "break_glass.ended",
  "secret.rotated",
  "scan.failed",
  "anomaly.detected",
  "authz.denied",
  // Policy pack (reserved: BB2 M3)
  "pack.proposed",
  "pack.approved",
  "pack.activated",
  "pack.rolled_back",
  "source.stale",
  "source.status_changed",
  // Draft review (reserved: BB2 M3)
  "draft.version_created",
  "draft.validated",
  "draft.validation_failed",
  "draft.approved",
  "draft.frozen",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

/** Actions an FM-A code path may emit. Everything else in the catalogue is reserved. */
export const FMA_EMITTED_AUDIT_ACTIONS = [
  "auth.sign_in",
  "auth.sign_out",
  "auth.failed",
  "auth.otp_sent",
  "auth.otp_failed",
  "auth.mfa_enrolled",
  "auth.session_revoked",
  "auth.new_device",
  "dispute.created",
  "dispute.accessed",
  "statement.added",
  "location.added",
  "contradiction.flagged",
  "document.upload_started",
  "document.quarantined",
  "document.scan_result",
  "document.promoted",
  "document.rejected",
  "document.replaced",
  "document.viewed",
  "signed_url.issued",
  "signed_url.denied",
  "proposal.created",
  "proposal.accepted",
  "proposal.rejected",
  "correction.created",
  "consent.granted",
  "consent.withdrawn",
  "consent.denied_processing",
  "export.previewed",
  "export.generated",
  "export.downloaded",
  "export.deleted",
  "deletion.requested",
  "deletion.undone",
  "deletion.purged",
  "deletion.verified",
  "deletion.incomplete",
  "membership.added",
  "rate_limit.hit",
  "scan.failed",
  "authz.denied",
] as const satisfies readonly AuditAction[];

// ---------------------------------------------------------------------------
// Deletion (Scope Sheet §4.6, F17; Architecture Deck slide 15)
// ---------------------------------------------------------------------------

export const DELETION_SCOPE_TYPES = ["document", "dispute", "account"] as const;
export type DeletionScopeType = (typeof DELETION_SCOPE_TYPES)[number];

/**
 * Deletion request states. "requested" = undo window open. "locked" = undo window
 * closed, purge pending. "incomplete" is a truthful terminal-until-remediated state:
 * the UI must never show it as completed (S9, AC-M6-04).
 */
export const DELETION_STATES = [
  "requested",
  "undone",
  "locked",
  "purging",
  "purged",
  "verified",
  "incomplete",
] as const;
export type DeletionState = (typeof DELETION_STATES)[number];

// ---------------------------------------------------------------------------
// Classification and reserved draft/tier vocabulary (SDAS §3.1, §14.1)
// ---------------------------------------------------------------------------

export const SENSITIVITY_LEVELS = ["S1", "S2", "S3", "S4"] as const;
export type SensitivityLevel = (typeof SENSITIVITY_LEVELS)[number];

/** Reserved (CR-3). No draft object is created in FM-A; no draft has legal content. */
export const DRAFT_TIERS = ["T0", "T1", "T2", "T3"] as const;
export type DraftTier = (typeof DRAFT_TIERS)[number];
export const FMA_ENABLED_DRAFT_TIERS = [] as const satisfies readonly DraftTier[];

export const DRAFT_TYPES = ["communication_outline_t0"] as const;
export type DraftType = (typeof DRAFT_TYPES)[number];
export const FMA_ENABLED_DRAFT_TYPES = [] as const satisfies readonly DraftType[];

// ---------------------------------------------------------------------------
// Feature flags (Scope Sheet §2, §3.1; CR-11 "flags, not forks")
// ---------------------------------------------------------------------------

export const FEATURE_FLAGS = {
  ff_auth: true,
  ff_org_tenants: false,
  ff_consent_ai: false,
  ff_consent_share: false,
  ff_audit_anchor_auto: false,
  ff_docx: false,
  ff_ai_questions: false,
  ff_export_profiles_multi: false,
  ff_deletion_auto_verify: false,
  ff_mfa_required: false,
  ff_break_glass_tooling: false,
  ff_sharing: false,
} as const;
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
export type FeatureFlags = Readonly<Record<FeatureFlag, boolean>>;

/** Flags that no configuration may turn on in FM-A. Enabling them is a later milestone's build. */
export const FMA_LOCKED_FLAGS = [
  "ff_consent_ai",
  "ff_ai_questions",
  "ff_sharing",
  "ff_consent_share",
] as const satisfies readonly FeatureFlag[];

export function resolveFeatureFlags(
  overrides: Partial<Record<FeatureFlag, boolean>> = {},
): FeatureFlags {
  const out: Record<FeatureFlag, boolean> = { ...FEATURE_FLAGS };
  for (const [key, value] of Object.entries(overrides) as [FeatureFlag, boolean][]) {
    if ((FMA_LOCKED_FLAGS as readonly string[]).includes(key) && value === true) {
      throw new Error(
        `feature flag ${key} is locked off in FM-A and cannot be enabled by configuration`,
      );
    }
    out[key] = value;
  }
  return out;
}
