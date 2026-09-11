import { EmbedAttribution } from "./embed-attribution";

const HEIGHT = "h-11";
const MARGIN_BOTTOM = "mb-11";

export type EmbedFooter = {
  attribution?: boolean;
};

export function EmbedFooter({ attribution = true }: EmbedFooter) {
  return (
    <div className="flex items-baseline gap-4">
      {attribution && <EmbedAttribution />}
      <a href="/soukromi" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-slate-600 hover:underline">
        Soukromí
      </a>
    </div>
  );
}

EmbedFooter.heightClassNames = HEIGHT;
EmbedFooter.marginBottomClassNames = MARGIN_BOTTOM;
