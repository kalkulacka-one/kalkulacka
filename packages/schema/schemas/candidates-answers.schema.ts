import { z } from "zod";

import { answerSchema } from "./answer.schema";

export const candidateAnswerSchema = answerSchema.extend({
  respondent: z.enum(["candidate", "expert"]).describe("The respondent must be a candidate or expert.").optional(),
});

export const candidatesAnswers = z.record(z.string().uuid(), z.array(candidateAnswerSchema)).describe("List of candidates' answers");

export type CandidatesAnswers = z.infer<typeof candidatesAnswers>;
