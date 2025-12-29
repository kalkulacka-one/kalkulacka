import { hasLocale } from "next-intl";

import { appConfig } from "@/config/app-config";
import { PREFIX_SLUGS } from "@/config/localized-slugs";
import { routing } from "@/i18n/routing";

const defaultLocale = appConfig.i18n.defaultLocale;
if (!hasLocale(routing.locales, defaultLocale)) {
  throw new Error(`Invalid defaultLocale: "${defaultLocale}"`);
}

export const PREFIXES = routing.locales.flatMap((locale) => Object.values(PREFIX_SLUGS[locale] || {}));
