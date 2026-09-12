// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { loadCalculatorGroup, loadPublishedCalculatorGroup } from "./calculator-group";

const fetchMock = vi.fn();

const calculatorGroup = {
  id: "55487ccc-5da8-5ba5-9901-283f5f58d051",
  key: "senatni-2026",
  createdAt: "2026-09-05T00:00:00+02:00",
  title: "Volby do Senátu Parlamentu ČR 2026",
  election: { id: "1e30f4af-56c7-5dd1-9e4f-548c9d85cef7", key: "senatni-2026" },
  selection: { title: "Zvolte svůj volební obvod", searchPlaceholder: "Hledat obvod…", showCode: true },
  calculators: [
    { id: "b2813d6f-895a-5883-8412-2d64a67feb4f", key: "3-cheb", district: { key: "3-cheb" } },
    { id: "226e80f0-989c-5f24-a53f-415da4238d3d", key: "6-louny", district: { key: "6-louny" } },
    // A calculator whose district the election does not describe.
    { id: "f42f87a6-1542-513a-8d2e-89dfd9a4d54a", key: "99-nikde", district: { key: "99-nikde" } },
  ],
};

const election = {
  id: "1e30f4af-56c7-5dd1-9e4f-548c9d85cef7",
  key: "senatni-2026",
  createdAt: "2026-09-05T00:00:00+02:00",
  title: "Volby do Senátu Parlamentu ČR 2026",
  shortTitle: "Senátní 2026",
  calculatorGroup: { id: "55487ccc-5da8-5ba5-9901-283f5f58d051", key: "senatni-2026" },
  districts: [
    { key: "karlovarsky-kraj", kind: "region", title: "Karlovarský kraj" },
    { key: "ustecky-kraj", kind: "region", title: "Ústecký kraj" },
    { key: "3-cheb", kind: "electoral-district", code: "3", title: "Cheb", shortTitle: "Cheb", parent: "karlovarsky-kraj" },
    { key: "6-louny", kind: "electoral-district", code: "6", title: "Louny", shortTitle: "Louny", parent: "ustecky-kraj" },
  ],
  rounds: [{ number: 1 }, { number: 2 }],
};

function serveGroupFiles(files: Record<string, unknown>) {
  fetchMock.mockImplementation((url: string) => {
    const body = Object.entries(files).find(([filename]) => String(url).endsWith(filename))?.[1];
    if (!body) return Promise.resolve(new Response("", { status: 404 }));
    return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
  });
}

beforeEach(() => {
  vi.stubEnv("DATA_ENDPOINT", "https://cdn.example/site");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("loadCalculatorGroup", () => {
  it("names each calculator from the election's districts, not from its key", async () => {
    serveGroupFiles({ "calculator-group.json": calculatorGroup, "election.json": election });

    const listing = await loadCalculatorGroup({ group: "senatni-2026" });

    expect(listing.calculators).toEqual([
      { key: "3-cheb", districtKey: "3-cheb", districtName: "Cheb", districtCode: "3", region: { key: "karlovarsky-kraj", name: "Karlovarský kraj" }, variantKey: undefined, round: 1 },
      { key: "6-louny", districtKey: "6-louny", districtName: "Louny", districtCode: "6", region: { key: "ustecky-kraj", name: "Ústecký kraj" }, variantKey: undefined, round: 1 },
    ]);
  });

  it("drops a calculator whose district the election does not describe", async () => {
    serveGroupFiles({ "calculator-group.json": calculatorGroup, "election.json": election });

    const listing = await loadCalculatorGroup({ group: "senatni-2026" });

    expect(listing.calculators.map((calculator) => calculator.key)).not.toContain("99-nikde");
  });

  it("takes the election name from the config and the picker copy from the data", async () => {
    serveGroupFiles({ "calculator-group.json": calculatorGroup, "election.json": election });

    const listing = await loadCalculatorGroup({ group: "senatni-2026" });

    expect(listing.electionName).toBe("Senátní volby 2026");
    expect(listing.selection?.title).toBe("Zvolte svůj volební obvod");
    expect(listing.selection?.showCode).toBe(true);
    expect(listing.rounds?.map((round) => round.number)).toEqual([1, 2]);
  });

  it("falls back to the election's first round where a calculator names no round of its own", async () => {
    serveGroupFiles({ "calculator-group.json": calculatorGroup, "election.json": { ...election, rounds: [{ number: 2 }] } });

    const listing = await loadCalculatorGroup({ group: "senatni-2026" });

    expect(listing.calculators.map((calculator) => calculator.round)).toEqual([2, 2]);
  });

  it("carries the variant of a calculator that is a variant of its district's", async () => {
    const municipal = {
      ...calculatorGroup,
      key: "komunalni-2026",
      election: { id: "804f325a-2a52-512a-b5ec-3b9aab1d9ffc", key: "komunalni-2026" },
      calculators: [{ id: "67a2b41b-dd66-5651-8aa1-4006908008a9", key: "cheb-inventura", variant: { key: "inventura" }, district: { key: "3-cheb" } }],
    };
    serveGroupFiles({ "calculator-group.json": municipal, "election.json": election });

    const listing = await loadCalculatorGroup({ group: "komunalni-2026" });

    expect(listing.calculators[0]?.variantKey).toBe("inventura");
    expect(listing.calculators[0]?.districtName).toBe("Cheb");
  });

  it("has no election name for a group the config does not list", async () => {
    serveGroupFiles({ "calculator-group.json": calculatorGroup, "election.json": election });

    const listing = await loadCalculatorGroup({ group: "krajske-2028" });

    expect(listing.electionName).toBeUndefined();
  });
});

describe("loadPublishedCalculatorGroup", () => {
  it("returns the listing where the group is published", async () => {
    serveGroupFiles({ "calculator-group.json": calculatorGroup, "election.json": election });

    await expect(loadPublishedCalculatorGroup({ group: "senatni-2026" })).resolves.toMatchObject({ groupKey: "senatni-2026" });
  });

  it("returns nothing where the data endpoint does not serve the group, rather than throwing", async () => {
    // What every endpoint but a local mirror does for the 2026 groups today,
    // and what the real ones will do until the day they are published. These
    // pages are prerendered, so a throw here fails the whole build.
    serveGroupFiles({});

    await expect(loadPublishedCalculatorGroup({ group: "komunalni-2026" })).resolves.toBeUndefined();
  });

  it("still throws where the group is served but broken, so a real fault is not swallowed", async () => {
    serveGroupFiles({ "calculator-group.json": { key: "senatni-2026" }, "election.json": election });

    await expect(loadPublishedCalculatorGroup({ group: "senatni-2026" })).rejects.toThrow();
  });
});
