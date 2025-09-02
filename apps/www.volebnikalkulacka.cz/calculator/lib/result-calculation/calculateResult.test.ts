import { describe, expect, it } from "vitest";

import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import type { Candidates } from "../../../../../packages/schema/schemas/candidates.schema";
import type { CandidatesAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { calculateResult } from "./calculateResult";

const mockUserAnswers: Answers = [
  { questionId: "00000000-0000-0000-0000-000000000001", answer: true, isImportant: false },
  { questionId: "00000000-0000-0000-0000-000000000002", answer: false, isImportant: false },
  { questionId: "00000000-0000-0000-0000-000000000003", answer: true, isImportant: true },
];

// In a real scenario, these IDs would come from files like `persons.json` and `organizations.json`.
// The important part is that a candidate's ID is distinct from the ID of the person or organization it refers to.
const person_a_id = "p0000000-0000-0000-0000-00000000000a";
const person_b_id = "p0000000-0000-0000-0000-00000000000b";
const person_c_id = "p0000000-0000-0000-0000-00000000000c";
const organization_x_id = "o0000000-0000-0000-0000-00000000000x";
const organization_y_id = "o0000000-0000-0000-0000-00000000000y";

const mockCandidates: Candidates = [
  // Candidate 'a' is a person. The candidate ID ('a00...') is different from the person ID ('p00...').
  {
    id: "a0000000-0000-0000-0000-00000000000a",
    displayName: "Candidate A",
    references: [{ type: "person", id: person_a_id }],
  },
  // Candidate 'x' is an organization.
  {
    id: "x0000000-0000-0000-0000-00000000000x",
    displayName: "Candidate X",
    references: [{ type: "organization", id: organization_x_id }],
  },
  // Candidate 'y' is an organization/coalition that has nested candidates (persons 'b' and 'c').
  {
    id: "y0000000-0000-0000-0000-00000000000y",
    displayName: "Candidate Y",
    references: [{ type: "organization", id: organization_y_id }],
    nestedCandidates: [
      {
        id: "b0000000-0000-0000-0000-00000000000b",
        displayName: "Candidate B",
        references: [{ type: "person", id: person_b_id }],
      },
      {
        id: "c0000000-0000-0000-0000-00000000000c",
        displayName: "Candidate C",
        references: [{ type: "person", id: person_c_id }],
      },
    ],
  },
  // Candidates 'b' and 'c' are also available as standalone candidates for individual scoring.
  {
    id: "b0000000-0000-0000-0000-00000000000b",
    displayName: "Candidate B",
    references: [{ type: "person", id: person_b_id }],
  },
  {
    id: "c0000000-0000-0000-0000-00000000000c",
    displayName: "Candidate C",
    references: [{ type: "person", id: person_c_id }],
  },
];

// The keys in this object are the *candidate IDs* from `mockCandidates`.
// This structure maps each candidate to their answers for the questions.
const mockAllCandidatesAnswers: CandidatesAnswers = {
  "a0000000-0000-0000-0000-00000000000a": [
    { questionId: "00000000-0000-0000-0000-000000000001", answer: true, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000002", answer: true, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000003", answer: true, respondent: "candidate" },
  ],
  "x0000000-0000-0000-0000-00000000000x": [
    { questionId: "00000000-0000-0000-0000-000000000001", answer: false, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000002", answer: false, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000003", answer: false, respondent: "candidate" },
  ],
  "b0000000-0000-0000-0000-00000000000b": [
    { questionId: "00000000-0000-0000-0000-000000000001", answer: true, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000002", answer: false, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000003", answer: null, respondent: "candidate" },
  ],
  "c0000000-0000-0000-0000-00000000000c": [
    { questionId: "00000000-0000-0000-0000-000000000001", answer: false, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000002", answer: true, respondent: "candidate" },
    { questionId: "00000000-0000-0000-0000-000000000003", answer: true, respondent: "candidate" },
  ],
};

describe("calculateResult", () => {
  it("should calculate all results and sort them correctly", () => {
    const finalResults = calculateResult(mockUserAnswers, mockCandidates, mockAllCandidatesAnswers);

    expect(finalResults).toHaveLength(5);

    expect(finalResults[0]).toEqual({
      id: "b0000000-0000-0000-0000-00000000000b",
      percentage: 100,
    });

    expect(finalResults).toEqual([
      { id: "b0000000-0000-0000-0000-00000000000b", percentage: 100 },
      { id: "a0000000-0000-0000-0000-00000000000a", percentage: 75 },
      {
        id: "y0000000-0000-0000-0000-00000000000y",
        percentage: expect.closeTo(66.67, 2),
        memberResults: [
          { id: "b0000000-0000-0000-0000-00000000000b", percentage: 100 },
          { id: "c0000000-0000-0000-0000-00000000000c", percentage: 50 },
        ],
      },
      { id: "c0000000-0000-0000-0000-00000000000c", percentage: 50 },
      { id: "x0000000-0000-0000-0000-00000000000x", percentage: 25 },
    ]);
  });
});
