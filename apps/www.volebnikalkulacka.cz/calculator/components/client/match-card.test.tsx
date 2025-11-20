import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnswersStoreContext, createAnswersStore } from "@/calculator/stores/answers";
import { CalculatorStoreContext, createCalculatorStore } from "@/calculator/stores/calculator";
import type { CandidateViewModel } from "@/calculator/view-models/client";

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
      data: {
        calculator: {
          id: "test",
          key: "test",
          createdAt: "2024-01-01",
          shortTitle: "Test Calculator",
        },
        candidates: [],
        organizations: [],
        persons: [],
        questions: [],
        candidatesAnswers: {},
      },
      baseUrl: "https://data.example.com",
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
