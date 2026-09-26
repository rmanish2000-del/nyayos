# A-057 — Onboarding & Auth UX

**Screens:** U01 SignIn, U02 Consent (Auth.tsx), U03 Dashboard (Dashboard.tsx)
**Date:** 2026-09-26

---

## OB-01 · No Google / social sign-in option — email-only flow

**File:** `src/screens/Auth.tsx:55–115`
**Severity:** High

The sign-in card offers only email+OTP. No Google or social option is present.
The MVP spec (product-spec.md) notes Google sign-in as a first-class auth path.
Without it, users who associate "quick sign-up" with Google auth face friction
and may abandon.

Current card header:
```tsx
<h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">
  {t(lang, 'continueWithEmail')}
</h2>
```

No Google button, no divider, no OAuth path.

**Fix — add Google CTA above the email form:**
```tsx
{/* Google sign-in */}
<button
  type="button"
  onClick={onGoogleSignIn}
  className="w-full flex items-center justify-center gap-3 border border-[var(--color-border-2)]
    rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)]
    hover:bg-[var(--color-surface-2)] transition-colors"
>
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.6 2.2 30.2 0 24 0 14.7 0 6.7 5.5 2.9 13.5l7.9 6.1C12.7 13.5 17.9 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.5c4.1-3.8 6.5-9.4 6.5-16.3z"/>
    <path fill="#FBBC05" d="M10.8 28.4A14.6 14.6 0 0 1 9.5 24c0-1.5.3-3 .7-4.4L2.3 13.5A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.3-6.2z"/>
    <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.5l-7-5.5c-2 1.4-4.6 2.2-8.3 2.2-6.1 0-11.3-4-13.2-9.6l-8.1 6.2C6.6 42.5 14.7 48 24 48z"/>
  </svg>
  {lang === 'hi' ? 'Google से जारी रखें' : 'Continue with Google'}
</button>

<div className="flex items-center gap-3 my-4">
  <div className="flex-1 h-px bg-[var(--color-border)]" />
  <span className="text-xs text-[var(--color-muted)]">
    {lang === 'hi' ? 'या' : 'or'}
  </span>
  <div className="flex-1 h-px bg-[var(--color-border)]" />
</div>

{/* existing email form below */}
```

Also add `onGoogleSignIn` prop to `SignInProps` and thread through `App.tsx → handleSignIn`.

---

## OB-02 · OTP input has no visual separation — 6 digits render as plain text field

**File:** `src/screens/Auth.tsx:89–100`
**Severity:** High

The OTP input is `<Input type="text" inputMode="numeric" maxLength={6}>`.
It renders as a continuous text field with no per-digit separation.
Users cannot see if they mistyped a digit; the mental model for OTP is individual boxes.

**Fix — segmented OTP input:**
```tsx
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = Array.from({ length: 6 });
  return (
    <div className="flex gap-2" role="group" aria-label={lang === 'hi' ? '6-अंक कोड' : '6-digit code'}>
      {inputs.map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={e => {
            const next = value.split('');
            next[i] = e.target.value.replace(/\D/g, '').slice(-1);
            onChange(next.join(''));
            if (e.target.value && i < 5) {
              (e.target.nextElementSibling as HTMLInputElement)?.focus();
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Backspace' && !value[i] && i > 0) {
              (e.currentTarget.previousElementSibling as HTMLInputElement)?.focus();
            }
          }}
          aria-label={`Digit ${i + 1}`}
          className="w-10 h-12 text-center text-lg font-bold border-2 rounded-[var(--radius-md)]
            border-[var(--color-border-2)] focus:border-[var(--color-navy)] focus:outline-none
            focus:ring-2 focus:ring-[var(--color-navy-mid)] transition-colors"
        />
      ))}
    </div>
  );
}
```

Replace the `<Input>` at line 90 with `<OtpInput value={otp} onChange={setOtp} />`.

---

## OB-03 · No language selector on sign-in screen — Hindi users must sign in in English first

**File:** `src/screens/Auth.tsx:38`
**Severity:** High

The `SignIn` component takes `lang` as a prop but does not receive `setLang`.
There is no language toggle on the sign-in or consent screens.
A Hindi-speaking user who lands on the English sign-in has no way to switch before signing in.

**Fix — add `setLang` to `SignInProps` and render toggle:**
```tsx
interface SignInProps {
  lang: Lang;
  setLang: (l: Lang) => void;  // ADD
  onSignIn: (email: string) => void;
}

// Inside SignIn, below the brand block, before the card:
<div className="flex justify-center mb-6">
  <div className="flex gap-1 bg-white/10 rounded p-0.5">
    {(['en', 'hi'] as const).map(l => (
      <button
        key={l}
        onClick={() => setLang(l)}
        aria-pressed={lang === l}
        aria-label={l === 'en' ? 'Switch to English' : 'हिंदी में बदलें'}
        className={`px-4 py-1.5 rounded text-xs font-semibold transition-colors
          ${lang === l ? 'bg-white text-[var(--color-navy)]' : 'text-white/60 hover:text-white'}`}
      >
        {l === 'en' ? 'English' : 'हिंदी'}
      </button>
    ))}
  </div>
</div>
```

Thread `setLang` from `App.tsx:180`:
```tsx
case 'signin':
  return <SignIn lang={lang} setLang={setLang} onSignIn={handleSignIn} />;
```

---

