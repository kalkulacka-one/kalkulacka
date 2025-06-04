import { z } from "zod";

export const persons = z.array(z.any()).describe("List of persons");
export type Persons = z.infer<typeof persons>;
