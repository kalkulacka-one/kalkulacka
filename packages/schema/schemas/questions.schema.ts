import { z } from "zod";

import { questionSchema } from "./question.schema.js";

export const questionsSchema = z.array(questionSchema).min(1).describe("List of one or more questions");

export type Questions = z.infer<typeof questionsSchema>;
