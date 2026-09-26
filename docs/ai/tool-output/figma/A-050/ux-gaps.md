# A-050 — UX Gaps (v2)

**Task:** A-043 Lovable implementation audit vs Figma MVP package
**Reference:** DESIGN-PACKAGE-V1.md, A-041 Traceability Addendum
**Date:** 2026-09-26 (v2 — re-verified against live code)

Each gap: what the spec requires, what the implementation does, why it matters, exact fix.

---

### UX-01 · U06 drag-active drop zone uses navy instead of amber

**File:** `src/screens/Evidence.tsx:87`
**Spec:** Drag-active → `border-color: --color-amber`, `bg: --color-amber-50`
**Severity:** High

```tsx
className={`border-2 border-dashed rounded-[var(--radius-lg)] p-8 text-center mb-6 transition-colors cursor-pointer
  ${dragging
    ? 'border-[var(--color-navy-mid)] bg-[var(--color-navy)]/5'   // ← navy, not amber
    : 'border-[var(--color-border-2)] hover:border-[var(--color-navy-mid)] hover:bg-[var(--color-surface-2)]'}`}
```

Navy-on-surface is too subtle and inconsistent with amber as the system-wide
active/interactive accent. The amber state is the primary "you can drop here"
affordance.

**Fix:**
```tsx
${dragging
  ? 'border-[var(--color-amber)] bg-[var(--color-amber-50)]'
  : 'border-[var(--color-border-2)] hover:border-[var(--color-navy-mid)] hover:bg-[var(--color-surface-2)]'}
```

---

### UX-02 · U06 `uploading` state shows badge only — no progress bar

**File:** `src/screens/Evidence.tsx:168–172`
**Spec:** Both `uploading` and `scanning` states show an amber progress bar
**Severity:** High

The implementation shows an amber pulse bar only for `scanning` (60% width, line
168–172). The `uploading` state renders a muted Badge with "↑ Uploading…" only.
Users cannot tell data is actively transferring, and the visual difference between
uploading and scanning is unclear.

Current (only scanning has a bar):
```tsx
{ev.status === 'scanning' && (
  <div className="mt-2 h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
    <div className="h-full bg-[var(--color-amber)] rounded-full animate-pulse" style={{ width: '60%' }} />
  </div>
)}
// uploading: shows only StatusBadge with muted "↑ Uploading…"
```

**Fix — add bar for uploading too:**
```tsx
{(ev.status === 'uploading' || ev.status === 'scanning') && (
  <div className="mt-2 h-1 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
    <div
      className="h-full bg-[var(--color-amber)] rounded-full animate-pulse"
      style={{ width: ev.status === 'uploading' ? '35%' : '65%' }}
    />
  </div>
)}
```

---

### UX-03 · U07 fact panel buttons show no provenance badge per fact

**File:** `src/screens/Evidence.tsx:311–326`
**Spec:** Each fact in the linking panel shows a ProvenanceBadge below the statement
**Severity:** Medium

```tsx
<button key={fact.id} onClick={() => !linked && linkFact(fact.id)}
  className={`w-full text-left p-2.5 rounded-[var(--radius-sm)] border text-xs mb-2 ...`}>
  <div className="flex items-start gap-2">
    <span className="flex-shrink-0 mt-0.5">{linked ? '✓' : '+'}</span>
    <span className="text-[var(--color-ink)] leading-relaxed">{fact.statement}</span>
  </div>
  {/* ← no ProvenanceBadge */}
</button>
```

Without provenance context (user-statement vs document-sourced vs user-inference),
users cannot tell which facts most need document evidence.

**Fix:**
```tsx
<button key={fact.id} onClick={() => !linked && linkFact(fact.id)} className={`...`}>
  <div className="flex items-start gap-2 mb-1.5">
    <span className="flex-shrink-0 mt-0.5 text-[var(--color-success)]">{linked ? '✓' : '+'}</span>
    <span className="text-[var(--color-ink)] leading-relaxed">{fact.statement}</span>
  </div>
  <div className="pl-4">
    <ProvenanceBadge type={linked ? 'confirmed' : fact.provenance} lang={lang} />
  </div>
</button>
```

