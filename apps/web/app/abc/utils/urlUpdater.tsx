"use client";
import { useEffect } from "react";
import { useCounterStore } from "../providers/counterStoreProvider";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const currentQuestion = useCounterStore((state) => state.currentQuestion);

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
