import type { CreateCalculatorSessionParams } from "../session";

export async function initializeSession(params: CreateCalculatorSessionParams): Promise<void> {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(`Session initialization failed: ${errorData.title || errorData.type || "Unknown error"}`);
    } catch {
      throw new Error(`Session initialization failed: HTTP ${response.status}`);
    }
  }
}
