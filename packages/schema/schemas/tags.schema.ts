import { z } from "zod";

export const tagSchema = z.string().min(1).max(25).describe("Tag with max. 25 characters");

export const tagsSchema = z.array(tagSchema).min(1).describe("Ordered list of tags");

export type Tag = z.infer<typeof tagSchema>;
export type Tags = z.infer<typeof tagsSchema>;
