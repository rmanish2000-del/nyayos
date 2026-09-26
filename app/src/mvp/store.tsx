/**
 * A-043 preview store. Holds the signed-in persona and a per-tab copy of the seeded
 * fixtures. Everything stays in this browser tab (sessionStorage); nothing is sent
 * anywhere. Signing out resets the data to the seed.
 */
import * as React from "react";

import { signInOutcome, type SignInOutcome } from "./access";
import {
  createSeedData,
  findUser,
  type FactStatus,
  type SeedData,
  type SeedDocument,
  type SeedExport,
  type SeedFact,
  type SeedTimelineEntry,
  type SeedUser,
} from "./fixtures";
import type { DatePrecision } from "@/components/nyayos/date-badge";
import type { EvidenceCategory } from "@/components/nyayos/evidence-card";

export type Language = "en" | "hi";

const SESSION_KEY = "nyayos-preview-session";
const DATA_KEY = "nyayos-preview-data";

interface MvpState {
  status: "loading" | "ready";
  user: SeedUser | null;
  data: SeedData;
  language: Language;
}

export interface MvpStore extends MvpState {
  signIn: (userId: string) => SignInOutcome;
  signOut: () => void;
  setLanguage: (language: Language) => void;
  createDispute: (title: string, statement: string) => string;
  saveIntakeAnswer: (disputeId: string, key: string, answer: string) => void;
  addDocument: (doc: SeedDocument) => void;
  renameDocument: (documentId: string, label: string) => void;
  setDocumentCategory: (documentId: string, category: EvidenceCategory) => void;
  removeDocument: (documentId: string) => void;
  setFactStatus: (factId: string, status: Exclude<FactStatus, "corrected">) => void;
  correctFact: (factId: string, value: string, reason: string) => void;
  linkFactPage: (factId: string, documentId: string, page: number) => void;
  updateTimelineDate: (
    entryId: string,
    precision: DatePrecision,
    dateValue: string | undefined,
  ) => void;
  recordExport: (record: SeedExport) => void;
}

const MvpContext = React.createContext<MvpStore | null>(null);

function readStorage<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

