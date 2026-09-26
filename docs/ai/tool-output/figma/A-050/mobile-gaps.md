# A-050 — Mobile Gaps (v2)

**Task:** A-043 Lovable implementation audit vs Figma MVP package
**Breakpoints audited:** 375px (iPhone SE/14), 428px (iPhone 14 Plus), 768px (iPad mini)
**Date:** 2026-09-26 (v2 — re-verified against live code)

All findings confirmed against actual current implementation. Line numbers are exact.

---

### MOB-01 · No step position indicator during dispute flow on mobile

**File:** `src/components/Shell.tsx:57` (sidebar hidden on mobile), `174–187` (bottom nav)
**Spec:** Mobile top bar shows "Step N / 13 — Label" chip
**Severity:** High

The sidebar dispute step list (`DISPUTE_STEPS`, 13 steps) is `hidden md:flex`
(line 57). No mobile equivalent exists. The mobile top bar (line 133–167) shows
only the dispute label text on md+ screens (`hidden md:block`, line 156). On
small viewports there is zero step-position feedback.

**Fix — add step chip to mobile top bar:**
```tsx
// Shell.tsx — inside <header>, after the logo div and before ml-auto controls
{inDispute && activeDispute && (
  <span className="md:hidden absolute left-1/2 -translate-x-1/2 pointer-events-none
    text-xs font-semibold text-[var(--color-navy)] bg-[var(--color-amber-100)]
    border border-[var(--color-amber-200)] px-2.5 py-0.5 rounded-full whitespace-nowrap">
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

---

### MOB-02 · Bottom nav always shows main tabs during dispute flow

**File:** `src/components/Shell.tsx:175–187`
**Spec:** During dispute, bottom nav replaced with Prev / step-name / N of 13 strip
**Severity:** High

```tsx
// Line 175 — always renders MAIN_NAV tabs regardless of current screen:
<nav className="md:hidden flex border-t border-[var(--color-border)] bg-white">
  {MAIN_NAV.slice(0, 4).map(item => (
    <button ...>
```

During all 13 dispute screens, none of the four tabs is active because `screen`
is not in `MAIN_NAV`. The bottom chrome is misleading — it reads as "you are on
Dashboard" when you are on "What Happened".

**Fix — conditional render:**
```tsx
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

### MOB-03 · U07 DocumentViewer fact panel stacks full-height — no bottom sheet

**File:** `src/screens/Evidence.tsx:250`
**Spec:** On mobile, fact panel becomes bottom sheet with FAB trigger
**Severity:** High

```tsx
<div className="flex flex-col lg:flex-row h-full max-h-full overflow-hidden">
```

`flex-col` causes the fact-linking panel (`w-full lg:w-80`) to stack below the
document panel. Total scroll height exceeds 200vh. On 375px the document mock
alone fills ~70vh; users must scroll past it to reach any fact controls.

**Fix:**
```tsx
// Add state:
const [sheetOpen, setSheetOpen] = useState(false);

// Outer wrapper — already correct
<div className="relative flex flex-col lg:flex-row h-full max-h-full overflow-hidden">

  {/* Document panel — unchanged */}
  <div className="flex-1 flex flex-col bg-[var(--color-surface-2)] overflow-hidden">...</div>

  {/* Fact panel — slide-up sheet on mobile */}
  <div className={`
    w-full lg:w-80 flex-shrink-0 bg-white
    border-t lg:border-t-0 lg:border-l border-[var(--color-border)]
    overflow-y-auto
    fixed bottom-0 left-0 right-0 z-40
    lg:relative lg:z-auto
    transition-transform duration-300 ease-out
    max-h-[65vh] lg:max-h-none
    ${sheetOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
  `}>
    <div className="lg:hidden flex justify-center py-3 cursor-pointer"
      role="button" aria-label={lang === 'hi' ? 'बंद करें' : 'Close panel'}
      onClick={() => setSheetOpen(false)}>
      <div className="w-10 h-1 rounded-full bg-[var(--color-border-2)]" />
    </div>
    {/* ... existing fact panel content unchanged ... */}
  </div>

  {/* FAB — mobile only */}
  <button
    onClick={() => setSheetOpen(o => !o)}
    aria-label={sheetOpen
      ? (lang === 'hi' ? 'पैनल बंद करें' : 'Close panel')
      : (lang === 'hi' ? 'तथ्य जोड़ें / लिंक करें' : 'Link facts')}
    className="lg:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full
      bg-[var(--color-amber)] text-[var(--color-navy)] font-bold text-xl
      shadow-[var(--shadow-lg)] flex items-center justify-center transition-transform"
  >
    {sheetOpen ? '✕' : '⊕'}
  </button>
</div>
```

---

### MOB-04 · CTA buttons not sticky — buried below scrollable content on all screens

**Files:** `DisputeEntry.tsx:72`, `DisputeEntry.tsx:288`, `Evidence.tsx:184`,
`Facts.tsx:273`, `Analysis.tsx:95`, `Export.tsx:106`
**Spec:** 64px sticky bottom strip on mobile
**Severity:** High

All six screens render Back/Continue in an inline `div.mt-6 flex gap-3` at the
end of the scroll area. On any screen with 4+ facts, a long narrative, or a
lengthy evidence list, the CTA is invisible without explicit downward scroll.

**Fix — pattern to apply to each screen:**
```tsx
{/* Spacer so content isn't hidden behind sticky bar */}
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

Screens to update: `WhatHappened`, `Intake`, `EvidenceLocker`, `FactList`,
`Timeline`, `ExportPreview`. `WhatHappened` omit the Back button (no back there).

---

### MOB-05 · U04 textarea `min-h-64` (256px) too tall on small viewports

**File:** `src/screens/DisputeEntry.tsx:57`
**Spec:** Mobile textarea min-height 160px
**Severity:** Medium

```tsx
<Textarea
  value={narrative}
  ...
  className="min-h-64 text-base leading-relaxed"
```

On iPhone SE (375×667px) with browser chrome, the viewable area after top bar
(56px) and bottom nav (≈52px) is ~559px. The 256px textarea takes 46% of that.
The guidance panel above takes another ~100px, pushing the CTA entirely out of
view.

**Fix:**
```tsx
className="min-h-40 md:min-h-64 text-base leading-relaxed"
```

---

### MOB-06 · U08 fact action row wraps to 3+ lines on narrow screens

**File:** `src/screens/Facts.tsx:241`
**Severity:** Medium

```tsx
<div className="flex flex-wrap gap-1.5">
  {!fact.confirmed ? (
    <Button size="sm" variant="primary" ...>✓ Confirm</Button>
  ) : (
    <Badge variant="success">✓ Confirmed</Badge>
  )}
  <Button size="sm" variant="ghost" ...>✎ Correct</Button>
  <Button size="sm" variant="ghost" ...>? Uncertain</Button>
  <Button size="sm" variant="ghost" ...>Not relevant</Button>
  <button ...>✕</button>
</div>
```

On 375px with 4 actions + delete, wrapping produces 3 rows. Lower rows get
≈24px tap targets.

**Fix — 2×2 grid on mobile, flex on md+:**
```tsx
<div className="grid grid-cols-2 gap-1.5 md:flex md:flex-wrap md:gap-1.5">
  {!fact.confirmed ? (
    <Button size="sm" variant="primary"
      className="col-span-2 md:col-span-1 min-h-[44px] md:min-h-0"
      onClick={() => updateFact(fact.id, { confirmed: true, provenance: 'confirmed' })}>
      ✓ {t(lang, 'confirmFact')}
    </Button>
  ) : (
    <Badge variant="success" className="col-span-2 md:col-span-1 self-center">✓ {t(lang, 'confirmed')}</Badge>
  )}
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => startEdit(fact)}>✎ {t(lang, 'correctFact')}</Button>
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => updateFact(fact.id, { provenance: 'uncertain', confirmed: false })}>
    ? {t(lang, 'markUncertain')}</Button>
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => updateFact(fact.id, { provenance: 'not-relevant', confirmed: false })}>
    {t(lang, 'markNotRelevant')}</Button>
</div>
```

---

### MOB-07 · U06 document row file-name column collapses to ~120px on iPhone SE

**File:** `src/screens/Evidence.tsx:150–165`
**Severity:** Medium

The fixed action area (View button `size="sm"` + remove icon) plus the 36px
file-type icon leaves ~120px for the filename on 375px. Long filenames are
heavily truncated. "View" text button (`size="sm"` = `h-8 px-3`) consumes
64px+ on narrow screens.

**Fix — icon-only View button on mobile:**
```tsx
{ev.status === 'ready' && (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => onViewDocument(ev.id)}
    aria-label={t(lang, 'viewDocument')}
    className="min-h-[44px] min-w-[44px]"
  >
    <span className="hidden sm:inline">{t(lang, 'viewDocument')}</span>
    <svg aria-hidden="true" className="sm:hidden w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  </Button>
)}
```

---

## Priority summary

| ID | Severity | Screen | Component | File:line |
|----|----------|--------|-----------|----------|
| MOB-01 | High | All dispute | `Shell` top bar | `Shell.tsx:133` |
| MOB-02 | High | All dispute | `Shell` bottom nav | `Shell.tsx:175` |
| MOB-03 | High | U07 | `DocumentViewer` | `Evidence.tsx:250` |
| MOB-04 | High | U04–U09, U16 | All screens | 6 files |
| MOB-05 | Medium | U04 | `WhatHappened` | `DisputeEntry.tsx:57` |
| MOB-06 | Medium | U08 | `FactList` | `Facts.tsx:241` |
| MOB-07 | Medium | U06 | `EvidenceLocker` | `Evidence.tsx:150` |
