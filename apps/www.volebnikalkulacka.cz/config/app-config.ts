import type { AppConfig } from "@kalkulacka-one/next";

export const appConfig: AppConfig = {
  domainPath: "www.volebnikalkulacka.cz",

  i18n: {
    defaultLocale: "cs",
    locales: ["cs"],
  },

  footer: {
    statusUrl: "https://status.volebnikalkulacka.cz",
  },
};
