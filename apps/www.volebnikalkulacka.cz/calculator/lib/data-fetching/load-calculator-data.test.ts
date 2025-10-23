import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { parseWithSchema } from "../utilities";
import { fetchFile } from "./fetch-file";
import { loadCalculatorData } from "./load-calculator-data";

vi.mock("../utilities");
vi.mock("./fetch-file");

describe("loadCalculatorData", () => {
  const mockFetchFile = fetchFile as Mock;
  const mockParseWithSchema = parseWithSchema as Mock;
  const originalEnv = process.env;

  const DATA_ENDPOINT = "https://data.kalkulacka.one";
  const data = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "Sněmovní volby 2025",
    publishedAt: "2024-01-15T10:30:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it("should throw error when `DATA_ENDPOINT` environment variable is missing", async () => {
    delete process.env.DATA_ENDPOINT;

    await expect(loadCalculatorData({ key: "test" })).rejects.toThrow("Missing `DATA_ENDPOINT` environment variable");
  });

  it("should throw error when `DATA_ENDPOINT` environment variable is invalid URL", async () => {
    process.env.DATA_ENDPOINT = "not-a-valid-url";

    await expect(loadCalculatorData({ key: "test" })).rejects.toThrow("Invalid `DATA_ENDPOINT` environment variable");
  });

  it("should handle trailing slash in `DATA_ENDPOINT` environment variable", async () => {
    process.env.DATA_ENDPOINT = `${DATA_ENDPOINT}/`;

    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    await loadCalculatorData({ key: "key" });

    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/calculator.json` });
  });

  it("should handle `DATA_ENDPOINT` environment variable with path", async () => {
    process.env.DATA_ENDPOINT = `${DATA_ENDPOINT}/data`;

    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    await loadCalculatorData({ key: "key" });

    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/data/key/calculator.json` });
  });

  it("should load calculator data successfully with key only", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;

    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ key: "key" });

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
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;

    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ key: "key", group: "group" });

    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/group/calculator.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/group/questions.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/group/candidates.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/group/candidates-answers.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/group/persons.json` });
    expect(mockFetchFile).toHaveBeenCalledWith({ url: `${DATA_ENDPOINT}/key/group/organizations.json` });
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
      baseUrl: `${DATA_ENDPOINT}/key/group`,
    });
  });

  it("should return null when required files fail to fetch", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;
    mockFetchFile.mockRejectedValue(new Error("Network error"));

    const result = await loadCalculatorData({ key: "key" });
    expect(result).toBeNull();
  });

  it("should throw error with details when parsing fails", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;
    const invalidData = { invalid: "data" };

    mockFetchFile.mockResolvedValue(invalidData);
    mockParseWithSchema.mockImplementation(() => {
      throw new Error("Invalid data format");
    });

    await expect(loadCalculatorData({ key: "key" })).rejects.toThrow(/Failed to parse .* data: Invalid data format/);
  });

  it("should handle missing optional files gracefully", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;

    mockFetchFile.mockImplementation(({ url }) => {
      if (url.includes("persons.json") || url.includes("organizations.json")) {
        return Promise.reject(new Error("File not found"));
      }
      return Promise.resolve(data);
    });
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ key: "key" });

    expect(result).not.toBeNull();
    expect(result?.data.persons).toBeUndefined();
    expect(result?.data.organizations).toBeUndefined();
    expect(result?.data.calculator).toEqual(data);
    expect(result?.data.questions).toEqual(data);
    expect(result?.data.candidates).toEqual(data);
    expect(result?.data.candidatesAnswers).toEqual(data);
  });

  it("should return null when required files are missing", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;

    mockFetchFile.mockImplementation(({ url }) => {
      if (url.includes("calculator.json")) {
        return Promise.reject(new Error("File not found"));
      }
      return Promise.resolve(data);
    });

    const result = await loadCalculatorData({ key: "key" });
    expect(result).toBeNull();

    mockFetchFile.mockImplementation(({ url }) => {
      if (url.includes("questions.json")) {
        return Promise.reject(new Error("File not found"));
      }
      return Promise.resolve(data);
    });

    const result2 = await loadCalculatorData({ key: "key" });
    expect(result2).toBeNull();
  });
});
