import { type Calculator, calculatorSchema } from "../../../../../packages/schema/schemas/calculator.schema";
import { type Questions, questionsSchema } from "../../../../../packages/schema/schemas/questions.schema";
import { fetchFile, parseWithSchema } from ".";

const DATA_CONFIG = {
  calculator: {
    filename: "calculator.json",
    schema: calculatorSchema,
  },
  questions: {
    filename: "questions.json",
    schema: questionsSchema,
  },
} as const;

export type CalculatorData = {
  calculator: Calculator;
  questions: Questions;
};

export async function loadCalculatorData({ key, group }: { key: string; group?: string }): Promise<CalculatorData> {
  const endpoint = process.env.DATA_ENDPOINT;
  if (!endpoint) throw new Error("Missing `DATA_ENDPOINT` environment variable");

  let baseUrl: URL;
  try {
    baseUrl = new URL(endpoint.replace(/\/$/, ""));
  } catch {
    throw new Error("Invalid `DATA_ENDPOINT` environment variable");
  }

  const dataPath = group ? `${key}/${group}` : key;
  const basePath = baseUrl.pathname === "/" ? "" : baseUrl.pathname.slice(1);
  const fullPath = basePath ? `${basePath}/${dataPath}` : dataPath;
  const dataUrl = new URL(fullPath, baseUrl.origin);

  const fileEntries = Object.entries(DATA_CONFIG).map(([key, config]) => ({
    key: key as keyof CalculatorData,
    url: new URL(config.filename, `${dataUrl}/`).toString(),
    schema: config.schema,
  }));

  const fetchPromises = fileEntries.map(({ key, url }) =>
    fetchFile({ url }).catch((error) => {
      throw new Error(`Failed to fetch ${key} data: ${error.message}`);
    }),
  );
  const results = await Promise.all(fetchPromises);

  const parsedData: Partial<CalculatorData> = {};

  fileEntries.forEach(({ key }, index) => {
    try {
      if (key === "calculator") {
        parsedData.calculator = parseWithSchema({ data: results[index], schema: calculatorSchema });
      } else if (key === "questions") {
        parsedData.questions = parseWithSchema({ data: results[index], schema: questionsSchema });
      }
    } catch (error) {
      throw new Error(`Failed to parse ${key} data: ${(error as Error).message}`);
    }
  });

  if (!parsedData.calculator || !parsedData.questions) {
    throw new Error("Failed to load all required data");
  }

  return parsedData as CalculatorData;
}
