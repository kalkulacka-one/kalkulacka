import { z } from "zod";
export const calculatorGroup = z
  .object({
    id: z.any(),
    key: z.any(),
    election: z.any().optional(),
    variants: z.any().optional(),
    createdAt: z.any(),
    updatedAt: z.any().optional(),
    publishedAt: z.any().optional(),
    title: z.any().optional(),
    shortTitle: z.any().optional(),
    description: z.any().optional(),
  })
  .and(
    z.any().superRefine((x, ctx) => {
      const schemas = [
        z.object({ calculators: z.array(z.object({ id: z.any(), variant: z.any() })).min(1) }),
        z.object({
          calculators: z.array(z.object({ id: z.any(), variant: z.any().optional(), district: z.any().optional(), round: z.any().optional() }).and(z.union([z.any(), z.any(), z.any()]))).min(1),
        }),
      ];
      const errors = schemas.reduce((errors, schema) => ((result) => (result.error ? [...errors, result.error] : errors))(schema.safeParse(x)), []);
      if (schemas.length - errors.length !== 1) {
        ctx.addIssue({
          path: ctx.path,
          code: "invalid_union",
          unionErrors: errors,
          message: "Invalid input: Should pass single schema",
        });
      }
    }),
  )
  .describe("Group of two or more calculators");
