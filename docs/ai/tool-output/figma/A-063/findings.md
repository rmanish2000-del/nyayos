# A-063 Findings

Branch: `feature/fma-foundation-v1`  
Commit: `14c5ea0bc4234f2055dda879d324398e99c46d4c`  
Date: 2026-09-26

---

## Critical Findings

### C-001 — No real backend: all data is ephemeral (sessionStorage only)

**File:** `app/src/mvp/store.tsx` lines 1–12, 62–66  
**Description:** The entire MVP state layer uses `window.sessionStorage` with keys `nyayos-preview-session` and `nyayos-preview-data`. On sign-out, both keys are deleted and data is reset to the seed. On tab close, all user-created disputes, documents, facts, answers and exports are lost. There is no Supabase client, no `supabase/` directory, and no DB migrations anywhere on this branch.

**Impact:** Any real user who signs in, creates a dispute, answers intake questions and uploads documents loses everything when they close the tab. This is correctly disclosed as "Staging preview · synthetic data" in `PreviewHeader`, but makes the branch unsuitable for any production or beta track.

**Fix:** Integrate Supabase client (`@supabase/supabase-js`). Replace the `sessionStorage` read/write in `MvpProvider` with Supabase queries. Requires DB schema, migrations and RLS policies that do not yet exist on this branch.

---

### C-002 — No real Google OAuth; authentication is entirely synthetic

**File:** `app/src/components/mvp/screens/login-screen.tsx` lines 46–53  
**File:** `app/src/components/mvp/google-button.tsx` lines 1–5  
**Description:** `GoogleSignInButton` fires a caller-supplied `onClick` prop. In `LoginScreen`, this prop shows an info banner (`setGoogleNotice(true)`) — no OAuth flow is initiated. Sign-in is possible only via the synthetic persona list (`SEED_USERS` fixtures). No JWT, session token, cookie or server-side session is created.

**Impact:** No real user account can be created or authenticated. The `user` object in the store is a `SeedUser` fixture, not a real identity.

**Fix:** Wire `supabase.auth.signInWithOAuth({ provider: "google" })` inside `GoogleSignInButton.onClick`. Handle the OAuth callback route. Remove or gate the synthetic personas behind a `VITE_ENABLE_SEED_USERS` environment variable.

---

### C-003 — Uploaded documents permanently stuck in `awaiting-scan`; U07 Document Viewer unreachable for user-uploaded files

**File:** `app/src/components/mvp/screens/evidence-locker-screen.tsx` lines 56–80  
**File:** `app/src/mvp/store.tsx` — no `advanceDocumentState` action exists  
**Description:** `EvidenceLockerScreen.handleFiles` creates each document with `state: "awaiting-scan"` and `pages: []`. No timer, hook, worker, or store action ever transitions a document to `state: "ready"`. `DocumentRow` shows a message ("Scanning is not available in this staging preview") but provides no workaround. `DocumentViewerScreen` (U07) immediately returns an `ErrorState` for any document not in `"ready"` state with non-empty pages.

**Impact:** The complete `evidence → document-viewer → mark source page` workflow (F10) is broken for any file added by the user. Only seeded fixture documents (already in `"ready"` state) can be opened in the viewer. New fact-to-page linking is therefore also blocked for real uploads.

**Fix (staging):** After `addDocument`, schedule a `setTimeout` (e.g. 2 s) that calls a new `advanceDocumentToReady(documentId, pages)` store action, populating synthetic page text from the file name and size. This lets the full workflow run without a real backend.

**Fix (production):** Replace with a real Supabase Storage upload + Edge Function that performs safety scanning and populates page text.

---

### C-004 — No post-login redirect; deep links break after authentication

**File:** `app/src/components/mvp/screens/login-screen.tsx` lines 93–95  
**Description:**
```tsx
// Current (line 93-95)
const outcome = signIn(persona.id);
if (outcome.ok) void navigate({ to: "/disputes" });
```
`RequireSession` redirects unauthenticated users to `/login` with `<Navigate to="/login" replace />` but does not append a `redirect` search param. After sign-in the user always lands at `/disputes` rather than the URL they originally requested.

**Impact:** Any bookmarked or shared link to a specific dispute, intake form or document viewer becomes a dead end for unauthenticated users.

