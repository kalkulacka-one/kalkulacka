import { z } from "zod";
export const candidates = z.array(z.any()).min(1).describe("List of one or more candidates");
