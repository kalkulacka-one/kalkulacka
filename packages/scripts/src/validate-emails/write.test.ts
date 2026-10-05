import { describe, expect, it } from "vitest";

import type { StatusUpdate } from "./plan.ts";
import { IDS_PER_STATEMENT, type SqlClient, STATEMENTS_PER_TRANSACTION, write } from "./write.ts";

type Statement = { sql: string; values: unknown[] };

function fakeClient() {
  const transactions: Statement[][] = [];
  const client: SqlClient<Statement> = {
    executeRaw: (query, ...values) => ({ sql: query.join("?"), values }),
    transaction: async (statements) => {
      transactions.push(statements);
      return statements.map((statement) => (statement.values[1] as string[]).length);
    },
  };
  return { client, transactions };
}

describe("write", () => {
  it("groups rows by status into guarded, parameterized statements", async () => {
    const updates: StatusUpdate[] = [
      { id: "a", status: "valid" },
      { id: "b", status: "invalid" },
      { id: "c", status: "valid" },
    ];
    const { client, transactions } = fakeClient();

    await expect(write(client, updates)).resolves.toBe(3);

    expect(transactions).toHaveLength(1);
    const statements = transactions[0] ?? [];
    expect(statements.map((statement) => statement.values)).toEqual([
      ["valid", ["a", "c"]],
      ["invalid", ["b"]],
    ]);
    for (const { sql } of statements) {
      expect(sql.replace(/\s+/g, " ").trim()).toBe(`UPDATE "Subscription" SET "emailStatus" = ?::"EmailStatus", "updatedAt" = now() WHERE "id" = ANY(?::UUID[]) AND "emailStatus" = 'unverified'`);
    }
  });

  it("chunks ids per statement and statements per transaction", async () => {
    const updates: StatusUpdate[] = Array.from({ length: IDS_PER_STATEMENT * STATEMENTS_PER_TRANSACTION + 1 }, (_, index) => ({ id: `v${index}`, status: "valid" }));
    const { client, transactions } = fakeClient();
    const progress: number[] = [];

    await expect(write(client, updates, (written) => progress.push(written))).resolves.toBe(updates.length);

    expect(transactions.map((statements) => statements.length)).toEqual([STATEMENTS_PER_TRANSACTION, 1]);
    expect(transactions[1]?.[0]?.values[1]).toEqual([`v${updates.length - 1}`]);
    expect(progress).toEqual([IDS_PER_STATEMENT * STATEMENTS_PER_TRANSACTION, updates.length]);
  });

  it("reports fewer rows when the guard skips concurrently changed ones", async () => {
    const { client } = fakeClient();
    const guarded: SqlClient<Statement> = { ...client, transaction: async (statements) => statements.map(() => 0) };
    await expect(write(guarded, [{ id: "a", status: "invalid" }])).resolves.toBe(0);
  });
});
