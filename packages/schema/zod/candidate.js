import { z } from "zod";
export const candidate = z
  .object({
    id: z.string().uuid().describe("Unique identifier of a candidate in the format of UUID"),
    reference: z
      .object({
        id: z.string().uuid().describe("Unique identifier of a reference in the format of UUID"),
        type: z.enum(["person", "organization"]).describe("Type of a reference: either a person or an organization "),
      })
      .describe("Reference to a person or an organization which is a candidate"),
    displayName: z.string().describe("Display name of a candidate").optional(),
    images: z.any().optional(),
    motto: z.string().describe("Motto of a candidate").optional(),
    number: z.number().int().describe("Official candidate list (usually drawn) number assigned by a public authority").optional(),
  })
  .describe("Candidate for a calculator");
