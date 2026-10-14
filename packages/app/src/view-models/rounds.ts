import type { Candidate, Round, TimePeriod } from "@kalkulacka-one/schema";

export type RoundState = {
  current: number;
  total: number;
};

function periodEnd(period: TimePeriod): Date {
  // A date-only end ("2026-10-10") means the whole day is still voting time.
  return new Date(period.end.length === 10 ? `${period.end}T23:59:59` : period.end);
}

function roundEnd(round: Pick<Round, "votingHours">): Date | undefined {
  if (!round.votingHours || round.votingHours.length === 0) return undefined;
  return round.votingHours.map(periodEnd).reduce((latest, end) => (end > latest ? end : latest));
}

/**
 * The current round is the first round whose voting has not ended yet; once every round has ended, it is the last one.
 * A round without voting hours never ends, so it is current as soon as the rounds before it have ended.
 */
export function currentRound(rounds: Pick<Round, "number" | "votingHours">[], now: Date): RoundState {
  const ordered = [...rounds].sort((a, b) => a.number - b.number);
  const total = ordered.length;
  for (const round of ordered) {
    const end = roundEnd(round);
    if (end === undefined || end > now) {
      return { current: round.number, total };
    }
  }
  const last = ordered[ordered.length - 1];
  return { current: last ? last.number : 1, total };
}

export type CandidateRoundStatus = "active" | "elected" | "eliminated";

/** A candidate with no `rounds` takes part in every round; `elected` wins regardless of rounds. */
export function candidateRoundStatus(candidate: Pick<Candidate, "rounds" | "elected">, currentRound: number): CandidateRoundStatus {
  if (candidate.elected) return "elected";
  if (!candidate.rounds || candidate.rounds.includes(currentRound)) return "active";
  return "eliminated";
}
