import { Link } from "@tanstack/react-router";
import {
  Archive,
  BookOpenText,
  CalendarRange,
  FileCheck2,
  FileOutput,
  ListChecks,
} from "lucide-react";
import type * as React from "react";

import type { SeedDispute } from "@/mvp/fixtures";

const STEPS = [
  { to: "/disputes/$disputeId", label: "What happened", icon: BookOpenText, exact: true },
  { to: "/disputes/$disputeId/intake", label: "Intake", icon: ListChecks, exact: false },
  { to: "/disputes/$disputeId/evidence", label: "Evidence", icon: Archive, exact: false },
  { to: "/disputes/$disputeId/facts", label: "Facts", icon: FileCheck2, exact: false },
  { to: "/disputes/$disputeId/timeline", label: "Timeline", icon: CalendarRange, exact: false },
  { to: "/disputes/$disputeId/export", label: "Export", icon: FileOutput, exact: false },
] as const;

/**
 * Frame for one dispute: title plus the step navigation. The step list is a
 * horizontal scroller on phones and a side list from tablet width up.
 */
export function DisputeFrame({
  dispute,
  children,
}: {
  dispute: SeedDispute;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:px-6 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8 md:py-8">
      <nav aria-label="Dispute steps" className="min-w-0">
        <p className="truncate px-1 text-sm font-medium text-foreground" title={dispute.title}>
          {dispute.title}
        </p>
        <ul className="-mx-1 mt-2 flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.to} className="shrink-0">
                <Link
                  to={step.to}
                  params={{ disputeId: dispute.id }}
                  activeOptions={{ exact: step.exact }}
                  className="flex touch-target items-center gap-2 rounded-md px-3 text-sm text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  activeProps={{
                    className: "bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
                    "aria-current": "page",
                  }}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  <span className="whitespace-nowrap">{step.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <main id="main" className="min-w-0 pb-16">
        {children}
      </main>
    </div>
  );
}
