export default async function getQuestions(baseUrl: string) {
  const res = await fetch(baseUrl);
  const data = await res.json();
  return data;
}
