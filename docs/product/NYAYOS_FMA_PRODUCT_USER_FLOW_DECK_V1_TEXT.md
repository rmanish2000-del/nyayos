# NyayOS FM-A Product & User Flow Deck V1 — text extract

| Field | Value |
|---|---|
| Source file | `FM-A Product & User Flow.pptx` (binary `.pptx`; not committed — `*.pptx` is gitignored) |
| Source sha256 | `489ccc68f7da158f7aed6c62eb0f164096ccad04c2146fe548ce5eae167d9c16` |
| Slides | 47 |
| Extraction | Verbatim text runs per slide, in document order, joined with ` · `. Layout and diagrams are not reproduced. Produced by A-032 on 23 Sep 2026. |
| Authority | Tier 4 reference. **This deck numbers U01–U21 differently from the FM-A Scope Sheet V1**; the Scope Sheet governs and the cross-map is in `NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md` §6. |

---
## Slide 1
NYAYOS · DECK 03 · P0 · FM-A Product & User Flow · एफएम-ए उत्पाद एवं उपयोगकर्ता प्रवाह · How FM-A works, screen by screen · U01–U21 · Deterministic by design · No AI  ·  No legal advice  ·  No deadlines  ·  No predictions  ·  No marketplace  ·  No automated filing

## Slide 2
Why FM-A Exists · SECTION 01 · एफएम-ए क्यों मौजूद है · 2 · FM-A · NyayOS · Evidence is scattered · Documents sit across phones, email and paper with no single, ordered place to hold them. · साक्ष्य बिखरे हुए हैं · Facts get lost · What happened is retold from memory; dates and amounts drift between tellings. · तथ्य खो जाते हैं · No traceable link · Claims are rarely tied back to the exact document and page that supports them. · प्रमाण से जुड़ाव नहीं · Handover is painful · Sharing a matter means forwarding files with no structure, order or index. · सौंपना कठिन है · FM-A is a file-and-fact organiser: the user records, the system arranges. / एफएम-ए फाइल और तथ्य व्यवस्थित करता है — सलाह नहीं देता।

## Slide 3
FM-A Boundaries · SECTION 02 · एफएम-ए की सीमाएँ · 3 · FM-A · NyayOS · FM-A does · एफएम-ए यह करता है · Stores evidence the user uploads, with integrity checks · Captures facts the user states, in the user's words · Links every fact to a source document and page · Orders confirmed facts into a user-built timeline · Exports a structured pack the user assembles · Deletes a matter completely on user instruction · FM-A does not · एफएम-ए यह नहीं करता · No AI: no model generates, infers or summarises content · No legal advice, opinion or recommendation of any kind · No legal deadlines, limitation dates or reminders · No predictions about outcomes, merits or chances · No advocate marketplace, referral or matching · No automated filing or submission to any authority · Every screen in this deck stays inside these boundaries. / हर स्क्रीन इन्हीं सीमाओं में रहती है।

## Slide 4
User Journey Overview · SECTION 03 · उपयोगकर्ता यात्रा का अवलोकन · 4 · FM-A · NyayOS · 1. Access · Sign in, verify, consent · पहुँच · › · 2. Open matter · Create matter, state account · मामला खोलें · › · 3. Evidence · Upload, verify, view documents · साक्ष्य · › · 4. Facts · Link, correct, confirm facts · तथ्य · › · 5. Structure · Timeline, parties, evidence map · संरचना · 6. Review · Gap detection, checklist · समीक्षा · › · 7. Next steps · User-chosen actions · अगले कदम · › · 8. Export · Assemble and download pack · निर्यात · › · 9. Trust · Settings, audit, deletion · भरोसा · The user drives every transition. Nothing advances on its own, and no stage produces advice. · हर चरण उपयोगकर्ता की क्रिया से आगे बढ़ता है; कोई भी चरण सलाह नहीं देता।

