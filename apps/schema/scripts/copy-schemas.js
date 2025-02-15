import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import schemas from "@repo/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, "..");
const buildDir = path.join(packageRoot, "build");

fs.mkdirSync(buildDir, { recursive: true });

Object.entries(schemas).forEach(([schemaName, schemaData]) => {
  fs.writeFileSync(
    path.join(buildDir, `${schemaName}.schema.json`),
    JSON.stringify(schemaData, null, 2)
  );
});
