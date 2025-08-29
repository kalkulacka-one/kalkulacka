import { z } from "zod";
import { answerSchema } from "./answer.schema";

export const answersSchema = z.array(answerSchema).min(1).describe("List of one or more answers");

export type Answers = z.infer<typeof answersSchema>;
