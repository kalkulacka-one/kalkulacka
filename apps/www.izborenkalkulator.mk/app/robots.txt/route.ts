import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { allowCrawling } from "@/lib/seo";

const currentDir = dirname(fileURLToPath(import.meta.url));

export async function GET() {
  const allowIndexing = allowCrawling();
  const fileName = allowIndexing ? "robots.txt.production" : "robots.txt.staging";
  const filePath = join(currentDir, "../../lib/seo/robots", fileName);

  const robotsTxt = readFileSync(filePath, "utf-8");

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
