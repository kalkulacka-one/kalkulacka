import { z } from "zod";
export const questions = z.array(z.any()).min(1).describe("List of one or more questions");
