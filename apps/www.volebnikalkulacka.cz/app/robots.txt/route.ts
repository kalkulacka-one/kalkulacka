import { allowCrawling, buildRobotsTxt } from "@kalkulacka-one/next";

import { PAGE_SLUGS } from "@/config/localized-slugs";

export async function GET() {
  const robotsTxt = buildRobotsTxt({ allow: allowCrawling(), pageSlugs: PAGE_SLUGS });

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
