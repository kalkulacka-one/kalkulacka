"use client";

import { useQuestionsStore } from "../providers/storeProvider";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="bg-red-200">
        <h2>Collection</h2>
        {questions?.map((item: string, index) => {
          if (currentQuestion === index + 1) {
            return (
              <div key={index} className="m-4 bg-red-400">
                <span>{item}</span>
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
