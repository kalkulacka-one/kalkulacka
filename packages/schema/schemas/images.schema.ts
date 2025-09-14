import { z } from "zod";

export const imageUrlsSchema = z
  .object({
    original: z.string().describe("Relative path to original source image"),
    xs: z
      .string()
      .regex(/\.webp$/)
      .describe("Relative path to optimized 100 × 100 px WebP image")
      .optional(),
    sm: z
      .string()
      .regex(/\.webp$/)
      .describe("Relative path to optimized 200 × 200 px WebP image")
      .optional(),
    md: z
      .string()
      .regex(/\.webp$/)
      .describe("Relative path to optimized 400 × 400 px WebP image")
      .optional(),
    lg: z
      .string()
      .regex(/\.webp$/)
      .describe("Relative path to optimized 800 × 800 px WebP image")
      .optional(),
    xl: z
      .string()
      .regex(/\.webp$/)
      .describe("Relative path to optimized 1200 × 1200 px WebP image")
      .optional(),
    "2xl": z
      .string()
      .regex(/\.webp$/)
      .describe("Relative path to optimized 1600 × 1600 px WebP image")
      .optional(),
    "3xl": z
      .string()
      .regex(/\.webp$/)
      .describe("Relative path to optimized 2400 × 2400 px WebP image")
      .optional(),
  })
  .describe("Relative paths to image files for different sizes")
  .strict();

export const imageSchema = z
  .object({
    type: z.enum(["avatar", "logo", "portrait", "opengraph", "twitter"]).describe("Type of the image"),
    urls: imageUrlsSchema,
    width: z.number().int().min(1).describe("Width of the original image in pixels").optional(),
    height: z.number().int().min(1).describe("Height of the original image in pixels").optional(),
    alt: z.string().describe("Alternative text for the image, used for accessibility").optional(),
  })
  .describe("Specification of an image")
  .strict();

export const imagesSchema = z.array(imageSchema).min(1).describe("List of images");

export type ImageUrls = z.infer<typeof imageUrlsSchema>;
export type Image = z.infer<typeof imageSchema>;
export type Images = z.infer<typeof imagesSchema>;
