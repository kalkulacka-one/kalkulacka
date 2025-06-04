import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { jsonSchemaToZod } from "json-schema-to-zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemasDir = path.join(__dirname, "..", "schemas");
const outDir = path.join(__dirname, "..", "zod");
fs.mkdirSync(outDir, { recursive: true });

const schemaFiles = fs.readdirSync(schemasDir).filter((f) => f.endsWith(".schema.json"));

const exportsIndex = [];
for (const file of schemaFiles) {
  const schemaPath = path.join(schemasDir, file);
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const baseName = path.basename(file, ".schema.json");
  const varName = camelCase(baseName);
  const typeName = pascalCase(baseName);
  const code = jsonSchemaToZod(schema, { name: varName, module: "esm", type: typeName });
  const outFile = path.join(outDir, `${baseName}.ts`);
  fs.writeFileSync(outFile, code);
  exportsIndex.push(`export { ${varName}, type ${typeName} } from './${baseName}.js';`);
}

function camelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function pascalCase(str) {
  const cc = camelCase(str);
  return cc.charAt(0).toUpperCase() + cc.slice(1);
}

// Create index.ts exporting all schemas and types
const indexTsContent = `${exportsIndex.join("\n")}\n`;
fs.writeFileSync(path.join(outDir, "index.ts"), indexTsContent);
