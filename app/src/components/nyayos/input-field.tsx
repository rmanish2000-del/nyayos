import * as React from "react";

import { cn } from "@/lib/utils";

type FieldKind = "text" | "textarea" | "date" | "file" | "search";

export interface InputFieldProps {
  id: string;
  label: string;
  kind?: FieldKind;
  hint?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

const controlBase =
  "w-full touch-target rounded-md border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 ease-[var(--ease-standard)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

/**
 * Foundation Input. One accessible label/hint/error pattern for every field
 * kind. Error state is conveyed by text plus border, never colour alone.
 */
export function InputField({
  id,
  label,
  kind = "text",
  hint,
  error,
  disabled,
  placeholder,
  defaultValue,
  className,
}: InputFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const control = cn(
    controlBase,
    error ? "border-error" : "border-input hover:border-border-strong",
    className,
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>

      {kind === "textarea" ? (
        <textarea
          id={id}
          rows={4}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(control, "min-h-28 resize-y")}
        />
      ) : (
        <input
          id={id}
          type={kind === "text" ? "text" : kind}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(control, kind === "file" && "file:mr-3 file:text-sm")}
        />
      )}

      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
