import { describe, expect, it } from "vitest";

import type { Update } from "./plan.ts";
import { IDS_PER_STATEMENT, type SqlClient, STATEMENTS_PER_TRANSACTION, write } from "./write.ts";

type Statement = { sql: string; values: unknown[] };

const normalize = (sql: string) => sql.replace(/\s+/g, " ").trim();

/** Counts each statement as the number of ids it targets (a fix targets one row). */
function fakeClient(countOf: (statement: Statement) => number = (statement) => (Array.isArray(statement.values[1]) ? statement.values[1].length : 1)) {
  const transactions: Statement[][] = [];
  const client: SqlClient<Statement> = {
    executeRaw: (query, ...values) => ({ sql: query.join("?"), values }),
    transaction: async (statements) => {
      transactions.push(statements);
      return statements.map(countOf);
    },
  };
  return { client, transactions };
}

describe("write", () => {
  it("groups status rows by status into guarded, parameterized statements", async () => {
    const updates: Update[] = [
      { kind: "status", id: "a", status: "valid" },
      { kind: "status", id: "b", status: "invalid" },
      { kind: "status", id: "c", status: "valid" },
    ];
    const { client, transactions } = fakeClient();

    await expect(write(client, updates)).resolves.toEqual({ statuses: 3, fixes: 0 });

    expect(transactions).toHaveLength(1);
    const statements = transactions[0] ?? [];
    expect(statements.map((statement) => statement.values)).toEqual([
      ["valid", ["a", "c"]],
      ["invalid", ["b"]],
    ]);
    for (const { sql } of statements) {
      expect(normalize(sql)).toBe(`UPDATE "Subscription" SET "emailStatus" = ?::"EmailStatus", "updatedAt" = now() WHERE "id" = ANY(?::UUID[]) AND "emailStatus" = 'unverified'`);
    }
  });

  it("writes a typo fix as one guarded statement that merges the original email into the metadata", async () => {
    const { client, transactions } = fakeClient();
    const fix: Update = { kind: "fix", id: "f1", from: "Jana@Gamil.com", to: "Jana@gmail.com", status: "valid" };

    await expect(write(client, [{ kind: "status", id: "a", status: "valid" }, fix])).resolves.toEqual({ statuses: 1, fixes: 1 });

    const [fixStatement, statusStatement] = transactions[0] ?? [];
    expect(statusStatement?.values).toEqual(["valid", ["a"]]);
    // Params in order: new email, original (NULL metadata), original (merge), status, id, original (guard), new email (collision guard).
    expect(fixStatement?.values).toEqual(["Jana@gmail.com", "Jana@Gamil.com", "Jana@Gamil.com", "valid", "f1", "Jana@Gamil.com", "Jana@gmail.com"]);
    const sql = normalize(fixStatement?.sql ?? "");
    expect(sql).toContain(`"email" = ?,`);
    // NULL or JSON-null metadata becomes a new object; an object keeps its other keys (`||` only adds or replaces `emailCorrectedFrom`).
    expect(sql).toContain(`WHEN "metadata" IS NULL OR jsonb_typeof("metadata") = 'null' THEN jsonb_build_object('emailCorrectedFrom', ?::TEXT)`);
    expect(sql).toContain(`ELSE "metadata" || jsonb_build_object('emailCorrectedFrom', ?::TEXT)`);
    expect(sql).toContain(`"emailStatus" = ?::"EmailStatus", "updatedAt" = now()`);
    expect(sql).toContain(`WHERE "id" = ?::UUID AND "email" = ? AND "emailStatus" = 'unverified'`);
    expect(sql).toContain(`AND ("metadata" IS NULL OR jsonb_typeof("metadata") IN ('null', 'object'))`);
    expect(sql).toContain(`AND NOT EXISTS (SELECT 1 FROM "Subscription" AS "other" WHERE "other"."origin" = "Subscription"."origin" AND lower("other"."email") = lower(?))`);
  });

  it("chunks ids per statement and statements per transaction", async () => {
    const updates: Update[] = Array.from({ length: IDS_PER_STATEMENT * STATEMENTS_PER_TRANSACTION + 1 }, (_, index) => ({ kind: "status", id: `v${index}`, status: "valid" }));
    const { client, transactions } = fakeClient();
    const progress: number[] = [];

    await expect(write(client, updates, (written) => progress.push(written))).resolves.toEqual({ statuses: updates.length, fixes: 0 });

    expect(transactions.map((statements) => statements.length)).toEqual([STATEMENTS_PER_TRANSACTION, 1]);
    expect(transactions[1]?.[0]?.values[1]).toEqual([`v${updates.length - 1}`]);
    expect(progress).toEqual([IDS_PER_STATEMENT * STATEMENTS_PER_TRANSACTION, updates.length]);
  });

  it("reports fewer rows when the guards skip concurrently changed ones", async () => {
    const { client } = fakeClient(() => 0);
    await expect(
      write(client, [
        { kind: "status", id: "a", status: "invalid" },
        { kind: "fix", id: "b", from: "b@gamil.com", to: "b@gmail.com", status: "valid" },
      ]),
    ).resolves.toEqual({ statuses: 0, fixes: 0 });
  });
});
