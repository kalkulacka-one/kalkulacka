import { z } from "zod";
import { imagesSchema } from "./images.schema.js";
import { organizationSchemaReference } from "./organization.schema.js";
import { personSchemaReference } from "./person.schema.js";

const candidatePersonReferenceSchema = personSchemaReference.extend({
  relationship: z.enum(["coalition-member"]).optional(),
});

const candidateOrganizationReferenceSchema = organizationSchemaReference.extend({
  relationship: z.enum(["coalition-member"]).optional(),
});

export const candidateSchema = z
  .object({
    id: z.string().uuid().describe("Unique identifier of a candidate in the format of UUID"),
    references: z
      .array(z.discriminatedUnion("type", [candidatePersonReferenceSchema, candidateOrganizationReferenceSchema]).describe("Reference to a person or an organization"))
      .describe("Ordered list of persons or organizations that are related to the candidate"),
    displayName: z.string().describe("Display name of a candidate").optional(),
    images: imagesSchema.optional(),
    motto: z.string().describe("Motto of a candidate").optional(),
    number: z.number().int().describe("Official candidate list (usually drawn) number assigned by a public authority").optional(),
  })
  .describe("Candidate for a calculator")
  .strict();

export type Candidate = z.infer<typeof candidateSchema>;
