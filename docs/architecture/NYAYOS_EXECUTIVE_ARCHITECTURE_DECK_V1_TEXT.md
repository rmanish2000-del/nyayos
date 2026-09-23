# NyayOS Executive Architecture Deck V1 — text extract

| Field | Value |
|---|---|
| Source file | `Executive Architecture Deck.pptx` (binary `.pptx`; not committed — `*.pptx` is gitignored) |
| Source sha256 | `dd6c03dd4584dd047e6f12c3b151e1bcc64da21bf36e97bce553329996c53a02` |
| Slides | 20 |
| Extraction | Verbatim text runs per slide, in document order, joined with ` · `. Layout, diagrams and speaker notes are not reproduced. Produced by A-030 on 23 Sep 2026. |
| Authority | Tier 4 (architecture / product reference). Where this deck and the FM-A Scope Sheet or the Security & Data Architecture Spec disagree, the Scope Sheet and the Spec govern; see `NYAYOS_FMA_FOUNDATION_GAP_REPORT_A030.md` §3 for the S1–S16 numbering reconciliation. |

---

## Slide 1

NyayOS Security & Data Architecture · न्यायओएस — सुरक्षा एवं डेटा वास्तुकला · Executive Architecture Deck  ·  FM-A Scope  ·  Version 1 · Audience: Founder · Technical reviewers · Advisors · Counsel · Security reviewers · Implementation teams · Internal architecture document. Describes design intent only.

## Slide 2

Design Principles · डिज़ाइन सिद्धांत · NyayOS · Security & Data Architecture · FM-A · 2 · Single Writer · एकल लेखक · One canonical write path per fact. No parallel mutation of the same record from different services or surfaces. · Provenance First · उद्गम सर्वप्रथम · A fact is recorded with its source, actor and timestamp at creation. No provenance, no promotion. · Deny by Default · पूर्व-निषेध · No implicit access. Every read and write requires an explicit, checked grant at tenant and row level. · User-Controlled Facts · उपयोगकर्ता-नियंत्रित तथ्य · The system proposes; the user confirms. Corrections are user actions, never silent overwrites. · Principles are architectural constraints, not aspirations — each maps to a control in S1–S16.

## Slide 3

System Overview · प्रणाली अवलोकन · NyayOS · Security & Data Architecture · FM-A · 3 · Client Surface · क्लाइंट · Web app · Counsel workspace · Upload UI · Gateway & Identity · गेटवे एवं पहचान · AuthN, session, tenant resolution, rate limits · Application Services · अनुप्रयोग सेवाएँ · Policy checks · proposals · lifecycle orchestration · Data & Evidence Layer · डेटा एवं साक्ष्य · Single-writer store · RLS · quarantine + promoted objects · Cross-Cutting · सर्वव्यापी · Audit log (append-only) · Provenance records · Policy decision points · Key & secret management · Deletion orchestrator

## Slide 4

User Journey · उपयोगकर्ता यात्रा · NyayOS · Security & Data Architecture · FM-A · 4 · Sign In · प्रवेश · Open Matter · मामला · Upload Evidence · साक्ष्य · Review Proposal · प्रस्ताव · Confirm Fact · पुष्टि · Export · निर्यात · Identity & tenant bound · S1 · S2 · Membership checked · S3 · S7 · Quarantine on arrival · S8 · S9 · Provenance attached · S10 · Single-writer commit · S4 · S11 · Manifest + audit · S12 · S14 · Every journey step maps to a named control; no step is authorized implicitly by the preceding one.

## Slide 5

Tenant Architecture · किरायेदार वास्तुकला · NyayOS · Security & Data Architecture · FM-A · 5 · Shared Application Tier · साझा अनुप्रयोग स्तर · Stateless services · tenant context resolved at gateway and carried immutably through the request · Tenant A · किरायेदार A · Tenant-scoped rows · Tenant-scoped objects · Tenant-scoped keys · Tenant-scoped audit · No cross-tenant reference · Tenant B · किरायेदार B · Tenant-scoped rows · Tenant-scoped objects · Tenant-scoped keys · Tenant-scoped audit · No cross-tenant reference · Tenant C · किरायेदार C · Tenant-scoped rows · Tenant-scoped objects · Tenant-scoped keys · Tenant-scoped audit · No cross-tenant reference · Isolation is enforced in the data layer so an application defect cannot by itself cross a tenant boundary.

## Slide 6

Identity & Access · पहचान एवं पहुँच · NyayOS · Security & Data Architecture · FM-A · 6 · Authentication · प्रमाणीकरण · Identity provider issues a session bound to user + tenant. MFA policy set per tenant. · Roles · भूमिकाएँ · Owner · Counsel · Reviewer · Uploader · Auditor. Coarse capability only. · Matter Membership · सदस्यता · Explicit per-matter grant. Absence of a grant is a denial. · Policy Decision · नीति निर्णय · Every request evaluated: tenant + role + membership + resource state. · Deny by Default · पूर्व-निषेध · If tenant, role, membership or resource state cannot all be resolved, the request is denied and the denial is audited. There is no fallback to a permissive path.

