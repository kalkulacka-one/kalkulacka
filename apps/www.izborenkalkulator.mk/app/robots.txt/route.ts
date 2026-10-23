import { allowCrawling, buildRobotsTxt } from "@kalkulacka-one/next";

import { PAGE_SLUGS } from "@/config/localized-slugs";
import { buildCanonicalUrl } from "@/lib/routing";

export async function GET() {
  const robotsTxt = buildRobotsTxt({ allow: allowCrawling(), pageSlugs: PAGE_SLUGS, sitemap: buildCanonicalUrl("/sitemap.xml") });

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
