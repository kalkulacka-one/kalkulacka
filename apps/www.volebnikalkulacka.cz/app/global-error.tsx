"use client";

import { ErrorReporter } from "../components/client/error-reporter";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="cs">
      <body>
        <ErrorReporter error={error} />
      </body>
    </html>
  );
}
