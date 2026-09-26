# A-057 — Accessibility Gaps (Full Audit)

**Standard:** WCAG 2.1 AA
**Date:** 2026-09-26
**Covers:** All screens — extends A-050 findings (ACC-01–ACC-17)

---

## ACC-18 · Auth screens have no `<main>` landmark

**File:** `src/components/Shell.tsx:47–49`
**Severity:** Critical

```tsx
if (AUTH_SCREENS.includes(screen)) {
  return (
    <div className="min-h-screen bg-[var(--color-navy)]">
      {children}
    </div>
  );
}
```

Auth screens (`signin`, `consent`) are wrapped in a plain `<div>`. AT users navigating
by landmarks find no `<main>`, no `<header>`, no `<nav>`. The entire auth flow is
inaccessible to landmark-based navigation.

**Fix:**
```tsx
if (AUTH_SCREENS.includes(screen)) {
  return (
    <div className="min-h-screen bg-[var(--color-navy)]">
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50
          focus:px-4 focus:py-2 focus:bg-white focus:text-[var(--color-navy)]
          focus:rounded-[var(--radius-md)] focus:text-sm focus:font-medium">
        {lang === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
      </a>
      <main id="main-content">{children}</main>
    </div>
  );
}
```

---

## ACC-19 · Skip link target `#main-content` is missing on non-auth screens

**File:** `src/components/Shell.tsx:170`
**Severity:** Critical

The app shell renders `<main>` (line 170) but without an `id` attribute.
A skip link (once added) cannot target it. Keyboard users with motor disabilities
have no way to bypass the sidebar and top-bar navigation on every page change.

**Fix:**
```tsx
// Line 170:
<main id="main-content" className="flex-1 overflow-y-auto transition-screen">

// Add skip link before <aside> (line 62):
<a href="#main-content"
  className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
    focus:px-3 focus:py-1.5 focus:bg-[var(--color-navy)] focus:text-white focus:text-sm
    focus:font-medium focus:rounded focus:shadow-lg">
  {lang === 'hi' ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
</a>
```

---

## ACC-20 · NextSteps inputs have no `aria-label`

**File:** `src/screens/Closing.tsx:154–160`
**Severity:** High

```tsx
<input
  type="text"
  value={step}
  onChange={e => updateStep(i, e.target.value)}
  placeholder={placeholder[i % placeholder.length]}
  className="flex-1 px-3 py-2 text-sm ..."
  lang={lang === 'hi' ? 'hi' : 'en'}
/>
```

No `aria-label` or `<label>` association. AT announces the placeholder (if any) or
nothing at all. With multiple identical inputs, users cannot navigate by input.

**Fix:**
```tsx
<input
  ...
  aria-label={lang === 'hi' ? `चरण ${i + 1}` : `Step ${i + 1}`}
/>
```

---

## ACC-21 · NextSteps remove button is 26px and uses generic `aria-label`

**File:** `src/screens/Closing.tsx:162–169`
**Severity:** High

```tsx
<button
  onClick={() => removeStep(i)}
  className="flex-shrink-0 text-[var(--color-muted)] hover:text-[var(--color-danger)] px-2 py-1 transition-colors text-lg leading-none"
  aria-label={lang === 'hi' ? 'हटाएं' : 'Remove'}
>
  ×
</button>
```

`px-2 py-1` ≈ 26×30px — below the 44×44px WCAG 2.5.8 minimum.
`aria-label="Remove"` is generic — AT cannot distinguish between 5 identical Remove buttons.

**Fix:**
```tsx
<button
  onClick={() => removeStep(i)}
  className="flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center
    text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors"
  aria-label={lang === 'hi' ? `चरण ${i + 1} हटाएं` : `Remove step ${i + 1}`}
>
  <span aria-hidden="true">×</span>
</button>
```

---

## ACC-22 · Deletion countdown has no `aria-live` announcement

**File:** `src/screens/Deletion.tsx:83–95`
**Severity:** High

