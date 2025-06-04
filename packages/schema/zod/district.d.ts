import type { z } from "zod";
export declare const district: z.ZodObject<
  {
    key: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    key: string;
    code?: string | undefined;
  },
  {
    key: string;
    code?: string | undefined;
  }
>;
export type District = z.infer<typeof district>;
//# sourceMappingURL=district.d.ts.map
