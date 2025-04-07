"use client";
import { QuestionWrapper } from "@repo/design-system/ui";
import { useElectionStore } from "../../../stores/electionStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";
export default function Page() {
  const questions = useElectionStore((state) => state.questions);
  const params = useParams();
  const district = params.district;
  const fetchQuestions = useElectionStore((state) => state.fetchQuestions);
  const currentQuestion = useElectionStore((state) => state.currentQuestion);
  const setNextQuestion = useElectionStore((state) => state.setNextQuestion);
  const setPreviousQuestion = useElectionStore(
    (state) => state.setPreviousQuestion,
  );

  // questions set from url
  useEffect(() => {
    fetchQuestions(district);
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        {questions.map((question: any, index: number) => {
          if (currentQuestion === index + 1) {
            return (
              // map inside
              <QuestionWrapper
                key={`Question card id:${question.id}`}
                question={question}
                questionCount={questions.length}
                currentQuestion={currentQuestion}
                skipQuestion={setNextQuestion}
                prevQuestion={setPreviousQuestion}
                district={district}
              />
            );
          }
        })}
      </div>
    </div>
  );
}
