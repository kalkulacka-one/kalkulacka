import { describe, expect, it } from "vitest";

import type { DomainCheck } from "../email-validation/check-domain.ts";
import { domainsToCheck, orderForApply, planStatuses, planTypoFixes, type SubscriptionRow, typoFixCandidates } from "./plan.ts";

function row(id: string, email: string, change: Partial<SubscriptionRow> = {}): SubscriptionRow {
  return { id, email, origin: "subscribe-form", emailStatus: "unverified", createdAt: new Date("2026-09-01T00:00:00Z"), ...change };
}

const DNS = new Map<string, DomainCheck>([
  ["gmail.com", "ok"],
  ["seznam.cz", "ok"],
  ["gone.cz", "invalid"],
  ["flaky.cz", "unknown"],
  // Real domains one edit from a popular one, and a `.cu` domain with an MX record.
  ["xmail.cz", "ok"],
  ["volna.cz", "ok"],
  ["cloud.com", "ok"],
  ["firma.cu", "ok"],
  // A typo TLD normally fails DNS.
  ["hotmail.con", "invalid"],
  // In the typo map, so its DNS answer must be ignored.
  ["gmail.cz", "ok"],
]);

function summary(rows: SubscriptionRow[]) {
  return planStatuses(rows, DNS).verdicts.map(({ id, status, reason, suggestion, suspect }) => ({ id, status, reason, suggestion, suspect }));
}

describe("domainsToCheck", () => {
  it("lists distinct lowercase domains of unverified rows that pass syntax and the typo map, suspects included", () => {
    const rows = [
      row("1", "a@Gmail.com"),
      row("2", "b@gmail.com"),
      row("3", "c@gmail.con"),
      row("4", "broken"),
      row("5", "d@bounced.cz", { emailStatus: "bounced" }),
      row("6", "e@seznam.cz"),
      row("7", "f@xmail.cz"),
      row("8", "g@hotmail.con"),
    ];
    expect(domainsToCheck(rows)).toEqual(["gmail.com", "hotmail.con", "seznam.cz", "xmail.cz"]);
  });
});

describe("planStatuses", () => {
  it("derives the status of each unverified row", () => {
    const rows = [row("1", "a@GMAIL.com"), row("2", "b@gmail.con"), row("3", "not-an-email"), row("4", "c@gone.cz"), row("5", "d@flaky.cz"), row("6", "e@unchecked.cz")];
    const { updates, skipped } = planStatuses(rows, DNS);

    expect(summary(rows)).toEqual([
      { id: "1", status: "valid", reason: undefined, suggestion: undefined, suspect: undefined },
      { id: "2", status: "invalid", reason: "typo", suggestion: "b@gmail.com", suspect: undefined },
      { id: "3", status: "invalid", reason: "syntax", suggestion: undefined, suspect: undefined },
      { id: "4", status: "invalid", reason: "dns", suggestion: undefined, suspect: undefined },
      { id: "5", status: "unverified", reason: undefined, suggestion: undefined, suspect: undefined },
      { id: "6", status: "unverified", reason: undefined, suggestion: undefined, suspect: undefined },
    ]);
    expect(updates).toEqual([
      { kind: "status", id: "1", status: "valid" },
      { kind: "status", id: "2", status: "invalid" },
      { kind: "status", id: "3", status: "invalid" },
      { kind: "status", id: "4", status: "invalid" },
    ]);
    expect(skipped).toBe(0);
  });

  it("keeps DNS-valid look-alikes valid and reports them as suspects", () => {
    expect(summary([row("1", "a@xmail.cz"), row("2", "b@volna.cz"), row("3", "c@cloud.com")])).toEqual([
      { id: "1", status: "valid", reason: undefined, suggestion: "a@email.cz", suspect: true },
      { id: "2", status: "valid", reason: undefined, suggestion: "b@volny.cz", suspect: true },
      { id: "3", status: "valid", reason: undefined, suggestion: "c@icloud.com", suspect: true },
    ]);
  });

  it("keeps a .cu domain with an MX record valid, as a suspect", () => {
    expect(summary([row("1", "a@firma.cu")])).toEqual([{ id: "1", status: "valid", reason: undefined, suggestion: "a@firma.cz", suspect: true }]);
  });

  it("lets DNS invalidate a typo TLD, keeping the suggestion", () => {
    expect(summary([row("1", "a@hotmail.con")])).toEqual([{ id: "1", status: "invalid", reason: "dns", suggestion: "a@hotmail.com", suspect: true }]);
  });

  it("marks a domain from the typo map invalid regardless of DNS", () => {
    expect(summary([row("1", "a@gmail.cz")])).toEqual([{ id: "1", status: "invalid", reason: "typo", suggestion: "a@gmail.com", suspect: undefined }]);
    expect(domainsToCheck([row("1", "a@gmail.cz")])).toEqual([]);
  });

  it("never plans a write for rows that are not unverified", () => {
    const rows = [row("1", "a@gmail.con", { emailStatus: "bounced" }), row("2", "b@gmail.com", { emailStatus: "invalid" }), row("3", "c@gone.cz", { emailStatus: "valid" }), row("4", "d@gmail.com")];
    const { verdicts, updates, skipped } = planStatuses(rows, DNS);
    expect(verdicts.map((verdict) => verdict.id)).toEqual(["4"]);
    expect(updates).toEqual([{ kind: "status", id: "4", status: "valid" }]);
    expect(skipped).toBe(3);
  });
});

