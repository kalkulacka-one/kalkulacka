import { describe, expect, it } from "vitest";

import { collectContacts, type EcomailRecord, type EcomailStatus, ecomailUnsubscribedAt, planSync, type RowUpdate, type SubscriptionRow } from "./ecomail-sync.ts";

const NOW = new Date("2026-10-05T10:00:00.000Z");
const CREATED = new Date("2025-01-01T00:00:00.000Z");

function row(overrides: Partial<SubscriptionRow> & { id: string; email: string }): SubscriptionRow {
  return { createdAt: CREATED, metadata: null, emailStatus: "unverified", unsubscribedAt: null, ...overrides };
}

function plan(byStatus: Partial<Record<EcomailStatus, EcomailRecord[]>>, rows: SubscriptionRow[], now = NOW) {
  const { contacts, issues } = collectContacts(byStatus);
  return { ...planSync({ contacts, rows, listId: 3, now }), issues };
}

/** What the DB would hold after applying the updates (mirrors the SQL in ecomail-pull.mts). */
function applyUpdates(rows: SubscriptionRow[], updates: RowUpdate[]): SubscriptionRow[] {
  return rows.map((current) => {
    const update = updates.find((candidate) => candidate.id === current.id);
    if (!update) return current;
    const metadata = (current.metadata ?? {}) as Record<string, unknown>;
    return {
      ...current,
      metadata: update.ecomail && metadata.ecomail === undefined ? { ...metadata, ecomail: update.ecomail } : current.metadata,
      unsubscribedAt: update.unsubscribedAt ?? current.unsubscribedAt,
      emailStatus: update.bounced ? "bounced" : current.emailStatus,
    };
  });
}

