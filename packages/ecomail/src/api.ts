// Ecomail API client. GET for the pull; the only write is `subscribeBulk` for the push.

import type { EcomailRecord, EcomailStatus } from "./sync.ts";

const API_BASE = "https://api2.ecomailapp.cz";
export const PER_PAGE = 1000;
const MAX_RETRIES = 6;
const MAX_WAIT_MS = 120_000;

export class EcomailApiError extends Error {}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

async function jsonBody(response: Response, label: string): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    throw new EcomailApiError(`${label} → HTTP ${response.status} with a non-JSON body`);
  }
}

/**
 * Retries on 429 (honouring `Retry-After`, capped), 5xx and network errors; any other failure throws immediately, except a 422
 * when `allow422` is set, whose JSON body is returned for the caller to inspect.
 */
async function request(apiKey: string, method: "GET" | "POST", path: string, body?: unknown, allow422 = false): Promise<{ status: number; body: unknown }> {
  const label = `${method} ${path}`;
  const headers: Record<string, string> = { key: apiKey, accept: "application/json" };
  if (body !== undefined) headers["content-type"] = "application/json";
  for (let attempt = 0; ; attempt++) {
    let response: Response | null = null;
    let networkError: unknown = null;
    try {
      response = await fetch(`${API_BASE}${path}`, { method, headers, ...(body !== undefined && { body: JSON.stringify(body) }) });
    } catch (error) {
      networkError = error;
    }

    if (response?.ok || (allow422 && response?.status === 422)) return { status: response.status, body: await jsonBody(response, label) };
    if (response && response.status !== 429 && response.status < 500) throw new EcomailApiError(`${label} → HTTP ${response.status}`);
    if (attempt >= MAX_RETRIES) {
      const reason = response ? `HTTP ${response.status}` : networkError instanceof Error ? networkError.message : String(networkError);
      throw new EcomailApiError(`${label} failed after ${MAX_RETRIES} retries: ${reason}`);
    }

    const retryAfter = Number(response?.headers.get("retry-after"));
    await sleep(Math.min(MAX_WAIT_MS, retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt));
  }
}

async function get(apiKey: string, path: string): Promise<unknown> {
  return (await request(apiKey, "GET", path)).body;
}

/** All records of a list with the given status (the filter only accepts string values), page by page. */
export async function fetchListSubscribers(
  apiKey: string,
  listId: number,
  status: EcomailStatus,
  onProgress?: (fetched: number, total: number | undefined) => void,
): Promise<{ records: EcomailRecord[]; total: number | undefined }> {
  const records: EcomailRecord[] = [];
  let total: number | undefined;
  for (let page = 1; ; page++) {
    const path = `/lists/${listId}/subscribers?status=${status}&per_page=${PER_PAGE}&page=${page}`;
    const body = (await get(apiKey, path)) as { data?: unknown; last_page?: unknown; total?: unknown } | null;
    const data = body?.data;
    if (!Array.isArray(data)) throw new EcomailApiError(`GET ${path} → response has no \`data\` array`);
    records.push(...(data as EcomailRecord[]));
    if (typeof body?.total === "number") total = body.total;
    onProgress?.(records.length, total);

    if (data.length === 0) break;
    if (typeof body?.last_page === "number") {
      if (page >= body.last_page) break;
    } else if (data.length < PER_PAGE) {
      break;
    } else {
      throw new EcomailApiError(`GET ${path} → full page without \`last_page\`, cannot tell whether more pages follow`);
    }
  }
  return { records, total };
}

/** Ecomail ignores everything past this many subscribers per `subscribe-bulk` call, silently. */
export const BULK_LIMIT = 3000;

export type BulkSubscriber = { email: string; custom_fields: Record<string, string>; tags: string[] };

/**
 * The request never sets a subscriber `status` (it would take precedence over `resubscribe`) and neither updates nor resubscribes
 * existing contacts, so re-sending a batch is harmless: retries on 429/5xx/network errors are safe.
 */
export type BulkRequest = {
  subscriber_data: BulkSubscriber[];
  update_existing: false;
  resubscribe: false;
  skip_confirmation: true;
  trigger_autoresponders: false;
};

/** `ok` on a 2xx; on a 422 the indexes into `subscriber_data` Ecomail rejected, or `null` when it rejected the request as a whole. */
export type BulkResult = { ok: true; inserts: number | undefined } | { ok: false; rejected: Map<number, string> | null; errors: unknown };

export function bulkRequest(subscribers: BulkSubscriber[]): BulkRequest {
  if (subscribers.length > BULK_LIMIT) throw new EcomailApiError(`subscribe-bulk takes at most ${BULK_LIMIT} subscribers, got ${subscribers.length}`);
  return { subscriber_data: subscribers, update_existing: false, resubscribe: false, skip_confirmation: true, trigger_autoresponders: false };
}

/** Reads `{ errors: { "subscriber_data.<index>": { field: [message] } } }`; any error not tied to one subscriber → `null`. */
export function parseBulkErrors(body: unknown, count: number): Map<number, string> | null {
  const errors = (body as { errors?: unknown } | null)?.errors;
  if (typeof errors !== "object" || errors === null || Array.isArray(errors)) return null;
  const rejected = new Map<number, string>();
  for (const [key, value] of Object.entries(errors)) {
    const match = /^subscriber_data\.(\d+)$/.exec(key);
    const index = match ? Number(match[1]) : Number.NaN;
    if (!(index >= 0 && index < count)) return null;
    const messages = typeof value === "object" && value !== null ? Object.entries(value).map(([field, list]) => `${field}: ${Array.isArray(list) ? list.join("; ") : String(list)}`) : [String(value)];
    rejected.set(index, messages.join(" | "));
  }
  return rejected.size ? rejected : null;
}

export async function subscribeBulk(apiKey: string, listId: number, subscribers: BulkSubscriber[]): Promise<BulkResult> {
  const { status, body } = await request(apiKey, "POST", `/lists/${listId}/subscribe-bulk`, bulkRequest(subscribers), true);
  if (status === 422) return { ok: false, rejected: parseBulkErrors(body, subscribers.length), errors: (body as { errors?: unknown } | null)?.errors ?? body };
  const inserts = (body as { inserts?: unknown } | null)?.inserts;
  return { ok: true, inserts: typeof inserts === "number" ? inserts : undefined };
}
