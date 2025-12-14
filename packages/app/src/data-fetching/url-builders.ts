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

  if (!resourcePath) return dataUrl.toString();

  return new URL(resourcePath, `${dataUrl}/`).toString();
}
