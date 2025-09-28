import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { calculateMatches } from "../../calculator/lib/result-calculation/calculate-matches";

export async function saveSessionData(calculatorId: string, answers: Answer[], matches?: ReturnType<typeof calculateMatches>): Promise<void> {
  const response = await fetch(`/api/calculators/${calculatorId}/session-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers, matches }),
  });

  if (!response.ok) {
    throw response;
  }
}

export async function loadSessionData(calculatorId: string): Promise<{ answers: Answer[]; matches?: ReturnType<typeof calculateMatches> }> {
  const response = await fetch(`/api/calculators/${calculatorId}/session-data`);

  if (!response.ok) {
    throw response;
  }

  try {
    const data = await response.json();
    return {
      answers: data.answers,
      matches: data.matches,
    };
  } catch {
    throw new Error("Failed to parse session data response");
  }
}
