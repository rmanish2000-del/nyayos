# A-050 — UX Gaps

**Task:** A-043 implementation audit vs Figma MVP package  
**Reference:** DESIGN-PACKAGE-V1.md  
**Date:** 2026-09-26

Each gap documents what the spec says, what the implementation does, and the exact fix.

---

### UX-01 · U06 drag-active drop zone uses navy instead of amber

**File:** `src/screens/Evidence.tsx:54`  
**Spec:** Drop zone drag-active → `border-color: --color-amber`, `background: --color-amber-50`

**Implementation:** `border-[var(--color-navy-mid)] bg-[var(--color-navy)]/5` on drag.

The amber drag state is the primary affordance signalling "this is where to drop." Navy-on-surface is too subtle and inconsistent with the amber accent used everywhere else for active/interactive states.

**Fix:**

```tsx
className={`border-2 border-dashed rounded-[var(--radius-lg)] p-8 text-center mb-6 transition-colors cursor-pointer relative
  ${dragging
    ? 'border-[var(--color-amber)] bg-[var(--color-amber-50)]'
    : 'border-[var(--color-border-2)] hover:border-[var(--color-navy-mid)] hover:bg-[var(--color-surface-2)]'
  }`}
```

---

### UX-02 · U06 uploading state shows only a badge — no progress bar

**File:** `src/screens/Evidence.tsx:83–103`  
**Spec:** `uploading` state → linear progress bar (amber fill, navy track) below file name row

**Implementation:** `uploading` renders a muted Badge with "↑ Uploading…". The `scanning` state shows an amber pulse bar at fixed 60% width. No uploading progress bar exists.

This means the two distinct states (uploading = data transfer in progress; scanning = AV check) look entirely different from the spec and are not visually distinguishable from each other to non-technical users.

**Fix:**

```tsx
{/* Inside each evidence row — replace the scanning block */}
{ev.status === 'uploading' && (
  <div className="mt-2 h-1 rounded-full overflow-hidden bg-[var(--color-surface-2)]">
    <div className="h-full bg-[var(--color-amber)] rounded-full animate-pulse" style={{ width: '35%' }} />
  </div>
)}
{ev.status === 'scanning' && (
  <div className="mt-2 h-1 rounded-full overflow-hidden bg-[var(--color-surface-2)]">
    <div className="h-full bg-[var(--color-amber)] rounded-full animate-pulse" style={{ width: '70%' }} />
  </div>
)}
```

---

### UX-03 · U07 fact panel does not show provenance badges per fact

**File:** `src/screens/Evidence.tsx:222–242`  
**Spec:** Each fact in the right panel shows a ProvenanceBadge below the statement text

**Implementation:** Fact buttons show statement text and a linked/unlinked icon only. No provenance context.

Provenance (user-statement vs document-sourced vs user-inference) determines how reliable a fact is. Without it, the fact-linking panel gives no signal about which facts most need document evidence.

**Fix:**

```tsx
// Evidence.tsx — fact link button inside DocumentViewer
{confirmedFacts.map(fact => {
  const linked = fact.sources?.includes(documentId);
  return (
    <button key={fact.id} onClick={() => !linked && linkFact(fact.id)} className={`w-full text-left p-2.5 rounded-[var(--radius-sm)] border text-xs mb-2 transition-colors
      ${linked
        ? 'border-[var(--color-success)] bg-[var(--color-success-bg)] cursor-default'
        : 'border-[var(--color-border)] hover:border-[var(--color-navy-mid)] hover:bg-[var(--color-surface-2)]'}`}
    >
      <div className="flex items-start gap-2 mb-1.5">
        <span className="flex-shrink-0 mt-0.5 text-[var(--color-success)]">{linked ? '✓' : '+'}</span>
        <span className="text-[var(--color-ink)] leading-relaxed">{fact.statement}</span>
      </div>
      <div className="pl-4">
        <ProvenanceBadge type={linked ? 'confirmed' : fact.provenance} lang={lang} />
      </div>
    </button>
  );
})}
```

---

### UX-04 · U08 fact cards missing 4px state-coded left border

