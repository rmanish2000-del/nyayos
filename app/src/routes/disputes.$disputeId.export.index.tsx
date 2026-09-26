import { createFileRoute } from "@tanstack/react-router";

import { ExportPreviewScreen } from "@/components/mvp/screens/export-screens";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/export/")({
  head: () => ({
    meta: [
      { title: "Export preview — NyayOS" },
      { name: "description", content: "Check exactly what your export will contain." },
      { property: "og:title", content: "Export preview — NyayOS" },
      { property: "og:description", content: "Check exactly what your export will contain." },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  return dispute ? <ExportPreviewScreen dispute={dispute} /> : null;
}
