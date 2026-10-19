// The words the calculator flow hangs on. Deliberately hardcoded rather than read from the
// locale file: the smoke asserts them, so changing one of them also needs this human-reviewed file.
export const vocabulary = {
  continue: "Pokračovať",
  start: "Začať odpovedať",
  yes: "Áno",
  showResults: "Zobraziť výsledky",
  // The toggle for candidates out of the current round; its label carries their count.
  showEliminated: /^Zobraziť \d+ vyraden/,
} as const;