**File:** `src/screens/Facts.tsx:115`  
**Spec:** confirmed → 4px green left border; uncertain → 4px amber; corrected → 4px navy; not-relevant → grey + 50% opacity

**Implementation:** Only confirmed facts receive `border-[var(--color-success)]` (changes the entire border, not just the left). Uncertain, corrected, and not-relevant use the same default grey border. The state-coded left accent is absent.

**Fix:**

```tsx
// Facts.tsx — fact card wrapper
function factBorderClass(fact: Fact): string {
  if (fact.confirmed)                         return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-success)]';
  if (fact.provenance === 'uncertain')        return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-warning)]';
  if (fact.provenance === 'corrected')        return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-navy)]';
  if (fact.provenance === 'not-relevant')     return 'border-[var(--color-border)] opacity-50';
  return 'border-[var(--color-border)]';
}

<div className={`bg-white rounded-[var(--radius-lg)] border p-4 transition-colors ${factBorderClass(fact)}`}>
```

---

### UX-05 · U08 confirmed badge and action buttons have no visual separator

**File:** `src/screens/Facts.tsx:140`  
**Spec:** Confirmed Badge replaces Confirm button; remaining actions (Correct · Uncertain · Not Relevant) remain but are separated by a divider

**Implementation:** When confirmed, the green Badge is placed inline with other action buttons at the same visual level. No separator. The badge reads as another button choice rather than a state indicator.

**Fix:**

```tsx
<div className="flex flex-wrap gap-1.5 items-center pt-2 border-t border-[var(--color-border)]">
  {fact.confirmed
    ? <Badge variant="success" className="mr-1">✓ {t(lang, 'confirmed')}</Badge>
    : (
      <Button size="sm" variant="primary" className="min-h-[44px] md:min-h-0"
        onClick={() => updateFact(fact.id, { confirmed: true, provenance: 'confirmed' })}>
        ✓ {t(lang, 'confirmFact')}
      </Button>
    )
  }
  <span className="text-[var(--color-border-2)] text-sm mx-0.5" aria-hidden="true">|</span>
  <Button size="sm" variant="ghost" onClick={() => startEdit(fact)}>✎ {t(lang, 'correctFact')}</Button>
  <Button size="sm" variant="ghost"
    onClick={() => updateFact(fact.id, { provenance: 'uncertain', confirmed: false })}>
    ? {t(lang, 'markUncertain')}
  </Button>
  <Button size="sm" variant="ghost"
    onClick={() => updateFact(fact.id, { provenance: 'not-relevant', confirmed: false })}>
    {t(lang, 'markNotRelevant')}
  </Button>
</div>
```

---

### UX-06 · U09 timeline vertical line width is 1px (spec: 2px) and slightly misaligned

**File:** `src/screens/Analysis.tsx:58`  
**Spec:** 2px solid `--color-border` line; positioned to pass behind dot center

**Implementation:** `w-px` (1px) at `left-[22px]`. The dot is `w-11` (44px), so its center is at 22px — correct horizontal position. But `w-px` (1px) visually reads as a hairline that disappears against the surface background at small sizes.

**Fix:**

```tsx
// Analysis.tsx — vertical line
<div
  className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-[var(--color-border)] z-0"
  aria-hidden="true"
/>
```

(`left-[21px]` centers the 2px line under the 44px dot whose center is at 22px: `22 - 1 = 21`.)

---

### UX-07 · U16 export summary uses a 2-column key-value grid, not the spec 3-column stat card grid

**File:** `src/screens/Export.tsx:72`  
**Spec:** 3 white Card cells (facts · documents · parties) each with a large centred number and a small label beneath

**Implementation:** A `grid grid-cols-2` of `text-xs` key: **value** pairs inside a `--color-surface-2` panel. No individual cards, no large numbers, no centred layout.

**Fix:**

