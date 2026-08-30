import { z } from "zod";

import { calculatorBaseSchema, calculatorDistrictSchema, calculatorRoundSchema, calculatorVariantSchema } from "./calculator.schema";
import * as electionSchema from "./election.schema";
import { variantSchema } from "./variant.schema";

const calculatorGroupIdSchema = z.string().uuid().describe("Unique identifier of a calculator group in the format of UUID");
const calculatorKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Key of the calculator; the last URL segment");

const selectionSchema = z
  .object({
    title: z.string().describe("Heading of the calculator picker; overrides the app default for the district kind").optional(),
    description: z.string().describe("Description shown in the calculator picker").optional(),
    searchPlaceholder: z.string().describe("Placeholder of the search field in the calculator picker").optional(),
    showCode: z.boolean().describe("Whether to display district codes next to district names; overrides the app default for the district kind").optional(),
  })
  .strict()
  .describe("Optional copy and display overrides for the calculator picker");

const calculatorGroupKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a standalone calculator group in the hyphen-separated lowercased format");

export const calculatorGroupSchemaReference = z
  .object({
    id: calculatorGroupIdSchema,
    key: calculatorGroupKeySchema,
  })
  .strict();

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
    selection: selectionSchema.optional(),
  })
  .strict();

export const calculatorItemSchema = z.lazy(() =>
  calculatorBaseSchema
    .pick({ id: true })
    .extend({
      key: calculatorKeySchema,
      variant: calculatorVariantSchema,
    })
    .strict(),
);

export const standaloneCalculatorInGroupSchema = calculatorGroupBaseSchema
  .extend({
    shortTitle: z.string().max(25).describe("Short title of a calculator group with a maximum of 25 characters"),
    calculators: z.array(calculatorItemSchema).min(1).describe("Ordered list of calculators"),
    election: z.undefined().optional(),
  })
  .strict();

export const electionCalculatorItemSchema = z.lazy(() =>
  calculatorBaseSchema
    .pick({ id: true })
    .extend({
      key: calculatorKeySchema,
      variant: calculatorVariantSchema.optional(),
      district: calculatorDistrictSchema.optional(),
      round: calculatorRoundSchema.optional(),
    })
    .strict()
    .refine((data) => data.variant || data.district || data.round, {
      message: "Calculator must have at least a variant, district, or round.",
    }),
);

export const electionCalculatorGroupSchema = calculatorGroupBaseSchema
  .extend({
    election: z.lazy((): z.ZodType<electionSchema.ElectionReference> => electionSchema.electionSchemaReference),
    calculators: z.array(electionCalculatorItemSchema).min(1).describe("Ordered list of calculators from an election"),
    shortTitle: z.undefined().optional(),
  })
  .strict();

export const calculatorGroupSchema = z.union([standaloneCalculatorInGroupSchema, electionCalculatorGroupSchema]);

export type CalculatorGroup = z.infer<typeof calculatorGroupSchema>;
export type CalculatorGroupReference = z.infer<typeof calculatorGroupSchemaReference>;
