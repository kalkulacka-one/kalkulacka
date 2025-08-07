import { z } from "zod";
import { calculatorGroupSchemaReference } from "./calculator-group.schema.js";
import { districtSchema } from "./district.schema.js";
import { tagsSchema } from "./tags.schema.js";

export const electionIdSchema = z.string().uuid().describe("Unique identifier of a calculator group in the format of UUID");
export const electionKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a standalone calculator group in the hyphen-separated lowercased format");
export const electionCreatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the creation of a calculator group in the ISO 8601 format");
export const electionUpdatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the last update of a calculator group in the ISO 8601 format");
export const electionPublishedAtSchema = z.string().datetime({ offset: true }).describe("Time when a calculator group should be published in the ISO 8601 format");
export const electionTitleSchema = z.string().describe("Title of a calculator group");
export const electionShortTitleSchema = z.string().max(25).describe("Short title of a calculator group with a maximum of 25 characters");
export const electionDescriptionSchema = z.string().describe("Description of a calculator group");
export const electionCalculatorGroupSchema = calculatorGroupSchemaReference.describe("Reference to a calculator group with election calculators");

export const electionSchema = z.object({
  id: electionIdSchema,
  key: electionKeySchema,
  createdAt: electionCreatedAtSchema,
  updatedAt: electionUpdatedAtSchema,
  publishedAt: electionPublishedAtSchema,
  title: electionTitleSchema,
  shortTitle: electionShortTitleSchema,
  description: electionDescriptionSchema,
  tags: tagsSchema,
  calculatorGroup: electionCalculatorGroupSchema,
  districts: z.array(districtSchema).describe("Ordered list of election districts"),
});
