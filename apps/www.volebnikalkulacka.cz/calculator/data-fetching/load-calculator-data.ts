import {
  type Calculator,
  type Candidates,
  type CandidatesAnswers,
  calculatorSchema,
  candidatesAnswers,
  candidatesSchema,
  type Organizations,
  organizationsSchema,
  type Persons,
  personsSchema,
  type Questions,
  questionsSchema,
} from "@kalkulacka-one/schema";

import type { z } from "zod";

import { parseWithSchema } from "@/calculator/utilities";

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

export async function loadCalculatorData({ key, group }: { key: string; group?: string }): Promise<CalculatorData> {
  const fileEntries = Object.entries(DATA_CONFIG).map(([entryKey, config]) => ({
    key: entryKey,
    url: buildDataUrl({ key, group, resourcePath: config.filename }),
    schema: config.schema,
    required: "required" in config && config.required,
  }));

  const fetchPromises = fileEntries.map(({ key, url, required }) =>
    fetchFile({ url }).catch((error) => {
      if (required) {
        throw new Error(`Failed to fetch ${key} data: ${error.message}`);
      }
      return undefined;
    }),
  );
  const results = await Promise.all(fetchPromises);

  const parsedData = fileEntries
    .map(({ key, schema }, index) => {
      const data = results[index];
      if (data === undefined) return undefined;

      try {
        return [key, parseWithSchema({ data, schema: schema as z.ZodSchema })];
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
