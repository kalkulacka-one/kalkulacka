import { type IntlConfig, IntlProvider as ReactIntlProvider } from "react-intl";
import csMessages from "../../i18n/cs.json";
import enMessages from "../../i18n/en.json";

type IntlProvider = {
  children: React.ReactNode;
  locale: string;
} & IntlConfig;

// write better
type Message = Record<string, string>;

type Messages = Record<string, Message>;

const messages: Messages = {
  cs: csMessages,
  en: enMessages,
};

export function IntlProvider({ children, locale, ...props }: IntlProvider) {
  return (
    <ReactIntlProvider locale={locale} messages={messages[locale]} {...props}>
      {children}
    </ReactIntlProvider>
  );
}
