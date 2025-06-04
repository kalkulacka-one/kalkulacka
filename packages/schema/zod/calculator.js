import { z } from "zod";
export const calculator = z
  .object({
    id: z.any(),
    createdAt: z.any(),
    updatedAt: z.any().optional(),
    publishedAt: z.any().optional(),
    title: z.any().optional(),
    shortTitle: z.any().optional(),
    description: z.any().optional(),
    intro: z.any().optional(),
    tags: z.any().optional(),
  })
  .and(
    z.any().superRefine((x, ctx) => {
      const schemas = [
        z.object({ key: z.any() }).describe("Standalone calculator is a calculator that is not part of a calculator group"),
        z.object({ calculatorGroup: z.any(), variant: z.any() }).describe("Calculator that is part of a calculator group"),
        z
          .object({ calculatorGroup: z.any(), election: z.any(), variant: z.any().optional(), district: z.any().optional(), round: z.any().optional() })
          .and(z.union([z.any(), z.any(), z.any()]))
          .describe("Calculator that is part of an election"),
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
  .describe("Calculator is a set of questions, candidates and their answers");
