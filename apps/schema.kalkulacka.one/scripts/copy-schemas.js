import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import schemas from "@repo/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, "..");
const buildDir = path.join(packageRoot, "build");

fs.mkdirSync(buildDir, { recursive: true });

for (const [schemaName, schemaData] of Object.entries(schemas.schemas)) {
  const filePath = path.join(buildDir, `${schemaName}.schema.json`);
  fs.writeFileSync(filePath, JSON.stringify(schemaData, null, 2));
}

for (const file of fs.readdirSync(buildDir)) {
  if (file.endsWith(".md")) {
    fs.unlinkSync(path.join(buildDir, file));
  }
}

for (const [schemaName, docsContent] of Object.entries(schemas.docs)) {
  const filePath = path.join(buildDir, `${schemaName}.md`);
  fs.writeFileSync(filePath, docsContent);
}
