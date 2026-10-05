import { describe, expect, it } from "vitest";

import { checkDomain, checkDomains, type DnsResolver, type MxRecord } from "./check-domain.ts";

type Answer<T> = T[] | string | "hang";

/** The shape `node:dns/promises` rejects with, e.g. `queryMx ENOTFOUND example.invalid` with `code`, `syscall` and `hostname`. */
function dnsError(code: string, syscall = "queryMx", hostname = "example.cz") {
  return Object.assign(new Error(`${syscall} ${code} ${hostname}`), { code, syscall, hostname });
}

function answer<T>(value: Answer<T> | undefined): Promise<T[]> {
  if (value === undefined) return Promise.reject(dnsError("ENOTFOUND"));
  if (value === "hang") return new Promise<T[]>(() => {});
  if (typeof value === "string") return Promise.reject(dnsError(value));
  return Promise.resolve(value);
}

function fakeResolver(zone: Record<string, { mx?: Answer<MxRecord>; a?: Answer<string>; aaaa?: Answer<string> }>) {
  const queries: string[] = [];
  const resolver: DnsResolver = {
    resolveMx: (domain) => {
      queries.push(`MX ${domain}`);
      return answer(zone[domain]?.mx);
    },
    resolve4: (domain) => {
      queries.push(`A ${domain}`);
      return answer(zone[domain]?.a);
    },
    resolve6: (domain) => {
      queries.push(`AAAA ${domain}`);
      return answer(zone[domain]?.aaaa);
    },
  };
  return { resolver, queries };
}

describe("checkDomain", () => {
  it("is ok with an MX record, without an address lookup", async () => {
    const { resolver, queries } = fakeResolver({ "gmail.com": { mx: [{ exchange: "gmail-smtp-in.l.google.com", priority: 5 }] } });
    await expect(checkDomain("GMAIL.com", resolver)).resolves.toBe("ok");
    expect(queries).toEqual(["MX gmail.com"]);
  });

  it.each(["", "."])("is invalid with a null MX (%j)", async (exchange) => {
    const { resolver } = fakeResolver({ "nomail.cz": { mx: [{ exchange, priority: 0 }], a: ["192.0.2.1"] } });
    await expect(checkDomain("nomail.cz", resolver)).resolves.toBe("invalid");
  });

  it("is ok when a null MX sits next to a real MX", async () => {
    const { resolver } = fakeResolver({
      "mixed.cz": {
        mx: [
          { exchange: "", priority: 0 },
          { exchange: "mx.mixed.cz", priority: 10 },
        ],
      },
    });
    await expect(checkDomain("mixed.cz", resolver)).resolves.toBe("ok");
  });

  it("falls back to A when there is no MX", async () => {
    const { resolver, queries } = fakeResolver({ "firma.cz": { mx: "ENODATA", a: ["192.0.2.1"], aaaa: "ENODATA" } });
    await expect(checkDomain("firma.cz", resolver)).resolves.toBe("ok");
    expect(queries).toEqual(["MX firma.cz", "A firma.cz", "AAAA firma.cz"]);
  });

  it("falls back to AAAA when there is no MX and no A", async () => {
    const { resolver } = fakeResolver({ "v6.cz": { mx: [], a: "ENODATA", aaaa: ["2001:db8::1"] } });
    await expect(checkDomain("v6.cz", resolver)).resolves.toBe("ok");
  });

  it("is invalid for NXDOMAIN", async () => {
    const { resolver } = fakeResolver({});
    await expect(checkDomain("does-not-exist.invalid", resolver)).resolves.toBe("invalid");
  });

  it("is invalid when the name exists without MX, A or AAAA", async () => {
    const { resolver } = fakeResolver({ "parked.cz": { mx: "ENODATA", a: "ENODATA", aaaa: "ENODATA" } });
    await expect(checkDomain("parked.cz", resolver)).resolves.toBe("invalid");
  });

  it.each([
    ["ENOTFOUND", "invalid"],
    ["ENODATA", "invalid"],
    ["ESERVFAIL", "unknown"],
    ["ETIMEOUT", "unknown"],
    ["EREFUSED", "unknown"],
    ["ECONNREFUSED", "unknown"],
  ] as const)("maps a node:dns %s on every lookup to %s", async (code, expected) => {
    const { resolver } = fakeResolver({ "x.cz": { mx: code, a: code, aaaa: code } });
    await expect(checkDomain("x.cz", resolver)).resolves.toBe(expected);
  });

  it("is unknown when the resolver rejects without a code", async () => {
    const resolver: DnsResolver = { resolveMx: () => Promise.reject(new Error("boom")), resolve4: () => Promise.resolve([]), resolve6: () => Promise.resolve([]) };
    await expect(checkDomain("x.cz", resolver)).resolves.toBe("unknown");
  });

  it("is unknown when the MX lookup times out", async () => {
    const { resolver } = fakeResolver({ "slow.cz": { mx: "hang" } });
    await expect(checkDomain("slow.cz", resolver, { timeoutMs: 5 })).resolves.toBe("unknown");
  });

  it("is unknown when the address fallback fails transiently", async () => {
    const { resolver } = fakeResolver({ "flaky.cz": { mx: "ENODATA", a: "ETIMEOUT", aaaa: "ENODATA" } });
    await expect(checkDomain("flaky.cz", resolver)).resolves.toBe("unknown");
  });
});

