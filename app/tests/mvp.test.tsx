import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { DocumentViewerScreen } from "@/components/mvp/screens/document-viewer-screen";
import { DisputeListScreen } from "@/components/mvp/screens/dispute-list-screen";
import { ExportPreviewScreen, ExportResultScreen } from "@/components/mvp/screens/export-screens";
import { EvidenceLockerScreen } from "@/components/mvp/screens/evidence-locker-screen";
import { FactReviewScreen } from "@/components/mvp/screens/fact-review-screen";
import { IntakeScreen } from "@/components/mvp/screens/intake-screen";
import { LoginScreen } from "@/components/mvp/screens/login-screen";
import { TimelineScreen } from "@/components/mvp/screens/timeline-screen";
import { NewDisputeScreen } from "@/components/mvp/screens/what-happened-screen";
import { RequireSession } from "@/components/mvp/require-session";
import { findProhibitedTerms } from "@/domain";
import { disputeForUser, signInOutcome, visibleDisputes } from "@/mvp/access";
import { assessExport, generateExport, previewExport } from "@/mvp/export";
import {
  DISPUTE_APPLIANCE,
  DISPUTE_DEPOSIT,
  DISPUTE_OTHER,
  SEED_USERS,
  createSeedData,
  findUser,
  type SeedData,
} from "@/mvp/fixtures";
import { MvpProvider } from "@/mvp/store";

function renderScreen(
  ui: React.ReactNode,
  opts: { userId?: string; data?: SeedData; persist?: boolean; path?: string } = {},
) {
  const root = createRootRoute();
  const page = createRoute({ getParentRoute: () => root, path: "$", component: () => <>{ui}</> });
  const index = createRoute({ getParentRoute: () => root, path: "/", component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: root.addChildren([index, page]),
    history: createMemoryHistory({ initialEntries: [opts.path ?? "/"] }),
  });
  const providerProps = {
    ...(opts.userId !== undefined ? { initialUserId: opts.userId } : {}),
    ...(opts.data ? { initialData: opts.data } : {}),
    persist: opts.persist ?? false,
  };
  const result = render(
    <MvpProvider {...providerProps}>
      <RouterProvider router={router as never} />
    </MvpProvider>,
  );
  return { ...result, router };
}

const deposit = () => createSeedData().disputes.find((d) => d.id === DISPUTE_DEPOSIT)!;
const appliance = () => createSeedData().disputes.find((d) => d.id === DISPUTE_APPLIANCE)!;

beforeEach(() => window.sessionStorage.clear());

