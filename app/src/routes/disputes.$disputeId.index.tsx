import { createFileRoute } from "@tanstack/react-router";

import { WhatHappenedSummary } from "@/components/mvp/screens/what-happened-screen";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/")({
  head: () => ({
    meta: [
      { title: "What happened — NyayOS" },
      { name: "description", content: "Your own account of the dispute, kept exactly as written." },
      { property: "og:title", content: "What happened — NyayOS" },
      {
        property: "og:description",
        content: "Your own account of the dispute, kept exactly as written.",
      },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  return dispute ? <WhatHappenedSummary dispute={dispute} /> : null;
}
