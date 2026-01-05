# Multitenancy Replication Guide

**DO NOT COMMIT THIS FILE**

## TODO IDs

| ID | Description | Files |
|----|-------------|-------|
| TENANT-001 | Extract site metadata to appConfig | `app/[locale]/(web)/layout.tsx` |
| TENANT-002 | Extract locale messages mapping to shared config | `config/localized-slugs.ts` |
| TENANT-003 | Extract app title to i18n messages | `calculator/components/client/app-header.tsx` |
| TENANT-004 | Implement SK donation card with Slovak donation platform | `calculator/components/client/donate-card.tsx` |
| TENANT-005 | Translate share modal strings to Slovak | `calculator/components/client/share-modal.tsx` |
| TENANT-006 | Extract footer text to i18n, configure SK social links | `components/server/footer.tsx` |
| TENANT-007 | Extract embed footer text to i18n | `calculator/components/server/components/embed-footer.tsx` |
| TENANT-008 | Create SK theme when ready | `components/client/themes/default.tsx` |
| TENANT-009 | Translate about page to Slovak | `app/[locale]/(web)/(content)/(pages)/o-nas/page.tsx` |
| TENANT-010 | Translate privacy policy to Slovak | `app/[locale]/(web)/(content)/(pages)/soukromi/page.mdx` |
| TENANT-011 | Add SK contact page content | `app/[locale]/(web)/(content)/(pages)/kontakt/page.tsx` |
| TENANT-012 | Translate methodology page to Slovak | `app/[locale]/(web)/(content)/(pages)/metodika/page.tsx` |
| TENANT-013 | Update election name for SK elections | `app/api/images/sessions/[public-id]/[type]/route.tsx` |
| TENANT-014 | Extract hardcoded Slovak strings to i18n | Multiple calculator component files |

## Commits (in order)

1. **Copy CZ app 1:1 to SK with basic adjustments** (`da57cdec`)
   - Copied all CZ app files to SK
   - Updated package.json name and port
   - Updated layout metadata to Slovak
   - Updated next.config.ts (removed CZ-specific redirects)
   - **CRITICAL:** Fix `config/app-config.ts` import: use `@kalkulacka-one/next/config` NOT `@kalkulacka-one/next` (causes circular dependency build error)

2. **Add Slovak messages for SK site** (`b5d97f89`)
   - Created `messages/sk.json` with Slovak routing slugs and UI strings

3. **Update SK site config to use Slovak locale** (`125fc21a`)
   - Changed `config/localized-slugs.ts` import from cs.json to sk.json
   - Changed locale key from `cs` to `sk`
   - Updated `i18n/global.ts` import

4. **Add Slovak locale to @kalkulacka-one/app package** (`cb29cd52`)
   - Created `packages/app/src/locales/sk.json`
   - Added `sk` to `SupportedLocale` type
   - Added `skMessages` export

5. **Update SK i18n-provider to use Slovak messages** (`3ad45118`)
   - Changed `components/server/i18n-provider.tsx` import from csMessages to skMessages
   - Changed APP_MESSAGES key from `cs` to `sk`

6. **Update security.txt for SK site** (`a6725d81`)
   - Changed canonical URL to volebnakalkulacka.sk
   - Changed preferred language to sk

7. **Translate app header title to Slovak** (`9c2567e7`)
   - Changed "Volební kalkulačka" → "Volebná kalkulačka"
   - Added TODO [TENANT-003]

8. **Add TODO for SK donation card** (`7247fc75`)
   - Added TODO [TENANT-004] - needs SK donation platform

9. **Translate share modal to Slovak** (`db81e38b`)
   - Translated all strings to Slovak
   - Added TODO [TENANT-005]

10. **Translate footer to Slovak** (`e513b290`)
    - Translated text to Slovak
    - Added TODO [TENANT-006]

11. **Translate embed footer to Slovak** (`ee7f6de9`)
    - Translated text to Slovak
    - Added TODO [TENANT-007]

12. **Remove CZ embed themes, keep only default theme** (`97d910cb`)
    - Removed alarm, prima, diky-ze-muzem themes from `config/themes.ts`
    - Removed theme components from `components/client/themes/`
    - Simplified `theme-provider.tsx` to only default theme
    - Added TODO [TENANT-008] to default theme

