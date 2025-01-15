"use client";

import { useQuestionsStore } from "./providers/storeProvider";

export default function Header() {
  const isRekapitulace = useQuestionsStore((state) => state.isRekapitulace);

  return (
    // sticky implementation?
    <header className="flex h-14 w-screen items-center justify-center bg-primary">
      Volební kalkulačka {isRekapitulace ? "Rekap true" : "Rekap false"}
    </header>
  );
}
