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
    kind: z.enum(["municipality", "municipal-district", "electoral-district", "region"]).describe("Kind of the territorial unit; drives the district picker copy and whether the code is displayed"),
    title: z.string().describe("Human-readable name of the district"),
    shortTitle: z.string().max(25).describe("Short name of the district with a maximum of 25 characters").optional(),
    parent: districtKeySchema.describe("Key of the parent district (e.g. a city for its city district)").optional(),
  })
  .strict()
  .describe("Geographical area of an election");

export type District = z.infer<typeof districtSchema>;
export type DistrictReference = z.infer<typeof districtReferenceSchema>;
