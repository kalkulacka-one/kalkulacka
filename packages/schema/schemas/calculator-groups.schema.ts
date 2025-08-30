import { z } from "zod";

import { calculatorGroupSchema } from "./calculator-group.schema.js";

export const calculatorGroupsSchema = z.array(calculatorGroupSchema).describe("List of calculator groups");

export type CalculatorGroups = z.infer<typeof calculatorGroupsSchema>;
