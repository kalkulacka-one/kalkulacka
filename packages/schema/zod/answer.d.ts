import type { z } from "zod";
export declare const answer: z.ZodObject<
  {
    questionId: z.ZodString;
    answer: z.ZodOptional<z.ZodEffects<z.ZodAny, any, any>>;
    isImportant: z.ZodOptional<z.ZodBoolean>;
    respondent: z.ZodOptional<z.ZodEnum<["user", "candidate", "expert"]>>;
    comment: z.ZodOptional<z.ZodString>;
    sources: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            url: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
          },
          "strip",
          z.ZodTypeAny,
          {
            url: string;
            title?: string | undefined;
          },
          {
            url: string;
            title?: string | undefined;
          }
        >,
        "many"
      >
    >;
  },
  "strip",
  z.ZodTypeAny,
  {
    questionId: string;
    answer?: any;
    isImportant?: boolean | undefined;
    respondent?: "user" | "candidate" | "expert" | undefined;
    comment?: string | undefined;
    sources?:
      | {
          url: string;
          title?: string | undefined;
        }[]
      | undefined;
  },
  {
    questionId: string;
    answer?: any;
    isImportant?: boolean | undefined;
    respondent?: "user" | "candidate" | "expert" | undefined;
    comment?: string | undefined;
    sources?:
      | {
          url: string;
          title?: string | undefined;
        }[]
      | undefined;
  }
>;
export type Answer = z.infer<typeof answer>;
//# sourceMappingURL=answer.d.ts.map
