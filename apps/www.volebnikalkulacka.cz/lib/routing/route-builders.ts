import { appConfig } from "@/config/app-config";
import { getLocalizedSlug } from "@/config/localized-slugs";

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

export const routes = {
  introduction: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "introduction")}`,
  guide: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "guide")}`,
  question: (segments: RouteSegments, questionNumber: number, locale: string = appConfig.i18n.defaultLocale) =>
    `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "question")}/${questionNumber}`,
  review: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "review")}`,
  result: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "result")}`,
  publicResult: (segments: RouteSegments, publicId: string, locale: string = appConfig.i18n.defaultLocale) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "result")}/${publicId}`,
  comparison: (segments: RouteSegments, locale: string = appConfig.i18n.defaultLocale) => `/${createBaseSegment(segments)}/${getLocalizedSlug(locale, "comparison")}`,
} as const;
