import { z } from "zod";

import { timePeriodSchema } from "./time-period.schema";

export const roundSchema = z
  .object({
    number: z.number().int().min(0).describe("Round ordinal number from 0"),
    votingHours: z.array(timePeriodSchema).min(1).describe("One or multiple voting hours for the round").optional(),
  })
  .strict()
  .describe("Round of an election");

export type Round = z.infer<typeof roundSchema>;
