# A-063 Developer Fixes

Branch: `feature/fma-foundation-v1`  
Commit: `14c5ea0bc4234f2055dda879d324398e99c46d4c`  
Date: 2026-09-26  
Order: Critical → Major → Minor  
Each fix is self-contained and copy-paste ready.

---

## CRITICAL FIXES

---

### FIX-C001 — Implement post-login redirect (unblocks deep links)

**Files:** `app/src/routes/login.tsx`, `app/src/components/mvp/require-session.tsx`, `app/src/components/mvp/screens/login-screen.tsx`

This is the smallest Critical fix to land first; it has no backend dependency.

**Step 1 — Add `redirect` search param to login route**

```tsx
// app/src/routes/login.tsx — replace current file content
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { LoginScreen } from "@/components/mvp/screens/login-screen";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sign in — NyayOS" },
      { name: "description", content: "Sign in to NyayOS to organise your dispute file." },
      { property: "og:title", content: "Sign in — NyayOS" },
      { property: "og:description", content: "Sign in to NyayOS to organise your dispute file." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginScreen,
});
```

**Step 2 — Pass redirect param from RequireSession**

```tsx
// app/src/components/mvp/require-session.tsx
// Replace the Navigate import and usage:
import { Navigate, useNavigate, useRouterState } from "@tanstack/react-router";

// Inside RequireSession, replace:
//   if (!user) return <Navigate to="/login" replace />;
// With:
  const location = useRouterState({ select: (s) => s.location });
  if (!user) {
    return (
      <Navigate
        to="/login"
        search={{ redirect: location.href }}
        replace
      />
    );
  }
```

**Step 3 — Read and use redirect in LoginScreen**

```tsx
// app/src/components/mvp/screens/login-screen.tsx
// Add to imports:
import { Route } from "@/routes/login";

// Inside LoginScreen function body, add:
const { redirect } = Route.useSearch();

// Replace the signIn onClick handler (currently ~line 93):
onClick={() => {
  setGoogleNotice(false);
  const outcome = signIn(persona.id);
  if (outcome.ok) void navigate({ to: redirect ?? "/disputes" });
  else setRefused(true);
}}
```

**Test:** Navigate to `/disputes/abc/evidence` while signed out → should land on `/login?redirect=%2Fdisputes%2Fabc%2Fevidence`. Sign in → should land on `/disputes/abc/evidence`.

---

### FIX-C002 — Redirect root `/` to login or disputes

**File:** `app/src/routes/index.tsx`

This avoids real users seeing the component showcase.

```tsx
// app/src/routes/index.tsx — replace the component export at the bottom of the file
// Keep all other content (FoundationShowcase, etc.) but change:

// BEFORE:
export const Route = createFileRoute("/")({
  // ...
  component: FoundationShowcase,
});

// AFTER:
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "NyayOS" }],
  }),
  component: IndexRedirect,
});

function IndexRedirect() {
  const { user, status } = useMvp();
  if (status === "loading") return null;
  return <Navigate to={user ? "/disputes" : "/login"} replace />;
}

// Move FoundationShowcase to /foundation by creating:
// app/src/routes/foundation.tsx
// and exporting FoundationShowcase there.
```

**Test:** Navigate to `/` while signed out → should redirect to `/login`. Navigate to `/` while signed in → should redirect to `/disputes`.

---

### FIX-C003 — Simulate document scan completion (unblocks U07 workflow in staging)

**File:** `app/src/mvp/store.tsx` and `app/src/components/mvp/screens/evidence-locker-screen.tsx`

**Step 1 — Add `advanceDocumentToReady` action to store**

```tsx
// app/src/mvp/store.tsx — add to MvpStore interface
advanceDocumentToReady: (documentId: string, pages: string[]) => void;

// In the store useMemo, add alongside removeDocument:
advanceDocumentToReady: (documentId, pages) =>
  mapDocs(documentId, (doc) => ({ ...doc, state: "ready" as const, pages })),
```

**Step 2 — Trigger simulation after hashing in EvidenceLockerScreen**

