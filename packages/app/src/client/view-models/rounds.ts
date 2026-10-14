import { useMemo } from "react";

import { useCalculatorStore } from "@/client/stores";
import { currentRound, type RoundState } from "@/view-models";

export function useRound(): RoundState | undefined {
  const rounds = useCalculatorStore((state) => state.data.rounds);
  const now = useCalculatorStore((state) => state.now);
  return useMemo(() => (rounds ? currentRound(rounds, now ? new Date(now) : new Date()) : undefined), [rounds, now]);
}
