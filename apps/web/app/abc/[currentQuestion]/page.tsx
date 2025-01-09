"use client";

import { useQuestionsStore } from "../providers/storeProvider";

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const collection = useQuestionsStore((state) => state.collection);
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const prevQuestion = useQuestionsStore((state) => state.prevQuestion);
  const skipQuestion = useQuestionsStore((state) => state.skipQuestion);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="bg-red-200">
        <h2>Questions</h2>
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
      <div className="bg-red-200">
        <h2>Collection</h2>
        {collection?.map((item: string, index) => {
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