```tsx
// Export.tsx — ExportPreview, replace the summary section
<div className="grid grid-cols-3 gap-3 mb-6">
  {[
    {
      value: dispute.facts.filter(f => f.confirmed).length,
      label: lang === 'hi' ? 'पुष्ट तथ्य' : 'Confirmed facts',
    },
    {
      value: dispute.evidence.filter(e => e.status === 'ready').length,
      label: lang === 'hi' ? 'दस्तावेज़' : 'Documents',
    },
    {
      value: dispute.parties.length,
      label: lang === 'hi' ? 'पक्षकार' : 'Parties',
    },
  ].map(({ value, label }) => (
    <div
      key={label}
      className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-sm)] p-4 text-center"
    >
      <div className="text-2xl font-bold text-[var(--color-navy)]">{value}</div>
      <div className="text-xs text-[var(--color-muted)] mt-1">{label}</div>
    </div>
  ))}
</div>
```

Note: on mobile (`< 400px`) collapse to 1-column:

```tsx
className="grid grid-cols-1 xs:grid-cols-3 gap-3 mb-6"
// or:
className="grid grid-cols-3 gap-2 mb-6"  // allow natural compression
```

---

### UX-08 · U17 integrity hash uses `<code>` correctly — no gap

**File:** `src/screens/Export.tsx:130`  
**Status:** PASS — hash is already rendered in a `<code>` element with `font-mono` inside a `--color-surface-2` background panel. Copy-to-clipboard not implemented (no copy icon), but the semantic element is correct.

**Remaining fix (copy button missing):**

```tsx
// Export.tsx — ExportResult, hash row
<div className="px-4 py-2.5">
  <p className="text-xs text-[var(--color-muted)] mb-1">
    {lang === 'hi' ? 'अखंडता हैश' : 'Integrity hash'}
  </p>
  <div className="flex items-center gap-2 bg-[var(--color-surface-2)] rounded px-2 py-1.5">
    <code className="text-xs text-[var(--color-ink-2)] font-mono break-all flex-1 select-all">
      {mockHash}
    </code>
    <button
      onClick={() => navigator.clipboard.writeText(mockHash)}
      aria-label={lang === 'hi' ? 'हैश कॉपी करें' : 'Copy hash'}
      className="flex-shrink-0 text-[var(--color-muted)] hover:text-[var(--color-navy)] transition-colors"
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

### UX-09 · U05 date precision selects use equal-width `grid-cols-2`, not spec `[1fr_128px]`

**File:** `src/screens/DisputeEntry.tsx`  
**Spec:** Date input takes remaining width; precision select is fixed 128px

**Implementation:** `grid grid-cols-1 sm:grid-cols-2` — both columns equal width at sm+. Precision select ends up as wide as the date field, which creates an awkwardly wide dropdown for a simple 5-option control.

**Fix:**

```tsx
// DisputeEntry.tsx — both date+precision pairs
<div className="grid grid-cols-1 sm:grid-cols-[1fr_128px] gap-3 sm:gap-2">
  <Input
    label={t(lang, 'whenDidItStart')}
    type="text"
    placeholder={lang === 'hi' ? 'जैसे: जनवरी 2025' : 'E.g. January 2025'}
    value={data.startDate}
    onChange={e => update('startDate', e.target.value)}
  />
  <Select
    label={t(lang, 'datePrecision')}
    value={data.startDatePrecision}
    onChange={v => update('startDatePrecision', v as DatePrecision)}
    options={datePrecisionOptions(lang)}
    className="sm:self-end"
  />
</div>
```

Apply the same pattern to the `wrongDate` / `wrongDatePrecision` pair.

---

## Priority summary

| ID | Severity | Screen | File |
|----|----------|--------|------|
| UX-01 | High | U06 | `Evidence.tsx:54` |
| UX-02 | High | U06 | `Evidence.tsx:97` |
| UX-04 | High | U08 | `Facts.tsx:115` |
| UX-07 | High | U16 | `Export.tsx:72` |
| UX-03 | Medium | U07 | `Evidence.tsx:222` |
| UX-05 | Medium | U08 | `Facts.tsx:140` |
| UX-06 | Medium | U09 | `Analysis.tsx:58` |
| UX-08 | Low | U17 | `Export.tsx:130` (copy btn only) |
| UX-09 | Low | U05 | `DisputeEntry.tsx` |
