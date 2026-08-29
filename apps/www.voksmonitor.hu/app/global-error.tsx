"use client";

import { ErrorReporter } from "../components/client/error-reporter";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="cs">
      <body>
        <ErrorReporter error={error} />
        {(() => {
          throw error;
        })()}
      </body>
    </html>
  );
}