---

### UX-04 · U08 fact cards missing 4px state-coded left border

**File:** `src/screens/Facts.tsx:198`
**Spec:** confirmed → green left border; uncertain → amber; corrected → navy; not-relevant → grey + 50% opacity
**Severity:** High

```tsx
className={`bg-white rounded-[var(--radius-lg)] border p-4 transition-colors
  ${fact.confirmed
    ? 'border-[var(--color-success)]'          // ← full border, not just left
    : fact.provenance === 'not-relevant'
      ? 'border-[var(--color-border)] opacity-50'
      : 'border-[var(--color-border)]'}`}       // ← uncertain and corrected look identical
```

Uncertain and corrected facts look identical. The spec's per-state left accent
is the primary visual cue for fact status at a glance.

**Fix:**
```tsx
function factBorderClass(fact: Fact): string {
  if (fact.confirmed)                     return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-success)]';
  if (fact.provenance === 'uncertain')    return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-warning)]';
  if (fact.provenance === 'corrected')    return 'border-[var(--color-border)] border-l-4 border-l-[var(--color-navy)]';
  if (fact.provenance === 'not-relevant') return 'border-[var(--color-border)] opacity-50';
  return 'border-[var(--color-border)]';
}

// In render:
<div className={`bg-white rounded-[var(--radius-lg)] border p-4 transition-colors ${factBorderClass(fact)}`}>
```

---

### UX-05 · U08 confirmed badge placed inline with action buttons — no separator

**File:** `src/screens/Facts.tsx:242–266`
**Spec:** Confirmed Badge replaces Confirm button; remaining actions separated by a divider
**Severity:** Medium

When `fact.confirmed`, a green Badge is placed at the same visual level as the
remaining action buttons (`flex flex-wrap gap-1.5`). No separator. The badge
reads as another button choice rather than a state indicator.

**Fix:**
```tsx
<div className="flex flex-wrap gap-1.5 items-center pt-2 border-t border-[var(--color-border)]">
  {fact.confirmed
    ? (
      <>
        <Badge variant="success">✓ {t(lang, 'confirmed')}</Badge>
        <span aria-hidden="true" className="text-[var(--color-border-2)] text-sm mx-0.5">|</span>
      </>
    ) : (
      <Button size="sm" variant="primary"
        className="min-h-[44px] md:min-h-0"
        onClick={() => updateFact(fact.id, { confirmed: true, provenance: 'confirmed' })}>
        ✓ {t(lang, 'confirmFact')}
      </Button>
    )
  }
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0" onClick={() => startEdit(fact)}>
    ✎ {t(lang, 'correctFact')}
  </Button>
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => updateFact(fact.id, { provenance: 'uncertain', confirmed: false })}>
    ? {t(lang, 'markUncertain')}
  </Button>
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => updateFact(fact.id, { provenance: 'not-relevant', confirmed: false })}>
    {t(lang, 'markNotRelevant')}
  </Button>
</div>
```

---

### UX-06 · U09 timeline vertical line is 1px (spec: 2px), slightly mis-centered

**File:** `src/screens/Analysis.tsx:51`
**Spec:** 2px solid `--color-border` line centred under dot
**Severity:** Medium

```tsx
<div className="absolute left-[22px] top-4 bottom-4 w-px bg-[var(--color-border)]" aria-hidden="true" />
```

`w-px` = 1px — reads as a hairline on most displays at 1× DPR. The dot is
`w-11` (44px), centred at 22px. A 1px line starting at `left-[22px]` positions
its left edge at 22px, so the line is offset by 0.5px from the dot centre.

**Fix:**
```tsx
<div className="absolute left-[21px] top-3 bottom-3 w-0.5 bg-[var(--color-border)] z-0" aria-hidden="true" />
```

`left-[21px]` centres the 2px line (22 − 1 = 21px to the left edge) exactly under the 44px dot.

---

### UX-07 · U16 export summary uses 2-col key-value pairs — not the spec 3-col stat card grid

**File:** `src/screens/Export.tsx:86–104`
**Spec:** 3 white Card cells (facts · documents · parties) each with large centred number + label
**Severity:** High

