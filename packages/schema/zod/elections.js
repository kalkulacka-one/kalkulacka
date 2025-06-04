import { z } from "zod";
export const elections = z.array(z.any()).describe("List of elections");
