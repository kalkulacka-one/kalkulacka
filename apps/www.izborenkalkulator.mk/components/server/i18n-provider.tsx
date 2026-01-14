import { mkMessages, type SupportedLocale } from "@kalkulacka-one/app";

import { notFound } from "next/navigation";
import type { AbstractIntlMessages } from "next-intl";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";

const APP_MESSAGES: Partial<Record<SupportedLocale, AbstractIntlMessages>> = {
  mk: mkMessages,
};

export async function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });
  setRequestLocale(locale);

  const appMessages = APP_MESSAGES[locale as SupportedLocale];
  if (!appMessages) {
    throw new Error(`Missing app messages for locale: ${locale}`);
  }

  const mergedMessages = {
    ...appMessages,
    ...messages,
  };

  return <NextIntlClientProvider messages={mergedMessages}>{children}</NextIntlClientProvider>;
}
