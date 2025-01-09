"use client";

import { useEffect, useState } from "react";
import { useCounterStore } from "./providers/counterStoreProvider";

type Question = {
  id: string;
  title: string;
  statement: string;
  detail: string;
  tags: string[];
};

export default function Page() {
  // const [isLoading, setIsLoading] = useState(true);
  const questions = useCounterStore((state) => state.questions);
  const currentQuestion = useCounterStore((state) => state.currentQuestion);
  const prevQuestion = useCounterStore((state) => state.prevQuestion);
  const skipQuestion = useCounterStore((state) => state.skipQuestion);
  // const [questions, setQuestions] = useState([]);

  // useEffect(() => {
  //   // make a generic fn
  //   async function fetchQuestions() {
  //     const res = await fetch(
  //       "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  //     );
  //     const data = await res.json();
  //     setQuestions(data);
  //     setIsLoading(false);
  //   }
  //   fetchQuestions();
  // }, []);

  // loading ui
  // if (isLoading) {
  //   return <h1>Data is Loading</h1>;
  // }
  // loaded ui
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Needs redirect</div>
    </main>
  );
}
