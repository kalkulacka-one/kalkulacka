import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnswersStoreContext, createAnswersStore } from "../../stores/answers";
import { CalculatorStoreContext, createCalculatorStore } from "../../stores/calculator";
import type { CandidateViewModel } from "../../view-models";
import { MatchCard } from "./match-card";

describe("MatchCard", () => {
  const mockCandidate: CandidateViewModel = {
    id: "1",
    references: [],
    displayName: "Občanská demokratická strana",
    number: 1,
  };

  const props = {
    candidate: mockCandidate,
    order: 1,
    match: 85,
    respondent: "candidate" as const,
    candidateAnswers: [],
  };

  it("renders candidate information", () => {
    const mockCalculatorData = {
      calculator: {},
      candidates: [],
      organizations: [],
      persons: [],
      questions: [],
      candidatesAnswers: {},
    };

    const calculatorStore = createCalculatorStore(mockCalculatorData);
    const answersStore = createAnswersStore();

    render(
      <CalculatorStoreContext.Provider value={calculatorStore}>
        <AnswersStoreContext.Provider value={answersStore}>
          <MatchCard {...props} />
        </AnswersStoreContext.Provider>
      </CalculatorStoreContext.Provider>,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText(mockCandidate.displayName ?? "")).toBeInTheDocument();
    expect(screen.getByText("85 %")).toBeInTheDocument();
  });
});
