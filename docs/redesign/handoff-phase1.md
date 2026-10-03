# Handoff: fáze I redesignu je na mainu

Navazuje na `handoff.md` a `handoff-tokens.md`. Pro Kláru (část A, česky) a jejího agenta (část B, anglicky). Stav k 2026-10-03. Autor: Kryštof + Claude.

---

## Část A — pro Kláru

### Co se stalo

Fáze I je zmergovaná, v tomhle pořadí: #627 (formulářové prvky) → #628 (barvy na tokenech) → #631 (pozadí) → #629 (shell) → #632 (otázka) → #630 (výsledek). K tomu tři malé předpoklady: #652 (allowlist pro `join-us-form`), #653 (značka `data-embed`) a #654 (turbo už nepíše do `AGENTS.md`).

Tvoje commity zůstaly netknuté. Do každé větve jsme vmergovali main a přidali vlastní commity navrch, pak squash merge. Produkce je zmražená, takže main je to, co půjde ven. Všechno níž je porovnané proti dnešní produkci.

### Co jsme změnili oproti tvé verzi

| PR | Změna | Viditelné? | Proč |
|---|---|---|---|
| #627 | Lint fix v Pill story; `city-signup-form.tsx` → `join-us-form.tsx` | ne | CI padalo; název souboru neseděl od #638 |
| #628 | **Český theme vrácený na main** (−40 řádků hexů), zbylých 11 souborů beze změny | **ano: brand modrá a červená zůstávají jako na produkci** | hexy z velké části opakovaly to, co `styles.css` už odvozuje z neutralu; změna brand barev patří do vlastního PR |
| #631 | Pozadí žije jednou v `packages/app/src/styles.css` místo 3× v `globals.css`; embedy vyřazené přes `html:not([data-embed])`; z kořenového `<body>` zmizelo `bg-slate-50` | jen embedy: zůstávají průhledné | jedno místo pro sdílené pravidlo; partnerské stránky si drží svoje pozadí |
| #629 | Úklid po přesunu navigace do toku stránky: prázdné spacery, 88px mezera na sdíleném výsledku, `EmbedFooter.navOffsetClassNames`, komentář v `Layout` | ne | pozůstatky starého `fixed` baru |
| #632 | Ano/Ne ikony → `logoCheck`/`logoCross` z design systému; `QuestionProgress` → `SteppedProgressBar` (přestylovaný na tvůj vzhled); font → `koa:font-sans`; čipy → **všechny tagy** místo `tags[0]` | **mírně: lehčí značky Ano/Ne**; zbytek vypadá stejně | žádné lokální kopie primitiv; pořadí tagů není kategorie |
| #630 | **Bez barev stran** (top match primary, ostatní neutral); **loga zpět na velké šedé dlaždici**; „Porovnat" je sdílený `Button variant="pill"`; `ComparisonMark` → `IconBadge` (nové `solid`/`dashed`/`small`) | **ano: bez barev stran, větší loga, menší „Porovnat"** | barvy z hashe jména dávaly nesouvisejícím stranám stejnou barvu a přebíjely partnerská témata; bílá loga na světlém kolečku mizela |

### Rozhodnutí, která čekají na tebe

