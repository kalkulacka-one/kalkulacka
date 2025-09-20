import { EmbedAttribution } from "./embed-attribution";

const HEIGHT = "h-9";
const MARGIN_BOTTOM = "mb-9";

export type EmbedFooter = {
  attribution?: boolean;
};

export function EmbedFooter({ attribution = true }: EmbedFooter) {
  if (!attribution) {
    return null;
  }

  return <EmbedAttribution />;
}

EmbedFooter.heightClassNames = HEIGHT;
EmbedFooter.marginBottomClassNames = MARGIN_BOTTOM;
