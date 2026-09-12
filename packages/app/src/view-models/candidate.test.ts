import type { Candidate } from "@kalkulacka-one/schema";

import { describe, expect, it } from "vitest";

import { answersBelongToNestedCandidates, candidateViewModel } from "./candidate";
import { organizationViewModel } from "./organization";
import { personViewModel } from "./person";

const baseUrl = "https://data.kalkulacka.one/kalkulacka";

const ids = {
  spd: "94c3d32d-7915-4a07-bd99-d54cd1e53063",
  mzh: "0d2e7c1a-6b47-4a3a-9c0e-1a2b3c4d5e6f",
  babis: "5ce1deab-ca02-4768-bff9-59bff4a3bcce",
} as const;

const organizations = new Map([
  [ids.spd, organizationViewModel({ id: ids.spd, name: "Svoboda a přímá demokracie", shortName: "SPD", abbreviation: "SPD" }, baseUrl)],
  [ids.mzh, organizationViewModel({ id: ids.mzh, name: "Moravské zemské hnutí", abbreviation: "MZH" }, baseUrl)],
]);
const persons = new Map([[ids.babis, personViewModel({ id: ids.babis, givenName: "Andrej", familyName: "Babiš" }, baseUrl)]]);

const candidate = (fields: Partial<Candidate>): Candidate => ({ id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", references: [], ...fields });

describe("candidateViewModel", () => {
  it("heads a party by its full name and labels it by its short one", () => {
    const model = candidateViewModel(candidate({ references: [{ id: ids.spd, type: "organization" }] }), persons, organizations, baseUrl);
    expect(model.name).toBe("Svoboda a přímá demokracie");
    expect(model.shortName).toBe("SPD");
    // The legacy screens' name is untouched: the short form, as before.
    expect(model.displayName).toBe("SPD");
  });

  it("takes the abbreviation as the short name when the organization has no shortName", () => {
    const model = candidateViewModel(candidate({ references: [{ id: ids.mzh, type: "organization" }] }), persons, organizations, baseUrl);
    expect(model.name).toBe("Moravské zemské hnutí");
    expect(model.shortName).toBe("MZH");
  });

  it("uses a person's display name for both", () => {
    const model = candidateViewModel(candidate({ references: [{ id: ids.babis, type: "person" }] }), persons, organizations, baseUrl);
    expect(model.name).toBe("Andrej Babiš");
    expect(model.shortName).toBe("Andrej Babiš");
  });

  it("lets a coalition's own displayName stand for both, over whatever it references", () => {
    const model = candidateViewModel(candidate({ displayName: "SPOLU", references: [{ id: ids.spd, type: "organization", relationship: "coalition-member" }] }), persons, organizations, baseUrl);
    expect(model.name).toBe("SPOLU");
    expect(model.shortName).toBe("SPOLU");
  });

  it("falls back to the id when nothing resolves, so a data gap shows rather than an empty row", () => {
    const model = candidateViewModel(candidate({ references: [{ id: "ffffffff-ffff-4fff-8fff-ffffffffffff", type: "organization" }] }), persons, organizations, baseUrl);
    expect(model.name).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(model.shortName).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(model.displayName).toBeUndefined();
  });

  it("resolves nested candidates the same way", () => {
    const model = candidateViewModel(
      candidate({ displayName: "Koalice", nestedCandidates: [{ id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", references: [{ id: ids.spd, type: "organization" }] }] }),
      persons,
      organizations,
      baseUrl,
    );
    expect(model.nestedCandidates?.[0]?.name).toBe("Svoboda a přímá demokracie");
    expect(model.nestedCandidates?.[0]?.shortName).toBe("SPD");
  });
});

describe("answersBelongToNestedCandidates", () => {
  const party = (id: string, nestedIds: string[]) => ({ id, nestedCandidates: nestedIds.map((nestedId) => ({ id: nestedId })) });
  const answered = () => [{ questionId: "q1", answer: true }];

  it("is true for an Inventura: the parties hold no votes, their councillors do", () => {
    const candidates = [party("ods", ["ods-1", "ods-2"]), party("piráti", ["pir-1"])];
    const answers = { "ods-1": answered(), "ods-2": answered(), "pir-1": answered() };

    expect(answersBelongToNestedCandidates(candidates, answers)).toBe(true);
  });

  it("is false where the top-level candidates answered themselves, even though they have members", () => {
    // A coalition that answered as one, with its member parties listed under it.
    const candidates = [party("spolu", ["ods", "top09"])];
    const answers = { spolu: answered() };

    expect(answersBelongToNestedCandidates(candidates, answers)).toBe(false);
  });

  it("is false for an ordinary calculator, which nests nothing", () => {
    const candidates = [{ id: "ods" }, { id: "piráti" }];
    const answers = { ods: answered(), piráti: answered() };

    expect(answersBelongToNestedCandidates(candidates, answers)).toBe(false);
  });

  it("is false when nobody answered at all, rather than sending the reader to an empty list of people", () => {
    expect(answersBelongToNestedCandidates([party("ods", ["ods-1"])], {})).toBe(false);
  });
});
