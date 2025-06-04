import type { z } from "zod";
export declare const calculatorGroup: z.ZodIntersection<
  z.ZodObject<
    {
      id: z.ZodAny;
      key: z.ZodAny;
      election: z.ZodOptional<z.ZodAny>;
      variants: z.ZodOptional<z.ZodAny>;
      createdAt: z.ZodAny;
      updatedAt: z.ZodOptional<z.ZodAny>;
      publishedAt: z.ZodOptional<z.ZodAny>;
      title: z.ZodOptional<z.ZodAny>;
      shortTitle: z.ZodOptional<z.ZodAny>;
      description: z.ZodOptional<z.ZodAny>;
    },
    "strip",
    z.ZodTypeAny,
    {
      title?: any;
      id?: any;
      key?: any;
      election?: any;
      variants?: any;
      createdAt?: any;
      updatedAt?: any;
      publishedAt?: any;
      shortTitle?: any;
      description?: any;
    },
    {
      title?: any;
      id?: any;
      key?: any;
      election?: any;
      variants?: any;
      createdAt?: any;
      updatedAt?: any;
      publishedAt?: any;
      shortTitle?: any;
      description?: any;
    }
  >,
  z.ZodEffects<z.ZodAny, any, any>
>;
export type CalculatorGroup = z.infer<typeof calculatorGroup>;
//# sourceMappingURL=calculator-group.d.ts.map
