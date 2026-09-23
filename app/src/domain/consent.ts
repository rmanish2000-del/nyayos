/**
 * Consent model (SDAS §9; Scope Sheet §4.2, F03–F04).
 *
 * Consent records are append-only; withdrawal is a new state, not an overwrite.
 * `requirePurpose` is the check every content-processing server function runs
 * before doing anything (BB2 §3.3). In FM-A only `storage` and `export` are
 * enforceable; `aggregate_analytics` and `model_improvement` are hard-locked off
 * and can never pass, regardless of any consent row (S8, D-017).
 */

import { z } from "zod";

import { Id } from "./context";
import {
  CONSENT_METHODS,
  CONSENT_PURPOSES,
  CONSENT_SCOPE_TYPES,
  type ConsentPurpose,
  FMA_ENFORCED_PURPOSES,
  LOCKED_PURPOSES,
  NOTICE_LANGUAGES,
} from "./enums";

export const Consent = z.object({
  id: Id,
  principalUserId: Id,
  tenantId: Id,
  scopeType: z.enum(CONSENT_SCOPE_TYPES),
  /** account: the user id; dispute: the dispute id; grant: reserved. */
  scopeId: Id,
  purpose: z.enum(CONSENT_PURPOSES),
  noticeVersion: z.string().min(1),
  noticeLanguage: z.enum(NOTICE_LANGUAGES),
  method: z.enum(CONSENT_METHODS),
  grantedAt: z.string().datetime(),
  withdrawnAt: z.string().datetime().nullable(),
  requestId: Id,
});
export type Consent = z.infer<typeof Consent>;

export const Notice = z.object({
  purpose: z.enum(CONSENT_PURPOSES),
  /** Hindi and English carry the SAME version id (BB2 §3.3; SEC-LANG-04). */
  version: z.string().min(1),
  language: z.enum(NOTICE_LANGUAGES),
  textRef: z.string().min(1),
  effectiveFrom: z.string().datetime(),
});
export type Notice = z.infer<typeof Notice>;

export type PurposeScope =
  { scopeType: "account"; scopeId: string } | { scopeType: "dispute"; scopeId: string };

export type PurposeCheck =
  | { ok: true; consentId: string }
  | {
      ok: false;
      code:
        | "purpose_locked"
        | "purpose_not_available_in_fma"
        | "purpose_not_consented"
        | "purpose_withdrawn";
      purpose: ConsentPurpose;
    };

export function isLockedPurpose(purpose: ConsentPurpose): boolean {
  return (LOCKED_PURPOSES as readonly ConsentPurpose[]).includes(purpose);
}

export function isEnforceableInFma(purpose: ConsentPurpose): boolean {
  return (FMA_ENFORCED_PURPOSES as readonly ConsentPurpose[]).includes(purpose);
}

/**
 * Pure purpose check over the consent rows visible to the caller. Missing consent
 * maps to HTTP 403 `purpose_not_consented` at the transport layer (SDAS §9.4).
 */
export function requirePurpose(
  purpose: ConsentPurpose,
  scope: PurposeScope,
  consents: readonly Consent[],
  now: string,
): PurposeCheck {
  if (isLockedPurpose(purpose)) return { ok: false, code: "purpose_locked", purpose };
  if (!isEnforceableInFma(purpose))
    return { ok: false, code: "purpose_not_available_in_fma", purpose };

  const matching = consents.filter(
    (c) => c.purpose === purpose && c.scopeType === scope.scopeType && c.scopeId === scope.scopeId,
  );
  if (matching.length === 0) return { ok: false, code: "purpose_not_consented", purpose };

  // Latest record wins; withdrawal is a later record with withdrawnAt set.
  const latest = [...matching].sort((a, b) => a.grantedAt.localeCompare(b.grantedAt)).at(-1)!;
  if (latest.withdrawnAt !== null && latest.withdrawnAt <= now) {
    return { ok: false, code: "purpose_withdrawn", purpose };
  }
  return { ok: true, consentId: latest.id };
}

/** A consent that can never be granted: writing it is a programming error, not a user choice. */
export function assertGrantable(purpose: ConsentPurpose): void {
  if (isLockedPurpose(purpose)) {
    throw new Error(`consent purpose ${purpose} is locked off in FM-A and cannot be granted`);
  }
  if (!isEnforceableInFma(purpose)) {
    throw new Error(
      `consent purpose ${purpose} is reserved for a later milestone and cannot be granted in FM-A`,
    );
  }
}

/** Build the append-only withdrawal record for an existing consent. */
export function withdrawConsent(
  existing: Consent,
  now: string,
  requestId: string,
  newId: string,
): Consent {
  return { ...existing, id: newId, withdrawnAt: now, requestId };
}
