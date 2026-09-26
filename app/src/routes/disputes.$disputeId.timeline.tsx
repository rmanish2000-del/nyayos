import { createFileRoute } from "@tanstack/react-router";

import { TimelineScreen } from "@/components/mvp/screens/timeline-screen";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline — NyayOS" },
      { name: "description", content: "Events in order with how sure each date is." },
      { property: "og:title", content: "Timeline — NyayOS" },
      { property: "og:description", content: "Events in order with how sure each date is." },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  return dispute ? <TimelineScreen dispute={dispute} /> : null;
}
