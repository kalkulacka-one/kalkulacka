import { describe, expect, it } from "vitest";

import { toProxiedAssetUrl } from "./share-asset-url";

// This site's one calculator is standalone: addressed under the endpoint by its key alone.
const calculator = { assetBase: "https://data.kalkulacka.one/www.izborenkalkulator.mk/kompas-2025", key: "kompas-2025" };

describe("toProxiedAssetUrl", () => {
  it("routes one of the calculator's own pictures through the proxy, addressed by the calculator's key", () => {
    expect(toProxiedAssetUrl(`${calculator.assetBase}/images/abc/logo.md.webp`, calculator)).toBe("/api/assets/kompas-2025/images/abc/logo.md.webp");
  });

  it("puts a group calculator's group back in front of its key", () => {
    const grouped = { assetBase: "https://data.kalkulacka.one/www.izborenkalkulator.mk/parlamentarni-2028/kalkulator", group: "parlamentarni-2028", key: "kalkulator" };
    expect(toProxiedAssetUrl(`${grouped.assetBase}/images/logo.png`, grouped)).toBe("/api/assets/parlamentarni-2028/kalkulator/images/logo.png");
  });

  it("leaves anything that is not one of the calculator's own pictures alone", () => {
    expect(toProxiedAssetUrl("https://elsewhere.example/logo.png", calculator)).toBe("https://elsewhere.example/logo.png");
    expect(toProxiedAssetUrl(calculator.assetBase, calculator)).toBe(calculator.assetBase);
    expect(toProxiedAssetUrl(undefined, calculator)).toBeUndefined();
  });
});
