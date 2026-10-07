import { buildSitemap, now } from "@kalkulacka-one/next";

import type { MetadataRoute } from "next";

import { appConfig } from "@/config/app-config";
import { getPrefixSlug } from "@/config/localized-slugs";
import { canonical } from "@/lib/routing";

export const revalidate = 3600;

function endpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locale = appConfig.i18n.defaultLocale;
  return buildSitemap({
    endpoint: endpoint(),
    calculators: appConfig.calculators,
    pages: appConfig.sitemap.pages,
    canonical,
    prefix: getPrefixSlug(locale, "election"),
    locale,
    current: now(),
  });
}
