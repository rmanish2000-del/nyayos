import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Controlled text field for the MVP screens. Label always visible; hint and error
 * are linked with aria-describedby; error is shown with text and border, not colour alone.
 */
export function TextField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  hint,
  error,
  required = false,
  disabled = false,
  lang,
  rows = 5,
  inputRef,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
  error?: string | undefined;
  required?: boolean;
  disabled?: boolean;
  lang?: string;
  rows?: number;
  inputRef?: React.Ref<HTMLInputElement & HTMLTextAreaElement>;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const className = cn(
    "w-full rounded-md border bg-card px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60",
    error ? "border-error" : "border-input hover:border-border-strong",
  );
  const common = {
    id,
    value,
    disabled,
    required,
    lang,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className,
    ref: inputRef,
  } as const;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-muted-foreground"> (required)</span> : null}
      </label>
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {multiline ? (
        <textarea
          {...common}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className={cn(className, "min-h-32 resize-y")}
        />
      ) : (
        <input {...common} type="text" onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? (
        <p id={errorId} className="text-sm font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
