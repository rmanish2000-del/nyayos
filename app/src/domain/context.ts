/**
 * Request context — the ONLY source of tenant, principal and role information
 * for authorisation decisions.
 *
 * Architecture Deck slide 7, rule 5: "Context is set server-side only, never from
 * request body or headers." SDAS §5.3: "no client-supplied tenant_id trusted."
 * A server function builds this from the verified session and membership rows,
 * then passes it down. Nothing in this object may originate from client input.
 */

import { z } from "zod";

import { DISPUTE_ROLES, PLATFORM_ROLES, SERVICE_IDENTITIES, TENANT_ROLES } from "./enums";

export const Id = z.string().min(1).max(128);
export type Id = z.infer<typeof Id>;

export const DisputeMembership = z.object({
  disputeId: Id,
  role: z.enum(DISPUTE_ROLES),
});
export type DisputeMembership = z.infer<typeof DisputeMembership>;

export const UserPrincipal = z.object({
  kind: z.literal("user"),
  userId: Id,
  sessionId: Id,
  tenantId: Id,
  tenantRole: z.enum(TENANT_ROLES),
  disputeMemberships: z.array(DisputeMembership),
  platformRoles: z.array(z.enum(PLATFORM_ROLES)),
});
export type UserPrincipal = z.infer<typeof UserPrincipal>;

export const ServicePrincipal = z.object({
  kind: z.literal("service"),
  serviceIdentity: z.enum(SERVICE_IDENTITIES),
  /** The user whose request caused this service action, if any (audit `on_behalf_of`). */
  onBehalfOfUserId: Id.nullable(),
  tenantId: Id.nullable(),
});
export type ServicePrincipal = z.infer<typeof ServicePrincipal>;

export const AnonymousPrincipal = z.object({ kind: z.literal("anonymous") });
export type AnonymousPrincipal = z.infer<typeof AnonymousPrincipal>;

export const Principal = z.discriminatedUnion("kind", [
  UserPrincipal,
  ServicePrincipal,
  AnonymousPrincipal,
]);
export type Principal = z.infer<typeof Principal>;

export const RequestContext = z.object({
  requestId: Id,
  /** ISO-8601 timestamp taken server-side. */
  now: z.string().datetime(),
  principal: Principal,
  /** SHA-256 of the client IP with a server salt; raw IP never enters the domain (SDAS §17.1). */
  ipHash: z.string().nullable(),
  userAgentClass: z.enum(["mobile", "desktop", "service", "unknown"]),
});
export type RequestContext = z.infer<typeof RequestContext>;

export function isUser(p: Principal): p is UserPrincipal {
  return p.kind === "user";
}
export function isService(p: Principal): p is ServicePrincipal {
  return p.kind === "service";
}

/** Convenience for tests and server code: build a user context with safe defaults. */
export function userContext(
  input: Omit<UserPrincipal, "kind" | "platformRoles" | "disputeMemberships"> &
    Partial<Pick<UserPrincipal, "platformRoles" | "disputeMemberships">>,
  extra: Partial<Pick<RequestContext, "requestId" | "now" | "ipHash" | "userAgentClass">> = {},
): RequestContext {
  return RequestContext.parse({
    requestId: extra.requestId ?? "req-test",
    now: extra.now ?? new Date().toISOString(),
    ipHash: extra.ipHash ?? null,
    userAgentClass: extra.userAgentClass ?? "unknown",
    principal: {
      kind: "user",
      ...input,
      platformRoles: input.platformRoles ?? [],
      disputeMemberships: input.disputeMemberships ?? [],
    },
  });
}

export function serviceContext(
  serviceIdentity: ServicePrincipal["serviceIdentity"],
  extra: Partial<Pick<ServicePrincipal, "onBehalfOfUserId" | "tenantId">> &
    Partial<Pick<RequestContext, "requestId" | "now">> = {},
): RequestContext {
  return RequestContext.parse({
    requestId: extra.requestId ?? "req-service",
    now: extra.now ?? new Date().toISOString(),
    ipHash: null,
    userAgentClass: "service",
    principal: {
      kind: "service",
      serviceIdentity,
      onBehalfOfUserId: extra.onBehalfOfUserId ?? null,
      tenantId: extra.tenantId ?? null,
    },
  });
}
