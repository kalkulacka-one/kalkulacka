import type { NextRequest } from "next/server";

export function getSessionFromRequest(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  const bearer = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : null;
  return bearer || null;
}
