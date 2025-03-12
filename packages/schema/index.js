import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemasDir = path.join(__dirname, 'schemas');

const schemas = {};

for (const file of fs.readdirSync(schemasDir)) {
	if (file.endsWith('.schema.json')) {
		const schemaName = path.basename(file, '.schema.json');
		schemas[schemaName] = JSON.parse(fs.readFileSync(path.join(schemasDir, file), 'utf8'));
	}
}

export default schemas;
