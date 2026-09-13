// Frozen-message content rules (contract: editorial tag). Protected: agents never edit.

import { describe, expect, it } from "vitest";

import { checkMessages } from "../scripts/messages.ts";

const base = JSON.stringify({ routing: { pages: { result: "vysledek" } }, calculator: { yes: "Ano" } });

describe("message content rules", () => {
  it("allows a value change", () => {
    const head = JSON.stringify({ routing: { pages: { result: "vysledek" } }, calculator: { yes: "Jo" } });
    expect(checkMessages("m.json", base, head)).toBeUndefined();
  });
  it("rejects an added key", () => {
    const head = JSON.stringify({ routing: { pages: { result: "vysledek" } }, calculator: { yes: "Ano", maybe: "Možná" } });
    expect(checkMessages("m.json", base, head)?.reason).toMatch(/key set changed/);
  });
  it("rejects a routing value change even with identical keys", () => {
    const head = JSON.stringify({ routing: { pages: { result: "vysledok" } }, calculator: { yes: "Ano" } });
    expect(checkMessages("m.json", base, head)?.reason).toMatch(/routing/);
  });
  it("fails closed on unparseable JSON", () => {
    expect(checkMessages("m.json", base, "{oops")?.reason).toMatch(/unparseable/);
  });
  it("fails closed on an added or deleted file", () => {
    expect(checkMessages("m.json", undefined, base)?.reason).toMatch(/added or deleted/);
  });
});
