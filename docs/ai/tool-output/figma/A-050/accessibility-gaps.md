# A-050 — Accessibility Gaps

**Task:** A-043 implementation audit vs Figma MVP package  
**Standard:** WCAG 2.1 AA  
**Date:** 2026-09-26  
**Source:** Static analysis of `src/components/ui.tsx`, `src/components/Shell.tsx`, `src/screens/*.tsx`

---

## Critical — blocks screen reader users

---

### ACC-01 · `Select` label not associated with control

**File:** `src/components/ui.tsx:193`  
**WCAG:** 1.3.1 Info and Relationships  
**Affects:** U05 (date precision × 2, nature of agreement, role)

`<label>` is rendered above `<select>` with no `htmlFor`/`id` pairing. The label is visually correct but programmatically orphaned. VoiceOver, NVDA, and JAWS skip to the select and announce "combo box" with no name.

**Fix:**

```tsx
// ui.tsx — Select
export function Select({ label, value, onChange, options, className = '', id }: SelectProps & { id?: string }) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={selectId} className="text-sm font-semibold text-[var(--color-ink-2)]">{label}</label>}
      <select id={selectId} value={value} onChange={e => onChange(e.target.value)} className={`... ${className}`}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
```

---

### ACC-02 · `Toggle` switch has no accessible name

**File:** `src/components/ui.tsx:254`  
**WCAG:** 4.1.2 Name, Role, Value  
**Affects:** U16 (5 privacy toggles)

`<button role="switch" aria-checked={...}>` has no `aria-label` or visible text child. It announces as "switch" with no context. User cannot know which setting the toggle controls without visual inspection.

**Fix:**

```tsx
// ui.tsx — Toggle
<button
  role="switch"
  aria-checked={checked}
  aria-label={label}        // ← add
  onClick={() => onChange(!checked)}
  className={`...`}
>
  <span aria-hidden="true" className={`...`} />
</button>
```

The `{label && <span>}` outside the button can remain for sighted users; the `aria-label` names the button for AT users.

---

### ACC-03 · `Checkbox` implemented as `<div>`, not `<input type="checkbox">`

**File:** `src/components/ui.tsx:273`  
**WCAG:** 4.1.2 Name, Role, Value  
**Affects:** Any screen using `Checkbox`

The visible checkbox is a styled `<div onClick>`. There is no `<input type="checkbox">`. Consequences:
- Space key does not activate (only mouse click works)
- Screen readers cannot discover or announce the checked state
- No value submitted in any `<form>`
- iOS Switch Control cannot interact

**Fix:**

```tsx
export function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  const cbId = id ?? `cb-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none" htmlFor={cbId}>
      <input
        id={cbId}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"                          // visually hidden, AT-visible
      />
      <div
        aria-hidden="true"
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors
          ${checked ? 'bg-[var(--color-navy)] border-[var(--color-navy)]' : 'border-[var(--color-border-2)] bg-white'}`}
      >
        {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      {label && <span className="text-sm text-[var(--color-ink-2)] leading-5">{label}</span>}
    </label>
  );
}
```

---

### ACC-04 · Upload `<input type="file">` marked `aria-hidden="true"`

**File:** `src/screens/Evidence.tsx:68`  
**WCAG:** 1.3.1 Info and Relationships  
**Affects:** U06 Evidence Locker

The real file input is removed from the accessibility tree. The surrounding `<div role="button">` activates it via `.click()` — fragile in AT environments. iOS VoiceOver and Windows Narrator cannot discover any upload control.

**Fix:** Remove `aria-hidden` and use CSS-only hiding; layer it over the drop zone so the native control is discoverable:

```tsx
// Evidence.tsx — inside drop zone div
<input
  ref={fileRef}
  type="file"
  multiple
  accept=".pdf,.jpg,.jpeg,.png,.docx"
  aria-label={t(lang, 'uploadDocuments')}
  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
  onChange={e => addFiles(e.target.files)}
  // remove aria-hidden
/>
```

