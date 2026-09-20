import { createLocalizedSlugs } from "@kalkulacka-one/next";

import { routeSlugs } from "./route-slugs";

export type PageType = keyof (typeof routeSlugs)["sk"]["pages"];
export type PrefixType = keyof (typeof routeSlugs)["sk"]["prefixes"];

export const { PAGE_SLUGS, PREFIX_SLUGS, getPageSlug, getPrefixSlug } = createLocalizedSlugs({ slugsByLocale: routeSlugs });
