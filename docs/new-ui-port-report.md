# New UI port: what happened, in detail

Written 12 September 2026 for Kryštof, after the overnight session that produced draft PRs #510 to #538. It complements the roadmap in `docs/new-ui-port.md` (PR #510) and the shorter artifact page; this is the long version, including what went wrong and what is still open.

## 1. In one paragraph

Klára asked for the UX/UI of her `kalkulacka-2026` prototype (screens, visuals, interactions, features) to be delivered inside this repository's architecture, as small stacked PRs you can review, with checkpoints for her manual testing, running overnight. Four approaches were weighed; the chosen one re-expresses the prototype in the `ko:` design system and the `packages/app` page layer, keeps every layer below the screens untouched, and treats the 2026 design as the source of truth for the design system. 26 draft PRs were opened between 21:28 and 07:56, each stacked on the previous one, each with typecheck, lint, tests and the app builds green, and every visible checkpoint compared against the running 2026 app with screenshots. The final state is a net change of 429 files, +34,249 / −6,896 lines against the base commit `7dfc001`. This morning a check of the partner embeds found and fixed one token bug (rebased locally, not yet pushed), a look at main found your engine-layer extraction series running into the same files, and a merge strategy is recommended below.

## 2. The request and how the approach was chosen

The initial ask was to "port the frontend of `../kalkulacka-2026` onto the existing architecture in reasonably small PRs". Klára clarified that she wants parity of experience, not a code transplant, and asked what should be kept, what ported, and whether anything is lost by staying on last year's decisions. Four paths were laid out, with the sacrifices of each stated plainly:

| Path | What it is | What it gives up |
|---|---|---|
| 1. Re-express in the `ko:` design system | Every 2026 component rebuilt with `cva` + `ko:` utilities, pages in `packages/app`, pure logic copied with its tests | Two to three times the work of a copy; every translation risks drift (mitigated by porting the tests); the typed `defineTheme` contract becomes CSS-variable conventions |
| 2. Hybrid with CSS modules for the deck, share card and backdrop | Verbatim CSS for the motion-heavy parts | A permanent exception to the repo's styling rule, a design-system build change, two styling systems in review |
| 3. Restyle the existing screens | Keep the old screen kit and reskin | Parity; the layout model differs enough that the screens get rewritten anyway |
| 4. Adopt the 2026 app as the frontend | The 2026 app serves the calculator, possibly via Next.js multi-zones | The existing architecture: per-route files, the design system and Storybook, next-intl, homepage and content pages, the multi-country setup; SK, MK, HU would be rebuilt |

The unbiased recommendation was path 1 with one refinement: motion choreography and multi-property rules live in `styles.css` under `@layer components` with `ko-*` class names, not as hundreds of arbitrary utilities and not as CSS modules. The deciding question, which only the two of you can answer, was named: is the 2026 repository meant to become the platform's frontend, or was it a prototype to specify the experience? Klára's answer was that you want the port, so the port continued, and the intro plus question flow (checkpoints C1 and C3) were declared the pilot, with an explicit decision point at C3 before investing in results, comparison and share. At C3 she said "let's see if it works" and the stack ran to completion.

Two other things she decided early and that shaped the work:

- She is the design owner. The 2026 design is the source of truth for visuals; existing design-system components are restyled to it, old variant names survive only as `@deprecated` aliases until the cleanup PR, and Storybook shows the new design with real copy. The Czech palette moves to the 2026 values.
- The per-country apps keep their own wrappers ("democratic" duplication: each national team can change theirs). The homepage is out of scope and will be rewritten later.

## 3. Ground rules the port followed

