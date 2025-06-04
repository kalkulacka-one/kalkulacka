import { z } from "zod";

export const question = z
  .object({
    id: z.string().uuid().describe("Unique identifier of a question in the format of UUID"),
    title: z.string().describe("Title of a question"),
    statement: z.string().describe("A statment to agree or disagree with, should not be phrased as a question with question mark"),
    detail: z.string().describe("A detailed description or an explanation of a question").optional(),
    tags: z.any().optional(),
  })
  .describe("Question for a calculator");
export type Question = z.infer<typeof question>;
