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

const DEFAULT_TIMEOUT_MS = 10_000;

/** Answers that prove the name has no records of the asked type (NXDOMAIN, NODATA). Anything else is transient. */
const DEFINITE_NEGATIVE_CODES = new Set(["ENOTFOUND", "ENODATA"]);

type Lookup<T> = { kind: "records"; records: T[] } | { kind: "none" } | { kind: "error" };

/** Runs one DNS query and gives up waiting after a timeout. */
type Query = <T>(run: () => Promise<T[]>) => Promise<T[]>;

function timeoutError(timeoutMs: number) {
  return Object.assign(new Error(`DNS lookup timed out after ${timeoutMs} ms`), { code: "ETIMEOUT" });
}

/**
 * At most `concurrency` queries in flight, counted until the underlying query settles – not until the caller gives up waiting –
 * so a timed-out query keeps its slot. The timeout runs from the moment the query starts, not while it waits for a slot. Set the
 * resolver's own timeout below `timeoutMs` (e.g. `tries: 1`), so every query settles and frees its slot.
 */
function createQuery(timeoutMs: number, concurrency = Number.POSITIVE_INFINITY): Query {
  let inFlight = 0;
  const waiting: (() => void)[] = [];
  const release = () => {
    inFlight--;
    waiting.shift()?.();
  };
  return async <T>(run: () => Promise<T[]>) => {
    if (inFlight >= concurrency) await new Promise<void>((resolve) => waiting.push(resolve));
    inFlight++;
    let query: Promise<T[]>;
    try {
      query = run();
    } catch (error) {
      query = Promise.reject(error);
    }
    query.then(release, release);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(timeoutError(timeoutMs)), timeoutMs);
    });
    return Promise.race([query, timeout]).finally(() => clearTimeout(timer));
  };
}

async function lookup<T>(query: Query, run: () => Promise<T[]>): Promise<Lookup<T>> {
  try {
    const records = await query(run);
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

async function checkDomainWith(domain: string, resolver: DnsResolver, query: Query): Promise<DomainCheck> {
  const name = domain.toLowerCase();
  const mx = await lookup(query, () => resolver.resolveMx(name));
  if (mx.kind === "records") return mx.records.every(isNullMx) ? "invalid" : "ok";
  if (mx.kind === "error") return "unknown";

  const [a, aaaa] = await Promise.all([lookup(query, () => resolver.resolve4(name)), lookup(query, () => resolver.resolve6(name))]);
  if (a.kind === "records" || aaaa.kind === "records") return "ok";
  if (a.kind === "none" && aaaa.kind === "none") return "invalid";
  return "unknown";
}

/**
 * Whether a domain can receive mail, judged from DNS only (no SMTP):
 * - MX records → `ok`, unless every one is a null MX (RFC 7505) → `invalid`;
 * - no MX → fall back to A/AAAA (implicit MX, RFC 5321 §5.1): an address → `ok`, NXDOMAIN/NODATA on both → `invalid`;
 * - SERVFAIL, REFUSED, timeouts and other errors → `unknown`, so the row is retried on a later run.
 */
export async function checkDomain(domain: string, resolver: DnsResolver, { timeoutMs = DEFAULT_TIMEOUT_MS }: CheckDomainOptions = {}): Promise<DomainCheck> {
  return checkDomainWith(domain, resolver, createQuery(timeoutMs));
}

export type CheckDomainsOptions = CheckDomainOptions & { concurrency?: number; onProgress?: (checked: number) => void };

/** Checks each distinct domain once, with at most `concurrency` DNS queries in flight at any time. */
export async function checkDomains(
  domains: Iterable<string>,
  resolver: DnsResolver,
  { concurrency = 20, timeoutMs = DEFAULT_TIMEOUT_MS, onProgress }: CheckDomainsOptions = {},
): Promise<Map<string, DomainCheck>> {
  const unique = [...new Set([...domains].map((domain) => domain.toLowerCase()))];
  const query = createQuery(timeoutMs, Math.max(1, concurrency));
  const results = new Map<string, DomainCheck>();
  await Promise.all(
    unique.map(async (domain) => {
      results.set(domain, await checkDomainWith(domain, resolver, query));
      onProgress?.(results.size);
    }),
  );
  return new Map(unique.map((domain) => [domain, results.get(domain) ?? "unknown"]));
}
