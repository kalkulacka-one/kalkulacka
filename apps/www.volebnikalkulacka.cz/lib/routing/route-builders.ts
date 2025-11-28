export type RouteSegments = {
  first: string;
  second?: string;
  third?: string;
  embed?: string;
};

/**
 * Page type identifiers (internal, locale-agnostic)
 */
export type PageType = "introduction" | "guide" | "question" | "review" | "result" | "comparison";

/**
 * Default locale for the app.
 * This should match appConfig.i18n.defaultLocale.
 */
const DEFAULT_LOCALE = "cs";

/**
 * Localized URL slugs for each page type.
 * The filesystem uses English slugs, but URLs can be localized.
 */
export const LOCALIZED_SLUGS: Record<string, Record<PageType, string>> = {
  cs: {
    introduction: "uvod",
    guide: "navod",
    question: "otazka",
    review: "rekapitulace",
    result: "vysledek",
    comparison: "porovnani",
  },
  en: {
    introduction: "introduction",
    guide: "guide",
    question: "question",
    review: "review",
    result: "result",
    comparison: "comparison",
  },
};

/**
 * Get the localized URL slug for a page type.
 * Falls back to English if locale is not found.
 */
export function getLocalizedSlug(locale: string, pageType: PageType): string {
  const localizedSlug = LOCALIZED_SLUGS[locale]?.[pageType];
  if (localizedSlug) {
    return localizedSlug;
  }
  // Fallback to English (always defined)
  const englishSlugs = LOCALIZED_SLUGS.en;
  if (!englishSlugs) {
    throw new Error("English localized slugs not found");
  }
  return englishSlugs[pageType];
}

/**
 * Internal route segments (English) - matches the filesystem structure.
 * Used for internal routing, not for user-facing URLs.
 */
export const ROUTE_SEGMENTS = {
  INTRODUCTION: "introduction",
  GUIDE: "guide",
  QUESTION: "question",
  REVIEW: "review",
  RESULT: "result",
  COMPARISON: "comparison",
} as const;

export function createBaseSegment(segments: RouteSegments): string {
  const { first, second, third, embed } = segments;

  if (embed) {
    if (third) {
      return `embed/${embed}/${first}/${second}/${third}`;
    }
    if (second) {
      return `embed/${embed}/${first}/${second}`;
    }
    return `embed/${embed}/${first}`;
  }
  if (third) {
    return `${first}/${second}/${third}`;
  }
  if (second) {
    return `${first}/${second}`;
  }
  return first;
}

/**
 * Locale-aware route builders.
 * Generates URLs with localized slugs based on the provided locale (defaults to Czech).
 */
export const routes = {
  introduction: (segments: RouteSegments, locale: string = DEFAULT_LOCALE) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "introduction")}`,
  guide: (segments: RouteSegments, locale: string = DEFAULT_LOCALE) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "guide")}`,
  question: (segments: RouteSegments, questionNumber: number, locale: string = DEFAULT_LOCALE) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "question")}/${questionNumber}`,
  review: (segments: RouteSegments, locale: string = DEFAULT_LOCALE) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "review")}`,
  result: (segments: RouteSegments, locale: string = DEFAULT_LOCALE) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "result")}`,
  publicResult: (segments: RouteSegments, publicId: string, locale: string = DEFAULT_LOCALE) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "result")}/${publicId}`,
  comparison: (segments: RouteSegments, locale: string = DEFAULT_LOCALE) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "comparison")}`,
} as const;
