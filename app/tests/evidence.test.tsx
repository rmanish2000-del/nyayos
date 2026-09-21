import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EvidenceCard, type EvidenceState } from "@/components/nyayos/evidence-card";
import { EvidenceWorkspace } from "@/components/nyayos/evidence-workspace";

const base = {
  id: "evidence",
  filename: "Invoice AT-4471.pdf",
  meta: "PDF · 880 KB",
} as const;

describe("EvidenceCard", () => {
  it("renders every evidence state with visible text and provenance", () => {
    for (const state of [
      "uploading",
      "processing",
      "extracted",
      "error",
      "uncategorized",
    ] as EvidenceState[]) {
      const { unmount } = render(
        <EvidenceCard {...base} state={state} source="ai-extraction" progress={52} />,
      );
      expect(screen.getByText("Invoice AT-4471.pdf")).toBeInTheDocument();
      expect(screen.getByText("Provenance")).toBeInTheDocument();
      expect(screen.getByText(/Read out by AI/)).toBeInTheDocument();
      unmount();
    }
  });

  it("exposes upload completion as a named progressbar", () => {
    render(<EvidenceCard {...base} state="uploading" progress={64} />);
    expect(
      screen.getByRole("progressbar", { name: /upload progress for invoice/i }),
    ).toHaveAttribute("aria-valuenow", "64");
  });

  it("links the error message and offers retry and remove", () => {
    const retry = vi.fn();
    const remove = vi.fn();
    render(
      <EvidenceCard
        {...base}
        state="error"
        message="This file could not be read."
        onRetry={retry}
        onRemove={remove}
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("This file could not be read.");
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));
    expect(retry).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
  });

  it("shows extraction details without predictive language", () => {
    const { container } = render(
      <EvidenceCard
        {...base}
        state="extracted"
        source="ai-extraction"
        locator="page 2"
        confidence="unknown"
        date={{ precision: "exact", value: "14 July 2026" }}
        extractedFacts={3}
      />,
    );
    expect(screen.getByText(/3 extracted facts ready to review/i)).toBeInTheDocument();
    expect(screen.getByText("Confidence unknown")).toBeInTheDocument();
    const text = (container.textContent ?? "").toLowerCase();
    for (const banned of [
      "truth score",
      "success probability",
      "ranked path",
      "legal conclusion",
    ]) {
      expect(text).not.toContain(banned);
    }
  });
});

describe("Evidence screens", () => {
  it("shows S08 upload controls and every required state", () => {
    render(<EvidenceWorkspace />);
    expect(screen.getByRole("heading", { name: "Document upload" })).toBeInTheDocument();
    expect(screen.getByLabelText("Choose evidence files")).toBeInTheDocument();
    for (const text of [
      "Uploading",
      "Processing",
      "Extracted",
      "Needs attention",
      "Uncategorized",
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it("switches to S09 and filters the evidence locker", () => {
    render(<EvidenceWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: "Locker" }));
    expect(screen.getByRole("heading", { name: "Evidence locker" })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Search evidence"), {
      target: { value: "receipt" },
    });
    expect(screen.getByText("Delivery receipt.jpg")).toBeInTheDocument();
    expect(screen.queryByText("Supply agreement.pdf")).not.toBeInTheDocument();
  });

  it("adds a selected file to the upload queue", () => {
    render(<EvidenceWorkspace />);
    const file = new File(["document"], "Notice.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("Choose evidence files"), { target: { files: [file] } });
    expect(screen.getByText("Notice.pdf")).toBeInTheDocument();
  });
});
