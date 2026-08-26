import { createLocalizedSlugs } from "@kalkulacka-one/next";

import mkMessages from "../messages/mk.json";

export type PageType = keyof (typeof mkMessages)["routing"]["pages"];
export type PrefixType = keyof (typeof mkMessages)["routing"]["prefixes"];

export const { PAGE_SLUGS, PREFIX_SLUGS, getPageSlug, getPrefixSlug } = createLocalizedSlugs({ messagesByLocale: { mk: mkMessages } });
