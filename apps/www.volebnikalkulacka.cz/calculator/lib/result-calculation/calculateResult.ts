/**
 * Volební kalkulačka - Calculation Algorithm
 * ===========================================
 *
 * This algorithm calculates how well candidates match with the user's answers
 * to political questions. The result is a percentage showing the agreement
 * between the user and each candidate.
 *
 * The algorithm is designed to be fair, transparent, and easy to understand.
 * Every voter deserves to know exactly how their results are calculated.
 */

import type { Answers } from "../../../../../packages/schema/schemas/answers.schema";
import type { Candidate } from "../../../../../packages/schema/schemas/candidate.schema";
import type { Candidates } from "../../../../../packages/schema/schemas/candidates.schema";
import type { CandidatesAnswers } from "../../../../../packages/schema/schemas/candidates-answers.schema";

interface CalculationResult {
  id: string;
  percentage: number | undefined;
}

type RandomNumberGenerator = () => number;

/**
 * Main calculation function
 *
 * @param userAnswers - The answers provided by the user
 * @param candidates - The list of all candidates
 * @param candidatesAnswers - Object with candidate IDs as keys and their answers as values
 * @param rng - Optional random number generator for deterministic results (defaults to Math.random)
 * @returns Results sorted by match percentage (highest first)
 */
export function calculateResult(userAnswers: Answers, candidates: Candidates, candidatesAnswers: CandidatesAnswers, rng: RandomNumberGenerator = Math.random): CalculationResult[] {
  // First, we calculate the match percentage for each candidate
  const results: CalculationResult[] = [];

  // Process each candidate (both top-level and nested ones)
  for (const candidate of candidates) {
    // Calculate match for the main candidate
    const candidateResult = calculateCandidateMatch(candidate.id, userAnswers, candidatesAnswers[candidate.id] || []);

    // If the candidate has their own answers, use them
    const candidateOwnAnswers = candidatesAnswers[candidate.id];
    if (candidateOwnAnswers && candidateOwnAnswers.length > 0) {
      results.push({
        id: candidate.id,
        percentage: candidateResult,
      });
    }
    // If the candidate doesn't have answers but has nested candidates, aggregate their results
    else if (candidate.nestedCandidates && candidate.nestedCandidates.length > 0) {
      const aggregatedResult = calculateAggregatedMatch(candidate.nestedCandidates, userAnswers, candidatesAnswers);

      results.push({
        id: candidate.id,
        percentage: aggregatedResult,
      });
    }
    // If no answers at all, percentage is undefined
    else {
      results.push({
        id: candidate.id,
        percentage: undefined,
      });
    }

    // Also calculate results for any nested candidates independently
    if (candidate.nestedCandidates) {
      for (const nestedCandidate of candidate.nestedCandidates) {
        const nestedResult = calculateCandidateMatch(nestedCandidate.id, userAnswers, candidatesAnswers[nestedCandidate.id] || []);

        results.push({
          id: nestedCandidate.id,
          percentage: nestedResult,
        });
      }
    }
  }

  // Sort results by percentage (highest first)
  // Candidates with the same percentage are shuffled randomly to avoid bias
  return sortResultsWithRandomTieBreaker(results, rng);
}

/**
 * Calculate match between user and a single candidate
 *
 * The algorithm works as follows:
 * 1. We only compare questions that both the user and candidate answered
 * 2. Each question can have a weight of 1 (normal) or 2 (important to user)
 * 3. For each matching answer, the candidate gets points equal to the question's weight
 * 4. The final percentage is: (points earned / maximum possible points) × 100
 *
 * @param candidateId - The candidate's unique identifier
 * @param userAnswers - User's answers to questions
 * @param candidateAnswers - Candidate's answers to questions
 * @returns Match percentage (0-100) or undefined if no comparison possible
 */
