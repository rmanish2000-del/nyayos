import { Outlet, createFileRoute } from "@tanstack/react-router";

import { RequireSession } from "@/components/mvp/require-session";

export const Route = createFileRoute("/disputes")({
  head: () => ({
    meta: [
      { title: "Your disputes — NyayOS" },
      {
        name: "description",
        content: "Your dispute files: account, evidence, facts and timeline.",
      },
      { property: "og:title", content: "Your disputes — NyayOS" },
      {
        property: "og:description",
        content: "Your dispute files: account, evidence, facts and timeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DisputesLayout,
});

function DisputesLayout() {
  return (
    <RequireSession>
      <Outlet />
    </RequireSession>
  );
}
