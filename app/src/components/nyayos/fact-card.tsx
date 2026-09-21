import { ChevronDown, PencilLine } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import { ConfidenceBand, type ConfidenceBandKind } from "@/components/nyayos/confidence-band";
import { DateBadge, type DatePrecision } from "@/components/nyayos/date-badge";
import { InlineCorrectionInput } from "@/components/nyayos/inline-correction-input";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { SourcePanel, type FactSource } from "@/components/nyayos/source-panel";
import { StatusChip, type StatusKind } from "@/components/nyayos/status-chip";
import { cn } from "@/lib/utils";

export interface FactCardProps {
  id: string;
  /** What this fact answers, e.g. "Date of delivery". */
  label: string;
  /** The recorded value, in the user's or the document's own words. */
  value: string;
  status: StatusKind;
  /** Full provenance record; at least one source is always shown. */
  sources: FactSource[];
  date?: { precision: DatePrecision; value?: string };
  confidence?: ConfidenceBandKind;
  /** Differing versions of the same fact. Shown side by side, never resolved automatically. */
  contradiction?: { note: string; versions: { value: string; source: FactSource }[] };
  /** The value before a user correction, kept visible when status is "corrected". */
  previousValue?: string;
  onCorrect?: (value: string, reason: string) => void;
  className?: string;
}

/**
 * Fact Card — one piece of information with its confirmation state, its
 * provenance and its date precision always visible. The card presents
 * information; it never scores it, ranks it or predicts an outcome.
 */
export function FactCard({
  id,
  label,
  value,
  status,
  sources,
  date,
  confidence,
  contradiction,
  previousValue,
  onCorrect,
  className,
}: FactCardProps) {
  const [sourcesOpen, setSourcesOpen] = React.useState(false);
  const [correcting, setCorrecting] = React.useState(false);
  const panelId = `${id}-sources`;

  const muted = status === "not-relevant" || status === "removed";

  return (
    <article
      aria-labelledby={`${id}-label`}
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-token-sm)]",
        status === "contradiction" && "border-status-contradiction/40",
        muted && "opacity-75",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p
            id={`${id}-label`}
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {label}
          </p>
          <p
            className={cn(
              "mt-1 font-serif text-lg text-foreground",
              muted && "line-through decoration-1",
            )}
          >
            {value}
          </p>
          {previousValue ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Previously recorded as{" "}
              <span className="font-mono line-through decoration-1">{previousValue}</span>
            </p>
          ) : null}
        </div>
        <StatusChip status={status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {date ? <DateBadge precision={date.precision} value={date.value} /> : null}
        {confidence ? <ConfidenceBand band={confidence} /> : null}
      </div>

      {contradiction ? (
        <div className="mt-4 grid gap-3">
          <NotificationBanner tone="warning" title="Two versions of this information">
            {contradiction.note}
          </NotificationBanner>
          <ul className="grid gap-3 sm:grid-cols-2">
            {contradiction.versions.map((version, index) => (
              <li
                key={`${id}-version-${index}`}
                className="rounded-md border border-border bg-surface-sunken p-3"
              >
                <p className="text-sm font-medium text-foreground">{version.value}</p>
                <div className="mt-2">
                  <SourcePanel sources={[version.source]} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          aria-expanded={sourcesOpen}
          aria-controls={panelId}
          onClick={() => setSourcesOpen((open) => !open)}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn("size-4 transition-transform", sourcesOpen && "rotate-180")}
          />
          {sourcesOpen ? "Hide sources" : "Show sources"}
        </Button>
        {onCorrect ? (
          <Button variant="ghost" onClick={() => setCorrecting((open) => !open)}>
            <PencilLine aria-hidden="true" className="size-4" />
            {correcting ? "Cancel correction" : "Correct this"}
          </Button>
        ) : null}
      </div>

      {sourcesOpen ? (
        <div className="mt-4">
          <SourcePanel id={panelId} sources={sources} />
        </div>
      ) : null}

      {correcting && onCorrect ? (
        <div className="mt-4 rounded-md border border-border bg-surface-sunken p-3">
          <InlineCorrectionInput
            id={`${id}-correction`}
            label={`Corrected ${label.toLowerCase()}`}
            originalValue={value}
            onSave={(next, reason) => {
              onCorrect(next, reason);
              setCorrecting(false);
            }}
            onCancel={() => setCorrecting(false)}
          />
        </div>
      ) : null}
    </article>
  );
}
