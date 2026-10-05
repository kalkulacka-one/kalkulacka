import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EcomailApiError, fetchListSubscribers, PER_PAGE } from "./api.ts";

const fetchMock = vi.fn<typeof fetch>();

function json(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" }, ...init });
}

function records(count: number, prefix: string) {
  return Array.from({ length: count }, (_, index) => ({ email: `${prefix}${index}@example.cz` }));
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("fetchListSubscribers", () => {
  it("follows pagination with GET requests only", async () => {
    fetchMock.mockResolvedValueOnce(json({ data: records(2, "a"), last_page: 2, total: 3 })).mockResolvedValueOnce(json({ data: records(1, "b"), last_page: 2, total: 3 }));

    const result = await fetchListSubscribers("key", 3, "unsubscribed");

    expect(result.records.map((record) => record.email)).toEqual(["a0@example.cz", "a1@example.cz", "b0@example.cz"]);
    expect(result.total).toBe(3);
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      `https://api2.ecomailapp.cz/lists/3/subscribers?status=unsubscribed&per_page=${PER_PAGE}&page=1`,
      `https://api2.ecomailapp.cz/lists/3/subscribers?status=unsubscribed&per_page=${PER_PAGE}&page=2`,
    ]);
    for (const [, init] of fetchMock.mock.calls) expect(init).toMatchObject({ method: "GET", headers: { key: "key" } });
  });

  it("waits for Retry-After on 429 and retries", async () => {
    fetchMock.mockResolvedValueOnce(new Response("slow down", { status: 429, headers: { "retry-after": "7" } })).mockResolvedValueOnce(json({ data: records(1, "a"), last_page: 1 }));

    const promise = fetchListSubscribers("key", 3, "subscribed");
    await vi.advanceTimersByTimeAsync(6_999);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toMatchObject({ records: [{ email: "a0@example.cz" }] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("caps Retry-After and fails once the retry budget is spent", async () => {
    fetchMock.mockImplementation(async () => new Response("", { status: 503, headers: { "retry-after": "3600" } }));

    const promise = fetchListSubscribers("key", 3, "subscribed");
    const assertion = expect(promise).rejects.toThrow(/failed after 6 retries: HTTP 503/);
    await vi.advanceTimersByTimeAsync(6 * 120_000);
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(7);
  });

  it("throws on a 401 without retrying", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 401 }));
    await expect(fetchListSubscribers("key", 3, "subscribed")).rejects.toThrow(EcomailApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws on a non-JSON 200 without retrying", async () => {
    fetchMock.mockResolvedValueOnce(new Response("<html>maintenance</html>", { status: 200 }));
    await expect(fetchListSubscribers("key", 3, "subscribed")).rejects.toThrow(/non-JSON/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws when data is not an array", async () => {
    fetchMock.mockResolvedValueOnce(json({ data: { email: "a@example.cz" }, last_page: 1 }));
    await expect(fetchListSubscribers("key", 3, "subscribed")).rejects.toThrow(/no `data` array/);
  });

  it("throws when a full page comes without last_page", async () => {
    fetchMock.mockResolvedValueOnce(json({ data: records(PER_PAGE, "a") }));
    await expect(fetchListSubscribers("key", 3, "subscribed")).rejects.toThrow(/without `last_page`/);
  });

  it("stops on a partial page without last_page", async () => {
    fetchMock.mockResolvedValueOnce(json({ data: records(2, "a") }));
    await expect(fetchListSubscribers("key", 3, "subscribed")).resolves.toMatchObject({ records: [{}, {}] });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
