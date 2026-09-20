export type PageType = "introduction" | "guide" | "question" | "review" | "result" | "comparison";

export type RouteSlugs = {
  prefixes: Record<string, string>;
  pages: Record<PageType, string>;
};

export function createLocalizedSlugs<TSlugs extends RouteSlugs>({ slugsByLocale }: { slugsByLocale: Record<string, TSlugs> }) {
  const locales = Object.keys(slugsByLocale);

  const PREFIX_SLUGS = Object.fromEntries(Object.entries(slugsByLocale).map(([locale, slugs]) => [locale, slugs.prefixes])) as Record<string, TSlugs["prefixes"]>;
  const PAGE_SLUGS = Object.fromEntries(Object.entries(slugsByLocale).map(([locale, slugs]) => [locale, slugs.pages])) as Record<string, TSlugs["pages"]>;

  function getPageSlug(locale: string, pageType: PageType): string {
    if (!locales.includes(locale)) {
      throw new Error(`Invalid locale: "${locale}". Valid locales are: ${locales.join(", ")}`);
    }
    const localizedSlug = PAGE_SLUGS[locale]?.[pageType];
    if (localizedSlug) {
      return localizedSlug;
    }
    throw new Error(`Page type "${pageType}" not found for locale "${locale}".`);
  }

  function getPrefixSlug(locale: string, prefixType: keyof TSlugs["prefixes"] & string): string {
    if (!locales.includes(locale)) {
      throw new Error(`Invalid locale: "${locale}". Valid locales are: ${locales.join(", ")}`);
    }
    const prefixSlug = PREFIX_SLUGS[locale]?.[prefixType];
    if (prefixSlug) {
      return prefixSlug;
    }
    throw new Error(`Prefix type "${String(prefixType)}" not found for locale "${locale}".`);
  }

  return { PAGE_SLUGS, PREFIX_SLUGS, getPageSlug, getPrefixSlug };
}
