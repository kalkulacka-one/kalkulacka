import { type Calculator, calculatorSchema } from "../../../../packages/schema/schemas/calculator.schema";
import { type Candidates, fullCandidatesGroupSchema } from "../../../../packages/schema/schemas/candidates.schema";
import { type CandidatesAnswers, candidatesAnswers } from "../../../../packages/schema/schemas/candidates-answers.schema";
import { type Organizations, organizationsSchema } from "../../../../packages/schema/schemas/organizations.schema";
import { type Persons, personsSchema } from "../../../../packages/schema/schemas/persons.schema";
import { type Questions, questionsSchema } from "../../../../packages/schema/schemas/questions.schema";
import { fetchAndParseFile } from "./fetchAndParseFile";

export type CalculatorFilesTypes = Persons | Questions | Organizations | Candidates | CandidatesAnswers;

export type CalculatorData = {
  calculator: Calculator;
  questions: Questions;
  persons: Persons;
  organizations: Organizations;
  candidates: Candidates;
  candidatesAnswers: CandidatesAnswers;
};

export async function loadCalculatorData(key: string, group?: string): Promise<CalculatorData> {
  const domain = "www.volebnikalkulacka.cz";
  const baseUrl = group === undefined ? `http://localhost:3020/${domain}/${key}` : `http://localhost:3020/${domain}/${key}/${group}`;

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

    const otherFilesObjects: CalculatorDataTypesMap = Object.entries(calculatorDataMap).reduce((accumulator, [key], index) => {
      accumulator[key] = otherFiles[index];
      return accumulator;
    }, {} as CalculatorDataTypesMap);

    return { calculator, ...otherFilesObjects } as CalculatorData;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}
