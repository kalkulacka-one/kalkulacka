# Accessibility audit: WCAG 2.2 AA, calculator flow

Audited **2026-10-04** on `https://staging.volebnikalkulacka.cz` against `origin/main` @ `71f10927`.
Flow: homepage → Senate picker (`/volby/senatni-2026`) → `81-uherske-hradiste` intro → guide → questions 1–40 (1–6 answered, ★ on 3, the rest skipped) → review → result → comparison, plus the share modal.

**Method.** Playwright Chromium, desktop 1280×800 and mobile 390×844 (DPR 2, touch), one browser context per walk so the cookie session carried state. Checks used:
- axe-core 4.13.0 with tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`;
- scripted Tab walks that log `document.activeElement`;
- computed-style contrast, composited through alpha and verified by pixel sampling where a gradient sits behind;
- bounding-box target sizes;
- 320×256 and 640×400 viewports (equal to 400 % and 200 % zoom of 1280-wide screens), plus a root font size of 200 %;
- `reducedMotion: "reduce"` emulation;
- reading Next's `next-route-announcer` shadow DOM after each navigation.

Everything below was measured or reproduced. Anything that is only read from code says **unverified** on its own line.

Media live in `media/` with the prefix `A11Y-`.

**Scope note (2026-10-04):** the homepage is out of scope for this review. A11Y-11 (homepage contrast) was dropped, and the homepage parts of A11Y-09 and A11Y-17 are kept only as notes. IDs are not renumbered, so cross-references stay valid.

## Summary

| ID | WCAG SC | Severity | Page | Title |
|---|---|---|---|---|
| A11Y-01 | 1.1.1, 1.3.1 | blocker | result (expanded card), comparison | Candidate and user answer marks (✓/✗/–) have no text alternative; screen readers get none of the comparison |
| A11Y-02 | 1.4.10, 1.4.4 | blocker | question | At 320×256 (400 % zoom) the question text collapses to 0 px and the step row overlaps the answer buttons |
| A11Y-03 | 2.4.3, 2.1.1, 4.1.2 | major | result → share modal | Share modal: focus doesn't move in, isn't trapped, Escape doesn't close, focus is lost on close, and the dialog is unnamed |
| A11Y-04 | 1.4.11 | major | all (every DS `Button`/`ToggleButton`) | Focus ring is primary at 55 % alpha: 2.17–2.26:1 against the page, below 3:1 |
| A11Y-05 | 4.1.3, 2.4.3 | major | intro → … → comparison | Route changes announce nothing; focus drops to `<body>`, or stays on "Ano" while the question changes underneath |
| A11Y-06 | 2.4.2 | major | intro, guide, 40 questions, review, result, comparison | Every calculator route has the same `<title>` |
| A11Y-07 | 2.1.1 (UX; Space works) | major | question, review | Enter does nothing on ★ / Ano / Ne (Headless `Switch`); only Space works |
| A11Y-08 | 1.4.10 | major | comparison (mobile) | At 390 px the whole document is 1351 px wide, and the header's close button sits off-screen at x = 1293 |
| A11Y-09 | 4.1.2, 2.4.3 | major | result (donate card) | `<a>` wraps `<button>`: invalid nesting, two Tab stops per CTA, read as "link" plus "button" |
| A11Y-10 | 1.4.3 | major | question | Step counter "/40" in `text-subtle` is 2.81:1 |
| A11Y-12 | 1.4.3 | minor | district picker | District number badges (`text-muted` on `surface-sunken`) are 4.34:1 |
| A11Y-13 | 1.4.3 | minor | result (donate card) | "Podpořit Volební kalkulačku" (primary on `#f1f5f9`) is 4.15:1 |
| A11Y-14 | 1.4.3 (exemption arguable) | minor | district picker | "Připravujeme" rows are 3.12:1 (name) and 3.95:1 (status) |
| A11Y-15 | 4.1.2, 1.3.1 | minor | question, review | Ano/Ne are `role="switch"` (on/off), not a choice; review exposes 40× identical "Ano"/"Ne"/"Pro mě důležité" |
| A11Y-16 | 1.1.1 / 4.1.2 (axe `aria-progressbar-name`) | minor | result | Match-card progress bars have no accessible name |
| A11Y-17 | 1.3.1, 2.4.1, 2.4.6 | minor | calculator flow | Heading structure: site name is the only `h1`, page titles are `h3`, no skip link |
| A11Y-18 | 2.1.1 (discoverability) | minor | district picker | Roving tabindex on plain links: Tab reaches 1 of 18 enabled districts, and nothing tells you arrows work |
| A11Y-19 | 2.4.7, 1.3.1 | minor | result (lists/people switch), comparison (party filter) | `sr-only` radio and checkbox inputs with no focus style on their labels and no group label (unverified: code only) |

