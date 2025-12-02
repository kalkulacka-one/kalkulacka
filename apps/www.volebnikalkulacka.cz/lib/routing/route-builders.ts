import { hasLocale } from "next-intl";

import { appConfig } from "@/config/app-config";
import { getPageSlug } from "@/config/localized-slugs";
import { routing } from "@/i18n/routing";

export type RouteSegments = {
  first: string;
  second?: string;
  third?: string;
  embed?: string;
};

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

function addLocalePrefix(path: string, locale: string): string {
  const { defaultLocale, localePrefix } = appConfig.i18n;

  if (localePrefix === "never") {
    return path;
  }

  if (localePrefix === "as-needed") {
    return locale === defaultLocale ? path : `/${locale}${path}`;
  }

  return `/${locale}${path}`;
}

export const routes = {
  introduction: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => {
    if (!hasLocale(routing.locales, locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
    const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "introduction")}`;
    return addLocalePrefix(path, locale);
  },
  guide: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => {
    if (!hasLocale(routing.locales, locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
    const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "guide")}`;
    return addLocalePrefix(path, locale);
  },
  question: (segments: RouteSegments, questionNumber: number, locale: string = appConfig.i18n.defaultLocale) => {
    if (!hasLocale(routing.locales, locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
    const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "question")}/${questionNumber}`;
    return addLocalePrefix(path, locale);
  },
  review: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => {
    if (!hasLocale(routing.locales, locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
    const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "review")}`;
    return addLocalePrefix(path, locale);
  },
  result: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => {
    if (!hasLocale(routing.locales, locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
    const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "result")}`;
    return addLocalePrefix(path, locale);
  },
  publicResult: (segments: RouteSegments, publicId: string, locale: string = appConfig.i18n.defaultLocale) => {
    if (!hasLocale(routing.locales, locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
    const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "result")}/${publicId}`;
    return addLocalePrefix(path, locale);
  },
  comparison: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => {
    if (!hasLocale(routing.locales, locale)) {
      throw new Error(`Invalid locale: "${locale}"`);
    }
    const path = `/${createBaseSegment(segments)}/${getPageSlug(locale, "comparison")}`;
    return addLocalePrefix(path, locale);
  },
} as const;
