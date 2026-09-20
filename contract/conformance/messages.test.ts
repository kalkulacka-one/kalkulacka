// Lockstep message rule (contract: editorial tag). Protected: agents never edit.

import { describe, expect, it } from "vitest";

import { checkLockstep } from "../scripts/messages.ts";

describe("lockstep locale rules", () => {
  const cs = JSON.stringify({ koa: { pages: { picker: { title: "Zvolte" } } } });
  it("allows any key change applied to every locale", () => {
    expect(checkLockstep({ "cs.json": cs, "sk.json": cs })).toEqual([]);
  });
  it("rejects a key present in only some locales", () => {
    const sk = JSON.stringify({ koa: { pages: { picker: {} } } });
    expect(checkLockstep({ "cs.json": cs, "sk.json": sk })[0]?.reason).toMatch(/diverge/);
  });
  it("passes trivially for a single-locale directory", () => {
    expect(checkLockstep({ "cs.json": cs })).toEqual([]);
  });
  it("fails closed on unparseable JSON", () => {
    expect(checkLockstep({ "cs.json": cs, "sk.json": "{oops" })[0]?.reason).toMatch(/unparseable/);
  });
});
