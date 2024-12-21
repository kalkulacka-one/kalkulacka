"use client";
import { useQuestionsStore } from "./store";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const questionTotal = useQuestionsStore((state) => state.questionTotal);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);
  const toggleImportant = useQuestionsStore((state) => state.toggleImportant);

  return (
    <div>
      {/* questions wrapper */}
      <div className="flex flex-col gap-2 bg-blue-500 p-5">
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
      </div>
    </div>
  );
}
