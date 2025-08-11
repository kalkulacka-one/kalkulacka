import { z } from "zod";
import { type CalculatorGroupReference, calculatorGroupSchemaReference } from "./calculator-group.schema.js";
import { districtSchema } from "./district.schema.js";
import { roundSchema } from "./round.schema.js";
import { tagsSchema } from "./tags.schema.js";
import { timePeriodSchema } from "./time-period.schema.js";

const electionIdSchema = z.string().uuid().describe("Unique identifier of a calculator group in the format of UUID");
const electionKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a standalone calculator group in the hyphen-separated lowercased format");

export const electionSchemaReference = z.object({
  id: electionIdSchema,
  key: electionKeySchema,
});

export const electionBaseSchema = z
  .object({
    id: electionIdSchema,
    key: electionKeySchema,
    createdAt: z.string().datetime({ offset: true }).describe("Time of the creation of a calculator group in the ISO 8601 format"),
    updatedAt: z.string().datetime({ offset: true }).describe("Time of the last update of a calculator group in the ISO 8601 format").optional(),
    publishedAt: z.string().datetime({ offset: true }).describe("Time when a calculator group should be published in the ISO 8601 format").optional(),
    title: z.string().describe("Title of a calculator group"),
    shortTitle: z.string().max(25).describe("Short title of a calculator group with a maximum of 25 characters"),
    description: z.string().describe("Description of a calculator group").optional(),
    tags: tagsSchema,
    calculatorGroup: z.lazy((): z.ZodType<CalculatorGroupReference> => calculatorGroupSchemaReference),
    districts: z.array(districtSchema).min(1).describe("Ordered list of election districts").optional(),
    rounds: z.array(roundSchema).min(1).describe("Ordered list of election rounds").optional(),
    votingHours: z.array(timePeriodSchema).min(1).describe("One or multiple voting hours for the election").optional(),
  })
  .strict();

export const electionSchema = electionBaseSchema.refine((val) => !(val.rounds && val.votingHours), { message: "Cannot have both rounds and votingHours" });

export type Election = z.infer<typeof electionSchema>;
export type ElectionReference = z.infer<typeof electionSchemaReference>;
