# New UI port — roadmap

Goal: give every calculator instance the user experience of the 2026 prototype
(`kalkulacka-2026`: screens, visuals, interactions, features) **inside the
existing architecture** of this repository. Nothing about routing, data
loading, sessions, the schema or the result calculation changes. What changes
is what the visitor sees and does between the intro and the share dialog.

This is a port of a *user experience*, not of code. The 2026 repository uses
CSS modules, a token package and a single catch-all route; none of that comes
across. Every piece is re-expressed in the conventions below.

## Where things land

| 2026 concept | Lands in | Convention it follows |
|---|---|---|
| `@vk/tokens` theme contract (surface, text, border, radius, motion, fluid scale, dark mode) | `packages/design-system/src/styles.css` `@theme` + per-app `themes/*.css` | Existing `--ko-palette-*` → derived `--color-*` model; `light-dark()`; `ko:` prefix |
| `@vk/ui` presentational components (~35) | `packages/design-system/src/components/{server,client}` | `cva` variants, `twMerge`, Headless UI for dialog/menu/disclosure, colocated `*.test.tsx`, a story in `apps/design-system.kalkulacka.one/stories` |
| `apps/web/components/*` screens (intro, guide, question flow, recap, results, comparison, dialogs, menu) | `packages/app/src/components/*-page.tsx` and helpers | Props in, callbacks out, no router; strings via next-intl under `koa.components.*` in `src/locales/{cs,sk,mk,en}.json`; `koa:` prefix |
| `@vk/core` insights / recap / answers helpers | `packages/app/src/{insights,recap,answers}` + hooks in `src/client` | Pure functions with hand-computed fixture tests; `result-calculation` untouched |
| Route wiring, session sync, embeds, themes, metadata, analytics | `apps/www.volebnikalkulacka.cz` (then SK, MK) | Existing three-layer pattern: route `page.tsx` → `components/client/pages/calculator/*` wrapper → page component |

Why pages move into `packages/app`: today CZ, SK and MK each carry a drifted
copy of the screen kit (`apps/*/calculator/`). Issues #215–#219 already ask
for the pages to live in the package; this port does exactly that, so the
three instances share one implementation and a shared change is verified once
per instance rather than re-implemented three times.

## Scope rules (aligned with `docs/agentic/contract.md`)

- **Product scope** (UI only): design-system components, app-package
  components and locales, country-app page wrappers and styles. These PRs are
  verified by automated checks plus a human looking at the running result.
- **Platform scope**: anything under `packages/schema`, `packages/database`,
  `packages/next`, `packages/app/src/{result-calculation,data-fetching}`,
  API routes, CI. The port needs **none** of these; the one PR that adds new
  pure logic (`packages/app/src/insights`, PR 12) is flagged for human code
  review anyway because it computes numbers shown to voters.
- Shared changes (design system, app package) are built for all four apps
  and screenshot-checked on CZ, SK and MK before the PR opens.
- Every PR: one describable intent, roughly 5–15 files, tests colocated,
  stories for new design-system components, `npm run typecheck` →
  `npm run lint:fix` → `npm run test` green, CZ Playwright flow green.

## The stack

PRs are stacked: each branch is based on the previous one and the PR base is
the previous branch. After the owner squash-merges PR *n*, PR *n+1* is rebased
onto `main` and retargeted (a five-minute task; ask Claude for it).

Branch names: `port/NN-slug`. PRs open as **drafts**; a checkpoint's manual
test flips it to ready.

