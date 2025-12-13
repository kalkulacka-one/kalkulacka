export function buildDataUrl({ dataEndpoint, key, group, resourcePath }: { dataEndpoint: string; key: string; group?: string; resourcePath?: string }): string {
  if (!dataEndpoint) throw new Error("Missing `dataEndpoint` parameter");

  let baseUrl: URL;
  try {
    baseUrl = new URL(dataEndpoint.replace(/\/$/, ""));
  } catch {
    throw new Error("Invalid `dataEndpoint` parameter");
  }

  const dataPath = group ? `${group}/${key}` : key;
  const basePath = baseUrl.pathname === "/" ? "" : baseUrl.pathname.slice(1);
  const fullPath = basePath ? `${basePath}/${dataPath}` : dataPath;
  const dataUrl = new URL(fullPath, baseUrl.origin);

  if (!resourcePath) return dataUrl.toString();

  return new URL(resourcePath, `${dataUrl}/`).toString();
}
