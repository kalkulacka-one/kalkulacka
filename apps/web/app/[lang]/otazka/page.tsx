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

type Questions = {
  id: string;
  status: null;
  important: boolean;
};

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

  const questionsArray = steps.answers;

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
      case "star":
        setSteps((prevSteps) => {
          const updatedAnswer = prevSteps.answers.map((answer, index) => {
            if (index === currentQuestion - 1) {
              return { ...answer, important: !answer.important };
            }
            return answer;
          });

          return {
            ...prevSteps,
            answers: updatedAnswer,
            // currentQuestion: prevSteps.currentQuestion + 1,
          };
        });
        break;
    }
  }

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
      const answersArray = data.map((data: Questions) => {
        return { answerId: data.id, status: null, important: false };
      });
      const answers = {
        answers: answersArray.flat(),
        totalQuestion: questions.length,
        currentQuestion: currentQuestion,
      };

      setSteps(answers);
    };
    fetchData();
  }, []);

  // cleanup useEffects then
  useEffect(() => {
    // console.log("Component rendered")
  }, [steps])

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
      {/* write more elegantly  */}
      {questionsArray.map((question, index) => {
        const questionNumber = index + 1;
        if (question.important === true && questionNumber === currentQuestion) {
          return (
            // fix needed: better key naming ?
            <ClientBottomBar key={`Bottom bar (starPressed): ${question.id}`} starPressed onClick={handleClick} steps={steps} />
          );
        } else if (
          question.important === false &&
          questionNumber === currentQuestion
        ) {
          // fix needed: better key naming ?
          return <ClientBottomBar key={`Bottom bar (default): ${question.id}`}  onClick={handleClick} steps={steps} />;
        }
      })}
    </div>
  );
}
