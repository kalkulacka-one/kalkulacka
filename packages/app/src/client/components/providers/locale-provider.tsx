import { type AbstractIntlMessages, IntlProvider } from "next-intl";
import type { ReactNode } from "react";

import type { SupportedLocale } from "@/locales";

export type LocaleProvider = {
  locale: SupportedLocale;
  messages: AbstractIntlMessages;
  children: ReactNode;
};

export function LocaleProvider({ locale, messages, children }: LocaleProvider) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
