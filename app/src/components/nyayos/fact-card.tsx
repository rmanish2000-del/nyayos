import { Check, ChevronDown, HelpCircle, MinusCircle, PencilLine } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import { ConfidenceBand, type ConfidenceBandKind } from "@/components/nyayos/confidence-band";
import { DateBadge, type DatePrecision } from "@/components/nyayos/date-badge";
import { InlineCorrectionInput } from "@/components/nyayos/inline-correction-input";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { SourceBadge } from "@/components/nyayos/source-badge";
import { SourcePanel, type FactSource } from "@/components/nyayos/source-panel";
import { StatusChip, type StatusKind } from "@/components/nyayos/status-chip";
import { cn } from "@/lib/utils";

/** The three states a person can set directly on a fact, plus correction. */
export type FactAction = "confirmed" | "uncertain" | "not-relevant";

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
  /** Reason the user gave for the last correction; always visible once recorded. */
  correctionReason?: string;
  /** Set the confirmation state from the card's action row. */
  onAction?: (action: FactAction) => void;
  onCorrect?: (value: string, reason: string) => void;
  className?: string;
}

const ACTIONS: { action: FactAction; label: string; icon: typeof Check }[] = [
  { action: "confirmed", label: "Confirm", icon: Check },
  { action: "uncertain", label: "Uncertain", icon: HelpCircle },
  { action: "not-relevant", label: "Not relevant", icon: MinusCircle },
];

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
  correctionReason,
  onAction,
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
        status === "contradiction" && "border-status-contradiction",
        muted && "bg-surface-sunken",
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
              "mt-1 font-serif text-lg",
              muted ? "text-muted-foreground line-through decoration-1" : "text-foreground",
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

      {/* Provenance strip — where this came from is always on screen, never
          behind a disclosure. */}
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Where this came from
        </p>
        <ul className="mt-2 flex flex-wrap items-center gap-2">
          {sources.map((source, index) => (
            <li key={`${id}-strip-${source.kind}-${index}`}>
              <SourceBadge source={source.kind} detail={source.origin} />
            </li>
          ))}
          {date ? (
            <li>
              <DateBadge precision={date.precision} value={date.value} />
            </li>
          ) : null}
          {confidence ? (
            <li>
              <ConfidenceBand band={confidence} />
            </li>
          ) : null}
        </ul>
      </div>

      {correctionReason ? (
        <p className="mt-3 rounded-md border border-source-correction bg-source-correction-surface px-3 py-2 text-xs text-source-correction">
          <span className="font-semibold">Reason given for the correction: </span>
          {correctionReason}
        </p>
      ) : null}

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

      {onAction || onCorrect ? (
        <div className="mt-4 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What would you like to record?
          </p>
          <div
            role="group"
            aria-label={`Record a state for ${label}`}
            className="mt-2 flex flex-wrap gap-2"
          >
            {onAction
              ? ACTIONS.map(({ action, label: actionLabel, icon: Icon }) => (
                  <Button
                    key={action}
                    variant={status === action ? "primary" : "secondary"}
                    size="compact"
                    aria-pressed={status === action}
                    onClick={() => onAction(action)}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {actionLabel}
                  </Button>
                ))
              : null}
            {onCorrect ? (
              <Button
                variant="secondary"
                size="compact"
                aria-expanded={correcting}
                onClick={() => setCorrecting((open) => !open)}
              >
                <PencilLine aria-hidden="true" className="size-4" />
                {correcting ? "Cancel correction" : "Correct"}
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <Button
          variant="ghost"
          size="compact"
          aria-expanded={sourcesOpen}
          aria-controls={panelId}
          onClick={() => setSourcesOpen((open) => !open)}
        >
          <ChevronDown
            aria-hidden="true"
            className={cn("size-4 transition-transform", sourcesOpen && "rotate-180")}
          />
          {sourcesOpen ? "Hide source detail" : "Show source detail"}
        </Button>
        {/* Always in the DOM so aria-controls always resolves to a real element. */}
        <div id={panelId} hidden={!sourcesOpen} className={cn(!sourcesOpen && "hidden", "mt-4")}>
          <SourcePanel sources={sources} />
        </div>
      </div>

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
