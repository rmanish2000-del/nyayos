// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  DONT_KNOW,
  type DateAssertion,
  type IntakeQuestion,
  PROHIBITED_TERMS,
  assertTenantTypeImmutable,
  createPersonalTenantOnSignUp,
  isProvenanceComplete,
  isSessionActive,
  markConflictingDates,
  nextQuestion,
  revokeSession,
  validateContradiction,
  validateEvidenceRelation,
} from "@/domain";

const NOW = "2026-09-23T10:00:00.000Z";

describe("Sign-up creates exactly one personal tenant with one owner (F02, AC-M0-02)", () => {
  it("returns profile, tenant and membership with no role on the profile", () => {
    const r = createPersonalTenantOnSignUp({
      userId: "u1",
      tenantId: "t1",
      displayName: "A",
      preferredLanguage: "hi",
      now: NOW,
    });
    expect(r.tenant.type).toBe("personal");
    expect(r.membership).toMatchObject({
      tenantRole: "tenant_owner",
      status: "active",
      invitedBy: null,
    });
    expect(Object.keys(r.profile)).not.toContain("role");
  });

  it("tenant type is immutable", () => {
    const r = createPersonalTenantOnSignUp({
      userId: "u1",
      tenantId: "t1",
      displayName: "A",
      preferredLanguage: "en",
      now: NOW,
    });
    expect(() =>
      assertTenantTypeImmutable(r.tenant, { ...r.tenant, type: "organization" }),
    ).toThrow(/immutable/);
  });

  it("session revocation is a state change, and an expired or revoked session is inactive", () => {
    const s = {
      id: "s1",
      userId: "u1",
      tenantId: "t1",
      issuedAt: NOW,
      expiresAt: "2026-09-24T10:00:00.000Z",
      revokedAt: null,
      deviceClass: "mobile" as const,
      mfaVerified: false,
    };
    expect(isSessionActive(s, NOW)).toBe(true);
    expect(isSessionActive(revokeSession(s, NOW), NOW)).toBe(false);
    expect(isSessionActive(s, "2026-09-25T00:00:00.000Z")).toBe(false);
  });
});

describe("Deterministic intake (F12, FN-02) — no model call, 'I don't know' preserved", () => {
  const q = (key: string, rules: IntakeQuestion["branchRules"]): IntakeQuestion => ({
    id: key,
    key,
    textHi: "प्रश्न",
    textEn: "Question",
    whyWeAskHi: "क्यों",
    whyWeAskEn: "Why",
    allowDontKnow: true,
    branchRules: rules,
    version: 1,
  });
  const questions = [
    q("q1", [
      { whenQuestionKey: "q1", equals: "yes", nextQuestionKey: "q2" },
      { whenQuestionKey: "q1", equals: null, nextQuestionKey: "q3" },
    ]),
    q("q2", [{ whenQuestionKey: "q2", equals: null, nextQuestionKey: null }]),
    q("q3", [{ whenQuestionKey: "q3", equals: null, nextQuestionKey: null }]),
  ];

  it("branches on the answer and falls back to the default rule", () => {
    expect(nextQuestion(questions, new Map())?.key).toBe("q1");
    expect(nextQuestion(questions, new Map([["q1", "yes"]]))?.key).toBe("q2");
    expect(nextQuestion(questions, new Map([["q1", "no"]]))?.key).toBe("q3");
    expect(nextQuestion(questions, new Map([["q1", DONT_KNOW]]))?.key).toBe("q3");
    expect(
      nextQuestion(
        questions,
        new Map([
          ["q1", "yes"],
          ["q2", DONT_KNOW],
        ]),
      ),
    ).toBeNull();
  });

  it("detects a branch cycle instead of looping", () => {
    const cyclic = [
      q("a", [{ whenQuestionKey: "a", equals: null, nextQuestionKey: "b" }]),
      q("b", [{ whenQuestionKey: "b", equals: null, nextQuestionKey: "a" }]),
    ];
    expect(() =>
      nextQuestion(
        cyclic,
        new Map([
          ["a", "x"],
          ["b", "y"],
        ]),
      ),
    ).toThrow(/cycle/);
  });
});

describe("Canonical item rules (AC-M1-04, AC-M1-06, U11)", () => {
  const base = {
    tenantId: "t1",
    disputeId: "d1",
    verificationStatus: "pending" as const,
    version: 1,
    createdAt: NOW,
    provenance: {
      originType: "user_statement" as const,
      sourceRef: { kind: "statement" as const, statementId: "st1" },
      confidence: "unknown" as const,
      recordedBy: "u1",
      recordedAt: NOW,
    },
  };

  it("two different exact dates for one target are both kept and marked conflicting", () => {
    const a: DateAssertion = {
      ...base,
      itemType: "date_assertion",
      id: "da1",
      targetType: "event",
      targetId: "e1",
      value: "2026-07-14",
      precision: "exact",
    };
    const b: DateAssertion = {
      ...base,
      itemType: "date_assertion",
      id: "da2",
      targetType: "event",
      targetId: "e1",
      value: "2026-07-17",
      precision: "approximate",
    };
    const c: DateAssertion = {
      ...base,
      itemType: "date_assertion",
      id: "da3",
      targetType: "event",
      targetId: "e2",
      value: "2026-07-01",
      precision: "exact",
    };
    const out = markConflictingDates([a, b, c]);
    expect(out.filter((x) => x.targetId === "e1").map((x) => x.precision)).toEqual([
      "conflicting",
      "conflicting",
    ]);
    expect(out.find((x) => x.id === "da3")?.precision).toBe("exact");
    expect(out).toHaveLength(3);
  });

  it("a contradiction needs two different items and a neutral description; it has no 'true source' field", () => {
    const refA = { targetType: "event" as const, targetId: "e1" };
    const refB = { targetType: "date_assertion" as const, targetId: "da1" };
    expect(
      validateContradiction(
        {
          itemARef: refA,
          itemBRef: refB,
          description: "The invoice and the chat give different delivery dates.",
        },
        PROHIBITED_TERMS,
      ),
    ).toEqual({ ok: true });
    expect(
      validateContradiction({ itemARef: refA, itemBRef: refA, description: "x" }, PROHIBITED_TERMS),
    ).toEqual({ ok: false, code: "same_item" });
    expect(
      validateContradiction(
        { itemARef: refA, itemBRef: refB, description: "The supplier is lying about the date." },
        PROHIBITED_TERMS,
      ),
    ).toEqual({
      ok: false,
      code: "non_neutral_description",
    });
  });

  it("an evidence relation without a resolvable source is invalid", () => {
    const relation = {
      ...base,
      itemType: "evidence_relation" as const,
      id: "r1",
      evidenceItemId: "ev1",
      targetType: "event" as const,
      targetId: "e1",
      relation: "supports" as const,
    };
    expect(validateEvidenceRelation(relation)).toEqual({ ok: true });
    const broken = {
      ...relation,
      provenance: { ...relation.provenance, originType: "document_extraction" as const },
    };
    expect(validateEvidenceRelation(broken)).toEqual({ ok: false, code: "missing_source" });
  });

  it("provenance completeness pairs origin type with source kind", () => {
    expect(
      isProvenanceComplete({
        ...base.provenance,
        originType: "user_inference",
        sourceRef: { kind: "user_entry", enteredBy: "u1" },
      }),
    ).toBe(true);
    expect(
      isProvenanceComplete({
        ...base.provenance,
        originType: "ai_extraction",
        sourceRef: { kind: "statement", statementId: "s" },
      }),
    ).toBe(false);
  });
});