13. **Translate share image text to Slovak** (`a8cb97f6`)
    - Translated "Sněmovní volby 2025" → "Parlamentné voľby 2025"
    - Translated "Takhle mi vyšla Volební kalkulačka" → "Takto mi vyšla Volebná kalkulačka"
    - Translated URL domain to volebnakalkulacka.sk
    - Added TODO [TENANT-013]

14. **Add TODOs to SK static content pages** (`96d57c8f`)
    - Added TODOs to o-nas, kontakt, metodika, soukromi pages
    - TODOs: TENANT-009, TENANT-010, TENANT-011, TENANT-012

15. **Remove unused CZ messages file and fix test setup import** (`7753c175`)
    - Deleted `messages/cs.json`
    - Fixed `tests/setup.ts` import to use sk.json

16. **Remove CZ embed partners from SK site** (`250f2749`)
    - Removed CZ-specific embed partners from `config/embeds.ts`

17. **Remove CZ test** (`104a6a53`)
    - Deleted `tests/e2e/calculator-flow.spec.ts` (CZ-specific test)

18. **Temporarily use CZ data** (`a5353589`)
    - Updated `.env` to use CZ data endpoint until SK data is ready

19. **Translate UI strings to Slovak (in-place)** (`64a07675`)
    - Translated hardcoded strings in calculator components to Slovak
    - Added TODO [TENANT-014] to these files for future i18n extraction:
      - `calculator/components/client/comparison-grid.tsx`
      - `calculator/components/client/match-card.tsx`
      - `calculator/components/server/pages/comparison.tsx`
      - `calculator/components/server/pages/guide.tsx`
      - `calculator/components/server/pages/public-result.tsx`
      - `calculator/components/server/pages/result.tsx`
      - `calculator/components/server/pages/review.tsx`
    - Also translated metodika and o-nas pages (already had TODOs)

20. **Add SK frontpage with Inventúra hlasovania card**
    - Copied frontpage design from sk-frontpage-inventura branch
    - Added archive card with Slovak text

## Files Modified Summary

### Site-level Config
- `package.json` - name, port, remove e2e scripts
- `next.config.ts` - removed CZ redirects
- `app/[locale]/(web)/layout.tsx` - Slovak metadata
- `config/app-config.ts` - **CRITICAL:** import from `@kalkulacka-one/next/config`

### i18n/Localization
- `messages/sk.json` - Created Slovak messages
- `messages/cs.json` - Deleted
- `config/localized-slugs.ts` - Changed to sk
- `i18n/global.ts` - Changed to sk.json import
- `components/server/i18n-provider.tsx` - Changed to sk

### App Package
- `packages/app/src/locales/sk.json` - Created
- `packages/app/src/locales/index.ts` - Added sk locale

### Components with Translations
- `calculator/components/client/app-header.tsx`
- `calculator/components/client/share-modal.tsx`
- `components/server/footer.tsx`
- `calculator/components/server/components/embed-footer.tsx`
- `app/api/images/sessions/[public-id]/[type]/route.tsx`

### Components with Translations + TODO for i18n extraction (TENANT-014)
- `calculator/components/client/comparison-grid.tsx`
- `calculator/components/client/match-card.tsx`
- `calculator/components/server/pages/comparison.tsx`
- `calculator/components/server/pages/guide.tsx`
- `calculator/components/server/pages/public-result.tsx`
- `calculator/components/server/pages/result.tsx`
- `calculator/components/server/pages/review.tsx`

### Components with TODOs (no translation yet)
- `calculator/components/client/donate-card.tsx` - needs SK donation platform
- `app/[locale]/(web)/(content)/(pages)/o-nas/page.tsx` - translated, needs i18n
- `app/[locale]/(web)/(content)/(pages)/kontakt/page.tsx`
- `app/[locale]/(web)/(content)/(pages)/metodika/page.tsx` - translated, needs i18n
- `app/[locale]/(web)/(content)/(pages)/soukromi/page.mdx`

### Themes & Embeds
- `config/themes.ts` - Only default theme
- `config/embeds.ts` - Only default embed (no TODO needed)
- `components/client/theme-provider.tsx` - Simplified
- `components/client/themes/` - Removed CZ-specific themes

### Tests
- `tests/setup.ts` - Fixed import
- `tests/e2e/calculator-flow.spec.ts` - Deleted

### Security
- `lib/site/security/security.txt` - Updated URL and language
