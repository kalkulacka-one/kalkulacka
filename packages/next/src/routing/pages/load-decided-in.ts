import { currentRound, loadCandidates, NotFoundError } from "@kalkulacka-one/app";
import type { Election } from "@kalkulacka-one/schema";

// In a later round, a district whose seat was already won is marked with the round it was decided in.
export async function loadDecidedIn({ endpoint, group, keys, election, now }: { endpoint: string; group: string; keys: string[]; election: Election; now: Date }): Promise<Record<string, number>> {
  if (!election.rounds) return {};
  const current = currentRound(election.rounds, now).current;
  if (current <= 1) return {};
  const entries = await Promise.all(
    keys.map(async (key) => {
      try {
        const candidates = await loadCandidates({ endpoint, key, group });
        const elected = candidates.filter((candidate) => candidate.elected);
        const decidedIn = elected.reduce<number | undefined>((round, candidate) => Math.max(round ?? 0, ...(candidate.rounds ?? [current - 1])), undefined);
        return decidedIn === undefined ? undefined : ([key, decidedIn] as const);
      } catch (error) {
        if (!(error instanceof NotFoundError)) console.error(`Candidates of \`${group}/${key}\` could not be loaded`, error);
        return undefined;
      }
    }),
  );
  return Object.fromEntries(entries.filter((entry) => entry !== undefined));
}
