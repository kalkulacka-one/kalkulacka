// Ported from kalkulacka-2026/apps/web/lib/share-asset-url.ts

const PROXY_PREFIX = "/api/assets/";

/**
 * Rewrite one of a calculator's own asset URLs to the same-origin proxy, for
 * the share-card export only (`app/api/assets/[...path]/route.ts`).
 *
 * `html-to-image` re-fetches every `<img>`'s pixels itself to paint the
 * canvas, and the data CDN sends no `Access-Control-Allow-Origin` — so that
 * fetch is blocked even though the `<img>` displays fine everywhere else.
 * `assetBase` is what tells "one of this calculator's own images" apart from
 * any other absolute URL a candidate's data could carry: only a URL that
 * actually starts with it is rewritten. Anything else — an archive fixture's
 * avatar, resolved against a different host entirely — is left as-is rather
 * than routed through a proxy that would just reject it.
 *
 * The proxy resolves its path against `DATA_ENDPOINT`, while `assetBase` is
 * the *calculator's* base — the store's `baseUrl`, which `loadCalculatorData`
 * builds as endpoint plus `{group}/{key}` (or just `{key}` for a standalone
 * calculator). Those segments must therefore be put back in front of the
 * remainder, or the proxied path points at the endpoint root.
 */
export function toProxiedAssetUrl(url: string | undefined, calculator: { assetBase: string; group?: string; key?: string }): string | undefined {
  const { assetBase, group, key } = calculator;
  // No key means no way to name the calculator under the endpoint: leave the picture where it is.
  if (!url || !assetBase || !key || !url.startsWith(assetBase)) return url;

  const rest = url.slice(assetBase.length).replace(/^\/+/, "");
  if (!rest) return url;

  return `${PROXY_PREFIX}${group ? `${group}/${key}` : key}/${rest}`;
}
