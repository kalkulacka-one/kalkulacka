import { describe, expect, it, type MockedFunction, vi } from "vitest";

import { fetchFile } from ".";

global.fetch = vi.fn();

describe("fetchFile", () => {
  const mockFetch = fetch as MockedFunction<typeof fetch>;

  it("should return JSON data on successful response", async () => {
    const mockData = { test: "data" };
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    } as Response);

    const result = await fetchFile({ url: "https://example.com/test.json" });

    expect(result).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledWith("https://example.com/test.json");
  });

  it("should throw error for 404 status", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response);

    await expect(fetchFile({ url: "https://example.com/missing.json" })).rejects.toThrow("File `https://example.com/missing.json` not found");
  });

  it("should throw error for 500 status", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    } as Response);

    await expect(fetchFile({ url: "https://example.com/error.json" })).rejects.toThrow("Server error while fetching `https://example.com/error.json` file");
  });

  it("should throw error for other HTTP errors", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    } as Response);

    await expect(fetchFile({ url: "https://example.com/forbidden.json" })).rejects.toThrow("HTTP 403: Forbidden for `https://example.com/forbidden.json` file");
  });

  it("should handle network errors", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(fetchFile({ url: "https://example.com/test.json" })).rejects.toThrow("Network error");
  });
});
