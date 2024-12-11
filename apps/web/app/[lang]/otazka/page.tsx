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

type Steps = {
  answers: any[];
  totalQuestion: number;
  currentQuestion: number;
};

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guideDisplay, setGuideDisplay] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // steps for progress bar
  const [steps, setSteps] = useState<Steps>({
    answers: [],
    totalQuestion: questions.length,
    currentQuestion: 0,
  });

  function handleClick(button: string) {
    switch (button) {
      case "inFavour":
        setSteps((prevSteps) => {
          const updatedAnswer = prevSteps.answers.map((answer, index) => {
            if (index === currentQuestion - 1) {
              return { ...answer, status: true };
            }
            return answer;
          });

          return {
            ...prevSteps,
            answers: updatedAnswer,
            currentQuestion: prevSteps.currentQuestion + 1,
          };
        });
        setCurrentQuestion((prevState) => prevState + 1);
        break;
      case "against":
        setSteps((prevSteps) => {
          const updatedAnswer = prevSteps.answers.map((answer, index) => {
            if (index === currentQuestion - 1) {
              return { ...answer, status: false };
            }
            return answer;
          });

          return {
            ...prevSteps,
            answers: updatedAnswer,
            currentQuestion: prevSteps.currentQuestion + 1,
          };
        });
        setCurrentQuestion((prevState) => prevState + 1);
        break;
      case "prev":
        setCurrentQuestion((prevState) => prevState - 1);
        setSteps((prevState) => {
          return {
            ...prevState,
            currentQuestion: prevState.currentQuestion - 1,
          };
        });
        break;
      // fix button naming  and args to "skip" and null set
      case "next":
        setCurrentQuestion((prevState) => prevState + 1);
        setSteps((prevState) => {
          return {
            ...prevState,
            currentQuestion: prevState.currentQuestion + 1,
          };
        });
        break;
      case "guide":
        setGuideDisplay(false);
        setCurrentQuestion((prevState) => prevState + 1);
        setSteps((prevSteps) => {
          return {
            ...prevSteps,
            currentQuestion: prevSteps.currentQuestion + 1,
          };
        });
        break;
    }
  }

  // console.log(steps);

  useEffect(() => {
    // 1. Data call and data questions state update
    const fetchData = async () => {
      const res = await fetch(
        "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
      );
      const data = await res.json();
      setIsLoading(false);
      setQuestions(data);

      // populating steps state
      const answerId = data.map((data: Question) => {
        return { answerId: data.id, status: null };
      });
      const answers = {
        answers: answerId.flat(),
        totalQuestion: questions.length,
        currentQuestion: currentQuestion,
      };

      setSteps(answers);
    };
    fetchData();
  }, []);

  const questionCount = questions.length;

  return (
    <div className="flex flex-col justify-center self-end">
      {guideDisplay || currentQuestion === 0 ? (
        <QuestionGuide onClick={handleClick} />
      ) : null}
      {/* // fix glitch beginning */}
      {currentQuestion > questions.length && currentQuestion !== 0 ? (
        <QuestionResults />
      ) : null}
      {/* loader needed? */}
      {isLoading && <Spinner />}
      {/* find better approach than map */}
      {questions.map((question: Question, index) => {
        const questionNumber = index + 1;
        if (questionNumber === currentQuestion) {
          // cleanup api and get rif of wrapper
          return (
            <ClientQuestionWrapper
              // fix needed: better key naming ?
              key={`Question: ${question.id}`}
              currentQuestion={currentQuestion}
              questionCount={questionCount}
              question={question}
              onClick={handleClick}
              guideDisplay={guideDisplay}
            />
          );
        }
      })}
      {/* Bottom bar */}
      {currentQuestion <= questions.length && currentQuestion > 0 ? (
        <ClientBottomBar onClick={handleClick} steps={steps} />
      ) : null}
    </div>
  );
}