## Slide 5
Screen Map: U01–U21 · SECTION 03b · स्क्रीन मानचित्र: U01–U21 · 5 · FM-A · NyayOS · Access · पहुँच · U01 Sign In · U02 OTP Verify · U03 Consent · Matter start · मामला आरंभ · U04 Dashboard · U05 Create Matter · U06 What Happened · U07 Deterministic Intake · Evidence · साक्ष्य · U08 Evidence Locker · U09 Upload · U10 Document Viewer · Facts · तथ्य · U11 Fact Linking · U12 Facts List · U13 Fact Correction · U14 Fact Confirmation · Structure · संरचना · U15 Timeline · U16 Parties · U17 Evidence Map · Close-out · समापन · U18 Review & Gaps · U19 Next Steps · U20 Export Centre · U21 Settings, Trust & Deletion

## Slide 6
Sign In Flow · SECTION 04 · AUTHENTICATION · साइन-इन प्रवाह · 6 · FM-A · NyayOS · Enter number · User types mobile number · नंबर दर्ज करें · › · Request code · One-time code sent to device · कोड का अनुरोध · › · Enter code · User types the code received · कोड दर्ज करें · › · Verify · Code checked, attempts limited · सत्यापन · › · Session opens · Device-bound session starts · सत्र प्रारंभ · Security checkpoints · Rate-limited attempts, code expiry, session timeout, device binding, audit entry on each attempt. · सुरक्षा जाँच · What is not done · No password storage, no social login, no profiling, no access to matter data before consent (U03). · जो नहीं होता

## Slide 7
Consent Flow · SECTION 05 · CONSENT · सहमति प्रवाह · 7 · FM-A · NyayOS · Present terms · Plain-language scope shown · शर्तें दिखाई जाती हैं · › · Explicit choice · User accepts or declines · स्पष्ट विकल्प · › · Record · Version, time, user recorded · अभिलेख · › · Unlock · Matter features enabled · सुविधाएँ सक्रिय · › · Withdraw · Revocable at any time · वापसी · Consent states what FM-A is · Storage, organisation and export of user-supplied material — explicitly not advice, prediction or filing. · सहमति में दायरा स्पष्ट · Withdrawal has effect · Withdrawing consent blocks further processing and routes the user to deletion (U21). · वापसी का प्रभाव

## Slide 8
Dashboard · SECTION 06 · डैशबोर्ड · 8 · FM-A · NyayOS · Matters list · Each matter shows title, created date, and counts of documents and confirmed facts. · मामलों की सूची · Status at a glance · Counts only — no scores, rankings, risk ratings or priority suggestions. · स्थिति एक नज़र में · Primary action · Create matter (U05) is the single prominent action on the screen. · मुख्य क्रिया · Account entry · Settings, trust information and deletion are reachable from here (U21). · खाता प्रवेश · The dashboard reports what exists. It never ranks matters or suggests what to do next. / डैशबोर्ड केवल मौजूदा जानकारी दिखाता है।

## Slide 9
Create Matter · SECTION 07 · MATTER CREATION · मामला बनाएँ · 9 · FM-A · NyayOS · Name matter · User gives a plain title · नाम दें · › · Set basics · Own reference, start date · मूल विवरण · › · Create · Empty matter container made · बनाएँ · › · Land in matter · What Happened screen opens · मामला खुलता है · Produced on creation · A matter identifier, an empty evidence locker, an empty fact set, and an audit entry for the creation event. · निर्माण पर बनता है · Not produced · No category, no matter type inference, no jurisdiction assignment, no deadline calculation of any kind. · जो नहीं बनता

## Slide 10
What Happened Screen · SECTION 08 · क्या हुआ — स्क्रीन · 10 · FM-A · NyayOS · What the user does · उपयोगकर्ता क्या करता है · Writes the account in their own words, in English or Hindi · Adds dates and amounts only where they are certain · Saves freely — the account can be edited at any time · Marks parts they are unsure about for later correction · What the system does · सिस्टम क्या करता है · Stores the text verbatim, with version history · Offers structured entry fields — never rewrites the narrative · Does not summarise, translate or interpret the account · Produces no conclusions, labels or classifications · The user's words remain the user's words. / उपयोगकर्ता के शब्द ज्यों के त्यों रहते हैं।

