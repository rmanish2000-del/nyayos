import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Foundation Button. Variants and states only — no domain behaviour.
 * All colors come from semantic tokens. Minimum target size is 44x44.
 */
const buttonVariants = cva(
  "relative inline-flex touch-target items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-200 ease-[var(--ease-standard)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary:
          "border border-border-strong bg-card text-foreground hover:bg-accent active:bg-accent/80",
        ghost: "text-foreground hover:bg-accent active:bg-accent/80",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        link: "text-primary underline underline-offset-4 hover:no-underline active:opacity-80",
      },
      size: {
        default: "px-4 py-2.5",
        compact: "px-3 py-2 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingLabel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, loading = false, loadingLabel = "Working", children, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={props.type ?? "button"}
      aria-busy={loading || undefined}
      disabled={props.disabled ?? loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          <span className="sr-only">{loadingLabel}</span>
        </>
      ) : null}
      <span className={cn(loading && "opacity-70")}>{children}</span>
    </button>
  ),
);
Button.displayName = "Button";

export { buttonVariants };
