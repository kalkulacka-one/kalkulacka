import { cookies } from "next/headers";
import { z } from "zod";

import { buildCookieName } from "./cookie-name";

export const sessionCookieSchema = z.object({
  id: z.string().uuid(),
  calculators: z.array(z.string()),
});

export type SessionCookie = z.infer<typeof sessionCookieSchema>;

export async function setSessionCookie({ sessionCookie, embedName }: { sessionCookie: SessionCookie; embedName?: string | null }): Promise<void> {
  const cookieName = buildCookieName({ embedName });

  const cookieStore = cookies();
  cookieStore.set(cookieName, JSON.stringify(sessionCookie), {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 90 * 24 * 60 * 60, // 90 days
  });
}
