# A-057 — Mobile UX Gaps

**Viewport:** 375–768px (primary), 320px (stress)
**Date:** 2026-09-26
**Extends:** A-050 MOB-01–MOB-07

---

## MOB-08 · Auth screens can overflow or clip on 375px portrait

**File:** `src/screens/Auth.tsx:38, 150`
**Severity:** High

Sign-in container:
```tsx
<div className="min-h-screen bg-[var(--color-navy)] flex flex-col items-center justify-center px-4">
```

Consent container:
```tsx
<div className="min-h-screen bg-[var(--color-navy)] px-4 py-8 flex items-center justify-center">
```

Both use `justify-center` without `overflow-y-auto`. On 375px the sign-in card
is tall enough that at default browser zoom (text ≥ 16px) the bottom CTA can clip
off-screen. On iOS Safari with the bottom bar, effective viewport is ≈ 620px — the
consent screen (long lists) almost certainly scrolls beyond the top at 16px text.

**Fix:**
```tsx
// SignIn:
<div className="min-h-screen bg-[var(--color-navy)] flex flex-col items-center
  justify-start sm:justify-center px-4 py-6 overflow-y-auto">

// Consent:
<div className="min-h-screen bg-[var(--color-navy)] px-4 py-8 overflow-y-auto
  flex flex-col items-center sm:justify-center">
```

---

## MOB-09 · Consent card panels use `bg-white/08` — fails contrast on mobile screens

**File:** `src/screens/Auth.tsx:167, 182`
**Severity:** High

The "What NyayOS does" and "What NyayOS does not" panels use:
```tsx
className="bg-white/08 rounded-[var(--radius-lg)] p-4 border border-white/12"
className="bg-white/05 rounded-[var(--radius-lg)] p-4 border border-white/10"
```

`border-white/12` = 12% white on navy ≈ #213F57 — the border is nearly invisible.
But more critically on mobile AMOLED screens in direct sunlight, the white text
on 8%/5% white panel reads poorly. The panels are purely decorative at this opacity.

**Fix — increase panel contrast:**
```tsx
// Does:
className="bg-white/[0.12] rounded-[var(--radius-lg)] p-4 border border-white/20"
// Does not:
className="bg-white/[0.08] rounded-[var(--radius-lg)] p-4 border border-white/15"
```

---

## MOB-10 · Dashboard "New dispute" button is `size="sm"` — 32px on mobile

**File:** `src/screens/Dashboard.tsx:46`
**Severity:** High

```tsx
<Button variant="amber" onClick={onNewDispute} size="sm">
  {t(lang, 'newDispute')}
</Button>
```

`size="sm"` renders `py-1.5 px-3` = ≈ 32px height. The primary CTA for the entire
app is 12px below the 44px WCAG 2.5.8 minimum. Fingertip error rate increases sharply
below 44px.

**Fix:**
```tsx
<Button variant="amber" onClick={onNewDispute} size="sm"
  className="min-h-[44px] md:min-h-8">
  {t(lang, 'newDispute')}
</Button>
```

---

## MOB-11 · FileLabel disabled continue button gives no hint on mobile

**File:** `src/screens/Closing.tsx:90`
**Severity:** Medium

On mobile, users frequently tap a disabled button without reading the entire page.
The button gives no feedback — it is simply inert.

**Fix (same as ACC-26) — show inline hint:**
```tsx
{!label.trim() && (
  <p className="text-xs text-[var(--color-muted)] mt-2">
    {lang === 'hi'
      ? 'जारी रखने के लिए फ़ाइल लेबल दर्ज करें।'
      : 'Enter a file label above to continue.'}
  </p>
)}
```

---

## MOB-12 · Deletion dispute delete buttons are `size="sm"` — below 44px

**File:** `src/screens/Deletion.tsx:172–177`
**Severity:** High

```tsx
<Button
  variant="danger"
  size="sm"
  onClick={() => initDelete('dispute', d.id)}
>
  {lang === 'hi' ? 'हटाएं' : 'Delete'}
</Button>
```

Same issue as MOB-10: `size="sm"` = 32px. This is a destructive action.
A mistap on a 32px delete button is not recoverable within 10 seconds if the user
does not notice the undo window.

**Fix:**
```tsx
<Button
  variant="danger"
  size="sm"
  className="min-h-[44px] md:min-h-8"
  onClick={() => initDelete('dispute', d.id)}
>
```

---

## MOB-13 · Review and WhatUseful CTAs not sticky — below fold on long disputes

**File:** `src/screens/Review.tsx:101`, `src/screens/Review.tsx:208`
**Severity:** Medium

Both Review and WhatUseful have:
```tsx
<div className="mt-6 flex gap-3">
  <Button variant="secondary" onClick={onBack} ...>
  <Button onClick={onNext} fullWidth>
```

For disputes with many facts or documents, this div is pushed far below the fold
on 375px. The user must scroll to the bottom to proceed. No sticky CTA.

**Fix — apply same sticky bar pattern used elsewhere:**
```tsx
<div className="h-20 md:hidden" aria-hidden="true" />
<div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto
  bg-white md:bg-transparent border-t md:border-0 border-[var(--color-border)]
  px-4 py-3 md:px-0 md:py-0 md:mt-6 flex gap-3 z-30
  shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:shadow-none">
  <Button variant="secondary" onClick={onBack} className="flex-shrink-0">Back</Button>
  <Button onClick={onNext} fullWidth>Continue</Button>
</div>
```

---

## MOB-14 · Mobile nav during dispute flow shows main nav — no step context

**File:** `src/components/Shell.tsx:175–187`
**Severity:** Medium

Verified in A-050 MOB-02. The bottom mobile nav always shows the 4 MAIN_NAV items
even during the 13-step dispute flow. Users in step 5 (Parties) still see
"Home / Search / Notifications / Account" — not "Back / Step 5 of 13 / Forward".

This is pre-existing. The A-050 fix recommendation stands. No new analysis added.

---

## Priority summary (MOB-08–MOB-14)

| ID | Severity | File | Issue |
|----|----------|------|-------|
| MOB-10 | High | `Dashboard.tsx:46` | New dispute button 32px |
| MOB-12 | High | `Deletion.tsx:172` | Delete buttons 32px |
| MOB-08 | High | `Auth.tsx:38,150` | Auth overflow on 375px |
| MOB-09 | High | `Auth.tsx:167` | Consent panels low contrast |
| MOB-11 | Medium | `Closing.tsx:90` | Disabled button no hint |
| MOB-13 | Medium | `Review.tsx:101` | CTA not sticky |
| MOB-14 | Medium | `Shell.tsx:175` | Mobile nav during dispute |
