export default async function getQuestions(district: any) {
  const res = await fetch(
    `http://localhost:3000/data/instance/volebnikalkulacka.cz/krajske-2024/${district}/questions.json`,
  );
  const data = await res.json();
  const questions = await data.map((question: any) => {
    return { ...question, answerType: null, isImportant: null };
  });
  return questions;
}
