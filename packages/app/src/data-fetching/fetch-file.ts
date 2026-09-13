import { InternalServerError, NotFoundError } from "@/errors";

/** How long a data file may be served from the framework's fetch cache before it is fetched again. */
export const DATA_REVALIDATE_SECONDS = 60;

type CachedRequestInit = RequestInit & { next?: { revalidate?: number | false } };

export async function fetchFile({ url }: { url: string }): Promise<unknown> {
  // `next.revalidate` is read by Next.js's fetch; other runtimes ignore the unknown option.
  const init: CachedRequestInit = { next: { revalidate: DATA_REVALIDATE_SECONDS } };
  const response = await fetch(url, init);

  if (response.status === 404) {
    throw new NotFoundError(`File \`${url}\` not found`);
  }

  if (response.status === 500) {
    throw new InternalServerError(`Server error while fetching \`${url}\` file`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText} for \`${url}\` file`);
  }

  return await response.json();
}
