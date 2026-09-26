import { createFileRoute } from "@tanstack/react-router";

import { IntakeScreen } from "@/components/mvp/screens/intake-screen";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/intake")({
  head: () => ({
    meta: [
      { title: "Intake — NyayOS" },
      { name: "description", content: "Answer a few questions one at a time." },
      { property: "og:title", content: "Intake — NyayOS" },
      { property: "og:description", content: "Answer a few questions one at a time." },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  return dispute ? <IntakeScreen dispute={dispute} /> : null;
}
