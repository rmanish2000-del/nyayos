# A-050 — Accessibility Gaps (v2)

**Task:** A-043 Lovable implementation audit vs Figma MVP package
**Standard:** WCAG 2.1 AA
**Date:** 2026-09-26 (v2 — re-verified line-by-line against live code)
**Source files:** `src/components/ui.tsx`, `src/components/Shell.tsx`,
`src/screens/DisputeEntry.tsx`, `src/screens/Evidence.tsx`,
`src/screens/Facts.tsx`, `src/screens/Analysis.tsx`, `src/screens/Export.tsx`

All findings confirmed against actual current implementation. Line numbers are exact.

---

## Critical — blocks screen reader users completely

---

### ACC-01 · `Select` label not associated with control

**File:** `src/components/ui.tsx:285–298`
**WCAG:** 1.3.1 Info and Relationships
**Affects:** U05 (date precision ×2, nature of agreement), U08 add-fact form (source, precision)

`<label>` rendered above `<select>` with no `htmlFor`/`id` pairing. Visually
correct, programmatically orphaned. VoiceOver/NVDA/JAWS announce "combo box"
with no name.

Current code:
```tsx
export function Select({ label, value, onChange, options, className = '' }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-[var(--color-ink-2)]">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} ...>
```

**Fix:**
```tsx
interface SelectProps {
  label?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; className?: string; id?: string;
}

export function Select({ label, value, onChange, options, className = '', id }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={selectId} className="text-sm font-semibold text-[var(--color-ink-2)]">{label}</label>}
      <select id={selectId} value={value} onChange={e => onChange(e.target.value)} ...>
```

---

### ACC-02 · `Toggle` doesn't spread HTML props — `aria-label` silently dropped

**File:** `src/components/ui.tsx:302` + `src/screens/Export.tsx:76–80`
**WCAG:** 4.1.2 Name, Role, Value
**Affects:** U16 (5 privacy toggles)

The Toggle component only destructures `{ checked, onChange, label }` with no
`...rest` spread. In `Export.tsx` line 79 the caller passes `aria-label={s.label}`,
but this is silently dropped — it never reaches the DOM. The `<button role="switch">`
announces as "switch" with no context on all five privacy rows.

Export.tsx line 76–80:
```tsx
<Toggle
  checked={privacy[s.key]}
  onChange={() => toggle(s.key)}
  aria-label={s.label}   // ← DROPPED: Toggle doesn't spread props
/>
```

**Fix — wire `aria-label` inside the component:**
```tsx
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}        // ← add
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-border-2)]'}`}
      >
        <span aria-hidden="true" className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
      {label && <span aria-hidden="true" className="text-sm text-[var(--color-ink-2)]">{label}</span>}
    </label>
  );
}
```

---

### ACC-03 · `Checkbox` is a `<div onClick>` — `htmlFor` points to no element

**File:** `src/components/ui.tsx:320–337`
**WCAG:** 4.1.2 Name, Role, Value
**Affects:** Any screen using `Checkbox`

The outer `<label htmlFor={id}>` (line 327) references the `id` prop, but there
is no element in the DOM with that id — only the visual `<div>` which has no id.
Label click does nothing. Keyboard Space key does not activate. AT cannot announce
checked state or discover the control.

```tsx
export function Checkbox({ checked, onChange, label, id }: {...}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none" htmlFor={id}>
      <div onClick={() => onChange(!checked)} ...>  {/* ← no real input */}
```

**Fix:**
```tsx
export function Checkbox({ checked, onChange, label, id }: {
  checked: boolean; onChange: (v: boolean) => void; label?: string; id?: string;
}) {
  const cbId = id ?? `cb-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none" htmlFor={cbId}>
      <input id={cbId} type="checkbox" checked={checked}
        onChange={e => onChange(e.target.checked)} className="sr-only" />
      <div aria-hidden="true"
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors
          ${checked ? 'bg-[var(--color-navy)] border-[var(--color-navy)]' : 'border-[var(--color-border-2)] bg-white'}`}>
        {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      {label && <span className="text-sm text-[var(--color-ink-2)] leading-5">{label}</span>}
    </label>
  );
}
```

---

### ACC-04 · Upload `<input type="file">` is `aria-hidden="true"`

**File:** `src/screens/Evidence.tsx:97–105`
**WCAG:** 1.3.1 Info and Relationships
**Affects:** U06 Evidence Locker

```tsx
<input
  ref={fileRef}
  type="file"
  multiple
  accept=".pdf,.jpg,.jpeg,.png,.docx"
  className="hidden"
  onChange={e => addFiles(e.target.files)}
  aria-hidden="true"   // ← removes from AT tree entirely
