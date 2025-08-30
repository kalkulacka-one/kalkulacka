import { z } from "zod";

import { candidateSchema } from "./candidate.schema.js";

export const candidatesSchema = z.array(candidateSchema).min(1).describe("List of one or more candidates");

export type Candidates = z.infer<typeof candidatesSchema>;
