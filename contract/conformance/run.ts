// Conformance runner (contract T14): every fixture must produce its expected verdict.

import { classify } from "../scopes.config.ts";
import { cases } from "./cases.ts";

let failures = 0;
for (const conformanceCase of cases) {
  const result = classify(conformanceCase.files);
  const problems: string[] = [];
  if (result.verdict !== conformanceCase.expect.verdict) problems.push(`verdict ${result.verdict} ≠ ${conformanceCase.expect.verdict}`);
  if (conformanceCase.expect.tags && JSON.stringify(result.tags) !== JSON.stringify(conformanceCase.expect.tags)) problems.push(`tags ${result.tags.join(",")} ≠ ${conformanceCase.expect.tags.join(",")}`);
  if (conformanceCase.expect.instances && JSON.stringify(result.instances) !== JSON.stringify(conformanceCase.expect.instances)) problems.push(`instances ${result.instances.join(",")} ≠ ${conformanceCase.expect.instances.join(",")}`);
  if (problems.length > 0) {
    failures += 1;
    console.error(`✗ ${conformanceCase.name}: ${problems.join("; ")}`);
  } else {
    console.log(`✓ ${conformanceCase.name}`);
  }
}
if (failures > 0) {
  console.error(`\n${failures} conformance case(s) failed – the classifier violates the contract.`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} conformance cases pass.`);
