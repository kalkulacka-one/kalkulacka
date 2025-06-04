import { z } from "zod";
export const images = z
  .array(z.object({ type: z.enum(["avatar", "logo", "portrait"]).describe("Type of the image, for avatar should be square") }).describe("Specification of an image"))
  .min(1)
  .describe("List of images");
