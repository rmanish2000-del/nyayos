/**
 * Dispute core entities (Scope Sheet §4.3; F11–F15). The Executive Architecture
 * Deck calls the same object a "Matter"; `Matter` is exported as a type alias so
 * both vocabularies resolve to one table (`disputes`).
 *
 * Provenance contract (CR-8): every canonical item carries `verificationStatus`,
 * `provenance.originType`, `provenance.sourceRef` and `provenance.confidence`.
 * These fields are final in FM-A; AI later becomes another origin value.
 *
 * Nothing in this module produces legal or procedural content. `Issue.label` is a
 * plain-language label chosen by the user; `NextStep.userSetDate` is user-entered
 * and labelled as such (Scope Sheet §3.3, U14, U15).
 */

import { z } from "zod";

import { Id } from "./context";
import {
  CANONICAL_TARGET_TYPES,
  CONFIDENCE_BANDS,
  CONTRADICTION_STATUSES,
  DATE_PRECISIONS,
  DISPUTE_STATUSES,
  ENTITY_TYPES,
  EVIDENCE_RELATIONS,
  ITEM_ORIGIN_TYPES,
  STATEMENT_KINDS,
  VERIFICATION_STATUSES,
} from "./enums";

// ---------------------------------------------------------------------------
// Provenance contract
// ---------------------------------------------------------------------------

export const SourceRef = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("statement"), statementId: Id }),
  z.object({
    kind: z.literal("document"),
    documentId: Id,
    documentVersionId: Id,
    /** Manual location linking (F10). Null until the user marks a page. */
    locationId: Id.nullable(),
  }),
  z.object({ kind: z.literal("user_entry"), enteredBy: Id }),
]);
export type SourceRef = z.infer<typeof SourceRef>;

export const Provenance = z.object({
  originType: z.enum(ITEM_ORIGIN_TYPES),
  sourceRef: SourceRef,
  confidence: z.enum(CONFIDENCE_BANDS),
  recordedBy: Id,
  recordedAt: z.string().datetime(),
});
export type Provenance = z.infer<typeof Provenance>;

/** A provenance chain is complete when the origin resolves to a concrete source. */
export function isProvenanceComplete(p: Provenance): boolean {
  switch (p.sourceRef.kind) {
    case "statement":
      return p.originType === "user_statement";
    case "document":
      return p.originType === "document_extraction" || p.originType === "ai_extraction";
    case "user_entry":
      return p.originType === "user_inference" || p.originType === "user_statement";
    default:
      return false;
  }
}

const CanonicalBase = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  /** Explicit discriminant (A-033 M-5): manifests and corrections name the item type, never infer it. */
  itemType: z.enum(CANONICAL_TARGET_TYPES),
  verificationStatus: z.enum(VERIFICATION_STATUSES),
  provenance: Provenance,
  /** Monotonic; incremented only by an accepted proposal (see proposal.ts). */
  version: z.number().int().min(1),
  createdAt: z.string().datetime(),
});

// ---------------------------------------------------------------------------
// Dispute ("Matter")
// ---------------------------------------------------------------------------

export const Dispute = z.object({
  id: Id,
  /** Immutable; a dispute never moves between tenants in MVP (SDAS §4.4). */
  tenantId: Id,
  ownerUserId: Id,
  title: z.string().min(1).max(300),
  status: z.enum(DISPUTE_STATUSES),
  /** Plain-language label; never a legal category (AC-M1-01). */
  categoryLabel: z.string().max(120).nullable(),
  createdAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});
export type Dispute = z.infer<typeof Dispute>;
/** Executive Architecture Deck vocabulary for the same record. */
export type Matter = Dispute;

export const DisputeStatement = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  kind: z.enum(STATEMENT_KINDS),
  questionId: Id.nullable(),
  text: z.string().min(1),
  createdBy: Id,
  createdAt: z.string().datetime(),
});
export type DisputeStatement = z.infer<typeof DisputeStatement>;

/**
 * Deterministic branching intake (F12). Rules are data, evaluated server-side
 * (A05); there is no model call. `ff_ai_questions` is off.
 */
