// Conformance suite (contract T14): every fixture must produce its expected verdict.
// Run with `npm run scope:conformance`. Protected: agents never edit.

import { describe, expect, it } from "vitest";

import { classify } from "../scripts/classify.ts";
import { cases } from "./cases.ts";

describe("scope classifier conformance", () => {
  for (const conformanceCase of cases) {
    it(conformanceCase.name, () => {
      const result = classify(conformanceCase.files);
      expect(result.verdict).toBe(conformanceCase.expect.verdict);
      if (conformanceCase.expect.tags) expect(result.tags).toEqual(conformanceCase.expect.tags);
      if (conformanceCase.expect.instances) expect(result.instances).toEqual(conformanceCase.expect.instances);
    });
  }
});
