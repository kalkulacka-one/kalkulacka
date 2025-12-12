import type { ReactNode } from "react";
import { IntlProvider } from "react-intl";

import type { SupportedLocale } from "@/locales";

export type LocaleProvider = {
  locale: SupportedLocale;
  messages: Record<string, string>;
  children: ReactNode;
};

export function LocaleProvider({ locale, messages, children }: LocaleProvider) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
