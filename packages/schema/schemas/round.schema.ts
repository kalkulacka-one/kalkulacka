import { z } from "zod";

import { timePeriodSchema } from "./time-period.schema";

const roundNumberSchema = z.number().int().min(0).describe("Round ordinal number from 0");

export const roundReferenceSchema = z.object({ number: roundNumberSchema }).strict().describe("Reference to a round of an election");

export const roundSchema = z
  .object({
    number: roundNumberSchema,
    votingHours: z.array(timePeriodSchema).min(1).describe("One or multiple voting hours for the round").optional(),
  })
  .strict()
  .describe("Round of an election");

export type Round = z.infer<typeof roundSchema>;
export type RoundReference = z.infer<typeof roundReferenceSchema>;
