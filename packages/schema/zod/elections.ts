import { z } from "zod";

export const elections = z.array(z.any()).describe("List of elections");
export type Elections = z.infer<typeof elections>;
