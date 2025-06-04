import { z } from "zod";

export const candidatesAnswers = z
  .record(z.any())
  .superRefine((value, ctx) => {
    for (const key in value) {
      if (key.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        const result = z.any().safeParse(value[key]);
        if (!result.success) {
          ctx.addIssue({
            path: [...ctx.path, key],
            code: "custom",
            message: `Invalid input: Key matching regex /${key}/ must match schema`,
            params: {
              issues: result.error.issues,
            },
          });
        }
      }
    }
  })
  .describe("List of candidates' answers");
export type CandidatesAnswers = z.infer<typeof candidatesAnswers>;
