# Redesign notes — Klára ↔ Kryštof

Průběžný soubor na branchi `redesign/handoff`: Klára (nebo její agent) přidává záznamy, Kryštof je odbavuje a mění na PRs / úpravy guardrails.

## Platform requests

<!-- Formát: co potřebuju / pro kterou obrazovku / odkaz na původní port/* diff -->

- **Zobrazovaná jména kalkulačky v hlavičce** — typ voleb, název kalkulačky a rok jako samostatná pole (např. „Sněmovní volby“ / „Volební kalkulačka“ / „2025“), dostupná na `CalculatorViewModel`. Pro: hlavičku všech obrazovek kalkulačky (#629); 2026 skládá druhý řádek z těchto částí, my teď ukazujeme celé `title` zkrácené „…“. Komponenta je na to připravená (volitelné props). Odkaz: `origin/port/05-intro-page` (`calculator-names.ts`), 2026 `packages/ui/src/app-header/app-header.tsx`. Odpovídá předjednanému „name/shortName“.
- **Barva strany v datech** (volitelné, nízká priorita) — pro výsledky (#630) teď barvu dopočítáváme z názvu (stabilní paleta z 2026); skutečné barvy stran by potřebovaly pole v datech nebo serverové odvození z loga. Odkaz: 2026 `packages/ui/src/party-color.ts`, `apps/web/lib/logo-color.ts`.
- **Počty a filtry pro rekapitulaci** — „Zodpovězeno X z Y / Přeskočeno Z“ a filtry podle témat potřebují na `ReviewPage` počty a kategorie otázek. Pro: rekapitulaci (#629). Odkaz: `origin/port/13-review-page`.

## Guardrail friction

<!-- Formát: na jakou hranici agent narazil / proč překážela / návrh úpravy -->

- **`scope-guard` hook a worktrees pod `.claude/worktrees/`** — hook odmítá Edit/Write v jakémkoli souboru, jehož absolutní cesta obsahuje `.claude/`, takže agent pracující ve vlastním worktree (Claude Code je zakládá právě tam) nemůže editovat ani product soubory. Jeden agent to obešel přes shell; od té doby pracujeme ve worktrees mimo `.claude/`. Návrh: kontrolovat cestu relativní k rootu repa / worktree, ne absolutní.
- **Sekvenční squash merge vs. historie větví** — PR větve, které kdysi obsahovaly #603, kolidovaly při postupném mergování jen kvůli historii (obsahově čisté). Pomohlo: všechny závislé PR mají vmergovanou aktuální #627 a merge order je #627 → zbytek; před každým kolem ověřujeme simulací squash merge v několika pořadích.
