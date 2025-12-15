import { NotFoundError } from "@kalkulacka-one/app";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { parseWithSchema } from "@/utilities";

import { fetchFile } from "./fetch-file";
import { loadCalculatorData } from "./load-calculator-data";

vi.mock("./fetch-file", () => ({
  fetchFile: vi.fn(),
}));

vi.mock("@/utilities/parse-with-schema", () => ({
  parseWithSchema: vi.fn(),
}));

describe("loadCalculatorData", () => {
  const mockFetchFile = vi.mocked(fetchFile);
  const mockParseWithSchema = vi.mocked(parseWithSchema);

  const DATA_ENDPOINT = "https://data.kalkulacka.one";
  const data = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "Sněmovní volby 2025",
    publishedAt: "2024-01-15T10:30:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error when endpoint parameter is invalid URL", async () => {
    await expect(loadCalculatorData({ endpoint: "not-a-valid-url", key: "test" })).rejects.toThrowError(new Error("Invalid endpoint"));
  });

  it("should throw error when endpoint parameter is empty string", async () => {
    await expect(loadCalculatorData({ endpoint: "", key: "test" })).rejects.toThrowError(new Error("Invalid endpoint"));
  });

  it("should handle trailing slash in endpoint parameter", async () => {
    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    await loadCalculatorData({ endpoint: `${DATA_ENDPOINT}/`, key: "key" });

    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/calculator.json` });
  });

  it("should handle endpoint parameter with path", async () => {
    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    await loadCalculatorData({ endpoint: `${DATA_ENDPOINT}/data`, key: "key" });

    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/data/key/calculator.json` });
  });

  it("should load calculator data successfully with key only", async () => {
    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ endpoint: DATA_ENDPOINT, key: "key" });

    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/calculator.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/questions.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/candidates.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/candidates-answers.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/persons.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/organizations.json` });
    expect(mockParseWithSchema).toHaveBeenCalledWith({ data, schema: expect.any(Object) });
    expect(result).toEqual({
      data: {
        calculator: data,
        questions: data,
        candidates: data,
        candidatesAnswers: data,
        persons: data,
        organizations: data,
      },
      baseUrl: `${DATA_ENDPOINT}/key`,
    });
  });

  it("should load calculator data successfully with key and group", async () => {
    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ endpoint: DATA_ENDPOINT, key: "key", group: "group" });

    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/group/key/calculator.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/group/key/questions.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/group/key/candidates.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/group/key/candidates-answers.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/group/key/persons.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/group/key/organizations.json` });
    expect(mockParseWithSchema).toHaveBeenCalledWith({ data, schema: expect.any(Object) });
    expect(result).toEqual({
      data: {
        calculator: data,
        questions: data,
        candidates: data,
        candidatesAnswers: data,
        persons: data,
        organizations: data,
      },
      baseUrl: `${DATA_ENDPOINT}/group/key`,
    });
  });

  it("should throw error with details when fetch fails", async () => {
    mockFetchFile.mockRejectedValue(new Error("Network error"));

    await expect(loadCalculatorData({ endpoint: DATA_ENDPOINT, key: "key" })).rejects.toThrowError(new Error("Network error"));
  });

  it("should throw error with details when parsing fails", async () => {
    const invalidData = { invalid: "data" };

    mockFetchFile.mockResolvedValue(invalidData);
    mockParseWithSchema.mockImplementation(() => {
      throw new Error("Invalid data format");
    });

    await expect(loadCalculatorData({ endpoint: DATA_ENDPOINT, key: "key" })).rejects.toThrowError(new Error("Failed to parse calculator data: Invalid data format"));
  });

  it("should handle missing optional files gracefully", async () => {
    mockFetchFile.mockImplementation(({ url }) => {
      if (url.includes("persons.json") || url.includes("organizations.json")) {
        return Promise.reject(new Error("File not found"));
      }
      return Promise.resolve(data);
    });
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ endpoint: DATA_ENDPOINT, key: "key" });

    expect(result.data.persons).toBeUndefined();
    expect(result.data.organizations).toBeUndefined();
    expect(result.data.calculator).toEqual(data);
    expect(result.data.questions).toEqual(data);
    expect(result.data.candidates).toEqual(data);
    expect(result.data.candidatesAnswers).toEqual(data);
  });

  it("should throw NotFoundError when calculator.json is missing", async () => {
    mockFetchFile.mockImplementation(({ url }) => {
      if (url.includes("calculator.json")) {
        return Promise.reject(new NotFoundError("File not found"));
      }
      return Promise.resolve(data);
    });

    await expect(loadCalculatorData({ endpoint: DATA_ENDPOINT, key: "key" })).rejects.toThrow(NotFoundError);
  });

  it("should throw NotFoundError when questions.json is missing", async () => {
    mockFetchFile.mockImplementation(({ url }) => {
      if (url.includes("questions.json")) {
        return Promise.reject(new NotFoundError("File not found"));
      }
      return Promise.resolve(data);
    });

    await expect(loadCalculatorData({ endpoint: DATA_ENDPOINT, key: "key" })).rejects.toThrow(NotFoundError);
  });
});
