# A-057 — Feedback Flow Audit

**Screens:** U12 Review, U13 WhatUseful, U14 FileLabel, U15 NextSteps, U18 DeletionFlow
**Date:** 2026-09-26

---

## FB-01 · Review conflict alert has no action — user cannot navigate to FactList

**File:** `src/screens/Review.tsx:47–54`
**Severity:** High

```tsx
{conflictFacts.length > 0 && (
  <Alert variant="warning" className="mb-4">
    <strong>{conflictFacts.length} conflict{conflictFacts.length > 1 ? 's' : ''}:</strong>{' '}
    {lang === 'hi'
      ? 'कुछ तथ्यों में विरोधाभास है। जाँचें और सुधारें।'
      : 'Some facts conflict with each other. Review and correct before continuing.'}
  </Alert>
)}
```

The conflict alert tells the user to "review and correct" but provides no button
to navigate to FactList. The user must use the Back button repeatedly to reach it.

**Fix — add an action button to the alert:**
```tsx
{conflictFacts.length > 0 && (
  <Alert variant="warning" className="mb-4">
    <div className="flex items-start justify-between gap-3">
      <span>
        <strong>{conflictFacts.length} conflict{conflictFacts.length > 1 ? 's' : ''}:</strong>{' '}
        {lang === 'hi' ? 'कुछ तथ्यों में विरोधाभास है।' : 'Some facts conflict.'}
      </span>
      <Button size="sm" variant="ghost" onClick={onGoToFacts} className="flex-shrink-0">
        {lang === 'hi' ? 'तथ्य →' : 'Facts →'}
      </Button>
    </div>
  </Alert>
)}
```

Add `onGoToFacts?: () => void` to `ReviewProps`. Wire from `App.tsx`:
```tsx
case 'review':
  return <Review ... onGoToFacts={() => nav('fact-list')} />;
```

---

## FB-02 · Unlinked-facts alert has no action — user cannot navigate to Evidence

**File:** `src/screens/Review.tsx:57–63`
**Severity:** High

```tsx
{unlinkedFacts.length > 0 && (
  <Alert variant="info" className="mb-4">
    {lang === 'hi'
      ? `${unlinkedFacts.length} पुष्ट तथ्य किसी दस्तावेज़ से नहीं जुड़े हैं।`
      : `${unlinkedFacts.length} confirmed fact${unlinkedFacts.length > 1 ? 's are' : ' is'} not linked to any document.`}
  </Alert>
)}
```

Same pattern as FB-01. Alert but no affordance to link the facts.

**Fix:**
```tsx
{unlinkedFacts.length > 0 && (
  <Alert variant="info" className="mb-4">
    <div className="flex items-start justify-between gap-3">
      <span>...</span>
      <Button size="sm" variant="ghost" onClick={onGoToEvidence} className="flex-shrink-0">
        {lang === 'hi' ? 'साक्ष्य →' : 'Evidence →'}
      </Button>
    </div>
  </Alert>
)}
```

Add `onGoToEvidence?: () => void`. Wire to `nav('evidence-locker')`.

---

## FB-03 · WhatUseful suggestions are static — not personalised to dispute type

**File:** `src/screens/Review.tsx:128–144`
**Severity:** Medium

```tsx
const suggestions = [
  lang === 'hi' ? 'लिखित में दिए गए वादे...' : 'Written promises or agreements...',
  lang === 'hi' ? 'भुगतान का प्रमाण...' : 'Proof of payment...',
  // ... 5 more
];
```

The suggestions array is hardcoded and identical for every dispute type.
A landlord dispute and a salary dispute have very different evidence needs.
Suggestions should at least vary based on `dispute.intakeData?.disputeType`.

**Fix — personalise based on intake:**
```tsx
const suggestions = useMemo(() => {
  const base = [ /* ... same 5 items ... */ ];
  if (!dispute.intakeData?.hasWrittenAgreement) {
    base.unshift(lang === 'hi'
      ? 'लिखित समझौता — यदि कोई है तो खोजें'
      : 'Written agreement — look for any that exists');
  }
  return base.slice(0, 6);
}, [dispute.intakeData, lang]);
```

---

## FB-04 · FileLabel Continue button disabled with no hint

**File:** `src/screens/Closing.tsx:90`
**Severity:** Medium