Severity: **blocker**, a group of users can't complete or understand the core task. **major**, a WCAG AA failure or serious friction on a main path. **minor**, a narrow failure, a near-miss, or best practice.

## Findings

### A11Y-01 · blocker — Answer marks in the result card and the comparison have no text alternative
- **Where:** result → expanded match card ("Já • Kandidát" list); the comparison page grid. All viewports. Shared code.
- **Steps:** answer a few questions, open the result, expand a card. Or open `/porovnani`. Inspect the accessibility tree.
- **Expected:** each mark is exposed as text, e.g. "Vy: Ano, kandidát: Ne", or the grid is a real table with header cells.
- **Actual:**
  - Expanded card: each `listitem` exposes only the question `paragraph` (and any quote). The two marks are `IconBadge`s around an `Icon decorative`, with no text.
  - Comparison: the `main` tree is just "Vaše odpovědi Otakar Březina …" as one text run, then "1/40 …" text and an `h3` per question. Not one candidate or user answer is exposed.
  - The agree pill (#656) is shape and colour only.
  - Unanswered candidates show "—" as their percentage, with no explanation.
- **Evidence:** Playwright `ariaSnapshot()` of `main` on `/porovnani` and on the result with all cards expanded (reproduced 2026-10-04).
- **Likely cause:**
  - `packages/app/src/client/components/match-card.tsx:133-134`: `IconBadge` with `<Icon … decorative={true} />` and no label.
  - `packages/app/src/client/components/comparison-grid.tsx:121-126` (`ComparisonAnswerIcon`, decorative icon only), used at `:217` and `:227`/`:237`. The header and rows are `div`s, not table semantics (`:138-174`, `:185-247`).
- **Fix suggestion:**
  - Give `ComparisonAnswerIcon` and the card badges a visually hidden label: "Ano", "Ne", "Neodpověděl/a", plus "Vy:" / "Kandidát:" in the card. Locale keys go in lockstep.
  - Better for the comparison: render it as a `<table>` with `<th scope="col">` per candidate and `<th scope="row">` per question.
  - Give "—" an sr-only "bez odpovědí".
- **Fix scope:** product (`packages/app/src/client/components/**`, `packages/app/src/locales/*.json`).

### A11Y-02 · blocker — Question text disappears at 400 % zoom
- **Where:** `/otazka/N`. Viewport 320×256 CSS px, which equals 1280×1024 at 400 %, the 1.4.10 reflow benchmark. Shared code.
- **Steps:** open question 1 at 320×256.
- **Expected:** the question, the answers and the step row all reachable, scrolling vertically if needed.
- **Actual:**
  - The card's scroll area measures `clientHeight 0` while its `scrollHeight` is 327, so the statement and detail are not visible at all. Only the "Zdanění prázdných bytů" chip shows.
  - The step row (Návod · 1/40 · Přeskočit; `top` 184–224) is drawn over the ★/Ano/Ne row (`top` 173–231).
  - The document doesn't scroll (`scrollHeight 256 = innerHeight`).
  - At 640×400 (200 %) the page scrolls 155 px and everything is reachable, so 200 % passes.
- **Evidence:** `media/A11Y-question-320x256-collapsed.png`
- **Likely cause:** `packages/app/src/components/pages/question.tsx:115`.
  - The column is fixed to `h-[calc(100lvh-5rem)]`, and the card is `min-h-0 flex-1` with the body `overflow-y-auto` (`question-card.tsx:39`, `:63`).
  - When the viewport is shorter than chips + answers + step row, the flex body shrinks to 0. The fixed-height column then lets the next sibling overflow onto the answer row.
  - Same root as F-06 (`lvh`).
- **Fix suggestion:** let the column be `min-h` rather than `h`, so the page can grow and scroll, and give the statement block a minimum (e.g. `min-h-[4lh]`). Check at 320×256, 640×400 and on iPhone (F-06).
- **Fix scope:** product (`packages/app/src/components/**`).

### A11Y-03 · major — Share modal isn't a working dialog for keyboard and screen-reader users
- **Where:** result → "Sdílet". Desktop and mobile. Shared code.
- **Steps:** Tab to "Sdílet", press Enter, then press Tab and Escape.
- **Expected:** focus moves into the dialog (heading or first control), Tab cycles inside it, Escape closes it, focus returns to "Sdílet", and the dialog is named "Sdílet výsledek".
- **Actual:**
  - After Enter, `activeElement` is still "Sdílet", behind the overlay.
  - 12 Tabs walk the background match cards, donate card and next card. Focus never enters the dialog, and it's invisible under the overlay.
  - Escape: the dialog stays open.
  - Closing with "Zavřít" puts focus on `<body>`.
  - The dialog has `role="dialog" aria-modal="true"` but no `aria-labelledby`/`aria-label`. The background isn't `inert`, and body scroll isn't locked (`overflow: visible`).
  - The URL field has no label (axe `label`, critical, 4.1.2).
  - The "Kopírovat" → "Zkopírováno" change is not announced (no live region).
- **Evidence:** `media/A11Y-share-modal-focus-behind.png` (focus on the 2nd card, under the overlay), `media/A11Y-share-modal-open-focus.png`, `media/A11Y-share-modal-close-focus.png`
- **Likely cause:**
  - `packages/app/src/client/components/share-modal.tsx:116-121` hand-rolls the dialog: no focus management, no `keydown` handler, no labelling.
  - The input is at `:138-144`.
  - The design system already ships Headless UI, whose `Dialog` provides all of this.
- **Fix suggestion:** rebuild on Headless `Dialog`/`DialogPanel`/`DialogTitle` (focus trap, Escape, focus return, `inert` background). Add `aria-label` to the input and `aria-live="polite"` to the copy confirmation. F-17's close button gets the DS `Button` at the same time.
- **Fix scope:** product (`packages/app/src/client/components/share-modal.tsx`, `packages/app/src/locales/*.json`).

### A11Y-04 · major — Focus indicator contrast is below 3:1
- **Where:** every design-system `Button` and `ToggleButton` (Zavřít, Pokračovat, ★/Ano/Ne, Návod, Přeskočit, review toggles, Sdílet …). All pages.
- **Steps:** Tab to any button and read the computed `outline`.
- **Expected:** the focus indicator is ≥ 3:1 against adjacent colours (1.4.11; see also 2.4.13 at AAA).
- **Actual:**
  - The outline is `3px solid oklab(0.574 -0.044 -0.211 / 0.55)`, offset 2px, which composites to `#70AEF8`.
  - Contrast: 2.26:1 on white, 2.21:1 on the page backdrop `#f8fafc`, 2.17:1 on `surface-sunken` `#f1f5f9`.
  - Links and the match card fall back to the UA ring (`auto 1px`); see F-22.
- **Evidence:** `media/A11Y-question-ano-focus.png`, `media/A11Y-home-nested-link-focus-2.png`
- **Likely cause:** `packages/design-system/src/components/client/button.tsx:32` uses `ko:data-focus:outline-focus/55`; the `--color-focus` token is at `packages/design-system/src/styles.css:192`.
- **Fix suggestion:** drop the `/55` alpha. Solid `focus` (≈ `#0070f4`) is ≈ 4.5:1 on white. Or use a 2-colour ring (white inner + primary outer) so it also works on primary fills.
- **Fix scope:** product (design system).

### A11Y-05 · major — Navigating between screens announces nothing; focus is dropped or left in place
- **Where:** the whole flow, keyboard and screen reader. Shared code.
- **Steps:** use the keyboard to go intro → guide → question 1 → answer → … → review → result → comparison. After each step, read `document.activeElement` and the text of Next's `next-route-announcer` (`role="alert" aria-live="assertive"`).
- **Expected:** after a screen change, the new screen's heading is focused or announced. After an answer, the new question (and "2 ze 40") is announced.
- **Actual:**
  - Pokračovat, Začít odpovídat, Přeskočit on question 40, Zobrazit výsledky and Porovnat: focus lands on `<body>` and the announcer text is `""` every time.
  - Answering (Space on "Ano"): URL `/otazka/1` → `/otazka/2`, focus stays on the new question's "Ano" (`aria-checked=false`), and the announcer is `""`. A screen-reader user hears nothing about the question changing.
  - Next's announcer only speaks when `document.title` changes, and it never does (A11Y-06).
  - The progress bar is `aria-hidden` (`decorative`). "1/40" is plain text and is never announced.
  - Result load: no live region and no focus move.
- **Evidence:** scripted trace (focus, title and announcer per step), reproduced 2026-10-04.
- **Likely cause:**
  - No focus management in the page components: `packages/app/src/components/pages/{introduction,guide,question,review,result,comparison}.tsx`.
  - Question re-render keeps focus on the same `ToggleButton` instance (`question-card.tsx:76-83`).
  - `SteppedProgressBar decorative` at `pages/question.tsx:122`.
- **Fix suggestion:**
  - On mount, focus each page's main heading (`tabIndex={-1}`, see A11Y-17).
  - On the question screen, move focus to the statement heading after an answer, or add a polite live region with "Otázka 2 ze 40: …".
  - Fixing A11Y-06 also makes Next's announcer work.
- **Fix scope:** product (pages and cards in `packages/app/src/components/**`). Titles are platform (A11Y-06).

### A11Y-06 · major — Page titles don't change between screens
- **Where:** every calculator route.
- **Steps:** read `document.title` on each screen.
- **Expected:** a title per screen purpose, e.g. "Otázka 3 ze 40 – Senátní volby 2026: obvod 81 – Volební kalkulačka", "Výsledek – …".
- **Actual:** intro, guide, `/otazka/1…40`, review, result and comparison all report "Senátní volby 2026: obvod 81 – Uherské Hradiště — Volební kalkulačka". The picker ("Volby do Senátu Parlamentu ČR 2026 — …") and the homepage ("Volební kalkulačka") do differ.
- **Evidence:** `title` field per page in the scripted runs (desktop and mobile).
- **Likely cause:**
  - `packages/next/src/metadata/calculator.ts:70`: `title: calculator.title || calculator.shortTitle` for every page.
  - Each `(app)` route's `generateMetadata` (e.g. `apps/www.volebnikalkulacka.cz/app/[locale]/(web)/(app)/(two-segments)/[first]/[second]/(calculator)/review/page.tsx:9-15`) passes no page name.
- **Fix suggestion:**
  - Add a `page` parameter to `generateCalculatorMetadata` (introduction, guide, question n/total, review, result, comparison) and prefix the title.
  - Question pages render client-side between numbers, so also set `document.title` from the question page component, or rely on the Next metadata per `[questionNumber]` route.
- **Fix scope:** platform (`packages/next`, the `(app)` route trees in CZ/SK/MK).

### A11Y-07 · major — Enter doesn't activate ★ / Ano / Ne
- **Where:** question screen and review (all three toggles). Shared code.
- **Steps:** Tab to "Ano" on `/otazka/10` and press Enter. Then press Space.
- **Expected:** they look and act like buttons, so both Enter and Space activate them.
- **Actual:**
  - Enter: URL stays `/otazka/10`, `aria-checked` stays `false`, nothing happens.
  - Space: the answer is recorded and the page goes to `/otazka/11`.
  - Not a strict 2.1.1 failure (Space works, and the APG switch pattern only requires Space). But Enter is what most keyboard users press on the app's primary control, and it fails silently.
- **Evidence:** scripted keyboard run (log), reproduced in Chromium 2026-10-04.
- **Likely cause:** `packages/design-system/src/components/client/toggleButton.tsx:21` renders Headless UI `Switch as={Button}`. Headless `Switch` toggles on Space and treats Enter as "submit the enclosing form".
- **Fix suggestion:** handle Enter in `ToggleButton` (`onKeyDown` Enter → toggle), or stop using `Switch` for these and use a plain `<button aria-pressed>` (see A11Y-15).
- **Fix scope:** product (design system).

### A11Y-08 · major — Comparison page overflows horizontally on phones and hides the close button
- **Where:** `/porovnani`, 390×844 and 320×640. Known layout gap F-10. This finding is the reflow effect.
- **Steps:** open the comparison on a phone-width viewport.
- **Expected:** a 2-D scrolling grid is allowed (1.4.10 exception), but only inside its own scroll container. The page, header and close button stay within the viewport.
- **Actual:**
  - `documentElement.scrollWidth` is 1351 at a 390 viewport and 1280 at 320. The header itself is stretched to that width.
  - "Zavřít" sits at x = 1293 (390 viewport) and is only reachable by scrolling the whole page sideways.
  - At 640×400 (200 %) the document is 1556 wide.
- **Evidence:** `media/A11Y-comparison-390-close-offscreen.png`
- **Likely cause:** `packages/app/src/client/components/comparison-grid.tsx:190` (`koa:w-max` rows) and `:278-295` (no `overflow-x-auto` wrapper). The grid widens the page instead of scrolling inside itself.
- **Fix suggestion:** wrap the grid in an `overflow-x-auto` region (with `tabIndex={0}`, `role="region"` and `aria-label` so keyboard users can scroll it), keep the header and back/close outside it. Ideally fold this into the F-10 redesign.
- **Fix scope:** product.

### A11Y-09 · major — Donate CTA nests a `<button>` inside an `<a>`
- **Where:** result donate card ("Podpořit Volební kalkulačku"). The homepage CTAs have the same pattern, but the homepage is out of scope for this review (see the note at the top).
- **Steps:** Tab from the top of the homepage.
- **Expected:** one focusable link per CTA.
- **Actual:**
  - Each CTA takes two Tab stops: first `<a>` with a UA `auto 1px` ring around the pill, then `<button>` with the DS ring. Desktop Tab log: stops 1–6 and 9–14 are pairs, 23 stops in total.
  - Interactive content inside `<a>` is invalid HTML, and screen readers announce both a link and a button. Activating the inner button relies on the click bubbling to the link.
- **Evidence:** `media/A11Y-home-nested-link-focus-1.png` (link), `media/A11Y-home-nested-link-focus-2.png` (button), `media/A11Y-tab-order-desktop.txt`
- **Likely cause:**
  - `apps/www.volebnikalkulacka.cz/app/[locale]/(web)/(content)/campaign.tsx:84-90`
  - `…/(content)/page.tsx:42-43`, `:63-64`, `:80-81`
  - `apps/www.volebnikalkulacka.cz/components/client/donate-card.tsx:76-77`
  - `Button` has no `asChild`/`as` link mode.
- **Fix suggestion:** style the `Link` itself with the button classes, or add an `as`/`href` mode to DS `Button` that renders an `<a>`. Check whether SK/MK donate cards copied the same pattern.
- **Fix scope:** product (content pages, donate-card, design system `Button`).

### A11Y-10 · major — Step counter "/40" fails contrast
- **Where:** question screen step row. All viewports.
- **Expected:** ≥ 4.5:1 (14–17 px regular).
- **Actual:**
  - "/40" is `text-subtle` `#8698B2` on the page backdrop `#F8FAFC`: **2.81:1**. On white it would be 2.94:1.
  - The bold current number uses `text-strong` and passes.
  - `text-subtle` is defined as `text-muted` + 0.12 L, so it can never pass on light surfaces. Its only use is this counter.
- **Evidence:** `media/A11Y-question-counter-contrast.png`
- **Likely cause:** `packages/app/src/components/question-navigation-card.tsx:41`; token at `packages/design-system/src/styles.css:183`.
- **Fix suggestion:** use `text-muted` for the counter (4.55:1 on the backdrop). Raise or retire `text-subtle` for text use.
- **Fix scope:** product.

### A11Y-12 · minor — District number badges at 4.34:1
- **Where:** Senate district picker, the "Obvod NN" badge on every row. axe `color-contrast`: 15 nodes on load, and every row on scroll.
- **Actual:** `text-muted` `#63748D` on `surface-sunken` `#F1F5F9`, 14 px/500: **4.34:1**. For reference, `text-muted` is 4.76:1 on white and 4.55:1 on the backdrop `#F8FAFC`; both pass by a thin margin.
- **Evidence:** `media/A11Y-picker-badge-contrast.png`; axe output.
- **Likely cause:** `packages/app/src/client/components/district-picker.tsx:119`
- **Fix suggestion:** use `text` (or `text-strong`) inside the sunken badge, or darken `text-muted` by about 0.03 L so it passes on all three light surfaces.
- **Fix scope:** product.

### A11Y-13 · minor — Donate CTA text at 4.15:1
- **Where:** result, donate card, "Podpořit Volební kalkulačku" (outline/primary). axe `color-contrast`, 1 node.
- **Actual:** `#0070F4` on the card's `#F1F5F9`, 17 px/600 (not "large"): **4.15:1**. The same colour on white would be 4.54:1.
- **Evidence:** `media/A11Y-donate-button-contrast.png`
- **Likely cause:** `apps/www.volebnikalkulacka.cz/components/client/donate-card.tsx:77` (outline primary `Button` on a sunken card).
- **Fix suggestion:** a white card background, or the filled primary variant (white on `#0070F4` is 4.54:1).
- **Fix scope:** product.

### A11Y-14 · minor — "Připravujeme" rows in the picker are low contrast
- **Where:** Senate district picker, 9 disabled rows (e.g. Obvod 33 Děčín).
- **Actual:** the background was sampled from pixels as `#E2EBF9` (semi-transparent `neutral-disabled/55` over the page gradient).
  - District name: `neutral/60` → **3.12:1**.
  - "Připravujeme": `neutral/70` → **3.95:1**.
  - 1.4.3 exempts "inactive UI components". These rows aren't controls (`div aria-disabled` with no role, so `aria-disabled` isn't exposed), and "Připravujeme" is real information. Treat as a near-miss rather than a clear failure.
