# NYAYOS_CONTINUITY_HANDOFF_V2

**Date:** 21 September 2026
**Supersedes:** [NYAYOS_CONTINUITY_HANDOFF_V1.md](NYAYOS_CONTINUITY_HANDOFF_V1.md) for *project state* only. V1 remains authoritative for the **architecture reconciliation table** (tier 4), which is unchanged and is not repeated here.
**Authority tier:** 4

---

## 1. Current project state

NyayOS has moved from **pre-build** to **staging build in progress**.

| | V1 (20 Sep) | **V2 (21 Sep)** |
|---|---|---|
| Repository | Empty, then documentation only | **Documentation + `app/` (Sprint 1 Foundation code)** |
| Code | None | Sprint 1 Foundation — design tokens, 8 foundation components, navigation shell, a11y baseline, 12 tests |
| Gates | Build not allowed | **Staging ALLOWED (FA-001). Production NOT ALLOWED** |
| Sprint 1 | — | **CANONICAL** (with known gaps — § 4) |
| Sprint 2 (Fact Cards) | — | **GO — conditional** on Sprint 1.1 state completion (§ 4) |

## 2. Repository layout — what changed

```
/                    governance (tiers 1–7, unchanged)
/docs                canonical documents
/app                 Sprint 1 Foundation — TanStack Start · React 19 · Tailwind v4 · Vitest
```

- **Code lives in the canonical repository** (FA-001 code-location item closed as option **(b)**, founder instruction 21 Sep 2026).
- `app/bun.lock` is the **lockfile of record** (Lovable uses bun). npm's `package-lock.json` is gitignored. Build/test/lint were executed with **npm 10.9 / Node 22.14**, i.e. a fresh resolve, not bun's exact tree — recorded as a limitation.
- `app/src/routeTree.gen.ts` is committed. The Lovable export omitted it; without it `tsc --noEmit` fails.
- `.env` is excluded; `app/.env.example` (names only) is committed. Sprint 1 needs no environment values to run.

## 3. Validation record — A-017, 21 Sep 2026

| Check | Result | Evidence |
|---|---|---|
| ZIP integrity | PASS | `unzip -t`: no errors; 93 files; no absolute or `..` paths |
| ZIP SHA-256 | **RECORDED, not verified** | `8c407630616f171b33d2be60671213c4b07b5ceb65fce0a877954b17a3ea83ca` — no expected value was supplied |
| Secret scan (pattern-based; no gitleaks available) | PASS | No keys, tokens, JWTs, private keys, Supabase URLs |
| Prohibited content | PASS | No private-matter references, no PII, no EduOS content, no banned copy (guarded by test) |
| External endpoints | 1 | Google Fonts only (see § 5) |
| `tsc --noEmit` | **PASS** (after route tree generation) | 0 errors |
| `eslint .` | **PASS** | 0 errors, 7 warnings (`react-refresh/only-export-components`; 6 of 7 in unmodified shadcn `ui/`) |
| `vitest run` | **PASS** | 12 / 12 |
| `vite build` | **PASS** | 1,942 modules; `.output/` 1.8 MB; Cloudflare worker config generated, **not deployed** |
| Staging URL | **NOT SUPPLIED — not verified** | — |
| Screenshots | **NOT SUPPLIED** | — |

## 4. Sprint 1 — canonical, with known gaps

Sprint 1 is **canonical**: it is the foundation Sprint 2 builds on. Canonical does not mean complete for Fact Cards. The A-014 execution ([review § 11](../architecture/NYAYOS_SPRINT1_FOUNDATION_REVIEW_A014.md)) found the state enums **incomplete against the Product Spec**:

| Gap | Spec requires | Sprint 1 has | Blocks |
|---|---|---|---|
| Status states | confirm · correct · **uncertain** · **irrelevant** (+ awaiting) | confirmed · to-review · contradiction · missing · processing · removed | Fact Card actions *Uncertain* and *Not relevant* have no resulting state; *Correct* has no *Corrected* state |
| Source kinds | `document_fact` **and** `ai_extraction` as distinct | one `document-extracted` | Epistemic boundary the spec insists on (§ 11 provenance contract) |
| Source kinds | `unverified_claim` | — (`source-unavailable` is a different thing) | Fact Card |
| Date precision | exact · approximate · inferred · **unknown** · conflicting | 4 of 5 — `unknown` missing | Timeline |
| Confidence | bands High/Medium/Low/Unknown | no component | Fact Card |
| Input | inline *Correct* with original preserved (US-03) | no pattern | Fact Card |

**All are additive** — new enum values, new tokens, one small component. None is a redesign. They are bundled as **Sprint 1.1 — State Completion**, the first work item of Sprint 2.

## 5. Risks carried forward

| Risk | Severity | Note |
|---|---|---|
| Contrast audit not run | **High** until done | README admits it; token lightness values suggest pass; must be measured |
| Screen-reader pass not run | High | NVDA / VoiceOver — README open item |
| Provenance and status **share hues** (amber = inference = review = approximate = warning; green = verified = confirmed = exact = success) | Medium | Icons + text prevent a WCAG failure, but the hierarchy rule (source louder than AI wording) is weakened |
| Google Fonts CDN | Medium | Every page load sends the visitor's IP to Google — for a legal-privacy product, self-host before any pilot; also offline/low-connectivity risk |
| Unused dependency surface | Medium | `recharts`, `embla-carousel`, `react-day-picker`, `cmdk`, `vaul`, `input-otp`, `react-resizable-panels` present, unused. `chart.tsx` is the "score visualisation" temptation the spec prohibits. Prune or record as accepted |
| Build emits Cloudflare deploy config | Low | `nitro deploy` was **not** run. Production remains NOT ALLOWED (FA-001) |
| Lovable editor telemetry hooks (`lovable-error-reporting.ts`) | Low | Inert outside the Lovable editor; remove before any pilot with real data |
| npm vs bun resolution | Low | Validation ran on a fresh npm resolve, not `bun.lock` |

## 6. Recommended next assignment

**Sprint 1.1 — State Completion** (Lovable, staging) → then **Sprint 2 — Fact Card System**.

Inputs: this handoff; A-014 § 11; Product Spec § 7.6, § 10, § 11; Figma Brief § 5–6.

## 7. Do not start yet

- Production build, deployment, database or domain (FA-002 not granted).
- Any real user or client data in any environment.
- Private-matter evaluation in the build environment.
- Consumer-category launch.

## 8. Still open from V1

Real user interviews · WTP · exact launch category boundary · privacy/legal counsel review · OCR benchmark · retrieval benchmark · pilot performance · typography **decision recorded** (Noto stack now in code, but D-019 not yet written to the Decision Log) · MVP report filename discrepancy · locked-vs-provisional wedge.
