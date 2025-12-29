import type { EmbedName } from "@/config/embeds";

import { useEmbed } from "./embed-context-provider";

type HideOnEmbedProps = {
  children: React.ReactNode;
  names?: EmbedName | EmbedName[];
};

export function HideOnEmbed({ children, names }: HideOnEmbedProps) {
  const embed = useEmbed();

  if (!embed.isEmbed) {
    return <>{children}</>;
  }

  if (!names) {
    return null;
  }

  const targetEmbeds = [names].flat();
  const shouldHide = targetEmbeds.includes(embed.name);

  return shouldHide ? null : children;
}
