import type { CreateCalculatorSessionParams } from "../session";

export async function initializeSession(params: CreateCalculatorSessionParams): Promise<void> {
  await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
}