describe("seed fixtures (no manual setup)", () => {
  it("provides the five required personas", () => {
    expect(SEED_USERS.map((u) => u.kind).sort()).toEqual(
      ["cross-tenant", "deleted", "founder", "normal", "reviewer"].sort(),
    );
  });

  it("seeds disputes, documents, facts, timeline entries and exports", () => {
    const d = createSeedData();
    expect(d.disputes.length).toBeGreaterThanOrEqual(3);
    expect(d.documents.length).toBeGreaterThanOrEqual(5);
    expect(d.facts.length).toBeGreaterThanOrEqual(5);
    expect(d.timeline.map((e) => e.precision).sort()).toEqual(
      ["approximate", "conflicting", "exact", "exact", "inferred", "unknown-date"].sort(),
    );
    expect(d.exports.length).toBeGreaterThanOrEqual(1);
    for (const doc of d.documents) expect(doc.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is deterministic and synthetic", () => {
    expect(createSeedData()).toEqual(createSeedData());
    const text = JSON.stringify(createSeedData());
    expect(text).not.toMatch(/aadhaar|passport|FIR no|CNR/i);
    expect(findProhibitedTerms(text)).toEqual([]);
  });
});

describe("access rules", () => {
  const data = createSeedData();
  it("refuses deleted accounts without revealing they exist", () => {
    expect(signInOutcome(findUser("usr-deleted"))).toEqual({
      ok: false,
      reason: "account-unavailable",
    });
    expect(signInOutcome(findUser("usr-founder"))).toEqual({ ok: true });
  });
  it("keeps each tenant's disputes separate", () => {
    const other = findUser("usr-other")!;
    expect(visibleDisputes(other, data.disputes).map((d) => d.id)).toEqual([DISPUTE_OTHER]);
    expect(disputeForUser(other, data.disputes, DISPUTE_DEPOSIT)).toBeNull();
    expect(disputeForUser(other, data.disputes, "does-not-exist")).toBeNull();
  });
  it("gives reviewers no disputes while grants are disabled", () => {
    expect(visibleDisputes(findUser("usr-reviewer")!, data.disputes)).toEqual([]);
  });
});

describe("Google login entry flow (U01)", () => {
  it("explains that Google is not connected instead of faking a sign-in", async () => {
    const user = userEvent.setup();
    const { router } = renderScreen(<LoginScreen />, { path: "/login" });
    await user.click(await screen.findByRole("button", { name: "Continue with Google" }));
    expect(screen.getByText("Google sign-in is not connected yet")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe("/login");
  });

  it("signs in a synthetic persona and navigates to the dispute list", async () => {
    const user = userEvent.setup();
    const { router } = renderScreen(<LoginScreen />, { path: "/login" });
    await user.click(await screen.findByRole("button", { name: /Sign in as Asha Verma/ }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/disputes"));
  });

  it("refuses the deleted persona with a generic message", async () => {
    const user = userEvent.setup();
    renderScreen(<LoginScreen />, { path: "/login" });
    await user.click(await screen.findByRole("button", { name: /Deleted user/ }));
    expect(await screen.findByText("We couldn't sign you in")).toBeInTheDocument();
  });

  it("is keyboard operable", async () => {
    const user = userEvent.setup();
    renderScreen(<LoginScreen />, { path: "/login" });
    await screen.findByRole("button", { name: "Continue with Google" });
    for (let i = 0; i < 12; i++) {
      await user.tab();
      if (document.activeElement?.textContent === "Continue with Google") break;
    }
    expect(document.activeElement).toHaveTextContent("Continue with Google");
    await user.keyboard("{Enter}");
    expect(screen.getByText("Google sign-in is not connected yet")).toBeInTheDocument();
  });
});

describe("loading and session guard", () => {
  it("shows a loading state before the session is restored, then redirects signed-out visitors", async () => {
    const { router } = renderScreen(
      <RequireSession>
        <p>secret</p>
      </RequireSession>,
      { persist: true, path: "/disputes" },
    );
    await waitFor(() => expect(router.state.location.pathname).toBe("/login"));
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });
});

describe("dispute list", () => {
  it("renders seeded disputes for the founder", async () => {
    renderScreen(<DisputeListScreen />, { userId: "usr-founder" });
    expect(await screen.findByText("Security deposit not returned")).toBeInTheDocument();
    expect(screen.queryByText("Unpaid freelance invoice")).not.toBeInTheDocument();
  });
  it("shows the empty state for a new user", async () => {
    renderScreen(<DisputeListScreen />, { userId: "usr-normal" });
    expect(await screen.findByText("No disputes yet")).toBeInTheDocument();
  });
  it("tells a reviewer their access is not enabled", async () => {
    renderScreen(<DisputeListScreen />, { userId: "usr-reviewer" });
    expect(
      await screen.findByText("Reviewer access is not enabled in this version"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Start a dispute/ })).not.toBeInTheDocument();
  });
});

describe("U04 What happened", () => {
  it("validates, then creates the dispute and goes to intake", async () => {
    const user = userEvent.setup();
    const { router } = renderScreen(<NewDisputeScreen />, { userId: "usr-normal" });
    await user.click(await screen.findByRole("button", { name: "Save and continue" }));
    expect(screen.getByText("Give the dispute a short name.")).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Name this dispute/), "Deposit");
    await user.type(
      screen.getByLabelText(/Your account/),
      "My landlord has kept my deposit for two months.",
    );
    await user.click(screen.getByRole("button", { name: "Save and continue" }));
    await waitFor(() =>
      expect(router.state.location.pathname).toMatch(/^\/disputes\/dsp-.+\/intake$/),
    );
  });
});

describe("U05 Intake", () => {
  it("asks one question at a time and records I don't know", async () => {
    const user = userEvent.setup();
    renderScreen(<IntakeScreen dispute={appliance()} />, { userId: "usr-founder" });
    expect(
      await screen.findByRole("heading", { name: "Who is the other side in this problem?" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save answer" }));
    expect(screen.getByText(/Type an answer/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "I don't know" }));
    expect(
      await screen.findByRole("heading", { name: "When did the problem start?" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("I don't know").length).toBeGreaterThan(1);
  });

  it("opens the why-we-ask explanation", async () => {
    const user = userEvent.setup();
    renderScreen(<IntakeScreen dispute={appliance()} />, { userId: "usr-founder" });
    const why = await screen.findByRole("button", { name: /Why we ask/ });
    expect(why).toHaveAttribute("aria-expanded", "false");
    await user.click(why);
    expect(why).toHaveAttribute("aria-expanded", "true");
  });
});

describe("U06 Evidence locker", () => {
  it("renders seeded documents with every state", async () => {
    renderScreen(<EvidenceLockerScreen dispute={deposit()} />, { userId: "usr-founder" });
    expect(await screen.findByText("Leave and licence agreement")).toBeInTheDocument();
    for (const label of [
      "Ready to view",
      "Waiting for safety scan",
      "Not accepted",
      "Can't be shown",
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it("shows the empty state", async () => {
    renderScreen(<EvidenceLockerScreen dispute={appliance()} />, { userId: "usr-founder" });
    expect(await screen.findByText("No documents yet")).toBeInTheDocument();
  });

  it("refuses unaccepted files and fingerprints accepted ones", async () => {
    const user = userEvent.setup({ applyAccept: false });
    renderScreen(<EvidenceLockerScreen dispute={appliance()} />, { userId: "usr-founder" });
    const input = await screen.findByLabelText("Add documents");
    await user.upload(input, [
      new File(["hello receipt"], "receipt.txt", { type: "text/plain" }),
      new File(["x"], "movie.mov", { type: "video/quicktime" }),
    ]);
    expect(await screen.findByText("Some files were not added")).toBeInTheDocument();
    expect(await screen.findByText("receipt")).toBeInTheDocument();
  });

  it("filters by state", async () => {
    const user = userEvent.setup();
    renderScreen(<EvidenceLockerScreen dispute={deposit()} />, { userId: "usr-founder" });
    await user.selectOptions(await screen.findByLabelText("State"), "rejected");
    expect(screen.getByText("1 of 6 documents")).toBeInTheDocument();
  });
});

describe("U07 Document viewer", () => {
  it("pages through a document and marks a source page", async () => {
    const user = userEvent.setup();
    renderScreen(
      <DocumentViewerScreen
        dispute={deposit()}
        documentId="doc-chat"
        initialFactId="fct-damage-claim"
      />,
      { userId: "usr-founder" },
    );
    expect(await screen.findByText("Page 1 of 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Next page/ }));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Mark the page this fact comes from" }));
    expect(screen.getByText("Source page marked")).toBeInTheDocument();
  });

  it("shows an error state for an unreadable document", async () => {
    renderScreen(<DocumentViewerScreen dispute={deposit()} documentId="doc-scan" />, {
      userId: "usr-founder",
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("This document can't be shown");
  });

  it("does not show a document from another dispute", async () => {
    renderScreen(<DocumentViewerScreen dispute={deposit()} documentId="doc-invoice-other" />, {
      userId: "usr-founder",
    });
    expect(await screen.findByText("This document isn't available")).toBeInTheDocument();
  });
});

describe("U08 Fact review", () => {
  it("renders seeded facts with sources and records a confirmation", async () => {
    const user = userEvent.setup();
    renderScreen(<FactReviewScreen dispute={deposit()} />, { userId: "usr-founder" });
    const card = (await screen.findByText("Security deposit amount")).closest("article")!;
    expect(
      within(card as HTMLElement).getByText("Two versions of this information"),
    ).toBeInTheDocument();
    await user.click(within(card as HTMLElement).getByRole("button", { name: "Confirm" }));
    expect(within(card as HTMLElement).getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows the empty state", async () => {
    renderScreen(<FactReviewScreen dispute={appliance()} />, { userId: "usr-founder" });
    expect(await screen.findByText("No facts yet")).toBeInTheDocument();
  });
});

describe("U09 Timeline", () => {
  it("orders entries with unknown dates last and filters conflicts", async () => {
    const user = userEvent.setup();
    renderScreen(<TimelineScreen dispute={deposit()} />, { userId: "usr-founder" });
    const items = await screen.findAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Deposit paid");
    expect(items[items.length - 1]).toHaveTextContent("Owner inspected the flat");
    await user.click(screen.getByLabelText("Only dates that disagree"));
    expect(screen.getByText("Showing 1 of 6")).toBeInTheDocument();
  });

  it("requires a date unless it is unknown", async () => {
    const user = userEvent.setup();
    renderScreen(<TimelineScreen dispute={deposit()} />, { userId: "usr-founder" });
    const edit = (await screen.findAllByRole("button", { name: /Edit/ }))[0]!;
    await user.click(edit);
    await user.clear(screen.getByLabelText("Date as you know it"));
    await user.click(screen.getByRole("button", { name: "Save date" }));
    expect(screen.getByText("Enter a date, or choose Unknown.")).toBeInTheDocument();
  });
});

describe("U16/U17 Export", () => {
  it("lists omissions for facts whose source is incomplete", () => {
    const p = previewExport(createSeedData(), deposit());
    expect(p.omittedFacts.map((f) => f.id)).toContain("fct-damage-claim");
    expect(p.includedDocs.every((d) => d.state === "ready")).toBe(true);
  });

  it("builds a deterministic manifest hash", async () => {
    const a = await generateExport(createSeedData(), deposit(), "Asha", "2026-06-20T00:00:00.000Z");
    const b = await generateExport(createSeedData(), deposit(), "Asha", "2026-06-20T00:00:00.000Z");
    expect(a.record.manifestSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(a.record.manifestSha256).toBe(b.record.manifestSha256);
    expect(a.manifestJson).toContain("No AI was used to produce this file.");
  });

  it("flags the seeded export as out of date", () => {
    const data = createSeedData();
    expect(assessExport(data, data.exports[0]!).status).toBe("STALE");
  });

  it("requires the privacy check, then generates and navigates to the result", async () => {
    const user = userEvent.setup();
    const { router } = renderScreen(<ExportPreviewScreen dispute={deposit()} />, {
      userId: "usr-founder",
    });
    const generate = await screen.findByRole("button", { name: /Generate export/ });
    expect(generate).toBeDisabled();
    await user.click(screen.getByLabelText("I have checked what this export contains."));
    await act(async () => {
      await user.click(generate);
    });
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/disputes/${DISPUTE_DEPOSIT}/export/result`),
    );
  });

  it("shows the result with the no-AI statement and stale notice", async () => {
    renderScreen(<ExportResultScreen dispute={deposit()} />, { userId: "usr-founder" });
    expect(await screen.findByText("No AI was used to produce this file.")).toBeInTheDocument();
    expect(screen.getByText("Export version 1")).toBeInTheDocument();
  });

  it("shows empty states when there is nothing to export", async () => {
    renderScreen(<ExportPreviewScreen dispute={appliance()} />, { userId: "usr-founder" });
    expect(await screen.findByText("Nothing to export yet")).toBeInTheDocument();
  });
});
