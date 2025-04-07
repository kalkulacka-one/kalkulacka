"use client";
import { BottomBar, QuestionWrapper } from "@repo/design-system/ui";
import { useParams, useRouter } from "next/navigation";
import { useElectionStore } from "../../../stores/electionStore";
import QuestionsMobileArrowWrapper from "./questionsMobileArrowWrapper";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const district = params.district;

  const questions = useElectionStore((state) => state.questions);
  const currentQuestion = useElectionStore((state) => state.currentQuestion);
  const setNextQuestion = useElectionStore((state) => state.setNextQuestion);
  const setPreviousQuestion = useElectionStore(
    (state) => state.setPreviousQuestion,
  );
  const toggleImportant = useElectionStore((state) => state.toggleImportant);
  const answerYes = useElectionStore((state) => state.answerYes);
  const answerNo = useElectionStore((state) => state.answerNo);

  // console.log(questions);

  const yesClick = (currentQuestion: number) => {
    if (
      currentQuestion === questions.length &&
      questions[currentQuestion - 1]?.answerType === null
    ) {
      answerYes(currentQuestion);
      router.push(`/kalkulacka/${district}/rekapitulace`);
    } else {
      answerYes(currentQuestion);
    }
  };

  const noClick = (currentQuestion: number) => {
    if (
      currentQuestion === questions.length &&
      questions[currentQuestion - 1]?.answerType === null
    ) {
      answerNo(currentQuestion);
      router.push(`/kalkulacka/${district}/rekapitulace`);
    } else {
      answerNo(currentQuestion);
    }
  };

  return (
    <>
      <header
        className="sticky left-0 top-0 z-[100] max-w-[100vw]"
        style={{ gridArea: "sticky-header" }}
      >
        <QuestionsMobileArrowWrapper
          currentQuestion={currentQuestion}
          prevQuestion={setPreviousQuestion}
          skipQuestion={setNextQuestion}
          questions={questions}
        />
      </header>

      <main className="grid" style={{ gridArea: "main" }}>
        <div
          className="grid grid-rows-[1fr_auto]"
          style={{ gridTemplateAreas: `"main" "bottom-bar"` }}
        >
          <div className="place-content-center" style={{ gridArea: "main" }}>
            <div className="flex flex-1 items-center justify-center min-[576px]:items-center">
              {/* questions wrapper */}
              {questions.map((question: any, index: number) => {
                if (currentQuestion === index + 1) {
                  return (
                    <QuestionWrapper
                      key={`Question card id:${question.id}`}
                      question={question}
                      currentQuestion={currentQuestion}
                      questionCount={questions.length}
                      skipQuestion={setNextQuestion}
                      prevQuestion={setPreviousQuestion}
                      district={district}
                    />
                  );
                }
              })}
            </div>
          </div>
          <div
            className="sticky bottom-0 w-full place-items-center bg-white"
            style={{ gridArea: "bottom-bar" }}
          >
            {/* Bottom bar wrapper */}
            {questions.map((question: any, index: number) => {
              if (currentQuestion === index + 1) {
                return (
                  <BottomBar
                    key={question.id}
                    questions={questions}
                    currentQuestion={currentQuestion}
                    questionTotal={questions.length}
                    toggleImportant={() => toggleImportant(currentQuestion)}
                    starPressed={question.isImportant ? true : undefined}
                    yesClick={() => yesClick(currentQuestion)}
                    noClick={() => noClick(currentQuestion)}
                    yesPressed={question.answerType === true ? true : undefined}
                    noPressed={question.answerType === false ? true : undefined}
                  />
                );
              }
            })}
          </div>
        </div>
      </main>
    </>
  );
}

// 1. Bottom and questions wrapper inside map fix
// 2. Componentize header
// 3. check positioning on mobile
