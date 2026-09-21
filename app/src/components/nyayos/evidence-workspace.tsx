import { Archive, FileUp, Search, Upload } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import {
  EvidenceCard,
  type EvidenceCardProps,
  type EvidenceState,
} from "@/components/nyayos/evidence-card";
import { NotificationBanner } from "@/components/nyayos/notification-banner";

type EvidenceScreen = "upload" | "locker";

const INITIAL_EVIDENCE: EvidenceCardProps[] = [
  {
    id: "upload-contract",
    filename: "Supply agreement.pdf",
    meta: "PDF · 2.4 MB",
    state: "uploading",
    progress: 64,
    source: "document-fact",
    message: "File transfer is in progress.",
  },
  {
    id: "processing-invoice",
    filename: "Invoice AT-4471.pdf",
    meta: "PDF · 880 KB",
    state: "processing",
    source: "ai-extraction",
    confidence: "unknown",
    message: "Reading text and page references.",
  },
  {
    id: "extracted-receipt",
    filename: "Delivery receipt.jpg",
    meta: "Image · 1.1 MB",
    state: "extracted",
    category: "Delivery",
    source: "ai-extraction",
    locator: "image 1",
    confidence: "high",
    date: { precision: "exact", value: "14 July 2026" },
    extractedFacts: 3,
  },
  {
    id: "error-ledger",
    filename: "Payment ledger.pdf",
    meta: "PDF · 12.8 MB",
    state: "error",
    source: "source-unavailable",
    message: "This file could not be read. The original file has not been changed.",
  },
  {
    id: "uncategorized-message",
    filename: "Courier message.png",
    meta: "Image · 420 KB",
    state: "uncategorized",
    source: "document-fact",
    confidence: "unknown",
    date: { precision: "unknown-date" },
    message: "Choose a category when you know where this belongs.",
  },
];

