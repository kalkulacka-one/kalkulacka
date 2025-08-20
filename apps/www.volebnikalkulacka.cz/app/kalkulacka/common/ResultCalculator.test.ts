import { describe, expect, it } from "vitest";
import type { Answer } from "../../../../../packages/schema/schemas/answer.schema";
import type { CandidateAnswer, CandidateAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { calculateAllMatches } from "./MatchCalculator";
import { aggregateMatchScore, booleanToNumericAnswer, calculateBaseScore, calculateMatchScorePercentage, processAnswer } from "./ResultCalculator";

describe("booleanToNumericAnswer", () => {
  it("should render 1 when answer is true", () => {
    expect(booleanToNumericAnswer(true)).toBe(1);
  });
  it("should render -1 when answer is false", () => {
    expect(booleanToNumericAnswer(false)).toBe(-1);
  });
  it("should render 0 when answer is null", () => {
    expect(booleanToNumericAnswer(null)).toBe(0);
  });
});

describe("calcAnswerMatch", () => {
  it("should render 1 when there is a match", () => {
    expect(calculateBaseScore(1, 1)).toBe(1);
  });
  it("should render -1 when there is a mismatch", () => {
    expect(calculateBaseScore(1, -1)).toBe(-1);
  });
  it("should render -1 when there is a mismatch", () => {
    expect(calculateBaseScore(-1, 1)).toBe(-1);
  });
  it("should render 0 when one of the parties skips answer", () => {
    expect(calculateBaseScore(0, 0)).toBe(0);
  });
  it("should render 0 when one of the parties skips answer", () => {
    expect(calculateBaseScore(1, 0)).toBe(0);
  });
  it("should render 0 when one of the parties skips answer", () => {
    expect(calculateBaseScore(0, -1)).toBe(0);
  });
});

describe("processAnswer", () => {
  it("should render score 1 and weight 1 and correct questionId", () => {
    const userAnswer = { questionId: "1", answer: false, isImportant: false };
    const candidateAnswer: CandidateAnswer = { questionId: "1", answer: false, respondent: "candidate" };
    expect(processAnswer(userAnswer, candidateAnswer)).toEqual({ questionId: "1", score: 1, weight: 1 });
  });
  it("should render score -1 and weight 1 and correct questionId", () => {
    const userAnswer = { questionId: "1", answer: true, isImportant: false };
    const candidateAnswer: CandidateAnswer = { questionId: "1", answer: false, respondent: "candidate" };
    expect(processAnswer(userAnswer, candidateAnswer)).toEqual({ questionId: "1", score: -1, weight: 1 });
  });
  it("should render score -1 and weight 2 and correct questionId", () => {
    const userAnswer = { questionId: "1", answer: true, isImportant: true };
    const candidateAnswer: CandidateAnswer = { questionId: "1", answer: false, respondent: "candidate" };
    expect(processAnswer(userAnswer, candidateAnswer)).toEqual({ questionId: "1", score: -2, weight: 2 });
  });
});

describe("aggregateMatchScore", () => {
  const userAnswers: Answer[] = [
    { questionId: "1", answer: true, isImportant: true },
    { questionId: "2", answer: false },
    { questionId: "3", answer: null },
    { questionId: "4", answer: null },
  ];

  const allCandidateAnswers: CandidateAnswers = {
    "uuid-of-candidate-A": [
      { questionId: "1", respondent: "candidate", answer: true },
      { questionId: "2", respondent: "candidate", answer: true },
      { questionId: "3", respondent: "candidate", answer: true },
      { questionId: "4", respondent: "candidate", answer: true },
    ],
  };

  const candidateAnswer = allCandidateAnswers["uuid-of-candidate-A"];

  if (!candidateAnswer) {
    throw new Error("Test setup error: Candidate 'uuid-of-candidate-A' not found.");
  }

  it("should calculate the aggregate score correctly", () => {
    const result = aggregateMatchScore(userAnswers, candidateAnswer);
    expect(result.score).toBe(1);
    expect(result.weight).toBe(3);
  });
});

describe("calculateMatchScorePercentage", () => {
  it("calculates the percentage of the fraction", () => {
    const totalScore = { score: 1, weight: 1 };
    expect(calculateMatchScorePercentage(totalScore)).toBe(100);
  });
  it("calculates the percentage of the fraction", () => {
    const totalScore = { score: 1, weight: 2 };
    expect(calculateMatchScorePercentage(totalScore)).toBe(75);
  });
});

describe("calculateAllMatches", () => {
  const userAnswers: Answer[] = [
    { questionId: "1", answer: true, isImportant: false },
    { questionId: "2", answer: true },
  ];

  const allCandidatesAnswers: CandidateAnswers = {
    "uuid-of-candidate-A": [
      { questionId: "1", respondent: "candidate", answer: true },
      { questionId: "2", respondent: "candidate", answer: true },
    ],
    "uuid-of-candidate-B": [
      { questionId: "1", respondent: "candidate", answer: false },
      { questionId: "2", respondent: "candidate", answer: false },
    ],
  };

  const expectedResult = [
    {
      candidateId: "uuid-of-candidate-A",
      percentage: 100,
    },
    {
      candidateId: "uuid-of-candidate-B",
      percentage: 0,
    },
  ];

  it("return an object with candidateId and ", () => {
    expect(calculateAllMatches(userAnswers, allCandidatesAnswers)).toMatchObject(expectedResult);
  });
});
