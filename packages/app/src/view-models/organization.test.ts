import type { Organization } from "@kalkulacka-one/schema";

import { describe, expect, it } from "vitest";

import { organizationViewModel } from "./organization";

const baseUrl = "https://data.kalkulacka.one/kalkulacka";

const organization = (fields: Partial<Organization>): Organization => ({ id: "94c3d32d-7915-4a07-bd99-d54cd1e53063", name: "Svoboda a přímá demokracie", ...fields });

describe("organizationViewModel", () => {
  it("keeps the full name and derives the short one from shortName first", () => {
    const model = organizationViewModel(organization({ shortName: "SPD", abbreviation: "SPD" }), baseUrl);
    expect(model.name).toBe("Svoboda a přímá demokracie");
    expect(model.shortName).toBe("SPD");
    // The legacy screens' name is untouched: still the short form.
    expect(model.displayName).toBe("SPD");
  });

  it("falls back to the abbreviation, then to the full name", () => {
    expect(organizationViewModel(organization({ abbreviation: "MZH" }), baseUrl).shortName).toBe("MZH");
    expect(organizationViewModel(organization({}), baseUrl).shortName).toBe("Svoboda a přímá demokracie");
  });

  it("resolves the avatar against the calculator's base URL", () => {
    const model = organizationViewModel(organization({ images: [{ type: "logo", urls: { original: "images/spd.png" } }] }), baseUrl);
    expect(model.avatar).toEqual({ type: "logo", urls: { original: `${baseUrl}/images/spd.png` } });
  });
});
