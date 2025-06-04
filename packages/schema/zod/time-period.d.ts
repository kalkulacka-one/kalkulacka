import type { z } from "zod";
export declare const timePeriod: z.ZodObject<
  {
    start: z.ZodEffects<z.ZodAny, any, any>;
    end: z.ZodEffects<z.ZodAny, any, any>;
  },
  "strip",
  z.ZodTypeAny,
  {
    start?: any;
    end?: any;
  },
  {
    start?: any;
    end?: any;
  }
>;
export type TimePeriod = z.infer<typeof timePeriod>;
//# sourceMappingURL=time-period.d.ts.map
