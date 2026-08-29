export function buildDataUrl({ key, group, resourcePath }: { key: string; group?: string; resourcePath?: string }): string {
  const endpoint = process.env.DATA_ENDPOINT;
  if (!endpoint) throw new Error("Missing `DATA_ENDPOINT` environment variable");

  let baseUrl: URL;
  try {
    baseUrl = new URL(endpoint.replace(/\/$/, ""));
  } catch {
    throw new Error("Invalid `DATA_ENDPOINT` environment variable");
  }

  const dataPath = group ? `${key}/${group}` : key;
  const basePath = baseUrl.pathname === "/" ? "" : baseUrl.pathname.slice(1);
  const fullPath = basePath ? `${basePath}/${dataPath}` : dataPath;
  const dataUrl = new URL(fullPath, baseUrl.origin);

  if (!resourcePath) return dataUrl.toString();

  return new URL(resourcePath, `${dataUrl}/`).toString();
}
