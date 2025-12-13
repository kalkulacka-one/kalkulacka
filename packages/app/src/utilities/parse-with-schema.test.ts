import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseWithSchema } from "./parse-with-schema";

describe("parseWithSchema", () => {
  const schema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    publishedAt: z.string().datetime().optional(),
  });

  it("should return parsed data on valid input", () => {
    const data = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Sněmovní volby 2025",
      publishedAt: "2024-01-15T10:30:00Z",
    };

    const result = parseWithSchema({ data, schema });
    expect(result).toEqual(data);
  });

  it("should throw error on invalid input", () => {
    const invalidData = {
      id: "invalid-uuid",
      title: "Sněmovní volby 2025",
      publishedAt: "not-a-date",
    };

    expect(() => parseWithSchema({ data: invalidData, schema })).toThrow("Data validation failed");
  });

  it("should include Zod error message in thrown error", () => {
    const invalidData = { id: "123e4567-e89b-12d3-a456-426614174000", title: 123 };

    expect(() => parseWithSchema({ data: invalidData, schema })).toThrow(/expected string, received number/);
  });
});
