import { describe, expect, it } from "vitest";

import { checkDomain, checkDomains, type DnsResolver, type MxRecord } from "./check-domain";

type Answer<T> = T[] | string | "hang";

function dnsError(code: string) {
  return Object.assign(new Error(code), { code });
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

  it("is unknown on SERVFAIL", async () => {
    const { resolver } = fakeResolver({ "broken.cz": { mx: "ESERVFAIL" } });
    await expect(checkDomain("broken.cz", resolver)).resolves.toBe("unknown");
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
});
