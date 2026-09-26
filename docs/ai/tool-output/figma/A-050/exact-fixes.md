# A-050 — Exact Fixes

**Task:** A-043 implementation audit vs Figma MVP package  
**Date:** 2026-09-26  
**Format:** Ready-to-apply diffs. All paths relative to `src/`.

Fixes are ordered P0 → P3. Apply P0 and P1 before any visual pass.

---

## P0 — Apply first (blocks AT users)

---

### FIX-01 · `Select` — wire `htmlFor`/`id`

**File:** `src/components/ui.tsx`  
**Covers:** ACC-01

```tsx
// BEFORE
interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({ label, value, onChange, options, className = '' }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-semibold text-[var(--color-ink-2)]">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-2)] bg-white text-[var(--color-ink)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-mid)] ${className}`}
      >

// AFTER
interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  id?: string;
}

export function Select({ label, value, onChange, options, className = '', id }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={selectId} className="text-sm font-semibold text-[var(--color-ink-2)]">{label}</label>}
      <select
        id={selectId}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-2)] bg-white text-[var(--color-ink)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-mid)] ${className}`}
      >
```

---

### FIX-02 · `Toggle` — add `aria-label`

**File:** `src/components/ui.tsx`  
**Covers:** ACC-02

```tsx
// BEFORE
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-border-2)]'}`}
      >

// AFTER
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[var(--color-navy)]' : 'bg-[var(--color-border-2)]'}`}
      >
```

---

### FIX-03 · `Checkbox` — replace `<div>` with real `<input type="checkbox">`

**File:** `src/components/ui.tsx`  
**Covers:** ACC-03

```tsx
// REPLACE entire Checkbox function:
export function Checkbox({ checked, onChange, label, id }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  id?: string;
}) {
  const cbId = id ?? `cb-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none" htmlFor={cbId}>
      <input
        id={cbId}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        aria-hidden="true"
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors
          ${checked ? 'bg-[var(--color-navy)] border-[var(--color-navy)]' : 'border-[var(--color-border-2)] bg-white'}`}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm text-[var(--color-ink-2)] leading-5">{label}</span>}
    </label>
  );
}
```

---

### FIX-04 · Evidence Locker — remove `aria-hidden` from file `<input>`

**File:** `src/screens/Evidence.tsx`  
**Covers:** ACC-04

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

// AFTER — overlay input, fully in AT tree
<input
  ref={fileRef}
  type="file"
  multiple
  accept=".pdf,.jpg,.jpeg,.png,.docx"
  aria-label={t(lang, 'uploadDocuments')}
  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
  onChange={e => addFiles(e.target.files)}
/>
```

Also add `relative` to the drop zone wrapper `className`:

```tsx
// BEFORE
className={`border-2 border-dashed rounded-[var(--radius-lg)] p-8 text-center mb-6 transition-colors cursor-pointer
  ${dragging ? ... : ...}`}

// AFTER
className={`relative border-2 border-dashed rounded-[var(--radius-lg)] p-8 text-center mb-6 transition-colors cursor-pointer
  ${dragging
    ? 'border-[var(--color-amber)] bg-[var(--color-amber-50)]'
    : 'border-[var(--color-border-2)] hover:border-[var(--color-navy-mid)] hover:bg-[var(--color-surface-2)]'
  }`}
```

Remove the `onClick`, `onKeyDown`, and `role="button"` / `tabIndex` from the wrapper div — the overlay `<input>` is now the interactive target.

---

### FIX-05 · U05 radio group — replace `<div onClick>` with real `<input type="radio">`

**File:** `src/screens/DisputeEntry.tsx`  
**Covers:** ACC-14

```tsx
// REPLACE radioGroup() helper:
const radioGroup = (field: keyof IntakeData, options: { value: string; label: string }[], groupLabel: string) => (
  <div role="radiogroup" aria-label={groupLabel} className="flex gap-3 flex-wrap">
    {options.map(opt => {
      const radioId = `${field}-${opt.value}`;
      return (
        <label key={opt.value} htmlFor={radioId} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            id={radioId}
            name={field}
            value={opt.value}
            checked={data[field] === opt.value}
            onChange={() => update(field, opt.value as IntakeData[typeof field])}
            className="sr-only"
          />
          <div
            aria-hidden="true"
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
              ${data[field] === opt.value
                ? 'border-[var(--color-navy)] bg-[var(--color-navy)]'
                : 'border-[var(--color-border-2)]'}`}
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

