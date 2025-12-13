import schemas from "@kalkulacka-one/schema/json";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, "..");
const buildDir = path.join(packageRoot, "build");

fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

for (const [schemaName, schemaData] of Object.entries(schemas.schemas)) {
  const filePath = path.join(buildDir, `${schemaName}.schema.json`);
  fs.writeFileSync(filePath, JSON.stringify(schemaData, null, 2));
}

for (const [schemaName, docsContent] of Object.entries(schemas.docs)) {
  const filePath = path.join(buildDir, `${schemaName}.md`);
  fs.writeFileSync(filePath, docsContent);
}
