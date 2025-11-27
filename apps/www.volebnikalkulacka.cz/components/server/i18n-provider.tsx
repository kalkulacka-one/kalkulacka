import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing } from "@/i18n/routing";

export async function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const messages = await getMessages({ locale });

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
