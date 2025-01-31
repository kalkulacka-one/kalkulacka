"use client";
import { useEffect } from "react";
import { useQuestionsStore } from "../providers/storeProvider";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function UrlUpdater({ children }: Props) {
  const currentUrl = usePathname();
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
    if (
      currentUrl.includes("rekapitulace") &&
      currentLocation !== "rekapitulace"
    ) {
      setCurrentLocation("rekapitulace");
      setIsRekapitulace(true);
    } else if (currentUrl.includes("otazka") && currentLocation !== "otazka") {
      setCurrentLocation("otazka");
      setIsRekapitulace(false);
    } else if (currentUrl.includes("navod") && currentLocation !== "navod") {
      setCurrentLocation("navod");
      setIsRekapitulace(false);
    } else if (
      currentUrl.includes("vysledky") &&
      currentLocation !== "vysledky"
    ) {
      setCurrentLocation("vysledky");
      setIsRekapitulace(false);
    }
  }, [currentUrl, currentLocation]);

  useEffect(() => {
    if (currentLocation === "otazka") {
      document.title = `Otázka ${currentQuestion}`;
      history.replaceState({}, "", `/abc/otazka/${currentQuestion}`);
    } else if (currentLocation === "navod") {
      document.title = `Návod ${guideNumber}`;
      history.replaceState({}, "", `/abc/navod/${guideNumber}`);
    } else if (currentLocation === "rekapitulace") {
      document.title = `Rekapitulace`;
    } else if (currentLocation === "vysledky") {
      document.title = `Výsledky`;
    }
    return () => {
      document.title;
    };
  }, [guideNumber, currentQuestion, currentLocation]);
  return children;
}
