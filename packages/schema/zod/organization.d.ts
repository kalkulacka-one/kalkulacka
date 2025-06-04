import type { z } from "zod";
export declare const organization: z.ZodIntersection<
  z.ZodObject<
    {
      id: z.ZodString;
      name: z.ZodString;
      officialName: z.ZodOptional<z.ZodString>;
      shortName: z.ZodOptional<z.ZodString>;
      abbreviation: z.ZodOptional<z.ZodString>;
      sortName: z.ZodOptional<z.ZodString>;
      alternateNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      images: z.ZodOptional<z.ZodAny>;
      type: z.ZodOptional<z.ZodEnum<["party", "coalition", "candidate-list"]>>;
      members: z.ZodOptional<z.ZodArray<z.ZodEffects<z.ZodAny, any, any>, "many">>;
    },
    "strip",
    z.ZodTypeAny,
    {
      id: string;
      name: string;
      type?: "party" | "coalition" | "candidate-list" | undefined;
      images?: any;
      officialName?: string | undefined;
      shortName?: string | undefined;
      abbreviation?: string | undefined;
      sortName?: string | undefined;
      alternateNames?: string[] | undefined;
      members?: any[] | undefined;
    },
    {
      id: string;
      name: string;
      type?: "party" | "coalition" | "candidate-list" | undefined;
      images?: any;
      officialName?: string | undefined;
      shortName?: string | undefined;
      abbreviation?: string | undefined;
      sortName?: string | undefined;
      alternateNames?: string[] | undefined;
      members?: any[] | undefined;
    }
  >,
  z.ZodUnion<[z.ZodAny, z.ZodAny]>
>;
export type Organization = z.infer<typeof organization>;
//# sourceMappingURL=organization.d.ts.map
