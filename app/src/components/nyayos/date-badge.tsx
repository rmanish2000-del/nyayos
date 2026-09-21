import {
  CalendarCheck,
  CalendarClock,
  CalendarMinus,
  CalendarSearch,
  CalendarX,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type DatePrecision = "exact" | "approximate" | "inferred" | "conflicting" | "unknown-date";

const PRECISION: Record<
  DatePrecision,
  { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
  exact: {
    label: "Exact date",
    classes: "bg-date-exact-surface text-date-exact border-date-exact/30",
    icon: CalendarCheck,
  },
  approximate: {
    label: "Approximate date",
    classes: "bg-date-approximate-surface text-date-approximate border-date-approximate/30",
    icon: CalendarClock,
  },
  inferred: {
    label: "Inferred date",
    classes: "bg-date-inferred-surface text-date-inferred border-date-inferred/30 border-dashed",
    icon: CalendarSearch,
  },
  conflicting: {
    label: "Conflicting dates",
    classes: "bg-date-conflicting-surface text-date-conflicting border-date-conflicting/30",
    icon: CalendarX,
  },
  "unknown-date": {
    label: "Date unknown",
    classes: "bg-date-unknown-surface text-date-unknown border-date-unknown/30 border-dashed",
    icon: CalendarMinus,
  },
};

/**
 * Date Badge — date precision. An inferred or approximate date is never
 * presented with the same visual weight as an exact one.
 */
export function DateBadge({
  precision,
  value,
  className,
}: {
  precision: DatePrecision;
  value?: string;
  className?: string;
}) {
  const config = PRECISION[precision];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs",
        config.classes,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className={cn(precision === "exact" ? "font-semibold" : "font-normal italic")}>
        {precision === "unknown-date" ? config.label : value}
      </span>
      <span className="sr-only">, {config.label}</span>
      {precision === "unknown-date" ? null : (
        <span aria-hidden="true" className="opacity-80">
          · {config.label}
        </span>
      )}
    </span>
  );
}