Make the drop zone `position: relative` (add `relative` class) so the overlay positions correctly.

---

## High — material degradation for keyboard and AT users

---

### ACC-05 · `StepBar` progressbar missing `aria-label`

**File:** `src/components/ui.tsx:292`  
**WCAG:** 4.1.2  
**Affects:** U04–U17

`role="progressbar"` with `aria-valuenow` and `aria-valuemax` but no `aria-label` or `aria-labelledby`. ARIA spec requires a progressbar to have an accessible name. JAWS announces it as "progress bar 1 of 6" with no screen context.

**Fix:**

```tsx
<div
  role="progressbar"
  aria-valuenow={current + 1}
  aria-valuemax={steps.length}
  aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}
  className="flex items-center gap-1"
>
```

---

### ACC-06 · Fact action buttons below 44px minimum touch target

**File:** `src/screens/Facts.tsx:135–165`  
**WCAG:** 2.5.5 Target Size (AA in 2.2)  
**Affects:** U08 on all viewports; worst on mobile

`size="sm"` buttons are `h-8` (32px). The delete button (`✕`) is `px-2 py-1` ≈ 26px tall. Both are below the 44px minimum.

**Fix:**

```tsx
// Facts.tsx — action row
<div className="flex flex-wrap gap-1.5 items-center">
  <Button
    size="sm"
    className="min-h-[44px] md:min-h-0"
    variant="primary"
    onClick={() => updateFact(fact.id, { confirmed: true, provenance: 'confirmed' })}
  >
    ✓ {t(lang, 'confirmFact')}
  </Button>
  {/* … other buttons same pattern … */}
  <button
    onClick={() => deleteFact(fact.id)}
    aria-label={lang === 'hi' ? 'तथ्य हटाएं' : 'Delete fact'}
    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)] rounded transition-colors"
  >
    <span aria-hidden="true">✕</span>
  </button>
</div>
```

---

### ACC-07 · Document viewer back button has no accessible label

**File:** `src/screens/Evidence.tsx:188`  
**WCAG:** 4.1.2  
**Affects:** U07

Icon-only `<button>` with SVG arrow and no `aria-label`. Announced as "button" by all AT.

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

### ACC-08 · Page navigation buttons (U07) have no accessible labels

**File:** `src/screens/Evidence.tsx:198`  
**WCAG:** 4.1.2  
**Affects:** U07

`‹` and `›` characters in buttons. NVDA announces "less-than sign, button" and "greater-than sign, button".

**Fix:**

```tsx
<button
  onClick={() => setPage(p => Math.max(1, p - 1))}
  disabled={page === 1}
  aria-label={lang === 'hi' ? 'पिछला पृष्ठ' : 'Previous page'}
  className="disabled:opacity-30 hover:text-[var(--color-navy)]"
>
  <span aria-hidden="true">‹</span>
</button>
<span>{t(lang, 'pageOf', page, totalPages)}</span>
<button
  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
  disabled={page === totalPages}
  aria-label={lang === 'hi' ? 'अगला पृष्ठ' : 'Next page'}
  className="disabled:opacity-30 hover:text-[var(--color-navy)]"
>
  <span aria-hidden="true">›</span>
</button>
```

---

### ACC-09 · Timeline not marked as an ordered list

**File:** `src/screens/Analysis.tsx:60`  
**WCAG:** 1.3.1  
**Affects:** U09

Timeline events are rendered as `<div>` siblings. The numbered sequence is visible to sighted users only. Screen readers cannot announce "item 3 of 4" or navigate by list item.

**Fix:**

```tsx
<ol
  className="relative space-y-6"
  aria-label={lang === 'hi' ? 'घटनाओं की समयरेखा' : 'Timeline of events'}
>
  {timelineItems.map((event, i) => (
    <li key={event.id} className="flex gap-4 relative">
      ...
    </li>
  ))}
</ol>
```

---

## Medium — reduces usability for AT and keyboard users

---

### ACC-10 · `Card` with `onClick` activates on Enter but not Space

