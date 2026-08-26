import type { PageType } from "@/routing/localized-slugs";
import { createBaseSegment, type RouteSegments } from "@/routing/segments";
import { buildCanonicalUrl } from "@/routing/url-builders";
import { isPrefix, validateQuestionNumber } from "@/routing/validators";
import type { AppConfig } from "@/types/app-config";

export type RoutingConfig = {
  i18n: AppConfig["i18n"];
  pageSlugs: Record<string, Record<PageType, string>>;
  prefixSlugs: Record<string, Record<string, string>>;
};

export function createRouting({ i18n, pageSlugs, prefixSlugs }: RoutingConfig) {
  const { locales, defaultLocale, localePrefix = "as-needed" } = i18n;

  if (!locales.includes(defaultLocale)) {
    throw new Error(`Invalid defaultLocale: "${defaultLocale}"`);
  }

  const PREFIXES = locales.flatMap((locale) => Object.values(prefixSlugs[locale] || {}));

  function validateLocale(locale: string): void {
    if (!locales.includes(locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
  }

  function getPageSlug(locale: string, pageType: PageType): string {
    const localizedSlug = pageSlugs[locale]?.[pageType];
    if (localizedSlug) {
      return localizedSlug;
    }
    throw new Error(`Page type "${pageType}" not found for locale "${locale}".`);
  }

  function addLocalePrefix(path: string, locale: string): string {
    if (localePrefix === "never") {
      return path;
    }

    if (localePrefix === "as-needed") {
      return locale === defaultLocale ? path : `/${locale}${path}`;
    }

    return `/${locale}${path}`;
  }

  const routes = {
    introduction: (segments: RouteSegments, locale: string) => {
      validateLocale(locale);
      const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "introduction")}`;
      return addLocalePrefix(path, locale);
    },
    guide: (segments: RouteSegments, locale: string) => {
      validateLocale(locale);
      const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "guide")}`;
      return addLocalePrefix(path, locale);
    },
    question: (segments: RouteSegments, questionNumber: number, locale: string) => {
      validateLocale(locale);
      const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "question")}/${questionNumber}`;
      return addLocalePrefix(path, locale);
    },
    review: (segments: RouteSegments, locale: string) => {
      validateLocale(locale);
      const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "review")}`;
      return addLocalePrefix(path, locale);
    },
    result: (segments: RouteSegments, locale: string) => {
      validateLocale(locale);
      const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "result")}`;
      return addLocalePrefix(path, locale);
    },
    publicResult: (segments: RouteSegments, publicId: string, locale: string) => {
      validateLocale(locale);
      const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "result")}/${publicId}`;
      return addLocalePrefix(path, locale);
    },
    comparison: (segments: RouteSegments, locale: string) => {
      validateLocale(locale);
      const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "comparison")}`;
      return addLocalePrefix(path, locale);
    },
  } as const;

  function stripEmbed(segments: RouteSegments): RouteSegments {
    const { embed: _embed, ...rest } = segments;
    return rest;
  }

  const canonical = {
    homepage: (): string => buildCanonicalUrl("/"),
    base: (segments: RouteSegments): string => buildCanonicalUrl(createBaseSegment(stripEmbed(segments))),
    introduction: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.introduction(stripEmbed(segments), locale)),
    guide: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.guide(stripEmbed(segments), locale)),
    question: (segments: RouteSegments, questionNumber: number, locale: string): string => buildCanonicalUrl(routes.question(stripEmbed(segments), questionNumber, locale)),
    review: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.review(stripEmbed(segments), locale)),
    result: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.result(stripEmbed(segments), locale)),
    publicResult: (segments: RouteSegments, publicId: string, locale: string): string => buildCanonicalUrl(routes.publicResult(stripEmbed(segments), publicId, locale)),
    comparison: (segments: RouteSegments, locale: string): string => buildCanonicalUrl(routes.comparison(stripEmbed(segments), locale)),
  } as const;

  function parseKey(segments: RouteSegments): string {
    const { first } = segments;

    if (segments.second && segments.third) {
      return segments.third;
    }

    if (segments.second) {
      return segments.second;
    }

    return first;
  }

  function parseGroup(segments: RouteSegments): string | undefined {
    const { first } = segments;

    if (segments.third) {
      return segments.second;
    }

    if (segments.second) {
      if (isPrefix({ segment: first, validPrefixes: PREFIXES })) {
        return undefined;
      }
      return first;
    }

    return undefined;
  }

  const mappedParams = {
    key: (segments: RouteSegments) => parseKey(segments),
    group: (segments: RouteSegments) => parseGroup(segments),
  } as const;

  function parseQuestionNumber(path: string): number {
    const segments = path.split("/").filter(Boolean);

    const questionIndex = (() => {
      for (const slugs of Object.values(pageSlugs)) {
        const index = segments.indexOf(slugs.question);
        if (index !== -1) return index;
      }
      return -1;
    })();

    if (questionIndex === -1) {
      throw new Error("Question segment not found in path");
    }

    const questionNumberString = segments[questionIndex + 1];
    if (!questionNumberString) {
      throw new Error("Missing question number in path");
    }

    if (segments[questionIndex + 2]) {
      throw new Error("Unexpected path segments after question number");
    }

    return validateQuestionNumber(questionNumberString);
  }

  const parsedParams = {
    questionNumber: (path: string): number => parseQuestionNumber(path),
  } as const;

  return { routes, canonical, mappedParams, parsedParams, PREFIXES };
}
