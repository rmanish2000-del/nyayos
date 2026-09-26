/**
 * A-043 seeded synthetic fixtures for the MVP Wave-1 UI.
 *
 * Every name, address, amount and hash in this file is invented. Nothing here is a
 * real person, a real dispute or a real document. The fixtures load automatically:
 * there is no manual setup, no network call and no database.
 *
 * Hashes are synthetic fixture values in SHA-256 format; they are not hashes of any
 * real file. Files a person adds in the preview are hashed for real in the browser.
 */
import type { EvidenceCategory } from "@/components/nyayos/evidence-card";
import type { DatePrecision } from "@/components/nyayos/date-badge";
import { DONT_KNOW, type IntakeQuestion } from "@/domain";

export type PersonaKind = "founder" | "normal" | "reviewer" | "deleted" | "cross-tenant";

export interface SeedUser {
  id: string;
  kind: PersonaKind;
  displayName: string;
  email: string;
  tenantId: string;
  accountStatus: "active" | "deleted";
  /** Grant roles exist in the schema but none is enabled in FM-A. */
  grantRole?: "reviewer";
  description: string;
}

export interface SeedDispute {
  id: string;
  tenantId: string;
  ownerId: string;
  title: string;
  /** The person's own account, stored verbatim (F11). */
  statement: string;
  createdAt: string;
  status: "active";
}

/** Document state in the locker. Mirrors the domain upload/document states. */
export type DocumentState = "ready" | "awaiting-scan" | "rejected" | "unreadable";

export interface SeedDocument {
  id: string;
  disputeId: string;
  filename: string;
  label: string;
  category: EvidenceCategory;
  categoryConfirmed: boolean;
  state: DocumentState;
  /** Page text for the viewer. Synthetic. Empty for documents that cannot be shown. */
  pages: string[];
  sizeBytes: number;
  mime: string;
  uploadedAt: string;
  uploadedBy: string;
  sha256: string;
  rejectionReason?: string;
}

export type FactStatus = "pending" | "confirmed" | "corrected" | "uncertain" | "not_relevant";
export type FactOrigin = "user_statement" | "document_extraction" | "user_inference";

export interface SeedFact {
  id: string;
  disputeId: string;
  label: string;
  value: string;
  status: FactStatus;
  origin: FactOrigin;
  /** Document the fact comes from, when origin is document_extraction. */
  documentId?: string;
  /** Page the person marked (U07). Null until marked. */
  page?: number | null;
  date?: { precision: DatePrecision; value?: string };
  previousValue?: string;
  correctionReason?: string;
  contradiction?: { note: string; otherValue: string; otherDocumentId: string };
  version: number;
  updatedAt: string;
}

export interface SeedTimelineEntry {
  id: string;
  disputeId: string;
  title: string;
  description: string;
  precision: DatePrecision;
  dateValue?: string;
  /** ISO date used only for ordering; absent for unknown dates. */
  sortKey?: string;
  documentId?: string;
  factId?: string;
  conflict?: string;
}

export interface SeedExportDocument {
  documentId: string;
  filename: string;
  sha256: string;
  sizeBytes: number;
}

export interface SeedExportItem {
  factId: string;
  label: string;
  version: number;
  status: FactStatus;
  sourceRef: string;
}

export interface SeedExport {
  id: string;
  disputeId: string;
  version: number;
  generatedAt: string;
  generatedBy: string;
  manifestSha256: string;
  documents: SeedExportDocument[];
  items: SeedExportItem[];
  omissions: { factId: string; label: string; reason: "incomplete_provenance" }[];
}

export interface SeedData {
  disputes: SeedDispute[];
  documents: SeedDocument[];
  facts: SeedFact[];
  timeline: SeedTimelineEntry[];
  exports: SeedExport[];
  /** Intake answers per dispute, keyed by question key. */
  intakeAnswers: Record<string, Record<string, string>>;
}

export const TENANT_FOUNDER = "ten-founder-0001";
export const TENANT_NORMAL = "ten-normal-0002";
export const TENANT_REVIEWER = "ten-reviewer-0003";
export const TENANT_DELETED = "ten-deleted-0004";
export const TENANT_OTHER = "ten-other-0005";

