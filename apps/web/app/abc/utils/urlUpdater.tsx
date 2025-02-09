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
  const setCurrentLocation = useQuestionsStore(
    (state) => state.setCurrentLocation,
  );
  const currentGuide = useQuestionsStore((state) => state.currentGuide);
  const currentLocation = useQuestionsStore((state) => state.currentLocation);

  // setting the store location based on the current url
  const storeLocationSetter = () => {
    if (
      currentUrl.includes("rekapitulace") &&
      currentLocation !== "rekapitulace"
    ) {
      setCurrentLocation("rekapitulace");
    } else if (currentUrl.includes("otazka") && currentLocation !== "otazka") {
      setCurrentLocation("otazka");
    } else if (currentUrl.includes("navod") && currentLocation !== "navod") {
      setCurrentLocation("navod");
    } else if (
      currentUrl.includes("vysledky") &&
      currentLocation !== "vysledky"
    ) {
      setCurrentLocation("vysledky");
    }
  };
  // url and tab updater based on the store state
  const urlAndTitleUpdater = () => {
    if (currentLocation === "otazka") {
      document.title = `Otázka ${currentQuestion}`;
      history.replaceState({}, "", `/abc/otazka/${currentQuestion}`);
    } else if (currentLocation === "navod") {
      document.title = `Návod ${currentGuide}`;
      history.replaceState({}, "", `/abc/navod/${currentGuide}`);
    } else if (currentLocation === "rekapitulace") {
      document.title = `Rekapitulace`;
    } else if (currentLocation === "vysledky") {
      document.title = `Výsledky`;
    }
  };

  // useEffect to set the store location based on the current URL
  useEffect(() => {
    storeLocationSetter();
  }, [currentUrl, currentLocation]);

  // useEffect to update the URL and document title based on the current location
  useEffect(() => {
    urlAndTitleUpdater();
    return () => {
      document.title;
    };
  }, [currentGuide, currentQuestion, currentLocation]);
  return children;
}
