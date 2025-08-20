import { describe, expect, it } from "vitest";
import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import { type CandidateAnswers, candidateAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { calculateAllMatches } from "./MatchCalculator";

describe("calculateAllMatches", () => {
  const userAnswers: Answer[] = [
    { questionId: "679d787d-258f-4dda-abd8-885b69ab1255", answer: false, isImportant: false },
    { questionId: "7c0edbcc-1d31-44cf-8164-48f2844ba042", answer: false },
    { questionId: "1e4f5504-586d-4246-9a8f-982b909385a4", answer: true },
    { questionId: "e62219f9-4abf-499d-8baa-14c823a1b303", answer: false },
    { questionId: "61ca6304-74f6-465a-9983-f28b8e9b7894", answer: true, isImportant: false },
  ];

  const answersOfCandidates: CandidateAnswers = {
    "71bc21a9-0a74-4614-a406-05ec6a9b6115": [
      {
        questionId: "e62219f9-4abf-499d-8baa-14c823a1b303",
        answer: null,
        respondent: "candidate",
      },
      {
        questionId: "7c0edbcc-1d31-44cf-8164-48f2844ba042",
        answer: true,
        respondent: "candidate",
      },
      {
        questionId: "61ca6304-74f6-465a-9983-f28b8e9b7894",
        answer: true,
        respondent: "candidate",
      },
      {
        questionId: "679d787d-258f-4dda-abd8-885b69ab1255",
        answer: false,
        respondent: "candidate",
      },
      {
        questionId: "1e4f5504-586d-4246-9a8f-982b909385a4",
        answer: true,
        respondent: "candidate",
      },
    ],
    "dae6d23c-a429-4fad-8b43-e6a2d2a29b94": [
      {
        questionId: "e62219f9-4abf-499d-8baa-14c823a1b303",
        answer: null,
        respondent: "candidate",
      },
    ],
    "f02f6f26-dad2-4dcf-b932-2c0159b285a2": [
      {
        questionId: "e62219f9-4abf-499d-8baa-14c823a1b303",
        answer: true,
        respondent: "candidate",
      },
      {
        questionId: "7c0edbcc-1d31-44cf-8164-48f2844ba042",
        answer: true,
        respondent: "candidate",
      },
      {
        questionId: "61ca6304-74f6-465a-9983-f28b8e9b7894",
        answer: true,
        respondent: "candidate",
      },
      {
        questionId: "679d787d-258f-4dda-abd8-885b69ab1255",
        answer: false,
        respondent: "candidate",
      },
      {
        questionId: "1e4f5504-586d-4246-9a8f-982b909385a4",
        answer: true,
        respondent: "candidate",
      },
    ],
  };

  const expectedResult = [
    {
      candidateId: "71bc21a9-0a74-4614-a406-05ec6a9b6115",
      percentage: 75,
    },
    {
      candidateId: "f02f6f26-dad2-4dcf-b932-2c0159b285a2",
      percentage: 60,
    },
    {
      candidateId: "dae6d23c-a429-4fad-8b43-e6a2d2a29b94",
      percentage: 0,
    },
  ];

  it("return an object with candidateId and ", () => {
    expect(calculateAllMatches(userAnswers, answersOfCandidates)).toMatchObject(expectedResult);
  });
});
