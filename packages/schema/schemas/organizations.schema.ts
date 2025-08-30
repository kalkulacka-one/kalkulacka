import { z } from "zod";

import { organizationSchema } from "./organization.schema.js";

export const organizationsSchema = z.array(organizationSchema).describe("List of organizations");

export type Organizations = z.infer<typeof organizationsSchema>;
