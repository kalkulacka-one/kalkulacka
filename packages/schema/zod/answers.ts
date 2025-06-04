import { z } from "zod";

export const answers = z.array(z.any()).min(1).describe("List of one or more answers");
export type Answers = z.infer<typeof answers>;