- **Kept exactly as it is:** routing and localized rewrites, data loading and guards, the schema, the database, the session API routes, cookie and bearer handling, autosave, embeds, theme selection, metadata, the analytics script, the homepage and content pages, CI. In `packages/app`: the zustand stores, view models, hooks and the result calculation (the 2026 algorithm is identical, so nothing to port there).
- **Restyled, not extended:** Button, Card, Avatar, ProgressBar, Input and the rest take the 2026 look in the PR that needs them.
- **Copied with light adaptation (pure TypeScript):** swipe physics, gesture hook, drag-to-dismiss, pointer-kind detection, insights, recap grouping, answer helpers, party colour, topic-icon rules, the AI prompt builder, colour mode, share mode, clipboard, the share-card export pipeline, icon paths, strings, analytics event names, and their Testing-Library tests.
- **Rebuilt in the design system:** everything with no counterpart here (dialog, menu, question card and deck, filter chips, sticky bar, flow nav, keyboard hints, edge fade, backdrop, calculating animation, match row, avatar stack, donut, comparison list, share card, app header, shell).
- **Three-layer page pattern preserved:** route `page.tsx` → `components/client/pages/calculator/*` wrapper in the app → page component in `packages/app` (props in, callbacks out, no router).
- **Scope per your draft `docs/agentic/contract.md`:** everything is product scope except two items flagged for human code review: #525 (insights logic that computes numbers shown to voters) and the image proxy route inside #533 (a new API route).
- **Attribution:** every ported file cites its 2026 source path in its header and keeps the rationale comments. PR bodies list the sources.
- **Per PR, before opening:** `npm run typecheck` → `npm run lint:fix` → `npm run test`, `turbo run build` for every affected app, the Czech Playwright flow, and screenshots (1280 px and 375 px) next to the same screen of the 2026 app.

## 4. What was built, PR by PR

All PRs are drafts. Each PR's base is the previous branch. Sizes are GitHub's additions/deletions.

