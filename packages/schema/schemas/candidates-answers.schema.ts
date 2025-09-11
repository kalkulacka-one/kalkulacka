import { z } from "zod";

import { answerSchema } from "./answer.schema";

export const candidateAnswerSchema = answerSchema.extend({
  respondent: z.enum(["user", "candidate", "expert"]).describe("Who answered a question").optional(),
});

export const candidatesAnswers = z.record(z.string().uuid(), z.array(candidateAnswerSchema)).describe("List of candidates' answers");

export type CandidatesAnswers = z.infer<typeof candidatesAnswers>;
