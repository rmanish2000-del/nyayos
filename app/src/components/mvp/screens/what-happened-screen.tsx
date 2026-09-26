import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import * as React from "react";

import { ScreenHeader } from "@/components/mvp/states";
import { TextField } from "@/components/mvp/text-field";
import { Button, buttonVariants } from "@/components/nyayos/button";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { SourceBadge } from "@/components/nyayos/source-badge";
import { REQUIRED_COPY } from "@/domain";
import type { SeedDispute } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";
import { formatDateTime } from "@/mvp/view-model";

const MIN_STATEMENT = 20;

/** U04 — create a dispute and store the person's own account verbatim (F11). */
export function NewDisputeScreen() {
  const { language, createDispute } = useMvp();
  const navigate = useNavigate();
  const [title, setTitle] = React.useState("");
  const [statement, setStatement] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const titleRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const titleError =
    submitted && title.trim().length === 0 ? "Give the dispute a short name." : undefined;
  const statementError =
    submitted && statement.trim().length < MIN_STATEMENT
      ? `Write at least ${MIN_STATEMENT} characters so you can recognise this later.`
      : undefined;

  return (
    <main id="main" className="mx-auto grid max-w-3xl gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <ScreenHeader
        screenId="U04 · New dispute"
        title={REQUIRED_COPY.what_happened_headline[language]}
      >
        <span lang={language}>{REQUIRED_COPY.what_happened_help[language]}</span>
      </ScreenHeader>

      {submitted && (titleError || statementError) ? (
        <NotificationBanner tone="error" title="Two things to finish before saving">
          Fix the fields marked below. Nothing has been saved yet.
        </NotificationBanner>
      ) : null}

      <form
        noValidate
        className="grid gap-5 rounded-lg border border-border bg-card p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          if (title.trim().length === 0 || statement.trim().length < MIN_STATEMENT) {
            titleRef.current?.focus();
            return;
          }
          const id = createDispute(title.trim(), statement);
          void navigate({ to: "/disputes/$disputeId/intake", params: { disputeId: id } });
        }}
      >
        <TextField
          id="dispute-title"
          label="Name this dispute"
          hint="Only you see this. For example: Deposit not returned."
          value={title}
          onChange={setTitle}
          error={titleError}
          required
          inputRef={titleRef}
        />
        <TextField
          id="dispute-statement"
          label="Your account, in your own words"
          hint="It is saved exactly as you write it. You can add more later."
          value={statement}
          onChange={setStatement}
          error={statementError}
          multiline
          rows={8}
          required
          lang={language}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save and continue</Button>
          <Link to="/disputes" className={buttonVariants({ variant: "secondary" })}>
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}

/** U04 read view for an existing dispute: the stored account, unchanged. */
export function WhatHappenedSummary({ dispute }: { dispute: SeedDispute }) {
  const { language } = useMvp();
  return (
    <div className="grid gap-6">
      <ScreenHeader
        screenId="U04 · What happened"
        title={REQUIRED_COPY.what_happened_headline[language]}
      >
        Your own account is kept exactly as you wrote it.
      </ScreenHeader>
      <article className="rounded-lg border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge
            source="user-statement"
            detail={`saved ${formatDateTime(dispute.createdAt)}`}
          />
        </div>
        <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground">
          {dispute.statement}
        </p>
      </article>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/disputes/$disputeId/intake"
          params={{ disputeId: dispute.id }}
          className={buttonVariants({ variant: "primary" })}
        >
          Continue to intake
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <Link
          to="/disputes/$disputeId/evidence"
          params={{ disputeId: dispute.id }}
          className={buttonVariants({ variant: "secondary" })}
        >
          Open evidence locker
        </Link>
      </div>
    </div>
  );
}
