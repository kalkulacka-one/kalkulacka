"use client";
import { useQuestionsStore } from "../providers/storeProvider";
import ResultsFallback from "./resultsFallback";
import ResultCard from "./resultCard";
import ResultsHeader from "./resultsHeader";

interface Result {
  partyShort: string;
  partyLong: string;
  result: number;
}

interface Results {
  results: Result[];
}

const data: Results[] = [
  {
    results: [
      {
        partyShort: "STAN+SOL",
        partyLong: "STAROSTOVÉ PRO JIŽNÍ MORAVU",
        result: 90,
      },
      {
        partyShort: "Piráti",
        partyLong: "Česká pirátská strana",
        result: 30,
      },
      {
        partyShort: "SOM+Nestran2024",
        partyLong: "STAROSTOVÉ PRO JIŽNÍ MORAVU",
        result: 30,
      },
      {
        partyShort: "SOM+Nestran2024",
        partyLong: "STAROSTOVÉ PRO JIŽNÍ MORAVU",
        result: 15,
      },
      {
        partyShort: "KDU+ODS+TOP 09",
        partyLong: "SPOLU - ODS, KDU-ČSL, TOP 09",
        result: 6,
      },
    ],
  },
];

export default function Page() {
  const questions = useQuestionsStore((state) => state.questions);
  const isAnswered = questions.every(
    (question) => question.answerType === null,
  );

  console.log(isAnswered);
  console.log(questions);
  return (
    // page wrapper
    <div className="flex min-h-screen flex-col">
      <ResultsHeader />
      <main className="grid grid-cols-1 justify-center gap-4 p-4 min-[701px]:grid-cols-[clamp(32rem,50vw,48rem)]">
        {/* cards wrapper */}
        {!isAnswered ? (
          <div className="flex flex-col gap-4 ">
            {data[0]?.results.map((result, index) => (
              <ResultCard
                key={index}
                cardNumber={index + 1}
                isFirst={index === 0}
                results={result}
              />
            ))}
          </div>
        ) : (
          <ResultsFallback />
        )}
      </main>
    </div>
  );
}

// TODO
// 2. Import result type