- **Evidence:** `media/A11Y-picker-disabled-row.png`
- **Likely cause:** `packages/design-system/src/components/client/optionList.tsx:110` (row background), `:129` (`text-neutral/70`), `:176` (`text-neutral/60`)
- **Fix suggestion:** keep the muted look but bring the name and status to ≥ 4.5:1 (e.g. `text-muted` on an opaque `surface-sunken`). Drop `aria-disabled` from the role-less `div`.
- **Fix scope:** product (design system).

### A11Y-15 · minor — Answer controls have switch semantics and context-free names
- **Where:** question and review.
- **Actual:**
  - ★ / Ano / Ne are exposed as `switch "Ano"` (`aria-checked`) etc. Ano and Ne are a mutually exclusive choice, but they're announced as two independent on/off switches, with no group tying them to the question.
  - On review, 120 controls are named only "Pro mě důležité", "Ano", "Ne" (40 each). ★ comes before the question heading in DOM order, so tabbing gives "Pro mě důležité, switch" before the question is reached.
  - State is exposed correctly: `aria-checked` matched the answers given (rows 1–6, and ★ on row 3).
- **Evidence:** Tab logs (`media/A11Y-tab-order-desktop.txt`, review section); `ariaSnapshot` of question 1.
- **Likely cause:** `packages/design-system/src/components/client/toggleButton.tsx:21` (Headless `Switch`); `packages/app/src/components/question-card.tsx:72-84`; `packages/app/src/components/review-question-card.tsx:38-56`.
- **Fix suggestion:** wrap Ano/Ne in `role="radiogroup"` (or `role="group"` with `aria-pressed` buttons) labelled by the statement heading (`aria-labelledby`). On review, add `aria-describedby` pointing at the row's `h3`.
- **Fix scope:** product.