## OB-04 · Consent screen has no language toggle either

**File:** `src/screens/Auth.tsx:136–227`
**Severity:** High

Same issue as OB-03. `Consent` receives `lang` but not `setLang`.
A user who switched language on sign-in would lose that choice if they hadn't yet.

**Fix:** Add `setLang` to `ConsentProps` and render the same toggle above the `h1`.
Thread from `App.tsx:182`:
```tsx
case 'consent':
  return <Consent lang={lang} setLang={setLang} onConsent={handleConsent} />;
```

---

## OB-05 · `resendCode` button has mixed-language label

**File:** `src/screens/Auth.tsx:111`
**Severity:** Medium

```tsx
<button ... className="w-full text-sm text-[var(--color-navy-mid)] hover:underline">
  {t(lang, 'resendCode')} / Change email
</button>
```

`t(lang, 'resendCode')` is translated, but `/ Change email` is hardcoded English.
On Hindi mode this renders: "कोड दोबारा भेजें / Change email".

**Fix:**
```tsx
{t(lang, 'resendCode')} / {lang === 'hi' ? 'ईमेल बदलें' : 'Change email'}
```

---

## OB-06 · Consent checkbox is broken (known ACC-03) — blocks first-time users entirely

**File:** `src/screens/Auth.tsx:207`, `src/components/ui.tsx:320`
**Severity:** Critical

The `Checkbox` component renders a `<div onClick>` with `<label htmlFor={id}>` pointing to
nothing. On keyboard and AT, users cannot tick the consent box, which means they cannot
proceed past Consent. This is a hard blocker for any non-pointer user.

Traced from: `Consent` renders `<Checkbox checked={checked} onChange={setChecked} ...>`.
`handleStart` early-returns if `!checked`. User is permanently stuck.

**Fix:** Apply ACC-03 fix from A-050 (FIX-02) — replace `<div onClick>` with real
`<input type="checkbox">`. See `developer-fixes.md:FIX-02`.

---

## OB-07 · No sign-out affordance anywhere in the app shell

**File:** `src/components/Shell.tsx:109–127`
**Severity:** Medium

The sidebar bottom section shows `userEmail` as text (line 124) but provides
no sign-out button. The Settings screen also has no sign-out. The only way
to return to sign-in is to delete the account (`DeletionFlow`), which is destructive.

**Fix — add sign-out button to sidebar and Settings:**

Sidebar (`Shell.tsx:124`):
```tsx
{userEmail && (
  <div className="space-y-1">
    <div className="text-xs text-white/35 truncate">{userEmail}</div>
    <button
      onClick={onSignOut}
      className="text-xs text-white/40 hover:text-white/70 transition-colors"
      aria-label={lang === 'hi' ? 'साइन आउट' : 'Sign out'}
    >
      {lang === 'hi' ? 'साइन आउट' : 'Sign out'}
    </button>
  </div>
)}
```

Add `onSignOut` prop to `ShellProps`. In `App.tsx`, implement:
```tsx
function handleSignOut() {
  setUserEmail(undefined);
  setDisputes([]);
  setActiveDisputeId(null);
  setHistory([]);
  setScreen('signin');
}
```

---

## OB-08 · Dashboard empty-state CTA is a plain Button — lacks onboarding guidance

**File:** `src/screens/Dashboard.tsx:67–80`
**Severity:** Medium

When `disputes.length === 0`, the EmptyState renders a "New dispute" button.
No guidance on what a dispute is, how long it takes, or what to expect.
First-time users after consent (which they just read) have no bridge to action.

**Fix — add a 3-step quick guide above the empty-state button:**
```tsx
<EmptyState
  icon="📁"
  title={t(lang, 'noDisputes')}
  body={t(lang, 'noDisputesNote')}
  action={
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        {[
          { icon: '📝', step: lang === 'hi' ? '1. घटना लिखें' : '1. Describe the event' },
          { icon: '📄', step: lang === 'hi' ? '2. दस्तावेज़ जोड़ें' : '2. Add documents' },
          { icon: '📤', step: lang === 'hi' ? '3. फ़ाइल निर्यात करें' : '3. Export your file' },
        ].map(({ icon, step }) => (
          <div key={step} className="p-2 bg-[var(--color-surface-2)] rounded-[var(--radius-md)]">
            <div className="text-2xl mb-1" aria-hidden="true">{icon}</div>
            <div className="text-[var(--color-muted)] leading-tight">{step}</div>
          </div>
        ))}
      </div>
      <Button onClick={onNewDispute} size="lg" fullWidth>
        {t(lang, 'newDispute')}
      </Button>
    </div>
  }
/>
```

---

## Priority summary

| ID | Severity | File | Line |
|----|----------|------|------|
| OB-06 | Critical | `Auth.tsx:207`, `ui.tsx:320` | Consent blocked for keyboard users |
| OB-01 | High | `Auth.tsx:55` | No Google sign-in |
| OB-02 | High | `Auth.tsx:89` | OTP is plain text field |
| OB-03 | High | `Auth.tsx:38` | No language toggle on sign-in |
| OB-04 | High | `Auth.tsx:136` | No language toggle on consent |
| OB-05 | Medium | `Auth.tsx:111` | Mixed-language resend button |
| OB-07 | Medium | `Shell.tsx:124` | No sign-out |
| OB-08 | Medium | `Dashboard.tsx:67` | Empty-state lacks onboarding guidance |
