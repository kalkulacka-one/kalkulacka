import type { EmbedName } from "../../config/embeds";
import { useEmbed } from "./embed-context-provider";

type EmbedOnlyProps = {
  children: React.ReactNode;
  names?: EmbedName | EmbedName[];
};

export function EmbedOnly({ children, names }: EmbedOnlyProps) {
  const { isEmbed, name } = useEmbed();

  if (!isEmbed) {
    return null;
  }

  if (!names) {
    return <>{children}</>;
  }

  const targetEmbeds = [names].flat();
  const shouldShow = name && targetEmbeds.includes(name);

  return shouldShow ? children : null;
}
