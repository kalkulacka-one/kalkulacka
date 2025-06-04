import type { z } from "zod";
export declare const persons: z.ZodArray<z.ZodAny, "many">;
export type Persons = z.infer<typeof persons>;
//# sourceMappingURL=persons.d.ts.map
