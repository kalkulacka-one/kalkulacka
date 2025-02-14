// "use client";

// import type { Question } from "@repo/schema/dist";

// type Props = {
//   // fix type!
//   questions?: any[];
//   currentQuestion?: number;
//   questionCount?: any[];
// };

// const steps = {
//   answers: [
//     { answerId: "1", status: true }, // positive step (e.g. answerInFavour)
//     { answerId: "2", status: null },
//     { answerId: "3", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
//     { answerId: "4", status: false }, // negative step (e.g. answerAgainst)
//     { answerId: "5", status: true },
//     { answerId: "6", status: true }, //
//     { answerId: "7", status: false },
//     { answerId: "8", status: undefined }, // step with no sratus (e.g. not visited yet)
//     { answerId: "9", status: true }, // positive step (e.g. answerInFavour)
//     { answerId: "10", status: null },
//     { answerId: "11", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
//     { answerId: "12", status: false }, // negative step (e.g. answerAgainst)
//     { answerId: "13", status: true },
//     { answerId: "14", status: true }, //
//     { answerId: "15", status: false },
//     { answerId: "16", status: undefined }, // step with no sratus (e.g. not visited yet)
//     { answerId: "17", status: undefined }, // step with no sratus (e.g. not visited yet)
//     { answerId: "18", status: true }, // positive step (e.g. answerInFavour)
//     { answerId: "19", status: null },
//     { answerId: "20", status: null }, // neutral step (e.g. visited / skipped, answerNeutral)
//     { answerId: "21", status: false }, // negative step (e.g. answerAgainst)
//     { answerId: "22", status: true },
//     { answerId: "23", status: true }, //
//     { answerId: "24", status: false },
//     { answerId: "25", status: undefined }, // step with no sratus (e.g. not visited yet)
//   ],
//   totalQuestion: 4,
//   currentQuestion: 8,
// };

// import { QuestionWrapper, BottomBar } from "@repo/design-system/ui";

// export default function QuestionPageWrapper({
//   questions,
//   currentQuestion,
//   questionCount,
// }) {
//   return (
//     <div>
//       <QuestionWrapper
//         key={`Question: ${questions.id}`}
//         currentQuestion={currentQuestion}
//         questionCount={questionCount}
//         question={questions}
//         onClick={() => alert("Clicked")}
//       />
//       <BottomBar steps={steps} onClick={console.log("Clicked")} />
//     </div>
//   );
// }
