import {
  BadgeCheck,
  CircleAlert,
  FileCheck2,
  FilePenLine,
  FileText,
  HelpCircle,
  MessageSquare,
  ScanText,
  Sparkles,
  Users,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type SourceKind =
  | "document-extracted"
  | "document-fact"
  | "ai-extraction"
  | "unverified-claim"
  | "user-statement"
  | "third-party"
  | "ai-inference"
  | "verified-source"
  | "source-unavailable"
  | "user-correction";

const SOURCE: Record<
  SourceKind,
  { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "document-extracted": {
    label: "From document",
    classes: "bg-source-document-surface text-source-document border-source-document",
    icon: FileText,
  },
  "document-fact": {
    label: "Stated in a document",
    classes: "bg-source-document-surface text-source-document border-source-document",
    icon: FileCheck2,
  },
  "ai-extraction": {
    label: "Read out by AI",
    classes: "bg-source-inference-surface text-source-inference border-source-inference",
    icon: ScanText,
  },
  "unverified-claim": {
    label: "Unverified claim",
    classes: "bg-source-unverified-surface text-source-unverified border-source-unverified",
    icon: CircleAlert,
  },
  "user-statement": {
    label: "Your statement",
    classes: "bg-source-statement-surface text-source-statement border-source-statement",
    icon: MessageSquare,
  },
  "third-party": {
    label: "Third party",
    classes: "bg-source-third-party-surface text-source-third-party border-source-third-party",
    icon: Users,
  },
  "ai-inference": {
    label: "AI inference",
    classes: "bg-source-inference-surface text-source-inference border-source-inference",
    icon: Sparkles,
  },
  "verified-source": {
    label: "Verified source",
    classes: "bg-source-verified-surface text-source-verified border-source-verified",
    icon: BadgeCheck,
  },
  "source-unavailable": {
    label: "Source unavailable",
    classes: "bg-source-unavailable-surface text-source-unavailable border-source-unavailable",
    icon: HelpCircle,
  },
  "user-correction": {
    label: "User correction",
    classes: "bg-source-correction-surface text-source-correction border-source-correction",
    icon: FilePenLine,
  },
};

/**
 * Source Badge — provenance of a piece of information. Provenance is always
 * shown alongside content so a claim, a verified fact and an AI inference stay
 * visually distinct.
 */
export function SourceBadge({
  source,
  detail,
  className,
}: {
  source: SourceKind;
  detail?: string | undefined;
  className?: string;
}) {
  const config = SOURCE[source];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium",
        config.classes,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="sr-only">Source: </span>
      {config.label}
      {detail ? <span className="font-normal opacity-80">· {detail}</span> : null}
    </span>
  );
}
