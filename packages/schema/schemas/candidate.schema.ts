import { z } from "zod";

import { imagesSchema } from "./images.schema";

export const candidateBaseSchema = z
  .object({
    id: z.string().uuid().describe("Unique identifier of a candidate in the format of UUID"),
    references: z
      .array(
        z
          .object({
            id: z.string().uuid().describe("Unique identifier of a reference in the format of UUID"),
            type: z.enum(["person", "organization"]).describe("Type of a reference: either a person or an organization"),
            relationship: z.enum(["coalition-member"]).describe("Relationship of a reference to the candidate").optional(),
          })
          .strict()
          .describe("Reference to a person or an organization"),
      )
      .describe("Ordered list of persons or organizations that are related to the candidate"),
    displayName: z.string().describe("Display name of a candidate").optional(),
    // new props added
    displayShortName: z.string().describe("Display short name of a candidate").optional(),
    displayAdditionalName: z.string().describe("Display additional name of a candidate").optional(),
    images: imagesSchema.optional(),
    motto: z.string().describe("Motto of a candidate").optional(),
    number: z.number().int().describe("Official candidate list (usually drawn) number assigned by a public authority").optional(),
  })
  .strict()
  .describe("Candidate for a calculator");

export type Candidate = z.infer<typeof candidateBaseSchema> & {
  nestedCandidates?: Candidate[];
};

export const candidateSchema: z.ZodType<Candidate> = candidateBaseSchema.extend({
  nestedCandidates: z
    .array(z.lazy(() => candidateSchema))
    .describe("List of nested candidates, which can be used for aggregated answers if top-level candidate answers are not provided")
    .optional(),
});
