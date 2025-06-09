import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemasDir = path.join(__dirname, "schemas");

const schemas = {};
const docs = {};

for (const file of fs.readdirSync(schemasDir)) {
  const fullPath = path.join(schemasDir, file);

  if (file.endsWith(".schema.json")) {
    const schemaName = path.basename(file, ".schema.json");
    schemas[schemaName] = JSON.parse(fs.readFileSync(fullPath, "utf8"));
  }

  if (file.endsWith(".md")) {
    const schemaName = path.basename(file, ".md");
    docs[schemaName] = fs.readFileSync(fullPath, "utf8");
  }
}

export default { schemas, docs };
