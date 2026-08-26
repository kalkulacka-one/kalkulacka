import { buildCanonicalUrl, createRouting, type RouteSegments } from "@kalkulacka-one/next";

import { appConfig } from "@/config/app-config";
import { PAGE_SLUGS, PREFIX_SLUGS } from "@/config/localized-slugs";

export const { routes, canonical, mappedParams, parsedParams, PREFIXES } = createRouting({ i18n: appConfig.i18n, pageSlugs: PAGE_SLUGS, prefixSlugs: PREFIX_SLUGS });

export { buildCanonicalUrl };
export type { RouteSegments };
