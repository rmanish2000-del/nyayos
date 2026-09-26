import { createFileRoute } from "@tanstack/react-router";

import { ExportResultScreen } from "@/components/mvp/screens/export-screens";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/export/result")({
  head: () => ({
    meta: [
      { title: "Export result — NyayOS" },
      { name: "description", content: "Your export manifest and integrity statement." },
      { property: "og:title", content: "Export result — NyayOS" },
      { property: "og:description", content: "Your export manifest and integrity statement." },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  return dispute ? <ExportResultScreen dispute={dispute} /> : null;
}