### A11Y-16 · minor — Match-card progress bars are unnamed
- **Where:** result, one per card with a percentage. axe `aria-progressbar-name` (serious): 3 nodes on Senate 81, 23 on Sněmovní 2025 expresní/kalkulačka.
- **Actual:** `role="progressbar" aria-valuenow="66.67"` with no name. Screen readers announce "progress bar 67 %" next to the identical "67 %" text in the card button.
- **Likely cause:** `packages/design-system/src/components/server/progressBar.tsx:30-34`, used at `packages/app/src/client/components/match-card.tsx:40`.
- **Fix suggestion:** add a `decorative` prop like `SteppedProgressBar` has (`aria-hidden`), and use it in `MatchCard`. Or accept an `aria-label`.
- **Fix scope:** product.

### A11Y-17 · minor — Heading and landmark structure
- **Actual:**
  - Every calculator page's only `h1` is the 11 px wordmark "Volební kalkulačka" (`app-header.tsx:147`). The calculator name is an `h2` (`:149`).
  - The screen's own title ("Návod", "Rekapitulace", "Výsledek", the question statement) is an `h3`.
  - The homepage has two `h1`s ("Volební kalkulačka", "Komunální a senátní volby 2026") and an empty, hidden `h2` (the header subtitle with no calculator).
  - The homepage has no `<main>` landmark (header and footer only): `(content)/layout.tsx:6` renders `div` + children.
  - No skip link on any page. This is low impact on calculator pages (the header has one button) and moderate on the homepage.
  - `lang="cs"` is correct everywhere.
