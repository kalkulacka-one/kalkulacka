import { withDefaults } from "@kalkulacka-one/next";

export const appConfig = withDefaults({
  domainPath: "www.volebnikalkulacka.cz",

  i18n: {
    defaultLocale: "cs",
    locales: ["cs"],
  },

  footer: {
    statusUrl: "https://status.volebnikalkulacka.cz",
  },
});
