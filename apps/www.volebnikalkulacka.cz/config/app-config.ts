import type { AppConfig } from "@kalkulacka-one/next";

export const appConfig: AppConfig = {
  domainPath: "www.volebnikalkulacka.cz",

  theme: {
    defaultTheme: "default",
  },

  footer: {
    showStatus: true,
    statusUrl: "https://status.volebnikalkulacka.cz",
    showAnalytics: true,
  },
};