| # | Branch | Title | Package(s) | ~Files | Checkpoint |
|---|---|---|---|---|---|
| 0 | `port/00-roadmap` | Add the new UI port roadmap | docs | 1 | — |
| 1 | `port/01-tokens` | Add surface, text, radius, motion and fluid tokens to the design system | design-system | 3 | — (no visible change; all apps build, screenshots identical) |
| 2 | `port/02-button-icon` | Extend Button and Icon and add IconButton | design-system | 8 | — |
| 3 | `port/03-primitives` | Add Chip, Tag, AnswerMark and VisuallyHidden | design-system | 12 | — |
| 4 | `port/04-shell` | Add AppHeader, Screen, StickyBar, EdgeFade and Backdrop | design-system | 14 | — |
| 5 | `port/05-intro-page` | Add the introduction page to the app package and use it in the Czech app | design-system (TutorialStep), app, CZ | 12 | **C1** intro screen |
| 6 | `port/06-question-card` | Add the question card to the design system | design-system | 4 | — |
| 7 | `port/07-question-deck` | Add the swipeable question deck with drag guides and progress segments | design-system | 10 | **C2** deck in Storybook (desktop + touch) |
| 8 | `port/08-flow-nav` | Add FlowNav and KeyboardHints | design-system | 6 | — |
| 9 | `port/09-question-page` | Add the question page with deck, navigation and keyboard shortcuts | app, CZ | 10 | **C3** question flow (the core interaction) |
| 10 | `port/10-guide-page` | Add the guide page with practice deck | app, CZ | 8 | **C4** guide |
| 11 | `port/11-dialog-filters` | Add Dialog, FilterChips, RecapRow and QuestionDialog | design-system | 12 | — |
| 12 | `port/12-insights` | Add answer insights, recap grouping and answer helpers | app (pure logic) | 10 | — (flag: human code review) |
| 13 | `port/13-review-page` | Add the review page with filters and question dialog | app, CZ | 8 | **C5** recap |
| 14 | `port/14-result-primitives` | Add Meter, MatchRow, AvatarStack, Donut and Calculating | design-system | 16 | — |
| 15 | `port/15-result-page` | Add the result page with ranking and insights dashboard | app, CZ | 12 | **C6** results |
| 16 | `port/16-comparison-pane` | Add the per-candidate comparison pane on the result page | design-system (ComparisonList), app | 8 | **C7** |
| 17 | `port/17-comparison-page` | Add the answers comparison page | app, CZ | 8 | **C8** |
| 18 | `port/18-menu` | Add the app menu with help, restart, leave and dark mode | design-system (Menu), app, CZ | 14 | **C9** menu + dark mode |
| 19 | `port/19-share` | Add the share dialog with share card export | design-system (ShareCard), app, CZ | 12 | **C10** share |
| 20 | `port/20-public-result` | Render shared results in the new design | app, CZ | 5 | — |
| 21 | `port/21-analytics` | Track calculator flow events in Plausible | CZ | 4 | — |
| 22 | `port/22-sk` | Switch the Slovak app to the shared calculator pages | SK | 15 | **C11** SK full flow |
| 23 | `port/23-mk` | Switch the Macedonian app to the shared calculator pages | MK | 15 | **C12** MK full flow |
| 24 | `port/24-cleanup` | Remove the superseded calculator components | app, CZ, SK, MK | 20 | — |

Deferred, to decide separately: the election picker page (`/volby/<election>`,
a new route), the WebGL backdrop (the CSS gradient ships first), per-partner
surface colours for `alarm` / `prima` / `diky-ze-muzem`, and the Hungarian app
(it has no calculator yet).

## Checkpoints for manual testing

Each checkpoint names the branch to check out. Any later branch in the stack
also contains it.

```bash
git fetch origin && git checkout <branch> && npm install && npm run dev
```

Czech app: http://localhost:3020/volby/snemovni-2025/kalkulacka/uvod.
Reference: the 2026 app at http://localhost:3000 (same URL path).
Storybook: http://localhost:3001.

| Checkpoint | Branch | What to try |
|---|---|---|
| C1 | `port/05-intro-page` | Intro: title, "Odpovíte na 42 otázek…", three facts, "Pokračovat"; returning visitor sees "Pokračovat v odpovídání" + "Začít znovu". Mobile and desktop. |
| C2 | `port/07-question-deck` | Storybook → QuestionDeck: drag left/right/up/down with mouse; touch emulation; arrow keys; re-choosing an answer clears it; reduced motion. |
| C3 | `port/09-question-page` | Question flow on a phone: swipe all four directions, tap buttons, star before answering, "Předchozí"/"Další"/"Přeskočit", URL follows, progress bar, keyboard hints on desktop, `,`/`.` browsing. Last question → recap. |
| C4 | `port/10-guide-page` | Guide: practice card wobble, four gestures with status line, "Přeskočit" button, "Rozumím, začít". |
| C5 | `port/13-review-page` | Recap: tally, filter chips (Vše/Přeskočené/Důležité/topics), row opens the question dialog, star toggles inline, header collapses on scroll (mobile), "Zobrazit výsledky" disabled with no answers. |
| C6 | `port/15-result-page` | Results: 1.7 s calculating beat, ranking with top-edge bars, "Zobrazit další strany", dashboard cards (donut, topics, important, against the grain, AI prompt copy). Two panes on desktop. |
| C7 | `port/16-comparison-pane` | Tap a party: bottom sheet on mobile (drag down to dismiss), right column on desktop; Escape returns focus to the row; filters Vše/Shody/Neshody/Důležité. |
| C8 | `port/17-comparison-page` | "Porovnat odpovědi": all questions, avatar stacks, expand a row, topic filter deep-links from the dashboard. |
| C9 | `port/18-menu` | Menu: help dialog, dark mode toggle (persists, follows OS when unset), restart dialog, leave dialog; embed drops "Opustit". |
| C10 | `port/19-share` | Share: preview, four themes, two formats, copy link / copy image / download; share sheet on a phone. |
| C11 / C12 | `port/22-sk`, `port/23-mk` | Full flow on localhost:3030 / :3050. |

## Verification per PR (automated, before the PR opens)

1. `npm run typecheck`, `npm run lint:fix`, `npm run test` (in this order).
2. `npx turbo run build` for every app a shared package change can affect.
3. CZ Playwright flow (`npm run e2e --workspace www.volebnikalkulacka.cz`).
4. Screenshots of the affected screen (desktop 1280 px, mobile 375 px) next
   to the same screen of the 2026 reference app.
