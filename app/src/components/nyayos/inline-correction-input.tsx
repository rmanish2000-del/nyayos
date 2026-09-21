import * as React from "react";

import { Button } from "@/components/nyayos/button";
import { cn } from "@/lib/utils";

export interface InlineCorrectionInputProps {
  id: string;
  label: string;
  originalValue: string;
  initialValue?: string;
  error?: string;
  disabled?: boolean;
  saving?: boolean;
  onSave?: (value: string, reason: string) => void;
  onCancel?: () => void;
}

const fieldClass =
  "w-full touch-target rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground hover:border-border-strong disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";

export function InlineCorrectionInput({
  id,
  label,
  originalValue,
  initialValue = "",
  error,
  disabled = false,
  saving = false,
  onSave,
  onCancel,
}: InlineCorrectionInputProps) {
  const [value, setValue] = React.useState(initialValue);
  const [reason, setReason] = React.useState("");
  const originalId = `${id}-original`;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave?.(value, reason);
      }}
    >
      <div>
        <p className="text-xs font-medium text-muted-foreground">Original value</p>
        <p
          id={originalId}
          className="mt-1 rounded-md bg-surface-sunken px-3 py-2 text-sm text-foreground"
        >
          {originalValue}
        </p>
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <input
          id={id}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={disabled || saving}
          aria-invalid={error ? true : undefined}
          aria-describedby={[originalId, errorId].filter(Boolean).join(" ")}
          className={cn(fieldClass, error && "border-error")}
        />
        {error ? (
          <p id={errorId} className="text-xs font-medium text-error">
            {error}
          </p>
        ) : null}
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={`${id}-reason`} className="text-sm font-medium text-foreground">
          Reason <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id={`${id}-reason`}
          rows={2}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          disabled={disabled || saving}
          className={cn(fieldClass, "min-h-20 resize-y")}
        />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" disabled={disabled || saving} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving} disabled={disabled || !value.trim()}>
          Save correction
        </Button>
      </div>
    </form>
  );
}