## Slide 7

Row-Level Security Model · पंक्ति-स्तरीय सुरक्षा · NyayOS · Security & Data Architecture · FM-A · 7 · Session Context · सत्र संदर्भ · tenant_id, principal_id and role set on connection checkout; never supplied by client input · Policy Predicate · नीति विधेय · row.tenant_id = session.tenant_id  AND  (row.matter_id IN session.memberships) · Filtered Result Set · निस्पंदित परिणाम · Application receives only rows the principal may see; denial happens before serialization · Enforcement Rules · प्रवर्तन नियम · 1. Policies enabled and forced on every tenant-owned table. · 2. Application role is non-privileged; no policy bypass. · 3. Read and write paths share the same predicate. · 4. Migrations that add a table without a policy fail the build gate. · 5. Context is set server-side only, never from request body or headers. · 6. Policy denials are counted and audited, not silently empty.

## Slide 8

Canonical Fact Architecture · प्रामाणिक तथ्य वास्तुकला · NyayOS · Security & Data Architecture · FM-A · 8 · Inputs · निवेश · Evidence extraction · User entry · Correction request · Import from prior matter · Fact Writer · तथ्य लेखक · Single write path · Validates provenance · Applies user confirmation · Appends new version · Emits audit event · Canonical Store · प्रामाणिक भंडार · Current version (one) · Immutable version chain · Provenance references · Read-only to all other services · Reads are broadly available under policy; writes are narrow, single-path and always versioned.

## Slide 9

Proposal & Correction System · प्रस्ताव एवं सुधार प्रणाली · NyayOS · Security & Data Architecture · FM-A · 9 · Proposal Raised · प्रस्ताव · Source + diff attached · User Review · समीक्षा · Accept · Edit · Reject · Single-Writer Commit · प्रतिबद्धता · New version only on accept · Audit Entry · अंकेक्षण · Actor, decision, timestamp · Rules · नियम · No silent overwrite of a confirmed fact. · Rejection is recorded, not discarded. · Every proposal names its evidence. · Edits by the user are themselves proposals with the user as source. · Superseded versions stay readable.

## Slide 10

Evidence Lifecycle · साक्ष्य जीवनचक्र · NyayOS · Security & Data Architecture · FM-A · 10 · Received · प्राप्त · Quarantined · संगरोध · Scanned · स्कैन · Promoted · प्रोन्नत · Referenced · संदर्भित · Retired · निवृत्त · Terminal: Rejected · अस्वीकृत · Fails scan or review. Never promoted, never referenceable by a fact. Retained for the rejection retention window, then hard-deleted with an audit record. · Terminal: Deleted · विलोपित · Reachable only from Retired. Blocked while any canonical fact still references the object. Deletion emits a tombstone that survives the object.

## Slide 11

Upload → Quarantine → Scan → Promote · अपलोड → संगरोध → स्कैन → प्रोन्नति · NyayOS · Security & Data Architecture · FM-A · 11 · 1 · Upload Grant · अपलोड अनुमति · Scoped, short-lived, tenant-bound write grant · 2 · Quarantine · संगरोध · Isolated bucket. Not readable by any serving path · 3 · Scan · स्कैन · Hash · type · size · malware inspection · 4 · Promote · प्रोन्नति · Clean verdict only. Object becomes referenceable · Failure Paths · विफलता मार्ग · Scan fails → object marked Rejected, uploader notified, audit entry written, bytes retained only for the rejection window. · Scan unavailable → object stays Quarantined; no timeout-based promotion exists. Promotion requires a positive clean verdict.

## Slide 12

Provenance Architecture · उद्गम वास्तुकला · NyayOS · Security & Data Architecture · FM-A · 12 · Evidence Object · साक्ष्य वस्तु · object id + content hash · Extraction / Entry · निष्कर्षण · method, version, actor · Fact Version · तथ्य संस्करण · version id, confirmed by · Export Manifest · निर्यात मैनिफ़ेस्ट · reproduces the chain · Invariants · अपरिवर्तनीय · Written in the same transaction as the fact. · Immutable once written. · Hash recorded at time of use. · Broken chain blocks export. · No fact without provenance.

## Slide 13

Export & Manifest System · निर्यात एवं मैनिफ़ेस्ट प्रणाली · NyayOS · Security & Data Architecture · FM-A · 13 · Export Request · निर्यात अनुरोध · Scoped to one matter, authorized per principal · Assembly · संयोजन · Selected fact versions + referenced evidence objects · Manifest Build · मैनिफ़ेस्ट · Item ids, content hashes, versions, provenance pointers · Seal & Audit · मुहर एवं अंकेक्षण · Manifest hashed; export event written to audit log · Manifest Contents · मैनिफ़ेस्ट सामग्री · Matter identifier · export identifier · requesting principal · timestamp · per-item content hash · fact version identifiers · provenance references · manifest hash. Items whose provenance chain is incomplete are excluded and listed as omissions.

## Slide 14