| PR | Branch | What it does | Size | Checkpoint |
|---|---|---|---|---|
| #510 | `port/00-roadmap` | `docs/new-ui-port.md`: the plan, reuse rules, design authority, scope rules, the stack, checkpoints | +184 | |
| #511 | `port/01-tokens` | Token layer in `styles.css`: page / surface / sunken / text / muted / border / focus with light and dark defaults derived from the neutral; agree / disagree aliasing primary / secondary with hover, active, soft, wash and on-colour variants; radii (card with the square top-left corner, control, chip, pill); durations and easings; shadows; a fluid spacing and type scale; breakpoints `xs` 34 rem, `desk` 53.75 rem, `wide` 56 rem | +312 | |
| #513 | `port/02a-twmerge` | Bug fix in the existing platform: `tailwind-merge` was configured with `prefix: "ko:"` but v3 expects `"ko"`, so no class ever merged and every `className` override relied on cascade order. Own PR because it changes merging for every component | +35 −3 | |
| #514 | `port/02-button-icon` | Button restyled (`solid`, `ghost`, `surface`, `plate`; aliases `fill` / `outline` / `link` kept, `@deprecated`), Icon extended (45 icons), IconButton added | +1,223 −191 | |
| #515 | `port/03-primitives` | Chip, Tag, AnswerMark, VisuallyHidden | +660 | |
| #516 | `port/04-shell` | AppHeader, Shell (pinned vs document scroll mode via `data-ko-scroll` on `<html>`), Screen, StickyBar, EdgeFade, Backdrop (CSS gradient) | +1,976 −6 | |
| #517 | `port/04a-palette` | Czech theme moves to the 2026 palette: agree `#2563eb`, disagree `#dc2626`, dark counterparts capped for 4.5:1 with white ink, explicit surfaces for both modes. Visible on all Czech screens including the logo | +37 −3 | |
| #518 | `port/05-intro-page` | IntroductionPage in `packages/app`, TutorialStep, answer helpers, Czech wrapper rewired, `config/calculator-names.ts` | +842 −11 | C1 |
| #519 | `port/06-question-card` | QuestionCard with the prototype's geometry and states; Card gains `corner="card"` | +919 −2 | |
| #520 | `port/07-question-deck` | QuestionDeck with the swipe physics verbatim (and its tests), ghost card fly-out, two-step hold on changed answers, reduced-motion rules, live region, arrow keys; DragGuides; ProgressSegments | +2,428 | C2 (Storybook) |
| #521 | `port/08-flow-nav` | FlowNav and KeyboardHints | +667 | |
| #522 | `port/09-question-page` | QuestionPage: deck, nav strip, keyboard shortcuts, `history.replaceState` so answering never grows history; Czech wrapper rewired | +1,054 −56 | C3, the decision point |
| #523 | `port/10-guide-page` | GuidePage with a real practice deck, the compass guides, the wobble, "Rozumím, začít"; GuideSteps shared with the help dialog | +1,075 −36 | C4 |
| #524 | `port/11-dialog-filters` | Dialog on a native `<dialog>` (focus trap and top layer from the browser), FilterChips, RecapRow, QuestionDialog. One real bug found in the browser and fixed with a regression test (a queued native `close` could shut a reopened dialog) | +2,440 | |
| #525 | `port/12-insights` | Pure logic: answer distribution, topic matches, answer groups, recap grouping, answer helpers. Reuses the scoring primitives in `result-calculation` without modifying them. **Flagged for code review** | +1,357 −8 | |
| #526 | `port/13-review-page` | ReviewPage ("Rekapitulace"): tally, filter chips, rows with marks and stars, the question dialog, collapsing header on phones | +1,087 −22 | C5 |
| #527 | `port/14-result-primitives` | ProgressBar restyled to the Meter (aliases kept), Avatar restyled (legacy props kept), AvatarStack, Donut, MatchRow, Calculating, `partyColor` | +2,746 −213 | |
| #529 | `port/15-result-page` | ResultPage ("Moje shoda") with the calculating beat, ranking, "Zobrazit další strany", the dashboard (donut, topics, important, against the grain, AI prompt). Keeps two platform features the prototype lacked: the expert-answers note and the "Kandidátní listiny / Lidé" switch. Also fixes `useCandidatesAnswers`, which dropped candidate answers without a respondent | +2,548 −19 | C6 |
| #530 | `port/16-comparison-pane` | ComparisonPane (bottom sheet with drag-to-dismiss on phones, right column on desktop), ComparisonList, `useDragDismiss` | +1,880 −42 | C7 |
| #531 | `port/17-comparison-page` | ComparisonPage ("Porovnání odpovědí") with collapsible question cards, avatar stacks, topic and important filters in the URL (`?filtr=`) | +1,329 −31 | C8 |
| #532 | `port/18-menu` | Menu (hand-rolled popover with the full keyboard and focus contract), AppMenu with help, dark mode, restart, leave; colour-mode bootstrap in the layouts; `[data-mode]` rules; partner themes pinned to `color-scheme: light` | +2,138 −174 | C9 |
| #533 | `port/19-share` | Share card at story and landscape sizes in four themes, export via `html-to-image` (new design-system dependency), ShareDialog with copy link / copy image / download / OS share sheet; a hardened image proxy route `app/api/assets/[...path]` for cross-origin logos. **Proxy route flagged for code review** | +3,164 −346 | C10 |
| #534 | `port/20-public-result` | Shared results (`…/vysledek/<publicId>`) render read-only in the new design; the stored ranking is replayed, never recomputed | +398 −105 | |
| #535 | `port/21-analytics` | Four Plausible events: Calculator started, Calculator completed, Comparison viewed, Result shared | +332 −13 | |
| #536 | `port/22-sk` | Slovak app on the shared pages with its own wiring, EUR donate card, `?filtr=dolezite`, Playwright flow, menu and share specs | +1,953 −332 | C11 |
| #537 | `port/23-mk` | Macedonian app on the shared pages; Cyrillic topics get no deep link (the slug helper is Latin-only and now returns `undefined` honestly); a no-op analytics helper | +1,916 −247 | C12 |
| #538 | `port/24-cleanup` | Removes the old screen kit in `packages/app` and each app's `calculator/` directory, the deprecated Button aliases and the legacy ProgressBar props, and adds the Delivered and Deferred sections to the roadmap. Every removal grep-verified first | +106 −5,597 | |

Test counts at the tip: design system 457 tests in 51 files, app package 438 in 30, each country app 25 in 5. CI (lint, build, test, Playwright) is green on every branch as pushed, including the final one.

## 5. How the work was run

