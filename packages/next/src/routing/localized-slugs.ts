export type PageType = "introduction" | "guide" | "question" | "review" | "result" | "comparison";

export type RoutingMessages = {
  routing: {
    prefixes: Record<string, string>;
    pages: Record<PageType, string>;
  };
};

export function createLocalizedSlugs<TMessages extends RoutingMessages>({ messagesByLocale }: { messagesByLocale: Record<string, TMessages> }) {
  const locales = Object.keys(messagesByLocale);

  const PREFIX_SLUGS = Object.fromEntries(Object.entries(messagesByLocale).map(([locale, messages]) => [locale, messages.routing.prefixes])) as Record<string, TMessages["routing"]["prefixes"]>;
  const PAGE_SLUGS = Object.fromEntries(Object.entries(messagesByLocale).map(([locale, messages]) => [locale, messages.routing.pages])) as Record<string, TMessages["routing"]["pages"]>;

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

  function getPrefixSlug(locale: string, prefixType: keyof TMessages["routing"]["prefixes"] & string): string {
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
