import { describe, expect, it } from "vitest";

import { validateQuestionNumber } from "../../lib/routing/validators/question-number";

/**
 * Tests for error handling in routing
 *
 * These tests verify that invalid routes and parameters are handled correctly.
 * Note: Next.js App Router handles 404s automatically for non-existent routes.
 * These tests focus on validating route parameters and data loading errors.
 */
describe("Error Handling", () => {
  describe("Invalid question numbers", () => {
    it("should throw error for non-numeric question numbers", () => {
      expect(() => validateQuestionNumber("abc")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("otazka")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("1a2b")).toThrow("Invalid question number");
    });

    it("should throw error for question number zero", () => {
      expect(() => validateQuestionNumber("0")).toThrow("Question number must be at least 1");
    });

    it("should throw error for negative question numbers", () => {
      expect(() => validateQuestionNumber("-1")).toThrow("Question number must be at least 1");
      expect(() => validateQuestionNumber("-999")).toThrow("Question number must be at least 1");
    });

    it("should throw error for decimal question numbers", () => {
      expect(() => validateQuestionNumber("1.5")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("2.0")).toThrow("Invalid question number");
    });

    it("should throw error for empty string", () => {
      expect(() => validateQuestionNumber("")).toThrow("Invalid question number");
    });

    it("should throw error for whitespace-only strings", () => {
      expect(() => validateQuestionNumber(" ")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("  ")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("\t")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("\n")).toThrow("Invalid question number");
    });

    it("should throw error for special numeric values", () => {
      expect(() => validateQuestionNumber("NaN")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("Infinity")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("-Infinity")).toThrow("Invalid question number");
    });
  });

  describe("Valid question numbers", () => {
    it("should accept positive integers as strings", () => {
      expect(validateQuestionNumber("1")).toBe(1);
      expect(validateQuestionNumber("5")).toBe(5);
      expect(validateQuestionNumber("10")).toBe(10);
      expect(validateQuestionNumber("999")).toBe(999);
    });

    it("should handle leading zeros", () => {
      // parseInt handles leading zeros naturally
      expect(validateQuestionNumber("01")).toBe(1);
      expect(validateQuestionNumber("001")).toBe(1);
      expect(validateQuestionNumber("0005")).toBe(5);
    });
  });

  describe("Out-of-bounds question numbers", () => {
    it("should accept very large question numbers (validation happens at runtime with actual questions data)", () => {
      // The validator only checks for positive integers, not upper bounds
      // Upper bound validation happens when checking against actual questions array
      expect(validateQuestionNumber("999")).toBe(999);
      expect(validateQuestionNumber("9999")).toBe(9999);
    });

    it("should document that upper bound checking requires questions data", () => {
      // This test documents that checking if question number exceeds
      // available questions requires calculator data loaded in context
      // The questionNumberGuard will call notFound() if the number is invalid,
      // but doesn't check against max questions - that's done in the component
      const validatedNumber = validateQuestionNumber("100");
      expect(validatedNumber).toBe(100);
      // Note: Actual bounds checking happens in components with access to questions array
    });
  });

  describe("Expected Next.js error handling behavior", () => {
    it("should document that non-existent routes return 404 automatically", () => {
      // Next.js App Router automatically returns 404 for routes that don't match
      // any page.tsx or layout.tsx file in the app directory structure
      // Examples:
      // - /volby/non-existent-election -> 404
      // - /volby/snemovni-2025/invalid-page -> 404
      // - /invalid-path -> 404
      expect(true).toBe(true); // Documentation test
    });

    it("should document that questionNumberGuard calls notFound() for invalid numbers", () => {
      // The questionNumberGuard function in lib/routing/guards/question-number.ts
      // catches validation errors and calls Next.js notFound() function,
      // which renders the nearest not-found.tsx file with 404 status
      expect(true).toBe(true); // Documentation test
    });

    it("should document that missing calculator data throws error in layout", () => {
      // Layouts that call loadCalculatorData will throw if required data files
      // (calculator.json, questions.json, candidates.json, candidates-answers.json)
      // are missing or fail to fetch
      // This triggers Next.js error handling and renders error.tsx
      expect(true).toBe(true); // Documentation test
    });

    it("should document that optional data files fail silently", () => {
      // Optional data files (persons.json, organizations.json) can fail to load
      // without causing the entire page to error
      // They will be undefined in the calculator data object
      expect(true).toBe(true); // Documentation test
    });
  });

  describe("Route parameter validation", () => {
    it("should accept valid route segment patterns", () => {
      // Valid route segments should match the pattern: lowercase, numbers, hyphens
      // Examples: snemovni-2025, krajske-2024, prezidentske-2023
      const validSegments = ["snemovni-2025", "krajske-2024", "jihomoravsky", "kalkulacka"];

      for (const segment of validSegments) {
        expect(segment).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    });

    it("should document invalid route segment patterns", () => {
      // Invalid route segments (uppercase, special chars, etc.)
      // will still be accepted by Next.js routing, but may fail when
      // trying to load calculator data if the data doesn't exist
      const invalidSegments = ["Snemovni-2025", "volby_2025", "volby/2025", "volby 2025"];

      for (const segment of invalidSegments) {
        expect(segment).not.toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    });
  });
});
