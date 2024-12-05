import {
  ClientBottomBar,
  ClientQuestionWrapper,
} from "../../temp/ClientWrapper";

import type { Question } from "@repo/schema/dist";

export default async function Page() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );

  const question = await res.json();

  return (
    <div className="bg-green-100">
      {question.map((question: Question) => (
        <ClientQuestionWrapper
          currentQuestion={1}
          questionCount={40}
          question={question}
        />
      ))}
      <ClientBottomBar />
    </div>
  );
}
