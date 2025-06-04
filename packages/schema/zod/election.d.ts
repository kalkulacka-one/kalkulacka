import type { z } from "zod";
export declare const election: z.ZodObject<
  {
    id: z.ZodAny;
    key: z.ZodAny;
    createdAt: z.ZodAny;
    updatedAt: z.ZodOptional<z.ZodAny>;
    publishedAt: z.ZodOptional<z.ZodAny>;
    title: z.ZodAny;
    shortTitle: z.ZodAny;
    description: z.ZodOptional<z.ZodAny>;
    tags: z.ZodOptional<z.ZodAny>;
    calculatorGroup: z.ZodAny;
    districts: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    rounds: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    votingHours: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
  },
  "strip",
  z.ZodTypeAny,
  {
    title?: any;
    id?: any;
    key?: any;
    createdAt?: any;
    updatedAt?: any;
    publishedAt?: any;
    shortTitle?: any;
    description?: any;
    tags?: any;
    calculatorGroup?: any;
    districts?: any[] | undefined;
    rounds?: any[] | undefined;
    votingHours?: any[] | undefined;
  },
  {
    title?: any;
    id?: any;
    key?: any;
    createdAt?: any;
    updatedAt?: any;
    publishedAt?: any;
    shortTitle?: any;
    description?: any;
    tags?: any;
    calculatorGroup?: any;
    districts?: any[] | undefined;
    rounds?: any[] | undefined;
    votingHours?: any[] | undefined;
  }
>;
export type Election = z.infer<typeof election>;
//# sourceMappingURL=election.d.ts.map
