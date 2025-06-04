import type { z } from "zod";
export declare const calculator: z.ZodIntersection<
  z.ZodObject<
    {
      id: z.ZodAny;
      createdAt: z.ZodAny;
      updatedAt: z.ZodOptional<z.ZodAny>;
      publishedAt: z.ZodOptional<z.ZodAny>;
      title: z.ZodOptional<z.ZodAny>;
      shortTitle: z.ZodOptional<z.ZodAny>;
      description: z.ZodOptional<z.ZodAny>;
      intro: z.ZodOptional<z.ZodAny>;
      tags: z.ZodOptional<z.ZodAny>;
    },
    "strip",
    z.ZodTypeAny,
    {
      title?: any;
      id?: any;
      createdAt?: any;
      updatedAt?: any;
      publishedAt?: any;
      shortTitle?: any;
      description?: any;
      intro?: any;
      tags?: any;
    },
    {
      title?: any;
      id?: any;
      createdAt?: any;
      updatedAt?: any;
      publishedAt?: any;
      shortTitle?: any;
      description?: any;
      intro?: any;
      tags?: any;
    }
  >,
  z.ZodEffects<z.ZodAny, any, any>
>;
export type Calculator = z.infer<typeof calculator>;
//# sourceMappingURL=calculator.d.ts.map
