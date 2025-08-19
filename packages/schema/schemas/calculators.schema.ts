import { z } from "zod";
import { calculatorSchema } from "./calculator.schema.js";

export const calculatorsSchema = z.array(calculatorSchema).describe("List of calculators");

export type Calculators = z.infer<typeof calculatorsSchema>;
