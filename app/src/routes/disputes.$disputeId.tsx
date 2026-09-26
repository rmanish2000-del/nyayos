import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

import { DisputeFrame } from "@/components/mvp/dispute-frame";
import { useDispute } from "@/components/mvp/use-dispute";
import { ErrorState } from "@/components/mvp/states";
import { buttonVariants } from "@/components/nyayos/button";

export const Route = createFileRoute("/disputes/$disputeId")({ component: DisputeLayout });

function DisputeLayout() {
  const dispute = useDispute();
  if (!dispute) {
    return (
      <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState
          title="This dispute isn't available"
          action={
            <Link to="/disputes" className={buttonVariants({ variant: "primary" })}>
              Back to your disputes
            </Link>
          }
        >
          It may not exist, or it belongs to another account.
        </ErrorState>
      </main>
    );
  }
  return (
    <DisputeFrame dispute={dispute}>
      <Outlet />
    </DisputeFrame>
  );
}
