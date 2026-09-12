import { describe, expect, it } from "vitest";

import { toProxiedAssetUrl } from "./share-asset-url";

const calculator = { assetBase: "https://data.kalkulacka.one/www.volebnikalkulacka.cz/snemovni-2025/kalkulacka", group: "snemovni-2025", key: "kalkulacka" };

describe("toProxiedAssetUrl", () => {
  it("routes one of the calculator's own pictures through the proxy, group and key put back in front", () => {
    expect(toProxiedAssetUrl(`${calculator.assetBase}/images/abc/logo.md.webp`, calculator)).toBe("/api/assets/snemovni-2025/kalkulacka/images/abc/logo.md.webp");
  });

  it("addresses a standalone calculator by its key alone", () => {
    const standalone = { assetBase: "https://data.kalkulacka.one/www.volebnikalkulacka.cz/prezidentske-2023", key: "prezidentske-2023" };
    expect(toProxiedAssetUrl(`${standalone.assetBase}/images/logo.png`, standalone)).toBe("/api/assets/prezidentske-2023/images/logo.png");
  });

  it("leaves anything that is not one of the calculator's own pictures alone", () => {
    expect(toProxiedAssetUrl("https://elsewhere.example/logo.png", calculator)).toBe("https://elsewhere.example/logo.png");
    expect(toProxiedAssetUrl(calculator.assetBase, calculator)).toBe(calculator.assetBase);
    expect(toProxiedAssetUrl(undefined, calculator)).toBeUndefined();
  });
});
