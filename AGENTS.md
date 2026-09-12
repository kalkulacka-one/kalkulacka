# Agent guidelines

Rules for AI coding agents working in this repository. They exist so that a human can review
your work from its **result** instead of re-deriving your intent from the diff. The authoritative
policy is [`contract/contract.md`](contract/contract.md); this file is the working version.
This file is protected – never edit it.

## The boundary

Changes are classified mechanically by the files they touch – never by what you say about them.
Run `npm run scope` before opening a PR and paste its output into the PR description. There are
three kinds of territory:

**Product (you may work freely):**
- `packages/design-system/src/**` and `packages/app/src/components/**` – shared UI components
- `apps/*/calculator/components/**` – per-app calculator UI (cards, headers, modals)
- `apps/*/components/client/themes/**`, `apps/*/app/globals.css`, `apps/*/public/**` – theming and assets
- `apps/*/app/[locale]/(web)/(content)/**` – content pages
- `apps/*/messages/*.json` and `packages/app/src/locales/*.json` – translation **values only**:
  never add/remove/rename keys, never touch the `routing.*` subtree

**Platform (stop and report – do not cross on your own):**
- Everything not listed above. Notably: `apps/*/lib/**`, `apps/*/hooks/**`, `apps/*/app/api/**`,
  and the `(app)`/`(embed)` route trees – these look app-local but are byte-replicated across
  CZ/SK/MK and count as shared platform code – plus `packages/{schema,database,next}`, any
  `package.json`/lockfile, configs, and `packages/app/src/result-calculation/**` (the matching
  algorithm – never touch it, period).

**Protected (never write, no exceptions):**
- `contract/**`, `.github/workflows/**`, `.github/CODEOWNERS`, `.claude/**`, this file.

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

Development commands, code style, and testing conventions live in [`CLAUDE.md`](CLAUDE.md).
