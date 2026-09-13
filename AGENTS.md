# Agent guidelines

Rules for anyone – human or AI agent – working in this repository. The authoritative policy is
[`contract/README.md`](contract/README.md); this file is the working version. It is
protected – never edit it.

## Project

Kalkulacka.1 is a multi-country voting advice application platform (Turborepo monorepo, used by
millions of voters). `apps/*` are Next.js sites named by production domain; `packages/*` are
shared libraries (`schema` → `app` → `next` → apps, plus `design-system` and `database`).
Election content is not in the repo (fetched from `DATA_ENDPOINT`); user answers flow through
`apps/*/app/api/**` into the database. Architecture: `docs/architecture.md`; routing:
`docs/routing.md`.

## Commands

- `npm install` · `npm run dev` (all dev servers) · `npm run build`
- `npm run test` · `npm run e2e` · `npm run typecheck`
- `npm run lint` / `npm run lint:fix` (Biome)
- `npm run scope` – classify your current change (see The boundary)
- Always from the repo root, never from individual workspaces.

## The boundary

Changes are classified mechanically by the files they touch – never by what you say about them.
Run `npm run scope` before opening a PR and paste its output into the PR description. Three
kinds of territory:

**Product (work freely):**
- `packages/design-system/src/**`, `packages/app/src/components/**`,
  `packages/app/src/client/components/**` – shared UI components
- `apps/*/components/client/themes/**`, `apps/*/app/globals.css`, `apps/*/public/**`
- `apps/*/app/[locale]/(web)/(content)/**` – content pages
- `apps/*/messages/*.json` and `packages/app/src/locales/*.json` – translation **values only**:
  never add/remove/rename keys, never touch the `routing.*` subtree

**Platform (requires explicit human approval):**
- Everything not listed above. Notably: `apps/*/lib/**`, `apps/*/hooks/**`, `apps/*/app/api/**`,
  and the `(app)`/`(embed)` route trees – these look app-local but are still byte-replicated
  across CZ/SK/MK and count as shared platform code – plus `packages/{schema,database,next}`,
  `packages/app/src/client/{stores,view-models,embeds}/**`, any `package.json`/lockfile,
  configs, and `packages/app/src/result-calculation/**` (the matching algorithm – never touch
  it, period).

**Protected (never write, no exceptions):**
- `contract/**`, `.github/workflows/**`, `.github/CODEOWNERS`, `.claude/**`, `AGENTS.md`,
  `CLAUDE.md`.

## When your task needs a platform file

Prefer the **prerequisite split**: extract the minimal platform change (say, one view-model
line) into its own small PR, and state in its description exactly what dependent product change
it enables – it will be human-reviewed quickly precisely because it is small and explained.
Only after it merges, open the product PR on top of main; until then the classifier will
correctly refuse the product lane because your diff still contains the platform line.

If even that is not possible: stop and say so in your final report – which file, why the task
needs it, and what you left undone. **Never work around the boundary** – no copying platform
code into product files, no reimplementing a session helper locally, no editing a replicated
file "just in CZ". An honestly blocked task is a good outcome; a silent crossing is the worst.

## Shape of a change

- **One intent per PR.** One sentence must describe the whole change. If you need "and", split.
- Keep it small – a reviewer must be able to judge the entire effect from the running app.
- A shared change (design-system, app package, anything `Instances: *` in the scope output)
  affects every country site – say so in the PR and verify beyond the app you started from.

## Pull requests

- Title: plain imperative, matching the repo's history (e.g. "Localize the close button label").
- Fill the PR template: Intent, `npm run scope` output, screenshots for anything visual.
- Do not add labels yourself; they are applied mechanically.
- Before every PR, from the repo root, in this order:
  `npm run typecheck` → `npm run lint:fix` → `npm run test` → `npm run scope`

## Code standards

- Biome for lint/format: 2-space indent, double quotes, line width 200, self-closing JSX.
- TypeScript strict; no `any`, no non-null assertions.
- Tailwind class prefixes: `ko:` in `design-system`, `koa:` in the `app` package – the prefix
  always comes before responsive modifiers (`ko:lg:grid-cols-3`, never `lg:ko:grid-cols-3`).
- Import order (Biome-enforced): `@kalkulacka-one/**` → third-party → `@/**` → relative.

## Testing

- Vitest + React Testing Library, jsdom. Tests live next to the component they test, named
  `{component}.test.tsx` / `{module}.test.ts`.
- Import the unit under test directly by relative path – never through barrel files.
