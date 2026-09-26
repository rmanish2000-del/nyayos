# A-057 — Export UX Audit

**Screens:** U16 ExportPreview, U17 ExportResult (Export.tsx)
**Date:** 2026-09-26

---

## EX-01 · All privacy toggles can be turned off — export produces empty file

**File:** `src/screens/Export.tsx:64–83`
**Severity:** High

```tsx
const [privacy, setPrivacy] = useState({
  includeTimeline: true,
  includeParties: true,
  includeEvidence: true,
  includeNextSteps: true,
  includeWhatUseful: true,
});
```

All 5 sections default `true`. There is no guard for the state where all are `false`.
If a user toggles all off, the export CTA remains active and produces an effectively
empty file (only header + integrity hash). No warning, no disabled state.

**Fix:**
```tsx
const hasAnyContent = Object.values(privacy).some(Boolean);

// Disable export CTA:
<Button variant="amber" onClick={onExport} fullWidth disabled={!hasAnyContent}>
  {lang === 'hi' ? 'निर्यात करें' : 'Export file'}
</Button>
{!hasAnyContent && (
  <p className="text-xs text-[var(--color-warning)] mt-2 text-center">
    {lang === 'hi'
      ? 'निर्यात के लिए कम से कम एक अनुभाग चुनें।'
      : 'Select at least one section to export.'}
  </p>
)}
```

---

## EX-02 · Section toggle sub-labels show raw counts without units

**File:** `src/screens/Export.tsx:41–46`
**Severity:** Medium

```tsx
{ label: ..., value: confirmedFacts.filter(f => f.date).length },
{ label: ..., value: dispute.nextSteps?.filter(s => s.trim()).length ?? 0 },
```

The `value` column in each privacy toggle row renders a bare number with no unit.
"Timeline" → "3" gives no context. It should read "3 entries" or "3 तथ्य".

**Fix:**
```tsx
value: (() => {
  const count = confirmedFacts.filter(f => f.date).length;
  return count === 0
    ? (lang === 'hi' ? 'कोई प्रविष्टि नहीं' : 'None')
    : `${count} ${lang === 'hi' ? 'प्रविष्टियाँ' : count === 1 ? 'entry' : 'entries'}`;
})()
```

---

## EX-03 · Integrity hash regenerates on every render — changes while user watches

**File:** `src/screens/Export.tsx:132`
**Severity:** High

```tsx
const mockHash = `sha256:${Array.from({ length: 16 }, () =>
  Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
).join('')}`;
```

This is computed inline in the function body with no memoisation.
Every re-render (privacy toggle, privacy toggle hover, any state change) regenerates
the hash, producing a different value each time. A user reading the hash value
out loud for verification will get a different string on the next glance.

**Fix:**
```tsx
const mockHash = useMemo(() =>
  `sha256:${Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')}`,
  []
);
// import { useMemo } from 'react';
```

---

## EX-04 · ExportResult has no download or share affordance

**File:** `src/screens/Export.tsx:136–148`
**Severity:** High

The ExportResult screen shows:
- File label + integrity hash
- "Return to dashboard" button

There is no:
- `<a download>` for the actual file
- Copy-to-clipboard for the hash
- Share-to (WhatsApp, email) affordance

The "export" therefore produces no actual output — it is cosmetic.

**Fix — add download and hash copy actions:**
```tsx
<Button
  variant="amber"
  onClick={() => {
    const blob = new Blob([JSON.stringify(dispute, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dispute.label ?? 'nyayos-dispute'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }}
  fullWidth
  className="mb-3"
>
  {lang === 'hi' ? 'फ़ाइल डाउनलोड करें' : 'Download file'}
</Button>

<button
  onClick={() => navigator.clipboard.writeText(mockHash)}
  className="text-xs text-[var(--color-navy-mid)] hover:underline"
>
  {lang === 'hi' ? 'हैश कॉपी करें' : 'Copy hash'}
</button>
```

---

## EX-05 · ExportPreview header shows no dispute label

**File:** `src/screens/Export.tsx:48–54`
**Severity:** Medium

The ExportPreview header shows a generic heading but not the dispute label.
If a user has multiple disputes, they cannot confirm at a glance which one
they are about to export.

**Fix:**
```tsx
<h1 className="text-xl font-bold text-[var(--color-navy)]" ...>
  {lang === 'hi' ? 'निर्यात पूर्वावलोकन' : 'Export preview'}
</h1>
{dispute.label && (
  <p className="text-sm font-semibold text-[var(--color-navy-mid)] mt-1 mb-5">
    {dispute.label}
  </p>
)}
```

---

## EX-06 · "Return to dashboard" button is last element — below fold on mobile

**File:** `src/screens/Export.tsx:186`
**Severity:** Low

The ExportResult screen has:
1. Result card (hash, label)
2. (space)
3. Return to dashboard button

On 375px, after the result card, the button can sit below the fold.
Users unfamiliar with the screen may not notice it.

**Fix — make it sticky:**
```tsx
<div className="h-20 md:hidden" aria-hidden="true" />
<div className="fixed bottom-0 left-0 right-0 md:relative md:mt-5
  bg-white md:bg-transparent border-t md:border-0 border-[var(--color-border)]
  px-4 py-3 md:px-0 md:py-0 z-30 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:shadow-none">
  <Button onClick={onDone} fullWidth>
    {lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Return to dashboard'}
  </Button>
</div>
```

---

## Priority summary

| ID | Severity | File | Issue |
|----|----------|------|-------|
| EX-01 | High | `Export.tsx:64` | All-off export: no guard |
| EX-03 | High | `Export.tsx:132` | Hash regenerates every render |
| EX-04 | High | `Export.tsx:136` | No actual download affordance |
| EX-02 | Medium | `Export.tsx:41` | Toggle labels: no units |
| EX-05 | Medium | `Export.tsx:48` | Preview: no dispute label |
| EX-06 | Low | `Export.tsx:186` | Return button below fold |
