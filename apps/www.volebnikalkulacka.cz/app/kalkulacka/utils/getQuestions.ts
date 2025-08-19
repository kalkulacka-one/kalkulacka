export default async function getQuestions({ electionName }: { electionName: string }) {
  const res = await fetch(`http://localhost:3001/data/${electionName}/questions.json`);
  const data = await res.json();
  return data;
}
