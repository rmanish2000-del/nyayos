# A-063 Mobile / Tablet / Desktop Audit

Branch: `feature/fma-foundation-v1`  
Commit: `14c5ea0bc4234f2055dda879d324398e99c46d4c`  
Date: 2026-09-26  
Breakpoints tested: 375px (mobile), 768px (tablet), 1280px (desktop)

---

## Layout Architecture

The app uses a two-tier layout system:

1. **Top-level pages** (login, dispute list, new dispute): `mx-auto max-w-{3xl|4xl}` centred column with `px-4 sm:px-6` padding. Single-column at all widths.

2. **Dispute pages** (intake, evidence, facts, timeline, export, document viewer): `DisputeFrame` uses `grid md:grid-cols-[13rem_minmax(0,1fr)]`. Below `md` (768px), the step navigation becomes a horizontal scroller above the content. At and above `md`, it becomes a left sidebar.

---

## Mobile (375px)

### Navigation — DisputeFrame

**File:** `app/src/components/mvp/dispute-frame.tsx` lines 26–46

The step nav renders as a horizontal flex row with `overflow-x-auto` and `pb-1`. Items are `shrink-0` so they don't compress. This works, but:

- **Issue (Minor):** The horizontal scroll bar is visible on iOS/Android with no custom scrollbar styling. At 375px with 6 steps, users must swipe to see all steps. There is no visual indicator (fade, shadow) that the list is scrollable.
- **Issue (Minor):** The nav `<p>` showing the dispute title is truncated with `truncate` — correct — but the full title is only in the `title` attribute which is not accessible on touch devices.
- **Pass:** Each step link has the `touch-target` class (min 44px height). `whitespace-nowrap` prevents label wrapping.

### Evidence Locker File Input

**File:** `app/src/components/mvp/screens/evidence-locker-screen.tsx` lines 113–120

The `<input type="file">` uses `file:min-h-11` (44px) on the file-picker button. The drop zone is a full-width container. On mobile, drag-and-drop is not supported; the label text says "drag files here or choose them", which is acceptable — the file picker button is the touch path.

- **Pass:** Touch target meets 44px minimum.
- **Issue (Minor):** The drop zone area itself has no `role="button"` or `onClick` handler to open the file picker. Tapping the drop zone area (outside the `<input>`) does nothing on mobile.

### Fact Review Filter Buttons

**File:** `app/src/components/mvp/screens/fact-review-screen.tsx` lines 70–83

Filter buttons use `touch-target` class and wrap with `flex-wrap`. At 375px this wraps to 2–3 rows.

- **Pass:** 44px touch targets.
- **Pass:** Wrapping is correct; no horizontal overflow.

### Export Preview Privacy Checkbox

**File:** `app/src/components/mvp/screens/export-screens.tsx` lines 126–133

```tsx
<label className="flex touch-target items-start gap-3 text-sm text-foreground">
  <input type="checkbox" ... className="mt-0.5 size-5 shrink-0 ..." />
  I have checked what this export contains.
</label>
```

- **Pass:** The `size-5` (20px) checkbox is smaller than 44px but the entire `<label>` has `touch-target`, making the effective tap area 44px tall. The label text wraps and extends the target height. Acceptable.

### Document Viewer Pagination

**File:** `app/src/components/mvp/screens/document-viewer-screen.tsx` lines 95–109

Prev/Next page buttons are `size="compact"` and wrapped in `flex`. At 375px they sit inline.

- **Issue (Minor):** `size="compact"` buttons are below 44px height. These are navigating content (not submitting data), but the touch target still falls short of WCAG 2.5.5 Target Size (Level AAA) and best practice. Use `size` (default) or ensure the compact variant meets 44px.

---

## Tablet (768px)

### DisputeFrame Layout Switch

**File:** `app/src/components/mvp/dispute-frame.tsx` line 37

At `md` (768px), the layout switches from a horizontal nav scroll to a two-column grid:
```
md:grid-cols-[13rem_minmax(0,1fr)]
```
The nav sidebar shows step icons + labels in a vertical list. This is the primary navigation for tablet users.

- **Pass:** The transition is clean with `md:flex-col` and `md:overflow-visible`.
- **Pass:** The sidebar is 208px wide (13rem), leaving adequate content width.

### ScreenHeader Actions Overflow

**File:** `app/src/components/mvp/states.tsx` line 101

```tsx
<header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
```

The `_auto` column for actions will shrink the title if the action buttons are wide. At 768px with a long dispute title and a two-button action row, this can cause the title to compress to one or two words per line.

- **Issue (Minor):** No wrapping fallback when both columns are constrained. Consider `sm:grid-cols-[minmax(0,1fr)_auto]` with a single-column fallback below `sm`.

### Evidence Locker Filters

**File:** `app/src/components/mvp/screens/evidence-locker-screen.tsx` lines 137–162

Two `<select>` filter controls with `flex-wrap` on tablet. At 768px, both fit on one row with the document count heading.

- **Pass:** Layout works correctly. Touch targets meet 44px via `touch-target` on the select elements.

---

## Desktop (1280px)

### DisputeFrame Sidebar

At 1280px the sidebar renders at 13rem with the content taking the remainder. With `max-w-6xl` wrapping the outer container, the layout centres correctly.

- **Pass:** Step nav is readable and the content area has good line length (max-w not constraining content).

### Document Viewer Two-Column Layout

**File:** `app/src/components/mvp/screens/document-viewer-screen.tsx` line 57

```tsx
<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
```

At 1280px the "Link a fact" sidebar shows at 18rem alongside the page content.

- **Pass:** Column widths are sensible. The aside is readable.

### Export Manifest Table

**File:** `app/src/components/mvp/screens/export-screens.tsx` lines 195–220

```tsx
<div className="overflow-x-auto">
  <table className="w-full min-w-[32rem] text-left text-sm">
```

At 1280px the table has full width. The `min-w-[32rem]` (512px) ensures it doesn't compress below readability on small screens.

- **Pass:** Table is accessible and responsive.

---

## Sticky CTAs

None of the Wave-1 screens implement a sticky/fixed CTA at the bottom of the viewport. The spec for "Save and continue" flows (intake, export generation) does not appear to require sticky CTAs. However:

- **Issue (Minor):** On the intake screen at 375px, the form actions ("Save answer", "I don't know", "Save and exit") are at the bottom of the question card which can be off-screen if the textarea is expanded to many rows. Users must scroll to find the submit button. A `position: sticky` or `position: fixed` footer for primary form actions would improve mobile UX.

---

## Summary Table

| Screen | 375px | 768px | 1280px | Touch Targets |
|---|---|---|---|---|
| Login (U01) | Pass | Pass | Pass | Pass |
| Dispute List | Pass | Pass | Pass | Pass |
| New Dispute (U04) | Pass | Pass | Pass | Pass |
| Intake (U05) | Minor: CTA off-screen | Pass | Pass | Pass |
| Evidence Locker (U06) | Minor: drop zone not tappable | Pass | Pass | Pass |
| Document Viewer (U07) | Minor: compact buttons | Pass | Pass | Minor: compact buttons |
| Fact Review (U08) | Pass | Pass | Pass | Pass |
| Timeline (U09) | Pass | Pass | Pass | Pass |
| Export Preview (U16) | Pass | Pass | Pass | Pass |
| Export Result (U17) | Pass | Pass | Pass | Pass |
| DisputeFrame Nav | Minor: no scroll indicator | Pass | Pass | Pass |
