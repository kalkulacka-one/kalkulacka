import { describe, expect, it } from "vitest";

import type { Answers } from "../../../../packages/schema/schemas/answers.schema";
import type { Candidates } from "../../../../packages/schema/schemas/candidates.schema";
import type { CandidatesAnswers } from "../../../../packages/schema/schemas/candidates-answers.schema";
import { calculateMatches } from "./calculate-matches";

describe("Result calculation algorithm", () => {
  // Helpers for answer values, see https://schema.kalkulacka.one/#tag/Answer for details
  const Yes = (important: true | undefined = undefined) => ({ answer: true, isImportant: important });
  const No = (important: true | undefined = undefined) => ({ answer: false, isImportant: important });
  const Neutral = () => ({ answer: null });
  const important = true;

  // Helper for rounded values
  const approx66 = expect.closeTo(66.6, 0.1);

  // Helper function for preparing answers
  const prepareAnswers = (answers: Array<ReturnType<typeof Yes> | ReturnType<typeof No> | ReturnType<typeof Neutral> | undefined>) => {
    return answers
      .map((answer, idx) => {
        if (!answer) {
          return undefined;
        }
        return {
          questionId: (idx + 1).toString(),
          ...answer,
        };
      })
      .filter((answer): answer is NonNullable<typeof answer> => answer !== undefined);
  };

  // Helper function for preparing candidates
  const prepareCandidates = (candidates: Array<string>): Candidates => {
    return candidates.map((id) => ({
      id,
      displayName: `Candidate ${id}`,
      references: [{ type: "person", id }],
    }));
  };

  describe("when user answered Yes, Yes, Yes", () => {
    const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

    describe("and candidate answered Yes, Yes, Yes", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Yes(), Yes()]),
      };

      it("calculates 100 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 100 }]);
      });
    });

    describe("and candidate answered Yes, Yes, No", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Yes(), No()]),
      };

      it("calculates ≈ 66 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: approx66 }]);
      });
    });

    describe("and candidate answered Yes, Neutral, No", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Neutral(), No()]),
      };

      it("calculates 50 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 50 }]);
      });
    });

    describe("and candidate answered No, No, No", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([No(), No(), No()]),
      };

      it("calculates 0 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 0 }]);
      });
    });
  });

  describe("when user answered Yes (important), Yes, Yes", () => {
    const userAnswers: Answers = prepareAnswers([Yes(important), Yes(), Yes()]);

    describe("and candidate answered Yes, Yes, Yes", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Yes(), Yes()]),
      };

      it("calculates 100 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 100 }]);
      });
    });

    describe("and candidate answered Yes, Yes, No", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Yes(), No()]),
      };

      it("calculates 75 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 75 }]);
      });
    });

    describe("and candidate answered No, Yes, Yes", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([No(), Yes(), Yes()]),
      };

      it("calculates 50 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 50 }]);
      });
    });

    describe("and candidate answered Neutral, Yes, Yes", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Neutral(), Yes(), Yes()]),
      };

      it("calculates 75 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 75 }]);
      });
    });
  });

  describe("when user answered Yes, Yes and skipped the third question", () => {
    const userAnswers: Answers = prepareAnswers([Yes(), Yes()]);

    describe("and candidate answered Yes, Yes, No", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Yes(), No()]),
      };

      it("ignores the third question and calculates 100 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 100 }]);
      });
    });
  });

  describe("when user answered No, No, No", () => {
    const userAnswers: Answers = prepareAnswers([No(), No(), No()]);

    describe("and candidate answered No, No, No", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([No(), No(), No()]),
      };
      it("calculates 100 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 100 }]);
      });
    });
  });

  describe("when candidate answered Neutral, Neutral, Neutral", () => {
    const candidates: Candidates = prepareCandidates(["A"]);
    const candidatesAnswers: CandidatesAnswers = {
      A: prepareAnswers([Neutral(), Neutral(), Neutral()]),
    };

    describe("and user answered Yes, Yes, Yes", () => {
      const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

      it("calculates 50 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 50 }]);
      });
    });

    describe("and user answered No, No, No", () => {
      const userAnswers: Answers = prepareAnswers([No(), No(), No()]);

      it("calculates 50 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 50 }]);
      });
    });
  });

  describe("when candidate answered Yes, No and third question is not applicable", () => {
    const candidates: Candidates = prepareCandidates(["A"]);
    const candidatesAnswers: CandidatesAnswers = {
      A: prepareAnswers([Yes(), No()]),
    };

    describe("and user answered Yes, Yes, Yes", () => {
      const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

      it("ignores the third question and calculates 50 % match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: 50 }]);
      });
    });
  });

  describe("when candidate answered only the first question Yes", () => {
    const candidates: Candidates = prepareCandidates(["A"]);
    const candidatesAnswers: CandidatesAnswers = {
      A: prepareAnswers([Yes()]),
    };

    describe("and user answered only the second question Yes", () => {
      const userAnswers: Answers = prepareAnswers([undefined, Yes()]);

      it("doesn't return match as there are no common questions to compare", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: undefined }]);
      });
    });
  });

  describe("when user skipped all questions", () => {
    const userAnswers: Answers = [];

    describe("and candidate answered Yes", () => {
      const candidates: Candidates = prepareCandidates(["A"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes()]),
      };

      it("doesn't return match as it makes no sense to calculate match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: undefined }]);
      });
    });
  });

  describe("when candidate did not answer any question", () => {
    const candidates: Candidates = prepareCandidates(["A"]);
    const candidatesAnswers: CandidatesAnswers = {
      A: [],
    };

    describe("and user answered Yes", () => {
      const userAnswers: Answers = prepareAnswers([Yes()]);

      it("doesn't return match as it makes no sense to calculate match", () => {
        const match = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(match).toMatchObject([{ match: undefined }]);
      });
    });
  });

  describe("when multiple candidates answered differently", () => {
    const candidates: Candidates = prepareCandidates(["A", "B", "C"]);
    const candidatesAnswers: CandidatesAnswers = {
      A: prepareAnswers([Yes(), Yes(), Yes()]),
      B: prepareAnswers([Yes(), Neutral(), No()]),
      C: prepareAnswers([Yes(), Yes(), No()]),
    };

    describe("and user answered Yes, Yes, Yes", () => {
      const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

      it("sorts candidates by match (descending), preserving decimal precision", () => {
        const results = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(results).toEqual([
          { id: "A", match: 100 },
          { id: "C", match: approx66 },
          { id: "B", match: 50 },
        ]);
      });
    });
  });

  describe("when multiple candidates answered the same", () => {
    const candidates: Candidates = prepareCandidates(["A", "B", "C"]);
    const candidatesAnswers: CandidatesAnswers = {
      A: prepareAnswers([Yes(), Yes(), Yes()]),
      B: prepareAnswers([Yes(), Yes(), Yes()]),
      C: prepareAnswers([Yes(), Yes(), Yes()]),
    };

    describe("and user answered Yes, Yes, Yes", () => {
      const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

      it("sorts candidates alphabetically when no sessionId provided", () => {
        const results = calculateMatches(userAnswers, candidates, candidatesAnswers);
        expect(results).toEqual([
          { id: "A", match: 100 },
          { id: "B", match: 100 },
          { id: "C", match: 100 },
        ]);
      });

      it("sorts candidates deterministically based on sessionId", () => {
        const sessionId = "session-abc";
        const results1 = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId);
        const results2 = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId);

        expect(results1).toEqual(results2);

        expect(results1.every((r) => r.match === 100)).toBe(true);

        expect(new Set(results1.map((r) => r.id))).toEqual(new Set(["A", "B", "C"]));
      });

      it("sorts candidates differently with different sessionIds", () => {
        const sessionId1 = "session-def";
        const sessionId2 = "session-ghi";

        const results1 = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId1);
        const results2 = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId2);

        const results1_repeat = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId1);
        const results2_repeat = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId2);

        expect(results1).toEqual(results1_repeat);
        expect(results2).toEqual(results2_repeat);

        expect(new Set(results1.map((r) => r.id))).toEqual(new Set(["A", "B", "C"]));
        expect(new Set(results2.map((r) => r.id))).toEqual(new Set(["A", "B", "C"]));

        const order1 = results1.map((r) => r.id);
        const order2 = results2.map((r) => r.id);
        expect(order1).not.toEqual(order2);
      });

      it("sorts candidates randomly when useRandomTieBreaker is true", () => {
        const results = calculateMatches(userAnswers, candidates, candidatesAnswers, undefined, true);
        expect(new Set(results.map((r) => r.id))).toEqual(new Set(["A", "B", "C"]));
      });
    });

    describe("with mixed match scores and ties", () => {
      const candidates: Candidates = prepareCandidates(["A", "B", "C", "D"]);
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Yes(), Yes()]),
        B: prepareAnswers([Yes(), Yes(), No()]),
        C: prepareAnswers([Yes(), Yes(), No()]),
        D: prepareAnswers([Yes(), No(), No()]),
      };

      const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

      it("applies tie-breaker only to candidates with identical scores", () => {
        const sessionId = "tie-test-session";
        const results = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId);

        expect(results[0]).toEqual({ id: "A", match: 100 });

        expect(results[3]).toEqual({ id: "D", match: expect.closeTo(33.3, 0.1) });

        const middleResults = results.slice(1, 3);
        const middleIds = middleResults.map((r) => r.id).sort();
        expect(middleIds).toEqual(["B", "C"]);
        expect(middleResults.every((r) => expect.closeTo(66.6, 0.1).asymmetricMatch(r.match))).toBe(true);

        const results2 = calculateMatches(userAnswers, candidates, candidatesAnswers, sessionId);
        expect(results).toEqual(results2);
      });
    });
  });

  describe("when there are nested candidates", () => {
    const candidates: Candidates = [
      {
        id: "A",
        displayName: "Top-level candidate A",
        references: [{ type: "organization", id: "A" }],
        nestedCandidates: [
          {
            id: "B",
            displayName: "Nested candidate B",
            references: [{ type: "person", id: "B" }],
          },
          {
            id: "C",
            displayName: "Nested candidate C",
            references: [{ type: "person", id: "C" }],
          },
        ],
      },
    ];

    describe("and top-level candidate didn't answer but nested candidates did (first all Yes, second all No)", () => {
      const candidatesAnswers: CandidatesAnswers = {
        B: prepareAnswers([Yes(), Yes(), Yes()]),
        C: prepareAnswers([No(), No(), No()]),
      };

      describe("and user answered Yes, Yes, Yes", () => {
        const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

        it("aggregates the results from nested candidates to top-level candidate as 50 %", () => {
          const results = calculateMatches(userAnswers, candidates, candidatesAnswers);
          expect(results).toContainEqual({ id: "A", match: 50 });
        });

        it("includes results for nested candidates", () => {
          const results = calculateMatches(userAnswers, candidates, candidatesAnswers);
          expect(results).toContainEqual({ id: "B", match: 100 });
          expect(results).toContainEqual({ id: "C", match: 0 });
        });
      });
    });

    describe("and top-level candidate didn't answer, nested did but unevenly (first Yes and second No, No, No)", () => {
      const candidatesAnswers: CandidatesAnswers = {
        B: prepareAnswers([Yes()]),
        C: prepareAnswers([No(), No(), No()]),
      };

      describe("and user answered Yes, Yes, Yes", () => {
        const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

        it("aggregates the results from nested candidates to top-level candidate as 25 %", () => {
          const results = calculateMatches(userAnswers, candidates, candidatesAnswers);
          expect(results).toContainEqual({ id: "A", match: 25 });
        });
      });
    });

    describe("and both top-level and nested candidates answered", () => {
      const candidatesAnswers: CandidatesAnswers = {
        A: prepareAnswers([Yes(), Yes(), No()]),
        B: prepareAnswers([Yes(), Yes(), Yes()]),
        C: prepareAnswers([No(), No(), No()]),
      };

      describe("and user answered Yes, Yes, Yes", () => {
        const userAnswers: Answers = prepareAnswers([Yes(), Yes(), Yes()]);

        it("uses top-level candidate answers and calculates ≈ 66 % match", () => {
          const results = calculateMatches(userAnswers, candidates, candidatesAnswers);
          expect(results).toContainEqual({ id: "A", match: approx66 });
        });

        it("includes results for nested candidates", () => {
          const results = calculateMatches(userAnswers, candidates, candidatesAnswers);
          expect(results).toContainEqual({ id: "B", match: 100 });
          expect(results).toContainEqual({ id: "C", match: 0 });
        });
      });
    });
  });
});
