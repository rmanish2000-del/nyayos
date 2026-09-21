import {
  AlertCircle,
  Archive,
  CheckCircle2,
  FileSearch,
  Loader2,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import { ConfidenceBand, type ConfidenceBandKind } from "@/components/nyayos/confidence-band";
import { DateBadge, type DatePrecision } from "@/components/nyayos/date-badge";
import { SourceBadge, type SourceKind } from "@/components/nyayos/source-badge";
import { cn } from "@/lib/utils";

export type EvidenceState = "uploading" | "processing" | "extracted" | "error" | "uncategorized";

export interface EvidenceCardProps {
  id: string;
  filename: string;
  meta: string;
  state: EvidenceState;
  category?: string;
  progress?: number;
  message?: string;
  source?: SourceKind;
  locator?: string;
  extractedFacts?: number;
  confidence?: ConfidenceBandKind;
  date?: { precision: DatePrecision; value?: string };
  onCancel?: () => void;
  onRetry?: () => void;
  onRemove?: () => void;
  onReview?: () => void;
  onCategorize?: () => void;
  className?: string;
}

const STATES: Record<
  EvidenceState,
  { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
  uploading: {
    label: "Uploading",
    classes: "border-evidence-uploading bg-evidence-uploading-surface text-evidence-uploading",
    icon: Loader2,
  },
  processing: {
    label: "Processing",
    classes: "border-evidence-processing bg-evidence-processing-surface text-evidence-processing",
    icon: FileSearch,
  },
  extracted: {
    label: "Extracted",
    classes: "border-evidence-extracted bg-evidence-extracted-surface text-evidence-extracted",
    icon: CheckCircle2,
  },
  error: {
    label: "Needs attention",
    classes: "border-evidence-error bg-evidence-error-surface text-evidence-error",
    icon: AlertCircle,
  },
  uncategorized: {
    label: "Uncategorized",
    classes:
      "border-evidence-uncategorized bg-evidence-uncategorized-surface text-evidence-uncategorized",
    icon: Archive,
  },
};

export function EvidenceCard({
  id,
  filename,
  meta,
  state,
  category,
  progress,
  message,
  source = "document-extracted",
  locator,
  extractedFacts,
  confidence,
  date,
  onCancel,
  onRetry,
  onRemove,
  onReview,
  onCategorize,
  className,
}: EvidenceCardProps) {
  const config = STATES[state];
  const Icon = config.icon;
  const completion = Math.max(0, Math.min(100, progress ?? 0));
  const messageId = message ? `${id}-message` : undefined;

  return (
    <article
      aria-labelledby={`${id}-name`}
      aria-describedby={messageId}
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-token-sm)]",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-md border",
            config.classes,
          )}
        >
          <Icon
            aria-hidden="true"
            className={cn(
              "size-5",
              (state === "uploading" || state === "processing") && "animate-spin",
            )}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 id={`${id}-name`} className="break-words text-sm font-semibold text-foreground">
                {filename}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p>
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                config.classes,
              )}
            >
              <span className="sr-only">Evidence status: </span>
              {config.label}
            </span>
          </div>

          {state === "uploading" ? (
            <div className="mt-3">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>File transfer</span>
                <span className="font-mono">{completion}%</span>
              </div>
              <div
                role="progressbar"
                aria-label={`Upload progress for ${filename}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completion}
                className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full bg-evidence-uploading transition-transform"
                  style={{ transform: `translateX(-${100 - completion}%)` }}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-3 border-t border-border pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Provenance
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <SourceBadge source={source} detail={locator ?? filename} />
              {date ? <DateBadge precision={date.precision} value={date.value} /> : null}
              {confidence ? <ConfidenceBand band={confidence} /> : null}
            </div>
          </div>

          {category ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Category: <span className="font-medium text-foreground">{category}</span>
            </p>
          ) : null}
          {typeof extractedFacts === "number" ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {extractedFacts} extracted {extractedFacts === 1 ? "fact" : "facts"} ready to review
            </p>
          ) : null}
          {message ? (
            <p
              id={messageId}
              role={state === "error" ? "alert" : undefined}
              className={cn(
                "mt-3 text-sm",
                state === "error" ? "font-medium text-evidence-error" : "text-muted-foreground",
              )}
            >
              {message}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {state === "uploading" && onCancel ? (
              <Button variant="ghost" size="compact" onClick={onCancel}>
                <X aria-hidden="true" className="size-4" />
                Cancel
              </Button>
            ) : null}
            {state === "error" && onRetry ? (
              <Button variant="secondary" size="compact" onClick={onRetry}>
                <RotateCcw aria-hidden="true" className="size-4" />
                Retry
              </Button>
            ) : null}
            {state === "extracted" && onReview ? (
              <Button variant="secondary" size="compact" onClick={onReview}>
                <FileSearch aria-hidden="true" className="size-4" />
                Review extracted facts
              </Button>
            ) : null}
            {state === "uncategorized" && onCategorize ? (
              <Button variant="secondary" size="compact" onClick={onCategorize}>
                <Archive aria-hidden="true" className="size-4" />
                Choose category
              </Button>
            ) : null}
            {onRemove && state !== "uploading" ? (
              <Button variant="ghost" size="compact" onClick={onRemove}>
                <Trash2 aria-hidden="true" className="size-4" />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
