// Minimal read-only Ecomail API client – GET requests only, nothing here writes to Ecomail.

import type { EcomailRecord, EcomailStatus } from "./sync.ts";

const API_BASE = "https://api2.ecomailapp.cz";
const PER_PAGE = 1000;
const MAX_RETRIES = 6;

type Page = { data?: EcomailRecord[]; last_page?: number; total?: number };

export class EcomailApiError extends Error {}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** GET with retry on 429 (honouring `Retry-After`), 5xx and network errors; exponential backoff capped at 60 s. */
async function get<T>(apiKey: string, path: string): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    let retryAfterMs: number | null = null;
    try {
      const response = await fetch(`${API_BASE}${path}`, { method: "GET", headers: { key: apiKey, accept: "application/json" } });
      if (response.ok) return (await response.json()) as T;
      if (response.status !== 429 && response.status < 500) throw new EcomailApiError(`GET ${path} → HTTP ${response.status}`);
      const retryAfter = Number(response.headers.get("retry-after"));
      if (retryAfter > 0) retryAfterMs = retryAfter * 1000;
      if (attempt >= MAX_RETRIES) throw new EcomailApiError(`GET ${path} → HTTP ${response.status} after ${MAX_RETRIES} retries`);
    } catch (error) {
      if (error instanceof EcomailApiError) throw error;
      if (attempt >= MAX_RETRIES) throw new EcomailApiError(`GET ${path} failed after ${MAX_RETRIES} retries: ${error instanceof Error ? error.message : String(error)}`);
    }
    await sleep(retryAfterMs ?? Math.min(60_000, 1000 * 2 ** attempt));
  }
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
    const body = await get<Page>(apiKey, `/lists/${listId}/subscribers?status=${status}&per_page=${PER_PAGE}&page=${page}`);
    const data = body.data ?? [];
    records.push(...data);
    total = body.total ?? total;
    onProgress?.(records.length, total);
    if (data.length === 0 || page >= (body.last_page ?? page)) break;
  }
  return { records, total };
}
