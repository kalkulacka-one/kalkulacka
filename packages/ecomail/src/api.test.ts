import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BULK_LIMIT, bulkRequest, EcomailApiError, fetchListSubscribers, PER_PAGE, parseBulkErrors, subscribeBulk, TIMEOUT_MS } from "./api.ts";

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

  it("gives each attempt a timeout and retries a timed-out one", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockRejectedValueOnce(new DOMException("The operation was aborted due to timeout", "TimeoutError")).mockResolvedValueOnce(json({ data: records(1, "a"), last_page: 1 }));

    const promise = fetchListSubscribers("key", 3, "subscribed");
    await vi.advanceTimersByTimeAsync(1_000);
    await expect(promise).resolves.toMatchObject({ records: [{}] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(timeout).toHaveBeenCalledWith(TIMEOUT_MS.GET);
    for (const [, init] of fetchMock.mock.calls) expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("retries when reading the body times out", async () => {
    const stalled = new Response(null, { status: 200 });
    vi.spyOn(stalled, "json").mockRejectedValueOnce(new DOMException("The operation was aborted due to timeout", "TimeoutError"));
    fetchMock.mockResolvedValueOnce(stalled).mockResolvedValueOnce(json({ data: records(1, "a"), last_page: 1 }));

    const promise = fetchListSubscribers("key", 3, "subscribed");
    await vi.advanceTimersByTimeAsync(1_000);
    await expect(promise).resolves.toMatchObject({ records: [{}] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
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

describe("subscribeBulk", () => {
  const subscriber = { email: "a@example.cz", custom_fields: { CREATED_AT: "2025-08-18" }, tags: ["Synced from app"] };

  it("POSTs a body that neither updates nor resubscribes and never sets a status", async () => {
    fetchMock.mockResolvedValueOnce(json({ inserts: 1 }));

    await expect(subscribeBulk("key", 3, [subscriber])).resolves.toEqual({ ok: true, inserts: 1 });

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toBe("https://api2.ecomailapp.cz/lists/3/subscribe-bulk");
    expect(init).toMatchObject({ method: "POST", headers: { key: "key", "content-type": "application/json" } });
    const body = JSON.parse(String(init?.body));
    expect(body).toEqual({ subscriber_data: [subscriber], update_existing: false, resubscribe: false, skip_confirmation: true, trigger_autoresponders: false });
    expect(JSON.stringify(body)).not.toContain('"status"');
  });

  it("refuses more subscribers than one call takes", () => {
    expect(() => bulkRequest(Array.from({ length: BULK_LIMIT + 1 }, () => subscriber))).toThrow(/at most 3000/);
  });

  it("retries a 503 with the same body", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503, headers: { "retry-after": "1" } })).mockResolvedValueOnce(json({ inserts: 1 }));

    const promise = subscribeBulk("key", 3, [subscriber]);
    await vi.advanceTimersByTimeAsync(1_000);
    await expect(promise).resolves.toMatchObject({ ok: true });
    expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(fetchMock.mock.calls[0]?.[1]?.body);
  });

  it("uses the longer POST timeout and retries a timed-out POST with the same body", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockRejectedValueOnce(new DOMException("The operation was aborted due to timeout", "TimeoutError")).mockResolvedValueOnce(json({ inserts: 1 }));

    const promise = subscribeBulk("key", 3, [subscriber]);
    await vi.advanceTimersByTimeAsync(1_000);
    await expect(promise).resolves.toEqual({ ok: true, inserts: 1 });
    expect(timeout).toHaveBeenCalledWith(TIMEOUT_MS.POST);
    expect(fetchMock.mock.calls[1]?.[1]?.body).toBe(fetchMock.mock.calls[0]?.[1]?.body);
  });

  it("returns the rejected indexes of a 422 without retrying", async () => {
    fetchMock.mockResolvedValueOnce(json({ errors: { "subscriber_data.1": { email: ["Invalid email address"] } } }, { status: 422 }));

    const result = await subscribeBulk("key", 3, [subscriber, { ...subscriber, email: "bad" }]);

    expect(result).toMatchObject({ ok: false, rejected: new Map([[1, "email: Invalid email address"]]) });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws on another 4xx", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 400 }));
    await expect(subscribeBulk("key", 3, [subscriber])).rejects.toThrow(/POST \/lists\/3\/subscribe-bulk → HTTP 400/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("parseBulkErrors", () => {
  it("maps per-subscriber errors to indexes", () => {
    const errors = { errors: { "subscriber_data.0": { email: ["Invalid email address"], custom_fields: ["Too long"] }, "subscriber_data.2": { email: ["Invalid"] } } };
    expect(parseBulkErrors(errors, 3)).toEqual(
      new Map([
        [0, "email: Invalid email address | custom_fields: Too long"],
        [2, "email: Invalid"],
      ]),
    );
  });

  it("treats errors not tied to a known subscriber as a whole-request rejection", () => {
    expect(parseBulkErrors({ errors: { subscriber_data: ["required"] } }, 3)).toBeNull();
    expect(parseBulkErrors({ errors: { "subscriber_data.3": { email: ["Invalid"] } } }, 3)).toBeNull();
    expect(parseBulkErrors({ message: "nope" }, 3)).toBeNull();
    expect(parseBulkErrors({ errors: {} }, 3)).toBeNull();
  });
});
