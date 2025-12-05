import { withDefaults } from "@kalkulacka-one/next";

import { routing } from "../i18n/routing";

/**
 * App configuration.
 * i18n config is sourced from i18n/routing.ts (single source of truth).
 */
export const appConfig = withDefaults({
  domainPath: "www.volebnikalkulacka.cz",

  i18n: {
    defaultLocale: routing.defaultLocale,
    locales: routing.locales,
    localePrefix: "as-needed" as const,
  },

  footer: {
    statusUrl: "https://status.volebnikalkulacka.cz",
  },
});
