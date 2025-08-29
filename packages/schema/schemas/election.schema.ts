import { z } from "zod";
import { type CalculatorGroupReference, calculatorGroupSchemaReference } from "./calculator-group.schema";
import { districtSchema } from "./district.schema";
import { roundSchema } from "./round.schema";
import { tagsSchema } from "./tags.schema";
import { timePeriodSchema } from "./time-period.schema";

const electionIdSchema = z.string().uuid().describe("Unique identifier of an election in the format of UUID");
const electionKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of an election in the hyphen-separated lowercased format");

export const electionSchemaReference = z.object({
  id: electionIdSchema,
  key: electionKeySchema,
});

export const electionBaseSchema = z
  .object({
    id: electionIdSchema,
    key: electionKeySchema,
    createdAt: z.string().datetime({ offset: true }).describe("Time of the creation of an election in the ISO 8601 format"),
    updatedAt: z.string().datetime({ offset: true }).describe("Time of the last update of an election group in the ISO 8601 format").optional(),
    publishedAt: z.string().datetime({ offset: true }).describe("Time when an election group should be published in the ISO 8601 format").optional(),
    title: z.string().describe("Title of an election"),
    shortTitle: z.string().max(25).describe("Short title of an election with a maximum of 25 characters"),
    description: z.string().describe("Description of an election").optional(),
    tags: tagsSchema,
    calculatorGroup: z.lazy((): z.ZodType<CalculatorGroupReference> => calculatorGroupSchemaReference),
    districts: z.array(districtSchema).min(1).describe("Ordered list of election districts").optional(),
    rounds: z.array(roundSchema).min(1).describe("Ordered list of election rounds").optional(),
    votingHours: z.array(timePeriodSchema).min(1).describe("One or multiple voting hours for the election").optional(),
  })
  .strict();

export const electionSchema = electionBaseSchema.refine((data) => !(data.rounds && data.votingHours), { message: "Cannot have both rounds and votingHours" });

export type Election = z.infer<typeof electionSchema>;
export type ElectionReference = z.infer<typeof electionSchemaReference>;
