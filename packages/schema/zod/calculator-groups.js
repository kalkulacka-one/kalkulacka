import { z } from "zod";
export const calculatorGroups = z.array(z.any()).describe("List of calculator groups");
