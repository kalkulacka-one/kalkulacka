import { EmbedAttribution } from "./embed-attribution";

export type EmbedFooter = {
  attribution?: boolean;
};

export function EmbedFooter({ attribution = true }: EmbedFooter) {
  if (!attribution) {
    return null;
  }

  return <EmbedAttribution />;
}
