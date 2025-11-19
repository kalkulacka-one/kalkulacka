import { getRuntimeSessionId } from "@/lib/session";

export async function shareSession(calculatorId: string): Promise<{ publicId: string }> {
  const headers: HeadersInit = {};

  const sessionId = getRuntimeSessionId();
  if (sessionId) {
    headers.Authorization = `Bearer ${sessionId}`;
  }

  const response = await fetch(`/api/calculators/${calculatorId}/sessions:share`, {
    method: "POST",
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  return data;
}
