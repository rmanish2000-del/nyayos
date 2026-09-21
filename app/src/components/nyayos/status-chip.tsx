import {
  AlertTriangle,
  Check,
  CircleDashed,
  Clock,
  HelpCircle,
  Loader2,
  MinusCircle,
  PencilLine,
  Trash2,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type StatusKind =
  | "confirmed"
  | "to-review"
  | "contradiction"
  | "missing"
  | "processing"
  | "removed"
  | "uncertain"
  | "not-relevant"
  | "corrected";

const STATUS: Record<
  StatusKind,
  { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
  confirmed: {
    label: "Confirmed",
    classes: "bg-status-confirmed-surface text-status-confirmed border-status-confirmed",
    icon: Check,
  },
  "to-review": {
    label: "To review",
    classes: "bg-status-review-surface text-status-review border-status-review",
    icon: Clock,
  },
  contradiction: {
    label: "Information to review",
    classes:
      "bg-status-contradiction-surface text-status-contradiction border-status-contradiction",
    icon: AlertTriangle,
  },
  missing: {
    label: "Missing",
    classes: "bg-status-missing-surface text-status-missing border-status-missing",
    icon: CircleDashed,
  },
  processing: {
    label: "Processing",
    classes: "bg-status-processing-surface text-status-processing border-status-processing",
    icon: Loader2,
  },
  removed: {
    label: "Removed",
    classes: "bg-status-removed-surface text-status-removed border-status-removed",
    icon: Trash2,
  },
  uncertain: {
    label: "Uncertain",
    classes: "bg-status-uncertain-surface text-status-uncertain border-status-uncertain",
    icon: HelpCircle,
  },
  "not-relevant": {
    label: "Not relevant",
    classes: "bg-status-not-relevant-surface text-status-not-relevant border-status-not-relevant",
    icon: MinusCircle,
  },
  corrected: {
    label: "Corrected",
    classes: "bg-status-corrected-surface text-status-corrected border-status-corrected",
    icon: PencilLine,
  },
};

/**
 * Status Chip — confirmation state of a fact or document.
 * Never expresses a score, ranking or likelihood.
 */
export function StatusChip({
  status,
  label,
  className,
}: {
  status: StatusKind;
  label?: string;
  className?: string;
}) {
  const config = STATUS[status];
  const Icon = config.icon;
  const text = label ?? config.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.classes,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("size-3.5 shrink-0", status === "processing" && "animate-spin")}
      />
      <span className="sr-only">Status: </span>
      {text}
    </span>
  );
}
