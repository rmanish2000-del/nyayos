import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PartiesTimelineWorkspace } from "@/components/nyayos/parties-timeline-workspace";
import { PartyCard } from "@/components/nyayos/party-card";
import { TimelineEventCard } from "@/components/nyayos/timeline-event-card";

const party = {
  id: "party",
  name: "Anita Sharma",
  role: "claimant",
  relationship: "Buyer named in the supply agreement",
  confirmed: false,
  source: "document-fact",
  sourceDetail: "Supply agreement, page 1",
} as const;

function openTimeline() {
  fireEvent.click(screen.getByRole("button", { name: /^Timeline$/ }));
}

describe("PartyCard", () => {
  it("shows name, role, relationship, provenance and review state", () => {
    render(<PartyCard {...party} />);
    expect(screen.getByText("Anita Sharma")).toBeInTheDocument();
    expect(screen.getByText("Person raising the matter")).toBeInTheDocument();
    expect(screen.getByText("Buyer named in the supply agreement")).toBeInTheDocument();
    expect(screen.getByText(/Supply agreement, page 1/)).toBeInTheDocument();
    expect(screen.getByText("To review")).toBeInTheDocument();
  });

  it("offers Confirm, Edit and Remove and reports each action", () => {
    const onConfirm = vi.fn();
    const onEdit = vi.fn();
    const onRemove = vi.fn();
    render(<PartyCard {...party} onConfirm={onConfirm} onEdit={onEdit} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("hides Confirm once the party is confirmed", () => {
    render(<PartyCard {...party} confirmed />);
    expect(screen.queryByRole("button", { name: "Confirm" })).not.toBeInTheDocument();
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });
});

describe("TimelineEventCard", () => {
  it("renders every date precision with its source reference", () => {
    const precisions = ["exact", "approximate", "inferred", "conflicting", "unknown-date"] as const;
    const labels = [
      "Exact date",
      "Approximate date",
      "Inferred date",
      "Conflicting dates",
      "Date unknown",
    ];
    precisions.forEach((precision, index) => {
      const { unmount } = render(
        <TimelineEventCard
          id="event"
          title="Invoice raised"
          description="Read from the invoice."
          precision={precision}
          dateValue="18 April 2026"
          source="ai-extraction"
          sourceReference="Invoice AT-4471, page 1"
        />,
      );
      expect(screen.getAllByText(new RegExp(labels[index]!)).length).toBeGreaterThan(0);
      expect(screen.getByText("Source reference")).toBeInTheDocument();
      expect(screen.getByText(/Invoice AT-4471, page 1/)).toBeInTheDocument();
      unmount();
    });
  });

  it("shows a conflict indicator when two sources disagree", () => {
    render(
      <TimelineEventCard
        id="event"
        title="Shortfall reported"
        description="Reported in writing."
        precision="conflicting"
        dateValue="2 May 2026"
        source="third-party"
        sourceReference="Email thread, message 7"
        conflict="The email says 2 May 2026; the register says 9 May 2026."
      />,
    );
    expect(screen.getByRole("note")).toHaveTextContent("Dates disagree");
  });
});

describe("Parties and timeline workspace", () => {
  it("supports multiple parties and adds a new one", () => {
    render(<PartiesTimelineWorkspace />);
    expect(screen.getByText("4 parties")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Add party/ }));
    const form = screen.getByRole("form", { name: "Add party" });
    fireEvent.change(within(form).getByLabelText("Name"), { target: { value: "Sunil Rao" } });
    fireEvent.change(within(form).getByLabelText("Relationship to the matter"), {
      target: { value: "Warehouse supervisor" },
    });
    fireEvent.click(within(form).getByRole("button", { name: "Save new party" }));
    expect(screen.getByText("5 parties")).toBeInTheDocument();
    expect(screen.getByText("Sunil Rao")).toBeInTheDocument();
  });

  it("refuses an incomplete party without losing the form", () => {
    render(<PartiesTimelineWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: /Add party/ }));
    fireEvent.click(screen.getByRole("button", { name: "Save new party" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a name");
    expect(screen.getByText("4 parties")).toBeInTheDocument();
  });

  it("confirms and removes a party", () => {
    render(<PartiesTimelineWorkspace />);
    const card = screen.getByLabelText("Party: Ravi Kumar");
    fireEvent.click(within(card).getByRole("button", { name: "Confirm" }));
    expect(
      within(screen.getByLabelText("Party: Ravi Kumar")).getByText("Confirmed"),
    ).toBeInTheDocument();
    fireEvent.click(
      within(screen.getByLabelText("Party: Ravi Kumar")).getByRole("button", { name: "Remove" }),
    );
    expect(screen.queryByLabelText("Party: Ravi Kumar")).not.toBeInTheDocument();
  });

  it("edits a party and returns it to review with a correction source", () => {
    render(<PartiesTimelineWorkspace />);
    const card = screen.getByLabelText("Party: Anita Sharma");
    fireEvent.click(within(card).getByRole("button", { name: "Edit" }));
    const form = screen.getByRole("form", { name: "Edit party" });
    fireEvent.change(within(form).getByLabelText("Name"), { target: { value: "Anita S Sharma" } });
    fireEvent.click(within(form).getByRole("button", { name: "Save party" }));
    const updated = screen.getByLabelText("Party: Anita S Sharma");
    expect(within(updated).getByText("To review")).toBeInTheDocument();
    expect(within(updated).getByText(/Edited by you/)).toBeInTheDocument();
  });

  it("adds, edits and removes timeline events", () => {
    render(<PartiesTimelineWorkspace />);
    openTimeline();
    expect(screen.getByText("5 of 5 events")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Add event/ }));
    const addForm = screen.getByRole("form", { name: "Add event" });
    fireEvent.change(within(addForm).getByLabelText("What happened"), {
      target: { value: "Reminder letter sent" },
    });
    fireEvent.change(within(addForm).getByLabelText("Date"), {
      target: { value: "1 June 2026" },
    });
    fireEvent.click(within(addForm).getByRole("button", { name: "Save new event" }));
    expect(screen.getByText("6 of 6 events")).toBeInTheDocument();

    const card = screen.getByLabelText("Event: Reminder letter sent");
    fireEvent.click(within(card).getByRole("button", { name: "Edit event" }));
    const editForm = screen.getByRole("form", { name: "Edit event" });
    fireEvent.change(within(editForm).getByLabelText("What happened"), {
      target: { value: "Second reminder letter" },
    });
    fireEvent.click(within(editForm).getByRole("button", { name: "Save event" }));
    expect(screen.getByLabelText("Event: Second reminder letter")).toBeInTheDocument();

    fireEvent.click(
      within(screen.getByLabelText("Event: Second reminder letter")).getByRole("button", {
        name: "Remove event",
      }),
    );
    expect(screen.getByText("5 of 5 events")).toBeInTheDocument();
  });

  it("requires a date unless the date is unknown", () => {
    render(<PartiesTimelineWorkspace />);
    openTimeline();
    fireEvent.click(screen.getByRole("button", { name: /Add event/ }));
    const form = screen.getByRole("form", { name: "Add event" });
    fireEvent.change(within(form).getByLabelText("What happened"), {
      target: { value: "Call about payment" },
    });
    fireEvent.click(within(form).getByRole("button", { name: "Save new event" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a date");

    fireEvent.change(within(form).getByLabelText("How certain is the date"), {
      target: { value: "unknown-date" },
    });
    expect(within(form).getByLabelText("Date")).toBeDisabled();
    fireEvent.click(within(form).getByRole("button", { name: "Save new event" }));
    expect(screen.getByLabelText("Event: Call about payment")).toBeInTheDocument();
  });

  it("filters the timeline by date certainty and by conflicts", () => {
    render(<PartiesTimelineWorkspace />);
    openTimeline();
    fireEvent.change(screen.getByLabelText("Date certainty"), { target: { value: "exact" } });
    expect(screen.getByText("1 of 5 events")).toBeInTheDocument();
    expect(screen.getByLabelText("Event: Supply agreement signed")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Date certainty"), { target: { value: "all" } });
    fireEvent.click(screen.getByLabelText(/Only events where dates disagree/));
    expect(screen.getByText("1 of 5 events")).toBeInTheDocument();
    expect(screen.getByLabelText("Event: Shortfall reported")).toBeInTheDocument();
  });

  it("uses no prohibited predictive language", () => {
    render(<PartiesTimelineWorkspace />);
    openTimeline();
    const text = document.body.textContent?.toLowerCase() ?? "";
    for (const phrase of ["success probability", "truth score", "filing workflow", "marketplace"]) {
      expect(text).not.toContain(phrase);
    }
  });
});