describe("checkDomains", () => {
  it("checks each distinct domain once, case-insensitively", async () => {
    const { resolver, queries } = fakeResolver({ "gmail.com": { mx: [{ exchange: "mx.gmail.com", priority: 1 }] } });
    const progress: number[] = [];
    const results = await checkDomains(["gmail.com", "GMAIL.COM", "gone.invalid"], resolver, { concurrency: 2, onProgress: (checked) => progress.push(checked) });
    expect(Object.fromEntries(results)).toEqual({ "gmail.com": "ok", "gone.invalid": "invalid" });
    expect(queries.filter((query) => query.startsWith("MX"))).toHaveLength(2);
    expect(progress).toEqual([1, 2]);
  });

  it("never has more queries in flight than the concurrency limit, even after a timeout gives up on one", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    // Each query outlives the caller's timeout: the caller gives up after 5 ms, the query settles after 30 ms.
    const slow = <T>(value: T[]) => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      return new Promise<T[]>((resolve) =>
        setTimeout(() => {
          inFlight--;
          resolve(value);
        }, 30),
      );
    };
    const resolver: DnsResolver = { resolveMx: () => slow([{ exchange: "mx.example.cz", priority: 1 }]), resolve4: () => slow([]), resolve6: () => slow([]) };
    const domains = Array.from({ length: 6 }, (_, index) => `d${index}.cz`);

    const results = await checkDomains(domains, resolver, { concurrency: 2, timeoutMs: 5 });

    expect([...results.values()]).toEqual(Array(6).fill("unknown"));
    expect(maxInFlight).toBe(2);
    // The last two were given up on but still hold their slots until they settle.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(inFlight).toBe(0);
  });

  it("starts the timeout when a query starts, not while it waits for a slot", async () => {
    const resolver: DnsResolver = {
      resolveMx: () => new Promise((resolve) => setTimeout(() => resolve([{ exchange: "mx.example.cz", priority: 1 }]), 20)),
      resolve4: () => Promise.resolve([]),
      resolve6: () => Promise.resolve([]),
    };
    // Serialized, the third domain waits ~40 ms for its slot – longer than the 30 ms timeout – and must still be ok.
    const results = await checkDomains(["a.cz", "b.cz", "c.cz"], resolver, { concurrency: 1, timeoutMs: 30 });
    expect([...results.values()]).toEqual(["ok", "ok", "ok"]);
  });
});
