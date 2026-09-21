import { CalendarRange, Plus, Users } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import type { DatePrecision } from "@/components/nyayos/date-badge";
import {
  PARTY_ROLE_LABELS,
  PartyCard,
  type PartyRecord,
  type PartyRole,
} from "@/components/nyayos/party-card";
import { TimelineEventCard, type TimelineEvent } from "@/components/nyayos/timeline-event-card";

type PartiesScreen = "parties" | "timeline";

const ROLES: PartyRole[] = [
  "claimant",
  "respondent",
  "witness",
  "authorised-representative",
  "other",
];

const PRECISIONS: DatePrecision[] = [
  "exact",
  "approximate",
  "inferred",
  "conflicting",
  "unknown-date",
];

const PRECISION_LABELS: Record<DatePrecision, string> = {
  exact: "Exact date",
  approximate: "Approximate date",
  inferred: "Inferred date",
  conflicting: "Conflicting dates",
  "unknown-date": "Date unknown",
};

export const INITIAL_PARTIES: PartyRecord[] = [
  {
    id: "party-anita",
    name: "Anita Sharma",
    role: "claimant",
    relationship: "Buyer named in the supply agreement",
    confirmed: true,
    source: "document-fact",
    sourceDetail: "Supply agreement, page 1",
  },
  {
    id: "party-vertex",
    name: "Vertex Traders Pvt Ltd",
    role: "respondent",
    relationship: "Supplier named in the supply agreement",
    confirmed: true,
    source: "document-fact",
    sourceDetail: "Supply agreement, page 1",
  },
  {
    id: "party-ravi",
    name: "Ravi Kumar",
    role: "witness",
    relationship: "Received the delivery at the warehouse",
    confirmed: false,
    source: "user-statement",
    sourceDetail: "Your intake answers",
  },
  {
    id: "party-meera",
    name: "Meera Iyer",
    role: "authorised-representative",
    relationship: "Speaks for Vertex Traders in writing",
    confirmed: false,
    source: "ai-extraction",
    sourceDetail: "Email thread, message 4",
  },
];

export const INITIAL_EVENTS: TimelineEvent[] = [
  {
    id: "event-agreement",
    title: "Supply agreement signed",
    description: "Both sides signed the agreement for monthly deliveries.",
    precision: "exact",
    dateValue: "12 March 2026",
    source: "document-fact",
    sourceReference: "Supply agreement, page 6",
  },
  {
    id: "event-delivery",
    title: "First delivery received",
    description: "Goods were received at the warehouse and signed for.",
    precision: "approximate",
    dateValue: "Early April 2026",
    source: "user-statement",
    sourceReference: "Your intake answers",
  },
  {
    id: "event-invoice",
    title: "Invoice raised",
    description: "The invoice date was read out of the scanned invoice.",
    precision: "inferred",
    dateValue: "Around 18 April 2026",
    source: "ai-extraction",
    sourceReference: "Invoice AT-4471, page 1",
  },
  {
    id: "event-dispute",
    title: "Shortfall reported",
    description: "The shortfall was reported in writing.",
    precision: "conflicting",
    dateValue: "2 May 2026",
    source: "third-party",
    sourceReference: "Email thread, message 7",
    conflict:
      "The email says 2 May 2026; the delivery register says 9 May 2026. Both are kept until you confirm one.",
  },
  {
    id: "event-call",
    title: "Phone call about payment",
    description: "A call was described but no date was given.",
    precision: "unknown-date",
    source: "source-unavailable",
    sourceReference: "No document available",
  },
];

/**
 * S11 Parties & Entities and S12 Timeline. Both screens work on the same
 * matter, with multi-party support, date precision and explicit conflict
 * indicators. Staging demonstration only — no persistence.
 */