**File:** `src/components/ui.tsx:145`  
**WCAG:** 2.1.1 Keyboard

`onKeyDown` handles `Enter` only. ARIA `role="button"` spec requires Space to also activate. Space currently scrolls the page.

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

### ACC-11 · Fact card inline edit textarea has no label

**File:** `src/screens/Facts.tsx:99`  
**WCAG:** 1.3.1  
**Affects:** U08 edit mode

Inline edit textarea has no `<label>`, no `aria-label`, no `placeholder`. Announced as "edit text" with no context.

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

### ACC-12 · Language toggle buttons missing `aria-pressed` and expanded names

**File:** `src/components/Shell.tsx:88, 168`  
**WCAG:** 4.1.2  
**Affects:** All screens, sidebar and mobile top bar

`EN` and `हिं` abbreviations are announced literally. No `aria-pressed` or `aria-label` to indicate current selection or full language name.

**Fix (both sidebar and mobile instances):**

```tsx
<button
  onClick={() => setLang('en')}
  aria-label="Switch to English"
  aria-pressed={lang === 'en'}
  className={`...`}
>EN</button>
<button
  onClick={() => setLang('hi')}
  aria-label="हिंदी में बदलें"
  aria-pressed={lang === 'hi'}
  className={`...`}
>हिं</button>
```

---

### ACC-13 · Mobile bottom nav buttons missing `aria-label`

**File:** `src/components/Shell.tsx:143`  
**WCAG:** 4.1.2

Icon characters `◫` `≡` `⚙` `🛡` are announced verbosely by AT (`"white square with upper right quadrant"`, etc.). Labels are 10px truncated text — not machine-readable names.

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

### ACC-14 · U05 radio group implemented with `<div onClick>`, not `<input type="radio">`

**File:** `src/screens/DisputeEntry.tsx` — `radioGroup()` function  
**WCAG:** 4.1.2  
**Affects:** U05 "written agreement" field

Same pattern as ACC-03 (Checkbox). The radio dot is a `<div onClick>`. No real `<input type="radio">`. Keyboard arrow-key navigation between options does not work. AT cannot announce selected state.

**Fix:**

```tsx
const radioGroup = (field: keyof IntakeData, options: { value: string; label: string }[], name: string) => (
  <div role="radiogroup" aria-label={name} className="flex gap-3 flex-wrap">
    {options.map(opt => {
      const id = `${field}-${opt.value}`;
      return (
        <label key={opt.value} htmlFor={id} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            id={id}
            name={field}
            value={opt.value}
            checked={data[field] === opt.value}
            onChange={() => update(field, opt.value as IntakeData[typeof field])}
            className="sr-only"
          />
          <div
            aria-hidden="true"
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
              ${data[field] === opt.value ? 'border-[var(--color-navy)] bg-[var(--color-navy)]' : 'border-[var(--color-border-2)]'}`}
          >
            {data[field] === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <span className="text-sm text-[var(--color-ink-2)]">{opt.label}</span>
        </label>
      );
    })}
  </div>
);
```

---

## Priority summary

| ID | Severity | Component | Screen |
|----|----------|-----------|--------|
| ACC-01 | Critical | `Select` | U05 |
| ACC-02 | Critical | `Toggle` | U16 |
| ACC-03 | Critical | `Checkbox` | Any |
| ACC-04 | Critical | `EvidenceLocker` | U06 |
| ACC-05 | High | `StepBar` | U04–U17 |
| ACC-06 | High | `FactList` | U08 |
| ACC-07 | High | `DocumentViewer` | U07 |
| ACC-08 | High | `DocumentViewer` | U07 |
| ACC-09 | High | `Timeline` | U09 |
| ACC-10 | Medium | `Card` | All |
| ACC-11 | Medium | `FactList` | U08 |
| ACC-12 | Medium | `Shell` | All |
| ACC-13 | Medium | `Shell` | All |
| ACC-14 | Medium | `Intake` | U05 |
