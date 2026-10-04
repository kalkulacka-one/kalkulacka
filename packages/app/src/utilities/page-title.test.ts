import { describe, expect, it } from "vitest";

import { prefixPageTitle, replacePageTitle } from "./page-title";

describe("prefixPageTitle", () => {
  it("should put the page title in front", () => {
    expect(prefixPageTitle("Návod", "Senátní volby 2026")).toBe("Návod · Senátní volby 2026");
  });
});

describe("replacePageTitle", () => {
  it("should swap the page title and keep the rest", () => {
    expect(replacePageTitle("Otázka 1/30 · Senátní volby 2026 — Volební kalkulačka", "Otázka 2/30")).toBe("Otázka 2/30 · Senátní volby 2026 — Volební kalkulačka");
  });

  it("should keep separators inside the calculator title", () => {
    expect(replacePageTitle("Otázka 1/30 · A · B", "Otázka 2/30")).toBe("Otázka 2/30 · A · B");
  });

  it("should leave a title without a page title unchanged", () => {
    expect(replacePageTitle("Senátní volby 2026", "Otázka 2/30")).toBe("Senátní volby 2026");
  });
});
