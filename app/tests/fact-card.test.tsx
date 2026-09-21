import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FactCard } from "@/components/nyayos/fact-card";
import { SourcePanel, type FactSource } from "@/components/nyayos/source-panel";

const DOC: FactSource = {
  kind: "document-extracted",
  origin: "Invoice AT-4471.pdf",
  locator: "page 2",
  excerpt: "Goods delivered on 14 July 2026.",
  confidence: "high",
  date: { precision: "exact", value: "14 July 2026" },
};

const STATEMENT: FactSource = {
  kind: "user-statement",
  origin: "Your description of what happened",
  confidence: "medium",
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

  it("renders each provenance kind inside the source panel", () => {
    for (const kind of [
      "user-statement",
      "document-extracted",
      "ai-inference",
      "verified-source",
    ] as const) {
      const { unmount } = render(
        <FactCard {...base} status="confirmed" sources={[{ kind, origin: "Origin" }]} />,
      );
      fireEvent.click(screen.getByRole("button", { name: /show sources/i }));
      expect(screen.getByText("Origin")).toBeInTheDocument();
      unmount();
    }
  });

  it("keeps the source panel collapsed until asked, with linked aria state", () => {
    render(<FactCard {...base} status="confirmed" />);
    const toggle = screen.getByRole("button", { name: /show sources/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Invoice AT-4471.pdf")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /hide sources/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByText("Invoice AT-4471.pdf")).toBeInTheDocument();
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
    render(
      <FactCard
        {...base}
        status="confirmed"
        onCorrect={(value) => {
          saved = value;
        }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /correct this/i }));
    fireEvent.change(screen.getByLabelText("Corrected date of delivery"), {
      target: { value: "17 July 2026" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save correction" }));
    expect(saved).toBe("17 July 2026");
  });

  it("keeps the previous value visible after a correction", () => {
    render(
      <FactCard {...base} status="corrected" value="17 July 2026" previousValue="14 July 2026" />,
    );
    expect(screen.getByText("14 July 2026")).toBeInTheDocument();
    expect(screen.getByText(/previously recorded as/i)).toBeInTheDocument();
  });
});
