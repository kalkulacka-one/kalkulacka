import { describe, expect, it } from "vitest";

import type { DomainCheck } from "../check-domain";
import { domainsToCheck, orderForApply, planStatuses, type SubscriptionRow } from "./plan";

function row(id: string, email: string, change: Partial<SubscriptionRow> = {}): SubscriptionRow {
  return { id, email, origin: "subscribe-form", emailStatus: "unverified", ...change };
}

const DNS = new Map<string, DomainCheck>([
  ["gmail.com", "ok"],
  ["seznam.cz", "ok"],
  ["gone.cz", "invalid"],
  ["flaky.cz", "unknown"],
]);

describe("domainsToCheck", () => {
  it("lists distinct lowercase domains of unverified rows that pass syntax and typo checks", () => {
    const rows = [row("1", "a@Gmail.com"), row("2", "b@gmail.com"), row("3", "c@gmail.con"), row("4", "broken"), row("5", "d@bounced.cz", { emailStatus: "bounced" }), row("6", "e@seznam.cz")];
    expect(domainsToCheck(rows)).toEqual(["gmail.com", "seznam.cz"]);
  });
});

describe("planStatuses", () => {
  it("derives the status of each unverified row", () => {
    const rows = [row("1", "a@GMAIL.com"), row("2", "b@gmail.con"), row("3", "not-an-email"), row("4", "c@gone.cz"), row("5", "d@flaky.cz"), row("6", "e@unchecked.cz")];
    const { verdicts, updates, skipped } = planStatuses(rows, DNS);

    expect(verdicts.map(({ id, status, reason, suggestion }) => ({ id, status, reason, suggestion }))).toEqual([
      { id: "1", status: "valid", reason: undefined, suggestion: undefined },
      { id: "2", status: "invalid", reason: "typo", suggestion: "b@gmail.com" },
      { id: "3", status: "invalid", reason: "syntax", suggestion: undefined },
      { id: "4", status: "invalid", reason: "dns-invalid", suggestion: undefined },
      { id: "5", status: "unverified", reason: "dns-unknown", suggestion: undefined },
      { id: "6", status: "unverified", reason: "dns-unknown", suggestion: undefined },
    ]);
    expect(updates).toEqual([
      { id: "1", status: "valid" },
      { id: "2", status: "invalid" },
      { id: "3", status: "invalid" },
      { id: "4", status: "invalid" },
    ]);
    expect(skipped).toBe(0);
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
