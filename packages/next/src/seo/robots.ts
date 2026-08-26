import type { PageType } from "@/routing/localized-slugs";

export function buildRobotsTxt({ allow, pageSlugs }: { allow: boolean; pageSlugs: Record<string, Record<PageType, string>> }): string {
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

  return `${[...lines, ...slugRules].join("\n")}\n`;
}
