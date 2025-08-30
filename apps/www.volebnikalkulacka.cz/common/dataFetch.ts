import { calculatorSchema } from "../../../packages/schema/schemas/calculator.schema";
import { type CandidatesAnswers, candidatesAnswers } from "../../../packages/schema/schemas/candidates-answers.schema";
import { type Candidates, fullCandidatesGroupSchema } from "../../../packages/schema/schemas/candidates.schema";
import { type Organizations, organizationsSchema } from "../../../packages/schema/schemas/organizations.schema";
import { type Persons, personsSchema } from "../../../packages/schema/schemas/persons.schema";
import { type Questions, questionsSchema } from "../../../packages/schema/schemas/questions.schema";
import type { CalculatorData } from "../calculator/calculatorStore";

export type CalculatorFilesTypes = Persons | Questions | Organizations | Candidates | CandidatesAnswers;

export async function fetchAndParseFile(endpoint: string, fileName: string, schema: Zod.Schema) {
  try {
    const res = await fetch(`${endpoint}/${fileName}.json`);
    if (res.status === 404) {
      throw new Error(`Error: ${fileName}.json file missing`);
    }
    if (res.status === 500) {
      throw new Error("Error on the server");
    }
    if (!res.ok) {
      throw new Error("Other error");
    }
    const data = await res.json();
    const parsedData = schema.safeParse(data);
    if (parsedData.success) {
      // console.log(parsedData);
      console.log(`Successfully parsed ${fileName}`);
      return parsedData.data;
    }
    if (!parsedData.success) {
      // console.log(parsedData);
      console.error(`Validation failed for ${fileName}:`, parsedData.error);
      console.log(parsedData.error);
      throw Error("Error", parsedData.error);
    }
  } catch (error) {
    console.error(`Error fetching or parsing ${fileName}:`, error);
    console.error("Error", error);
    throw error;
  }
}

export async function loadCalculatorData(first: string, second?: string): Promise<CalculatorData> {
  const domain = "www.volebnikalkulacka.cz";
  const baseUrl = second === undefined ? `http://localhost:3000/${domain}/${first}/kalkulacka` : `http://localhost:3000/${domain}/${first}/${second}`;

  const calculatorDataMap = {
    questions: { fileName: "questions", schema: questionsSchema },
    persons: { fileName: "persons", schema: personsSchema },
    organizations: { fileName: "organizations", schema: organizationsSchema },
    candidates: { fileName: "candidates", schema: fullCandidatesGroupSchema },
    candidatesAnswers: { fileName: "candidates-answers", schema: candidatesAnswers },
  };

  try {
    const calculator = await fetchAndParseFile(baseUrl, "calculator", calculatorSchema);
    const promises = Object.values(calculatorDataMap).map((data) => {
      const schema = data.schema;
      const fileName = data.fileName;
      return fetchAndParseFile(baseUrl, fileName, schema);
    });

    const otherFiles = await Promise.all(promises);

    type CalculatorDataTypesMap = {
      [key: string]: CalculatorFilesTypes;
    };

    const otherFilesObjects: CalculatorDataTypesMap = Object.entries(calculatorDataMap).reduce((accumulator, [key, value], index) => {
      accumulator[key] = otherFiles[index];
      return accumulator;
    }, {} as CalculatorDataTypesMap);

    return { calculator, ...otherFilesObjects } as CalculatorData;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}
