import { z } from "zod";

const variantKeySchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a variant in the hyphen-separated lowercased format");

export const variantReferenceSchema = z.object({ key: variantKeySchema }).strict().describe("Reference to a variant of a calculator group");

export const variantSchema = z
  .object({
    key: variantKeySchema,
  })
  .strict()
  .describe("Variant of a calculator");

export type Variant = z.infer<typeof variantSchema>;
export type VariantReference = z.infer<typeof variantReferenceSchema>;
