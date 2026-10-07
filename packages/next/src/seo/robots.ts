import type { PageType } from "@/routing/localized-slugs";

export function buildRobotsTxt({ allow, pageSlugs, sitemap }: { allow: boolean; pageSlugs: Record<string, Record<PageType, string>>; sitemap?: string }): string {
  if (!allow) {
    return "User-agent: *\nDisallow: /\n";
  }

  const lines = ["User-agent: *", "Allow: /api/images/", "Disallow: /api/"];

  const slugRules = new Set<string>();
  for (const slugs of Object.values(pageSlugs)) {
    slugRules.add(`Disallow: /*/${slugs.review}`);
    slugRules.add(`Disallow: /*/${slugs.result}`);
    slugRules.add(`Allow: /*/${slugs.result}/`);
  }

  const sitemapLines = sitemap ? ["", `Sitemap: ${sitemap}`] : [];

  return `${[...lines, ...slugRules, ...sitemapLines].join("\n")}\n`;
}
