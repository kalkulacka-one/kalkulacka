import fs from 'fs';
import path from 'path';

// Path to the directory containing your .d.ts files
const distDir = path.join(__dirname, '../dist');
const indexFilePath = path.join(distDir, 'index.d.ts');

// Read all files in the dist directory
const files = fs.readdirSync(distDir)
  .filter(file => file.endsWith('.d.ts') && file !== 'index.d.ts');

// Create export statements for each .d.ts file
const exportLines = files.map(file => {
  const fileNameWithoutExt = path.basename(file, '.d.ts');
  return `export * from './${fileNameWithoutExt}';`;
}).join('\n');

// Write the index.d.ts file
fs.writeFileSync(indexFilePath, exportLines);

console.log(`index.d.ts generated with ${files.length} exports.`);
