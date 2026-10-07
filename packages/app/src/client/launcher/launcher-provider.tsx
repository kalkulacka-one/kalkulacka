import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

import { useEmbed } from "@/client/embeds";
import { LAUNCHER_PARAM } from "@/launcher";

import { dropLauncherParam } from "./drop-launcher-param";

const LauncherContext = createContext<string | undefined>(undefined);

export type LauncherProvider = {
  children: ReactNode;
  parse: (value: string, embed?: string) => string | undefined;
};

// Kept in memory only: a reload loses it on purpose.
export function LauncherProvider({ children, parse }: LauncherProvider) {
  const embed = useEmbed();
  const [launcher, setLauncher] = useState<string>();
  const embedName = embed.isEmbed ? embed.name : undefined;

  useEffect(() => {
    const value = new URL(window.location.href).searchParams.get(LAUNCHER_PARAM);
    if (value === null) return;
    setLauncher(parse(value, embedName));
    dropLauncherParam();
  }, [embedName, parse]);

  return <LauncherContext.Provider value={launcher}>{children}</LauncherContext.Provider>;
}

export function useLauncher(): string | undefined {
  return useContext(LauncherContext);
}
