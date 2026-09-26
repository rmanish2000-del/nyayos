import { Navigate, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { GoogleSignInButton } from "@/components/mvp/google-button";
import { PreviewHeader } from "@/components/mvp/preview-header";
import { LoadingState } from "@/components/mvp/states";
import { Button } from "@/components/nyayos/button";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { REQUIRED_COPY } from "@/domain";
import { SEED_USERS } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";

const KIND_LABEL = {
  founder: "Founder user",
  normal: "Normal user",
  reviewer: "Reviewer",
  deleted: "Deleted user",
  "cross-tenant": "Cross-tenant user",
} as const;

/**
 * U01 sign-in entry (Google login foundation). Google sign-in is not connected in
 * this staging preview, so the button explains that instead of pretending to work.
 * Synthetic test accounts stand in for a real sign-in.
 */
export function LoginScreen() {
  const { status, user, signIn, language } = useMvp();
  const navigate = useNavigate();
  const [googleNotice, setGoogleNotice] = React.useState(false);
  const [refused, setRefused] = React.useState(false);
  const noticeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (googleNotice || refused) noticeRef.current?.focus();
  }, [googleNotice, refused]);

  if (status === "loading") {
    return (
      <main id="main" className="mx-auto max-w-md px-4 py-10">
        <LoadingState label="Checking whether you are signed in" />
      </main>
    );
  }
  if (user) return <Navigate to="/disputes" replace />;

  return (
    <div className="min-h-screen bg-background">
      <PreviewHeader />
      <main id="main" className="mx-auto grid max-w-md gap-6 px-4 py-8 sm:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">U01</p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">Sign in to NyayOS</h1>
          <p className="mt-2 text-sm text-muted-foreground" lang={language}>
            {REQUIRED_COPY.consent_no_ai[language]}
          </p>
        </div>

        <GoogleSignInButton
          onClick={() => {
            setRefused(false);
            setGoogleNotice(true);
          }}
        />

        <div ref={noticeRef} tabIndex={-1} className="grid gap-3 focus:outline-none">
          {googleNotice ? (
            <NotificationBanner tone="info" title="Google sign-in is not connected yet">
              This staging preview has no Google account connection. Choose one of the synthetic
              test accounts below to continue.
            </NotificationBanner>
          ) : null}
          {refused ? (
            <NotificationBanner tone="error" title="We couldn't sign you in">
              This account is not available. If you think this is a mistake, contact support.
            </NotificationBanner>
          ) : null}
        </div>

        <section aria-labelledby="personas-heading" className="grid gap-3">
          <div>
            <h2 id="personas-heading" className="text-base font-semibold text-foreground">
              Synthetic test accounts
            </h2>
            <p className="text-sm text-muted-foreground">
              Invented people and data for staging only. Nothing you do here leaves this browser
              tab.
            </p>
          </div>
          <ul className="grid gap-2">
            {SEED_USERS.map((persona) => (
              <li key={persona.id}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {KIND_LABEL[persona.kind]}
                    </p>
                    <p className="truncate font-medium text-foreground">{persona.displayName}</p>
                    <p className="text-sm text-muted-foreground">{persona.description}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="compact"
                    aria-label={`Sign in as ${persona.displayName} (${KIND_LABEL[persona.kind]})`}
                    onClick={() => {
                      setGoogleNotice(false);
                      const outcome = signIn(persona.id);
                      if (outcome.ok) void navigate({ to: "/disputes" });
                      else setRefused(true);
                    }}
                  >
                    Sign in
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
