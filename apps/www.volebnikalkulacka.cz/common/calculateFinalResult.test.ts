import { describe, expect, it } from "vitest";
import { calculateFinalResult } from "./calculateFinalResult";

const mockUserAnswers = [
  { questionId: "q1", answer: true, isImportant: false },
  { questionId: "q2", answer: false, isImportant: false },
  { questionId: "q3", answer: true, isImportant: true },
];

const mockCandidates = [
  { id: "politician-a", name: "Politician A" },

  { id: "party-x", name: "Party X" },

  {
    id: "party-y",
    name: "Party Y",
    nestedCandidates: [{ id: "politician-b" }, { id: "politician-c" }],
  },

  { id: "politician-b", name: "Politician B" },
  { id: "politician-c", name: "Politician C" },
];

const mockAllCandidatesAnswers = {
  "politician-a": [
    { questionId: "q1", answer: true },
    { questionId: "q2", answer: true },
    { questionId: "q3", answer: true },
  ],
  "party-x": [
    { questionId: "q1", answer: false },
    { questionId: "q2", answer: false },
    { questionId: "q3", answer: false },
  ],
  "politician-b": [
    { questionId: "q1", answer: true },
    { questionId: "q2", answer: false },
    { questionId: "q3", answer: null },
  ],
  "politician-c": [
    { questionId: "q1", answer: false },
    { questionId: "q2", answer: true },
    { questionId: "q3", answer: true },
  ],
};

describe("calculateResult", () => {
  it("should calculate all results and sort them correctly", () => {
    const finalResults = calculateFinalResult(mockUserAnswers, mockCandidates, mockAllCandidatesAnswers);

    expect(finalResults).toHaveLength(5);

    expect(finalResults[0]).toEqual({
      id: "politician-b",
      name: "Politician B",
      percentage: 100,
    });

    expect(finalResults).toEqual([
      { id: "politician-b", name: "Politician B", percentage: 100 },
      { id: "politician-a", name: "Politician A", percentage: 75 },
      {
        id: "party-y",
        name: "Party Y",
        percentage: expect.closeTo(66.67, 2),
        memberResults: [
          { id: "politician-b", name: "Politician B", percentage: 100 },
          { id: "politician-c", name: "Politician C", percentage: 50 },
        ],
      },
      { id: "politician-c", name: "Politician C", percentage: 50 },
      { id: "party-x", name: "Party X", percentage: 25 },
    ]);
  });
});
