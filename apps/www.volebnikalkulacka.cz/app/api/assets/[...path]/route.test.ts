// @vitest-environment node
// Ported from kalkulacka-2026/apps/web/app/api/assets/[...path]/route.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "./route";

const fetchMock = vi.fn();

function routeParams(path: string[]) {
  return { params: Promise.resolve({ path }) };
}

const request = new Request("http://localhost/api/assets/snemovni-2025/kalkulacka/images/avatar.png");
const assetPath = ["snemovni-2025", "kalkulacka", "images", "avatar.png"];

function upstreamImage(bytes: Uint8Array<ArrayBuffer>, headers: Record<string, string>) {
  fetchMock.mockResolvedValue(new Response(bytes, { status: 200, headers }));
}

beforeEach(() => {
  vi.stubEnv("DATA_ENDPOINT", "https://cdn.example/site");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("GET /api/assets", () => {
  it("mirrors an image with its type, nosniff and caching headers, fetched from under the data endpoint", async () => {
    const pixels = new Uint8Array([1, 2, 3, 4]);
    upstreamImage(pixels, { "content-type": "image/png" });

    const response = await GET(request, routeParams(assetPath));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(response.headers.get("cache-control")).toContain("immutable");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(pixels);
    expect(fetchMock.mock.calls[0]?.[0]).toBeInstanceOf(URL);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe("https://cdn.example/site/snemovni-2025/kalkulacka/images/avatar.png");
  });

  it("normalises content-type parameters away", async () => {
    upstreamImage(new Uint8Array([1]), { "content-type": "image/webp; charset=utf-8" });
    const response = await GET(request, routeParams(assetPath));
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/webp");
  });

  it("refuses to mirror a non-image type onto this origin", async () => {
    // If the CDN ever serves HTML at an asset path, echoing its type would be
    // stored XSS on this origin, cached for a day.
    upstreamImage(new TextEncoder().encode("<script>alert(1)</script>"), { "content-type": "text/html" });

    const response = await GET(request, routeParams(assetPath));
    expect(response.status).toBe(502);
  });

  it("refuses svg — active content, and the platform never serves it", async () => {
    upstreamImage(new TextEncoder().encode("<svg/>"), { "content-type": "image/svg+xml" });
    const response = await GET(request, routeParams(assetPath));
    expect(response.status).toBe(502);
  });

  it("refuses a declared oversized body without reading it", async () => {
    upstreamImage(new Uint8Array([1]), { "content-type": "image/png", "content-length": String(6 * 1024 * 1024) });

    const response = await GET(request, routeParams(assetPath));
    expect(response.status).toBe(502);
  });

  it("caps the body even when Content-Length is absent or lying", async () => {
    upstreamImage(new Uint8Array(5 * 1024 * 1024 + 1), { "content-type": "image/png" });
    const response = await GET(request, routeParams(assetPath));
    expect(response.status).toBe(502);
  });

  it("answers 504 when the CDN does not answer in time", async () => {
    fetchMock.mockRejectedValue(new DOMException("timed out", "TimeoutError"));
    const response = await GET(request, routeParams(assetPath));
    expect(response.status).toBe(504);
  });

  it("rejects traversal-shaped segments without fetching", async () => {
    for (const path of [["..", "secrets"], ["a/b"], ["https://evil.example"], []]) {
      const response = await GET(request, routeParams(path));
      expect(response.status).toBe(404);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 404 with no data endpoint configured", async () => {
    vi.stubEnv("DATA_ENDPOINT", "");
    const response = await GET(request, routeParams(assetPath));
    expect(response.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
