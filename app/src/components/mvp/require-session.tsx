import { Navigate, useNavigate } from "@tanstack/react-router";
import type * as React from "react";

import { PreviewHeader } from "@/components/mvp/preview-header";
import { LoadingState } from "@/components/mvp/states";
import { useMvp } from "@/mvp/store";

/**
 * Signed-in frame for every MVP screen. Shows a loading state until the session is
 * restored, and sends signed-out visitors to the sign-in screen.
 */
export function RequireSession({ children }: { children: React.ReactNode }) {
  const { status, user } = useMvp();
  const navigate = useNavigate();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <main id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <LoadingState label="Restoring your session" />
        </main>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <PreviewHeader onSignOut={() => void navigate({ to: "/login" })} />
      {children}
    </div>
  );
}
