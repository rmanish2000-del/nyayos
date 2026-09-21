import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { AppShell, type ShellSection } from "@/components/nyayos/app-shell";
import { Button } from "@/components/nyayos/button";
import { ConfidenceBand } from "@/components/nyayos/confidence-band";
import { DateBadge } from "@/components/nyayos/date-badge";
import { InputField } from "@/components/nyayos/input-field";
import { InlineCorrectionInput } from "@/components/nyayos/inline-correction-input";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { ReadinessIndicator } from "@/components/nyayos/readiness-indicator";
import { SourceBadge } from "@/components/nyayos/source-badge";
import { StatusChip } from "@/components/nyayos/status-chip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NyayOS Foundation — Design System & Components" },
      {
        name: "description",
        content:
          "Sprint 1 foundation for NyayOS: semantic design tokens, provenance-first components, responsive navigation shell and accessibility baseline.",
      },
      { property: "og:title", content: "NyayOS Foundation — Design System & Components" },
      {
        property: "og:description",
        content:
          "Semantic design tokens, provenance-first components and a responsive navigation shell for the NyayOS Dispute Readiness Engine.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FoundationShowcase,
});

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border px-4 py-8 last:border-0 sm:px-8">
      <h2 className="font-serif text-xl text-foreground">{title}</h2>
      {subtitle ? <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-token-sm)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

const TOKEN_SWATCHES: { name: string; className: string }[] = [
  { name: "background", className: "bg-background" },
  { name: "surface-raised", className: "bg-surface-raised" },
  { name: "surface-sunken", className: "bg-surface-sunken" },
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "accent", className: "bg-accent" },
  { name: "muted", className: "bg-muted" },
  { name: "destructive", className: "bg-destructive" },
  { name: "info", className: "bg-info" },
  { name: "warning", className: "bg-warning" },
  { name: "error", className: "bg-error" },
  { name: "success", className: "bg-success" },
];

