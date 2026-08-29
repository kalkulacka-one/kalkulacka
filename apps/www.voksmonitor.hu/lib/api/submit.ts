import type { Answer } from "../../../../packages/schema/schemas/answer.schema";
import type { calculateMatches } from "../../calculator/lib/result-calculation/calculate-matches";

export type SubmitPayload = {
  calculatorId: string;
  calculatorKey: string;
  calculatorGroup?: string;
  calculatorVersion?: string;
  answers: Answer[];
  matches?: ReturnType<typeof calculateMatches>;
  demography?: {
    gender?: string;
    age?: string;
    residence?: string;
    education?: string;
    wouldVote?: string;
  };
};

/**
 * Submit calculator answers (and optional demography data) anonymously.
 * No session cookie or bearer token is sent — the server cannot link
 * this submission back to the user.
 */
export async function submitAnonymously(payload: SubmitPayload): Promise<void> {
  const response = await fetch("/api/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Explicitly omit credentials — no cookies sent
    credentials: "omit",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Anonymous submission failed: ${response.status}`);
  }
}
