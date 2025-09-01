import { z } from "zod";

import { calculatorBaseSchema, calculatorDistrictSchema, calculatorRoundSchema, calculatorVariantSchema } from "./calculator.schema";
import * as electionSchema from "./election.schema";
import { variantSchema } from "./variant.schema";

const calculatorGroupIdSchema = z.string().uuid().describe("Unique identifier of a calculator group in the format of UUID");
const calculatorGroupKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a standalone calculator group in the hyphen-separated lowercased format");

export const calculatorGroupSchemaReference = z.object({
  id: calculatorGroupIdSchema,
  key: calculatorGroupKeySchema,
});

export const calculatorGroupBaseSchema = z
  .object({
    id: calculatorGroupIdSchema,
    key: calculatorGroupKeySchema,
    createdAt: z.string().datetime({ offset: true }).describe("Time of the creation of a calculator group in the ISO 8601 format"),
    updatedAt: z.string().datetime({ offset: true }).describe("Time of the last update of a calculator group in the ISO 8601 format").optional(),
    publishedAt: z.string().datetime({ offset: true }).describe("Time when a calculator group should be published in the ISO 8601 format").optional(),
    title: z.string().describe("Title of a calculator group").optional(),
    shortTitle: z.string().max(25).describe("Short title of a calculator group with a maximum of 25 characters").optional(),
    description: z.string().describe("Description of a calculator group").optional(),
    election: z.lazy((): z.ZodType<electionSchema.ElectionReference> => electionSchema.electionSchemaReference).optional(),
    variants: z.array(variantSchema).min(1).describe("Ordered list of calculator variants").optional(),
  })
  .strict();

export const calculatorItemSchema = calculatorBaseSchema
  .pick({ id: true })
  .extend({
    variant: calculatorVariantSchema,
  })
  .strict();

export const standaloneCalculatorInGroupSchema = calculatorGroupBaseSchema
  .extend({
    shortTitle: z.string().max(25).describe("Short title of a calculator group with a maximum of 25 characters"),
    calculators: z.array(calculatorItemSchema).min(1).describe("Ordered list of calculators"),
    election: z.undefined(),
  })
  .strict();

export const electionCalculatorItemSchema = calculatorBaseSchema
  .pick({ id: true })
  .extend({
    variant: calculatorVariantSchema.optional(),
    district: calculatorDistrictSchema.optional(),
    round: calculatorRoundSchema.optional(),
  })
  .strict()
  .refine((data) => data.variant || data.district || data.round, {
    message: "Calculator must have at least a variant, district, or round.",
  });

export const electionCalculatorGroupSchema = calculatorGroupBaseSchema
  .extend({
    election: z.lazy((): z.ZodType<electionSchema.ElectionReference> => electionSchema.electionSchemaReference),
    calculators: z.array(electionCalculatorItemSchema).min(1).describe("Ordered list of calculators from an election"),
    shortTitle: z.undefined(),
  })
  .strict();

export const calculatorGroupSchema = z.union([standaloneCalculatorInGroupSchema, electionCalculatorGroupSchema]);

export type CalculatorGroup = z.infer<typeof calculatorGroupSchema>;
export type CalculatorGroupReference = z.infer<typeof calculatorGroupSchemaReference>;
