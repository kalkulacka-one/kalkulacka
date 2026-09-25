// The four words the calculator flow hangs on. Deliberately hardcoded rather than read from the
// locale file: the smoke asserts them, so changing one of them also needs this human-reviewed file.
export const vocabulary = {
  continue: "Продолжи",
  start: "Започни со одговарање",
  yes: "Да",
  showResults: "Прикажи резултати",
} as const;
