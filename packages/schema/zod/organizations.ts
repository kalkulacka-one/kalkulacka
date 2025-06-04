import { z } from "zod";

export const organizations = z.array(z.any()).describe("List of organizations");
export type Organizations = z.infer<typeof organizations>;
