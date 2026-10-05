import { z } from "zod";

export type EmailCheck = { ok: true } | { ok: false; reason: "syntax" | "typo"; suggestion?: string };

/** Typo domains measured in production, mapped to the domain the subscriber most likely meant. */
export const TYPO_DOMAINS: Readonly<Record<string, string>> = {
  "gmail.cz": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cpm": "gmail.com",
  "gmail.co": "gmail.com",
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com",
  "sezam.cz": "seznam.cz",
  "seznma.cz": "seznam.cz",
  "seznam.c": "seznam.cz",
  "emial.cz": "email.cz",
  "centrum.c": "centrum.cz",
  "cetrum.cz": "centrum.cz",
  "icloud.con": "icloud.com",
  "protonmail.con": "protonmail.com",
};

/** Top-level domains that are typos in this audience: `.cu` (Cuba) is a mistyped `.cz`. */
export const TYPO_TLDS: Readonly<Record<string, string>> = {
  con: "com",
  cpm: "com",
  cu: "cz",
};

/** Popular Czech and Slovak mailbox domains; a domain one edit away from one of them (same TLD) is treated as its typo. */
export const POPULAR_DOMAINS: readonly string[] = [
  "gmail.com",
  "seznam.cz",
  "email.cz",
  "centrum.cz",
  "post.cz",
  "volny.cz",
  "atlas.cz",
  "icloud.com",
  "outlook.com",
  "outlook.cz",
  "hotmail.com",
  "yahoo.com",
  "azet.sk",
  "proton.me",
  "protonmail.com",
];

/** Real mailbox domains that happen to be one edit away from a popular domain. */
export const LOOKALIKE_DOMAINS: readonly string[] = ["mail.com", "ymail.com", "email.com", "mail.cz"];

/** Shorter names (`post`, `azet`) have too many legitimate neighbours (`host.cz`, `most.cz`) for an edit-distance match. */
const MIN_FUZZY_NAME_LENGTH = 5;

const emailSchema = z.email();

function isSyntaxValid(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

function splitDomain(domain: string): { name: string; tld: string } {
  const dot = domain.lastIndexOf(".");
  return dot === -1 ? { name: domain, tld: "" } : { name: domain.slice(0, dot), tld: domain.slice(dot + 1) };
}

/** Optimal string alignment distance (Damerau-Levenshtein restricted to adjacent transpositions), stopping early above 1. */
function isWithinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    const diffs: number[] = [];
    for (let i = 0; i < a.length && diffs.length <= 2; i++) if (a[i] !== b[i]) diffs.push(i);
    if (diffs.length === 1) return true;
    const [first, second] = diffs;
    return diffs.length === 2 && first !== undefined && second === first + 1 && a[first] === b[second] && a[second] === b[first];
  }
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  let i = 0;
  while (i < shorter.length && shorter[i] === longer[i]) i++;
  return shorter.slice(i) === longer.slice(i + 1);
}

/** The domain the subscriber most likely meant, or `undefined` when the domain does not look like a typo. Expects lowercase. */
export function suggestDomain(domain: string): string | undefined {
  if (POPULAR_DOMAINS.includes(domain) || LOOKALIKE_DOMAINS.includes(domain)) return undefined;
  const mapped = TYPO_DOMAINS[domain];
  if (mapped) return mapped;

  const { name, tld } = splitDomain(domain);
  const tldFix = TYPO_TLDS[tld];
  if (tldFix) return `${name}.${tldFix}`;

  for (const popular of POPULAR_DOMAINS) {
    const target = splitDomain(popular);
    if (target.tld === tld && target.name.length >= MIN_FUZZY_NAME_LENGTH && isWithinOneEdit(name, target.name)) return popular;
  }
  return undefined;
}

/**
 * Pure syntax and typo check of a stored email. Never rewrites the address: a typo is only flagged, with a suggested correction
 * for manual fixing. Comparison is case-insensitive; the suggestion keeps the local part as typed.
 */
export function checkEmailSyntaxAndTypos(email: string): EmailCheck {
  const at = email.lastIndexOf("@");
  const local = at === -1 ? email : email.slice(0, at);
  const domain = at === -1 ? "" : email.slice(at + 1).toLowerCase();
  const suggestedDomain = at === -1 ? undefined : suggestDomain(domain);
  const suggestion = suggestedDomain ? `${local}@${suggestedDomain}` : undefined;

  if (!isSyntaxValid(email)) return suggestion && isSyntaxValid(suggestion) ? { ok: false, reason: "syntax", suggestion } : { ok: false, reason: "syntax" };
  if (suggestion) return { ok: false, reason: "typo", suggestion };
  return { ok: true };
}

/** Lowercase domain part of an email, or `undefined` when there is no `@`. */
export function emailDomain(email: string): string | undefined {
  const at = email.lastIndexOf("@");
  return at === -1 ? undefined : email.slice(at + 1).toLowerCase();
}
