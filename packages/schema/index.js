import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemasDir = path.join(__dirname, "schemas");

const schemas = {};

fs.readdirSync(schemasDir).forEach((file) => {
  if (file.endsWith(".schema.json")) {
    const schemaName = path.basename(file, ".schema.json");
    schemas[schemaName] = JSON.parse(fs.readFileSync(path.join(schemasDir, file), "utf8"));
  }
});

export default schemas;