export const BranchRule = z.object({
  whenQuestionKey: z.string().min(1),
  equals: z.string().nullable(),
  nextQuestionKey: z.string().min(1).nullable(),
});
export type BranchRule = z.infer<typeof BranchRule>;

export const IntakeQuestion = z.object({
  id: Id,
  key: z.string().min(1),
  textHi: z.string().min(1),
  textEn: z.string().min(1),
  whyWeAskHi: z.string().min(1),
  whyWeAskEn: z.string().min(1),
  allowDontKnow: z.literal(true),
  branchRules: z.array(BranchRule),
  version: z.number().int().min(1),
});
export type IntakeQuestion = z.infer<typeof IntakeQuestion>;

export const DONT_KNOW = "__dont_know__" as const;

/** Pure next-question evaluation. Returns null when the question set is complete. */
export function nextQuestion(
  questions: readonly IntakeQuestion[],
  answers: ReadonlyMap<string, string>,
): IntakeQuestion | null {
  const byKey = new Map(questions.map((q) => [q.key, q]));
  const first = questions[0];
  if (!first) return null;
  let current: IntakeQuestion | undefined = first;
  const visited = new Set<string>();
  while (current) {
    if (visited.has(current.key)) throw new Error(`intake branch cycle at ${current.key}`);
    visited.add(current.key);
    const answer = answers.get(current.key);
    if (answer === undefined) return current;
    const rule =
      current.branchRules.find((r) => r.whenQuestionKey === current!.key && r.equals === answer) ??
      current.branchRules.find((r) => r.whenQuestionKey === current!.key && r.equals === null);
    if (!rule || rule.nextQuestionKey === null) return null;
    current = byKey.get(rule.nextQuestionKey);
    if (!current) throw new Error(`intake rule points to unknown question ${rule.nextQuestionKey}`);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Canonical items
// ---------------------------------------------------------------------------

export const Entity = CanonicalBase.extend({
  itemType: z.literal("entity"),
  canonicalLabel: z.string().min(1).max(300),
  entityType: z.enum(ENTITY_TYPES),
  roleLabel: z.string().max(120).nullable(),
  notes: z.string().nullable(),
});
export type Entity = z.infer<typeof Entity>;

/** Every spelling/script seen for an entity is kept; nothing is merged automatically (AC-M1-05). */
export const EntitySourceForm = z.object({
  id: Id,
  tenantId: Id,
  disputeId: Id,
  entityId: Id,
  formText: z.string().min(1),
  sourceRef: SourceRef,
  firstSeenAt: z.string().datetime(),
});
export type EntitySourceForm = z.infer<typeof EntitySourceForm>;

export const Event = CanonicalBase.extend({
  itemType: z.literal("event"),
  text: z.string().min(1),
});
export type Event = z.infer<typeof Event>;

export const DateAssertion = CanonicalBase.extend({
  itemType: z.literal("date_assertion"),
  targetType: z.enum(CANONICAL_TARGET_TYPES),
  targetId: Id,
  /** ISO date or partial date as entered; never system-generated (AC-M1-04). */
  value: z.string().min(1).nullable(),
  precision: z.enum(DATE_PRECISIONS),
});
export type DateAssertion = z.infer<typeof DateAssertion>;

/**
 * Two assertions about the same target with different exact values are kept and
 * both marked `conflicting`; no auto-resolution (FN-06).
 */
export function markConflictingDates(assertions: readonly DateAssertion[]): DateAssertion[] {
  const groups = new Map<string, DateAssertion[]>();
  for (const a of assertions) {
    const k = `${a.targetType}:${a.targetId}`;
    groups.set(k, [...(groups.get(k) ?? []), a]);
  }
  const out: DateAssertion[] = [];
  for (const group of groups.values()) {
    const distinct = new Set(group.filter((a) => a.value !== null).map((a) => a.value));
    if (distinct.size > 1) {
      for (const a of group)
        out.push(a.precision === "conflicting" ? a : { ...a, precision: "conflicting" });
    } else {
      out.push(...group);
    }
  }
  return out;
}

export const Proposition = CanonicalBase.extend({
  itemType: z.literal("proposition"),
  text: z.string().min(1),
});
export type Proposition = z.infer<typeof Proposition>;

export const EvidenceItem = CanonicalBase.extend({
  itemType: z.literal("evidence_item"),
  documentId: Id.nullable(),
  description: z.string().min(1),
  evidenceType: z.string().min(1).max(60),
});
export type EvidenceItem = z.infer<typeof EvidenceItem>;

export const EvidenceRelationRow = CanonicalBase.extend({
  itemType: z.literal("evidence_relation"),
  evidenceItemId: Id,
  targetType: z.enum(CANONICAL_TARGET_TYPES),
  targetId: Id,
  relation: z.enum(EVIDENCE_RELATIONS),
});
export type EvidenceRelationRow = z.infer<typeof EvidenceRelationRow>;

/** "Source shown before the relationship is claimed" (U11): a relation without a resolvable source is invalid. */
export function validateEvidenceRelation(
  r: EvidenceRelationRow,
): { ok: true } | { ok: false; code: "missing_source" } {
  return isProvenanceComplete(r.provenance) ? { ok: true } : { ok: false, code: "missing_source" };
}

export const ItemRef = z.object({ targetType: z.enum(CANONICAL_TARGET_TYPES), targetId: Id });
export type ItemRef = z.infer<typeof ItemRef>;

/**
 * Contradiction: two references, a neutral description, and deliberately NO field
 * that could record which side is "true" (AC-M1-06, U12).
 */
export const Contradiction = CanonicalBase.extend({
  itemType: z.literal("contradiction"),
  itemARef: ItemRef,
  itemBRef: ItemRef,
  field: z.string().min(1).max(120),
  description: z.string().min(1),
  status: z.enum(CONTRADICTION_STATUSES),
});
export type Contradiction = z.infer<typeof Contradiction>;

export function validateContradiction(
  c: Pick<Contradiction, "itemARef" | "itemBRef" | "description">,
  prohibitedTerms: readonly string[],
): { ok: true } | { ok: false; code: "same_item" | "non_neutral_description" } {
  if (
    c.itemARef.targetType === c.itemBRef.targetType &&
    c.itemARef.targetId === c.itemBRef.targetId
  ) {
    return { ok: false, code: "same_item" };
  }
  const lower = c.description.toLowerCase();
  if (prohibitedTerms.some((term) => lower.includes(term.toLowerCase()))) {
    return { ok: false, code: "non_neutral_description" };
  }
  return { ok: true };
}

/** "What may still be useful": links to an expected/mentioned item; never implies non-occurrence (AC-M1-07). */
export const MissingEvidence = CanonicalBase.extend({
  itemType: z.literal("missing_evidence"),
  expectedItem: z.string().min(1),
  reason: z.string().min(1),
  relatedRef: ItemRef.nullable(),
  userResponse: z.string().nullable(),
});
export type MissingEvidence = z.infer<typeof MissingEvidence>;

/** File label. Required UI copy: "A label to help organise your file, not a legal determination." */
export const Issue = CanonicalBase.extend({
  itemType: z.literal("issue"),
  label: z.string().min(1).max(160),
  supportingRefs: z.array(ItemRef),
  note: z.string().nullable(),
});
export type Issue = z.infer<typeof Issue>;

export const NextStep = CanonicalBase.extend({
  itemType: z.literal("next_step"),
  text: z.string().min(1),
  ownerNote: z.string().nullable(),
  status: z.enum(["open", "done", "dropped"]),
  /** User-entered only; UI labels it "date you entered". Never derived from any rule. */
  userSetDate: z.string().nullable(),
});
export type NextStep = z.infer<typeof NextStep>;

export type CanonicalItem =
  | Entity
  | Event
  | DateAssertion
  | Proposition
  | EvidenceItem
  | EvidenceRelationRow
  | Contradiction
  | MissingEvidence
  | Issue
  | NextStep;
