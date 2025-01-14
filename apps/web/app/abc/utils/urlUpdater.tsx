"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const path = usePathname();
  console.log(`Path: ${path}`);

  console.log(path.includes("rekapitulace"));
  console.log(path.includes("otazka"));

  // if (path.includes("rekapitulace")) {
  //   console.log("Rekapitulace found!");
  // } else if (path.includes("otazka")) {
  //   console.log("Otazka found!");
  // }

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
