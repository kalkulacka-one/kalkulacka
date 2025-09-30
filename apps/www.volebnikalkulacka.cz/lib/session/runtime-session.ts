import { buildCookieName } from "./cookie/cookie-name";

let sessionId: string | undefined;

export function getRuntimeSessionId(): string | undefined {
  if (sessionId) return sessionId;

  const storageKey = buildCookieName();
  sessionId = sessionStorage.getItem(storageKey) || undefined;

  return sessionId;
}

export function setRuntimeSessionId(id: string): void {
  sessionId = id;

  const storageKey = buildCookieName();
  sessionStorage.setItem(storageKey, id);
}
