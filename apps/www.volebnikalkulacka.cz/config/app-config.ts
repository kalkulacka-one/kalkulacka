import type { AppConfig } from "@kalkulacka-one/next";

export const appConfig: AppConfig = {
  domainPath: "www.volebnikalkulacka.cz",

  i18n: {
    defaultLocale: "cs",
    locales: ["cs"],
    localePrefix: "as-needed",
  },

  theme: {
    defaultTheme: "default",
  },

  footer: {
    showStatus: true,
    statusUrl: "https://status.volebnikalkulacka.cz",
    showAnalytics: true,
  },
};