## Slide 11
Deterministic Intake · SECTION 09 · नियत-नियम इनटेक · 11 · FM-A · NyayOS · Fixed questions · Same question set every time · निश्चित प्रश्न · › · User answers · Typed or selected by the user · उत्तर · › · Rule-based branching · Published rules decide next question · नियम आधारित · › · Structured record · Answers stored as fields · संरचित अभिलेख · Why deterministic · Identical answers always produce an identical path, so the intake is reviewable, testable and explainable to a security reviewer. · नियत क्यों · What it never does · No model, no scoring, no inference of unstated facts, no suggestion of what the user should claim or do. · जो कभी नहीं

## Slide 12
Evidence Locker · SECTION 10 · साक्ष्य लॉकर · 12 · FM-A · NyayOS · One place per matter · Every document the user uploads for this matter lives here, and nowhere else. · हर मामले के लिए एक स्थान · Integrity on entry · Each file is checksummed at upload; the checksum is shown and never changes. · प्रवेश पर अखंडता · User-set labels · Users label documents themselves; the system applies no automatic classification. · उपयोगकर्ता लेबल · Traceable use · Each document shows which facts cite it, so nothing is stored without purpose. · उपयोग का पता · Encrypted at rest and in transit. Access is scoped to the matter owner's session. / विश्राम और संचरण में एन्क्रिप्टेड।

## Slide 13
Upload Lifecycle · SECTION 11 · EVIDENCE UPLOAD · अपलोड जीवनचक्र · 13 · FM-A · NyayOS · Select · User picks file or photo · चयन · › · Validate · Type and size checked · जाँच · › · Transfer · Encrypted upload with progress · स्थानांतरण · › · Checksum · Hash computed and stored · चेकसम · › · Available · Listed in locker, ready to view · उपलब्ध · Failure paths · Rejected type, oversize file, interrupted transfer — each returns a plain message and leaves no partial record. · विफलता के रास्ते · Audit produced · Upload event, file identifier, checksum, timestamp and actor are written to the matter audit log. · अंकेक्षण अभिलेख

## Slide 14
Document Viewer · SECTION 12 · दस्तावेज़ दर्शक · 14 · FM-A · NyayOS · What the user can do · उपयोगकर्ता क्या कर सकता है · Open any document page by page at readable zoom · Select a region or page to cite when linking a fact · See the document's checksum and upload time · Rename their own label without altering the file · What the viewer never does · दर्शक क्या नहीं करता · No text extraction claims, no auto-reading of content · No highlighting of 'important' passages · No editing, redaction or alteration of the stored file · No suggestion of which facts a page supports · The stored file is immutable; only user labels and citations change. / संग्रहीत फाइल अपरिवर्तित रहती है।

## Slide 15
Fact Linking · SECTION 13 · FACT CREATION · तथ्य-संबंध · 15 · FM-A · NyayOS · State fact · User writes one fact · तथ्य लिखें · › · Choose source · Pick document and page · स्रोत चुनें · › · Create link · Fact bound to citation · संबंध बनाएँ · › · Unsupported flag · Fact without source is marked · असमर्थित चिह्न · Evidence-linking rule · A fact is either linked to at least one document page, or it is visibly marked as stated-without-evidence. There is no third state. · साक्ष्य नियम · Many-to-many · One document can support many facts; one fact can cite several documents. Every link is user-made and reversible. · बहु-संबंध

## Slide 16
Facts Management & Fact Lifecycle · SECTION 14 · CORRECTION & CONFIRMATION · तथ्य प्रबंधन एवं जीवनचक्र · 16 · FM-A · NyayOS · Drafted · Fact stated by user · प्रारूपित · › · Linked · Citation attached · संबद्ध · › · Corrected · User edits; history kept · संशोधित · › · Confirmed · User affirms accuracy · पुष्ट · › · Withdrawn · User removes from working set · वापस लिया · Correction keeps history · Every edit stores the previous version with time and actor, so a corrected fact never erases what was said before. · संशोधन इतिहास रखता है · Confirmation is the user's act · Only a confirmed fact can enter the timeline or an export pack. The system never confirms a fact on the user's behalf. · पुष्टि उपयोगकर्ता करता है

