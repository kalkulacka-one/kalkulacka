import type { Question } from "@repo/schema/dist";
import OtazkaComponent from "../../temp/OtazkaComponent";
import QuestionPageWrapper from "../../temp/QuestionPageWrapper";
import {
  ClientBottomBar,
  ClientQuestionWrapper,
} from "../../temp/ClientWrapper";

type Props = {
  params: { otazkaId: string };
};

async function getData() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();
  return data;
}
export default async function Page({ params }: Props) {
  const questions = await getData();
  return (
    <>
      <span>Next redirect here</span>
      {/* <span>Questions length: {questions.length}</span>
      {questions.length > 0 &&
        questions.map((question: Question, index: number) => {
          const currentQuestion = index + 1;
          return (
            <ClientQuestionWrapper
              key={`Question: ${question.id}`}
              currentQuestion={currentQuestion}
              questionCount={questions.length}
              question={question}
            />
          );
        })}
      <ClientBottomBar steps={steps} /> */}
      {/* <QuestionPageWrapper questions={questions} /> */}
    </>
  );
}
