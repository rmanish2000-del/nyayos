import { createFileRoute } from "@tanstack/react-router";

import { NewDisputeScreen } from "@/components/mvp/screens/what-happened-screen";

export const Route = createFileRoute("/disputes/new")({
  head: () => ({
    meta: [
      { title: "What happened? — NyayOS" },
      {
        name: "description",
        content: "Start a dispute by describing what happened in your own words.",
      },
      { property: "og:title", content: "What happened? — NyayOS" },
      {
        property: "og:description",
        content: "Start a dispute by describing what happened in your own words.",
      },
    ],
  }),
  component: NewDisputeScreen,
});
