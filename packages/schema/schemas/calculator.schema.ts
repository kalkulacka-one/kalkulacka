import { z } from "zod";

import * as calculatorGroupSchema from "./calculator-group.schema";
import { districtSchema } from "./district.schema";
import * as electionSchema from "./election.schema";
import { imagesSchema } from "./images.schema";
import { roundSchema } from "./round.schema";
import { tagsSchema } from "./tags.schema";
import { variantSchema } from "./variant.schema";

const calculatorGroup = z.lazy(() => calculatorGroupSchema.calculatorGroupSchemaReference).describe("Reference to a calculator group the calculator belongs to");
const election = z.lazy(() => electionSchema.electionSchemaReference).describe("Reference to an election the calculator belongs to");

const versionSchema = z
  .string()
  .regex(/^\d+\.\d+\.\d+$/)
  .describe("Semantic version of the calculator");

const hashSchema = z
  .object({
    algorithm: z.literal("sha256"),
    value: z.string().describe("Checksum value"),
  })
  .strict();

const checksumsSchema = z
  .object({
    questions: hashSchema.describe("Checksum of the questions data"),
  })
  .strict()
  .describe("Checksums for calculator data");

const changeSchema = z
  .object({
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+$/)
      .describe("Semantic version of this change"),
    updatedAt: z.string().datetime({ offset: true }),
    title: z.string().optional(),
    description: z.string().optional(),
  })
  .strict();

const changesSchema = z.array(changeSchema).describe("Change history of the calculator");

export const calculatorBaseSchema = z.object({
  id: z.string().uuid().describe("Unique identifier of a calculator in the format of UUID"),
  createdAt: z.string().datetime({ offset: true }).describe("Time of the creation of a calculator in the ISO 8601 format"),
  updatedAt: z.string().datetime({ offset: true }).describe("Time of the last update of a calculator in the ISO 8601 format").optional(),
  publishedAt: z.string().datetime({ offset: true }).describe("Time when a calculator should be published in the ISO 8601 format").optional(),
  title: z.string().describe("Title of a calculator").optional(),
  description: z.string().describe("Description of a calculator").optional(),
  methodology: z.string().describe("Methodology of a calculator").optional(),
  intro: z.string().describe("Intro text displayed before starting the calculator").optional(),
  tags: tagsSchema.describe("Tags of a calculator").optional(),
  images: imagesSchema.describe("Images associated with the calculator").optional(),
  version: versionSchema.optional(),
  checksums: checksumsSchema.optional(),
  changes: changesSchema.optional(),
});

const standaloneCalculatorSchema = calculatorBaseSchema
  .extend({
    key: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .describe("Human-friendly unique key of a standalone calculator in the hyphen-separated lowercased format"),
    version: versionSchema.optional(),
    shortTitle: z.string().max(25).describe("Short title of a calculator with a maximum of 25 characters"),
  })

  .strict();

const groupCalculatorSchema = calculatorBaseSchema
  .extend({
    calculatorGroup: calculatorGroup,
    variant: variantSchema,
    shortTitle: z.string().max(25).describe("Short title of a calculator with a maximum of 25 characters"),
  })
  .strict();

const electionCalculatorSchema = calculatorBaseSchema
  .extend({
    calculatorGroup: calculatorGroup,
    election: election,
    shortTitle: z.string().max(25).describe("Short title of a calculator with a maximum of 25 characters").optional(),
    variant: variantSchema.optional(),
    district: districtSchema.optional(),
    round: roundSchema.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!(data.variant || data.district || data.round)) {
      const message = "Election calculator must have at least a variant, district, or round";
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["variant"] });
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["district"] });
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ["round"] });
    }
  });

export const calculatorSchema = standaloneCalculatorSchema.or(groupCalculatorSchema).or(electionCalculatorSchema).describe("Calculator is a set of questions, candidates and their answers");

export type Calculator = z.infer<typeof calculatorSchema>;

export const calculatorVariantSchema = variantSchema;
export const calculatorDistrictSchema = districtSchema;
export const calculatorRoundSchema = roundSchema;
