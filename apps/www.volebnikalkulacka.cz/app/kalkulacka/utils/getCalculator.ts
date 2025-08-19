export default async function getCalculator({ electionName }: { electionName: string }) {
  const res = await fetch(`http://localhost:3001/data/${electionName}/calculator.json`);
  const data = await res.json();
  return data;
}
