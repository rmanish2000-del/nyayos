import { AlertTriangle, PencilLine, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import { DateBadge, type DatePrecision } from "@/components/nyayos/date-badge";
import { SourceBadge, type SourceKind } from "@/components/nyayos/source-badge";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  precision: DatePrecision;
  dateValue?: string;
  source: SourceKind;
  sourceReference: string;
  conflict?: string;
}

export interface TimelineEventCardProps extends TimelineEvent {
  onEdit?: () => void;
  onRemove?: () => void;
}

/**
 * Timeline Event Card — one dated event with its date precision, the source
 * reference it came from, and an explicit indicator when two sources disagree.
 */
export function TimelineEventCard({
  title,
  description,
  precision,
  dateValue,
  source,
  sourceReference,
  conflict,
  onEdit,
  onRemove,
}: TimelineEventCardProps) {
  return (
    <article
      aria-label={`Event: ${title}`}
      className="rounded-lg border border-border-strong bg-card p-4 shadow-[var(--shadow-token-sm)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h4 className="font-serif text-lg text-foreground">{title}</h4>
        <DateBadge precision={precision} value={dateValue} />
      </div>

      <p className="mt-2 text-sm text-foreground/90">{description}</p>

      {conflict ? (
        <p
          role="note"
          className="mt-3 flex items-start gap-2 rounded-md border border-status-contradiction bg-status-contradiction-surface p-2.5 text-xs font-medium text-status-contradiction"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            <span className="font-semibold">Dates disagree: </span>
            {conflict}
          </span>
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
          Source reference
        </span>
        <SourceBadge source={source} detail={sourceReference} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="secondary" size="compact" onClick={onEdit}>
          <PencilLine aria-hidden="true" className="size-4" />
          Edit event
        </Button>
        <Button variant="ghost" size="compact" onClick={onRemove}>
          <Trash2 aria-hidden="true" className="size-4" />
          Remove event
        </Button>
      </div>
    </article>
  );
}