/>
```

iOS VoiceOver and Windows Narrator cannot discover any upload control.

**Fix — overlay the input over the drop zone:**
```tsx
// 1. Add `relative` to the drop zone div className
// 2. Replace the hidden input:
<input
  ref={fileRef}
  type="file"
  multiple
  accept=".pdf,.jpg,.jpeg,.png,.docx"
  aria-label={t(lang, 'uploadDocuments')}
  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
  onChange={e => addFiles(e.target.files)}
/>
// 3. Remove onClick / onKeyDown / role="button" / tabIndex from the wrapper div
```

---

### ACC-05 · U05 radio group uses `<div onClick>` — no real `<input type="radio">`

**File:** `src/screens/DisputeEntry.tsx:156–170`
**WCAG:** 4.1.2
**Affects:** U05 "written agreement" field

```tsx
const radioGroup = (field: keyof IntakeData, options: ...) => (
  <div className="flex gap-3 flex-wrap">
    {options.map(opt => (
      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
        <div
          className={`w-4 h-4 rounded-full border-2 ...`}
          onClick={() => update(field, opt.value ...)}   // ← no input
        >
```

Keyboard arrow-key navigation between options does not work. AT cannot announce
selected state. The outer `<label>` at line 228 (`hasWrittenAgreement`) has no
`htmlFor` and is orphaned.

**Fix:**
```tsx
const radioGroup = (field: keyof IntakeData, options: { value: string; label: string }[], groupLabel: string) => (
  <div role="radiogroup" aria-label={groupLabel} className="flex gap-3 flex-wrap">
    {options.map(opt => {
      const radioId = `${field}-${opt.value}`;
      return (
        <label key={opt.value} htmlFor={radioId} className="flex items-center gap-2 cursor-pointer">
          <input type="radio" id={radioId} name={field} value={opt.value}
            checked={data[field] === opt.value}
            onChange={() => update(field, opt.value as IntakeData[typeof field])}
            className="sr-only" />
          <div aria-hidden="true"
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
              ${data[field] === opt.value ? 'border-[var(--color-navy)] bg-[var(--color-navy)]' : 'border-[var(--color-border-2)]'}`}>
            {data[field] === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <span className="text-sm text-[var(--color-ink-2)]">{opt.label}</span>
        </label>
      );
    })}
  </div>
);

// Call site update — remove the orphaned <label>, pass groupLabel:
{radioGroup('hasWrittenAgreement', [...], t(lang, 'hasWrittenAgreement'))}
```

---

## High — material degradation for keyboard and AT users

---

### ACC-06 · `StepBar` progressbar missing `aria-label`

**File:** `src/components/ui.tsx:342`
**WCAG:** 4.1.2
**Affects:** U04–U08

```tsx
<div className="flex items-center gap-1" role="progressbar" aria-valuenow={current + 1} aria-valuemax={steps.length}>
```

ARIA spec requires a progressbar to have an accessible name. JAWS announces
"progress bar 1 of 6" with no screen context.

**Fix:**
```tsx
<div
  className="flex items-center gap-1"
  role="progressbar"
  aria-valuenow={current + 1}
  aria-valuemax={steps.length}
  aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}
>
```

---

### ACC-07 · DocumentViewer back button has no accessible name

**File:** `src/screens/Evidence.tsx:256–260`
**WCAG:** 4.1.2
**Affects:** U07

Icon-only `<button>` with `aria-hidden="true"` SVG and no `aria-label`.
Announced as "button" by all AT.

**Fix:**
```tsx
<button
  onClick={onBack}
  aria-label={lang === 'hi' ? 'वापस जाएं' : 'Go back'}
  className="text-[var(--color-navy-mid)] hover:text-[var(--color-navy)]"
>
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M12 16L8 12l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
</button>
```

---

### ACC-08 · Page navigation `‹`/`›` buttons have no accessible names

**File:** `src/screens/Evidence.tsx:264–266`
**WCAG:** 4.1.2
**Affects:** U07

NVDA announces "less-than sign, button" and "greater-than sign, button".

**Fix:**
```tsx
<button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
  aria-label={lang === 'hi' ? 'पिछला पृष्ठ' : 'Previous page'}
  className="disabled:opacity-30 hover:text-[var(--color-navy)]">
  <span aria-hidden="true">‹</span>
</button>
<span>{t(lang, 'pageOf', page, totalPages)}</span>
<button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
  aria-label={lang === 'hi' ? 'अगला पृष्ठ' : 'Next page'}
  className="disabled:opacity-30 hover:text-[var(--color-navy)]">
  <span aria-hidden="true">›</span>
</button>
```

---

### ACC-09 · Timeline rendered as `<div>` — not an ordered list

**File:** `src/screens/Analysis.tsx:53–56`
**WCAG:** 1.3.1
**Affects:** U09

```tsx
<div className="space-y-6">
  {timelineItems.map((event, i) => (
    <div key={event.id} className="flex gap-4 relative">
```

AT cannot announce "item 2 of 4" or navigate by list item.

**Fix:**
```tsx
<ol className="space-y-6 list-none" aria-label={lang === 'hi' ? 'घटनाओं की समयरेखा' : 'Timeline of events'}>
  {timelineItems.map((event, i) => (
    <li key={event.id} className="flex gap-4 relative">
```

---

### ACC-10 · Delete fact button announces as "multiplication sign"

**File:** `src/screens/Facts.tsx:262`
**WCAG:** 4.1.2
**Affects:** U08

```tsx
<button onClick={() => deleteFact(fact.id)} className="text-xs ... px-2 py-1 rounded transition-colors">
  ✕
</button>
```

`✕` (U+2715) = "multiplication sign" in NVDA. No `aria-label`. Also below 44px touch target.

**Fix:**
```tsx
<button
  onClick={() => deleteFact(fact.id)}
  aria-label={lang === 'hi' ? 'तथ्य हटाएं' : 'Delete fact'}
  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)] rounded transition-colors"
>
  <span aria-hidden="true">✕</span>
</button>
```

---

### ACC-11 · Fact action buttons below 44px minimum touch target

**File:** `src/screens/Facts.tsx:241–266`
**WCAG:** 2.5.5 Target Size (AA in WCAG 2.2)
**Affects:** U08

`size="sm"` = `h-8` = 32px. Delete button `px-2 py-1` ≈ 26px. Both below 44px minimum.

**Fix — apply `min-h-[44px] md:min-h-0` to all action buttons on mobile:**
```tsx
<Button size="sm" variant="primary" className="min-h-[44px] md:min-h-0" onClick={...}>✓ {t(lang, 'confirmFact')}</Button>
<Button size="sm" variant="ghost"   className="min-h-[44px] md:min-h-0" onClick={...}>✎ {t(lang, 'correctFact')}</Button>
<Button size="sm" variant="ghost"   className="min-h-[44px] md:min-h-0" onClick={...}>? {t(lang, 'markUncertain')}</Button>
<Button size="sm" variant="ghost"   className="min-h-[44px] md:min-h-0" onClick={...}>{t(lang, 'markNotRelevant')}</Button>
```

---

## Medium — reduces usability for AT and keyboard users

---

### ACC-12 · Fact card inline edit textarea has no label

**File:** `src/screens/Facts.tsx:203–207`
**WCAG:** 1.3.1
**Affects:** U08 edit mode

No `aria-label`, no `placeholder`. Announced as "edit text" with no context.

**Fix:**
```tsx
<textarea
  value={editText}
  onChange={e => setEditText(e.target.value)}
  aria-label={lang === 'hi' ? 'तथ्य सुधारें' : 'Edit fact statement'}
  placeholder={lang === 'hi' ? 'तथ्य सुधारें…' : 'Edit fact statement…'}
  autoFocus
  className="..."
/>
```

---

### ACC-13 · DocumentViewer new-fact textarea has no label

**File:** `src/screens/Evidence.tsx:341–347`
**WCAG:** 1.3.1
**Affects:** U07 fact-creation flow

Has placeholder only — no persistent label. AT loses context when user starts typing.

**Fix:**
```tsx
<textarea
  value={newFactText}
  onChange={e => setNewFactText(e.target.value)}
  aria-label={lang === 'hi' ? 'नया तथ्य विवरण' : 'New fact statement'}
  placeholder={t(lang, 'factStatementPlaceholder')}
  className="..."
  lang={lang === 'hi' ? 'hi' : 'en'}
  autoFocus
/>
```

---

### ACC-14 · `Card` with `onClick` activates on Enter but not Space

**File:** `src/components/ui.tsx:126`
**WCAG:** 2.1.1 Keyboard

```tsx
onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
```

Space scrolls the page instead of activating.

**Fix:**
```tsx
onKeyDown={onClick ? (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick();
  }
} : undefined}
```

---

### ACC-15 · Language toggle buttons missing `aria-label` and `aria-pressed`

**File:** `src/components/Shell.tsx:112–122` (sidebar), `163–164` (mobile top bar)
**WCAG:** 4.1.2
**Affects:** All screens

`EN` / `हिं` abbreviations have no `aria-pressed` or full-name `aria-label`.

**Fix (both instances):**
```tsx
<button onClick={() => setLang('en')}
  aria-label="Switch to English" aria-pressed={lang === 'en'}
  className={`... ${lang === 'en' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
>EN</button>
<button onClick={() => setLang('hi')}
  aria-label="हिंदी में बदलें" aria-pressed={lang === 'hi'}
  className={`... ${lang === 'hi' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
>हिं</button>
```

---

### ACC-16 · Sidebar main nav buttons missing `aria-current`

**File:** `src/components/Shell.tsx:68–77`
**WCAG:** 4.1.2
**Affects:** All main screens, desktop/tablet

Mobile bottom nav sets `aria-current` (line 181) but the desktop sidebar does not.

**Fix:**
```tsx
<button
  key={item.screen}
  onClick={() => nav(item.screen)}
  aria-current={screen === item.screen ? 'page' : undefined}
  className={`... ${screen === item.screen ? 'bg-white/15 text-white' : '...'}`}
>
```

---

### ACC-17 · Mobile bottom nav buttons should carry explicit `aria-label`

**File:** `src/components/Shell.tsx:176–186`
**WCAG:** 4.1.2
**Affects:** All main screens, mobile

AT derives button name from visible `text-[10px]` span (`item.label.split(' ')[0]`).
"Trust" is ambiguous (truncated from "Trust & Safety"). Add explicit `aria-label`
for clarity.

**Fix:**
```tsx
<button
  key={item.screen}
  onClick={() => nav(item.screen)}
  aria-label={lang === 'hi' ? item.labelHi : item.label}
  aria-current={screen === item.screen ? 'page' : undefined}
  className={`...`}
>
  <span aria-hidden="true" className="text-lg leading-none">{item.icon}</span>
  <span className="text-[10px]">{lang === 'hi' ? item.labelHi.slice(0, 6) : item.label.split(' ')[0]}</span>
</button>
```

---

## Priority summary

| ID | Severity | Component | Screen | File:line |
|----|----------|-----------|--------|-----------|
| ACC-01 | Critical | `Select` | U05, U08 | `ui.tsx:285` |
| ACC-02 | Critical | `Toggle` props not spread | U16 | `ui.tsx:302`, `Export.tsx:79` |
| ACC-03 | Critical | `Checkbox` broken `htmlFor` | Any | `ui.tsx:320` |
| ACC-04 | Critical | File `<input>` hidden from AT | U06 | `Evidence.tsx:97` |
| ACC-05 | Critical | Radio group `<div onClick>` | U05 | `DisputeEntry.tsx:156` |
| ACC-06 | High | `StepBar` no `aria-label` | U04–U08 | `ui.tsx:342` |
| ACC-07 | High | Back button unlabelled | U07 | `Evidence.tsx:256` |
| ACC-08 | High | Page nav `‹›` unlabelled | U07 | `Evidence.tsx:264` |
| ACC-09 | High | Timeline not `<ol>/<li>` | U09 | `Analysis.tsx:53` |
| ACC-10 | High | Delete announces "×" | U08 | `Facts.tsx:262` |
| ACC-11 | High | Fact buttons < 44px | U08 | `Facts.tsx:241` |
| ACC-12 | Medium | Edit textarea no label | U08 | `Facts.tsx:203` |
| ACC-13 | Medium | New-fact textarea no label | U07 | `Evidence.tsx:341` |
| ACC-14 | Medium | Card Space key inactive | All | `ui.tsx:126` |
| ACC-15 | Medium | Lang toggles no `aria-pressed` | All | `Shell.tsx:112` |
| ACC-16 | Medium | Sidebar nav no `aria-current` | All | `Shell.tsx:68` |
| ACC-17 | Medium | Mobile nav `aria-label` | All | `Shell.tsx:176` |