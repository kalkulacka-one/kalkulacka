"use client";

export function QuestionPage({ questionNumber }: { questionNumber: number }) {
  return (
    <div>
      <h2>Otázka</h2>
      <p>questionNumber:{questionNumber}</p>
    </div>
  );
}