```tsx
// app/src/components/mvp/screens/evidence-locker-screen.tsx
// Destructure the new action:
const { data, user, addDocument, renameDocument, setDocumentCategory, removeDocument, advanceDocumentToReady } = useMvp();

// After addDocument(doc); in the handleFiles loop, add:
addDocument(doc);
added++;

// Schedule scan simulation (2 s delay)
const docId = doc.id;
const fileName = file.name;
setTimeout(() => {
  advanceDocumentToReady(docId, [
    `[Staging preview — synthetic page text for ${fileName}]\n\nThis document was fingerprinted in your browser. In the production version, its text would be extracted here so you can read it page by page and mark where each fact comes from.`,
  ]);
}, 2000);
```

**Test:** Add any PDF or image → after ~2 seconds, state badge should change from "Waiting for safety scan" to "Ready to view". Click "View" → should open DocumentViewerScreen with the synthetic page text.

---

### FIX-C004 — Guard `createDispute` return value before navigation

**File:** `app/src/mvp/store.tsx` and `app/src/components/mvp/screens/what-happened-screen.tsx`

**Step 1 — Change return type**

```tsx
// app/src/mvp/store.tsx — MvpStore interface, change:
createDispute: (title: string, statement: string) => string;
// To:
createDispute: (title: string, statement: string) => string | null;

// Implementation — change:
createDispute: (title, statement) => {
  const id = `dsp-${Date.now().toString(36)}`;
  setState((s) => {
    if (!s.user) return s;
    return { ...s, data: { ...s.data, disputes: [...s.data.disputes, { id, ... }] } };
  });
  return id; // always returned even when user is null
},
// To:
createDispute: (title, statement) => {
  let created = false;
  const id = `dsp-${Date.now().toString(36)}`;
  setState((s) => {
    if (!s.user) return s;
    created = true;
    return { ...s, data: { ...s.data, disputes: [...s.data.disputes, { id, ... }] } };
  });
  return created ? id : null;
},
```

**Step 2 — Guard navigation**

```tsx
// app/src/components/mvp/screens/what-happened-screen.tsx
// In the onSubmit handler, replace:
const id = createDispute(title.trim(), statement);
void navigate({ to: "/disputes/$disputeId/intake", params: { disputeId: id } });

// With:
const id = createDispute(title.trim(), statement);
if (id) {
  void navigate({ to: "/disputes/$disputeId/intake", params: { disputeId: id } });
} else {
  void navigate({ to: "/login" });
}
```

**Test:** This is a defensive fix for a race condition. Verify normal flow still works: fill form and submit → navigate to intake. No change in happy path.

---

## MAJOR FIXES

---

### FIX-M001 — Add `tabIndex="-1"` to skip-to-content targets

**Files:** `app/src/components/mvp/dispute-frame.tsx`, `app/src/components/mvp/screens/dispute-list-screen.tsx`, `app/src/components/mvp/screens/what-happened-screen.tsx`

```tsx
// dispute-frame.tsx line 44 — BEFORE:
<main id="main" className="min-w-0 pb-16">
// AFTER:
<main id="main" tabIndex={-1} className="min-w-0 pb-16 focus:outline-none">

// dispute-list-screen.tsx line 30 — BEFORE:
<main id="main" className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:px-6 sm:py-10">
// AFTER:
<main id="main" tabIndex={-1} className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:px-6 sm:py-10 focus:outline-none">

// what-happened-screen.tsx line 24 — BEFORE:
<main id="main" className="mx-auto grid max-w-3xl gap-6 px-4 py-6 sm:px-6 sm:py-10">
// AFTER:
<main id="main" tabIndex={-1} className="mx-auto grid max-w-3xl gap-6 px-4 py-6 sm:px-6 sm:py-10 focus:outline-none">
```

**Test:** Tab to the "Skip to content" link → press Enter → keyboard focus must visibly move to the `<main>` content area (not stay on the link or go to the first interactive element inside main).

---

### FIX-M002 — Sync `<html lang>` attribute with selected language

**File:** `app/src/routes/__root.tsx`

