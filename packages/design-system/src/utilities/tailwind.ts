import { extendTailwindMerge } from "tailwind-merge";

export function createTwMerge(prefix: string) {
  return extendTailwindMerge({ prefix });
}

export const twMerge = createTwMerge("ko");