- **Fix suggestion:**
  - Make the header wordmark a `p` or `div`.
  - Make each screen's title the `h1` (and the focus target for A11Y-05).
  - Don't render the empty `h2`.
  - Wrap content-page children in `<main>`.
- **Fix scope:** product (`packages/app/src/client/components/app-header.tsx`, page components, `(content)` layout).

### A11Y-18 · minor — Picker list: one Tab stop, arrows undiscoverable
- **Where:** Senate district picker.
- **Actual:**
  - Tab goes Zavřít → search → "Obvod 3 Cheb" → end of page (4 stops). The other 17 enabled districts are reachable only with ↑/↓/Home/End. Verified that the arrows work and stop at the ends.
  - The list is a `section` of links (deliberately not `listbox`, per the comment at `optionList.tsx:28-34`), so screen readers give no hint that arrows apply.
  - Search works well: "4 výsledky" / "Nic nenalezeno" are announced via `output aria-live="polite"`, ↓ from the field moves into the list, and Enter opens the highlighted row.
- **Fix suggestion:** either make every row Tab-reachable (a plain list of links; with search, 18 rows is acceptable), or add a visually hidden hint ("Šipkami vyberete obvod") tied to the search field via `aria-describedby`.
- **Fix scope:** product (design system `OptionList`, `district-picker.tsx`).

