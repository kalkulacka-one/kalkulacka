"use client";
import { useQuestionsStore } from "./store";
import { BottomBar } from "@repo/design-system/ui";

export default function Page() {
  // cleanup and better naming
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const questionTotal = useQuestionsStore((state) => state.questionTotal);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);
  const answerYes = useQuestionsStore((state) => state.answerYes);
  const answerNo = useQuestionsStore((state) => state.answerNo);

  const YesClick = () => {
    answerYes();
    skipQuestion();
  };

  const NoClick = () => {
    answerNo();
    skipQuestion();
  };

  return (
    <div>
      {/* questions wrapper */}
      <div className="flex flex-col gap-2 bg-purple-200 p-5">
        {questions.map((question, index) => {
          const currentStep = index + 1;
          if (currentStep === currentQuestion) {
            return (
              <div key={question.id} className="bg-blue-300 p-5">
                <div>
                  <span className="rounded-full bg-white px-2">
                    {currentQuestion}/{questionTotal}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">{question.title}</span>
                  <span className="font-light">{question.detail}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleImportant}
                    className={`${question.isImportant ? "bg-yellow-100" : "bg-blue-100"} px-4 py-2`}
                  >
                    Is important
                  </button>
                  <button
                    onClick={prevQuestion}
                    className="bg-blue-100 px-4 py-2"
                  >
                    Previous
                  </button>
                  <button
                    onClick={skipQuestion}
                    className="bg-blue-100 px-4 py-2"
                  >
                    Skip
                  </button>
                </div>
              </div>
            );
          }
        })}
        {/* bottom bar wrapper */}
        <BottomBar
          questions={questions}
          currentQuestion={currentQuestion}
          questionTotal={questionTotal}
          onClick={() => onclick("inFavour")}
        />
        {questions.map((question, index) => {
          const currentStep = index + 1;
          if (currentStep === currentQuestion) {
            return (
              <div key={question.id} className="h-auto bg-rose-300">
                <button
                  onClick={YesClick}
                  className={`border-4 border-blue-800 ${question.answerType === true ? "bg-blue-400" : "bg-blue-100"} px-4 py-2`}
                >
                  Yes
                </button>
                <button
                  onClick={NoClick}
                  className={`border-4 border-blue-800 ${question.answerType === false ? "bg-rose-400" : "bg-rose-100"} px-4 py-2`}
                >
                  No
                </button>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
