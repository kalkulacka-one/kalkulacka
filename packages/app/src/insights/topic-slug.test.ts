import { describe, expect, it } from "vitest";

import { topicFromSlug, topicSlug } from "./topic-slug";

describe("topicSlug", () => {
  it("strips diacritics and lowercases", () => {
    expect(topicSlug("Životní prostředí")).toBe("zivotni-prostredi");
    expect(topicSlug("Školství")).toBe("skolstvi");
  });

  it("collapses every run of non-alphanumerics into one hyphen and trims the ends", () => {
    expect(topicSlug("Kultura a sport")).toBe("kultura-a-sport");
    expect(topicSlug("  Doprava / parkování  ")).toBe("doprava-parkovani");
    expect(topicSlug("Rozpočet, finance & daně")).toBe("rozpocet-finance-dane");
  });

  it("keeps digits", () => {
    expect(topicSlug("Agenda 2030")).toBe("agenda-2030");
  });

  it("is empty for a topic with nothing to keep", () => {
    expect(topicSlug("—")).toBe("");
  });
});

describe("topicFromSlug", () => {
  const topics = ["Doprava", "Životní prostředí", "Veřejný pořádek"];

  it("finds the topic a slug was made from", () => {
    expect(topicFromSlug("zivotni-prostredi", topics)).toBe("Životní prostředí");
    expect(topicFromSlug("verejny-poradek", topics)).toBe("Veřejný pořádek");
  });

  it("is undefined for a slug that matches nothing, or no slug at all", () => {
    expect(topicFromSlug("vesmir", topics)).toBeUndefined();
    expect(topicFromSlug(undefined, topics)).toBeUndefined();
    expect(topicFromSlug("", topics)).toBeUndefined();
  });
});
