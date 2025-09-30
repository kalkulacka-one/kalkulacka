function generateSeedRandomNumber(seed: string) {
  const seedToArray = seed.split("").filter((element) => element !== "-");
  let h = 0;

  for (const i of seedToArray) {
    const charCode = i.charCodeAt(0);
    h = (h * 31 + charCode) | 0;
  }
  return h;
}

function keyGenerator(state: number) {
  let currentState = state;
  return () => {
    const primeNumber = 1664525;
    currentState = currentState * primeNumber;
    currentState = currentState | 0;
    return (currentState >>> 0) / 2 ** 32;
  };
}

export function sortingKeyGenerator(uuid: string) {
  return keyGenerator(generateSeedRandomNumber(uuid));
}
