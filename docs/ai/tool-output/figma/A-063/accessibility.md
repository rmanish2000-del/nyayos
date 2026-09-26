# A-063 Accessibility Audit — WCAG 2.1 AA

Branch: `feature/fma-foundation-v1`  
Commit: `14c5ea0bc4234f2055dda879d324398e99c46d4c`  
Date: 2026-09-26  
Target: WCAG 2.1 AA (project states 2.2 AA on the index.tsx checklist)

---

## Baseline Assessment

The foundation is strong: skip-to-content link present, landmarks used correctly (`<header>`, `<main>`, `<nav>`, `<aside>`, `<section>`), form fields always have `<label>` elements, errors are conveyed by text not colour alone, live regions announce state changes, touch targets use the `touch-target` utility (min 44px), and reduced-motion is honoured via `motion-reduce:animate-none`. The issues below are genuine defects, not style preferences.

---

## Findings

### A-001 — Skip-to-content link destination not focusable

**Criterion:** WCAG 2.4.1 Bypass Blocks (Level A)  
**File:** `app/src/components/mvp/require-session.tsx` line 14  
**File:** `app/src/components/mvp/dispute-frame.tsx` line 44  

Current code:
```tsx
// require-session.tsx:14
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring">
  Skip to content
</a>

// dispute-frame.tsx:44
<main id="main" className="min-w-0 pb-16">
```

The `<main>` element is not natively focusable. In Firefox and older Safari, activating the skip link scrolls to `#main` but does not move keyboard focus, leaving sighted keyboard users still needing to tab through the navigation.

Fix code:
```tsx
// dispute-frame.tsx:44
<main id="main" tabIndex={-1} className="min-w-0 pb-16 focus:outline-none">

// dispute-list-screen.tsx:30
<main id="main" tabIndex={-1} className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:px-6 sm:py-10 focus:outline-none">

// what-happened-screen.tsx:24
<main id="main" tabIndex={-1} className="mx-auto grid max-w-3xl gap-6 px-4 py-6 sm:px-6 sm:py-10 focus:outline-none">
```

---

### A-002 — `<html lang>` does not update when user switches to Hindi

**Criterion:** WCAG 3.1.1 Language of Page (Level A)  
**File:** `app/src/routes/__root.tsx` line 108  

Current code:
```tsx
<html lang="en">
```

The app has a language toggle (`en` / `hi`). When Hindi is selected, individual elements use `lang={language}` but the document root remains `lang="en"`. Screen readers use document language to select pronunciation rules. Hindi/Devanagari content read with English pronunciation is unintelligible.

Fix code:
```tsx
// In RootComponent (app/src/routes/__root.tsx), add a useEffect:
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <MvpProvider>
        <LangSync />
        <Outlet />
      </MvpProvider>
    </QueryClientProvider>
  );
}

// New component in same file:
function LangSync() {
  const { language } = useMvp();
  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return null;
}
```

---

### A-003 — Document viewer page content area has no explicit landmark role

**Criterion:** WCAG 1.3.1 Info and Relationships (Level A), WCAG 4.1.2 Name, Role, Value (Level AA)  
**File:** `app/src/components/mvp/screens/document-viewer-screen.tsx` lines 82–89  

Current code:
```tsx
<div
  className="min-h-72 whitespace-pre-wrap rounded-lg border ..."
  tabIndex={0}
  aria-label={`Page ${page} text, read-only`}
>
  {text}
</div>
```

A `tabIndex={0}` `<div>` with no `role` is announced by screen readers as a generic group or interactive element, not as a document region. The `aria-label` may not be read because the element's implicit role does not support accessible naming in all AT.

Fix code:
```tsx
<div
  role="region"
  tabIndex={0}
  aria-label={`Page ${page} of ${total} — read only`}
  className="min-h-72 whitespace-pre-wrap rounded-lg border ..."
>
  {text}
</div>
```

---

### A-004 — Evidence locker hashing announcement may miss AT in some browsers

**Criterion:** WCAG 4.1.3 Status Messages (Level AA)  
**File:** `app/src/components/mvp/screens/evidence-locker-screen.tsx` lines 101–106  

