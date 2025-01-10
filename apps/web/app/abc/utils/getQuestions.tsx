import { Question } from "@repo/schema";

export default async function getQuestions(baseUrl: string) {
  //
  const res = await fetch(baseUrl);
  const data = await res.json();
  const questions = await data.map((question: Question) => {
    return { ...question, answerType: null, isImportant: null };
  });
  return questions;
}
