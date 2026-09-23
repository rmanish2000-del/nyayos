// @vitest-environment node
import { describe, expect, it } from "vitest";

import * as proposalModule from "@/domain/proposal";
import {
  type UserCorrection,
  buildVersionChain,
  decideProposal,
  ownerChange,
  proposeChange,
  reconcileHistory,
  userContext,
} from "@/domain";

const NOW = "2026-09-23T10:00:00.000Z";
const owner = userContext(
  {
    userId: "u1",
    sessionId: "s1",
    tenantId: "t1",
    tenantRole: "tenant_owner",
    disputeMemberships: [{ disputeId: "d1", role: "dispute_owner" }],
  },
  { now: NOW },
);

const base = { tenantId: "t1", disputeId: "d1", targetType: "event" as const, originRef: "u1" };

describe("Single-writer proposal pipeline (S3, AC-M1-02, AC-M1-03)", () => {
  it("owner change produces a proposal, an acceptance and a correction with previous/new values", () => {
    const result = ownerChange(owner, {
      ...base,
      id: "p1",
      targetId: "e1",
      proposedValue: { text: "Goods delivered on 14 July 2026" },
      origin: "user",
      correctionId: "c1",
      current: { targetId: "e1", version: 1, value: { text: "Goods delivered in July" } },
    });
    expect(result.ok).toBe(true);
    if (!result.ok || !("correction" in result)) throw new Error("expected decide result");
    expect(result.proposal.status).toBe("accepted");
    expect(result.correction).toMatchObject({
      previousValue: { text: "Goods delivered in July" },
      newValue: { text: "Goods delivered on 14 July 2026" },
      resultingVersion: 2,
      originProposalId: "p1",
      userId: "u1",
    });
    expect(result.next).toEqual({
      targetId: "e1",
      version: 2,
      value: { text: "Goods delivered on 14 July 2026" },
    });
    expect(result.audit).toEqual(["proposal.created", "proposal.accepted", "correction.created"]);
  });

  it("creating a new item yields version 1 with previousValue null", () => {
    const proposed = proposeChange(owner, {
      ...base,
      id: "p2",
      targetId: null,
      proposedValue: { text: "x" },
      origin: "user",
    });
    if (!proposed.ok) throw new Error(proposed.code);
    const decided = decideProposal(owner, proposed.proposal, "accept", {
      current: null,
      correctionId: "c2",
      newItemId: "e2",
    });
    if (!decided.ok) throw new Error(decided.code);
    expect(decided.correction).toMatchObject({
      targetId: "e2",
      previousValue: null,
      resultingVersion: 1,
    });
  });

  it("rejection is recorded, not discarded; no correction is produced", () => {
    const proposed = proposeChange(owner, {
      ...base,
      id: "p3",
      targetId: "e1",
      proposedValue: { text: "y" },
      origin: "user",
    });
    if (!proposed.ok) throw new Error(proposed.code);
    const decided = decideProposal(owner, proposed.proposal, "reject", {
      current: { targetId: "e1", version: 1, value: {} },
      correctionId: "c3",
      reason: "typo",
    });
    if (!decided.ok) throw new Error(decided.code);
    expect(decided.proposal.status).toBe("rejected");
    expect(decided.proposal.reason).toBe("typo");
    expect(decided.correction).toBeNull();
    expect(decided.audit).toEqual(["proposal.rejected"]);
  });

  it("a decided proposal cannot be decided again", () => {
    const proposed = proposeChange(owner, {
      ...base,
      id: "p4",
      targetId: "e1",
      proposedValue: {},
      origin: "user",
    });
    if (!proposed.ok) throw new Error(proposed.code);
    const once = decideProposal(owner, proposed.proposal, "accept", {
      current: { targetId: "e1", version: 1, value: {} },
      correctionId: "c4",
    });
    if (!once.ok) throw new Error(once.code);
    expect(
      decideProposal(owner, once.proposal, "accept", { current: null, correctionId: "c5" }),
    ).toEqual({ ok: false, code: "already_decided" });
  });

  it("ai and reviewer origins are inert in FM-A (S11, CR-6)", () => {
    for (const origin of ["ai", "reviewer"] as const) {
      expect(
        proposeChange(owner, { ...base, id: "p5", targetId: "e1", proposedValue: {}, origin }),
      ).toEqual({ ok: false, code: "origin_not_enabled_in_fma" });
    }
  });

  it("refuses identity and server-controlled fields in the payload (A-033 M-4)", () => {
    for (const key of [
      "created_by",
      "uploader_id",
      "tenant_id",
      "dispute_id",
      "id",
      "version",
      "recordedBy",
    ]) {
      expect(
        proposeChange(owner, {
          ...base,
          id: "p7",
          targetId: null,
          proposedValue: { text: "x", [key]: "spoof" },
          origin: "user",
        }),
      ).toEqual({ ok: false, code: "server_controlled_field" });
    }
  });

  it("refuses an ai_extraction origin type in FM-A (A-033 M-4, S11)", () => {
    expect(
      proposeChange(owner, {
        ...base,
        id: "p8",
        targetId: null,
        proposedValue: { text: "x", origin_type: "ai_extraction" },
        origin: "user",
      }),
    ).toEqual({ ok: false, code: "origin_type_not_enabled_in_fma" });
    expect(
      proposeChange(owner, {
        ...base,
        id: "p9",
        targetId: null,
        proposedValue: { text: "x", provenance: { originType: "ai_extraction" } },
        origin: "user",
      }),
    ).toEqual({ ok: false, code: "origin_type_not_enabled_in_fma" });
  });

  it("refuses cross-tenant proposals", () => {
    const stranger = userContext(
      { userId: "u2", sessionId: "s2", tenantId: "t2", tenantRole: "tenant_owner" },
      { now: NOW },
    );
    expect(
      proposeChange(stranger, {
        ...base,
        id: "p6",
        targetId: "e1",
        proposedValue: {},
        origin: "user",
      }),
    ).toEqual({ ok: false, code: "cross_tenant" });
  });

  it("exposes no direct update function", () => {
    const names = Object.keys(proposalModule);
    expect(names.some((n) => /^(update|patch|overwrite|set)[A-Z]/.test(n))).toBe(false);
  });
});

