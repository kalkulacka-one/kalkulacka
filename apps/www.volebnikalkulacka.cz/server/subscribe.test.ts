import { beforeEach, describe, expect, it, vi } from "vitest";

import { subscribe } from "./subscribe";

const { create, queryRaw, PrismaClientKnownRequestError } = vi.hoisted(() => {
  class PrismaClientKnownRequestError extends Error {
    code: string;

    constructor(message: string, { code }: { code: string }) {
      super(message);
      this.code = code;
    }
  }

  return { create: vi.fn(), queryRaw: vi.fn(), PrismaClientKnownRequestError };
});

vi.mock("@kalkulacka-one/database", () => ({
  prisma: { $queryRaw: queryRaw, subscription: { create } },
}));

vi.mock("@kalkulacka-one/database/library", () => ({
  PrismaClientKnownRequestError,
}));

describe("subscribe", () => {
  beforeEach(() => {
    create.mockReset();
    queryRaw.mockReset();
    queryRaw.mockResolvedValue([]);
  });

  it("stores the email trimmed with its case preserved", async () => {
    create.mockResolvedValue({});

    const result = await subscribe({ email: "  Jan.Novak@Seznam.CZ ", origin: "subscribe-form" });

    expect(result).toEqual({ success: true });
    expect(create).toHaveBeenCalledWith({
      data: { email: "Jan.Novak@Seznam.CZ", origin: "subscribe-form" },
    });
  });

  it("looks up duplicates case-insensitively with the email and origin as query parameters", async () => {
    create.mockResolvedValue({});

    await subscribe({ email: "Jan.Novak@Seznam.CZ", origin: "join-us-form" });

    const [strings, ...values] = queryRaw.mock.calls[0] ?? [];
    expect(strings.join("?")).toContain("lower(email) = lower(?)");
    expect(values).toEqual(["join-us-form", "Jan.Novak@Seznam.CZ"]);
  });

  it("skips the insert and succeeds when a case variant already exists", async () => {
    queryRaw.mockResolvedValue([{ id: "existing" }]);

    const result = await subscribe({ email: "JAN.NOVAK@seznam.cz", origin: "subscribe-form" });

    expect(result).toEqual({ success: true });
    expect(create).not.toHaveBeenCalled();
  });

  it.each(["foo@bar", "a..b@x.cz"])("rejects %s without touching the database", async (email) => {
    const result = await subscribe({ email, origin: "subscribe-form" });

    expect(result).toEqual({ success: false, error: "Neplatný formát" });
    expect(queryRaw).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("treats a unique-constraint violation as success", async () => {
    create.mockRejectedValue(new PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002" }));

    const result = await subscribe({ email: "jan.novak@seznam.cz", origin: "join-us-form" });

    expect(result).toEqual({ success: true });
  });
});
