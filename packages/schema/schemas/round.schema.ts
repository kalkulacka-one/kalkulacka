import { z } from "zod";

import { timePeriodSchema } from "./time-period.schema";

const roundNumberSchema = z.number().int().min(1).describe("Round ordinal number from 1");

// A round is a coordinate of a calculator within its group, so it carries a key like a district or a variant does. The key is a
// slug in the language of the data it belongs to (`2-kolo`, `2nd-round`); the ordinal number stays machine-readable.
const roundKeySchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a round in the hyphen-separated lowercased format");

export const roundReferenceSchema = z.object({ key: roundKeySchema }).strict().describe("Reference to a round of an election");

export const roundSchema = z
  .object({
    key: roundKeySchema,
    number: roundNumberSchema,
    votingHours: z.array(timePeriodSchema).min(1).describe("One or multiple voting hours for the round").optional(),
  })
  .strict()
  .describe("Round of an election");

export type Round = z.infer<typeof roundSchema>;
export type RoundReference = z.infer<typeof roundReferenceSchema>;
