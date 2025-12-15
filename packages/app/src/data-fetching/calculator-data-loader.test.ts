import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CalculatorData } from "@/data-fetching";
import { InternalServerError, NotFoundError } from "@/errors";

import { calculatorDataLoader } from "./calculator-data-loader";
import { loadCalculatorData } from "./load-calculator-data";

vi.mock("./load-calculator-data", () => ({
  loadCalculatorData: vi.fn(),
}));

describe("calculatorDataLoader", () => {
  const mockLoadCalculatorData = vi.mocked(loadCalculatorData);
  const mockOnNotFound = vi.fn() as unknown as () => never;

  const DATA_ENDPOINT = "https://data.kalkulacka.one";
  const mockCalculatorData = {
    data: {
      calculator: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Sněmovní volby 2025",
        publishedAt: "2024-01-15T10:30:00Z",
      },
      questions: { id: "questions" },
      candidates: { id: "candidates" },
      candidatesAnswers: { id: "candidatesAnswers" },
      persons: { id: "persons" },
      organizations: { id: "organizations" },
    },
    baseUrl: `${DATA_ENDPOINT}/key`,
  } as unknown as CalculatorData;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load calculator data successfully with key only", async () => {
    mockLoadCalculatorData.mockResolvedValue(mockCalculatorData);

    const result = await calculatorDataLoader({
      endpoint: DATA_ENDPOINT,
      key: "key",
      onNotFound: mockOnNotFound,
    });

    expect(mockLoadCalculatorData).toHaveBeenCalledWith({ endpoint: DATA_ENDPOINT, key: "key", group: undefined });
    expect(mockOnNotFound).not.toHaveBeenCalled();
    expect(result).toEqual(mockCalculatorData);
  });

  it("should load calculator data successfully with key and group", async () => {
    mockLoadCalculatorData.mockResolvedValue(mockCalculatorData);

    const result = await calculatorDataLoader({
      endpoint: DATA_ENDPOINT,
      key: "key",
      group: "group",
      onNotFound: mockOnNotFound,
    });

    expect(mockLoadCalculatorData).toHaveBeenCalledWith({ endpoint: DATA_ENDPOINT, key: "key", group: "group" });
    expect(mockOnNotFound).not.toHaveBeenCalled();
    expect(result).toEqual(mockCalculatorData);
  });

  it("should call onNotFound callback when NotFoundError is thrown", async () => {
    const notFoundError = new NotFoundError("Calculator not found");
    mockLoadCalculatorData.mockRejectedValue(notFoundError);

    await expect(
      calculatorDataLoader({
        endpoint: DATA_ENDPOINT,
        key: "missing",
        onNotFound: mockOnNotFound,
      }),
    ).rejects.toThrow(NotFoundError);

    expect(mockLoadCalculatorData).toHaveBeenCalledWith({ endpoint: DATA_ENDPOINT, key: "missing", group: undefined });
    expect(mockOnNotFound).toHaveBeenCalledTimes(1);
  });

  it("should re-throw other errors without calling onNotFound", async () => {
    const networkError = new Error("Network error");
    mockLoadCalculatorData.mockRejectedValue(networkError);

    await expect(
      calculatorDataLoader({
        endpoint: DATA_ENDPOINT,
        key: "key",
        onNotFound: mockOnNotFound,
      }),
    ).rejects.toThrow(Error);

    expect(mockLoadCalculatorData).toHaveBeenCalledWith({ endpoint: DATA_ENDPOINT, key: "key", group: undefined });
    expect(mockOnNotFound).not.toHaveBeenCalled();
  });

  it("should re-throw InternalServerError without calling onNotFound", async () => {
    const serverError = new InternalServerError("Internal server error");
    mockLoadCalculatorData.mockRejectedValue(serverError);

    await expect(
      calculatorDataLoader({
        endpoint: DATA_ENDPOINT,
        key: "key",
        onNotFound: mockOnNotFound,
      }),
    ).rejects.toThrowError(InternalServerError);

    expect(mockLoadCalculatorData).toHaveBeenCalledWith({ endpoint: DATA_ENDPOINT, key: "key", group: undefined });
    expect(mockOnNotFound).not.toHaveBeenCalled();
  });
});
