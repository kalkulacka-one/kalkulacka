import { InternalServerError, NotFoundError } from "@/errors";

export async function fetchFile({ url }: { url: string }): Promise<unknown> {
  const response = await fetch(url);

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
