export function buildCookieName({ embedName }: { embedName?: string | null } = {}): string {
  const baseCookieName = process.env.SESSION_COOKIE_NAME;

  if (!baseCookieName) {
    throw new Error("Missing `SESSION_COOKIE_NAME` environment variable");
  }

  return embedName ? `${baseCookieName}_embed_${embedName}` : baseCookieName;
}
