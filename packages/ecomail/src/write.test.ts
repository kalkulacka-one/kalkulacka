import { describe, expect, it } from "vitest";

import type { RowUpdate } from "./sync.ts";
import { countKinds, IDS_PER_STATEMENT, orderForApply, type SqlClient, STATEMENTS_PER_TRANSACTION, write } from "./write.ts";

const MARKER = { listId: 3, syncedAt: "2026-10-05T10:00:00.000Z" };

type Statement = { sql: string; values: unknown[] };

function fakeClient() {
  const transactions: Statement[][] = [];
  const client: SqlClient<Statement> = {
    executeRaw: (query, ...values) => ({ sql: query.join("?"), values }),
    transaction: async (statements) => {
      transactions.push(statements);
      return statements.map((statement) => (statement.values[5] as string[]).length);
    },
  };
  return { client, transactions };
}

function update(id: string, change: Partial<RowUpdate> = {}): RowUpdate {
  return { id, email: `${id}@example.cz`, ecomail: null, unsubscribedAt: null, bounced: false, ...change };
}

describe("write", () => {
  it("groups identical changes into one parameterized statement with typed values", async () => {
    const unsubscribedAt = new Date("2026-03-01T12:30:00Z");
    const updates = [update("a", { ecomail: MARKER }), update("b", { ecomail: MARKER }), update("c", { ecomail: MARKER, unsubscribedAt }), update("d", { bounced: true })];
    const { client, transactions } = fakeClient();

    await expect(write(client, updates)).resolves.toBe(4);

    expect(transactions).toHaveLength(1);
    const statements = transactions[0] ?? [];
    expect(statements).toHaveLength(3);
    for (const statement of statements) expect(statement.sql).toMatch(/^\s*UPDATE "Subscription" SET/);

    const [markerOnly, withUnsubscribe, bounce] = statements.map((statement) => statement.values);
    expect(markerOnly).toEqual([JSON.stringify(MARKER), JSON.stringify(MARKER), JSON.stringify(MARKER), null, false, ["a", "b"]]);
    expect(withUnsubscribe?.[3]).toBeInstanceOf(Date);
    expect(withUnsubscribe?.[3]).toEqual(unsubscribedAt);
    expect(withUnsubscribe?.[5]).toEqual(["c"]);
    expect(bounce).toEqual([null, null, null, null, true, ["d"]]);
  });

  it("chunks ids per statement and statements per transaction", async () => {
    const markerOnly = Array.from({ length: IDS_PER_STATEMENT + 1 }, (_, index) => update(`m${index}`, { ecomail: MARKER }));
    const unsubscribes = Array.from({ length: STATEMENTS_PER_TRANSACTION }, (_, index) => update(`u${index}`, { unsubscribedAt: new Date(Date.UTC(2026, 0, 1, 0, index)) }));
    const { client, transactions } = fakeClient();

    await expect(write(client, [...markerOnly, ...unsubscribes])).resolves.toBe(markerOnly.length + unsubscribes.length);

    expect(transactions.map((statements) => statements.length)).toEqual([STATEMENTS_PER_TRANSACTION, 2]);
    const idCounts = transactions.flat().map((statement) => (statement.values[5] as string[]).length);
    expect(idCounts.slice(0, 2)).toEqual([IDS_PER_STATEMENT, 1]);
  });
});

describe("orderForApply", () => {
  it("puts one of each risky kind first, then the rest by kind, sorted by id", () => {
    const updates = [
      update("m2", { ecomail: MARKER }),
      update("m1", { ecomail: MARKER }),
      update("u2", { ecomail: MARKER, unsubscribedAt: new Date() }),
      update("b2", { bounced: true }),
      update("u1", { unsubscribedAt: new Date() }),
      update("b1", { ecomail: MARKER, bounced: true }),
    ];
    const ordered = orderForApply(updates);
    expect(ordered.map((entry) => entry.id)).toEqual(["u1", "b1", "m1", "u2", "b2", "m2"]);
    expect(countKinds(ordered.slice(0, 2))).toEqual({ unsubscribe: 1, bounce: 1, marker: 0 });
  });
});
