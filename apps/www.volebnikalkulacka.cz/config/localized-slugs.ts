import { createLocalizedSlugs } from "@kalkulacka-one/next";

import csMessages from "../messages/cs.json";

export type PageType = keyof (typeof csMessages)["routing"]["pages"];
export type PrefixType = keyof (typeof csMessages)["routing"]["prefixes"];

export const { PAGE_SLUGS, PREFIX_SLUGS, getPageSlug, getPrefixSlug } = createLocalizedSlugs({ messagesByLocale: { cs: csMessages } });
