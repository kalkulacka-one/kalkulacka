# Handoff: port 2026 redesignu do kalkulacka-one/kalkulacka

Pro Kláru (část A, česky) a jejího agenta (část B, anglicky). Stav k 2026-09-20. Autor: Kryštof + Fable.

---

## Část A — pro Kláru

### Co se stalo a proč se přenáší znovu

Main se od 11. 9. zásadně změnil: doběhla extrakce (CZ/SK/MK appky už nejsou tři kopie — obrazovky žijí jednou v `packages/app`, routing/session/API v `packages/next`) a přibyl wizard výběru voleb (picker měst a obvodů, homepage z dat). Tvých 29 draftů sedí na základu, který už neexistuje — **tvoje diffy ale zůstávají přesnou referencí toho, co se přenáší.** Není to zahození práce; je to přenos na novou kostru, a díky extrakci se každá obrazovka přenáší **jednou**, ne třikrát.

### Pravidla hry (guardrails)

Repo má `AGENTS.md` a mechanickou hranici product/platform. Domluva:

- **Žádný PR nesmí míchat product a platform.** Product (tvoje volná zóna): `packages/design-system/src/**`, `packages/app/src/components/**`, `packages/app/src/client/components/**`, témata appek, stories, globals.css. Platform (Kryštofovo review): view-modely, stores, `apps/*/lib|hooks|api`, route trees, package.json, contract.
- **Nic nemerguješ sama** — každý PR projde Kryštof. U čistých UI PRs je to ale jen optické review: proklikat preview, mrknout na screenshoty (~2 min, kód nečte). Povinnost na tvé straně: zelené CI, screenshot/Storybook v PR, `npm run scope` výstup v popisu, jeden záměr na PR.
- Guardrails jsou zatím **soft** (report-only) — hlídá je disciplína, ne mechanika. Když agent při práci narazí na hranici, která mu překáží nebo nedává smysl, ať to zapíše do `docs/redesign/notes.md` (sekce „Guardrail friction") — podle toho se guardrails doladí.
- Na `packages/app/src/result-calculation/**` se nesahá. Nikdy.

### Postup: 3 fáze

**Fáze 1 = MVP, jen UI, začni hned.** Nejdřív design system v pořadí tvého původního stacku: tokens (01) → twMerge (02a — pozor, main má novou `createTwMerge(prefix)` factory, tvoje token listy se přenášejí do ní) → button/icon (02) → primitivy (03) → shell (04) → paleta (04a) → question card (06) → deck (07) → flow nav (08) → dialogy/filtry (11) → result primitivy (14). Pak obrazovky: intro → otázky → review → výsledky → srovnání → menu → share → public result.

**Zásadní pravidlo pro obrazovky:** mainové stránky (`packages/app/src/components/pages/*`) jsou props-driven a routing/session drží wrappery v appkách. Přepisuješ **tělo obrazovky při zachování existujících props** — wrapper se nemění, tím zůstáváš čistě v product zóně. Hooky (drag-dismiss, pointer-kind) a malé pure utility kolokuj do složky komponenty.

**MVP degradace (vědomé — nesnaž se je obcházet, doplní se ve fázi 3):** intro bez chytrého counteru; review jen se základními filtry; výsledky bez insights dashboardu; srovnání s `displayName` a bez `?filtr=` v URL; menu bez dark mode; share = tvůj dialog nad existujícím server-side obrázkem (žádný html-to-image — rozhodnuto, klientský export se dělat nebude); public result bez empty-guardu; inventura bez většinových značek (rozhodne Michal).

**Fáze 2 = platforma.** Když při práci narazíš na to, že potřebuješ view-model, nový prop wrapperu, nový modul — **nezačni to psát**. Zapiš to do `docs/redesign/notes.md` (sekce „Platform requests"; formát: co potřebuju / pro kterou obrazovku / odkaz na můj starý diff) a pokračuj na další věci. Kryštof z toho dělá malé PRs, které jen mrkne a mergne — většinu má předjednanou (answers helpers, name/shortName, recap, color mode).

**Fáze 3 = tvoje follow-up UI PRs** nad zmergovanou platformou (counter, topic filtry, dashboard, dark mode…).

### Úklid

Svoje staré drafty **#510–#538, #561, #562 prosím zavři sama** (komentář stačí „superseded — replay on new main"). Branche `port/*` nech být, jsou to reference. Do starých branchí už nepushuj.

---

## Part B — agent brief (English)

You are porting a finished UI redesign into `kalkulacka-one/kalkulacka` (work from `main`, always fresh). Read `AGENTS.md` first and obey it; this brief adds project-specific constraints. Today's stack: Next 16 App Router, React 19, TS strict, Tailwind 4, Turborepo, npm workspaces.

### Source of truth for what to build

The design and behaviour to reproduce live in the author's original stacked branches `origin/port/*` (diff each branch against its predecessor to see one step) and in her standalone repo `~/Git/kalkulacka-one/kalkulacka-2026` (running reference: `pnpm dev`). **Port the intent, not the diff** — the target codebase has moved: pages live in `packages/app/src/components/pages/*` (props-driven server/client components), client pieces in `packages/app/src/client/components/*`, the design system in `packages/design-system/src/*`.

### Hard rules

1. **Product files only.** Allowed: `packages/design-system/src/**`, `packages/app/src/components/**`, `packages/app/src/client/components/**`, `apps/*/components/client/themes/**`, `apps/*/app/globals.css`, Storybook stories, `packages/app/src/locales/*.json` (key changes per the contract rule in `AGENTS.md`: in lockstep across all locale files). If the task seems to require any other path — `apps/*/lib|hooks|app/api`, route trees, `client/{stores,view-models,embeds}`, `package.json`, `contract/` — STOP, do not work around it: append an entry to `docs/redesign/notes.md` under "Platform requests" (what is needed, for which screen, link to the original port diff) and finish the task without it, degrading gracefully. Guardrails are currently soft (report-only): when one gets in your way or seems wrong, note it under "Guardrail friction" in the same file instead of crossing it.
2. **Screens keep the existing props contract.** A ported page component must accept exactly the props the current page receives from its `apps/*/components/client/pages/calculator/*` wrapper — the wrapper must not change. Missing data = MVP degradation (see the plan), not a reason to touch platform.
3. Never touch `packages/app/src/result-calculation/**`, never edit `AGENTS.md`/`CLAUDE.md`/`.github/**`/`contract/**`, never add a runtime dependency.
4. No client-side image export (`html-to-image` is rejected); the share dialog links the existing server-generated share image.
5. Styling: Tailwind with prefix `ko:` in design-system, `koa:` in the app package, prefix before responsive modifiers (`ko:lg:grid-cols-3`). Class merging via the existing `createTwMerge` factory — extend its token groups, don't fork it. Design-system components receive every user-facing string as a prop; app-package components read `koa.*` locale keys.
6. Hooks and small pure utilities are colocated in the component's folder (that keeps them in product territory).

### Definition of done, every PR

One intent; branch from fresh `main`; tests + story colocated; from repo root `npm run typecheck` → `npm run lint:fix` → `npm run test` → `npm run scope` (paste scope output into the PR body — it must show only product paths); screenshots (light theme minimum; both, once dark mode exists) or a Storybook link; PR title in plain imperative matching repo history. Never merge — mark the PR ready and request Kryštof; UI-only PRs get an optical review (he clicks through the preview), platform files would get a real one, which is why they must not appear here.

### Recommended order

Design system first, exactly the original stack order: 01-tokens, 02a-twmerge, 02-button-icon, 03-primitives, 04-shell, 04a-palette, 06-question-card, 07-question-deck, 08-flow-nav, 11-dialog-filters, 14-result-primitives. Then screens: intro, question, review, result, comparison, menu, share, public-result — each as a drop-in replacement of the corresponding `packages/app/src/components/pages/*` body honoring rule 2, with the MVP degradations listed in Part A above.

### Known traps

- The old `02a` twMerge fix passed `prefix: "ko:"`; the current factory takes `"ko"` (no colon) — re-express the token groups on the factory.
- `styles.css` in both packages was restructured (explicit `@layer`, `tokens.css` import); add tokens into the current structure, don't restore the old file shape.
- Avatar/ProgressBar rewrites affect legacy screens that are still live — include screenshots of an untouched legacy screen to prove no regression.
- The wizard added `optionRow`, `optionList`, `searchField` and an Input clear button to the design system — build on them, don't duplicate.
- `packages/app` uses the `koa:` Tailwind prefix everywhere; unprefixed classes in the app package will silently not be generated.
