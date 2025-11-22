import type { z } from "zod";

import { type Calculator, calculatorSchema } from "../../../../packages/schema/schemas/calculator.schema";
import { type Candidates, candidatesSchema } from "../../../../packages/schema/schemas/candidates.schema";
import { type CandidatesAnswers, candidatesAnswers } from "../../../../packages/schema/schemas/candidates-answers.schema";
import { type Organizations, organizationsSchema } from "../../../../packages/schema/schemas/organizations.schema";
import { type Persons, personsSchema } from "../../../../packages/schema/schemas/persons.schema";
import { type Questions, questionsSchema } from "../../../../packages/schema/schemas/questions.schema";
import { parseWithSchema } from "../utilities";
import { fetchFile } from "./fetch-file";
import { buildDataUrl } from "./url-builders";

const DATA_CONFIG = {
  calculator: {
    filename: "calculator.json",
    schema: calculatorSchema,
    required: true,
  },
  questions: {
    filename: "questions.json",
    schema: questionsSchema,
    required: true,
  },
  candidates: {
    filename: "candidates.json",
    schema: candidatesSchema,
    required: true,
  },
  candidatesAnswers: {
    filename: "candidates-answers.json",
    schema: candidatesAnswers,
    required: true,
  },
  persons: {
    filename: "persons.json",
    schema: personsSchema,
  },
  organizations: {
    filename: "organizations.json",
    schema: organizationsSchema,
  },
} as const;

export type CalculatorData = {
  data: {
    calculator: Calculator;
    questions: Questions;
    candidates: Candidates;
    candidatesAnswers: CandidatesAnswers;
    persons?: Persons;
    organizations?: Organizations;
  };
  baseUrl: string;
};

export async function loadCalculatorData({ key, group }: { key: string; group?: string }): Promise<CalculatorData | null> {
  const fileEntries = Object.entries(DATA_CONFIG).map(([entryKey, config]) => ({
    key: entryKey,
    url: buildDataUrl({ key, group, resourcePath: config.filename }),
    schema: config.schema,
    required: "required" in config && config.required,
  }));

  const fetchPromises = fileEntries.map(({ url, required }) =>
    fetchFile({ url }).catch(() => {
      if (required) {
        return null;
      }
      return undefined;
    }),
  );

  const results = await Promise.all(fetchPromises);

  if (results.includes(null)) {
    return null;
  }

  const parsedData = fileEntries
    .map(({ key, schema }, index) => {
      const data = results[index];
      if (data === undefined) return undefined;

      try {
        return [key, parseWithSchema({ data, schema: schema as unknown as z.ZodType<unknown> })];
      } catch (error) {
        throw new Error(`Failed to parse ${key} data: ${(error as Error).message}`);
      }
    })
    .filter((entry): entry is [string, unknown] => entry !== undefined);

  return {
    data: Object.fromEntries(parsedData) as CalculatorData["data"],
    baseUrl: buildDataUrl({ key, group }),
  };
}
