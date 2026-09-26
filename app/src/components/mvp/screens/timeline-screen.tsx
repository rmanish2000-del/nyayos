import { Link } from "@tanstack/react-router";
import * as React from "react";

import { EmptyState, ScreenHeader } from "@/components/mvp/states";
import { TextField } from "@/components/mvp/text-field";
import { Button, buttonVariants } from "@/components/nyayos/button";
import type { DatePrecision } from "@/components/nyayos/date-badge";
import { TimelineEventCard } from "@/components/nyayos/timeline-event-card";
import type { SeedDispute, SeedTimelineEntry } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";

const PRECISIONS: { value: DatePrecision; label: string }[] = [
  { value: "exact", label: "Exact" },
  { value: "approximate", label: "Approximate" },
  { value: "inferred", label: "Inferred" },
  { value: "unknown-date", label: "Unknown" },
  { value: "conflicting", label: "Conflicting" },
];

function sortEntries(entries: SeedTimelineEntry[]) {
  // Dated entries first in date order; unknown dates last, never guessed.
  return [...entries].sort((a, b) => {
    if (!a.sortKey && !b.sortKey) return 0;
    if (!a.sortKey) return 1;
    if (!b.sortKey) return -1;
    return a.sortKey.localeCompare(b.sortKey);
  });
}

/** U09 — chronology with date precision always visible. */
export function TimelineScreen({ dispute }: { dispute: SeedDispute }) {
  const { data, updateTimelineDate } = useMvp();
  const entries = sortEntries(data.timeline.filter((e) => e.disputeId === dispute.id));
  const [precision, setPrecision] = React.useState<DatePrecision | "all">("all");
  const [conflictsOnly, setConflictsOnly] = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [draftPrecision, setDraftPrecision] = React.useState<DatePrecision>("exact");
  const [draftValue, setDraftValue] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [announcement, setAnnouncement] = React.useState("");

  const shown = entries.filter(
    (e) =>
      (precision === "all" || e.precision === precision) &&
      (!conflictsOnly || e.precision === "conflicting" || Boolean(e.conflict)),
  );

  return (
    <div className="grid gap-6">
      <ScreenHeader screenId="U09 · Timeline" title="Timeline">
        How sure each date is stays visible. An approximate or worked-out date is never shown as
        exact.
      </ScreenHeader>

      {entries.length === 0 ? (
        <EmptyState title="No timeline entries yet">
          Dated facts and documents will appear here in order.
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-sm text-foreground">
              Date certainty
              <select
                value={precision}
                onChange={(e) => setPrecision(e.target.value as DatePrecision | "all")}
                className="touch-target rounded-md border border-input bg-card px-2 text-sm"
              >
                <option value="all">All dates</option>
                {PRECISIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex touch-target items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={conflictsOnly}
                onChange={(e) => setConflictsOnly(e.target.checked)}
                className="size-5 accent-[var(--primary)]"
              />
              Only dates that disagree
            </label>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Showing {shown.length} of {entries.length}
            </p>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>

          {shown.length === 0 ? (
            <EmptyState title="No entries match these filters" />
          ) : (
            <ol className="relative grid gap-4 border-l-2 border-border-strong pl-4 sm:pl-6">
              {shown.map((entry) => {
                const doc = data.documents.find((d) => d.id === entry.documentId);
                const reference = doc ? doc.label : entry.factId ? "Your account" : "No source";
                return (
                  <li key={entry.id} className="grid gap-2">
                    <TimelineEventCard
                      id={entry.id}
                      title={entry.title}
                      description={entry.description}
                      precision={entry.precision}
                      {...(entry.dateValue ? { dateValue: entry.dateValue } : {})}
                      source={doc ? "document-fact" : "user-statement"}
                      sourceReference={reference}
                      {...(entry.conflict ? { conflict: entry.conflict } : {})}
                      onEdit={() => {
                        setEditing(entry.id);
                        setDraftPrecision(entry.precision);
                        setDraftValue(entry.dateValue ?? "");
                        setError(undefined);
                      }}
                    />
                    {doc && doc.state === "ready" ? (
                      <Link
                        to="/disputes/$disputeId/documents/$documentId"
                        params={{ disputeId: dispute.id, documentId: doc.id }}
                        className={
                          buttonVariants({ variant: "link", size: "compact" }) +
                          " justify-self-start"
                        }
                      >
                        Open source: {doc.label}
                      </Link>
                    ) : null}
                    {editing === entry.id ? (
                      <form
                        noValidate
                        aria-label={`Change the date for ${entry.title}`}
                        className="grid gap-3 rounded-md border border-border bg-surface-sunken p-3"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (draftPrecision !== "unknown-date" && !draftValue.trim()) {
                            setError("Enter a date, or choose Unknown.");
                            return;
                          }
                          updateTimelineDate(
                            entry.id,
                            draftPrecision,
                            draftValue.trim() || undefined,
                          );
                          setEditing(null);
                          setAnnouncement(`Date updated for ${entry.title}.`);
                        }}
                      >
                        <label className="grid gap-1 text-sm text-foreground">
                          How sure is this date?
                          <select
                            value={draftPrecision}
                            onChange={(e) => setDraftPrecision(e.target.value as DatePrecision)}
                            className="touch-target rounded-md border border-input bg-card px-2 text-sm"
                          >
                            {PRECISIONS.map((p) => (
                              <option key={p.value} value={p.value}>
                                {p.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        {draftPrecision !== "unknown-date" ? (
                          <TextField
                            id={`${entry.id}-date`}
                            label="Date as you know it"
                            hint="For example: 4 Jun 2026, or early May 2026"
                            value={draftValue}
                            onChange={(v) => {
                              setDraftValue(v);
                              setError(undefined);
                            }}
                            error={error}
                          />
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          <Button type="submit" size="compact">
                            Save date
                          </Button>
                          <Button variant="ghost" size="compact" onClick={() => setEditing(null)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}
    </div>
  );
}
