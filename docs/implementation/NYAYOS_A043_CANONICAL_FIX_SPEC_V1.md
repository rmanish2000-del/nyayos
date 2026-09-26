# A-043 Canonical Fix Specification V1 — for Lovable (A-065)

| Field | Value |
|---|---|
| Task | **A-065**, Lovable. Issued by A-064 (Claude Code) |
| Source | Figma audit A-063, validated finding by finding in [NYAYOS_A063_AUDIT_VALIDATION_A064.md](../design/NYAYOS_A063_AUDIT_VALIDATION_A064.md) |
| Code baseline | `app/` at `ca41bf1` on `feature/fma-foundation-v1`. All line numbers below refer to this commit |
| Starts | After the founder merges PR #2 into `main` with a merge commit |
| Branch | New branch `fix/a065-a043-canonical-fixes` from `main`, then a pull request to `main` |
| Deployment | **Not allowed.** No staging or production deploy, and no environment changes |

This is the **only** fix list for A-043. Do not implement anything from `docs/ai/tool-output/figma/A-050/`, `A-057/` or A-063's `developer-fixes.md` unless it appears below. Those files contain rejected items, including a simulated scan.

---

## 1. Rules for this task

1. **UI only.** Change files under `app/src/components/mvp/`, `app/src/mvp/`, `app/src/routes/` (only the files named below) and `app/tests/`. Do not touch:
   - `db/` or any SQL, migrations or database;
   - `app/src/domain/`;
   - authentication providers, OAuth, backend clients or environment variables.
2. **Synthetic data only.** Keep `app/src/mvp/fixtures.ts` semantics unchanged; no real names, cases or documents.
3. **Documents never become `ready` without a scan.** Do not add any action, timer or button that moves a document out of `awaiting-scan`.
4. **Copy.** Every new user-facing string must avoid the prohibited terms: AI Lawyer, AI Judge, Predict, Win, Best lawyer, Replace your lawyer, File automatically, Legally verified, Court approved, Evidence certified, Admissible, Guaranteed, marketplace, ranking, score.
5. **Tests.** Every F-item with a test line below gets a Vitest test in `app/tests/mvp.test.tsx` or a new `app/tests/*.test.tsx`. `npm test`, `npm run typecheck` and `npm run build` must pass in `app/`.
6. **Handoff.**
   - The completion commit subject must start with `[TOOL:LOVABLE][TASK:A-065]`.
   - Record the handoff in `docs/ai/tool-output/lovable/A-065/HANDOFF.json` and `SUMMARY.md` (see `docs/ai/README.md`).
   - Move A-065 to REVIEW in `docs/founder/NYAYOS_STATUS_REGISTRY.json`.
   - Update `docs/ai/CURRENT_STATE.json` and `docs/ai/NEXT_TASK.json`.
   - `node scripts/ai/state.mjs check` must pass.

## 2. Fixes

### P1: required

#### F-01 — Return to the requested page after sign-in (A-063 C-004)

**Now:**
- `app/src/components/mvp/require-session.tsx:25` does `<Navigate to="/login" replace />` and drops the page the visitor asked for.
- `app/src/components/mvp/screens/login-screen.tsx:107` always navigates to `/disputes`.

**Change:**

