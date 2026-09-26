import { Link, useNavigate } from "@tanstack/react-router";
import { Download, FileOutput } from "lucide-react";
import * as React from "react";

import { EmptyState, ScreenHeader } from "@/components/mvp/states";
import { Button, buttonVariants } from "@/components/nyayos/button";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { StaleOutputNotice } from "@/components/nyayos/stale-output-notice";
import {
  INTEGRITY_SCOPE_STATEMENT_EN,
  INTEGRITY_SCOPE_STATEMENT_HI,
  REQUIRED_COPY,
} from "@/domain";
import { assessExport, generateExport, manifestJsonFor, previewExport } from "@/mvp/export";
import type { SeedDispute } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";
import { formatBytes, formatDateTime, shortHash } from "@/mvp/view-model";

const SECTION_LABELS = [
  "Your account of what happened",
  "Timeline",
  "Evidence index with document fingerprints",
  "Facts and their sources",
  "Corrections you made",
  "Integrity manifest",
  "Notices",
];

/** U16 — show exactly what the export will contain before it is generated. */
export function ExportPreviewScreen({ dispute }: { dispute: SeedDispute }) {
  const { data, user, recordExport } = useMvp();
  const navigate = useNavigate();
  const preview = previewExport(data, dispute);
  const [checked, setChecked] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const nothingToExport = preview.includedDocs.length === 0 && preview.includedFacts.length === 0;

  return (
    <div className="grid gap-6">
      <ScreenHeader screenId="U16 · Export preview" title="Check your export">
        This is everything the export will contain. Nothing is shared with anyone when you generate
        it.
      </ScreenHeader>

      {nothingToExport ? (
        <EmptyState
          title="Nothing to export yet"
          action={
            <Link
              to="/disputes/$disputeId/evidence"
              params={{ disputeId: dispute.id }}
              className={buttonVariants({ variant: "primary" })}
            >
              Add documents
            </Link>
          }
        >
          Add a document that is ready to view, or record a fact, first.
        </EmptyState>
      ) : (
        <>
          <section
            aria-labelledby="sections-heading"
            className="rounded-lg border border-border bg-card p-4 sm:p-6"
          >
            <h2 id="sections-heading" className="text-base font-semibold text-foreground">
              Sections
            </h2>
            <ul className="mt-2 grid list-disc gap-1 pl-5 text-sm text-foreground sm:grid-cols-2">
              {SECTION_LABELS.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section
              aria-labelledby="docs-heading"
              className="rounded-lg border border-border bg-card p-4"
            >
              <h2 id="docs-heading" className="text-base font-semibold text-foreground">
                Documents included ({preview.includedDocs.length})
              </h2>
              <ul className="mt-2 grid gap-1 text-sm text-foreground">
                {preview.includedDocs.map((d) => (
                  <li key={d.id}>
                    {d.label}{" "}
                    <span className="text-muted-foreground">· {formatBytes(d.sizeBytes)}</span>
                  </li>
                ))}
              </ul>
              {preview.excludedDocs.length > 0 ? (
                <>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    Not included ({preview.excludedDocs.length})
                  </h3>
                  <ul className="mt-1 grid gap-1 text-sm text-muted-foreground">
                    {preview.excludedDocs.map((d) => (
                      <li key={d.id}>{d.label} — not ready to view</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>

            <section
              aria-labelledby="facts-heading"
              className="rounded-lg border border-border bg-card p-4"
            >
              <h2 id="facts-heading" className="text-base font-semibold text-foreground">
                Facts included ({preview.includedFacts.length})
              </h2>
              <ul className="mt-2 grid gap-1 text-sm text-foreground">
                {preview.includedFacts.map((f) => (
                  <li key={f.id}>{f.label}</li>
                ))}
              </ul>
              {preview.omittedFacts.length > 0 ? (
                <>
                  <h3 className="mt-3 text-sm font-semibold text-foreground">
                    Left out — source not complete ({preview.omittedFacts.length})
                  </h3>
                  <ul className="mt-1 grid gap-1 text-sm text-muted-foreground">
                    {preview.omittedFacts.map((f) => (
                      <li key={f.id}>{f.label} — mark its source page to include it</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          </div>

          <section
            aria-labelledby="privacy-heading"
            className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:p-6"
          >
            <h2 id="privacy-heading" className="text-base font-semibold text-foreground">
              Privacy check
            </h2>
            <p className="text-sm text-foreground">
              The export will include names, amounts and messages from the documents above. Only
              share it with people you choose.
            </p>
            <label className="flex touch-target items-start gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]"
              />
              I have checked what this export contains.
            </label>
            {error ? (
              <NotificationBanner tone="error" title="The export was not generated">
                {error}
              </NotificationBanner>
            ) : null}
            <Button
              className="justify-self-start"
              disabled={!checked}
              loading={generating}
              loadingLabel="Generating export"
              onClick={async () => {
                if (!user) return;
                setGenerating(true);
                setError(null);
                try {
                  const { record } = await generateExport(
                    data,
                    dispute,
                    user.displayName,
                    new Date().toISOString(),
                  );
                  recordExport(record);
                  void navigate({
                    to: "/disputes/$disputeId/export/result",
                    params: { disputeId: dispute.id },
                  });
                } catch {
                  setError("Something went wrong while building the manifest. Please try again.");
                } finally {
                  setGenerating(false);
                }
              }}
            >
              <FileOutput aria-hidden="true" className="size-4" />
              Generate export
            </Button>
          </section>
        </>
      )}
    </div>
  );
}

/** U17 — the latest export: manifest, integrity scope, "No AI was used", version, time. */
export function ExportResultScreen({ dispute }: { dispute: SeedDispute }) {
  const { data, language } = useMvp();
  const exports = data.exports
    .filter((e) => e.disputeId === dispute.id)
    .sort((a, b) => b.version - a.version);
  const latest = exports[0];

  if (!latest) {
    return (
      <div className="grid gap-6">
        <ScreenHeader screenId="U17 · Export result" title="Export" />
        <EmptyState
          title="No export yet"
          action={
            <Link
              to="/disputes/$disputeId/export"
              params={{ disputeId: dispute.id }}
              className={buttonVariants({ variant: "primary" })}
            >
              Check and generate an export
            </Link>
          }
        >
          Generate an export after checking what it will contain.
        </EmptyState>
      </div>
    );
  }

  const assessment = assessExport(data, latest);
  const { manifestSha256: _omit, ...rest } = latest;
  const manifestJson = manifestJsonFor(rest);

  return (
    <div className="grid gap-6">
      <ScreenHeader
        screenId="U17 · Export result"
        title={`Export version ${latest.version}`}
        actions={
          <Button
            variant="secondary"
            size="compact"
            onClick={() => {
              const blob = new Blob([manifestJson], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${latest.id}-manifest.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download aria-hidden="true" className="size-4" />
            Download manifest
          </Button>
        }
      >
        Generated {formatDateTime(latest.generatedAt)} by {latest.generatedBy}.
      </ScreenHeader>

      <StaleOutputNotice
        assessment={assessment}
        reviewHref={`/disputes/${dispute.id}/facts`}
        language={language}
      />

      <NotificationBanner tone="success" title={REQUIRED_COPY.export_no_ai[language]} />

      <section
        aria-labelledby="manifest-heading"
        className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:p-6"
      >
        <h2 id="manifest-heading" className="text-base font-semibold text-foreground">
          Integrity manifest
        </h2>
        <p className="break-all font-mono text-xs text-foreground">
          SHA-256 {latest.manifestSha256}
        </p>
        <p className="text-sm text-foreground" lang={language}>
          {language === "hi" ? INTEGRITY_SCOPE_STATEMENT_HI : INTEGRITY_SCOPE_STATEMENT_EN}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <caption className="sr-only">Documents in this export and their fingerprints</caption>
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Document
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Size
                </th>
                <th scope="col" className="py-2 font-medium">
                  SHA-256
                </th>
              </tr>
            </thead>
            <tbody>
              {latest.documents.map((d) => (
                <tr key={d.documentId} className="border-b border-border">
                  <td className="py-2 pr-3 text-foreground">{d.filename}</td>
                  <td className="py-2 pr-3 text-foreground">{formatBytes(d.sizeBytes)}</td>
                  <td className="py-2 font-mono text-xs text-foreground" title={d.sha256}>
                    {shortHash(d.sha256)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-foreground">
          {latest.items.length} facts included
          {latest.omissions.length > 0
            ? `, ${latest.omissions.length} left out because their source is not complete`
            : ""}
          .
        </p>
      </section>

      <NotificationBanner tone="info" title="Staging preview">
        The printable case file is not produced in this preview. The manifest above is real and is
        computed in your browser from the synthetic data.
      </NotificationBanner>

      {exports.length > 1 ? (
        <section aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-base font-semibold text-foreground">
            Earlier versions
          </h2>
          <ul className="mt-2 grid gap-1 text-sm text-foreground">
            {exports.slice(1).map((e) => (
              <li key={e.id}>
                Version {e.version} · {formatDateTime(e.generatedAt)} ·{" "}
                <span className="font-mono text-xs">{shortHash(e.manifestSha256)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link
        to="/disputes/$disputeId/export"
        params={{ disputeId: dispute.id }}
        className={buttonVariants({ variant: "secondary" }) + " justify-self-start"}
      >
        Generate a new version
      </Link>
    </div>
  );
}
