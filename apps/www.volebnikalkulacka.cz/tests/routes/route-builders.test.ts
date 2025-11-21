import { describe, expect, it } from "vitest";

import { createBaseSegment, ROUTE_SEGMENTS, type RouteSegments, routes } from "../../lib/routing/route-builders";
import { MOCK_EMBED_NAME, MOCK_PUBLIC_ID } from "../fixtures/mock-calculator-data";

describe("Route Builders", () => {
  describe("createBaseSegment", () => {
    it("should create one-segment base path", () => {
      const segments: RouteSegments = { first: "snemovni-2025" };
      expect(createBaseSegment(segments)).toBe("snemovni-2025");
    });

    it("should create two-segment base path", () => {
      const segments: RouteSegments = { first: "volby", second: "snemovni-2025" };
      expect(createBaseSegment(segments)).toBe("volby/snemovni-2025");
    });

    it("should create three-segment base path", () => {
      const segments: RouteSegments = { first: "volby", second: "krajske-2024", third: "jihomoravsky" };
      expect(createBaseSegment(segments)).toBe("volby/krajske-2024/jihomoravsky");
    });

    it("should create one-segment embed base path", () => {
      const segments: RouteSegments = { first: "snemovni-2025", embed: MOCK_EMBED_NAME };
      expect(createBaseSegment(segments)).toBe(`embed/${MOCK_EMBED_NAME}/snemovni-2025`);
    });

    it("should create two-segment embed base path", () => {
      const segments: RouteSegments = { first: "volby", second: "snemovni-2025", embed: MOCK_EMBED_NAME };
      expect(createBaseSegment(segments)).toBe(`embed/${MOCK_EMBED_NAME}/volby/snemovni-2025`);
    });

    it("should create three-segment embed base path", () => {
      const segments: RouteSegments = { first: "volby", second: "krajske-2024", third: "jihomoravsky", embed: MOCK_EMBED_NAME };
      expect(createBaseSegment(segments)).toBe(`embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky`);
    });
  });

  describe("One-segment routes", () => {
    const segments: RouteSegments = { first: "snemovni-2025" };

    it("should build introduction route", () => {
      expect(routes.introduction(segments)).toBe("/snemovni-2025/uvod");
    });

    it("should build guide route", () => {
      expect(routes.guide(segments)).toBe("/snemovni-2025/navod");
    });

    it("should build question route with number", () => {
      expect(routes.question(segments, 1)).toBe("/snemovni-2025/otazka/1");
      expect(routes.question(segments, 5)).toBe("/snemovni-2025/otazka/5");
    });

    it("should build review route", () => {
      expect(routes.review(segments)).toBe("/snemovni-2025/rekapitulace");
    });

    it("should build result route", () => {
      expect(routes.result(segments)).toBe("/snemovni-2025/vysledek");
    });

    it("should build public result route with public ID", () => {
      expect(routes.publicResult(segments, MOCK_PUBLIC_ID)).toBe(`/snemovni-2025/vysledek/${MOCK_PUBLIC_ID}`);
    });

    it("should build comparison route", () => {
      expect(routes.comparison(segments)).toBe("/snemovni-2025/porovnani");
    });
  });

  describe("Two-segment routes", () => {
    const segments: RouteSegments = { first: "volby", second: "snemovni-2025" };

    it("should build introduction route", () => {
      expect(routes.introduction(segments)).toBe("/volby/snemovni-2025/uvod");
    });

    it("should build guide route", () => {
      expect(routes.guide(segments)).toBe("/volby/snemovni-2025/navod");
    });

    it("should build question route with number", () => {
      expect(routes.question(segments, 1)).toBe("/volby/snemovni-2025/otazka/1");
      expect(routes.question(segments, 3)).toBe("/volby/snemovni-2025/otazka/3");
    });

    it("should build review route", () => {
      expect(routes.review(segments)).toBe("/volby/snemovni-2025/rekapitulace");
    });

    it("should build result route", () => {
      expect(routes.result(segments)).toBe("/volby/snemovni-2025/vysledek");
    });

    it("should build public result route with public ID", () => {
      expect(routes.publicResult(segments, MOCK_PUBLIC_ID)).toBe(`/volby/snemovni-2025/vysledek/${MOCK_PUBLIC_ID}`);
    });

    it("should build comparison route", () => {
      expect(routes.comparison(segments)).toBe("/volby/snemovni-2025/porovnani");
    });
  });

  describe("Three-segment routes", () => {
    const segments: RouteSegments = { first: "volby", second: "krajske-2024", third: "jihomoravsky" };

    it("should build introduction route", () => {
      expect(routes.introduction(segments)).toBe("/volby/krajske-2024/jihomoravsky/uvod");
    });

    it("should build guide route", () => {
      expect(routes.guide(segments)).toBe("/volby/krajske-2024/jihomoravsky/navod");
    });

    it("should build question route with number", () => {
      expect(routes.question(segments, 1)).toBe("/volby/krajske-2024/jihomoravsky/otazka/1");
      expect(routes.question(segments, 4)).toBe("/volby/krajske-2024/jihomoravsky/otazka/4");
    });

    it("should build review route", () => {
      expect(routes.review(segments)).toBe("/volby/krajske-2024/jihomoravsky/rekapitulace");
    });

    it("should build result route", () => {
      expect(routes.result(segments)).toBe("/volby/krajske-2024/jihomoravsky/vysledek");
    });

    it("should build public result route with public ID", () => {
      expect(routes.publicResult(segments, MOCK_PUBLIC_ID)).toBe(`/volby/krajske-2024/jihomoravsky/vysledek/${MOCK_PUBLIC_ID}`);
    });

    it("should build comparison route", () => {
      expect(routes.comparison(segments)).toBe("/volby/krajske-2024/jihomoravsky/porovnani");
    });
  });

  describe("Embed routes - one segment", () => {
    const segments: RouteSegments = { first: "snemovni-2025", embed: MOCK_EMBED_NAME };

    it("should build introduction route", () => {
      expect(routes.introduction(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/uvod`);
    });

    it("should build guide route", () => {
      expect(routes.guide(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/navod`);
    });

    it("should build question route with number", () => {
      expect(routes.question(segments, 1)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/otazka/1`);
      expect(routes.question(segments, 2)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/otazka/2`);
    });

    it("should build review route", () => {
      expect(routes.review(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/rekapitulace`);
    });

    it("should build result route", () => {
      expect(routes.result(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/vysledek`);
    });

    it("should build public result route with public ID", () => {
      expect(routes.publicResult(segments, MOCK_PUBLIC_ID)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/vysledek/${MOCK_PUBLIC_ID}`);
    });

    it("should build comparison route", () => {
      expect(routes.comparison(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/snemovni-2025/porovnani`);
    });
  });

  describe("Embed routes - two segments", () => {
    const segments: RouteSegments = { first: "volby", second: "snemovni-2025", embed: MOCK_EMBED_NAME };

    it("should build introduction route", () => {
      expect(routes.introduction(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/uvod`);
    });

    it("should build guide route", () => {
      expect(routes.guide(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/navod`);
    });

    it("should build question route with number", () => {
      expect(routes.question(segments, 1)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/otazka/1`);
      expect(routes.question(segments, 4)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/otazka/4`);
    });

    it("should build review route", () => {
      expect(routes.review(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/rekapitulace`);
    });

    it("should build result route", () => {
      expect(routes.result(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/vysledek`);
    });

    it("should build public result route with public ID", () => {
      expect(routes.publicResult(segments, MOCK_PUBLIC_ID)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/vysledek/${MOCK_PUBLIC_ID}`);
    });

    it("should build comparison route", () => {
      expect(routes.comparison(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/snemovni-2025/porovnani`);
    });
  });

  describe("Embed routes - three segments", () => {
    const segments: RouteSegments = { first: "volby", second: "krajske-2024", third: "jihomoravsky", embed: MOCK_EMBED_NAME };

    it("should build introduction route", () => {
      expect(routes.introduction(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/uvod`);
    });

    it("should build guide route", () => {
      expect(routes.guide(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/navod`);
    });

    it("should build question route with number", () => {
      expect(routes.question(segments, 1)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/otazka/1`);
      expect(routes.question(segments, 4)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/otazka/4`);
    });

    it("should build review route", () => {
      expect(routes.review(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/rekapitulace`);
    });

    it("should build result route", () => {
      expect(routes.result(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/vysledek`);
    });

    it("should build public result route with public ID", () => {
      expect(routes.publicResult(segments, MOCK_PUBLIC_ID)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/vysledek/${MOCK_PUBLIC_ID}`);
    });

    it("should build comparison route", () => {
      expect(routes.comparison(segments)).toBe(`/embed/${MOCK_EMBED_NAME}/volby/krajske-2024/jihomoravsky/porovnani`);
    });
  });

  describe("ROUTE_SEGMENTS constants", () => {
    it("should have correct route segment values", () => {
      expect(ROUTE_SEGMENTS.INTRODUCTION).toBe("uvod");
      expect(ROUTE_SEGMENTS.GUIDE).toBe("navod");
      expect(ROUTE_SEGMENTS.QUESTION).toBe("otazka");
      expect(ROUTE_SEGMENTS.REVIEW).toBe("rekapitulace");
      expect(ROUTE_SEGMENTS.RESULT).toBe("vysledek");
      expect(ROUTE_SEGMENTS.COMPARISON).toBe("porovnani");
    });
  });
});
