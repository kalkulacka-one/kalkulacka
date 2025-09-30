import type { CreateCalculatorSessionParams } from "../../session";
import { verifySession } from "./verify-session";

export async function initializeSession(params: CreateCalculatorSessionParams): Promise<void> {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw response;
  }

  const verifySessionResponse = await verifySession();

  if (verifySessionResponse) {
    return;
  }
}
