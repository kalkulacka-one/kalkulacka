import type { z } from "zod";
export declare const question: z.ZodObject<
  {
    id: z.ZodString;
    title: z.ZodString;
    statement: z.ZodString;
    detail: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodAny>;
  },
  "strip",
  z.ZodTypeAny,
  {
    title: string;
    id: string;
    statement: string;
    tags?: any;
    detail?: string | undefined;
  },
  {
    title: string;
    id: string;
    statement: string;
    tags?: any;
    detail?: string | undefined;
  }
>;
export type Question = z.infer<typeof question>;
//# sourceMappingURL=question.d.ts.map
