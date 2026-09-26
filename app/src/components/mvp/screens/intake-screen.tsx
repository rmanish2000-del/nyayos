import { Link } from "@tanstack/react-router";
import { ChevronDown, CircleHelp } from "lucide-react";
import * as React from "react";

import { EmptyState, ScreenHeader } from "@/components/mvp/states";
import { TextField } from "@/components/mvp/text-field";
import { Button, buttonVariants } from "@/components/nyayos/button";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { DONT_KNOW, REQUIRED_COPY, nextQuestion } from "@/domain";
import { INTAKE_QUESTIONS, type SeedDispute } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";

/**
 * U05 — deterministic intake, one question at a time, with "why we ask",
 * "I don't know", back, and save-and-exit (F12). No model is involved.
 */
export function IntakeScreen({ dispute }: { dispute: SeedDispute }) {
  const { data, language, saveIntakeAnswer } = useMvp();
  const answers = data.intakeAnswers[dispute.id] ?? {};
  const answerMap = new Map(Object.entries(answers));
  const current = nextQuestion(INTAKE_QUESTIONS, answerMap);
  const answeredKeys = INTAKE_QUESTIONS.filter((q) => answers[q.key] !== undefined).map(
    (q) => q.key,
  );

  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [whyOpen, setWhyOpen] = React.useState(false);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  const question = editingKey
    ? (INTAKE_QUESTIONS.find((q) => q.key === editingKey) ?? current)
    : current;

  React.useEffect(() => {
    setWhyOpen(false);
    setError(undefined);
    const existing = question ? answers[question.key] : undefined;
    setDraft(existing && existing !== DONT_KNOW ? existing : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.key]);

  const record = (value: string) => {
    if (!question) return;
    saveIntakeAnswer(dispute.id, question.key, value);
    setEditingKey(null);
    headingRef.current?.focus();
  };

  const position = question ? INTAKE_QUESTIONS.findIndex((q) => q.key === question.key) + 1 : 0;

  return (
    <div className="grid gap-6">
      <ScreenHeader screenId="U05 · Intake" title="A few questions">
        One question at a time. Skip anything with “{REQUIRED_COPY.intake_dont_know[language]}”.
        Answers are saved as you go.
      </ScreenHeader>

      {question ? (
        <section
          aria-labelledby="intake-question"
          className="grid gap-4 rounded-lg border border-border bg-card p-4 sm:p-6"
        >
          <p className="text-sm text-muted-foreground">
            Question {position} of up to {INTAKE_QUESTIONS.length}
          </p>
          <h2
            id="intake-question"
            ref={headingRef}
            tabIndex={-1}
            lang={language}
            className="font-serif text-xl text-foreground focus:outline-none"
          >
            {language === "hi" ? question.textHi : question.textEn}
          </h2>

          <div>
            <Button
              variant="ghost"
              size="compact"
              aria-expanded={whyOpen}
              aria-controls="intake-why"
              onClick={() => setWhyOpen((o) => !o)}
            >
              <CircleHelp aria-hidden="true" className="size-4" />
              {REQUIRED_COPY.intake_why_we_ask[language]}
              <ChevronDown
                aria-hidden="true"
                className={whyOpen ? "size-4 rotate-180" : "size-4"}
              />
            </Button>
            <p
              id="intake-why"
              hidden={!whyOpen}
              className="mt-2 rounded-md bg-surface-sunken p-3 text-sm text-foreground"
              lang={language}
            >
              {language === "hi" ? question.whyWeAskHi : question.whyWeAskEn}
            </p>
          </div>

          <form
            noValidate
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim().length === 0) {
                setError(
                  `Type an answer, or choose “${REQUIRED_COPY.intake_dont_know[language]}”.`,
                );
                return;
              }
              record(draft.trim());
            }}
          >
            <TextField
              id="intake-answer"
              label="Your answer"
              value={draft}
              onChange={(v) => {
                setDraft(v);
                if (error) setError(undefined);
              }}
              error={error}
              multiline
              rows={3}
              lang={language}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Save answer</Button>
              <Button variant="secondary" onClick={() => record(DONT_KNOW)}>
                <span lang={language}>{REQUIRED_COPY.intake_dont_know[language]}</span>
              </Button>
              {editingKey ? (
                <Button variant="ghost" onClick={() => setEditingKey(null)}>
                  Cancel change
                </Button>
              ) : null}
              <Link
                to="/disputes/$disputeId"
                params={{ disputeId: dispute.id }}
                className={buttonVariants({ variant: "ghost" })}
              >
                Save and exit
              </Link>
            </div>
          </form>
        </section>
      ) : (
        <NotificationBanner tone="success" title="Intake complete">
          You have answered every question. You can change any answer below, or move on to your
          evidence.
        </NotificationBanner>
      )}

      <section aria-labelledby="intake-answers-heading" className="grid gap-3">
        <h2 id="intake-answers-heading" className="text-base font-semibold text-foreground">
          Your answers so far
        </h2>
        {answeredKeys.length === 0 ? (
          <EmptyState title="No answers yet">Your answers will appear here as you go.</EmptyState>
        ) : (
          <ol className="grid gap-2">
            {answeredKeys.map((key) => {
              const q = INTAKE_QUESTIONS.find((item) => item.key === key)!;
              const answer = answers[key]!;
              return (
                <li
                  key={key}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-md border border-border bg-card p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground" lang={language}>
                      {language === "hi" ? q.textHi : q.textEn}
                    </p>
                    <p className="mt-1 text-foreground">
                      {answer === DONT_KNOW ? (
                        <span className="italic" lang={language}>
                          {REQUIRED_COPY.intake_dont_know[language]}
                        </span>
                      ) : (
                        answer
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="compact"
                    aria-label={`Change answer: ${q.textEn}`}
                    onClick={() => setEditingKey(key)}
                  >
                    Change
                  </Button>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {!question ? (
        <Link
          to="/disputes/$disputeId/evidence"
          params={{ disputeId: dispute.id }}
          className={buttonVariants({ variant: "primary" }) + " justify-self-start"}
        >
          Continue to evidence
        </Link>
      ) : null}
    </div>
  );
}
