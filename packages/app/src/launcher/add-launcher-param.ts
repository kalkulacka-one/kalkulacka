export const LAUNCHER_PARAM = "from";

export function addLauncherParam(href: string, launcher: string | undefined): string {
  if (!launcher) return href;
  return `${href}${href.includes("?") ? "&" : "?"}${LAUNCHER_PARAM}=${encodeURIComponent(launcher)}`;
}
