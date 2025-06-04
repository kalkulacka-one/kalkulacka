import { z } from "zod";
export const timePeriod = z
  .object({
    start: z
      .any()
      .superRefine((x, ctx) => {
        const schemas = [z.string().date(), z.string().datetime({ offset: true })];
        const errors = schemas.reduce((errors, schema) => ((result) => (result.error ? [...errors, result.error] : errors))(schema.safeParse(x)), []);
        if (schemas.length - errors.length !== 1) {
          ctx.addIssue({
            path: ctx.path,
            code: "invalid_union",
            unionErrors: errors,
            message: "Invalid input: Should pass single schema",
          });
        }
      })
      .describe("Start date (or time) of a voting period in the ISO 8601 format"),
    end: z
      .any()
      .superRefine((x, ctx) => {
        const schemas = [z.string().date(), z.string().datetime({ offset: true })];
        const errors = schemas.reduce((errors, schema) => ((result) => (result.error ? [...errors, result.error] : errors))(schema.safeParse(x)), []);
        if (schemas.length - errors.length !== 1) {
          ctx.addIssue({
            path: ctx.path,
            code: "invalid_union",
            unionErrors: errors,
            message: "Invalid input: Should pass single schema",
          });
        }
      })
      .describe("End date (or time) of a voting period in the ISO 8601 format"),
  })
  .describe("Time period from–to");