## Slide 17
Timeline · SECTION 15 · TIMELINE CREATION · समयरेखा · 17 · FM-A · NyayOS · Confirmed facts · Only confirmed facts qualify · पुष्ट तथ्य · › · User dates them · User sets or adjusts each date · तिथि उपयोगकर्ता देता है · › · Chronological order · Sorted by the user's dates · कालक्रम · › · Cited entries · Each entry keeps its source · स्रोत सहित · Sorting only · Ordering is arithmetic on user-supplied dates — not interpretation, not significance ranking, not a legal chronology. · केवल क्रमबद्धता · No deadlines · The timeline never computes limitation periods, hearing dates, notice windows or any other legal deadline. · कोई समय-सीमा नहीं

## Slide 18
Parties · SECTION 16 · पक्षकार · 18 · FM-A · NyayOS · User-entered only · Names, roles and contact details are typed by the user; nothing is looked up externally. · केवल उपयोगकर्ता द्वारा · Role is a label · Roles such as landlord, employer or counterparty are plain labels, not legal determinations. · भूमिका एक लेबल है · Linked to facts · A party can be attached to facts and documents so the evidence map stays coherent. · तथ्यों से जुड़ाव · No directory · No advocate marketplace, no referrals, no matching, no external contact sharing. · कोई निर्देशिका नहीं

## Slide 19
Evidence Map · SECTION 17 · साक्ष्य मानचित्र · 19 · FM-A · NyayOS · Documents · Rent agreement · Bank statement · WhatsApp export · → · Facts · Tenancy began 01 Apr · Deposit of ₹60,000 paid · Notice sent 12 Aug · → · Timeline / Parties · Chronological entries · Landlord, Tenant · Unsupported: 1 fact · Illustrative example. Every arrow is a user-made link; the map shows coverage, never strength of a case. / यह उदाहरण मात्र है।

## Slide 20
Review & Gap Detection · SECTION 18 · REVIEW WORKFLOW · समीक्षा एवं अंतराल पहचान · 20 · FM-A · NyayOS · Unsupported facts · Facts with no linked document page are listed so the user can add evidence or withdraw them. · असमर्थित तथ्य · Unconfirmed facts · Facts the user has not yet affirmed are separated from the confirmed working set. · अपुष्ट तथ्य · Undated facts · Facts without a user-supplied date cannot enter the timeline and are shown together. · बिना तिथि तथ्य · Unused documents · Documents cited by no fact are flagged so the user can link or remove them. · अप्रयुक्त दस्तावेज़ · Gaps are completeness checks against the user's own record — not an opinion on merits. / अंतराल केवल पूर्णता की जाँच हैं, राय नहीं।

## Slide 21
Next Steps · SECTION 19 · अगले कदम · 21 · FM-A · NyayOS · What the screen offers · स्क्रीन क्या देती है · A checklist of actions the user can take inside FM-A · Add evidence, confirm facts, date facts, or export · Each item links directly to the screen that resolves it · The user chooses what to do and in what order · What it never offers · जो कभी नहीं · No recommendation of legal action or strategy · No deadline, limitation period or urgency signal · No prediction of outcome, cost or likelihood · No referral to an advocate or service provider

## Slide 22
Export Lifecycle · SECTION 20 · EXPORT WORKFLOW · निर्यात जीवनचक्र · 22 · FM-A · NyayOS · Select · User picks facts and documents · चयन · › · Preview · Contents listed before build · पूर्वावलोकन · › · Assemble · Index, facts, citations, files · संयोजन · › · Verify · Checksums included in pack · सत्यापन · › · Download · User keeps the file · डाउनलोड · What the pack contains · An index, confirmed facts with citations, the timeline, party list, and the selected source documents with checksums. · पैक में क्या है · What it is not · Not a filing, not a submission, not a legal document, and never sent anywhere by FM-A. Export is download only. · यह क्या नहीं है

