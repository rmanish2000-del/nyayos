import { Archive, FileUp, Search, Upload } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/nyayos/button";
import {
  CATEGORY_LABELS,
  EvidenceCard,
  type EvidenceCardProps,
  type EvidenceCategory,
  type EvidenceLifecycle,
} from "@/components/nyayos/evidence-card";
import { NotificationBanner } from "@/components/nyayos/notification-banner";

type EvidenceScreen = "upload" | "locker";

export const ACCEPTED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".txt"] as const;
export const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(",");
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

const LIFECYCLES: EvidenceLifecycle[] = [
  "queued",
  "scanning",
  "processing",
  "extracted",
  "rejected",
  "error",
];

const CATEGORIES: EvidenceCategory[] = [
  "contract",
  "invoice",
  "receipt",
  "communication",
  "uncategorized",
  "other",
];

const LIFECYCLE_LABELS: Record<EvidenceLifecycle, string> = {
  queued: "Queued",
  scanning: "Scanning",
  processing: "Processing",
  extracted: "Extracted",
  rejected: "Rejected",
  error: "Needs attention",
};

const INITIAL_EVIDENCE: EvidenceCardProps[] = [
  {
    id: "queued-contract",
    filename: "Supply agreement.pdf",
    meta: "PDF · 2.4 MB",
    lifecycle: "queued",
    category: "contract",
    categoryConfirmed: true,
    progress: 0,
    provenance: {
      uploadedBy: "Manish Patel",
      uploadDate: "21 September 2026",
      hash: "sha256:4f1a…9c22",
    },
    message: "Waiting for its turn in the queue.",
  },
  {
    id: "scanning-invoice",
    filename: "Invoice AT-4471.pdf",
    meta: "PDF · 880 KB",
    lifecycle: "scanning",
    category: "invoice",
    progress: 64,
    provenance: {
      uploadedBy: "Manish Patel",
      uploadDate: "21 September 2026",
      hash: "sha256:b70e…1d05",
    },
    message: "Transferring the file.",
  },
  {
    id: "processing-statement",
    filename: "Bank statement.pdf",
    meta: "PDF · 1.6 MB",
    lifecycle: "processing",
    category: "other",
    provenance: {
      uploadedBy: "Priya Nair",
      uploadDate: "20 September 2026",
      hash: "sha256:2c88…77af",
    },
    message: "Reading text and page references.",
  },
  {
    id: "extracted-receipt",
    filename: "Delivery receipt.jpg",
    meta: "Image · 1.1 MB",
    lifecycle: "extracted",
    category: "receipt",
    categoryConfirmed: true,
    provenance: {
      uploadedBy: "Manish Patel",
      uploadDate: "19 September 2026",
      hash: "sha256:9de3…0b41",
    },
    extraction: {
      summary: "Delivery date and consignment number were read from image 1.",
      source: "ai-extraction",
      locator: "image 1",
      confidence: "high",
      date: { precision: "exact", value: "14 July 2026" },
      factCount: 3,
    },
  },
  {
    id: "rejected-archive",
    filename: "Case bundle.zip",
    meta: "Archive · 24.0 MB",
    lifecycle: "rejected",
    category: "uncategorized",
    provenance: {
      uploadedBy: "Priya Nair",
      uploadDate: "19 September 2026",
      hash: "sha256:0000…0000",
    },
    message: "This file type is not accepted. Nothing was stored.",
  },
  {
    id: "error-ledger",
    filename: "Payment ledger.pdf",
    meta: "PDF · 12.8 MB",
    lifecycle: "error",
    category: "uncategorized",
    provenance: {
      uploadedBy: "Manish Patel",
      uploadDate: "18 September 2026",
      hash: "sha256:51bc…ee9d",
    },
    message: "This file could not be read. The original file has not been changed.",
  },
];

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function isAccepted(name: string) {
  const lower = name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((extension) => lower.endsWith(extension));
}

