import { describe, expect, it } from "vitest";

import { buildDataUrl } from "./url-builders";

const ENDPOINT = "https://data.kalkulacka.one/www.volebnikalkulacka.cz";

describe("buildDataUrl", () => {
  it("should build a url for a calculator in a group", () => {
    expect(buildDataUrl({ endpoint: ENDPOINT, key: "kalkulacka", group: "snemovni-2025", resourcePath: "calculator.json" })).toBe(`${ENDPOINT}/snemovni-2025/kalkulacka/calculator.json`);
  });

  it("should build a url for a standalone calculator", () => {
    expect(buildDataUrl({ endpoint: ENDPOINT, key: "kompas-2025" })).toBe(`${ENDPOINT}/kompas-2025`);
  });

  it("should reject a key that climbs out of the endpoint", () => {
    expect(() => buildDataUrl({ endpoint: ENDPOINT, key: "../www.volebnakalkulacka.sk/inventura-2023-2025" })).toThrowError(new Error("Invalid calculator path"));
  });

  it("should reject a group that climbs out of the endpoint", () => {
    expect(() => buildDataUrl({ endpoint: ENDPOINT, key: "kalkulacka", group: ".." })).toThrowError(new Error("Invalid calculator path"));
  });

  it("should reject a key that leaves the host", () => {
    expect(() => buildDataUrl({ endpoint: "https://data.kalkulacka.one", key: "//example.com/x" })).toThrowError(new Error("Invalid calculator path"));
  });

  it("should throw on an invalid endpoint", () => {
    expect(() => buildDataUrl({ endpoint: "not-a-url", key: "kalkulacka" })).toThrowError(new Error("Invalid endpoint"));
  });
});
