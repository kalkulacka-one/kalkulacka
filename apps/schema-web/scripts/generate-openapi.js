import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, '..');
const buildDir = path.join(packageRoot, 'build');
const outputFile = path.join(buildDir, 'openapi.yaml');

const schemaFiles = fs.readdirSync(buildDir).filter((file) => file.endsWith('.json'));

const version = JSON.parse(fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.resolve('@repo/schema'))), 'package.json'), 'utf-8')).version;

const openapiDoc = {
  openapi: '3.1.0',
  info: {
    title: 'Kalkulacka.1 schemas',
    version,
    description: 'Schemas of data for voting advice applications.',
  },
  tags: [],
  components: { schemas: {} },
};

const sortedSchemaFiles = schemaFiles.sort();

for (const file of sortedSchemaFiles) {
  const filePath = path.join(buildDir, file);
  const schemaContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const schemaName = path.basename(file, '.schema.json');
  openapiDoc.components.schemas[schemaName] = { $ref: `./${file}` };

  const name = schemaContent.title;
  let description = `Schema URL: [${schemaContent.$id}](${schemaContent.$id})\n\n`;
  description += schemaContent.description ? `${schemaContent.description}\n\n` : '';
  description += `<SchemaDefinition schemaRef="#/components/schemas/${schemaName}" />`;

  openapiDoc.tags.push({
    name,
    description,
  });
}

const yamlContent = yaml.stringify(openapiDoc);

fs.writeFileSync(outputFile, yamlContent, 'utf8');
