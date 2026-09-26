/**
 * A-043 client-side access rules for the seeded preview.
 *
 * These mirror the database rules (tenant boundary, deleted accounts, grant roles
 * disabled in FM-A) so the UI behaves the way the real service will. They are NOT
 * a security boundary: in the real service the server and row-level policies decide.
 */
import { FMA_ENABLED_GRANT_ROLES } from "@/domain";

import type { SeedDispute, SeedUser } from "./fixtures";

export type SignInOutcome =
  { ok: true } | { ok: false; reason: "account-unavailable" | "unknown-account" };

export function signInOutcome(user: SeedUser | undefined): SignInOutcome {
  if (!user) return { ok: false, reason: "unknown-account" };
  // Same message for deleted and unknown accounts: no account-existence disclosure.
  if (user.accountStatus !== "active") return { ok: false, reason: "account-unavailable" };
  return { ok: true };
}

export function reviewerAccessEnabled(): boolean {
  return (FMA_ENABLED_GRANT_ROLES as readonly string[]).includes("reviewer");
}

/** Disputes this user may see: their own tenant only. Reviewers see none in FM-A. */
export function visibleDisputes(user: SeedUser, disputes: readonly SeedDispute[]): SeedDispute[] {
  if (user.accountStatus !== "active") return [];
  if (user.grantRole === "reviewer" && !reviewerAccessEnabled()) return [];
  return disputes.filter((d) => d.tenantId === user.tenantId && d.status === "active");
}

/**
 * Returns the dispute only when the user may open it. A dispute in another tenant
 * and a dispute that does not exist return the same result, so the UI cannot reveal
 * that another person's dispute exists.
 */
export function disputeForUser(
  user: SeedUser,
  disputes: readonly SeedDispute[],
  disputeId: string,
): SeedDispute | null {
  return visibleDisputes(user, disputes).find((d) => d.id === disputeId) ?? null;
}
