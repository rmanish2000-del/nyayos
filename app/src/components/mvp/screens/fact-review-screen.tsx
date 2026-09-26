import { Link } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import * as React from "react";

import { EmptyState, ScreenHeader } from "@/components/mvp/states";
import { buttonVariants } from "@/components/nyayos/button";
import { FactCard } from "@/components/nyayos/fact-card";
import { REQUIRED_COPY } from "@/domain";
import type { FactStatus, SeedDispute, SeedFact } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";
import { FACT_STATUS_TO_CHIP, factSources } from "@/mvp/view-model";

const FILTERS: { value: FactStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "To review" },
  { value: "confirmed", label: "Confirmed" },
  { value: "corrected", label: "Corrected" },
  { value: "uncertain", label: "Uncertain" },
  { value: "not_relevant", label: "Not relevant" },
];

/** U08 — every fact with its source and status; confirm, correct, uncertain, not relevant. */
export function FactReviewScreen({ dispute }: { dispute: SeedDispute }) {
  const { data, language, setFactStatus, correctFact } = useMvp();
  const facts = data.facts.filter((f) => f.disputeId === dispute.id);
  const [filter, setFilter] = React.useState<FactStatus | "all">("all");
  const [announcement, setAnnouncement] = React.useState("");
  const shown = facts.filter((f) => filter === "all" || f.status === filter);
  const toReview = facts.filter((f) => f.status === "pending").length;

  const contradictionFor = (fact: SeedFact) => {
    if (!fact.contradiction) return undefined;
    const other = data.documents.find((d) => d.id === fact.contradiction?.otherDocumentId);
    const here = factSources(fact, data.documents)[0]!;
    return {
      note: `${fact.contradiction.note} ${REQUIRED_COPY.contradiction_neutral[language]}`,
      versions: [
        { value: fact.value, source: here },
        {
          value: fact.contradiction.otherValue,
          source: {
            kind: other ? ("document-fact" as const) : ("source-unavailable" as const),
            origin: other?.label ?? "Document no longer in the locker",
          },
        },
      ],
    };
  };

  return (
    <div className="grid gap-6">
      <ScreenHeader screenId="U08 · Fact review" title="Facts">
        Where each fact came from is shown before anything else. You decide what is confirmed;
        NyayOS never decides for you.
      </ScreenHeader>

      {facts.length === 0 ? (
        <EmptyState title="No facts yet">
          Facts appear here when you record them from your account or from a document page.
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-foreground">
              <strong>{toReview}</strong> of {facts.length} still to review
            </p>
            <div role="group" aria-label="Show facts" className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={
                    filter === f.value
                      ? "touch-target rounded-md bg-primary px-3 text-sm text-primary-foreground"
                      : "touch-target rounded-md border border-border px-3 text-sm text-foreground hover:bg-accent"
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {announcement}
          </p>
          {shown.length === 0 ? (
            <EmptyState title="No facts with this status" />
          ) : (
            <ul className="grid gap-4">
              {shown.map((fact) => {
                const contradiction = contradictionFor(fact);
                return (
                  <li key={fact.id} className="grid gap-2">
                    <FactCard
                      id={fact.id}
                      label={fact.label}
                      value={fact.value}
                      status={FACT_STATUS_TO_CHIP[fact.status]}
                      sources={factSources(fact, data.documents)}
                      {...(fact.date ? { date: fact.date } : {})}
                      {...(contradiction ? { contradiction: contradiction } : {})}
                      {...(fact.previousValue ? { previousValue: fact.previousValue } : {})}
                      {...(fact.correctionReason
                        ? { correctionReason: fact.correctionReason }
                        : {})}
                      onAction={(action) => {
                        setFactStatus(fact.id, action === "not-relevant" ? "not_relevant" : action);
                        setAnnouncement(`${fact.label}: recorded as ${action.replace("-", " ")}.`);
                      }}
                      onCorrect={(value, reason) => {
                        correctFact(fact.id, value, reason);
                        setAnnouncement(`${fact.label}: correction saved.`);
                      }}
                    />
                    {fact.origin === "document_extraction" && fact.documentId ? (
                      <Link
                        to="/disputes/$disputeId/documents/$documentId"
                        params={{ disputeId: dispute.id, documentId: fact.documentId }}
                        search={{ fact: fact.id }}
                        className={
                          buttonVariants({ variant: "link", size: "compact" }) +
                          " justify-self-start"
                        }
                      >
                        <Link2 aria-hidden="true" className="size-4" />
                        {fact.page ? "Open source page" : "Mark the source page"}
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
