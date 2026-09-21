import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FactCard, type FactAction } from "@/components/nyayos/fact-card";
import { SourcePanel, type FactSource } from "@/components/nyayos/source-panel";

const DOC: FactSource = {
  kind: "document-fact",
  origin: "Invoice AT-4471.pdf",
  locator: "page 2",
  excerpt: "Goods delivered on 14 July 2026.",
  confidence: "high",
  date: { precision: "exact", value: "14 July 2026" },
};

const STATEMENT: FactSource = {
  kind: "unverified-claim",
  origin: "Your description of what happened",
  confidence: "unknown",
};

describe("SourcePanel", () => {
  it("shows origin, locator and verbatim excerpt for every source", () => {
    render(<SourcePanel sources={[DOC, STATEMENT]} />);
    expect(screen.getByText("Invoice AT-4471.pdf")).toBeInTheDocument();
    expect(screen.getByText(/page 2/)).toBeInTheDocument();
    expect(screen.getByText(/Goods delivered on 14 July 2026/)).toBeInTheDocument();
    expect(screen.getByText("Your description of what happened")).toBeInTheDocument();
  });

  it("uses no scoring, ranking or outcome language", () => {
    const { container } = render(<SourcePanel sources={[DOC, STATEMENT]} />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const banned of ["score", "rank", "strength", "likelihood", "probability", "truth"]) {
      expect(text).not.toContain(banned);
    }
  });
});

describe("FactCard", () => {
  const base = {
    id: "fact",
    label: "Date of delivery",
    value: "14 July 2026",
    sources: [DOC],
  } as const;

  it("renders every canonical state with visible status text", () => {
    for (const status of [
      "confirmed",
      "uncertain",
      "corrected",
      "not-relevant",
      "contradiction",
    ] as const) {
      const { container, unmount } = render(<FactCard {...base} status={status} />);
      expect(container.textContent).toContain("Date of delivery");
      expect((container.textContent ?? "").trim().length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("renders each provenance kind in the always-visible provenance strip", () => {
    for (const kind of [
      "document-fact",
      "ai-extraction",
      "unverified-claim",
      "user-statement",
      "document-extracted",
      "ai-inference",
      "verified-source",
    ] as const) {
      const { unmount } = render(
        <FactCard {...base} status="confirmed" sources={[{ kind, origin: "Origin" }]} />,
      );
      expect(screen.getByText("Where this came from")).toBeInTheDocument();
      expect(screen.getAllByText(/Origin/).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("does not hide provenance behind a disclosure", () => {
    render(<FactCard {...base} status="confirmed" />);
    expect(screen.getAllByText(/Invoice AT-4471\.pdf/).length).toBeGreaterThan(0);
  });

  it("keeps the source detail panel in the DOM so aria-controls always resolves", () => {
    render(<FactCard {...base} status="confirmed" />);
    const toggle = screen.getByRole("button", { name: /show source detail/i });
    const panelId = toggle.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const panel = document.getElementById(panelId as string);
    expect(panel).not.toBeNull();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("hidden");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /hide source detail/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(document.getElementById(panelId as string)).not.toHaveAttribute("hidden");
  });

  it("offers confirm, uncertain, not relevant and correct actions", () => {
    const recorded: FactAction[] = [];
    render(
      <FactCard
        {...base}
        status="to-review"
        onAction={(action) => recorded.push(action)}
        onCorrect={() => {}}
      />,
    );
    for (const name of [/^confirm$/i, /^uncertain$/i, /^not relevant$/i]) {
      fireEvent.click(screen.getByRole("button", { name }));
    }
    expect(recorded).toEqual(["confirmed", "uncertain", "not-relevant"]);
    expect(screen.getByRole("button", { name: /^correct$/i })).toBeInTheDocument();
  });

  it("marks the action matching the current state as pressed", () => {
    render(<FactCard {...base} status="uncertain" onAction={() => {}} />);
    expect(screen.getByRole("button", { name: /^uncertain$/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: /^confirm$/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows both versions of a contradiction without resolving it", () => {
    render(
      <FactCard
        {...base}
        status="contradiction"
        value="Two different dates are recorded"
        contradiction={{
          note: "The invoice and your description give different dates.",
          versions: [
            { value: "14 July 2026", source: DOC },
            { value: "17 July 2026", source: STATEMENT },
          ],
        }}
      />,
    );
    expect(screen.getAllByText("14 July 2026").length).toBeGreaterThan(0);
    expect(screen.getAllByText("17 July 2026").length).toBeGreaterThan(0);
  });

  it("records an inline correction and preserves the original value", () => {
    let saved = "";
    let savedReason = "";
    render(
      <FactCard
        {...base}
        status="confirmed"
        onCorrect={(value, reason) => {
          saved = value;
          savedReason = reason;
        }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /^correct$/i }));
    fireEvent.change(screen.getByLabelText("Corrected date of delivery"), {
      target: { value: "17 July 2026" },
    });
    fireEvent.change(screen.getByLabelText(/reason/i), {
      target: { value: "The invoice was misread." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save correction" }));
    expect(saved).toBe("17 July 2026");
    expect(savedReason).toBe("The invoice was misread.");
  });

  it("keeps the previous value and the correction reason visible after a correction", () => {
    render(
      <FactCard
        {...base}
        status="corrected"
        value="17 July 2026"
        previousValue="14 July 2026"
        correctionReason="The invoice was misread."
      />,
    );
    expect(screen.getAllByText("14 July 2026").length).toBeGreaterThan(0);
    expect(screen.getByText(/previously recorded as/i)).toBeInTheDocument();
    expect(screen.getByText(/reason given for the correction/i)).toBeInTheDocument();
    expect(screen.getByText(/the invoice was misread/i)).toBeInTheDocument();
  });

  it("shows an unknown extraction confidence explicitly", () => {
    render(<FactCard {...base} status="uncertain" confidence="unknown" />);
    expect(screen.getByText("Confidence unknown")).toBeInTheDocument();
  });
});
