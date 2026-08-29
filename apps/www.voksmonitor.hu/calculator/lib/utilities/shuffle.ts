/**
 * Shuffles an array using the Fisher-Yates algorithm
 * This creates a new shuffled array without mutating the original
 *
 * @param array - The array to shuffle
 * @param seed - Optional seed string for reproducible shuffling
 * @returns A new shuffled array
 */
export function shuffle<T>(array: T[], seed?: string): T[] {
  const shuffled = [...array];
  const random = seed ? seededRandom(seed) : Math.random;

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp as T;
  }

  return shuffled;
}

/**
 * Creates a seeded random number generator using a simple LCG algorithm
 * This ensures the same seed always produces the same sequence of random numbers
 *
 * @param seed - The seed string to use
 * @returns A function that returns pseudo-random numbers between 0 and 1
 */
function seededRandom(seed: string): () => number {
  // Convert string seed to a number using a simple hash
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value to ensure positive seed
  let state = Math.abs(hash) || 1;

  // Linear Congruential Generator (LCG)
  return () => {
    state = (state * 1664525 + 1013904223) % 2147483647;
    return state / 2147483647;
  };
}
