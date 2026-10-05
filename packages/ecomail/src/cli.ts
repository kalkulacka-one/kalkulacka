// Shared by the pull, push and sync commands: flags, env and the Prisma client.

import type { prisma as Prisma } from "@kalkulacka-one/database";

import { realpathSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { config } from "dotenv";

import { parseOrigins } from "./origins.ts";
import type { SqlClient } from "./write.ts";

/** `maxPullAge` (minutes) is only accepted by the standalone push. */
export type CliOptions = { apply: boolean; verbose: boolean; limit: number | undefined; maxPullAge?: number };
export type EcomailEnv = { apiKey: string; listId: number; origins: string[] };
export type PrismaClient = typeof Prisma;

export class UsageError extends Error {}

const positiveInteger = (value: string) => /^\d+$/.test(value) && Number(value) > 0;

/** Strict flags: `--apply`, `--verbose`, `--limit N` (positive integer, only with `--apply`); `push` also takes `--max-pull-age MIN`. */
export function parseCliArgs(args: string[], command: string): CliOptions {
  let values: { apply?: boolean; verbose?: boolean; limit?: string; "max-pull-age"?: string };
  const usage = `Usage: ${command} [--verbose] [--apply [--limit N]]${command === "push" ? " [--max-pull-age MIN]" : ""}`;
  try {
    const options = { apply: { type: "boolean" }, verbose: { type: "boolean" }, limit: { type: "string" }, "max-pull-age": { type: "string" } } as const;
    ({ values } = parseArgs({ args, options, strict: true, allowPositionals: false }));
  } catch (error) {
    throw new UsageError(`${error instanceof Error ? error.message : String(error)}\n${usage}`);
  }
  const rawMaxPullAge = values["max-pull-age"];
  if (rawMaxPullAge !== undefined && command !== "push") throw new UsageError(`--max-pull-age only applies to push\n${usage}`);
  if (rawMaxPullAge !== undefined && !positiveInteger(rawMaxPullAge)) throw new UsageError(`--max-pull-age expects a positive number of minutes, got "${rawMaxPullAge}"`);
  let limit: number | undefined;
  if (values.limit !== undefined) {
    if (!values.apply) throw new UsageError("--limit only applies to --apply");
    if (!positiveInteger(values.limit)) throw new UsageError(`--limit expects a positive integer, got "${values.limit}"`);
    limit = Number(values.limit);
  }
  return { apply: values.apply ?? false, verbose: values.verbose ?? false, limit, ...(rawMaxPullAge !== undefined && { maxPullAge: Number(rawMaxPullAge) }) };
}

/** Loads `packages/ecomail/.env` and validates the required variables. */
export function loadEnv(): EcomailEnv {
  config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"), quiet: true });
  const apiKey = process.env.ECOMAIL_API_KEY;
  if (!apiKey) throw new Error("ECOMAIL_API_KEY is not set (packages/ecomail/.env)");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set (packages/ecomail/.env)");
  const rawListId = process.env.ECOMAIL_LIST_ID?.trim();
  if (!rawListId) throw new Error("ECOMAIL_LIST_ID is not set (packages/ecomail/.env)");
  if (!/^\d+$/.test(rawListId) || Number(rawListId) <= 0) throw new Error(`ECOMAIL_LIST_ID must be a positive integer, got "${rawListId}"`);
  return { apiKey, listId: Number(rawListId), origins: parseOrigins(process.env.ECOMAIL_ORIGINS) };
}

export function prismaSqlClient(prisma: PrismaClient): SqlClient<ReturnType<PrismaClient["$executeRaw"]>> {
  return { executeRaw: (query, ...values) => prisma.$executeRaw(query, ...values), transaction: (statements, options) => prisma.$transaction(statements, options) };
}

/** A report line: the count, plus the emails with `--verbose`. */
export function printCategory(verbose: boolean, label: string, emails: string[]) {
  console.log(`  ${label}: ${emails.length}${verbose && emails.length ? ` – ${emails.join(", ")}` : ""}`);
}

/**
 * True when the module was started as the script (`node src/pull.ts`), not imported. Both sides are resolved to real paths, so a
 * symlinked script or checkout (e.g. macOS `/tmp` → `/private/tmp`) still counts.
 */
export function isMain(moduleUrl: string, script: string | undefined = process.argv[1]): boolean {
  if (script === undefined) return false;
  try {
    return realpathSync(resolve(script)) === realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return false;
  }
}

/** Parses flags, loads env, runs `command` with a Prisma client and exits 1 with a message on any failure. */
export async function runCli(command: string, run: (options: CliOptions, env: EcomailEnv, prisma: PrismaClient) => Promise<void>): Promise<void> {
  try {
    const options = parseCliArgs(process.argv.slice(2), command);
    const env = loadEnv();
    // Imported only after dotenv has run: the client reads DATABASE_URL when the module loads.
    const { prisma } = await import("@kalkulacka-one/database");
    try {
      await run(options, env, prisma);
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error(`ecomail ${command}: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
