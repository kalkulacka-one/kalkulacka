import { cookies } from "next/headers";

import { parseWithSchema } from "../../../calculator/lib";
import { buildCookieName, sessionCookieSchema } from ".";

export async function getSessionCookie({ embedName }: { embedName?: string | null } = {}) {
  const cookieName = buildCookieName({ embedName });

  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(cookieName);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const data = JSON.parse(sessionCookie.value);
    return parseWithSchema({ data, schema: sessionCookieSchema });
  } catch {
    throw new Error("Invalid session cookie data");
  }
}
