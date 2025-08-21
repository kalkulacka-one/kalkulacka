"use client";

import { useState } from "react";

export default function ClientWidget() {
  const [count, setCount] = useState(0);
  return (
    <div className="bg-blue-300">
      I am client component
      <span>Count: {count}</span>
      <button type="button" onClick={() => setCount((prevState) => prevState + 1)}>
        + 1
      </button>
    </div>
  );
}
