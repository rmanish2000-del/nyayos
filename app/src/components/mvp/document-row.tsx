import { Link } from "@tanstack/react-router";
import { AlertCircle, Ban, CheckCircle2, Clock, Eye, PencilLine, Trash2 } from "lucide-react";
import * as React from "react";

import { Button, buttonVariants } from "@/components/nyayos/button";
import { CATEGORY_LABELS, type EvidenceCategory } from "@/components/nyayos/evidence-card";
import type { DocumentState, SeedDocument } from "@/mvp/fixtures";
import { formatBytes, formatDateTime, shortHash } from "@/mvp/view-model";
import { cn } from "@/lib/utils";

export const DOCUMENT_STATE_LABELS: Record<DocumentState, string> = {
  ready: "Ready to view",
  "awaiting-scan": "Waiting for safety scan",
  rejected: "Not accepted",
  unreadable: "Can't be shown",
};

const STATE_STYLE: Record<DocumentState, { classes: string; icon: typeof CheckCircle2 }> = {
  ready: {
    classes: "border-evidence-extracted bg-evidence-extracted-surface text-evidence-extracted",
    icon: CheckCircle2,
  },
  "awaiting-scan": {
    classes: "border-evidence-scanning bg-evidence-scanning-surface text-evidence-scanning",
    icon: Clock,
  },
  rejected: {
    classes: "border-evidence-rejected bg-evidence-rejected-surface text-evidence-rejected",
    icon: Ban,
  },
  unreadable: {
    classes: "border-evidence-error bg-evidence-error-surface text-evidence-error",
    icon: AlertCircle,
  },
};

export function DocumentStateBadge({ state }: { state: DocumentState }) {
  const { classes, icon: Icon } = STATE_STYLE[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        classes,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {DOCUMENT_STATE_LABELS[state]}
    </span>
  );
}

/**
 * One document in the U06 locker: label, type, state, pages, upload date, who
 * uploaded it and its hash — always visible. Actions depend on the state.
 */
export function DocumentRow({
  doc,
  onRename,
  onSetCategory,
  onRemove,
}: {
  doc: SeedDocument;
  onRename: (label: string) => void;
  onSetCategory: (category: EvidenceCategory) => void;
  onRemove: () => void;
}) {
  const [renaming, setRenaming] = React.useState(false);
  const [label, setLabel] = React.useState(doc.label);
  const [confirmRemove, setConfirmRemove] = React.useState(false);
  const selectId = `${doc.id}-category`;

  return (
    <article
      aria-labelledby={`${doc.id}-label`}
      className="grid gap-3 rounded-lg border border-border bg-card p-4"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <h3 id={`${doc.id}-label`} className="truncate font-medium text-foreground">
            {doc.label}
          </h3>
          <p className="truncate font-mono text-xs text-muted-foreground">{doc.filename}</p>
        </div>
        <DocumentStateBadge state={doc.state} />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs text-muted-foreground">Type</dt>
          <dd className="text-foreground">
            {CATEGORY_LABELS[doc.category]}
            {doc.categoryConfirmed ? "" : " (not confirmed)"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Pages</dt>
          <dd className="text-foreground">{doc.pages.length > 0 ? doc.pages.length : "—"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Uploaded</dt>
          <dd className="text-foreground">{formatDateTime(doc.uploadedAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Size</dt>
          <dd className="text-foreground">{formatBytes(doc.sizeBytes)}</dd>
        </div>
        <div className="col-span-2 sm:col-span-4">
          <dt className="text-xs text-muted-foreground">Uploaded by · SHA-256</dt>
          <dd className="text-foreground">
            {doc.uploadedBy} ·{" "}
            <span className="font-mono text-xs" title={doc.sha256}>
              {shortHash(doc.sha256)}
            </span>
          </dd>
        </div>
      </dl>

      {doc.state === "rejected" && doc.rejectionReason ? (
        <p className="text-sm text-evidence-rejected">{doc.rejectionReason}</p>
      ) : null}
      {doc.state === "awaiting-scan" ? (
        <p className="text-sm text-muted-foreground">
          Files are checked for safety before they can be opened. Scanning is not available in this
          staging preview.
        </p>
      ) : null}

      {renaming ? (
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (label.trim()) {
              onRename(label.trim());
              setRenaming(false);
            }
          }}
        >
          <div className="grid min-w-0 flex-1 gap-1">
            <label htmlFor={`${doc.id}-rename`} className="text-sm font-medium text-foreground">
              New label
            </label>
            <input
              id={`${doc.id}-rename`}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="touch-target rounded-md border border-input bg-card px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button type="submit" size="compact">
            Save label
          </Button>
          <Button variant="ghost" size="compact" onClick={() => setRenaming(false)}>
            Cancel
          </Button>
        </form>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {doc.state === "ready" ? (
          <Link
            to="/disputes/$disputeId/documents/$documentId"
            params={{ disputeId: doc.disputeId, documentId: doc.id }}
            className={buttonVariants({ variant: "secondary", size: "compact" })}
            aria-label={`View ${doc.label}`}
          >
            <Eye aria-hidden="true" className="size-4" />
            View
          </Link>
        ) : null}
        {doc.state !== "rejected" ? (
          <>
            <Button
              variant="ghost"
              size="compact"
              aria-label={`Rename ${doc.label}`}
              onClick={() => {
                setLabel(doc.label);
                setRenaming(true);
              }}
            >
              <PencilLine aria-hidden="true" className="size-4" />
              Rename
            </Button>
            <div className="flex items-center gap-1">
              <label htmlFor={selectId} className="sr-only">
                Document type for {doc.label}
              </label>
              <select
                id={selectId}
                value={doc.category}
                onChange={(e) => onSetCategory(e.target.value as EvidenceCategory)}
                className="touch-target rounded-md border border-input bg-card px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {(Object.keys(CATEGORY_LABELS) as EvidenceCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
              {!doc.categoryConfirmed ? (
                <Button variant="ghost" size="compact" onClick={() => onSetCategory(doc.category)}>
                  Confirm type
                </Button>
              ) : null}
            </div>
          </>
        ) : null}
        {confirmRemove ? (
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-foreground">Remove from this dispute?</span>
            <Button variant="danger" size="compact" onClick={onRemove}>
              Yes, remove
            </Button>
            <Button variant="ghost" size="compact" onClick={() => setConfirmRemove(false)}>
              Keep
            </Button>
          </span>
        ) : (
          <Button
            variant="ghost"
            size="compact"
            aria-label={`Remove ${doc.label}`}
            onClick={() => setConfirmRemove(true)}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            Remove
          </Button>
        )}
      </div>
    </article>
  );
}
