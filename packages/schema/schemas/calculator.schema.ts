import { z } from "zod";
import { tagsSchema } from "./tags.schema.js";

export const calculatorIdSchema = z.string().uuid().describe("Unique identifier of a calculator in the format of UUID");
export const calculatorKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .describe("Human-friendly unique key of a standalone calculator in the hyphen-separated lowercased format");

export const calculatorCreatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the creation of a calculator in the ISO 8601 format");
export const calculatorUpdatedAtSchema = z.string().datetime({ offset: true }).describe("Time of the last update of a calculator in the ISO 8601 format");
export const calculatorPublishedAtSchema = z.string().datetime({ offset: true }).describe("Time when a calculator should be published in the ISO 8601 format");
export const calculatorTitleSchema = z.string().describe("Title of a calculator");
export const calculatorShortTitleSchema = z.string().max(25).describe("Short title of a calculator with a maximum of 25 characters");
export const calculatorDescriptionSchema = z.string().describe("Description of a calculator");
export const calculatorMethodologySchema = z.string().describe("Methodology of a calculator");
export const calculatorIntroSchema = z.string().describe("Intro text displayed before starting the calculator");

export const calculatorSchema = z
  .object({
    id: calculatorIdSchema,
    key: calculatorKeySchema,
    createdAt: calculatorCreatedAtSchema,
    updatedAt: calculatorUpdatedAtSchema,
    publishedAt: calculatorPublishedAtSchema,
    shortTitle: calculatorShortTitleSchema,
    description: calculatorDescriptionSchema,
    methodology: calculatorMethodologySchema,
    intro: calculatorIntroSchema,
    tags: tagsSchema,
    // continue when other dep schemas are ready
  })
  .describe("Calculator is a set of questions, candidates and their answers");
