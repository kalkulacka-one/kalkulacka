"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
import { usePathname } from "next/navigation";
import { stackTraceLimit } from "postcss/lib/css-syntax-error";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const path = usePathname();
  const isRekapitulace = useQuestionsStore((state) => state.isRekapitulace);
  const setIsRekapitulace = useQuestionsStore(
    (state) => state.setIsRekapitulace,
  );

  // rekapitulace setter
  // is slow, make a better approach?
  useEffect(() => {
    if (path.includes("rekapitulace") && !isRekapitulace) {
      console.log("Rekapitulace");
      setIsRekapitulace(true);
    } else if (path.includes("otazka") && isRekapitulace) {
      setIsRekapitulace(false);
    }
  }, []);

  // const currentQuestion = useQuestionsStore((state) => state.currentQuestion);

  // useEffect(() => {
  //   // cleanups ?
  //   // change url
  //   function changeUrl() {
  //     // insert conditionals here for edge cases?
  //     history.replaceState({}, "", `/abc/${currentQuestion}`);
  //   }
  //   // change title
  //   function changeTitle() {
  //     // insert conditionals here for edge cases?
  //     document.title = `Otázka ${currentQuestion}`;
  //   }
  //   // changeTitle();
  //   // changeUrl();
  // }, [currentQuestion]);

  return children;
}
