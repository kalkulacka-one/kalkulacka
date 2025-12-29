import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export async function GET() {
  const filePath = join(currentDir, "../../../lib/site/security", "security.txt");
  const securityTxt = readFileSync(filePath, "utf-8");

  return new Response(securityTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