## Slide 23
Deletion Lifecycle · SECTION 21 · DELETION WORKFLOW · विलोपन जीवनचक्र · 23 · FM-A · NyayOS · Request · User asks to delete a matter · अनुरोध · › · Confirm · Explicit typed confirmation · पुष्टि · › · Remove · Files, facts, links removed · हटाना · › · Purge backups · Removed within stated window · बैकअप से हटाना · › · Receipt · Deletion record issued · रसीद · Scope of deletion · Documents, facts, links, timeline, parties and intake answers for the matter are removed. Deletion is not reversible. · विलोपन का दायरा · What survives · Only a minimal deletion record — matter identifier, time and actor — retained to evidence that deletion occurred. · क्या शेष रहता है

## Slide 24
Settings & Trust · SECTION 22 · सेटिंग्स एवं भरोसा · 24 · FM-A · NyayOS · Account & language · Sign-in details, session management, and switching the interface between English and Hindi. · खाता एवं भाषा · Consent record · The active consent version, when it was given, and a route to withdraw it. · सहमति अभिलेख · Audit log · A readable list of access, upload, edit, export and deletion events for the matter. · अंकेक्षण लॉग · Data controls · Export a copy, delete a matter, or close the account — all initiated by the user. · डेटा नियंत्रण · Trust is demonstrated through visible records, not claims. / भरोसा दावों से नहीं, दृश्य अभिलेखों से बनता है।

## Slide 25
End-to-End Walkthrough · SECTION 23 · आरंभ से अंत तक · 25 · FM-A · NyayOS · U01–U03 · Sign in, verify, consent · पहुँच · › · U04–U07 · Create matter, state account, intake · आरंभ · › · U08–U10 · Upload and read evidence · साक्ष्य · › · U11–U14 · Link, correct, confirm facts · तथ्य · U15–U17 · Timeline, parties, evidence map · संरचना · › · U18–U19 · Review gaps, work the checklist · समीक्षा · › · U20 · Assemble and download the pack · निर्यात · › · U21 · Settings, audit, deletion · भरोसा · One matter, from first sign-in to export or deletion — every step user-initiated, every fact traceable to a source.

## Slide 26
FM-A Success Criteria · SECTION 24 · एफएम-ए सफलता मानदंड · 26 · FM-A · NyayOS · Completed matters · A pilot user can take one matter from sign-in to export without assistance. · पूर्ण मामले · Traceability · Every confirmed fact in an export cites a document and page held in the locker. · पता लगाने योग्यता · Integrity · Checksums recorded at upload match those in the exported pack. · अखंडता · Deletion proven · A deletion request removes matter content and returns a receipt within the stated window. · विलोपन प्रमाणित · Scope held · No screen produces advice, predictions, deadlines, filings or AI-generated content. · दायरा कायम · Bilingual usable · Users complete the journey in Hindi or English with equivalent capability. · द्विभाषी उपयोग

## Slide 27
U01 · Sign In · SCREEN MAP / स्क्रीन मैप · साइन-इन · 27 · FM-A · NyayOS · Purpose · उद्देश्य · Let a user start authentication with a mobile number. · Inputs · इनपुट · Mobile number, language choice. · Outputs · आउटपुट · One-time code request. · User actions · उपयोगकर्ता क्रियाएँ · Enter number, request code, switch language. · Security checkpoints · सुरक्षा जाँच · Rate limiting, no account-existence disclosure, encrypted transport. · Data produced · उत्पन्न डेटा · Sign-in attempt record with time and outcome.

## Slide 28
U02 · OTP Verification · SCREEN MAP / स्क्रीन मैप · ओटीपी सत्यापन · 28 · FM-A · NyayOS · Purpose · उद्देश्य · Verify possession of the mobile number. · Inputs · इनपुट · One-time code. · Outputs · आउटपुट · Authenticated session or failure. · User actions · उपयोगकर्ता क्रियाएँ · Enter code, resend after cooldown, go back. · Security checkpoints · सुरक्षा जाँच · Code expiry, limited attempts, lockout, device-bound session. · Data produced · उत्पन्न डेटा · Verification result and session record.

