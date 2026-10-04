# Status

Who is working on what. Edit this file on this branch (`redesign/review-findings-2026-10-04`) and push it **before** you start a fix, then again when the PR opens and when it merges. Docs only here: the fix itself goes in its own PR from `main`.

- **Záměr?** Klára's call for the items in her decision table: `záměr` (intentional, add the reason in Notes) or `chyba` (not intentional, OK to fix). `—` means it's clearly a bug, no decision needed.
- **Status:** `open` → `in progress` → `PR #NNN` → `merged`, or `won't fix` (with a reason).
- **Owner:** a name, or `Kryštof` for platform and data items.

| ID | Type | Title | Severity | Záměr? | Status | Owner | PR / branch | Notes |
|---|---|---|---|---|---|---|---|---|
| F-01 | Bug | Header wordmark text is too small, especially on desktop | major | ? | open |  |  |  |
| F-02 | Bug | Picker description fades to a ghost on scroll | major | — | open |  |  |  |
| F-03 | Bug (design) | Search field and highlighted result both show a focus ring | minor | — | open |  |  |  |
| F-04 | Bug | Short pages scroll on iPhone; the title scrolls away under the header | minor | — | open |  |  |  |
| F-05 | Bug | Bottom button covers the last line of text, even fully scrolled | major | — | open |  |  |  |
| F-06 | Bug | Question screen: step row (back / 1/40 / skip) is hidden below the fold on iPhone | blocker | — | open |  |  |  |
| F-07 | Bug | Question screen: nested scroll inside the card traps the gesture, with no sign the text scrolls | major | — | open |  |  |  |
| F-08 | Bug (a11y) | Review screen: yes/no/star touch targets are ~36px, yes and no only 6px apart | major | ? | open |  |  |  |
| F-09 | Opinion | Result: "Porovnat" sits at the end of the list instead of floating like every other screen's action | minor | ? | open |  |  |  |
| F-10 | Gap | Comparison page still has the pre-2026 layout | major | — | open |  |  |  |
| F-11 | Bug (UX) | Question screen: tapping Ano/Ne gives no "selected" confirmation before the next question replaces it | major | ? | open |  |  |  |
| F-12 | Bug | Desktop: answer buttons and step row move with each question's text length; repeated clicks miss and select text | major | ? | open |  |  |  |
| F-13 | Bug | Desktop: question screen scrolls ~16px for no reason; the progress bar fades under the header | minor | — | open |  |  |  |
| F-14 | Bug | Result: the lists/people switch has lost its track, so it no longer reads as a switch | minor | ? | open |  |  |  |
| F-15 | Bug (data) | Intro heading shows a pre-truncated name: "Obvod 81 – Uherské Hradi…" | major | — | open | Kryštof |  |  |
| F-16 | Opinion (UX) | Back/close navigation is different on every screen of the flow | major | ? | open |  |  |  |
| F-17 | Bug | Share modal close button has almost no hover state | cosmetic | — | open |  |  |  |
| F-18 | Bug | District picker: search field and result rows have different widths | minor | — | open |  |  |  |
| F-19 | Bug (design) | Guide: vertical spacing has no rhythm, and on mobile the cards are inset from the title | minor | ? | open |  |  |  |
| F-20 | Bug (a11y) | Keyboard: in Safari, plain Tab skips Návod/Přeskočit/Zavřít while it stops on ★/Ano/Ne | major | — | open |  |  |  |
| F-21 | Bug (a11y) | Review: reaching "Zobrazit výsledky" by keyboard takes ~120 Tabs | major | — | open |  |  |  |
| F-22 | Bug | Result: the whole match card is clickable (expand) but shows no hover, cursor or focus cue | minor | — | open |  |  |  |
| F-23 | Bug (a11y) | Share modal: Escape doesn't close it and focus isn't moved into it | major | — | open |  |  |  |
| F-24 | Bug (design) | District picker on desktop: title sits at the page edge, description/search/list in a centred column | minor | ? | open |  |  |  |
| F-25 | Opinion | Picker: unavailable ("Připravujeme") districts look *more* prominent than available ones | minor | ? | open |  |  |  |
| F-26 | Gap | Result: donate card is off-grid and still in the old style | minor | ? | open |  |  |  |
| F-28 | Bug (a11y/UX) | Every calculator step has the same document title | minor | — | open | Kryštof |  |  |
| F-30 | Bug | New visitor: 401 console error from `session-data` on the intro | cosmetic | — | open | Kryštof |  |  |
| F-31 | Question | Answers sometimes missing or different after reloading the result in a fresh browser | major if confirmed | — | open | Kryštof |  |  |
| A11Y-01 | A11y | Candidate and user answer marks (✓/✗/–) have no text alternative; screen readers get none of the comparison | blocker | — | open |  |  |  |
| A11Y-02 | A11y | At 320×256 (400 % zoom) the question text collapses to 0 px and the step row overlaps the answer buttons | blocker | — | open |  |  |  |
| A11Y-03 | A11y | Share modal: focus doesn't move in, isn't trapped, Escape doesn't close, focus is lost on close, and the dialog is unnamed | major | — | open |  |  |  |
| A11Y-04 | A11y | Focus ring is primary at 55 % alpha: 2.17–2.26:1 against the page, below 3:1 | major | — | open |  |  |  |
| A11Y-05 | A11y | Route changes announce nothing; focus drops to `<body>`, or stays on "Ano" while the question changes underneath | major | — | open |  |  |  |
| A11Y-06 | A11y | Every calculator route has the same `<title>` | major | — | open | Kryštof |  |  |
| A11Y-07 | A11y | Enter does nothing on ★ / Ano / Ne (Headless `Switch`); only Space works | major | — | open |  |  |  |
| A11Y-08 | A11y | At 390 px the whole document is 1351 px wide, and the header's close button sits off-screen at x = 1293 | major | — | open |  |  |  |
| A11Y-09 | A11y | `<a>` wraps `<button>`: invalid nesting, two Tab stops per CTA, read as "link" plus "button" | major | — | open |  |  |  |
| A11Y-10 | A11y | Step counter "/40" in `text-subtle` is 2.81:1 | major | — | open |  |  |  |
| A11Y-12 | A11y | District number badges (`text-muted` on `surface-sunken`) are 4.34:1 | minor | — | open |  |  |  |
| A11Y-13 | A11y | "Podpořit Volební kalkulačku" (primary on `#f1f5f9`) is 4.15:1 | minor | — | open |  |  |  |
| A11Y-14 | A11y | "Připravujeme" rows are 3.12:1 (name) and 3.95:1 (status) | minor | — | open |  |  |  |
| A11Y-15 | A11y | Ano/Ne are `role="switch"` (on/off), not a choice; review exposes 40× identical "Ano"/"Ne"/"Pro mě důležité" | minor | — | open |  |  |  |
| A11Y-16 | A11y | Match-card progress bars have no accessible name | minor | — | open |  |  |  |
| A11Y-17 | A11y | Heading structure: site name is the only `h1`, page titles are `h3`, no skip link | minor | — | open |  |  |  |
| A11Y-18 | A11y | Roving tabindex on plain links: Tab reaches 1 of 18 enabled districts, and nothing tells you arrows work | minor | — | open |  |  |  |
| A11Y-19 | A11y | `sr-only` radio and checkbox inputs with no focus style on their labels and no group label (unverified: code only) | minor | — | open |  |  |  |
