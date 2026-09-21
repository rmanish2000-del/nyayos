import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Progress Indicator — readiness percentage only.
 *
 * Deliberately carries no score, ranking, strength, likelihood or probability
 * language. It reports how much of the information set has been assembled and
 * nothing about outcomes.
 */
export function ReadinessIndicator({
  value,
  label = "Information readiness",
  description,
  className,
}: {
  value: number;
  label?: string;
  description?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="font-mono text-sm text-muted-foreground">{pct}% complete</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${pct} percent complete`}
        className="h-2.5 w-full overflow-hidden rounded-full bg-surface-sunken ring-1 ring-border"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-[var(--animate-duration-slow)] ease-[var(--ease-standard)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
    </div>
  );
}
