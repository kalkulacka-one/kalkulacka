import type { EmbedName } from "@/config/embeds";

import { useEmbed } from "./embed-context-provider";

type EmbedOnlyProps = {
  children: React.ReactNode;
  names?: EmbedName | EmbedName[];
};

export function EmbedOnly({ children, names }: EmbedOnlyProps) {
  const embed = useEmbed();

  if (!embed.isEmbed) {
    return null;
  }

  if (!names) {
    return <>{children}</>;
  }

  const targetEmbeds = [names].flat();
  const shouldShow = targetEmbeds.includes(embed.name);

  return shouldShow ? children : null;
}
