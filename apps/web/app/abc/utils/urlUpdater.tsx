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

  useEffect(() => {
    // store location setter
    function locationSetter() {
      if (path.includes("rekapitulace")) {
        setCurrentLocation("rekapitulace");
        setIsRekapitulace(true);
      } else if (path.includes("otazka")) {
        setCurrentLocation("otazka");
        setIsRekapitulace(false);
      } else if (path.includes("navod")) {
        setCurrentLocation("navod");
      } else if (path.includes("vysledky")) {
        setCurrentLocation("vysledky");
        setIsRekapitulace(false);
      }
    }
    // url setter
    function changeUrl() {
      // insert conditionals here for edge cases?
      if (currentLocation === "otazka" && currentQuestion !== null) {
        // refactor url structure
        history.replaceState({}, "", `/abc/otazka/${currentQuestion}`);
      } else if (currentLocation === "navod") {
        // refactor url structure
        history.replaceState({}, "", `/abc/navod/${guideNumber}`);
      } else if (currentLocation === "rekapitulace") {
        history.replaceState({}, "", `/abc/rekapitulace`);
      } else if (currentLocation === "vysledky") {
        history.replaceState({}, "", `/abc/vysledky`);
      }
    }
    // title setter
    function changeTitle() {
      if (currentLocation === "otazka") {
        // refactor title structure
        document.title = `Otázka ${currentQuestion}`;
      } else if (currentLocation === "navod") {
        // refactor title structure
        document.title = `Návod ${guideNumber}`;
      } else if (currentLocation === "rekapitulace") {
        document.title = `Rekapitulace`;
      } else if (currentLocation === "vysledky") {
        document.title = `Výsledky`;
      }
    }

    locationSetter();
    changeTitle();
    changeUrl();
  }, [path, currentQuestion, guideNumber, currentLocation]);

  return children;
}

// TODO:
// 1. needs refactoring (url updates glitch)
