"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const path = usePathname();
  const router = useRouter();
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
    if (
      path.includes("rekapitulace") &&
      rekapitulace !== true &&
      currentLocation !== "rekapitulace"
    ) {
      setIsRekapitulace(true);
      setCurrentLocation("rekapitulace");
    } else if (
      path.includes("otazka") &&
      rekapitulace !== false &&
      currentLocation !== "otazka"
    ) {
      setIsRekapitulace(false);
      setCurrentLocation("otazka");
    } else if (path.includes("navod") && currentLocation !== "navod") {
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
        // edge case if currentLocation null or undefined
      } else if (currentLocation === undefined || currentLocation === null) {
        router.push("/");
      }
    }
    function changeTitle() {
      if (currentLocation === "otazka") {
        // refactor title structure
        document.title = `Otázka ${currentQuestion}`;
      } else if (currentLocation === "navod") {
        // refactor title structure
        document.title = `Návod ${guideNumber}`;
      } else {
        // default title
        document.title;
      }
    }
    changeTitle();
    changeUrl();
  }, [currentQuestion, guideNumber, currentLocation]);

  return children;
}
