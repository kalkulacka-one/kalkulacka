import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Tests that verify the expected routing structure exists
 *
 * These tests document and verify that all expected route files are present
 * in the Next.js App Router structure. They serve as regression tests to ensure
 * routing structure is maintained during refactoring.
 */
describe("Routing Structure", () => {
  const appDir = join(process.cwd(), "app");

  describe("One-segment route structure: /[first]", () => {
    const baseDir = join(appDir, "(web)", "(app)", "(one-segment)", "[first]");

    it("should have layout.tsx for calculator context", () => {
      expect(existsSync(join(baseDir, "layout.tsx"))).toBe(true);
    });

    it("should have page.tsx for root redirect", () => {
      expect(existsSync(join(baseDir, "page.tsx"))).toBe(true);
    });

    it("should have introduction page (/uvod)", () => {
      expect(existsSync(join(baseDir, "uvod", "page.tsx"))).toBe(true);
    });

    it("should have guide page (/navod)", () => {
      expect(existsSync(join(baseDir, "navod", "page.tsx"))).toBe(true);
    });

    it("should have question redirect page (/otazka)", () => {
      expect(existsSync(join(baseDir, "otazka", "page.tsx"))).toBe(true);
    });

    it("should have question number page (/otazka/[questionNumber])", () => {
      expect(existsSync(join(baseDir, "otazka", "[questionNumber]", "page.tsx"))).toBe(true);
    });

    it("should have review page (/rekapitulace)", () => {
      expect(existsSync(join(baseDir, "rekapitulace", "page.tsx"))).toBe(true);
    });

    it("should have result page (/vysledek)", () => {
      expect(existsSync(join(baseDir, "vysledek", "page.tsx"))).toBe(true);
    });

    it("should have comparison page (/porovnani)", () => {
      expect(existsSync(join(baseDir, "porovnani", "page.tsx"))).toBe(true);
    });
  });

  describe("Two-segment route structure: /[first]/[second]", () => {
    const baseDir = join(appDir, "(web)", "(app)", "(two-segments)", "[first]", "[second]");

    it("should have layout.tsx for calculator context", () => {
      expect(existsSync(join(baseDir, "layout.tsx"))).toBe(true);
    });

    it("should have page.tsx for root redirect", () => {
      expect(existsSync(join(baseDir, "page.tsx"))).toBe(true);
    });

    it("should have introduction page (/uvod)", () => {
      expect(existsSync(join(baseDir, "uvod", "page.tsx"))).toBe(true);
    });

    it("should have guide page (/navod)", () => {
      expect(existsSync(join(baseDir, "navod", "page.tsx"))).toBe(true);
    });

    it("should have question redirect page (/otazka)", () => {
      expect(existsSync(join(baseDir, "otazka", "page.tsx"))).toBe(true);
    });

    it("should have question number page (/otazka/[questionNumber])", () => {
      expect(existsSync(join(baseDir, "otazka", "[questionNumber]", "page.tsx"))).toBe(true);
    });

    it("should have review page (/rekapitulace)", () => {
      expect(existsSync(join(baseDir, "rekapitulace", "page.tsx"))).toBe(true);
    });

    it("should have result page (/vysledek)", () => {
      expect(existsSync(join(baseDir, "vysledek", "page.tsx"))).toBe(true);
    });

    it("should have comparison page (/porovnani)", () => {
      expect(existsSync(join(baseDir, "porovnani", "page.tsx"))).toBe(true);
    });
  });

  describe("Three-segment route structure: /[first]/[second]/[third]", () => {
    const baseDir = join(appDir, "(web)", "(app)", "(three-segments)", "[first]", "[second]", "[third]");

    it("should have layout.tsx for calculator context", () => {
      expect(existsSync(join(baseDir, "layout.tsx"))).toBe(true);
    });

    it("should have page.tsx for root redirect", () => {
      expect(existsSync(join(baseDir, "page.tsx"))).toBe(true);
    });

    it("should have introduction page (/uvod)", () => {
      expect(existsSync(join(baseDir, "uvod", "page.tsx"))).toBe(true);
    });

    it("should have guide page (/navod)", () => {
      expect(existsSync(join(baseDir, "navod", "page.tsx"))).toBe(true);
    });

    it("should have question redirect page (/otazka)", () => {
      expect(existsSync(join(baseDir, "otazka", "page.tsx"))).toBe(true);
    });

    it("should have question number page (/otazka/[questionNumber])", () => {
      expect(existsSync(join(baseDir, "otazka", "[questionNumber]", "page.tsx"))).toBe(true);
    });

    it("should have review page (/rekapitulace)", () => {
      expect(existsSync(join(baseDir, "rekapitulace", "page.tsx"))).toBe(true);
    });

    it("should have result page (/vysledek)", () => {
      expect(existsSync(join(baseDir, "vysledek", "page.tsx"))).toBe(true);
    });

    it("should have comparison page (/porovnani)", () => {
      expect(existsSync(join(baseDir, "porovnani", "page.tsx"))).toBe(true);
    });
  });

  describe("Public result routes: /.../vysledek/[publicId]", () => {
    it("should have public result page for one-segment routes", () => {
      const publicOneSegmentDir = join(appDir, "(web)", "(app)", "(public)", "(one-segment)", "[first]", "vysledek", "[publicId]");
      expect(existsSync(join(publicOneSegmentDir, "page.tsx"))).toBe(true);
    });

    it("should have public result page for two-segment routes", () => {
      const publicTwoSegmentDir = join(appDir, "(web)", "(app)", "(public)", "(two-segments)", "[first]", "[second]", "vysledek", "[publicId]");
      expect(existsSync(join(publicTwoSegmentDir, "page.tsx"))).toBe(true);
    });

    it("should have public result page for three-segment routes", () => {
      const publicThreeSegmentDir = join(appDir, "(web)", "(app)", "(public)", "(three-segments)", "[first]", "[second]", "[third]", "vysledek", "[publicId]");
      expect(existsSync(join(publicThreeSegmentDir, "page.tsx"))).toBe(true);
    });
  });

  describe("Embed route structure: /embed/[embed]/...", () => {
    it("should have layout for one-segment embed routes", () => {
      const embedOneSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(one-segment)", "[first]");
      expect(existsSync(join(embedOneSegmentDir, "layout.tsx"))).toBe(true);
    });

    it("should have layout for two-segment embed routes", () => {
      const embedTwoSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(two-segments)", "[first]", "[second]");
      expect(existsSync(join(embedTwoSegmentDir, "layout.tsx"))).toBe(true);
    });

    it("should have layout for three-segment embed routes", () => {
      const embedThreeSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(three-segments)", "[first]", "[second]", "[third]");
      expect(existsSync(join(embedThreeSegmentDir, "layout.tsx"))).toBe(true);
    });

    it("should have introduction page for one-segment embed routes", () => {
      const embedOneSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(one-segment)", "[first]");
      expect(existsSync(join(embedOneSegmentDir, "uvod", "page.tsx"))).toBe(true);
    });

    it("should have introduction page for two-segment embed routes", () => {
      const embedTwoSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(two-segments)", "[first]", "[second]");
      expect(existsSync(join(embedTwoSegmentDir, "uvod", "page.tsx"))).toBe(true);
    });

    it("should have introduction page for three-segment embed routes", () => {
      const embedThreeSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(three-segments)", "[first]", "[second]", "[third]");
      expect(existsSync(join(embedThreeSegmentDir, "uvod", "page.tsx"))).toBe(true);
    });

    it("should have question pages for embed routes", () => {
      const embedOneSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(one-segment)", "[first]");
      expect(existsSync(join(embedOneSegmentDir, "otazka", "[questionNumber]", "page.tsx"))).toBe(true);

      const embedTwoSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(two-segments)", "[first]", "[second]");
      expect(existsSync(join(embedTwoSegmentDir, "otazka", "[questionNumber]", "page.tsx"))).toBe(true);

      const embedThreeSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(three-segments)", "[first]", "[second]", "[third]");
      expect(existsSync(join(embedThreeSegmentDir, "otazka", "[questionNumber]", "page.tsx"))).toBe(true);
    });

    it("should have result pages for embed routes", () => {
      const embedOneSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(one-segment)", "[first]");
      expect(existsSync(join(embedOneSegmentDir, "vysledek", "page.tsx"))).toBe(true);

      const embedTwoSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(two-segments)", "[first]", "[second]");
      expect(existsSync(join(embedTwoSegmentDir, "vysledek", "page.tsx"))).toBe(true);

      const embedThreeSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(three-segments)", "[first]", "[second]", "[third]");
      expect(existsSync(join(embedThreeSegmentDir, "vysledek", "page.tsx"))).toBe(true);
    });
  });

  describe("Route consistency", () => {
    it("should have matching subroutes for all segment patterns", () => {
      const oneSegmentDir = join(appDir, "(web)", "(app)", "(one-segment)", "[first]");
      const twoSegmentDir = join(appDir, "(web)", "(app)", "(two-segments)", "[first]", "[second]");
      const threeSegmentDir = join(appDir, "(web)", "(app)", "(three-segments)", "[first]", "[second]", "[third]");

      const subroutes = ["uvod", "navod", "otazka", "rekapitulace", "vysledek", "porovnani"];

      for (const subroute of subroutes) {
        expect(existsSync(join(oneSegmentDir, subroute, "page.tsx"))).toBe(true);
        expect(existsSync(join(twoSegmentDir, subroute, "page.tsx"))).toBe(true);
        expect(existsSync(join(threeSegmentDir, subroute, "page.tsx"))).toBe(true);
      }
    });

    it("should have matching subroutes for web and embed patterns", () => {
      const webOneSegmentDir = join(appDir, "(web)", "(app)", "(one-segment)", "[first]");
      const embedOneSegmentDir = join(appDir, "(embed)", "embed", "[embed]", "(one-segment)", "[first]");

      const subroutes = ["uvod", "navod", "otazka", "rekapitulace", "vysledek", "porovnani"];

      for (const subroute of subroutes) {
        const webExists = existsSync(join(webOneSegmentDir, subroute, "page.tsx"));
        const embedExists = existsSync(join(embedOneSegmentDir, subroute, "page.tsx"));

        // Both should exist or both should not exist (consistent structure)
        expect(webExists).toBe(embedExists);
      }
    });
  });

  describe("No hardcoded /volby prefix", () => {
    it("should not have volby folder in web app routes", () => {
      const volbyDir = join(appDir, "(web)", "(app)", "volby");
      expect(existsSync(volbyDir)).toBe(false);
    });

    it("should not have volby folder in embed routes", () => {
      const volbyEmbedDir = join(appDir, "(embed)", "embed", "[embed]", "volby");
      expect(existsSync(volbyEmbedDir)).toBe(false);
    });
  });
});
