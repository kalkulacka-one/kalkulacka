/** `ok`: the domain can receive mail; `invalid`: it definitely cannot; `unknown`: a transient DNS failure, retry later. */
export type DomainCheck = "ok" | "invalid" | "unknown";

export type MxRecord = { exchange: string; priority: number };

/** The subset of `node:dns/promises`' `Resolver` the check needs; injected so this module stays free of Node built-ins. */
export type DnsResolver = {
  resolveMx: (domain: string) => Promise<MxRecord[]>;
  resolve4: (domain: string) => Promise<string[]>;
  resolve6: (domain: string) => Promise<string[]>;
};

export type CheckDomainOptions = { timeoutMs?: number };

/** Answers that prove the name has no records of the asked type (NXDOMAIN, NODATA). Anything else is transient. */
const DEFINITE_NEGATIVE_CODES = new Set(["ENOTFOUND", "ENODATA"]);

type Lookup<T> = { kind: "records"; records: T[] } | { kind: "none" } | { kind: "error" };

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(Object.assign(new Error(`DNS lookup timed out after ${timeoutMs} ms`), { code: "ETIMEOUT" })), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function lookup<T>(query: () => Promise<T[]>, timeoutMs: number): Promise<Lookup<T>> {
  try {
    const records = await withTimeout(query(), timeoutMs);
    return records.length ? { kind: "records", records } : { kind: "none" };
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
    return typeof code === "string" && DEFINITE_NEGATIVE_CODES.has(code) ? { kind: "none" } : { kind: "error" };
  }
}

/** RFC 7505 null MX: the domain explicitly accepts no mail. */
function isNullMx(record: MxRecord): boolean {
  return record.exchange === "" || record.exchange === ".";
}

/**
 * Whether a domain can receive mail, judged from DNS only (no SMTP):
 * - MX records → `ok`, unless every one is a null MX (RFC 7505) → `invalid`;
 * - no MX → fall back to A/AAAA (implicit MX, RFC 5321 §5.1): an address → `ok`, NXDOMAIN/NODATA on both → `invalid`;
 * - SERVFAIL, timeouts and other errors → `unknown`, so the row is retried on a later run.
 */
export async function checkDomain(domain: string, resolver: DnsResolver, { timeoutMs = 10_000 }: CheckDomainOptions = {}): Promise<DomainCheck> {
  const name = domain.toLowerCase();
  const mx = await lookup(() => resolver.resolveMx(name), timeoutMs);
  if (mx.kind === "records") return mx.records.every(isNullMx) ? "invalid" : "ok";
  if (mx.kind === "error") return "unknown";

  const [a, aaaa] = await Promise.all([lookup(() => resolver.resolve4(name), timeoutMs), lookup(() => resolver.resolve6(name), timeoutMs)]);
  if (a.kind === "records" || aaaa.kind === "records") return "ok";
  if (a.kind === "none" && aaaa.kind === "none") return "invalid";
  return "unknown";
}

export type CheckDomainsOptions = CheckDomainOptions & { concurrency?: number; onProgress?: (checked: number) => void };

/** Checks each distinct domain once, at most `concurrency` lookups at a time. */
export async function checkDomains(domains: Iterable<string>, resolver: DnsResolver, { concurrency = 20, onProgress, ...options }: CheckDomainsOptions = {}): Promise<Map<string, DomainCheck>> {
  const queue = [...new Set([...domains].map((domain) => domain.toLowerCase()))];
  const results = new Map<string, DomainCheck>();
  let next = 0;
  const worker = async () => {
    while (next < queue.length) {
      const domain = queue[next++];
      if (domain === undefined) break;
      results.set(domain, await checkDomain(domain, resolver, options));
      onProgress?.(results.size);
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, queue.length)) }, worker));
  return results;
}
