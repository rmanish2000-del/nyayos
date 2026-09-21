# NyayOS — Sprint 1 Foundation

Design system, accessibility baseline and provenance-first UI architecture for the
NyayOS MVP. **Sprint 1 only.** No intake, evidence, fact-confirmation or analysis
screens. No backend, database, AI or agent code.

Canonical repository: https://github.com/rmanish2000-del/nyayos

## What is in this package

| Area | Location |
| --- | --- |
| Design token system (colour, typography, spacing, radius, shadow, motion, breakpoints) | `src/styles.css` |
| Foundation components | `src/components/nyayos/` |
| Responsive navigation shell (mobile tabs / tablet rail / desktop sidebar) | `src/components/nyayos/app-shell.tsx` |
| Foundation showcase (every component state, token gallery, a11y checklist) | `src/routes/index.tsx` |
| Document head, font loading | `src/routes/__root.tsx` |
| shadcn/Radix primitives (baseline, unmodified) | `src/components/ui/` |
| Tests | `tests/` |

Foundation components: `Button`, `InputField`, `StatusChip`, `SourceBadge`,
`DateBadge`, `NotificationBanner`, `ReadinessIndicator`, `AppShell`.

## Stack

TanStack Start v1 · React 19 · TanStack Router · Vite · Tailwind CSS v4
(tokens via `@theme`, no `tailwind.config.js`) · TypeScript · ESLint + Prettier ·
Vitest + Testing Library. Package manager: **bun** (`bun.lock` committed); npm works
too, but regenerate the lockfile if you switch.

## Typography

- **Noto Sans** — headings and body text (Latin).
- **Noto Sans Devanagari** — Hindi / Devanagari text.
- **Noto Sans Mono** — dates, page references and other machine values.

Loaded from Google Fonts in `src/routes/__root.tsx`. Hind Siliguri is **not** used
anywhere. Latin and Devanagari share one type scale so mixed-script screens align.

## Local setup

```sh
git clone https://github.com/rmanish2000-del/nyayos.git
cd nyayos
bun install            # or: npm install
cp .env.example .env    # no values are required to run Sprint 1
bun run dev             # http://localhost:8080
```

## Validation commands

Run all four before opening a pull request. All four pass in this package.

```sh
bun run typecheck   # TypeScript, no emit
bun run lint        # ESLint + Prettier
bun run test        # Vitest (component states, token families, prohibited-language guard)
bun run build       # Production build
```

Extras: `bun run lint:fix`, `bun run format`, `bun run test:watch`,
`bun run preview` (serve the production build).

## Responsive breakpoints

| Form | Width | Navigation |
| --- | --- | --- |
| Mobile | < 48rem | bottom tab bar |
| Tablet | 48–64rem | left rail, collapsed + expanded |
| Desktop | ≥ 64rem | sidebar, collapsed + expanded |

One navigation model, three presentations. Current section is marked with
`aria-current`; a skip-to-content link is the first focusable element.

## Accessibility baseline

Target: **WCAG 2.2 AA**.

- Minimum 44×44 CSS px touch targets on every interactive element.
- Full keyboard operation with a visible focus indicator.
- Screen-reader labels on icon-only controls; status and provenance meaning is
  carried in text, never colour alone.
- `prefers-reduced-motion` collapses all motion.
- Banners announce via `aria-live`.

Not yet run: a formal contrast audit and a screen-reader pass (NVDA / VoiceOver).
Both are tracked as open items.

## Conventions

- All visual values live in `src/styles.css` as semantic tokens. Components must
  never hardcode a colour, font or shadow.
- The progress indicator reports **readiness percentage only**. Scoring, ranking,
  strength, likelihood and probability language is prohibited and is guarded by a
  test.
- Out of scope for the product entirely: lawyer or judge portals, mediation or
  lawyer marketplaces, recommendation engines, success probability, truth scores,
  court operating systems, filing workflows.

## Environment variables

See `.env.example` — names only, never values. Sprint 1 needs none of them to run.
Never commit a `.env` file; `.gitignore` excludes them.

## Deployment

Staging only. Production deployment is not authorised.