- Planning and review were done in the main session. From PR 3 onward, implementation was delegated to sub-agents against written specs (one spec file per PR, in the session scratchpad). Each agent's diff was reviewed, the checks re-run, and deviations corrected before the PR opened. No model beyond the default was needed.
- A separate git worktree (`~/Code/kalkulacka-preview`, own `node_modules`) always sat at the last verified commit, so Klára's preview URLs never moved under her while the next PR was being built. It serves Czech on :3021, Slovak on :3031, Macedonian on :3051; the 2026 reference ran on :3000 and Storybook on :3001.
- Every checkpoint was reported with side-by-side PNGs (port vs 2026, desktop and phone) sent into the conversation, so she could judge from a phone.

## 6. What went wrong and how it was handled

Recorded so you know what to look at with extra care.

- **Tailwind 4 prefix quirks.** Theme variables are emitted with the prefix (`--ko-color-page`), so cross-references must use `var(--ko-…)`; a self-referencing hook double-prefixed to `--ko-ko-*`. Hooks were renamed and plain custom properties moved to the top `:root`. This is why the token layer looks the way it does.
- **twMerge never merged** (#513). Found while extending Button; class lists in a few existing components were reordered so the merged output keeps what the cascade rendered before.
- **Stale package CSS in dev servers.** Next 16's persistent Turbopack cache served old design-system CSS after token changes; the fix was clearing `.next` and restarting, and running `next start` for the checkpoint servers.
- **A `set -e` pipeline masked failing tests in three PRs** (a `ko:text-sm` assertion in KeyboardHints, a `region("Delta")` query in the comparison pane, a preview test in share). The commits were fixed and force-pushed with the chain rebased. Worth a second look in review: #521, #530, #533.
- **Sub-agent inventions corrected before opening:** a FlowNav pulse the prototype does not have; QuestionDialog skipping on first tap instead of only after re-tapping; the comparison pane heading showing the short name instead of the full one; share card names; several Slovak strings; the AI prompt repeating the calculator name. The Slovak and Macedonian strings in `packages/app` are machine-translated and corrected where possible; they need a native read.
- **Data gaps resolved per app rather than in the package:** calculator names come from a per-app config (`config/calculator-names.ts`), standalone calculators get no election line in the header, Cyrillic topics get no slug.
- **Process:** a `cd` into a package once leaked into later commands; stray `package-lock.json` / `next-env.d.ts` edits were restored before every commit; the preview worktree had to be detached before rebasing its branch.

## 7. This morning's findings

### 7.1 Partner embeds

Alarm, Prima and Díky, že můžem only set primary, secondary and neutral; the port derives every other token from those. Prima and Díky, že můžem render correctly. Alarm's neutral is pure black, which has no hue, and the derived surface and text tokens used a fixed chroma at hue 0, so the whole embed's text rendered maroon. Fixed in #511 by capping the derived chroma at the neutral's own (`min(c, …)` on eleven tokens): black now yields grey, the default slate palette is unchanged within 0.002 chroma, Prima's grey becomes slightly more neutral. The chain was rebased and the checks are green, but the force-push of the 26 branches was blocked by the session's permission classifier, so as of that morning GitHub still had the old commits, pending this push:

```
git push --force-with-lease origin port/01-tokens port/02a-twmerge port/02-button-icon port/03-primitives port/04-shell port/04a-palette port/05-intro-page port/06-question-card port/07-question-deck port/08-flow-nav port/09-question-page port/10-guide-page port/11-dialog-filters port/12-insights port/13-review-page port/14-result-primitives port/15-result-page port/16-comparison-pane port/17-comparison-page port/18-menu port/19-share port/20-public-result port/21-analytics port/22-sk port/23-mk port/24-cleanup
```

Local tips after the rebase: `port/01-tokens` = `f7315cd`, `port/24-cleanup` = `826ecdd` (remote still `085f85f`).

Two one-liners from Klára's 2026 theme files are not applied yet and are hers to call: Alarm's focus ring black (neon green vanishes on white) and Díky, že můžem's disagree red `#e60345` for 4.5:1 with white ink. One deliberate change to know about: the embed footer "Přináší Volební kalkulačka · Soukromí" is gone; the header wordmark carries the attribution link as in 2026, and there is no privacy link in embeds (2026 dropped the privacy clause on purpose, per a comment in its intro component).

### 7.2 Hungarian

`apps/www.voksmonitor.hu` on main is a one-page stub. The real Voksmonitor app is the open fork PR #426 (k-monitor/voksmonitor-fork, 272 files, a copy of the Czech app from November with its own theme, primary `#0c7c59`). Its theme keeps working under the port. Its pages do not: they use the old screen kit that #538 deletes, so it needs the same wiring the Slovak and Macedonian apps got (seven wrappers, a calculator-names config, a `hu.json` in `packages/app`, topic-icon rules). Order to decide with the Hungarian team: merge their PR first and port it like SK and MK, or land the port first and have them rebase onto the new pages.

### 7.3 Main moved, and the two series collide

Since the stack's base, main gained your engine-layer extraction series: #539 spacer heights, #540 share modal callbacks, #541 SK/MK donate-card slot, #542 `@source` for the app package, #543 session module into `packages/next`, #544 API client into `packages/next`, with #545 (metadata, SEO, analytics) open. A trial merge of `port/24-cleanup` onto main conflicts in 34 files: 14 are delete-versus-modify on files the cleanup removes (old share modals, result pages, navigation cards), about 20 are content conflicts in the CZ/SK/MK wrappers, the three `globals.css` and the Slovak donate card. The port's wrappers also still import `@/lib/api` and `@/lib/session`, which #543 and #544 moved.

The parts merged so far are compatible with the port: it keeps those modules and simply rebases over the moves. The announced next parts, moving the old calculator components into `packages/app`, are the exact code the port replaces and deletes. Whichever lands second redoes its work, so the order needs a decision before either continues.

## 8. Merge recommendation

Facts: Vercel deploys every push to main straight to production for all sites; the repository allows squash merges only; from #514 on the intermediate states are visibly mixed (the Button restyle reaches the homepage, #517 recolours the whole Czech site, from #518 the intro is new while the question page is old).

Recommended: an integration branch.

1. Cut `port/main` from current main. The stack is rebased onto it, the 34 conflicts resolved, the moved imports rewritten, and #510 retargeted to `port/main`.
2. Review and squash-merge the PRs into `port/main` one by one, in order. Vercel builds a preview of `port/main` after every merge; production never sees an intermediate state.
3. When #538 is in, one PR from `port/main` to main. A squash collapses it to a single commit; temporarily allowing merge commits for that one PR keeps the 26 reviewed commits in history.

Not recommended: PR by PR into main (about 24 half states, each auto-deployed) or a feature flag (both UIs would have to coexist, and the design-system restyle is global, so no flag hides it from the homepage).

## 9. Still open

- Klára's manual checks on the checkpoints, then flipping drafts to ready.
- The two code-review items: #525 and the proxy route in #533.
- Rebase onto main or the integration branch (a few hours with the conflict resolution and import rewrites).
- The Deferred list in `docs/new-ui-port.md`: logo-derived party colours (server-side image step; the bars use the seeded palette), the WebGL backdrop, the election picker page, a Unicode-aware topic slug, the avatar initials fallback on a failed image, partner-theme surface colours, nested-candidate answers in the comparison pane, the native SK/MK string review, topic-icon rules per language.
- Three product questions: whether the calculator's own intro and methodology texts from the data should appear on the intro and guide (both pages support it; the Czech app does not pass them yet), whether the server-rendered share image should match the new card, and whether the election picker page is wanted.

## 10. Where things are

- Roadmap and delivered/deferred lists: `docs/new-ui-port.md` on any `port/*` branch (final version in #538).
- PRs: #510 to #538 on GitHub, drafts, bodies list sources and checks.
- Vercel previews of the final branch as pushed (old tip, public): Czech `volebnikalkulacka-bk5vgcpgn-muhu-digital.vercel.app`, Slovak `volebnakalkulacka-4pf95vs2t-muhu-digital.vercel.app`, Macedonian `izborenkalkulator-fz9mc3aeq-muhu-digital.vercel.app`, Storybook `design-systemkalkulacka-i95y29fnf-muhu-digital.vercel.app`.
- Local preview worktree `~/Code/kalkulacka-preview`, detached at `826ecdd`; the `preview-cz` / `preview-sk` / `preview-mk` launch configs in `.claude/launch.json`.
- Per-PR specs, checkpoint screenshots and the embed comparison grid in the session scratchpad.
