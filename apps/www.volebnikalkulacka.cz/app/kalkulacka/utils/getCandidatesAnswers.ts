import { candidateAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";

export default async function getCandidatesAnswers({ electionName }: { electionName: string }) {
  try {
    const res = await fetch(`http://localhost:3001/data/${electionName}/candidates-answers-fix.json`);
    const data = await res.json();
    const parsedData = candidateAnswers.safeParse(data);
    if (parsedData.success) {
      return parsedData.data;
    }
    throw parsedData.error;
  } catch (e) {
    console.log("Error", e);
  }
}
