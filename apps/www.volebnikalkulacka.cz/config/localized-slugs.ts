import type { Locale, Messages } from "next-intl";
import { hasLocale } from "next-intl";

import { routing } from "../i18n/routing";
import csMessages from "../messages/cs.json";

export type PageType = keyof Messages["routing"]["pages"];
export type PrefixType = keyof Messages["routing"]["prefixes"];

const MESSAGES_BY_LOCALE: Record<Locale, Messages> = {
  cs: csMessages,
};

export const PREFIX_SLUGS = Object.fromEntries(Object.entries(MESSAGES_BY_LOCALE).map(([locale, messages]) => [locale, messages.routing.prefixes])) as Record<Locale, Messages["routing"]["prefixes"]>;
export const PAGE_SLUGS = Object.fromEntries(Object.entries(MESSAGES_BY_LOCALE).map(([locale, messages]) => [locale, messages.routing.pages])) as Record<Locale, Messages["routing"]["pages"]>;

export function getPageSlug(locale: Locale, pageType: PageType): string {
  if (!hasLocale(routing.locales, locale)) {
    throw new Error(`Invalid locale: "${locale}". Valid locales are: ${routing.locales.join(", ")}`);
  }
  const localizedSlug = PAGE_SLUGS[locale]?.[pageType];
  if (localizedSlug) {
    return localizedSlug;
  }
  throw new Error(`Page type "${pageType}" not found for locale "${locale}".`);
}

export function getPrefixSlug(locale: Locale, prefixType: PrefixType): string {
  if (!hasLocale(routing.locales, locale)) {
    throw new Error(`Invalid locale: "${locale}". Valid locales are: ${routing.locales.join(", ")}`);
  }
  const prefixSlug = PREFIX_SLUGS[locale]?.[prefixType];
  if (prefixSlug) {
    return prefixSlug;
  }
  throw new Error(`Prefix type "${prefixType}" not found for locale "${locale}".`);
}
