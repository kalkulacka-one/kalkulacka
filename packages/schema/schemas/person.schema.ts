import { z } from "zod";
import { imagesSchema } from "./images.schema.js";
import * as organizationSchema from "./organization.schema.js";

export const personIdSchema = z.string().uuid().describe("Unique identifier of a person in the format of UUID");

export const personSchemaReference = z
  .object({
    id: personIdSchema,
    type: z.literal("person"),
  })
  .strict();

const personBaseSchema = z
  .object({
    id: personIdSchema,
    additionalName: z.string().describe("Additional name (middle name)").optional(),
    honorificPrefix: z.string().describe("Honorifics preceding a person's name").optional(),
    honorificSuffix: z.string().describe("Honorifics following a person's name").optional(),
    sortName: z.string().describe("A name to use in a lexicographically ordered list").optional(),
    alternateNames: z.array(z.string()).describe("Alternate names to use for example in search").optional(),
    images: imagesSchema.optional(),
    memberOf: z
      .lazy(() =>
        z
          .array(z.object({ id: organizationSchema.organizationIdSchema }).describe("Reference to an organization").strict())
          .min(1)
          .describe("List of organizations a person is a member of")
      )
      .optional(),
  })
  .strict();

const personWithFullName = z.object({
  name: z.string().describe("Person's preferred full name"),
  familyName: z.string().describe("Family name (last name)").optional(),
  givenName: z.string().describe("Given name (first name)").optional(),
});

const personWithFamilyAndGivenName = z.object({
  name: z.string().describe("Person's preferred full name").optional(),
  familyName: z.string().describe("Family name (last name)"),
  givenName: z.string().describe("Given name (first name)"),
});

export const personSchema = z.union([personBaseSchema.extend(personWithFullName.shape), personBaseSchema.extend(personWithFamilyAndGivenName.shape)]).describe("A human being");

export type Person = z.infer<typeof personSchema>;