export const SEED_USERS: readonly SeedUser[] = [
  {
    id: "usr-founder",
    kind: "founder",
    displayName: "Asha Verma",
    email: "asha.founder@example.test",
    tenantId: TENANT_FOUNDER,
    accountStatus: "active",
    description: "Owns two disputes with documents, facts, a timeline and one export.",
  },
  {
    id: "usr-normal",
    kind: "normal",
    displayName: "Ravi Kumar",
    email: "ravi.user@example.test",
    tenantId: TENANT_NORMAL,
    accountStatus: "active",
    description: "New account with no disputes yet — shows every empty state.",
  },
  {
    id: "usr-reviewer",
    kind: "reviewer",
    displayName: "Meera Iyer",
    email: "meera.reviewer@example.test",
    tenantId: TENANT_REVIEWER,
    accountStatus: "active",
    grantRole: "reviewer",
    description: "Reviewer role. Reviewer access is not enabled in this version.",
  },
  {
    id: "usr-deleted",
    kind: "deleted",
    displayName: "Deleted account",
    email: "removed.user@example.test",
    tenantId: TENANT_DELETED,
    accountStatus: "deleted",
    description: "Account that has been deleted. Sign-in is refused.",
  },
  {
    id: "usr-other",
    kind: "cross-tenant",
    displayName: "Karan Shah",
    email: "karan.other@example.test",
    tenantId: TENANT_OTHER,
    accountStatus: "active",
    description: "Separate account. Cannot see or open anyone else's disputes.",
  },
];

export const DISPUTE_DEPOSIT = "dsp-deposit-0001";
export const DISPUTE_APPLIANCE = "dsp-appliance-0002";
export const DISPUTE_OTHER = "dsp-other-0003";

const hash = (seed: string) => {
  // Deterministic synthetic 64-hex value derived from a seed string.
  let h1 = 0x811c9dc5;
  let out = "";
  for (let round = 0; out.length < 64; round++) {
    for (const ch of `${seed}:${round}`) {
      h1 ^= ch.charCodeAt(0);
      h1 = Math.imul(h1, 0x01000193) >>> 0;
    }
    out += h1.toString(16).padStart(8, "0");
  }
  return out.slice(0, 64);
};

export const INTAKE_QUESTIONS: readonly IntakeQuestion[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    key: "other_side",
    textEn: "Who is the other side in this problem?",
    textHi: "इस समस्या में दूसरा पक्ष कौन है?",
    whyWeAskEn: "Knowing who is involved helps you keep the right people in your file.",
    whyWeAskHi: "कौन शामिल है यह जानने से आपकी फ़ाइल में सही लोग रहते हैं।",
    allowDontKnow: true,
    branchRules: [{ whenQuestionKey: "other_side", equals: null, nextQuestionKey: "started" }],
    version: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    key: "started",
    textEn: "When did the problem start?",
    textHi: "समस्या कब शुरू हुई?",
    whyWeAskEn: "An approximate date is fine. It is used to order your timeline.",
    whyWeAskHi: "अनुमानित तारीख़ भी ठीक है। इससे आपकी समयरेखा क्रम में लगती है।",
    allowDontKnow: true,
    branchRules: [{ whenQuestionKey: "started", equals: null, nextQuestionKey: "money" }],
    version: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    key: "money",
    textEn: "Is money involved? If yes, roughly how much?",
    textHi: "क्या पैसे का मामला है? हाँ तो लगभग कितना?",
    whyWeAskEn: "Amounts help you find the receipts and messages that mention them.",
    whyWeAskHi: "राशि से आप उन रसीदों और संदेशों को ढूँढ पाते हैं जिनमें उसका ज़िक्र है।",
    allowDontKnow: true,
    branchRules: [
      { whenQuestionKey: "money", equals: DONT_KNOW, nextQuestionKey: "outcome" },
      { whenQuestionKey: "money", equals: null, nextQuestionKey: "documents_held" },
    ],
    version: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    key: "documents_held",
    textEn: "Which papers or messages do you have about the payment?",
    textHi: "भुगतान के बारे में आपके पास कौन से काग़ज़ या संदेश हैं?",
    whyWeAskEn: "This is a reminder of what to add to your evidence locker.",
    whyWeAskHi: "यह याद दिलाने के लिए है कि आप अपने साक्ष्य लॉकर में क्या जोड़ें।",
    allowDontKnow: true,
    branchRules: [{ whenQuestionKey: "documents_held", equals: null, nextQuestionKey: "outcome" }],
    version: 1,
  },
  {
    id: "00000000-0000-4000-8000-000000000105",
    key: "outcome",
    textEn: "What would you like to happen next?",
    textHi: "आप आगे क्या होना चाहते हैं?",
    whyWeAskEn: "Your own words are kept as written. NyayOS does not judge them.",
    whyWeAskHi: "आपके शब्द जैसे लिखे गए वैसे ही रखे जाते हैं। NyayOS उनका मूल्यांकन नहीं करता।",
    allowDontKnow: true,
    branchRules: [{ whenQuestionKey: "outcome", equals: null, nextQuestionKey: null }],
    version: 1,
  },
];

