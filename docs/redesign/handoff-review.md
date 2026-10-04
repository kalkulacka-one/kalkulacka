# Handoff: review fáze I na stagingu

Navazuje na `handoff-phase1.md`. Pro Kláru (část A, česky) a jejího agenta (část B, anglicky). Stav k 2026-10-04, main `71f10927`. Autor: Kryštof + Claude.

Celý nález je na větvi **`redesign/review-findings-2026-10-04`** ve složce `docs/redesign/review-findings/`:

- `README.md`: přehled, plán oprav po PR a rozhodnutí
- `bug-report.md`: UX a chování, `F-01`…`F-31`, včetně screenshotů a videí
- `a11y-audit.md`: přístupnost (WCAG 2.2 AA), `A11Y-01`…`A11Y-19`
- `status.md`: kdo na čem dělá

Tenhle soubor je jen rozcestník. Podrobnosti, měření a příčiny v kódu jsou tam.

---

## Část A — pro Kláru

### Co se stalo

Kryštof proklikal staging na iPhonu (Safari) a na desktopu (Safari). Claude prošel celý tok v Chromiu na desktopu i na telefonu a agent udělal audit přístupnosti. Vyšlo z toho 29 nálezů a 18 bodů přístupnosti. Většina je drobná, ale **dva jsou blokující** a několik se týká hlavní interakce (odpovídání).

Ne všechno je chyba. Část věcí může být tvůj záměr, třeba z mocku. **Než se cokoli opraví, potřebujeme od tebe u sporných bodů jen „záměr / není záměr".** Vyplň prosím tabulku níž (stačí ✓ do sloupce). U „záměr" připiš proč, jednou větou.

### 1. Rozhodni: záměr, nebo ne?

