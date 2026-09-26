import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/nyayos/button";
import { useMvp } from "@/mvp/store";

/** Top bar for the MVP preview: brand, staging label, language switch, account. */
export function PreviewHeader({ onSignOut }: { onSignOut?: () => void }) {
  const { user, language, setLanguage, signOut } = useMvp();
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/disputes"
            className="flex min-w-0 touch-target items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-md bg-primary font-serif text-sm text-primary-foreground"
            >
              N
            </span>
            <span className="truncate font-serif text-base text-foreground">NyayOS</span>
          </Link>
          <span className="hidden truncate rounded-full border border-border-strong px-2 py-0.5 text-xs text-muted-foreground sm:inline">
            Staging preview · synthetic data
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <div role="group" aria-label="Language" className="flex rounded-md border border-border">
            {(["en", "hi"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                lang={lang}
                aria-pressed={language === lang}
                onClick={() => setLanguage(lang)}
                className={
                  language === lang
                    ? "touch-target rounded-md bg-primary px-3 text-sm text-primary-foreground"
                    : "touch-target rounded-md px-3 text-sm text-foreground hover:bg-accent"
                }
              >
                {lang === "en" ? "English" : "हिन्दी"}
              </button>
            ))}
          </div>
          {user ? (
            <>
              <span className="hidden max-w-40 truncate text-sm text-muted-foreground md:inline">
                {user.displayName}
              </span>
              <Button
                variant="ghost"
                size="compact"
                aria-label="Sign out"
                onClick={() => {
                  signOut();
                  onSignOut?.();
                }}
              >
                <LogOut aria-hidden="true" className="size-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
