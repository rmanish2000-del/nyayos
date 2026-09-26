# A-050 — Exact Developer Fixes (v2)

**Task:** A-043 Lovable implementation audit vs Figma MVP package
**Date:** 2026-09-26 (v2 — re-verified against live code)

Fixes ordered P0 → P3. Each entry: file, line(s), exact change, test instruction.

---

## P0 — Critical Accessibility (screen reader blockers)

### FIX-01 · ACC-02 — Toggle does NOT spread extra props; `aria-label` silently dropped

**File:** `src/components/ui.tsx:302`

```tsx
// BEFORE
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {

// AFTER
export function Toggle({ checked, onChange, label, ...rest }: { checked: boolean; onChange: (v: boolean) => void; label?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
```

Then spread `{...rest}` onto the `<button>` element inside Toggle.

The entire `<button>` block (lines 303–314 approximately):
```tsx
<button
  type="button"
  role="switch"
  aria-checked={checked}
  onClick={() => onChange(!checked)}
  {...rest}   // ← ADD THIS
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-navy)] focus-visible:ring-offset-2 ${checked ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-border-2)]'}`}
>
```

**Test:** Open Export screen → inspect each Toggle with a screen reader. Verify announced label matches the section label (e.g. "Your narrative").

---

### FIX-02 · ACC-03 — Checkbox has `<label htmlFor={id}>` but no matching `<input>`

**File:** `src/components/ui.tsx:320`

The current implementation uses `<div onClick>` instead of a real `<input type="checkbox">`. Replace the visual-only div with a real hidden input:

```tsx
export function Checkbox({ checked, onChange, label, id: propId }: CheckboxProps) {
  const id = propId ?? useId();
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none" htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"
      />
      {/* visual indicator — driven by CSS :checked or sibling selector */}
      <span
        aria-hidden="true"
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors
          ${checked ? 'bg-[var(--color-navy)] border-[var(--color-navy)]' : 'bg-white border-[var(--color-border-2)]'}`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      {label && <span className="text-sm text-[var(--color-ink)] leading-snug">{label}</span>}
    </label>
  );
}
```

**Test:** Tab to Export consent checkbox → Space bar toggles it. Screen reader announces checked state.

---

### FIX-03 · ACC-04 — Evidence file input is `aria-hidden` — keyboard users cannot upload

**File:** `src/screens/Evidence.tsx:97–105`

```tsx
// BEFORE
<input
  ref={fileRef}
  type="file"
  multiple
  accept=".pdf,.jpg,.jpeg,.png,.docx"
  className="hidden"
  onChange={e => addFiles(e.target.files)}
  aria-hidden="true"
/>

// AFTER
<input
  ref={fileRef}
  type="file"
  multiple
  accept=".pdf,.jpg,.jpeg,.png,.docx"
  className="sr-only"
  onChange={e => addFiles(e.target.files)}
  aria-label={lang === 'hi' ? 'फ़ाइलें चुनें' : 'Choose files to upload'}
/>
```

`sr-only` keeps the input visually hidden but reachable. Remove `aria-hidden="true"`.

**Test:** Tab into drop zone area → Tab once more → file input should receive focus and be keyboard-activatable.

---

### FIX-04 · ACC-05 — Radio buttons in DisputeEntry are `<div onClick>`, not `<input type="radio">`

**File:** `src/screens/DisputeEntry.tsx:156–170`

Replace the `radioGroup` helper:

```tsx
const radioGroup = (field: keyof IntakeData, options: { value: string; label: string }[]) => {
  const groupName = `intake-${field}`;
  return (
    <div className="flex gap-3 flex-wrap" role="radiogroup">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={groupName}
            value={opt.value}
            checked={intake[field] === opt.value}
            onChange={() => update(field, opt.value as IntakeData[typeof field])}
            className="sr-only"
          />
          <span
            aria-hidden="true"
            className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors
              ${intake[field] === opt.value
                ? 'border-[var(--color-navy)] bg-[var(--color-navy)]'
                : 'border-[var(--color-border-2)] bg-white'}`}
          />
          <span className="text-sm text-[var(--color-ink)]">{opt.label}</span>
        </label>
      ))}
    </div>
  );
};
```

Also fix the orphaned label at line ~228: ensure any standalone radio or checkbox input has `id` and matching `htmlFor`.

**Test:** Dispute entry intake step → arrow keys move between radio options; Space/Enter selects.

---

### FIX-05 · ACC-01 — Select label has no `htmlFor`/`id` association

**File:** `src/components/ui.tsx:285`

```tsx
// BEFORE
export function Select({ label, value, onChange, options, className = '' }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-[var(--color-ink-2)]">{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} ...>

// AFTER
import { useId } from 'react';

export function Select({ label, value, onChange, options, className = '' }: SelectProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-semibold text-[var(--color-ink-2)]">{label}</label>}
      <select id={id} value={value} onChange={e => onChange(e.target.value)} ...>
```

**Test:** Click the "Date precision" label → focus moves to the `<select>`.

---

## P1 — High Priority Accessibility + High Mobile

### FIX-06 · ACC-07 — DocumentViewer back button has no `aria-label`

**File:** `src/screens/Evidence.tsx:256–260`

```tsx
// BEFORE
<button onClick={onBack} className="text-[var(--color-navy-mid)] hover:text-[var(--color-navy)]">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">

// AFTER
<button
  onClick={onBack}
  aria-label={lang === 'hi' ? 'दस्तावेज़ सूची पर वापस जाएं' : 'Back to document list'}
  className="text-[var(--color-navy-mid)] hover:text-[var(--color-navy)]"
>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
```

---

### FIX-07 · ACC-08 — DocumentViewer page nav `‹`/`›` buttons have no `aria-label`

**File:** `src/screens/Evidence.tsx:264–266`

```tsx
// BEFORE
<button onClick={() => setPage(p => Math.max(0, p-1))} className="...">‹</button>
<button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} className="...">›</button>

// AFTER
<button
  onClick={() => setPage(p => Math.max(0, p - 1))}
  disabled={page === 0}
  aria-label={lang === 'hi' ? 'पिछला पृष्ठ' : 'Previous page'}
  className="..."
>‹</button>
<button
  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
  disabled={page === totalPages - 1}
  aria-label={lang === 'hi' ? 'अगला पृष्ठ' : 'Next page'}
  className="..."
>›</button>
```

---

### FIX-08 · ACC-09 — Analysis timeline uses `<div>` container, not `<ol>`/`<li>`

**File:** `src/screens/Analysis.tsx:53`

```tsx
// BEFORE
<div className="space-y-6">
  {events.map(ev => (
    <div key={ev.id} className="relative flex gap-4">

// AFTER
<ol className="space-y-6 list-none p-0 m-0" aria-label={lang === 'hi' ? 'समयरेखा' : 'Timeline'}>
  {events.map(ev => (
    <li key={ev.id} className="relative flex gap-4">
      {/* ...existing content... */}
    </li>
  ))}
</ol>
```

---

### FIX-09 · ACC-10 — Facts delete button is `✕` with no `aria-label`

**File:** `src/screens/Facts.tsx:262`

```tsx
// BEFORE
<button onClick={() => deleteFact(fact.id)} className="text-xs text-[var(--color-muted)] hover:text-[var(--color-danger)] px-2 py-1 rounded transition-colors">
  ✕
</button>

// AFTER
<button
  onClick={() => deleteFact(fact.id)}
  aria-label={lang === 'hi' ? `"${fact.statement.slice(0, 30)}..." हटाएं` : `Delete fact: "${fact.statement.slice(0, 30)}..."`}
  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-danger)] rounded transition-colors"
>
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
</button>
```

---

### FIX-10 · ACC-11 — Facts action buttons are `size="sm"` (32px), below 44px touch minimum

**File:** `src/screens/Facts.tsx:241–266`

Add `className="min-h-[44px] md:min-h-8"` to every `<Button size="sm">` in the action row:

```tsx
<Button size="sm" variant="primary"
  className="min-h-[44px] md:min-h-8"
  onClick={() => updateFact(fact.id, { confirmed: true, provenance: 'confirmed' })}>
  ✓ {t(lang, 'confirmFact')}
</Button>
// repeat pattern for all four action buttons
```

---

### FIX-11 · ACC-12 — Edit textarea has no `aria-label`

**File:** `src/screens/Facts.tsx:203–207`

```tsx
// BEFORE
<Textarea
  value={editText}
  onChange={setEditText}
  className="mb-2"
/>

// AFTER
<Textarea
  value={editText}
  onChange={setEditText}
  aria-label={lang === 'hi' ? 'तथ्य संपादित करें' : 'Edit fact statement'}
  className="mb-2"
/>
```

---

### FIX-12 · ACC-13 — DocumentViewer new-fact textarea has no `aria-label`

**File:** `src/screens/Evidence.tsx:341–347`

```tsx
// BEFORE
<Textarea
  value={newFact}
  onChange={setNewFact}
  placeholder={lang === 'hi' ? 'नया तथ्य लिखें…' : 'Write a new fact…'}
  className="mb-2 text-sm"
/>

// AFTER
<Textarea
  value={newFact}
  onChange={setNewFact}
  aria-label={lang === 'hi' ? 'नया तथ्य' : 'New fact statement'}
  placeholder={lang === 'hi' ? 'नया तथ्य लिखें…' : 'Write a new fact…'}
  className="mb-2 text-sm"
/>
```

---

### FIX-13 · ACC-14 — Card `onKeyDown` handles Enter only, not Space

**File:** `src/components/ui.tsx:126`

```tsx
// BEFORE
onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}

// AFTER
onKeyDown={onClick ? (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick();
  }
} : undefined}
```

---

### FIX-14 · ACC-06 — StepBar `role="progressbar"` missing `aria-label`

**File:** `src/components/ui.tsx:342`

```tsx
// BEFORE
<div className="flex items-center gap-1" role="progressbar" aria-valuenow={current + 1} aria-valuemax={steps.length}>

