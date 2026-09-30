# Handoff: 2026 design tokeny jsou na mainu

Navazuje na `handoff.md` (2026-09-20). Pro Kláru (část A, česky) a jejího agenta (část B, anglicky). Stav k 2026-09-30. Autor: Kryštof + Fable.

---

## Část A — pro Kláru

### Co se stalo

Tvoje token práce z #603 je na mainu — PR #634 (tokeny), #635 (class merger), #636 (retune existujících barev), #637 (layout a type scale). Všechny commity tě uvádějí jako co-autorku. Kroky **01-tokens a 02a-twmerge z plánu přeskoč — začínáš rovnou u 02-button-icon.**

Při review se změnilo **názvosloví a struktura**; hodnoty (procenta, alfy, stíny, poloměry) jsou dál tvoje a klidně je dolaďuj v malých PRs. **Názvy jsou teď kontrakt.**

### Přejmenování

| U tebe (#603 / port větve) | Na mainu | Proč |
|---|---|---|
| `primary-wash` / `-wash-strong` | `primary-tint` / `primary-tint-strong` | „tint" je srozumitelný standard, „wash" nemá v design systémech precedent |
| `primary-soft` (mix do surface) | `surface-primary` (+ `surface-secondary`, `surface-neutral`) | není to síla barvy, ale obarvený povrch — druh, ne varianta (srov. Radix `--accent-surface`); nově existuje celá matice: i `surface-sunken-*` a `page-*` |
| `neutral-wash` z `text-muted` | `neutral-tint` z `neutral` | jednotný recept ve všech rodinách; vazba fill→text token by se rozjela při ladění kontrastu |
| `--duration-*` | `--transition-duration-*` | tvůj namespace negeneroval utility — `ko:duration-fast` byl no-op, teď funguje; opraven i reduced-motion override |
| `h-fluid-nav`, `p-fluid-gutter` | `h-nav`, `p-gutter` | prefix `fluid-` popisoval mechaniku, ne význam |
| `rounded-pill` 100px | 9999px | drží na libovolně vysokém prvku |

### Konvence názvů (závazná)

Tři nezávislé osy, max. jedno slovo z každé:

- **druh**: `surface`, `surface-sunken`, `page`, `text`, `border`, `focus`, `tint`, …
- **síla**: jeden žebřík `-strong` > základ > `-muted` > `-subtle`
- **stav**: `-hover`, `-active`, `-disabled`, `-inactive`

Light/dark řeší token uvnitř (`light-dark()`), nikdy název. Pravidlo užití: tichá barva na kartě → `surface-primary`; kdekoli jinde → `tint` (průhledný, funguje na čemkoli).

### Co schválně není token (žije v komponentě, která to vlastní)

Paddingy karty (`fluid-card-pad-*`), velikost hvězdy (`fluid-star`), výška action baru (`fluid-action`), offsety headeru/progressu, per-element velikosti písma (`question/gist/chip/action-label/brand`), stíny decku (`card-next`/`card-back`), `plate-blur`, `font-question`, `data-mode` pravidla. **Když má něco z toho v tvém designu druhého konzumenta, napiš to do PR review — povýšení na token je dvouřádkový PR.** Nový token na uzavřené škále (radius/shadow/text/spacing/ease/duration) se registruje v `createTwMerge` ve stejné změně.

### Pozor při přenosu

Třídy z tvých starých větví už neexistují: `koa:bg-primary-wash`, `koa:bg-primary-soft`, `koa:h-fluid-nav`, `koa:text-fluid-*`, `koa:shadow-card-next`… — překládej podle tabulky, nikdy nekopíruj class listy doslova. Retune (#636) už je živý: main vypadá podle 2026 formulí (jemnější hover/active, computed ink, světlejší neutral).

---

## Part B — agent brief addendum (English)

Extends `handoff.md` Part B; read that first. The token layer is DONE on main (PRs #634–#637) — steps 01-tokens and 02a-twmerge from the recommended order are finished; start at 02-button-icon.

### Binding naming conventions

Three independent axes, at most one word from each: **kind** (`surface`, `surface-sunken`, `page`, `text`, `border`, `focus`, `tint`), **strength** (one ladder: `-strong` > base > `-muted` > `-subtle`), **state** (`-hover/-active/-disabled/-inactive`). Mode is resolved inside tokens via `light-dark()`, never in names. Usage rule: quiet colour on a card → `bg-surface-primary`; anywhere else → `bg-primary-tint`.

### Translation table for the port/* reference diffs

`wash` → `tint`; `soft` → `surface-<colour>` (full matrix exists: `surface-*`, `surface-sunken-*`, `page-*`); `fluid-` prefixes dropped (`h-nav`, `p-gutter`, `p-fade-edge`, `pb-scroll-tail`); heading scale is `text-title` / `text-display`; durations are `duration-fast/base/slow` (now actually generating utilities). Never copy class lists verbatim from the old branches — translate them.

### Component-side values (deliberately not tokens)

Card paddings, star size, action-bar height, header/progress offsets, per-element font sizes (question/gist/chip/action-label/brand), deck shadows (`card-next`/`card-back`), plate blur, `--font-question`, `data-mode` rules. Implement these locally in the owning component (arbitrary values or component-local variables — tint through `--ko-shadow-color`/theme variables where applicable). If one turns out to be shared across screens, propose promotion in the PR body instead of minting a token yourself. When a new token does land on a closed-list scale (radius/shadow/text/spacing/ease/duration), register it in `createTwMerge`'s lists in the same change.

### Updated traps

- The tokens ship unconsumed: main's screens still use old utility classes; a ported component switching to token classes is *expected* to change its look — that is the redesign, screenshot it.
- The retune (#636) already changed main's existing hover/active/on-bg/neutral rendering; compare screenshots against current main, not against pre-September screenshots.
