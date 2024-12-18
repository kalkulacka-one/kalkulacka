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

const steps = {
  answers: [
    { answerId: "1", status: true }, // positive step (e.g. answerInFavour)
    { answerId: "2", status: null },
    { answerId: "3", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
    { answerId: "4", status: false }, // negative step (e.g. answerAgainst)
    { answerId: "5", status: true },
    { answerId: "6", status: true }, //
    { answerId: "7", status: false },
    { answerId: "8", status: undefined }, // step with no sratus (e.g. not visited yet)
    { answerId: "9", status: true }, // positive step (e.g. answerInFavour)
    { answerId: "10", status: null },
    { answerId: "11", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
    { answerId: "12", status: false }, // negative step (e.g. answerAgainst)
    { answerId: "13", status: true },
    { answerId: "14", status: true }, //
    { answerId: "15", status: false },
    { answerId: "16", status: undefined }, // step with no sratus (e.g. not visited yet)
    { answerId: "17", status: undefined }, // step with no sratus (e.g. not visited yet)
    { answerId: "18", status: true }, // positive step (e.g. answerInFavour)
    { answerId: "19", status: null },
    { answerId: "20", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
    { answerId: "21", status: false }, // negative step (e.g. answerAgainst)
    { answerId: "22", status: true },
    { answerId: "23", status: true }, //
    { answerId: "24", status: false },
    { answerId: "25", status: undefined }, // step with no sratus (e.g. not visited yet)
  ],
  totalQuestion: 4,
  currentQuestion: 8,
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
      <QuestionPageWrapper questions={questions} />
    </>
  );
}