1. Add a pure helper `safeReturnPath(value: unknown): string` in a new file `app/src/mvp/return-path.ts`. It returns `value` only when **all** of these hold, and otherwise returns `"/disputes"`:
   - it is a string of at most 512 characters;
   - it starts with `/`, and does not start with `//` or `/\`;
   - it contains no `\` and no control characters (U+0000–U+001F, U+007F);
   - its path is not `/login` and does not start with `/login?` or `/login/`.
2. `app/src/routes/login.tsx`: add `validateSearch` returning `{ redirect?: string }`. Keep the value only if it is a string. Sanitising happens at use (step 4), not here.
3. `require-session.tsx:25`: pass the current location as `search={{ redirect: pathname + searchStr }}`, read from the router location. Use the path and query only, never an absolute URL.
4. `login-screen.tsx:107`: navigate to `safeReturnPath(redirect)` after `outcome.ok`, using `navigate({ to: ... })` or `router.history.push`, so that only same-origin paths are possible.
5. Signing out (`require-session.tsx:35`) still goes to `/login` with no `redirect`.

**Tests:**
- `safeReturnPath` returns `/disputes` for each of:
  - `undefined`
  - `""`
  - `"https://evil.example"`
  - `"//evil.example"`
  - `"/\\evil.example"`
  - `"javascript:alert(1)"`
  - `"/login?redirect=/disputes"`
  - a 600-character path
- It returns `"/disputes/dsp-1/evidence?x=1"` unchanged.
- Rendering a protected route signed out redirects to `/login` with a `redirect` of that route's path.

#### F-02 — Make every skip-link target focusable (A-063 M-001, M-004)

**Change:** add `tabIndex={-1}` and `focus:outline-none` to every `<main id="main">`:
- `components/mvp/dispute-frame.tsx:63`
- `components/mvp/require-session.tsx:19`
- `components/mvp/screens/dispute-list-screen.tsx:26`
- `components/mvp/screens/login-screen.tsx:39` and `:49`
- `components/mvp/screens/what-happened-screen.tsx:34`

Do not add a visible focus ring to `<main>`; the skip link itself keeps its ring.

**Test:** on the dispute list, U04 and one DisputeFrame screen, `document.getElementById("main")` has `tabindex="-1"`, and `focus()` moves `document.activeElement` to it.

#### F-03 — Keep the document language in step with the chosen language (A-063 m-004)

**Now:** `app/src/routes/__root.tsx:116` renders `<html lang="en">`, while `MvpProvider` (`__root.tsx:134`, `mvp/store.tsx:23`) switches between `en` and `hi`.

**Change:**
- Keep `lang="en"` as the server-rendered default.
- Add a small `LangSync` component, rendered inside `<MvpProvider>` in `RootComponent`. It sets `document.documentElement.lang = language` in an effect.
- Leave the per-element `lang={language}` attributes as they are.

**Test:** after `setLanguage("hi")`, `document.documentElement.lang === "hi"`; after switching back, it is `"en"`.

### P2: should fix

#### F-04 — `createDispute` must not return an id it did not create (A-063 M-003)

**Now:** `app/src/mvp/store.tsx:154-177` always returns the new id, even when there is no user and nothing was added.

**Change:**
- Change the type at `store.tsx:39` to `(title, statement) => string | null`.
- Check the user **before** calling `setState` and return `null` when there is none.
- `what-happened-screen.tsx:58`: when the result is `null`, navigate to `/login` with `redirect: "/disputes/new"` (F-01) instead of to intake.

**Test:** with no user, `createDispute` returns `null` and the dispute list is unchanged.

#### F-05 — Give the document page text a role (A-063 m-001)

**Now:** `components/mvp/screens/document-viewer-screen.tsx:92-97` is a focusable `div` with `aria-label` and no role. ARIA 1.2 does not allow naming a generic element.

**Change:**
- Add `role="region"`.
- Keep `tabIndex={0}` so keyboard users can scroll the page.
- Keep the label, as `` `Page ${page} of ${total} text, read-only` ``.

**Test:** `getByRole("region", { name: /Page 1 of \d+ text, read-only/ })` exists on the viewer.

#### F-06 — Announce hashing through the persistent status region (A-063 m-005)

**Now:** `components/mvp/screens/evidence-locker-screen.tsx:134-138` mounts a `role="status"` paragraph only while hashing, and a persistent polite region already exists at `:150-152`.

**Change:**
- Keep the visible "Fingerprinting files…" text but remove its `role="status"`.
- At hashing start (`:47`), call `setAnnouncement` with "Fingerprinting N file(s)…". The existing completion message at `:81` replaces it.
- Do not add a second persistent status region.

**Test:** after choosing a file, the persistent status region's text includes "Fingerprinting" before it reports the result.

### P3: polish

#### F-07 — Use the Devanagari font utility (A-063 m-003)

**Change:** in `app/src/routes/index.tsx:115`, replace `style={{ fontFamily: "var(--font-devanagari)" }}` with `className="font-devanagari"`, alongside the existing classes. `--font-devanagari` is declared in `@theme inline` (`styles.css:22,31`), so Tailwind v4 already generates the utility; no CSS change is needed.

**Check:** the showcase typography section still renders the Hindi sample in Noto Sans Devanagari.

#### F-08 — Show that the mobile step navigation scrolls

**Now:** `components/mvp/dispute-frame.tsx:40` scrolls horizontally below 768 px with no hint that more steps exist.

**Change:**
- Below `md`, add an edge fade on the trailing side. It must be `aria-hidden="true"` and `pointer-events-none`.
- Hide the fade when the list is scrolled to the end, or accept a static fade.
- The last step's focus ring must stay visible.
- Nothing changes at `md` and above.

#### F-09 — Show the full dispute title on touch devices

**Now:** `components/mvp/dispute-frame.tsx:37` truncates the title and exposes the full text only through `title`, which touch devices cannot reach.

**Change:** let the title wrap, using `break-words` in place of `truncate`, so the full title is visible and read by assistive technology. Remove the now-redundant `title` attribute.

#### F-10 — Stack the screen header on narrow screens

**Now:** `components/mvp/states.tsx:102` uses a fixed `grid-cols-[minmax(0,1fr)_auto]`, which squeezes long titles.

**Change:** single column below `sm`, with the actions under the title; use `sm:grid-cols-[minmax(0,1fr)_auto]` from `sm` up.

## 3. Out of scope for A-065

| Item | Why | Owner |
|---|---|---|
| Real backend and persistence (A-063 C-001, M-005) | W1 connects the UI to the verified FM-A backend (`db/migrations/0001-0008`, `app/src/domain/`); provider decision FD-02 | Claude Code, W1 |
| Google sign-in (A-063 C-002) | D-035 approves Google Login; provider selection is FD-02 | Founder, then W1 |
| Moving the showcase off `/` (A-063 M-002) | The showcase is a recorded foundation deliverable; needs a founder decision, best made with W1 | Founder |
| Contrast audit and screen-reader pass (A-063 m-002) | Verification, not a code change | A-043 design conformance review |
| Simulated scan (FIX-C003), `role="button"` drop zone (FIX-m005), bigger compact buttons, sticky intake CTA | Rejected; see the validation record §3–§4 | — |

## 4. Acceptance

A-065 is complete when:

- F-01 to F-06 are implemented with their tests.
- F-07 to F-10 are implemented or explicitly deferred in the handoff's `limitations`.
- `npm test` and `npm run build` pass in `app/`.
- `node scripts/ai/state.mjs check` and `node scripts/governance/registry.mjs validate` pass.
- The pull request is open against `main` and not merged.
- Nothing is deployed.
