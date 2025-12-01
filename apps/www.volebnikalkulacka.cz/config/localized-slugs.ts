export type PageType = "introduction" | "guide" | "question" | "review" | "result" | "comparison";

export const LOCALIZED_SLUGS: Record<string, Record<PageType, string>> = {
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

export function getLocalizedSlug(locale: string, pageType: PageType): string {
  const localizedSlug = LOCALIZED_SLUGS[locale]?.[pageType];
  if (localizedSlug) {
    return localizedSlug;
  }
  throw new Error(`Locale "${locale} not found."`);
}
