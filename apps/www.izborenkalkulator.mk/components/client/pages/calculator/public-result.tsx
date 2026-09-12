import { type calculateMatches, ResultPage } from "@kalkulacka-one/app";
import { AnswersStoreContext, createAnswersStore, useCalculator } from "@kalkulacka-one/app/client";
import type { Answer } from "@kalkulacka-one/schema";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { CalculatorMenu } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { type RouteSegments, routes } from "@/lib/routing";

export type PublicResultPageWithData = {
  /** The ranking stored with the shared session — replayed as it stood, not recomputed. */
  algorithmMatches: ReturnType<typeof calculateMatches>;
  /** The answers behind it, for the dashboard and the per-party comparison. */
  answers: Answer[];
  segments: RouteSegments;
};

/**
 * Somebody else's result, opened from a public link.
 *
 * The results screen rendered read-only: the note above the title says whose
 * numbers these are, the beat and the ways out of your own result are gone,
 * and the one thing it asks for is the visitor's own calculator. The ranking
 * is the one the session saved, replayed through the same view model the
 * results page uses — a later change to the data or the algorithm must not
 * quietly alter a result somebody already posted.
 *
 * Nothing here touches the viewer's own state. The public routes mount no
 * session (see their layouts), and the shared answers go into a store of
 * this page's own rather than the route's — see below.
 */
export function PublicResultPageWithData({ algorithmMatches, answers, segments }: PublicResultPageWithData) {
  const router = useRouter();
  const calculator = useCalculator();
  const locale = useLocale();

  /*
   * A store seeded before the first render, not the route's store filled in
   * an effect: the page counts the answers on its first pass, and an empty
   * store there would render — and serve — "Засега нема што да се пресмета"
   * for a beat before the ranking replaced it. Nested inside the route's
   * providers, so the store every other screen reads is never written.
   */
  const [answersStore] = useState(() => {
    const store = createAnswersStore();
    store.getState().setAnswers(answers);
    return store;
  });

  // Client-side navigation from one shared result to another of the same
  // calculator re-renders this page with new answers rather than remounting it.
  useEffect(() => {
    if (answersStore.getState().answers !== answers) {
      answersStore.getState().setAnswers(answers);
    }
  }, [answersStore, answers]);

  // A standalone calculator is named by its own data; there is no election
  // group to name it after — see `config/calculator-names.ts`.
  const { electionName, calculatorName } = calculatorNames({
    key: ("variant" in calculator ? calculator.variant?.key : undefined) ?? calculator.key,
    title: calculator.title || undefined,
    shortTitle: calculator.shortTitle,
  });

  /*
   * "Пополни сопствен калкулатор" — the intro, where the visitor's own
   * calculator starts. The empty state's exit leads there too: the route
   * refuses a result with no answers, so it is never shown, but a visitor
   * with nowhere to go "back" to has no other sensible destination.
   */
  const handleStartOwnClick = () => {
    router.push(routes.introduction(segments, locale));
  };

  return (
    <AnswersStoreContext.Provider value={answersStore}>
      <ResultPage
        appTitle="Изборен калкулатор"
        electionName={electionName}
        calculatorName={calculatorName}
        headerActions={<CalculatorMenu segments={segments} readOnly />}
        shared
        algorithmMatches={algorithmMatches}
        onStartOwnClick={handleStartOwnClick}
        onBackClick={handleStartOwnClick}
      />
    </AnswersStoreContext.Provider>
  );
}
