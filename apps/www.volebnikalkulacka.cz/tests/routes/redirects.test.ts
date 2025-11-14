import { describe, expect, it } from "vitest";

import nextConfig from "../../next.config";

/**
 * Tests for Next.js redirects configuration
 *
 * These tests verify that the redirect rules in next.config.ts are properly defined.
 * For E2E testing of actual redirect behavior, use Playwright tests.
 */
describe("Next.js Redirects Configuration", () => {
  describe("Redirect rules structure", () => {
    it("should have redirects function", async () => {
      expect(nextConfig.redirects).toBeDefined();
      expect(typeof nextConfig.redirects).toBe("function");
    });

    it("should return array of redirect rules", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      expect(Array.isArray(redirects)).toBe(true);
      expect(redirects.length).toBeGreaterThan(0);
    });
  });

  describe("Current election redirects", () => {
    it("should redirect /volby/snemovni-2025 to /volby/snemovni-2025/kalkulacka (temporary)", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/volby/snemovni-2025");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe("/volby/snemovni-2025/kalkulacka");
      expect(redirect?.permanent).toBe(false);
    });
  });

  describe("Methodology and privacy redirects", () => {
    it("should permanently redirect /metodika-tvorby-otazek to /metodika", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/metodika-tvorby-otazek");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe("/metodika");
      expect(redirect?.permanent).toBe(true);
    });

    it("should permanently redirect /ochrana-dat to /soukromi", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/ochrana-dat");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe("/soukromi");
      expect(redirect?.permanent).toBe(true);
    });
  });

  describe("2024 archive redirects", () => {
    const ARCHIVE_2024_HOST = "https://archiv-2024.volebnikalkulacka.cz";

    it("should redirect /volby/krajske-2024/* to archiv-2024 subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/volby/krajske-2024/:path*");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_2024_HOST}/volby/krajske-2024/:path*`);
      expect(redirect?.permanent).toBe(false);
    });

    it("should redirect /volby/senatni-2024/* to archiv-2024 subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/volby/senatni-2024/:path*");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_2024_HOST}/volby/senatni-2024/:path*`);
      expect(redirect?.permanent).toBe(false);
    });

    it("should redirect /volby/evropske-2024/* to archiv-2024 subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/volby/evropske-2024/:path*");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_2024_HOST}/volby/evropske-2024/:path*`);
      expect(redirect?.permanent).toBe(false);
    });

    it("should redirect /o-volbach to archiv-2024 subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/o-volbach");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_2024_HOST}/o-volbach`);
      expect(redirect?.permanent).toBe(false);
    });

    it("should redirect /archiv to archiv-2024 subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/archiv");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_2024_HOST}/archiv`);
      expect(redirect?.permanent).toBe(false);
    });
  });

  describe("2022-2023 archive redirects", () => {
    const ARCHIVE_HOST = "https://archiv.volebnikalkulacka.cz";

    it("should redirect /volby/prezidentske-2023/* to archiv subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/volby/prezidentske-2023/:path*");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_HOST}/volby/prezidentske-2023/:path*`);
      expect(redirect?.permanent).toBe(false);
    });

    it("should redirect /volby/senatni-2022/* to archiv subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/volby/senatni-2022/:path*");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_HOST}/volby/senatni-2022/:path*`);
      expect(redirect?.permanent).toBe(false);
    });

    it("should redirect /volby/komunalni-2022/* to archiv subdomain", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const redirect = redirects.find((r) => r.source === "/volby/komunalni-2022/:path*");

      expect(redirect).toBeDefined();
      expect(redirect?.destination).toBe(`${ARCHIVE_HOST}/volby/komunalni-2022/:path*`);
      expect(redirect?.permanent).toBe(false);
    });
  });

  describe("Redirect permanence", () => {
    it("should use permanent redirects (301) for renamed pages", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const permanentRedirects = redirects.filter((r) => r.permanent === true);

      // Methodology and privacy page redirects should be permanent
      expect(permanentRedirects.length).toBeGreaterThanOrEqual(2);
      expect(permanentRedirects.some((r) => r.source === "/metodika-tvorby-otazek")).toBe(true);
      expect(permanentRedirects.some((r) => r.source === "/ochrana-dat")).toBe(true);
    });

    it("should use temporary redirects (307) for archived elections", async () => {
      if (!nextConfig.redirects) throw new Error("redirects function is not defined");
      const redirects = await nextConfig.redirects();
      const temporaryRedirects = redirects.filter((r) => r.permanent === false && r.source.includes("/volby/"));

      // Archive redirects should be temporary
      expect(temporaryRedirects.length).toBeGreaterThan(0);
      expect(temporaryRedirects.some((r) => r.source === "/volby/krajske-2024/:path*")).toBe(true);
      expect(temporaryRedirects.some((r) => r.source === "/volby/senatni-2024/:path*")).toBe(true);
      expect(temporaryRedirects.some((r) => r.source === "/volby/evropske-2024/:path*")).toBe(true);
    });
  });
});
