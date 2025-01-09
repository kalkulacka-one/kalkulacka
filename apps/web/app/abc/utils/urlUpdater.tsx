"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);

  useEffect(() => {
    // change url
    function changeUrl() {
      history.replaceState({}, "", `/abc/${currentQuestion}`);
    }
    // change title
    function changeTitle() {
      document.title = `Otázka ${currentQuestion}`;
    }
    changeTitle();
    changeUrl();
  }, [currentQuestion]);
  return children;
}
