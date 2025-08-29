import { z } from "zod";
import { electionSchema } from "./election.schema";

export const electionsSchema = z.array(electionSchema).describe("List of elections");

export type Elections = z.infer<typeof electionsSchema>;