export function PartiesTimelineWorkspace() {
  const [screen, setScreen] = React.useState<PartiesScreen>("parties");
  const [parties, setParties] = React.useState(INITIAL_PARTIES);
  const [events, setEvents] = React.useState(INITIAL_EVENTS);
  const [announcement, setAnnouncement] = React.useState("");

  const [partyForm, setPartyForm] = React.useState(false);
  const [editingParty, setEditingParty] = React.useState<string | null>(null);
  const [partyDraft, setPartyDraft] = React.useState({
    name: "",
    role: "claimant" as PartyRole,
    relationship: "",
  });
  const [partyError, setPartyError] = React.useState("");

  const [eventForm, setEventForm] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<string | null>(null);
  const [eventDraft, setEventDraft] = React.useState({
    title: "",
    description: "",
    precision: "exact" as DatePrecision,
    dateValue: "",
  });
  const [eventError, setEventError] = React.useState("");

  const [precisionFilter, setPrecisionFilter] = React.useState<"all" | DatePrecision>("all");
  const [conflictsOnly, setConflictsOnly] = React.useState(false);

  const resetPartyForm = () => {
    setPartyForm(false);
    setEditingParty(null);
    setPartyError("");
    setPartyDraft({ name: "", role: "claimant", relationship: "" });
  };

  const resetEventForm = () => {
    setEventForm(false);
    setEditingEvent(null);
    setEventError("");
    setEventDraft({ title: "", description: "", precision: "exact", dateValue: "" });
  };

  const submitParty = (event: React.FormEvent) => {
    event.preventDefault();
    if (!partyDraft.name.trim() || !partyDraft.relationship.trim()) {
      setPartyError("Enter a name and how this person is connected to the matter.");
      return;
    }
    if (editingParty) {
      const id = editingParty;
      setParties((current) =>
        current.map((party) =>
          party.id === id
            ? {
                ...party,
                name: partyDraft.name.trim(),
                role: partyDraft.role,
                relationship: partyDraft.relationship.trim(),
                confirmed: false,
                source: "user-correction",
                sourceDetail: "Edited by you",
              }
            : party,
        ),
      );
      setAnnouncement(`${partyDraft.name.trim()} updated and set back to review.`);
    } else {
      setParties((current) => [
        ...current,
        {
          id: `party-${Date.now()}`,
          name: partyDraft.name.trim(),
          role: partyDraft.role,
          relationship: partyDraft.relationship.trim(),
          confirmed: false,
          source: "user-statement",
          sourceDetail: "Added by you",
        },
      ]);
      setAnnouncement(`${partyDraft.name.trim()} added to the parties list.`);
    }
    resetPartyForm();
  };

  const submitEvent = (event: React.FormEvent) => {
    event.preventDefault();
    if (!eventDraft.title.trim()) {
      setEventError("Enter what happened.");
      return;
    }
    if (eventDraft.precision !== "unknown-date" && !eventDraft.dateValue.trim()) {
      setEventError("Enter a date, or choose “Date unknown”.");
      return;
    }
    const shared = {
      title: eventDraft.title.trim(),
      description: eventDraft.description.trim() || "No further detail given.",
      precision: eventDraft.precision,
      ...(eventDraft.precision === "unknown-date"
        ? {}
        : { dateValue: eventDraft.dateValue.trim() }),
    };
    if (editingEvent) {
      const id = editingEvent;
      setEvents((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                ...shared,
                source: "user-correction",
                sourceReference: "Edited by you",
              }
            : item,
        ),
      );
      setAnnouncement(`${shared.title} updated.`);
    } else {
      setEvents((current) => [
        ...current,
        {
          id: `event-${Date.now()}`,
          ...shared,
          source: "user-statement",
          sourceReference: "Added by you",
        },
      ]);
      setAnnouncement(`${shared.title} added to the timeline.`);
    }
    resetEventForm();
  };

  const visibleEvents = events.filter(
    (item) =>
      (precisionFilter === "all" || item.precision === precisionFilter) &&
      (!conflictsOnly || Boolean(item.conflict)),
  );

  return (
    <div>
      <header className="border-b border-border-strong bg-surface-raised px-4 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
          Parties and timeline
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
              {screen === "parties" ? "Parties and entities" : "Timeline"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-foreground/80">
              {screen === "parties"
                ? "Everyone involved, their role and how they are connected — with where each detail came from."
                : "What happened and when, with how certain each date is and which source it came from."}
            </p>
          </div>
          <div
            role="group"
            aria-label="Parties and timeline screens"
            className="flex rounded-md border border-border-strong bg-card p-1"
          >
            <Button
              variant={screen === "parties" ? "primary" : "ghost"}
              size="compact"
              aria-pressed={screen === "parties"}
              onClick={() => setScreen("parties")}
            >
              <Users aria-hidden="true" className="size-4" />
              Parties
            </Button>
            <Button
              variant={screen === "timeline" ? "primary" : "ghost"}
              size="compact"
              aria-pressed={screen === "timeline"}
              onClick={() => setScreen("timeline")}
            >
              <CalendarRange aria-hidden="true" className="size-4" />
              Timeline
            </Button>
          </div>
        </div>
      </header>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {screen === "parties" ? (
        <div className="px-4 py-8 sm:px-8">
          <section aria-labelledby="parties-list-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id="parties-list-title" className="font-serif text-xl text-foreground">
                Parties in this matter
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground/80">{parties.length} parties</span>
                <Button
                  size="compact"
                  onClick={() => {
                    resetPartyForm();
                    setPartyForm(true);
                  }}
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Add party
                </Button>
              </div>
            </div>

            {partyForm ? (
              <form
                onSubmit={submitParty}
                aria-label={editingParty ? "Edit party" : "Add party"}
                className="mt-4 grid gap-3 rounded-lg border border-border-strong bg-surface-sunken p-4 sm:grid-cols-2"
              >
                <label className="text-sm font-medium text-foreground">
                  Name
                  <input
                    value={partyDraft.name}
                    onChange={(event) =>
                      setPartyDraft((draft) => ({ ...draft, name: event.target.value }))
                    }
                    className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                  />
                </label>
                <label className="text-sm font-medium text-foreground">
                  Role
                  <select
                    value={partyDraft.role}
                    onChange={(event) =>
                      setPartyDraft((draft) => ({
                        ...draft,
                        role: event.target.value as PartyRole,
                      }))
                    }
                    className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {PARTY_ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-foreground sm:col-span-2">
                  Relationship to the matter
                  <input
                    value={partyDraft.relationship}
                    onChange={(event) =>
                      setPartyDraft((draft) => ({ ...draft, relationship: event.target.value }))
                    }
                    className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                  />
                </label>
                {partyError ? (
                  <p role="alert" className="text-xs font-medium text-error sm:col-span-2">
                    {partyError}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2 sm:col-span-2">
                  <Button type="submit" size="compact">
                    {editingParty ? "Save party" : "Save new party"}
                  </Button>
                  <Button type="button" variant="ghost" size="compact" onClick={resetPartyForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : null}

            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {parties.map((party) => (
                <PartyCard
                  key={party.id}
                  {...party}
                  onConfirm={() => {
                    setParties((current) =>
                      current.map((item) =>
                        item.id === party.id ? { ...item, confirmed: true } : item,
                      ),
                    );
                    setAnnouncement(`${party.name} confirmed.`);
                  }}
                  onEdit={() => {
                    setPartyDraft({
                      name: party.name,
                      role: party.role,
                      relationship: party.relationship,
                    });
                    setEditingParty(party.id);
                    setPartyError("");
                    setPartyForm(true);
                  }}
                  onRemove={() => {
                    setParties((current) => current.filter((item) => item.id !== party.id));
                    setAnnouncement(`${party.name} removed from this matter.`);
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="px-4 py-8 sm:px-8">
          <section aria-labelledby="timeline-filters-title">
            <h3 id="timeline-filters-title" className="font-serif text-xl text-foreground">
              Timeline filters
            </h3>
            <div className="mt-3 flex flex-wrap items-end gap-4">
              <label className="text-sm font-medium text-foreground">
                Date certainty
                <select
                  value={precisionFilter}
                  onChange={(event) =>
                    setPrecisionFilter(event.target.value as "all" | DatePrecision)
                  }
                  className="touch-target mt-1 block rounded-md border border-input bg-card px-3 text-sm text-foreground"
                >
                  <option value="all">All dates</option>
                  {PRECISIONS.map((precision) => (
                    <option key={precision} value={precision}>
                      {PRECISION_LABELS[precision]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex touch-target items-center gap-2 text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={conflictsOnly}
                  onChange={(event) => setConflictsOnly(event.target.checked)}
                  className="size-4"
                />
                Only events where dates disagree
              </label>
              <Button
                size="compact"
                onClick={() => {
                  resetEventForm();
                  setEventForm(true);
                }}
              >
                <Plus aria-hidden="true" className="size-4" />
                Add event
              </Button>
            </div>
          </section>

          {eventForm ? (
            <form
              onSubmit={submitEvent}
              aria-label={editingEvent ? "Edit event" : "Add event"}
              className="mt-6 grid gap-3 rounded-lg border border-border-strong bg-surface-sunken p-4 sm:grid-cols-2"
            >
              <label className="text-sm font-medium text-foreground">
                What happened
                <input
                  value={eventDraft.title}
                  onChange={(event) =>
                    setEventDraft((draft) => ({ ...draft, title: event.target.value }))
                  }
                  className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                How certain is the date
                <select
                  value={eventDraft.precision}
                  onChange={(event) =>
                    setEventDraft((draft) => ({
                      ...draft,
                      precision: event.target.value as DatePrecision,
                    }))
                  }
                  className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                >
                  {PRECISIONS.map((precision) => (
                    <option key={precision} value={precision}>
                      {PRECISION_LABELS[precision]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-foreground">
                Date
                <input
                  value={eventDraft.dateValue}
                  disabled={eventDraft.precision === "unknown-date"}
                  onChange={(event) =>
                    setEventDraft((draft) => ({ ...draft, dateValue: event.target.value }))
                  }
                  className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground disabled:bg-muted disabled:text-muted-foreground"
                />
              </label>
              <label className="text-sm font-medium text-foreground">
                Detail
                <input
                  value={eventDraft.description}
                  onChange={(event) =>
                    setEventDraft((draft) => ({ ...draft, description: event.target.value }))
                  }
                  className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                />
              </label>
              {eventError ? (
                <p role="alert" className="text-xs font-medium text-error sm:col-span-2">
                  {eventError}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button type="submit" size="compact">
                  {editingEvent ? "Save event" : "Save new event"}
                </Button>
                <Button type="button" variant="ghost" size="compact" onClick={resetEventForm}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : null}

          <section aria-labelledby="timeline-events-title" className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id="timeline-events-title" className="font-serif text-xl text-foreground">
                Events
              </h3>
              <span className="text-sm text-foreground/80">
                {visibleEvents.length} of {events.length} events
              </span>
            </div>
            {visibleEvents.length ? (
              <ol className="mt-4 grid gap-4">
                {visibleEvents.map((item) => (
                  <li key={item.id}>
                    <TimelineEventCard
                      {...item}
                      onEdit={() => {
                        setEventDraft({
                          title: item.title,
                          description: item.description,
                          precision: item.precision,
                          dateValue: item.dateValue ?? "",
                        });
                        setEditingEvent(item.id);
                        setEventError("");
                        setEventForm(true);
                      }}
                      onRemove={() => {
                        setEvents((current) =>
                          current.filter((existing) => existing.id !== item.id),
                        );
                        setAnnouncement(`${item.title} removed from the timeline.`);
                      }}
                    />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 rounded-md border border-border-strong bg-surface-sunken p-4 text-sm text-foreground/80">
                No events match these filters.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