```tsx
// Add import:
import { useMvp } from "../mvp/store";

// Add new component inside __root.tsx:
function LangSync() {
  const { language } = useMvp();
  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return null;
}

// In RootComponent, add <LangSync /> inside <MvpProvider>:
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
```

**Test:** Load the app → inspect `<html>` element → `lang="en"`. Switch to Hindi in the header → `lang` attribute must change to `"hi"`. Switch back → must return to `"en"`.

---

## MINOR FIXES

---

### FIX-m001 — Add `role="region"` to document viewer page text div

**File:** `app/src/components/mvp/screens/document-viewer-screen.tsx` line 82

```tsx
// BEFORE:
<div
  className="min-h-72 whitespace-pre-wrap rounded-lg border border-border-strong bg-card p-5 font-mono text-sm leading-relaxed text-foreground shadow-[var(--shadow-token-sm)]"
  tabIndex={0}
  aria-label={`Page ${page} text, read-only`}
>

// AFTER:
<div
  role="region"
  tabIndex={0}
  aria-label={`Page ${page} of ${total} — read only`}
  className="min-h-72 whitespace-pre-wrap rounded-lg border border-border-strong bg-card p-5 font-mono text-sm leading-relaxed text-foreground shadow-[var(--shadow-token-sm)]"
>
```

**Test:** Tab into the page text area → VoiceOver/NVDA should announce "Page 1 of N — read only, region".

---

### FIX-m002 — Stabilise evidence locker hashing live region

**File:** `app/src/components/mvp/screens/evidence-locker-screen.tsx` lines 101–106

```tsx
// BEFORE (conditional render):
{hashing ? (
  <p role="status" className="text-sm text-muted-foreground">
    Fingerprinting files…
  </p>
) : null}

// AFTER (always-present live region):
<p role="status" aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
  {hashing ? "Fingerprinting files…" : ""}
</p>
```

**Test:** With a screen reader active, add a file → "Fingerprinting files…" must be announced within 1 second.

---

### FIX-m003 — Add `font-devanagari` Tailwind utility class

**File:** `app/src/styles.css` and `app/src/routes/index.tsx`

```css
/* app/src/styles.css — add inside @layer utilities */
@layer utilities {
  .font-devanagari {
    font-family: var(--font-devanagari);
  }
}
```

```tsx
// app/src/routes/index.tsx line 134 — BEFORE:
<div lang="hi" style={{ fontFamily: "var(--font-devanagari)" }}>

// AFTER:
<div lang="hi" className="font-devanagari">
```

**Test:** Load the foundation showcase → Tokens → Typography section → Hindi block must render in Noto Sans Devanagari.

---

### FIX-m004 — Add scroll indicator to mobile horizontal step nav

**File:** `app/src/components/mvp/dispute-frame.tsx` lines 39–48

```tsx
// BEFORE:
<ul className="-mx-1 mt-2 flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible">

// AFTER (add right gradient fade on mobile):
<div className="relative md:contents">
  <ul className="-mx-1 mt-2 flex gap-1 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
    {/* ...steps... */}
  </ul>
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent md:hidden"
  />
</div>
```

**Test:** At 375px with 6 steps, a right-side fade must be visible. The list must still be scrollable past the fade.

---

### FIX-m005 — Make evidence drop zone tappable on mobile

**File:** `app/src/components/mvp/screens/evidence-locker-screen.tsx` lines 87–100

```tsx
// Add onClick to the drop zone container to open the file picker:
<div
  onClick={() => inputRef.current?.click()}
  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
  role="button"
  tabIndex={0}
  aria-label="Add documents — click to choose files"
  onDragOver={...}
  onDragLeave={...}
  onDrop={...}
  className={...}
>
  {/* existing content */}
  <input
    ref={inputRef}
    id="locker-file"
    type="file"
    // Add className to visually hide but keep accessible (the label still works):
    className="sr-only"  // remove the verbose file: styling; the label+click handles UI
  />
</div>
```

Note: This approach hides the native file input and uses the styled drop zone as the trigger. The `<label htmlFor="locker-file">` still works alongside the `onClick` handler.

**Test:** On a mobile browser at 375px, tap anywhere in the drop zone → native file picker must open.
