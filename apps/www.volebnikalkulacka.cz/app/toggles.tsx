"use client";
import { useState } from "react";
import { ToggleAnswerYes } from "./toggleAnswerYes";

export function Toggles() {
  const [data, setData] = useState([
    { name: "question1", checked: true },

    { name: "question2", checked: false },

    { name: "question3", checked: true },
  ]);

  function toggleButton(value: string) {
    console.log(value);

    const toggledButtons = data.map((item) => {
      if (item.name === value) {
        return { ...item, checked: !item.checked };
      }
      return { ...item };
    });

    setData(toggledButtons);
  }

  return (
    <div>
      {data.map((toggle) => (
        <ToggleAnswerYes key={toggle.name} checked={toggle.checked} onChange={() => toggleButton(toggle.name)} />
      ))}
    </div>
  );
}
