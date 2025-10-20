import type { CreateCalculatorSessionParams } from "../../session";
import { setRuntimeSessionId } from "../../session/runtime-session";
import { verifySession } from "./verify-session";

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

  const isSessionVerified = await verifySession();

  if (isSessionVerified) {
    const sessionResponse = await fetch("/api/sessions", {
      credentials: "include",
    });

    if (sessionResponse.ok) {
      try {
        const sessionData = await sessionResponse.json();
        if (sessionData.sessionId) {
          setRuntimeSessionId(sessionData.sessionId);
        }
      } catch {
        // If we can't get sessionId, continue without it
      }
    }
    return;
  }

  const data = await response.json();
  if (data.sessionId) {
    setRuntimeSessionId(data.sessionId);
  }
}
