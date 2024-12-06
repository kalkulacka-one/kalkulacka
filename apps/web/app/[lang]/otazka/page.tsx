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
  const [steps, setSteps] = useState({});

  function handleClick(button: string) {
    // delete alerts after check
    if (button === "inFavour") {
      alert("In favour clicked");
      setCurrentQuestion((prevState) => prevState + 1);
    } else if (button === "against") {
      alert("Against clicked");
      setCurrentQuestion((prevState) => prevState + 1);
    } else if (button === "prev") {
      alert("Prev");
      setCurrentQuestion((prevState) => prevState - 1);
    } else if (button === "next") {
      alert("Next");
      setCurrentQuestion((prevState) => prevState + 1);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
      );
      const data = await res.json();
      setIsLoading(false);
      setQuestions(data);
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

      <ClientBottomBar onClick={handleClick} />
    </div>
  );
}
