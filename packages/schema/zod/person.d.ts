import type { z } from "zod";
export declare const person: z.ZodIntersection<
  z.ZodObject<
    {
      id: z.ZodString;
      name: z.ZodOptional<z.ZodString>;
      familyName: z.ZodOptional<z.ZodString>;
      givenName: z.ZodOptional<z.ZodString>;
      additionalName: z.ZodOptional<z.ZodString>;
      honorificPrefix: z.ZodOptional<z.ZodString>;
      honorificSuffix: z.ZodOptional<z.ZodString>;
      sortName: z.ZodOptional<z.ZodString>;
      alternateNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
      images: z.ZodOptional<z.ZodAny>;
      memberOf: z.ZodOptional<
        z.ZodArray<
          z.ZodObject<
            {
              id: z.ZodAny;
            },
            "strip",
            z.ZodTypeAny,
            {
              id?: any;
            },
            {
              id?: any;
            }
          >,
          "many"
        >
      >;
    },
    "strip",
    z.ZodTypeAny,
    {
      id: string;
      images?: any;
      name?: string | undefined;
      sortName?: string | undefined;
      alternateNames?: string[] | undefined;
      familyName?: string | undefined;
      givenName?: string | undefined;
      additionalName?: string | undefined;
      honorificPrefix?: string | undefined;
      honorificSuffix?: string | undefined;
      memberOf?:
        | {
            id?: any;
          }[]
        | undefined;
    },
    {
      id: string;
      images?: any;
      name?: string | undefined;
      sortName?: string | undefined;
      alternateNames?: string[] | undefined;
      familyName?: string | undefined;
      givenName?: string | undefined;
      additionalName?: string | undefined;
      honorificPrefix?: string | undefined;
      honorificSuffix?: string | undefined;
      memberOf?:
        | {
            id?: any;
          }[]
        | undefined;
    }
  >,
  z.ZodUnion<[z.ZodAny, z.ZodAny]>
>;
export type Person = z.infer<typeof person>;
//# sourceMappingURL=person.d.ts.map
