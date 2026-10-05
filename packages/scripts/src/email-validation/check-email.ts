import { z } from "zod";

/**
 * `ok: false` is definitive (bad syntax, or a domain from the hand-curated typo map). `ok: true` still needs a DNS check; `suspect`
 * then carries the address a look-alike heuristic suggests – only a warning, DNS decides the status.
 */
export type EmailCheck = { ok: true; suspect?: string } | { ok: false; reason: "syntax" | "typo"; suggestion?: string };

/**
 * Typo domains measured in production (approved after a prod dry-run), by the domain the subscriber most likely meant. A match is
 * `invalid` without DNS, or fixed with `--fix-typos`. Look-alikes left out on purpose (`cmail.cz`, `fmail.com`, `kcloud.com`, …)
 * stay on the heuristic path, where DNS decides.
 */
const TYPOS_BY_TARGET: Readonly<Record<string, readonly string[]>> = {
  "gmail.com": [
    "gmail.cz",
    "gmail.con",
    "gmail.cpm",
    "gmail.co",
    "gamil.com",
    "gmai.com",
    "gmal.com",
    "gmial.com",
    "gmaill.com",
    "gnail.com",
    "gmsil.com",
    "gmnail.com",
    "gmaiil.com",
    "gmmail.com",
    "gmaul.com",
    "hmail.com",
    "hmail.vom",
    "gmail.cok",
    "gmail.cm",
    "gmail.clm",
    "gmail.cim",
    "gmail.cu",
    "gmail.comm",
    "gmail.comp",
    "gmail.comh",
    "gmail.comi",
    "gmail.comj",
  ],
  "seznam.cz": [
    "sezam.cz",
    "seznma.cz",
    "seznam.c",
    "seznam.cu",
    "seznam.ct",
    "seznam.vz",
    "seznam.cs",
    "seznam.cg",
    "seznam.czo",
    "seznam.czl",
    "seznsm.cz",
    "srznam.cz",
    "seznan.cz",
    "sezna.cz",
    "sezanm.cz",
    "senzam.cz",
    "sznam.cz",
    "seznqm.cz",
    "seznamn.cz",
    "sezbam.cz",
    "seynam.cz",
    "deznam.cz",
    "sreznam.cz",
  ],
  "email.cz": ["emial.cz", "email.cu", "email.ct", "email.vz", "emai.cz", "enail.cz", "emaul.cz", "eail.cz", "emaoil.cz"],
  "centrum.cz": ["centrum.c", "cetrum.cz", "cenzrum.cz", "centurum.cz", "centrom.cz", "centrumy.cz", "centrum.ct"],
  "icloud.com": ["icloud.con", "iclou.com", "icloud.cim"],
  "protonmail.com": ["protonmail.con", "protonmaill.com"],
  "volny.cz": ["volny.vz"],
  "post.cz": ["post.cu"],
  "outlook.cz": ["outlook.cu"],
};

const TYPO_DOMAINS: ReadonlyMap<string, string> = new Map(Object.entries(TYPOS_BY_TARGET).flatMap(([target, typos]) => typos.map((typo) => [typo, target] as const)));

/** Top-level domains that are likely typos in this audience (`.cu`, Cuba, for `.cz`). Only a warning: DNS decides. */
const TYPO_TLDS: Readonly<Record<string, string>> = {
  con: "com",
  cpm: "com",
  cu: "cz",
};

/** Popular Czech and Slovak mailbox domains; a domain one edit away from one of them (same TLD) is a suspect. Only a warning: DNS decides. */
const POPULAR_DOMAINS: readonly string[] = [
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
const LOOKALIKE_DOMAINS: readonly string[] = ["mail.com", "ymail.com", "email.com", "mail.cz"];

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

function typoDomain(domain: string): string | undefined {
  return TYPO_DOMAINS.get(domain);
}

/** Heuristic look-alike (typo TLD, or one edit from a popular domain), or `undefined`. Expects lowercase. */
function suspectDomain(domain: string): string | undefined {
  if (POPULAR_DOMAINS.includes(domain) || LOOKALIKE_DOMAINS.includes(domain)) return undefined;
  const { name, tld } = splitDomain(domain);
  const tldFix = Object.hasOwn(TYPO_TLDS, tld) ? TYPO_TLDS[tld] : undefined;
  if (tldFix) return `${name}.${tldFix}`;

  for (const popular of POPULAR_DOMAINS) {
    const target = splitDomain(popular);
    if (target.tld === tld && target.name.length >= MIN_FUZZY_NAME_LENGTH && isWithinOneEdit(name, target.name)) return popular;
  }
  return undefined;
}

/** The domain the subscriber most likely meant, from the typo map or the look-alike heuristic, or `undefined`. Expects lowercase. */
export function suggestDomain(domain: string): string | undefined {
  return typoDomain(domain) ?? suspectDomain(domain);
}

/**
 * Pure syntax and typo check of a stored email. Never rewrites the address: a typo is only flagged, with a suggested correction
 * for manual fixing. Comparison is case-insensitive; the suggestion keeps the local part as typed.
 * - bad syntax → `{ ok: false, reason: "syntax" }` (with a suggestion when one would fix it);
 * - a domain from the hand-curated typo map → `{ ok: false, reason: "typo", suggestion }`;
 * - anything else → `{ ok: true }`, plus `suspect` when the look-alike heuristic fires. The caller still has to check DNS.
 */
export function checkEmailSyntaxAndTypos(email: string): EmailCheck {
  const at = email.lastIndexOf("@");
  const local = at === -1 ? email : email.slice(0, at);
  const domain = at === -1 ? "" : email.slice(at + 1).toLowerCase();
  const withDomain = (suggested: string | undefined) => (suggested ? `${local}@${suggested}` : undefined);

  if (!isSyntaxValid(email)) {
    const suggestion = at === -1 ? undefined : withDomain(suggestDomain(domain));
    return suggestion && isSyntaxValid(suggestion) ? { ok: false, reason: "syntax", suggestion } : { ok: false, reason: "syntax" };
  }
  const typo = withDomain(typoDomain(domain));
  if (typo) return { ok: false, reason: "typo", suggestion: typo };
  const suspect = withDomain(suspectDomain(domain));
  return suspect ? { ok: true, suspect } : { ok: true };
}

/**
 * The email with a typo-map domain replaced by its lowercase target, keeping the local part exactly as typed, or `undefined` when
 * the domain (compared case-insensitively) is not in the map.
 */
export function correctTypoDomain(email: string): string | undefined {
  const at = email.lastIndexOf("@");
  if (at === -1) return undefined;
  const target = typoDomain(email.slice(at + 1).toLowerCase());
  return target ? `${email.slice(0, at)}@${target}` : undefined;
}

/** Lowercase domain part of an email, or `undefined` when there is no `@`. */
export function emailDomain(email: string): string | undefined {
  const at = email.lastIndexOf("@");
  return at === -1 ? undefined : email.slice(at + 1).toLowerCase();
}