## Slide 29
U03 · Consent · SCREEN MAP / स्क्रीन मैप · सहमति · 29 · FM-A · NyayOS · Purpose · उद्देश्य · Obtain explicit, informed and revocable consent before any matter data is handled. · Inputs · इनपुट · Accept or decline choice. · Outputs · आउटपुट · Consent record or blocked access. · User actions · उपयोगकर्ता क्रियाएँ · Read scope, accept, decline, read in Hindi or English. · Security checkpoints · सुरक्षा जाँच · Versioned consent text, immutable consent log. · Data produced · उत्पन्न डेटा · Consent version, timestamp, user identifier.

## Slide 30
U04 · Dashboard · SCREEN MAP / स्क्रीन मैप · डैशबोर्ड · 30 · FM-A · NyayOS · Purpose · उद्देश्य · Show the user their matters and the single action to create a new one. · Inputs · इनपुट · Active session. · Outputs · आउटपुट · Matter list with counts. · User actions · उपयोगकर्ता क्रियाएँ · Open a matter, create a matter, open settings. · Security checkpoints · सुरक्षा जाँच · Session scoping — only the owner's matters are readable. · Data produced · उत्पन्न डेटा · Access event in the audit log.

## Slide 31
U05 · Create Matter · SCREEN MAP / स्क्रीन मैप · मामला बनाएँ · 31 · FM-A · NyayOS · Purpose · उद्देश्य · Open an empty workspace for one situation. · Inputs · इनपुट · Matter title, own reference, start date. · Outputs · आउटपुट · Matter identifier and empty stores. · User actions · उपयोगकर्ता क्रियाएँ · Name the matter, save, cancel. · Security checkpoints · सुरक्षा जाँच · Ownership binding at creation; audit entry. · Data produced · उत्पन्न डेटा · Matter record, empty evidence locker, empty fact set.

## Slide 32
U06 · What Happened · SCREEN MAP / स्क्रीन मैप · क्या हुआ · 32 · FM-A · NyayOS · Purpose · उद्देश्य · Capture the user's own account of events, verbatim. · Inputs · इनपुट · Free text in English or Hindi; optional dates and amounts. · Outputs · आउटपुट · Stored narrative with version history. · User actions · उपयोगकर्ता क्रियाएँ · Write, edit, save, mark uncertain passages. · Security checkpoints · सुरक्षा जाँच · Encrypted storage; version history retained. · Data produced · उत्पन्न डेटा · Narrative versions with timestamps.

## Slide 33
U07 · Deterministic Intake · SCREEN MAP / स्क्रीन मैप · नियत इनटेक · 33 · FM-A · NyayOS · Purpose · उद्देश्य · Collect structured details through a fixed, rule-based question set. · Inputs · इनपुट · Answers to published questions. · Outputs · आउटपुट · Structured answer fields. · User actions · उपयोगकर्ता क्रियाएँ · Answer, go back, skip optional questions. · Security checkpoints · सुरक्षा जाँच · Versioned rule set; answer path recorded. · Data produced · उत्पन्न डेटा · Structured intake record and the branch path taken.

## Slide 34
U08 · Evidence Locker · SCREEN MAP / स्क्रीन मैप · साक्ष्य लॉकर · 34 · FM-A · NyayOS · Purpose · उद्देश्य · Hold every document for one matter in a single, traceable place. · Inputs · इनपुट · Uploaded files, user labels. · Outputs · आउटपुट · Document list with integrity details. · User actions · उपयोगकर्ता क्रियाएँ · Open, label, filter, delete a document, start an upload. · Security checkpoints · सुरक्षा जाँच · Encryption at rest and in transit; access scoped to the owner. · Data produced · उत्पन्न डेटा · Document records with checksums and link counts.

