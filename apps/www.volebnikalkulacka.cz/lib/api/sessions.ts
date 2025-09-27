import type { CreateCalculatorSessionParams } from "../session";
import { handleResponseError } from "./handle-response-error";

export async function initializeSession(params: CreateCalculatorSessionParams): Promise<void> {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    await handleResponseError(response, "Session initialization failed");
  }
}
