import type { CreateCalculatorSessionParams } from "../../session";
import { setRuntimeSessionId } from "../../session/runtime-session";

export async function initializeSession(params: CreateCalculatorSessionParams): Promise<void> {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  if (data.sessionId) {
    setRuntimeSessionId(data.sessionId);
  }
}
