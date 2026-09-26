/**
 * Identity and tenancy entities (Scope Sheet §4.1; SDAS §4; BB2 §4.5).
 *
 * Roles live in membership/role tables, never on profile rows. The auth provider
 * owns passwords, tokens, OTPs and MFA factors; the domain sees only a session
 * record with no secret material (SDAS §3.2 "Authentication data").
 */

import { z } from "zod";

import { Id } from "./context";
import {
  DISPUTE_ROLES,
  FMA_ENABLED_TENANT_TYPES,
  NOTICE_LANGUAGES,
  PLATFORM_ROLES,
  TENANT_ROLES,
  TENANT_TYPES,
} from "./enums";

export const Profile = z.object({
  userId: Id,
  displayName: z.string().min(1).max(200),
  preferredLanguage: z.enum(NOTICE_LANGUAGES),
  createdAt: z.string().datetime(),
});
export type Profile = z.infer<typeof Profile>;

export const Tenant = z.object({
  id: Id,
  /** Immutable after creation (BB2 §4.5). */
  type: z.enum(TENANT_TYPES),
  name: z.string().min(1).max(200),
  createdAt: z.string().datetime(),
});
export type Tenant = z.infer<typeof Tenant>;

export const TenantMembership = z.object({
  tenantId: Id,
  userId: Id,
  tenantRole: z.enum(TENANT_ROLES),
  status: z.enum(["active", "invited", "removed"]),
  invitedBy: Id.nullable(),
  joinedAt: z.string().datetime(),
});
export type TenantMembership = z.infer<typeof TenantMembership>;

export const DisputeRoleRow = z.object({
  disputeId: Id,
  userId: Id,
  disputeRole: z.enum(DISPUTE_ROLES),
});
export type DisputeRoleRow = z.infer<typeof DisputeRoleRow>;

export const PlatformRoleRow = z.object({
  userId: Id,
  role: z.enum(PLATFORM_ROLES),
  grantedBy: Id,
  grantedAt: z.string().datetime(),
});
export type PlatformRoleRow = z.infer<typeof PlatformRoleRow>;

/** Session record as the domain sees it. Contains NO token material. */
export const Session = z.object({
  id: Id,
  userId: Id,
  tenantId: Id,
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  revokedAt: z.string().datetime().nullable(),
  deviceClass: z.enum(["mobile", "desktop", "unknown"]),
  mfaVerified: z.boolean(),
});
export type Session = z.infer<typeof Session>;

export function isSessionActive(s: Session, now: string): boolean {
  return s.revokedAt === null && s.expiresAt > now;
}

/** Revoking sessions is a new record state, never a delete (audit `auth.session_revoked`). */
export function revokeSession(s: Session, now: string): Session {
  return s.revokedAt === null ? { ...s, revokedAt: now } : s;
}

export interface SignUpResult {
  readonly profile: Profile;
  readonly tenant: Tenant;
  readonly membership: TenantMembership;
}

/**
 * Personal tenant auto-created on sign-up (F02, AC-M0-02). Exactly one owner;
 * organisation tenants are reserved behind `ff_org_tenants`.
 */
export function createPersonalTenantOnSignUp(input: {
  userId: string;
  tenantId: string;
  displayName: string;
  preferredLanguage: Profile["preferredLanguage"];
  now: string;
}): SignUpResult {
  const type = FMA_ENABLED_TENANT_TYPES[0];
  return {
    profile: Profile.parse({
      userId: input.userId,
      displayName: input.displayName,
      preferredLanguage: input.preferredLanguage,
      createdAt: input.now,
    }),
    tenant: Tenant.parse({
      id: input.tenantId,
      type,
      name: input.displayName,
      createdAt: input.now,
    }),
    membership: TenantMembership.parse({
      tenantId: input.tenantId,
      userId: input.userId,
      tenantRole: "tenant_owner",
      status: "active",
      invitedBy: null,
      joinedAt: input.now,
    }),
  };
}

/** Tenant type may never change after creation (BB2 §4.5 "type immutable"). */
export function assertTenantTypeImmutable(before: Tenant, after: Tenant): void {
  if (before.id === after.id && before.type !== after.type) {
    throw new Error("tenant.type is immutable");
  }
}
