import { getRuntimeSessionId } from "../../session/runtime-session";

export async function verifySession(): Promise<boolean> {
  const headers: HeadersInit = {};

  const sessionId = getRuntimeSessionId();
  if (sessionId) {
    headers.Authorization = `Bearer ${sessionId}`;
  }

  const response = await fetch("/api/sessions", {
    headers,
    credentials: "include",
  });

  return response.ok;
}
