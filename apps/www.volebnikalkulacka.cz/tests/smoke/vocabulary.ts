// The words the calculator flow hangs on. Deliberately hardcoded rather than read from the
// locale file: the smoke asserts them, so changing one of them also needs this human-reviewed file.
export const vocabulary = {
  continue: "Pokračovat",
  start: "Začít odpovídat",
  yes: "Ano",
  showResults: "Zobrazit výsledky",
  // The toggle for candidates out of the current round; its label carries their count.
  showEliminated: /^Zobrazit \d+ vyřazen/,
} as const;
