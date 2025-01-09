"use client";

import { useCounterStore } from "../providers/counterStoreProvider";

type Question = {
  id: string;
  title: string;
  statement: string;
  detail: string;
  tags: string[];
};

export default function Page() {
  const questions = useCounterStore((state) => state.questions);
  const currentQuestion = useCounterStore((state) => state.currentQuestion);
  const prevQuestion = useCounterStore((state) => state.prevQuestion);
  const skipQuestion = useCounterStore((state) => state.skipQuestion);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {questions?.map((question: string, index) => {
          if (currentQuestion === index + 1) {
            return (
              <div key={index} className="m-4 bg-red-400">
                <span>{question}</span>
              </div>
            );
          }
        })}
      </div>
      <button onClick={skipQuestion}>Skip question</button>
      <button onClick={prevQuestion}>Prev question</button>
    </main>
  );
}
