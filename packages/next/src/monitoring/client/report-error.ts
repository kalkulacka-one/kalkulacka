import { appsignal } from "./appsignal";

export function reportError(error: unknown): void {
  if (appsignal) {
    appsignal.sendError(error instanceof Error ? error : new Error(String(error)));
  }
}
