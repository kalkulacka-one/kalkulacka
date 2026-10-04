# 2026 redesign — review findings

Review of the merged 2026 redesign PRs (#627–#632, #655–#659) on `staging.volebnikalkulacka.cz`, 2026-10-04.
Sources: Kryštof's manual testing (iPhone Safari, desktop Safari), Claude's walkthrough (Playwright Chromium,
desktop 1440×900 and mobile 390×844), and a WCAG 2.2 AA audit (Playwright Chromium plus axe-core).
State of `main`: `71f10927`.

Two lanes, one folder:

- [`bug-report.md`](bug-report.md): visual, UX and behaviour findings `F-01`…`F-31` (bugs, opinions, gaps, open questions).
- [`a11y-audit.md`](a11y-audit.md): accessibility findings `A11Y-01`…`A11Y-19`, mapped to WCAG success criteria.

They are kept apart because they have different readers and different acceptance criteria (taste versus WCAG).
Overlaps are cross-referenced, not duplicated. The fix plan below merges both into PR-sized bundles.
Media live in [`media/`](media/): `F-*` are Kryštof's captures, `CW-*` Claude's walkthrough, `A11Y-*` the audit.

## At a glance

| | Blocker | Major | Minor / cosmetic | Opinion / gap / question |
|---|---|---|---|---|
| Findings (F) | F-06 | F-01, F-02, F-05, F-07, F-08, F-11, F-12, F-15, F-20, F-21, F-23 | F-03, F-04, F-13, F-14, F-17, F-18, F-19, F-22, F-24, F-28, F-30 | F-09, F-10, F-16, F-25, F-26, F-31 |
| Accessibility (A11Y) | A11Y-01, A11Y-02 | A11Y-03 … A11Y-10 | A11Y-12 … A11Y-19 | — |

Dropped: F-27 (data issue), F-29 and A11Y-11 (the homepage is out of scope).

## Fix plan — PR bundles

Each bundle follows the repo's rules: one intent, from `main`, not stacked. Product unless marked **platform**.

| # | Bundle (PR intent) | Covers | Notes |
|---|---|---|---|
| 1 | **Let the question screen size to its content** | F-06 (blocker), F-07, F-12, F-13, F-04, A11Y-02 (blocker) | One root cause: the column computes `100lvh − 5rem`. Use `Layout` as a `min-h-dvh` column, the card with `min-h` and no inner scroller, and the answer row anchored. **Do first.** |
| 2 | **Keep the bottom action off the content** | F-05, then F-09 | `BottomNavigation`: `sticky bottom-0` with the gap as padding. Then move "Porovnat" back into it. |
| 3 | **Confirm an answer before moving on** | F-11, A11Y-07, A11Y-05 (question part) | Paint the checked state, ~200 ms, block double taps, `data-hover` instead of `hover:`, Enter toggles, focus/announce the new question. |
| 4 | **Make yes/no one choice** (design system) | F-21 (1), A11Y-15, F-08 | A compact answer radio group (one Tab stop, ≥ 44 px hit area). Used on the question and review screens. |
| 5 | **Fix the shared header and page heading** | F-01, F-02, F-18, F-19, F-24, A11Y-17 | Responsive wordmark (not an `h1`), the fade tail at the outer header edge, one gutter token, and a shared page-heading block (back pill + `h1` + lead). |
| 6 | **Design-system interaction states** | A11Y-04, F-03, F-22, F-20, F-25 + A11Y-14, A11Y-16, A11Y-10, A11Y-12 | Solid focus ring, highlighted ≠ focused, `ExpandableCard` hover and focus, `Button` `tabIndex={0}` default, receding disabled rows, contrast tokens. |
| 7 | **Add a Dialog and rebuild the share modal on it** | F-23 = A11Y-03, F-17 | Headless UI `Dialog`, DS close button, 2026 look. |
| 8 | **Give the result screen's remaining pieces the 2026 look** | F-14, F-26, A11Y-09, A11Y-13, A11Y-01 (card part) | `SegmentedControl` in the DS, donate card (per-app ×3, or upstream first), sr-only labels on the answer marks. |
| 9 | **Give the comparison screen the 2026 look** | F-10, A11Y-08, A11Y-01 (grid part), A11Y-19 | Contained horizontal scroll (never widen the document), a real `<table>`, 2026 header. |
| 10 | **Unify back navigation** | F-16 (back pills and labels), F-21 (2) | Needs decision D1 first. |
| 11 | **platform:** name each calculator step in the page title | F-28 = A11Y-06 | `packages/next/src/metadata/calculator.ts`, plus `(app)` routes ×3. Also unblocks Next's route announcer (A11Y-05). |
| 12 | **platform:** close the calculator to its picker | F-16 (close target) | `apps/*/components/client/pages/calculator/*.tsx` ×3. Needs D1. |
| 13 | **platform:** treat a missing session as empty, not 401 | F-30 | `packages/next` session-data route. |
| — | **Investigate** | F-31 | Reproduce answers lost or changed after a reload before filing anything. |
| — | **Data repo** | F-15 | Short titles cut with `…` (obvod 48, 51, 81). Needs D3. |

Suggested order: 1 → 2 → 3/4 → 5 → 6 → 7 → 8 → 9 → 10. The platform PRs (11–13) can go in parallel with Kryštof's approval.

## Decisions needed

- **D1 (F-16):** what does ✕ mean inside a district calculator: back to the district picker, or the site homepage? And are back pills always "← Zpět na {previous step}"?
- **D2 (F-20):** design-system `Button` defaults to `tabIndex={0}`, so Safari's default Tab reaches every button. Kryštof leaned yes on 2026-10-04 ("it should work just via normal tab").
- **D3 (F-15):** the `shortTitle` convention for Senate districts, agreed with Michal: drop the "Obvod NN –" prefix, or abbreviate. Separately, should the intro heading use the full title?

## Lessons for reviewing the next redesign PRs

Three of these regressions passed a code review (F-02, F-05, F-06). The review read the code and its comments, but not the
real viewport. For any PR that touches `Layout`, `AppHeader`, `BottomNavigation` or viewport units:
- check every screen that mounts the changed component, including the pickers;
- check the end of the scroll on a long screen;
- check an iPhone with the Safari toolbar expanded;
- check keyboard Tab in Safari.
