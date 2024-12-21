"use client";
import { useQuestionsStore } from "./store";

export default function Page() {
  const answers = useQuestionsStore((state) => state.answers);
  return (
    <div>
      {/* answers wrapper */}
      <div className="flex flex-col bg-blue-500 p-5">
        {answers.map((answer) => {
          return <div className="bg-blue-300 p-5">{answer}</div>;
        })}
      </div>
    </div>
  );
}