function TokensView() {
  return (
    <>
      <Section
        title="Colour roles"
        subtitle="Every colour in the product is a semantic token. Components never hold raw colour values."
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {TOKEN_SWATCHES.map((t) => (
            <li key={t.name} className="rounded-lg border border-border bg-card p-2">
              <div className={`h-12 rounded-md ring-1 ring-border ${t.className}`} />
              <p className="mt-2 font-mono text-xs text-muted-foreground">{t.name}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Typography"
        subtitle="Noto Sans for headings and body text, Noto Sans Devanagari for Hindi, Noto Sans Mono for values."
      >
        <div className="space-y-3">
          <p className="font-serif text-3xl text-foreground">What happened?</p>
          <p className="font-serif text-xl text-foreground">Section heading</p>
          <p className="text-base text-foreground">
            Body text. Tell us what happened in your own words.
          </p>
          <p className="text-sm text-muted-foreground">Supporting text and hints.</p>
          <p className="font-mono text-sm text-foreground">14 July 2026 · page 2</p>
          <div
            lang="hi"
            className="space-y-2 rounded-lg border border-border bg-card p-3"
            style={{ fontFamily: "var(--font-devanagari)" }}
          >
            <p className="text-2xl text-foreground">क्या हुआ था?</p>
            <p className="text-base text-foreground">
              अपनी बात अपने शब्दों में बताइए। तारीख़, नाम और दस्तावेज़ जोड़ सकते हैं।
            </p>
            <p className="text-sm text-muted-foreground">
              सहायक पाठ — हिन्दी और अंग्रेज़ी एक ही टाइप स्केल साझा करते हैं।
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Spacing, radius, shadow and motion"
        subtitle="Shared scales keep every screen consistent."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel label="Spacing scale">
            {[1, 2, 3, 4, 6, 8, 12].map((s) => (
              <div key={s} className="text-center">
                <div className="mx-auto bg-primary" style={{ width: s * 4, height: 16 }} />
                <p className="mt-1 font-mono text-xs text-muted-foreground">{s * 4}</p>
              </div>
            ))}
          </Panel>
          <Panel label="Radius">
            <div className="size-12 rounded-sm bg-secondary ring-1 ring-border" />
            <div className="size-12 rounded-md bg-secondary ring-1 ring-border" />
            <div className="size-12 rounded-lg bg-secondary ring-1 ring-border" />
            <div className="size-12 rounded-full bg-secondary ring-1 ring-border" />
          </Panel>
          <Panel label="Shadow">
            <div className="size-16 rounded-lg bg-card shadow-[var(--shadow-token-sm)]" />
            <div className="size-16 rounded-lg bg-card shadow-[var(--shadow-token-md)]" />
            <div className="size-16 rounded-lg bg-card shadow-[var(--shadow-token-lg)]" />
          </Panel>
          <Panel label="Motion (reduced-motion aware)">
            <div className="size-10 animate-pulse rounded-full bg-status-processing-surface ring-1 ring-border" />
            <p className="text-sm text-muted-foreground">
              120ms / 200ms / 320ms with a shared easing curve. All motion collapses when the
              operating system requests reduced motion.
            </p>
          </Panel>
        </div>
      </Section>
    </>
  );
}

function ComponentsView() {
  const [dismissed, setDismissed] = React.useState(false);
  const [correctionMessage, setCorrectionMessage] = React.useState("");

  return (
    <>
      <Section
        title="Button"
        subtitle="Five variants across default, hover, active, disabled and loading states."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {(["primary", "secondary", "ghost", "danger", "link"] as const).map((variant) => (
            <Panel key={variant} label={variant}>
              <Button variant={variant}>Default</Button>
              <Button variant={variant} disabled>
                Disabled
              </Button>
              <Button variant={variant} loading>
                Loading
              </Button>
            </Panel>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Hover and active states are applied on pointer interaction; focus is always visible on
          keyboard navigation.
        </p>
      </Section>

      <Section
        title="Input"
        subtitle="Text, long text, date, file and search — each with default, focus, error and disabled states."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="f-text"
            label="Text"
            kind="text"
            placeholder="Supplier name"
            hint="Default state."
          />
          <InputField
            id="f-textarea"
            label="Long text"
            kind="textarea"
            placeholder="Tell us what happened in your own words."
          />
          <InputField
            id="f-date"
            label="Date"
            kind="date"
            hint="Use the date you are confident about."
          />
          <InputField id="f-file" label="File" kind="file" hint="PDF, image or document." />
          <InputField id="f-search" label="Search" kind="search" placeholder="Search documents" />
          <InputField
            id="f-error"
            label="Text with error"
            kind="text"
            defaultValue="not-a-date"
            error="Enter a date in the format 14 July 2026."
          />
          <InputField
            id="f-disabled"
            label="Disabled"
            kind="text"
            disabled
            defaultValue="Locked value"
          />
        </div>
      </Section>

      <Section
        title="Status chip"
        subtitle="Confirmation state of an item. No score, ranking or likelihood language."
      >
        <Panel label="All states">
          <StatusChip status="confirmed" />
          <StatusChip status="to-review" />
          <StatusChip status="contradiction" />
          <StatusChip status="missing" />
          <StatusChip status="processing" />
          <StatusChip status="removed" />
          <StatusChip status="uncertain" />
          <StatusChip status="not-relevant" />
          <StatusChip status="corrected" />
        </Panel>
      </Section>

      <Section
        title="Source badge"
        subtitle="Provenance stays attached to information: a statement, a verified fact and an AI inference never look alike."
      >
        <Panel label="All states">
          <SourceBadge source="document-extracted" detail="Invoice · page 2" />
          <SourceBadge source="user-statement" />
          <SourceBadge source="third-party" />
          <SourceBadge source="ai-inference" />
          <SourceBadge source="verified-source" />
          <SourceBadge source="source-unavailable" />
          <SourceBadge source="user-correction" detail="Corrected by you" />
        </Panel>
      </Section>

      <Section
        title="Date badge"
        subtitle="Date precision is always visible. Inferred and approximate dates are never shown as exact."
      >
        <Panel label="All states">
          <DateBadge precision="exact" value="14 July 2026" />
          <DateBadge precision="approximate" value="Mid July 2026" />
          <DateBadge precision="inferred" value="Before 20 July 2026" />
          <DateBadge precision="conflicting" value="14 or 17 July 2026" />
          <DateBadge precision="unknown-date" />
        </Panel>
      </Section>

      <Section
        title="Confidence band"
        subtitle="Bounded extraction confidence only. It does not judge truth or predict an outcome."
      >
        <Panel label="All states">
          <ConfidenceBand band="low" />
          <ConfidenceBand band="medium" />
          <ConfidenceBand band="high" />
        </Panel>
      </Section>

      <Section
        title="Inline correction input"
        subtitle="Preserves the original value while recording a user correction and optional reason."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel label="Interactive">
            <div className="w-full">
              <InlineCorrectionInput
                id="correction-live"
                label="Corrected supplier name"
                originalValue="Asha Trading Co."
                onSave={(value) => setCorrectionMessage(`Saved correction: ${value}`)}
                onCancel={() => setCorrectionMessage("Correction cancelled")}
              />
              <p className="mt-2 min-h-5 text-xs text-muted-foreground" aria-live="polite">
                {correctionMessage}
              </p>
            </div>
          </Panel>
          <Panel label="Error">
            <div className="w-full">
              <InlineCorrectionInput
                id="correction-error"
                label="Corrected date"
                originalValue="14 July 2026"
                initialValue="32 July 2026"
                error="Enter a valid date."
              />
            </div>
          </Panel>
          <Panel label="Disabled and saving">
            <div className="grid w-full gap-5">
              <InlineCorrectionInput
                id="correction-disabled"
                label="Corrected value"
                originalValue="Original"
                initialValue="Correction unavailable"
                disabled
              />
              <InlineCorrectionInput
                id="correction-saving"
                label="Corrected value"
                originalValue="Original"
                initialValue="Saving correction"
                saving
              />
            </div>
          </Panel>
        </div>
      </Section>

      <Section
        title="Notification banner"
        subtitle="Tone is carried by text as well as colour, and announced to screen readers."
      >
        <div className="space-y-3">
          <NotificationBanner tone="info" title="Information">
            Sources are shown for every item so you can check them yourself.
          </NotificationBanner>
          <NotificationBanner tone="warning" title="Needs your attention">
            Two documents contain different information. NyayOS is not deciding which is correct.
          </NotificationBanner>
          <NotificationBanner tone="error" title="Upload failed">
            That file could not be read. Try uploading it again.
          </NotificationBanner>
          {dismissed ? null : (
            <NotificationBanner tone="success" title="Saved" onDismiss={() => setDismissed(true)}>
              Your changes were saved. This banner can be dismissed.
            </NotificationBanner>
          )}
        </div>
      </Section>

      <Section
        title="Progress indicator"
        subtitle="Readiness percentage only — how much information is assembled, never an outcome, score or ranking."
      >
        <div className="grid max-w-xl gap-6">
          <ReadinessIndicator value={0} description="Nothing assembled yet." />
          <ReadinessIndicator
            value={45}
            description="Some information is still awaiting confirmation."
          />
          <ReadinessIndicator value={100} description="All requested information is assembled." />
        </div>
      </Section>
    </>
  );
}

function NavigationView() {
  return (
    <Section
      title="Navigation shell"
      subtitle="One navigation model rendered three ways. Resize the window to see each form."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel label="Mobile — bottom tab bar">
          <p className="text-sm text-muted-foreground">
            Below 48rem the sections sit in a fixed bottom bar with icon and label, each a 44×44
            target.
          </p>
        </Panel>
        <Panel label="Tablet — left rail">
          <p className="text-sm text-muted-foreground">
            From 48rem a left rail appears and can be collapsed to icons only; collapsed items keep
            accessible names and tooltips.
          </p>
        </Panel>
        <Panel label="Desktop — sidebar">
          <p className="text-sm text-muted-foreground">
            From 64rem the rail widens into a sidebar with the same collapse control and the same
            current-section state.
          </p>
        </Panel>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        The current section is marked with <code className="font-mono">aria-current</code> and a
        visible background. Use the collapse control at the bottom of the rail or sidebar.
      </p>
    </Section>
  );
}

const CHECKS: { item: string; result: string }[] = [
  { item: "Semantic colour tokens only, no hardcoded colours in components", result: "Pass" },
  { item: "Interactive targets at least 44×44", result: "Pass" },
  { item: "Visible focus indicator on every interactive element", result: "Pass" },
  { item: "Keyboard operable: tab order, Enter and Space activation", result: "Pass" },
  { item: "Skip-to-content link as first focusable element", result: "Pass" },
  { item: "Status, source and date meaning conveyed by text as well as colour", result: "Pass" },
  { item: "Form fields have labels, hints and errors linked programmatically", result: "Pass" },
  { item: "Live regions announce banner messages", result: "Pass" },
  { item: "Reduced-motion preference honoured globally", result: "Pass" },
  { item: "Formal contrast audit with an automated tool", result: "Not yet run" },
  { item: "Screen-reader pass with NVDA / VoiceOver", result: "Not yet run" },
];

function AccessibilityView() {
  return (
    <>
      <Section
        title="Accessibility baseline"
        subtitle="Target: WCAG 2.2 AA. Checklist state for this foundation."
      >
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Accessibility checklist results</caption>
            <thead className="bg-surface-sunken text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Check
                </th>
                <th scope="col" className="px-4 py-2.5 font-semibold">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              {CHECKS.map((c) => (
                <tr key={c.item} className="border-t border-border">
                  <td className="px-4 py-2.5 text-foreground">{c.item}</td>
                  <td className="px-4 py-2.5">
                    {c.result === "Pass" ? (
                      <StatusChip status="confirmed" label="Pass" />
                    ) : (
                      <StatusChip status="to-review" label={c.result} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Known limitations" subtitle="Recorded for handoff.">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            No approved design-token source existed in the repository; tokens were derived from the
            design brief language and must be reviewed against the Figma output.
          </li>
          <li>
            Dark theme values are provided but the product does not yet expose a theme switch.
          </li>
          <li>
            Contrast and screen-reader verification are manual so far; no automated audit run.
          </li>
          <li>
            This is a foundation only — no intake, evidence, fact confirmation or analysis screens,
            and no backend, database or AI integration.
          </li>
        </ul>
      </Section>
    </>
  );
}

function FoundationShowcase() {
  const [section, setSection] = React.useState<ShellSection>("tokens");

  return (
    <AppShell current={section} onNavigate={setSection}>
      <header className="border-b border-border bg-surface-raised px-4 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Staging · Sprint 1 foundation
        </p>
        <h1 className="mt-1 font-serif text-2xl text-foreground sm:text-3xl">
          NyayOS foundation library
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Design tokens, provenance-first components and the responsive navigation shell that every
          later screen will be built from. No product workflow is included.
        </p>
      </header>

      {section === "tokens" ? <TokensView /> : null}
      {section === "components" ? <ComponentsView /> : null}
      {section === "navigation" ? <NavigationView /> : null}
      {section === "accessibility" ? <AccessibilityView /> : null}
    </AppShell>
  );
}
