import { ArrowRight } from "lucide-react";

import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { REQUIRED_COPY, type StalenessAssessment, fillCopy } from "@/domain";
import { cn } from "@/lib/utils";

/**
 * Stale Output Notice (A-037). Informational only: it never refreshes, regenerates or
 * replaces the export and offers no control that would. When the output is CURRENT it
 * renders nothing. The review link goes to where the referenced items can be inspected.
 */
export function StaleOutputNotice({
  assessment,
  reviewHref,
  language = "en",
  className,
}: {
  assessment: StalenessAssessment;
  /** Route to the list of referenced items that need review. */
  reviewHref: string;
  language?: "en" | "hi";
  className?: string;
}) {
  if (assessment.status === "CURRENT") return null;
  const { stale, unknown } = assessment.counts;
  const count = String(assessment.reviewCount);

  return (
    <NotificationBanner
      tone="warning"
      title={REQUIRED_COPY.stale_output_title[language]}
      {...(className !== undefined ? { className } : {})}
    >
      {assessment.manifestIssue ? <p>{REQUIRED_COPY.stale_output_unreadable[language]}</p> : null}
      {stale > 0 ? (
        <p>{fillCopy(REQUIRED_COPY.stale_output_stale[language], { count: String(stale) })}</p>
      ) : null}
      {unknown > 0 ? (
        <p>{fillCopy(REQUIRED_COPY.stale_output_unknown[language], { count: String(unknown) })}</p>
      ) : null}
      <p className="mt-1">{REQUIRED_COPY.stale_output_unchanged[language]}</p>
      {assessment.reviewCount > 0 ? (
        <a
          href={reviewHref}
          className={cn(
            "mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border-strong bg-card px-3 text-sm font-medium text-foreground",
            "underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          {fillCopy(REQUIRED_COPY.stale_output_review[language], { count })}
          <ArrowRight aria-hidden="true" className="size-4" />
        </a>
      ) : null}
    </NotificationBanner>
  );
}