**Fix:**
```tsx
// In require-session.tsx — pass redirect destination
<Navigate to="/login" search={{ redirect: router.state.location.href }} replace />

// In login-screen.tsx — read and use it
const { redirect } = Route.useSearch();
if (outcome.ok) void navigate({ to: redirect ?? "/disputes" });
```
Requires adding `validateSearch: z.object({ redirect: z.string().optional() })` to the `/login` route.

---

## Major Findings

### M-001 — Skip-to-content link destination lacks `tabIndex="-1"`; keyboard focus not reliably moved

**File:** `app/src/components/mvp/require-session.tsx` line 14  
**File:** `app/src/components/mvp/dispute-frame.tsx` line 44  
**Description:** The skip link targets `#main`:
```tsx
<a href="#main" className="sr-only focus:not-sr-only ...">Skip to content</a>
```
`DisputeFrame` renders:
```tsx
<main id="main" className="min-w-0 pb-16">
```
The `<main>` element is not natively focusable and has no `tabIndex`. In Firefox and some versions of Safari, activating a skip link to a non-focusable element scrolls the page but does not move keyboard focus, leaving focus on the skip link or the triggering element.

**Fix:**
```tsx
// dispute-frame.tsx line 44
<main id="main" tabIndex={-1} className="min-w-0 pb-16 focus:outline-none">
```
Apply the same fix to the `<main>` elements in `DisputeListScreen` (line 30 of dispute-list-screen.tsx) and `NewDisputeScreen` (line 24 of what-happened-screen.tsx).

---

### M-002 — Root `/` renders design system showcase; no redirect for end users

**File:** `app/src/routes/index.tsx` lines 35–38  
**Description:** The root route renders `FoundationShowcase` — a component library demo with colour swatches, typography specimens, fact cards, etc. Unauthenticated users landing on `/` see this page and must click "Open the MVP Wave-1 preview" to reach `/login`. Authenticated users landing on `/` are not redirected to `/disputes`.

**Fix:**
```tsx
// Replace FoundationShowcase component export in index.tsx with a redirect:
import { Navigate } from "@tanstack/react-router";
import { useMvp } from "@/mvp/store";

function IndexRedirect() {
  const { user } = useMvp();
  return <Navigate to={user ? "/disputes" : "/login"} replace />;
}
```
Move `FoundationShowcase` to a separate route such as `/foundation` or behind a `VITE_SHOW_FOUNDATION` feature flag.

---

### M-003 — `createDispute` always returns an ID and navigates even when user is null

**File:** `app/src/mvp/store.tsx` lines 131–150  
**File:** `app/src/components/mvp/screens/what-happened-screen.tsx` lines 46–54  
**Description:**
```ts
// store.tsx
createDispute: (title, statement) => {
  const id = `dsp-${Date.now().toString(36)}`;
  setState((s) => {
    if (!s.user) return s; // dispute NOT added
    return { ...s, data: { ...s.data, disputes: [...] } };
  });
  return id; // id ALWAYS returned even if user was null
},
```
`NewDisputeScreen` calls `createDispute` and immediately navigates to `/disputes/${id}/intake`. If the guard fires (user is null), the navigation goes to a dispute that does not exist, and `useDispute` returns `null`, showing the generic "This dispute isn't available" error page with no explanation.

**Impact:** Race condition if session expires between page load and form submit. Error page provides no recovery path.

**Fix:** Return `null | string` from `createDispute`, and check before navigating:
```tsx
// what-happened-screen.tsx
const id = createDispute(title.trim(), statement);
if (id) void navigate({ to: "/disputes/$disputeId/intake", params: { disputeId: id } });
else void navigate({ to: "/login" });
```

---

### M-004 — `disputes/new` route bypasses the `DisputeFrame`; missing PreviewHeader skip-link `id="main"` wiring verified inconsistently

**File:** `app/src/routes/disputes.new.tsx` line 16  
**File:** `app/src/components/mvp/screens/what-happened-screen.tsx` line 24  
**Description:** `NewDisputeScreen` renders its own `<main id="main">` and applies `mx-auto max-w-3xl` layout independently. All other dispute screens use `DisputeFrame` which renders the step navigation sidebar. `disputes.new.tsx` is mounted via the `/disputes` layout (which supplies `RequireSession` + PreviewHeader) so the header and skip link are present, but there is no step indicator, no dispute context, and no "back to disputes" link in the nav. This is likely intentional, but the `id="main"` on the `<main>` should still have `tabIndex="-1"` (see M-001).

