import { z } from "zod";

import { candidateSchema } from "./candidate.schema";

export const candidatesSchema = z.array(candidateSchema).min(1).describe("List of one or more candidates");

export type Candidates = z.infer<typeof candidatesSchema>;

export const candidatesGroupSchema = z
  .object({
    id: z.string().uuid().describe("Unique identifier of a group/party"),
    name: z.string().describe("The full name of the group/party"),
    shortName: z.string().describe("The short name of the group/party"),
    nestedCandidates: z.array(candidateSchema).describe("The list of candidates within this group"),
  })
  .strict()
  .describe("A group (e.g., political party) that contains a list of candidates");

export type Group = z.infer<typeof candidatesGroupSchema>;

export const fullCandidatesGroupSchema = z.array(candidatesGroupSchema);
