import { describe, expect, it } from "vitest";

import { chunk, EMAIL_TRIM_PATTERN, fetchCandidates, fetchLastSyncedAt, normalizeEmail, type PushCandidateRow, planPush, stalePullReason, toSubscriber } from "./push-plan.ts";

const ORIGINS = ["subscribe-form", "import-2022"];

function row(id: string, email: string, change: Partial<PushCandidateRow> = {}): PushCandidateRow {
  return { id, email, origin: "subscribe-form", createdAt: new Date("2026-01-01T00:00:00Z"), metadata: null, emailStatus: "valid", unsubscribedAt: null, ...change };
}

describe("fetchCandidates", () => {
  it("filters in the database with a parameterized query over the list's origins only", async () => {
    let sql = "";
    let values: unknown[] = [];
    await fetchCandidates(
      {
        queryRaw: async (query, ...params) => {
          sql = query.join("?").replace(/\s+/g, " ");
          values = params;
          return [];
        },
      },
      ORIGINS,
    );

    expect(values).toEqual([ORIGINS, EMAIL_TRIM_PATTERN, EMAIL_TRIM_PATTERN]);
    expect(sql).toContain(`s."origin" = ANY(?::TEXT[])`);
    expect(sql).toContain(`s."emailStatus" = 'valid'`);
    expect(sql).toContain(`s."unsubscribedAt" IS NULL`);
    expect(sql).toContain(`s."metadata"->'ecomail' IS NULL`);
    // Siblings are matched case-insensitively across all origins (no origin condition inside NOT EXISTS).
    expect(sql).toContain(`NOT EXISTS ( SELECT 1 FROM "Subscription" o WHERE lower(regexp_replace(o."email", ?::TEXT, '', 'g')) = lower(regexp_replace(s."email", ?::TEXT, '', 'g')) AND (`);
    expect(sql).toContain(`o."unsubscribedAt" IS NOT NULL OR o."emailStatus" IN ('invalid', 'bounced') OR o."metadata"->'ecomail' IS NOT NULL`);
    expect(sql.slice(sql.indexOf("NOT EXISTS"))).not.toContain("origin");
  });
});

describe("fetchLastSyncedAt", () => {
  it("reads the newest marker of the list's origins only", async () => {
    let sql = "";
    let values: unknown[] = [];
    const at = await fetchLastSyncedAt(
      {
        queryRaw: async (query, ...params) => {
          sql = query.join("?").replace(/\s+/g, " ");
          values = params;
          return [{ lastSyncedAt: "2026-10-05T09:50:00.000Z" }];
        },
      },
      ORIGINS,
    );
    expect(at).toEqual(new Date("2026-10-05T09:50:00.000Z"));
    expect(values).toEqual([ORIGINS]);
    expect(sql).toContain(`SELECT max("metadata"->'ecomail'->>'syncedAt') AS "lastSyncedAt" FROM "Subscription" WHERE "origin" = ANY(?::TEXT[])`);
  });

  it("returns null without a marker or with an unreadable one", async () => {
    await expect(fetchLastSyncedAt({ queryRaw: async () => [{ lastSyncedAt: null }] }, ORIGINS)).resolves.toBeNull();
    await expect(fetchLastSyncedAt({ queryRaw: async () => [{ lastSyncedAt: "yesterday" }] }, ORIGINS)).resolves.toBeNull();
  });
});

describe("stalePullReason", () => {
  const now = new Date("2026-10-05T10:00:00Z");

  it("accepts a marker within the limit", () => {
    expect(stalePullReason(new Date("2026-10-05T09:45:00Z"), now, 15)).toBeNull();
  });

  it("refuses an old or missing marker and points to sync", () => {
    expect(stalePullReason(new Date("2026-10-05T09:44:00Z"), now, 15)).toMatch(/16 min ago.*older than the 15 min.*npm run sync/);
    expect(stalePullReason(null, now, 15)).toMatch(/^no row carries an Ecomail marker.*npm run sync/);
    expect(stalePullReason(new Date("2026-10-05T09:00:00Z"), now, 90)).toBeNull();
  });
});

