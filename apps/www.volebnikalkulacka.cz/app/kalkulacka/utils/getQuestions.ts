import { questionsSchema } from "../../../../../packages/schema/schemas/questions.schema";

export default async function getQuestions({ electionName }: { electionName: string }) {
  try {
    const res = await fetch(`http://localhost:3001/data/${electionName}/questions.json`);
    const data = await res.json();
    const parsedData = questionsSchema.safeParse(data);
    if (parsedData.success) {
      return parsedData.data;
    }
    throw parsedData.error;
  } catch (e) {
    console.log("Error", e);
  }
}