See ACC-26 and MOB-11 — same finding. Not repeated in full here.

**Fix:** Add `{!label.trim() && <p className="text-xs text-muted">...</p>}`
below the Textarea/Input and above the button row.

---

## FB-05 · Account deletion single button with 10s undo — no type-to-confirm

**File:** `src/screens/Deletion.tsx:185–200`
**Severity:** High

```tsx
<Button
  variant="danger"
  onClick={() => initDelete('account')}
>
  {lang === 'hi' ? 'खाता हटाएं' : 'Delete my account'}
</Button>
```

A single button tap starts the irrecoverable deletion sequence.
The 10-second undo window is easy to miss (especially on AT where the countdown
does not announce — see ACC-22). Industry standard for destructive irreversible actions
is type-to-confirm (GitHub, Vercel, Supabase all require typing the resource name).

**Fix — require user to type "DELETE" (or "हटाएं") before button becomes active:**
```tsx
const [confirmText, setConfirmText] = useState('');
const PHRASE = lang === 'hi' ? 'हटाएं' : 'DELETE';

<p className="text-sm text-[var(--color-muted)] mb-2">
  {lang === 'hi' ? `पुष्टि के लिए "${PHRASE}" टाइप करें:` : `Type "${PHRASE}" to confirm:`}
</p>
<input
  type="text"
  value={confirmText}
  onChange={e => setConfirmText(e.target.value)}
  placeholder={PHRASE}
  aria-label={lang === 'hi' ? 'पुष्टि टाइप करें' : 'Type to confirm'}
  className="w-full px-3 py-2.5 text-sm border-2 border-[var(--color-border-2)] rounded-[var(--radius-sm)]
    focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] mb-3"
/>
<Button
  variant="danger"
  disabled={confirmText !== PHRASE}
  onClick={() => initDelete('account')}
  fullWidth
>
  {lang === 'hi' ? 'खाता स्थायी रूप से हटाएं' : 'Permanently delete my account'}
</Button>
```

---

## FB-06 · NextSteps step ordering is manual — no drag to reorder

**File:** `src/screens/Closing.tsx:108–188`
**Severity:** Medium

Users can add and remove steps but cannot reorder them.
On mobile, typing step 3 and then wanting to move it to position 1 requires
delete-and-retype. This is particularly painful for Hindi text input.

**Fix (pragmatic) — add Up/Down arrow buttons:**
```tsx
{i > 0 && (
  <button
    onClick={() => setSteps(s => { const a = [...s]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; })}
    aria-label={`Move step ${i + 1} up`}
    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-muted)]"
  >
    ↑
  </button>
)}
```

---

## FB-07 · WhatUseful unlinked docs list has no action — cannot open DocumentViewer

**File:** `src/screens/Review.tsx:193–205`
**Severity:** Medium

```tsx
{unlinkedDocs.map(ev => (
  <p key={ev.id} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
    <span aria-hidden="true">📄</span> {ev.name}
  </p>
))}
```

The list of unlinked documents is read-only. Users see which docs are unlinked
but cannot tap one to open the DocumentViewer and add links.

**Fix — make each item a button:**
```tsx
{unlinkedDocs.map(ev => (
  <button
    key={ev.id}
    onClick={() => onOpenDoc?.(ev.id)}
    className="w-full text-left text-sm text-[var(--color-navy-mid)] hover:underline
      flex items-center gap-2"
  >
    <span aria-hidden="true">📄</span> {ev.name}
  </button>
))}
```

Add `onOpenDoc?: (id: string) => void` to `WhatUsefulProps`.

---

## Priority summary

| ID | Severity | File | Issue |
|----|----------|------|-------|
| FB-01 | High | `Review.tsx:47` | Conflict alert: no navigation |
| FB-02 | High | `Review.tsx:57` | Unlinked alert: no navigation |
| FB-05 | High | `Deletion.tsx:185` | Account deletion: no confirm step |
| FB-03 | Medium | `Review.tsx:128` | WhatUseful: static suggestions |
| FB-04 | Medium | `Closing.tsx:90` | FileLabel disabled: no hint |
| FB-06 | Medium | `Closing.tsx:108` | NextSteps: no reorder |
| FB-07 | Medium | `Review.tsx:193` | Unlinked docs: no open action |
