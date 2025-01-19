"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const path = usePathname();
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const setIsRekapitulace = useQuestionsStore(
    (state) => state.setIsRekapitulace,
  );
  const setCurrentLocation = useQuestionsStore(
    (state) => state.setCurrentLocation,
  );
  const guideNumber = useQuestionsStore((state) => state.guideNumber);
  const currentLocation = useQuestionsStore((state) => state.currentLocation);

  // location setter
  // is slow, make a better approach?
  useEffect(() => {
    if (path.includes("rekapitulace")) {
      setIsRekapitulace(true);
      setCurrentLocation("rekapitulace");
    } else if (path.includes("otazka")) {
      setIsRekapitulace(false);
      setCurrentLocation("otazka");
    } else if (path.includes("navod")) {
      setCurrentLocation("navod");
    }
  }, [path]);

  useEffect(() => {
    function changeUrl() {
      // insert conditionals here for edge cases?
      if (currentLocation === "otazka") {
        history.replaceState({}, "", `/abc/otazka/${currentQuestion}`);
      } else if (currentLocation === "navod") {
        history.replaceState({}, "", `/abc/navod/${guideNumber}`);
      }
    }
    changeUrl();
  }, [currentQuestion, guideNumber]);

  useEffect(() => {
    // change title
    function changeTitle() {
      if (currentLocation === "otazka") {
        document.title = `Otázka ${currentQuestion}`;
      } else if (currentLocation === "navod") {
        document.title = `Návod ${guideNumber}`;
      }
    }
    changeTitle();
  }, [currentLocation]);

  return children;
}
