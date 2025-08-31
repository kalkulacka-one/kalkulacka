import { z } from "zod";

import { personSchema } from "./person.schema";

export const personsSchema = z.array(personSchema).describe("List of persons");

export type Persons = z.infer<typeof personsSchema>;
