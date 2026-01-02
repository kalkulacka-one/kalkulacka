export function buildCookieName({ embedName }: { embedName?: string | null } = {}): string {
  const baseCookieName = process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME;

  if (!baseCookieName) {
    throw new Error("Missing `NEXT_PUBLIC_SESSION_COOKIE_NAME` environment variable");
  }

  return embedName ? `${baseCookieName}_embed_${embedName}` : baseCookieName;
}
