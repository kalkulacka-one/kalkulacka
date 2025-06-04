import { z } from "zod";

export const answer = z
  .object({
    questionId: z.string().uuid().describe("Unique identifier of an answered question in the format of UUID"),
    answer: z
      .any()
      .superRefine((x, ctx) => {
        const schemas = [z.boolean(), z.null()];
        const errors = schemas.reduce<z.ZodError[]>((errors, schema) => ((result) => (result.error ? [...errors, result.error] : errors))(schema.safeParse(x)), []);
        if (schemas.length - errors.length !== 1) {
          ctx.addIssue({
            path: ctx.path,
            code: "invalid_union",
            unionErrors: errors,
            message: "Invalid input: Should pass single schema",
          });
        }
      })
      .describe("Yes (`true`), no (`false`) or neutral (`null`) answer to a question")
      .optional(),
    isImportant: z.boolean().describe("Whether a question was marked as important").optional(),
    respondent: z.enum(["user", "candidate", "expert"]).describe("Who answered a question").optional(),
    comment: z.string().describe("Respondent's comment to an answer").optional(),
    sources: z
      .array(z.object({ url: z.string().url().describe("URL of a source"), title: z.string().describe("Title of a source").optional() }).describe("Source of an answer"))
      .min(1)
      .describe("Ordered list of sources for an answer")
      .optional(),
  })
  .describe("Answer to a question of a calculator");
export type Answer = z.infer<typeof answer>;
