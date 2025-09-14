import { readFileSync } from "node:fs";
import { join } from "node:path";

import { allowCrawling } from "../../lib/seo";

export async function GET() {
  const allowIndexing = allowCrawling();
  const fileName = allowIndexing ? "robots.txt.production" : "robots.txt.staging";
  const filePath = join(process.cwd(), "lib", "seo", "robots", fileName);

  const robotsTxt = readFileSync(filePath, "utf-8");

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
