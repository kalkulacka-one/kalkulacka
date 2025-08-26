import { notFound } from "next/navigation";

import "../../../globals.css";
import { EmbedProvider } from "../../../../components/client";
import { type EmbedName, isEmbedName } from "../../../../config/embeds";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ embed: string }>;
}) {
  const { embed: embedParam } = await params;
  if (!isEmbedName(embedParam)) notFound();
  const embed: EmbedName = embedParam;

  return (
    <html lang="cs">
      <body>
        <EmbedProvider name={embed}>
          <div>
            <span className="text-[var(--ko-palette-primary)]">Embed: `{embed}`</span>
            <main>{children}</main>
          </div>
        </EmbedProvider>
      </body>
    </html>
  );
}
