import type { z } from "zod";
export declare const candidate: z.ZodObject<
  {
    id: z.ZodString;
    reference: z.ZodObject<
      {
        id: z.ZodString;
        type: z.ZodEnum<["person", "organization"]>;
      },
      "strip",
      z.ZodTypeAny,
      {
        type: "person" | "organization";
        id: string;
      },
      {
        type: "person" | "organization";
        id: string;
      }
    >;
    displayName: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodAny>;
    motto: z.ZodOptional<z.ZodString>;
    number: z.ZodOptional<z.ZodNumber>;
  },
  "strip",
  z.ZodTypeAny,
  {
    id: string;
    reference: {
      type: "person" | "organization";
      id: string;
    };
    number?: number | undefined;
    displayName?: string | undefined;
    images?: any;
    motto?: string | undefined;
  },
  {
    id: string;
    reference: {
      type: "person" | "organization";
      id: string;
    };
    number?: number | undefined;
    displayName?: string | undefined;
    images?: any;
    motto?: string | undefined;
  }
>;
export type Candidate = z.infer<typeof candidate>;
//# sourceMappingURL=candidate.d.ts.map
