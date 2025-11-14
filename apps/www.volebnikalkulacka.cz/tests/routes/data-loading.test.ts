import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { fetchFile } from "../../calculator/lib/data-fetching/fetch-file";
import { loadCalculatorData } from "../../calculator/lib/data-fetching/load-calculator-data";
import { parseWithSchema } from "../../calculator/lib/utilities/parse-with-schema";
import { getMockCalculatorData, mockOneSegmentCalculatorData, mockTwoSegmentCalculatorData } from "../fixtures/mock-calculator-data";

vi.mock("../../calculator/lib/data-fetching/fetch-file");
vi.mock("../../calculator/lib/utilities/parse-with-schema");

/**
 * Tests for calculator data loading in different routing contexts
 *
 * These tests verify that loadCalculatorData is called with correct parameters
 * for different route types (one-segment vs two-segment).
 */
describe("Calculator Data Loading for Routes", () => {
  const mockFetchFile = fetchFile as Mock;
  const mockParseWithSchema = parseWithSchema as Mock;
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv, DATA_ENDPOINT: "https://data.kalkulacka.one" };
  });

  describe("One-segment route data loading", () => {
    const routeParams = { key: "snemovni-2025" };

    it("should load calculator data with only key parameter", async () => {
      mockFetchFile.mockResolvedValue(mockOneSegmentCalculatorData.data.calculator);
      mockParseWithSchema.mockReturnValue(mockOneSegmentCalculatorData.data.calculator);

      const result = await loadCalculatorData(routeParams);

      expect(result.baseUrl).toBe("https://data.kalkulacka.one/snemovni-2025");
      expect(mockFetchFile).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://data.kalkulacka.one/snemovni-2025/calculator.json",
        }),
      );
    });

    it("should fetch all required data files for one-segment route", async () => {
      mockFetchFile.mockResolvedValue({});
      mockParseWithSchema.mockReturnValue({});

      await loadCalculatorData(routeParams);

      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/snemovni-2025/calculator.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/snemovni-2025/questions.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/snemovni-2025/candidates.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/snemovni-2025/candidates-answers.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/snemovni-2025/persons.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/snemovni-2025/organizations.json" });
    });

    it("should construct correct baseUrl for one-segment route", async () => {
      mockFetchFile.mockResolvedValue({});
      mockParseWithSchema.mockReturnValue({});

      const result = await loadCalculatorData(routeParams);

      expect(result.baseUrl).toBe("https://data.kalkulacka.one/snemovni-2025");
    });
  });

  describe("Two-segment route data loading", () => {
    const routeParams = { key: "krajske-2024", group: "jihomoravsky" };

    it("should load calculator data with key and group parameters", async () => {
      mockFetchFile.mockResolvedValue(mockTwoSegmentCalculatorData.data.calculator);
      mockParseWithSchema.mockReturnValue(mockTwoSegmentCalculatorData.data.calculator);

      const result = await loadCalculatorData(routeParams);

      expect(result.baseUrl).toBe("https://data.kalkulacka.one/krajske-2024/jihomoravsky");
      expect(mockFetchFile).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://data.kalkulacka.one/krajske-2024/jihomoravsky/calculator.json",
        }),
      );
    });

    it("should fetch all required data files for two-segment route", async () => {
      mockFetchFile.mockResolvedValue({});
      mockParseWithSchema.mockReturnValue({});

      await loadCalculatorData(routeParams);

      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/krajske-2024/jihomoravsky/calculator.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/krajske-2024/jihomoravsky/questions.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/krajske-2024/jihomoravsky/candidates.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/krajske-2024/jihomoravsky/candidates-answers.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/krajske-2024/jihomoravsky/persons.json" });
      expect(mockFetchFile).toHaveBeenCalledWith({ url: "https://data.kalkulacka.one/krajske-2024/jihomoravsky/organizations.json" });
    });

    it("should construct correct baseUrl for two-segment route", async () => {
      mockFetchFile.mockResolvedValue({});
      mockParseWithSchema.mockReturnValue({});

      const result = await loadCalculatorData(routeParams);

      expect(result.baseUrl).toBe("https://data.kalkulacka.one/krajske-2024/jihomoravsky");
    });
  });

  describe("Mock data helper", () => {
    it("should return one-segment mock data when group is not provided", () => {
      const data = getMockCalculatorData({ key: "snemovni-2025" });
      expect(data).toEqual(mockOneSegmentCalculatorData);
      expect(data.baseUrl).toBe("https://data.kalkulacka.one/snemovni-2025");
    });

    it("should return two-segment mock data when group is provided", () => {
      const data = getMockCalculatorData({ key: "krajske-2024", group: "jihomoravsky" });
      expect(data).toEqual(mockTwoSegmentCalculatorData);
      expect(data.baseUrl).toBe("https://data.kalkulacka.one/krajske-2024/jihomoravsky");
    });
  });

  describe("Error handling for routes", () => {
    it("should throw error when required data files are missing", async () => {
      mockFetchFile.mockRejectedValue(new Error("File not found"));

      await expect(loadCalculatorData({ key: "non-existent" })).rejects.toThrow("Failed to fetch");
    });

    it("should handle optional files gracefully", async () => {
      mockFetchFile.mockImplementation(({ url }) => {
        if (url.includes("persons.json") || url.includes("organizations.json")) {
          return Promise.reject(new Error("File not found"));
        }
        return Promise.resolve({});
      });
      mockParseWithSchema.mockReturnValue({});

      const result = await loadCalculatorData({ key: "test" });

      expect(result.data.persons).toBeUndefined();
      expect(result.data.organizations).toBeUndefined();
      expect(result.data.calculator).toBeDefined();
    });
  });
});