function calculateCandidateMatch(_candidateId: string, userAnswers: Answers, candidateAnswers: Answers): number | undefined {
  // If either party hasn't answered any questions, we can't calculate a match
  if (!userAnswers || userAnswers.length === 0 || !candidateAnswers || candidateAnswers.length === 0) {
    return undefined;
  }

  // Create lookup maps for quick access to answers by question ID
  const userAnswerMap = new Map<string, (typeof userAnswers)[0]>();
  for (const answer of userAnswers) {
    userAnswerMap.set(answer.questionId, answer);
  }

  const candidateAnswerMap = new Map<string, (typeof candidateAnswers)[0]>();
  for (const answer of candidateAnswers) {
    candidateAnswerMap.set(answer.questionId, answer);
  }

  // Now we calculate the match
  let totalPoints = 0; // Points the candidate earned
  let maxPossiblePoints = 0; // Maximum points they could have earned

  // We only compare questions that both the user and candidate answered
  for (const [questionId, userAnswer] of userAnswerMap) {
    const candidateAnswer = candidateAnswerMap.get(questionId);

    // Skip if candidate didn't answer this question
    if (!candidateAnswer) {
      continue;
    }

    // Determine the weight of this question
    // Important questions (marked by the user) count double
    const questionWeight = userAnswer.isImportant === true ? 2 : 1;

    // Add to maximum possible points
    maxPossiblePoints += questionWeight;

    // Now calculate points for this question
    const pointsEarned = calculatePointsForAnswer(userAnswer.answer, candidateAnswer.answer, questionWeight);

    totalPoints += pointsEarned;
  }

  // If there were no common questions to compare, return undefined
  if (maxPossiblePoints === 0) {
    return undefined;
  }

  // Calculate the final percentage
  const percentage = (totalPoints / maxPossiblePoints) * 100;

  return percentage;
}

/**
 * Calculate points for a single answer comparison
 *
 * The scoring system:
 * - Full agreement (Yes-Yes or No-No): Full points
 * - Complete disagreement (Yes-No or No-Yes): 0 points
 * - Partial agreement (any answer vs Neutral): Half points
 *
 * @param userAnswer - User's answer (true/false/null/undefined)
 * @param candidateAnswer - Candidate's answer (true/false/null/undefined)
 * @param weight - Weight of the question (1 or 2)
 * @returns Points earned for this answer
 */
function calculatePointsForAnswer(userAnswer: boolean | null | undefined, candidateAnswer: boolean | null | undefined, weight: number): number {
  // If the candidate answered "neutral" (null), they get half points regardless
  // This represents a candidate who doesn't take a strong position
  if (candidateAnswer === null) {
    return weight * 0.5;
  }

  // If answers match exactly (both Yes or both No), full points
  if (userAnswer === candidateAnswer) {
    return weight * 1.0;
  }

  // If answers are opposite (Yes vs No), no points
  // This happens when userAnswer !== candidateAnswer and neither is null
  return 0;
}

/**
 * Calculate aggregated match for a candidate based on their nested candidates
 *
 * This is used when a top-level candidate (like a political party) doesn't have
 * their own answers, but their members (nested candidates) do have answers.
 *
 * The algorithm:
 * 1. Calculate match percentage for each nested candidate
 * 2. Weight each percentage by how many questions they answered
 * 3. Return the weighted average
 *
 * @param nestedCandidates - List of nested candidates
 * @param userAnswers - User's answers
 * @param candidatesAnswers - All candidates' answers
 * @returns Weighted average match percentage
 */
function calculateAggregatedMatch(nestedCandidates: Candidate[], userAnswers: Answers, candidatesAnswers: CandidatesAnswers): number | undefined {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // Calculate match for each nested candidate
  for (const nestedCandidate of nestedCandidates) {
    const nestedAnswers = candidatesAnswers[nestedCandidate.id] || [];

    // Skip if this nested candidate has no answers
    if (nestedAnswers.length === 0) {
      continue;
    }

    // Calculate how many questions this candidate answered that the user also answered
    const commonQuestions = countCommonQuestions(userAnswers, nestedAnswers);

    // Skip if there are no common questions
    if (commonQuestions === 0) {
      continue;
    }

    // Calculate the match percentage
    const matchPercentage = calculateCandidateMatch(nestedCandidate.id, userAnswers, nestedAnswers);

    // If we got a valid percentage, add it to our weighted average
    if (matchPercentage !== undefined) {
      totalWeightedScore += matchPercentage * commonQuestions;
      totalWeight += commonQuestions;
    }
  }

  // If no nested candidates had answers, return undefined
  if (totalWeight === 0) {
    return undefined;
  }

  // Return the weighted average
  return totalWeightedScore / totalWeight;
}