The countdown `{del.undoSecondsLeft}` is rendered in a `<p>` with no `aria-live` region.
Screen reader users have no auditory cue that time is running out — they must navigate
to the countdown text manually, which is unreasonable within a 10-second window.

**Fix — add a sparse live region that announces only key moments:**
```tsx
{[10, 5, 3, 2, 1].includes(del.undoSecondsLeft) && (
  <div aria-live="assertive" aria-atomic="true" className="sr-only">
    {lang === 'hi'
      ? `${del.undoSecondsLeft} सेकंड में हटाया जाएगा। रद्द करने के लिए बटन दबाएं।`
      : `Deleting in ${del.undoSecondsLeft} seconds. Press Undo to cancel.`}
  </div>
)}
```

---

## ACC-23 · Deletion undo button: live label floods AT every second

**File:** `src/screens/Deletion.tsx:94`
**Severity:** High

```tsx
<Button variant="secondary" onClick={cancelDelete} size="lg">
  {lang === 'hi' ? `रद्द करें (${del.undoSecondsLeft}s)` : `Undo (${del.undoSecondsLeft}s)`}
</Button>
```

`del.undoSecondsLeft` changes every second. Because the button text is its accessible name,
AT announces the full updated label every second for 10 seconds, flooding the user with
10 identical-sounding interruptions.

**Fix — separate accessible name from visible countdown:**
```tsx
<Button
  variant="secondary"
  onClick={cancelDelete}
  size="lg"
  aria-label={lang === 'hi' ? 'हटाना रद्द करें' : 'Cancel deletion'}
>
  {lang === 'hi' ? 'रद्द करें' : 'Undo'}
  <span aria-hidden="true" className="ml-1.5 text-sm opacity-60">({del.undoSecondsLeft}s)</span>
</Button>
```

---

## ACC-24 · Review stats use colour only to convey state (Warning, Success)

**File:** `src/screens/Review.tsx:34–43`
**Severity:** High

```tsx
[
  { value: confirmedFacts.length, color: 'text-[var(--color-success)]' },
  { value: uncertainFacts.length, color: 'text-[var(--color-warning)]' },
]
```

The "Uncertain" and "Confirmed" stats are distinguished only by colour.
With no icon, pattern, or label inside the number, colour-blind or low-vision users
cannot tell which stat is worrying and which is positive.

**Fix — add non-colour indicator to each stat:**
```tsx
const stats = [
  { label: ..., value: confirmedFacts.length, color: 'text-[var(--color-success)]', icon: '✓' },
  { label: ..., value: readyDocs.length, color: 'text-[var(--color-navy)]', icon: '📄' },
  { label: ..., value: dispute.parties.length, color: 'text-[var(--color-navy-mid)]', icon: '👤' },
  { label: ..., value: uncertainFacts.length, color: 'text-[var(--color-warning)]', icon: '?' },
];

// In render:
<p className={`text-2xl font-bold ${stat.color}`}>
  <span aria-hidden="true" className="text-base mr-0.5">{stat.icon}</span>
  {stat.value}
</p>
```

---

## ACC-25 · Export privacy toggle `aria-label` props silently dropped (from A-050)

**File:** `src/screens/Export.tsx:73`, `src/components/ui.tsx` Toggle component
**Severity:** Critical

Verified in A-050. The `Toggle` component's `...rest` spread was not applied to the
`<button>` element. All 5 Export privacy toggles pass `aria-label` but it is never
rendered. The state (on/off) is conveyed only by colour.

See A-050 `exact-fixes.md:FIX-04` for the two-line fix:
```tsx
// ui.tsx Toggle:
<button
  {...rest}  // ADD THIS — spreads aria-label and other attributes
  onClick={...}
  role="switch"
  aria-checked={checked}
/>
```

---

## ACC-26 · FileLabel disabled Continue button has no hint — user doesn't know why

**File:** `src/screens/Closing.tsx:90`
**Severity:** Medium

```tsx
<Button onClick={handleSave} disabled={!label.trim()} fullWidth>
  {lang === 'hi' ? 'अगले चरण पर जाएं' : 'Continue to next steps'}
</Button>
```

