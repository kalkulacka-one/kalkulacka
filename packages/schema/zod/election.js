import { z } from "zod";
export const election = z
  .object({
    id: z.any(),
    key: z.any(),
    createdAt: z.any(),
    updatedAt: z.any().optional(),
    publishedAt: z.any().optional(),
    title: z.any(),
    shortTitle: z.any(),
    description: z.any().optional(),
    tags: z.any().optional(),
    calculatorGroup: z.any(),
    districts: z.array(z.any()).min(1).optional(),
    rounds: z.array(z.any()).min(1).optional(),
    votingHours: z.array(z.any()).min(1).describe("One or multiple voting hours for the election").optional(),
  })
  .describe("Election provides various details about an election such as districts and rounds");
