import { createFileRoute } from "@tanstack/react-router";

import { EvidenceLockerScreen } from "@/components/mvp/screens/evidence-locker-screen";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence locker — NyayOS" },
      {
        name: "description",
        content: "Documents for this dispute with fingerprints and upload details.",
      },
      { property: "og:title", content: "Evidence locker — NyayOS" },
      {
        property: "og:description",
        content: "Documents for this dispute with fingerprints and upload details.",
      },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  return dispute ? <EvidenceLockerScreen dispute={dispute} /> : null;
}
