"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const path = usePathname();
  const currentQuestion = useQuestionsStore((state) => state.currentQuestion);
  const rekapitulace = useQuestionsStore((state) => state.isRekapitulace);
  const setIsRekapitulace = useQuestionsStore(
    (state) => state.setIsRekapitulace,
  );
  const setCurrentLocation = useQuestionsStore(
    (state) => state.setCurrentLocation,
  );
  const guideNumber = useQuestionsStore((state) => state.guideNumber);
  const currentLocation = useQuestionsStore((state) => state.currentLocation);

  // Location setter
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

  // Url updater
  useEffect(() => {
    function changeUrl() {
      // insert conditionals here for edge cases?
      if (currentLocation === "otazka") {
        // refactor url structure
        history.replaceState({}, "", `/abc/otazka/${currentQuestion}`);
      } else if (currentLocation === "navod") {
        // refactor url structure
        history.replaceState({}, "", `/abc/navod/${guideNumber}`);
      }
    }
    function changeTitle() {
      if (currentLocation === "otazka") {
        // refactor title structure
        document.title = `Otázka ${currentQuestion}`;
      } else if (currentLocation === "navod") {
        // refactor title structure
        document.title = `Návod ${guideNumber}`;
      }
    }
    changeTitle();
    changeUrl();
  }, [currentQuestion, guideNumber, currentLocation]);

  return children;
}
