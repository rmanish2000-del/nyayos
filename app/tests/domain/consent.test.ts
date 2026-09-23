// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  type Consent,
  LOCKED_PURPOSES,
  assertGrantable,
  requirePurpose,
  withdrawConsent,
} from "@/domain";

const NOW = "2026-09-23T10:00:00.000Z";

const storage: Consent = {
  id: "c1",
  principalUserId: "u1",
  tenantId: "t1",
  scopeType: "account",
  scopeId: "u1",
  purpose: "storage",
  noticeVersion: "2026-09-v1",
  noticeLanguage: "hi",
  method: "click",
  grantedAt: "2026-09-20T00:00:00.000Z",
  withdrawnAt: null,
  requestId: "r1",
};

describe("requirePurpose (S8, AC-M0-06)", () => {
  it("passes when an active consent exists for the exact scope", () => {
    expect(
      requirePurpose("storage", { scopeType: "account", scopeId: "u1" }, [storage], NOW),
    ).toEqual({ ok: true, consentId: "c1" });
  });

  it("denies when no consent exists", () => {
    expect(
      requirePurpose("storage", { scopeType: "account", scopeId: "u2" }, [storage], NOW),
    ).toMatchObject({
      ok: false,
      code: "purpose_not_consented",
    });
  });

  it("denies after withdrawal (append-only, latest record wins)", () => {
    const withdrawn = withdrawConsent(storage, "2026-09-22T00:00:00.000Z", "r2", "c2");
    const rows = [storage, { ...withdrawn, grantedAt: "2026-09-22T00:00:00.000Z" }];
    expect(
      requirePurpose("storage", { scopeType: "account", scopeId: "u1" }, rows, NOW),
    ).toMatchObject({ ok: false, code: "purpose_withdrawn" });
  });

  it("locked purposes can never pass, even with a consent row present", () => {
    for (const purpose of LOCKED_PURPOSES) {
      const forged: Consent = { ...storage, id: "forged", purpose };
      expect(
        requirePurpose(purpose, { scopeType: "account", scopeId: "u1" }, [forged], NOW),
      ).toMatchObject({ ok: false, code: "purpose_locked" });
      expect(() => assertGrantable(purpose)).toThrow(/locked off/);
    }
  });

  it("reserved purposes are unavailable in FM-A (no AI, no sharing)", () => {
    for (const purpose of ["ai_assistance", "share_reviewer", "extraction", "support"] as const) {
      expect(
        requirePurpose(
          purpose,
          { scopeType: "account", scopeId: "u1" },
          [{ ...storage, purpose }],
          NOW,
        ),
      ).toMatchObject({
        ok: false,
        code: "purpose_not_available_in_fma",
      });
      expect(() => assertGrantable(purpose)).toThrow(/later milestone/);
    }
  });

  it("export requires its own consent, separate from storage", () => {
    expect(
      requirePurpose("export", { scopeType: "account", scopeId: "u1" }, [storage], NOW),
    ).toMatchObject({ ok: false, code: "purpose_not_consented" });
    expect(() => assertGrantable("export")).not.toThrow();
  });
});
