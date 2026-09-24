import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StaleOutputNotice } from "@/components/nyayos/stale-output-notice";
import { type StalenessAssessment } from "@/domain";

const current: StalenessAssessment = {
  status: "CURRENT",
  findings: [],
  counts: { current: 3, stale: 0, unknown: 0 },
  reviewCount: 0,
  manifestIssue: null,
};

const stale: StalenessAssessment = {
  status: "STALE",
  findings: [],
  counts: { current: 1, stale: 2, unknown: 1 },
  reviewCount: 3,
  manifestIssue: null,
};

describe("StaleOutputNotice (A-037)", () => {
  it("renders nothing for a current export", () => {
    const { container } = render(<StaleOutputNotice assessment={current} reviewHref="/review" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows an informational warning with counts and a route to review, and no regenerate control", () => {
    render(<StaleOutputNotice assessment={stale} reviewHref="/disputes/d1/exports/x1/review" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/newer version: 2/)).toBeInTheDocument();
    expect(screen.getByText(/could not confirm as current: 1/)).toBeInTheDocument();
    expect(screen.getByText(/has not been changed or replaced/)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /Review these items \(3\)/ });
    expect(link).toHaveAttribute("href", "/disputes/d1/exports/x1/review");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/regenerat|refresh|evidence (has )?changed/i);
  });

  it("explains an unreadable export without inventing a count", () => {
    render(
      <StaleOutputNotice
        assessment={{
          ...current,
          status: "UNKNOWN",
          counts: { current: 0, stale: 0, unknown: 0 },
          manifestIssue: "malformed_manifest",
        }}
        reviewHref="/review"
      />,
    );
    expect(screen.getByText(/could not read this export's list of contents/)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders in Hindi", () => {
    render(<StaleOutputNotice assessment={stale} reviewHref="/review" language="hi" />);
    expect(screen.getByText(/यह निर्यात पुराना हो सकता है/)).toBeInTheDocument();
  });
});
