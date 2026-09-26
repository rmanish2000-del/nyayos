import { createFileRoute } from "@tanstack/react-router";

import { DisputeListScreen } from "@/components/mvp/screens/dispute-list-screen";

export const Route = createFileRoute("/disputes/")({ component: DisputeListScreen });