const LEASE_PAGES = [
  "LEAVE AND LICENCE AGREEMENT (synthetic sample)\n\nThis agreement is made on 1 June 2025 between Mr. Dinesh Rao (Licensor) and Ms. Asha Verma (Licensee) for Flat 4B, Sample Residency, Pune.\n\nTerm: eleven months starting 1 June 2025.",
  "Clause 4 — Security deposit.\n\nThe Licensee has paid a refundable security deposit of Rs. 60,000 (Rupees Sixty Thousand only). The deposit shall be returned within 30 days of the Licensee handing over the flat, after deducting any unpaid dues.\n\nClause 5 — Monthly fee: Rs. 18,000 payable by the 5th of each month.",
  "Clause 9 — Handover.\n\nOn expiry the Licensee shall hand over vacant possession with keys.\n\nSigned: Dinesh Rao    Signed: Asha Verma\nWitness: P. Nair (synthetic)",
];

const RECEIPT_PAGES = [
  "RECEIPT No. 0142 (synthetic sample)\n\nReceived from Asha Verma the sum of Rs. 50,000 towards security deposit for Flat 4B.\n\nDate: 28 May 2025\nReceived by: Dinesh Rao",
];

const CHAT_PAGES = [
  "Message export (synthetic sample)\n\n[02/05/2026 10:14] Asha: I handed over the keys today. Please return the deposit.\n[02/05/2026 18:40] Dinesh: Will check the flat and revert.\n[20/05/2026 09:02] Asha: It has been more than two weeks. Any update on the deposit?",
  "[04/06/2026 21:15] Dinesh: There is damage to the kitchen tiles. I will keep part of the deposit.\n[05/06/2026 08:30] Asha: There was no damage at handover. I have photos from that day.",
];

