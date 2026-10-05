// One Subscription row = one Ecomail list, and only some origins belong to a given list (e.g. `join-us-form` is a volunteer
// campaign, not a newsletter signup). The pull therefore only ever reads and writes rows of the configured origins.

/** Parses `ECOMAIL_ORIGINS` (comma-separated); throws when it is missing or holds no origin. */
export function parseOrigins(raw: string | undefined): string[] {
  if (raw === undefined || !raw.trim()) throw new Error("ECOMAIL_ORIGINS is not set (packages/ecomail/.env)");
  const origins = [...new Set(raw.split(",").map((origin) => origin.trim()))].filter((origin) => origin !== "");
  if (!origins.length) throw new Error(`ECOMAIL_ORIGINS must list at least one origin, got "${raw}"`);
  return origins;
}

/** The `findMany` arguments for the rows the pull may plan: only the list's origins are ever loaded. */
export function subscriptionsQuery(origins: string[]) {
  return {
    where: { origin: { in: origins } },
    select: { id: true, email: true, origin: true, createdAt: true, metadata: true, emailStatus: true, unsubscribedAt: true },
  } as const;
}
