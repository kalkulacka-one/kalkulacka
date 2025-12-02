export type PageType = "introduction" | "guide" | "question" | "review" | "result" | "comparison";
export type PrefixType = "election";

export const PREFIX_SLUGS: Record<string, Record<PrefixType, string>> = {
  cs: {
    election: "volby",
  },
};

export const PAGE_SLUGS: Record<string, Record<PageType, string>> = {
  cs: {
    introduction: "uvod",
    guide: "navod",
    question: "otazka",
    review: "rekapitulace",
    result: "vysledek",
    comparison: "porovnani",
  },
};

export const BLOCKED_ENGLISH_SLUGS = new Set<string>(["introduction", "guide", "question", "review", "result", "comparison"]);

export function getPageSlug(locale: string, pageType: PageType): string {
  const localizedSlug = PAGE_SLUGS[locale]?.[pageType];
  if (localizedSlug) {
    return localizedSlug;
  }
  throw new Error(`Locale "${locale} not found."`);
}

export function getPrefixSlug(locale: string, prefixType: PrefixType): string {
  const prefixSlug = PREFIX_SLUGS[locale]?.[prefixType];
  if (prefixSlug) {
    return prefixSlug;
  }
  throw new Error(`Locale "${locale}" not found in PREFIX_SLUGS.`);
}