export function MvpProvider({
  children,
  initialUserId,
  initialData,
  persist = true,
}: {
  children: React.ReactNode;
  /** Tests: start signed in as this persona and skip the loading phase. */
  initialUserId?: string;
  initialData?: SeedData;
  persist?: boolean;
}) {
  const [state, setState] = React.useState<MvpState>(() => ({
    status: initialUserId !== undefined || !persist ? "ready" : "loading",
    user: initialUserId ? (findUser(initialUserId) ?? null) : null,
    data: initialData ?? createSeedData(),
    language: "en",
  }));

  // Restore after hydration so the server and first client render agree.
  React.useEffect(() => {
    if (!persist || initialUserId !== undefined) return;
    const session = readStorage<{ userId: string; language?: Language }>(SESSION_KEY);
    const data = readStorage<SeedData>(DATA_KEY);
    const user = session ? (findUser(session.userId) ?? null) : null;
    setState((s) => ({
      status: "ready",
      user: user && signInOutcome(user).ok ? user : null,
      data: user && data ? data : s.data,
      language: session?.language ?? "en",
    }));
  }, [persist, initialUserId]);

  React.useEffect(() => {
    if (!persist || state.status !== "ready") return;
    try {
      if (state.user) {
        window.sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ userId: state.user.id, language: state.language }),
        );
        window.sessionStorage.setItem(DATA_KEY, JSON.stringify(state.data));
      } else {
        window.sessionStorage.removeItem(SESSION_KEY);
        window.sessionStorage.removeItem(DATA_KEY);
      }
    } catch {
      // Storage unavailable (private mode): the preview still works for this page.
    }
  }, [persist, state]);

  const update = React.useCallback((fn: (data: SeedData) => SeedData) => {
    setState((s) => ({ ...s, data: fn(s.data) }));
  }, []);

  const mapFacts = React.useCallback(
    (factId: string, fn: (f: SeedFact) => SeedFact) =>
      update((d) => ({ ...d, facts: d.facts.map((f) => (f.id === factId ? fn(f) : f)) })),
    [update],
  );

  const mapDocs = React.useCallback(
    (documentId: string, fn: (doc: SeedDocument) => SeedDocument) =>
      update((d) => ({
        ...d,
        documents: d.documents.map((doc) => (doc.id === documentId ? fn(doc) : doc)),
      })),
    [update],
  );

  const store = React.useMemo<MvpStore>(
    () => ({
      ...state,
      signIn: (userId) => {
        const user = findUser(userId);
        const outcome = signInOutcome(user);
        if (outcome.ok && user) {
          setState((s) => ({ ...s, status: "ready", user, data: createSeedData() }));
        }
        return outcome;
      },
      signOut: () => setState((s) => ({ ...s, user: null, data: createSeedData() })),
      setLanguage: (language) => setState((s) => ({ ...s, language })),
      createDispute: (title, statement) => {
        const id = `dsp-${Date.now().toString(36)}`;
        setState((s) => {
          if (!s.user) return s;
          return {
            ...s,
            data: {
              ...s.data,
              disputes: [
                ...s.data.disputes,
                {
                  id,
                  tenantId: s.user.tenantId,
                  ownerId: s.user.id,
                  title,
                  statement,
                  createdAt: nowIso(),
                  status: "active",
                },
              ],
            },
          };
        });
        return id;
      },
      saveIntakeAnswer: (disputeId, key, answer) =>
        update((d) => ({
          ...d,
          intakeAnswers: {
            ...d.intakeAnswers,
            [disputeId]: { ...(d.intakeAnswers[disputeId] ?? {}), [key]: answer },
          },
        })),
      addDocument: (doc) => update((d) => ({ ...d, documents: [...d.documents, doc] })),
      renameDocument: (documentId, label) => mapDocs(documentId, (doc) => ({ ...doc, label })),
      setDocumentCategory: (documentId, category) =>
        mapDocs(documentId, (doc) => ({ ...doc, category, categoryConfirmed: true })),
      removeDocument: (documentId) =>
        update((d) => ({ ...d, documents: d.documents.filter((doc) => doc.id !== documentId) })),
      setFactStatus: (factId, status) =>
        mapFacts(factId, (f) => ({ ...f, status, version: f.version + 1, updatedAt: nowIso() })),
      correctFact: (factId, value, reason) =>
        mapFacts(factId, (f) => {
          const next: SeedFact = {
            ...f,
            previousValue: f.value,
            value,
            status: "corrected",
            version: f.version + 1,
            updatedAt: nowIso(),
          };
          if (reason) next.correctionReason = reason;
          else delete next.correctionReason;
          return next;
        }),
      linkFactPage: (factId, documentId, page) =>
        mapFacts(factId, (f) => ({
          ...f,
          documentId,
          page,
          version: f.version + 1,
          updatedAt: nowIso(),
        })),
      updateTimelineDate: (entryId, precision, dateValue) =>
        update((d) => ({
          ...d,
          timeline: d.timeline.map((e): SeedTimelineEntry => {
            if (e.id !== entryId) return e;
            const next: SeedTimelineEntry = { ...e, precision };
            if (dateValue && precision !== "unknown-date") next.dateValue = dateValue;
            else delete next.dateValue;
            if (precision !== "conflicting") delete next.conflict;
            return next;
          }),
        })),
      recordExport: (record) => update((d) => ({ ...d, exports: [...d.exports, record] })),
    }),
    [state, update, mapFacts, mapDocs],
  );

  return <MvpContext.Provider value={store}>{children}</MvpContext.Provider>;
}

export function useMvp(): MvpStore {
  const ctx = React.useContext(MvpContext);
  if (!ctx) throw new Error("useMvp must be used inside <MvpProvider>");
  return ctx;
}
