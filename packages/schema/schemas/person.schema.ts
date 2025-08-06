import { z } from "zod";
import { imagesSchema } from "./images.schema.js";
import { organizationIdSchema } from "./organization.schema.js";

export const basePersonSchema = z
  .object({
    id: z.string().uuid().describe("Unique identifier of a person in the format of UUID"),
    name: z.string().describe("Person's preferred full name").optional(),
    familyName: z.string().describe("Family name (last name)").optional(),
    givenName: z.string().describe("Given name (first name)").optional(),
    additionalName: z.string().describe("Additional name (middle name)").optional(),
    honorificPrefix: z.string().describe("Honorifics preceding a person's name").optional(),
    honorificSuffix: z.string().describe("Honorifics following a person's name").optional(),
    sortName: z.string().describe("A name to use in a lexicographically ordered list").optional(),
    alternateNames: z.array(z.string()).describe("Alternate names to use for example in search").optional(),
    images: imagesSchema.optional(),
    memberOf: z
      .array(z.object({ id: organizationIdSchema }).describe("Reference to an organization").strict())
      .min(1)
      .describe("List of organizations a person is a member of")
      .optional(),
  })
  .strict();

export const personSchemaReference = z
  .object({
    id: basePersonSchema.shape.id,
    type: z.literal("person"),
  })
  .strict();

export const personSchema = basePersonSchema
  .superRefine((val, ctx) => {
    if (!val.name && !(val.familyName && val.givenName)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Person must have either name or family name with given name. ",
        path: ["name", "familyName", "givenName"],
      });
    }
  })
  .describe("A human being");

export type Person = z.infer<typeof personSchema>;
