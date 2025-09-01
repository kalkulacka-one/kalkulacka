import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { fetchFile } from "./fetch-file";
import { loadCalculatorData } from "./load-calculator-data";
import { parseWithSchema } from "./parse-with-schema";

vi.mock("./fetch-file");
vi.mock("./parse-with-schema");

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

    expect(mockFetchFile).toHaveBeenCalledWith(`${DATA_ENDPOINT}/key/calculator.json`);
  });

  it("should handle `DATA_ENDPOINT` environment variable with path", async () => {
    process.env.DATA_ENDPOINT = `${DATA_ENDPOINT}/data`;

    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    await loadCalculatorData({ key: "key" });

    expect(mockFetchFile).toHaveBeenCalledWith(`${DATA_ENDPOINT}/data/key/calculator.json`);
  });

  it("should load calculator data successfully with key only", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;

    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ key: "key" });

    expect(mockFetchFile).toHaveBeenCalledWith(`${DATA_ENDPOINT}/key/calculator.json`);
    expect(mockParseWithSchema).toHaveBeenCalledWith(data, expect.any(Object));
    expect(result).toEqual({ calculator: data });
  });

  it("should load calculator data successfully with key and group", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;

    mockFetchFile.mockResolvedValue(data);
    mockParseWithSchema.mockReturnValue(data);

    const result = await loadCalculatorData({ key: "key", group: "group" });

    expect(mockFetchFile).toHaveBeenCalledWith(`${DATA_ENDPOINT}/key/group/calculator.json`);
    expect(mockParseWithSchema).toHaveBeenCalledWith(data, expect.any(Object));
    expect(result).toEqual({ calculator: data });
  });

  it("should throw error with details when fetch fails", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;
    mockFetchFile.mockRejectedValue(new Error("Network error"));

    await expect(loadCalculatorData({ key: "key" })).rejects.toThrow("Failed to fetch calculator data: Network error");
  });

  it("should throw error with details when parsing fails", async () => {
    process.env.DATA_ENDPOINT = DATA_ENDPOINT;
    const invalidData = { invalid: "data" };

    mockFetchFile.mockResolvedValue(invalidData);
    mockParseWithSchema.mockImplementation(() => {
      throw new Error("Invalid data format");
    });

    await expect(loadCalculatorData({ key: "key" })).rejects.toThrow("Failed to parse calculator data: Invalid data format");
  });
});
