/**
 * Required copy (Scope Sheet §6, FN-16) and the prohibited-wording guard.
 *
 * Hindi strings are working translations produced during A-030 and are marked
 * [PROV translation]; a native-speaker review is owed before any user sees them.
 * Legal wording (notices, integrity scope) is additionally gated on the Counsel
 * Brief (OL-01, OL-04, OL-08) and is NOT final.
 */

export interface BilingualCopy {
  readonly en: string;
  readonly hi: string;
}

export const REQUIRED_COPY = {
  /** U02 */
  consent_no_ai: {
    en: "This version of NyayOS does not use AI. Nothing you enter or upload is processed by any model.",
    hi: "NyayOS के इस संस्करण में AI का उपयोग नहीं होता। आपकी दर्ज की गई या अपलोड की गई कोई भी सामग्री किसी मॉडल द्वारा संसाधित नहीं होती।",
  },
  /** U02, U21 */
  operator_access: {
    en: "NyayOS staff have no standing access to your files. Any access would be recorded and disclosed to you.",
    hi: "NyayOS के कर्मचारियों को आपकी फ़ाइलों तक कोई स्थायी पहुँच नहीं है। कोई भी पहुँच दर्ज की जाएगी और आपको बताई जाएगी।",
  },
  /** U04 */
  what_happened_headline: { en: "What happened?", hi: "क्या हुआ?" },
  what_happened_help: {
    en: "Describe the problem in your own words. You do not need to know the legal term.",
    hi: "समस्या अपने शब्दों में बताइए। आपको कानूनी शब्द जानने की ज़रूरत नहीं है।",
  },
  /** U05 */
  intake_dont_know: { en: "I don't know", hi: "मुझे नहीं पता" },
  intake_why_we_ask: { en: "Why we ask", hi: "हम यह क्यों पूछते हैं" },
  /** U07 */
  mark_source_page: {
    en: "Mark the page this fact comes from",
    hi: "वह पन्ना चिह्नित करें जहाँ से यह तथ्य आया है",
  },
  /** U10 */
  no_auto_merge: {
    en: "Similar names are never merged automatically.",
    hi: "समान नाम कभी स्वतः नहीं मिलाए जाते।",
  },
  /** U12 */
  contradiction_neutral: {
    en: "These documents contain different information. NyayOS is not deciding which is correct.",
    hi: "इन दस्तावेज़ों में अलग-अलग जानकारी है। NyayOS यह तय नहीं कर रहा कि कौन सी सही है।",
  },
  /** U14 */
  issue_label_disclaimer: {
    en: "A label to help organise your file, not a legal determination.",
    hi: "यह आपकी फ़ाइल को व्यवस्थित करने के लिए एक लेबल है, कोई कानूनी निर्धारण नहीं।",
  },
  /** U15 */
  next_step_date_label: { en: "Date you entered", hi: "आपकी दर्ज की गई तारीख़" },
  /** U17 */
  export_no_ai: {
    en: "No AI was used to produce this file.",
    hi: "इस फ़ाइल को बनाने में किसी AI का उपयोग नहीं किया गया।",
  },
  /** U18 */
  deletion_requested: {
    en: "Deletion requested. You can undo until the date shown. Nothing has been deleted yet.",
    hi: "हटाने का अनुरोध दर्ज हुआ। दिखाई गई तारीख़ तक आप इसे पूर्ववत कर सकते हैं। अभी कुछ भी हटाया नहीं गया है।",
  },
  deletion_in_progress: {
    en: "Deletion in progress. This is not complete yet.",
    hi: "हटाने की प्रक्रिया चल रही है। यह अभी पूरी नहीं हुई है।",
  },
  deletion_completed_active_systems: {
    en: "Deleted from active systems. Copies in backups expire on the date shown.",
    hi: "सक्रिय प्रणालियों से हटा दिया गया। बैकअप में मौजूद प्रतियाँ दिखाई गई तारीख़ को समाप्त होंगी।",
  },
  deletion_verified: {
    en: "Deletion verified by an operator check. Backup copies expire on the date shown.",
    hi: "ऑपरेटर जाँच द्वारा हटाना सत्यापित। बैकअप प्रतियाँ दिखाई गई तारीख़ को समाप्त होंगी।",
  },
  /** U21 */
  trust_ai_assists: {
    en: "AI assists; AI does not decide. In this version there is no AI at all.",
    hi: "AI सहायता करता है; AI निर्णय नहीं करता। इस संस्करण में कोई AI नहीं है।",
  },
  /** U06 evidence locker — Duplicate Detection V1 (A-036). {label} is the existing document's label. */
  duplicate_detected: {
    en: 'This file is identical to "{label}", which is already in your file. It has not been merged; you can keep both or remove one.',
    hi: 'यह फ़ाइल "{label}" के समान है, जो आपकी फ़ाइल में पहले से मौजूद है। इसे मिलाया नहीं गया है; आप दोनों रख सकते हैं या एक हटा सकते हैं।',
  },
  /** Stale Output Detection V1 (A-037). Never implies the original evidence changed. */
  stale_output_title: {
    en: "This export may be out of date",
    hi: "यह निर्यात पुराना हो सकता है",
  },
  stale_output_stale: {
    en: "Items referenced by this export that now have a newer version: {count}.",
    hi: "इस निर्यात में संदर्भित मदें जिनका अब नया संस्करण है: {count}।",
  },
  stale_output_unknown: {
    en: "Items referenced by this export that NyayOS could not confirm as current: {count}.",
    hi: "इस निर्यात में संदर्भित मदें जिन्हें NyayOS वर्तमान के रूप में पुष्टि नहीं कर सका: {count}।",
  },
  stale_output_unreadable: {
    en: "NyayOS could not read this export's list of contents, so it cannot confirm that the export is current.",
    hi: "NyayOS इस निर्यात की सामग्री-सूची नहीं पढ़ सका, इसलिए यह पुष्टि नहीं कर सकता कि निर्यात वर्तमान है।",
  },
  stale_output_unchanged: {
    en: "This export has not been changed or replaced, and your stored original documents are unchanged. Review the items before relying on this export.",
    hi: "इस निर्यात को न तो बदला गया है और न ही प्रतिस्थापित किया गया है, और आपके संग्रहीत मूल दस्तावेज़ अपरिवर्तित हैं। इस निर्यात पर भरोसा करने से पहले इन मदों की समीक्षा करें।",
  },
  stale_output_review: {
    en: "Review these items ({count})",
    hi: "इन मदों की समीक्षा करें ({count})",
  },
} as const satisfies Record<string, BilingualCopy>;

/** Fill the `{label}` placeholder of a copy string. */
export function fillCopy(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? `{${k}}`);
}

export type RequiredCopyKey = keyof typeof REQUIRED_COPY;

/**
 * Wording that must not appear in product copy, exports or contradiction
 * descriptions (Scope Sheet §3.2–3.3, §6; app README "prohibited language").
 * These are product-scope rules, not legal rules.
 */
export const PROHIBITED_TERMS = [
  // outcome / merits language
  "success probability",
  "chance of winning",
  "likely to win",
  "case strength",
  "truth score",
  "guilty",
  "innocent",
  "bail estimate",
  // legal / procedural content excluded in Fast Mode
  "statutory deadline",
  "limitation period",
  "section 138",
  "ipc ",
  "crpc",
  "bns ",
  "you must file",
  "legal deadline",
  // marketplace
  "recommended lawyer",
  "top advocates",
  "lead fee",
  "success fee",
  // contradiction non-neutrality
  "is lying",
  "is false",
  "true source",
  "fraudulent",
] as const;

export function findProhibitedTerms(
  text: string,
  terms: readonly string[] = PROHIBITED_TERMS,
): string[] {
  const lower = text.toLowerCase();
  return terms.filter((t) => lower.includes(t.toLowerCase()));
}
