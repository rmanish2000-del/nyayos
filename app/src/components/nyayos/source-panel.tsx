import { Quote } from "lucide-react";
import * as React from "react";

import { ConfidenceBand, type ConfidenceBandKind } from "@/components/nyayos/confidence-band";
import { DateBadge, type DatePrecision } from "@/components/nyayos/date-badge";
import { SourceBadge, type SourceKind } from "@/components/nyayos/source-badge";
import { cn } from "@/lib/utils";

export interface FactSource {
  /** Where the information came from. */
  kind: SourceKind;
  /** Human-readable origin, e.g. a document name or a person. */
  origin: string;
  /** Page, paragraph or timestamp reference inside the origin. */
  locator?: string;
  /** Verbatim excerpt, shown as a quotation and never paraphrased. */
  excerpt?: string;
  /** Bounded extraction confidence for this source. */
  confidence?: ConfidenceBandKind;
  /** Date attached to this source, with its precision. */
  date?: { precision: DatePrecision; value?: string };
}

/**
 * Source Panel — the full provenance record behind a fact. Every fact can be
 * traced to one or more sources; the panel never ranks or scores them.
 */
export function SourcePanel({
  sources,
  id,
  className,
}: {
  sources: FactSource[];
  id?: string;
  className?: string;
}) {
  return (
    <div id={id} className={cn("grid gap-3", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {sources.length === 1 ? "Source" : `Sources (${sources.length})`}
      </p>
      <ul className="grid gap-3">
        {sources.map((source, index) => (
          <li
            key={`${source.kind}-${source.origin}-${index}`}
            className="rounded-md border border-border bg-surface-sunken p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge source={source.kind} detail={source.locator} />
              {source.date ? (
                <DateBadge precision={source.date.precision} value={source.date.value} />
              ) : null}
              {source.confidence ? <ConfidenceBand band={source.confidence} /> : null}
            </div>
            <p className="mt-2 text-sm font-medium text-foreground">{source.origin}</p>
            {source.excerpt ? (
              <blockquote className="mt-2 flex gap-2 border-l-2 border-border-strong pl-3 text-sm italic text-muted-foreground">
                <Quote aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                <span>{source.excerpt}</span>
              </blockquote>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
