import { z } from "zod";

import { imagesSchema } from "./images.schema";
import * as personSchema from "./person.schema";

export const organizationIdSchema = z.string().uuid().describe("Unique identifier of an organization in the format of UUID");

export const organizationSchemaReference = z
  .object({
    id: organizationIdSchema,
    type: z.literal("organization"),
  })
  .strict();

const organizationBaseSchema = z.object({
  id: organizationIdSchema,
  name: z.string().describe("Organization's preferred full name"),
  officialName: z.string().describe("Organization's official name with an unlimited length").optional(),
  sortName: z.string().describe("A name to use in a lexicographically ordered list").optional(),
  alternateNames: z.array(z.string()).describe("Alternate names to use for example in search").optional(),
  images: imagesSchema.optional(),
  members: z.lazy(() => z.array(z.discriminatedUnion("type", [organizationSchemaReference, personSchema.personSchemaReference])).min(1)).optional(),
});

const organizationWithShortName = z.object({
  shortName: z.string().max(25).describe("Organization's short name with max. 25 characters"),
  abbreviation: z.string().max(15).describe("Organization's abbreviation with max. 15 characters").optional(),
});

const organizationWithShortNameSchema = organizationBaseSchema.merge(organizationWithShortName).strict();

const organizationWithAbbreviation = z.object({
  shortName: z.string().max(25).describe("Organization's short name with max. 25 characters").optional(),
  abbreviation: z.string().max(15).describe("Organization's abbreviation with max. 15 characters"),
});

const organizationWithAbbreviationSchema = organizationBaseSchema.merge(organizationWithAbbreviation).strict();

// export const organizationSchema = organizationBaseSchema
//   .and(z.union([organizationWithShortName, organizationWithAbbreviation]))
//   .describe("Organization is a group of people, for example a political party, a movement, etc.")

export const organizationSchema = z.union([organizationWithShortNameSchema, organizationWithAbbreviationSchema]);

export type Organization = z.infer<typeof organizationSchema>;
