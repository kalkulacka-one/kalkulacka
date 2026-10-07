import type { MetadataRoute } from "next";

import { loadListedCalculator, loadPublishedCalculators } from "@/listing";
import { buildCanonicalUrl, type Canonical } from "@/routing/factories/url-builders";
import type { ListedCalculator } from "@/types/app-config";

type SitemapInput = {
  endpoint: string;
  calculators: readonly ListedCalculator[];
  pages: readonly string[];
  canonical: Canonical;
  prefix: string;
  locale: string;
  current: Date;
};

async function groupUrls({ endpoint, group, canonical, prefix, locale, current }: Omit<SitemapInput, "calculators" | "pages"> & { group: string }): Promise<string[]> {
  const published = await loadPublishedCalculators({ endpoint, group, current });
  if (!published?.length) return [];
  const districts = published.map(({ item }) => ("district" in item ? item.district?.key : undefined) ?? item.key);
  // A district with several variants gets its own picker; a single-variant district redirects to its introduction
  const districtPickers = [...new Set(districts.filter((district, index) => districts.indexOf(district) !== index))].map((district) =>
    canonical.base({ first: prefix, second: group, third: district }),
  );
  const introductions = published.map(({ item }) => canonical.introduction({ first: prefix, second: group, third: item.key }, locale));
  return [canonical.base({ first: prefix, second: group }), ...districtPickers, ...introductions];
}

async function calculatorUrls({ endpoint, group, key, canonical, prefix, locale, current }: Omit<SitemapInput, "calculators" | "pages"> & { group?: string; key: string }): Promise<string[]> {
  const calculator = await loadListedCalculator({ endpoint, group, key, current });
  if (!calculator) return [];
  return [canonical.introduction(group ? { first: prefix, second: group, third: key } : { first: key }, locale)];
}

function entryUrls(entry: ListedCalculator, input: Omit<SitemapInput, "calculators" | "pages">): Promise<string[]> {
  if (entry.group === undefined) return calculatorUrls({ ...input, key: entry.key });
  if (entry.key === undefined) return groupUrls({ ...input, group: entry.group });
  return calculatorUrls({ ...input, group: entry.group, key: entry.key });
}

export async function buildSitemap({ calculators, pages, ...input }: SitemapInput): Promise<MetadataRoute.Sitemap> {
  const listed = await Promise.all(calculators.map((entry) => entryUrls(entry, input)));
  const urls = [input.canonical.homepage(), ...pages.map((path) => buildCanonicalUrl(path)), ...listed.flat()];
  return [...new Set(urls)].map((url) => ({ url }));
}
