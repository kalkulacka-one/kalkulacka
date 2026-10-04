# 2026 redesign — review findings

Testing of the merged redesign PRs (#627–#632, #655–#659) on main.
Started 2026-10-04 by Kryštof; written up by Claude from screenshots and videos.

Media live in `media/` next to this file. Each bug links its own files.

## Summary

| # | Type | Title | Severity | Screen | Sites | Likely source PR |
|---|---|---|---|---|---|---|
| F-01 | Bug | Header wordmark text is too small, especially on desktop | major | every screen with `AppHeader` | all (shared) | #629 |
| F-02 | Bug | Picker description fades to a ghost on scroll | major | district picker (and the calculator picker, probably) | all (shared) | #629 on top of #595 |
| F-03 | Bug (design) | Search field and highlighted result both show a focus ring | minor | district picker search | all (shared) | #591 (not a redesign PR) |
| F-04 | Bug | Short pages scroll on iPhone; the title scrolls away under the header | minor | introduction (likely every short calculator screen) | all (shared) | #549 (pre-redesign), more visible since #629 |
| F-05 | Bug | Bottom button covers the last line of text, even fully scrolled | major | guide (any long screen with `BottomNavigation`) | all (shared) | #629 |
| F-06 | Bug | Question screen: step row (back / 1/40 / skip) is hidden below the fold on iPhone | blocker | question | all (shared) | #632 (kept by #655) |
| F-07 | Bug | Question screen: nested scroll inside the card traps the gesture, with no sign the text scrolls | major | question | all (shared) | #632 (kept by #655) |
| F-08 | Bug (a11y) | Review screen: yes/no/star touch targets are ~36px, yes and no only 6px apart | major | review | all (shared) | #657 |
| F-09 | Opinion | Result: "Porovnat" sits at the end of the list instead of floating like every other screen's action | minor | result | all (shared) | #630 |
| F-10 | Gap | Comparison page still has the pre-2026 layout | major | comparison | all (shared) | none (only recoloured by #628) |
| F-11 | Bug (UX) | Question screen: tapping Ano/Ne gives no "selected" confirmation before the next question replaces it | major | question | all (shared) | pre-existing flow; visuals from #627 |
| F-12 | Bug | Desktop: answer buttons and step row move with each question's text length; repeated clicks miss and select text | major | question (desktop) | all (shared) | #632 |
| F-13 | Bug | Desktop: question screen scrolls ~16px for no reason; the progress bar fades under the header | minor | question (desktop) | all (shared) | #632 |
| F-14 | Bug | Result: the lists/people switch has lost its track, so it no longer reads as a switch | minor | result, public result | all (shared) | #630 + #631 |
| F-15 | Bug (data) | Intro heading shows a pre-truncated name: "Obvod 81 – Uherské Hradi…" | major | introduction (3 Senate districts) | CZ | data repo #81; heading field since #559 |
| F-16 | Opinion (UX) | Back/close navigation is different on every screen of the flow | major | picker → intro → guide → question → review → result → comparison | all (shared + per-app) | accumulated; #629/#630/#632 |
| F-17 | Bug | Share modal close button has almost no hover state | cosmetic | result → share modal | all (shared) | #552 (pre-redesign), untouched since #628 |
| F-18 | Bug | District picker: search field and result rows have different widths | minor | district picker (and likely the calculator picker) | all (shared) | #629 |
| F-19 | Bug (design) | Guide: vertical spacing has no rhythm, and on mobile the cards are inset from the title | minor | guide | all (shared) | #629 |
| F-20 | Bug (a11y) | Keyboard: in Safari, plain Tab skips Návod/Přeskočit/Zavřít while it stops on ★/Ano/Ne | major | question | all (shared) | Safari default + inconsistent tabindex (DS `Button` vs Headless toggles) |
| F-21 | Bug (a11y) | Review: reaching "Zobrazit výsledky" by keyboard takes ~120 Tabs | major | review | all (shared) | pre-existing structure |
| F-22 | Bug | Result: the whole match card is clickable (expand) but shows no hover, cursor or focus cue | minor | result | all (shared) | design system `ExpandableCard` (#350); pre-redesign |
| F-23 | Bug (a11y) | Share modal: Escape doesn't close it and focus isn't moved into it | major | result → share | all (shared) | #552 (pre-redesign) |
| F-24 | Bug (design) | District picker on desktop: title sits at the page edge, description/search/list in a centred column | minor | district picker | all (shared) | #595 + #629 |
| F-25 | Opinion | Picker: unavailable ("Připravujeme") districts look *more* prominent than available ones | minor | district picker | all (shared) | #595/#628 |
| F-26 | Gap | Result: donate card is off-grid and still in the old style | minor | result | CZ (per-app) | per-app donate card, not touched by the redesign |
| F-28 | Bug (a11y/UX) | Every calculator step has the same document title | minor | whole flow | all | platform (metadata) |
| F-30 | Bug | New visitor: 401 console error from `session-data` on the intro | cosmetic | introduction | all | platform (`packages/next` API route) |
| F-31 | Question | Answers sometimes missing or different after reloading the result in a fresh browser | major if confirmed | result | all | unverified, needs reproduction |

Types:
- **Bug**: it is broken, or it doesn't do what the design or code clearly intends.
- **Opinion**: it works as built, but Kryštof would do it differently.
- **Question**: it's unclear whether it's intended. Ask Klára.
- **Gap**: a screen the redesign hasn't reached yet. Not a defect in a merged PR, but users see a mixed product.

## Dropped

- **F-27** (result: candidates without answers show "—"): Kryštof says it's a data issue (candidates with no answers in the data), not a UI bug. Removed 2026-10-04.
- **F-29** (homepage: footer, elevation, CTA styles): the homepage is out of scope for this review. Removed 2026-10-04.

## Accessibility audit

The full WCAG 2.2 AA audit (subagent, 2026-10-04, Playwright Chromium, desktop and mobile) is in `a11y-audit.md`, with its media prefixed `A11Y-`. It found 19 issues: 2 blockers (A11Y-01 answer marks have no text alternative; A11Y-02 the question text collapses at 400% zoom, the same root as F-06), 9 major, 8 minor. All are product except A11Y-06 (titles, platform).

Overlaps with this file:
- A11Y-03 = F-23 (share modal)
- A11Y-06 = F-28 (titles)
- A11Y-08 = the F-10 overflow addendum
- A11Y-02 is a further consequence of F-06/F-07/F-12/F-13 (one PR)
- A11Y-07 (Enter doesn't toggle ★/Ano/Ne, since `ToggleButton` is a Headless UI `Switch`) and A11Y-15 (they're exposed as on/off switches) strengthen F-21's radio-group proposal

## Findings

> F-23 to F-30 (minus the dropped F-27 and F-29) come from Claude's own walkthrough of staging on 2026-10-04: Playwright Chromium at 1440×900 and 390×844 (mobile emulation), obvod 81, all 40 questions answered or skipped. The Chrome extension wasn't connected. Screenshots are prefixed `CW-`. The page's backdrop glow is `position: fixed`, so its hard edge in full-page screenshots is a screenshot artifact, not a bug (checked by scrolling).

### F-06 · Bug — Question screen: step row (back / 1/40 / skip) is hidden below the fold on iPhone
- **Severity:** blocker. "Back to the guide", "Skip" and the position counter are invisible on the screen users spend 90% of their time on, and nothing hints that they exist. Without Skip, a user who doesn't want to answer has no visible way forward.
- **Where:** question screen, Senate 2026, Praha 1, CZ staging, iPhone Safari with the toolbar expanded (the state on every page load). Shared code.
- **Steps:** open question 1 on an iPhone and don't scroll.
- **Expected:** progress bar, card and the "← Návod · 1/40 · Přeskočit →" row all fit in the visible area.
- **Actual:** the card fills the screen down to Safari's toolbar, and the step row sits under or below it (screenshot 7). It only appears after the page is scrolled, which collapses the toolbar (screenshot 8).
- **Evidence:** `media/F-06-question-7.png` (at load), `media/F-06-question-8.png` (after a lucky page scroll)
- **Likely cause:** `packages/app/src/components/pages/question.tsx:115` sizes the column `h-[calc(100lvh-5rem)]`.
  - `lvh` is the *large* viewport, i.e. toolbar collapsed. With the toolbar expanded, the column is taller than the visible area by the toolbar's height (~50–80px), and that's exactly where the step row lands.
  - The code comment's premise, "this screen never scrolls, so … nothing for the extra height to scroll", is false. The extra `lvh − svh` height *is* scrollable, and the step row lives in it.
  - The hard-coded `5rem` also assumes a header height that changes with the condensed state and with F-01's fix.
  - Introduced in #632. #655 touched this line (`pb-8` → `pb-6`) but kept `lvh`.
- **Fix scope:** product. Size to the *small* viewport (`100svh`), or better, stop computing the height: make `Layout` a `min-h-dvh` flex column (see F-04), let the question column `flex-1 min-h-0`, and let the card shrink. Verify on iPhone with the toolbar expanded and collapsed, in landscape, and in an embed iframe.
- **Review note:** I accepted the `lvh` rationale in #632 from its comment without checking it against the toolbar-expanded state.

### F-16 · Opinion (UX) — Back/close navigation is different on every screen of the flow
- **Where:** the whole calculator flow, CZ staging, all viewports.
- **Now** (walked through by Kryštof, verified in code):

  | Screen | Close (top right) | Back |
  |---|---|---|
  | District picker | ✕ → homepage | — |
  | Introduction | ✕ → **homepage** (`router.push("/")`), not back to the picker you just came from | — |
  | Guide | ✕ | "← Zpět na úvod", pill, **top left** |
  | Question | ✕ | "← Návod" / "← Předchozí", plain text link, **bottom left** in the step row |
  | Review | ✕ | "← Zpět na otázky", pill, top left |
  | Result | ✕ | "← Zpět", pill, top left, with *no destination* in the label ("Zpět na rekapitulaci" would match the others) |
  | Comparison | bare ✕ (not round, see F-10) | "←" icon inline before the "Porovnání" title. The label "Zpět na výsledky" exists in the locales but is only an aria-label |

  That's four different back patterns (pill top-left, text link bottom-left, icon next to the title, none) and three label styles ("Zpět na X", "Zpět", "Návod"). The close button on intro skips the step the user actually came from.
- **Proposal:**
  1. **One back pattern:** a pill at the top left, always "← Zpět na {previous step}". On the question screen keep "Předchozí" in the step row (it is question-to-question paging), but Q1's "← Návod" should be the same top-left pill as everywhere else, or at least consistent.
  2. **Result:** "Zpět na rekapitulaci".
  3. **Comparison:** the same pill as the others ("← Zpět na výsledky"), part of F-10.
  4. **Close ✕** keeps one meaning everywhere: "leave the calculator". Inside a district calculator that should return to the *district picker* of that election, not the site homepage. Or, if leaving to the homepage is intended, the intro should at least get a "← Zpět na výběr obvodu".
- **Why:** the user has to re-learn where "back" is on each screen. On the question screen there's no top-level back at all, and the close ✕ is the only visible exit, which throws away the context (district) the user just picked.
- **Cost:**
  - Back pills and labels: product (`packages/app/src/components/pages/*.tsx`, `packages/app/src/locales/*.json` in lockstep). One "Unify back navigation in the calculator flow" PR. Could be a tiny `BackLink` component in the app package, so it lives once.
  - Close target: **platform**. `handleCloseClick` is in `apps/*/components/client/pages/calculator/*.tsx`, which isn't on the product allowlist and is replicated across CZ/SK/MK. Do it as a small prerequisite PR (route the ✕ to the group's picker when the calculator belongs to a group), approved by Kryštof.
  - Needs a decision from Kryštof or Klára on (4) before anyone builds it.

### F-23 · Bug (a11y) — Share modal: Escape doesn't close it and focus isn't moved into it
- **Severity:** major for keyboard and screen-reader users. It's also the basic modal contract.
- **Where:** result → "Sdílet", desktop and mobile.
- **Steps:** open the share modal and press Escape.
- **Expected:** focus moves into the dialog (to the close button or the URL field), Tab stays inside, Escape closes, and focus returns to "Sdílet".
- **Actual (measured):** after opening, `document.activeElement` is still the "Sdílet" button behind the overlay. After Escape, the `[role=dialog]` is still in the DOM and visible. Only a click on the backdrop or ✕ closes it.
- **Evidence:** `media/CW-desk-09-share.png`
- **Cause:** `packages/app/src/client/components/share-modal.tsx:117` is a hand-rolled overlay `div` (`role="dialog" aria-modal="true" onClick={onClose}`) with no focus management, focus trap or keydown handler. Pre-redesign (#552). The design system has no `Dialog` primitive yet (Klára's superseded #524 had one).
- **Fix scope:** product. Add a `Dialog` to the design system on Headless UI's `Dialog`, which gives focus trap, Escape, focus return and `aria-labelledby` for free. Then rebuild the share modal on it, together with F-17 (close button) and the 2026 look.

### F-24 · Bug (design) — District picker on desktop: title sits at the page edge, description/search/list in a centred column
- **Severity:** minor (visual), but it's the entry screen of every district calculator.
- **Where:** district picker, desktop ≥ ~800px.
- **Actual:** "Zvolte svůj volební obvod" is left-aligned at the header gutter (x≈30 at 1440px). The description, search and the whole list sit in a centred `max-w-xl` column starting at x≈333. The heading floats far from its content (screenshot).
- **Evidence:** `media/CW-desk-02-picker.png`
- **Cause:** the title is rendered inside `AppHeader.BottomMain` (full-width header grid, #629's header) in `pages/district-picker.tsx:42-48`. The description and search are a separate `mx-auto max-w-xl` block (`:50`), and the list is in `Layout.Content` (`max-w-xl`, centred).
- **Fix scope:** product. Move the title into the same centred column as the description (like intro, guide, review and result do with their h-titles), or put all of them in one shared page-heading block (see F-19). Do it together with F-18 (search vs list width) and F-02 (description fading).

### F-25 · Opinion — Picker: unavailable ("Připravujeme") districts look *more* prominent than available ones
- **Where:** district picker. 9 of 27 districts were "Připravujeme" on 2026-10-04.
- **Now:** available districts are white rows with a chevron. Unavailable ones are filled light-blue panels (`bg-neutral-disabled/55` on the 2026 palette), taller because of the second "Připravujeme" line. In the list they read as *highlighted* or *selected*, not disabled. Blue is also the brand/primary cue.
- **Proposal:** make disabled rows recede: transparent or very light-grey fill, dashed or no border, muted text, and "Připravujeme" as a small chip on the same line, so the row height matches. Optionally sort them below the available ones within each region.
- **Why:** the eye goes to the wrong rows, and users click unavailable districts first.
- **Evidence:** `media/CW-desk-02-picker.png`, and Kryštof's `media/F-18-picker-width-mismatch.png`
- **Cost:** product, design system `optionList.tsx` (`interactive: false` variant). One line plus the story.

### F-26 · Gap — Result: donate card is off-grid and still in the old style
- **Where:** result, desktop and mobile, between candidates 5 and 6.
- **Now:**
  - The card is narrower than the match cards (inset ~30px on each side on desktop), with a square bottom-right corner (the old cut-corner card), emoji amount chips, a blue outline CTA and its own logo.
  - It's the only element on the result that wasn't brought to the 2026 look, and it breaks the column's edges.
- **Proposal:** a 2026 version: same width and radius as the match cards, `Card` with the standard shadow, amount chips as the design system's chip/toggle, primary CTA as `Button`. Placement between results is fine.
- **Evidence:** `media/CW-desk-08-result.png`, `media/CW-mob-08-result.png`
- **Cost:** product, `apps/*/components/client/donate-card.tsx` (allowlisted). It's per-app, so CZ, SK and MK each have their own copy, and the restyle has to be done three times, or (better) upstreamed into the app package first.

### F-28 · Bug (a11y/UX) — Every calculator step has the same document title
- **Where:** intro, guide, question n, review, result and comparison all have the title "Senátní volby 2026: obvod 81 – Uherské Hradiště — Volební kalkulačka" (measured).
- **Expected:** the step in the title, e.g. "Otázka 7/40 · …", "Rekapitulace · …", "Výsledek · …". That's WCAG 2.4.2, and it's what screen readers announce on route change. Browser history and tabs become usable too.
- **Fix scope:** **platform.** Titles come from the route metadata (`apps/*/lib/metadata` / `(app)` route tree `generateMetadata`), replicated across CZ/SK/MK. A small prerequisite PR with Kryštof's approval.

### F-31 · Question — Answers sometimes missing or different after reloading the result in a fresh browser
- **Source:** observed by the accessibility subagent while auditing, *not* investigated. One mobile run lost all answers after a reload of the result in a fresh browser context, and one desktop reload showed different percentages.
- **Why it matters:** if real, a voter can come back to a different result. That undermines trust in the calculator.
- **Next step:** reproduce deliberately. Answer N questions, note the result, then reload, reopen in a new tab, and reopen in a new context with the same cookie. Compare the `session-data` POST/GET payloads (see F-30, which already shows a 401 path). It could be the answers store (client) racing with the server session save in `handleCloseClick`/navigation, or the 401 path dropping data. Both are **platform** (`packages/app/src/client/stores`, `packages/next` API).
- Until reproduced, don't report it to Klára as a bug.

### F-30 · Bug — New visitor: 401 console error from `session-data` on the intro
- **Severity:** cosmetic for users. It adds noise to monitoring and the console for every first visit.
- **Where:** first load of any calculator intro with no session cookie.
- **Actual:** `GET /api/calculators/{id}/session-data` → **401**, logged as a console error ("Failed to load resource").
- **Expected:** a missing session is a normal state. The route should return 200 with an empty payload (or 204), or the client should skip the call when there's no session cookie.
- **Fix scope:** **platform** (`packages/next/src/api/routes/session-data`, re-exported by `apps/*/app/api/calculators/[calculator-id]/session-data/route.ts`). Check AppSignal for whether these 401s are counted as errors there too.

### F-22 · Bug — Result: the whole match card is clickable (expand) but shows no hover, cursor or focus cue
- **Severity:** minor. Users don't discover that a card expands into the per-question comparison, which is one of the most valuable things on the result. The small chevron is the only hint.
- **Where:** result screen, desktop. Shared code.
- **Steps:** hover over a candidate's card on the result.
- **Expected:** a visible hover state on the card (subtle background or border/shadow lift, `cursor: pointer`) and a visible focus ring when tabbed to, the same as other clickable surfaces (option rows in the picker have both).
- **Actual:** nothing changes on hover. It's only clickable if you happen to click it.
- **Cause:**
  - `packages/design-system/src/components/client/expandableCard.tsx:43-44`. `ExpandableCard.Content` is a bare Headless UI `DisclosureButton` that only passes the caller's `className`: no hover, cursor or focus styles of its own.
  - `match-card.tsx:48` adds only layout classes. Before #630 it was the same (`grid gap-3 p-4`), so this isn't a redesign regression. The redesign just made the cards look more like static surfaces.
- **Fix scope:** product, design system. Give `ExpandableCard.Content` its own interactive states once:
  - `cursor-pointer`
  - `data-hover:bg-surface-hover` (or a border/shadow step on the parent card via `group`)
  - `data-focus:outline-… outline-focus/55`, matching `Button`
  - optionally rotating or tinting the chevron on hover

  Every expandable card then gets it (the "primitives live once" rule). Use `data-hover` (Headless UI's, touch-safe) rather than `hover:`, to avoid F-11's sticky-hover problem on iOS.

### F-21 · Bug (a11y) — Review: reaching "Zobrazit výsledky" by keyboard takes ~120 Tabs
- **Severity:** major for keyboard and switch users. The primary action on the screen is practically unreachable. WCAG 2.4.1 (bypass blocks) is in spirit here.
- **Where:** review ("Rekapitulace"), 40-question calculator, desktop. Shared code.
- **Steps:** on the review, press Tab until "Zobrazit výsledky" is focused.
- **Expected:** the primary action is a few Tabs away, and the list doesn't cost 3 stops per row.
- **Actual:**
  - "Zobrazit výsledky" sits visually at the bottom (sticky) *and* last in the DOM: `pages/review.tsx:107-109`, after the `questions.map(...)` at `:87-104`.
  - Every row has three separate tab stops: ★, Ano, Ne (`review-question-card.tsx`, three independent `ToggleButton`s).
  - 40 questions × 3 ≈ 120 Tabs, plus the header and back pill.
- **Evidence:** reported by Kryštof. The structure is confirmed in code.
- **Cause:** not new in the redesign. It's the existing review structure. Rows built from independent toggles, with the CTA last in the DOM, make the cost linear in the number of questions.
- **Fix scope:** product. Two complementary changes:
  1. **Make yes/no one tab stop per row.** Ano/Ne are mutually exclusive, so semantically they're a radio group (`role="radiogroup"` with roving tabindex, ←/→ to switch; Headless UI `RadioGroup` does this). The star stays a separate toggle. That's 2 stops per row: still ~80, but correct semantics and fewer stops.
  2. **Put the primary action within reach.** Either (a) repeat the CTA at the top, next to "← Zpět na otázky" (also good for mouse users who don't want to scroll 40 rows), or (b) add a "Přeskočit na výsledky" skip link as the first focusable element on the page, visible on focus. (a) is simpler and helps everyone.

  Don't move the sticky CTA earlier in the DOM while it stays visually at the bottom. A focus order that contradicts the visual order fails WCAG 2.4.3.
- **Related:** F-08 (the same toggles are too small for touch). Doing (1) in the design system as a compact "answer segmented control" would fix both, and it lives once (the "primitives live once" rule).

### F-20 · Bug (a11y) — Keyboard: Tab doesn't reach Předchozí/Přeskočit on the question page (Safari)
- **Severity:** major *if* it reproduces outside Safari's default setting. Keyboard users couldn't skip or go back.
- **Reported:** Kryštof, desktop Safari (confirmed 2026-10-04; ⌥Tab is taken by a system shortcut, so check by turning the Safari setting on instead): "you can not get to prev/next on the question page".
- **Verified in Chromium (Playwright, staging, Q1 of obvod 81, 1280×800):** the Tab order is complete and correct, and it cycles:
  `Zavřít → Pro mě důležité (★) → Ano → Ne → Návod → Přeskočit → (body) → Zavřít …`
  So the buttons are real `<button>`s, focusable, in the right order, with the shared focus outline (`button.tsx` base `data-focus:outline-3`). There's no focus trap, `tabindex=-1` or key handler in the code.
- **Most likely explanation: macOS Safari's default.**
  - With *Settings → Advanced → "Press Tab to highlight each item on a webpage"* **off** (the default), Safari's Tab skips buttons and links that don't have an explicit `tabindex`. You need ⌥Tab to reach them.
  - The probe shows exactly that split. ★/Ano/Ne carry `tabindex="0"` (Headless UI sets it on toggles), so Safari stops on them. "Zavřít", "Návod" and "Přeskočit" are plain buttons with no `tabindex`, so Safari skips them.
  - That matches "can tab to the answers, can't get to prev/next".
- **To confirm:** in Safari, try ⌥Tab on the question page, or turn on the setting above. If prev/next are then reachable, it's Safari's default, not our bug: the same holds for every link and button on the web for Safari users with the default setting.
- **If it still fails with the setting on:** reopen as a Bug and attach a recording. Then the suspect is the question card's `overflow-y-auto` scroller (F-07) taking focus in WebKit, or the sticky header covering the focused element.
- **Decision (revised after discussion with Kryštof, 2026-10-04):** relying on Safari's default isn't good enough here, because our page is *inconsistent* under it: ★/Ano/Ne are reachable (Headless UI toggles carry `tabindex="0"`), but Zavřít/Návod/Přeskočit/Zobrazit výsledky aren't. A Safari user who Tabs gets half a UI.
  - Recommended fix: the design system's `Button` sets `tabIndex={0}` by default (overridable). On a native `<button>` that changes nothing in Chrome or Firefox, and it makes Safari's default Tab include our buttons, consistent with the toggles.
  - The same for the few raw `<button>`s and `<a>` (share modal close, picker close link, comparison controls). Better: swap them to the DS `Button` (F-17).
  - Trade-off: it goes against Safari's "only form fields" preference for users who chose it. Acceptable for a form-like flow, where every step is an action.
  - With this, F-20 becomes a **Bug, major**, and F-21's "120 Tabs" applies to Safari too.
- **Possibly worth doing:** keyboard shortcuts on the question screen (←/→ for previous/skip, A/N or 1/2 for answers) with a visible hint. Klára's superseded stack had "KeyboardHints" (#521). A deliberate feature, not a fix.

### F-19 · Bug (design) — Guide: vertical spacing has no rhythm, and on mobile the cards are inset from the title
- **Severity:** minor (visual polish), but it's the first content screen after the intro.
- **Where:** guide ("Návod"), desktop (screenshot) and phone (see `media/F-05-guide-button-overlap-ios.png`). Shared code.
- **Now:** every gap comes from a different ad-hoc source, so none of them relate to each other:

  | Gap | Source | ≈ size |
  |---|---|---|
  | back pill → "Návod" | `pages/guide.tsx:41` `mb-4` | 16px |
  | "Návod" → first card | `pages/guide.tsx:47` `mb-2 sm:mb-3` **plus** `guide.tsx:19` `pt-[clamp(8px,…,28px)]` | up to ~40px, the biggest gap on the page, separating the title from its own content |
  | card → card | `guide.tsx:19` `gap-3 sm:gap-4` | 12–16px |
  | last card → methodology note | same `gap` | 16px |
  | note → "Začít odpovídat" | `Layout.Content` `sm:py-4` + nav wrapper `sm:py-3 lg:py-4` | ~32–48px |

  On a phone the cards sit *inside* the title's left edge. `guide.tsx:19` still carries `-mx-2 … px-gutter sm:mx-0 sm:px-0`. The `-mx-2` was there to cancel the old `Layout.Content` `p-2`, and `px-gutter` then double-pads on top of `Layout.Content`'s new `px-gutter` (#629). Net effect: the cards are inset by (gutter − 8px) relative to "Návod" and the back pill.
- **Evidence:** `media/F-19-guide-whitespace.png`; the mobile inset is visible in `media/F-05-guide-button-overlap-ios.png`
- **Proposal:**
  - One spacing scale for a page: heading block → content uses one token, items within a group use a smaller one, group → primary action uses a larger one.
  - Concretely: drop the `pt-[clamp…]` on the guide grid and drop `-mx-2 px-gutter sm:mx-0 sm:px-0` (leftovers that `Layout.Content` now handles).
  - Make the title's bottom margin match the intro/review/result titles.
  - Ideally a shared "page heading" piece (back pill + h-title + optional lead) that intro, guide, review, result and comparison all use. That also solves part of F-16.
- **Cost:** product, small (two class lists). The shared page-heading component is a separate, medium PR.
- **Source:** #629 added the `pt-[clamp…]` and switched `Layout.Content` to `px-gutter` without removing the old `-mx-2` compensation. Same pattern as F-18.

### F-18 · Bug — District picker: search field and result rows have different widths
- **Severity:** minor (visual). Not intentional: before #629 they were the same width.
- **Where:** district picker, desktop, CZ staging. Probably the calculator picker too (same structure, not yet seen). Shared code.
- **Expected:** search field and option rows share the left and right edges, since they sit in the same `max-w-xl` column.
- **Actual:** the rows are inset roughly 25–30px on each side relative to the search field (screenshot), and the difference grows with the viewport.
- **Evidence:** `media/F-18-picker-width-mismatch.png`
- **Cause:**
  - #629 changed `Layout.Content` (`packages/app/src/components/layout.tsx:35`) from `p-2 sm:p-4` to `px-gutter` (fluid 18→44px) for the calculator screens.
  - The picker's header block, with the description and search field (`packages/app/src/client/components/pages/district-picker.tsx:50`), still uses `px-2 sm:px-4`, the old values that used to match.
  - So the rows (in `Layout.Content`) got the wider gutter and the search field didn't.
  - The same "#629 changed the shared shell, the pickers weren't rechecked" miss as F-02.
- **Fix scope:** product, one class. Change the picker header block to `koa:px-gutter` (in both pickers), so the inset comes from one token. Better: have the pickers' header content use the same container component as `Layout.Content`, so the width can't drift again.

### F-17 · Bug — Share modal close button has almost no hover state
- **Severity:** cosmetic.
- **Where:** result → "Sdílet" → share modal, desktop. Shared code.
- **Expected:** the same close control as the header: the round neutral button with a visible hover background.
- **Actual:** a bare `<button>` with a ✕ icon. Its only hover feedback is the icon colour going from `text-muted` to `text`, which is barely perceptible. No background, no cursor change beyond the default.
- **Cause:** `packages/app/src/client/components/share-modal.tsx:119` hand-rolls the button (`koa:text-text-muted koa:hover:text-text`) instead of using `<Button variant="round" color="neutral" size="small">` like `AppHeader.Right` on every page. Pre-redesign (#552); only recoloured by #628. The share modal as a whole wasn't brought to the 2026 look by any merged PR. Worth checking the rest of the modal too: card, copy button, privacy link.
- **Fix scope:** product, one line. Swap in the design-system `Button variant="round"`. That also gives it the proper focus ring and touch target.

### F-15 · Bug (data) — Intro heading shows a pre-truncated name: "Obvod 81 – Uherské Hradi…"
- **Severity:** major for the affected districts. A voter's own town name is cut off in the biggest heading on the page. There's plenty of room, and it looks broken, not intentional.
- **Where:** introduction, Senate 2026, CZ staging, desktop. Affected calculators (all of them in the data repo): obvod 81 Uherské Hradiště, obvod 51 Žďár nad Sázavou, obvod 48 Rychnov nad Kněžnou.
- **Steps:** open the intro of obvod 81.
- **Expected:** "Obvod 81 – Uherské Hradiště", wrapping to two lines if needed.
- **Actual:** "Obvod 81 – Uherské Hradi…". The ellipsis is a literal `…` character in the data, not CSS truncation.
- **Evidence:** `media/F-15-heading-truncated.png`
- **Cause:**
  - The schema caps `shortTitle` at 25 characters (`packages/schema/schemas/calculator.schema.ts:73,82`: "Short title of a calculator with a maximum of 25 characters").
  - When the Senate data was added (data repo #81, `3f76668`, Michal Škop), the three names longer than 25 characters were cut to 24 + `…` to pass validation. See `senatni-2026/{81-uherske-hradiste,51-…,48-…}/calculator.json`.
  - The intro page uses `calculator.shortTitle` as its big heading (`packages/app/src/components/pages/introduction.tsx`, since #559), which is a place where a long name is fine.
  - Not a redesign PR. The redesign only made it more prominent.
- **Fix scope:**
  - (a) **Data, now (no code):** a plain JSON PR in the data repo with real ≤25-char short titles that don't cut a word, e.g. "Obvod 81 – Uh. Hradiště" (23 characters; "Žďár nad Sázavou" and "Rychnov nad Kněžnou" don't fit even abbreviated with the prefix). Or drop the "Obvod NN –" prefix in `shortTitle` for these, e.g. "Uherské Hradiště". Agree the convention with Michal for all 27 districts so they stay consistent.
  - (b) **Product, proper:** the intro heading shouldn't use the 25-char field at all. It has room for the full name. Use `title` without the election prefix (or a district-name field, if the content model gets one), and keep `shortTitle` for tight spots (header subtitle, tabs, OG). Changing the field the page reads is product (`packages/app/src/components/**`). Adding a new schema field would be platform.
  - Also worth a data-repo CI check: reject `shortTitle` values ending in `…` or `...`.

### F-14 · Bug — Result: the lists/people switch has lost its track, so it no longer reads as a switch
- **Severity:** minor. It still works, but the inactive option ("Lidé") looks like plain text next to a dark pill. Users won't recognise a two-way switch, and the second view is easy to miss.
- **Where:** result screen ("Výsledek"), desktop Safari, CZ staging. The same markup is in the public (shared) result.
- **Steps:** open the result of a calculator that has candidate lists with nested people.
- **Expected:** a visible segmented-control track (pill background), with the selected option in a dark pill inside it.
- **Actual:** the track is barely distinguishable from the page backdrop, so only the dark "Kandidátní listiny" pill is visible, and "Lidé" floats beside it with no container.
- **Evidence:** `media/F-14-result-switch-desktop.png`
- **Likely cause:**
  - In `packages/app/src/components/pages/result.tsx:78-91`, #630 mapped the track and the inactive segment from `bg-slate-100` to `bg-surface-sunken`. That token derives to L≈0.968, about the same lightness as `slate-100`, so on the old white page it was visible.
  - Since #628/#631 the page is no longer white: a tinted page colour plus the soft backdrop glow sit at about the same lightness. Sunken-on-page now has almost no contrast.
  - The inactive label also paints `bg-surface-sunken`, the same as the track, so nothing outlines it.
- **Fix scope:** product.
  - Short term: give the track a token that contrasts with the *page*, not with a white card: `bg-surface` (white) with a `border-border` hairline, or a stronger sunken step. Make the inactive segment transparent.
  - Proper fix (the "primitives live once" rule): this segmented control is hand-rolled twice, in `result.tsx` and `public-result.tsx`. Extract a `SegmentedControl` into the design system (radio group semantics, as now) and use it in both places.
- **Theme note:** check the dark mode too. `surface-sunken` has a dark value, and the same contrast question applies against the dark page.

### F-13 · Bug — Desktop: question screen scrolls ~16px for no reason; the progress bar fades under the header
- **Severity:** minor on its own, but it is the desktop face of F-06. The content clearly fits, yet the page scrolls a little, and the progress bar slides under the header's fade and turns ghosted.
- **Where:** question screen, desktop Safari (~1000×570 CSS viewport), Q40, CZ staging. Shared code.
- **Steps:** on any question, scroll down with the trackpad.
- **Expected:** no scroll, since everything fits with room to spare.
- **Actual:** the page scrolls by ≈16 CSS px. The step progress bar moves up under the header and fades (the header's #629 tail), and the whole card shifts.
- **Evidence:** `media/F-13-desktop-scroll-rest.png`, `media/F-13-desktop-scroll-scrolled.png` (progress bar at y≈270 → ≈239 in screenshot px, ≈16 CSS px)
- **Likely cause:** the same hard-coded height as F-06.
  - `pages/question.tsx:115` sets the column to `h-[calc(100lvh-5rem)]` (plus `sm:py-6` inside), and it sits inside `Layout.Content`, which adds its own `sm:py-4` (`layout.tsx:35`) under a header whose real height isn't `5rem`.
  - Header + content padding + `100lvh − 5rem` adds up to slightly more than the viewport, so the remainder scrolls.
  - On desktop `lvh` = `vh`, so this one isn't toolbar-related, just the arithmetic.
- **Fix scope:** product, the same fix as F-06. Stop computing the column height from the viewport minus a guessed header. Let `Layout` be a `min-h-dvh` flex column and give the question column `flex-1 min-h-0`. One PR for F-06, F-07, F-12 and F-13.

### F-12 · Bug — Desktop: answer buttons and step row move with each question's text length; repeated clicks miss and select text
- **Severity:** major. On desktop people answer by clicking repeatedly in the same spot. When the target moves, the click lands on the description, selecting text instead of answering. It feels "jumpy", and with F-11 (no selected confirmation) the user can't tell whether an answer was recorded.
- **Where:** question screen, desktop Safari (~1512×950 CSS px), Senate 2026, Obvod 6 – Louny, CZ staging. Shared code.
- **Steps:** answer questions 1→12 with the mouse, without moving it.
- **Expected:** "Ano / Ne / ★" and the "Předchozí · n/40 · Přeskočit" row stay in the same place from question to question. Only the text above them changes.
- **Actual:**
  - The card is sized by its content. Short questions (2-line statement, 2-line detail) put the answer row at one height. Q10 (4-line statement, 4-line detail) pushes it about 20px lower, and the step row with it.
  - In the recording, the click meant for "Ano" on Q10 lands on the detail paragraph and selects it (blue selection highlight, second row of the frames image). Q11 shorter → the buttons jump back up. Q12 longer → down again.
  - Across screens the action also moves sideways. Intro and guide use the narrow `max-w-xl` column, and their button sits under the text at the top left. The question screen is a centred 51.25rem column, so the primary action is in a different place on every step of the flow.
- **Evidence:** `media/F-12-desktop-buttons-jump.mp4`, `media/F-12-desktop-buttons-jump-frames.png`
- **Likely cause:**
  - `packages/app/src/components/question-card.tsx:39` makes the card `sm:flex-none sm:min-h-[min(28rem,calc(100dvh-16rem))]` on desktop: content-sized above a 28rem floor. Any question taller than the floor grows the card downward.
  - The inner text block is `my-auto` (vertically centred, `:63-64`), so even *below* the floor the statement shifts. The answer row's position is the card's bottom, which follows the content.
  - The step row is in the same column flow (`pages/question.tsx:115-125`), so it moves too.
  - Introduced in #632. #655 tuned the type sizes but not the anchoring.
- **Fix scope:** product, and it can share a PR with F-06/F-07:
  - Give the desktop card a *fixed* height (or a floor high enough for the longest realistic question, e.g. `min-h-[min(34rem,…)]`) and anchor the answer row to the card's bottom (`mt-auto`), so short questions don't change its position.
  - Top-align the text block instead of `my-auto`.
  - Accept that a really long question grows the card *once*, rather than jitter on every question.
  - Ideally, unify the content column width and action placement across intro → guide → question → review, so the primary action lives in one predictable place on desktop.
- **Related:** F-11 (no selected state). Together they make answering on desktop feel unreliable.

### F-11 · Bug (UX) — Question screen: tapping Ano/Ne gives no "selected" confirmation before the next question replaces it
- **Severity:** major. Answering is the core interaction, repeated 40 times. Users can't tell whether a tap registered or whether they hit the wrong button. That drives double-taps (answering the *next* question by accident) and erodes trust in the result.
- **Where:** question screen, CZ staging, iPhone Safari. Shared code.
- **Steps:** answer a few questions in a row with Ano or Ne.
- **Expected:** the tapped button visibly turns *selected*, a solid primary or secondary fill like the review screen's checked toggles. It holds briefly (~150–250 ms), and then the next question comes in, ideally with a short transition, so the change of question is legible.
- **Actual:**
  - The button flashes its *pressed* tint (light blue or pink, `data-active:bg-*-tint-strong`) for about one frame, and the next question's text appears.
  - The solid "checked" fill never shows. In some frames the light tint still sits on the same button *on the next question*, so for a moment the new question looks pre-answered: in the video at ≈0.5 s the new question's text is already there and "Ano" is still tinted; the other two taps show no carry-over.
- **Evidence:** `media/F-11-answer-feedback.mp4`
- **Likely cause:**
  - `packages/app/src/components/pages/question.tsx:33-58`. `handleAgreeChange`/`handleDisagreeChange` call `answer.setAnswer(...)` and then `onNextClick()` in the same tick, so the `data-checked` style (`button.tsx`, `answer` compounds: `data-checked:bg-primary`) is never painted before the route moves on.
  - The leftover tint on the next question is most likely iOS's sticky `:hover`. The `answer` compounds use plain `ko:hover:bg-*-tint`, not Headless UI's `data-hover`, which ignores touch. The button DOM node is reused across questions, so the hover persists. The `data-[just-clicked]` overrides only cover part of this.
  - The immediate navigation is old: it was already there before #632. The redesign made it more visible because the pressed and checked styles were restyled in #627 and the card is bigger.
- **Fix scope:** product.
  - (1) In the question page, set the answer, let the checked state paint, then navigate: a ~200 ms delay, or `onTransitionEnd`. Ignore further taps during that window, which also kills accidental double answers.
  - (2) In the design system, switch the `answer` compounds' `hover:` to `data-hover:` (touch-safe), like the other variants already do.
  - (3) Optionally add a short slide or fade between questions, so the change is visible even when two questions look alike.

  Respect `prefers-reduced-motion` for (3), not for (1).

### F-10 · Gap — Comparison page still has the pre-2026 layout
- **Severity:** major for launch. It is the last step of the flow, and it visibly belongs to a different product than the screens before it.
- **Where:** comparison ("Porovnání"), CZ staging, iPhone Safari. Shared code.
- **Now:** only #628's palette reached it. The structure is the pre-redesign one:
  - an inline "← Porovnání" heading row instead of 2026's page heading plus "Zpět" pill (compare the review screen's "← Zpět na otázky")
  - a bare `×` close icon where every other screen has the round bordered close button
  - old-style candidate column headers
  - dashed column guides
  - small question cards whose type and spacing differ from the review cards
- **Evidence:** `media/F-10-comparison-old-layout-ios.png`
- **Source:** no merged redesign PR touched `packages/app/src/components/pages/comparison.tsx` or the comparison grid. Their last structural change was #551/#554, plus #628's colours.
  - Klára's old, open stack has #531 "Add the answers comparison page", but it belongs to the superseded port (#510–#538), not the current PR series.
- **Proposal:** a dedicated PR, "Give the comparison screen the 2026 look", in the same shape as #630:
  - header plus back pill as on review/result
  - round close button
  - 2026 card for the question rows
  - the shared `Layout.BottomNavigation` once F-05 is fixed

  Decide whether anything from #531 is worth salvaging, then close the superseded stack (#510–#538), so nobody reviews or merges it by accident.
- **Cost:** product, a medium PR. The comparison grid is the most layout-heavy screen. Check horizontal scrolling with 5+ candidates and the embeds.
- **Measured by Claude (2026-10-04, obvod 81, 6 candidates):**
  - The *whole document* scrolls horizontally: `scrollWidth` 2333px at a 1440px viewport, and 1351px at 390px.
  - The grid row is `w-max` (`comparison-grid.tsx:190`), with sticky question cards at `w-[95dvw]`, so the page itself is the horizontal scroller rather than a contained grid.
  - In mobile emulation the browser then zooms the whole page out to fit (layout viewport became 2924px tall). On Android Chrome the comparison can therefore load zoomed out.
  - Desktop columns hug the left half of the screen (`media/CW-desk-10-comparison.png`).
  - The redesign should contain horizontal scrolling inside the grid (`overflow-x-auto` wrapper, sticky first column) and never widen the document.

### F-09 · Opinion — Result: "Porovnat" sits at the end of the list instead of floating like every other screen's action
- **Where:** result screen, CZ staging, iPhone Safari. Shared code.
- **Now:**
  - Intro, guide and review keep their primary action floating at the bottom (`Layout.BottomNavigation`, sticky).
  - On the result, "Porovnat" is an in-flow button after the last candidate. With a long list, users only find it after scrolling through everyone.
  - Before #630 it floated like the rest.
- **Proposal:** put "Porovnat" back into `Layout.BottomNavigation`, so the result screen behaves like the rest of the flow.
- **Why:**
  - Consistency across the flow.
  - Compare is the main next step after seeing the result.
  - The reason given for moving it no longer holds. The comment at `packages/app/src/components/pages/result.tsx:105-110` says the button is in-flow because a `position: fixed` bar gets clipped by iOS Safari's glass bar, but #629 had already replaced `fixed` with `sticky` in `Layout.BottomNavigation` for exactly that reason.
  - The comment also cites `rules.md` and 2026's `globals.css`, which don't exist in this repo. That's the same dead-reference nit as on #630.
- **Evidence:** `media/F-09-result-compare-button-ios.png`
- **Cost:** product, small. Move `<ResultNavigationCard>` from `result.tsx:111-113` into `<Layout.BottomNavigation>` and delete the stale comment. Fix F-05 first: a floating button on the result page would otherwise cover the last candidate the same way.

### F-08 · Bug (a11y) — Review screen: yes/no/star touch targets are ~36px, yes and no only 6px apart
- **Severity:** major. A mis-tap here silently *changes an answer* that feeds the result, on the screen whose whole job is correcting answers. It is below Apple's 44pt and Material's 48dp guidance. It passes WCAG 2.5.8 AA (24px) but not 2.5.5 AAA (44px).
- **Where:** review ("Rekapitulace"), CZ staging, iPhone Safari. Shared code.
- **Steps:** open the review on a phone and try to flip an answer with a thumb.
- **Expected:** answer toggles at least 44×44 CSS px, with enough space between yes and no that the wrong one isn't hit.
- **Actual:** in the screenshot, yes, no and the star each measure ≈ 36px, and yes and no are separated by a 6px gap.
- **Evidence:** `media/F-08-review-touch-targets-ios.png`
- **Likely cause:** `packages/app/src/components/review-question-card.tsx:36-56`.
  - #657 made the design system's `answer` variant honour `size="small"` with a new 36px compound, and tightened the row (`gap-1.5`, star `size="xsmall"`, 36px `h-9`). The goal was to match 2026's compact recap row and give the title more width; the comment at `:28-35` says so.
  - It looks right in the mock but is too small for thumbs.
  - This is the "growing Button size matrix" watch item from my #657 review turning into a real problem.
- **Fix scope:** product. Pick one:
  - Keep the 36px *visual* size but give a 44px hit area: padding plus a negative margin, or an `::before` with `inset: -4px` in the design system's `answer`/`round` variants, so every caller benefits.
  - Go back to `size="medium"` (44px) on mobile and allow `small` from `sm:` up.

  Either way, widen the yes/no gap to ≥ 8px. Since #657 moved the answer row under the title on mobile, there is room.

### F-07 · Bug — Question screen: nested scroll inside the card traps the gesture, with no sign the text scrolls
- **Severity:** major. Combined with F-06, the user has to find the few pixels outside the card to scroll the page. On long questions the start of the question scrolls out of view with no indicator.
- **Where:** question screen, long statement or detail (Q "Pravidla EU pro AI v důležitých rozhodnutích"), CZ staging, iPhone Safari. Shared code.
- **Steps:**
  1. On any question, try to scroll the page by dragging on the card. On a long question the drag scrolls the card's text instead of the page.
  2. On a long question, drag inside the text.
- **Expected:** one scroll surface, the page. The question is never partly hidden without a visual cue.
- **Actual:**
  - The card body is its own scroller (`overflow-y-auto`) and covers almost the whole viewport, so nearly every touch lands in it.
  - The page scrolls only when the gesture starts outside the card (the thin margins), or after the inner scroll has hit its end and iOS chains it.
  - After an inner scroll, the statement's first lines disappear under the topic chip with no fade or scrollbar hint (screenshot 9: "…povinnému dohledu člověka." with the beginning gone).
- **Evidence:** `media/F-06-question-7.png`, `media/F-06-question-8.png`, `media/F-06-question-9.png`
- **Likely cause:** `packages/app/src/components/question-card.tsx:63`. The statement and detail sit in `flex-1 min-h-0 overflow-y-auto`, which was added deliberately so the card never grows past the fixed-height column from F-06 (see the comment at `:55-62`). The two decisions depend on each other: a fixed-height column forces an inner scroller.
- **Fix scope:** product, same change as F-06. Let the column size to its content (`min-h` instead of `h`) and drop the inner `overflow-y-auto`. A long question then makes the *page* scroll, with the answer row and step row following naturally. If the "card fits the screen" look must stay on short questions, keep it as `min-h`, not `h`. If an inner scroller stays for some reason, it needs fade edges and `overscroll-behavior: auto`, and it must never hide the statement's first line.

### F-05 · Bug — Bottom button covers the last line of text, even fully scrolled
- **Severity:** major. Content is unreadable at the end of the guide, the screen every user passes through, and scrolling can't fix it.
- **Where:** guide ("Návod"), Senate 2026, CZ staging, iPhone Safari (toolbar collapsed). Any screen whose content is taller than the viewport and that uses `Layout.BottomNavigation` will do the same: review, longer intros. Shared code.
- **Steps:** open the guide on a phone and scroll to the very bottom.
- **Expected:** at the end of the scroll there's a clear gap between the last paragraph and the "Začít odpovídat" button.
- **Actual:** the button's top edge sits on the last line ("nezapočítává do výsledku kalkulačky."), and it can't be scrolled further.
- **Evidence:** `media/F-05-guide-button-overlap-ios.png`
- **Likely cause:** #629 switched `Layout.BottomNavigation` (`packages/app/src/components/layout.tsx:45-50`) from `fixed` plus a `BottomSpacer` of the nav's height to `koa:sticky koa:bottom-4`. The sticky approach is fine, but:
  - At the end of the scroll the nav's natural position is flush with the page bottom. `bottom-4` then pushes it 16px *up*, within its containing block, over the content above.
  - The mobile nav wrapper (`navigation-card.tsx:22`) has only `pb-4`, no top padding, and `Layout.Content` ends with just `py-2` (8px). So 8px of gap minus a 16px shift leaves 8px of overlap.
- **Fix scope:** product. Make the sticky offset part of the nav's own box instead of a shift:
  - `sticky bottom-0`, with the 16px gap kept as padding inside the wrapper, or
  - give the content enough bottom padding (≥ the sticky offset plus a breathing gap).

  Then scroll to the end of guide, review and intro on iPhone with the toolbar both collapsed and expanded, and in an embed with the attribution footer (`EmbedFooter.navOffsetClassNames`).
- **Review note:** I approved #629's sticky switch without checking the end-of-scroll state on a long screen.

### F-04 · Bug — Short pages scroll on iPhone; the title scrolls away under the header
- **Severity:** minor. Nothing breaks, but a screen with two lines of content shouldn't scroll at all, and scrolled it looks broken: the title is gone and a ghost line peeks under the header.
- **Where:** introduction ("Obvod 27 – Praha 1"), Senate 2026, CZ staging, iPhone Safari with the bottom toolbar visible. Probably every short screen on `Layout`: guide steps, errors. Shared code.
- **Steps:** open a district's introduction on an iPhone and drag the page up.
- **Expected:** content that fits doesn't scroll.
- **Actual:** the page scrolls by roughly the height of Safari's toolbar. The title goes under the opaque header, and the description's last line ghosts through the header's fade tail.
- **Evidence:** `media/F-04-intro-scrolls-4.png` (at rest), `media/F-04-intro-scrolls-5.png` (scrolled)
- **Likely cause (hypothesis, not yet measured):**
  - `packages/app/src/components/layout.tsx:12` gives the `Layout` root `koa:min-h-screen`, which is `100vh`. On iOS Safari, `100vh` is the *large* viewport (toolbar hidden), so the page is always taller than what's visible while the toolbar shows.
  - This dates back to #549 (pre-redesign). It's more noticeable now because #629's sticky header paints a solid band and a fade over whatever scrolls under it.
- **Fix scope:** product. Use `koa:min-h-dvh` (or `svh`) in `Layout`. Check that the sticky bottom navigation still sits at the bottom with the toolbar both shown and hidden. Check the embeds too, where `vh` inside an iframe follows the iframe height.

### F-03 · Bug (design) — Search field and highlighted result both show a focus ring
- **Severity:** minor. It works, but it reads as "two things have focus", which breaks the one-focus convention and confuses keyboard and screen-magnifier users.
- **Where:** the district picker while typing in the search. CZ staging, iPhone Safari. Desktop is the same code path. Shared code: the design system's `OptionList`.
- **Steps:** open the district picker and type "pr".
- **Expected:** one focus indicator, on the search field. The first matching row (the target of Enter) is marked differently, in the "active option" style.
- **Actual:** the search field and the "Praha 5" row both carry the same thick light-blue ring with offset, so they look identical.
- **Evidence:** `media/F-03-double-focus-ios.png`
- **Likely cause:** this is intended behaviour with the wrong visual.
  - `packages/design-system/src/components/client/optionList.tsx` gives `highlighted: true` the style `ko:ring-3 ko:ring-primary/55 ko:ring-offset-2`. The comment explains it: focus stays in the field, so `:focus-visible` can't show the Enter target.
  - The input's focus is `outline-3 outline-offset-2 outline-focus/55` (`input.tsx:26`), the same weight, offset and colour family.
  - Introduced in #591 (Kryštof), so not one of Klára's PRs.
- **Fix scope:** product, design system only. Give `highlighted` an "active option" look that can't be mistaken for focus: a tinted background (`bg-primary/8`) plus a primary border, with no ring or offset. Optionally show it only on hover-capable or keyboard devices (`@media (hover: hover)`); on touch nobody presses Enter in a filtered list, though the iOS keyboard does have Enter. Update the `OptionList` story.

### F-02 · Bug — Picker description fades to a ghost on scroll
- **Severity:** major. The one line explaining what the page does becomes unreadable as soon as the user touches the list.
- **Where:** the district picker ("Zvolte svůj volební obvod"), Senate 2026, CZ staging, desktop Safari. The calculator picker uses the same structure, so it very likely does the same; not yet seen. Shared code.
- **Steps:** open the district picker and scroll the list a little.
- **Expected:** the header block (title, description, search) stays solid while the list scrolls under it.
- **Actual:** the description "Kalkulačka porovná vaše názory s kandidáty tam, kde volíte." fades to near-invisible after the first scroll pixel and comes back at the top. Nothing scrolls over it. It is covered by the header's own fade.
- **Evidence:** `media/F-02-scroll-overlap.mp4`, `media/F-02-scroll-overlap-frames.png` (frames 4–6 show it ghosted)
- **Likely cause:** #629 gave `AppHeader` (`packages/app/src/client/components/app-header.tsx:84-93`) a sticky box with an `after:` tail.
  - The tail is a page-colour gradient (`after:top-full`, height `--ko-spacing-fade-edge`) that fades in once `useScrolled` fires.
  - It assumes nothing in the header sits below `AppHeader`. The picker (#595, `pages/district-picker.tsx:31-54`) breaks that assumption: its description paragraph and search box sit under `AppHeader`, inside the same `Layout.Header`, so the tail is painted right over the description.
  - The picker also already has its own sticky backdrop (`bg-page/85 backdrop-blur-md border-b`), so there are now two competing scroll treatments.
- **Fix scope:** product. Pick one:
  - (a) Let `AppHeader` skip the tail when the page owns its own header chrome, e.g. a `fade={false}` prop.
  - (b) Move the tail to the outer `Layout.Header`, so it always sits at the real bottom edge.
  - (c) Move the description and search into `AppHeader.Bottom`.

  (b) fits best: one scroll treatment, owned by the layout. It also ties into the open follow-up "single scroll-state source (`useScrolled` vs `WithCondenseOnScroll`)". Check the calculator picker and the comparison page after the fix.
- **Review note:** a miss in my #629 review. I checked the calculator screens, not the pickers that also mount `AppHeader`.

### F-01 · Bug — Header wordmark text is too small, especially on desktop
- **Severity:** major. It is the brand line on every screen, and on desktop it reads as a rendering glitch.
- **Where:** every screen that renders `AppHeader`: the homepage, the calculator flow, the pickers and comparison. Seen on CZ staging, iPhone Safari and desktop Safari (~1000px CSS width). It is shared code, so it affects SK, MK and the embeds too.
- **Steps:** open staging.volebnikalkulacka.cz on any viewport.
- **Expected:** the wordmark "Volební kalkulačka" is readable, and the text and mark grow with the viewport. Before #629 it was 14px (`text-sm`) with the `small` logo.
- **Actual:** the text is a fixed 11px and the logo is `xsmall` at every breakpoint. On desktop it is tiny next to the ~80px page title.
- **Evidence:** `media/F-01-header-text-ios.png`, `media/F-01-header-text-desktop.png`
- **Likely cause:** `packages/app/src/client/components/app-header.tsx:145-148` (#629, `1b129bde`)
  - `<Logo size="xsmall">` replaced `small`.
  - The title and subtitle use `koa:text-[11px] koa:leading-[1.2] koa:tracking-[-0.03em]`. These are arbitrary px values outside any type scale, with no responsive step. The 11px probably came from the phone mock and was never scaled up.
- **Fix scope:** product (`packages/app/src/client/components/**`). Restore a responsive size, for example `koa:text-sm koa:lg:text-base`, with logo `small` → `medium` at `lg`. It must stay in step with the condensed-on-scroll state. Better still, use the type-scale tokens (open follow-up: "type scale"), so the header doesn't keep its own px values. Check the embeds, where the header is narrower.
- **Related (question):** on desktop the header content sits at the page edge (x≈55) while the page content column starts at x≈197, so the logo doesn't line up with the title. Is that intended for a full-bleed header, or should it follow the content container?

<!-- Template (bug):
### F-NN · Bug — short title
- **Severity:** blocker / major / minor / cosmetic
- **Where:** screen · site(s) · viewport · browser
- **Steps:** 1. … 2. …
- **Expected:** …
- **Actual:** …
- **Evidence:** media/…
- **Likely cause:** file:line (PR #…)
- **Fix scope:** product / platform · suggested fix
-->

<!-- Template (opinion / question):
### F-NN · Opinion — short title
- **Where:** screen · site(s) · viewport
- **Now:** what it does
- **Proposal:** what Kryštof would prefer
- **Why:** the reasoning
- **Evidence:** media/…
- **Cost:** where it would change (file, PR) · product / platform · effort
-->
