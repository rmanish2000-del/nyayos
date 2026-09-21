import {
  AlertCircle,
  Ban,
  CheckCircle2,
  Clock,
  Eye,
  FileSearch,
  FileText,
  Loader2,
  Pencil,
  RotateCcw,
  ScanLine,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import { ConfidenceBand, type ConfidenceBandKind } from "@/components/nyayos/confidence-band";
import { DateBadge, type DatePrecision } from "@/components/nyayos/date-badge";
import { SourceBadge, type SourceKind } from "@/components/nyayos/source-badge";
import { cn } from "@/lib/utils";

/** Document lifecycle — where the file itself is in handling. Never a category. */
export type EvidenceLifecycle =
  "queued" | "scanning" | "processing" | "extracted" | "rejected" | "error";

/** Document category — what kind of document it is. Never a lifecycle state. */
export type EvidenceCategory =
  "contract" | "invoice" | "receipt" | "communication" | "uncategorized" | "other";

export interface DocumentProvenance {
  uploadedBy: string;
  uploadDate: string;
  hash: string;
}

export interface ExtractionSummary {
  /** Plain-language description of what was read out of the document. */
  summary: string;
  source?: SourceKind;
  locator?: string;
  confidence?: ConfidenceBandKind;
  date?: { precision: DatePrecision; value?: string };
  factCount?: number;
}

export interface EvidenceCardProps {
  id: string;
  filename: string;
  meta: string;
  lifecycle: EvidenceLifecycle;
  category: EvidenceCategory;
  categoryConfirmed?: boolean;
  provenance: DocumentProvenance;
  extraction?: ExtractionSummary;
  progress?: number;
  message?: string;
  onCancel?: () => void;
  onRetry?: () => void;
  onView?: () => void;
  onRename?: () => void;
  onConfirmType?: () => void;
  onCorrectType?: () => void;
  onRemove?: () => void;
  className?: string;
}

const LIFECYCLE: Record<
  EvidenceLifecycle,
  { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
  queued: {
    label: "Queued",
    classes: "border-evidence-queued bg-evidence-queued-surface text-evidence-queued",
    icon: Clock,
  },
  scanning: {
    label: "Scanning",
    classes: "border-evidence-scanning bg-evidence-scanning-surface text-evidence-scanning",
    icon: ScanLine,
  },
  processing: {
    label: "Processing",
    classes: "border-evidence-processing bg-evidence-processing-surface text-evidence-processing",
    icon: Loader2,
  },
  extracted: {
    label: "Extracted",
    classes: "border-evidence-extracted bg-evidence-extracted-surface text-evidence-extracted",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    classes: "border-evidence-rejected bg-evidence-rejected-surface text-evidence-rejected",
    icon: Ban,
  },
  error: {
    label: "Needs attention",
    classes: "border-evidence-error bg-evidence-error-surface text-evidence-error",
    icon: AlertCircle,
  },
};

export const CATEGORY_LABELS: Record<EvidenceCategory, string> = {
  contract: "Contract",
  invoice: "Invoice",
  receipt: "Receipt",
  communication: "Communication",
  uncategorized: "Uncategorized",
  other: "Other",
};

export function EvidenceCard({
  id,
  filename,
  meta,
  lifecycle,
  category,
  categoryConfirmed,
  provenance,
  extraction,
  progress,
  message,
  onCancel,
  onRetry,
  onView,
  onRename,
  onConfirmType,
  onCorrectType,
  onRemove,
  className,
}: EvidenceCardProps) {
  const config = LIFECYCLE[lifecycle];
  const Icon = config.icon;
  const completion = Math.max(0, Math.min(100, progress ?? 0));
  const messageId = message ? `${id}-message` : undefined;
  const inFlight = lifecycle === "queued" || lifecycle === "scanning";

  return (
    <article
      aria-labelledby={`${id}-name`}
      aria-describedby={messageId}
      className={cn(
        "rounded-lg border border-border-strong bg-card p-4 shadow-[var(--shadow-token-sm)]",
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
              (lifecycle === "processing" || lifecycle === "scanning") && "animate-spin",
            )}
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 id={`${id}-name`} className="break-words text-sm font-semibold text-foreground">
                {filename}
              </h3>
              <p className="mt-0.5 text-xs text-foreground/80">{meta}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
                  config.classes,
                )}
              >
                <span className="sr-only">Document lifecycle: </span>
                {config.label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                <Tag aria-hidden="true" className="size-3.5" />
                <span className="sr-only">Document category: </span>
                {CATEGORY_LABELS[category]}
                {categoryConfirmed ? (
                  <span className="font-normal text-foreground/80">· confirmed</span>
                ) : null}
              </span>
            </div>
          </div>

          {inFlight ? (
            <div className="mt-3">
              <div className="flex items-center justify-between gap-3 text-xs text-foreground/80">
                <span>{lifecycle === "queued" ? "Waiting in queue" : "File transfer"}</span>
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
                  className="h-full bg-evidence-scanning transition-transform"
                  style={{ transform: `translateX(-${100 - completion}%)` }}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-3 border-t border-border-strong pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Document provenance
            </p>
            <dl className="mt-2 grid gap-1 text-xs text-foreground sm:grid-cols-3">
              <div>
                <dt className="text-foreground/80">Uploaded by</dt>
                <dd className="font-medium">{provenance.uploadedBy}</dd>
              </div>
              <div>
                <dt className="text-foreground/80">Upload date</dt>
                <dd className="font-medium">{provenance.uploadDate}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-foreground/80">Document hash</dt>
                <dd className="break-all font-mono">{provenance.hash}</dd>
              </div>
            </dl>
          </div>

          {extraction ? (
            <div className="mt-3 rounded-md border border-border-strong bg-surface-sunken p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
                Extraction summary
              </p>
              <p className="mt-1.5 text-sm text-foreground">{extraction.summary}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {extraction.source ? (
                  <SourceBadge source={extraction.source} detail={extraction.locator ?? filename} />
                ) : null}
                {extraction.date ? (
                  <DateBadge precision={extraction.date.precision} value={extraction.date.value} />
                ) : null}
                {extraction.confidence ? <ConfidenceBand band={extraction.confidence} /> : null}
              </div>
              {typeof extraction.factCount === "number" ? (
                <p className="mt-2 text-xs text-foreground/80">
                  {extraction.factCount} extracted {extraction.factCount === 1 ? "fact" : "facts"}{" "}
                  ready to review
                </p>
              ) : null}
            </div>
          ) : null}

          {message ? (
            <p
              id={messageId}
              role={lifecycle === "error" ? "alert" : undefined}
              className={cn(
                "mt-3 text-sm",
                lifecycle === "error" ? "font-medium text-evidence-error" : "text-foreground/80",
              )}
            >
              {message}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {onView ? (
              <Button variant="secondary" size="compact" onClick={onView}>
                <Eye aria-hidden="true" className="size-4" />
                View
              </Button>
            ) : null}
            {onRename ? (
              <Button variant="ghost" size="compact" onClick={onRename}>
                <Pencil aria-hidden="true" className="size-4" />
                Rename
              </Button>
            ) : null}
            {onConfirmType ? (
              <Button variant="secondary" size="compact" onClick={onConfirmType}>
                <CheckCircle2 aria-hidden="true" className="size-4" />
                Confirm type
              </Button>
            ) : null}
            {onCorrectType ? (
              <Button variant="ghost" size="compact" onClick={onCorrectType}>
                <FileText aria-hidden="true" className="size-4" />
                Correct type
              </Button>
            ) : null}
            {inFlight && onCancel ? (
              <Button variant="ghost" size="compact" onClick={onCancel}>
                <X aria-hidden="true" className="size-4" />
                Cancel
              </Button>
            ) : null}
            {(lifecycle === "error" || lifecycle === "rejected") && onRetry ? (
              <Button variant="secondary" size="compact" onClick={onRetry}>
                <RotateCcw aria-hidden="true" className="size-4" />
                Retry
              </Button>
            ) : null}
            {lifecycle === "extracted" && extraction ? (
              <Button variant="ghost" size="compact" onClick={onView}>
                <FileSearch aria-hidden="true" className="size-4" />
                Review extracted facts
              </Button>
            ) : null}
            {onRemove ? (
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