describe("normalizeEmail", () => {
  it("trims ASCII whitespace the way the SQL regexp_replace does, then lowercases", () => {
    expect(normalizeEmail(" \t Jana@Example.CZ\r\n")).toBe("jana@example.cz");
    expect(EMAIL_TRIM_PATTERN).toBe("^[ \\t\\n\\v\\f\\r]+|[ \\t\\n\\v\\f\\r]+$");
  });
});

describe("planPush", () => {
  it("sends each address once, as stored on its oldest row, and marks all its rows", () => {
    const rows = [
      row("b", "Jana@Example.cz ", { origin: "import-2022", createdAt: new Date("2022-05-01T22:30:00Z") }),
      row("a", "jana@example.cz", { createdAt: new Date("2025-08-18T10:00:00Z") }),
      row("c", "petr@example.cz", { createdAt: new Date("2024-01-01T00:00:00Z") }),
    ];

    const plan = planPush(rows, ORIGINS);

    expect(plan.emails).toEqual([
      { email: "Jana@Example.cz", origin: "import-2022", createdAt: new Date("2022-05-01T22:30:00Z"), rowIds: ["b", "a"] },
      { email: "petr@example.cz", origin: "subscribe-form", createdAt: new Date("2024-01-01T00:00:00Z"), rowIds: ["c"] },
    ]);
    expect(plan.rows).toBe(3);
    expect(plan.rowsByOrigin).toEqual({ "subscribe-form": 2, "import-2022": 1 });
    expect(plan.emailsByOrigin).toEqual({ "import-2022": 1, "subscribe-form": 1 });
  });

  it("breaks createdAt ties by id and orders emails oldest first", () => {
    const at = new Date("2025-01-01T00:00:00Z");
    const plan = planPush(
      [row("z", "b@example.cz", { createdAt: new Date("2026-01-01T00:00:00Z") }), row("y", "A@example.cz", { createdAt: at }), row("x", "a@example.cz", { createdAt: at, origin: "import-2022" })],
      ORIGINS,
    );
    expect(plan.emails.map(({ email, rowIds }) => [email, rowIds])).toEqual([
      ["a@example.cz", ["x", "y"]],
      ["b@example.cz", ["z"]],
    ]);
  });

  it("re-checks the per-row conditions the query should already have applied", () => {
    const rows = [
      row("ok", "ok@example.cz"),
      row("other-origin", "o@example.cz", { origin: "join-us-form" }),
      row("unverified", "u@example.cz", { emailStatus: "unverified" }),
      row("invalid", "i@example.cz", { emailStatus: "invalid" }),
      row("bounced", "b@example.cz", { emailStatus: "bounced" }),
      row("unsubscribed", "x@example.cz", { unsubscribedAt: new Date() }),
      row("marked", "m@example.cz", { metadata: { ecomail: { listId: 3, syncedAt: "2026-10-05T10:00:00.000Z" } } }),
      row("unmergeable", "s@example.cz", { metadata: "legacy" }),
      row("other-metadata", "c@example.cz", { metadata: { cities: ["Brno"] } }),
      row("blank", "  "),
    ];
    expect(planPush(rows, ORIGINS).emails.map((email) => email.rowIds)).toEqual([["ok"], ["other-metadata"]]);
  });
});

describe("planPush exclusions", () => {
  it("skips addresses the pull plans to write, under any spelling", () => {
    const plan = planPush([row("1", "a@example.cz"), row("2", " A@Example.cz"), row("3", "b@example.cz")], ORIGINS, new Set(["a@example.cz"]));
    expect(plan.emails.map((email) => email.email)).toEqual(["b@example.cz"]);
    expect(plan.rows).toBe(1);
    expect(plan.rowsByOrigin).toEqual({ "subscribe-form": 1 });
  });
});

describe("toSubscriber", () => {
  it("carries the email, the UTC date of the oldest row as CREATED_AT and the tag", () => {
    expect(toSubscriber({ email: "a@example.cz", origin: "subscribe-form", createdAt: new Date("2025-08-18T23:30:00Z"), rowIds: ["a"] })).toEqual({
      email: "a@example.cz",
      custom_fields: { CREATED_AT: "2025-08-18" },
      tags: ["Synced from app"],
    });
  });
});

describe("chunk", () => {
  it("splits into chunks of at most the given size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunk([], 2)).toEqual([]);
  });
});