| ID | Co | Záměr | Není záměr | Poznámka |
|---|---|---|---|---|
| F-01 | Text v hlavičce („Volební kalkulačka" + podtitul) má pevných 11 px a logo `xsmall` na všech šířkách. Na desktopu je drobný. | | | |
| F-08 | Rekapitulace: ✓/✗/★ mají 36 px a mezeru 6 px (kompaktní řádek jako v mocku). Na palec je to málo. | | | |
| F-09 | Výsledek: „Porovnat" je na konci seznamu, ne plovoucí dole jako na ostatních obrazovkách. | | | |
| F-11 | Po ťuknutí na Ano/Ne se hned přejde na další otázku. Plný „vybraný" stav se nikdy neukáže. | | | |
| F-12 | Desktop: karta otázky roste s textem, takže Ano/Ne skáčou o ~20 px mezi otázkami. | | | |
| F-14 | Přepínač „Kandidátní listiny / Lidé": podklad splývá s pozadím stránky. | | | |
| F-16 | Navigace zpět: pilulka vlevo nahoře, text vlevo dole a šipka u nadpisu; popisky „Zpět na úvod", „Zpět", „Návod". | | | |
| F-19 | Návod: mezera nadpis → první karta je větší než ostatní a karty jsou na telefonu odsazené víc než nadpis. | | | |
| F-24 | Výběr obvodu na desktopu: nadpis u okraje stránky, popis, hledání a seznam vystředěné. | | | |
| F-25 | „Připravujeme" obvody jsou modře podbarvené, takže působí výrazněji než dostupné obvody. | | | |
| F-26 | Kartička s darem na výsledku: užší než karty kandidátů a ve starém stylu. | | | |

### 2. Jasné chyby — můžeš rovnou opravovat

Tohle záměr nebude, protože se to rozbilo nebo to odporuje tomu, co kód sám chce:

- **F-06 (blokující), F-07, F-13 a A11Y-02 (blokující): obrazovka otázky si počítá výšku sama** (`h-[calc(100lvh-5rem)]`).
  - Na iPhonu je řádek „Návod · 1/40 · Přeskočit" schovaný pod lištou Safari.
  - Karta má vlastní scroll, který chytá gesto.
  - Na desktopu stránka poskočí o 16 px.
  - Při zvětšení 400 % zmizí text otázky úplně.
  - Je to jedna příčina a jedna oprava. Nahrazuje body „Known bugs" v `handoff-phase1.md`.
- **F-05: plovoucí tlačítko dole překrývá poslední řádek** (návod, rekapitulace). `sticky bottom-4` ho na konci stránky posune o 16 px nahoru.
- **F-02: popis ve výběru obvodu při scrollu zmizí.** Přes něj se vykreslí přechod hlavičky z #629.
- **F-18: hledání a seznam obvodů mají jinou šířku.** Picker zůstal na starém `px-4`, obsah má nový `px-gutter`.
- **F-04: krátké stránky na iPhonu jdou posunout** (`min-h-screen` = `100vh`).
- **F-22: karta kandidáta jde rozkliknout, ale nemá hover ani focus.**
- **Přístupnost (vše product):**
  - A11Y-04: focus ring má kontrast ~2,2:1.
  - A11Y-07: Enter na Ano/Ne nic nedělá.
  - A11Y-01: značky ✓/✗ ve srovnání nemají text pro čtečky.
  - A11Y-10 a A11Y-12: kontrast „/40" a čísel obvodů.
  - A11Y-16: progress bar bez jména.
  - A11Y-17: stránka nemá vlastní `h1`.

### 3. Co neřešíš ty

Řeší Kryštof, nebo to není z tvých PR:

- **Platform:** titulky stránek (F-28 / A11Y-06), kam vede ✕ (F-16), 401 u `session-data` (F-30), podezření na ztracené odpovědi po reloadu (F-31).
- **Data:** zkrácené názvy obvodů „Uherské Hradi…" (F-15).
- **Starší věci mimo redesign:** dvojitý focus ring v hledání (F-03, #591), dialog sdílení (F-17, F-23), Tab v Safari (F-20, rozhodnutí D2), 120 Tabů v rekapitulaci (F-21).
  - Klidně si je vezmi, ale nejsou tvoje „dluhy".
- **Homepage** je z tohohle review vyřazená.

### Jak dát vědět, že na něčem děláš

Jakmile začneš něco opravovat, **zapiš to na větev `redesign/review-findings-2026-10-04`** do `docs/redesign/review-findings/status.md`:

- ID
- kdo na tom dělá
- odkaz na PR

Commitni a pushni to rovnou na tu větev. Tak Kryštof uvidí, co je rozdělané, a nebudete dělat dvakrát totéž.

Samotná oprava jde dál jako vlastní PR z `main` s jedním záměrem, ne na review větev.

Stejně tak tabulku z bodu 1: vyplň ji v `status.md` (sloupec „Záměr?"), ať je to na jednom místě.

---

## Part B — agent brief addendum (English)

Extends `handoff.md`, `handoff-tokens.md` and `handoff-phase1.md`; their binding rules still apply.

### Source of truth

The findings live on branch `redesign/review-findings-2026-10-04` in `docs/redesign/review-findings/`. Read them without switching branches:

```sh
git fetch origin
git show origin/redesign/review-findings-2026-10-04:docs/redesign/review-findings/README.md
git show origin/redesign/review-findings-2026-10-04:docs/redesign/review-findings/bug-report.md
git show origin/redesign/review-findings-2026-10-04:docs/redesign/review-findings/a11y-audit.md
git show origin/redesign/review-findings-2026-10-04:docs/redesign/review-findings/status.md
```

Each finding has: where, steps, expected/actual (measured), evidence (`media/…`), likely cause (`file:line` on `main` at `71f10927`), and fix scope (product/platform). Re-verify the cause against the current `main` before editing; line numbers drift.

### Workflow

1. **Check `status.md` first.**
   - Skip anything already claimed.
   - For items in Klára's decision table (section 1 above), wait for her ✓ "not intentional", or ask her. Don't "fix" something she marked intentional; record that instead.
2. **Claim before coding.**
   - Add or edit the row in `status.md` on `redesign/review-findings-2026-10-04`: ID(s), owner, status `in progress`, branch name.
   - Commit with a plain imperative message and push to that branch.
   - Keep these commits docs-only. Never push code to the review branch.
3. **Fix in a separate branch from `main`,** one intent per PR, following `AGENTS.md`:
   - before the PR: `npm run typecheck` → `npm run lint:fix` → `npm run test` → `npm run scope`
   - put the scope output in the PR description
   - add screenshots
4. **Close the loop.** Update the `status.md` row to `PR #NNN` and then `merged`, again pushed to the review branch.

### Work packages (product lane; order matters)

The bundles below match `README.md` → "Fix plan". Each one is a single PR.

1. **Question screen sizes to content:** F-06, F-07, F-12, F-13, F-04, A11Y-02.
   - Remove `h-[calc(100lvh-5rem)]` (`pages/question.tsx`).
   - Make `Layout` a `min-h-dvh` flex column; the question column gets `flex-1`/`min-h-0`.
   - The card uses `min-h`, not a fixed height, with no inner `overflow-y-auto`.
   - Anchor the answer row to the card bottom (`mt-auto`) and top-align the text.
   - Supersedes the two "Open bugs" in `handoff-phase1.md` Part B.
2. **Bottom action off the content:** F-05, then F-09 (if Klára agrees).
   - `Layout.BottomNavigation`: `sticky bottom-0`, with the 16px gap as padding inside.
3. **Answer confirmation:** F-11 (if agreed), A11Y-07, the question part of A11Y-05.
   - Paint `data-checked`, wait ~200 ms, ignore taps meanwhile, then navigate.
   - Swap the `answer` variant's `hover:` for `data-hover:`.
   - Enter toggles.
   - Move focus to (or announce) the new question.
4. **Yes/no as one choice (design system):** F-21 (part 1), A11Y-15, F-08 (if agreed).
   - A compact answer radio group: one Tab stop, ≥ 44px hit area (a visual 36px is fine).
5. **Header and page heading:** F-01, F-02, F-18, F-19, F-24, A11Y-17 (subject to Klára's answers for F-01, F-19 and F-24).
   - Responsive wordmark (`p`, not `h1`).
   - The fade tail on the outer `Layout.Header` edge.
   - `px-gutter` everywhere.
   - A shared page-heading block (back pill + `h1` + lead).
6. **Design-system interaction states:** A11Y-04, F-22, F-03, F-25/A11Y-14, A11Y-16, A11Y-10, A11Y-12, and F-20 (after decision D2).

Packages 7–10 (dialog, result pieces, comparison redesign, back navigation) are in `README.md`. Don't start 10 before decision D1.

**Not yours, don't touch:**
- platform items F-28/A11Y-06, F-16 (close target), F-30, F-31
- data item F-15
- `packages/app/src/result-calculation/**`, ever

If a package turns out to need a platform file, use the prerequisite split from `AGENTS.md` and note it in `status.md`.

### Verification protocol (what the code review missed)

F-02, F-05 and F-06 all passed a code review, because only the code was read, never the viewport. Before marking any PR ready, check:

- **Every screen that mounts the changed component.** `AppHeader`/`Layout` are also used by the district and calculator pickers and the comparison.
- **The end of the scroll** on a long screen (guide on a phone, review with 40 questions).
- **iPhone Safari with the toolbar expanded** (fresh load), or at minimum a 390×664 viewport; plus 390×844, 1440×900, 320×256 (400% zoom) and a partner embed.
- **Keyboard:** Tab through the screen in Chromium. In Safari, Tab with the default setting skips plain buttons (see F-20).
- **Compare with production;** anything worse blocks the PR.