### A11Y-19 · minor — `sr-only` radio and checkbox inputs with no visible focus (unverified)
- **Where:** result "Kandidátní listiny / Lidé" switch; comparison party filter.
- **Unverified:** I found no calculator on staging that renders either control (Senate 81, Sněmovní 2025 expresní and kalkulačka don't). This is from code only.
- **Code:**
  - `packages/app/src/components/pages/result.tsx:78-91`: radios `koa:sr-only` inside `label`s with no `focus-within` style, and no `fieldset`/`radiogroup` name.
  - `packages/app/src/client/components/comparison-grid.tsx:68-111`: same pattern for checkboxes.
- **Fix suggestion:** add `has-[:focus-visible]:outline-…` to the labels, and wrap each set in `role="radiogroup"`/`fieldset` with a label.
- **Fix scope:** product.

## Evidence for already-known findings

- **F-08** (review toggles): measured on 390×844. All 120 review toggles are **36×36 px**: above the 2.5.8 minimum of 24, below 44. Ano/Ne pitch is 42 px (x 792 → 834 on desktop), a 6 px gap.
- **F-20** (inconsistent tabindex): Chromium Tab log. Headless `Switch` sets an explicit `tabindex="0"` on ★/Ano/Ne, while DS `Button`s (Návod, Přeskočit, Zavřít) have no `tabindex`. Chromium reaches all six in order, so the Safari skip is consistent with the cause given in F-20.
- **F-21** (review Tab count): Chromium needs **123 Tabs** to reach "Zobrazit výsledky": Zavřít, Zpět na otázky, then 3 × 40 toggles. See `media/A11Y-tab-order-desktop.txt`.
- **F-22** (match card cue): the card's `DisclosureButton` gets only the UA `outline: auto 1px`, and the card's `overflow-hidden` clips it to a sliver along the top edge. `aria-expanded` toggles correctly, and `aria-controls` points at the panel once it is open. Evidence: `media/A11Y-result-card-focus.png`.
- **F-03** (highlight vs focus ring): the highlighted row uses `ring-3 ring-primary/55 ring-offset-2` and the focused row uses `outline-2 outline-primary` (`optionList.tsx:108`, `:113`). These render nearly identically. Evidence: `media/A11Y-picker-row-focus.png`.
- **F-17** (share close): hand-rolled `<button>` measuring **24×24 px** (exactly the 2.5.8 minimum), with the UA focus ring. Evidence: `media/A11Y-share-modal-close-focus.png`.

## Checked and passing (or informational)

- **axe:** apart from the items above, intro, guide, question, review and comparison have 0 axe violations at both viewports. The homepage has 0 violations (5 "incomplete" contrast checks over gradients, resolved manually in A11Y-11).
- **Target size (2.5.8), mobile 390:**
  - Nothing is under 24×24.
  - Under 44 (informational): Návod 118×40, Přeskočit 145×40, back pills 40 px tall, Zavřít 40×40, donate amount buttons 104×26, social icons 24×24, review toggles 36×36 (F-08), share close 24×24 (F-17).
  - Footer links are 20 px tall but pass on the spacing exception (28 px pitch).
- **Reflow at 320×640:** no horizontal scroll except the comparison (A11Y-08). The header subtitle `h2` ends 3 px past the edge, but is truncated and doesn't cause a scroll.
- **200 % zoom (640×400):** no horizontal scroll except the comparison, and nothing clipped. The question page needs a 155 px page scroll to reach the answers (acceptable).
- **Text-only enlargement** (root `font-size: 200%`, as with a larger browser default font): the question statement and detail use `clamp(… px …)` and don't scale (detail stayed 16 px). This isn't a 1.4.4 failure, since browser zoom works, but it ignores the user's font-size preference.
- **`prefers-reduced-motion`:** respected. Under emulation the DS motion tokens collapse to 0.01 ms (`styles.css:261-267`), and the question page's longest transition fell from 150 ms to 0.00001 s. Not reduced:
  - the comparison sticky header's `transition-all duration-500` (`comparison-grid.tsx:139`), 500 ms in both modes;
  - the donate card's 150 ms colour transitions (colour only, harmless).
  - No `@keyframes` animations exist anywhere in the flow.
- **Toggle state:** ★/Ano/Ne expose `aria-checked` correctly, and the donate amounts expose `aria-pressed`. Match cards expose `aria-expanded`.
- **Language:** `<html lang="cs">` on every page.
- **Search field:** properly labelled ("Hledat", via `aria-labelledby`), with `aria-controls` pointing at the list and its result count announced politely.
