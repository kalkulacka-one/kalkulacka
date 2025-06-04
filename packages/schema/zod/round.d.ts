import type { z } from "zod";
export declare const round: z.ZodObject<
  {
    number: z.ZodNumber;
    votingHours: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
  },
  "strip",
  z.ZodTypeAny,
  {
    number: number;
    votingHours?: any[] | undefined;
  },
  {
    number: number;
    votingHours?: any[] | undefined;
  }
>;
export type Round = z.infer<typeof round>;
//# sourceMappingURL=round.d.ts.map
