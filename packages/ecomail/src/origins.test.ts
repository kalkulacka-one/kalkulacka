import { describe, expect, it } from "vitest";

import { parseOrigins, subscriptionsQuery } from "./origins.ts";

describe("parseOrigins", () => {
  it("trims entries and drops empties and duplicates", () => {
    expect(parseOrigins(" subscribe-form, import-2022 ,,subscribe-form, ")).toEqual(["subscribe-form", "import-2022"]);
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["blank", "  "],
  ])("rejects a %s value", (_, raw) => {
    expect(() => parseOrigins(raw)).toThrow(/ECOMAIL_ORIGINS is not set/);
  });

  it("rejects a value without any origin", () => {
    expect(() => parseOrigins(" , ,")).toThrow(/ECOMAIL_ORIGINS must list at least one origin/);
  });
});

describe("subscriptionsQuery", () => {
  it("loads only rows of the given origins", () => {
    expect(subscriptionsQuery(["subscribe-form", "import-2022"]).where).toEqual({ origin: { in: ["subscribe-form", "import-2022"] } });
  });
});
