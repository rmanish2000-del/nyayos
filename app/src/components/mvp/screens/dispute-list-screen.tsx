import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { EmptyState, ScreenHeader } from "@/components/mvp/states";
import { buttonVariants } from "@/components/nyayos/button";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { reviewerAccessEnabled, visibleDisputes } from "@/mvp/access";
import { useMvp } from "@/mvp/store";
import { formatDateTime } from "@/mvp/view-model";

/** Entry list of the signed-in person's disputes (navigation hub for Wave 1). */
export function DisputeListScreen() {
  const { user, data } = useMvp();
  if (!user) return null;
  const disputes = visibleDisputes(user, data.disputes);
  const isReviewer = user.grantRole === "reviewer" && !reviewerAccessEnabled();

  const startLink = (
    <Link to="/disputes/new" className={buttonVariants({ variant: "primary" })}>
      <Plus aria-hidden="true" className="size-4" />
      Start a dispute
    </Link>
  );

  return (
    <main id="main" className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <ScreenHeader
        screenId="Your disputes"
        title={`Hello, ${user.displayName}`}
        actions={isReviewer ? undefined : startLink}
      >
        Each dispute keeps your account, documents, facts and timeline together.
      </ScreenHeader>

      {isReviewer ? (
        <NotificationBanner tone="info" title="Reviewer access is not enabled in this version">
          A dispute owner cannot share a file with a reviewer yet. You will see disputes here once
          sharing is available and someone shares one with you.
        </NotificationBanner>
      ) : null}

      {disputes.length === 0 ? (
        <EmptyState title="No disputes yet" action={isReviewer ? undefined : startLink}>
          {isReviewer
            ? "Nothing has been shared with you."
            : "Start by describing what happened in your own words. You can add documents afterwards."}
        </EmptyState>
      ) : (
        <ul className="grid gap-3" aria-label="Disputes">
          {disputes.map((d) => (
            <li key={d.id}>
              <Link
                to="/disputes/$disputeId"
                params={{ disputeId: d.id }}
                className="block rounded-lg border border-border bg-card p-4 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="block font-serif text-lg text-foreground">{d.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Started {formatDateTime(d.createdAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
