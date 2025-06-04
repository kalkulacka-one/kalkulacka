import { z } from "zod";

export const variant = z
  .object({
    key: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .describe("Human-friendly unique key of a variant in the hyphen-separated lowercased format"),
  })
  .describe("Variant of a calculator");
export type Variant = z.infer<typeof variant>;