Update the call site to pass `groupLabel`:

```tsx
// BEFORE
{radioGroup('hasWrittenAgreement', [...])}

// AFTER
{radioGroup('hasWrittenAgreement', [...], t(lang, 'hasWrittenAgreement'))}
```

---

## P1 — Apply second (major UX / navigation failures)

---

### FIX-06 · `StepBar` — add `aria-label`

**File:** `src/components/ui.tsx`  
**Covers:** ACC-05

```tsx
// BEFORE
<div className="flex items-center gap-1" role="progressbar" aria-valuenow={current + 1} aria-valuemax={steps.length}>

// AFTER
<div
  className="flex items-center gap-1"
  role="progressbar"
  aria-valuenow={current + 1}
  aria-valuemax={steps.length}
  aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}
>
```

---

### FIX-07 · `Card` — activate on Space in addition to Enter

**File:** `src/components/ui.tsx`  
**Covers:** ACC-10

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

### FIX-08 · Document viewer — label back button and page nav buttons

**File:** `src/screens/Evidence.tsx`  
**Covers:** ACC-07, ACC-08

```tsx
// Back button — BEFORE
<button onClick={onBack} className="text-[var(--color-navy-mid)] hover:text-[var(--color-navy)]">
  <svg ...>...</svg>
</button>

// Back button — AFTER
<button
  onClick={onBack}
  aria-label={lang === 'hi' ? 'वापस जाएं' : 'Go back'}
  className="text-[var(--color-navy-mid)] hover:text-[var(--color-navy)]"
>
  <svg aria-hidden="true" ...>...</svg>
</button>

// Prev page — BEFORE
<button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="disabled:opacity-30 hover:text-[var(--color-navy)]">‹</button>

// Prev page — AFTER
<button
  onClick={() => setPage(p => Math.max(1, p - 1))}
  disabled={page === 1}
  aria-label={lang === 'hi' ? 'पिछला पृष्ठ' : 'Previous page'}
  className="disabled:opacity-30 hover:text-[var(--color-navy)]"
>
  <span aria-hidden="true">‹</span>
</button>

// Next page — AFTER (same pattern)
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

### FIX-09 · Timeline — semantic `<ol>/<li>`

**File:** `src/screens/Analysis.tsx`  
**Covers:** ACC-09

```tsx
// BEFORE
<div className="space-y-6">
  {timelineItems.map((event, i) => (
    <div key={event.id} className="flex gap-4 relative">

// AFTER
<ol
  className="space-y-6"
  aria-label={lang === 'hi' ? 'घटनाओं की समयरेखा' : 'Timeline of events'}
>
  {timelineItems.map((event, i) => (
    <li key={event.id} className="flex gap-4 relative list-none">
```

---

### FIX-10 · Shell — mobile step indicator + dispute nav strip

**File:** `src/components/Shell.tsx`  
**Covers:** MOB-01, MOB-02

Add step chip to the top bar (inside `<header>`):

```tsx
// Shell.tsx — inside <header>, between back button and right controls
{inDispute && activeDispute && (
  <span className="md:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none text-xs font-semibold text-[var(--color-navy)] bg-[var(--color-amber-100)] border border-[var(--color-amber-200)] px-2.5 py-0.5 rounded-full whitespace-nowrap">
    {DISPUTE_STEPS.findIndex(d => d.screen === screen) + 1}
    {' / '}
    {DISPUTE_STEPS.length}
    {' — '}
    {lang === 'hi'
      ? DISPUTE_STEPS.find(d => d.screen === screen)?.labelHi
      : DISPUTE_STEPS.find(d => d.screen === screen)?.short}
  </span>
)}
```

Replace bottom `<nav>` with conditional:

```tsx
// Shell.tsx — BEFORE
<nav className="md:hidden flex border-t border-[var(--color-border)] bg-white">
  {MAIN_NAV.slice(0, 4).map(item => ( ... ))}
</nav>

// Shell.tsx — AFTER
{inMain ? (
  <nav className="md:hidden flex border-t border-[var(--color-border)] bg-white">
    {MAIN_NAV.slice(0, 4).map(item => (
      <button
        key={item.screen}
        onClick={() => nav(item.screen)}
        aria-label={lang === 'hi' ? item.labelHi : item.label}
        aria-current={screen === item.screen ? 'page' : undefined}
        className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition-colors
          ${screen === item.screen ? 'text-[var(--color-navy)]' : 'text-[var(--color-muted)]'}`}
      >
        <span aria-hidden="true" className="text-lg leading-none">{item.icon}</span>
        <span className="text-[10px]">{lang === 'hi' ? item.labelHi.slice(0, 6) : item.label.split(' ')[0]}</span>
      </button>
    ))}
  </nav>
) : inDispute ? (
  <div className="md:hidden flex items-center justify-between border-t border-[var(--color-border)] bg-white px-4 py-2.5 h-14">
    <button
      onClick={back}
      disabled={!canGoBack}
      aria-label={lang === 'hi' ? 'पिछला चरण' : 'Previous step'}
      className="text-sm font-medium text-[var(--color-navy-mid)] disabled:opacity-30 flex items-center gap-1"
    >
      ← <span>{lang === 'hi' ? 'पिछला' : 'Prev'}</span>
    </button>
    <span className="text-xs font-semibold text-[var(--color-ink)]">
      {lang === 'hi'
        ? DISPUTE_STEPS.find(d => d.screen === screen)?.labelHi
        : DISPUTE_STEPS.find(d => d.screen === screen)?.short}
    </span>
    <span className="text-xs text-[var(--color-muted)]">
      {DISPUTE_STEPS.findIndex(d => d.screen === screen) + 1} / {DISPUTE_STEPS.length}
    </span>
  </div>
) : null}
```

---

### FIX-11 · U07 Document Viewer — bottom sheet on mobile

**File:** `src/screens/Evidence.tsx`  
**Covers:** MOB-03

```tsx
// Add state at top of DocumentViewer
const [sheetOpen, setSheetOpen] = useState(false);

// Change outer wrapper
<div className="relative flex flex-col lg:flex-row h-full overflow-hidden">

  {/* Document panel */}
  <div className="flex-1 flex flex-col bg-[var(--color-surface-2)] overflow-hidden min-h-0">
    ...existing...
  </div>

  {/* Fact panel */}
  <div className={`
    w-full lg:w-80 flex-shrink-0 bg-white
    border-t lg:border-t-0 lg:border-l border-[var(--color-border)]
    overflow-y-auto
    fixed bottom-0 left-0 right-0 z-40
    lg:relative lg:z-auto
    transition-transform duration-300 ease-out
    max-h-[60vh] lg:max-h-none
    ${sheetOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
  `}>
    <div
      className="lg:hidden flex justify-center py-3 cursor-pointer"
      onClick={() => setSheetOpen(false)}
      role="button"
      aria-label={lang === 'hi' ? 'बंद करें' : 'Close panel'}
    >
      <div className="w-10 h-1 rounded-full bg-[var(--color-border-2)]" />
    </div>
    ...existing fact panel content...
  </div>

  {/* FAB — mobile only */}
  <button
    onClick={() => setSheetOpen(o => !o)}
    aria-label={sheetOpen
      ? (lang === 'hi' ? 'पैनल बंद करें' : 'Close panel')
      : (lang === 'hi' ? 'तथ्य जोड़ें / लिंक करें' : 'Link facts')}
    className="lg:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-[var(--color-amber)] text-[var(--color-navy)] font-bold text-xl shadow-[var(--shadow-lg)] flex items-center justify-center transition-transform"
  >
    {sheetOpen ? '✕' : '⊕'}
  </button>
</div>
```

---

### FIX-12 · Sticky CTA pattern — all 6 screens

**Files:** `DisputeEntry.tsx` (WhatHappened + Intake), `Evidence.tsx` (EvidenceLocker), `Facts.tsx`, `Analysis.tsx` (Timeline), `Export.tsx` (ExportPreview)  
**Covers:** MOB-04

Replace each inline `<div className="mt-6 flex gap-3">` CTA block with the sticky pattern. Apply before the closing `</PageWrapper>`:

```tsx
{/* Prevents content from hiding behind sticky bar on mobile */}
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
  <Button variant="secondary" onClick={onBack} className="flex-shrink-0">
    {lang === 'hi' ? 'वापस' : 'Back'}
  </Button>
  <Button onClick={handleContinue} fullWidth>
    {/* screen-specific label */}
  </Button>
</div>
```

For `WhatHappened` (no Back button), omit the secondary button and use `fullWidth` only.

---

## P2 — Visual and UX polish

---

### FIX-13 · Fact card — 4px state-coded left border

**File:** `src/screens/Facts.tsx`  
**Covers:** UX-04

Add before the fact card `<div>`:

```tsx
function factBorderClass(fact: Fact): string {
  if (fact.confirmed)                     return 'border-[var(--color-border)] border-l-[var(--color-success)] border-l-4';
  if (fact.provenance === 'uncertain')    return 'border-[var(--color-border)] border-l-[var(--color-warning)] border-l-4';
  if (fact.provenance === 'corrected')    return 'border-[var(--color-border)] border-l-[var(--color-navy)] border-l-4';
  if (fact.provenance === 'not-relevant') return 'border-[var(--color-border)] opacity-50';
  return 'border-[var(--color-border)]';
}
```

Update card `className`:

```tsx
<div className={`bg-white rounded-[var(--radius-lg)] border p-4 transition-colors ${factBorderClass(fact)}`}>
```

---

### FIX-14 · U06 drop zone — amber drag-active state

**File:** `src/screens/Evidence.tsx:54`  
**Covers:** UX-01

```tsx
${dragging
  ? 'border-[var(--color-amber)] bg-[var(--color-amber-50)]'
  : 'border-[var(--color-border-2)] hover:border-[var(--color-navy-mid)] hover:bg-[var(--color-surface-2)]'
}
```

---

### FIX-15 · U06 uploading state — add progress bar

**File:** `src/screens/Evidence.tsx`  
**Covers:** UX-02

```tsx
// Replace scanning block with:
{(ev.status === 'uploading' || ev.status === 'scanning') && (
  <div className="mt-2 h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
    <div
      className="h-full bg-[var(--color-amber)] rounded-full animate-pulse"
      style={{ width: ev.status === 'uploading' ? '35%' : '70%' }}
    />
  </div>
)}
```

---

### FIX-16 · U16 export summary — 3-column stat card grid

**File:** `src/screens/Export.tsx`  
**Covers:** UX-07

Replace the `grid grid-cols-2` key-value block with:

```tsx
<div className="grid grid-cols-3 gap-3 mb-6">
  {[
    { value: confirmedFacts.length, label: lang === 'hi' ? 'पुष्ट तथ्य' : 'Confirmed facts' },
    { value: readyDocs.length,      label: lang === 'hi' ? 'दस्तावेज़' : 'Documents' },
    { value: dispute.parties.length,label: lang === 'hi' ? 'पक्षकार' : 'Parties' },
  ].map(({ value, label }) => (
    <div key={label} className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-4 text-center">
      <div className="text-2xl font-bold text-[var(--color-navy)]">{value}</div>
      <div className="text-xs text-[var(--color-muted)] mt-1">{label}</div>
    </div>
  ))}
</div>
```

---

### FIX-17 · Fact card inline edit textarea — add `aria-label`

**File:** `src/screens/Facts.tsx`  
**Covers:** ACC-11

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

### FIX-18 · Language toggle — add `aria-pressed` and expanded names

**File:** `src/components/Shell.tsx` (sidebar ~88, mobile ~168)  
**Covers:** ACC-12

```tsx
// Sidebar language buttons
<button
  onClick={() => setLang('en')}
  aria-label="Switch to English"
  aria-pressed={lang === 'en'}
  className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors
    ${lang === 'en' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
>EN</button>
<button
  onClick={() => setLang('hi')}
  aria-label="हिंदी में बदलें"
  aria-pressed={lang === 'hi'}
  className={`flex-1 py-1.5 rounded text-xs font-semibold transition-colors
    ${lang === 'hi' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'}`}
>हिं</button>

// Mobile top bar — same aria attributes, different visual classes
```

---

### FIX-19 · U05 date+precision — narrow precision column

**File:** `src/screens/DisputeEntry.tsx`  
**Covers:** UX-09

```tsx
// Both date+precision grid pairs:
<div className="grid grid-cols-1 sm:grid-cols-[1fr_128px] gap-3 sm:gap-2">
  <Input label={...} ... />
  <Select label={t(lang, 'datePrecision')} ... className="sm:self-end" />
</div>
```

---

### FIX-20 · U17 hash — add copy button

**File:** `src/screens/Export.tsx`  
**Covers:** UX-08

```tsx
// Replace hash row inside integrity manifest:
<div className="px-4 py-2.5">
  <p className="text-xs text-[var(--color-muted)] mb-1">
    {lang === 'hi' ? 'अखंडता हैश' : 'Integrity hash'}
  </p>
  <div className="flex items-center gap-2 bg-[var(--color-surface-2)] rounded px-2 py-1.5">
    <code className="text-xs text-[var(--color-ink-2)] font-mono break-all flex-1 select-all">
      {mockHash}
    </code>
    <button
      onClick={() => navigator.clipboard?.writeText(mockHash)}
      aria-label={lang === 'hi' ? 'हैश कॉपी करें' : 'Copy hash'}
      title={lang === 'hi' ? 'कॉपी करें' : 'Copy'}
      className="flex-shrink-0 p-1 text-[var(--color-muted)] hover:text-[var(--color-navy)] transition-colors rounded"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2 10V2h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </button>
  </div>
</div>
```

---

## P3 — Low-impact polish

---

### FIX-21 · Timeline line — increase to 2px

**File:** `src/screens/Analysis.tsx`  
**Covers:** UX-06

```tsx
// BEFORE
<div className="absolute left-[22px] top-4 bottom-4 w-px bg-[var(--color-border)]" aria-hidden="true" />

// AFTER
<div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-[var(--color-border)] z-0" aria-hidden="true" />
```

---

### FIX-22 · U08 — confirmed badge / action divider

**File:** `src/screens/Facts.tsx`  
**Covers:** UX-05

```tsx
<div className="flex flex-wrap gap-1.5 items-center pt-2 border-t border-[var(--color-border)]">
  {fact.confirmed
    ? <><Badge variant="success">✓ {t(lang, 'confirmed')}</Badge><span aria-hidden="true" className="text-[var(--color-border-2)] mx-0.5">|</span></>
    : <Button size="sm" variant="primary" className="min-h-[44px] md:min-h-0" onClick={...}>✓ {t(lang, 'confirmFact')}</Button>
  }
  ...remaining buttons...
</div>
```

---

## Commit instructions (when GitHub access is restored)

```bash
git checkout -b fix/a050-accessibility-ux-mobile

# Stage only source and docs
git add src/components/ui.tsx
git add src/components/Shell.tsx
git add src/screens/Evidence.tsx
git add src/screens/Facts.tsx
git add src/screens/DisputeEntry.tsx
git add src/screens/Analysis.tsx
git add src/screens/Export.tsx
git add docs/ai/tool-output/figma/A-050/

git commit -m "fix(a050): accessibility, mobile, and UX gaps from A-043 audit

- ACC-01: Select label/htmlFor association
- ACC-02: Toggle aria-label
- ACC-03: Checkbox real input element
- ACC-04: File input aria-hidden removed
- ACC-05: StepBar aria-label
- ACC-06: Fact action touch targets 44px
- ACC-07/08: DocumentViewer button labels
- ACC-09: Timeline ol/li semantics
- ACC-10: Card Space key activation
- ACC-11: Edit textarea label
- ACC-12/13: Language toggle and bottom nav labels
- ACC-14: Radio group real input elements
- MOB-01/02: Mobile step indicator + dispute nav strip
- MOB-03: DocumentViewer bottom sheet + FAB
- MOB-04: Sticky CTA pattern all 6 screens
- MOB-05: U04 textarea responsive min-height
- MOB-06: U08 action row 2x2 grid on mobile
- UX-01: Drop zone amber drag-active
- UX-02: Upload progress bar
- UX-04: Fact card state-coded left border
- UX-07: U16 3-column stat card grid
"

git push origin fix/a050-accessibility-ux-mobile
# Then open draft PR against main
```

**Current status:** `GH_TOKEN` is invalid. Apply fixes locally and push manually, or supply a valid token.
