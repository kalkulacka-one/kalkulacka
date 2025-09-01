import { z } from "zod";

export const districtSchema = z
  .object({
    key: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .describe("Human-friendly unique key of a district in the hyphen-separated lowercased format"),
    code: z.string().describe("Official district code assigned by the election authority").optional(),
  })
  .strict()
  .describe("Geographical area of an election");

export type District = z.infer<typeof districtSchema>;
