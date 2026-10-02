export function buildDataUrl({ endpoint, key, group, resourcePath }: { endpoint: string; key: string; group?: string; resourcePath?: string }): string {
  let baseUrl: URL;
  try {
    baseUrl = new URL(endpoint.replace(/\/$/, ""));
  } catch {
    throw new Error("Invalid endpoint");
  }

  const dataPath = group ? `${group}/${key}` : key;
  const basePath = baseUrl.pathname === "/" ? "" : baseUrl.pathname.slice(1);
  const fullPath = basePath ? `${basePath}/${dataPath}` : dataPath;
  const dataUrl = new URL(fullPath, baseUrl.origin);

  // `new URL` resolves `..` and `//host`, so a non-segment key or group could escape the endpoint – guard that the result stays under it.
  const endpointPrefix = `${baseUrl.toString().replace(/\/$/, "")}/`;
  if (!`${dataUrl}/`.startsWith(endpointPrefix)) {
    throw new Error("Invalid calculator path");
  }

  if (!resourcePath) return dataUrl.toString();

  return new URL(resourcePath, `${dataUrl}/`).toString();
}
