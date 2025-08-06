import { literal, z } from "zod";
import { imagesSchema } from "./images.schema.js";
import { personSchemaReference } from "./person.schema.js";

export const organizationIdSchema = z.string().uuid().describe("Unique identifier of an organization in the format of UUID");

export const organizationSchemaReference = z
  .object({
    id: organizationIdSchema,
    type: literal("organization"),
  })
  .strict();

export const organizationSchema = z
  .object({
    id: organizationIdSchema,
    name: z.string().describe("Organization's preferred full name"),
    officialName: z.string().describe("Organization's official name with an unlimited length").optional(),
    shortName: z.string().max(25).describe("Organization's short name with max. 25 characters").optional(),
    abbreviation: z.string().max(15).describe("Organization's abbreviation with max. 15 characters").optional(),
    sortName: z.string().describe("A name to use in a lexicographically ordered list").optional(),
    alternateNames: z.array(z.string()).describe("Alternate names to use for example in search").optional(),
    images: imagesSchema.optional(),
    members: z
      .array(z.discriminatedUnion("type", [organizationSchemaReference, personSchemaReference]))
      .min(1)
      .optional(),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (!val.shortName && !val.abbreviation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Organization must have at least a shortName or an abbreviation",
        path: ["shortName", "abbreviation"],
      });
    }
  })
  .describe("Organization is a group of people, for example a political party, a movement, etc.");

export type Organization = z.infer<typeof organizationSchema>;
