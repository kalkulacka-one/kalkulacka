import { withDefaults } from "@kalkulacka-one/next/config";

export const appConfig = withDefaults({
  domainPath: "www.volebnakalkulacka.sk",

  i18n: {
    defaultLocale: "sk",
    locales: ["sk"],
  },

  calculators: [{ key: "inventura-2023-2025" }],

  sitemap: {
    pages: ["/o-projekte", "/metodika", "/soukromi"],
  },

  links: {
    privacy: "/soukromi",
  },
});
