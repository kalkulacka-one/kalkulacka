import { describe, expect, it } from "vitest";

import { normalizeForSearch } from "./normalize-for-search";

describe("normalizeForSearch", () => {
  it("strips the diacritics people leave off when typing", () => {
    expect(normalizeForSearch("Žďár nad Sázavou")).toBe("zdar nad sazavou");
    expect(normalizeForSearch("Ústí nad Labem")).toBe("usti nad labem");
    expect(normalizeForSearch("Plzeň-město")).toBe("plzen-mesto");
  });

  it("lowercases so the match is case-insensitive", () => {
    expect(normalizeForSearch("BRNO")).toBe("brno");
  });

  it("leaves a string with nothing to normalise alone", () => {
    expect(normalizeForSearch("kolin 42")).toBe("kolin 42");
  });
});
