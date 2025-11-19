import { buildCookieName } from "./cookie/cookie-name";

let sessionId: string | undefined;

export function getRuntimeSessionId(): string | undefined {
  if (sessionId) return sessionId;

  // Only access sessionStorage in the browser
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return undefined;
  }

  const storageKey = buildCookieName();
  sessionId = sessionStorage.getItem(storageKey) || undefined;

  return sessionId;
}

export function setRuntimeSessionId(id: string): void {
  sessionId = id;

  // Only access sessionStorage in the browser
  if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
    return;
  }

  const storageKey = buildCookieName();
  sessionStorage.setItem(storageKey, id);
}
