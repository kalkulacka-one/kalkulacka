import type { AppConfigWithDefaults } from "@/config-helpers";

export function createPrefixes({ i18n, prefixSlugs }: { i18n: AppConfigWithDefaults["i18n"]; prefixSlugs: Record<string, Record<string, string>> }): string[] {
  const { locales, defaultLocale } = i18n;

  if (!locales.includes(defaultLocale)) {
    throw new Error(`Invalid defaultLocale: "${defaultLocale}"`);
  }

  return locales.flatMap((locale) => Object.values(prefixSlugs[locale] || {}));
}
