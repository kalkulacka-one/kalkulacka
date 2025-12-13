import { withDefaults } from "@kalkulacka-one/next";

export const appConfig = withDefaults({
  domainPath: "volebnakalkulacka.sk",

  i18n: {
    defaultLocale: "sk",
    locales: ["sk"],
  },
});
