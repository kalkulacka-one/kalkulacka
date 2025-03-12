import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import schemas from '@repo/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, '..');
const buildDir = path.join(packageRoot, 'build');

fs.mkdirSync(buildDir, { recursive: true });

for (const [schemaName, schemaData] of Object.entries(schemas)) {
  fs.writeFileSync(path.join(buildDir, `${schemaName}.schema.json`), JSON.stringify(schemaData, null, 2));
}