Audit Architecture · अंकेक्षण वास्तुकला · NyayOS · Security & Data Architecture · FM-A · 14 · Entry n-1 · payload + hash · Entry n · hash of entry n-1 + payload · Entry n+1 · hash of entry n + payload · Recorded Events · दर्ज घटनाएँ · Authorization grants and denials · Evidence state transitions · Fact versions and corrections · Exports and manifest seals · Deletion requests and tombstones · Properties · गुणधर्म · Append-only; no update or delete path · Hash-chained for tamper evidence · Tenant-scoped and read-restricted · Payloads reference ids, not content · Retained independently of the records they describe

## Slide 15

Deletion Architecture · विलोपन वास्तुकला · NyayOS · Security & Data Architecture · FM-A · 15 · Request · अनुरोध · Scope named: object, fact, matter or tenant · Reference Check · संदर्भ जाँच · Blocked while any canonical fact references it · Execute · निष्पादन · Bytes and rows removed within the tenant boundary · Tombstone · समाधि-चिह्न · Immutable record of what was deleted, by whom, when · Constraints · बाध्यताएँ · Deletion never removes audit entries or tombstones. Previously issued exports are outside the deletion boundary and cannot be recalled by this mechanism. Backup expiry is asynchronous and bounded by the documented retention window.

## Slide 16

Security Controls S1–S16 · सुरक्षा नियंत्रण S1–S16 · NyayOS · Security & Data Architecture · FM-A · 16 · ID · Control · Enforcing Layer · S1 · Authentication & session binding · Gateway / Identity · S2 · Tenant resolution & immutability · Gateway · S3 · Role & matter membership checks · Policy decision point · S4 · Single-writer enforcement · Fact writer service · S5 · Deny-by-default authorization · Policy decision point · S6 · Secret & key management · Platform · S7 · Row-level security policies · Data layer · S8 · Upload grant scoping · Ingestion · ID · Control · Enforcing Layer · S9 · Quarantine isolation · Evidence store · S10 · Provenance completeness · Fact + provenance store · S11 · Version immutability · Canonical store · S12 · Export manifest integrity · Export service · S13 · Transport & at-rest encryption · Platform · S14 · Append-only hash-chained audit · Audit service · S15 · Reference-checked deletion · Deletion orchestrator · S16 · Tombstone retention · Audit service

## Slide 17

FM-A Scope Boundaries · FM-A कार्यक्षेत्र सीमाएँ · NyayOS · Security & Data Architecture · FM-A · 17 · In Scope — FM-A · कार्यक्षेत्र में · Tenant isolation and row-level security · Identity, roles, matter membership · Canonical facts, versions, corrections · Proposal review and confirmation · Upload, quarantine, scan, promote · Provenance records · Export with manifest · Audit log and deletion with tombstones · Out of Scope — FM-A · कार्यक्षेत्र से बाहर · Cross-tenant collaboration and sharing · Automated decisioning on facts · Third-party integrations beyond identity · Public API surface · Mobile clients · Customer-managed keys · Offline or air-gapped deployment · Advanced analytics and reporting

## Slide 18

FM-A Deferred Components · स्थगित घटक · NyayOS · Security & Data Architecture · FM-A · 18 · Component · Reason for Deferral · Blocking Dependency · Cross-tenant sharing · Requires a consent and revocation model not yet designed · Provenance + audit stable · Customer-managed keys · Key custody and rotation responsibilities undefined · Key management hardened · Public API · Needs rate, quota and abuse controls · Identity and RLS proven · Automated fact promotion · Conflicts with user-controlled-facts principle · Explicit policy decision · Advanced analytics · Would read across matters; policy model not defined · Read-path policy extension · Mobile clients · Upload grant and session model need device handling · FM-A surfaces stable · Deferred is not cancelled — each item re-enters planning when its blocking dependency clears.

## Slide 19

Exit Gates · निकास द्वार · NyayOS · Security & Data Architecture · FM-A · 19 · G1 · Isolation · Row-level policies present and forced on every tenant-owned table; no bypass role in use. · G2 · Integrity · All fact writes flow through the single writer; version chains complete and immutable. · G3 · Evidence · No promotion without a clean scan verdict; quarantine unreadable from serving paths. · G4 · Evidentiary Output · Exports carry a complete manifest; incomplete provenance chains are excluded and listed. · G5 · Lifecycle · Deletion reference checks enforced; audit chain verification passing with tombstones retained. · All five gates must hold simultaneously; a gate that regresses reopens FM-A.

## Slide 20

Architecture Summary · वास्तुकला सारांश · NyayOS · Security & Data Architecture · FM-A · 20 · One Isolation Boundary · एक पृथक्करण सीमा · Tenant separation enforced in the data layer, not in application code. · One Write Path · एक लेखन मार्ग · Every canonical fact is created and corrected by a single writer, always versioned. · One Evidentiary Record · एक साक्ष्य अभिलेख · Provenance, manifest and audit chain together reconstruct any stated fact. · One Deletion Story · एक विलोपन कथा · Reference-checked removal leaving an immutable tombstone behind. · This deck documents design intent for FM-A. It makes no compliance, certification or security guarantee.
