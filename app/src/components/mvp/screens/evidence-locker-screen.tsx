import { Upload } from "lucide-react";
import * as React from "react";

import { DOCUMENT_STATE_LABELS, DocumentRow } from "@/components/mvp/document-row";
import { EmptyState, ScreenHeader } from "@/components/mvp/states";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { CATEGORY_LABELS, type EvidenceCategory } from "@/components/nyayos/evidence-card";
import {
  ACCEPT_ATTRIBUTE,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_BYTES,
} from "@/components/nyayos/evidence-workspace";
import type { DocumentState, SeedDispute, SeedDocument } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";

async function sha256OfFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * U06 — evidence locker. Files chosen here are checked (type, size), hashed in the
 * browser and listed. They are not uploaded: there is no storage in this preview.
 */
export function EvidenceLockerScreen({ dispute }: { dispute: SeedDispute }) {
  const { data, user, addDocument, renameDocument, setDocumentCategory, removeDocument } = useMvp();
  const docs = data.documents.filter((d) => d.disputeId === dispute.id);
  const [stateFilter, setStateFilter] = React.useState<DocumentState | "all">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<EvidenceCategory | "all">("all");
  const [hashing, setHashing] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  const [refusal, setRefusal] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const shown = docs.filter(
    (d) =>
      (stateFilter === "all" || d.state === stateFilter) &&
      (categoryFilter === "all" || d.category === categoryFilter),
  );

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setRefusal(null);
    setHashing(true);
    const refused: string[] = [];
    let added = 0;
    for (const file of list) {
      const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
      if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
        refused.push(`${file.name}: this file type is not accepted.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        refused.push(`${file.name}: larger than 10 MB.`);
        continue;
      }
      const sha256 = await sha256OfFile(file);
      const doc: SeedDocument = {
        id: `doc-${sha256.slice(0, 10)}-${Date.now().toString(36)}`,
        disputeId: dispute.id,
        filename: file.name,
        label: file.name.replace(/\.[^.]+$/, ""),
        category: "uncategorized",
        categoryConfirmed: false,
        state: "awaiting-scan",
        pages: [],
        sizeBytes: file.size,
        mime: file.type || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.displayName ?? "You",
        sha256,
      };
      addDocument(doc);
      added++;
    }
    setHashing(false);
    if (refused.length) setRefusal(refused.join(" "));
    setAnnouncement(
      `${added} file${added === 1 ? "" : "s"} added${refused.length ? `, ${refused.length} not accepted` : ""}.`,
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="grid gap-6">
      <ScreenHeader screenId="U06 · Evidence locker" title="Evidence locker">
        Every document keeps its original file, who added it, when, and a fingerprint (SHA-256) so
        you can show it has not changed.
      </ScreenHeader>

      <NotificationBanner tone="info" title="Staging preview">
        Files you add are checked and fingerprinted in this browser only. They are not uploaded or
        stored anywhere.
      </NotificationBanner>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={
          dragOver
            ? "grid justify-items-center gap-2 rounded-lg border-2 border-primary bg-accent p-6 text-center"
            : "grid justify-items-center gap-2 rounded-lg border-2 border-dashed border-border-strong bg-surface-sunken p-6 text-center"
        }
      >
        <Upload aria-hidden="true" className="size-6 text-muted-foreground" />
        <label htmlFor="locker-file" className="font-medium text-foreground">
          {dragOver ? "Drop to add" : "Add documents"}
        </label>
        <p id="locker-file-hint" className="text-sm text-muted-foreground">
          PDF, PNG, JPG or TXT · up to 10 MB each · drag files here or choose them
        </p>
        <input
          ref={inputRef}
          id="locker-file"
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          aria-describedby="locker-file-hint"
          disabled={hashing}
          onChange={(e) => e.target.files && void handleFiles(e.target.files)}
          className="max-w-full text-sm text-foreground file:mr-3 file:min-h-11 file:rounded-md file:border file:border-border-strong file:bg-card file:px-3 file:text-sm file:text-foreground"
        />
        {hashing ? (
          <p role="status" className="text-sm text-muted-foreground">
            Fingerprinting files…
          </p>
        ) : null}
      </div>

      {refusal ? (
        <NotificationBanner
          tone="error"
          title="Some files were not added"
          onDismiss={() => setRefusal(null)}
        >
          {refusal}
        </NotificationBanner>
      ) : null}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {docs.length === 0 ? (
        <EmptyState title="No documents yet">
          Add agreements, receipts, messages or photos about this dispute.
        </EmptyState>
      ) : (
        <section aria-labelledby="locker-list-heading" className="grid gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="locker-list-heading" className="text-base font-semibold text-foreground">
              {shown.length} of {docs.length} documents
            </h2>
            <div className="flex flex-wrap gap-2">
              <label className="grid gap-1 text-sm text-foreground">
                State
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value as DocumentState | "all")}
                  className="touch-target rounded-md border border-input bg-card px-2 text-sm"
                >
                  <option value="all">All states</option>
                  {(Object.keys(DOCUMENT_STATE_LABELS) as DocumentState[]).map((s) => (
                    <option key={s} value={s}>
                      {DOCUMENT_STATE_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm text-foreground">
                Type
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as EvidenceCategory | "all")}
                  className="touch-target rounded-md border border-input bg-card px-2 text-sm"
                >
                  <option value="all">All types</option>
                  {(Object.keys(CATEGORY_LABELS) as EvidenceCategory[]).map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          {shown.length === 0 ? (
            <EmptyState title="No documents match these filters" />
          ) : (
            <ul className="grid gap-3">
              {shown.map((doc) => (
                <li key={doc.id}>
                  <DocumentRow
                    doc={doc}
                    onRename={(label) => {
                      renameDocument(doc.id, label);
                      setAnnouncement(`Renamed to ${label}.`);
                    }}
                    onSetCategory={(category) => {
                      setDocumentCategory(doc.id, category);
                      setAnnouncement(`Type set to ${CATEGORY_LABELS[category]}.`);
                    }}
                    onRemove={() => {
                      removeDocument(doc.id);
                      setAnnouncement(`${doc.label} removed.`);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
