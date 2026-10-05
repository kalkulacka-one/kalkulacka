import { beforeEach, describe, expect, it, vi } from "vitest";

import { subscribe } from "./subscribe";

const { create, PrismaClientKnownRequestError } = vi.hoisted(() => {
  class PrismaClientKnownRequestError extends Error {
    code: string;

    constructor(message: string, { code }: { code: string }) {
      super(message);
      this.code = code;
    }
  }

  return { create: vi.fn(), PrismaClientKnownRequestError };
});

vi.mock("@kalkulacka-one/database", () => ({
  prisma: { subscription: { create } },
}));

vi.mock("@kalkulacka-one/database/library", () => ({
  PrismaClientKnownRequestError,
}));

describe("subscribe", () => {
  beforeEach(() => {
    create.mockReset();
  });

  it("stores the email trimmed and lowercased", async () => {
    create.mockResolvedValue({});

    const result = await subscribe({ email: "  Jan.Novak@Seznam.CZ ", origin: "subscribe-form" });

    expect(result).toEqual({ success: true });
    expect(create).toHaveBeenCalledWith({
      data: { email: "jan.novak@seznam.cz", origin: "subscribe-form" },
    });
  });

  it.each(["foo@bar", "a..b@x.cz"])("rejects %s without saving it", async (email) => {
    const result = await subscribe({ email, origin: "subscribe-form" });

    expect(result).toEqual({ success: false, error: "Neplatný formát" });
    expect(create).not.toHaveBeenCalled();
  });

  it("treats a duplicate email as success", async () => {
    create.mockRejectedValue(new PrismaClientKnownRequestError("Unique constraint failed", { code: "P2002" }));

    const result = await subscribe({ email: "jan.novak@seznam.cz", origin: "join-us-form" });

    expect(result).toEqual({ success: true });
  });
});
