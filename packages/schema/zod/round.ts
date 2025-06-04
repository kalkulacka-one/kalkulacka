import { z } from "zod";

export const round = z
  .object({ number: z.number().int().gte(0).describe("Round ordinal number from 0"), votingHours: z.array(z.any()).min(1).describe("One or multiple voting hours for the round").optional() })
  .describe("Round of an election");
export type Round = z.infer<typeof round>;
