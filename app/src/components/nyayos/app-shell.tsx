import {
  Accessibility,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  Navigation,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ShellSection = "tokens" | "components" | "navigation" | "accessibility";

const NAV: {
  id: ShellSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "tokens", label: "Tokens", icon: Palette },
  { id: "components", label: "Components", icon: LayoutGrid },
  { id: "navigation", label: "Navigation", icon: Navigation },
  { id: "accessibility", label: "Access", icon: Accessibility },
];

/**
 * Responsive navigation shell: one navigation model rendered three ways.
 *  - mobile  (< md): bottom tab bar
 *  - tablet  (md):   left rail, collapsed or expanded
 *  - desktop (lg+):  sidebar, collapsed or expanded
 *
 * The shell holds no product workflow — it frames the foundation showcase only.
 */
export function AppShell({
  current,
  onNavigate,
  children,
}: {
  current: ShellSection;
  onNavigate: (section: ShellSection) => void;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = React.useState(true);

  const navButton = (
    item: (typeof NAV)[number],
    opts: { showLabel: boolean; layout: "vertical" | "horizontal" },
  ) => {
    const Icon = item.icon;
    const active = current === item.id;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onNavigate(item.id)}
        aria-current={active ? "page" : undefined}
        aria-label={opts.showLabel ? undefined : item.label}
        title={opts.showLabel ? undefined : item.label}
        className={cn(
          "flex touch-target items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors duration-[var(--animate-duration-fast)] ease-[var(--ease-standard)]",
          opts.layout === "vertical" && "w-full py-2.5",
          opts.layout === "horizontal" && "flex-1 flex-col justify-center gap-1 py-1.5 text-xs",
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <Icon aria-hidden="true" className="size-5 shrink-0" />
        {opts.showLabel ? <span className="truncate">{item.label}</span> : null}
        {active ? <span className="sr-only"> (current)</span> : null}
      </button>
    );
  };

  const collapseToggle = (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      aria-expanded={expanded}
      aria-label={expanded ? "Collapse navigation" : "Expand navigation"}
      title={expanded ? "Collapse navigation" : "Expand navigation"}
      className="flex touch-target w-full items-center justify-center rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
    >
      {expanded ? (
        <PanelLeftClose aria-hidden="true" className="size-5" />
      ) : (
        <PanelLeftOpen aria-hidden="true" className="size-5" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>

      <div className="flex min-h-screen">
        {/* Tablet rail + desktop sidebar */}
        <nav
          aria-label="Foundation sections"
          className={cn(
            "hidden shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-2 md:flex",
            expanded ? "md:w-48 lg:w-60" : "md:w-16",
          )}
        >
          <div className="flex items-center gap-2 px-1 py-2">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-md bg-primary font-serif text-sm text-primary-foreground"
            >
              N
            </span>
            {expanded ? (
              <span className="truncate font-serif text-sm text-sidebar-foreground">NyayOS</span>
            ) : null}
          </div>

          {NAV.map((item) => navButton(item, { showLabel: expanded, layout: "vertical" }))}

          <div className="mt-auto">{collapseToggle}</div>
        </nav>

        <main id="main" className="min-w-0 flex-1 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Foundation sections"
        className="fixed inset-x-0 bottom-0 z-40 flex gap-1 border-t border-sidebar-border bg-sidebar px-2 pb-[env(safe-area-inset-bottom)] pt-1 md:hidden"
      >
        {NAV.map((item) => navButton(item, { showLabel: true, layout: "horizontal" }))}
      </nav>
    </div>
  );
}
