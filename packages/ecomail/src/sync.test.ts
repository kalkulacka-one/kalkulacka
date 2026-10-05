import { describe, expect, it } from "vitest";

import { collectContacts, type EcomailRecord, type EcomailStatus, ecomailUnsubscribedAt, planSync, type RowUpdate, type SubscriptionRow } from "./sync.ts";

const NOW = new Date("2026-10-05T10:00:00.000Z");
const CREATED = new Date("2025-01-01T00:00:00.000Z");
const ORIGINS = ["subscribe-form", "import-2022"];

function row(overrides: Partial<SubscriptionRow> & { id: string; email: string }): SubscriptionRow {
  return { origin: "subscribe-form", createdAt: CREATED, metadata: null, emailStatus: "unverified", unsubscribedAt: null, ...overrides };
}

function plan(byStatus: Partial<Record<EcomailStatus, EcomailRecord[]>>, rows: SubscriptionRow[], now = NOW) {
  const { contacts, issues } = collectContacts(byStatus);
  return { ...planSync({ contacts, rows, origins: ORIGINS, listId: 3, now }), issues };
}

/** What the DB would hold after applying the updates (mirrors the SQL in pull.ts). */
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

  it("ignores rows whose origin does not belong to the list", () => {
    const rows = [
      row({ id: "1", email: "a@example.cz", origin: "join-us-form" }),
      row({ id: "2", email: "A@example.cz", origin: "import-2022" }),
      row({ id: "3", email: "b@example.cz", origin: "join-us-form" }),
    ];
    const { updates, report } = plan(
      { unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-03-01 12:30:00" }], bounced: [{ email: "b@example.cz", subscriber: { bounced_hard: 1 } }] },
      rows,
    );
    expect(updates.map((update) => update.id)).toEqual(["2"]);
    expect(report.notInEcomail).toBe(0);
    expect(report.ecomailOnly).toEqual(["b@example.cz"]);
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

  it.each([
    ["an array", ["odd"]],
    ["a string", "odd"],
  ])("still unsubscribes a row whose metadata is %s, without touching the metadata", (_, metadata) => {
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-03-01 12:30:00" }] }, [row({ id: "1", email: "a@example.cz", metadata })]);
    expect(updates).toEqual([{ id: "1", email: "a@example.cz", ecomail: null, unsubscribedAt: new Date("2026-03-01T12:30:00Z"), bounced: false }]);
    expect(report.unmergeableMetadata).toEqual(["a@example.cz"]);
  });

  it("reports an email under several statuses and lets the unsubscribe win", () => {
    const { updates, report, issues } = plan({ subscribed: [{ email: "a@example.cz" }], unsubscribed: [{ email: "A@example.cz", unsubscribed_at_utc: "2026-03-01 12:30:00" }] }, [
      row({ id: "1", email: "a@example.cz" }),
    ]);
    expect(issues.multipleStatuses).toEqual(["a@example.cz"]);
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-03-01T12:30:00.000Z");
    expect(report.resubscribed).toEqual([]);
  });

  it("takes unsubscribedAt from Ecomail's UTC timestamp", () => {
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-03-01 12:30:00", subscriber: { last_delivery: "2026-02-01 00:00:00" } }] }, [
      row({ id: "1", email: "a@example.cz" }),
    ]);
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-03-01T12:30:00.000Z");
    expect(report.unsubscribedSet).toEqual(["a@example.cz"]);
    expect(report.unsubscribeSources.set.unsubscribed_at_utc).toEqual(["a@example.cz"]);
  });

  it("treats complaints as unsubscribes and corrects a differing unsubscribedAt", () => {
    const rows = [row({ id: "1", email: "a@example.cz", unsubscribedAt: new Date("2026-01-01T00:00:00Z") })];
    const { updates, report } = plan({ complained: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-02-01T08:00:00.000000Z" }] }, rows);
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-02-01T08:00:00.000Z");
    expect(report.unsubscribedChanged).toEqual(["a@example.cz"]);
    expect(report.unsubscribeSources.changed.unsubscribed_at_utc).toEqual(["a@example.cz"]);
  });

  it("falls back to last_delivery, then subscribed_at_utc, never to unsubscribed_at", () => {
    // The Z-suffixed unsubscribed_at is verified wrong (1–2 h early) and must be ignored.
    const onlyZonedUnsubscribedAt = { email: "a", unsubscribed_at: "2026-03-01T11:30:00.000000Z" };
    expect(ecomailUnsubscribedAt(onlyZonedUnsubscribedAt)).toBeNull();
    expect(ecomailUnsubscribedAt({ email: "a", subscribed_at_utc: "2026-01-10 09:00:00", subscriber: { last_delivery: "2026-02-15 18:00:00" } })).toEqual({
      at: new Date("2026-02-15T18:00:00Z"),
      source: "last_delivery",
    });
    expect(ecomailUnsubscribedAt({ email: "a", subscribed_at_utc: "2026-01-10 09:00:00", subscriber: { last_delivery: null } })).toEqual({
      at: new Date("2026-01-10T09:00:00Z"),
      source: "subscribed_at_utc",
    });

    const { updates, report } = plan(
      {
        unsubscribed: [{ email: "a@example.cz", subscriber: { last_delivery: "2026-02-15 18:00:00" } }],
        complained: [{ email: "b@example.cz", subscribed_at_utc: "2026-01-10 09:00:00" }],
      },
      [row({ id: "1", email: "a@example.cz" }), row({ id: "2", email: "b@example.cz" })],
    );
    expect(updates.map((update) => update.unsubscribedAt?.toISOString())).toEqual(["2026-02-15T18:00:00.000Z", "2026-01-10T09:00:00.000Z"]);
    expect(report.unsubscribeSources.set).toEqual({ unsubscribed_at_utc: [], last_delivery: ["a@example.cz"], subscribed_at_utc: ["b@example.cz"], sync_time: [] });
  });

  it("prefers a better-ranked timestamp source over an earlier one from another record", () => {
    const { updates, report } = plan(
      {
        unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-03-01 00:00:00" }],
        complained: [{ email: "A@Example.cz", subscribed_at_utc: "2024-01-01 00:00:00" }],
      },
      [row({ id: "1", email: "a@example.cz", createdAt: new Date("2025-06-01T00:00:00Z") })],
    );
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-03-01T00:00:00.000Z");
    expect(report.unsubscribeSources.set.unsubscribed_at_utc).toEqual(["a@example.cz"]);
    expect(report.newerConsent).toEqual([]);
  });

  it("takes the earliest time within the same source", () => {
    const { updates } = plan(
      { unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-03-01 00:00:00" }], complained: [{ email: "a@example.cz", unsubscribed_at_utc: "2026-02-01 00:00:00" }] },
      [row({ id: "1", email: "a@example.cz" })],
    );
    expect(updates[0]?.unsubscribedAt?.toISOString()).toBe("2026-02-01T00:00:00.000Z");
  });

  it("applies the consent rule to fallback timestamps too", () => {
    const rows = [row({ id: "1", email: "a@example.cz", createdAt: new Date("2026-03-01T00:00:00Z") })];
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz", subscribed_at_utc: "2026-01-10 09:00:00" }] }, rows);
    expect(updates[0]?.unsubscribedAt ?? null).toBeNull();
    expect(report.unsubscribeSources.newerConsent.subscribed_at_utc).toEqual(["a@example.cz"]);
  });

  it("falls back to the sync time when Ecomail has no timestamp, only once", () => {
    const rows = [row({ id: "1", email: "a@example.cz" })];
    const first = plan({ unsubscribed: [{ email: "a@example.cz", unsubscribed_at_utc: null, subscribed_at_utc: null, subscriber: { last_delivery: null } }] }, rows);
    expect(first.updates[0]?.unsubscribedAt).toEqual(NOW);
    expect(first.report.unsubscribeSources.set.sync_time).toEqual(["a@example.cz"]);

    const second = plan({ unsubscribed: [{ email: "a@example.cz" }] }, applyUpdates(rows, first.updates), new Date("2026-10-06T00:00:00Z"));
    expect(second.updates).toEqual([]);
  });

  it("falls back to the sync time even when the row has a newer consent (conservative)", () => {
    const { updates, report } = plan({ unsubscribed: [{ email: "a@example.cz" }] }, [row({ id: "1", email: "a@example.cz", createdAt: new Date("2026-09-01T00:00:00Z") })]);
    expect(updates[0]?.unsubscribedAt).toEqual(NOW);
    expect(report.unsubscribeSources.set.sync_time).toEqual(["a@example.cz"]);
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
