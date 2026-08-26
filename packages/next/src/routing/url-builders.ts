export function buildCanonicalUrl(path: string): string {
  const NEXT_PUBLIC_CANONICAL_URL = process.env.NEXT_PUBLIC_CANONICAL_URL;
  if (!NEXT_PUBLIC_CANONICAL_URL) {
    throw new Error("Missing `NEXT_PUBLIC_CANONICAL_URL` environment variable");
  }
  const baseUrl = NEXT_PUBLIC_CANONICAL_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
