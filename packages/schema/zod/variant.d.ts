import type { z } from "zod";
export declare const variant: z.ZodObject<
  {
    key: z.ZodString;
  },
  "strip",
  z.ZodTypeAny,
  {
    key: string;
  },
  {
    key: string;
  }
>;
export type Variant = z.infer<typeof variant>;
//# sourceMappingURL=variant.d.ts.map