describe("typo fixes", () => {
  it("replaces only the domain of typo-map rows, case-insensitively, keeping the local part as typed", () => {
    const rows = [row("1", "Jana.Novak@GAMIL.com"), row("2", "petr@Seznam.CU"), row("3", "x@xmail.cz"), row("4", "y@gmail.com"), row("5", "z@gamil.com", { emailStatus: "bounced" })];
    expect(typoFixCandidates(rows).map(({ row, to }) => [row.id, to])).toEqual([
      ["1", "Jana.Novak@gmail.com"],
      ["2", "petr@seznam.cz"],
    ]);
  });

  it("fixes a typo row and takes the status of the corrected domain", () => {
    const rows = [row("1", "a@gamil.com"), row("2", "b@seznam.c"), row("3", "c@sezam.cz")];
    const fixes = planTypoFixes(rows, []);
    expect(domainsToCheck(rows, fixes)).toEqual(["gmail.com", "seznam.cz"]);
    const dns = new Map<string, DomainCheck>([["gmail.com", "ok"]]);
    const { verdicts, updates } = planStatuses(rows, dns, fixes);
    expect(verdicts.map(({ id, status, fix }) => ({ id, status, fix }))).toEqual([
      { id: "1", status: "valid", fix: "a@gmail.com" },
      { id: "2", status: "unverified", fix: "b@seznam.cz" },
      { id: "3", status: "unverified", fix: "c@seznam.cz" },
    ]);
    expect(updates).toEqual([
      { kind: "fix", id: "1", from: "a@gamil.com", to: "a@gmail.com", status: "valid" },
      { kind: "fix", id: "2", from: "b@seznam.c", to: "b@seznam.cz", status: "unverified" },
      { kind: "fix", id: "3", from: "c@sezam.cz", to: "c@seznam.cz", status: "unverified" },
    ]);
  });

  it("skips a fix when the corrected address already exists in the same origin, case-insensitively", () => {
    const rows = [row("1", "Jana@gamil.com"), row("2", "petr@gamil.com", { origin: "komunalni-2026" })];
    const fixes = planTypoFixes(rows, [
      { origin: "subscribe-form", email: "JANA@gmail.com" },
      { origin: "other-origin", email: "petr@gmail.com" },
    ]);
    expect([...fixes.collisions]).toEqual([["1", "Jana@gmail.com"]]);
    expect([...fixes.fixes]).toEqual([["2", "petr@gmail.com"]]);

    const { verdicts, updates } = planStatuses(rows, DNS, fixes);
    expect(verdicts[0]).toMatchObject({ id: "1", status: "invalid", reason: "typo", suggestion: "Jana@gmail.com", fixSkipped: "collision" });
    expect(updates).toEqual([
      { kind: "status", id: "1", status: "invalid" },
      { kind: "fix", id: "2", from: "petr@gamil.com", to: "petr@gmail.com", status: "valid" },
    ]);
  });

  it("fixes only the oldest of two typo rows that would collide with each other", () => {
    const rows = [
      row("new", "jana@gmail.con", { createdAt: new Date("2026-09-02T00:00:00Z") }),
      row("old", "Jana@gamil.com", { createdAt: new Date("2026-09-01T00:00:00Z") }),
      row("other-origin", "jana@gmail.cz", { origin: "komunalni-2026", createdAt: new Date("2026-09-03T00:00:00Z") }),
    ];
    const fixes = planTypoFixes(rows, []);
    expect([...fixes.fixes]).toEqual([
      ["old", "Jana@gmail.com"],
      ["other-origin", "jana@gmail.com"],
    ]);
    expect([...fixes.collisions]).toEqual([["new", "jana@gmail.com"]]);
  });

  it("leaves typo-map rows invalid without fixes", () => {
    const { updates } = planStatuses([row("1", "a@gamil.com")], DNS);
    expect(updates).toEqual([{ kind: "status", id: "1", status: "invalid" }]);
  });
});

describe("orderForApply", () => {
  it("puts one fix, one invalid and one valid first, then the rest by kind and id", () => {
    const ordered = orderForApply([
      { kind: "status", id: "v2", status: "valid" },
      { kind: "fix", id: "f2", from: "b@gamil.com", to: "b@gmail.com", status: "valid" },
      { kind: "status", id: "i2", status: "invalid" },
      { kind: "status", id: "v1", status: "valid" },
      { kind: "fix", id: "f1", from: "a@gamil.com", to: "a@gmail.com", status: "valid" },
      { kind: "status", id: "i1", status: "invalid" },
    ]);
    expect(ordered.map((update) => update.id)).toEqual(["f1", "i1", "v1", "f2", "i2", "v2"]);
  });
});
