import { InternalServerError, NotFoundError } from "@/errors";

export const DATA_REVALIDATE_SECONDS = 60;

export async function fetchFile({ url }: { url: string }): Promise<unknown> {
  const response = await fetch(url, { next: { revalidate: DATA_REVALIDATE_SECONDS } });

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
