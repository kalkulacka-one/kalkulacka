import { z } from "zod";

// TODO: refine date schema check or zod update (the latest miniflare stil lists zod@3.22 as its dep)
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const dateTimeSchema = z.string().datetime();

export const timePeriodSchema = z
  .object({
    start: z.union([dateSchema, dateTimeSchema]).describe("Start date (or time) of a voting period in the ISO 8601 format"),
    end: z.union([dateSchema, dateTimeSchema]).describe("End date (or time) of a voting period in the ISO 8601 format"),
  })
  .strict()
  .describe("Time period from-to");

export type TimePeriod = z.infer<typeof timePeriodSchema>;