describe("Version chain reconstruction (Deck G2) and history reconciliation (SEC-MUT-03)", () => {
  const corrections: UserCorrection[] = [1, 2, 3].map((v) => ({
    id: `c${v}`,
    tenantId: "t1",
    disputeId: "d1",
    targetType: "event",
    targetId: "e1",
    previousValue: v === 1 ? null : { v: v - 1 },
    newValue: { v },
    reason: null,
    userId: "u1",
    originProposalId: `p${v}`,
    resultingVersion: v,
    timestamp: NOW,
  }));

  it("rebuilds an unbroken chain from corrections", () => {
    const chain = buildVersionChain(corrections, { targetType: "event", targetId: "e1" });
    expect(chain.map((x) => x.version)).toEqual([1, 2, 3]);
    expect(chain[0]!.previousVersionCorrectionId).toBeNull();
    expect(chain[2]!.previousVersionCorrectionId).toBe("c2");
  });

  it("detects a gap in the chain", () => {
    expect(() =>
      buildVersionChain(
        corrections.filter((c) => c.resultingVersion !== 2),
        { targetType: "event", targetId: "e1" },
      ),
    ).toThrow(/gap/);
  });

  it("every canonical version is explained by exactly one correction", () => {
    expect(
      reconcileHistory([{ targetId: "e1", version: 3, value: {} }], corrections, "event"),
    ).toEqual({ ok: true });
    expect(
      reconcileHistory([{ targetId: "e1", version: 4, value: {} }], corrections, "event"),
    ).toEqual({ ok: false, unexplained: [{ targetId: "e1", version: 4 }] });
  });
});
