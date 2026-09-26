import { createFileRoute } from "@tanstack/react-router";

import { FactReviewScreen } from "@/components/mvp/screens/fact-review-screen";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/facts")({
  head: () => ({
    meta: [
      { title: "Facts — NyayOS" },
      { name: "description", content: "Review each fact and where it came from." },
      { property: "og:title", content: "Facts — NyayOS" },
      { property: "og:description", content: "Review each fact and where it came from." },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  return dispute ? <FactReviewScreen dispute={dispute} /> : null;
}
