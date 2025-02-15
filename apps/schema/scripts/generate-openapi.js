import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, "..");
const buildDir = path.join(packageRoot, "build");
const outputFile = path.join(buildDir, "openapi.yaml");

const schemaFiles = fs.readdirSync(buildDir).filter(file => file.endsWith(".json"));

const openapiDoc = {
  openapi: "3.1.0",
  info: {
    title: "Kalkulacka.1 schemas",
    version: "0.1.0",
    description: "Schemas of data for voting advice applications.",
  },
  tags: [],
  "x-tagGroups": [{ name: "Schemas", tags: [] }],
  components: { schemas: {} },
};

schemaFiles.sort().forEach(file => {
  const filePath = path.join(buildDir, file);
  const schemaContent = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const schemaName = path.basename(file, ".schema.json");
  openapiDoc.components.schemas[schemaName] = { $ref: `./${file}` };

  const name = schemaContent.title;
  let description = schemaContent.description ? `${schemaContent.description}\n\n` : "";
  description += `<SchemaDefinition schemaRef="#/components/schemas/${schemaName}" />`;

  openapiDoc.tags.push({
    name,
    description,
  });

  openapiDoc["x-tagGroups"][0].tags.push(name);
});

const yamlContent = yaml.stringify(openapiDoc);

fs.writeFileSync(outputFile, yamlContent, "utf8");
