import type { z } from "zod";
export declare const images: z.ZodArray<
  z.ZodObject<
    {
      type: z.ZodEnum<["avatar", "logo", "portrait"]>;
    },
    "strip",
    z.ZodTypeAny,
    {
      type: "avatar" | "logo" | "portrait";
    },
    {
      type: "avatar" | "logo" | "portrait";
    }
  >,
  "many"
>;
export type Images = z.infer<typeof images>;
//# sourceMappingURL=images.d.ts.map
