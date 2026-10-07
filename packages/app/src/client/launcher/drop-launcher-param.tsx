import { useEffect } from "react";

import { LAUNCHER_PARAM } from "@/launcher";

export function dropLauncherParam() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has(LAUNCHER_PARAM)) return;
  url.searchParams.delete(LAUNCHER_PARAM);
  window.history.replaceState(window.history.state, "", url);
}

export function DropLauncherParam() {
  useEffect(dropLauncherParam, []);
  return null;
}
