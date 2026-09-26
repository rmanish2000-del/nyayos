# A-064 — Canonical integration and branch cleanup (`claude-code`)

Completion commit `50cc63eb30a24399c5de8865a858aacdd0215530` (baseline `ca41bf1`, after the cherry-pick `76b6eb6`). Nothing merged, deployed or changed in any environment; PR #2 stays draft.

- **Figma A-063 integrated.** Draft PR #3's audit commit `dbc415f` was cherry-picked unchanged as `76b6eb6` (founder authorship kept) and recorded as Figma A-063 (REVIEW) with a schema handoff; Figma's original handoff is kept as `HANDOFF.original.json`.
- **Rejected:** A-050 and A-057 in full — none of their cited source paths exist under `app/`. Within A-063: the simulated-scan fix FIX-C003 (it would promote files without a clean verdict), the `role="button"` drop zone FIX-m005, and the "compact buttons below 44 px" claim (false).
- **Validated:** [validation record](../../../../design/NYAYOS_A063_AUDIT_VALIDATION_A064.md) — 7 findings accepted, 4 reassigned (backend and Google sign-in → W1/FD-02; root route → founder; contrast/SR pass → verification), 2 merged.
- **Canonical fix specification for Lovable:** [NYAYOS_A043_CANONICAL_FIX_SPEC_V1.md](../../../../implementation/NYAYOS_A043_CANONICAL_FIX_SPEC_V1.md) — F-01 post-login return path with open-redirect guard, F-02 skip-link targets, F-03 document language, F-04–F-10 minor. Registered as **A-065 (Lovable, OPEN)**, starting after the PR #2 merge.
- **PR #2** remains merge-ready (merge commit only); no application, SQL or domain file changed. **PR #3** should be closed unmerged by the founder.

Machine-readable record: [HANDOFF.json](HANDOFF.json).
