// Read-only Ecomail API client: GET requests only.

import type { EcomailRecord, EcomailStatus } from "./sync.ts";

const API_BASE = "https://api2.ecomailapp.cz";
export const PER_PAGE = 1000;
const MAX_RETRIES = 6;
const MAX_WAIT_MS = 120_000;

export class EcomailApiError extends Error {}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** GET with retries on 429 (honouring `Retry-After`), 5xx and network errors; any other failure throws immediately. */
async function get(apiKey: string, path: string): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    let response: Response | null = null;
    let networkError: unknown = null;
    try {
      response = await fetch(`${API_BASE}${path}`, { method: "GET", headers: { key: apiKey, accept: "application/json" } });
    } catch (error) {
      networkError = error;
    }

    if (response?.ok) {
      try {
        return await response.json();
      } catch {
        throw new EcomailApiError(`GET ${path} → HTTP ${response.status} with a non-JSON body`);
      }
    }
    if (response && response.status !== 429 && response.status < 500) throw new EcomailApiError(`GET ${path} → HTTP ${response.status}`);
    if (attempt >= MAX_RETRIES) {
      const reason = response ? `HTTP ${response.status}` : networkError instanceof Error ? networkError.message : String(networkError);
      throw new EcomailApiError(`GET ${path} failed after ${MAX_RETRIES} retries: ${reason}`);
    }

    const retryAfter = Number(response?.headers.get("retry-after"));
    await sleep(Math.min(MAX_WAIT_MS, retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt));
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