export function EvidenceWorkspace() {
  const [screen, setScreen] = React.useState<EvidenceScreen>("upload");
  const [items, setItems] = React.useState(INITIAL_EVIDENCE);
  const [query, setQuery] = React.useState("");
  const [lifecycleFilter, setLifecycleFilter] = React.useState<"all" | EvidenceLifecycle>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<"all" | EvidenceCategory>("all");
  const [announcement, setAnnouncement] = React.useState("");
  const [rejections, setRejections] = React.useState<string[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [pasted, setPasted] = React.useState("");
  const [pastedError, setPastedError] = React.useState("");
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [retyping, setRetyping] = React.useState<string | null>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);

  const patch = (id: string, changes: Partial<EvidenceCardProps>, note: string) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));
    setAnnouncement(note);
  };

  const remove = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  const visible = items.filter(
    (item) =>
      (lifecycleFilter === "all" || item.lifecycle === lifecycleFilter) &&
      (categoryFilter === "all" || item.category === categoryFilter) &&
      item.filename.toLowerCase().includes(query.toLowerCase()),
  );

  const actions = (item: EvidenceCardProps): Partial<EvidenceCardProps> => ({
    onView: () => setAnnouncement(`Opened ${item.filename} in the document viewer.`),
    onRename: () => {
      setRenaming(item.id);
      setRenameValue(item.filename);
    },
    onConfirmType: () =>
      patch(
        item.id,
        { categoryConfirmed: true },
        `${item.filename} confirmed as ${CATEGORY_LABELS[item.category]}.`,
      ),
    onCorrectType: () => setRetyping(item.id),
    onCancel: () => {
      remove(item.id);
      setAnnouncement(`Upload of ${item.filename} cancelled. Nothing was stored.`);
    },
    onRetry: () =>
      patch(item.id, { lifecycle: "queued", progress: 0 }, `${item.filename} queued again.`),
    onRemove: () => {
      remove(item.id);
      setAnnouncement(`${item.filename} removed from this staging list.`);
    },
  });

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const accepted: EvidenceCardProps[] = [];
    const refused: string[] = [];

    Array.from(files).forEach((file, index) => {
      const provenance = {
        uploadedBy: "Manish Patel",
        uploadDate: "21 September 2026",
        hash: `sha256:${(file.name.length * 977).toString(16)}…staging`,
      };
      if (!isAccepted(file.name)) {
        refused.push(`${file.name} — file type not accepted (${ACCEPTED_EXTENSIONS.join(", ")}).`);
        accepted.push({
          id: `rejected-${Date.now()}-${index}`,
          filename: file.name,
          meta: `File · ${formatSize(file.size)}`,
          lifecycle: "rejected",
          category: "uncategorized",
          provenance,
          message: "This file type is not accepted. Nothing was stored.",
        });
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        refused.push(`${file.name} — larger than 10 MB.`);
        accepted.push({
          id: `rejected-${Date.now()}-${index}`,
          filename: file.name,
          meta: `File · ${formatSize(file.size)}`,
          lifecycle: "rejected",
          category: "uncategorized",
          provenance,
          message: "This file is larger than 10 MB. Nothing was stored.",
        });
        return;
      }
      accepted.push({
        id: `queued-${Date.now()}-${index}`,
        filename: file.name,
        meta: `${file.type || "File"} · ${formatSize(file.size)}`,
        lifecycle: "queued",
        category: "uncategorized",
        progress: 0,
        provenance,
        message: "Ready to transfer in this staging demonstration.",
      });
    });

    setItems((current) => [...accepted, ...current]);
    setRejections(refused);
    setAnnouncement(
      `${accepted.length} ${accepted.length === 1 ? "file" : "files"} added; ${refused.length} refused.`,
    );
  };

  const addPastedText = () => {
    const text = pasted.trim();
    if (text.length < 10) {
      setPastedError("Paste at least 10 characters so the text can be stored as a document.");
      return;
    }
    setPastedError("");
    setItems((current) => [
      {
        id: `pasted-${Date.now()}`,
        filename: `Pasted text (${text.slice(0, 24)}${text.length > 24 ? "…" : ""})`,
        meta: `Text · ${text.length} characters`,
        lifecycle: "queued",
        category: "communication",
        progress: 0,
        provenance: {
          uploadedBy: "Manish Patel",
          uploadDate: "21 September 2026",
          hash: `sha256:${(text.length * 131).toString(16)}…staging`,
        },
        message: "Pasted text entry added to the queue.",
      },
      ...current,
    ]);
    setPasted("");
    setAnnouncement("Pasted text added to the upload queue.");
  };

  const renderCards = (list: EvidenceCardProps[]) => (
    <div className="mt-4 grid gap-4 xl:grid-cols-2">
      {list.map((item) => (
        <div key={item.id}>
          <EvidenceCard {...item} {...actions(item)} />
          {renaming === item.id ? (
            <form
              className="mt-2 flex flex-wrap items-end gap-2 rounded-md border border-border-strong bg-card p-3"
              onSubmit={(event) => {
                event.preventDefault();
                const next = renameValue.trim();
                if (!next) return;
                patch(item.id, { filename: next }, `Renamed to ${next}.`);
                setRenaming(null);
              }}
            >
              <label className="flex-1 text-sm font-medium text-foreground">
                {`New name for ${item.filename}`}
                <input
                  value={renameValue}
                  onChange={(event) => setRenameValue(event.target.value)}
                  className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                />
              </label>
              <Button type="submit" size="compact">
                Save name
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="compact"
                onClick={() => setRenaming(null)}
              >
                Cancel rename
              </Button>
            </form>
          ) : null}
          {retyping === item.id ? (
            <div className="mt-2 rounded-md border border-border-strong bg-card p-3">
              <label className="text-sm font-medium text-foreground">
                {`Category for ${item.filename}`}
                <select
                  value={item.category}
                  onChange={(event) => {
                    const category = event.target.value as EvidenceCategory;
                    patch(
                      item.id,
                      { category, categoryConfirmed: true },
                      `${item.filename} category changed to ${CATEGORY_LABELS[category]}.`,
                    );
                    setRetyping(null);
                  }}
                  className="touch-target mt-1 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <header className="border-b border-border-strong bg-surface-raised px-4 py-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">Evidence</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
              {screen === "upload" ? "Document upload" : "Evidence locker"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-foreground/80">
              {screen === "upload"
                ? "Add documents and follow each file through its lifecycle, separately from its category."
                : "Find every document, its lifecycle, its category and where its information came from."}
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
            <h3 id="add-documents-title" className="font-serif text-xl text-foreground">
              Add documents
            </h3>
            <div
              data-dragging={dragging ? "true" : "false"}
              onDragEnter={() => setDragging(true)}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                addFiles(event.dataTransfer.files);
              }}
              className={`mt-4 grid min-h-52 place-items-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                dragging ? "border-primary bg-primary/10" : "border-border-strong bg-surface-sunken"
              }`}
            >
              <div>
                <Upload aria-hidden="true" className="mx-auto size-8 text-primary" />
                <p className="mt-3 font-medium text-foreground">
                  {dragging ? "Release to add these documents" : "Drop documents here"}
                </p>
                <p className="mt-1 text-sm text-foreground/80">
                  PDF, PNG, JPG or TXT · up to 10 MB each
                </p>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  accept={ACCEPT_ATTRIBUTE}
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
            {rejections.length ? (
              <div className="mt-4">
                <NotificationBanner tone="warning" title="Some files were refused">
                  <ul className="list-disc pl-5">
                    {rejections.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </NotificationBanner>
              </div>
            ) : null}
          </section>

          <section aria-labelledby="paste-text-title" className="mt-8">
            <h3 id="paste-text-title" className="font-serif text-xl text-foreground">
              Paste text instead
            </h3>
            <p className="mt-1 text-sm text-foreground/80">
              Paste a message or notice when you do not have a file.
            </p>
            <label htmlFor="pasted-text" className="mt-3 block text-sm font-medium text-foreground">
              Pasted text
            </label>
            <textarea
              id="pasted-text"
              rows={4}
              value={pasted}
              onChange={(event) => setPasted(event.target.value)}
              aria-invalid={pastedError ? true : undefined}
              aria-describedby={pastedError ? "pasted-text-error" : undefined}
              className="mt-1 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground"
            />
            {pastedError ? (
              <p
                id="pasted-text-error"
                role="alert"
                className="mt-1 text-xs font-medium text-error"
              >
                {pastedError}
              </p>
            ) : null}
            <Button className="mt-3" onClick={addPastedText}>
              Add pasted text
            </Button>
          </section>

          <section aria-labelledby="upload-queue-title" className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 id="upload-queue-title" className="font-serif text-xl text-foreground">
                Upload queue
              </h3>
              <span className="text-sm text-foreground/80">{items.length} documents</span>
            </div>
            {renderCards(items)}
          </section>
        </div>
      ) : (
        <div className="px-4 py-8 sm:px-8">
          <NotificationBanner tone="info" title="Lifecycle and category stay separate">
            Lifecycle shows how far a document has been handled. Category shows what kind of
            document it is. Provenance is always visible.
          </NotificationBanner>
          <section aria-labelledby="locker-title" className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 id="locker-title" className="font-serif text-xl text-foreground">
                  All evidence
                </h3>
                <p className="mt-1 text-sm text-foreground/80">
                  {visible.length} of {items.length} documents shown
                </p>
              </div>
              <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-3">
                <label className="text-sm font-medium text-foreground">
                  <span className="sr-only">Search evidence</span>
                  <span className="relative block">
                    <Search
                      aria-hidden="true"
                      className="absolute left-3 top-3 size-4 text-foreground/70"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search evidence"
                      className="touch-target w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-foreground/70 sm:w-52"
                    />
                  </span>
                </label>
                <label className="text-sm font-medium text-foreground">
                  <span className="sr-only">Filter by lifecycle</span>
                  <select
                    value={lifecycleFilter}
                    onChange={(event) =>
                      setLifecycleFilter(event.target.value as "all" | EvidenceLifecycle)
                    }
                    className="touch-target w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                  >
                    <option value="all">All lifecycles</option>
                    {LIFECYCLES.map((lifecycle) => (
                      <option key={lifecycle} value={lifecycle}>
                        {LIFECYCLE_LABELS[lifecycle]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium text-foreground">
                  <span className="sr-only">Filter by category</span>
                  <select
                    value={categoryFilter}
                    onChange={(event) =>
                      setCategoryFilter(event.target.value as "all" | EvidenceCategory)
                    }
                    className="touch-target w-full rounded-md border border-input bg-card px-3 text-sm text-foreground"
                  >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {CATEGORY_LABELS[category]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            {visible.length ? (
              renderCards(visible)
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-border-strong p-10 text-center">
                <Archive aria-hidden="true" className="mx-auto size-8 text-foreground/70" />
                <p className="mt-3 font-medium text-foreground">No matching evidence</p>
                <p className="mt-1 text-sm text-foreground/80">
                  Clear the search or choose another lifecycle or category.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