---

### M-005 — No Supabase directory; `app/src/integrations/` does not exist on this branch

**File:** Repository root  
**Description:** A `supabase/` directory (for migrations and config) was not found. Neither was `app/src/integrations/` (a common location for the Supabase client singleton). No `SUPABASE_URL`, `SUPABASE_ANON_KEY` environment variable references appear in any source file. The entire production data layer is absent.

**Impact:** Any future Supabase integration starts from zero. RLS policies, schema migrations and client setup all need to be created.

---

## Minor Findings

### m-001 — Document viewer page div uses `tabIndex={0}` on a generic `div`; role is absent

**File:** `app/src/components/mvp/screens/document-viewer-screen.tsx` lines 82–89  
**Description:**
```tsx
<div
  className="min-h-72 whitespace-pre-wrap ... text-foreground ..."
  tabIndex={0}
  aria-label={`Page ${page} text, read-only`}
>
  {text}
</div>
```
A `tabIndex={0}` on a `<div>` makes it keyboard-focusable, which is intentional here (users need to scroll long page text). However, with no explicit `role`, screen readers announce it as a generic group or nothing, and the `aria-label` may not be reliably announced. It should have `role="region"` or `role="document"` to convey read-only document content semantics.

**Fix:**
```tsx
<div
  role="region"
  tabIndex={0}
  aria-label={`Page ${page} of ${total}, read-only`}
  className="..."
>
```

---

### m-002 — Accessibility self-checklist in `index.tsx` records two open items

**File:** `app/src/routes/index.tsx` lines 330–341 (CHECKS array)  
**Description:** The foundation showcase's own accessibility checklist explicitly records:
- "Formal contrast audit with an automated tool" → "Not yet run"
- "Screen-reader pass with NVDA / VoiceOver" → "Not yet run"

These are not bugs in the showcase; they are documented gaps that must be closed before a public beta.

---

### m-003 — Inline Devanagari font applied via `style` prop, not a design token

**File:** `app/src/routes/index.tsx` line 134  
**Description:**
```tsx
<div lang="hi" style={{ fontFamily: "var(--font-devanagari)" }}>
```
The project's stated policy is "components never hold raw colour values" and, by extension, design tokens should be applied via Tailwind utility classes, not inline `style` props. A `font-devanagari` utility class should be defined in `styles.css`.

**Fix:**
```css
/* styles.css */
@layer utilities {
  .font-devanagari { font-family: var(--font-devanagari); }
}
```
```tsx
<div lang="hi" className="font-devanagari">
```

---

### m-004 — `lang` attribute on `<html>` is hardcoded to `"en"` regardless of selected language

**File:** `app/src/routes/__root.tsx` line 108  
**Description:**
```tsx
<html lang="en">
```
The app supports English and Hindi (`language` in store). When a user switches to Hindi, the `<html lang>` attribute remains `"en"`, causing screen readers to use English pronunciation rules for Devanagari content. Individual elements use `lang={language}` correctly (e.g. `intake-screen.tsx` line 61), but the document-level language attribute is never updated.

**Fix:**
```tsx
// In RootShell or a child component, sync lang to the store language:
// One approach: use a useEffect in RootComponent to set document.documentElement.lang
React.useEffect(() => {
  document.documentElement.lang = language;
}, [language]);
```
Because `RootShell` is a static SSR shell, reading the store inside it requires lifting `language` through context or setting it imperatively.

---

### m-005 — Evidence locker file input has no explicit `role="status"` announcement on hashing start

**File:** `app/src/components/mvp/screens/evidence-locker-screen.tsx` line 104  
**Description:** The `<p role="status">` that announces "Fingerprinting files…" is rendered conditionally inside the drop zone. When `hashing` transitions from `false` to `true`, the `<p>` element appears in the DOM. However, because the element is not present before the announcement, some screen reader + browser combinations may not reliably announce the injected text. The pattern `aria-live` region always-present-in-DOM with conditional text content is more reliable.

**Fix:**
```tsx
// Replace conditional render with always-present live region:
<p role="status" aria-live="polite" className="text-sm text-muted-foreground min-h-5">
  {hashing ? "Fingerprinting files…" : ""}
</p>
```
