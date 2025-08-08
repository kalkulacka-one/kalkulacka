import { z } from "zod";
import { electionSchemaReference } from "./election.schema.js";
import { variantSchema } from "./variant.schema.js";

export const calculatorGroupIdSchema = z.string().uuid().describe("Unique identifier of a calculator group in the format of UUID");
export const calculatorGroupKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a standalone calculator group in the hyphen-separated lowercased format");
export const calculatorGroupCreatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the creation of a calculator group in the ISO 8601 format");
export const calculatorGroupUpdatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the last update of a calculator group in the ISO 8601 format");
export const calculatorGroupPublishedAtSchema = z.string().datetime({ offset: true }).describe("Time when a calculator group should be published in the ISO 8601 format");
export const calculatorGroupTitleSchema = z.string().describe("Title of a calculator group");
export const calculatorGroupShortTitleSchema = z.string().max(25).describe("Short title of a calculator group with a maximum of 25 characters");
export const calculatorGroupDescriptionSchema = z.string().describe("Description of a calculator group");
export const calculatorGroupElectionSchema = electionSchemaReference;

export const calculatorGroupSchemaReference = z
  .object({
    id: calculatorGroupIdSchema,
    key: calculatorGroupKeySchema,
  })
  .strict();

export const calculatorGroupSchema = z
  .object({
    id: calculatorGroupIdSchema,
    key: calculatorGroupKeySchema,
    createdAt: calculatorGroupCreatedAtSchema,
    updatedAt: calculatorGroupUpdatedAtSchema,
    publishedAt: calculatorGroupPublishedAtSchema,
    title: calculatorGroupTitleSchema,
    shortTitle: calculatorGroupShortTitleSchema,
    description: calculatorGroupDescriptionSchema,
    election: calculatorGroupElectionSchema,
    variants: z.array(variantSchema).min(1),
  })
  .strict()
  .describe("Group of two or more calculators");
