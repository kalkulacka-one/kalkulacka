import { z } from "zod";
import { calculatorGroupSchemaReference } from "./calculator-group.schema.js";
import { districtSchema } from "./district.schema.js";
import { electionSchemaReference } from "./election.schema.js";
import { roundSchema } from "./round.schema.js";
import { tagsSchema } from "./tags.schema.js";
import { variantSchema } from "./variant.schema.js";

export const calculatorIdSchema = z.string().uuid().describe("Unique identifier of a calculator in the format of UUID");
export const calculatorKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a standalone calculator in the hyphen-separated lowercased format")
  .optional();

export const calculatorCreatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the creation of a calculator in the ISO 8601 format");
export const calculatorUpdatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the last update of a calculator in the ISO 8601 format").optional();
export const calculatorPublishedAtSchema = z.string().datetime({ offset: true }).describe("Time when a calculator should be published in the ISO 8601 format").optional();
export const calculatorTitleSchema = z.string().describe("Title of a calculator").optional();
export const calculatorShortTitleSchema = z.string().max(25).describe("Short title of a calculator with a maximum of 25 characters").optional();
export const calculatorDescriptionSchema = z.string().describe("Description of a calculator").optional();
export const calculatorMethodologySchema = z.string().describe("Methodology of a calculator").optional();
export const calculatorIntroSchema = z.string().describe("Intro text displayed before starting the calculator").optional();
// deacription missing
export const calculatorTagsSchema = tagsSchema.optional();
export const calculatorCalculatorGroupSchema = calculatorGroupSchemaReference.describe("Reference to a calculator group the calculator belongs to").optional();
export const calculatorElectionSchema = electionSchemaReference.describe("Reference to an election the calculator belongs to").optional();

export const calculatorBaseSchema = z
  .object({
    id: calculatorIdSchema,
    key: calculatorKeySchema,
    createdAt: calculatorCreatedAtSchema,
    updatedAt: calculatorUpdatedAtSchema,
    publishedAt: calculatorPublishedAtSchema,
    title: calculatorTitleSchema,
    shortTitle: calculatorShortTitleSchema,
    description: calculatorDescriptionSchema,
    methodology: calculatorMethodologySchema,
    intro: calculatorIntroSchema,
    tags: calculatorTagsSchema,
    calculatorGroup: calculatorCalculatorGroupSchema,
    election: calculatorElectionSchema,
    // maybe put them above for better readiblity ?
    variant: variantSchema.optional(),
    district: districtSchema.optional(),
    round: roundSchema.optional(),
  })
  .strict()
  .refine(
    (value) => {
      const isStandalone = value.key && value.shortTitle && !value.calculatorGroup && !value.election;
      const isFromGroup = value.calculatorGroup && value.variant && !value.election;
      const isFromElection = value.calculatorGroup && value.election && (value.variant || value.district || value.round);
      const calculatorSchemas = [isStandalone, isFromGroup, isFromElection];
      const oneValid = calculatorSchemas.filter(Boolean).length === 1;
      return oneValid;
    },
    { message: "Provide valid calculator data" },
  )
  .describe("Calculator is a set of questions, candidates and their answers");
