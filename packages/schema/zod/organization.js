import { z } from "zod";
export const organization = z
  .object({
    id: z.string().uuid().describe("Unique identifier of an organization in the format of UUID"),
    name: z.string().describe("Organization's preferred full name"),
    officialName: z.string().describe("Organization's official name with an unlimited length").optional(),
    shortName: z.string().max(25).describe("Organization's short name with max. 25 characters").optional(),
    abbreviation: z.string().max(15).describe("Organization's abbreviation with max. 15 characters").optional(),
    sortName: z.string().describe("A name to use in a lexicographically ordered list").optional(),
    alternateNames: z.array(z.string()).describe("Alternate names to use for example in search").optional(),
    images: z.any().optional(),
    type: z.enum(["party", "coalition", "candidate-list"]).describe("Whether the organization is a political party/movement, coalition or a candidate list").optional(),
    members: z
      .array(
        z.any().superRefine((x, ctx) => {
          const schemas = [z.any(), z.any()];
          const errors = schemas.reduce((errors, schema) => ((result) => (result.error ? [...errors, result.error] : errors))(schema.safeParse(x)), []);
          if (schemas.length - errors.length !== 1) {
            ctx.addIssue({
              path: ctx.path,
              code: "invalid_union",
              unionErrors: errors,
              message: "Invalid input: Should pass single schema",
            });
          }
        }),
      )
      .min(1)
      .describe("List of members of an organization")
      .optional(),
  })
  .and(z.union([z.any(), z.any()]))
  .describe("Organization is a group of people, for example a political party, a movement, etc.");
