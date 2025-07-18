"use client";
import type { Metadata } from "next";
import { useState } from "react";
import { BottomBar } from "./bottomBar";
import { ToggleAnswerNo } from "./toggleAnswerNo";
import { ToggleAnswerYes } from "./toggleAnswerYes";
// export const metadata: Metadata = {
//   title: "Volební kalkulačka",
//   description: "Nejužitečnějších 5 minut před parlamentními volbami 2025",
// };

enum UserAnswerEnum {
  yes = 1,
  no = 2,
  skip = 3,
}

const currentStep = 1;

export default function Page() {
  const [data, setData] = useState([
    { name: "question1", answer: 1, isImportant: false },

    { name: "question2", answer: 2, isImportant: true },

    { name: "question3", answer: 3, isImportant: false },
  ]);

  console.log(data);
  function handleToggle(name: string) {
    switch (name) {
      case "yes":
        {
          // alert("Ano!!!");
          const toggledData = data.map((item, index) => {
            if (index + 1 === currentStep && item.answer === UserAnswerEnum.yes) {
              return { ...item, answer: 0 };
            }
            if (index + 1 === currentStep && item.answer !== UserAnswerEnum.yes) {
              return { ...item, answer: 1 };
            }
            return { ...item };
          });
          setData(toggledData);
        }
        break;
      case "no": {
        // alert("Ne!!!!");
        const toggledData = data.map((item, index) => {
          if (index + 1 === currentStep && item.answer === UserAnswerEnum.no) {
            return { ...item, answer: 0 };
          }
          if (index + 1 === currentStep && item.answer !== UserAnswerEnum.no) {
            return { ...item, answer: 2 };
          }
          return { ...item };
        });
        setData(toggledData);
      }
    }
  }

  return (
    <section>
      <h2>Parlamentní volby 2025</h2>
      <BottomBar>
        {data.map((question, index) => {
          if (index + 1 === currentStep) {
            return (
              <div key={question.name} className="flex gap-4 items-center">
                <ToggleAnswerYes checked={question.answer === 1 && true} onChange={() => handleToggle("yes")} />
                <ToggleAnswerNo checked={question.answer === 2 && true} onChange={() => handleToggle("no")} />
                <span>{question.name}</span>
              </div>
            );
          }
        })}
      </BottomBar>
    </section>
  );
}