export function EvidenceWorkspace() {
  const [screen, setScreen] = React.useState<EvidenceScreen>("upload");
  const [items, setItems] = React.useState(INITIAL_EVIDENCE);
  const [query, setQuery] = React.useState("");
  const [stateFilter, setStateFilter] = React.useState<"all" | EvidenceState>("all");
  const [announcement, setAnnouncement] = React.useState("");
  const fileInput = React.useRef<HTMLInputElement>(null);

  const updateState = (id: string, state: EvidenceState, message: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        const { progress: _progress, ...rest } = item;
        return state === "uploading"
          ? { ...rest, state, message, progress: 0 }
          : { ...rest, state, message };
      }),
    );
    setAnnouncement(message);
  };
  const remove = (id: string) => setItems((current) => current.filter((item) => item.id !== id));
  const visible = items.filter(
    (item) =>
      (stateFilter === "all" || item.state === stateFilter) &&
      item.filename.toLowerCase().includes(query.toLowerCase()),
  );

  const actions = (item: EvidenceCardProps): Partial<EvidenceCardProps> => ({
    onCancel: () => updateState(item.id, "error", "Upload cancelled. You can retry when ready."),
    onRetry: () => updateState(item.id, "uploading", "Upload restarted."),
    onRemove: () => {
      remove(item.id);
      setAnnouncement(`${item.filename} removed from this staging list.`);
    },
    onReview: () => setAnnouncement(`Opened extracted facts for ${item.filename}.`),
    onCategorize: () => setAnnouncement(`Category chooser opened for ${item.filename}.`),
  });

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const additions = Array.from(files).map((file, index): EvidenceCardProps => ({
      id: `selected-${Date.now()}-${index}`,
      filename: file.name,
      meta: `${file.type || "File"} · ${Math.max(1, Math.round(file.size / 1024))} KB`,
      state: "uploading",
      progress: 0,
      source: "document-fact",
      message: "Ready to transfer in this staging demonstration.",
    }));
    setItems((current) => [...additions, ...current]);
    setAnnouncement(
      `${additions.length} ${additions.length === 1 ? "file" : "files"} added to the upload queue.`,
    );
  };

  return (
    <div>
      <header className="border-b border-border bg-surface-raised px-4 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sprint 3 · Evidence
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-foreground sm:text-3xl">
              {screen === "upload" ? "Document upload" : "Evidence locker"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {screen === "upload"
                ? "Add documents and follow each file from transfer to extraction."
                : "Find every document, its current state and where its information came from."}
            </p>
          </div>
          <div
            role="group"
            aria-label="Evidence screens"
            className="flex rounded-md border border-border-strong bg-card p-1"
          >
            <Button
              variant={screen === "upload" ? "primary" : "ghost"}
              size="compact"
              aria-pressed={screen === "upload"}
              onClick={() => setScreen("upload")}
            >
              <FileUp aria-hidden="true" className="size-4" />
              Upload
            </Button>
            <Button
              variant={screen === "locker" ? "primary" : "ghost"}
              size="compact"
              aria-pressed={screen === "locker"}
              onClick={() => setScreen("locker")}
            >
              <Archive aria-hidden="true" className="size-4" />
              Locker
            </Button>
          </div>
        </div>
      </header>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {screen === "upload" ? (
        <div className="px-4 py-8 sm:px-8">
          <section aria-labelledby="add-documents-title">
            <h2 id="add-documents-title" className="font-serif text-xl text-foreground">
              Add documents
            </h2>
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
              className="mt-4 grid min-h-52 place-items-center rounded-lg border-2 border-dashed border-border-strong bg-surface-sunken p-6 text-center"
            >
              <div>
                <Upload aria-hidden="true" className="mx-auto size-8 text-primary" />
                <p className="mt-3 font-medium text-foreground">Drop documents here</p>
                <p className="mt-1 text-sm text-muted-foreground">PDF, image or text document</p>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  className="sr-only"
                  aria-label="Choose evidence files"
                  onChange={(event) => addFiles(event.target.files)}
                />
                <Button className="mt-4" onClick={() => fileInput.current?.click()}>
                  <FileUp aria-hidden="true" className="size-4" />
                  Choose files
                </Button>
              </div>
            </div>
          </section>
          <section aria-labelledby="upload-queue-title" className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h2 id="upload-queue-title" className="font-serif text-xl text-foreground">
                Upload queue
              </h2>
              <span className="text-sm text-muted-foreground">{items.length} documents</span>
            </div>
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {items.map((item) => (
                <EvidenceCard key={item.id} {...item} {...actions(item)} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="px-4 py-8 sm:px-8">
          <NotificationBanner tone="info" title="Provenance stays visible">
            Every item shows its source and extraction state. Uncategorized items remain in the
            locker until you place them.
          </NotificationBanner>
          <section aria-labelledby="locker-title" className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="locker-title" className="font-serif text-xl text-foreground">
                  All evidence
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {visible.length} of {items.length} documents shown
                </p>
              </div>
              <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
                <label className="text-sm font-medium text-foreground">
                  <span className="sr-only">Search evidence</span>
                  <span className="relative block">
                    <Search
                      aria-hidden="true"
                      className="absolute left-3 top-3 size-4 text-muted-foreground"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search evidence"
                      className="touch-target w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground sm:w-56"
                    />
                  </span>
                </label>
                <label className="text-sm font-medium text-foreground">
                  <span className="sr-only">Filter by state</span>
                  <select
                    value={stateFilter}
                    onChange={(event) =>
                      setStateFilter(event.target.value as "all" | EvidenceState)
                    }
                    className="touch-target w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                  >
                    <option value="all">All states</option>
                    <option value="uploading">Uploading</option>
                    <option value="processing">Processing</option>
                    <option value="extracted">Extracted</option>
                    <option value="error">Needs attention</option>
                    <option value="uncategorized">Uncategorized</option>
                  </select>
                </label>
              </div>
            </div>
            {visible.length ? (
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {visible.map((item) => (
                  <EvidenceCard key={item.id} {...item} {...actions(item)} />
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-border-strong p-10 text-center">
                <Archive aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">No matching evidence</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Clear the search or choose another state.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
