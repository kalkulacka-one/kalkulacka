import { describe, expect, it } from "vitest";

import { validateQuestionNumber } from "../../lib/routing/validators/question-number";

describe("Route Validators", () => {
  describe("validateQuestionNumber", () => {
    it("should validate positive integer question numbers", () => {
      expect(validateQuestionNumber("1")).toBe(1);
      expect(validateQuestionNumber("5")).toBe(5);
      expect(validateQuestionNumber("10")).toBe(10);
      expect(validateQuestionNumber("999")).toBe(999);
    });

    it("should throw error for non-numeric values", () => {
      expect(() => validateQuestionNumber("abc")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("1a")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber(" ")).toThrow("Invalid question number");
    });

    it("should throw error for zero and negative numbers", () => {
      expect(() => validateQuestionNumber("0")).toThrow("Question number must be at least 1");
      expect(() => validateQuestionNumber("-1")).toThrow("Question number must be at least 1");
      expect(() => validateQuestionNumber("-5")).toThrow("Question number must be at least 1");
    });

    it("should throw error for decimal numbers", () => {
      expect(() => validateQuestionNumber("1.5")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("3.14")).toThrow("Invalid question number");
    });

    it("should throw error for special values", () => {
      expect(() => validateQuestionNumber("NaN")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("Infinity")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("null")).toThrow("Invalid question number");
      expect(() => validateQuestionNumber("undefined")).toThrow("Invalid question number");
    });
  });
});
