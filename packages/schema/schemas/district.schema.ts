import { z } from "zod";

const districtKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a district in the hyphen-separated lowercased format");

export const districtReferenceSchema = z.object({ key: districtKeySchema }).strict().describe("Reference to a district of an election");

export const districtSchema = z
  .object({
    key: districtKeySchema,
    code: z.string().describe("Official district code assigned by the election authority").optional(),
  })
  .strict()
  .describe("Geographical area of an election");

export type District = z.infer<typeof districtSchema>;
export type DistrictReference = z.infer<typeof districtReferenceSchema>;
