# Redesign notes — Klára ↔ Kryštof

Průběžný soubor na branchi `redesign/handoff`: Klára (nebo její agent) přidává záznamy, Kryštof je odbavuje a mění na PRs / úpravy guardrails.

## Platform requests

<!-- Formát: co potřebuju / pro kterou obrazovku / odkaz na původní port/* diff -->

- **Zobrazovaná jména kalkulačky v hlavičce** — typ voleb, název kalkulačky a rok jako samostatná pole (např. „Sněmovní volby“ / „Volební kalkulačka“ / „2025“), dostupná na `CalculatorViewModel`. Pro: hlavičku všech obrazovek kalkulačky (#629); 2026 skládá druhý řádek z těchto částí, my teď ukazujeme celé `title` zkrácené „…“. Komponenta je na to připravená (volitelné props). Odkaz: `origin/port/05-intro-page` (`calculator-names.ts`), 2026 `packages/ui/src/app-header/app-header.tsx`. Odpovídá předjednanému „name/shortName“.
- **Barva strany v datech** (volitelné, nízká priorita) — výsledky (#630) teď barvu stran nepoužívají: top match má primary barvu tématu, ostatní neutral. Barva dopočítaná z názvu byla odstraněná (nesouvisející strany dostávaly stejnou barvu a přebíjela partnerská témata). Skutečné barvy stran potřebují pole v datech a ve schématu, vybrané pro každé volby.
- **Hlavní kategorie otázky** (volitelné) — karta otázky (#632) ukazuje všechny tagy jako čipy. Jedna „hlavní kategorie" by potřebovala explicitní pole ve schématu otázky; pořadí tagů ji neurčuje.
- **Počty a filtry pro rekapitulaci** — „Zodpovězeno X z Y / Přeskočeno Z“ a filtry podle témat potřebují na `ReviewPage` počty a kategorie otázek. Pro: rekapitulaci (#629). Odkaz: `origin/port/13-review-page`.

## Guardrail friction

<!-- Formát: na jakou hranici agent narazil / proč překážela / návrh úpravy -->

- **`scope-guard` hook a worktrees pod `.claude/worktrees/`** — hook odmítá Edit/Write v jakémkoli souboru, jehož absolutní cesta obsahuje `.claude/`, takže agent pracující ve vlastním worktree (Claude Code je zakládá právě tam) nemůže editovat ani product soubory. Jeden agent to obešel přes shell; od té doby pracujeme ve worktrees mimo `.claude/`. Návrh: kontrolovat cestu relativní k rootu repa / worktree, ne absolutní.
- **Sekvenční squash merge vs. historie větví** — PR větve, které kdysi obsahovaly #603, kolidovaly při postupném mergování jen kvůli historii (obsahově čisté). Pomohlo: všechny závislé PR mají vmergovanou aktuální #627 a merge order je #627 → zbytek; před každým kolem ověřujeme simulací squash merge v několika pořadích.
- **Turbo zapisoval do `AGENTS.md`** — když `turbo` pozná AI agenta, vloží do kořenového `AGENTS.md` (protected) vlastní blok a agent ho mohl omylem commitnout. Vyřešeno v #654 (`"agentGuidance": false` v `turbo.json`).
- **Zastaralý verdikt scope po změně base** — workflow scope běží jen na `opened/synchronize/reopened`, ne na `edited`. Když se PR přecílí na `main`, komentář a labely zůstanou podle staré base (#628 ukazoval PLATFORM, lokálně PRODUCT). Návrh: přidat `edited` do triggerů (protected).
- **Přejmenování souboru vždy končí jako platform** — `classify.ts` u přejmenování selže zavřeně, takže i rename uvnitř product zóny (#627, `city-signup-form` → `join-us-form`) překlopí PR na PLATFORM a allowlist v `contract/` je potřeba upravit zvlášť (#652).
