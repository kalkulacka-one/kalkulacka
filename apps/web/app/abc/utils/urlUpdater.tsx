"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);

  useEffect(() => {
    // cleanups ?
    // change url
    function changeUrl() {
      // insert conditionals here for edge cases?
      history.replaceState({}, "", `/abc/${currentQuestion}`);
    }
    // change title
    function changeTitle() {
      // insert conditionals here for edge cases?
      document.title = `Otázka ${currentQuestion}`;
    }
    changeTitle();
    changeUrl();
  }, [currentQuestion]);
  return children;
}