```tsx
<div className="bg-[var(--color-surface-2)] rounded-[var(--radius-md)] p-4 mb-5">
  <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider mb-2">
    {lang === 'hi' ? 'निर्यात सारांश' : 'Export summary'}
  </p>
  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
    <p className="text-xs text-[var(--color-ink-2)]">Confirmed facts: <strong>{confirmedFacts.length}</strong></p>
    <p className="text-xs text-[var(--color-ink-2)]">Documents: <strong>{readyDocs.length}</strong></p>
    <p className="text-xs text-[var(--color-ink-2)]">Parties: <strong>{dispute.parties.length}</strong></p>
    <p className="text-xs text-[var(--color-ink-2)]">Format: <strong>PDF + JSON</strong></p>
  </div>
</div>
```

No individual stat cards, no large numbers, no centred layout.

**Fix:**
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
      <div className="text-xs text-[var(--color-muted)] mt-1">{label}</div>
    </div>
  ))}
</div>
```

---

### UX-08 · U17 integrity hash missing copy-to-clipboard button

**File:** `src/screens/Export.tsx:172–176`
**Spec:** Copy icon beside the hash
**Severity:** Low

```tsx
<code className="text-xs text-[var(--color-ink-2)] font-mono break-all block bg-[var(--color-surface-2)] px-2 py-1.5 rounded">
  {mockHash}
</code>
```

The `<code>` element is correct. No copy button. Users must manually select and
copy a 72-character hex string.

**Fix:**
```tsx
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
```

---

### UX-09 · U05 date+precision grid uses equal-width columns — spec wants fixed 128px precision

**File:** `src/screens/DisputeEntry.tsx:246, 261`
**Spec:** `grid-cols-[1fr_128px]` — date takes remaining space, precision fixed 128px
**Severity:** Low

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
```

At sm+ both columns are 50/50. The precision select (5 options, ~20 chars each)
ends up as wide as the date field, creating awkward visual weight.

**Fix (both date+precision pairs):**
```tsx
<div className="grid grid-cols-1 sm:grid-cols-[1fr_128px] gap-4 sm:gap-2">
  <Input label={t(lang, 'whenDidItStart')} type="text" ... />
  <Select label={t(lang, 'datePrecision')} ... className="sm:self-end" />
</div>
```

---

### UX-10 · U06 View Document button has no minimum touch target

**File:** `src/screens/Evidence.tsx:151–154`
**Spec:** Interactive targets ≥ 44×44px
**Severity:** Medium

```tsx
<Button variant="ghost" size="sm" onClick={() => onViewDocument(ev.id)}>
  {t(lang, 'viewDocument')}
</Button>
```

`size="sm"` = `h-8` = 32px. Below the 44px touch-target minimum on mobile.

**Fix:**
```tsx
<Button variant="ghost" size="sm" onClick={() => onViewDocument(ev.id)}
  className="min-h-[44px] md:min-h-8"
  aria-label={t(lang, 'viewDocument')}>
  <span className="hidden sm:inline">{t(lang, 'viewDocument')}</span>
  <svg aria-hidden="true" className="sm:hidden w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
</Button>
```

---

## Priority summary

| ID | Severity | Screen | File:line |
|----|----------|--------|-----------|
| UX-01 | High | U06 drop zone | `Evidence.tsx:87` |
| UX-02 | High | U06 uploading state | `Evidence.tsx:168` |
| UX-04 | High | U08 fact cards | `Facts.tsx:198` |
| UX-07 | High | U16 export summary | `Export.tsx:86` |
| UX-03 | Medium | U07 fact panel | `Evidence.tsx:311` |
| UX-05 | Medium | U08 confirmed badge | `Facts.tsx:242` |
| UX-06 | Medium | U09 timeline line | `Analysis.tsx:51` |
| UX-10 | Medium | U06 View button | `Evidence.tsx:151` |
| UX-08 | Low | U17 hash copy | `Export.tsx:172` |
| UX-09 | Low | U05 date grid | `DisputeEntry.tsx:246` |
