import { createRewrites } from "@kalkulacka-one/next";

import { appConfig } from "./app-config";
import { PAGE_SLUGS, PREFIX_SLUGS } from "./localized-slugs";

export const { getSlugRewrites, getLocaleRewrites, getLocaleRedirects } = createRewrites({
  i18n: appConfig.i18n,
  pageSlugs: PAGE_SLUGS,
  prefixSlugs: PREFIX_SLUGS,
  unprefixedCalculatorRoutes: true,
});
