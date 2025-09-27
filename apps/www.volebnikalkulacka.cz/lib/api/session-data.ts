import type { Answer } from "../../../../packages/schema/schemas/answer.schema";

export async function saveSessionData(calculatorId: string, answers: Answer[]): Promise<void> {
  const response = await fetch(`/api/calculators/${calculatorId}/session-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answers }),
  });

  if (!response.ok) {
    throw response;
  }
}

export async function loadSessionData(calculatorId: string): Promise<Answer[]> {
  const response = await fetch(`/api/calculators/${calculatorId}/session-data`);

  if (!response.ok) {
    throw response;
  }

  try {
    const data = await response.json();
    return data.answers || [];
  } catch {
    throw new Error("Failed to parse session data response");
  }
}