export function createSeedData(): SeedData {
  return {
    disputes: [
      {
        id: DISPUTE_DEPOSIT,
        tenantId: TENANT_FOUNDER,
        ownerId: "usr-founder",
        title: "Security deposit not returned",
        statement:
          "I rented Flat 4B from June 2025 and handed back the keys in early May 2026. The owner has not returned my deposit and now says there is damage to the kitchen. There was no damage when I left.",
        createdAt: "2026-06-10T09:00:00.000Z",
        status: "active",
      },
      {
        id: DISPUTE_APPLIANCE,
        tenantId: TENANT_FOUNDER,
        ownerId: "usr-founder",
        title: "Refund for a faulty washing machine",
        statement:
          "The washing machine I bought stopped working after a week. The shop keeps asking me to wait.",
        createdAt: "2026-07-02T12:30:00.000Z",
        status: "active",
      },
      {
        id: DISPUTE_OTHER,
        tenantId: TENANT_OTHER,
        ownerId: "usr-other",
        title: "Unpaid freelance invoice",
        statement: "A client has not paid my invoice for design work delivered in March.",
        createdAt: "2026-05-15T08:00:00.000Z",
        status: "active",
      },
    ],
    documents: [
      {
        id: "doc-lease",
        disputeId: DISPUTE_DEPOSIT,
        filename: "leave-and-licence-agreement.pdf",
        label: "Leave and licence agreement",
        category: "contract",
        categoryConfirmed: true,
        state: "ready",
        pages: LEASE_PAGES,
        sizeBytes: 482_113,
        mime: "application/pdf",
        uploadedAt: "2026-06-10T09:12:00.000Z",
        uploadedBy: "Asha Verma",
        sha256: hash("doc-lease"),
      },
      {
        id: "doc-receipt",
        disputeId: DISPUTE_DEPOSIT,
        filename: "deposit-receipt-0142.jpg",
        label: "Deposit receipt",
        category: "receipt",
        categoryConfirmed: false,
        state: "ready",
        pages: RECEIPT_PAGES,
        sizeBytes: 211_904,
        mime: "image/jpeg",
        uploadedAt: "2026-06-10T09:14:00.000Z",
        uploadedBy: "Asha Verma",
        sha256: hash("doc-receipt"),
      },
      {
        id: "doc-chat",
        disputeId: DISPUTE_DEPOSIT,
        filename: "messages-with-owner.txt",
        label: "Messages with the owner",
        category: "communication",
        categoryConfirmed: true,
        state: "ready",
        pages: CHAT_PAGES,
        sizeBytes: 3_420,
        mime: "text/plain",
        uploadedAt: "2026-06-11T17:40:00.000Z",
        uploadedBy: "Asha Verma",
        sha256: hash("doc-chat"),
      },
      {
        id: "doc-photos",
        disputeId: DISPUTE_DEPOSIT,
        filename: "handover-photos.png",
        label: "Handover photos",
        category: "uncategorized",
        categoryConfirmed: false,
        state: "awaiting-scan",
        pages: [],
        sizeBytes: 2_904_331,
        mime: "image/png",
        uploadedAt: "2026-06-12T08:05:00.000Z",
        uploadedBy: "Asha Verma",
        sha256: hash("doc-photos"),
      },
      {
        id: "doc-scan",
        disputeId: DISPUTE_DEPOSIT,
        filename: "notice-scan.pdf",
        label: "Scanned notice",
        category: "other",
        categoryConfirmed: false,
        state: "unreadable",
        pages: [],
        sizeBytes: 1_020_400,
        mime: "application/pdf",
        uploadedAt: "2026-06-12T08:09:00.000Z",
        uploadedBy: "Asha Verma",
        sha256: hash("doc-scan"),
      },
      {
        id: "doc-video",
        disputeId: DISPUTE_DEPOSIT,
        filename: "walkthrough.mov",
        label: "Walkthrough video",
        category: "other",
        categoryConfirmed: false,
        state: "rejected",
        pages: [],
        sizeBytes: 48_200_000,
        mime: "video/quicktime",
        uploadedAt: "2026-06-12T08:11:00.000Z",
        uploadedBy: "Asha Verma",
        sha256: hash("doc-video"),
        rejectionReason: "This file type is not accepted. Use PDF, PNG, JPG or TXT up to 10 MB.",
      },
      {
        id: "doc-invoice-other",
        disputeId: DISPUTE_OTHER,
        filename: "invoice-march.pdf",
        label: "March invoice",
        category: "invoice",
        categoryConfirmed: true,
        state: "ready",
        pages: ["INVOICE INV-031 (synthetic)\n\nDesign work, March 2026. Amount due Rs. 42,000."],
        sizeBytes: 90_112,
        mime: "application/pdf",
        uploadedAt: "2026-05-15T08:20:00.000Z",
        uploadedBy: "Karan Shah",
        sha256: hash("doc-invoice-other"),
      },
    ],
    facts: [
      {
        id: "fct-deposit-amount",
        disputeId: DISPUTE_DEPOSIT,
        label: "Security deposit amount",
        value: "Rs. 60,000",
        status: "pending",
        origin: "document_extraction",
        documentId: "doc-lease",
        page: 2,
        date: { precision: "exact", value: "1 Jun 2025" },
        contradiction: {
          note: "The agreement and the receipt record different amounts.",
          otherValue: "Rs. 50,000",
          otherDocumentId: "doc-receipt",
        },
        version: 1,
        updatedAt: "2026-06-10T09:30:00.000Z",
      },
      {
        id: "fct-handover",
        disputeId: DISPUTE_DEPOSIT,
        label: "Keys handed over",
        value: "Early May 2026",
        status: "confirmed",
        origin: "user_statement",
        date: { precision: "approximate", value: "early May 2026" },
        version: 2,
        updatedAt: "2026-06-10T09:35:00.000Z",
      },
      {
        id: "fct-return-days",
        disputeId: DISPUTE_DEPOSIT,
        label: "Deposit return period",
        value: "Within 30 days of handover",
        status: "confirmed",
        origin: "document_extraction",
        documentId: "doc-lease",
        page: 2,
        version: 1,
        updatedAt: "2026-06-10T09:31:00.000Z",
      },
      {
        id: "fct-damage-claim",
        disputeId: DISPUTE_DEPOSIT,
        label: "Owner's reason for keeping the deposit",
        value: "Damage to kitchen tiles",
        status: "uncertain",
        origin: "document_extraction",
        documentId: "doc-chat",
        page: null,
        date: { precision: "exact", value: "4 Jun 2026" },
        version: 1,
        updatedAt: "2026-06-11T18:00:00.000Z",
      },
      {
        id: "fct-flat",
        disputeId: DISPUTE_DEPOSIT,
        label: "Property",
        value: "Flat 4B, Sample Residency, Pune",
        status: "corrected",
        origin: "user_statement",
        previousValue: "Flat 4, Sample Residency",
        correctionReason: "The agreement says Flat 4B.",
        version: 2,
        updatedAt: "2026-06-10T10:00:00.000Z",
      },
      {
        id: "fct-parking",
        disputeId: DISPUTE_DEPOSIT,
        label: "Parking slot",
        value: "Not included",
        status: "not_relevant",
        origin: "user_inference",
        version: 1,
        updatedAt: "2026-06-10T10:05:00.000Z",
      },
      {
        id: "fct-other-amount",
        disputeId: DISPUTE_OTHER,
        label: "Invoice amount",
        value: "Rs. 42,000",
        status: "confirmed",
        origin: "document_extraction",
        documentId: "doc-invoice-other",
        page: 1,
        version: 1,
        updatedAt: "2026-05-15T08:30:00.000Z",
      },
    ],
    timeline: [
      {
        id: "evt-deposit-paid",
        disputeId: DISPUTE_DEPOSIT,
        title: "Deposit paid",
        description: "Receipt records the deposit payment.",
        precision: "exact",
        dateValue: "28 May 2025",
        sortKey: "2025-05-28",
        documentId: "doc-receipt",
      },
      {
        id: "evt-agreement",
        disputeId: DISPUTE_DEPOSIT,
        title: "Agreement signed",
        description: "Eleven-month leave and licence agreement starts.",
        precision: "exact",
        dateValue: "1 Jun 2025",
        sortKey: "2025-06-01",
        documentId: "doc-lease",
      },
      {
        id: "evt-handover",
        disputeId: DISPUTE_DEPOSIT,
        title: "Keys handed over",
        description: "From your own account; no document records the exact day.",
        precision: "approximate",
        dateValue: "early May 2026",
        sortKey: "2026-05-02",
        factId: "fct-handover",
      },
      {
        id: "evt-deadline",
        disputeId: DISPUTE_DEPOSIT,
        title: "Deposit return period ends",
        description: "Worked out from the handover date plus the 30 days in clause 4.",
        precision: "inferred",
        dateValue: "around 1 Jun 2026",
        sortKey: "2026-06-01",
        documentId: "doc-lease",
      },
      {
        id: "evt-damage",
        disputeId: DISPUTE_DEPOSIT,
        title: "Owner mentions damage",
        description: "The owner's message says part of the deposit will be kept.",
        precision: "conflicting",
        dateValue: "4 Jun or 5 Jun 2026",
        sortKey: "2026-06-04",
        documentId: "doc-chat",
        conflict: "The message export shows 4 Jun; your notes say 5 Jun.",
      },
      {
        id: "evt-inspection",
        disputeId: DISPUTE_DEPOSIT,
        title: "Owner inspected the flat",
        description: "Mentioned in messages; the date is not recorded anywhere.",
        precision: "unknown-date",
        documentId: "doc-chat",
      },
    ],
    exports: [
      {
        id: "exp-deposit-v1",
        disputeId: DISPUTE_DEPOSIT,
        version: 1,
        generatedAt: "2026-06-10T09:20:00.000Z",
        generatedBy: "Asha Verma",
        manifestSha256: hash("exp-deposit-v1"),
        documents: [
          {
            documentId: "doc-lease",
            filename: "leave-and-licence-agreement.pdf",
            sha256: hash("doc-lease"),
            sizeBytes: 482_113,
          },
        ],
        items: [
          {
            factId: "fct-handover",
            label: "Keys handed over",
            version: 1,
            status: "pending",
            sourceRef: "statement:fct-handover",
          },
        ],
        omissions: [],
      },
    ],
    intakeAnswers: {
      [DISPUTE_DEPOSIT]: { other_side: "The flat owner, Mr. Dinesh Rao", started: "May 2026" },
    },
  };
}

export function findUser(userId: string): SeedUser | undefined {
  return SEED_USERS.find((u) => u.id === userId);
}