Current code:
```tsx
{hashing ? (
  <p role="status" className="text-sm text-muted-foreground">
    Fingerprinting files…
  </p>
) : null}
```

When `hashing` becomes `true`, the `<p role="status">` is inserted into the DOM. Some screen reader + browser combinations only announce injected live-region text when the region was already in the DOM before the content changed. A conditionally-mounted live region may be missed.

There is a correct always-present live region below (line 118: `<p role="status" aria-live="polite" className="sr-only">{announcement}</p>`), but it is only updated after hashing completes. The in-progress state is not covered.

Fix code:
```tsx
{/* Replace conditional with always-present live region */}
<p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
  {hashing ? "Fingerprinting files…" : ""}
</p>
```

---

### A-005 — Intake `hidden` attribute pattern is correct but `aria-controls` target is conditionally hidden

**Criterion:** WCAG 4.1.2 Name, Role, Value (Level AA)  
**File:** `app/src/components/mvp/screens/intake-screen.tsx` lines 70–82  

Current code (simplified):
```tsx
<Button
  aria-expanded={whyOpen}
  aria-controls="intake-why"
  ...
>
  Why we ask
</Button>
<p id="intake-why" hidden={!whyOpen} ...>
  {reason text}
</p>
```

The `hidden` attribute keeps the element in the DOM while hiding it visually and from the AT tree. `aria-controls` pointing to a `hidden` element is valid per ARIA spec — the control still correctly announces its target. This is NOT a defect. Recorded here to confirm the pattern is intentional and correct.

**Status: PASS — no fix required.**

---

### A-006 — Contrast audit not yet run (self-reported open item)

**Criterion:** WCAG 1.4.3 Contrast (Minimum) (Level AA), WCAG 1.4.11 Non-text Contrast (Level AA)  
**File:** `app/src/routes/index.tsx` lines 334–335  

The component showcase's own checklist records "Formal contrast audit with an automated tool → Not yet run". Token values are defined in `styles.css` but no automated tool (axe, Colour Contrast Analyser, Storybook a11y addon) has verified that every foreground/background token pair meets 4.5:1 for normal text, 3:1 for large text and 3:1 for UI components.

Tokens at risk of borderline ratios:
- `text-muted-foreground` on `bg-card` (used extensively for supporting text)
- `text-muted-foreground` on `bg-surface-sunken` (empty state descriptions)
- `text-evidence-scanning` on `bg-evidence-scanning-surface` (document state badge)
- `text-muted-foreground` on `bg-background` (header sub-labels)

**Required action:** Run axe-core or Playwright + axe against each screen at both light and dark (if dark theme is exposed). Resolve any failures before merging to main.

---

### A-007 — Screen reader pass not yet run (self-reported open item)

**Criterion:** WCAG 1.3.1, 2.1.1, 4.1.2 (multiple)  
**File:** `app/src/routes/index.tsx` lines 336–337  

No NVDA, JAWS or VoiceOver pass has been run on the implemented screens. While the ARIA and landmark architecture is well-structured, live region timing, focus-on-error routing, and select element announcement can only be confirmed by real AT testing.

**Required action:** Run NVDA + Chrome and VoiceOver + Safari passes on U01 (login), U05 (intake), U06 (evidence locker) and U08 (fact review) at minimum before release.

---

## What is Working Well

- Every `<form>` uses `noValidate` + manual validation with errors linked via `aria-describedby`
- `aria-invalid={error ? true : undefined}` is set on every erroneous field in `TextField`
- Filter button groups use `role="group"` with `aria-label` and `aria-pressed` on each button
- `LoadingState` uses `role="status" aria-busy="true" aria-live="polite"` correctly
- `ErrorState` uses `role="alert"` correctly for error presentation
- The `NotificationBanner` component uses `role="alert"` or `aria-live` depending on tone
- Fact action buttons use `aria-pressed` to communicate current state
- Screen-reader-only live regions (`.sr-only`) are used for announcement text in evidence locker, fact review, intake and timeline screens
- Every icon-only button has an `aria-label`; decorative icons use `aria-hidden="true"`
- The Google "G" SVG logo uses `aria-hidden="true"` correctly
