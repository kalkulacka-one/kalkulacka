import type { ReactNode } from "react";

import { useEmbed } from "@/client/embeds";

import { useLauncher } from "./launcher-provider";

export function Closable({ children }: { children: ReactNode }) {
  const embed = useEmbed();
  const launcher = useLauncher();
  if (embed.isEmbed && !launcher) return null;
  return <>{children}</>;
}
