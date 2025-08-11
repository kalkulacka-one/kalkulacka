import { z } from "zod";

const sourceSchema = z
  .object({
    url: z.string().url().describe("URL of a source"),
    title: z.string().describe("Title of a source").optional(),
    description: z.string().describe("Description of a source").optional(),
  })
  .strict()
  .describe("Source of an answer");

export const answerSchema = z
  .object({
    questionId: z.string().uuid().describe("Unique identifier of an answered question in the format of UUID"),
    answer: z.union([z.boolean(), z.null()]).describe("Yes (`true`), no (`false`) or neutral (`null`) answer to a question").optional(),
    isImportant: z.boolean().describe("Whether a question was marked as important").optional(),
    respondent: z.enum(["user", "candidate", "expert"]).describe("Who answered a question").optional(),
    comment: z.string().describe("Respondent's comment to an answer").optional(),
    sources: z.array(sourceSchema).min(1).describe("Ordered list of sources for an answer").optional(),
  })
  .strict()
  .describe("Answer to a question of a calculator");

export type Answer = z.infer<typeof answerSchema>;
