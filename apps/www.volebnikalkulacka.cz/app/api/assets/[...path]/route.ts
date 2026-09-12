// Ported from kalkulacka-2026/apps/web/app/api/assets/[...path]/route.ts
import { BadGatewayError, GatewayTimeoutError, HttpError, NotFoundError } from "@kalkulacka-one/app";

/**
 * A same-origin mirror of one asset on the data CDN.
 *
 * Exists only for the share-card export: `html-to-image` rasterises the card
 * by re-fetching every `<img>`'s pixels itself, and the CDN sends no
 * `Access-Control-Allow-Origin` (checked: none on the JSON, none on an image,
 * a preflight answers 403) — so that fetch is blocked even though the `<img>`
 * displays fine. Routing the same bytes through this origin sidesteps CORS
 * without asking the CDN for anything. Nothing else in the app should point
 * here: every other avatar keeps loading the CDN directly, which is strictly
 * less latency for a picture that was never going onto a canvas.
 */

const UPSTREAM_TIMEOUT_MS = 10_000;

/**
 * The proxy mirrors avatar images and nothing else. The CDN is a separately
 * operated service; re-serving whatever `Content-Type` it sends would let any
 * non-image it ever hosts (compromise, misconfiguration, a future upload
 * feature) render as a document on *this* origin — stored XSS, cached for a
 * day. Everything the platform serves today is png/jpg/webp; svg is
 * deliberately absent from the list because it is active content.
 */
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"]);

/** Avatars are tens of KB; this is generous headroom, not a target. */
const MAX_ASSET_BYTES = 5 * 1024 * 1024;

/**
 * Resolve `path` against the configured data endpoint, or refuse.
 *
 * The segments Next hands us are already URL-decoded, so an encoded slash or
 * an encoded `..` does not arrive as its own segment — it arrives as a literal
 * `/` or `.` *inside* one, which is exactly how `/api/assets/https%3A%2F%2Fevil.example`
 * tries to smuggle a whole foreign URL in as "one path segment". Rejecting any
 * segment that carries a slash, a backslash, or is bare `.`/`..` closes that.
 * Resolving what's left with `URL` against the endpoint and then checking the
 * resolved origin and pathname prefix closes the rest — including anything
 * `URL` itself would collapse upward, and an endpoint typo that resolves
 * outside itself.
 */
function resolveAssetUrl(endpoint: string, segments: string[]): URL | null {
  if (segments.length === 0) return null;

  for (const segment of segments) {
    if (!segment) return null;
    if (segment.includes("/") || segment.includes("\\")) return null;
    if (segment === "." || segment === "..") return null;
  }

  let base: URL;
  let target: URL;
  try {
    base = new URL(`${endpoint.replace(/\/$/, "")}/`);
    target = new URL(segments.join("/"), base);
  } catch {
    return null;
  }

  if (target.origin !== base.origin) return null;
  if (!target.pathname.startsWith(base.pathname)) return null;

  return target;
}

export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const endpoint = process.env.DATA_ENDPOINT;
    if (!endpoint) {
      return new NotFoundError("No data endpoint configured").toResponse();
    }

    const { path } = await params;
    const target = resolveAssetUrl(endpoint, path ?? []);
    if (!target) {
      return new NotFoundError("Not found").toResponse();
    }

    let upstream: Response;
    try {
      upstream = await fetch(target, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) });
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        return new GatewayTimeoutError().toResponse();
      }
      return new BadGatewayError().toResponse();
    }

    if (!upstream.ok || !upstream.body) {
      return new BadGatewayError(`Upstream returned ${upstream.status}`).toResponse();
    }

    const rawType = upstream.headers.get("content-type") ?? "";
    const contentType = (rawType.split(";")[0] ?? "").trim().toLowerCase();
    if (!ALLOWED_TYPES.has(contentType)) {
      return new BadGatewayError("Upstream served a non-image type").toResponse();
    }

    const declaredLength = Number(upstream.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_ASSET_BYTES) {
      return new BadGatewayError("Upstream asset too large").toResponse();
    }

    // Buffered rather than streamed: the size cap has to be enforceable after
    // a missing/lying Content-Length, and aborting a stream mid-200 would hand
    // the client (and the day-long cache) a truncated image instead of an
    // error. The fetch's timeout signal still covers this read.
    const chunks: Uint8Array[] = [];
    let received = 0;
    const reader = upstream.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.byteLength;
        if (received > MAX_ASSET_BYTES) {
          reader.cancel().catch(() => {});
          return new BadGatewayError("Upstream asset too large").toResponse();
        }
        chunks.push(value);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        return new GatewayTimeoutError().toResponse();
      }
      return new BadGatewayError().toResponse();
    }

    const body = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // The guarantee travels with the route rather than with the
        // deployment config: never sniffed into something else.
        "X-Content-Type-Options": "nosniff",
        // Versioned static assets — the CDN path changes when the image does.
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}
