import { AlertCircle, Inbox } from "lucide-react";
import type * as React from "react";

import { cn } from "@/lib/utils";

/** Loading placeholder. Announced once to screen readers; shapes are decorative. */
export function LoadingState({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn("grid gap-3", className)}>
      <span className="sr-only">{label}</span>
      <div
        aria-hidden="true"
        className="h-6 w-1/3 animate-pulse rounded-md bg-muted motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="h-24 animate-pulse rounded-lg bg-muted motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="h-24 animate-pulse rounded-lg bg-muted motion-reduce:animate-none"
      />
    </div>
  );
}

export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        "grid justify-items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface-sunken px-6 py-10 text-center",
        className,
      )}
    >
      <Inbox aria-hidden="true" className="size-8 text-muted-foreground" />
      <h2 className="font-serif text-lg text-foreground">{title}</h2>
      {children ? (
        <div className="max-w-prose text-sm text-muted-foreground">{children}</div>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </section>
  );
}

export function ErrorState({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      role="alert"
      className={cn(
        "grid justify-items-center gap-3 rounded-lg border border-error/40 bg-error-surface px-6 py-10 text-center",
        className,
      )}
    >
      <AlertCircle aria-hidden="true" className="size-8 text-error" />
      <h2 className="font-serif text-lg text-foreground">{title}</h2>
      {children ? <div className="max-w-prose text-sm text-foreground">{children}</div> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </section>
  );
}

/** Page heading block used by every MVP screen. */
export function ScreenHeader({
  screenId,
  title,
  children,
  actions,
}: {
  screenId: string;
  title: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {screenId}
        </p>
        <h1 className="mt-1 font-serif text-2xl text-foreground sm:text-3xl">{title}</h1>
        {children ? (
          <div className="mt-2 max-w-prose text-sm text-muted-foreground">{children}</div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
