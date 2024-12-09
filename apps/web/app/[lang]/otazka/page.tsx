"use client";
import { useEffect, useState } from "react";
import {
  ClientBottomBar,
  ClientQuestionWrapper,
} from "../../temp/ClientWrapper";

import {
  Spinner,
  QuestionGuide,
  QuestionResults,
} from "@repo/design-system/ui";

import type { Question } from "@repo/schema/dist";

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  // steps for progress bar
  const [steps, setSteps] = useState({
    answers: [],
    totalQuestion: questions.length,
    currentQuestion: currentQuestion,
  });

  function handleClick(button: string) {
    switch (button) {
      case "inFavour":
        setCurrentQuestion((prevState) => prevState + 1);
        setSteps({
          ...steps,
          currentQuestion: currentQuestion,
        });
        break;
      case "against":
        setCurrentQuestion((prevState) => prevState + 1);
        setSteps({
          ...steps,
          currentQuestion: currentQuestion,
        });
        break;
      case "prev":
        setCurrentQuestion((prevState) => prevState - 1);
        setSteps({
          ...steps,
          currentQuestion: currentQuestion,
        });
        break;
      case "next":
        setCurrentQuestion((prevState) => prevState + 1);
        setSteps({
          ...steps,
          currentQuestion: currentQuestion,
        });
        break;
    }
  }

  console.log(steps);

  useEffect(() => {
    // Data call and data state update
    const fetchData = async () => {
      const res = await fetch(
        "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
      );
      const data = await res.json();
      setIsLoading(false);
      setQuestions(data);
      // console.log(data);
      // updating steps
      const answerId = data.map((data) => {
        return { answerId: data.id, status: null };
      });
      const answers = {
        answers: answerId.flat(),
        totalQuestion: questions.length,
        currentQuestion: currentQuestion,
      };

      setSteps(answers);
      console.log(answers);
    };
    fetchData();
  }, []);

  const questionCount = questions.length;

  return (
    <div className="flex flex-col justify-center self-end">
      {isLoading && <Spinner />}
      {/* find better approach than map */}
      {questions.map((question: Question, index) => {
        const questionNumber = index + 1;
        if (questionNumber === currentQuestion) {
          // cleanup api and get rif of wrapper
          return (
            <ClientQuestionWrapper
              currentQuestion={currentQuestion}
              questionCount={questionCount}
              question={question}
              onClick={handleClick}
            />
          );
        }
      })}

      <ClientBottomBar onClick={handleClick} steps={steps} />
    </div>
  );
}
