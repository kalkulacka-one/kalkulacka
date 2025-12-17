import { withDefaults } from "@kalkulacka-one/next";

export const appConfig = withDefaults({
  domainPath: "www.izborenkalkulator.mk",

  i18n: {
    defaultLocale: "mk",
    locales: ["mk"],
  },
});
