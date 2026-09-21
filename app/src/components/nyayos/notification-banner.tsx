import { AlertTriangle, CheckCircle2, Info, XCircle, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type BannerTone = "info" | "warning" | "error" | "success";

const TONE: Record<
  BannerTone,
  { classes: string; icon: React.ComponentType<{ className?: string }>; role: "status" | "alert" }
> = {
  info: { classes: "bg-info-surface text-info border-info/30", icon: Info, role: "status" },
  warning: {
    classes: "bg-warning-surface text-warning border-warning/30",
    icon: AlertTriangle,
    role: "status",
  },
  error: { classes: "bg-error-surface text-error border-error/30", icon: XCircle, role: "alert" },
  success: {
    classes: "bg-success-surface text-success border-success/30",
    icon: CheckCircle2,
    role: "status",
  },
};

/**
 * Notification Banner. Tone is announced in text as well as colour.
 */
export function NotificationBanner({
  tone,
  title,
  children,
  onDismiss,
  className,
}: {
  tone: BannerTone;
  title: string;
  children?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const config = TONE[tone];
  const Icon = config.icon;

  return (
    <div
      role={config.role}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={cn("flex gap-3 rounded-lg border p-3.5", config.classes, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">
          <span className="sr-only">{tone}: </span>
          {title}
        </p>
        {children ? <div className="mt-1 text-sm text-foreground/80">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={`Dismiss ${tone} message`}
          className="-my-1.5 -mr-1.5 inline-flex touch-target items-center justify-center rounded-md hover:bg-foreground/5"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