## Slide 35
U09 · Upload · SCREEN MAP / स्क्रीन मैप · अपलोड · 35 · FM-A · NyayOS · Purpose · उद्देश्य · Bring a file into the matter safely and verifiably. · Inputs · इनपुट · File or photo selection. · Outputs · आउटपुट · Stored document with checksum, or a clear failure. · User actions · उपयोगकर्ता क्रियाएँ · Select, upload, retry, cancel. · Security checkpoints · सुरक्षा जाँच · Type and size validation, encrypted transfer, checksum on receipt. · Data produced · उत्पन्न डेटा · Upload event, file identifier, checksum, timestamp, actor.

## Slide 36
U10 · Document Viewer · SCREEN MAP / स्क्रीन मैप · दस्तावेज़ दर्शक · 36 · FM-A · NyayOS · Purpose · उद्देश्य · Read a stored document and select the page to cite. · Inputs · इनपुट · Document selection, page or region choice. · Outputs · आउटपुट · Citation reference for fact linking. · User actions · उपयोगकर्ता क्रियाएँ · Zoom, page through, cite a page, rename own label. · Security checkpoints · सुरक्षा जाँच · Read-only rendering; the stored file is never altered. · Data produced · उत्पन्न डेटा · Citation reference and view event.

## Slide 37
U11 · Fact Linking · SCREEN MAP / स्क्रीन मैप · तथ्य-संबंध · 37 · FM-A · NyayOS · Purpose · उद्देश्य · Bind a stated fact to the document page that supports it. · Inputs · इनपुट · Fact text, document and page reference. · Outputs · आउटपुट · Fact with one or more citations. · User actions · उपयोगकर्ता क्रियाएँ · State a fact, attach a source, remove a link, mark as unsupported. · Security checkpoints · सुरक्षा जाँच · Link records carry actor and timestamp; links are reversible. · Data produced · उत्पन्न डेटा · Fact record and link records.

## Slide 38
U12 · Facts List · SCREEN MAP / स्क्रीन मैप · तथ्य सूची · 38 · FM-A · NyayOS · Purpose · उद्देश्य · Give one working view of every fact in the matter and its state. · Inputs · इनपुट · Filters and sort choices. · Outputs · आउटपुट · Filtered fact set. · User actions · उपयोगकर्ता क्रियाएँ · Filter by unsupported, unconfirmed or undated; open, edit, confirm. · Security checkpoints · सुरक्षा जाँच · Matter-scoped reads; state changes audited. · Data produced · उत्पन्न डेटा · Fact state summary counts.

## Slide 39
U13 · Fact Correction · SCREEN MAP / स्क्रीन मैप · तथ्य संशोधन · 39 · FM-A · NyayOS · Purpose · उद्देश्य · Let a user fix a fact without losing what was previously recorded. · Inputs · इनपुट · Edited fact text, date or citation. · Outputs · आउटपुट · New fact version; prior version retained. · User actions · उपयोगकर्ता क्रियाएँ · Edit, save, view history, revert to a prior version. · Security checkpoints · सुरक्षा जाँच · Immutable version history with actor and timestamp. · Data produced · उत्पन्न डेटा · Fact version chain.

## Slide 40
U14 · Fact Confirmation · SCREEN MAP / स्क्रीन मैप · तथ्य पुष्टि · 40 · FM-A · NyayOS · Purpose · उद्देश्य · Record the user's deliberate affirmation that a fact is accurate. · Inputs · इनपुट · Confirmation action on a specific fact. · Outputs · आउटपुट · Confirmed fact eligible for timeline and export. · User actions · उपयोगकर्ता क्रियाएँ · Confirm, un-confirm, review before confirming. · Security checkpoints · सुरक्षा जाँच · Confirmation recorded with actor and timestamp; no automatic confirmation. · Data produced · उत्पन्न डेटा · Confirmation record.

## Slide 41
U15 · Timeline · SCREEN MAP / स्क्रीन मैप · समयरेखा · 41 · FM-A · NyayOS · Purpose · उद्देश्य · Show confirmed, dated facts in chronological order. · Inputs · इनपुट · User-supplied dates on confirmed facts. · Outputs · आउटपुट · Ordered timeline with citations. · User actions · उपयोगकर्ता क्रियाएँ · Set or adjust a date, open an entry, view its source. · Security checkpoints · सुरक्षा जाँच · Only confirmed facts are eligible; changes audited. · Data produced · उत्पन्न डेटा · Timeline ordering derived from user dates.

