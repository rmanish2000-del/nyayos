import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EvidenceCard, type EvidenceLifecycle } from "@/components/nyayos/evidence-card";
import { EvidenceWorkspace } from "@/components/nyayos/evidence-workspace";

const base = {
  id: "evidence",
  filename: "Invoice AT-4471.pdf",
  meta: "PDF · 880 KB",
  category: "invoice",
  provenance: {
    uploadedBy: "Manish Patel",
    uploadDate: "21 September 2026",
    hash: "sha256:b70e…1d05",
  },
} as const;

describe("EvidenceCard", () => {
  it("shows an informational duplicate chip when an identical file is already stored (A-036)", () => {
    const { rerender } = render(<EvidenceCard {...base} lifecycle="extracted" />);
    expect(screen.queryByText(/Duplicate of/)).not.toBeInTheDocument();
    rerender(
      <EvidenceCard {...base} lifecycle="extracted" duplicateOf="Invoice AT-4471 (first copy)" />,
    );
    expect(screen.getByText(/Duplicate of Invoice AT-4471 \(first copy\)/)).toBeInTheDocument();
    // informational only: no merge/reject control appears
    expect(screen.queryByRole("button", { name: /merge|reject/i })).not.toBeInTheDocument();
  });

  it("renders every lifecycle state with document provenance", () => {
    for (const lifecycle of [
      "queued",
      "scanning",
      "processing",
      "extracted",
      "rejected",
      "error",
    ] as EvidenceLifecycle[]) {
      const { unmount } = render(<EvidenceCard {...base} lifecycle={lifecycle} progress={52} />);
      expect(screen.getByText("Invoice AT-4471.pdf")).toBeInTheDocument();
      expect(screen.getByText("Document provenance")).toBeInTheDocument();
      expect(screen.getByText("Manish Patel")).toBeInTheDocument();
      expect(screen.getByText("21 September 2026")).toBeInTheDocument();
      expect(screen.getByText("sha256:b70e…1d05")).toBeInTheDocument();
      unmount();
    }
  });

  it("keeps lifecycle and category separate", () => {
    render(<EvidenceCard {...base} lifecycle="processing" category="contract" categoryConfirmed />);
    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByText("Contract")).toBeInTheDocument();
    expect(screen.getByText("· confirmed")).toBeInTheDocument();
  });

  it("exposes transfer completion as a named progressbar", () => {
    render(<EvidenceCard {...base} lifecycle="scanning" progress={64} />);
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
        lifecycle="error"
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

  it("offers the full action set without predictive language", () => {
    const handlers = {
      onView: vi.fn(),
      onRename: vi.fn(),
      onConfirmType: vi.fn(),
      onCorrectType: vi.fn(),
      onRemove: vi.fn(),
    };
    const { container } = render(
      <EvidenceCard
        {...base}
        lifecycle="extracted"
        extraction={{
          summary: "Delivery date was read from page 2.",
          source: "ai-extraction",
          locator: "page 2",
          confidence: "unknown",
          date: { precision: "exact", value: "14 July 2026" },
          factCount: 3,
        }}
        {...handlers}
      />,
    );
    for (const name of [/^view$/i, /rename/i, /confirm type/i, /correct type/i, /remove/i]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
    expect(screen.getByText("Extraction summary")).toBeInTheDocument();
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
  it("shows S08 upload controls with a single top-level heading", () => {
    render(<EvidenceWorkspace />);
    expect(screen.getByRole("heading", { level: 2, name: "Document upload" })).toBeInTheDocument();
    expect(screen.queryAllByRole("heading", { level: 1 })).toHaveLength(0);
    expect(screen.getByLabelText("Choose evidence files")).toHaveAttribute(
      "accept",
      ".pdf,.png,.jpg,.jpeg,.txt",
    );
    for (const text of ["Queued", "Scanning", "Processing", "Extracted", "Rejected"]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
  });

  it("refuses files by type and size without storing them", () => {
    render(<EvidenceWorkspace />);
    const big = new File(["x"], "Huge.pdf", { type: "application/pdf" });
    Object.defineProperty(big, "size", { value: 20 * 1024 * 1024 });
    const wrongType = new File(["x"], "Bundle.zip", { type: "application/zip" });
    fireEvent.change(screen.getByLabelText("Choose evidence files"), {
      target: { files: [big, wrongType] },
    });
    expect(screen.getByText("Some files were refused")).toBeInTheDocument();
    expect(screen.getByText(/Huge.pdf — larger than 10 MB/)).toBeInTheDocument();
    expect(screen.getByText(/Bundle.zip — file type not accepted/)).toBeInTheDocument();
  });

  it("accepts pasted text and validates short input", () => {
    render(<EvidenceWorkspace />);
    fireEvent.change(screen.getByLabelText("Pasted text"), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: "Add pasted text" }));
    expect(screen.getByText(/at least 10 characters/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Pasted text"), {
      target: { value: "Courier confirmed the delivery on 14 July." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add pasted text" }));
    expect(screen.getByText(/Pasted text \(Courier confirmed the/)).toBeInTheDocument();
  });

  it("cancels an upload without creating an error state", () => {
    render(<EvidenceWorkspace />);
    const before = screen.queryAllByText("Needs attention").length;
    fireEvent.click(screen.getAllByRole("button", { name: /cancel/i })[0]!);
    expect(screen.queryByText("Supply agreement.pdf")).not.toBeInTheDocument();
    expect(screen.queryAllByText("Needs attention")).toHaveLength(before);
  });

  it("renames a document and corrects its category", () => {
    render(<EvidenceWorkspace />);
    fireEvent.click(screen.getAllByRole("button", { name: /rename/i })[0]!);
    fireEvent.change(screen.getByLabelText("New name for Supply agreement.pdf"), {
      target: { value: "Master supply agreement.pdf" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save name" }));
    expect(screen.getByText("Master supply agreement.pdf")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /correct type/i })[0]!);
    fireEvent.change(screen.getByLabelText("Category for Master supply agreement.pdf"), {
      target: { value: "receipt" },
    });
    expect(screen.getAllByText("Receipt").length).toBeGreaterThan(0);
  });

  it("shows drag-over feedback on the drop target", () => {
    render(<EvidenceWorkspace />);
    const target = screen.getByText("Drop documents here").parentElement!.parentElement!;
    fireEvent.dragOver(target);
    expect(screen.getByText("Release to add these documents")).toBeInTheDocument();
    fireEvent.dragLeave(target);
    expect(screen.getByText("Drop documents here")).toBeInTheDocument();
  });

  it("switches to S09 and filters by search, lifecycle and category", () => {
    render(<EvidenceWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: "Locker" }));
    expect(screen.getByRole("heading", { name: "Evidence locker" })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Search evidence"), {
      target: { value: "receipt" },
    });
    expect(screen.getByText("Delivery receipt.jpg")).toBeInTheDocument();
    expect(screen.queryByText("Supply agreement.pdf")).not.toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search evidence"), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Filter by lifecycle"), {
      target: { value: "rejected" },
    });
    expect(screen.getByText("Case bundle.zip")).toBeInTheDocument();
    expect(screen.queryByText("Delivery receipt.jpg")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Filter by lifecycle"), { target: { value: "all" } });
    fireEvent.change(screen.getByLabelText("Filter by category"), {
      target: { value: "contract" },
    });
    expect(screen.getByText("Supply agreement.pdf")).toBeInTheDocument();
    expect(screen.queryByText("Case bundle.zip")).not.toBeInTheDocument();
  });

  it("adds a selected file to the upload queue as uncategorized and queued", () => {
    render(<EvidenceWorkspace />);
    const file = new File(["document"], "Notice.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("Choose evidence files"), { target: { files: [file] } });
    expect(screen.getByText("Notice.pdf")).toBeInTheDocument();
    expect(screen.getAllByText("Uncategorized").length).toBeGreaterThan(0);
  });
});