1. **Těžší značky Ano/Ne** (#632) — byly záměr? Pokud ano, změň `logoCheck`/`logoCross` v `packages/design-system/src/components/icons/icons.ts` pro všechny obrazovky naráz, ve vlastním PR.
2. **Font výroku** (#632) — main měl display (Radio Canada), teď je sans (Geist). Záměr?
3. **Ano/Ne jen jako ikony na telefonech** (#632) — produkce ukazuje text; ✓/✗ bez textu je u hlavního ovládání riziko.
4. **Shoda v rozbaleném srovnání** (#630) — **regrese proti produkci**. Produkce zvýrazňuje řádky, kde se shodneš se stranou (modře ✓•✓, červeně ✗•✗); teď je obarvená každá odpověď zvlášť. Nový layout nech, jen vrať zvýraznění shody na řádek.
5. **Iniciály místo pořadí** u strany bez loga (#630) — „SS" pro „SMS – Stát Má Sloužit". Drobnost.
6. **Velikost „Porovnat"** (#630) — teď 40 px jako Zpět/Sdílet, u tebe ~46 px. Když má být větší: velikost `large` u pill v design systému, ne ručně stavěné tlačítko.
7. **Rekapitulace** (#629) — řádky ukazují jen téma; text výroku a `n/42` zmizely. Záměr?
8. **Brand barvy CZ** (`#2563eb`/`#dc2626`) — pokud je chceš, vlastní malý PR jen s `--ko-palette-primary`/`-secondary` v notaci souboru. Pozor: SK a MK zatím používají český `default.css` (TENANT-008), takže by se přebarvily i ony.
9. **Kategorie otázky** — teď se ukazují všechny tagy. Skutečná „hlavní kategorie" znamená pole ve schématu (platform), viz `notes.md`.

### Známé chyby (product, k opravě)

- **Krátké telefony (390×664):** u dlouhého výroku nejde doscrollovat k prvnímu řádku (sedí pod čipy). Příčina: `justify-center` na sloupci s `overflow-y-auto`; oprava: `koa:justify-center-safe` v `question-card.tsx`.
- **Otázka „nikdy nescrolluje", ale scrolluje:** o 24 px na desktopu, o 44 px v embedu na telefonu. `h-[calc(100lvh-5rem)]` navíc natvrdo počítá s výškou hlavičky, kterou #629 změnil.
- `SteppedProgressBar` bez `decorative` čte anglicky „Question X of Y".

### Pravidla, která z fáze I vyplynula (platí dál)

1. **Primitiva žijí jednou, v design systému.** Ikony, progress bary, tlačítka, odznaky, značky odpovědí. Nikdy kopie v `packages/app`. Chybí-li varianta, přidej ji do komponenty design systému (malý PR), místo abys ji obcházela.
2. **Nepřebíjej komponentu zvenku** (`shadow={false}` + `!`-třídy). Chybí-li možnost, přidej ji do komponenty.
3. **Theme nastavuje jen semínka.** Než přidáš hodnotu do theme, zeptej se: „neodvozuje to systém už sám?" Pinout odvozenou hodnotu je chyba, i když pixely sedí.
4. **Obsahová rozhodnutí patří do dat, ne do kódu** — barvy stran, hlavní kategorie. Nespoléhej na pořadí v poli, pokud ho schéma nedefinuje.
5. **Sdílené pravidlo na jedno místo**, ne kopie do CZ/SK/MK.
6. **Komentáře: jen důvod, 1–3 řádky.** Žádné odkazy na prototyp (`kalkulacka-2026/...`), handoff soubory, větve, PR čísla ani popis postupu — každý budoucí čtenář na ně narazí jako na mrtvý odkaz.
7. **Před mergem srovnej s produkcí**: telefon, krátký telefon, desktop, partnerský embed, SK. Cokoli horšího než produkce blokuje merge.

### Úklid

- **Tvoje staré drafty `port/*` (#510–#538, #561, #562) prosím zavři** s komentářem „superseded" — fáze I je přenesla na novou kostru. Branche nech jako referenci.
- Kryštof zavře #362 (stará progress bar, nahrazená `SteppedProgressBar`).
- Komentáře s odkazy mimo repo uklidíme jedním PR (viz část B).

---

## Part B — agent brief addendum (English)

Extends `handoff.md` and `handoff-tokens.md`; read those first. Phase I (#627–#632) is on main. Production is frozen; compare every change against it.

### Binding rules learned in phase I

1. **One implementation per primitive, in the design system.** Icons (`@kalkulacka-one/design-system/icons`: `logoCheck`, `logoCross`, `logoSlash`; generic icons from `@mdi/js`), progress (`ProgressBar`, `SteppedProgressBar`), buttons (`Button` variants incl. `round`, `pill`, `answer`), badges (`IconBadge` with `variant` `tint`/`solid`/`dashed` and `size` `medium`/`small`). Never add a local copy or a component-in-a-component in `packages/app`; extend the design-system component with an additive variant instead.
2. **No outside overrides.** Don't undo a component's styling with `!` classes or `shadow={false}` + replacement classes; add an option to the component.
3. **Themes set seeds only.** Before adding a theme value, check whether `packages/design-system/src/styles.css` already derives it; never pin derived outputs (page, surface, text, border, focus) as hex.
4. **Content decisions live in data.** No colours or categories computed from names or array positions; request a schema field in `notes.md` (Platform requests).
5. **Shared rules in one place.** App-wide CSS for CZ/SK/MK goes into `packages/app/src/styles.css` (only those three apps import it), not three `globals.css` copies. Embeds are marked with `<html data-embed="<name>">`; scope web-only styling with `html:not([data-embed])`.
6. **Comments state the reason only, in 1–3 lines.** No paths into the prototype repo, no handoff/brief/rules files, no branch or PR references, no process narration.
7. **Regression check before every PR is marked ready:** phone (390×844), short phone (390×664), desktop (1440×900), a partner embed (`/embed/alarm/...`), and SK. Compare with production; anything worse blocks the PR. Note that local dev has no database: click through the flow without reloading, or the result page shows "—".

### Open bugs (product)

- `packages/app/src/components/question-card.tsx`: the statement/detail column uses `koa:justify-center` with `koa:overflow-y-auto`, so the first line is unreachable on short viewports. Use `koa:justify-center-safe`.
- `packages/app/src/components/pages/question.tsx`: `koa:h-[calc(100lvh-5rem)]` hard-codes the header height; the page overflows by 24px (desktop) and 44px (phone embed).
- `SteppedProgressBar`: non-decorative `aria-valuetext` is hard-coded English.

### Follow-ups (agent-sized, product)

- `Card`: add a no-cut-corner / uniform-radius option; remove the `shadow={false}` + `rounded-card!` overrides in `question-card.tsx`. Rename `shadow="hard"` (it renders the soft `shadow-card` now; ~23 call sites).
- Float shadow token for `NavigationCard bare` instead of the 3-layer arbitrary `shadow-[…]`.
- One scroll-state source: fold `AppHeader`'s `useScrolled` into `WithCondenseOnScroll` (or the reverse).
- Type scale: replace `text-[17px]`, `text-[11px]`, inline `clamp()` sizes and the match card's name/percent sizes with scale tokens once curated.
- Translations: `QuestionCard` reads `koa.components.questionNavigationCard`, the result page's share button reads `koa.components.resultNavigationCard`; move the keys to their owners, in lockstep across all locale files.
- Rename `ResultNavigationCard` (it holds only "Porovnat" now).
- `packages/app/src/styles.css`: wrap the `html:not([data-embed])` rule in `@layer base`.
- CZ/SK/MK content pages still paint `bg-slate-50` wrappers and `bg-slate-50/50` cards; move them to `bg-page` / transparent.
- Orphaned "…so no reserved gap is needed." comments in the intro/guide/review navigation cards.
- `Button`: `fill`+`neutral` uses `bg-neutral/90`/`/80` instead of the hover/active tokens; `*-disabled` tokens are half-retired (`opacity-45` in Button, `neutral-disabled` in `optionList`); `ko:text-s` in the base is a no-op. If more calculator-specific variants arrive, introduce a shape axis or `IconButton` instead.
- `IconBadge` `solid` + `neutral` renders `surface-sunken`/`text-muted`; consider a name that says so.
- Comment cleanup pass: every comment added since `d216b10a` that cites the prototype, handoff files, branches or PRs, or narrates the process.
