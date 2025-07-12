import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["cs", "en"],
  defaultLocale: "cs",
  pathnames: {
    "/": "/",
    "/podporte-kalkulacku": {
      en: "/support-us",
    },
    "/vlastni-kalkulacka": {
      en: "/custom-calulator",
    },
    "/zapojte-se": {
      en: "/volunteer",
    },
  },
});
