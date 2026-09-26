# A-050 — Mobile Gaps

**Task:** A-043 implementation audit vs Figma MVP package  
**Breakpoints audited:** < 375px (iPhone SE), 375px (iPhone 14), 428px (iPhone 14 Plus), 768px (iPad mini)  
**Date:** 2026-09-26

---

### MOB-01 · No step position indicator during dispute flow on mobile

**File:** `src/components/Shell.tsx`  
**Spec:** DESIGN-PACKAGE-V1.md §U04 Mobile  
**Severity:** High

The sidebar dispute step list (`DISPUTE_STEPS`, 13 steps) is `hidden md:flex` — invisible on mobile. No mobile equivalent exists. Users have no way to see which step they are on, how many remain, or navigate to a previous step without pressing Back repeatedly.

**Fix:** When `inDispute`, add a step progress chip to the mobile top bar:

```tsx
// Shell.tsx — inside <header>, after back button
{inDispute && activeDispute && (
  <span className="md:hidden absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-[var(--color-navy)] bg-[var(--color-amber-100)] border border-[var(--color-amber-200)] px-2.5 py-0.5 rounded-full whitespace-nowrap">
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

### MOB-02 · Bottom nav does not reflect active screen during dispute flow

**File:** `src/components/Shell.tsx:140`  
**Severity:** High

The mobile bottom nav shows four main-nav tabs (Dashboard / Activity / Settings / Trust & Safety). During all 13 dispute screens, none of the tabs is active. `aria-current="page"` is never set on mobile during a dispute. The bottom nav becomes misleading chrome showing "Dashboard" as if it were the current context.

**Fix:** When `inDispute`, replace the bottom nav with a compact dispute nav strip:

```tsx
// Shell.tsx — mobile nav at bottom
{inMain && (
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
)}

{inDispute && (
  <div className="md:hidden flex items-center justify-between border-t border-[var(--color-border)] bg-white px-4 py-2.5 h-14">
    <button
      onClick={back}
      disabled={!canGoBack}
      className="text-sm font-medium text-[var(--color-navy-mid)] disabled:opacity-30 flex items-center gap-1"
    >
      ← {lang === 'hi' ? 'पिछला' : 'Prev'}
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
)}
```

---

### MOB-03 · U07 Document Viewer — fact panel stacks full-height, no bottom sheet

**File:** `src/screens/Evidence.tsx:178`  
**Spec:** DESIGN-PACKAGE-V1.md §U07 Mobile — bottom sheet + FAB  
**Severity:** High

`flex-col lg:flex-row` causes the document panel and fact panel to stack vertically on mobile. Total scroll height exceeds 200vh. No bottom sheet, no FAB. Users must scroll past the entire document panel to reach fact-linking controls.

**Fix:**

```tsx
// Evidence.tsx — DocumentViewer
const [sheetOpen, setSheetOpen] = useState(false);

return (
  <div className="relative flex flex-col lg:flex-row h-full overflow-hidden">

    {/* Document panel — always shown */}
    <div className="flex-1 flex flex-col bg-[var(--color-surface-2)] overflow-hidden min-h-0">
      ...existing content...
    </div>

    {/* Fact panel — desktop: right sidebar; mobile: bottom sheet */}
    <div className={`
      w-full lg:w-80 flex-shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-[var(--color-border)]
      overflow-y-auto
      fixed lg:relative bottom-0 left-0 right-0 z-40
      transition-transform duration-300 ease-out
      max-h-[60vh] lg:max-h-none
      ${sheetOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
    `}>
      {/* Drag handle — mobile only */}
      <div
        className="lg:hidden flex justify-center py-3 cursor-pointer"
        onClick={() => setSheetOpen(false)}
        aria-label={lang === 'hi' ? 'बंद करें' : 'Close'}
      >
        <div className="w-10 h-1 rounded-full bg-[var(--color-border-2)]" />
      </div>
      ...existing fact panel content...
    </div>

    {/* FAB — mobile only, shown when sheet is closed */}
    {!sheetOpen && (
      <button
        onClick={() => setSheetOpen(true)}
        aria-label={lang === 'hi' ? 'तथ्य जोड़ें / लिंक करें' : 'Link facts'}
        className="lg:hidden fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-[var(--color-amber)] text-[var(--color-navy)] font-bold text-lg shadow-[var(--shadow-lg)] flex items-center justify-center"
      >
        ⊕
      </button>
    )}
  </div>
);
```

---

### MOB-04 · CTA buttons not sticky on mobile — buried below long content

**Files:** `src/screens/DisputeEntry.tsx`, `src/screens/Facts.tsx`, `src/screens/Analysis.tsx`, `src/screens/Export.tsx`  
**Spec:** DESIGN-PACKAGE-V1.md §U04/U05/U08/U09 Mobile — sticky 64px bottom strip  
**Severity:** High

All screens render Back + Continue inline at the end of scrollable content. On U08 with 4+ facts or U04 with a lengthy guidance panel, the CTA is invisible until the user scrolls to the bottom. There is no visual affordance that a Continue button exists.

**Fix — pattern to apply to all 8 audited screens:**

```tsx
// Replace the inline <div className="mt-6 flex gap-3"> with:

