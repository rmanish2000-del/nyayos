import { Check, PencilLine, Trash2, UserRound } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import { SourceBadge, type SourceKind } from "@/components/nyayos/source-badge";
import { StatusChip } from "@/components/nyayos/status-chip";

export type PartyRole =
  "claimant" | "respondent" | "witness" | "authorised-representative" | "other";

export const PARTY_ROLE_LABELS: Record<PartyRole, string> = {
  claimant: "Person raising the matter",
  respondent: "Person responding",
  witness: "Witness",
  "authorised-representative": "Authorised representative",
  other: "Other",
};

export interface PartyRecord {
  id: string;
  name: string;
  role: PartyRole;
  relationship: string;
  confirmed: boolean;
  source: SourceKind;
  sourceDetail?: string;
}

export interface PartyCardProps extends PartyRecord {
  onConfirm?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

/**
 * Party Card — one person or organisation involved in the matter.
 * Name, role and relationship are shown with their provenance and
 * confirmation state. No ranking, scoring or representation matching.
 */
export function PartyCard({
  name,
  role,
  relationship,
  confirmed,
  source,
  sourceDetail,
  onConfirm,
  onEdit,
  onRemove,
}: PartyCardProps) {
  return (
    <article
      aria-label={`Party: ${name}`}
      className="rounded-lg border border-border-strong bg-card p-4 shadow-[var(--shadow-token-sm)]"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <UserRound className="size-5" />
          </span>
          <div className="min-w-0">
            <h4 className="truncate font-serif text-lg text-foreground">{name}</h4>
            <dl className="mt-1 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-foreground/70">Role</dt>
                <dd className="text-foreground">{PARTY_ROLE_LABELS[role]}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-foreground/70">Relationship</dt>
                <dd className="text-foreground">{relationship}</dd>
              </div>
            </dl>
          </div>
        </div>
        <StatusChip status={confirmed ? "confirmed" : "to-review"} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
          Where this came from
        </span>
        <SourceBadge source={source} detail={sourceDetail} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {confirmed ? null : (
          <Button size="compact" onClick={onConfirm}>
            <Check aria-hidden="true" className="size-4" />
            Confirm
          </Button>
        )}
        <Button variant="secondary" size="compact" onClick={onEdit}>
          <PencilLine aria-hidden="true" className="size-4" />
          Edit
        </Button>
        <Button variant="ghost" size="compact" onClick={onRemove}>
          <Trash2 aria-hidden="true" className="size-4" />
          Remove
        </Button>
      </div>
    </article>
  );
}
