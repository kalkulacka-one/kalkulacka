import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AnswersStoreContext, createAnswersStore } from "@/client/stores/answers";
import { CalculatorStoreContext, createCalculatorStore } from "@/client/stores/calculator";
import { LocaleProvider } from "@/components/providers";
import { enMessages } from "@/locales";
import type { CandidateViewModel } from "@/view-models";

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
      key: "calculator",
      baseUrl: "https://data.example.com",
    };

    const calculatorStore = createCalculatorStore(mockCalculatorData);
    const answersStore = createAnswersStore();

    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <CalculatorStoreContext.Provider value={calculatorStore}>
          <AnswersStoreContext.Provider value={answersStore}>
            <MatchCard {...props} />
          </AnswersStoreContext.Provider>
        </CalculatorStoreContext.Provider>
      </LocaleProvider>,
    );

    expect(screen.getByText("1.")).toBeInTheDocument();
    expect(screen.getByText(mockCandidate.displayName ?? "")).toBeInTheDocument();
    expect(screen.getByText("85 %")).toBeInTheDocument();
    // No logo: falls back to initials computed from the display name.
    expect(screen.getByText("OD")).toBeInTheDocument();
  });

  it("renders the answer comparison once expanded", async () => {
    const questionId = "11111111-1111-1111-1111-111111111111";

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
        questions: [
          {
            id: questionId,
            title: "Referendum",
            statement: "Občané mají mít právo iniciovat celostátní referendum.",
          },
        ],
        candidatesAnswers: {
          [mockCandidate.id]: [
            {
              questionId,
              answer: false,
              comment: "Zavedení by bylo příliš nákladné.",
            },
          ],
        },
      },
      key: "calculator",
      baseUrl: "https://data.example.com",
    };

    const calculatorStore = createCalculatorStore(mockCalculatorData);
    const answersStore = createAnswersStore();
    answersStore.getState().setAnswer({ questionId, answer: true });

    const user = userEvent.setup();

    render(
      <LocaleProvider locale="en" messages={enMessages}>
        <CalculatorStoreContext.Provider value={calculatorStore}>
          <AnswersStoreContext.Provider value={answersStore}>
            <MatchCard {...props} />
          </AnswersStoreContext.Provider>
        </CalculatorStoreContext.Provider>
      </LocaleProvider>,
    );

    await user.click(screen.getByRole("button", { expanded: false }));

    // The combined column header, shown once as a single unclipped line.
    expect(screen.getByText("Me • Candidate")).toBeInTheDocument();
    expect(screen.getByText("Občané mají mít právo iniciovat celostátní referendum.")).toBeInTheDocument();
    // No middle-dot pill anymore — the two positions are two separate marks.
    expect(screen.queryByText("•", { exact: true })).not.toBeInTheDocument();
    expect(screen.getByText(/Zavedení by bylo příliš nákladné/)).toBeInTheDocument();
  });
});
