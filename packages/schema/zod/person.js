import { z } from "zod";
export const person = z
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
    images: z.any().optional(),
    memberOf: z
      .array(z.object({ id: z.any() }).describe("Reference to an organization"))
      .min(1)
      .describe("List of organizations a person is a member of")
      .optional(),
  })
  .and(z.union([z.any(), z.any()]))
  .describe("A human being");
