import type { AppConfigWithDefaults } from "@/config-helpers";
import type { PageType } from "@/routing/localized-slugs";
import { createBaseSegment, type RouteSegments } from "@/routing/segments";

export function createRouteBuilders({ i18n, pageSlugs }: { i18n: AppConfigWithDefaults["i18n"]; pageSlugs: Record<string, Record<PageType, string>> }) {
  const { locales, defaultLocale, localePrefix } = i18n;

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

  return { routes };
}

export type Routes = ReturnType<typeof createRouteBuilders>["routes"];