## Slide 42
U16 · Parties · SCREEN MAP / स्क्रीन मैप · पक्षकार · 42 · FM-A · NyayOS · Purpose · उद्देश्य · Record the people and organisations involved in the matter. · Inputs · इनपुट · Names, user-chosen role labels, contact details. · Outputs · आउटपुट · Party list linked to facts and documents. · User actions · उपयोगकर्ता क्रियाएँ · Add, edit, remove a party; link a party to a fact. · Security checkpoints · सुरक्षा जाँच · Third-party data minimised and deleted with the matter. · Data produced · उत्पन्न डेटा · Party records and their links.

## Slide 43
U17 · Evidence Map · SCREEN MAP / स्क्रीन मैप · साक्ष्य मानचित्र · 43 · FM-A · NyayOS · Purpose · उद्देश्य · Show coverage across documents, facts, parties and the timeline. · Inputs · इनपुट · Existing user-made links. · Outputs · आउटपुट · Coverage view with unsupported facts highlighted. · User actions · उपयोगकर्ता क्रियाएँ · Open any node, jump to the fact or document, add a missing link. · Security checkpoints · सुरक्षा जाँच · Read-only view of matter-scoped links. · Data produced · उत्पन्न डेटा · Coverage counts.

## Slide 44
U18 · Review & Gaps · SCREEN MAP / स्क्रीन मैप · समीक्षा एवं अंतराल · 44 · FM-A · NyayOS · Purpose · उद्देश्य · Surface structural gaps in the user's own record. · Inputs · इनपुट · Current fact and document states. · Outputs · आउटपुट · Lists of unsupported, unconfirmed, undated and unused items. · User actions · उपयोगकर्ता क्रियाएँ · Open any listed item and resolve it in place. · Security checkpoints · सुरक्षा जाँच · Read-only analysis; no content leaves the matter. · Data produced · उत्पन्न डेटा · Gap counts per category.

## Slide 45
U19 · Next Steps · SCREEN MAP / स्क्रीन मैप · अगले कदम · 45 · FM-A · NyayOS · Purpose · उद्देश्य · Give the user a checklist of in-product tasks they may choose to do. · Inputs · इनपुट · Outstanding structural items. · Outputs · आउटपुट · Checklist with links to the resolving screens. · User actions · उपयोगकर्ता क्रियाएँ · Open a task, dismiss it, proceed to export. · Security checkpoints · सुरक्षा जाँच · No external actions triggered from this screen. · Data produced · उत्पन्न डेटा · Task completion state.

## Slide 46
U20 · Export Centre · SCREEN MAP / स्क्रीन मैप · निर्यात केंद्र · 46 · FM-A · NyayOS · Purpose · उद्देश्य · Assemble and download a structured copy of the matter. · Inputs · इनपुट · Selected confirmed facts and documents. · Outputs · आउटपुट · Downloadable pack with index and checksums. · User actions · उपयोगकर्ता क्रियाएँ · Select, preview contents, build, download, cancel. · Security checkpoints · सुरक्षा जाँच · Owner-only export; export event audited; nothing is transmitted to third parties. · Data produced · उत्पन्न डेटा · Export record with contents list and timestamp.

## Slide 47
U21 · Settings, Trust & Deletion · SCREEN MAP / स्क्रीन मैप · सेटिंग्स, भरोसा एवं विलोपन · 47 · FM-A · NyayOS · Purpose · उद्देश्य · Give the user visible control over account, consent, audit and deletion. · Inputs · इनपुट · Language choice, consent withdrawal, deletion request. · Outputs · आउटपुट · Updated settings, deletion receipt. · User actions · उपयोगकर्ता क्रियाएँ · Switch language, read the audit log, withdraw consent, delete a matter or close the account. · Security checkpoints · सुरक्षा जाँच · Typed confirmation for deletion; backup purge within the stated window; minimal deletion record retained. · Data produced · उत्पन्न डेटा · Audit log view, deletion receipt.
