import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, "..");
const buildDir = path.join(packageRoot, "build");
const outputFile = path.join(buildDir, "openapi.yaml");

const schemaFiles = fs.readdirSync(buildDir).filter((file) => file.endsWith(".schema.json"));
const schemaDocsFiles = new Set(fs.readdirSync(buildDir).filter((file) => file.endsWith(".md")));

const schemaPackagePath = fileURLToPath(import.meta.resolve("@kalkulacka-one/schema/package.json"));
const version = JSON.parse(fs.readFileSync(schemaPackagePath, "utf-8")).version;

const openapiDoc = {
  openapi: "3.1.0",
  info: {
    title: "Kalkulacka.1 schemas",
    version,
    description: "Schemas of data for voting advice applications.",
  },
  tags: [],
  components: { schemas: {} },
};

const sortedSchemaFiles = schemaFiles.sort();

for (const file of sortedSchemaFiles) {
  const filePath = path.join(buildDir, file);
  const schemaContent = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const schemaName = path.basename(file, ".schema.json");
  openapiDoc.components.schemas[schemaName] = { $ref: `./${file}` };

  const docsFilename = `${schemaName}.md`;
  const docsPath = path.join(buildDir, docsFilename);
  let docsContent = schemaDocsFiles.has(docsFilename) ? fs.readFileSync(docsPath, "utf8") : undefined;

  docsContent = [`[\`${schemaContent.$id}\`](${schemaContent.$id})`, docsContent || schemaContent.description || undefined, `<SchemaDefinition schemaRef="#/components/schemas/${schemaName}" />`]
    .filter(Boolean)
    .join("\n\n---\n\n");

  fs.writeFileSync(docsPath, docsContent, "utf8");

  openapiDoc.tags.push({
    name: schemaContent.title,
    description: { $ref: docsPath },
  });
}

const yamlContent = yaml.stringify(openapiDoc);

fs.writeFileSync(outputFile, yamlContent, "utf8");
