"use client";

import { useQuestionsStore } from "../providers/storeProvider";

export default function Counter() {
  const { count, incrementCount, decrementCount } = useQuestionsStore(
    (state) => state,
  );

  return (
    <div>
      Count: {count}
      <hr />
      <button type="button" onClick={() => void incrementCount()}>
        Increment Count
      </button>
      <button type="button" onClick={() => void decrementCount()}>
        Decrement Count
      </button>
    </div>
  );
}
