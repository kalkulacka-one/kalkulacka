import type { EmbedName } from "../../config/embeds";
import { useEmbed } from "./embed-context-provider";

type HideOnEmbedProps = {
  children: React.ReactNode;
  names?: EmbedName | EmbedName[];
};

export function HideOnEmbed({ children, names }: HideOnEmbedProps) {
  const { isEmbed, name } = useEmbed();

  if (!isEmbed) {
    return <>{children}</>;
  }

  if (!names) {
    return null;
  }

  const targetEmbeds = [names].flat();
  const shouldHide = name && targetEmbeds.includes(name);

  return shouldHide ? null : children;
}