/**
 * Count how many questions both the user and candidate answered
 *
 * @param userAnswers - User's answers
 * @param candidateAnswers - Candidate's answers
 * @returns Number of common questions
 */
function countCommonQuestions(userAnswers: Answers, candidateAnswers: Answers): number {
  const userQuestions = new Set(userAnswers.map((a) => a.questionId));
  const candidateQuestions = new Set(candidateAnswers.map((a) => a.questionId));

  let commonCount = 0;
  for (const questionId of userQuestions) {
    if (candidateQuestions.has(questionId)) {
      commonCount++;
    }
  }

  return commonCount;
}

/**
 * Sort results by percentage, with random ordering for ties
 *
 * This ensures fairness - candidates with the same score won't always
 * appear in the same order, preventing any systematic bias.
 *
 * @param results - Array of results with id and percentage
 * @param rng - Random number generator function (defaults to Math.random)
 * @returns Sorted results
 */
function sortResultsWithRandomTieBreaker(results: CalculationResult[], rng: RandomNumberGenerator = Math.random): CalculationResult[] {
  // First, add a random tiebreaker value to each result
  const resultsWithTieBreaker = results.map((result) => ({
    ...result,
    tieBreaker: rng(),
  }));

  // Sort by percentage (descending), then by random tiebreaker
  resultsWithTieBreaker.sort((a, b) => {
    // Handle undefined percentages (put them at the end)
    if (a.percentage === undefined && b.percentage === undefined) {
      return a.tieBreaker - b.tieBreaker;
    }
    if (a.percentage === undefined) return 1;
    if (b.percentage === undefined) return -1;

    // Sort by percentage (higher first)
    if (a.percentage !== b.percentage) {
      return b.percentage - a.percentage;
    }

    // For ties, use random tiebreaker
    return a.tieBreaker - b.tieBreaker;
  });

  // Remove the tiebreaker field before returning
  return resultsWithTieBreaker.map(({ tieBreaker, ...result }) => result);
}

/**
 * Creates a seeded random number generator for reproducible results
 *
 * Uses a simple Linear Congruential Generator (LCG) algorithm
 * which is sufficient for tie-breaking purposes.
 *
 * @param seed - The seed value for reproducible randomness
 * @returns A random number generator function
 */
export function createSeededRNG(seed: number): RandomNumberGenerator {
  let state = seed;

  return () => {
    // LCG parameters from Numerical Recipes
    state = (state * 1664525 + 1013904223) >>> 0; // Keep it 32-bit unsigned
    return state / 0x100000000; // Convert to 0-1 range
  };
}

/**
 * Summary of the Algorithm
 * ========================
 *
 * This algorithm ensures fair and transparent matching between voters and candidates:
 *
 * 1. TRANSPARENCY: Every step is clearly documented and understandable
 * 2. FAIRNESS: Only questions answered by both parties are compared
 * 3. FLEXIBILITY: Supports important questions (double weight) and neutral answers
 * 4. AGGREGATION: Can combine results from multiple candidates (e.g., party members)
 * 5. RANDOMNESS: Ties are broken randomly to avoid systematic bias
 * 6. REPRODUCIBILITY: Optional seeded RNG for deterministic results when needed
 *
 * The result is a percentage from 0% (complete disagreement) to 100% (complete agreement),
 * helping voters make informed decisions based on policy alignment rather than personality.
 *
 * Usage Examples:
 *
 * // Random results (default)
 * const results = calculateResult(userAnswers, candidates, candidatesAnswers);
 *
 * // Deterministic results with seed
 * const rng = createSeededRNG(12345);
 * const results = calculateResult(userAnswers, candidates, candidatesAnswers, rng);
 */
