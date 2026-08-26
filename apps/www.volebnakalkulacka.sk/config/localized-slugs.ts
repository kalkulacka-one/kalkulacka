import { createLocalizedSlugs } from "@kalkulacka-one/next";

import skMessages from "../messages/sk.json";

export type PageType = keyof (typeof skMessages)["routing"]["pages"];
export type PrefixType = keyof (typeof skMessages)["routing"]["prefixes"];

export const { PAGE_SLUGS, PREFIX_SLUGS, getPageSlug, getPrefixSlug } = createLocalizedSlugs({ messagesByLocale: { sk: skMessages } });
