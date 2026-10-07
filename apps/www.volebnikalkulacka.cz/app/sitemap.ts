import { ifFound, loadCalculatorGroup } from "@kalkulacka-one/app";
import { now } from "@kalkulacka-one/next";

import type { MetadataRoute } from "next";

import { canonical } from "@/lib/routing";
import { CALCULATOR_GROUPS, publishedCalculator } from "@/lib/site/calculators";

export const revalidate = 3600;

const PREFIX = "volby";
const PAGES = ["/o-projektu", "/metodika", "/zapojte-se", "/soukromi", "/volby/snemovni-2025"];

function endpoint(): string {
  if (!process.env.DATA_ENDPOINT) {
    throw new Error("DATA_ENDPOINT environment variable is not set");
  }
  return process.env.DATA_ENDPOINT;
}

async function groupUrls(groupKey: string, current: Date): Promise<string[]> {
  const group = await ifFound(loadCalculatorGroup({ endpoint: endpoint(), group: groupKey }));
  if (!group) return [];
  const calculators = await Promise.all(group.calculators.map(async (item) => ({ item, calculator: await publishedCalculator({ endpoint: endpoint(), group: groupKey, key: item.key, current }) })));
  const published = calculators.filter(({ calculator }) => calculator).map(({ item }) => item);
  if (published.length === 0) return [];
  const districts = published.map((item) => ("district" in item ? item.district?.key : undefined) ?? item.key);
  const districtPickers = [...new Set(districts.filter((district, index) => districts.indexOf(district) !== index))].map((district) =>
    canonical.base({ first: PREFIX, second: groupKey, third: district }),
  );
  const introductions = published.map((item) => canonical.introduction({ first: PREFIX, second: groupKey, third: item.key }, "cs"));
  return [canonical.base({ first: PREFIX, second: groupKey }), ...districtPickers, ...introductions];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const current = now();
  const groups = await Promise.all(CALCULATOR_GROUPS.map((group) => groupUrls(group, current)));
  const pages = [canonical.homepage(), ...PAGES.map((path) => `${canonical.homepage().replace(/\/$/, "")}${path}`)];
  return [...pages, ...groups.flat()].map((url) => ({ url }));
}
