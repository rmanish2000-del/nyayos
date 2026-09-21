import { AlertCircle, CheckCircle2, CircleDotDashed } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ConfidenceBandKind = "low" | "medium" | "high";

const CONFIDENCE: Record<
  ConfidenceBandKind,
  { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
  low: {
    label: "Low confidence",
    classes: "bg-confidence-low-surface text-confidence-low border-confidence-low/30",
    icon: AlertCircle,
  },
  medium: {
    label: "Medium confidence",
    classes: "bg-confidence-medium-surface text-confidence-medium border-confidence-medium/30",
    icon: CircleDotDashed,
  },
  high: {
    label: "High confidence",
    classes: "bg-confidence-high-surface text-confidence-high border-confidence-high/30",
    icon: CheckCircle2,
  },
};

/** Describes bounded extraction confidence, never truth or outcome probability. */
export function ConfidenceBand({
  band,
  className,
}: {
  band: ConfidenceBandKind;
  className?: string;
}) {
  const config = CONFIDENCE[band];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium",
        config.classes,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {config.label}
      <span className="sr-only"> for extraction</span>
    </span>
  );
}