// AFTER
<div
  className="flex items-center gap-1"
  role="progressbar"
  aria-valuenow={current + 1}
  aria-valuemin={1}
  aria-valuemax={steps.length}
  aria-label={`Step ${current + 1} of ${steps.length}`}
>
```

---

### FIX-15 · ACC-15 — Language toggle buttons have no `aria-label` or `aria-pressed`

**File:** `src/components/Shell.tsx:112–122` (sidebar) and `163–164` (top bar)

```tsx
// BEFORE (sidebar, line 112)
<button onClick={() => setLang('en')} className={`text-xs px-2 py-0.5 rounded ${lang === 'en' ? '...' : '...'}`}>EN</button>
<button onClick={() => setLang('hi')} className={`text-xs px-2 py-0.5 rounded ${lang === 'hi' ? '...' : '...'}`}>हि</button>

// AFTER
<button
  onClick={() => setLang('en')}
  aria-label="Switch to English"
  aria-pressed={lang === 'en'}
  className={`text-xs px-2 py-0.5 rounded ${lang === 'en' ? '...' : '...'}`}
>EN</button>
<button
  onClick={() => setLang('hi')}
  aria-label="हिंदी में बदलें"
  aria-pressed={lang === 'hi'}
  className={`text-xs px-2 py-0.5 rounded ${lang === 'hi' ? '...' : '...'}`}
