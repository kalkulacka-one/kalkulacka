import type { calculateMatches } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculator } from "@kalkulacka-one/app/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

export type UseCalculatorActionsOptions = {
  segments: RouteSegments;
  /** The ranking, on the screens that have one — saved with the answers, which is what marks the session finished server-side. */
  matches?: ReturnType<typeof calculateMatches>;
};

/**
 * The two things the shell menu — and the intro's own "Почни одново" — can do
 * to the reader's session: leave it, and wipe it.
 *
 * Leaving saves first, because the reassurance in the leave dialog is only
 * true once the answers are on the server; a save that fails is reported,
 * not fatal, and the exit still happens. Restarting clears the store and then
 * persists the *empty* answers, because the session loader would otherwise
 * hand the old ones straight back on the next reload. The ranking stored
 * with the previous answers is left as it was: the session endpoint has no
 * way to unset it, and the next visit to the results replaces it.
 */
export function useCalculatorActions({ segments, matches }: UseCalculatorActionsOptions) {
  const router = useRouter();
  const calculator = useCalculator();
  const locale = useLocale();
  const answers = useAnswersStore((state) => state.answers);
  const clearAnswers = useAnswersStore((state) => state.clearAnswers);

  // A ranking with no computed match in it is not a result worth recording.
  const validMatches = matches?.some((match) => match.match !== undefined) ? matches : undefined;

  const leave = async () => {
    try {
      if (answers.length > 0) {
        await saveSessionData(calculator.id, answers, validMatches, calculator.version);
      }
    } catch (error) {
      reportError(error);
    }
    router.push("/");
  };

  const restart = async () => {
    const hadAnswers = answers.length > 0;
    clearAnswers();
    try {
      // Only when there was something to wipe: a visitor with no answers has
      // no session data yet, and writing an empty set would only manufacture
      // a "session missing" error to report.
      if (hadAnswers) {
        await saveSessionData(calculator.id, [], undefined, calculator.version);
      }
    } catch (error) {
      reportError(error);
    }
    router.push(routes.question(segments, 1, locale));
  };

  return { leave, restart };
}
