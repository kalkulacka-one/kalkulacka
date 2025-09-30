import type { NextRequest } from "next/server";

export function getEmbedNameFromRequest(request: NextRequest): string | undefined {
  const referer = request.headers.get("referer");

  if (!referer) {
    return undefined;
  }

  try {
    const url = new URL(referer);
    const pathParts = url.pathname.split("/").filter(Boolean);

    const embedIndex = pathParts.indexOf("embed");
    if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
      return pathParts[embedIndex + 1];
    }
  } catch {
    return undefined;
  }

  return undefined;
}