>हि</button>
```

Apply same pattern to top-bar equivalents at lines 163–164.

---

### FIX-16 · ACC-16 — Sidebar main nav buttons missing `aria-current`

**File:** `src/components/Shell.tsx:68–77`

```tsx
// BEFORE
<button key={item.screen} onClick={() => nav(item.screen)} className={`...`}>

// AFTER
<button
  key={item.screen}
  onClick={() => nav(item.screen)}
  aria-current={screen === item.screen ? 'page' : undefined}
  className={`...`}
>
```

---

### FIX-17 · ACC-17 — Mobile bottom nav buttons have no explicit `aria-label`

**File:** `src/components/Shell.tsx:175–187`

```tsx
// BEFORE
<button key={item.screen} onClick={() => nav(item.screen)} aria-current={screen === item.screen ? 'page' : undefined} className={`...`}>

// AFTER
<button
  key={item.screen}
  onClick={() => nav(item.screen)}
  aria-current={screen === item.screen ? 'page' : undefined}
  aria-label={lang === 'hi' ? item.labelHi : item.label}
  className={`...`}
>
```

---

### FIX-18 · MOB-01 — No step position indicator on mobile during dispute flow

**File:** `src/components/Shell.tsx:133–167` (top bar)

Insert after logo div, before `ml-auto` controls:

```tsx
{inDispute && (() => {
  const stepIdx = DISPUTE_STEPS.findIndex(d => d.screen === screen);
  const step = DISPUTE_STEPS[stepIdx];
  return step ? (
    <span className="md:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none
      text-xs font-semibold text-[var(--color-navy)] bg-[var(--color-amber-100)]
      border border-[var(--color-amber-200)] px-2.5 py-0.5 rounded-full whitespace-nowrap">
      {stepIdx + 1} / {DISPUTE_STEPS.length} — {lang === 'hi' ? step.labelHi : step.short}
    </span>
  ) : null;
})()}
```

---

### FIX-19 · MOB-02 — Bottom nav always shows main tabs during dispute flow

**File:** `src/components/Shell.tsx:175–187`

Wrap existing `<nav>` with `{inMain && ...}` and add a dispute strip:

```tsx
{inMain ? (
  <nav className="md:hidden flex border-t border-[var(--color-border)] bg-white">
    {MAIN_NAV.slice(0, 4).map(item => (
      <button
        key={item.screen}
        onClick={() => nav(item.screen)}
        aria-current={screen === item.screen ? 'page' : undefined}
        aria-label={lang === 'hi' ? item.labelHi : item.label}
        className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition-colors
          ${screen === item.screen ? 'text-[var(--color-navy)]' : 'text-[var(--color-muted)]'}`}
      >
        <span aria-hidden="true" className="text-lg leading-none">{item.icon}</span>
        <span className="text-[10px]">{lang === 'hi' ? item.labelHi : item.label}</span>
      </button>
    ))}
  </nav>
) : inDispute ? (
  <div className="md:hidden flex items-center justify-between border-t border-[var(--color-border)] bg-white px-4 py-2.5 h-14">
    <button
      onClick={back}
      disabled={!canGoBack}
      aria-label={lang === 'hi' ? 'पिछला चरण' : 'Previous step'}
      className="text-sm font-medium text-[var(--color-navy-mid)] disabled:opacity-30 flex items-center gap-1.5 min-w-[44px] min-h-[44px]"
    >
      ← {lang === 'hi' ? 'पिछला' : 'Prev'}
    </button>
    <span className="text-xs font-semibold text-[var(--color-ink)] text-center flex-1 px-2">
      {lang === 'hi'
        ? DISPUTE_STEPS.find(d => d.screen === screen)?.labelHi
        : DISPUTE_STEPS.find(d => d.screen === screen)?.short}
    </span>
    <span className="text-xs text-[var(--color-muted)] whitespace-nowrap">
      {DISPUTE_STEPS.findIndex(d => d.screen === screen) + 1} / {DISPUTE_STEPS.length}
    </span>
  </div>
) : null}
```

---

### FIX-20 · MOB-04 — All screen CTAs need sticky bottom strip on mobile

**Files:** `DisputeEntry.tsx:72`, `DisputeEntry.tsx:288`, `Evidence.tsx:184`, `Facts.tsx:273`, `Analysis.tsx:95`, `Export.tsx:106`

Pattern to apply to each CTA block:

```tsx
{/* Spacer */}
<div className="h-20 md:hidden" aria-hidden="true" />

{/* Sticky CTA */}
<div className="
  fixed bottom-0 left-0 right-0
  md:relative md:bottom-auto md:left-auto md:right-auto
  bg-white md:bg-transparent
  border-t md:border-0 border-[var(--color-border)]
  px-4 py-3 md:px-0 md:py-0 md:mt-6
  flex gap-3 z-30
  shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:shadow-none
">
  {showBack && (
    <Button variant="secondary" onClick={onBack} className="flex-shrink-0">
      {lang === 'hi' ? 'वापस' : 'Back'}
    </Button>
  )}
  <Button variant="amber" onClick={handleContinue} fullWidth>
    {/* screen-specific label */}
  </Button>
</div>
```

Screens: `WhatHappened` (no back), `Intake`, `EvidenceLocker`, `FactList`, `Timeline`, `ExportPreview`.

---

## P2 — High UX / Medium Mobile

### FIX-21 · UX-01 — Drop zone drag-active uses navy instead of amber

**File:** `src/screens/Evidence.tsx:87`

```tsx
// BEFORE
? 'border-[var(--color-navy-mid)] bg-[var(--color-navy)]/5'

// AFTER
? 'border-[var(--color-amber)] bg-[var(--color-amber-50)]'
```

---

### FIX-22 · UX-02 — Uploading state shows no progress bar

**File:** `src/screens/Evidence.tsx:168–172`

```tsx
// BEFORE — only scanning has bar
{ev.status === 'scanning' && (
  <div className="mt-2 h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
    <div className="h-full bg-[var(--color-amber)] rounded-full animate-pulse" style={{ width: '60%' }} />
  </div>
)}

// AFTER — both states get bar
{(ev.status === 'uploading' || ev.status === 'scanning') && (
  <div className="mt-2 h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
    <div
      className="h-full bg-[var(--color-amber)] rounded-full animate-pulse"
      style={{ width: ev.status === 'uploading' ? '35%' : '65%' }}
      role="progressbar"
      aria-valuenow={ev.status === 'uploading' ? 35 : 65}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ev.status === 'uploading'
        ? (lang === 'hi' ? 'अपलोड हो रहा है' : 'Uploading')
        : (lang === 'hi' ? 'स्कैन हो रहा है' : 'Scanning')}
    />
  </div>
)}
```

---

### FIX-23 · UX-04 — Fact cards missing state-coded 4px left border

**File:** `src/screens/Facts.tsx:198`

```tsx
// Helper
function factBorderClass(fact: Fact): string {
  if (fact.confirmed)                       return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-success)]';
  if (fact.provenance === 'uncertain')      return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-warning)]';
  if (fact.provenance === 'corrected')      return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-navy)]';
  if (fact.provenance === 'not-relevant')   return 'border-[var(--color-border)] opacity-50';
  return 'border-[var(--color-border)]';
}

// Usage (line 198):
<div className={`bg-white rounded-[var(--radius-lg)] border p-4 transition-colors ${factBorderClass(fact)}`}>
```

---

### FIX-24 · UX-07 — Export summary uses 2-col key-value, not 3-col stat cards

**File:** `src/screens/Export.tsx:86–104`

Replace the existing `div.bg-surface-2` block with:

```tsx
<div className="grid grid-cols-3 gap-3 mb-6">
  {[
    { value: confirmedFacts.length, label: lang === 'hi' ? 'पुष्ट तथ्य' : 'Confirmed facts' },
    { value: readyDocs.length,      label: lang === 'hi' ? 'दस्तावेज़' : 'Documents' },
    { value: dispute.parties.length,label: lang === 'hi' ? 'पक्षकार' : 'Parties' },
  ].map(({ value, label }) => (
    <div key={label}
      className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-4 text-center">
      <div className="text-2xl font-bold text-[var(--color-navy)]">{value}</div>
      <div className="text-xs text-[var(--color-muted)] mt-1 leading-tight">{label}</div>
    </div>
  ))}
</div>
```

---

### FIX-25 · MOB-03 — DocumentViewer fact panel stacks full-height, needs bottom sheet on mobile

**File:** `src/screens/Evidence.tsx:250`

```tsx
// Add near top of DocumentViewer component:
const [sheetOpen, setSheetOpen] = useState(false);

// Outer wrapper:
<div className="relative flex flex-col lg:flex-row h-full max-h-full overflow-hidden">
  {/* Document panel (unchanged) */}
  <div className="flex-1 flex flex-col bg-[var(--color-surface-2)] overflow-hidden">
    {/* ...existing content... */}
  </div>

  {/* Fact panel — bottom sheet on mobile */}
  <div className={`
    w-full lg:w-80 flex-shrink-0 bg-white
    border-t lg:border-t-0 lg:border-l border-[var(--color-border)]
    overflow-y-auto
    fixed bottom-0 left-0 right-0 z-40
    lg:relative lg:z-auto
    transition-transform duration-300 ease-out
    max-h-[65vh] lg:max-h-none rounded-t-2xl lg:rounded-none
    ${sheetOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
  `}>
    <div
      className="lg:hidden flex justify-center py-3 cursor-pointer"
      role="button"
      aria-label={lang === 'hi' ? 'बंद करें' : 'Close panel'}
      onClick={() => setSheetOpen(false)}
    >
      <div className="w-10 h-1 rounded-full bg-[var(--color-border-2)]" />
    </div>
    {/* ...existing fact panel content unchanged... */}
  </div>

  {/* FAB — mobile only */}
  <button
    onClick={() => setSheetOpen(o => !o)}
    aria-label={sheetOpen
      ? (lang === 'hi' ? 'पैनल बंद करें' : 'Close panel')
      : (lang === 'hi' ? 'तथ्य लिंक करें' : 'Link facts')}
    className="lg:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full
      bg-[var(--color-amber)] text-[var(--color-navy)] font-bold text-xl
      shadow-[var(--shadow-lg)] flex items-center justify-center"
  >
    {sheetOpen ? '✕' : '+'}
  </button>
</div>
```

---

### FIX-26 · MOB-05 — `WhatHappened` textarea too tall on mobile

**File:** `src/screens/DisputeEntry.tsx:57`

```tsx
// BEFORE
className="min-h-64 text-base leading-relaxed"

// AFTER
className="min-h-40 md:min-h-64 text-base leading-relaxed"
```

---

### FIX-27 · MOB-06 — Facts action row wraps to 3+ lines on 375px

**File:** `src/screens/Facts.tsx:241`

```tsx
// BEFORE
<div className="flex flex-wrap gap-1.5">

// AFTER — 2×2 grid on mobile, flex row on md+
<div className="grid grid-cols-2 gap-1.5 md:flex md:flex-wrap md:gap-1.5">
  {/* existing buttons unchanged, add className="min-h-[44px] md:min-h-8" to each */}
```

---

## P3 — Low Priority / Polish

### FIX-28 · UX-06 — Timeline line is 1px, slightly off-centre

**File:** `src/screens/Analysis.tsx:51`

```tsx
// BEFORE
<div className="absolute left-[22px] top-4 bottom-4 w-px bg-[var(--color-border)]" aria-hidden="true" />

// AFTER
<div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-[var(--color-border)] z-0" aria-hidden="true" />
```

---

### FIX-29 · UX-08 — U17 hash missing copy button

**File:** `src/screens/Export.tsx:172–175`

```tsx
// BEFORE
<code className="text-xs text-[var(--color-ink-2)] font-mono break-all block bg-[var(--color-surface-2)] px-2 py-1.5 rounded">
  {mockHash}
</code>

// AFTER
<div className="flex items-center gap-2 bg-[var(--color-surface-2)] rounded px-2 py-1.5">
  <code className="text-xs text-[var(--color-ink-2)] font-mono break-all flex-1 select-all">
    {mockHash}
  </code>
  <button
    onClick={() => navigator.clipboard?.writeText(mockHash)}
    aria-label={lang === 'hi' ? 'हैश कॉपी करें' : 'Copy hash'}
    className="flex-shrink-0 p-1.5 min-h-[44px] min-w-[44px] flex items-center justify-center
      text-[var(--color-muted)] hover:text-[var(--color-navy)] transition-colors rounded"
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  </button>
</div>
```

---

### FIX-30 · UX-09 — Date+precision grid equal columns, spec wants fixed 128px precision

**File:** `src/screens/DisputeEntry.tsx:246, 261`

```tsx
// BEFORE (both instances)
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

// AFTER
<div className="grid grid-cols-1 sm:grid-cols-[1fr_128px] gap-4 sm:gap-2">
  {/* date Input: unchanged */}
  {/* precision Select: add className="sm:self-end" */}
</div>
```

---

### FIX-31 · UX-05 — Confirmed badge inline with action buttons, no separator

**File:** `src/screens/Facts.tsx:242`

Wrap entire action row in a `pt-2 border-t` container and separate the confirmed Badge from action buttons with a `|` divider. Full fix in `ux-gaps.md:UX-05`.

---

### FIX-32 · UX-03 — Fact link panel shows no ProvenanceBadge per fact

**File:** `src/screens/Evidence.tsx:311`

Add a `<ProvenanceBadge type={fact.provenance} lang={lang} />` below each fact statement in the link panel. Full fix in `ux-gaps.md:UX-03`.

---

## Fix count summary

| Priority | Count | IDs |
|----------|-------|-----|
| P0 — Critical accessibility | 5 | FIX-01…05 |
| P1 — High accessibility + high mobile | 15 | FIX-06…20 |
| P2 — High UX / medium mobile | 7 | FIX-21…27 |
| P3 — Low / polish | 5 | FIX-28…32 |
| **Total** | **32** | |
