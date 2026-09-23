// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  AuthorizationError,
  DISPUTE_ROLES,
  GRANT_PERMISSIONS,
  type RequestContext,
  assertAuthorized,
  authorize,
  grantAllows,
  isDisputeMember,
  serviceContext,
  userContext,
} from "@/domain";

const DISPUTE = { disputeId: "d1", tenantId: "t1" };

const owner = userContext({
  userId: "u1",
  sessionId: "s1",
  tenantId: "t1",
  tenantRole: "tenant_owner",
  disputeMemberships: [{ disputeId: "d1", role: "dispute_owner" }],
});

const viewer = userContext({
  userId: "u2",
  sessionId: "s2",
  tenantId: "t1",
  tenantRole: "tenant_owner",
  disputeMemberships: [{ disputeId: "d1", role: "dispute_viewer" }],
});

const otherTenantOwner = userContext({
  userId: "u3",
  sessionId: "s3",
  tenantId: "t2",
  tenantRole: "tenant_owner",
  // Even a forged membership row for d1 must not cross the tenant boundary.
  disputeMemberships: [{ disputeId: "d1", role: "dispute_owner" }],
});

const anonymous: RequestContext = {
  requestId: "r",
  now: new Date().toISOString(),
  principal: { kind: "anonymous" },
  ipHash: null,
  userAgentClass: "unknown",
};

describe("isDisputeMember — role matrix (SEC-RLS, SEC-TEN)", () => {
  it("owner satisfies every minimum role", () => {
    for (const r of DISPUTE_ROLES) expect(isDisputeMember(owner, DISPUTE, r)).toBe(true);
  });

  it("viewer satisfies viewer only", () => {
    expect(isDisputeMember(viewer, DISPUTE, "dispute_viewer")).toBe(true);
    expect(isDisputeMember(viewer, DISPUTE, "dispute_editor")).toBe(false);
    expect(isDisputeMember(viewer, DISPUTE, "dispute_owner")).toBe(false);
  });

  it("denies across tenants even with a matching dispute id (SEC-TEN-01)", () => {
    for (const r of DISPUTE_ROLES)
      expect(isDisputeMember(otherTenantOwner, DISPUTE, r)).toBe(false);
  });

  it("denies anonymous and service principals", () => {
    expect(isDisputeMember(anonymous, DISPUTE, "dispute_viewer")).toBe(false);
    expect(isDisputeMember(serviceContext("scan_worker"), DISPUTE, "dispute_viewer")).toBe(false);
  });

  it("denies a user with no membership row (absence of a grant is a denial)", () => {
    const noRole = userContext({
      userId: "u9",
      sessionId: "s9",
      tenantId: "t1",
      tenantRole: "tenant_owner",
    });
    expect(isDisputeMember(noRole, DISPUTE, "dispute_viewer")).toBe(false);
  });
});

describe("grantAllows — present and always false in FM-A (CR-2, S4)", () => {
  it("returns false for every permission and every principal", () => {
    for (const permission of GRANT_PERMISSIONS) {
      for (const ctx of [owner, viewer, otherTenantOwner, anonymous]) {
        expect(grantAllows(ctx, { disputeId: "d1", shareItemRef: "doc:1", permission })).toBe(
          false,
        );
      }
    }
  });
});

describe("authorize — deny by default", () => {
  it("denies anonymous for every requirement kind", () => {
    expect(authorize(anonymous, { kind: "self", userId: "x" })).toEqual({
      allowed: false,
      reason: "anonymous",
    });
    expect(authorize(anonymous, { kind: "tenant_member", tenantId: "t1" }).allowed).toBe(false);
    expect(authorize(anonymous, { kind: "service", identity: "scan_worker" }).allowed).toBe(false);
  });

  it("names the real cause of a denial", () => {
    expect(
      authorize(otherTenantOwner, {
        kind: "dispute_member",
        dispute: DISPUTE,
        minRole: "dispute_viewer",
      }),
    ).toEqual({
      allowed: false,
      reason: "tenant_mismatch",
    });
    expect(
      authorize(viewer, { kind: "dispute_member", dispute: DISPUTE, minRole: "dispute_editor" }),
    ).toEqual({
      allowed: false,
      reason: "insufficient_dispute_role",
    });
    expect(
      authorize(owner, {
        kind: "grant",
        input: { disputeId: "d1", shareItemRef: "x", permission: "view" },
      }),
    ).toEqual({
      allowed: false,
      reason: "grants_not_available",
    });
  });

  it("checks service identity exactly", () => {
    expect(
      authorize(serviceContext("scan_worker"), { kind: "service", identity: "scan_worker" })
        .allowed,
    ).toBe(true);
    expect(
      authorize(serviceContext("scan_worker"), { kind: "service", identity: "deletion_worker" }),
    ).toEqual({
      allowed: false,
      reason: "wrong_service_identity",
    });
    expect(authorize(owner, { kind: "service", identity: "scan_worker" })).toEqual({
      allowed: false,
      reason: "not_a_service",
    });
  });

  it("platform_security has no content path — only its explicit role check passes", () => {
    const sec = userContext({
      userId: "sec",
      sessionId: "s",
      tenantId: "t-platform",
      tenantRole: "tenant_owner",
      platformRoles: ["platform_security"],
    });
    expect(authorize(sec, { kind: "platform_role", role: "platform_security" }).allowed).toBe(true);
    expect(
      authorize(sec, { kind: "dispute_member", dispute: DISPUTE, minRole: "dispute_viewer" })
        .allowed,
    ).toBe(false);
  });

  it("assertAuthorized throws a coded error", () => {
    expect(() => assertAuthorized(viewer, { kind: "self", userId: "someone-else" })).toThrow(
      AuthorizationError,
    );
    try {
      assertAuthorized(viewer, { kind: "self", userId: "someone-else" });
    } catch (e) {
      expect((e as AuthorizationError).code).toBe("not_self");
    }
  });
});
