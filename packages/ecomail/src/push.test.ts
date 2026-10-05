import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { BulkResult, BulkSubscriber } from "./api.ts";
import type { CliOptions } from "./cli.ts";
import { type PushDeps, push } from "./push.ts";
import type { PushCandidateRow } from "./push-plan.ts";
import type { RowUpdate } from "./sync.ts";

const ENV = { listId: 3, origins: ["subscribe-form", "import-2022"] };
const NOW = new Date("2026-10-05T10:00:00.000Z");
const DRY: CliOptions = { apply: false, verbose: false, limit: undefined };
const APPLY: CliOptions = { apply: true, verbose: false, limit: undefined };

function rows(count: number): PushCandidateRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `row-${String(index).padStart(5, "0")}`,
    email: `user${index}@example.cz`,
    origin: "subscribe-form",
    createdAt: new Date(Date.UTC(2025, 0, 1) + index * 1000),
    metadata: null,
    emailStatus: "valid",
    unsubscribedAt: null,
  }));
}

function fakeDeps(candidates: PushCandidateRow[], responses: ((subscribers: BulkSubscriber[]) => BulkResult)[] = []) {
  const sent: BulkSubscriber[][] = [];
  const marked: RowUpdate[][] = [];
  const deps: PushDeps = {
    fetchCandidates: async () => candidates,
    subscribeBulk: async (subscribers) => {
      sent.push(subscribers);
      return responses[sent.length - 1]?.(subscribers) ?? { ok: true, inserts: subscribers.length };
    },
    markRows: async (updates) => {
      marked.push(updates);
      return updates.length;
    },
    now: () => NOW,
  };
  return { deps, sent, marked };
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(process.stderr, "write").mockImplementation(() => true);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("push", () => {
  it("never sends or marks on a dry-run", async () => {
    const { deps, sent, marked } = fakeDeps(rows(5));
    await expect(push(deps, DRY, ENV)).resolves.toEqual({ accepted: [], rejected: [], failed: [], marked: 0, notInserted: 0 });
    expect(sent).toEqual([]);
    expect(marked).toEqual([]);
  });

  it("marks every candidate row of an accepted address with the list marker only", async () => {
    const candidates = [...rows(1), { ...rows(1)[0], id: "row-dup", email: "USER0@example.cz", origin: "import-2022", createdAt: new Date("2026-01-01T00:00:00Z") } as PushCandidateRow];
    const { deps, sent, marked } = fakeDeps(candidates);

    const outcome = await push(deps, APPLY, ENV);

    expect(sent).toEqual([[{ email: "user0@example.cz", custom_fields: { CREATED_AT: "2025-01-01" }, tags: ["Synced from app"] }]]);
    expect(marked).toEqual([
      [
        { id: "row-00000", email: "user0@example.cz", ecomail: { listId: 3, syncedAt: NOW.toISOString() }, unsubscribedAt: null, bounced: false },
        { id: "row-dup", email: "user0@example.cz", ecomail: { listId: 3, syncedAt: NOW.toISOString() }, unsubscribedAt: null, bounced: false },
      ],
    ]);
    expect(outcome.marked).toBe(2);
  });

  it("sends in chunks of at most 3000 and marks after each", async () => {
    const { deps, sent, marked } = fakeDeps(rows(6001));
    const outcome = await push(deps, APPLY, ENV);
    expect(sent.map((batch) => batch.length)).toEqual([3000, 3000, 1]);
    expect(marked.map((batch) => batch.length)).toEqual([3000, 3000, 1]);
    expect(outcome.accepted).toHaveLength(6001);
  });

  it("caps the number of emails with --limit, longest-waiting first", async () => {
    const candidates = rows(10).reverse();
    const { deps, sent, marked } = fakeDeps(candidates);
    await push(deps, { ...APPLY, limit: 3 }, ENV);
    expect(sent.flat().map((subscriber) => subscriber.email)).toEqual(["user0@example.cz", "user1@example.cz", "user2@example.cz"]);
    expect(marked.flat().map((update) => update.id)).toEqual(["row-00000", "row-00001", "row-00002"]);
  });

  it("on a 422, drops the rejected subscribers, re-sends the rest and marks only those", async () => {
    const { deps, sent, marked } = fakeDeps(rows(4), [() => ({ ok: false, rejected: new Map([[1, "email: Invalid email address"]]), errors: {} })]);

    await expect(push(deps, APPLY, ENV)).rejects.toThrow("1 email(s) rejected by Ecomail (--verbose lists them); none of those was marked");

    expect(sent.map((batch) => batch.map((subscriber) => subscriber.email))).toEqual([
      ["user0@example.cz", "user1@example.cz", "user2@example.cz", "user3@example.cz"],
      ["user0@example.cz", "user2@example.cz", "user3@example.cz"],
    ]);
    expect(marked.flat().map((update) => update.email)).toEqual(["user0@example.cz", "user2@example.cz", "user3@example.cz"]);
    expect(console.log).toHaveBeenCalledWith("  rejected by Ecomail (not marked): 1");
  });

  it("exits non-zero on per-subscriber rejections only after the other batches ran", async () => {
    const { deps, sent, marked } = fakeDeps(rows(3001), [() => ({ ok: false, rejected: new Map([[0, "email: Invalid"]]), errors: {} })]);
    await expect(push(deps, { ...APPLY, verbose: true }, ENV)).rejects.toThrow(/^1 email\(s\) rejected by Ecomail; none/);
    expect(sent.map((batch) => batch.length)).toEqual([3000, 2999, 1]);
    expect(marked.flat()).toHaveLength(3000);
    expect(console.log).toHaveBeenCalledWith("  rejected by Ecomail (not marked): 1 – user0@example.cz (email: Invalid)");
  });

  it("warns loudly when Ecomail inserts fewer than it accepted, and still marks them", async () => {
    const { deps, marked } = fakeDeps(rows(4), [() => ({ ok: true, inserts: 3 })]);
    const outcome = await push(deps, APPLY, ENV);
    expect(outcome.notInserted).toBe(1);
    expect(marked.flat()).toHaveLength(4);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("inserted only 3 of 4 accepted address(es)"));
  });

  it("compares inserts with the re-sent remainder after a 422", async () => {
    const { deps } = fakeDeps(rows(4), [() => ({ ok: false, rejected: new Map([[1, "email: Invalid"]]), errors: {} }), () => ({ ok: true, inserts: 3 })]);
    await expect(push(deps, APPLY, ENV)).rejects.toThrow(/rejected by Ecomail/);
    expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining("inserted only"));
  });

  it("marks nothing from a batch rejected as a whole, keeps going and fails at the end", async () => {
    const { deps, sent, marked } = fakeDeps(rows(3001), [() => ({ ok: false, rejected: null, errors: { subscriber_data: ["required"] } })]);

    await expect(push(deps, APPLY, ENV)).rejects.toThrow(/3000 email\(s\) were in batches Ecomail rejected/);
    expect(sent.map((batch) => batch.length)).toEqual([3000, 1]);
    expect(marked.flat().map((update) => update.email)).toEqual(["user3000@example.cz"]);
  });

  it("marks nothing when the re-sent remainder is rejected again", async () => {
    const reject: BulkResult = { ok: false, rejected: new Map([[0, "email: Invalid"]]), errors: {} };
    const { deps, sent, marked } = fakeDeps(rows(2), [() => reject, () => reject]);
    await expect(push(deps, APPLY, ENV)).rejects.toThrow("1 email(s) rejected by Ecomail (--verbose lists them); 1 email(s) were in batches Ecomail rejected – re-run to retry; none of those was marked");
    expect(sent).toHaveLength(2);
    expect(marked).toEqual([]);
  });

  it("does not let a thrown send mark anything from that batch", async () => {
    const { deps, marked } = fakeDeps(rows(2));
    deps.subscribeBulk = async () => {
      throw new Error("POST /lists/3/subscribe-bulk → HTTP 401");
    };
    await expect(push(deps, APPLY, ENV)).rejects.toThrow(/HTTP 401/);
    expect(marked).toEqual([]);
  });
});
