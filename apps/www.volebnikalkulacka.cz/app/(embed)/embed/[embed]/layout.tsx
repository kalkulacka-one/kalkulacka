import { notFound } from "next/navigation";
import Script from "next/script";

import "../../../globals.css";

import { EmbedProvider } from "../../../../components/client";
import { type EmbedName, isEmbedName } from "../../../../config/embeds";

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ embed: string }> }) {
  const { embed: embedParam } = await params;
  if (!isEmbedName(embedParam)) notFound();
  const embed: EmbedName = embedParam;

  return (
    <html lang="cs">
      <head>
        <Script defer data-domain="volebnikalkulacka.cz" src="/js/script.tagged-events.outbound-links.js" />
      </head>
      <body>
        <EmbedProvider name={embed}>{children}</EmbedProvider>
      </body>
    </html>
  );
}
