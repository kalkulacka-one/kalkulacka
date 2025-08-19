import { z } from "zod";

export const imageSchema = z
  .object({
    type: z.enum(["avatar", "logo", "portrait"]).describe("Type of the image"),
  })
  .describe("Specification of an image")
  .strict();

export const imagesSchema = z.array(imageSchema).min(1).describe("List of images");

export type Image = z.infer<typeof imageSchema>;
export type Images = z.infer<typeof imagesSchema>;
