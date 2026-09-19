import skMessages from "@kalkulacka-one/app/locales/sk.json";

import type { AbstractIntlMessages } from "next-intl";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "@/i18n/routing";

const PACKAGE_MESSAGES: Partial<Record<string, AbstractIntlMessages>> = {
  sk: skMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const packageMessages = PACKAGE_MESSAGES[locale];
  if (!packageMessages) {
    throw new Error(`Missing package messages for locale: ${locale}`);
  }

  return {
    locale,
    messages: { ...packageMessages, ...(await import(`@/messages/${locale}.json`)).default },
  };
});