The button is disabled until `label.trim()` is non-empty. No hint text explains this.
AT announces "Continue to next steps, dimmed" with no further context.

**Fix — add inline hint below the input when label is empty:**
```tsx
{!label.trim() && (
  <p className="text-xs text-[var(--color-muted)] mt-2" role="status">
    {lang === 'hi'
      ? 'जारी रखने के लिए फ़ाइल लेबल दर्ज करें।'
      : 'Enter a file label to continue.'}
  </p>
)}
```

---

## ACC-27 · Settings language toggle buttons have no `aria-pressed`

**File:** `src/components/Shell.tsx:112–122`
**Severity:** Medium

Verified in A-050 ACC-15. Language toggle buttons in the sidebar have no `aria-pressed`
attribute. AT cannot convey which language is currently active.

**Fix:**
```tsx
<button
  aria-pressed={lang === 'en'}
  aria-label="Switch to English"
  onClick={() => setLang('en')}
  ...
>
```

---

## ACC-28 · Sidebar nav buttons have no `aria-current`

**File:** `src/components/Shell.tsx:68–77`
**Severity:** Medium

Verified in A-050 ACC-16. Sidebar navigation buttons do not receive `aria-current="page"`
when active. AT cannot announce which section the user is in.

**Fix:**
```tsx
<button
  aria-current={isActive ? 'page' : undefined}
  ...
>
```

---

## ACC-29 · MFA toggle in Settings — `label` prop not passed → no accessible name

**File:** `src/screens/Account.tsx:117`, `src/components/ui.tsx` Toggle
**Severity:** Medium

The MFA toggle is rendered as:
```tsx
<Toggle checked={mfa} onChange={setMfa} />
```

No `label` or `aria-label` prop. The `Toggle` component does not have an internal
label. AT announces "switch, off" with no name — the user does not know what MFA is.

**Fix:**
```tsx
<Toggle
  checked={mfa}
  onChange={setMfa}
  aria-label={lang === 'hi' ? 'दो-चरणीय प्रमाणीकरण' : 'Two-factor authentication'}
/>
// (once the ...rest spread fix ACC-25 is applied, aria-label will reach the button)
```

---

## ACC-30 · Hindi text in Activity list truncated — no `title` fallback

**File:** `src/screens/Account.tsx:62`
**Severity:** Low (UX)

```tsx
<p className="text-sm font-semibold text-[var(--color-navy)] truncate">{activity.title}</p>
```

Hindi activity titles are often longer than their English equivalents.
`truncate` clips them. No `title` attribute fallback.

**Fix:**
```tsx
<p className="text-sm font-semibold text-[var(--color-navy)] truncate" title={activity.title}>
  {activity.title}
</p>
```

---

## Priority summary (ACC-18–ACC-30)

| ID | Severity | File | Issue |
|----|----------|------|-------|
| ACC-18 | Critical | `Shell.tsx:47` | Auth screens: no landmark |
| ACC-19 | Critical | `Shell.tsx:170` | Skip link target missing |
| ACC-25 | Critical | `Export.tsx:73` | Toggle aria-label dropped (A-050) |
| ACC-20 | High | `Closing.tsx:154` | NextSteps inputs: no label |
| ACC-21 | High | `Closing.tsx:162` | Remove button: 26px + generic label |
| ACC-22 | High | `Deletion.tsx:83` | Countdown: no aria-live |
| ACC-23 | High | `Deletion.tsx:94` | Undo label floods AT every second |
| ACC-24 | High | `Review.tsx:34` | Stats: colour-only |
| ACC-26 | Medium | `Closing.tsx:90` | Disabled button: no hint |
| ACC-27 | Medium | `Shell.tsx:112` | Lang toggle: no aria-pressed |
| ACC-28 | Medium | `Shell.tsx:68` | Sidebar nav: no aria-current |
| ACC-29 | Medium | `Account.tsx:117` | MFA toggle: no label |
| ACC-30 | Low | `Account.tsx:62` | Hindi truncated: no title |