describe("ecomail pull planning", () => {
  it("matches emails case-insensitively and reports Ecomail-only contacts", () => {
    const { updates, report } = plan({ subscribed: [{ email: "Jana.Novak@Example.CZ" }, { email: "nobody@example.cz" }] }, [row({ id: "1", email: "jana.novak@example.cz" })]);
    expect(updates.map((update) => update.id)).toEqual(["1"]);
    expect(report.newlyMarked).toEqual(["jana.novak@example.cz"]);
    expect(report.ecomailOnly).toEqual(["nobody@example.cz"]);
  });

  it("marks every row sharing the email", () => {
    const rows = [row({ id: "1", email: "a@example.cz" }), row({ id: "2", email: "A@example.cz" }), row({ id: "3", email: "b@example.cz" })];
    const { updates, report } = plan({ subscribed: [{ email: "a@example.cz" }] }, rows);
    expect(updates.map((update) => update.id)).toEqual(["1", "2"]);
    expect(updates[0]?.ecomail).toEqual({ listId: 3, syncedAt: NOW.toISOString() });
    expect(report.notInEcomail).toBe(1);
  });

  it("merges the marker into existing metadata, keeping cities", () => {
    const rows = [row({ id: "1", email: "a@example.cz", metadata: { cities: ["Brno"] } })];
    const { updates } = plan({ subscribed: [{ email: "a@example.cz" }] }, rows);
    expect(applyUpdates(rows, updates)[0]?.metadata).toEqual({ cities: ["Brno"], ecomail: { listId: 3, syncedAt: NOW.toISOString() } });
  });

  it("reports metadata it cannot merge into instead of overwriting it", () => {
    const { updates, report } = plan({ subscribed: [{ email: "a@example.cz" }] }, [row({ id: "1", email: "a@example.cz", metadata: ["odd"] })]);
    expect(updates).toEqual([]);
    expect(report.unmergeableMetadata).toEqual(["a@example.cz"]);
  });

  it("takes unsubscribedAt from Ecomail's UTC timestamp", () => {
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at: "2026-03-01 13:30:00", unsubscribed_at_utc: "2026-03-01 12:30:00" }] }, [
      row({ id: "1", email: "a@example.cz" }),
    ]);
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-03-01T12:30:00.000Z");
    expect(report.unsubscribedSet).toEqual(["a@example.cz"]);
    expect(report.unsubscribedFallback).toEqual([]);
  });

  it("treats complaints as unsubscribes and corrects a differing unsubscribedAt", () => {
    const rows = [row({ id: "1", email: "a@example.cz", unsubscribedAt: new Date("2026-01-01T00:00:00Z") })];
    const { updates, report } = plan({ complained: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-02-01T08:00:00.000000Z" }] }, rows);
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-02-01T08:00:00.000Z");
    expect(report.unsubscribedChanged).toEqual(["a@example.cz"]);
  });

  it("ignores a naive local unsubscribed_at but accepts a zoned one", () => {
    expect(ecomailUnsubscribedAt({ email: "a", unsubscribed_at: "2026-03-01 13:30:00" }).at).toBeNull();
    expect(ecomailUnsubscribedAt({ email: "a", unsubscribed_at: "2026-03-01T12:30:00.000000Z" })).toEqual({ at: new Date("2026-03-01T12:30:00Z"), fromZonedField: true });
  });

  it("falls back to the sync time when Ecomail has no timestamp, only once", () => {
    const rows = [row({ id: "1", email: "a@example.cz" })];
    const first = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at: null, unsubscribed_at_utc: null }] }, rows);
    expect(first.updates[0]?.unsubscribedAt).toEqual(NOW);
    expect(first.report.unsubscribedFallback).toEqual(["a@example.cz"]);

    const second = plan({ unsubscribed: [{ email: "a@example.cz" }] }, applyUpdates(rows, first.updates), new Date("2026-10-06T00:00:00Z"));
    expect(second.updates).toEqual([]);
  });

  it("falls back even when the row has a newer consent (conservative)", () => {
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz" }] }, [row({ id: "1", email: "a@example.cz", createdAt: new Date("2026-09-01T00:00:00Z") })]);
    expect(updates[0]?.unsubscribedAt).toEqual(NOW);
    expect(report.unsubscribedFallback).toEqual(["a@example.cz"]);
  });

  it("leaves rows whose consent is newer than the Ecomail unsubscribe (createdAt)", () => {
    const rows = [row({ id: "1", email: "a@example.cz", createdAt: new Date("2026-09-01T00:00:00Z"), metadata: { ecomail: { listId: 3, syncedAt: "x" } } })];
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-03-01 12:30:00" }] }, rows);
    expect(updates).toEqual([]);
    expect(report.newerConsent).toEqual(["a@example.cz"]);
  });

  it("leaves rows whose consent is newer than the Ecomail unsubscribe (metadata.resubscribedAt)", () => {
    const rows = [row({ id: "1", email: "a@example.cz", metadata: { resubscribedAt: "2026-05-01T00:00:00.000Z" }, unsubscribedAt: new Date("2026-03-01T12:30:00Z") })];
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-04-01 12:30:00" }] }, rows);
    expect(updates.map((update) => update.unsubscribedAt)).toEqual([null]);
    expect(report.newerConsent).toEqual(["a@example.cz"]);
    expect(report.unsubscribedChanged).toEqual([]);
  });

  it("applies an unsubscribe later than metadata.resubscribedAt", () => {
    const rows = [row({ id: "1", email: "a@example.cz", metadata: { resubscribedAt: "2026-05-01T00:00:00.000Z" } })];
    const { updates } = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-06-01 00:00:00" }] }, rows);
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-06-01T00:00:00.000Z");
  });

  it("sets bounced on a hard bounce and reports rows no longer bounced", () => {
    const rows = [row({ id: "1", email: "a@example.cz" }), row({ id: "2", email: "b@example.cz", emailStatus: "bounced" })];
    const { updates, report, issues } = plan(
      {
        subscribed: [{ email: "b@example.cz", subscriber: { bounced_hard: 0 } }],
        bounced: [
          { email: "a@example.cz", subscriber: { bounced_hard: 1 } },
          { email: "c@example.cz", subscriber: { bounced_hard: 0 } },
        ],
      },
      rows,
    );
    expect(updates.find((update) => update.id === "1")?.bounced).toBe(true);
    expect(updates.find((update) => update.id === "2")?.bounced).toBe(false);
    expect(report.bouncedSet).toEqual(["a@example.cz"]);
    expect(report.bouncedNoLongerInEcomail).toEqual(["b@example.cz"]);
    expect(issues.bouncedWithoutHardFlag).toEqual(["c@example.cz"]);
  });

  it("reports a re-subscribe without clearing unsubscribedAt", () => {
    const unsubscribedAt = new Date("2026-02-01T00:00:00Z");
    const { updates, report } = plan({ subscribed: [{ email: "a@example.cz" }] }, [row({ id: "1", email: "a@example.cz", unsubscribedAt, metadata: { ecomail: { listId: 3, syncedAt: "x" } } })]);
    expect(updates).toEqual([]);
    expect(report.resubscribed).toEqual(["a@example.cz"]);
  });

  it("is idempotent: a second run over the result plans no writes", () => {
    const byStatus = {
      subscribed: [{ email: "a@example.cz" }],
      unsubscribed: [{ email: "b@example.cz", unsubscribed_at_utc: "2026-03-01 12:30:00" }, { email: "c@example.cz" }],
      bounced: [{ email: "d@example.cz", subscriber: { bounced_hard: 1 } }],
    };
    const rows = [
      row({ id: "1", email: "a@example.cz", metadata: { cities: ["Praha"] } }),
      row({ id: "2", email: "B@example.cz" }),
      row({ id: "3", email: "c@example.cz" }),
      row({ id: "4", email: "d@example.cz" }),
    ];
    const first = plan(byStatus, rows);
    expect(first.updates).toHaveLength(4);
    const second = plan(byStatus, applyUpdates(rows, first.updates), new Date("2026-10-06T00:00:00Z"));
    expect(second.updates).toEqual([]);
    expect(second.report.unchanged).toBe(4);
  });
});
