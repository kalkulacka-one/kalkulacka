import { setRuntimeSessionId } from "@/lib/session/client";
import type { CreateCalculatorSessionParams } from "@/lib/session/server";

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

  const verifySessionResponse = await verifySession();

  if (verifySessionResponse) {
    return;
  }

  const data = await response.json();
  if (data.sessionId) {
    setRuntimeSessionId(data.sessionId);
  }
}
