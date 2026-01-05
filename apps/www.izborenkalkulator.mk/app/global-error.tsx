"use client";

import { ErrorReporter } from "@/components/client";
import { appConfig } from "@/config/app-config";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang={appConfig.i18n.defaultLocale}>
      <body>
        <ErrorReporter error={error} />
        {(() => {
          throw error;
        })()}
      </body>
    </html>
  );
}
