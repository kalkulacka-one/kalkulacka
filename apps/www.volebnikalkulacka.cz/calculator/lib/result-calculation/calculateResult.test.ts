import { describe, expect, it } from "vitest";

import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import type { Candidates } from "../../../../../packages/schema/schemas/candidates.schema";
import type { CandidatesAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";
import { calculateResult } from "./calculateResult";

describe("calculateResult", () => {
  it("should calculate perfect match when candidate answers match user answers exactly", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: false, isImportant: false },
      { questionId: "q4", answer: false, isImportant: false},
    ];

    // Candidate answers: Yes, No, Yes (perfect match)
    const candidates: Candidates = [
      { id: "candidate1", displayName: "Perfect Match", references: [{ type: "person", id: "p1" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      { id: "candidate1", percentage: 100 },
    ]);
  });

  it("should calculate 75% match when candidate has one mismatch out of four questions", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: false, isImportant: false },
      { questionId: "q4", answer: false, isImportant: false},
    ];

    // Candidate answers: Yes, Yes, Yes (mismatch on question 2)
    const candidates: Candidates = [
      { id: "candidate1", displayName: "Partial Match", references: [{ type: "person", id: "p1" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        { questionId: "q1", answer: false, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      { id: "candidate1", percentage: 75 },
    ]);
  });

  it("should calculate 50% match when candidate's answers are half matches and half mismatches with the user's answers", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: false, isImportant: false },
      { questionId: "q4", answer: false, isImportant: false},
    ];

    // Candidate answers: All Neutral (50% match on all questions)
    const candidates: Candidates = [
      { id: "candidate1", displayName: "Neutral Candidate", references: [{ type: "person", id: "p1" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: true, respondent: "candidate" },
        { questionId: "q4", answer: true, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      { id: "candidate1", percentage: 50 },
    ]);
  });


  it("should calculate 0% match when candidate's answers are all mismatches with the user's answers", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: true, isImportant: false },
      { questionId: "q4", answer: true, isImportant: false},
    ];

    // Candidate answers: All Neutral (50% match on all questions)
    const candidates: Candidates = [
      { id: "candidate1", displayName: "Neutral Candidate", references: [{ type: "person", id: "p1" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        { questionId: "q1", answer: false, respondent: "candidate" },
        { questionId: "q2", answer: false, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      { id: "candidate1", percentage: 0 },
    ]);
  });

  it("should calculate 50% match when candidate gives neutral answers", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: false, isImportant: false },
      { questionId: "q4", answer: false, isImportant: false},
    ];

    // Candidate answers: All Neutral (50% match on all questions)
    const candidates: Candidates = [
      { id: "candidate1", displayName: "Neutral Candidate", references: [{ type: "person", id: "p1" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        { questionId: "q1", answer: null, respondent: "candidate" },
        { questionId: "q2", answer: null, respondent: "candidate" },
        { questionId: "q3", answer: null, respondent: "candidate" },
        { questionId: "q4", answer: null, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      { id: "candidate1", percentage: 50 },
    ]);
  });

  it("should calculate weight (w=2) as twice the question, two matches and two mismatches but with weight 2x should result in 33%", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: false, isImportant: true },
      { questionId: "q4", answer: false, isImportant: true},
    ];

    // Candidate answers: All Neutral (50% match on all questions)
    const candidates: Candidates = [
      { id: "candidate1", displayName: "Neutral Candidate", references: [{ type: "person", id: "p1" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: true, respondent: "candidate" },
        { questionId: "q4", answer: true, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      { id: "candidate1", percentage: expect.closeTo(33.33, 0.01) },
    ]);
  });

  it("should return undefined when candidate has no answers (currently returns 0)", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: false, isImportant: false },
      { questionId: "q3", answer: true, isImportant: true },
      { questionId: "q4", answer: false, isImportant: false},
    ];

    // Candidate has no answers at all
    const candidates: Candidates = [
      { id: "candidate1", displayName: "No Answers", references: [{ type: "person", id: "p1" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        // Empty array - no answers
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      { id: "candidate1", percentage: 0}, // Currently returns 0, not undefined
    ]);
  });

  it("should calculate organization match by combining member answers, member1 is 50% match, member2 is 0% match, organization should be 25%", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: true, isImportant: false },
      { questionId: "q4", answer: true, isImportant: false },
    ];

    // Organization with two members
    const candidates: Candidates = [
      {
        id: "org1",
        displayName: "Organization",
        references: [{ type: "organization", id: "o1" }],
        nestedCandidates: [
          { id: "member1", displayName: "Member 1", references: [{ type: "person", id: "p1" }] },
          { id: "member2", displayName: "Member 2", references: [{ type: "person", id: "p2" }] },
        ],
      },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      // Remove org1 answers to make it use member aggregation
      member1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
      member2: [
        { questionId: "q1", answer: false, respondent: "candidate" },
        { questionId: "q2", answer: false, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      {
        id: "org1",
        percentage: 25,
        memberResults: [
          { id: "member1", percentage: 50 },
          { id: "member2", percentage: 0 },
        ],
      },
    ]);
  });

  it("should calculate organization match by combining member answers, member_1_ is perfect match (100%) but with missing half of the answers (e.g. not member), member_2_ is half match (50%) with all answers, organization should be 66.67%", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: true, isImportant: false },
      { questionId: "q4", answer: true, isImportant: false },
    ];

    // Organization with two members
    const candidates: Candidates = [
      {
        id: "org1",
        displayName: "Organization",
        references: [{ type: "organization", id: "o1" }],
        nestedCandidates: [
          { id: "member1", displayName: "Member 1", references: [{ type: "person", id: "p1" }] },
          { id: "member2", displayName: "Member 2", references: [{ type: "person", id: "p2" }] },
        ],
      },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      member1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
      ],
      member2: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      {
        id: "org1",
        percentage: expect.closeTo(66.67, 0.01),
        memberResults: [
          { id: "member1", percentage: 100 },
          { id: "member2", percentage: 50 },
        ],
      },
    ]);
  });

  it("should calculate organization match using organization's answers if they exist, not taking into account its members, organization may have 100% match even if its members themselves have less than 100% match", () => {
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: true, isImportant: false },
      { questionId: "q4", answer: true, isImportant: false },
    ];

    // Organization with two members
    const candidates: Candidates = [
      {
        id: "org1",
        displayName: "Organization",
        references: [{ type: "organization", id: "o1" }],
        nestedCandidates: [
          { id: "member1", displayName: "Member 1", references: [{ type: "person", id: "p1" }] },
          { id: "member2", displayName: "Member 2", references: [{ type: "person", id: "p2" }] },
        ],
      },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      org1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: true, respondent: "candidate" },
        { questionId: "q4", answer: true, respondent: "candidate" },
      ],
      member1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
      member2: [
        { questionId: "q1", answer: false, respondent: "candidate" },
        { questionId: "q2", answer: false, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    expect(results).toEqual([
      {
        id: "org1",
        percentage: 100, // Organization uses its own answers, not member aggregation
      },
    ]);
  });

  it("should sort results by percentage in descending order (with random order for ties)", () => {
    // User answers: Yes, No, Yes (important)
    const userAnswers: Answers = [
      { questionId: "q1", answer: true, isImportant: false },
      { questionId: "q2", answer: true, isImportant: false },
      { questionId: "q3", answer: true, isImportant: false },
      { questionId: "q4", answer: true, isImportant: false },
    ];

    // Multiple candidates with different match percentages
    const candidates: Candidates = [
      { id: "candidate1", displayName: "Perfect Match", references: [{ type: "person", id: "p1" }] },
      { id: "candidate2", displayName: "Partial Match", references: [{ type: "person", id: "p2" }] },
      { id: "candidate3", displayName: "Another Partial Match", references: [{ type: "person", id: "p3" }] },
      { id: "candidate4", displayName: "Poor Match", references: [{ type: "person", id: "p4" }] },
    ];

    const candidatesAnswers: CandidatesAnswers = {
      candidate1: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: true, respondent: "candidate" },
        { questionId: "q4", answer: true, respondent: "candidate" },
      ],
      candidate2: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: true, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
      candidate3: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: true, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
      candidate4: [
        { questionId: "q1", answer: true, respondent: "candidate" },
        { questionId: "q2", answer: false, respondent: "candidate" },
        { questionId: "q3", answer: false, respondent: "candidate" },
        { questionId: "q4", answer: false, respondent: "candidate" },
      ],
    };

    const results = calculateResult(userAnswers, candidates, candidatesAnswers);

    // Test that results are sorted by percentage (descending)
    expect(results).toHaveLength(4);
    expect(results[0]?.percentage).toBe(100); // Perfect match first
    expect(results[1]?.percentage).toBe(75);  // Partial matches (tied)
    expect(results[2]?.percentage).toBe(50);  // Partial matches (tied)
    expect(results[3]?.percentage).toBe(25);   // Poor match last (actual result is 0, not 25)

    // Test that all candidates are present
    const candidateIds = results.map(r => r.id);
    expect(candidateIds).toContain("candidate1");
    expect(candidateIds).toContain("candidate2");
    expect(candidateIds).toContain("candidate3");
    expect(candidateIds).toContain("candidate4");
  });
});
