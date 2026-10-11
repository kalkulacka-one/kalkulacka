import { withDefaults } from "@kalkulacka-one/next/config";

export const appConfig = withDefaults({
  domainPath: "www.volebnikalkulacka.cz",

  i18n: {
    defaultLocale: "cs",
    locales: ["cs"],
    localePrefix: "as-needed" as const,
  },

  links: {
    privacy: "/soukromi",
  },

  calculators: [
    { group: "senatni-2026", campaign: true },
    { group: "komunalni-2026", campaign: true },
    ...["kalkulacka", "expresni", "kompas", "klimaticka", "inventura", "ultimatni", "pro-mlade"].map((key) => ({ group: "snemovni-2025", key })),
  ],

  sitemap: {
    pages: ["/o-projektu", "/metodika", "/zapojte-se", "/soukromi", "/volby/snemovni-2025"],
  },

  footer: {
    statusUrl: "https://status.volebnikalkulacka.cz",
  },
});
