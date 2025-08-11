import { z } from "zod";
import { calculatorGroupSchemaReference } from "./calculator-group.schema.js";
import { districtSchema } from "./district.schema.js";
import { electionSchemaReference } from "./election.schema.js";
import { roundSchema } from "./round.schema.js";
import { tagsSchema } from "./tags.schema.js";
import { variantSchema } from "./variant.schema.js";

const calculatorGroup = calculatorGroupSchemaReference.describe("Reference to a calculator group the calculator belongs to");
const election = electionSchemaReference.describe("Reference to an election the calculator belongs to");

export const calculatorBaseSchema = z.object({
  id: z.string().uuid().describe("Unique identifier of a calculator in the format of UUID"),
  createdAt: z.string().datetime({ offset: true }).describe("Time of the creation of a calculator in the ISO 8601 format"),
  updatedAt: z.string().datetime({ offset: true }).describe("Time of the last update of a calculator in the ISO 8601 format").optional(),
  publishedAt: z.string().datetime({ offset: true }).describe("Time when a calculator should be published in the ISO 8601 format").optional(),
  title: z.string().describe("Title of a calculator").optional(),
  description: z.string().describe("Description of a calculator").optional(),
  // methodology defined in $defs, but not listed in within any variant
  // methodology: z.string().describe("Methodology of a calculator").optional(),
  intro: z.string().describe("Intro text displayed before starting the calculator").optional(),
  tags: tagsSchema.describe("Tags of a calculator").optional(),
});

const standaloneCalculatorSchema = calculatorBaseSchema
  .extend({
    key: z
      .string()
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .describe("Human-friendly unique key of a standalone calculator in the hyphen-separated lowercased format"),
    shortTitle: z.string().max(25).describe("Short title of a calculator with a maximum of 25 characters"),
  })

  .strict();

const groupCalculatorSchema = calculatorBaseSchema
  .extend({
    calculatorGroup: calculatorGroup,
    variant: variantSchema,
  })
  .strict();

const electionCalculatorSchema = calculatorBaseSchema
  .extend({
    calculatorGroup: calculatorGroup,
    election: election,
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

export const calculatorSchema = z.union([standaloneCalculatorSchema, groupCalculatorSchema, electionCalculatorSchema]).describe("Calculator is a set of questions, candidates and their answers");

export type Calculator = z.infer<typeof calculatorSchema>;

export const calculatorVariantSchema = variantSchema;
export const calculatorDistrictSchema = districtSchema;
export const calculatorRoundSchema = roundSchema;
