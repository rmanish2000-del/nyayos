import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { DocumentViewerScreen } from "@/components/mvp/screens/document-viewer-screen";
import { useDispute } from "@/components/mvp/use-dispute";

export const Route = createFileRoute("/disputes/$disputeId/documents/$documentId")({
  validateSearch: z.object({ fact: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Document viewer — NyayOS" },
      {
        name: "description",
        content: "Read a document page by page and mark where a fact comes from.",
      },
      { property: "og:title", content: "Document viewer — NyayOS" },
      {
        property: "og:description",
        content: "Read a document page by page and mark where a fact comes from.",
      },
    ],
  }),
  component: Screen,
});

function Screen() {
  const dispute = useDispute();
  const { documentId } = Route.useParams();
  const { fact } = Route.useSearch();
  return dispute ? (
    <DocumentViewerScreen
      key={documentId}
      dispute={dispute}
      documentId={documentId}
      initialFactId={fact}
    />
  ) : null;
}
