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

  // `new URL` resolves `..` and `//host`, so a key or group that is not a plain segment can climb out of the endpoint or leave
  // the host entirely. Callers validate their input, and this keeps a caller that forgets from reaching somewhere else.
  const base = `${baseUrl.toString().replace(/\/$/, "")}/`;
  if (!`${dataUrl}/`.startsWith(base)) {
    throw new Error("Invalid calculator path");
  }

  if (!resourcePath) return dataUrl.toString();

  return new URL(resourcePath, `${dataUrl}/`).toString();
}
