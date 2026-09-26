import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Link2 } from "lucide-react";
import * as React from "react";

import { DocumentStateBadge } from "@/components/mvp/document-row";
import { ErrorState, ScreenHeader } from "@/components/mvp/states";
import { Button, buttonVariants } from "@/components/nyayos/button";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { REQUIRED_COPY } from "@/domain";
import type { SeedDispute } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";
import { shortHash } from "@/mvp/view-model";

/**
 * U07 — read a stored document page by page and mark the page a fact comes from
 * (manual fact linking, F10). The original is shown read-only and never changed.
 */
export function DocumentViewerScreen({
  dispute,
  documentId,
  initialFactId,
}: {
  dispute: SeedDispute;
  documentId: string;
  initialFactId?: string | undefined;
}) {
  const { data, language, linkFactPage } = useMvp();
  const doc = data.documents.find((d) => d.id === documentId && d.disputeId === dispute.id);
  const facts = data.facts.filter((f) => f.disputeId === dispute.id && f.status !== "not_relevant");
  const [page, setPage] = React.useState(1);
  const [factId, setFactId] = React.useState(initialFactId ?? "");
  const [linkMode, setLinkMode] = React.useState(Boolean(initialFactId));
  const [linked, setLinked] = React.useState<string | null>(null);

  const back = (
    <Link
      to="/disputes/$disputeId/evidence"
      params={{ disputeId: dispute.id }}
      className={buttonVariants({ variant: "secondary", size: "compact" })}
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Back to locker
    </Link>
  );

  if (!doc) {
    return (
      <ErrorState title="This document isn't available" action={back}>
        It may have been removed from this dispute.
      </ErrorState>
    );
  }

  if (doc.state !== "ready" || doc.pages.length === 0) {
    return (
      <div className="grid gap-6">
        <ScreenHeader screenId="U07 · Document viewer" title={doc.label} />
        <ErrorState title="This document can't be shown" action={back}>
          {doc.state === "awaiting-scan"
            ? "It is waiting for a safety scan and cannot be opened yet."
            : "The file could not be read. The original is kept unchanged; you can add a clearer copy."}
        </ErrorState>
      </div>
    );
  }

  const total = doc.pages.length;
  const text = doc.pages[page - 1] ?? "";
  const selectedFact = facts.find((f) => f.id === factId);

  return (
    <div className="grid gap-6">
      <ScreenHeader screenId="U07 · Document viewer" title={doc.label} actions={back}>
        <span className="font-mono text-xs">{doc.filename}</span> ·{" "}
        <span className="font-mono text-xs" title={doc.sha256}>
          SHA-256 {shortHash(doc.sha256)}
        </span>
      </ScreenHeader>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-labelledby="viewer-page-heading" className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2
              id="viewer-page-heading"
              className="text-base font-semibold text-foreground"
              aria-live="polite"
            >
              Page {page} of {total}
            </h2>
            <DocumentStateBadge state={doc.state} />
          </div>
          <div
            className="min-h-72 whitespace-pre-wrap rounded-lg border border-border-strong bg-card p-5 font-mono text-sm leading-relaxed text-foreground shadow-[var(--shadow-token-sm)]"
            tabIndex={0}
            aria-label={`Page ${page} text, read-only`}
          >
            {text}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="compact"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Previous page
            </Button>
            <Button
              variant="secondary"
              size="compact"
              disabled={page >= total}
              onClick={() => setPage((p) => Math.min(total, p + 1))}
            >
              Next page
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </section>

        <aside
          aria-labelledby="link-heading"
          className="grid content-start gap-3 rounded-lg border border-border bg-card p-4"
        >
          <h2 id="link-heading" className="text-base font-semibold text-foreground">
            Link a fact to this page
          </h2>
          {!linkMode ? (
            <Button variant="secondary" size="compact" onClick={() => setLinkMode(true)}>
              <Link2 aria-hidden="true" className="size-4" />
              Start linking
            </Button>
          ) : facts.length === 0 ? (
            <p className="text-sm text-muted-foreground">There are no facts to link yet.</p>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedFact) return;
                linkFactPage(selectedFact.id, doc.id, page);
                setLinked(`“${selectedFact.label}” now points to page ${page} of ${doc.label}.`);
              }}
            >
              <label htmlFor="link-fact" className="text-sm font-medium text-foreground">
                Fact
              </label>
              <select
                id="link-fact"
                value={factId}
                onChange={(e) => {
                  setFactId(e.target.value);
                  setLinked(null);
                }}
                className="touch-target rounded-md border border-input bg-card px-2 text-sm text-foreground"
              >
                <option value="">Choose a fact</option>
                {facts.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <Button type="submit" size="compact" disabled={!selectedFact}>
                <span lang={language}>{REQUIRED_COPY.mark_source_page[language]}</span>
              </Button>
              <p className="text-xs text-muted-foreground">Marks page {page} as the source.</p>
            </form>
          )}
          {linked ? (
            <NotificationBanner tone="success" title="Source page marked">
              {linked}
            </NotificationBanner>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