{/* Spacer to prevent content hiding behind sticky bar on mobile */}
<div className="h-20 md:hidden" aria-hidden="true" />

{/* Sticky CTA bar */}
<div className="
  fixed bottom-0 left-0 right-0 md:relative
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
    {lang === 'hi' ? 'जारी रखें' : 'Continue'}
  </Button>
</div>
```

**Screens to update:** `WhatHappened`, `Intake`, `EvidenceLocker`, `FactList`, `Timeline`, `ExportPreview`.

---

### MOB-05 · U04 textarea `min-h-64` (256px) too tall on small screens

**File:** `src/screens/DisputeEntry.tsx:48`  
**Spec:** DESIGN-PACKAGE-V1.md §U04 Mobile — min-height 160px

On iPhone SE (375×667px), the textarea at 256px takes 56% of visible height. Combined with the guidance panel above, the Continue button is invisible without scrolling. Users may not realise they need to scroll.

**Fix:**

```tsx
<Textarea
  className="min-h-40 md:min-h-64 text-base leading-relaxed"
  ...
/>
```

---

### MOB-06 · U08 fact action row wraps to 3+ lines on narrow screens

**File:** `src/screens/Facts.tsx:135`  
**Severity:** Medium

`flex flex-wrap gap-1.5` with 4 buttons + delete on a 375px screen wraps to 3 rows. Each wrapped row has varying heights. The bottom row tap targets shrink to ≈24px.

**Fix — 2×2 grid on mobile, flex row on md+:**

```tsx
<div className="grid grid-cols-2 gap-1.5 md:flex md:flex-wrap md:gap-1.5">
  {!fact.confirmed ? (
    <Button size="sm" variant="primary" className="col-span-2 md:col-span-1 min-h-[44px] md:min-h-0"
      onClick={() => updateFact(fact.id, { confirmed: true, provenance: 'confirmed' })}>
      ✓ {t(lang, 'confirmFact')}
    </Button>
  ) : (
    <Badge variant="success" className="col-span-2 md:col-span-1">✓ {t(lang, 'confirmed')}</Badge>
  )}
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => updateFact(fact.id, { provenance: 'uncertain', confirmed: false })}>
    ? {t(lang, 'markUncertain')}
  </Button>
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => startEdit(fact)}>
    ✎ {t(lang, 'correctFact')}
  </Button>
  <Button size="sm" variant="ghost" className="min-h-[44px] md:min-h-0"
    onClick={() => updateFact(fact.id, { provenance: 'not-relevant', confirmed: false })}>
    {t(lang, 'markNotRelevant')}
  </Button>
</div>
```

---

### MOB-07 · U06 document row action buttons reduce file name column to ~120px on iPhone SE

**File:** `src/screens/Evidence.tsx:84`  
**Severity:** Medium

On narrow screens the fixed action area (`View` button + remove icon) plus the file type icon leave only ~120px for the filename. Long filenames are heavily truncated. `View` text button consumes 64px+ which can be reduced on mobile.

**Fix — icon-only actions on mobile:**

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

| ID | Severity | Screen | Component |
|----|----------|--------|----------|
| MOB-01 | High | All dispute screens | `Shell` |
| MOB-02 | High | All dispute screens | `Shell` |
| MOB-03 | High | U07 | `DocumentViewer` |
| MOB-04 | High | U04–U09, U16 | All screens |
| MOB-05 | Medium | U04 | `WhatHappened` |
| MOB-06 | Medium | U08 | `FactList` |
| MOB-07 | Medium | U06 | `EvidenceLocker` |
