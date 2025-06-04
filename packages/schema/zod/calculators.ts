import { z } from "zod";

export const calculators = z.array(z.any()).describe("List of calculators");
export type Calculators = z.infer<typeof calculators>;
