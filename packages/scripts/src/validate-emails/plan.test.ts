import { describe, expect, it } from "vitest";

import type { DomainCheck } from "../email-validation/check-domain.ts";
import { domainsToCheck, orderForApply, planStatuses, type SubscriptionRow } from "./plan.ts";

function row(id: string, email: string, change: Partial<SubscriptionRow> = {}): SubscriptionRow {
  return { id, email, origin: "subscribe-form", emailStatus: "unverified", ...change };
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
      { id: "1", status: "valid" },
      { id: "2", status: "invalid" },
      { id: "3", status: "invalid" },
      { id: "4", status: "invalid" },
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
    expect(updates).toEqual([{ id: "4", status: "valid" }]);
    expect(skipped).toBe(3);
  });
});

describe("orderForApply", () => {
  it("puts one invalid and one valid first, then the rest by status and id", () => {
    const ordered = orderForApply([
      { id: "v2", status: "valid" },
      { id: "i2", status: "invalid" },
      { id: "v1", status: "valid" },
      { id: "i1", status: "invalid" },
    ]);
    expect(ordered.map((update) => update.id)).toEqual(["i1", "v1", "i2", "v2"]);
  });
});
