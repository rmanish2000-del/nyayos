import { createFileRoute } from "@tanstack/react-router";

import { LoginScreen } from "@/components/mvp/screens/login-screen";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — NyayOS" },
      { name: "description", content: "Sign in to NyayOS to organise your dispute file." },
      { property: "og:title", content: "Sign in — NyayOS" },
      { property: "og:description", content: "Sign in to NyayOS to organise your dispute file." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginScreen,
});
