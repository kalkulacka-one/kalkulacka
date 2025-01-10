"use client";

import { useQuestionsStore } from "../../providers/storeProvider";

export default function Page() {
  const guide = useQuestionsStore((state) => state.guide);
  const guideNumber = useQuestionsStore((state) => state.guideNumber);
  const prevGuide = useQuestionsStore((state) => state.prevGuide);
  const nextGuide = useQuestionsStore((state) => state.nextGuide);
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="bg-red-200">
        <h2>Collection</h2>
        {guide?.map((guide, index) => {
          if (guideNumber === index + 1) {
            return (
              <div key={index} className="m-4 bg-red-400">
                <span>{guide.message}</span>
              </div>
            );
          }
        })}
      </div>

      <button onClick={nextGuide}>Skip question</button>
      <button onClick={prevGuide}>Prev question</button>
    </main>
  );
}
