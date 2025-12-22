import { withDefaults } from "@kalkulacka-one/next";

export const appConfig = withDefaults({
  domainPath: "www.voksmonitor.hu",

  i18n: {
    defaultLocale: "hu",
    locales: ["hu"],
  },
});
