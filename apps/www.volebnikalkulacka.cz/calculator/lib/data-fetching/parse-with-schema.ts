import type { z } from "zod";

export function parseWithSchema<T>({ data, schema }: { data: unknown; schema: z.ZodSchema<T> }): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(`Data validation failed: ${result.error.message}`);
  }

  return result.data;
}
