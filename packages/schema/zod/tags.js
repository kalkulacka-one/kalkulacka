import { z } from "zod";
export const tags = z.array(z.string().min(1).max(25).describe("Tag with max. 25 characters")).min(1).describe("Ordered list of tags");
