// Ported from kalkulacka-2026/apps/web/lib/topic-icons.test.ts
import { describe, expect, it } from "vitest";

import { topicIcon } from "./topic-icons";

describe("topicIcon", () => {
  it("covers every topic the Pardubice questions are tagged with", () => {
    const topics = ["Doprava", "Bydlení", "Energetika", "Školství", "Sociální politika", "Životní prostředí", "Kultura a sport", "Veřejný pořádek", "Rozpočet", "Transparentnost", "Veřejné služby"];

    expect(topics.filter((topic) => topicIcon(topic) === "topicOther")).toEqual([]);
  });

  it("matches on the stem, so an editorially longer tag lands on the same icon", () => {
    expect(topicIcon("Doprava a parkování")).toBe(topicIcon("Doprava"));
    expect(topicIcon("Školství a vzdělávání")).toBe(topicIcon("Školství"));
  });

  it("ignores case and diacritics", () => {
    expect(topicIcon("zivotni prostredi")).toBe(topicIcon("Životní prostředí"));
  });

  /* Both tags contain "veřejn"; only the order of the rules keeps them apart. */
  it('tells the two "veřejné" topics apart', () => {
    expect(topicIcon("Veřejný pořádek")).toBe("topicSafety");
    expect(topicIcon("Veřejné služby")).toBe("topicServices");
  });

  it("falls back rather than guessing at a tag it has never seen", () => {
    expect(topicIcon("Vesmírný program")).toBe("topicOther");
  });

  it("takes another site's rules in place of the Czech ones", () => {
    expect(topicIcon("Doprava", [[/vesmir/, "topicEnergy"]])).toBe("topicOther");
    expect(topicIcon("Vesmírný program", [[/vesmir/, "topicEnergy"]])).toBe("topicEnergy");
  });
});
