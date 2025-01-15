"use client";

import { useQuestionsStore } from "./providers/storeProvider";

export default function Header() {
  const isRekapitulace = useQuestionsStore((state) => state.isRekapitulace);
  const currentLocation = useQuestionsStore((state) => state.currentLocation);

  return (
    // sticky implementation?
    <header className="flex h-14 w-screen items-center justify-center bg-primary">
      Volební kalkulačka {isRekapitulace ? "Rekap true" : "Rekap false"}
      Location: {currentLocation}
    </header>
  );
}
